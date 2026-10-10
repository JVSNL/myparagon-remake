const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

/**
 * Relative for the last week ("5 minutes ago", "yesterday"), absolute after
 * that ("5 Oct", or "5 Oct 2024" for another year).
 */
export function formatRelative(timestamp: number, now: number, locale: string): string {
  const diff = now - timestamp
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diff < MINUTE) return rtf.format(0, 'second')
  if (diff < HOUR) return rtf.format(-Math.floor(diff / MINUTE), 'minute')
  if (diff < DAY) return rtf.format(-Math.floor(diff / HOUR), 'hour')
  if (diff < 7 * DAY) return rtf.format(-Math.floor(diff / DAY), 'day')

  const date = new Date(timestamp)
  const sameYear = date.getFullYear() === new Date(now).getFullYear()
  return date.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** Full date and time, used as tooltip / for screen readers. */
export const formatFull = (timestamp: number, locale: string) =>
  new Date(timestamp).toLocaleString(locale, { dateStyle: 'long', timeStyle: 'short' })
