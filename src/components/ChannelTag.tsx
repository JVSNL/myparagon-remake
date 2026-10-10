import { COLOR_CLASSES } from '../lib/colors'
import { channelColor, channelName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

/** Coloured label of a news channel; every channel has its own brand colour. */
export function ChannelTag({ channelId, className = '' }: { channelId: string; className?: string }) {
  const { state } = useStore()
  const c = COLOR_CLASSES[channelColor(state, channelId)]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.soft} ${c.text} ${className}`}>
      <span className={`size-1.5 rounded-full ${c.solid}`} aria-hidden="true" />
      {channelName(state, channelId)}
    </span>
  )
}
