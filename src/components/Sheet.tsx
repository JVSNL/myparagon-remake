import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'
import { useT } from '../lib/preferences'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/**
 * Modal built on the native <dialog> element (focus trap and Escape for free).
 * Bottom sheet on mobile, centered dialog on larger screens.
 */
export function Sheet({ open, onClose, title, children }: Props) {
  const t = useT()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal?.()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className="m-0 mt-auto w-full max-w-none rounded-t-2xl bg-surface p-0 text-text shadow-card backdrop:bg-overlay sm:m-auto sm:w-[400px] sm:rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-base font-medium text-heading">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-surface-2"
          aria-label={t('common.close')}
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>
      <div className="pb-safe p-4">{open && children}</div>
    </dialog>
  )
}
