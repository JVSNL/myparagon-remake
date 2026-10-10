import { Link, NavLink } from 'react-router-dom'
import { COLOR_CLASSES } from '../../lib/colors'
import { useT } from '../../lib/preferences'
import { useRegion } from '../../lib/useRegion'
import { fullName, unreadChats, unreadCount } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { Avatar } from '../Avatar'
import { Logo } from '../Logo'
import { SIDEBAR_ITEMS } from './navItems'

export function Sidebar() {
  const t = useT()
  const { state, me } = useStore()
  const region = useRegion()
  const unread = me ? unreadCount(state, me.id) : 0
  const chats = me ? unreadChats(state, me.id) : 0

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-surface px-4 py-6 lg:flex">
      <Link to="/" className="mb-8 px-3">
        <Logo />
      </Link>
      <nav aria-label={t('nav.main')} className="flex-1">
        <ul className="space-y-1">
          {SIDEBAR_ITEMS.map(({ to, label, icon: Icon, end, color }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium transition-colors ${
                    isActive ? `${COLOR_CLASSES[color].soft} ${COLOR_CLASSES[color].text}` : 'text-text hover:bg-surface-2'
                  }`
                }
              >
                <Icon className={`size-5 ${COLOR_CLASSES[color].text}`} strokeWidth={1.75} aria-hidden="true" />
                <span className="flex-1">{to === '/region' ? region.name : t(label)}</span>
                {to === '/general' && chats > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
                    <span aria-hidden="true">{chats}</span>
                    <span className="sr-only">{t('chat.unread', { n: chats })}</span>
                  </span>
                )}
                {to === '/notifications' && unread > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">
                    <span aria-hidden="true">{unread}</span>
                    <span className="sr-only">{t('notifications.unread', { n: unread })}</span>
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      {me && (
        <Link to="/settings" className="flex items-center gap-3 rounded-lg p-2 hover:bg-surface-2">
          <Avatar user={me} size="md" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-text">{fullName(me)}</span>
            <span className="block truncate text-xs text-muted">{t(`role.${me.role}`)}</span>
          </span>
        </Link>
      )}
    </aside>
  )
}
