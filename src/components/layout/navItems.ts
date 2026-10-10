import { Bell, Bookmark, Globe, House, Info, Menu, Search, Settings, type LucideIcon } from 'lucide-react'
import type { ColorKey } from '../../data/types'
import type { MessageKey } from '../../lib/i18n/nl'

export interface NavItem {
  to: string
  label: MessageKey
  icon: LucideIcon
  end?: boolean
  /** Brand colour used when the item is active. */
  color: ColorKey
}

/** Bottom tab bar on mobile. */
export const TAB_ITEMS: NavItem[] = [
  { to: '/', label: 'nav.home', icon: House, end: true, color: 'navy' },
  { to: '/region', label: 'nav.region', icon: Globe, color: 'royal' },
  { to: '/general', label: 'nav.general', icon: Info, color: 'sage' },
  { to: '/menu', label: 'nav.menu', icon: Menu, color: 'berry' },
]

/** Sidebar on desktop: the tabs plus what lives behind "Menu" on mobile. */
export const SIDEBAR_ITEMS: NavItem[] = [
  TAB_ITEMS[0],
  { to: '/search', label: 'search.title', icon: Search, color: 'sky' },
  ...TAB_ITEMS.slice(1),
  { to: '/bookmarks', label: 'nav.bookmarks', icon: Bookmark, color: 'orange' },
  { to: '/notifications', label: 'nav.notifications', icon: Bell, color: 'sienna' },
  { to: '/settings', label: 'nav.settings', icon: Settings, color: 'navy' },
]

// Pages that belong to a tab without living under its path.
const SECTION_PREFIXES: [string[], ColorKey][] = [
  [['/region'], 'royal'],
  [['/general', '/chat', '/ask', '/feedback'], 'sage'],
  [['/menu', '/people', '/profile', '/org', '/pages', '/stories', '/locations', '/documents', '/bookmarks', '/settings'], 'berry'],
]

/** Colour of the section (tab) a page belongs to; news, search and admin pages are navy. */
export function sectionColor(pathname: string): ColorKey {
  const match = SECTION_PREFIXES.find(([prefixes]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)),
  )
  return match ? match[1] : 'navy'
}
