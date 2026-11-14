import { SITE_LAT } from './dem'

const RAD = Math.PI / 180

/** Day of year for the field day (14 Nov). */
export const FIELD_DOY = 318

export interface Sun {
  /** degrees clockwise from north */
  azimuth: number
  /** degrees above the horizon */
  elevation: number
  /** unit vector components: east, north, up */
  e: number
  n: number
  up: number
}

/** Solar geometry for local solar time `hour` at the site latitude. */
export function solarPosition(hour: number, lat = SITE_LAT, doy = FIELD_DOY): Sun {
  const decl = -23.44 * RAD * Math.cos(((2 * Math.PI) / 365) * (doy + 10))
  const phi = lat * RAD
  const H = 15 * RAD * (hour - 12)
  const sinEl =
    Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(H)
  const el = Math.asin(sinEl)
  const az = Math.atan2(
    -Math.cos(decl) * Math.sin(H),
    Math.sin(decl) * Math.cos(phi) - Math.cos(decl) * Math.sin(phi) * Math.cos(H),
  )
  const cosEl = Math.cos(el)
  return {
    azimuth: ((az / RAD) + 360) % 360,
    elevation: el / RAD,
    e: Math.sin(az) * cosEl,
    n: Math.cos(az) * cosEl,
    up: sinEl,
  }
}

export function formatHour(hour: number) {
  const h = Math.floor(hour)
  const m = Math.round((hour - h) * 60)
  const hh = m === 60 ? h + 1 : h
  const mm = m === 60 ? 0 : m
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}
