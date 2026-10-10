import { Ellipsis, Pencil, ThumbsUp, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Comment } from '../../data/types'
import { usePreferences } from '../../lib/preferences'
import { formatFull, formatRelative } from '../../lib/time'
import { canDeleteComment, canEditComment } from '../../store/permissions'
import { fullName, userById } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { Avatar } from '../Avatar'
import { CommentForm } from './CommentForm'

interface Props {
  comment: Comment
  now: number
  onReply: (comment: Comment) => void
  highlighted?: boolean
}

export function CommentItem({ comment, now, onReply, highlighted }: Props) {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const [editing, setEditing] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const author = userById(state, comment.authorId)
  const name = author ? fullName(author) : '?'
  const liked = !!me && comment.likes.includes(me.id)
  const canEdit = canEditComment(me, comment)
  const canDelete = canDeleteComment(me, comment)

  useEffect(() => {
    if (!menuOpen) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !menuRef.current?.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [menuOpen])

  if (comment.deleted) {
    return <p className="rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted italic">{t('comments.deleted')}</p>
  }

  return (
    <div id={`comment-${comment.id}`} className={`flex gap-3 rounded-xl ${highlighted ? 'bg-primary-soft/60 -m-2 p-2' : ''}`}>
      {author && <Avatar user={author} size="md" />}
      <div className="min-w-0 flex-1">
        {editing ? (
          <CommentForm
            compact
            autoFocus
            initialText={comment.text}
            placeholder={t('comments.placeholder')}
            submitLabel={t('comments.save')}
            onCancel={() => setEditing(false)}
            onSubmit={(text) => {
              actions.editComment(comment.id, text)
              setEditing(false)
            }}
          />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-2.5">
                <p className="text-sm font-medium text-heading">{name}</p>
                <p className="text-[15px] break-words whitespace-pre-line text-text">{comment.text}</p>
              </div>
              {(canEdit || canDelete) && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    aria-label={t('comments.options', { name })}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((o) => !o)}
                    className="flex size-8 items-center justify-center rounded-full text-muted hover:bg-surface-2"
                  >
                    <Ellipsis className="size-5" aria-hidden="true" />
                  </button>
                  {menuOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 z-10 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-card"
                    >
                      {canEdit && (
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setMenuOpen(false)
                            setEditing(true)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-2"
                        >
                          <Pencil className="size-4" aria-hidden="true" />
                          {t('comments.edit')}
                        </button>
                      )}
                      {canDelete && (
                        <button
                          role="menuitem"
                          type="button"
                          onClick={() => {
                            setMenuOpen(false)
                            if (window.confirm(t('comments.confirmDelete'))) actions.deleteComment(comment.id)
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-surface-2"
                        >
                          <Trash2 className="size-4" aria-hidden="true" />
                          {t('comments.delete')}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 pl-1 text-[13px] text-muted">
              <button
                type="button"
                onClick={() => actions.toggleCommentLike(comment.id)}
                aria-pressed={liked}
                className={`font-medium hover:underline ${liked ? 'text-primary' : ''}`}
              >
                {t('comments.like')}
              </button>
              <button type="button" onClick={() => onReply(comment)} className="font-medium hover:underline">
                {t('comments.reply')}
              </button>
              {comment.likes.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <ThumbsUp className="size-3.5 text-primary" aria-hidden="true" />
                  <span className="sr-only">{t('comments.likes', { n: comment.likes.length })}</span>
                  <span aria-hidden="true">{comment.likes.length}</span>
                </span>
              )}
              <time dateTime={new Date(comment.createdAt).toISOString()} title={formatFull(comment.createdAt, locale)}>
                {formatRelative(comment.createdAt, now, locale)}
              </time>
              {comment.editedAt && <span>· {t('comments.edited')}</span>}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
