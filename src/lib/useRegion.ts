import { regionById, regionOfCountry } from '../data/regions'
import { useStore } from '../store/StoreProvider'

/** The region shown on the Region tab: the user's choice, or the region of their country. */
export function useRegion() {
  const { state, me } = useStore()
  const id = (me && state.regionChoice[me.id]) ?? (me ? regionOfCountry(me.country) : 'benelux')
  return regionById(id)
}
