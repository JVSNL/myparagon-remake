import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { pageIcon } from '../components/pageIcons'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

export function StoriesPage() {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const stories = state.pages.filter((p) => p.section === 'story')

  return (
    <>
      <PageHeader title={t('stories.title')} backTo="/menu" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <p className="mb-4 px-1 text-muted">{t('stories.intro')}</p>
        <ListGroup>
          {stories.map((page) => (
            <ListRow key={page.id} icon={pageIcon(page.icon)} label={pick(page.title, locale)} to={`/pages/${page.slug}`} />
          ))}
        </ListGroup>
      </div>
    </>
  )
}
