import { Info, LogOut, Monitor, Moon, RotateCcw, Sparkles, Sun, type LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { ListGroup, ListRow } from '../components/List'
import { detectLanguage, LANGUAGES, usePreferences, type LanguagePref, type ThemePref } from '../lib/preferences'
import { fullName } from '../store/selectors'
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
  const { me, actions } = useStore()
  const navigate = useNavigate()
  if (!me) return null

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

        <ListGroup title={t('settings.account')}>
          <ListRow label={t('settings.loggedInAs', { name: fullName(me) })} detail={t(`role.${me.role}`)} />
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
          <ListRow icon={Info} label={t('settings.version', { v: __APP_VERSION__ })} />
          <ListRow
            icon={RotateCcw}
            label={t('settings.resetDemo')}
            tone="danger"
            onClick={() => {
              if (window.confirm(t('settings.resetConfirm'))) {
                actions.resetDemo()
                navigate('/login')
              }
            }}
          />
        </ListGroup>
        <p className="px-1 text-sm text-muted">{t('settings.demoNotice')}</p>
      </div>
    </>
  )
}
