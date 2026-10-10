import { Bell, Bookmark, BookOpen, MapPin, Settings, UserRound, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { useT } from '../lib/preferences'
import { fullName, unreadCount } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function MenuPage() {
  const t = useT()
  const { state, me } = useStore()
  if (!me) return null
  const unread = unreadCount(state, me.id)

  return (
    <>
      <PageHeader title={t('menu.title')} showLogo />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <Link
          to="/settings"
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
          <ListRow icon={Bookmark} label={t('nav.bookmarks')} to="/bookmarks" />
          <ListRow
            icon={Bell}
            label={t('nav.notifications')}
            to="/notifications"
            detail={unread > 0 ? t('notifications.unread', { n: unread }) : undefined}
          />
          <ListRow icon={Settings} label={t('nav.settings')} to="/settings" />
        </ListGroup>

        <ListGroup title={t('menu.soon')}>
          <ListRow icon={UserRound} label={t('menu.profile')} disabled />
          <ListRow icon={Users} label={t('menu.whoiswho')} disabled />
          <ListRow icon={BookOpen} label={t('menu.stories')} disabled />
          <ListRow icon={MapPin} label={t('menu.locations')} disabled />
        </ListGroup>
        <p className="px-1 text-sm text-muted">{t('menu.phaseNote')}</p>
      </div>
    </>
  )
}
