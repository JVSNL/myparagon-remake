import { Bell, Bookmark, BookOpen, MapPin, Network, Settings, UserRound, Users } from 'lucide-react'
import { pageIcon } from '../components/pageIcons'
import { colorAt } from '../lib/colors'
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
          <ListRow icon={Users} label={t('menu.whoiswho')} to="/people" color="royal" />
          <ListRow icon={Network} label={t('org.title')} to="/org" color="sky" />
          <ListRow icon={UserRound} label={t('menu.profile')} to="/profile" color="berry" />
        </ListGroup>

        <ListGroup title={t('menu.divisions')}>
          {state.pages
            .filter((p) => p.section === 'division')
            .map((page, i) => (
              <ListRow
                key={page.id}
                icon={pageIcon(page.icon)}
                label={pick(page.title, locale)}
                to={`/pages/${page.slug}`}
                color={(['navy', 'orange', 'sage'] as const)[i % 3]}
              />
            ))}
        </ListGroup>

        <ListGroup title={t('menu.company')}>
          {state.pages
            .filter((p) => p.section === 'company')
            .map((page, i) => (
              <ListRow key={page.id} icon={pageIcon(page.icon)} label={pick(page.title, locale)} to={`/pages/${page.slug}`} color={colorAt(i + 2)} />
            ))}
          <ListRow icon={BookOpen} label={t('menu.stories')} to="/stories" color="orange" />
          <ListRow icon={MapPin} label={t('menu.locations')} to="/locations" color="sienna" />
        </ListGroup>

        <ListGroup>
          <ListRow icon={Bookmark} label={t('nav.bookmarks')} to="/bookmarks" color="orange" />
          <ListRow
            icon={Bell}
            label={t('nav.notifications')}
            to="/notifications"
            color="royal"
            detail={unread > 0 ? t('notifications.unread', { n: unread }) : undefined}
          />
          <ListRow icon={Settings} label={t('nav.settings')} to="/settings" color="navy" />
        </ListGroup>

      </div>
    </>
  )
}
