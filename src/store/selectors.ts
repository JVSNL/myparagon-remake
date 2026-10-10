import type { Comment, Post, User } from '../data/types'
import type { AppState } from './state'

export const fullName = (u: Pick<User, 'firstName' | 'lastName'>) => `${u.firstName} ${u.lastName}`

export const userById = (state: AppState, id: string) => state.users.find((u) => u.id === id)

export const channelName = (state: AppState, id: string) => state.channels.find((c) => c.id === id)?.name ?? ''

export const sortedPosts = (state: AppState) => [...state.posts].sort((a, b) => b.createdAt - a.createdAt)

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

export const notificationsFor = (state: AppState, userId: string) =>
  state.notifications.filter((n) => n.userId === userId).sort((a, b) => b.createdAt - a.createdAt)

export const unreadCount = (state: AppState, userId: string) =>
  state.notifications.filter((n) => n.userId === userId && !n.read).length

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
