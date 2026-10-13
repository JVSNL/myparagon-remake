import { Plus, Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { fieldClass } from '../../components/ImagePicker'
import { PageHeader } from '../../components/layout/PageHeader'
import { pageIcon } from '../../components/pageIcons'
import { PostImage } from '../../components/PostImage'
import { Sheet } from '../../components/Sheet'
import type { PageSection } from '../../data/types'
import { LANGUAGES, usePreferences } from '../../lib/preferences'
import { canEditContent, isAdmin } from '../../store/permissions'
import { PAGE_TEMPLATE_IDS, type PageTemplateId } from '../../data/pageTemplates'
import { CalendarPanel } from './CalendarPanel'
import { DashboardPanel } from './DashboardPanel'
import { LaunchpadPanel } from './LaunchpadPanel'
import { SubmissionsPanel } from './SubmissionsPanel'
import { TrashPanel } from './TrashPanel'
import { UsersPanel } from './UsersPanel'
import { channelName, fullName, sortedPosts } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

type Tab = 'pages' | 'posts' | 'calendar' | 'stats' | 'submissions' | 'trash' | 'users' | 'launchpad' | 'feedback'
const SECTIONS: PageSection[] = ['division', 'company', 'story', 'general']

function LangBadges({ available }: { available: string[] }) {
  return (
    <span className="flex gap-1">
      {LANGUAGES.map((l) => (
        <span
          key={l}
          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
            available.includes(l) ? 'bg-primary-soft text-primary' : 'bg-surface-2 text-muted line-through'
          }`}
        >
          {l}
        </span>
      ))}
    </span>
  )
}

function NewPageForm({ onDone }: { onDone: (id: string) => void }) {
  const { t } = usePreferences()
  const { state, actions } = useStore()
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [section, setSection] = useState<PageSection>('story')
  const [template, setTemplate] = useState<PageTemplateId>('blank')
  const [error, setError] = useState(false)
  const toSlug = (s: string) =>
    s
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const valid = title.trim() && /^[a-z0-9-]+$/.test(slug) && !state.pages.some((p) => p.slug === slug)
    if (!valid) return setError(true)
    onDone(actions.createPage(slug, section, title, template))
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="np-title" className="text-sm font-medium text-heading">
          {t('newPage.title')}
        </label>
        <input
          id="np-title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            setSlug(toSlug(e.target.value))
            setError(false)
          }}
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="np-slug" className="text-sm font-medium text-heading">
          {t('newPage.slug')}
        </label>
        <input
          id="np-slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value)
            setError(false)
          }}
          aria-describedby="np-slug-hint"
          aria-invalid={error}
          className={fieldClass}
        />
        <p id="np-slug-hint" className={`mt-1 text-xs ${error ? 'text-danger' : 'text-muted'}`}>
          {error ? t('newPage.slugError') : t('newPage.slugHint')}
        </p>
      </div>
      <div>
        <label htmlFor="np-section" className="text-sm font-medium text-heading">
          {t('newPage.section')}
        </label>
        <select id="np-section" value={section} onChange={(e) => setSection(e.target.value as PageSection)} className={fieldClass}>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>
              {t(`admin.section.${s}`)}
            </option>
          ))}
        </select>
      </div>
      <fieldset>
        <legend className="text-sm font-medium text-heading">{t('newPage.template')}</legend>
        <div className="mt-1.5 grid gap-2 sm:grid-cols-2">
          {PAGE_TEMPLATE_IDS.map((id) => (
            <label
              key={id}
              className={`cursor-pointer rounded-lg border p-3 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus ${
                template === id ? 'border-primary bg-primary-soft' : 'border-border hover:bg-surface-2'
              }`}
            >
              <input type="radio" name="np-template" value={id} checked={template === id} onChange={() => setTemplate(id)} className="sr-only" />
              <span className="block text-sm font-medium text-heading">{t(`template.${id}`)}</span>
              <span className="block text-xs text-muted">{t(`template.${id}.desc`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="w-full rounded-lg bg-primary py-2.5 font-medium text-on-primary hover:bg-primary-hover">
        {t('newPage.create')}
      </button>
    </form>
  )
}

export function AdminPage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [tab, setTab] = useState<Tab>(() => (params.get('tab') as Tab | null) ?? 'pages')
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)

  if (!canEditContent(me)) return <Navigate to="/" replace />

  const q = query.trim().toLowerCase()
  const date = (ts: number) => new Date(ts).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })
  const common: Tab[] = ['pages', 'posts', 'calendar', 'stats', 'submissions', 'trash']
  const tabs: Tab[] = isAdmin(me) ? [...common, 'users', 'launchpad', 'feedback'] : [...common, 'feedback']
  const label: Record<Tab, string> = {
    pages: t('admin.pages'),
    posts: t('admin.posts'),
    calendar: t('admin.calendar'),
    stats: t('admin.stats'),
    submissions: t('admin.submissions'),
    trash: state.trash.length > 0 ? `${t('admin.trash')} (${state.trash.length})` : t('admin.trash'),
    users: t('admin.users'),
    launchpad: t('launchpad.title'),
    feedback: t('admin.feedback'),
  }
  const row = 'flex items-center gap-3 px-4 py-3 hover:bg-surface-2'

  return (
    <>
      <PageHeader
        title={t('admin.title')}
        backTo="/settings"
        actions={
          tab === 'pages' && (
            <button
              type="button"
              onClick={() => setCreating(true)}
              aria-label={t('admin.newPage')}
              className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2 lg:size-auto lg:gap-2 lg:bg-primary lg:px-4 lg:py-2.5 lg:text-sm lg:font-medium lg:text-on-primary"
            >
              <Plus className="size-5 lg:size-4" aria-hidden="true" />
              <span className="hidden lg:inline">{t('admin.newPage')}</span>
            </button>
          )
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <div role="tablist" className="mb-4 flex gap-1 overflow-x-auto rounded-xl bg-surface-2 p-1">
          {tabs.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`flex-1 shrink-0 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap ${tab === value ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
            >
              {label[value]}
            </button>
          ))}
        </div>

        {(tab === 'pages' || tab === 'posts') && (
          <label className="relative mb-4 block">
            <span className="sr-only">{t('admin.search')}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('admin.search')}
              className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-10 text-[15px] text-text placeholder:text-muted focus:border-focus focus:outline-none"
            />
          </label>
        )}

        <div role="tabpanel">
          {tab === 'pages' &&
            SECTIONS.map((section) => {
              const pages = state.pages.filter(
                (p) => p.section === section && (!q || p.title.nl.toLowerCase().includes(q) || p.slug.includes(q)),
              )
              if (pages.length === 0) return null
              return (
                <section key={section} className="mb-6">
                  <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{t(`admin.section.${section}`)}</h2>
                  <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                    {pages.map((page) => {
                      const Icon = pageIcon(page.icon)
                      return (
                        <li key={page.id}>
                          <Link to={`/beheer/pages/${page.id}`} className={row}>
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                              <Icon className="size-[18px]" aria-hidden="true" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="block truncate font-medium text-heading">{page.title.nl}</span>
                              <span className="block text-xs text-muted">
                                /{page.slug} · {date(page.updatedAt)}
                              </span>
                            </span>
                            {page.draft && (
                              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-heading">{t('admin.draft')}</span>
                            )}
                            <LangBadges available={Object.keys(page.blocks)} />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}

          {tab === 'posts' && (
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {sortedPosts(state)
                .filter((p) => !q || p.title.toLowerCase().includes(q))
                .map((post) => (
                  <li key={post.id}>
                    <Link to={`/beheer/posts/${post.id}`} className={row}>
                      <PostImage image={post.image} className="h-10 w-14 shrink-0 rounded-md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium text-heading">{post.title}</span>
                        <span className="block truncate text-xs text-muted">
                          {channelName(state, post.channelId)} · {date(post.createdAt)}
                        </span>
                      </span>
                      <LangBadges available={[post.lang ?? 'nl', ...Object.keys(post.translations ?? {})]} />
                    </Link>
                  </li>
                ))}
            </ul>
          )}

          {tab === 'calendar' && <CalendarPanel />}
          {tab === 'stats' && <DashboardPanel />}
          {tab === 'submissions' && <SubmissionsPanel />}
          {tab === 'trash' && <TrashPanel />}
          {tab === 'users' && <UsersPanel />}
          {tab === 'launchpad' && <LaunchpadPanel />}

          {tab === 'feedback' &&
            (state.feedback.length === 0 ? (
              <p className="py-10 text-center text-muted">{t('feedback.empty')}</p>
            ) : (
              <ul className="space-y-3">
                {state.feedback.map((f) => {
                  const author = state.users.find((u) => u.id === f.authorId)
                  return (
                    <li key={f.id} className="rounded-xl border border-border bg-surface p-4">
                      <p className="text-xs text-muted">
                        <span className="font-medium text-primary">{t(`feedback.${f.topic}`)}</span> · {author ? fullName(author) : '?'} ·{' '}
                        {date(f.createdAt)}
                      </p>
                      <p className="mt-1 text-[15px] whitespace-pre-line text-text">{f.text}</p>
                    </li>
                  )
                })}
              </ul>
            ))}
        </div>
      </div>

      <Sheet open={creating} onClose={() => setCreating(false)} title={t('admin.newPage')}>
        <NewPageForm
          onDone={(id) => {
            setCreating(false)
            navigate(`/beheer/pages/${id}`)
          }}
        />
      </Sheet>
    </>
  )
}
