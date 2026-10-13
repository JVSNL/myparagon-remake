import { mulberry32 } from '../../lib/random'
import { inAudience } from '../../store/selectors'
import type { AppNotification, Comment, Post, User } from '../types'
import type { AppState } from '../../store/state'
import { seedChat, seedQuestions } from './chat'
import { seedLaunchpad } from './launchpad'
import { seedLocations } from './locations'
import { seedPages } from './pages'
import { seedChannels, seedComments, seedPosts } from './posts'
import { seedUsers } from './users'

export const STATE_VERSION = 11

/**
 * Who opened which post: everyone who reacted or commented, plus a share of the
 * rest of the audience that is larger for older posts. Deterministic.
 */
function seedReads(posts: Post[], comments: Comment[], users: User[], now: number): AppState['reads'] {
  const rand = mulberry32(99)
  return Object.fromEntries(
    posts
      .filter((p) => p.createdAt <= now)
      .map((post) => {
        const engaged = new Set([...Object.values(post.reactions).flat(), ...comments.filter((c) => c.postId === post.id).map((c) => c.authorId)])
        const ageDays = (now - post.createdAt) / 86_400_000
        const share = Math.min(0.85, 0.35 + ageDays * 0.06)
        const readers = users.filter((u) => inAudience(post, u) && (engaged.has(u.id) || rand() < share)).map((u) => u.id)
        return [post.id, readers]
      }),
  )
}

export const buildSeedState = (now: number): AppState => {
  const users = seedUsers()
  const posts = seedPosts(now)
  const comments = seedComments(posts)

  // Every user starts with "new post" notifications for the three most recent published posts.
  const recent = [...posts]
    .filter((p) => p.createdAt <= now)
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 3)
  const notifications: AppNotification[] = users.flatMap((u) =>
    recent
      .filter((p) => p.authorId !== u.id && inAudience(p, u))
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
    ...seedChat(now),
    // Everything older than an hour counts as read, so the demo starts with a few unread chats.
    chatRead: Object.fromEntries(users.map((u) => [u.id, Object.fromEntries(seedChat(now).conversations.map((c) => [c.id, now - 3_600_000]))])),
    questions: seedQuestions(now),
    notificationPrefs: {},
    feedback: [],
    launchpad: seedLaunchpad(),
    trash: [],
    reads: seedReads(posts, comments, users, now),
  }
}
