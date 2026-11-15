"""Field scan -> web point cloud.

Reads the phone-scanner export of the collapse pit (ASCII PLY, x y z r g b,
y up, metres as exported) and writes

  public/data/pit.bin    uint16 xyz (quantised to the bounding box) then uint8 rgb
  src/data/pitScan.ts    count, bounds and the pit dimensions measured below

Usage:  python scripts/scan.py "Mağara-export.ply"

The dimensions are read straight from the cloud. The scale is the scanner's
own; it has not been checked against a tape measure yet.
"""

import json
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "data"
META = ROOT / "src" / "data" / "pitScan.ts"
VOXEL = 0.06  # m, one point kept per voxel
NOISE_VOXEL = 0.12  # m, voxels with fewer points than NOISE_MIN are dropped
NOISE_MIN = 6
CELL = 0.10  # m, plan-view grid used for the measurements


def read_ply(path: Path) -> np.ndarray:
    with open(path, "rb") as f:
        count = 0
        while True:
            line = f.readline().decode("latin1").strip()
            if line.startswith("element vertex"):
                count = int(line.split()[-1])
            if line == "end_header":
                break
        return np.loadtxt(f, max_rows=count, dtype=np.float32)


def voxel_keys(xyz: np.ndarray, size: float) -> np.ndarray:
    ijk = np.floor((xyz - xyz.min(0)) / size).astype(np.int64)
    return (ijk[:, 0] << 42) | (ijk[:, 1] << 21) | ijk[:, 2]


def measure(xyz: np.ndarray) -> dict:
    """Opening, depth and overhang from a plan-view height grid (y is up)."""
    x, y, z = xyz[:, 0], xyz[:, 1], xyz[:, 2]
    ix = np.floor((x - x.min()) / CELL).astype(int)
    iz = np.floor((z - z.min()) / CELL).astype(int)
    w, h = ix.max() + 1, iz.max() + 1
    top = np.full((w, h), -np.inf, np.float32)
    bottom = np.full((w, h), np.inf, np.float32)
    np.maximum.at(top, (ix, iz), y)
    np.minimum.at(bottom, (ix, iz), y)
    seen = np.isfinite(top)

    floor = float(np.percentile(y, 1.5))
    # The rim is the ground around the hole: the upper surface where it is
    # not hanging over the void.
    solid = seen & (top - bottom < 1.0)
    rim = float(np.median(top[solid & (top > floor + 3.0)]))

    # Open to the sky: looking straight down you see well below the rim.
    opening = seen & (top < rim - 1.5)
    # Roofed: ground at rim level with floor far beneath it.
    roofed = seen & (top > rim - 1.5) & (bottom < rim - 3.0)

    def extent(mask: np.ndarray) -> tuple[float, float]:
        pts = np.argwhere(mask).astype(np.float32) * CELL
        pts -= pts.mean(0)
        _, vecs = np.linalg.eigh(np.cov(pts.T))
        proj = pts @ vecs
        span = np.percentile(proj, 98, 0) - np.percentile(proj, 2, 0)
        return float(span.max()), float(span.min())

    # Where a person would stand: the middle of the floor seen from above.
    deep = np.argwhere(opening & (top < floor + 0.8)).mean(0) * CELL
    stand = [float(deep[0] + x.min()), floor, float(deep[1] + z.min())]

    long, short = extent(opening)
    area = float(opening.sum() * CELL * CELL)
    roof_area = float(roofed.sum() * CELL * CELL)
    depth = rim - floor
    return {
        "opening_long_m": round(long, 1),
        "opening_short_m": round(short, 1),
        "opening_area_m2": round(area, 1),
        "equivalent_diameter_m": round(2 * (area / np.pi) ** 0.5, 1),
        "depth_m": round(depth, 1),
        "roofed_area_m2": round(roof_area, 1),
        "roofed_fraction": round(roof_area / (roof_area + area), 2),
        "rim_y": round(rim, 2),
        "floor_y": round(floor, 2),
        "floor_centre": [round(v, 2) for v in stand],
    }


def main() -> None:
    src = Path(sys.argv[1])
    cloud = read_ply(src)
    xyz, rgb = cloud[:, :3], cloud[:, 3:6]
    raw = len(xyz)

    # Drop the scanner's stray points: sparse voxels far from any surface.
    keys = voxel_keys(xyz, NOISE_VOXEL)
    _, inverse, counts = np.unique(keys, return_inverse=True, return_counts=True)
    keep = counts[inverse] >= NOISE_MIN
    xyz, rgb = xyz[keep], rgb[keep]

    dims = measure(xyz)

    # One averaged point per voxel.
    keys = voxel_keys(xyz, VOXEL)
    _, inverse, counts = np.unique(keys, return_inverse=True, return_counts=True)
    n = len(counts)
    pos = np.zeros((n, 3), np.float64)
    col = np.zeros((n, 3), np.float64)
    np.add.at(pos, inverse, xyz)
    np.add.at(col, inverse, rgb)
    pos /= counts[:, None]
    col /= counts[:, None]

    lo, hi = pos.min(0), pos.max(0)
    q = np.round((pos - lo) / (hi - lo) * 65535).astype("<u2")
    c = np.clip(np.round(col), 0, 255).astype(np.uint8)

    OUT.mkdir(parents=True, exist_ok=True)
    with open(OUT / "pit.bin", "wb") as f:
        f.write(q.tobytes())
        f.write(c.tobytes())
    meta = {
        "count": n,
        "raw_points": raw,
        "min": [round(float(v), 3) for v in lo],
        "max": [round(float(v), 3) for v in hi],
        "source": "Phone scan, Ovabağ lava field, 14 Nov 2026",
        "scale_checked": False,
        **dims,
    }
    body = json.dumps(meta, indent=2, ensure_ascii=False)
    META.write_text(
        "// Generated by scripts/scan.py from the field scan. Do not edit.\n"
        f"export const PIT_SCAN = {body} as const\n",
        encoding="utf-8",
    )
    print(body)
    print(f"pit.bin {(OUT / 'pit.bin').stat().st_size / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
