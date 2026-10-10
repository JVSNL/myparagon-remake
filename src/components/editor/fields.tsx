import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import { useId, useRef, useState, type ReactNode } from 'react'
import type { ImageRef, Tone } from '../../data/types'
import { compressImage, MAX_UPLOAD_BYTES, saveImage } from '../../lib/imageStore'
import { useT } from '../../lib/preferences'
import { fieldClass } from '../ImagePicker'
import { PostImage } from '../PostImage'

export const smallField =
  'mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text focus:border-focus focus:ring-1 focus:ring-focus focus:outline-none'

export function TextField({
  label,
  value,
  onChange,
  multiline,
  hint,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  hint?: string
}) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-heading">
        {label}
      </label>
      {multiline ? (
        <textarea id={id} rows={5} value={value} onChange={(e) => onChange(e.target.value)} className={smallField} aria-describedby={hint ? `${id}-hint` : undefined} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={smallField} />
      )}
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[11px] text-muted">
          {hint}
        </p>
      )}
    </div>
  )
}

export function ToneField({ value, onChange }: { value: Tone; onChange: (tone: Tone) => void }) {
  const t = useT()
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-heading">
        {t('field.tone')}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value as Tone)} className={smallField}>
        {(['navy', 'sky', 'warm', 'sage'] as const).map((tone) => (
          <option key={tone} value={tone}>
            {t(`tone.${tone}`)}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Shows the current image and lets the editor replace it with a photo from the device. */
export function ImageField({ value, onChange }: { value: ImageRef; onChange: (image: ImageRef) => void }) {
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
      const imageId = `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
      await saveImage(imageId, await compressImage(file))
      onChange({ kind: 'upload', id: imageId, alt: value.kind === 'upload' ? value.alt : '' })
    } catch {
      setError(t('compose.photoError'))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <PostImage image={value} className="aspect-[16/9] w-full rounded-lg" />
      <input ref={fileRef} id={id} type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-surface-2"
      >
        <ImagePlus className="size-4" aria-hidden="true" />
        {busy ? t('compose.processing') : t('compose.changePhoto')}
      </button>
      {value.kind === 'upload' && (
        <div className="mt-2">
          <label htmlFor={`${id}-alt`} className="text-xs font-medium text-heading">
            {t('compose.alt')}
          </label>
          <input
            id={`${id}-alt`}
            value={value.alt}
            onChange={(e) => onChange({ ...value, alt: e.target.value })}
            className={smallField}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

/** Editable list of items (steps, links, questions, slides). */
export function ListField<T>({
  items,
  onChange,
  create,
  render,
}: {
  items: T[]
  onChange: (items: T[]) => void
  create: () => T
  render: (item: T, update: (item: T) => void) => ReactNode
}) {
  const t = useT()
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <fieldset key={i} className="rounded-lg border border-border p-2.5">
          <legend className="px-1 text-[11px] font-medium text-muted">{t('field.item', { n: i + 1 })}</legend>
          <div className="space-y-2">{render(item, (next) => onChange(items.map((x, j) => (j === i ? next : x))))}</div>
          <button
            type="button"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-danger"
          >
            <Trash2 className="size-3.5" aria-hidden="true" />
            {t('field.removeItem')}
          </button>
        </fieldset>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, create()])}
        className="inline-flex items-center gap-1 rounded-lg border border-dashed border-border px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-surface-2"
      >
        <Plus className="size-3.5" aria-hidden="true" />
        {t('field.addItem')}
      </button>
    </div>
  )
}

export { fieldClass }
