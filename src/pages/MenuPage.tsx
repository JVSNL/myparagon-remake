import { Bell, Bookmark, BookOpen, MapPin, Network, Settings, UserRound, Users } from 'lucide-react'
import { pageIcon } from '../components/pageIcons'
import { pick } from '../lib/localized'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { usePreferences } from '../lib/preferences'
import { fullName, unreadCount } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function MenuPage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  if (!me) return null
  const unread = unreadCount(state, me.id)

  return (
    <>
      <PageHeader title={t('menu.title')} showLogo />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <Link
          to="/profile"
          className="mb-6 flex items-center gap-4 rounded-xl border border-border bg-surface p-4 hover:bg-surface-2"
        >
          <Avatar user={me} size="lg" />
          <span className="min-w-0">
            <span className="block text-lg font-medium text-heading">{fullName(me)}</span>
            <span className="block text-sm text-muted">
              {me.jobTitle} · {t(`role.${me.role}`)}
            </span>
          </span>
        </Link>

        <ListGroup>
          <ListRow icon={Users} label={t('menu.whoiswho')} to="/people" />
          <ListRow icon={Network} label={t('org.title')} to="/org" />
          <ListRow icon={UserRound} label={t('menu.profile')} to="/profile" />
        </ListGroup>

        <ListGroup title={t('menu.divisions')}>
          {state.pages
            .filter((p) => p.section === 'division')
            .map((page) => (
              <ListRow key={page.id} icon={pageIcon(page.icon)} label={pick(page.title, locale)} to={`/pages/${page.slug}`} />
            ))}
        </ListGroup>

        <ListGroup title={t('menu.company')}>
          {state.pages
            .filter((p) => p.section === 'company')
            .map((page) => (
              <ListRow key={page.id} icon={pageIcon(page.icon)} label={pick(page.title, locale)} to={`/pages/${page.slug}`} />
            ))}
          <ListRow icon={BookOpen} label={t('menu.stories')} to="/stories" />
          <ListRow icon={MapPin} label={t('menu.locations')} to="/locations" />
        </ListGroup>

        <ListGroup>
          <ListRow icon={Bookmark} label={t('nav.bookmarks')} to="/bookmarks" />
          <ListRow
            icon={Bell}
            label={t('nav.notifications')}
            to="/notifications"
            detail={unread > 0 ? t('notifications.unread', { n: unread }) : undefined}
          />
          <ListRow icon={Settings} label={t('nav.settings')} to="/settings" />
        </ListGroup>

        <p className="px-1 text-sm text-muted">{t('menu.phaseNote')}</p>
      </div>
    </>
  )
}
