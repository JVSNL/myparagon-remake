import { useT } from '../lib/preferences'
import { Sheet } from './Sheet'

interface Props {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onClose: () => void
}

/** In-app confirmation; native confirm() is blocked in embedded viewers and looks out of place. */
export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }: Props) {
  const t = useT()
  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <p className="text-[15px] text-text">{message}</p>
      <div className="mt-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg px-4 py-2.5 text-sm font-medium text-muted hover:bg-surface-2"
        >
          {t('comments.cancel')}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm()
            onClose()
          }}
          className="rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 dark:text-bg"
        >
          {confirmLabel}
        </button>
      </div>
    </Sheet>
  )
}
