import type { Block, Page } from '../data/types'
import { pick } from './localized'
import type { Lang } from '../data/types'
import type { AppState } from '../store/state'

export type BlockOf<T extends Block['type']> = Extract<Block, { type: T }>

/** Published blocks of one type with the page they are on (in the reader's language). */
export function blocksOfType<T extends Block['type']>(state: AppState, type: T, lang: Lang): { block: BlockOf<T>; page: Page }[] {
  return state.pages.flatMap((page) =>
    pick(page.blocks, lang)
      .filter((b): b is BlockOf<T> => b.type === type)
      .map((block) => ({ block, page })),
  )
}
