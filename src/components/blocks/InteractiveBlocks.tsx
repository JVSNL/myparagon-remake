import { CalendarDays, Check, MapPin, Users } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'
import type { Block } from '../../data/types'
import { usePreferences } from '../../lib/preferences'
import { canEditContent } from '../../store/permissions'
import { useStore } from '../../store/StoreProvider'

type Of<T extends Block['type']> = Extract<Block, { type: T }>

const card = 'rounded-xl border border-border bg-surface p-4 sm:p-5'
const button = 'rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-40'

/** One-question poll. Before voting you choose; afterwards you see anonymous percentages and can change your vote. */
export function PollBlock({ block }: { block: Of<'poll'> }) {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const id = useId()
  const votes = state.pollVotes[block.id] ?? {}
  const mine = me ? votes[me.id] : undefined
  const [choice, setChoice] = useState<number | null>(mine ?? null)
  const [changing, setChanging] = useState(false)
  const total = Object.keys(votes).length
  const counts = block.options.map((_, i) => Object.values(votes).filter((v) => v === i).length)
  const showResults = mine !== undefined && !changing

  return (
    <section className={card} aria-labelledby={`${id}-q`}>
      <p className="text-xs font-medium tracking-wide text-muted uppercase">{t('poll.label')}</p>
      <h3 id={`${id}-q`} className="mt-1 text-lg font-medium text-heading">
        {block.question}
      </h3>
      {showResults ? (
        <>
          <ul className="mt-3 space-y-2.5">
            {block.options.map((option, i) => {
              const share = total > 0 ? counts[i] / total : 0
              return (
                <li key={i}>
                  <div className="flex items-center justify-between gap-3 text-[15px]">
                    <span className={`flex items-center gap-1.5 ${i === mine ? 'font-medium text-heading' : 'text-text'}`}>
                      {i === mine && <Check className="size-4 text-primary" aria-label={t('poll.yourVote')} />}
                      {option}
                    </span>
                    <span className="text-sm text-muted tabular-nums">{share.toLocaleString(locale, { style: 'percent' })}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div className={`h-full rounded-full ${i === mine ? 'bg-primary' : 'bg-c-sky'}`} style={{ width: `${Math.round(share * 100)}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-3 flex flex-wrap items-center gap-x-3 text-sm text-muted">
            {t('poll.votes', { n: total })} · {t('poll.anonymous')}
            <button type="button" onClick={() => setChanging(true)} className="font-medium text-link hover:underline">
              {t('poll.change')}
            </button>
          </p>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (choice === null) return
            actions.votePoll(block.id, choice)
            setChanging(false)
          }}
        >
          <fieldset className="mt-3 space-y-2">
            <legend className="sr-only">{block.question}</legend>
            {block.options.map((option, i) => (
              <label
                key={i}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-[15px] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus ${
                  choice === i ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'
                }`}
              >
                <input type="radio" name={`${id}-poll`} checked={choice === i} onChange={() => setChoice(i)} />
                {option}
              </label>
            ))}
          </fieldset>
          <div className="mt-3 flex items-center gap-3">
            <button type="submit" disabled={choice === null} className={button}>
              {t('poll.vote')}
            </button>
            <span className="text-sm text-muted">{t('poll.anonymous')}</span>
          </div>
        </form>
      )}
    </section>
  )
}

/** Form; submissions go to editors (Beheer → Inzendingen), with the sender's name. */
export function FormBlock({ block }: { block: Of<'form'> }) {
  const { t } = usePreferences()
  const { actions } = useStore()
  const id = useId()
  const [values, setValues] = useState<Record<string, string>>({})
  const [missing, setMissing] = useState<string[]>([])
  const [sent, setSent] = useState(false)
  const field = 'mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[15px] text-text focus:border-focus focus:outline-none'

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const empty = block.fields.filter((f) => f.required && !values[f.id]?.trim()).map((f) => f.id)
    setMissing(empty)
    if (empty.length > 0) return
    actions.submitForm(block.id, values)
    setValues({})
    setSent(true)
  }

  return (
    <section className={card} aria-labelledby={`${id}-title`}>
      {block.title && (
        <h3 id={`${id}-title`} className="text-lg font-medium text-heading">
          {block.title}
        </h3>
      )}
      {block.intro && <p className="mt-1 text-[15px] text-text">{block.intro}</p>}
      {sent ? (
        <div role="status" className="mt-4 rounded-lg bg-c-sage-soft px-3 py-3 text-[15px] text-c-sage-text">
          <p className="flex items-center gap-2 font-medium">
            <Check className="size-4" aria-hidden="true" />
            {t('form.thanks')}
          </p>
          <button type="button" onClick={() => setSent(false)} className="mt-1 text-sm font-medium underline">
            {t('form.again')}
          </button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="mt-4 space-y-4">
          {block.fields.map((f) => {
            const fid = `${id}-${f.id}`
            const invalid = missing.includes(f.id)
            const set = (v: string) => {
              setValues({ ...values, [f.id]: v })
              setMissing(missing.filter((m) => m !== f.id))
            }
            return (
              <div key={f.id}>
                <label htmlFor={fid} className="text-sm font-medium text-heading">
                  {f.label}
                  {!f.required && <span className="font-normal text-muted"> ({t('form.optional')})</span>}
                </label>
                {f.kind === 'textarea' ? (
                  <textarea id={fid} rows={4} value={values[f.id] ?? ''} onChange={(e) => set(e.target.value)} aria-invalid={invalid} className={field} />
                ) : f.kind === 'choice' ? (
                  <select id={fid} value={values[f.id] ?? ''} onChange={(e) => set(e.target.value)} aria-invalid={invalid} className={field}>
                    <option value="">{t('form.choose')}</option>
                    {f.options?.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input id={fid} value={values[f.id] ?? ''} onChange={(e) => set(e.target.value)} aria-invalid={invalid} className={field} />
                )}
                {invalid && <p className="mt-1 text-sm text-danger">{t('form.required')}</p>}
              </div>
            )
          })}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className={button}>
              {t('form.send')}
            </button>
            <span className="text-sm text-muted">{t('form.privacy')}</span>
          </div>
        </form>
      )}
    </section>
  )
}

export const formatEventTime = (startsAt: number, endsAt: number | undefined, locale: string) => {
  const date = new Date(startsAt).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  const time = (ts: number) => new Date(ts).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
  return endsAt ? `${date}, ${time(startsAt)}–${time(endsAt)}` : `${date}, ${time(startsAt)}`
}

/** Event with sign-up; shows places left and, for editors, the number of sign-ups. */
export function EventBlock({ block }: { block: Of<'event'> }) {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const id = useId()
  const attendees = state.eventRegistrations[block.id] ?? []
  const going = !!me && attendees.includes(me.id)
  const left = block.capacity !== undefined ? Math.max(0, block.capacity - attendees.length) : undefined
  const full = left === 0 && !going
  const past = (block.endsAt ?? block.startsAt) < Date.now()
  const day = new Date(block.startsAt)

  return (
    <section className={`${card} flex gap-4`} aria-labelledby={`${id}-title`}>
      <div className="flex w-14 shrink-0 flex-col items-center self-start overflow-hidden rounded-lg border border-border text-center" aria-hidden="true">
        <span className="w-full bg-c-orange py-0.5 text-[11px] font-bold tracking-wide text-[#1c1305] uppercase">
          {day.toLocaleDateString(locale, { month: 'short' }).replace('.', '')}
        </span>
        <span className="py-1 text-2xl font-light text-heading">{day.getDate()}</span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium tracking-wide text-muted uppercase">{t('event.label')}</p>
        <h3 id={`${id}-title`} className="mt-0.5 text-lg font-medium text-heading">
          {block.title}
        </h3>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-text">
          <CalendarDays className="size-4 shrink-0 text-muted" aria-hidden="true" />
          {formatEventTime(block.startsAt, block.endsAt, locale)}
        </p>
        <p className="mt-0.5 flex items-center gap-1.5 text-sm text-text">
          <MapPin className="size-4 shrink-0 text-muted" aria-hidden="true" />
          {block.location}
        </p>
        {block.description && <p className="mt-2 text-[15px] text-text">{block.description}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {!past && (
            <button
              type="button"
              onClick={() => actions.toggleEventRegistration(block.id)}
              disabled={full}
              aria-pressed={going}
              className={going ? 'rounded-lg border border-border px-4 py-2 text-sm font-medium text-primary hover:bg-surface-2' : button}
            >
              {going ? t('event.cancel') : full ? t('event.full') : t('event.signUp')}
            </button>
          )}
          {going && (
            <span className="flex items-center gap-1.5 text-sm font-medium text-c-sage-text">
              <Check className="size-4" aria-hidden="true" />
              {t('event.going')}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-sm text-muted">
            <Users className="size-4" aria-hidden="true" />
            {left !== undefined ? t('event.placesLeft', { n: left }) : t('event.attendees', { n: attendees.length })}
            {left !== undefined && canEditContent(me) && ` · ${t('event.attendees', { n: attendees.length })}`}
          </span>
        </div>
      </div>
    </section>
  )
}
