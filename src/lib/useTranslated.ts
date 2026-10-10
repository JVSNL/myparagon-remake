import { useEffect, useState } from 'react'
import type { Lang } from '../data/types'
import { usePreferences } from './preferences'
import { createTranslationCache, defaultTranslator, type TranslationCache } from './translate'

let sharedCache: TranslationCache | null = null
const translationCache = () => (sharedCache ??= createTranslationCache(defaultTranslator()))

/** For tests: swap the translator behind the hook. */
export const setTranslationCache = (cache: TranslationCache | null) => {
  sharedCache = cache
}

export type TranslationStatus =
  /** Written in the reader's language. */
  | 'original'
  /** A stored (human) translation is shown. */
  | 'translated'
  /** A machine translation is shown. */
  | 'machine'
  /** Waiting for a machine translation; the original is shown meanwhile. */
  | 'pending'
  /** No translation available; the original is shown. */
  | 'unavailable'

export interface Translated {
  texts: string[]
  status: TranslationStatus
  source: Lang
  /** True when the reader chose to see the original although a translation exists. */
  showingOriginal: boolean
  toggle: () => void
}

/**
 * Shows `original` (written in `source`) in the reader's language: a stored
 * translation when there is one, otherwise a machine translation when a
 * translator is available and automatic translation is on.
 */
export function useTranslated(original: string[], source: Lang, stored?: string[] | null): Translated {
  const { locale, autoTranslate } = usePreferences()
  const [showOriginal, setShowOriginal] = useState(!autoTranslate)
  const [machine, setMachine] = useState<{ key: string; texts: string[] | null } | null>(null)
  const needed = source !== locale && !stored
  const key = `${source}>${locale}\u0000${original.join('\u0000')}`
  const cache = translationCache()
  const cached = needed ? cache.peek(original, source, locale) : null
  const hasCached = cached !== null

  useEffect(() => setShowOriginal(!autoTranslate), [autoTranslate])

  useEffect(() => {
    if (!needed || showOriginal || hasCached || !cache.available || machine?.key === key) return
    let cancelled = false
    cache.translate(original, source, locale).then((texts) => {
      if (!cancelled) setMachine({ key, texts })
    })
    return () => {
      cancelled = true
    }
    // `key` captures `original`, `source` and `locale`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, needed, showOriginal, hasCached, cache])

  const toggle = () => setShowOriginal((s) => !s)
  const base = { source, showingOriginal: false, toggle }

  if (source === locale) return { ...base, texts: original, status: 'original' }
  const translation = stored ?? cached ?? (machine?.key === key ? machine.texts : null)
  const status: TranslationStatus = stored
    ? 'translated'
    : translation
      ? 'machine'
      : cache.available && !showOriginal && machine?.key !== key
        ? 'pending'
        : 'unavailable'
  if (showOriginal && (translation || cache.available)) return { ...base, texts: original, status, showingOriginal: true }
  return { ...base, texts: translation ?? original, status }
}
