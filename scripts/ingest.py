"""Fetch the real data behind BlackMountain and write it to public/data.

    pip install -r scripts/requirements.txt
    python scripts/ingest.py            # everything
    python scripts/ingest.py lst s1     # only some steps

Every raster is written as raw little-endian float32, N x N, row 0 = north,
covering the same 62 km square as the Karacadag scene (or an equal-sized
square on the Moon / Mars). manifest.json records sources and statistics.

Sources (all open, no account needed):
  - VIIRS S-NPP monthly land surface temperature, via NASA GIBS (the service
    behind NASA Worldview).
  - Sentinel-1 C-band seasonal backscatter (ESA Copernicus data, processed by
    Earth Big Data / NASA JPL, hosted on AWS Open Data).
  - LRO LOLA lunar elevation: USGS global 118 m mosaic and the NASA PGDA
    20 m south-pole model.
  - Mars HRSC + MOLA blended elevation, 200 m (USGS Astrogeology).
"""

import io
import json
import math
import os
import re
import sys
import urllib.request

import numpy as np
import rasterio
from PIL import Image
from rasterio.enums import Resampling
from rasterio.windows import from_bounds

OUT = os.path.join(os.path.dirname(__file__), "..", "public", "data")
N = 512

# ── Earth scene grid: must match src/lib/dem.ts ──────────────────────────────
Z, X0, Y0, TILES = 11, 1249, 790, 4
n = 2**Z
WEST = X0 / n * 360 - 180
EAST = (X0 + TILES) / n * 360 - 180


def tile_lat(y):
    return math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))


LON = WEST + (np.arange(N) + 0.5) / N * (EAST - WEST)
LAT = np.array([tile_lat(Y0 + (j + 0.5) / N * TILES) for j in range(N)])
EXTENT_KM = 40075.017 * math.cos(math.radians(37.67)) / n * TILES
HALF_M = EXTENT_KM * 500

FIELD = (40.0, 37.69)  # approximate centre of the young Ovabag flows
SUMMIT = (39.828, 37.712)

UA = {"User-Agent": "blackmountain-ingest"}


def fetch(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=120).read()


def load_manifest():
    path = os.path.join(OUT, "manifest.json")
    if os.path.exists(path):
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    return {"size": N, "extent_km": round(EXTENT_KM, 3), "rasters": {}}


def save(manifest, name, arr, **meta):
    arr = np.asarray(arr, dtype="<f4")
    assert arr.shape == (N, N), arr.shape
    arr.tofile(os.path.join(OUT, f"{name}.bin"))
    valid = arr[np.isfinite(arr)]
    manifest["rasters"][name] = {
        "file": f"{name}.bin",
        "min": round(float(valid.min()), 3),
        "max": round(float(valid.max()), 3),
        "mean": round(float(valid.mean()), 3),
        "valid": round(float(valid.size / arr.size), 4),
        **meta,
    }
    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
    print(f"  {name}: min {valid.min():.2f} max {valid.max():.2f} mean {valid.mean():.2f} valid {valid.size / arr.size:.1%}")


def fill_nan(a):
    """Replace gaps with the mean of valid neighbours, growing outward."""
    a = a.copy()
    for _ in range(200):
        mask = ~np.isfinite(a)
        if not mask.any():
            break
        p = np.pad(a, 1, constant_values=np.nan)
        stack = np.stack([p[:-2, 1:-1], p[2:, 1:-1], p[1:-1, :-2], p[1:-1, 2:]])
        with np.errstate(invalid="ignore"):
            cnt = np.isfinite(stack).sum(0)
            mean = np.nansum(stack, 0) / np.maximum(cnt, 1)
        a[mask & (cnt > 0)] = mean[mask & (cnt > 0)]
    return a


def bilinear(src, fx, fy):
    """Sample 2-D src at fractional pixel-centre coordinates."""
    x0 = np.clip(np.floor(fx).astype(int), 0, src.shape[1] - 2)
    y0 = np.clip(np.floor(fy).astype(int), 0, src.shape[0] - 2)
    tx = np.clip(fx - x0, 0, 1)
    ty = np.clip(fy - y0, 0, 1)
    return (
        src[y0, x0] * (1 - tx) * (1 - ty)
        + src[y0, x0 + 1] * tx * (1 - ty)
        + src[y0 + 1, x0] * (1 - tx) * ty
        + src[y0 + 1, x0 + 1] * tx * ty
    )


# ── Land surface temperature (NASA GIBS) ─────────────────────────────────────

GIBS = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best"
LST_LAYER = "VIIRS_SNPP_L3_Land_Surface_Temp_Monthly_{}"
TILE_DEG = 288 / 2**6  # level 6 of the "1km" matrix set
T_COL = int((WEST + 180) // TILE_DEG)
T_ROW = int((90 - LAT[0]) // TILE_DEG)


def lst_colormap():
    caps = fetch(f"{GIBS}/1.0.0/WMTSCapabilities.xml").decode("utf-8")
    name = LST_LAYER.format("Day")
    i = caps.find(f"<ows:Identifier>{name}</ows:Identifier>")
    block = caps[caps.rfind("<Layer>", 0, i) : caps.find("</Layer>", i)]
    urls = re.findall(r"""href=['"]([^'"]*colormaps[^'"]*\.xml)['"]""", block)
    # the same table is published in several schema versions; 1.3 is the one parsed here
    url = next((u for u in urls if "/v1.3/" in u), re.sub(r"/v1\.\d/", "/v1.3/", urls[0]))
    xml = fetch(url).decode("utf-8")
    table = {}
    for rgb, transparent, value in re.findall(
        r'<ColorMapEntry rgb="([\d,]+)" transparent="(\w+)"[^>]*? value="([^"]+)"', xml
    ):
        if transparent == "true":
            continue
        nums = [float(v) for v in re.findall(r"-?\d+\.?\d*", value)]
        if nums:
            table[tuple(int(c) for c in rgb.split(","))] = sum(nums) / len(nums)
    units = re.search(r'units="([^"]+)"', xml)
    print(f"  colormap {url.split('/')[-1]}: {len(table)} entries, units {units.group(1) if units else '?'}")
    assert table, "colormap could not be parsed" 
    return table


def lst_tile(kind, month, table):
    url = f"{GIBS}/{LST_LAYER.format(kind)}/default/{month}/1km/6/{T_ROW}/{T_COL}.png"
    img = np.asarray(Image.open(io.BytesIO(fetch(url))).convert("RGBA"))
    out = np.full(img.shape[:2], np.nan, dtype=np.float32)
    keys = (img[..., 0].astype(np.int32) << 16) | (img[..., 1].astype(np.int32) << 8) | img[..., 2]
    for (r, g, b), value in table.items():
        out[(keys == ((r << 16) | (g << 8) | b)) & (img[..., 3] > 0)] = value
    return out


def to_scene(tile):
    """Resample a GIBS level-6 tile onto the scene grid."""
    lon0 = -180 + T_COL * TILE_DEG
    lat0 = 90 - T_ROW * TILE_DEG
    px = TILE_DEG / tile.shape[0]
    fx = (LON - lon0) / px - 0.5
    fy = (lat0 - LAT) / px - 0.5
    gx, gy = np.meshgrid(fx, fy)
    return bilinear(fill_nan(tile), gx, gy)


def step_lst(manifest):
    print("LST: VIIRS S-NPP monthly, NASA GIBS")
    table = lst_colormap()
    months = [f"{y}-{m:02d}-01" for y, m in [(2025, 11), (2025, 12)] + [(2026, m) for m in range(1, 11)]]
    lon0 = -180 + T_COL * TILE_DEG
    lat0 = 90 - T_ROW * TILE_DEG
    px = TILE_DEG / 512

    def at(tile, lonlat):
        c = int((lonlat[0] - lon0) / px)
        r = int((lat0 - lonlat[1]) / px)
        box = tile[r - 1 : r + 2, c - 1 : c + 2]
        return None if not np.isfinite(box).any() else round(float(np.nanmean(box)) - 273.15, 2)

    series = []
    tiles = {}
    for month in months:
        row = {"month": month[:7]}
        for kind in ("Day", "Night"):
            tile = lst_tile(kind, month, table)
            tiles[(month, kind)] = tile
            row[f"field_{kind.lower()}"] = at(tile, FIELD)
            row[f"summit_{kind.lower()}"] = at(tile, SUMMIT)
        series.append(row)
        print("  ", row)

    month = months[-1]
    day = to_scene(tiles[(month, "Day")]) - 273.15
    night = to_scene(tiles[(month, "Night")]) - 273.15
    src = "VIIRS S-NPP monthly LST (VNP21), NASA GIBS"
    save(manifest, "lst_day", day, unit="°C", source=src, date=month[:7], resolution_m=1000)
    save(manifest, "lst_night", night, unit="°C", source=src, date=month[:7], resolution_m=1000)
    save(manifest, "lst_swing", day - night, unit="K", source=src, date=month[:7], resolution_m=1000)

    def mean(key):
        vals = [r[key] for r in series if r[key] is not None]
        return round(sum(vals) / len(vals), 2) if vals else None

    manifest["lst_series"] = series
    manifest["lst_annual"] = {
        k: mean(k) for k in ("field_day", "field_night", "summit_day", "summit_night")
    }


# ── Sentinel-1 backscatter ───────────────────────────────────────────────────

S1 = "https://sentinel-1-global-coherence-earthbigdata.s3.us-west-2.amazonaws.com/data/tiles/{t}/{t}_fall_vv_AMP.tif"


def step_s1(manifest):
    print("Sentinel-1: seasonal (Sep-Nov) VV backscatter")
    out = np.full((N, N), np.nan, dtype=np.float32)
    gx, gy = np.meshgrid(LON, LAT)
    for tile in ("N38E039", "N38E040"):
        with rasterio.open(io.BytesIO(fetch(S1.format(t=tile)))) as ds:
            amp = ds.read(1).astype(np.float32)
            print(f"  {tile}: {ds.width}x{ds.height} {ds.dtypes[0]} bounds {tuple(round(b, 3) for b in ds.bounds)}")
            amp[amp <= 0] = np.nan
            db = 20 * np.log10(amp) - 83  # documented DN -> gamma0 dB conversion
            inv = ~ds.transform
            fx, fy = inv * (gx, gy)
            inside = (fx >= 0) & (fx < ds.width) & (fy >= 0) & (fy < ds.height)
            out[inside] = bilinear(fill_nan(db), fx[inside] - 0.5, fy[inside] - 0.5)
    save(
        manifest,
        "s1_vv",
        fill_nan(out),
        unit="dB",
        source="Sentinel-1 C-band VV gamma0, Sep-Nov median (Copernicus / Earth Big Data, AWS Open Data)",
        resolution_m=90,
    )


# ── Twin terrains ────────────────────────────────────────────────────────────

MOON_R = 1737400.0
MARS_R = 3396190.0
S3 = "https://asc-pds-services.s3.us-west-2.amazonaws.com/mosaic"
ENV = dict(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR", CPL_VSIL_CURL_ALLOWED_EXTENSIONS=".tif,.TIF", GTIFF_DIRECT_IO="YES", GDAL_HTTP_MAX_RETRY="4", GDAL_HTTP_RETRY_DELAY="2")


def read_square(url, cx, cy, half_x, half_y):
    with rasterio.Env(**ENV), rasterio.open(url) as ds:
        print(f"  {url.split('/')[-1]}: {ds.width}x{ds.height} {ds.dtypes[0]} blocks {ds.block_shapes[0]} scale {ds.scales[0]} nodata {ds.nodata}")
        print(f"    crs {ds.crs.to_proj4() if ds.crs else None}")
        win = from_bounds(cx - half_x, cy - half_y, cx + half_x, cy + half_y, ds.transform)
        arr = ds.read(1, window=win, out_shape=(N, N), resampling=Resampling.average).astype(np.float32)
        if ds.nodata is not None:
            arr[arr == ds.nodata] = np.nan
        native = abs(ds.transform.a)
        return arr * ds.scales[0] + ds.offsets[0], native


def equirect(url, radius, lon, lat, degrees=False):
    """Read a 62 km square from a global DEM centred on lon 0.

    The grid is either in metres (equidistant cylindrical) or plain degrees.
    """
    lon = (lon + 180) % 360 - 180
    half_y = HALF_M / radius
    half_x = half_y / math.cos(math.radians(lat))
    if degrees:
        arr, native = read_square(url, lon, lat, math.degrees(half_x), math.degrees(half_y))
        return arr, native * math.radians(1) * radius
    return read_square(url, radius * math.radians(lon), radius * math.radians(lat), half_x * radius, half_y * radius)


def step_twins(manifest):
    print("Twin terrains")
    # Arsia Mons north flank, in the area of the candidate cave skylights
    # reported by Cushing et al. (2007).
    arr, native = equirect(f"{S3}/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif", MARS_R, 240.0, -6.3, degrees=True)
    save(manifest, "arsia", fill_nan(arr), unit="m", body="Mars", lat=-6.3, lon=240.0, resolution_m=round(native),
         source="MGS MOLA + Mars Express HRSC blended DEM v2 (USGS Astrogeology)")

    # Mare Tranquillitatis pit.
    arr, native = equirect(f"{S3}/Lunar_LRO_LOLA_Global_LDEM_118m_Mar2014.tif", MOON_R, 33.222, 8.335)
    save(manifest, "tranq", fill_nan(arr), unit="m", body="Moon", lat=8.335, lon=33.222, resolution_m=round(native),
         source="LRO LOLA global DEM 118 m (USGS Astrogeology)")

    # Shackleton - de Gerlache connecting ridge, south polar stereographic.
    lat, lon = -89.45, 222.69
    r = 2 * MOON_R * math.tan(math.radians(90 + lat) / 2)
    cx = r * math.sin(math.radians(lon))
    cy = r * math.cos(math.radians(lon))
    arr, native = read_square("https://pgda.gsfc.nasa.gov/data/LOLA_20mpp/LDEM_80S_20MPP_ADJ.TIF", cx, cy, HALF_M, HALF_M)
    if np.nanmax(np.abs(arr)) < 50:  # stored in km
        arr = arr * 1000
    save(manifest, "shackleton", fill_nan(arr), unit="m", body="Moon", lat=lat, lon=lon, resolution_m=round(native),
         source="LRO LOLA south pole DEM 20 m (NASA PGDA, Barker et al. 2021)")


STEPS = {"lst": step_lst, "s1": step_s1, "twins": step_twins}

if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    manifest = load_manifest()
    for name in sys.argv[1:] or STEPS:
        STEPS[name](manifest)
        with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as f:
            json.dump(manifest, f, indent=2)
    print("done")
