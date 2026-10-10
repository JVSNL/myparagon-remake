import type { Lang } from '../data/types'

/**
 * Machine translation of user content (posts and comments).
 *
 * The demo has no server, so seed content ships with hand-written translations.
 * Content without a stored translation is translated by the first available
 * provider:
 *
 * 1. A translation endpoint, when `VITE_TRANSLATE_URL` is set at build time.
 *    It receives `POST { source, target, texts: string[] }` and answers
 *    `{ texts: string[] }` in the same order. A serverless function in front
 *    of DeepL, Google or Azure fits this contract.
 * 2. The on-device Translator API built into recent Chrome and Edge.
 *
 * Without either, content is shown in its original language.
 */
export interface Translator {
  translate(texts: string[], source: Lang, target: Lang): Promise<string[]>
}

export function httpTranslator(url: string, fetchImpl: typeof fetch = (...args) => fetch(...args)): Translator {
  return {
    async translate(texts, source, target) {
      const res = await fetchImpl(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, target, texts }),
      })
      if (!res.ok) throw new Error(`Translation failed: ${res.status}`)
      const data = (await res.json()) as { texts?: unknown }
      if (!Array.isArray(data.texts) || data.texts.length !== texts.length) throw new Error('Unexpected translation response')
      return data.texts.map(String)
    },
  }
}

/** Shape of the experimental browser Translator API (Chrome 138+). */
interface BrowserTranslatorApi {
  availability(options: { sourceLanguage: string; targetLanguage: string }): Promise<string>
  create(options: { sourceLanguage: string; targetLanguage: string }): Promise<{ translate(text: string): Promise<string> }>
}

export function browserTranslator(api = (globalThis as { Translator?: BrowserTranslatorApi }).Translator): Translator | null {
  if (!api) return null
  return {
    async translate(texts, source, target) {
      const options = { sourceLanguage: source, targetLanguage: target }
      if ((await api.availability(options)) === 'unavailable') throw new Error('Language pair unavailable')
      const translator = await api.create(options)
      return Promise.all(texts.map((text) => (text.trim() ? translator.translate(text) : text)))
    },
  }
}

/** The translator to use in this build and browser, or null when none is available. */
export function defaultTranslator(url = import.meta.env.VITE_TRANSLATE_URL as string | undefined): Translator | null {
  return url ? httpTranslator(url) : browserTranslator()
}

/**
 * Translates texts through `translator`, remembering results so each text is
 * translated only once per session. Resolves to null when translation fails.
 */
export function createTranslationCache(translator: Translator | null) {
  const cache = new Map<string, string>()
  const key = (text: string, source: Lang, target: Lang) => `${source}>${target}\u0000${text}`

  return {
    available: translator !== null,
    /** Translations already in the cache, or null when any text is missing. */
    peek(texts: string[], source: Lang, target: Lang): string[] | null {
      const hits = texts.map((text) => cache.get(key(text, source, target)))
      return hits.every((h) => h !== undefined) ? (hits as string[]) : null
    },
    async translate(texts: string[], source: Lang, target: Lang): Promise<string[] | null> {
      if (!translator) return null
      const missing = [...new Set(texts.filter((text) => !cache.has(key(text, source, target))))]
      if (missing.length > 0) {
        try {
          const result = await translator.translate(missing, source, target)
          missing.forEach((text, i) => cache.set(key(text, source, target), result[i]))
        } catch {
          return null
        }
      }
      return texts.map((text) => cache.get(key(text, source, target)) ?? text)
    },
  }
}

export type TranslationCache = ReturnType<typeof createTranslationCache>
