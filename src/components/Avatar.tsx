import * as notionists from '@dicebear/notionists'
import { createAvatar } from '@dicebear/core'
import type { User } from '../data/types'
import { PostImage } from './PostImage'

// Light brand tints as backgrounds, so the illustrated faces stay readable.
const BACKGROUNDS = ['cde7f7', 'fbe0b8', 'cdeadf', 'f0d6e5', 'd3effb', 'f6d9c2', 'f7e7bd']

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

export function Avatar({ user, size = 'md' }: { user: Pick<User, 'id' | 'photo'>; size?: keyof typeof SIZES }) {
  // Decorative: the name is always shown or announced next to the avatar.
  if (user.photo) {
    return <PostImage image={{ ...user.photo, alt: '' }} className={`${SIZES[size]} shrink-0 rounded-full`} />
  }
  return <img src={avatarUri(user.id)} alt="" className={`${SIZES[size]} shrink-0 rounded-full bg-surface-2`} />
}
