import { ImageOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ImageRef } from '../data/types'
import { loadImage } from '../lib/imageStore'
import { Artwork } from './Artwork'

const urls = new Map<string, string>()

function useStoredImage(id: string | null) {
  const [url, setUrl] = useState<string | null | undefined>(() => (id ? urls.get(id) : null))
  useEffect(() => {
    if (!id || urls.has(id)) {
      setUrl(id ? urls.get(id) : null)
      return
    }
    let cancelled = false
    loadImage(id)
      .then((blob) => {
        const next = blob ? URL.createObjectURL(blob) : null
        if (next && id) urls.set(id, next)
        if (!cancelled) setUrl(next)
      })
      .catch(() => !cancelled && setUrl(null))
    return () => {
      cancelled = true
    }
  }, [id])
  return url
}

/** Renders a post or page image: a generated illustration or an uploaded photo. */
export function PostImage({ image, className = '' }: { image: ImageRef; className?: string }) {
  const url = useStoredImage(image.kind === 'upload' ? image.id : null)

  if (image.kind === 'artwork') return <Artwork artwork={image} className={className} />
  if (url === undefined) return <div className={`animate-pulse bg-surface-2 ${className}`} />
  if (url === null) {
    // The photo lives in another browser (or was cleared): show a calm placeholder.
    return (
      <div className={`flex items-center justify-center bg-surface-2 text-muted ${className}`} role="img" aria-label={image.alt}>
        <ImageOff className="size-8" strokeWidth={1.5} aria-hidden="true" />
      </div>
    )
  }
  return <img src={url} alt={image.alt} className={`object-cover ${className}`} />
}
