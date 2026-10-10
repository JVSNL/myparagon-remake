import { Shuffle } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Artwork } from '../components/Artwork'
import { PageHeader } from '../components/layout/PageHeader'
import type { ArtworkPalette } from '../data/types'
import { useT } from '../lib/preferences'
import { canPublish } from '../store/permissions'
import { useStore } from '../store/StoreProvider'

const PALETTES: ArtworkPalette[] = ['navy', 'sky', 'sage', 'warm']

const fieldClass =
  'mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[15px] text-text focus:border-focus focus:ring-1 focus:ring-focus focus:outline-none'

export function ComposePage() {
  const t = useT()
  const { state, me, actions } = useStore()
  const navigate = useNavigate()
  const [channelId, setChannelId] = useState(state.channels[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [body, setBody] = useState('')
  const [palette, setPalette] = useState<ArtworkPalette>('navy')
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1000))
  const [error, setError] = useState(false)

  if (!canPublish(me)) {
    return (
      <>
        <PageHeader title={t('compose.title')} backTo="/" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('compose.noRights')}</p>
      </>
    )
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setError(true)
      return
    }
    const id = actions.createPost({
      channelId,
      title,
      intro,
      body: body.split(/\n\s*\n/),
      artwork: { seed, palette },
    })
    navigate(`/news/${id}`, { replace: true })
  }

  return (
    <>
      <PageHeader title={t('compose.title')} backTo="/" />
      <form onSubmit={submit} className="mx-auto max-w-2xl space-y-5 px-4 pt-4 lg:pt-0" noValidate>
        <div>
          <label htmlFor="channel" className="text-sm font-medium text-heading">
            {t('compose.channel')}
          </label>
          <select id="channel" value={channelId} onChange={(e) => setChannelId(e.target.value)} className={fieldClass}>
            {state.channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="title" className="text-sm font-medium text-heading">
            {t('compose.titleLabel')}
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              setError(false)
            }}
            aria-invalid={error}
            aria-describedby={error ? 'title-error' : undefined}
            className={fieldClass}
          />
          {error && (
            <p id="title-error" className="mt-1 text-sm text-danger">
              {t('compose.required')}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="intro" className="text-sm font-medium text-heading">
            {t('compose.intro')}
          </label>
          <textarea
            id="intro"
            rows={2}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
            aria-describedby="intro-hint"
            className={fieldClass}
          />
          <p id="intro-hint" className="mt-1 text-xs text-muted">
            {t('compose.introHint')}
          </p>
        </div>

        <div>
          <label htmlFor="body" className="text-sm font-medium text-heading">
            {t('compose.body')}
          </label>
          <textarea
            id="body"
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            aria-describedby="body-hint"
            className={fieldClass}
          />
          <p id="body-hint" className="mt-1 text-xs text-muted">
            {t('compose.bodyHint')}
          </p>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-heading">{t('compose.artwork')}</legend>
          <Artwork artwork={{ seed, palette }} className="mt-1.5 aspect-[16/9] w-full rounded-xl" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {PALETTES.map((p) => (
              <label key={p} className="cursor-pointer">
                <input
                  type="radio"
                  name="palette"
                  value={p}
                  checked={palette === p}
                  onChange={() => setPalette(p)}
                  className="peer sr-only"
                />
                <span className="sr-only">{t(`compose.palette.${p}`)}</span>
                <Artwork
                  artwork={{ seed, palette: p }}
                  className="block h-10 w-16 rounded-md ring-offset-2 ring-offset-bg peer-checked:ring-2 peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2"
            >
              <Shuffle className="size-4" aria-hidden="true" />
              {t('compose.shuffle')}
            </button>
          </div>
        </fieldset>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover"
          >
            {t('compose.publish')}
          </button>
        </div>
      </form>
    </>
  )
}
