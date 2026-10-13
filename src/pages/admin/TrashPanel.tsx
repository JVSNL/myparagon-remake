import { FileText, Newspaper, RotateCcw, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ConfirmDialog } from '../../components/ConfirmDialog'
import type { TrashItem } from '../../data/types'
import { pick } from '../../lib/localized'
import { usePreferences } from '../../lib/preferences'
import { fullName, userById } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const titleOf = (item: TrashItem, locale: 'nl' | 'en' | 'de') => (item.kind === 'post' ? item.post.title : pick(item.page.title, locale))

/** Deleted posts and pages; editors restore them or delete them for good. */
export function TrashPanel() {
  const { t, locale } = usePreferences()
  const { state, actions } = useStore()
  const [purging, setPurging] = useState<TrashItem | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  if (state.trash.length === 0) return <p className="py-10 text-center text-muted">{t('trash.empty')}</p>

  const restore = (item: TrashItem) => {
    // A page whose address was reused in the meantime cannot come back as is (the reducer refuses too).
    if (item.kind === 'page' && state.pages.some((p) => p.slug === item.page.slug)) {
      setMessage(t('trash.slugTaken', { slug: item.page.slug }))
      return
    }
    actions.restoreFromTrash(item.id)
    setMessage(t('trash.restored', { title: titleOf(item, locale) }))
  }

  return (
    <>
      <p className="mb-3 text-sm text-muted">{t('trash.hint')}</p>
      {message && (
        <p role="status" className="mb-3 rounded-lg bg-primary-soft px-3 py-2 text-sm text-text">
          {message}
        </p>
      )}
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {state.trash.map((item) => {
          const Icon = item.kind === 'post' ? Newspaper : FileText
          const by = userById(state, item.deletedBy)
          return (
            <li key={item.id} className="flex items-center gap-3 px-4 py-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-muted">
                <Icon className="size-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-heading">{titleOf(item, locale)}</span>
                <span className="block truncate text-xs text-muted">
                  {t(item.kind === 'post' ? 'trash.post' : 'trash.page')} ·{' '}
                  {t('trash.deletedBy', {
                    name: by ? fullName(by) : '?',
                    date: new Date(item.deletedAt).toLocaleDateString(locale, { day: 'numeric', month: 'short' }),
                  })}
                </span>
              </span>
              <button
                type="button"
                onClick={() => restore(item)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-medium text-primary hover:bg-surface-2"
              >
                <RotateCcw className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t('trash.restore')}</span>
                <span className="sr-only sm:hidden">{t('trash.restore')}</span>
              </button>
              <button
                type="button"
                onClick={() => setPurging(item)}
                aria-label={`${t('trash.purge')}: ${titleOf(item, locale)}`}
                className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-surface-2 hover:text-danger"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </li>
          )
        })}
      </ul>
      <ConfirmDialog
        open={purging !== null}
        title={t('trash.purge')}
        message={t('trash.purgeConfirm', { title: purging ? titleOf(purging, locale) : '' })}
        confirmLabel={t('trash.purge')}
        onConfirm={() => purging && actions.purgeFromTrash(purging.id)}
        onClose={() => setPurging(null)}
      />
    </>
  )
}
