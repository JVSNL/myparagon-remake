import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

const INLINE = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g

function inline(text: string, key: string): ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const k = `${key}-${i}`
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={k} className="font-medium text-heading">
          {part.slice(2, -2)}
        </strong>
      )
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/)
    if (link) {
      const [, label, url] = link
      const className = 'font-medium text-link underline underline-offset-2 hover:no-underline'
      return url.startsWith('/') ? (
        <Link key={k} to={url} className={className}>
          {label}
        </Link>
      ) : (
        <a key={k} href={url} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>
      )
    }
    return part
  })
}

/**
 * Renders the light markup used in text blocks: blank line = new paragraph,
 * lines starting with "- " = bullet list, **bold** and [label](url).
 * Builds React elements, so content can never inject HTML.
 */
export function RichText({ text, className = '' }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim())
  return (
    <div className={`space-y-4 text-[17px] leading-relaxed text-text ${className}`}>
      {paragraphs.map((paragraph, i) => {
        const lines = paragraph.split('\n')
        if (lines.every((l) => l.trimStart().startsWith('- '))) {
          return (
            <ul key={i} className="list-disc space-y-1.5 pl-5 marker:text-primary">
              {lines.map((l, j) => (
                <li key={j}>{inline(l.trimStart().slice(2), `${i}-${j}`)}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{inline(lines.join(' '), String(i))}</p>
      })}
    </div>
  )
}
