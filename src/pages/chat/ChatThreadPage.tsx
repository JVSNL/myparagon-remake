import { Send } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { PageHeader } from '../../components/layout/PageHeader'
import { usePreferences } from '../../lib/preferences'
import { conversationTitle } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const dayKey = (ts: number) => new Date(ts).toDateString()

export function ChatThreadPage() {
  const { conversationId = '' } = useParams()
  const { t, locale } = usePreferences()
  const { state, me, actions, typing } = useStore()
  const [text, setText] = useState('')
  const conversation = state.conversations.find((c) => c.id === conversationId && me && c.memberIds.includes(me.id))
  const messages = state.messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => a.createdAt - b.createdAt)
  const typer = typing[conversationId] ? state.users.find((u) => u.id === typing[conversationId]) : undefined

  // Reading the thread marks it as read, also when new messages arrive while it is open.
  useEffect(() => {
    if (conversation) actions.markConversationRead(conversation.id)
  }, [conversation, messages.length, actions])

  // Scroll the page itself to the bottom: the composer and tab bar are sticky and would
  // otherwise cover the newest message.
  useEffect(() => {
    window.scrollTo({ top: document.documentElement.scrollHeight })
  }, [messages.length, typer])

  if (!conversation || !me) {
    return (
      <>
        <PageHeader title={t('chat.title')} backTo="/chat" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('chat.notFound')}</p>
      </>
    )
  }

  const other = conversation.kind === 'direct' ? state.users.find((u) => u.id === conversation.memberIds.find((id) => id !== me.id)) : undefined

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    actions.sendMessage(conversation.id, text)
    setText('')
  }

  const dayLabel = (ts: number) => {
    const today = new Date()
    const yesterday = new Date(Date.now() - 86_400_000)
    if (dayKey(ts) === today.toDateString()) return t('chat.today')
    if (dayKey(ts) === yesterday.toDateString()) return t('chat.yesterday')
    return new Date(ts).toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' })
  }

  return (
    <>
      <PageHeader title={conversationTitle(state, conversation, me.id)} backTo="/chat" />
      <div className="mx-auto flex max-w-2xl flex-col px-4 pt-3 lg:pt-0">
        <p className="mb-4 text-center text-xs text-muted">
          {other ? (
            <Link to={`/people/${other.id}`} className="text-link hover:underline">
              {other.jobTitle} · {other.location}
            </Link>
          ) : (
            t('chat.members', { n: conversation.memberIds.length })
          )}
        </p>

        {messages.length === 0 && <p className="py-10 text-center text-muted">{t('chat.noMessages')}</p>}

        <ol className="space-y-1.5" aria-live="polite">
          {messages.map((m, i) => {
            const mine = m.authorId === me.id
            const prev = messages[i - 1]
            const newDay = !prev || dayKey(prev.createdAt) !== dayKey(m.createdAt)
            const firstOfRun = newDay || prev.authorId !== m.authorId
            const author = state.users.find((u) => u.id === m.authorId)
            return (
              <li key={m.id}>
                {newDay && (
                  <p className="my-4 text-center text-xs font-medium tracking-wide text-muted uppercase">{dayLabel(m.createdAt)}</p>
                )}
                <div className={`flex items-end gap-2 ${mine ? 'justify-end' : ''} ${firstOfRun && !newDay ? 'mt-3' : ''}`}>
                  {!mine && conversation.kind === 'group' && (
                    <span className="w-8 shrink-0">{firstOfRun && author && <Avatar user={author} size="sm" />}</span>
                  )}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2 ${
                      mine ? 'rounded-br-md bg-primary text-on-primary' : 'rounded-bl-md bg-surface text-text shadow-card'
                    }`}
                  >
                    {!mine && conversation.kind === 'group' && firstOfRun && (
                      <p className="text-xs font-medium text-primary">{author?.firstName}</p>
                    )}
                    <p className="text-[15px] break-words whitespace-pre-line">{m.text}</p>
                    <p className={`mt-0.5 text-right text-[11px] ${mine ? 'text-on-primary/75' : 'text-muted'}`}>
                      {new Date(m.createdAt).toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
        {typer && <p className="mt-3 text-sm text-muted italic">{t('chat.typing', { name: typer.firstName })}</p>}
        <div className="h-4" />

        <form
          onSubmit={submit}
          className="sticky bottom-[calc(64px+env(safe-area-inset-bottom))] -mx-4 flex items-end gap-2 border-t border-border bg-bg/95 px-4 py-3 backdrop-blur lg:bottom-0"
        >
          <label htmlFor="chat-input" className="sr-only">
            {t('chat.placeholder')}
          </label>
          <textarea
            id="chat-input"
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) submit(e)
            }}
            placeholder={t('chat.placeholder')}
            className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-border bg-surface px-4 py-2.5 text-[15px] text-text placeholder:text-muted focus:border-focus focus:outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label={t('chat.send')}
            className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-40"
          >
            <Send className="size-5" aria-hidden="true" />
          </button>
        </form>
      </div>
    </>
  )
}
