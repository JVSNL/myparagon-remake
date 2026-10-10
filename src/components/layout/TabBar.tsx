import { NavLink } from 'react-router-dom'
import { useT } from '../../lib/preferences'
import { TAB_ITEMS } from './navItems'

export function TabBar() {
  const t = useT()
  return (
    <nav
      aria-label={t('nav.main')}
      className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-2xl grid-cols-4">
        {TAB_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted hover:text-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-7 w-12 items-center justify-center rounded-full transition-colors ${
                      isActive ? 'bg-primary-soft' : ''
                    }`}
                  >
                    <Icon className="size-5" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden="true" />
                  </span>
                  {t(label)}
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
