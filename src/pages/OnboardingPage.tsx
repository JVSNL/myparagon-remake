import { Bell, Bookmark, Newspaper, SmilePlus, type LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Logo } from '../components/Logo'
import type { MessageKey } from '../lib/i18n/nl'
import { useT } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

const SLIDES: { icon: LucideIcon; title: MessageKey; body: MessageKey; tint: string }[] = [
  { icon: Newspaper, title: 'onboarding.1.title', body: 'onboarding.1.body', tint: 'from-[#134D71] to-[#238ACB]' },
  { icon: SmilePlus, title: 'onboarding.2.title', body: 'onboarding.2.body', tint: 'from-[#238ACB] to-[#56BEEC]' },
  { icon: Bookmark, title: 'onboarding.3.title', body: 'onboarding.3.body', tint: 'from-[#00563f] to-[#007059]' },
  { icon: Bell, title: 'onboarding.4.title', body: 'onboarding.4.body', tint: 'from-[#C56603] to-[#E38900]' },
]

export function OnboardingPage() {
  const t = useT()
  const { me, actions } = useStore()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)

  if (!me) return <Navigate to="/login" replace />

  const finish = () => {
    actions.finishOnboarding()
    navigate('/', { replace: true })
  }
  const slide = SLIDES[step]
  const last = step === SLIDES.length - 1
  const Icon = slide.icon

  return (
    <main className="flex min-h-dvh flex-col px-6 py-8" aria-label={t('onboarding.label')}>
      <div className="mx-auto flex w-full max-w-md items-center justify-between">
        <Logo />
        {!last && (
          <button type="button" onClick={finish} className="rounded-lg px-3 py-2 text-sm font-medium text-muted hover:bg-surface-2">
            {t('onboarding.skip')}
          </button>
        )}
      </div>

      <div key={step} className="mx-auto flex w-full max-w-md flex-1 animate-fade-up flex-col justify-center py-10 text-center">
        <div
          className={`mx-auto flex size-40 items-center justify-center rounded-[40px] bg-gradient-to-br ${slide.tint} text-white shadow-card`}
        >
          <Icon className="size-16" strokeWidth={1.5} aria-hidden="true" />
        </div>
        <p className="mt-10 text-sm text-muted" aria-live="polite">
          {t('onboarding.step', { n: step + 1, total: SLIDES.length })}
        </p>
        <h1 className="mt-2 text-[28px] leading-tight font-light text-heading">{t(slide.title)}</h1>
        <p className="mt-3 text-lg text-text">{t(slide.body)}</p>
      </div>

      <div className="pb-safe mx-auto w-full max-w-md">
        <div className="mb-6 flex justify-center gap-2" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-6 bg-primary' : 'w-2 bg-border'}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => (last ? finish() : setStep((s) => s + 1))}
          className="w-full rounded-xl bg-primary py-3.5 font-medium text-on-primary hover:bg-primary-hover"
        >
          {last ? t('onboarding.start') : t('onboarding.next')}
        </button>
      </div>
    </main>
  )
}
