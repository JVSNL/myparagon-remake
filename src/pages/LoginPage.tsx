import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { Logo } from '../components/Logo'
import { DEMO_ACCOUNTS } from '../data/seed/users'
import type { Role } from '../data/types'
import { useT } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

const ROLES: Role[] = ['employee', 'editor', 'admin']

export function LoginPage() {
  const t = useT()
  const { state, me, actions } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [other, setOther] = useState('')
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  if (me) return <Navigate to={from} replace />

  const login = (userId: string) => {
    actions.login(userId)
    navigate(from, { replace: true })
  }

  const submitOther = (e: FormEvent) => {
    e.preventDefault()
    if (other) login(other)
  }

  const colleagues = [...state.users].sort((a, b) => a.lastName.localeCompare(b.lastName))

  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      {/* Decorative shapes in house-style colours */}
      <span aria-hidden="true" className="absolute -top-24 -right-24 size-72 rounded-full bg-c-sky/30" />
      <span aria-hidden="true" className="absolute top-40 -left-20 size-48 rounded-full bg-c-orange/25" />
      <span aria-hidden="true" className="absolute -bottom-20 right-10 size-56 rounded-full bg-c-sage/20" />
      <span aria-hidden="true" className="absolute bottom-32 -left-10 size-24 rounded-full bg-c-berry/20" />
      <div className="relative w-full max-w-md animate-fade-up">
        <Logo className="mb-8" />
        <h1 className="text-3xl font-light text-heading">{t('login.title')}</h1>
        <p className="mt-2 text-muted">{t('login.subtitle')}</p>

        <ul className="mt-8 space-y-3">
          {ROLES.map((role) => {
            const user = state.users.find((u) => u.id === DEMO_ACCOUNTS[role])
            if (!user) return null
            return (
              <li key={role}>
                <button
                  type="button"
                  onClick={() => login(user.id)}
                  className="flex w-full items-center gap-4 rounded-xl border border-border bg-surface p-4 text-left shadow-card transition hover:border-primary"
                >
                  <Avatar user={user} size="lg" />
                  <span className="min-w-0 flex-1">
                    <span
                      className={`mb-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium tracking-wide uppercase ${
                        { employee: 'bg-c-royal-soft text-c-royal-text', editor: 'bg-c-orange-soft text-c-orange-text', admin: 'bg-c-sage-soft text-c-sage-text' }[role]
                      }`}
                    >
                      {t(`login.role.${role}`)}
                    </span>
                    <span className="block font-medium text-heading">{fullName(user)}</span>
                    <span className="block text-sm text-muted">{t(`login.roleDesc.${role}`)}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        <form onSubmit={submitOther} className="mt-8">
          <label htmlFor="other-user" className="mb-2 block text-sm font-medium text-text">
            {t('login.other')}
          </label>
          <div className="flex gap-2">
            <select
              id="other-user"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-border bg-surface px-3 py-2.5 text-[15px] text-text"
            >
              <option value="">{t('login.pick')}</option>
              {colleagues.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.lastName}, {u.firstName} — {u.jobTitle} ({t(`role.${u.role}`)})
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!other}
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover disabled:opacity-40"
            >
              {t('login.submit')}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
