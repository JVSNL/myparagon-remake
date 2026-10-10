import type { AppNotification } from '../types'
import type { AppState } from '../../store/state'
import { seedLocations } from './locations'
import { seedPages } from './pages'
import { seedChannels, seedComments, seedPosts } from './posts'
import { seedUsers } from './users'

export const STATE_VERSION = 4

export const buildSeedState = (now: number): AppState => {
  const users = seedUsers()
  const posts = seedPosts(now)
  const comments = seedComments(posts)

  // Every user starts with "new post" notifications for the three most recent posts.
  const recent = [...posts].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)
  const notifications: AppNotification[] = users.flatMap((u) =>
    recent
      .filter((p) => p.authorId !== u.id)
      .map((p) => ({
        id: `n-${u.id}-${p.id}`,
        userId: u.id,
        type: 'new_post' as const,
        actorId: p.authorId,
        postId: p.id,
        commentId: null,
        createdAt: p.createdAt,
        read: false,
      })),
  )

  return {
    version: STATE_VERSION,
    currentUserId: null,
    onboarded: [],
    users,
    channels: seedChannels(),
    posts,
    comments,
    bookmarks: {},
    notifications,
    pages: seedPages(now),
    locations: seedLocations(),
    regionChoice: {},
  }
}
