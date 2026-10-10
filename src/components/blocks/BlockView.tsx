import { ChevronDown, ChevronLeft, ChevronRight, ExternalLink, FileText } from 'lucide-react'
import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { documentById } from '../../data/documents'
import type { Block, Tone } from '../../data/types'
import { usePreferences, useT } from '../../lib/preferences'
import { fullName, sortedPosts } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { Avatar } from '../Avatar'
import { CompactPostItem } from '../CompactPostItem'
import { PostImage } from '../PostImage'
import { RichText } from '../RichText'

const TONE_BG: Record<Tone, string> = {
  navy: 'from-[#0e3b57] to-[#134D71]',
  sky: 'from-[#134D71] to-[#238ACB]',
  warm: 'from-[#9a4f02] to-[#C56603]',
  sage: 'from-[#00463a] to-[#007059]',
}

const TONE_BAR: Record<Tone, string> = {
  navy: 'border-[#134D71] dark:border-[#56BEEC]',
  sky: 'border-[#238ACB]',
  warm: 'border-[#E38900]',
  sage: 'border-[#007059] dark:border-[#6CA885]',
}

export const formatBytes = (bytes: number, locale: string) =>
  `${(bytes / 1024).toLocaleString(locale, { maximumFractionDigits: 0 })} kB`

function BlockTitle({ children }: { children?: string }) {
  if (!children) return null
  return <h2 className="mb-3 text-xl font-medium text-heading">{children}</h2>
}

function Carousel({ block }: { block: Extract<Block, { type: 'carousel' }> }) {
  const t = useT()
  const ref = useRef<HTMLUListElement>(null)
  const [index, setIndex] = useState(0)
  const total = block.slides.length

  const go = (next: number) => {
    const i = (next + total) % total
    setIndex(i)
    const el = ref.current
    el?.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <section aria-roledescription="carousel" aria-label={block.title}>
      <BlockTitle>{block.title}</BlockTitle>
      <div className="relative">
        <ul
          ref={ref}
          onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
          className="flex snap-x snap-mandatory overflow-x-auto rounded-xl [scrollbar-width:none]"
        >
          {block.slides.map((slide, i) => (
            <li
              key={i}
              aria-roledescription="slide"
              aria-label={t('blocks.slide', { n: i + 1, total })}
              className="relative w-full shrink-0 snap-center"
            >
              <PostImage image={slide.image} className="aspect-[16/9] w-full" />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-10 pb-4 text-lg font-medium text-white">
                {slide.title}
              </p>
            </li>
          ))}
        </ul>
        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label={t('blocks.prev')}
              className="absolute top-1/2 left-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label={t('blocks.next')}
              className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white hover:bg-black/60"
            >
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="mt-3 flex justify-center gap-2" aria-hidden="true">
          {block.slides.map((_, i) => (
            <span key={i} className={`h-2 rounded-full transition-all ${i === index ? 'w-5 bg-primary' : 'w-2 bg-border'}`} />
          ))}
        </div>
      )}
    </section>
  )
}

export function BlockView({ block }: { block: Block }) {
  const { t, locale } = usePreferences()
  const { state } = useStore()

  switch (block.type) {
    case 'hero':
      return (
        <div className={`rounded-2xl bg-gradient-to-br ${TONE_BG[block.tone]} px-6 py-10 text-center text-white sm:py-14`}>
          <h2 className="text-3xl leading-tight font-light text-balance sm:text-4xl">{block.title}</h2>
          {block.subtitle && <p className="mx-auto mt-3 max-w-md text-lg text-white/90">{block.subtitle}</p>}
        </div>
      )

    case 'heading':
      return <h2 className="text-2xl font-light text-heading">{block.text}</h2>

    case 'text':
      return <RichText text={block.text} />

    case 'callout':
      return (
        <div className={`rounded-xl border-l-4 bg-surface p-5 shadow-card ${TONE_BAR[block.tone]}`}>
          <h3 className="font-medium text-heading">{block.title}</h3>
          <RichText text={block.text} className="mt-1.5 !text-[16px]" />
        </div>
      )

    case 'quote':
      return (
        <figure className="border-l-4 border-primary py-1 pl-5">
          <blockquote className="text-2xl leading-snug font-light text-heading">“{block.text}”</blockquote>
          {block.author && <figcaption className="mt-2 text-sm text-muted">— {block.author}</figcaption>}
        </figure>
      )

    case 'image':
      return (
        <figure>
          <PostImage image={block.image} className="aspect-[16/9] w-full rounded-xl" />
          {block.caption && <figcaption className="mt-2 text-sm text-muted">{block.caption}</figcaption>}
        </figure>
      )

    case 'carousel':
      return <Carousel block={block} />

    case 'steps':
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <ol className="relative space-y-4 border-l-2 border-border pl-6">
            {block.steps.map((step, i) => (
              <li key={i} className="relative">
                <span
                  className="absolute top-0 -left-[37px] flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-on-primary"
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="font-medium text-heading">
                  <span className="sr-only">{t('blocks.step', { n: i + 1 })}: </span>
                  {step.title}
                </h3>
                <p className="text-[15px] text-text">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>
      )

    case 'links':
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {block.items.map((item, i) => {
              const internal = item.url.startsWith('/')
              const className = 'flex items-center gap-3 px-4 py-3 text-[15px] font-medium text-link hover:bg-surface-2'
              return (
                <li key={i}>
                  {internal ? (
                    <Link to={item.url} className={className}>
                      <ChevronRight className="size-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  ) : (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className={className}>
                      <ExternalLink className="size-4" aria-hidden="true" />
                      {item.label}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </section>
      )

    case 'files':
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <ul className="space-y-2">
            {block.documentIds.map((id) => {
              const doc = documentById(id)
              if (!doc) return null
              return (
                <li key={id}>
                  <Link
                    to={`/documents/${id}`}
                    aria-label={t('docs.open', { name: doc.name })}
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 hover:bg-surface-2"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#C56603]/12 text-[#a85500] dark:text-[#f0a35a]">
                      <FileText className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1 truncate font-medium text-heading">{doc.name}</span>
                    <span className="text-sm text-muted tabular-nums">PDF · {formatBytes(doc.size, locale)}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )

    case 'accordion':
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {block.items.map((item, i) => (
              <details key={i} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-4 text-[16px] font-medium text-heading hover:bg-surface-2 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <ChevronDown className="size-5 shrink-0 text-muted transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="px-4 pb-4">
                  <RichText text={item.answer} className="!text-[15px]" />
                </div>
              </details>
            ))}
          </div>
        </section>
      )

    case 'feed': {
      const posts = sortedPosts(state)
        .filter((p) => p.channelId === block.channelId)
        .slice(0, block.limit)
      if (posts.length === 0) return null
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <ul className="space-y-3">
            {posts.map((post) => (
              <li key={post.id}>
                <CompactPostItem post={post} />
              </li>
            ))}
          </ul>
        </section>
      )
    }

    case 'people':
      return (
        <section>
          <BlockTitle>{block.title}</BlockTitle>
          <ul className="grid gap-2 sm:grid-cols-2">
            {block.userIds.map((id) => {
              const user = state.users.find((u) => u.id === id)
              if (!user) return null
              return (
                <li key={id}>
                  <div className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3">
                    <Avatar user={user} size="md" />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-heading">{fullName(user)}</span>
                      <span className="block truncate text-sm text-muted">{user.jobTitle}</span>
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      )
  }
}
