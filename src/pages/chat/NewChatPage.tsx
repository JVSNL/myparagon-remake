import { Check, Search, UsersRound } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { Avatar } from '../../components/Avatar'
import { fieldClass } from '../../components/ImagePicker'
import { PageHeader } from '../../components/layout/PageHeader'
import { useT } from '../../lib/preferences'
import { fullName } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { matchesQuery } from '../../lib/search'

export function NewChatPage() {
  const t = useT()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { state, me, actions } = useStore()
  const [query, setQuery] = useState('')
  const [groupMode, setGroupMode] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [name, setName] = useState('')
  const [error, setError] = useState(false)
  const withUser = params.get('with')

  // Coming from a profile ("Chat"): open or start the direct conversation right away.
  useEffect(() => {
    if (withUser && me && withUser !== me.id) {
      navigate(`/chat/${actions.startConversation([withUser])}`, { replace: true })
    }
  }, [withUser, me, actions, navigate])

  if (!me) return <Navigate to="/login" replace />

  const colleagues = state.users
    .filter((u) => u.id !== me.id && matchesQuery(u, query))
    .sort((a, b) => a.lastName.localeCompare(b.lastName))

  const pick = (id: string) => {
    if (!groupMode) {
      navigate(`/chat/${actions.startConversation([id])}`, { replace: true })
      return
    }
    setError(false)
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))
  }

  const createGroup = () => {
    if (selected.length < 2) return setError(true)
    navigate(`/chat/${actions.startConversation(selected, name || undefined)}`, { replace: true })
  }

  return (
    <>
      <PageHeader title={groupMode ? t('chat.newGroup') : t('chat.new')} backTo="/chat" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <label className="relative block">
          <span className="sr-only">{t('chat.search')}</span>
          <Search className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('chat.search')}
            className="w-full rounded-xl border border-border bg-surface py-3 pr-3 pl-10 text-[15px] text-text placeholder:text-muted focus:border-focus focus:outline-none"
          />
        </label>

        {groupMode ? (
          <div className="mt-4 rounded-xl border border-border bg-surface p-4">
            <label htmlFor="group-name" className="text-sm font-medium text-heading">
              {t('chat.groupName')}
            </label>
            <input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('chat.groupNamePlaceholder')}
              className={fieldClass}
            />
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className={`text-sm ${error ? 'text-danger' : 'text-muted'}`} role={error ? 'alert' : undefined}>
                {error ? t('chat.groupRequired') : t('chat.selected', { n: selected.length })}
              </span>
              <button
                type="button"
                onClick={createGroup}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:bg-primary-hover"
              >
                {t('chat.create')}
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setGroupMode(true)}
            className="mt-4 flex w-full items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-left hover:bg-surface-2"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-on-primary">
              <UsersRound className="size-5" aria-hidden="true" />
            </span>
            <span className="font-medium text-heading">{t('chat.newGroup')}</span>
          </button>
        )}

        <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
          {colleagues.map((user) => {
            const isSelected = selected.includes(user.id)
            return (
              <li key={user.id}>
                <button
                  type="button"
                  onClick={() => pick(user.id)}
                  aria-pressed={groupMode ? isSelected : undefined}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2"
                >
                  <Avatar user={user} size="md" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-heading">{fullName(user)}</span>
                    <span className="block truncate text-sm text-muted">
                      {user.jobTitle} · {user.location}
                    </span>
                  </span>
                  {groupMode && (
                    <span
                      className={`flex size-6 items-center justify-center rounded-full border-2 ${
                        isSelected ? 'border-primary bg-primary text-on-primary' : 'border-border'
                      }`}
                      aria-hidden="true"
                    >
                      {isSelected && <Check className="size-4" />}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
