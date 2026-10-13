import { describe, expect, it } from 'vitest'
import { buildSeedState } from '../data/seed'
import { search } from './search'

const state = buildSeedState(Date.now())

describe('global search', () => {
  it('needs at least two characters', () => {
    expect(search(state, 'a', 'nl').total).toBe(0)
  })

  it('finds news, pages, people, locations and FAQ', () => {
    expect(search(state, 'moestuin', 'nl').posts.map((p) => p.id)).toContain('p06')
    expect(search(state, 'finance', 'nl').pages.map((p) => p.slug)).toContain('finance')
    expect(search(state, 'sanne', 'nl').people.map((u) => u.firstName)).toContain('Sanne')
    expect(search(state, 'kopenhagen', 'nl').locations.map((l) => l.city)).toContain('Kopenhagen')
    expect(search(state, 'veilig', 'nl').faq.map((f) => f.question)).toContain('Is de app veilig?')
  })

  it('ignores accents and requires every word', () => {
    expect(search(state, 'malaga', 'nl').locations.map((l) => l.city)).toContain('Málaga')
    expect(search(state, 'moestuin kerstmarkt', 'nl').total).toBe(0)
  })

  it('searches translated content in the reader’s language', () => {
    expect(search(state, 'welcome', 'en').posts.map((p) => p.id)).toContain('p05')
    expect(search(state, 'welcome', 'nl').posts).toHaveLength(0)
  })
})

describe('launchpad search', () => {
  it('finds tools by their name in any language', () => {
    const state = buildSeedState(Date.UTC(2026, 0, 1))
    expect(search(state, 'declaraties', 'nl').tools.map((t) => t.id)).toEqual(['lp-expenses'])
    expect(search(state, 'expenses', 'nl').tools.map((t) => t.id)).toEqual(['lp-expenses'])
  })
})
