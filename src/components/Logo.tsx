import { useT } from '../lib/preferences'

/** Fictional Nexora mark: a single-stroke "N" with a sky-blue dot. */
/** `inverse` draws a white tile for use on coloured backgrounds. */
export function LogoMark({ className = 'size-8', inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill={inverse ? '#fff' : '#134D71'} />
      <path
        d="M19 46V18l26 28V18"
        fill="none"
        stroke={inverse ? '#134D71' : '#fff'}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="47" cy="17" r="5" fill="#56BEEC" />
    </svg>
  )
}

/** Small "Demo" label next to the logo, so nobody mistakes the demo for a real app. */
export function DemoBadge({ inverse = false }: { inverse?: boolean }) {
  const t = useT()
  return (
    <span
      className={`rounded px-1.5 py-0.5 text-[10px] leading-none font-bold tracking-wide uppercase ${
        inverse ? 'bg-white/20 text-white' : 'bg-c-orange-soft text-c-orange-text'
      }`}
    >
      {t('app.demo')}
    </span>
  )
}

export function Logo({ className = '', inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark inverse={inverse} />
      <span className="text-lg leading-none tracking-tight text-heading">
        <span className="font-light">my</span>
        <span className="font-bold">Nexora</span>
      </span>
      <DemoBadge inverse={inverse} />
    </span>
  )
}
