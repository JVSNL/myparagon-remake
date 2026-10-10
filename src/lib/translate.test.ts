import { describe, expect, it, vi } from 'vitest'
import { buildSeedState } from '../data/seed'
import { browserTranslator, createTranslationCache, httpTranslator, type Translator } from './translate'

describe('httpTranslator', () => {
  it('posts the texts and returns the translations in order', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ texts: ['Hello', 'World'] }))
    const result = await httpTranslator('/api/translate', fetchImpl).translate(['Hallo', 'Wereld'], 'nl', 'en')
    expect(result).toEqual(['Hello', 'World'])
    expect(JSON.parse((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].body as string)).toEqual({
      source: 'nl',
      target: 'en',
      texts: ['Hallo', 'Wereld'],
    })
  })

  it('rejects malformed answers', async () => {
    const fetchImpl = vi.fn(async () => Response.json({ texts: ['only one'] }))
    await expect(httpTranslator('/x', fetchImpl).translate(['a', 'b'], 'nl', 'de')).rejects.toThrow()
  })
})

describe('browserTranslator', () => {
  it('is unavailable without the browser API', () => {
    expect(browserTranslator(undefined)).toBeNull()
  })

  it('uses the on-device API when the language pair is available', async () => {
    const api = {
      availability: async () => 'available',
      create: async () => ({ translate: async (text: string) => text.toUpperCase() }),
    }
    expect(await browserTranslator(api)!.translate(['hallo', ''], 'nl', 'de')).toEqual(['HALLO', ''])
  })
})

describe('createTranslationCache', () => {
  it('translates each text only once and reports failures as null', async () => {
    const translate = vi.fn<Translator['translate']>(async (texts) => texts.map((t) => `[${t}]`))
    const cache = createTranslationCache({ translate })
    expect(cache.peek(['a'], 'nl', 'en')).toBeNull()
    expect(await cache.translate(['a', 'b', 'a'], 'nl', 'en')).toEqual(['[a]', '[b]', '[a]'])
    expect(await cache.translate(['b'], 'nl', 'en')).toEqual(['[b]'])
    expect(translate).toHaveBeenCalledTimes(1)
    expect(cache.peek(['a', 'b'], 'nl', 'en')).toEqual(['[a]', '[b]'])

    const failing = createTranslationCache({ translate: async () => Promise.reject(new Error('offline')) })
    expect(await failing.translate(['a'], 'nl', 'en')).toBeNull()
    expect(await createTranslationCache(null).translate(['a'], 'nl', 'en')).toBeNull()
  })
})

describe('seed translations', () => {
  it('cover every seed post and comment in English and German', () => {
    const state = buildSeedState(Date.UTC(2026, 0, 1))
    for (const item of [...state.posts, ...state.comments]) {
      expect(item.translations?.en, item.id).toBeTruthy()
      expect(item.translations?.de, item.id).toBeTruthy()
    }
  })
})
