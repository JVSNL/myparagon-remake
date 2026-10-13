import { useId } from 'react'
import { REGIONS } from '../data/regions'
import type { RegionId } from '../data/types'
import { usePreferences } from '../lib/preferences'
import { formatFull } from '../lib/time'

const pad = (n: number) => String(n).padStart(2, '0')

/** Timestamp -> value for <input type="datetime-local"> (local time). */
export const toLocalInput = (ts: number) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

interface Props {
  audience: RegionId[]
  onAudienceChange: (audience: RegionId[]) => void
  /** null = publish now. Leave `onPublishAtChange` out when the time can no longer change. */
  publishAt: number | null
  onPublishAtChange?: (publishAt: number | null) => void
  now: number
  /** Shown instead of the schedule choice once a post has been published. */
  publishedAt?: number
}

/** Who sees a post (everyone or chosen regions) and when it is published. */
export function PostSettingsFields({ audience, onAudienceChange, publishAt, onPublishAtChange, now, publishedAt }: Props) {
  const { t, locale } = usePreferences()
  const id = useId()
  const everyone = audience.length === 0
  const radio = 'flex items-center gap-2 text-[15px] text-text'

  return (
    <div className="grid gap-5 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
      <fieldset>
        <legend className="text-sm font-medium text-heading">{t('audience.label')}</legend>
        <label className={`${radio} mt-2`}>
          <input type="radio" name={`${id}-aud`} checked={everyone} onChange={() => onAudienceChange([])} />
          {t('audience.everyone')}
        </label>
        <label className={`${radio} mt-1`}>
          <input type="radio" name={`${id}-aud`} checked={!everyone} onChange={() => onAudienceChange([REGIONS[0].id])} />
          {t('audience.regions')}
        </label>
        {!everyone && (
          <div className="mt-2 ml-6 space-y-1">
            {REGIONS.map((r) => (
              <label key={r.id} className={radio}>
                <input
                  type="checkbox"
                  checked={audience.includes(r.id)}
                  onChange={(e) => {
                    const next = e.target.checked ? [...audience, r.id] : audience.filter((a) => a !== r.id)
                    if (next.length > 0) onAudienceChange(next)
                  }}
                />
                {r.name}
              </label>
            ))}
          </div>
        )}
      </fieldset>

      {publishedAt !== undefined ? (
        <div>
          <p className="text-sm font-medium text-heading">{t('schedule.label')}</p>
          <p className="mt-2 text-[15px] text-text">{t('schedule.publishedOn', { date: formatFull(publishedAt, locale) })}</p>
        </div>
      ) : (
        <fieldset>
          <legend className="text-sm font-medium text-heading">{t('schedule.label')}</legend>
          <label className={`${radio} mt-2`}>
            <input type="radio" name={`${id}-when`} checked={publishAt === null} onChange={() => onPublishAtChange?.(null)} />
            {t('schedule.now')}
          </label>
          <label className={`${radio} mt-1`}>
            <input
              type="radio"
              name={`${id}-when`}
              checked={publishAt !== null}
              onChange={() => onPublishAtChange?.(now + 24 * 3_600_000)}
            />
            {t('schedule.later')}
          </label>
          {publishAt !== null && (
            <div className="mt-2 ml-6">
              <label htmlFor={`${id}-at`} className="sr-only">
                {t('schedule.at')}
              </label>
              <input
                id={`${id}-at`}
                type="datetime-local"
                value={toLocalInput(publishAt)}
                min={toLocalInput(now)}
                onChange={(e) => {
                  const ts = new Date(e.target.value).getTime()
                  if (!Number.isNaN(ts)) onPublishAtChange?.(ts)
                }}
                className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-text disabled:opacity-60"
              />
            </div>
          )}
        </fieldset>
      )}
    </div>
  )
}
