import { ImagePlus, Trash2 } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import type { ImageRef } from '../data/types'
import { compressImage, MAX_UPLOAD_BYTES, saveImage } from '../lib/imageStore'
import { useT } from '../lib/preferences'
import { PostImage } from './PostImage'

export const fieldClass =
  'mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[15px] text-text focus:border-focus focus:ring-1 focus:ring-focus focus:outline-none'

type Upload = Extract<ImageRef, { kind: 'upload' }>

interface Props {
  value: Upload | null
  onChange: (image: Upload | null) => void
  label: string
  /** Validation message: no photo chosen yet. */
  missingError?: string | null
  /** Validation message: the photo has no description. */
  altError?: string | null
}

const newImageId = () => `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Pick a photo from the device (camera or library). It is scaled down and stored locally. */
export function ImagePicker({ value, onChange, label, missingError, altError }: Props) {
  const t = useT()
  const id = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (file.size > MAX_UPLOAD_BYTES) return setError(t('compose.photoTooLarge'))
    setBusy(true)
    try {
      const blob = await compressImage(file)
      const ref: Upload = { kind: 'upload', id: newImageId(), alt: value?.alt ?? '' }
      await saveImage(ref.id, blob)
      onChange(ref)
    } catch {
      setError(t('compose.photoError'))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const shownError = error ?? missingError

  return (
    <div>
      <label htmlFor={`${id}-file`} className="text-sm font-medium text-heading">
        {label}
      </label>
      <input
        ref={fileRef}
        id={`${id}-file`}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-describedby={shownError ? `${id}-error` : undefined}
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {value ? (
        <>
          <PostImage image={value} className="mt-1.5 block aspect-[16/9] w-full rounded-xl" />
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2"
            >
              <ImagePlus className="size-4" aria-hidden="true" />
              {busy ? t('compose.processing') : t('compose.changePhoto')}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-danger hover:bg-surface-2"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              {t('compose.removePhoto')}
            </button>
          </div>
          <label htmlFor={`${id}-alt`} className="mt-4 block text-sm font-medium text-heading">
            {t('compose.alt')}
          </label>
          <input
            id={`${id}-alt`}
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            aria-invalid={!!altError}
            aria-describedby={`${id}-alt-hint`}
            className={fieldClass}
          />
          <p id={`${id}-alt-hint`} className={`mt-1 text-xs ${altError ? 'text-danger' : 'text-muted'}`}>
            {altError ?? t('compose.altHint')}
          </p>
        </>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className={`mt-1.5 flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-surface text-primary hover:bg-surface-2 ${
            missingError ? 'border-danger' : 'border-border'
          }`}
        >
          <ImagePlus className="size-8" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-sm font-medium">{busy ? t('compose.processing') : t('compose.choosePhoto')}</span>
          <span className="text-xs text-muted">{t('compose.photoNote')}</span>
        </button>
      )}
      {shownError && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-danger">
          {shownError}
        </p>
      )}
    </div>
  )
}
