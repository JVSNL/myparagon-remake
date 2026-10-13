import { CalendarX2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { EventBlock } from '../components/blocks/InteractiveBlocks'
import { PageHeader } from '../components/layout/PageHeader'
import { blocksOfType } from '../lib/interactive'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useNow } from '../lib/useNow'
import { useStore } from '../store/StoreProvider'

/** Upcoming events from all pages, with a filter for the ones you signed up for. */
export function AgendaPage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const now = useNow()
  const [mine, setMine] = useState(false)
  const events = blocksOfType(state, 'event', locale)
    .filter(({ block }) => (block.endsAt ?? block.startsAt) >= now)
    .filter(({ block }) => !mine || (!!me && (state.eventRegistrations[block.id] ?? []).includes(me.id)))
    .sort((a, b) => a.block.startsAt - b.block.startsAt)

  return (
    <>
      <PageHeader title={t('agenda.title')} backTo="/menu" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <div role="radiogroup" aria-label={t('agenda.filter')} className="mb-4 inline-flex gap-1 rounded-xl bg-surface-2 p-1">
          {[false, true].map((value) => (
            <button
              key={String(value)}
              type="button"
              role="radio"
              aria-checked={mine === value}
              onClick={() => setMine(value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${mine === value ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
            >
              {value ? t('agenda.mine') : t('agenda.all')}
            </button>
          ))}
        </div>
        {events.length === 0 ? (
          <div className="py-16 text-center">
            <CalendarX2 className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="mx-auto mt-3 max-w-xs text-muted">{mine ? t('agenda.emptyMine') : t('agenda.empty')}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {events.map(({ block, page }) => (
              <li key={block.id}>
                <EventBlock block={block} />
                <Link to={`/pages/${page.slug}`} className="mt-1.5 inline-block px-1 text-sm font-medium text-link hover:underline">
                  {t('agenda.onPage', { page: pick(page.title, locale) })}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
