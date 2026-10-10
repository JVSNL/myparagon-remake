import { Download, Minus, Plus } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { useParams } from 'react-router-dom'
import { formatBytes } from '../components/blocks/BlockView'
import { PageHeader } from '../components/layout/PageHeader'
import { documentById } from '../data/documents'
import { usePreferences } from '../lib/preferences'

// pdf.js is large, so the viewer is only loaded when a document is opened.
const PdfDocument = lazy(() => import('../components/pdf/PdfDocument'))

const ZOOMS = [0.6, 0.8, 1, 1.25, 1.5, 2]

export function DocumentPage() {
  const { documentId = '' } = useParams()
  const { t, locale } = usePreferences()
  const doc = documentById(documentId)
  const [zoomIndex, setZoomIndex] = useState(2)
  const [pages, setPages] = useState<number | null>(null)
  const [failed, setFailed] = useState(false)

  if (!doc) {
    return (
      <>
        <PageHeader title="PDF" backTo="/menu" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('docs.notFound')}</p>
      </>
    )
  }

  const button =
    'flex size-9 items-center justify-center rounded-lg text-primary hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent'

  return (
    <>
      <PageHeader title={doc.name} backTo="/menu" />
      <div className="mx-auto max-w-3xl px-4 pt-4 lg:pt-0">
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-2 py-1.5">
          <span className="flex-1 truncate px-2 text-sm text-muted" aria-live="polite">
            PDF · {formatBytes(doc.size, locale)}
            {pages !== null && ` · ${t('docs.pages', { n: pages })}`}
          </span>
          <button
            type="button"
            className={button}
            aria-label={t('docs.zoomOut')}
            disabled={zoomIndex === 0}
            onClick={() => setZoomIndex((z) => z - 1)}
          >
            <Minus className="size-4" aria-hidden="true" />
          </button>
          <span className="w-12 text-center text-sm text-text tabular-nums">{Math.round(ZOOMS[zoomIndex] * 100)}%</span>
          <button
            type="button"
            className={button}
            aria-label={t('docs.zoomIn')}
            disabled={zoomIndex === ZOOMS.length - 1}
            onClick={() => setZoomIndex((z) => z + 1)}
          >
            <Plus className="size-4" aria-hidden="true" />
          </button>
          <a href={doc.url} download={doc.name} className={button} aria-label={t('docs.download')}>
            <Download className="size-4" aria-hidden="true" />
          </a>
        </div>

        {failed ? (
          <p className="py-16 text-center text-muted">{t('docs.error')}</p>
        ) : (
          <>
            {pages === null && <p className="py-16 text-center text-muted">{t('docs.loading')}</p>}
            <Suspense fallback={null}>
              <PdfDocument url={doc.url} zoom={ZOOMS[zoomIndex]} onLoaded={setPages} onError={() => setFailed(true)} />
            </Suspense>
          </>
        )}
      </div>
    </>
  )
}
