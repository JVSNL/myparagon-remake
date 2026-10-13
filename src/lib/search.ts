import type { Block, Lang, LaunchpadLink, Location, Page, Post, User } from '../data/types'
import { canSeePost, fullName, postContent } from '../store/selectors'
import type { AppState } from '../store/state'
import { FEATURES } from './features'
import { pick } from './localized'

export const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

/** Colleague search: name, role, department, site and skills; every word must match. */
export const matchesQuery = (user: User, query: string) => {
  const q = normalize(query.trim())
  if (!q) return true
  const haystack = normalize([fullName(user), user.jobTitle, user.department, user.location, ...user.skills].join(' '))
  return q.split(/\s+/).every((word) => haystack.includes(word))
}

/** All readable text of a block (used for searching pages). */
export function blockText(block: Block): string {
  switch (block.type) {
    case 'hero':
      return `${block.title} ${block.subtitle ?? ''}`
    case 'heading':
    case 'text':
      return block.text
    case 'callout':
      return `${block.title} ${block.text}`
    case 'quote':
      return `${block.text} ${block.author ?? ''}`
    case 'image':
      return block.caption ?? ''
    case 'carousel':
      return [block.title, ...block.slides.map((s) => s.title)].join(' ')
    case 'steps':
      return [block.title, ...block.steps.map((s) => `${s.title} ${s.text}`)].join(' ')
    case 'links':
      return [block.title, ...block.items.map((i) => i.label)].join(' ')
    case 'accordion':
      return [block.title, ...block.items.map((i) => `${i.question} ${i.answer}`)].join(' ')
    case 'poll':
      return [block.question, ...block.options].join(' ')
    case 'form':
      return [block.title, block.intro, ...block.fields.map((f) => f.label)].join(' ')
    case 'event':
      return `${block.title} ${block.location} ${block.description ?? ''}`
    case 'embed':
      return `${block.title ?? ''} ${block.caption ?? ''}`
    case 'files':
    case 'feed':
    case 'people':
      return block.title ?? ''
  }
}

export interface FaqHit {
  page: Page
  question: string
  answer: string
}

export interface SearchResults {
  posts: Post[]
  pages: Page[]
  people: User[]
  locations: Location[]
  faq: FaqHit[]
  tools: LaunchpadLink[]
  total: number
}

const LIMIT = 8

/** Searches news, pages, colleagues, locations, FAQ and launchpad tools. Every word must match (accent-insensitive). */
/** With a `viewer`, only posts that user may see are searched (audience, scheduling). */
export function search(state: AppState, query: string, lang: Lang, viewer?: { user: User | null; now: number }): SearchResults {
  const words = normalize(query.trim()).split(/\s+/).filter(Boolean)
  const empty = { posts: [], pages: [], people: [], locations: [], faq: [], tools: [], total: 0 }
  if (words.length === 0 || query.trim().length < 2) return empty
  const matches = (text: string) => {
    const haystack = normalize(text)
    return words.every((w) => haystack.includes(w))
  }

  const posts = [...state.posts]
    .sort((a, b) => b.createdAt - a.createdAt)
    .filter((p) => !viewer || canSeePost(p, viewer.user, viewer.now))
    .filter((p) => {
      const c = postContent(p, lang)
      return matches([c.title, c.intro, ...c.body].join(' '))
    })
  const pages = state.pages.filter((p) => matches(`${pick(p.title, lang)} ${pick(p.blocks, lang).map(blockText).join(' ')}`))
  const people = state.users
    .filter((u) => matchesQuery(u, query))
    .sort((a, b) => a.lastName.localeCompare(b.lastName))
  const locations = state.locations.filter((l) => matches(`${l.city} ${l.kind} ${l.address} ${l.postcode} ${l.description}`))
  const faq = state.pages.flatMap((page) =>
    pick(page.blocks, lang)
      .filter((b) => b.type === 'accordion')
      .flatMap((b) => b.items)
      .filter((item) => matches(`${item.question} ${item.answer}`))
      .map((item) => ({ page, question: item.question, answer: item.answer })),
  )

  const tools = (FEATURES.launchpad ? state.launchpad : []).filter((l) => matches(Object.values(l.label).join(' ')))

  const results = {
    posts: posts.slice(0, LIMIT),
    pages: pages.slice(0, LIMIT),
    people: people.slice(0, LIMIT),
    locations: locations.slice(0, LIMIT),
    faq: faq.slice(0, LIMIT),
    tools: tools.slice(0, LIMIT),
  }
  return { ...results, total: posts.length + pages.length + people.length + locations.length + faq.length + tools.length }
}
