import { Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { blocksOfType } from '../../lib/interactive'
import { pick } from '../../lib/localized'
import { usePreferences } from '../../lib/preferences'
import { fullName, userById } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const csvCell = (v: string) => `"${v.replace(/"/g, '""')}"`

/** Form submissions (with names) and event sign-ups, for editors. */
export function SubmissionsPanel() {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const forms = blocksOfType(state, 'form', 'nl')
  const events = blocksOfType(state, 'event', 'nl').sort((a, b) => a.block.startsAt - b.block.startsAt)
  const date = (ts: number) => new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
  const h2 = 'mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase'

  return (
    <>
      <h2 className={h2}>{t('submissions.forms')}</h2>
      {forms.length === 0 && <p className="mb-6 text-sm text-muted">{t('submissions.noForms')}</p>}
      {forms.map(({ block, page }) => {
        const entries = state.formSubmissions.filter((s) => s.formId === block.id)
        const name = (id: string) => {
          const u = userById(state, id)
          return u ? fullName(u) : '?'
        }
        const csv = [
          [t('submissions.name'), t('submissions.date'), ...block.fields.map((f) => f.label)].map(csvCell).join(';'),
          ...entries.map((e) => [name(e.userId), new Date(e.createdAt).toISOString(), ...block.fields.map((f) => e.values[f.id] ?? '')].map(csvCell).join(';')),
        ].join('\n')
        return (
          <section key={block.id} className="mb-6 overflow-hidden rounded-xl border border-border bg-surface">
            <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-heading">{block.title || t('block.form')}</p>
                <p className="text-xs text-muted">
                  <Link to={`/pages/${page.slug}`} className="hover:underline">
                    {pick(page.title, locale)}
                  </Link>{' '}
                  · {t('submissions.count', { n: entries.length })}
                </p>
              </div>
              {entries.length > 0 && (
                <a
                  href={`data:text/csv;charset=utf-8,${encodeURIComponent('﻿' + csv)}`}
                  download={`${(block.title || 'formulier').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.csv`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-surface-2"
                >
                  <Download className="size-4" aria-hidden="true" />
                  {t('submissions.export')}
                </a>
              )}
            </div>
            <ul className="divide-y divide-border">
              {entries.map((e) => (
                <li key={e.id} className="px-4 py-3">
                  <p className="text-xs text-muted">
                    {name(e.userId)} · {date(e.createdAt)}
                  </p>
                  <dl className="mt-1 space-y-1 text-[15px]">
                    {block.fields
                      .filter((f) => e.values[f.id])
                      .map((f) => (
                        <div key={f.id}>
                          <dt className="sr-only">{f.label}</dt>
                          <dd className={f.kind === 'text' ? 'font-medium text-heading' : 'whitespace-pre-line text-text'}>{e.values[f.id]}</dd>
                        </div>
                      ))}
                  </dl>
                </li>
              ))}
            </ul>
          </section>
        )
      })}

      <h2 className={h2}>{t('submissions.events')}</h2>
      {events.length === 0 && <p className="text-sm text-muted">{t('submissions.noEvents')}</p>}
      {events.map(({ block, page }) => {
        const attendees = (state.eventRegistrations[block.id] ?? []).map((id) => userById(state, id)).filter((u) => u !== undefined)
        return (
          <details key={block.id} className="mb-3 rounded-xl border border-border bg-surface">
            <summary className="cursor-pointer px-4 py-3">
              <span className="font-medium text-heading">{block.title}</span>
              <span className="block text-xs text-muted">
                {date(block.startsAt)} · {pick(page.title, locale)} ·{' '}
                {block.capacity !== undefined
                  ? t('submissions.signups', { n: attendees.length, capacity: block.capacity })
                  : t('event.attendees', { n: attendees.length })}
              </span>
            </summary>
            <ul className="columns-1 gap-4 border-t border-border px-4 py-3 text-sm text-text sm:columns-2">
              {attendees.map((u) => (
                <li key={u.id} className="py-0.5">
                  {fullName(u)} <span className="text-muted">· {u.department}</span>
                </li>
              ))}
            </ul>
          </details>
        )
      })}
    </>
  )
}
