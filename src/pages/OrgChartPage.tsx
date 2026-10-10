import { ChevronRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import type { User } from '../data/types'
import { useT } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

/** Ids of everyone from the top of the organisation down to (not including) this person. */
export function pathTo(users: User[], id: string): string[] {
  const path: string[] = []
  let current = users.find((u) => u.id === id)
  const seen = new Set<string>()
  while (current?.managerId && !seen.has(current.managerId)) {
    seen.add(current.managerId)
    path.unshift(current.managerId)
    current = users.find((u) => u.id === current?.managerId)
  }
  return path
}

export function OrgChartPage() {
  const t = useT()
  const { state, me } = useStore()
  const [params] = useSearchParams()
  const focus = params.get('focus') ?? me?.id ?? null

  const children = useMemo(() => {
    const map = new Map<string | null, User[]>()
    for (const u of state.users) map.set(u.managerId, [...(map.get(u.managerId) ?? []), u])
    for (const list of map.values()) list.sort((a, b) => a.lastName.localeCompare(b.lastName))
    return map
  }, [state.users])

  const roots = children.get(null) ?? []
  const [open, setOpen] = useState<Set<string>>(
    () => new Set([...roots.map((r) => r.id), ...(focus ? pathTo(state.users, focus) : [])]),
  )

  useEffect(() => {
    if (focus) document.getElementById(`org-${focus}`)?.scrollIntoView({ block: 'center' })
  }, [focus])

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  const managers = state.users.filter((u) => children.has(u.id)).map((u) => u.id)

  const renderNode = (user: User, depth: number) => {
    const reports = children.get(user.id) ?? []
    const expanded = open.has(user.id)
    const name = fullName(user)
    return (
      <li key={user.id} role="treeitem" aria-expanded={reports.length > 0 ? expanded : undefined} aria-level={depth + 1}>
        <div
          id={`org-${user.id}`}
          className={`flex items-center gap-2 rounded-xl border bg-surface p-2 pr-3 ${
            user.id === focus ? 'border-primary ring-2 ring-primary/30' : 'border-border'
          }`}
        >
          {reports.length > 0 ? (
            <button
              type="button"
              onClick={() => toggle(user.id)}
              aria-label={expanded ? t('org.collapse', { name }) : t('org.expand', { name })}
              className="flex size-8 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface-2"
            >
              <ChevronRight className={`size-5 transition-transform ${expanded ? 'rotate-90' : ''}`} aria-hidden="true" />
            </button>
          ) : (
            <span className="size-8 shrink-0" />
          )}
          <Link to={`/people/${user.id}`} className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar user={user} size="md" />
            <span className="min-w-0 flex-1">
              <span className="block truncate font-medium text-heading">{name}</span>
              <span className="block truncate text-sm text-muted">{user.jobTitle}</span>
              {reports.length > 0 && (
                <span className="block text-xs text-muted sm:hidden">{t('org.reports', { n: reports.length })}</span>
              )}
            </span>
          </Link>
          {reports.length > 0 && (
            <span className="hidden shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-xs text-muted tabular-nums sm:inline">
              {t('org.reports', { n: reports.length })}
            </span>
          )}
        </div>
        {expanded && reports.length > 0 && (
          <ul role="group" className="mt-2 ml-4 space-y-2 border-l-2 border-border pl-3 sm:ml-6 sm:pl-4">
            {reports.map((r) => renderNode(r, depth + 1))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <>
      <PageHeader title={t('org.title')} backTo="/people" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <div className="mb-4 flex justify-end gap-2 text-sm font-medium">
          <button type="button" onClick={() => setOpen(new Set(managers))} className="rounded-lg px-3 py-1.5 text-primary hover:bg-surface-2">
            {t('org.expandAll')}
          </button>
          <button
            type="button"
            onClick={() => setOpen(new Set(roots.map((r) => r.id)))}
            className="rounded-lg px-3 py-1.5 text-primary hover:bg-surface-2"
          >
            {t('org.collapseAll')}
          </button>
        </div>
        <ul role="tree" aria-label={t('org.title')} className="space-y-2">
          {roots.map((r) => renderNode(r, 0))}
        </ul>
      </div>
    </>
  )
}
