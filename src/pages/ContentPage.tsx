import { Monitor, Pencil } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Sheet } from '../components/Sheet'
import { canEditContent } from '../store/permissions'
import { BlockView } from '../components/blocks/BlockView'
import { PageHeader } from '../components/layout/PageHeader'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

export function ContentPage() {
  const { slug = '' } = useParams()
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const navigate = useNavigate()
  const [desktopHint, setDesktopHint] = useState(false)
  const page = state.pages.find((p) => p.slug === slug)

  if (!page) {
    return (
      <>
        <PageHeader title={t('nav.menu')} backTo="/menu" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('page.notFound')}</p>
      </>
    )
  }

  const blocks = pick(page.blocks, locale)
  const updated = new Date(page.updatedAt).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <>
      <PageHeader
        title={pick(page.title, locale)}
        backTo={page.section === 'general' ? '/general' : '/menu'}
        actions={
          canEditContent(me) && (
            <button
              type="button"
              aria-label={t('page.edit')}
              // Pages are edited on desktop; on a phone, explain that first.
              onClick={() =>
                window.matchMedia?.('(min-width: 1024px)').matches ? navigate(`/beheer/pages/${page.id}`) : setDesktopHint(true)
              }
              className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
            >
              <Pencil className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </button>
          )
        }
      />
      <article className="mx-auto max-w-2xl space-y-8 px-4 pt-4 lg:pt-0">
        {blocks.map((block) => (
          <BlockView key={block.id} block={block} />
        ))}
        <p className="border-t border-border pt-4 text-xs text-muted">{t('page.updated', { date: updated })}</p>
      </article>
      <Sheet open={desktopHint} onClose={() => setDesktopHint(false)} title={t('editor.mobileTitle')}>
        <div className="flex gap-3">
          <Monitor className="size-8 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
          <p className="text-[15px] text-text">{t('editor.mobileText')}</p>
        </div>
        <Link
          to={`/beheer/pages/${page.id}`}
          className="mt-5 block rounded-lg border border-border py-2.5 text-center text-sm font-medium text-primary hover:bg-surface-2"
        >
          {t('editor.openAnyway')}
        </Link>
      </Sheet>
    </>
  )
}
