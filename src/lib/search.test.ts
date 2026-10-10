import { describe, expect, it } from 'vitest'
import { buildSeedState } from '../data/seed'
import { search } from './search'

const state = buildSeedState(Date.now())

describe('global search', () => {
  it('needs at least two characters', () => {
    expect(search(state, 'a', 'nl').total).toBe(0)
  })

  it('finds news, pages, people, locations and FAQ', () => {
    expect(search(state, 'zonnepanelen', 'nl').posts.map((p) => p.id)).toContain('p06')
    expect(search(state, 'finance', 'nl').pages.map((p) => p.slug)).toContain('finance')
    expect(search(state, 'sanne', 'nl').people.map((u) => u.firstName)).toContain('Sanne')
    expect(search(state, 'keulen', 'nl').locations.map((l) => l.city)).toContain('Keulen')
    expect(search(state, 'veilig', 'nl').faq.map((f) => f.question)).toContain('Is de app veilig?')
  })

  it('ignores accents and requires every word', () => {
    expect(search(state, 'poznan', 'nl').locations.map((l) => l.city)).toContain('Poznań')
    expect(search(state, 'zonnepanelen kerstmarkt', 'nl').total).toBe(0)
  })

  it('searches translated content in the reader’s language', () => {
    expect(search(state, 'welcome', 'en').posts.map((p) => p.id)).toContain('p05')
    expect(search(state, 'welcome', 'nl').posts).toHaveLength(0)
  })
})
