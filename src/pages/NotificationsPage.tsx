import { BellOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import { usePreferences } from '../lib/preferences'
import { formatFull, formatRelative } from '../lib/time'
import { useNow } from '../lib/useNow'
import { fullName, notificationsFor, unreadCount, userById } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function NotificationsPage() {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const now = useNow()
  if (!me) return null
  const items = notificationsFor(state, me.id)
  const unread = unreadCount(state, me.id)

  return (
    <>
      <PageHeader
        title={t('notifications.title')}
        backTo="/"
        actions={
          unread > 0 && (
            <button
              type="button"
              onClick={actions.markAllNotificationsRead}
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2 sm:block"
            >
              {t('notifications.markAll')}
            </button>
          )
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        {unread > 0 && (
          <div className="mb-3 flex items-center justify-between sm:hidden">
            <p className="text-sm text-muted">{t('notifications.unread', { n: unread })}</p>
            <button type="button" onClick={actions.markAllNotificationsRead} className="text-sm font-medium text-primary">
              {t('notifications.markAll')}
            </button>
          </div>
        )}
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <BellOff className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="mx-auto mt-3 max-w-xs text-muted">{t('notifications.empty')}</p>
          </div>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {items.map((n) => {
              const actor = userById(state, n.actorId)
              const post = n.postId ? state.posts.find((p) => p.id === n.postId) : undefined
              const question = n.questionId ? state.questions.find((q) => q.id === n.questionId) : undefined
              const href = question
                ? `/ask#q-${question.id}`
                : n.commentId
                  ? `/news/${n.postId}?comment=${n.commentId}`
                  : `/news/${n.postId}`
              const subject = post?.title ?? question?.text
              return (
                <li key={n.id}>
                  <Link
                    to={href}
                    onClick={() => actions.markNotificationRead(n.id)}
                    className={`flex gap-3 px-4 py-3.5 hover:bg-surface-2 ${n.read ? '' : 'bg-primary-soft/50'}`}
                  >
                    {actor && <Avatar user={actor} size="md" />}
                    <span className="min-w-0 flex-1">
                      <span className="block text-[15px] text-text">
                        {t(`notifications.${n.type}`, { name: actor ? fullName(actor) : '?' })}
                      </span>
                      {subject && <span className="block truncate text-sm text-muted">{subject}</span>}
                      <time
                        className="mt-0.5 block text-xs text-muted"
                        dateTime={new Date(n.createdAt).toISOString()}
                        title={formatFull(n.createdAt, locale)}
                      >
                        {formatRelative(n.createdAt, now, locale)}
                      </time>
                    </span>
                    {!n.read && <span className="mt-2 size-2.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
