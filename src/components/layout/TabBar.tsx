import { NavLink } from 'react-router-dom'
import { COLOR_CLASSES } from '../../lib/colors'
import { useT } from '../../lib/preferences'
import { useRegion } from '../../lib/useRegion'
import { unreadChats } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { TAB_ITEMS } from './navItems'

export function TabBar() {
  const t = useT()
  const region = useRegion()
  const { state, me } = useStore()
  const chats = me ? unreadChats(state, me.id) : 0
  return (
    <nav
      aria-label={t('nav.main')}
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {TAB_ITEMS.map(({ to, label, icon: Icon, end, color }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  isActive ? COLOR_CLASSES[color].text : 'text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`relative flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? COLOR_CLASSES[color].soft : ''
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                    {to === '/general' && chats > 0 && (
                      <span className="absolute top-0 right-2.5 size-2.5 rounded-full bg-accent ring-2 ring-surface" aria-hidden="true" />
                    )}
                  </span>
                  {to === '/region' ? region.name : t(label)}
                  {to === '/general' && chats > 0 && <span className="sr-only">, {t('chat.unread', { n: chats })}</span>}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
