import type { ColorKey } from '../data/types'

export type { ColorKey }

// Full class names (not built from strings) so Tailwind picks them up.
// deep: background for white text; bright: icons on a deep background;
// brandVar: sets --brand-bg for the .on-brand token scope (see index.css).
export const COLOR_CLASSES: Record<
  ColorKey,
  { solid: string; soft: string; text: string; border: string; deep: string; bright: string; brandVar: string }
> = {
  navy: {
    solid: 'bg-c-navy',
    soft: 'bg-c-navy-soft',
    text: 'text-c-navy-text',
    border: 'border-c-navy',
    deep: 'bg-c-navy-deep',
    bright: 'text-c-navy-bright',
    brandVar: '[--brand-bg:var(--c-navy-deep)]',
  },
  royal: {
    solid: 'bg-c-royal',
    soft: 'bg-c-royal-soft',
    text: 'text-c-royal-text',
    border: 'border-c-royal',
    deep: 'bg-c-royal-deep',
    bright: 'text-c-royal-bright',
    brandVar: '[--brand-bg:var(--c-royal-deep)]',
  },
  sky: {
    solid: 'bg-c-sky',
    soft: 'bg-c-sky-soft',
    text: 'text-c-sky-text',
    border: 'border-c-sky',
    deep: 'bg-c-sky-deep',
    bright: 'text-c-sky-bright',
    brandVar: '[--brand-bg:var(--c-sky-deep)]',
  },
  orange: {
    solid: 'bg-c-orange',
    soft: 'bg-c-orange-soft',
    text: 'text-c-orange-text',
    border: 'border-c-orange',
    deep: 'bg-c-orange-deep',
    bright: 'text-c-orange-bright',
    brandVar: '[--brand-bg:var(--c-orange-deep)]',
  },
  sienna: {
    solid: 'bg-c-sienna',
    soft: 'bg-c-sienna-soft',
    text: 'text-c-sienna-text',
    border: 'border-c-sienna',
    deep: 'bg-c-sienna-deep',
    bright: 'text-c-sienna-bright',
    brandVar: '[--brand-bg:var(--c-sienna-deep)]',
  },
  sage: {
    solid: 'bg-c-sage',
    soft: 'bg-c-sage-soft',
    text: 'text-c-sage-text',
    border: 'border-c-sage',
    deep: 'bg-c-sage-deep',
    bright: 'text-c-sage-bright',
    brandVar: '[--brand-bg:var(--c-sage-deep)]',
  },
  berry: {
    solid: 'bg-c-berry',
    soft: 'bg-c-berry-soft',
    text: 'text-c-berry-text',
    border: 'border-c-berry',
    deep: 'bg-c-berry-deep',
    bright: 'text-c-berry-bright',
    brandVar: '[--brand-bg:var(--c-berry-deep)]',
  },
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
