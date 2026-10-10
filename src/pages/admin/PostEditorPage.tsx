import { ExternalLink, Trash2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { ImageField } from '../../components/editor/fields'
import { fieldClass } from '../../components/ImagePicker'
import { PageHeader } from '../../components/layout/PageHeader'
import type { ImageRef, Lang, PostContent } from '../../data/types'
import { LANGUAGES, useT } from '../../lib/preferences'
import { canEditContent } from '../../store/permissions'
import { useStore } from '../../store/StoreProvider'

const toForm = (c: PostContent | undefined) => ({ title: c?.title ?? '', intro: c?.intro ?? '', body: c?.body.join('\n\n') ?? '' })

export function PostEditorPage() {
  const t = useT()
  const { postId = '' } = useParams()
  const navigate = useNavigate()
  const { state, me, actions } = useStore()
  const post = state.posts.find((p) => p.id === postId)
  const [lang, setLang] = useState<Lang>('nl')
  const [forms, setForms] = useState(() => ({
    nl: toForm(post),
    en: toForm(post?.translations?.en),
    de: toForm(post?.translations?.de),
  }))
  const [image, setImage] = useState<ImageRef | undefined>(post?.image)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (!canEditContent(me)) return <Navigate to="/" replace />
  if (!post) return <Navigate to="/beheer" replace />

  const form = forms[lang]
  const update = (key: keyof typeof form) => (e: { target: { value: string } }) => {
    setForms({ ...forms, [lang]: { ...form, [key]: e.target.value } })
    setSaved(false)
    setError(false)
  }
  const exists = lang === 'nl' || !!post.translations?.[lang]

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return setError(true)
    actions.updatePost(post.id, lang, { title: form.title, intro: form.intro, body: form.body.split(/\n\s*\n/) }, lang === 'nl' ? image : undefined)
    setSaved(true)
  }

  return (
    <>
      <PageHeader
        title={t('postEdit.title')}
        backTo="/beheer"
        actions={
          <Link to={`/news/${post.id}`} aria-label={t('postEdit.view')} className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2">
            <ExternalLink className="size-5" aria-hidden="true" />
          </Link>
        }
      />
      <form onSubmit={submit} noValidate className="mx-auto max-w-2xl space-y-5 px-4 pt-4 lg:pt-0">
        <div role="tablist" aria-label={t('admin.translations')} className="flex gap-1 rounded-xl bg-surface-2 p-1">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => {
                setLang(l)
                setSaved(false)
              }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${lang === l ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
            >
              {t(`lang.${l}`)}
              {l !== 'nl' && !post.translations?.[l] && <span className="ml-1 text-xs font-normal">({t('editor.missing')})</span>}
            </button>
          ))}
        </div>

        {!exists && !form.title && (
          <div className="rounded-xl border border-dashed border-border bg-surface p-4 text-center">
            <p className="text-sm text-muted">{t('editor.notTranslated')}</p>
            <button
              type="button"
              onClick={() => setForms({ ...forms, [lang]: { ...forms.nl } })}
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
            >
              {t('editor.copyFromNl')}
            </button>
          </div>
        )}

        <div>
          <label htmlFor="pe-title" className="text-sm font-medium text-heading">
            {t('compose.titleLabel')}
          </label>
          <input id="pe-title" value={form.title} onChange={update('title')} aria-invalid={error} className={fieldClass} />
          {error && <p className="mt-1 text-sm text-danger">{t('compose.required')}</p>}
        </div>
        <div>
          <label htmlFor="pe-intro" className="text-sm font-medium text-heading">
            {t('compose.intro')}
          </label>
          <textarea id="pe-intro" rows={2} value={form.intro} onChange={update('intro')} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="pe-body" className="text-sm font-medium text-heading">
            {t('compose.body')}
          </label>
          <textarea id="pe-body" rows={10} value={form.body} onChange={update('body')} aria-describedby="pe-body-hint" className={fieldClass} />
          <p id="pe-body-hint" className="mt-1 text-xs text-muted">
            {t('compose.bodyHint')}
          </p>
        </div>

        {lang === 'nl' && image && (
          <div>
            <p className="mb-1.5 text-sm font-medium text-heading">{t('compose.artwork')}</p>
            <ImageField value={image} onChange={(next) => (setImage(next), setSaved(false))} />
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
          <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-1.5 text-sm font-medium text-danger">
            <Trash2 className="size-4" aria-hidden="true" />
            {t('postEdit.delete')}
          </button>
          {lang !== 'nl' && post.translations?.[lang] && (
            <button
              type="button"
              onClick={() => {
                actions.removePostTranslation(post.id, lang)
                setForms({ ...forms, [lang]: toForm(undefined) })
              }}
              className="text-sm font-medium text-danger"
            >
              {t('editor.removeTranslation')}
            </button>
          )}
          <span className="flex-1" />
          <span role="status" className="text-sm text-[#00563f] dark:text-[#8cc9a6]">
            {saved && t('postEdit.saved')}
          </span>
          <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover">
            {t('postEdit.save')}
          </button>
        </div>
      </form>

      <ConfirmDialog
        open={confirmDelete}
        title={t('postEdit.delete')}
        message={t('postEdit.deleteConfirm')}
        confirmLabel={t('postEdit.delete')}
        onConfirm={() => {
          actions.deletePost(post.id)
          navigate('/beheer', { replace: true })
        }}
        onClose={() => setConfirmDelete(false)}
      />
    </>
  )
}
