import { SquarePen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { PageHeader } from '../../components/layout/PageHeader'
import { usePreferences } from '../../lib/preferences'
import { formatRelative } from '../../lib/time'
import { useNow } from '../../lib/useNow'
import { conversationsFor, conversationTitle } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

export function ChatListPage() {
  const { t, locale } = usePreferences()
  const { state, me, typing } = useStore()
  const now = useNow()
  if (!me) return null
  const items = conversationsFor(state, me.id)

  return (
    <>
      <PageHeader
        title={t('chat.title')}
        backTo="/general"
        actions={
          <Link
            to="/chat/new"
            aria-label={t('chat.new')}
            className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
          >
            <SquarePen className="size-[22px]" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        {items.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted">{t('chat.empty')}</p>
            <Link to="/chat/new" className="mt-4 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary">
              {t('chat.new')}
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {items.map(({ conversation, last, unread }) => {
              const other = state.users.find((u) => u.id === conversation.memberIds.find((id) => id !== me.id))
              const typer = typing[conversation.id] ? state.users.find((u) => u.id === typing[conversation.id]) : undefined
              const author = last && last.authorId === me.id ? `${t('chat.you')}: ` : last && conversation.kind === 'group'
                ? `${state.users.find((u) => u.id === last.authorId)?.firstName ?? ''}: `
                : ''
              return (
                <li key={conversation.id}>
                  <Link to={`/chat/${conversation.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                    {conversation.kind === 'direct' && other ? (
                      <Avatar user={other} size="lg" />
                    ) : (
                      <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Users className="size-6" aria-hidden="true" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className={`truncate text-heading ${unread ? 'font-bold' : 'font-medium'}`}>
                          {conversationTitle(state, conversation, me.id)}
                        </span>
                        {last && <span className="shrink-0 text-xs text-muted">{formatRelative(last.createdAt, now, locale)}</span>}
                      </span>
                      <span className="flex items-center justify-between gap-2">
                        <span className={`truncate text-sm ${unread ? 'text-text' : 'text-muted'}`}>
                          {typer ? (
                            <em className="text-primary">{t('chat.typing', { name: typer.firstName })}</em>
                          ) : (
                            last && `${author}${last.text}`
                          )}
                        </span>
                        {unread > 0 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-accent px-1.5 text-xs font-bold text-on-accent">
                            <span aria-hidden="true">{unread}</span>
                            <span className="sr-only">{t('chat.unread', { n: unread })}</span>
                          </span>
                        )}
                      </span>
                    </span>
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
