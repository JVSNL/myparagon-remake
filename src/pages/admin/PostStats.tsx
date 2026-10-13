import { Eye, MessageCircle, SmilePlus } from 'lucide-react'
import type { Post } from '../../data/types'
import { usePreferences } from '../../lib/preferences'
import { postStats } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

/** Horizontal meter for a share (0..1), with the value written next to it. */
export function ReadMeter({ rate, label }: { rate: number; label: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="h-2 w-24 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <span className="block h-full rounded-full bg-c-royal" style={{ width: `${Math.round(rate * 100)}%` }} />
      </span>
      <span className="text-sm whitespace-nowrap text-text tabular-nums">{label}</span>
    </span>
  )
}

/** Reach of one post: how many people in its audience opened it, plus reactions and comments. */
export function PostStats({ post }: { post: Post }) {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const s = postStats(state, post)
  const pct = s.readRate.toLocaleString(locale, { style: 'percent' })

  return (
    <section aria-labelledby="post-stats" className="rounded-xl border border-border bg-surface p-4">
      <h2 id="post-stats" className="text-sm font-medium text-heading">
        {t('stats.post')}
      </h2>
      <dl className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <Eye className="size-3.5" aria-hidden="true" />
            {t('stats.read')}
          </dt>
          <dd className="mt-1">
            <ReadMeter rate={s.readRate} label={t('stats.readOf', { n: s.readers, total: s.audience, pct })} />
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <SmilePlus className="size-3.5" aria-hidden="true" />
            {t('stats.reactions')}
          </dt>
          <dd className="mt-1 text-lg font-medium text-heading tabular-nums">{s.reactions}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            {t('stats.comments')}
          </dt>
          <dd className="mt-1 text-lg font-medium text-heading tabular-nums">{s.comments}</dd>
        </div>
      </dl>
    </section>
  )
}
