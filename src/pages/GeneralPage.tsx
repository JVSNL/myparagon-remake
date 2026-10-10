import { MessagesSquare, Send } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { pageIcon } from '../components/pageIcons'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { unreadChats } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function GeneralPage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const unread = me ? unreadChats(state, me.id) : 0
  const general = state.pages.filter((p) => p.section === 'general')

  return (
    <>
      <PageHeader title={t('general.title')} showLogo />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <ListGroup title={t('general.contact')}>
          <ListRow icon={Send} label={t('general.askBoard')} to="/ask-the-board" />
          <ListRow
            icon={MessagesSquare}
            label={t('general.chat')}
            to="/chat"
            detail={unread > 0 ? t('chat.unread', { n: unread }) : undefined}
          />
        </ListGroup>
        <ListGroup title={t('general.help')}>
          {general.map((page) => (
            <ListRow key={page.id} icon={pageIcon(page.icon)} label={pick(page.title, locale)} to={`/pages/${page.slug}`} />
          ))}
        </ListGroup>
      </div>
    </>
  )
}
