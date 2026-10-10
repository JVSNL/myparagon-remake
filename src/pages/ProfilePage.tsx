import { Mail, MessageCircle, Network, Pencil, Phone } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { PageHeader } from '../components/layout/PageHeader'
import type { User } from '../data/types'
import { COLOR_CLASSES, colorAt, colorFor } from '../lib/colors'
import { useT } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

function PersonRow({ user }: { user: User }) {
  return (
    <Link to={`/people/${user.id}`} className="flex items-center gap-3 px-4 py-3 hover:bg-surface-2">
      <Avatar user={user} size="md" />
      <span className="min-w-0">
        <span className="block truncate font-medium text-heading">{fullName(user)}</span>
        <span className="block truncate text-sm text-muted">{user.jobTitle}</span>
      </span>
    </Link>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-2 px-1 text-[13px] font-medium tracking-wide text-muted uppercase">{title}</h2>
      {children}
    </section>
  )
}

export function ProfilePage({ own = false }: { own?: boolean }) {
  const t = useT()
  const params = useParams()
  const { state, me } = useStore()
  const user = state.users.find((u) => u.id === (own ? me?.id : params.userId))

  if (!user) {
    return (
      <>
        <PageHeader title={t('profile.title')} backTo="/people" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('profile.notFound')}</p>
      </>
    )
  }

  const manager = user.managerId ? state.users.find((u) => u.id === user.managerId) : undefined
  const team = state.users.filter((u) => u.managerId === user.id)
  const canEdit = me && (me.id === user.id || me.role === 'admin')

  const action = 'flex flex-1 flex-col items-center gap-1 rounded-xl py-3 text-sm font-medium hover:opacity-90'

  return (
    <>
      <PageHeader
        title={own ? t('menu.profile') : t('profile.title')}
        backTo={own ? '/menu' : '/people'}
        actions={
          canEdit && (
            <Link
              to={`/people/${user.id}/edit`}
              aria-label={t('profile.edit')}
              className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
            >
              <Pencil className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          )
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-6 lg:pt-0">
        <div className="text-center">
          {/* Banner in the colour of the person's department */}
          <div className={`relative h-24 overflow-hidden rounded-2xl ${COLOR_CLASSES[colorFor(user.department)].solid}`} aria-hidden="true">
            <span className="absolute -top-8 -left-6 size-24 rounded-full bg-white/20" />
            <span className="absolute -right-4 -bottom-10 size-28 rounded-full bg-black/10" />
          </div>
          <div className="relative -mt-12 inline-block rounded-full bg-bg p-1.5">
            <Avatar user={user} size="xl" />
          </div>
          <h1 className="mt-3 text-2xl font-medium text-heading">{fullName(user)}</h1>
          <p className="text-text">{user.jobTitle}</p>
          <p className="text-sm text-muted">
            {user.department} · {user.location}, {t(`country.${user.country}`)}
          </p>
        </div>

        {me?.id !== user.id && (
          <div className="mt-5 flex gap-2">
            <a href={`tel:${user.phone.replace(/\s/g, '')}`} className={`${action} bg-c-royal-soft text-c-royal-text`}>
              <Phone className="size-5" aria-hidden="true" />
              {t('profile.call')}
            </a>
            <a href={`mailto:${user.email}`} className={`${action} bg-c-orange-soft text-c-orange-text`}>
              <Mail className="size-5" aria-hidden="true" />
              {t('profile.mail')}
            </a>
            <Link to={`/chat/new?with=${user.id}`} className={`${action} bg-c-sage-soft text-c-sage-text`}>
              <MessageCircle className="size-5" aria-hidden="true" />
              {t('profile.chat')}
            </Link>
          </div>
        )}

        <Section title={t('profile.contact')}>
          <dl className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface text-[15px]">
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-muted">{t('profile.email')}</dt>
              <dd className="truncate text-text select-all">{user.email}</dd>
            </div>
            <div className="flex justify-between gap-4 px-4 py-3">
              <dt className="text-muted">{t('profile.phone')}</dt>
              <dd className="text-text tabular-nums select-all">{user.phone}</dd>
            </div>
          </dl>
        </Section>

        {user.bio && (
          <Section title={t('profile.about')}>
            <p className="rounded-xl border border-border bg-surface px-4 py-3 text-[15px] text-text">{user.bio}</p>
          </Section>
        )}

        {user.skills.length > 0 && (
          <Section title={t('profile.skills')}>
            <ul className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <li key={skill} className={`rounded-full px-3 py-1 text-sm font-medium ${COLOR_CLASSES[colorAt(i)].soft} ${COLOR_CLASSES[colorAt(i)].text}`}>
                  {skill}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {manager && (
          <Section title={t('profile.manager')}>
            <div className="overflow-hidden rounded-xl border border-border bg-surface">
              <PersonRow user={manager} />
            </div>
          </Section>
        )}

        {team.length > 0 && (
          <Section title={`${t('profile.team')} (${team.length})`}>
            <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-surface">
              {team.map((u) => (
                <li key={u.id}>
                  <PersonRow user={u} />
                </li>
              ))}
            </ul>
          </Section>
        )}

        <Link
          to={`/org?focus=${user.id}`}
          className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-3 text-sm font-medium text-primary hover:bg-surface-2"
        >
          <Network className="size-4" aria-hidden="true" />
          {t('profile.orgchart')}
        </Link>
      </div>
    </>
  )
}
