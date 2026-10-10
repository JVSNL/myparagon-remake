import { useParams } from 'react-router-dom'
import { BlockView } from '../components/blocks/BlockView'
import { PageHeader } from '../components/layout/PageHeader'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

export function ContentPage() {
  const { slug = '' } = useParams()
  const { t, locale } = usePreferences()
  const { state } = useStore()
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
      <PageHeader title={pick(page.title, locale)} backTo={page.section === 'general' ? '/general' : '/menu'} />
      <article className="mx-auto max-w-2xl space-y-8 px-4 pt-4 lg:pt-0">
        {blocks.map((block) => (
          <BlockView key={block.id} block={block} />
        ))}
        <p className="border-t border-border pt-4 text-xs text-muted">{t('page.updated', { date: updated })}</p>
      </article>
    </>
  )
}
