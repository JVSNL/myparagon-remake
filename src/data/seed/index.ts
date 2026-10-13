import { mulberry32 } from '../../lib/random'
import { inAudience } from '../../store/selectors'
import type { AppNotification, Comment, Page, Post, User } from '../types'
import type { AppState } from '../../store/state'
import { seedChat, seedQuestions } from './chat'
import { seedLaunchpad } from './launchpad'
import { seedLocations } from './locations'
import { seedPages } from './pages'
import { seedChannels, seedComments, seedPosts } from './posts'
import { seedUsers } from './users'

export const STATE_VERSION = 12

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

/** Votes, sign-ups and a few form entries for the interactive blocks on the seed pages. Deterministic. */
function seedInteractions(pages: Page[], users: User[], now: number) {
  const rand = mulberry32(123)
  const blocks = pages.flatMap((p) => p.blocks.nl)
  const pollVotes: AppState['pollVotes'] = {}
  const eventRegistrations: AppState['eventRegistrations'] = {}
  const formSubmissions: AppState['formSubmissions'] = []
  for (const block of blocks) {
    if (block.type === 'poll') {
      // About half the colleagues voted, leaning towards the first options.
      pollVotes[block.id] = Object.fromEntries(
        users.filter(() => rand() < 0.5).map((u) => [u.id, Math.floor(rand() ** 1.6 * block.options.length)]),
      )
    }
    if (block.type === 'event') {
      const wanted = block.capacity ? block.capacity - 3 : 24
      eventRegistrations[block.id] = users.filter(() => rand() < 0.6).slice(0, wanted).map((u) => u.id)
    }
    if (block.type === 'form') {
      const ideas = [
        { title: 'Statiegeld op koffiebekers', details: 'Een kleine borg per beker, dan nemen we vaker onze eigen mok mee.', site: 'Alle locaties' },
        { title: 'Regenwater voor de daktuin', details: 'Een regenton op het dak bespaart kraanwater voor de moestuin.', site: 'Amsterdam' },
        { title: 'Reparatiecafé voor eigen fietsen', details: 'Eén keer per maand repareren monteurs fietsen van collega’s, met restonderdelen.', site: 'Eindhoven' },
      ]
      ideas.forEach((values, i) =>
        formSubmissions.push({ id: `fs-${i + 1}`, formId: block.id, userId: users[(i * 17 + 9) % users.length].id, values, createdAt: now - (i + 1) * 30 * 3_600_000 }),
      )
    }
  }
  return { pollVotes, eventRegistrations, formSubmissions }
}

export const buildSeedState = (now: number): AppState => {
  const users = seedUsers()
  const posts = seedPosts(now)
  const comments = seedComments(posts)
  const pages = seedPages(now)

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
    pages,
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
    ...seedInteractions(pages, users, now),
  }
}
