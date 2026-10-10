import { ImagePlus, Shuffle, Trash2 } from 'lucide-react'
import { useId, useRef, useState } from 'react'
import type { ArtworkPalette, ImageRef } from '../data/types'
import { compressImage, MAX_UPLOAD_BYTES, saveImage } from '../lib/imageStore'
import { useT } from '../lib/preferences'
import { Artwork } from './Artwork'
import { PostImage } from './PostImage'

const PALETTES: ArtworkPalette[] = ['navy', 'sky', 'sage', 'warm']

export const fieldClass =
  'mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[15px] text-text focus:border-focus focus:ring-1 focus:ring-focus focus:outline-none'

interface Props {
  value: ImageRef
  onChange: (image: ImageRef) => void
  /** Shown under the alt text field, e.g. "describe the photo". */
  altError?: string | null
  label: string
}

const newImageId = () => `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

/** Choose between a generated illustration and a photo from the device (camera or library). */
export function ImagePicker({ value, onChange, altError, label }: Props) {
  const t = useT()
  const id = useId()
  const fileRef = useRef<HTMLInputElement>(null)
  const [artwork, setArtwork] = useState(
    value.kind === 'artwork' ? value : { kind: 'artwork' as const, seed: Math.floor(Math.random() * 1000), palette: 'navy' as const },
  )
  const [photo, setPhoto] = useState(value.kind === 'upload' ? value : null)
  const [mode, setMode] = useState<'artwork' | 'upload'>(value.kind)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const choose = (next: 'artwork' | 'upload') => {
    setMode(next)
    if (next === 'artwork') onChange(artwork)
    else if (photo) onChange(photo)
    else fileRef.current?.click()
  }

  const onFile = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (file.size > MAX_UPLOAD_BYTES) return setError(t('compose.photoTooLarge'))
    setBusy(true)
    try {
      const blob = await compressImage(file)
      const ref = { kind: 'upload' as const, id: newImageId(), alt: photo?.alt ?? '' }
      await saveImage(ref.id, blob)
      setPhoto(ref)
      setMode('upload')
      onChange(ref)
    } catch {
      setError(t('compose.photoError'))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const updateArtwork = (next: typeof artwork) => {
    setArtwork(next)
    onChange(next)
  }

  const tabClass = (active: boolean) =>
    `flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      active ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'
    }`

  return (
    <fieldset>
      <legend className="text-sm font-medium text-heading">{label}</legend>
      <div role="radiogroup" aria-label={label} className="mt-1.5 flex gap-1 rounded-xl bg-surface-2 p-1">
        <button type="button" role="radio" aria-checked={mode === 'artwork'} onClick={() => choose('artwork')} className={tabClass(mode === 'artwork')}>
          {t('compose.illustration')}
        </button>
        <button type="button" role="radio" aria-checked={mode === 'upload'} onClick={() => choose('upload')} className={tabClass(mode === 'upload')}>
          {t('compose.photo')}
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {mode === 'artwork' ? (
        <>
          <Artwork artwork={artwork} className="mt-3 aspect-[16/9] w-full rounded-xl" />
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {PALETTES.map((p) => (
              <label key={p} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-palette`}
                  checked={artwork.palette === p}
                  onChange={() => updateArtwork({ ...artwork, palette: p })}
                  className="peer sr-only"
                />
                <span className="sr-only">{t(`compose.palette.${p}`)}</span>
                <Artwork
                  artwork={{ ...artwork, palette: p }}
                  className="block h-10 w-16 rounded-md ring-offset-2 ring-offset-bg peer-checked:ring-2 peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus"
                />
              </label>
            ))}
            <button
              type="button"
              onClick={() => updateArtwork({ ...artwork, seed: artwork.seed + 1 })}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2"
            >
              <Shuffle className="size-4" aria-hidden="true" />
              {t('compose.shuffle')}
            </button>
          </div>
        </>
      ) : photo ? (
        <>
          <PostImage image={photo} className="mt-3 block aspect-[16/9] w-full rounded-xl" />
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
              onClick={() => {
                setPhoto(null)
                choose('artwork')
              }}
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
            value={photo.alt}
            onChange={(e) => {
              const next = { ...photo, alt: e.target.value }
              setPhoto(next)
              onChange(next)
            }}
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
          className="mt-3 flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface text-primary hover:bg-surface-2"
        >
          <ImagePlus className="size-8" strokeWidth={1.5} aria-hidden="true" />
          <span className="text-sm font-medium">{busy ? t('compose.processing') : t('compose.choosePhoto')}</span>
          <span className="text-xs text-muted">{t('compose.photoNote')}</span>
        </button>
      )}
      {error && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </fieldset>
  )
}
