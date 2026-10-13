import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { fieldClass, ImagePicker } from '../components/ImagePicker'
import { PageHeader } from '../components/layout/PageHeader'
import { PostSettingsFields } from '../components/PostSettingsFields'
import type { ImageRef, RegionId } from '../data/types'
import { useNow } from '../lib/useNow'
import { usePreferences } from '../lib/preferences'
import { canPublish } from '../store/permissions'
import { useStore } from '../store/StoreProvider'

export function ComposePage() {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const navigate = useNavigate()
  const [channelId, setChannelId] = useState(state.channels[0]?.id ?? '')
  const [title, setTitle] = useState('')
  const [intro, setIntro] = useState('')
  const [body, setBody] = useState('')
  const [image, setImage] = useState<Extract<ImageRef, { kind: 'upload' }> | null>(null)
  const [error, setError] = useState(false)
  const [imageError, setImageError] = useState<'missing' | 'alt' | null>(null)
  const [audience, setAudience] = useState<RegionId[]>([])
  const [publishAt, setPublishAt] = useState<number | null>(null)
  const now = useNow()

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
    const problem = !image ? 'missing' : !image.alt.trim() ? 'alt' : null
    setError(!title.trim())
    setImageError(problem)
    if (!title.trim() || !image || problem) return
    const id = actions.createPost({
      channelId,
      title,
      intro,
      body: body.split(/\n\s*\n/),
      image,
      lang: locale,
      audience,
      ...(publishAt !== null ? { publishAt } : {}),
    })
    // A scheduled post is not in the feed yet: go to the editorial calendar instead.
    navigate(publishAt !== null && publishAt > Date.now() ? '/beheer?tab=calendar' : `/news/${id}`, { replace: true })
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

        <ImagePicker
          label={t('compose.artwork')}
          value={image}
          onChange={(next) => {
            setImage(next)
            setImageError(null)
          }}
          missingError={imageError === 'missing' ? t('compose.photoRequired') : null}
          altError={imageError === 'alt' ? t('compose.altRequired') : null}
        />

        <PostSettingsFields audience={audience} onAudienceChange={setAudience} publishAt={publishAt} onPublishAtChange={setPublishAt} now={now} />

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover"
          >
            {publishAt !== null ? t('schedule.submit') : t('compose.publish')}
          </button>
        </div>
      </form>
    </>
  )
}
