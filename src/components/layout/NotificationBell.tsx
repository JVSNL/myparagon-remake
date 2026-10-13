import { Bell } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useT } from '../../lib/preferences'
import { useNow } from '../../lib/useNow'
import { unreadCount } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

export function NotificationBell() {
  const t = useT()
  const { state, me } = useStore()
  const now = useNow()
  const unread = me ? unreadCount(state, me.id, now) : 0
  const label = unread > 0 ? `${t('notifications.open')} — ${t('notifications.unread', { n: unread })}` : t('notifications.open')

  return (
    <Link
      to="/notifications"
      aria-label={label}
      className="relative flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
    >
      <Bell className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
      {unread > 0 && (
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-on-accent ring-2 ring-surface"
        >
          {unread > 99 ? '99+' : unread}
        </span>
      )}
    </Link>
  )
}
