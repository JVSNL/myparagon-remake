import type { AppNotification, ImageRef, Channel, Comment, Post, User } from '../data/types'

export interface AppState {
  version: number
  currentUserId: string | null
  /** Users that have finished (or skipped) the welcome slides. */
  onboarded: string[]
  users: User[]
  channels: Channel[]
  posts: Post[]
  comments: Comment[]
  /** userId -> bookmarked post ids, most recent first. */
  bookmarks: Record<string, string[]>
  notifications: AppNotification[]
}

export interface NewPostInput {
  channelId: string
  title: string
  intro: string
  body: string[]
  image: ImageRef
}

/*
 * Every action carries the ids and timestamps it needs, so the reducer stays
 * pure and deterministic (and easy to test).
 */
export type Action =
  | { type: 'login'; userId: string }
  | { type: 'logout' }
  | { type: 'finishOnboarding' }
  | { type: 'restartOnboarding' }
  | { type: 'toggleReaction'; postId: string; emoji: string }
  | { type: 'addComment'; id: string; postId: string; parentId: string | null; text: string; now: number }
  | { type: 'editComment'; commentId: string; text: string; now: number }
  | { type: 'deleteComment'; commentId: string }
  | { type: 'toggleCommentLike'; commentId: string }
  | { type: 'toggleBookmark'; postId: string }
  | { type: 'markNotificationRead'; notificationId: string }
  | { type: 'markAllNotificationsRead' }
  | { type: 'createPost'; id: string; input: NewPostInput; now: number }
  /** Activity from a (simulated) colleague, e.g. a like or reply on your comment. */
  | { type: 'colleagueLikesComment'; actorId: string; commentId: string; notificationId: string; now: number }
  | {
      type: 'colleagueReplies'
      actorId: string
      parentId: string
      id: string
      text: string
      notificationId: string
      now: number
    }
  | { type: 'reset'; state: AppState }
