import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist/legacy/build/pdf.mjs'
import workerSource from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?raw'
import { useEffect, useRef, useState } from 'react'

// Legacy build: pdf.js 6 relies on very new JS APIs (e.g. Map.getOrInsertComputed) that
// Safari and older browsers lack.
// The worker is bundled as text and started from a blob: URL, so it also works in the
// single-file demo build where no separate worker file can be served.
let workerUrl: string | null = null
const ensureWorker = () => {
  if (!workerUrl) {
    workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }))
    GlobalWorkerOptions.workerSrc = workerUrl
  }
}

/** Reads a document as bytes; data: URLs (single-file demo) are decoded without fetch. */
async function loadBytes(url: string): Promise<Uint8Array> {
  if (url.startsWith('data:')) {
    const binary = atob(url.slice(url.indexOf(',') + 1))
    return Uint8Array.from(binary, (c) => c.charCodeAt(0))
  }
  return new Uint8Array(await (await fetch(url)).arrayBuffer())
}

function PdfPage({ doc, number, width }: { doc: PDFDocumentProxy; number: number; width: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ratio, setRatio] = useState(1.414)

  useEffect(() => {
    let cancelled = false
    let task: { cancel: () => void; promise: Promise<void> } | null = null
    doc.getPage(number).then((page) => {
      if (cancelled || !ref.current) return
      const base = page.getViewport({ scale: 1 })
      setRatio(base.height / base.width)
      const scale = (width / base.width) * (window.devicePixelRatio || 1)
      const viewport = page.getViewport({ scale })
      const canvas = ref.current
      canvas.width = Math.floor(viewport.width)
      canvas.height = Math.floor(viewport.height)
      task = page.render({ canvas, viewport })
      task.promise.catch(() => undefined)
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [doc, number, width])

  return (
    <canvas
      ref={ref}
      style={{ width, height: width * ratio }}
      className="block bg-white shadow-card"
      aria-hidden="true"
    />
  )
}

interface Props {
  url: string
  zoom: number
  onLoaded: (pages: number) => void
  onError: () => void
}

/** Renders every page of a PDF to canvas (pdf.js), sized to the container and zoom level. */
export default function PdfDocument({ url, zoom, onLoaded, onError }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [doc, setDoc] = useState<PDFDocumentProxy | null>(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    let cancelled = false
    let task: ReturnType<typeof getDocument> | null = null
    ensureWorker()
    loadBytes(url)
      .then((data) => {
        if (cancelled) return null
        task = getDocument({ data })
        return task.promise
      })
      .then((d) => {
        if (!d || cancelled) return
        setDoc(d)
        onLoaded(d.numPages)
      })
      .catch(() => !cancelled && onError())
    return () => {
      cancelled = true
      void task?.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- callbacks are stable enough for a one-off load
  }, [url])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new ResizeObserver(() => setWidth(el.clientWidth))
    observer.observe(el)
    setWidth(el.clientWidth)
    return () => observer.disconnect()
  }, [])

  const pageWidth = Math.max(200, Math.round(width * zoom))

  return (
    <div ref={containerRef} className="w-full overflow-x-auto">
      {doc && width > 0 && (
        <div className="mx-auto flex flex-col items-center gap-4" style={{ width: pageWidth }}>
          {Array.from({ length: doc.numPages }, (_, i) => (
            <PdfPage key={i} doc={doc} number={i + 1} width={pageWidth} />
          ))}
        </div>
      )}
    </div>
  )
}
