import { lazy, Suspense, useState } from 'react'
import { usePreferences } from '../../lib/preferences'
import { Sheet } from '../Sheet'

// The full picker is large, so it is only loaded when someone asks for it.
const FullPicker = lazy(() => import('./FullEmojiPicker'))

export const QUICK_EMOJIS = ['👍', '🎉', '❤️', '💡', '🙏', '😂', '🚀']

interface Props {
  open: boolean
  onClose: () => void
  onPick: (emoji: string) => void
  /** Emojis the current user already reacted with. */
  selected: string[]
}

export function ReactionPicker({ open, onClose, onPick, selected }: Props) {
  const { t, isDark, locale } = usePreferences()
  const [showAll, setShowAll] = useState(false)

  const pick = (emoji: string) => {
    onPick(emoji)
    setShowAll(false)
    onClose()
  }

  return (
    <Sheet
      open={open}
      onClose={() => {
        setShowAll(false)
        onClose()
      }}
      title={t('reactions.title')}
    >
      <div className="grid grid-cols-7 gap-1">
        {QUICK_EMOJIS.map((emoji) => (
          <button
            key={emoji}
            type="button"
            onClick={() => pick(emoji)}
            aria-pressed={selected.includes(emoji)}
            aria-label={t('reactions.toggle', { emoji })}
            className={`flex aspect-square items-center justify-center rounded-xl text-2xl transition-transform hover:scale-110 ${
              selected.includes(emoji) ? 'bg-primary-soft ring-2 ring-primary' : 'hover:bg-surface-2'
            }`}
          >
            {emoji}
          </button>
        ))}
      </div>
      {showAll ? (
        <div className="mt-4">
          <Suspense fallback={<div className="h-[380px] animate-pulse rounded-xl bg-surface-2" />}>
            <FullPicker onPick={pick} dark={isDark} locale={locale} />
          </Suspense>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-4 w-full rounded-lg border border-border py-2.5 text-sm font-medium text-primary hover:bg-surface-2"
        >
          {t('reactions.more')}
        </button>
      )}
    </Sheet>
  )
}
