import { ChevronRight, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { CompactPostItem } from '../components/CompactPostItem'
import { PageHeader } from '../components/layout/PageHeader'
import { pageIcon } from '../components/pageIcons'
import { regionOfCountry, REGIONS } from '../data/regions'
import type { Tone } from '../data/types'
import { pick } from '../lib/localized'
import { usePreferences } from '../lib/preferences'
import { useRegion } from '../lib/useRegion'
import { fullName, sortedPosts } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

const TONE_BG: Record<Tone, string> = {
  navy: 'from-[#0e3b57] to-[#134D71]',
  sky: 'from-[#134D71] to-[#238ACB]',
  warm: 'from-[#9a4f02] to-[#C56603]',
  sage: 'from-[#00463a] to-[#007059]',
}

function SectionTitle({ children }: { children: string }) {
  return <h2 className="mb-3 text-xl font-medium text-heading">{children}</h2>
}

export function RegionPage() {
  const { t, locale } = usePreferences()
  const { state, actions } = useStore()
  const region = useRegion()

  const authorsInRegion = new Set(state.users.filter((u) => regionOfCountry(u.country) === region.id).map((u) => u.id))
  const news = sortedPosts(state)
    .filter((p) => authorsInRegion.has(p.authorId))
    .slice(0, 4)
  const team = region.team.map((id) => state.users.find((u) => u.id === id)).filter((u) => u !== undefined)
  const locations = state.locations.filter((l) => l.region === region.id)
  const divisions = state.pages.filter((p) => p.section === 'division')

  return (
    <>
      <PageHeader title={region.name} showLogo />
      <div className="mx-auto max-w-2xl space-y-8 px-4 pt-4 lg:pt-0">
        <div role="radiogroup" aria-label={t('region.choose')} className="grid grid-cols-3 gap-1 rounded-xl bg-surface-2 p-1">
          {REGIONS.map((r) => (
            <button
              key={r.id}
              type="button"
              role="radio"
              aria-checked={r.id === region.id}
              onClick={() => actions.chooseRegion(r.id)}
              className={`rounded-lg py-2 text-sm font-medium transition-colors ${
                r.id === region.id ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'
              }`}
            >
              {r.name}
            </button>
          ))}
        </div>

        <div className={`rounded-2xl bg-gradient-to-br ${TONE_BG[region.tone]} px-6 py-8 text-white`}>
          <p className="text-sm font-medium tracking-wide text-white/80 uppercase">Nexora</p>
          <h1 className="text-3xl font-light">{region.name}</h1>
          <p className="mt-2 text-white/90">{t('region.intro', { name: region.name })}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {divisions.map((page) => {
              const Icon = pageIcon(page.icon)
              return (
                <Link
                  key={page.id}
                  to={`/pages/${page.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-2 text-sm font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
                >
                  <Icon className="size-4" aria-hidden="true" />
                  {pick(page.title, locale)}
                </Link>
              )
            })}
          </div>
        </div>

        <section>
          <SectionTitle>{t('region.news')}</SectionTitle>
          {news.length === 0 ? (
            <p className="text-muted">{t('region.noNews')}</p>
          ) : (
            <ul className="space-y-3">
              {news.map((post) => (
                <li key={post.id}>
                  <CompactPostItem post={post} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <SectionTitle>{t('region.team')}</SectionTitle>
          <ul className="grid gap-2 sm:grid-cols-2">
            {team.map((user) => (
              <li key={user.id}>
                <Link to={`/people/${user.id}`} className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3 hover:bg-surface-2">
                  <Avatar user={user} size="lg" />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-heading">{fullName(user)}</span>
                    <span className="block truncate text-sm text-muted">{user.jobTitle}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <SectionTitle>{t('region.locations')}</SectionTitle>
          <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
            {locations.map((loc) => (
              <li key={loc.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <MapPin className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block font-medium text-heading">{loc.city}</span>
                  <span className="block truncate text-sm text-muted">
                    {loc.kind} · {loc.address}
                  </span>
                </span>
              </li>
            ))}
          </ul>
          <Link to="/locations" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-link hover:underline">
            {t('region.allLocations')}
            <ChevronRight className="size-4" aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  )
}
