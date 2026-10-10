import { FileText, Info, LayoutDashboard, LogOut, MessageSquareHeart, Monitor, Moon, RotateCcw, Sparkles, Sun, UserRound, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { detectLanguage, LANGUAGES, usePreferences, type LanguagePref, type ThemePref } from '../lib/preferences'
import { canEditContent } from '../store/permissions'
import { fullName, notificationPrefsFor } from '../store/selectors'
import type { NotificationPrefs } from '../data/types'
import { useStore } from '../store/StoreProvider'

const LANGUAGE_NAMES = { nl: 'Nederlands', en: 'English', de: 'Deutsch' } as const
const THEMES: { value: ThemePref; icon: LucideIcon }[] = [
  { value: 'system', icon: Monitor },
  { value: 'light', icon: Sun },
  { value: 'dark', icon: Moon },
]

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
  className = 'grid-flow-col auto-cols-fr',
}: {
  label: string
  className?: string
  value: T
  options: { value: T; label: string; icon?: LucideIcon }[]
  onChange: (value: T) => void
}) {
  return (
    <div role="radiogroup" aria-label={label} className={`grid gap-1 rounded-xl bg-surface-2 p-1 ${className}`}>
      {options.map(({ value: v, label: l, icon: Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium transition-colors ${
            value === v ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'
          }`}
        >
          {Icon && <Icon className="size-4" aria-hidden="true" />}
          {l}
        </button>
      ))}
    </div>
  )
}

export function SettingsPage() {
  const { t, theme, setTheme, language, setLanguage } = usePreferences()
  const { state, me, actions } = useStore()
  const navigate = useNavigate()
  const [confirmReset, setConfirmReset] = useState(false)
  if (!me) return null
  const prefs = notificationPrefsFor(state, me.id)

  const languageOptions: { value: LanguagePref; label: string }[] = [
    { value: 'auto', label: `${t('settings.lang.auto')} (${detectLanguage().toUpperCase()})` },
    ...LANGUAGES.map((l) => ({ value: l, label: LANGUAGE_NAMES[l] })),
  ]

  return (
    <>
      <PageHeader title={t('settings.title')} backTo="/menu" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <section className="mb-6">
          <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">
            {t('settings.appearance')}
          </h2>
          <Segmented
            label={t('settings.appearance')}
            value={theme}
            onChange={setTheme}
            options={THEMES.map(({ value, icon }) => ({ value, icon, label: t(`settings.theme.${value}`) }))}
          />
        </section>

        <section className="mb-6">
          <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{t('settings.language')}</h2>
          <Segmented
            label={t('settings.language')}
            value={language}
            onChange={setLanguage}
            options={languageOptions}
            className="grid-cols-2 sm:grid-cols-4"
          />
        </section>

        <section className="mb-6">
          <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{t('settings.notifications')}</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {(Object.keys(prefs) as (keyof NotificationPrefs)[]).map((key) => (
              <li key={key}>
                <label className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3">
                  <span className="text-[15px] text-text">{t(`settings.notif.${key}`)}</span>
                  <input
                    type="checkbox"
                    role="switch"
                    checked={prefs[key]}
                    onChange={(e) => actions.setNotificationPrefs({ ...prefs, [key]: e.target.checked })}
                    className="peer sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className="relative h-7 w-12 shrink-0 rounded-full bg-border transition-colors peer-checked:bg-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
                  />
                </label>
              </li>
            ))}
          </ul>
        </section>

        <ListGroup title={t('settings.account')}>
          <ListRow label={t('settings.loggedInAs', { name: fullName(me) })} detail={t(`role.${me.role}`)} />
          <ListRow icon={UserRound} label={t('settings.profile')} to="/profile" />
          {canEditContent(me) && <ListRow icon={LayoutDashboard} label={t('settings.admin')} to="/beheer" />}
          <ListRow
            icon={Sparkles}
            label={t('settings.showWelcome')}
            onClick={() => {
              actions.restartOnboarding()
              navigate('/welcome')
            }}
          />
          <ListRow
            icon={LogOut}
            label={t('settings.logout')}
            onClick={() => {
              actions.logout()
              navigate('/login')
            }}
          />
        </ListGroup>

        <ListGroup title={t('settings.about')}>
          <ListRow icon={FileText} label={t('settings.legal')} to="/pages/legal" />
          <ListRow icon={MessageSquareHeart} label={t('settings.feedback')} to="/feedback" />
          <ListRow icon={Info} label={t('settings.version', { v: __APP_VERSION__ })} />
          <ListRow
            icon={RotateCcw}
            label={t('settings.resetDemo')}
            tone="danger"
            onClick={() => setConfirmReset(true)}
          />
        </ListGroup>
        <p className="px-1 text-sm text-muted">{t('settings.demoNotice')}</p>
      </div>
      <ConfirmDialog
        open={confirmReset}
        title={t('settings.resetDemo')}
        message={t('settings.resetConfirm')}
        confirmLabel={t('settings.resetDemo')}
        onConfirm={() => {
          actions.resetDemo()
          navigate('/login')
        }}
        onClose={() => setConfirmReset(false)}
      />
    </>
  )
}
