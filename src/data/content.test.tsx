import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { RichText } from '../components/RichText'
import { pick } from '../lib/localized'
import { DOCUMENTS } from './documents'
import { buildSeedState } from './seed'

describe('seeded pages', () => {
  const state = buildSeedState(Date.now())
  const blocks = state.pages.flatMap((p) => Object.values(p.blocks).flat())

  it('have unique slugs and block ids', () => {
    const slugs = state.pages.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const page of state.pages) {
      for (const list of Object.values(page.blocks)) {
        const ids = list.map((b) => b.id)
        expect(new Set(ids).size).toBe(ids.length)
      }
    }
  })

  it('only refer to existing documents, channels and people', () => {
    const docs = new Set(DOCUMENTS.map((d) => d.id))
    const channels = new Set(state.channels.map((c) => c.id))
    const users = new Set(state.users.map((u) => u.id))
    for (const b of blocks) {
      if (b.type === 'files') b.documentIds.forEach((id) => expect(docs).toContain(id))
      if (b.type === 'feed') expect(channels).toContain(b.channelId)
      if (b.type === 'people') b.userIds.forEach((id) => expect(users).toContain(id))
    }
  })
})

describe('pick', () => {
  it('falls back to Dutch', () => {
    expect(pick({ nl: 'Hallo', en: 'Hello' }, 'en')).toBe('Hello')
    expect(pick({ nl: 'Hallo' }, 'de')).toBe('Hallo')
  })
})

describe('RichText', () => {
  it('renders paragraphs, bullets, bold and links without HTML injection', () => {
    render(
      <MemoryRouter>
        <RichText text={'Intro met **nadruk**.\n\n- een\n- twee\n\nZie [FAQ](/pages/faq) en [site](https://example.com). <b>geen html</b>'} />
      </MemoryRouter>,
    )
    expect(screen.getByText('nadruk').tagName).toBe('STRONG')
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
    expect(screen.getByRole('link', { name: 'FAQ' })).toHaveAttribute('href', '/pages/faq')
    expect(screen.getByRole('link', { name: 'site' })).toHaveAttribute('target', '_blank')
    expect(screen.getByText(/<b>geen html<\/b>/)).toBeInTheDocument()
  })
})
