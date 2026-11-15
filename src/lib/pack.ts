// Reads the packed data written by scripts/pack.py: gzip around byte-split
// deltas. Rasters come back as float32 grids, the scan as raw delta bytes.

async function gunzip(buffer: ArrayBuffer) {
  const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))
  return new Response(stream).arrayBuffer()
}

/** Fetches a packed file. Works whether or not the server already inflated it. */
export async function fetchPacked(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}`)
  const buffer = await res.arrayBuffer()
  const head = new Uint8Array(buffer, 0, 2)
  return head[0] === 0x1f && head[1] === 0x8b ? gunzip(buffer) : buffer
}

/** A square grid of uint16 row deltas, back to values in [lo, hi]. */
export function unpackRaster(buffer: ArrayBuffer, size: number, [lo, hi]: [number, number]) {
  const cells = size * size
  if (buffer.byteLength !== cells * 2) throw new Error('Unexpected raster size')
  const bytes = new Uint8Array(buffer)
  const out = new Float32Array(cells)
  const step = (hi - lo) / 65535
  for (let y = 0; y < size; y++) {
    let value = 0
    for (let x = 0; x < size; x++) {
      const i = y * size + x
      value = (value + bytes[i] + (bytes[cells + i] << 8)) & 0xffff
      out[i] = lo + value * step
    }
  }
  return out
}

/** Levels per axis used for the scan's positions. */
export const CLOUD_LEVELS = 4095

/**
 * The scan: `count` points, positions as 0..CLOUD_LEVELS per axis and colours
 * as sRGB bytes, both interleaved xyz / rgb.
 */
export function unpackCloud(buffer: ArrayBuffer, count: number) {
  if (buffer.byteLength !== count * 9) throw new Error('Unexpected scan size')
  const bytes = new Uint8Array(buffer)
  const positions = new Uint16Array(count * 3)
  const colours = new Uint8Array(count * 3)
  for (let axis = 0; axis < 3; axis++) {
    const low = axis * count
    const high = count * 3 + low
    const tone = count * 6 + low
    let p = 0
    let c = 0
    for (let i = 0; i < count; i++) {
      p = (p + bytes[low + i] + (bytes[high + i] << 8)) & 0xffff
      c = (c + bytes[tone + i]) & 0xff
      positions[i * 3 + axis] = p
      colours[i * 3 + axis] = c
    }
  }
  return { positions, colours }
}
