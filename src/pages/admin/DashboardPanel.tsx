import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AudienceTag } from '../../components/AudienceTag'
import { ChannelTag } from '../../components/ChannelTag'
import { usePreferences } from '../../lib/preferences'
import { useNow } from '../../lib/useNow'
import { postStats, sortedPosts } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { ReadMeter } from './PostStats'

const PERIODS = [7, 30, 90] as const
type Sort = 'date' | 'reads' | 'reactions'

/** Reach of the news over a period: headline numbers and a table per post. */
export function DashboardPanel() {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const now = useNow()
  const [days, setDays] = useState<(typeof PERIODS)[number]>(30)
  const [sort, setSort] = useState<Sort>('date')

  const rows = sortedPosts(state)
    .filter((p) => p.createdAt <= now && p.createdAt > now - days * 86_400_000)
    .map((post) => ({ post, stats: postStats(state, post) }))
  const total = (key: 'readers' | 'audience' | 'reactions' | 'comments') => rows.reduce((sum, r) => sum + r.stats[key], 0)
  const avgRate = total('audience') > 0 ? total('readers') / total('audience') : 0
  const pct = (rate: number) => rate.toLocaleString(locale, { style: 'percent' })
  const sorted = [...rows].sort((a, b) =>
    sort === 'reads' ? b.stats.readRate - a.stats.readRate : sort === 'reactions' ? b.stats.reactions + b.stats.comments - (a.stats.reactions + a.stats.comments) : 0,
  )

  const tiles = [
    { label: t('stats.published'), value: rows.length.toLocaleString(locale) },
    { label: t('stats.avgRead'), value: pct(avgRate) },
    { label: t('stats.reactions'), value: total('reactions').toLocaleString(locale) },
    { label: t('stats.comments'), value: total('comments').toLocaleString(locale) },
  ]

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div role="radiogroup" aria-label={t('stats.period')} className="flex gap-1 rounded-xl bg-surface-2 p-1">
          {PERIODS.map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={days === p}
              onClick={() => setDays(p)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${days === p ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
            >
              {t('stats.days', { n: p })}
            </button>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-muted">
          {t('stats.sort')}
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text">
            <option value="date">{t('stats.sort.date')}</option>
            <option value="reads">{t('stats.sort.reads')}</option>
            <option value="reactions">{t('stats.sort.engagement')}</option>
          </select>
        </label>
      </div>

      <dl className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="rounded-xl border border-border bg-surface p-4">
            <dt className="text-xs text-muted">{tile.label}</dt>
            <dd className="mt-1 text-2xl font-light text-heading tabular-nums">{tile.value}</dd>
          </div>
        ))}
      </dl>

      {sorted.length === 0 ? (
        <p className="py-10 text-center text-muted">{t('stats.empty')}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <caption className="sr-only">{t('stats.table')}</caption>
            <thead className="border-b border-border bg-surface-2 text-xs text-muted">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">{t('stats.postColumn')}</th>
                <th scope="col" className="px-3 py-2 font-medium">{t('stats.read')}</th>
                <th scope="col" className="px-3 py-2 text-right font-medium">{t('stats.reactions')}</th>
                <th scope="col" className="px-4 py-2 text-right font-medium">{t('stats.comments')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map(({ post, stats }) => (
                <tr key={post.id}>
                  <td className="max-w-72 px-4 py-2.5">
                    <Link to={`/beheer/posts/${post.id}`} className="line-clamp-1 font-medium text-heading hover:underline">
                      {post.title}
                    </Link>
                    <span className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-muted">
                      <ChannelTag channelId={post.channelId} />
                      <AudienceTag post={post} />
                      {new Date(post.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' })}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <ReadMeter rate={stats.readRate} label={`${pct(stats.readRate)} (${stats.readers}/${stats.audience})`} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{stats.reactions}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{stats.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-3 text-xs text-muted">{t('stats.note')}</p>
    </>
  )
}
