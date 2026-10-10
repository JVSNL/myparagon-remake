import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useT } from '../../lib/preferences'
import { LogoMark } from '../Logo'
import { NotificationBell } from './NotificationBell'

interface Props {
  title: string
  /** Where "back" goes when there is no history to return to. */
  backTo?: string
  actions?: ReactNode
  /** Hide the title visually on mobile (e.g. when the logo says enough). */
  showLogo?: boolean
}

/**
 * Mobile: a sticky app bar with back button, title and actions.
 * Desktop: a regular page heading at the top of the content column.
 */
export function PageHeader({ title, backTo, actions, showLogo }: Props) {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  // "default" means this is the first page of the session: nothing to go back to.
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate(backTo ?? '/'))

  return (
    <header className="pt-safe sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur lg:static lg:border-0 lg:bg-transparent lg:backdrop-blur-none">
      <div className="mx-auto flex h-14 max-w-2xl items-center gap-2 px-2 lg:h-auto lg:px-4 lg:pt-10 lg:pb-6">
        <div className="flex w-24 items-center lg:w-auto">
          {backTo ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-0.5 rounded-lg py-2 pr-2 text-[15px] font-medium text-primary hover:bg-surface-2"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
              {t('nav.back')}
            </button>
          ) : showLogo ? (
            <Link to="/" className="p-1 lg:hidden" aria-label="myNexora">
              <LogoMark className="size-8" />
            </Link>
          ) : null}
        </div>
        <h1 className="flex-1 truncate text-center text-[17px] font-medium text-heading lg:text-left lg:text-3xl lg:font-light">
          {title}
        </h1>
        <div className="flex w-24 items-center justify-end gap-1 lg:w-auto">
          {actions}
          <span className="lg:hidden">
            <NotificationBell />
          </span>
        </div>
      </div>
    </header>
  )
}
