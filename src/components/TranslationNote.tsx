import { Languages } from 'lucide-react'
import { useT } from '../lib/preferences'
import type { Translated } from '../lib/useTranslated'

interface Props {
  translation: Translated
  className?: string
  /** Only the toggle, with the full note as its tooltip; for comments. */
  compact?: boolean
}

/** "Translated from Dutch · Show original", shown under translated content. */
export function TranslationNote({ translation, className = '', compact = false }: Props) {
  const t = useT()
  const { status, source, showingOriginal, toggle } = translation
  if (status === 'original') return null

  const canToggle = status === 'translated' || status === 'machine' || showingOriginal
  if (compact) {
    if (!canToggle) return null
    return (
      <button
        type="button"
        onClick={toggle}
        title={showingOriginal ? t(`translate.in.${source}`) : t(`translate.from.${source}`)}
        className={`inline-flex items-center gap-1 font-medium hover:underline ${className}`}
      >
        <Languages className="size-3.5" aria-hidden="true" />
        {showingOriginal ? t('translate.showTranslation') : t('translate.showOriginal')}
      </button>
    )
  }
  const label = showingOriginal
    ? t(`translate.in.${source}`)
    : status === 'pending'
      ? t('translate.pending')
      : status === 'unavailable'
        ? t(`translate.in.${source}`)
        : status === 'machine'
          ? `${t(`translate.from.${source}`)} (${t('translate.machine')})`
          : t(`translate.from.${source}`)

  return (
    <p className={`flex flex-wrap items-center gap-x-1.5 text-[13px] text-muted ${className}`} aria-live="polite">
      <Languages className="size-3.5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
      {canToggle && (
        <>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={toggle} className="font-medium text-link hover:underline">
            {showingOriginal ? t('translate.showTranslation') : t('translate.showOriginal')}
          </button>
        </>
      )}
    </p>
  )
}
