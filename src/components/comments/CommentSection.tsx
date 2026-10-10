import { useState, type Ref } from 'react'
import type { Comment } from '../../data/types'
import { usePreferences } from '../../lib/preferences'
import { useNow } from '../../lib/useNow'
import { commentCount, commentsFor, commentThreads, fullName, userById } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { CommentForm } from './CommentForm'
import { CommentItem } from './CommentItem'

const INITIAL_THREADS = 3

interface Props {
  postId: string
  /** Comment to highlight, e.g. when arriving from a notification. */
  highlightId?: string | null
  formRef?: Ref<HTMLDivElement>
}

export function CommentSection({ postId, highlightId, formRef }: Props) {
  const { t, locale } = usePreferences()
  const { state, actions } = useStore()
  const now = useNow()
  const threads = commentThreads(commentsFor(state, postId))
  const [showAll, setShowAll] = useState(false)
  const [replyTo, setReplyTo] = useState<Comment | null>(null)

  // A highlighted comment must be visible, so show everything in that case.
  const expanded = showAll || !!highlightId
  const hidden = expanded ? 0 : Math.max(0, threads.length - INITIAL_THREADS)
  const visible = threads.slice(hidden)
  const replyThreadId = replyTo ? (replyTo.parentId ?? replyTo.id) : null
  const replyAuthor = replyTo ? userById(state, replyTo.authorId) : undefined

  return (
    <section aria-labelledby="comments-heading" className="mt-8">
      <h2 id="comments-heading" className="mb-4 text-lg font-medium text-heading">
        {t('comments.title')} <span className="text-muted">({commentCount(state, postId)})</span>
      </h2>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mb-4 w-full rounded-lg border border-border bg-surface py-2 text-sm font-medium text-primary hover:bg-surface-2"
        >
          {t('comments.showOlder', { n: hidden })}
        </button>
      )}

      {threads.length === 0 && <p className="mb-6 text-sm text-muted">{t('comments.empty')}</p>}

      <ul className="space-y-5">
        {visible.map(({ comment, replies }) => (
          <li key={comment.id}>
            <CommentItem comment={comment} now={now} onReply={setReplyTo} highlighted={comment.id === highlightId} />
            {(replies.length > 0 || replyThreadId === comment.id) && (
              <ul className="mt-3 ml-[52px] space-y-3 border-l-2 border-border pl-4">
                {replies.map((reply) => (
                  <li key={reply.id}>
                    <CommentItem comment={reply} now={now} onReply={setReplyTo} highlighted={reply.id === highlightId} />
                  </li>
                ))}
                {replyThreadId === comment.id && (
                  <li>
                    {replyAuthor && (
                      <p className="mb-1.5 text-xs text-muted">{t('comments.replyingTo', { name: fullName(replyAuthor) })}</p>
                    )}
                    <CommentForm
                      autoFocus
                      placeholder={t('comments.replyPlaceholder')}
                      onCancel={() => setReplyTo(null)}
                      onSubmit={(text) => {
                        actions.addComment(postId, text, replyTo?.id ?? null, locale)
                        setReplyTo(null)
                      }}
                    />
                  </li>
                )}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div ref={formRef} className="mt-6 border-t border-border pt-5">
        <CommentForm placeholder={t('comments.placeholder')} onSubmit={(text) => actions.addComment(postId, text, null, locale)} />
      </div>
    </section>
  )
}
