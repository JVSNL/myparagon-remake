import { Link } from 'react-router-dom'
import { COLOR_CLASSES } from '../lib/colors'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'
import { launchpadIcon } from './launchpadIcons'

/** Row of shortcuts to the other tools employees use; scrolls sideways on phones. */
export function Launchpad() {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  if (state.launchpad.length === 0) return null

  return (
    <section aria-labelledby="launchpad-title" className="mb-5">
      <h2 id="launchpad-title" className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">
        {t('launchpad.title')}
      </h2>
      <ul className="-mx-4 flex snap-x scroll-px-4 gap-2.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-6 sm:overflow-visible sm:px-0">
        {state.launchpad.map((link) => {
          const Icon = launchpadIcon(link.icon)
          const c = COLOR_CLASSES[link.color]
          const label = pick(link.label, locale)
          const className =
            'group flex h-full w-[5.5rem] shrink-0 snap-start flex-col items-center gap-2 rounded-xl border border-border bg-surface px-2 py-3 text-center shadow-card transition hover:-translate-y-0.5 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto'
          const content = (
            <>
              <span className={`flex size-11 items-center justify-center rounded-xl ${c.soft} ${c.text}`}>
                <Icon className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <span className="line-clamp-2 text-[13px] leading-tight font-medium text-text">{label}</span>
            </>
          )
          return (
            <li key={link.id} className="shrink-0 sm:shrink">
              {link.url.startsWith('/') ? (
                <Link to={link.url} className={className}>
                  {content}
                </Link>
              ) : (
                <a href={link.url} target="_blank" rel="noopener noreferrer" className={className} aria-label={`${label} (${t('launchpad.external')})`}>
                  {content}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
