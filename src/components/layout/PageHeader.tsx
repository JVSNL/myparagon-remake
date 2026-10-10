import { ChevronLeft, Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { ColorKey } from '../../data/types'
import { COLOR_CLASSES } from '../../lib/colors'
import { useT } from '../../lib/preferences'
import { LogoMark } from '../Logo'
import { NotificationBell } from './NotificationBell'
import { sectionColor } from './navItems'

interface Props {
  title: string
  /** Where "back" goes when there is no history to return to. */
  backTo?: string
  actions?: ReactNode
  /** Hide the title visually on mobile (e.g. when the logo says enough). */
  showLogo?: boolean
  /** Background colour; defaults to the colour of the section the page belongs to. */
  color?: ColorKey
}

/**
 * Mobile: a sticky, coloured app bar with back button, title and actions.
 * Desktop: a coloured banner at the top of the content column.
 * Both use the .on-brand token scope, so actions passed in turn white.
 */
export function PageHeader({ title, backTo, actions, showLogo, color }: Props) {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const c = COLOR_CLASSES[color ?? sectionColor(location.pathname)]
  // "default" means this is the first page of the session: nothing to go back to.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate(backTo ?? '/'))

  return (
    <header
      className={`on-brand pt-safe sticky top-0 z-20 ${c.brandVar} bg-(--brand-bg) shadow-[0_2px_12px_rgb(0_0_0/0.12)] lg:static lg:bg-transparent lg:shadow-none`}
    >
      <div className="mx-auto max-w-2xl lg:px-4 lg:pt-8 lg:pb-6">
        <div className="relative flex h-14 items-center gap-2 overflow-hidden px-2 lg:h-auto lg:min-h-28 lg:rounded-2xl lg:bg-(--brand-bg) lg:px-6 lg:py-6 lg:shadow-card">
          {/* Decorative shapes in house-style colours, kept faint so white text stays AA. */}
          <span aria-hidden="true" className="pointer-events-none absolute -top-12 -right-8 size-32 rounded-full bg-white/10 lg:-top-16 lg:size-48" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-10 right-20 size-16 rounded-full bg-c-sky/30 lg:right-44 lg:size-24" />
          <span aria-hidden="true" className="pointer-events-none absolute top-4 right-40 hidden size-3 rounded-full bg-c-orange lg:block" />

          <div className="relative flex min-w-24 items-center lg:min-w-0">
            {backTo ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-0.5 rounded-lg py-2 pr-2 text-[15px] font-medium text-white hover:bg-white/15"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
                {t('nav.back')}
              </button>
            ) : showLogo ? (
              <Link to="/" className="p-1 lg:hidden" aria-label="myNexora">
                <LogoMark inverse className="size-8" />
              </Link>
            ) : null}
          </div>
          <h1 className="relative flex-1 truncate text-center text-[17px] font-medium text-white lg:text-left lg:text-3xl lg:font-light">
            {title}
          </h1>
          <div className="relative flex min-w-24 items-center justify-end gap-1 lg:min-w-0">
            {actions}
            <span className="flex lg:hidden">
              {location.pathname !== '/search' && (
                <Link
                  to="/search"
                  aria-label={t('search.open')}
                  className="flex size-10 items-center justify-center rounded-full text-white hover:bg-white/15"
                >
                  <Search className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
                </Link>
              )}
              <NotificationBell />
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
