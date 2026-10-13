import { ChevronRight, CircleHelp, Clock, ExternalLink, FileText, MapPin, Search, X } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { CompactPostItem } from '../components/CompactPostItem'
import { PageHeader } from '../components/layout/PageHeader'
import { launchpadIcon } from '../components/launchpadIcons'
import { pageIcon } from '../components/pageIcons'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { search } from '../lib/search'
import { useNow } from '../lib/useNow'
import { readJson, writeJson } from '../lib/storage'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

const SUGGESTIONS = ['moestuin', 'Kopenhagen', 'fietsplan', 'verlof', 'Pip']

/** Marks the query words in a text (case-insensitive). */
function Highlight({ text, query }: { text: string; query: string }) {
  const words = query
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (words.length === 0) return <>{text}</>
  const parts = text.split(new RegExp(`(${words.join('|')})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="rounded bg-accent/30 px-0.5 text-inherit">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  )
}

function Group({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  if (count === 0) return null
  return (
    <section className="mb-6">
      <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">
        {title} <span className="tabular-nums">({count})</span>
      </h2>
      {children}
    </section>
  )
}

const rowClass = 'flex items-center gap-3 px-4 py-3 hover:bg-surface-2'
const listClass = 'divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface'

export function SearchPage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const now = useNow()
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const inputRef = useRef<HTMLInputElement>(null)
  const recentKey = `mynexora:recent:${me?.id}`
  const [recent, setRecent] = useState<string[]>(() => readJson<string[]>(recentKey) ?? [])

  useEffect(() => inputRef.current?.focus(), [])

  // Keep the query in the URL, so back/forward and sharing a search work.
  useEffect(() => {
    const id = window.setTimeout(() => setParams(query ? { q: query } : {}, { replace: true }), 250)
    return () => window.clearTimeout(id)
  }, [query, setParams])

  const results = useMemo(() => search(state, query, locale, { user: me, now }), [state, query, locale, me, now])

  const remember = () => {
    const q = query.trim()
    if (q.length < 2) return
    const next = [q, ...recent.filter((r) => r.toLowerCase() !== q.toLowerCase())].slice(0, 5)
    setRecent(next)
    writeJson(recentKey, next)
  }

  const hasQuery = query.trim().length >= 2

  return (
    <>
      <PageHeader title={t('search.title')} backTo="/" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            remember()
            inputRef.current?.blur()
          }}
          className="relative"
        >
          <label htmlFor="search-input" className="sr-only">
            {t('search.title')}
          </label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="search-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('search.placeholder')}
            autoComplete="off"
            className="w-full rounded-xl border border-border bg-surface py-3.5 pr-11 pl-11 text-base text-text placeholder:text-muted focus:border-focus focus:ring-1 focus:ring-focus focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              aria-label={t('search.clear')}
              className="absolute top-1/2 right-2 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-surface-2"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </form>

        <p className="mt-3 mb-5 px-1 text-sm text-muted" aria-live="polite">
          {hasQuery ? (results.total > 0 ? t('search.results', { n: results.total }) : t('search.none', { q: query.trim() })) : t('search.hint')}
        </p>

        {!hasQuery && (
          <>
            {recent.length > 0 && (
              <section className="mb-6">
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-[13px] font-medium tracking-wide text-muted uppercase">{t('search.recent')}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setRecent([])
                      writeJson(recentKey, [])
                    }}
                    className="text-sm font-medium text-primary"
                  >
                    {t('search.clearRecent')}
                  </button>
                </div>
                <ul className={listClass}>
                  {recent.map((r) => (
                    <li key={r}>
                      <button type="button" onClick={() => setQuery(r)} className={`${rowClass} w-full text-left`}>
                        <Clock className="size-4 text-muted" aria-hidden="true" />
                        <span className="flex-1 text-[15px] text-text">{r}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{t('search.suggestions')}</h2>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setQuery(s)}
                  className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-medium text-text hover:bg-surface-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {hasQuery && (
          <div onClick={remember}>
            <Group title={t('search.people')} count={results.people.length}>
              <ul className={listClass}>
                {results.people.map((user) => (
                  <li key={user.id}>
                    <Link to={`/people/${user.id}`} className={rowClass}>
                      <Avatar user={user} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-heading">
                          <Highlight text={fullName(user)} query={query} />
                        </span>
                        <span className="block truncate text-sm text-muted">
                          <Highlight text={`${user.jobTitle} · ${user.location}`} query={query} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Group>

            <Group title={t('search.news')} count={results.posts.length}>
              <ul className="space-y-3">
                {results.posts.map((post) => (
                  <li key={post.id}>
                    <CompactPostItem post={post} />
                  </li>
                ))}
              </ul>
            </Group>

            <Group title={t('search.pages')} count={results.pages.length}>
              <ul className={listClass}>
                {results.pages.map((page) => {
                  const Icon = pageIcon(page.icon)
                  return (
                    <li key={page.id}>
                      <Link to={`/pages/${page.slug}`} className={rowClass}>
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                          <Icon className="size-[18px]" aria-hidden="true" />
                        </span>
                        <span className="flex-1 font-medium text-heading">
                          <Highlight text={pick(page.title, locale)} query={query} />
                        </span>
                        <ChevronRight className="size-4 text-muted" aria-hidden="true" />
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </Group>

            <Group title={t('search.faq')} count={results.faq.length}>
              <ul className={listClass}>
                {results.faq.map((hit) => (
                  <li key={`${hit.page.id}-${hit.question}`}>
                    <Link to={`/pages/${hit.page.slug}`} className={`${rowClass} items-start`}>
                      <CircleHelp className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-heading">
                          <Highlight text={hit.question} query={query} />
                        </span>
                        <span className="line-clamp-2 text-sm text-muted">
                          <Highlight text={hit.answer} query={query} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Group>

            <Group title={t('search.locations')} count={results.locations.length}>
              <ul className={listClass}>
                {results.locations.map((loc) => (
                  <li key={loc.id}>
                    <Link to="/locations" className={rowClass}>
                      <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium text-heading">
                          <Highlight text={loc.city} query={query} />
                        </span>
                        <span className="block truncate text-sm text-muted">
                          <Highlight text={`${loc.kind} · ${loc.address}`} query={query} />
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Group>

            <Group title={t('launchpad.title')} count={results.tools.length}>
              <ul className={listClass}>
                {results.tools.map((tool) => {
                  const Icon = launchpadIcon(tool.icon)
                  const label = pick(tool.label, locale)
                  return (
                    <li key={tool.id}>
                      {tool.url.startsWith('/') ? (
                        <Link to={tool.url} className={rowClass}>
                          <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="min-w-0 flex-1 font-medium text-heading">
                            <Highlight text={label} query={query} />
                          </span>
                          <ChevronRight className="size-4 text-muted" aria-hidden="true" />
                        </Link>
                      ) : (
                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className={rowClass}>
                          <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
                          <span className="min-w-0 flex-1 font-medium text-heading">
                            <Highlight text={label} query={query} />
                          </span>
                          <ExternalLink className="size-4 text-muted" aria-hidden="true" />
                          <span className="sr-only">({t('launchpad.external')})</span>
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </Group>

            {results.total === 0 && (
              <div className="py-10 text-center">
                <FileText className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
