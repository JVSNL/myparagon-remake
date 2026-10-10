import type {
  AppNotification,
  Channel,
  ChatMessage,
  Comment,
  Conversation,
  ImageRef,
  Location,
  Page,
  Post,
  Question,
  RegionId,
  User,
} from '../data/types'

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
  pages: Page[]
  locations: Location[]
  /** Region chosen per user on the Region tab; defaults to the region of their country. */
  regionChoice: Record<string, RegionId>
  conversations: Conversation[]
  messages: ChatMessage[]
  /** userId -> conversationId -> time the user last read it. */
  chatRead: Record<string, Record<string, number>>
  questions: Question[]
}

export type ProfileChanges = Partial<
  Pick<User, 'firstName' | 'lastName' | 'jobTitle' | 'department' | 'location' | 'country' | 'email' | 'phone' | 'bio' | 'skills' | 'photo'>
>

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
  | { type: 'chooseRegion'; region: RegionId }
  | { type: 'updateProfile'; userId: string; changes: ProfileChanges }
  | { type: 'startConversation'; id: string; memberIds: string[]; name?: string; now: number }
  | { type: 'sendMessage'; id: string; conversationId: string; text: string; now: number }
  | { type: 'markConversationRead'; conversationId: string; now: number }
  /** A (simulated) colleague answers in a conversation. */
  | { type: 'colleagueMessage'; id: string; conversationId: string; authorId: string; text: string; now: number }
  | { type: 'askQuestion'; id: string; text: string; visibility: 'public' | 'board'; now: number }
  | { type: 'answerQuestion'; questionId: string; text: string; now: number; notificationId: string }
  /** A (simulated) board member answers a question. */
  | { type: 'boardAnswers'; questionId: string; authorId: string; text: string; now: number; notificationId: string }
  | { type: 'reset'; state: AppState }
