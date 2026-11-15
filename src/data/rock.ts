// Rock chemistry match, from published analyses (not measured by us).
//
// Ten major oxides (SiO2, TiO2, Al2O3, FeO, MnO, MgO, CaO, Na2O, K2O, P2O5),
// normalised to 100%, compared one by one as min/max and averaged, so every
// oxide counts equally. 100 would be identical rock.
//
//   Earth  Ovabağ lava, sample CA 134 (Agostini et al. 2022, Ital. J. Geosci.)
//   Mars   four RAT-ground Adirondack-class basalts, Spirit APXS (NASA PDS)
//   Moon   Apollo 11 basalt 10017 and Apollo 16 highland soil 64501
//          (NASA Lunar Sample Compendium)
//
// Where it does not hold: the Mars rocks are from Gusev crater, not Arsia Mons,
// which no rover has reached; 10017 is from the Apollo 11 site, about 380 km
// from the Tranquillitatis pit; 64501 stands in for the polar highlands.

import type { TargetId } from './targets'

export const ROCK_MATCH: Record<TargetId, { score: number; low: number; high: number }> = {
  arsia: { score: 65, low: 55, high: 65 },
  tranq: { score: 54, low: 47, high: 55 },
  shackleton: { score: 39, low: 38, high: 43 },
}

/** Mars basalt against lunar mare basalt, same method: the yardstick. */
export const ROCK_CONTROL = 56
