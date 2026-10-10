import { describe, expect, it } from 'vitest'
import { format } from './i18n/format'
import { de } from './i18n/de'
import { en } from './i18n/en'
import { nl } from './i18n/nl'
import { detectLanguage } from './preferences'
import { formatRelative } from './time'

describe('format', () => {
  it('fills placeholders and leaves unknown ones', () => {
    expect(format('Hallo {name}, {x}', { name: 'Eva' })).toBe('Hallo Eva, {x}')
  })

  it('picks plural forms', () => {
    const msg = '{n, plural, one {# reactie} other {# reacties}}'
    expect(format(msg, { n: 1 }, 'nl')).toBe('1 reactie')
    expect(format(msg, { n: 3 }, 'nl')).toBe('3 reacties')
    expect(format(msg, { n: 0 }, 'nl')).toBe('0 reacties')
  })
})

describe('translations', () => {
  it('have the same keys in every language and no empty strings', () => {
    const keys = Object.keys(nl).sort()
    for (const dict of [en, de]) {
      expect(Object.keys(dict).sort()).toEqual(keys)
      expect(Object.values(dict).every(Boolean)).toBe(true)
    }
  })
})

describe('detectLanguage', () => {
  it('uses the first supported browser language, Dutch as fallback', () => {
    expect(detectLanguage(['fr-FR', 'de-AT', 'en'])).toBe('de')
    expect(detectLanguage(['en-GB'])).toBe('en')
    expect(detectLanguage(['fr', 'es'])).toBe('nl')
  })
})

describe('formatRelative', () => {
  const now = new Date(2026, 9, 10, 12, 0).getTime()
  const min = 60_000

  it('is relative within a week', () => {
    expect(formatRelative(now - 10 * 1000, now, 'en')).toBe('now')
    expect(formatRelative(now - 5 * min, now, 'en')).toBe('5 minutes ago')
    expect(formatRelative(now - 3 * 60 * min, now, 'en')).toBe('3 hours ago')
    expect(formatRelative(now - 24 * 60 * min, now, 'en')).toBe('yesterday')
  })

  it('is absolute after a week, with the year only when it differs', () => {
    expect(formatRelative(new Date(2026, 8, 5).getTime(), now, 'en')).toBe('Sep 5')
    expect(formatRelative(new Date(2025, 8, 5).getTime(), now, 'en')).toBe('Sep 5, 2025')
  })
})
