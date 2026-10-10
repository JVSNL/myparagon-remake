import { Bell, Bookmark, Globe, House, Info, Menu, Settings, type LucideIcon } from 'lucide-react'
import type { MessageKey } from '../../lib/i18n/nl'

export interface NavItem {
  to: string
  label: MessageKey
  icon: LucideIcon
  end?: boolean
}

/** Bottom tab bar on mobile. */
export const TAB_ITEMS: NavItem[] = [
  { to: '/', label: 'nav.home', icon: House, end: true },
  { to: '/region', label: 'nav.region', icon: Globe },
  { to: '/general', label: 'nav.general', icon: Info },
  { to: '/menu', label: 'nav.menu', icon: Menu },
]

/** Sidebar on desktop: the tabs plus what lives behind "Menu" on mobile. */
export const SIDEBAR_ITEMS: NavItem[] = [
  ...TAB_ITEMS.slice(0, 3),
  { to: '/bookmarks', label: 'nav.bookmarks', icon: Bookmark },
  { to: '/notifications', label: 'nav.notifications', icon: Bell },
  { to: '/settings', label: 'nav.settings', icon: Settings },
]
