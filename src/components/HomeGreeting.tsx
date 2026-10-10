import { Bell, Bookmark, MessagesSquare } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePreferences } from '../lib/preferences'
import { useNow } from '../lib/useNow'
import { unreadChats, unreadCount } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

/** Colourful welcome at the top of the feed, with shortcuts to what is new. */
export function HomeGreeting() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const now = useNow()
  if (!me) return null

  const hour = new Date(now).getHours()
  const greeting = hour < 12 ? 'home.morning' : hour < 18 ? 'home.afternoon' : 'home.evening'
  const today = new Date(now).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const stats = [
    { to: '/notifications', icon: Bell, label: t('home.notifications', { n: unreadCount(state, me.id) }), className: 'bg-c-orange text-[#1c1305]' },
    { to: '/chat', icon: MessagesSquare, label: t('home.chats', { n: unreadChats(state, me.id) }), className: 'bg-[#6CA885] text-[#08241c]' },
    { to: '/bookmarks', icon: Bookmark, label: t('home.saved', { n: (state.bookmarks[me.id] ?? []).length }), className: 'bg-[#E2A9B1] text-[#3d1a2e]' },
  ]
  const counts = [unreadCount(state, me.id), unreadChats(state, me.id), (state.bookmarks[me.id] ?? []).length]
  // Only show shortcuts that have something in them.
  const visible = stats.filter((_, i) => counts[i] > 0)

  return (
    <section className="relative mb-5 overflow-hidden rounded-2xl bg-gradient-to-br from-[#134D71] via-[#134D71] to-[#1d79b3] px-5 py-6 text-white shadow-card">
      {/* Decorative shapes in house-style colours */}
      <span aria-hidden="true" className="absolute -top-10 -right-8 size-36 rounded-full bg-[#56BEEC]/45" />
      <span aria-hidden="true" className="absolute top-16 -right-14 size-28 rounded-full bg-[#E38900]/80" />
      <span aria-hidden="true" className="absolute -bottom-12 left-1/3 size-28 rounded-full bg-[#007059]/50" />
      <div className="relative">
        <p className="text-sm text-white/85 first-letter:uppercase">{today}</p>
        <h2 className="mt-0.5 text-2xl font-light text-balance">{t(greeting, { name: me.firstName })}</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {visible.map(({ to, icon: Icon, label, className }) => (
            <li key={to}>
              <Link to={to} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium shadow-sm hover:opacity-90 ${className}`}>
                <Icon className="size-4" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
