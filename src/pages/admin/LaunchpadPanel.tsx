import { ArrowDown, ArrowUp, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { LAUNCHPAD_ICONS, launchpadIcon } from '../../components/launchpadIcons'
import type { ColorKey, LaunchpadLink } from '../../data/types'
import { COLOR_CLASSES } from '../../lib/colors'
import { LANGUAGES, useT } from '../../lib/preferences'
import { useStore } from '../../store/StoreProvider'

const COLORS = Object.keys(COLOR_CLASSES) as ColorKey[]
const small = 'mt-1 w-full rounded-lg border border-border bg-surface px-2.5 py-1.5 text-sm text-text focus:border-focus focus:outline-none'

/** Admins choose the shortcuts on the launchpad (Home). Changes apply on save. */
export function LaunchpadPanel() {
  const t = useT()
  const { state, actions } = useStore()
  const [links, setLinks] = useState<LaunchpadLink[]>(state.launchpad)
  const [saved, setSaved] = useState(false)

  const update = (i: number, link: LaunchpadLink) => {
    setLinks(links.map((l, j) => (j === i ? link : l)))
    setSaved(false)
  }
  const move = (i: number, by: number) => {
    const next = [...links]
    ;[next[i], next[i + by]] = [next[i + by], next[i]]
    setLinks(next)
    setSaved(false)
  }
  const invalid = (l: LaunchpadLink) => !l.label.nl.trim() || !/^(https?:\/\/.+|\/.*)$/.test(l.url.trim())

  return (
    <>
      <p className="mb-3 text-sm text-muted">{t('launchpad.hint')}</p>
      <ol className="space-y-3">
        {links.map((link, i) => {
          const Icon = launchpadIcon(link.icon)
          const c = COLOR_CLASSES[link.color]
          const n = i + 1
          return (
            <li key={link.id} className="rounded-xl border border-border bg-surface p-3">
              <div className="flex items-center gap-2">
                <span className={`flex size-9 items-center justify-center rounded-lg ${c.soft} ${c.text}`}>
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="flex-1 truncate font-medium text-heading">{link.label.nl || t('launchpad.untitled')}</span>
                <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label={t('launchpad.up', { n })} className="rounded p-1.5 text-muted hover:bg-surface-2 disabled:opacity-30">
                  <ArrowUp className="size-4" aria-hidden="true" />
                </button>
                <button type="button" disabled={i === links.length - 1} onClick={() => move(i, 1)} aria-label={t('launchpad.down', { n })} className="rounded p-1.5 text-muted hover:bg-surface-2 disabled:opacity-30">
                  <ArrowDown className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => (setLinks(links.filter((_, j) => j !== i)), setSaved(false))}
                  aria-label={t('launchpad.remove', { n })}
                  className="rounded p-1.5 text-muted hover:bg-surface-2 hover:text-danger"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {LANGUAGES.map((lang) => (
                  <label key={lang} className="text-xs font-medium text-heading">
                    {t('launchpad.label')} ({lang.toUpperCase()})
                    <input
                      value={link.label[lang] ?? ''}
                      onChange={(e) => update(i, { ...link, label: { ...link.label, [lang]: e.target.value } })}
                      className={small}
                    />
                  </label>
                ))}
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-[2fr_1fr_1fr]">
                <label className="text-xs font-medium text-heading">
                  {t('field.url')}
                  <input value={link.url} onChange={(e) => update(i, { ...link, url: e.target.value })} aria-invalid={invalid(link)} className={small} />
                </label>
                <label className="text-xs font-medium text-heading">
                  {t('launchpad.icon')}
                  <select value={link.icon} onChange={(e) => update(i, { ...link, icon: e.target.value })} className={small}>
                    {Object.keys(LAUNCHPAD_ICONS).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="text-xs font-medium text-heading">
                  {t('launchpad.color')}
                  <select value={link.color} onChange={(e) => update(i, { ...link, color: e.target.value as ColorKey })} className={small}>
                    {COLORS.map((color) => (
                      <option key={color} value={color}>
                        {t(`color.${color}`)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {invalid(link) && <p className="mt-1 text-xs text-danger">{t('launchpad.invalid')}</p>}
            </li>
          )
        })}
      </ol>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setLinks([...links, { id: `lp-${Date.now().toString(36)}`, label: { nl: '' }, url: 'https://', icon: 'link', color: 'navy' }])
            setSaved(false)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t('launchpad.add')}
        </button>
        <button
          type="button"
          disabled={links.some(invalid)}
          onClick={() => {
            actions.saveLaunchpad(links)
            setSaved(true)
          }}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-40"
        >
          {t('launchpad.save')}
        </button>
        {saved && (
          <span role="status" className="text-sm text-muted">
            {t('launchpad.saved')}
          </span>
        )}
      </div>
    </>
  )
}
