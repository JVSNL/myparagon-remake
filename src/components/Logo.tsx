/** Fictional Nexora mark: a single-stroke "N" with a sky-blue dot. */
export function LogoMark({ className = 'size-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="14" fill="#134D71" />
      <path
        d="M19 46V18l26 28V18"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="47" cy="17" r="5" fill="#56BEEC" />
    </svg>
  )
}

export function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="text-lg leading-none tracking-tight text-heading">
        <span className="font-light">my</span>
        <span className="font-bold">Nexora</span>
      </span>
    </span>
  )
}
