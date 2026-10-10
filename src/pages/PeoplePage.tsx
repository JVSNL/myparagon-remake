import { Network, Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import { Sheet } from '../components/Sheet'
import type { CountryCode, User } from '../data/types'
import { usePreferences } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

interface Filters {
  country: CountryCode | ''
  location: string
  department: string
}

const EMPTY: Filters = { country: '', location: '', department: '' }

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()

export const matchesQuery = (user: User, query: string) => {
  const q = normalize(query.trim())
  if (!q) return true
  const haystack = normalize([fullName(user), user.jobTitle, user.department, user.location, ...user.skills].join(' '))
  return q.split(/\s+/).every((word) => haystack.includes(word))
}

const selectClass =
  'mt-1.5 block w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-[15px] text-text focus:border-focus focus:outline-none'

export function PeoplePage() {
  const { t, locale } = usePreferences()
  const { state, me } = useStore()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>(EMPTY)
  const [draft, setDraft] = useState<Filters>(EMPTY)
  const [sheetOpen, setSheetOpen] = useState(false)

  const options = useMemo(() => {
    const uniq = (values: string[]) => [...new Set(values)].sort((a, b) => a.localeCompare(b, locale))
    return {
      countries: uniq(state.users.map((u) => u.country)) as CountryCode[],
      locations: uniq(state.users.map((u) => u.location)),
      departments: uniq(state.users.map((u) => u.department)),
    }
  }, [state.users, locale])

  const apply = (f: Filters, list = state.users) =>
    list.filter(
      (u) =>
        (!f.country || u.country === f.country) &&
        (!f.location || u.location === f.location) &&
        (!f.department || u.department === f.department),
    )

  const results = apply(filters)
    .filter((u) => matchesQuery(u, query))
    .sort((a, b) => a.lastName.localeCompare(b.lastName, locale) || a.firstName.localeCompare(b.firstName, locale))

  // Group by first letter of the last name, ignoring prefixes such as "van" or "de".
  const letterOf = (u: User) => {
    const main = u.lastName.split(' ').find((part) => part[0] === part[0].toUpperCase()) ?? u.lastName
    return normalize(main[0]).toUpperCase()
  }
  const groups = new Map<string, User[]>()
  for (const user of results) {
    const letter = letterOf(user)
    groups.set(letter, [...(groups.get(letter) ?? []), user])
  }

  const activeFilters = Object.values(filters).filter(Boolean).length
  const draftCount = apply(draft).filter((u) => matchesQuery(u, query)).length

  return (
    <>
      <PageHeader
        title={t('people.title')}
        backTo="/menu"
        actions={
          <Link
            to="/org"
            aria-label={t('org.title')}
            className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
          >
            <Network className="size-5" strokeWidth={1.75} aria-hidden="true" />
          </Link>
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <span className="sr-only">{t('people.search')}</span>
            <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('people.search')}
              className="w-full rounded-xl border border-border bg-surface py-3 pr-3 pl-10 text-[15px] text-text placeholder:text-muted focus:border-focus focus:outline-none"
            />
          </label>
          <button
            type="button"
            onClick={() => {
              setDraft(filters)
              setSheetOpen(true)
            }}
            className="relative flex items-center gap-2 rounded-xl border border-border bg-surface px-3.5 text-sm font-medium text-heading hover:bg-surface-2"
          >
            <SlidersHorizontal className="size-5" aria-hidden="true" />
            <span className="hidden sm:inline">{t('people.filters')}</span>
            {activeFilters > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-on-accent">
                {activeFilters}
              </span>
            )}
            <span className="sr-only sm:hidden">{t('people.filters')}</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted" aria-live="polite">
          <span>{t('people.count', { shown: results.length, total: state.users.length })}</span>
          {activeFilters > 0 && (
            <button
              type="button"
              onClick={() => setFilters(EMPTY)}
              className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 font-medium text-text hover:bg-border"
            >
              <X className="size-3.5" aria-hidden="true" />
              {t('people.reset')}
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <p className="py-16 text-center text-muted">{t('people.none')}</p>
        ) : (
          <div className="mt-3">
            {[...groups].map(([letter, users]) => (
              <section key={letter} aria-labelledby={`letter-${letter}`}>
                <h2
                  id={`letter-${letter}`}
                  className="sticky top-[calc(56px+env(safe-area-inset-top))] z-10 bg-bg/95 px-1 py-1.5 text-sm font-bold text-primary backdrop-blur lg:top-0"
                >
                  {letter}
                </h2>
                <ul className="mb-2 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
                  {users.map((user) => (
                    <li key={user.id}>
                      <Link to={`/people/${user.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
                        <Avatar user={user} size="md" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-heading">
                            {fullName(user)}
                            {user.id === me?.id && <span className="ml-2 text-xs font-normal text-muted">({t('profile.you')})</span>}
                          </span>
                          <span className="block truncate text-sm text-muted">
                            {user.jobTitle} · {user.location}
                          </span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title={t('people.filters')}>
        <div className="space-y-4">
          <div>
            <label htmlFor="f-country" className="text-sm font-medium text-heading">
              {t('people.country')}
            </label>
            <select
              id="f-country"
              value={draft.country}
              onChange={(e) => setDraft({ ...draft, country: e.target.value as CountryCode | '' })}
              className={selectClass}
            >
              <option value="">{t('people.any')}</option>
              {options.countries.map((c) => (
                <option key={c} value={c}>
                  {t(`country.${c}`)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-location" className="text-sm font-medium text-heading">
              {t('people.location')}
            </label>
            <select
              id="f-location"
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
              className={selectClass}
            >
              <option value="">{t('people.any')}</option>
              {options.locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="f-department" className="text-sm font-medium text-heading">
              {t('people.department')}
            </label>
            <select
              id="f-department"
              value={draft.department}
              onChange={(e) => setDraft({ ...draft, department: e.target.value })}
              className={selectClass}
            >
              <option value="">{t('people.any')}</option>
              {options.departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setDraft(EMPTY)}
              className="flex-1 rounded-lg border border-border py-2.5 text-sm font-medium text-text hover:bg-surface-2"
            >
              {t('people.reset')}
            </button>
            <button
              type="button"
              onClick={() => {
                setFilters(draft)
                setSheetOpen(false)
              }}
              className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover"
            >
              {t('people.show', { n: draftCount })}
            </button>
          </div>
        </div>
      </Sheet>
    </>
  )
}
