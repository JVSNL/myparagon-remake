import { ArrowDown, ArrowUp, Copy, ExternalLink, History, Monitor, Plus, Trash2 } from 'lucide-react'
import { useEffect, useId, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { BlockView } from '../../components/blocks/BlockView'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import { BLOCK_TYPES, BlockEditor, createBlock } from '../../components/editor/BlockEditor'
import { smallField } from '../../components/editor/fields'
import { PageHeader } from '../../components/layout/PageHeader'
import type { Block, BlockType, Lang, PageContent } from '../../data/types'
import { LANGUAGES, usePreferences } from '../../lib/preferences'
import { canEditContent } from '../../store/permissions'
import { fullName } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const blockId = (lang: Lang) => `${lang}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function PageEditorPage() {
  const { pageId = '' } = useParams()
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const page = state.pages.find((p) => p.id === pageId)
  const source: PageContent | null = page ? (page.draft ?? { title: page.title, blocks: page.blocks }) : null
  const [content, setContent] = useState<PageContent | null>(source)
  const [lang, setLang] = useState<Lang>('nl')
  const [addType, setAddType] = useState<BlockType>('text')
  const [message, setMessage] = useState<string | null>(null)
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const [titleError, setTitleError] = useState(false)
  const addId = useId()

  // Pick up a restored version or a discarded draft.
  const sourceKey = JSON.stringify(source)
  useEffect(() => {
    setContent(source)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when the stored content changes
  }, [sourceKey])

  const dirty = useMemo(() => JSON.stringify(content) !== sourceKey, [content, sourceKey])

  if (!canEditContent(me)) return <Navigate to="/" replace />
  if (!page || !content) return <Navigate to="/beheer" replace />

  const blocks = content.blocks[lang]
  const setBlocks = (next: Block[] | undefined) => {
    const all = { ...content.blocks } as PageContent['blocks']
    if (next === undefined && lang !== 'nl') delete all[lang]
    else all[lang] = next ?? []
    setContent({ ...content, blocks: all })
    setMessage(null)
  }
  const setTitle = (value: string) => {
    setContent({ ...content, title: { ...content.title, [lang]: value } })
    setTitleError(false)
    setMessage(null)
  }

  const move = (i: number, by: number) => {
    if (!blocks) return
    const next = [...blocks]
    ;[next[i], next[i + by]] = [next[i + by], next[i]]
    setBlocks(next)
  }

  const save = () => {
    actions.savePageDraft(page.id, content)
    setMessage(t('editor.saved'))
  }

  const publish = () => {
    if (!content.title.nl.trim()) return setTitleError(true)
    actions.savePageDraft(page.id, content)
    actions.publishPage(page.id)
    setMessage(t('editor.published'))
  }

  const hasDraft = !!page.draft || dirty
  const previewBlocks = blocks ?? content.blocks.nl
  const author = state.users.find((u) => u.id === page.updatedBy)
  const button = 'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium'

  return (
    <>
      <PageHeader title={t('editor.pageTitle')} backTo="/beheer" />
      <div className="mx-auto max-w-6xl px-4 pt-4 lg:pt-0">
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-border bg-surface p-3 text-sm text-muted lg:hidden">
          <Monitor className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {t('editor.mobileText')}
        </div>

        {/* Action bar */}
        <div className="sticky top-[calc(56px+env(safe-area-inset-top))] z-10 -mx-4 mb-4 flex flex-wrap items-center gap-2 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur lg:top-0">
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
              hasDraft ? 'bg-accent/20 text-heading' : 'bg-[#007059]/12 text-[#00563f] dark:text-[#8cc9a6]'
            }`}
          >
            {hasDraft ? t('admin.draft') : t('admin.published')}
            {dirty && ` · ${t('editor.unsaved')}`}
          </span>
          <span className="hidden text-xs text-muted sm:inline">
            {t('admin.updated', {
              date: new Date(page.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
              name: author ? fullName(author) : '?',
            })}
          </span>
          <span className="flex-1" />
          <span role="status" className="text-sm text-[#00563f] dark:text-[#8cc9a6]">
            {message}
          </span>
          <Link to={`/pages/${page.slug}`} className={`${button} text-primary hover:bg-surface-2`}>
            <ExternalLink className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('postEdit.view')}</span>
          </Link>
          {page.draft && (
            <button type="button" onClick={() => setConfirmDiscard(true)} className={`${button} text-danger hover:bg-surface-2`}>
              {t('editor.discard')}
            </button>
          )}
          <button type="button" onClick={save} disabled={!dirty} className={`${button} border border-border bg-surface text-primary disabled:opacity-40`}>
            {t('editor.save')}
          </button>
          <button
            type="button"
            onClick={publish}
            disabled={!hasDraft}
            className={`${button} bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40`}
          >
            {t('editor.publish')}
          </button>
        </div>

        <p className="mb-4 text-sm text-muted">{t('editor.draftNote')}</p>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Editing column */}
          <div className="min-w-0">
            <div role="tablist" aria-label={t('admin.translations')} className="mb-4 flex gap-1 rounded-xl bg-surface-2 p-1">
              {LANGUAGES.map((l) => (
                <button
                  key={l}
                  type="button"
                  role="tab"
                  aria-selected={lang === l}
                  onClick={() => setLang(l)}
                  className={`flex-1 rounded-lg py-2 text-sm font-medium ${lang === l ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
                >
                  {t(`lang.${l}`)}
                  {l !== 'nl' && !content.blocks[l] && <span className="ml-1 text-xs font-normal">({t('editor.missing')})</span>}
                </button>
              ))}
            </div>

            <div role="tabpanel">
              <label htmlFor="page-title" className="text-sm font-medium text-heading">
                {t('editor.pageTitle')} ({t(`lang.${lang}`)})
              </label>
              <input
                id="page-title"
                value={content.title[lang] ?? ''}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={lang !== 'nl' ? content.title.nl : undefined}
                aria-invalid={titleError}
                className={`${smallField} !py-2.5 !text-base`}
              />
              {titleError && <p className="mt-1 text-sm text-danger">{t('editor.titleRequired')}</p>}

              {!blocks ? (
                <div className="mt-4 rounded-xl border border-dashed border-border bg-surface p-6 text-center">
                  <p className="text-sm text-muted">{t('editor.notTranslated')}</p>
                  <button
                    type="button"
                    onClick={() => setBlocks(content.blocks.nl.map((b) => ({ ...structuredClone(b), id: blockId(lang) })))}
                    className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary"
                  >
                    {t('editor.copyFromNl')}
                  </button>
                </div>
              ) : (
                <>
                  {blocks.length === 0 && <p className="mt-4 text-sm text-muted">{t('editor.empty')}</p>}
                  <ol className="mt-4 space-y-3">
                    {blocks.map((block, i) => (
                      <li key={block.id} className="rounded-xl border border-border bg-surface">
                        <div className="flex items-center gap-1 border-b border-border px-3 py-2">
                          <span className="flex-1 text-sm font-medium text-heading">{t(`block.${block.type}`)}</span>
                          {[
                            { label: t('editor.moveUp'), icon: ArrowUp, onClick: () => move(i, -1), disabled: i === 0 },
                            { label: t('editor.moveDown'), icon: ArrowDown, onClick: () => move(i, 1), disabled: i === blocks.length - 1 },
                            {
                              label: t('editor.duplicate'),
                              icon: Copy,
                              onClick: () => setBlocks([...blocks.slice(0, i + 1), { ...structuredClone(block), id: blockId(lang) }, ...blocks.slice(i + 1)]),
                              disabled: false,
                            },
                            { label: t('editor.removeBlock'), icon: Trash2, onClick: () => setBlocks(blocks.filter((_, j) => j !== i)), disabled: false },
                          ].map(({ label, icon: Icon, onClick, disabled }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={onClick}
                              disabled={disabled}
                              aria-label={`${label}: ${t(`block.${block.type}`)} ${i + 1}`}
                              title={label}
                              className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-text disabled:opacity-30"
                            >
                              <Icon className="size-4" aria-hidden="true" />
                            </button>
                          ))}
                        </div>
                        <div className="p-3">
                          <BlockEditor block={block} onChange={(next) => setBlocks(blocks.map((b, j) => (j === i ? next : b)))} />
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div className="mt-4 flex flex-wrap items-end gap-2 rounded-xl border border-dashed border-border p-3">
                    <div className="min-w-48 flex-1">
                      <label htmlFor={addId} className="text-xs font-medium text-heading">
                        {t('editor.addBlock')}
                      </label>
                      <select id={addId} value={addType} onChange={(e) => setAddType(e.target.value as BlockType)} className={smallField}>
                        {BLOCK_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {t(`block.${type}`)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBlocks([...blocks, createBlock(addType, blockId(lang))])}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-on-primary"
                    >
                      <Plus className="size-4" aria-hidden="true" />
                      {t('field.addItem')}
                    </button>
                  </div>

                  {lang !== 'nl' && (
                    <button type="button" onClick={() => setBlocks(undefined)} className="mt-3 text-sm font-medium text-danger">
                      {t('editor.removeTranslation')}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Preview and history */}
          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            <section aria-label={t('editor.preview')}>
              <h2 className="mb-2 text-sm font-medium text-heading">
                {t('editor.preview')} · {t(`lang.${lang}`)}
              </h2>
              <div className="mx-auto w-full max-w-[380px] overflow-hidden rounded-[2rem] border-[6px] border-heading/80 bg-bg shadow-card">
                <div className="border-b border-border bg-surface py-3 text-center text-sm font-medium text-heading">
                  {content.title[lang] || content.title.nl}
                </div>
                {/* Not interactive: the preview only shows how the page will look. */}
                <div inert className="h-[560px] space-y-5 overflow-y-auto p-3 text-[90%]">
                  {previewBlocks.map((block) => (
                    <BlockView key={block.id} block={block} />
                  ))}
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-medium text-heading">
                <History className="size-4" aria-hidden="true" />
                {t('editor.history')}
              </h2>
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface text-sm">
                <li className="flex items-center justify-between px-3 py-2.5">
                  <span>
                    <span className="block font-medium text-heading">{t('editor.current')}</span>
                    <span className="text-xs text-muted">
                      {new Date(page.updatedAt).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}
                    </span>
                  </span>
                </li>
                {page.history.length === 0 && <li className="px-3 py-2.5 text-xs text-muted">{t('editor.noHistory')}</li>}
                {page.history.map((version) => {
                  const by = state.users.find((u) => u.id === version.publishedBy)
                  return (
                    <li key={version.id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <span className="min-w-0">
                        <span className="block truncate text-heading">{version.title.nl}</span>
                        <span className="text-xs text-muted">
                          {new Date(version.publishedAt).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' })}
                          {by && ` · ${fullName(by)}`}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          actions.restorePageVersion(page.id, version.id)
                          setMessage(t('editor.restored'))
                        }}
                        className="shrink-0 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-surface-2"
                      >
                        {t('editor.restore')}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title={t('editor.discard')}
        message={t('editor.discardConfirm')}
        confirmLabel={t('editor.discard')}
        onConfirm={() => actions.discardPageDraft(page.id)}
        onClose={() => setConfirmDiscard(false)}
      />
    </>
  )
}
