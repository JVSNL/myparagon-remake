import { Hourglass } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import type { MessageKey } from '../lib/i18n/nl'
import { useT } from '../lib/preferences'

/** Placeholder for sections that arrive in a later phase. */
export function ComingSoonPage({ title, body, phase }: { title: MessageKey; body: MessageKey; phase: number }) {
  const t = useT()
  return (
    <>
      <PageHeader title={t(title)} showLogo />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <div className="rounded-xl border border-dashed border-border bg-surface px-6 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Hourglass className="size-7" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <p className="mt-4 text-xs font-medium tracking-wide text-primary uppercase">{t('soon.phase', { n: phase })}</p>
          <p className="mx-auto mt-2 max-w-sm text-text">{t(body)}</p>
        </div>
      </div>
    </>
  )
}
