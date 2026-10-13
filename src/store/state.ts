import type {
  AppNotification,
  Channel,
  ChatMessage,
  Comment,
  Conversation,
  Feedback,
  Lang,
  NotificationPrefs,
  PageContent,
  PageSection,
  PostContent,
  ImageRef,
  Block,
  LaunchpadLink,
  Role,
  TrashItem,
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
  /** Per user; missing means all notification types are on. */
  notificationPrefs: Record<string, NotificationPrefs>
  feedback: Feedback[]
  /** Shortcuts to other tools, shown on Home; managed by admins. */
  launchpad: LaunchpadLink[]
  /** Deleted posts and pages, newest first. */
  trash: TrashItem[]
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
  /** Language the post is written in; Dutch when absent. */
  lang?: Lang
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
  | { type: 'addComment'; id: string; postId: string; parentId: string | null; text: string; now: number; lang?: Lang }
  | { type: 'editComment'; commentId: string; text: string; now: number; lang?: Lang }
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
      /** Dutch text, with optional translations. */
      text: string
      translations?: Comment['translations']
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
  | { type: 'savePageDraft'; pageId: string; content: PageContent }
  | { type: 'discardPageDraft'; pageId: string }
  | { type: 'publishPage'; pageId: string; versionId: string; now: number }
  | { type: 'restorePageVersion'; pageId: string; versionId: string }
  /** `blocks` comes from a page template; without it the page starts with a hero. */
  | { type: 'createPage'; id: string; slug: string; section: PageSection; title: string; now: number; blocks?: Block[] }
  | { type: 'deletePage'; pageId: string; trashId: string; now: number }
  | { type: 'updatePost'; postId: string; lang: Lang; content: PostContent; image?: ImageRef }
  | { type: 'removePostTranslation'; postId: string; lang: Lang }
  | { type: 'deletePost'; postId: string; trashId: string; now: number }
  | { type: 'restoreFromTrash'; trashId: string }
  | { type: 'purgeFromTrash'; trashId: string }
  | { type: 'setUserRole'; userId: string; role: Role }
  | { type: 'saveLaunchpad'; links: LaunchpadLink[] }
  | { type: 'setNotificationPrefs'; prefs: NotificationPrefs }
  | { type: 'sendFeedback'; id: string; topic: Feedback['topic']; text: string; now: number }
  | { type: 'reset'; state: AppState }
