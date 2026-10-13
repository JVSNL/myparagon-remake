import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Post } from '../../data/types'
import { COLOR_CLASSES } from '../../lib/colors'
import { usePreferences } from '../../lib/preferences'
import { useNow } from '../../lib/useNow'
import { channelColor, sortedPosts } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

/** The days shown for a month: whole weeks from Monday to Sunday. */
function monthGrid(year: number, month: number): Date[] {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - ((first.getDay() + 6) % 7))
  const last = new Date(year, month + 1, 0)
  const days = Math.ceil((((first.getDay() + 6) % 7) + last.getDate()) / 7) * 7
  return Array.from({ length: days }, (_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i))
}

/** Editorial calendar: published and scheduled posts per day; a post opens in the editor. */
export function CalendarPanel() {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const now = useNow()
  const today = new Date(now)
  const [cursor, setCursor] = useState({ year: today.getFullYear(), month: today.getMonth() })

  const byDay = new Map<string, Post[]>()
  for (const post of sortedPosts(state).reverse()) {
    const key = dayKey(new Date(post.createdAt))
    byDay.set(key, [...(byDay.get(key) ?? []), post])
  }
  const days = monthGrid(cursor.year, cursor.month)
  const inMonth = (d: Date) => d.getMonth() === cursor.month
  const monthLabel = new Date(cursor.year, cursor.month, 1).toLocaleDateString(locale, { month: 'long', year: 'numeric' })
  const weekdays = days.slice(0, 7).map((d) => d.toLocaleDateString(locale, { weekday: 'short' }))
  const shift = (by: number) => {
    const d = new Date(cursor.year, cursor.month + by, 1)
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
  }
  const scheduledCount = state.posts.filter((p) => p.createdAt > now).length

  const chip = (post: Post) => {
    const scheduled = post.createdAt > now
    const c = COLOR_CLASSES[channelColor(state, post.channelId)]
    const time = new Date(post.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    return (
      <Link
        key={post.id}
        to={`/beheer/posts/${post.id}`}
        className={`flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs hover:opacity-85 ${c.soft} ${scheduled ? 'border border-dashed border-current' : ''} ${c.text}`}
      >
        {scheduled ? <CalendarClock className="size-3 shrink-0" aria-label={t('schedule.scheduled')} /> : <span className={`size-1.5 shrink-0 rounded-full ${c.solid}`} aria-hidden="true" />}
        <span className="min-w-0 truncate font-medium">{post.title}</span>
        <span className="sr-only">, {time}</span>
      </Link>
    )
  }

  const visibleDays = days.filter((d) => inMonth(d) && byDay.has(dayKey(d)))

  return (
    <>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => shift(-1)} aria-label={t('calendar.previous')} className="rounded-lg p-2 text-heading hover:bg-surface-2">
          <ChevronLeft className="size-5" aria-hidden="true" />
        </button>
        <h2 className="min-w-32 text-center text-lg font-medium text-heading capitalize sm:min-w-40" aria-live="polite">
          {monthLabel}
        </h2>
        <button type="button" onClick={() => shift(1)} aria-label={t('calendar.next')} className="rounded-lg p-2 text-heading hover:bg-surface-2">
          <ChevronRight className="size-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => setCursor({ year: today.getFullYear(), month: today.getMonth() })}
          className="ml-1 rounded-lg border border-border px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-surface-2"
        >
          {t('calendar.today')}
        </button>
        <span className="w-full text-sm text-muted sm:ml-auto sm:w-auto">{t('calendar.scheduled', { n: scheduledCount })}</span>
      </div>

      {/* Phones: an agenda list of the days that have posts */}
      <ul className="space-y-3 sm:hidden">
        {visibleDays.length === 0 && <li className="py-8 text-center text-muted">{t('calendar.empty')}</li>}
        {visibleDays.map((d) => (
          <li key={dayKey(d)} className="rounded-xl border border-border bg-surface p-3">
            <p className={`mb-2 text-sm font-medium ${dayKey(d) === dayKey(today) ? 'text-primary' : 'text-heading'}`}>
              {d.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <div className="space-y-1">{byDay.get(dayKey(d))!.map(chip)}</div>
          </li>
        ))}
      </ul>

      {/* Larger screens: a month grid */}
      <div className="hidden overflow-hidden rounded-xl border border-border bg-surface sm:block">
        <div className="grid grid-cols-7 border-b border-border bg-surface-2 text-center text-xs font-medium text-muted uppercase">
          {weekdays.map((w) => (
            <div key={w} className="py-2">
              {w}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((d, i) => {
            const isToday = dayKey(d) === dayKey(today)
            return (
              <div key={i} className={`min-h-24 border-border p-1.5 ${i % 7 !== 6 ? 'border-r' : ''} ${i < days.length - 7 ? 'border-b' : ''} ${inMonth(d) ? '' : 'bg-surface-2/60'}`}>
                <p
                  className={`mb-1 flex size-6 items-center justify-center rounded-full text-xs ${
                    isToday ? 'bg-primary font-bold text-on-primary' : inMonth(d) ? 'text-text' : 'text-muted'
                  }`}
                >
                  {d.getDate()}
                </p>
                <div className="space-y-1">{(byDay.get(dayKey(d)) ?? []).map(chip)}</div>
              </div>
            )
          })}
        </div>
      </div>
      <p className="mt-3 flex items-center gap-1.5 text-xs text-muted">
        <CalendarClock className="size-3.5" aria-hidden="true" />
        {t('calendar.legend')}
      </p>
    </>
  )
}
