"""Packs the app's binary data so it is small enough to ship.

Rasters (.r16): float32 grid -> uint16 over its own range -> row deltas ->
low bytes then high bytes -> gzip. The range is kept in the manifest as
`scale`. A 62 km elevation square loses less than 8 cm of height.

Point cloud (.p16): points sorted along a Morton curve, positions at 12 bits
per axis (about 5 mm on the pit), colours at 8 bits, each channel stored as
deltas, low bytes then high bytes, then gzip.

The browser undoes both in src/lib/pack.ts.

    python scripts/pack.py data                      repack public/data/*.bin
    python scripts/pack.py ply <ascii.ply> <out.ply> ASCII scan -> binary PLY
"""

import gzip
import json
import sys
from pathlib import Path

import numpy as np

DATA = Path(__file__).resolve().parent.parent / "public" / "data"
CLOUD_LEVELS = 4095


def _split(deltas: np.ndarray) -> bytes:
    raw = np.frombuffer(np.ascontiguousarray(deltas, dtype="<u2").tobytes(), np.uint8)
    return raw[0::2].tobytes() + raw[1::2].tobytes()


def pack_raster(arr: np.ndarray) -> tuple[bytes, list[float]]:
    a = np.asarray(arr, dtype=np.float64)
    if not np.isfinite(a).all():
        raise ValueError("raster has gaps; fill them before packing")
    lo, hi = float(a.min()), float(a.max())
    span = (hi - lo) or 1.0
    q = np.round((a - lo) / span * 65535).astype(np.int64)
    q[:, 1:] -= q[:, :-1].copy()
    return gzip.compress(_split(q & 0xFFFF), 9, mtime=0), [lo, lo + span]


def _spread(v: np.ndarray) -> np.ndarray:
    x = v.astype(np.uint64) & np.uint64(0x1FFFFF)
    for shift, mask in (
        (32, 0x1F00000000FFFF),
        (16, 0x1F0000FF0000FF),
        (8, 0x100F00F00F00F00F),
        (4, 0x10C30C30C30C30C3),
        (2, 0x1249249249249249),
    ):
        x = (x | (x << np.uint64(shift))) & np.uint64(mask)
    return x


def pack_cloud(pos: np.ndarray, rgb: np.ndarray) -> tuple[bytes, np.ndarray, np.ndarray]:
    """pos: (n, 3) metres, rgb: (n, 3) 0..255. Returns the bytes and the bounds."""
    lo, hi = pos.min(0), pos.max(0)
    q = np.round((pos - lo) / (hi - lo) * CLOUD_LEVELS).astype(np.int64)
    c = np.clip(np.round(rgb), 0, 255).astype(np.int64)
    order = np.argsort(_spread(q[:, 0]) | (_spread(q[:, 1]) << np.uint64(1)) | (_spread(q[:, 2]) << np.uint64(2)), kind="stable")
    q, c = q[order], c[order]
    q[1:] -= q[:-1].copy()
    c[1:] -= c[:-1].copy()
    body = _split((q & 0xFFFF).T) + (c & 0xFF).astype(np.uint8).T.tobytes()
    return gzip.compress(body, 9, mtime=0), lo, hi


def repack_data() -> None:
    path = DATA / "manifest.json"
    manifest = json.loads(path.read_text(encoding="utf-8"))
    size = manifest["size"]
    before = after = 0
    for name, meta in manifest["rasters"].items():
        src = DATA / meta["file"]
        if src.suffix != ".bin":
            continue
        grid = np.fromfile(src, dtype="<f4").reshape(size, size)
        packed, scale = pack_raster(grid)
        (DATA / f"{name}.r16").write_bytes(packed)
        meta["file"], meta["scale"] = f"{name}.r16", scale
        before += src.stat().st_size
        after += len(packed)
        src.unlink()
    path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"rasters {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")

    old = DATA / "pit.bin"
    if old.exists():
        raw = old.read_bytes()
        n = len(raw) // 9
        q = np.frombuffer(raw[: n * 6], "<u2").reshape(n, 3).astype(np.float64)
        rgb = np.frombuffer(raw[n * 6 :], np.uint8).reshape(n, 3)
        packed, _, _ = pack_cloud(q, rgb)  # bounds stay those in pitScan.ts
        (DATA / "pit.p16").write_bytes(packed)
        print(f"pit {len(raw) / 1e6:.1f} MB -> {len(packed) / 1e6:.1f} MB")
        old.unlink()


def ascii_to_binary_ply(src: Path, dst: Path) -> None:
    with open(src, "rb") as f:
        count = 0
        while True:
            line = f.readline().decode("latin1").strip()
            if line.startswith("element vertex"):
                count = int(line.split()[-1])
            if line == "end_header":
                break
        cloud = np.loadtxt(f, max_rows=count, dtype=np.float32)
    vertex = np.empty(count, dtype=[("x", "<f4"), ("y", "<f4"), ("z", "<f4"), ("r", "u1"), ("g", "u1"), ("b", "u1")])
    vertex["x"], vertex["y"], vertex["z"] = cloud[:, 0], cloud[:, 1], cloud[:, 2]
    vertex["r"], vertex["g"], vertex["b"] = cloud[:, 3], cloud[:, 4], cloud[:, 5]
    header = (
        "ply\nformat binary_little_endian 1.0\n"
        f"element vertex {count}\n"
        "property float x\nproperty float y\nproperty float z\n"
        "property uchar red\nproperty uchar green\nproperty uchar blue\n"
        "end_header\n"
    )
    dst.parent.mkdir(parents=True, exist_ok=True)
    with open(dst, "wb") as f:
        f.write(header.encode("ascii"))
        f.write(vertex.tobytes())
    print(f"{src.stat().st_size / 1e6:.0f} MB -> {dst.stat().st_size / 1e6:.0f} MB, {count} points")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1] == "data":
        repack_data()
    elif len(sys.argv) == 4 and sys.argv[1] == "ply":
        ascii_to_binary_ply(Path(sys.argv[2]), Path(sys.argv[3]))
    else:
        sys.exit(__doc__)
