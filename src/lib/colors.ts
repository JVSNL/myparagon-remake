import type { ColorKey } from '../data/types'

export type { ColorKey }

// Full class names (not built from strings) so Tailwind picks them up.
export const COLOR_CLASSES: Record<ColorKey, { solid: string; soft: string; text: string; border: string }> = {
  navy: { solid: 'bg-c-navy', soft: 'bg-c-navy-soft', text: 'text-c-navy-text', border: 'border-c-navy' },
  royal: { solid: 'bg-c-royal', soft: 'bg-c-royal-soft', text: 'text-c-royal-text', border: 'border-c-royal' },
  sky: { solid: 'bg-c-sky', soft: 'bg-c-sky-soft', text: 'text-c-sky-text', border: 'border-c-sky' },
  orange: { solid: 'bg-c-orange', soft: 'bg-c-orange-soft', text: 'text-c-orange-text', border: 'border-c-orange' },
  sienna: { solid: 'bg-c-sienna', soft: 'bg-c-sienna-soft', text: 'text-c-sienna-text', border: 'border-c-sienna' },
  sage: { solid: 'bg-c-sage', soft: 'bg-c-sage-soft', text: 'text-c-sage-text', border: 'border-c-sage' },
  berry: { solid: 'bg-c-berry', soft: 'bg-c-berry-soft', text: 'text-c-berry-text', border: 'border-c-berry' },
}

const CYCLE: ColorKey[] = ['royal', 'orange', 'sage', 'berry', 'sky', 'sienna', 'navy']

/** A stable colour for the n-th item in a list, so neighbours differ. */
export const colorAt = (index: number): ColorKey => CYCLE[index % CYCLE.length]

/** A stable colour for any id (e.g. a channel or department). */
export const colorFor = (id: string): ColorKey => {
  let hash = 0
  for (const ch of id) hash = (hash * 31 + ch.charCodeAt(0)) | 0
  return CYCLE[Math.abs(hash) % CYCLE.length]
}
