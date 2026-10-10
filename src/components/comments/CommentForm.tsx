import { Send } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useT } from '../../lib/preferences'
import { useStore } from '../../store/StoreProvider'
import { Avatar } from '../Avatar'

interface Props {
  onSubmit: (text: string) => void
  placeholder: string
  autoFocus?: boolean
  onCancel?: () => void
  initialText?: string
  submitLabel?: string
  /** Hide the avatar (used when editing in place). */
  compact?: boolean
}

export function CommentForm({ onSubmit, placeholder, autoFocus, onCancel, initialText = '', submitLabel, compact }: Props) {
  const t = useT()
  const { me } = useStore()
  const [text, setText] = useState(initialText)
  const ref = useRef<HTMLTextAreaElement>(null)
  const id = useId()

  useEffect(() => {
    if (autoFocus) ref.current?.focus()
  }, [autoFocus])

  // Grow with the content, up to a limit.
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [text])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText('')
  }

  return (
    <form onSubmit={submit} className="flex items-start gap-3">
      {!compact && me && <Avatar user={me} size="sm" />}
      <div className="min-w-0 flex-1 rounded-xl border border-border bg-surface focus-within:border-focus focus-within:ring-1 focus-within:ring-focus">
        <label htmlFor={id} className="sr-only">
          {t('comments.label')}
        </label>
        <textarea
          id={id}
          ref={ref}
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit(e)
            if (e.key === 'Escape' && onCancel) onCancel()
          }}
          placeholder={placeholder}
          className="block w-full resize-none bg-transparent px-3 py-2.5 text-[15px] text-text placeholder:text-muted focus:outline-none"
        />
        <div className="flex justify-end gap-2 px-2 pb-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:bg-surface-2"
            >
              {t('comments.cancel')}
            </button>
          )}
          <button
            type="submit"
            disabled={!text.trim()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-40"
          >
            {!submitLabel && <Send className="size-4" aria-hidden="true" />}
            {submitLabel ?? t('comments.send')}
          </button>
        </div>
      </div>
    </form>
  )
}
