import { Search } from 'lucide-react'
import { useState } from 'react'
import { Avatar } from '../../components/Avatar'
import type { Role } from '../../data/types'
import { matchesQuery } from '../../lib/search'
import { useT } from '../../lib/preferences'
import { fullName } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

const ROLES: Role[] = ['employee', 'editor', 'admin']

/** Admins decide who is editor or admin. Their own role is fixed, so an admin always remains. */
export function UsersPanel() {
  const t = useT()
  const { state, me, actions } = useStore()
  const [query, setQuery] = useState('')
  const [onlyStaff, setOnlyStaff] = useState(false)

  const users = [...state.users]
    .filter((u) => matchesQuery(u, query) && (!onlyStaff || u.role !== 'employee'))
    .sort((a, b) => ROLES.indexOf(b.role) - ROLES.indexOf(a.role) || a.lastName.localeCompare(b.lastName))
  const counts = ROLES.map((r) => state.users.filter((u) => u.role === r).length)

  return (
    <>
      <p className="mb-3 text-sm text-muted">
        {t('users.summary', { employees: counts[0], editors: counts[1], admins: counts[2] })}
      </p>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{t('users.search')}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('users.search')}
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-3 pl-10 text-[15px] text-text placeholder:text-muted focus:border-focus focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-text">
          <input type="checkbox" checked={onlyStaff} onChange={(e) => setOnlyStaff(e.target.checked)} />
          {t('users.onlyStaff')}
        </label>
      </div>
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
        {users.map((user) => (
          <li key={user.id} className="flex items-center gap-3 px-4 py-2.5">
            <Avatar user={user} size="sm" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-medium text-heading">{fullName(user)}</span>
              <span className="block truncate text-xs text-muted">
                {user.jobTitle} · {user.department}
              </span>
            </span>
            {user.id === me?.id ? (
              <span className="text-sm text-muted">{t(`role.${user.role}`)} ({t('users.you')})</span>
            ) : (
              <select
                value={user.role}
                onChange={(e) => actions.setUserRole(user.id, e.target.value as Role)}
                aria-label={t('users.roleOf', { name: fullName(user) })}
                className="rounded-lg border border-border bg-surface px-2 py-1.5 text-sm text-text"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`role.${r}`)}
                  </option>
                ))}
              </select>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
