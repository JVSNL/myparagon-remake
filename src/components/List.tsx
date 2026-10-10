import { ChevronRight, type LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { ColorKey } from '../data/types'
import { COLOR_CLASSES } from '../lib/colors'

/** Grouped list in the style of iOS settings. */
export function ListGroup({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <section className="mb-6">
      {title && <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{title}</h2>}
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">{children}</ul>
    </section>
  )
}

interface RowProps {
  icon?: LucideIcon
  label: string
  detail?: ReactNode
  to?: string
  onClick?: () => void
  disabled?: boolean
  tone?: 'default' | 'danger'
  /** Brand colour of the icon tile. */
  color?: ColorKey
}

export function ListRow({ icon: Icon, label, detail, to, onClick, disabled, tone = 'default', color = 'navy' }: RowProps) {
  const c = COLOR_CLASSES[color]
  const content = (
    <>
      {Icon && (
        <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${c.soft} ${c.text}`}>
          <Icon className="size-[18px]" strokeWidth={1.75} aria-hidden="true" />
        </span>
      )}
      <span className={`flex-1 text-[15px] ${tone === 'danger' ? 'text-danger' : 'text-text'}`}>{label}</span>
      {detail && <span className="text-sm text-muted">{detail}</span>}
      {(to || onClick) && !disabled && <ChevronRight className="size-4 text-muted" aria-hidden="true" />}
    </>
  )
  const className = `flex w-full items-center gap-3 px-4 py-3 text-left ${disabled ? 'opacity-55' : 'hover:bg-surface-2'}`

  return (
    <li>
      {to && !disabled ? (
        <Link to={to} className={className}>
          {content}
        </Link>
      ) : onClick && !disabled ? (
        <button type="button" onClick={onClick} className={className}>
          {content}
        </button>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  )
}
