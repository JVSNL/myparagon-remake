import * as notionists from '@dicebear/notionists'
import { createAvatar } from '@dicebear/core'
import type { User } from '../data/types'

// Light brand tints as backgrounds, so the illustrated faces stay readable.
const BACKGROUNDS = ['dceefa', 'cfe3ef', 'f6e3c8', 'd6ebe2', 'ecdde6', 'efe6d4']

const cache = new Map<string, string>()

const avatarUri = (seed: string) => {
  let uri = cache.get(seed)
  if (!uri) {
    uri = createAvatar(notionists, { seed, backgroundColor: BACKGROUNDS, radius: 50 }).toDataUri()
    cache.set(seed, uri)
  }
  return uri
}

const SIZES = { xs: 'size-6', sm: 'size-8', md: 'size-10', lg: 'size-14', xl: 'size-24' } as const

export function Avatar({ user, size = 'md' }: { user: Pick<User, 'id'>; size?: keyof typeof SIZES }) {
  // Decorative: the name is always shown or announced next to the avatar.
  return <img src={avatarUri(user.id)} alt="" className={`${SIZES[size]} shrink-0 rounded-full bg-surface-2`} />
}
