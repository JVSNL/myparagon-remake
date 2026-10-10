import type { Lang, Localized } from '../data/types'

/** The value in the requested language, falling back to Dutch. */
export const pick = <T,>(value: Localized<T>, lang: Lang): T => value[lang] ?? value.nl
