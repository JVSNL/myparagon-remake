import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { de } from './i18n/de'
import { en } from './i18n/en'
import { format, type Params } from './i18n/format'
import { nl, type MessageKey } from './i18n/nl'
import { readJson, writeJson } from './storage'

export type Language = 'nl' | 'en' | 'de'
export type LanguagePref = Language | 'auto'
export type ThemePref = 'system' | 'light' | 'dark'

interface Prefs {
  language: LanguagePref
  theme: ThemePref
}

const KEY = 'mynexora:prefs'
const DICTIONARIES: Record<Language, Record<MessageKey, string>> = { nl, en, de }
export const LANGUAGES: Language[] = ['nl', 'en', 'de']

/** First supported language from the browser settings, Dutch as fallback. */
export function detectLanguage(candidates: readonly string[] = navigator.languages ?? [navigator.language]): Language {
  for (const candidate of candidates) {
    const base = candidate.toLowerCase().split('-')[0]
    if ((LANGUAGES as string[]).includes(base)) return base as Language
  }
  return 'nl'
}

interface PreferencesValue extends Prefs {
  /** The language actually in use (resolves "auto"). */
  locale: Language
  isDark: boolean
  setLanguage: (language: LanguagePref) => void
  setTheme: (theme: ThemePref) => void
  t: (key: MessageKey, params?: Params) => string
}

const PreferencesContext = createContext<PreferencesValue | null>(null)

const prefersDark = () => {
  // A host page (e.g. the demo viewer) may force a theme through data-theme on <html>.
  const forced = document.documentElement.dataset.theme
  if (forced === 'dark' || forced === 'light') return forced === 'dark'
  return typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(() => ({ language: 'auto', theme: 'system', ...readJson<Prefs>(KEY) }))
  const [systemDark, setSystemDark] = useState(prefersDark)

  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const query = matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setSystemDark(prefersDark())
    query.addEventListener('change', onChange)
    const observer = new MutationObserver(onChange)
    observer.observe(document.documentElement, { attributeFilter: ['data-theme'] })
    return () => {
      query.removeEventListener('change', onChange)
      observer.disconnect()
    }
  }, [])

  useEffect(() => writeJson(KEY, prefs), [prefs])

  const locale = prefs.language === 'auto' ? detectLanguage() : prefs.language
  const isDark = prefs.theme === 'dark' || (prefs.theme === 'system' && systemDark)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.lang = locale
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#13222d' : '#ffffff')
  }, [isDark, locale])

  const t = useCallback(
    (key: MessageKey, params?: Params) => format(DICTIONARIES[locale][key] ?? nl[key], params, locale),
    [locale],
  )

  const value = useMemo<PreferencesValue>(
    () => ({
      ...prefs,
      locale,
      isDark,
      setLanguage: (language) => setPrefs((p) => ({ ...p, language })),
      setTheme: (theme) => setPrefs((p) => ({ ...p, theme })),
      t,
    }),
    [prefs, locale, isDark, t],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext)
  if (!ctx) throw new Error('usePreferences must be used inside PreferencesProvider')
  return ctx
}

export const useT = () => usePreferences().t
