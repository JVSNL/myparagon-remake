import { regionOfCountry } from '../data/regions'
import { canEditContent } from './permissions'
import type { AppNotification, Comment, Lang, NotificationPrefs, Post, PostContent, User } from '../data/types'
import type { AppState } from './state'

export const fullName = (u: Pick<User, 'firstName' | 'lastName'>) => `${u.firstName} ${u.lastName}`

export const userById = (state: AppState, id: string) => state.users.find((u) => u.id === id)

export const channelName = (state: AppState, id: string) => state.channels.find((c) => c.id === id)?.name ?? ''

export const channelColor = (state: AppState, id: string) => state.channels.find((c) => c.id === id)?.color ?? 'navy'

export const sortedPosts = (state: AppState) => [...state.posts].sort((a, b) => b.createdAt - a.createdAt)

/** Whether the post's audience includes the user's region (no audience = everyone). */
export const inAudience = (post: Post, user: User) =>
  !post.audience?.length || post.audience.includes(regionOfCountry(user.country))

/** Published, and meant for this user. Editors and admins also see posts for other regions. */
export const canSeePost = (post: Post, user: User | null, now: number) =>
  !!user && post.createdAt <= now && (inAudience(post, user) || canEditContent(user))

/** The news feed of a user: published posts for their region, newest first. */
export const visiblePosts = (state: AppState, user: User | null, now: number) =>
  sortedPosts(state).filter((p) => canSeePost(p, user, now))

/** Users in a post's audience, i.e. everyone who can be expected to read it. */
export const audienceOf = (state: AppState, post: Post) => state.users.filter((u) => inAudience(post, u))

export const reactionTotal = (post: Post) => Object.values(post.reactions).reduce((sum, list) => sum + list.length, 0)

/** Emojis ordered by popularity. */
export const topReactions = (post: Post) =>
  Object.entries(post.reactions)
    .filter(([, users]) => users.length > 0)
    .sort((a, b) => b[1].length - a[1].length)

export const commentsFor = (state: AppState, postId: string) => state.comments.filter((c) => c.postId === postId)

export const commentCount = (state: AppState, postId: string) =>
  state.comments.filter((c) => c.postId === postId && !c.deleted).length

/** Top-level comments (oldest first) with their replies. */
export const commentThreads = (comments: Comment[]) => {
  const byDate = [...comments].sort((a, b) => a.createdAt - b.createdAt)
  return byDate
    .filter((c) => c.parentId === null)
    .map((c) => ({ comment: c, replies: byDate.filter((r) => r.parentId === c.id) }))
}

export const DEFAULT_NOTIFICATION_PREFS: NotificationPrefs = {
  new_post: true,
  reply: true,
  comment_like: true,
  question_answered: true,
}

export const notificationPrefsFor = (state: AppState, userId: string) => ({
  ...DEFAULT_NOTIFICATION_PREFS,
  ...state.notificationPrefs[userId],
})

const PREF_OF: Record<AppNotification['type'], keyof NotificationPrefs> = {
  new_post: 'new_post',
  reply: 'reply',
  comment_like: 'comment_like',
  post_reaction: 'comment_like',
  question_answered: 'question_answered',
}

/** The user's notifications, newest first, without the types they switched off. */
/** Notifications of a user up to `now`; notifications of scheduled posts wait until they are published. */
export const notificationsFor = (state: AppState, userId: string, now: number) => {
  const prefs = notificationPrefsFor(state, userId)
  return state.notifications
    .filter((n) => n.userId === userId && n.createdAt <= now && prefs[PREF_OF[n.type]])
    .sort((a, b) => b.createdAt - a.createdAt)
}

export const unreadCount = (state: AppState, userId: string, now: number) =>
  notificationsFor(state, userId, now).filter((n) => !n.read).length

/** Title, intro and body in the requested language, falling back to the original. */
export const postContent = (post: Post, lang: Lang): PostContent =>
  (lang !== (post.lang ?? 'nl') && post.translations?.[lang]) || { title: post.title, intro: post.intro, body: post.body }

export const isBookmarked = (state: AppState, userId: string, postId: string) =>
  (state.bookmarks[userId] ?? []).includes(postId)

export const conversationsFor = (state: AppState, userId: string) =>
  state.conversations
    .filter((c) => c.memberIds.includes(userId))
    .map((c) => {
      const messages = state.messages.filter((m) => m.conversationId === c.id)
      const last = messages.reduce<(typeof messages)[number] | undefined>((a, m) => (!a || m.createdAt > a.createdAt ? m : a), undefined)
      const readAt = state.chatRead[userId]?.[c.id] ?? 0
      const unread = messages.filter((m) => m.authorId !== userId && m.createdAt > readAt).length
      return { conversation: c, last, unread }
    })
    .sort((a, b) => (b.last?.createdAt ?? b.conversation.createdAt) - (a.last?.createdAt ?? a.conversation.createdAt))

export const unreadChats = (state: AppState, userId: string) =>
  conversationsFor(state, userId).reduce((sum, c) => sum + c.unread, 0)

/** Display name of a conversation: the group name, or the other person in a direct chat. */
export const conversationTitle = (state: AppState, conversation: AppState['conversations'][number], userId: string) => {
  if (conversation.kind === 'group') {
    return (
      conversation.name ??
      conversation.memberIds
        .filter((id) => id !== userId)
        .map((id) => state.users.find((u) => u.id === id)?.firstName ?? '?')
        .join(', ')
    )
  }
  const other = state.users.find((u) => u.id === conversation.memberIds.find((id) => id !== userId))
  return other ? fullName(other) : '?'
}

export interface PostStats {
  readers: number
  audience: number
  /** 0..1 */
  readRate: number
  reactions: number
  comments: number
}

/** Reads, reactions and comments of a post, for the statistics in Beheer. */
export const postStats = (state: AppState, post: Post): PostStats => {
  const audience = audienceOf(state, post).length
  const readers = (state.reads[post.id] ?? []).length
  return {
    readers,
    audience,
    readRate: audience > 0 ? Math.min(1, readers / audience) : 0,
    reactions: reactionTotal(post),
    comments: commentCount(state, post.id),
  }
}
