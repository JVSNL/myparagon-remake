import type { CountryCode, RegionId, Tone } from './types'
import { userId } from './seed/users'

export interface RegionInfo {
  id: RegionId
  name: string
  countries: CountryCode[]
  tone: Tone
  /** Leadership team shown on the region page. */
  team: string[]
}

export const REGIONS: RegionInfo[] = [
  { id: 'benelux', name: 'Benelux', countries: ['NL', 'BE'], tone: 'navy', team: [userId(1), userId(3), userId(6), userId(5), userId(44)] },
  { id: 'dach', name: 'DACH', countries: ['DE'], tone: 'sky', team: [userId(1), userId(2), userId(7), userId(18), userId(25)] },
  { id: 'cee', name: 'CEE', countries: ['PL', 'CZ'], tone: 'sage', team: [userId(1), userId(4), userId(36), userId(52)] },
]

export const regionOfCountry = (country: CountryCode): RegionId =>
  REGIONS.find((r) => r.countries.includes(country))?.id ?? 'benelux'

export const regionById = (id: RegionId) => REGIONS.find((r) => r.id === id) ?? REGIONS[0]
