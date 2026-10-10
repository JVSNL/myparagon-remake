import { describe, expect, it } from 'vitest'
import { buildSeedState } from '../data/seed'
import { regionOfCountry } from '../data/regions'
import { pathTo } from './OrgChartPage'
import { matchesQuery } from '../lib/search'

const { users } = buildSeedState(Date.now())
const byName = (first: string) => users.find((u) => u.firstName === first)!

describe('Who is Who search', () => {
  it('matches name, role and skills, ignoring accents and case', () => {
    expect(matchesQuery(byName('Ondřej'), 'ondrej')).toBe(true)
    expect(matchesQuery(byName('Sanne'), 'financial analyst')).toBe(true)
    expect(matchesQuery(byName('Lukas'), 'typescript')).toBe(true)
    expect(matchesQuery(byName('Lukas'), 'payroll')).toBe(false)
  })
})

describe('org chart', () => {
  it('builds the path from the top down to a person', () => {
    expect(pathTo(users, 'u20')).toEqual(['u01', 'u02', 'u07', 'u08'])
    expect(pathTo(users, 'u01')).toEqual([])
  })

  it('has exactly one person at the top and no cycles', () => {
    expect(users.filter((u) => u.managerId === null)).toHaveLength(1)
    for (const u of users) expect(pathTo(users, u.id)).not.toContain(u.id)
  })
})

describe('regions', () => {
  it('maps countries to regions', () => {
    expect(regionOfCountry('BE')).toBe('benelux')
    expect(regionOfCountry('DE')).toBe('dach')
    expect(regionOfCountry('CZ')).toBe('cee')
  })
})
