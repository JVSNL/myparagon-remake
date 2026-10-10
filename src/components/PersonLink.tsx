import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { User } from '../data/types'
import { useT } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { Avatar } from './Avatar'

/** Link to someone's profile. Wraps a name or other visible text. */
export function PersonLink({ user, children, className = '' }: { user: User; children?: ReactNode; className?: string }) {
  return (
    <Link to={`/people/${user.id}`} className={`hover:underline ${className}`}>
      {children ?? fullName(user)}
    </Link>
  )
}

/** An avatar that opens the person's profile. */
export function AvatarLink({ user, size = 'md', className = '' }: { user: User; size?: ComponentProps<typeof Avatar>['size']; className?: string }) {
  const t = useT()
  return (
    <Link
      to={`/people/${user.id}`}
      aria-label={t('profile.open', { name: fullName(user) })}
      className={`inline-flex shrink-0 rounded-full transition-opacity hover:opacity-85 ${className}`}
    >
      <Avatar user={user} size={size} />
    </Link>
  )
}
