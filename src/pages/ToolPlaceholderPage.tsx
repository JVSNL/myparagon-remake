import { Plug } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { launchpadIcon } from '../components/launchpadIcons'
import { PageHeader } from '../components/layout/PageHeader'
import { COLOR_CLASSES } from '../lib/colors'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

/** Shown for launchpad tiles whose link to another application has not been built yet (demo). */
export function ToolPlaceholderPage() {
  const { t, locale } = usePreferences()
  const { toolId = '' } = useParams()
  const { state } = useStore()
  const tool = state.launchpad.find((l) => l.id === toolId)
  const name = tool ? pick(tool.label, locale) : t('tool.unknown')
  const Icon = tool ? launchpadIcon(tool.icon) : Plug
  const c = COLOR_CLASSES[tool?.color ?? 'navy']

  return (
    <>
      <PageHeader title={name} backTo="/" />
      <div className="mx-auto max-w-md px-4 pt-10 text-center lg:pt-0">
        <span className={`mx-auto flex size-16 items-center justify-center rounded-2xl ${c.soft} ${c.text}`}>
          <Icon className="size-8" strokeWidth={1.75} aria-hidden="true" />
        </span>
        <h2 className="mt-5 text-xl font-medium text-heading">{t('tool.title', { name })}</h2>
        <p className="mt-2 text-[15px] text-text">{t('tool.body', { name })}</p>
        <p className="mt-4 rounded-lg bg-surface-2 px-3 py-2 text-sm text-muted">{t('tool.demo')}</p>
        <Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover">
          {t('tool.back')}
        </Link>
      </div>
    </>
  )
}
