export type Role = 'employee' | 'editor' | 'admin'

export type CountryCode = 'NL' | 'BE' | 'DK' | 'ES'

export interface User {
  id: string
  firstName: string
  lastName: string
  role: Role
  jobTitle: string
  department: string
  country: CountryCode
  location: string
  email: string
  phone: string
  bio: string
  skills: string[]
  /** User id of the manager; null for the top of the organisation. Used by the org chart. */
  managerId: string | null
  /** Own profile photo; without one an illustrated avatar is shown. */
  photo?: { kind: 'upload'; id: string; alt: string }
}

/** Categorical brand colours from the house style palette. */
export type ColorKey = 'navy' | 'royal' | 'sky' | 'orange' | 'sienna' | 'sage' | 'berry'

export interface Channel {
  id: string
  name: string
  color: ColorKey
}

export type ArtworkPalette = 'navy' | 'sky' | 'warm' | 'sage'

export interface Artwork {
  seed: number
  palette: ArtworkPalette
}

/**
 * A generated illustration, a stock photo bundled with the app (see src/data/photos.ts),
 * or a photo uploaded from the device (stored in IndexedDB).
 */
export type ImageRef =
  | ({ kind: 'artwork' } & Artwork)
  | { kind: 'photo'; id: string }
  | { kind: 'upload'; id: string; alt: string }

/** Emoji -> ids of the users who reacted with it. */
export type Reactions = Record<string, string[]>

/**
 * A news post. `createdAt` is the publication time: a post with a future
 * `createdAt` is scheduled and only shows in the editor until then.
 */
export interface Post {
  id: string
  channelId: string
  authorId: string
  title: string
  intro: string
  /** Body as plain paragraphs. */
  body: string[]
  image: ImageRef
  createdAt: number
  reactions: Reactions
  /** Regions that see the post; absent or empty means everyone. */
  audience?: RegionId[]
  /** Language the post was written in; Dutch when absent. */
  lang?: Lang
  /** Translations of title, intro and body, keyed by language. */
  translations?: Partial<Record<Lang, PostContent>>
}

export interface Comment {
  id: string
  postId: string
  /** Replies are one level deep: parentId always points at a top-level comment. */
  parentId: string | null
  authorId: string
  text: string
  createdAt: number
  editedAt: number | null
  deleted: boolean
  likes: string[]
  /** Language the comment was written in; Dutch when absent. */
  lang?: Lang
  /** Translations of the text, keyed by language. Cleared when the comment is edited. */
  translations?: Partial<Record<Lang, string>>
}

export type NotificationType = 'new_post' | 'reply' | 'comment_like' | 'post_reaction' | 'question_answered'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  postId: string | null
  commentId: string | null
  questionId?: string | null
  createdAt: number
  read: boolean
}

export interface Conversation {
  id: string
  kind: 'direct' | 'group'
  /** Only for groups. */
  name?: string
  memberIds: string[]
  createdAt: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  authorId: string
  text: string
  createdAt: number
}

export interface Question {
  id: string
  authorId: string
  text: string
  /** "board": only the board (and admins) can see it. */
  visibility: 'public' | 'board'
  createdAt: number
  answer?: { text: string; authorId: string; answeredAt: number }
}

export type Lang = 'nl' | 'en' | 'de'

/** Content in Dutch, optionally translated. Missing translations fall back to Dutch. */
export type Localized<T> = { nl: T } & Partial<Record<Exclude<Lang, 'nl'>, T>>

export type RegionId = 'benelux' | 'nordics' | 'iberia'

export type Tone = ArtworkPalette

/** Building blocks of a content page. */
export type Block =
  | { id: string; type: 'hero'; title: string; subtitle?: string; tone: Tone }
  | { id: string; type: 'heading'; text: string }
  /** Light markup: blank line = paragraph, "- " = bullet, **bold**, [label](url). */
  | { id: string; type: 'text'; text: string }
  | { id: string; type: 'callout'; title: string; text: string; tone: Tone }
  | { id: string; type: 'quote'; text: string; author?: string }
  | { id: string; type: 'image'; image: ImageRef; caption?: string }
  | { id: string; type: 'carousel'; title?: string; slides: { image: ImageRef; title: string }[] }
  | { id: string; type: 'steps'; title?: string; steps: { title: string; text: string }[] }
  | { id: string; type: 'links'; title?: string; items: { label: string; url: string }[] }
  | { id: string; type: 'files'; title?: string; documentIds: string[] }
  | { id: string; type: 'accordion'; title?: string; items: { question: string; answer: string }[] }
  | { id: string; type: 'feed'; title?: string; channelId: string; limit: number }
  | { id: string; type: 'people'; title?: string; userIds: string[] }
  /** An external page (video, map, form) in a sandboxed frame; https only. */
  | { id: string; type: 'embed'; title?: string; url: string; height: number; caption?: string }

export type BlockType = Block['type']

export type PageSection = 'division' | 'company' | 'story' | 'general'

export interface Page {
  id: string
  slug: string
  section: PageSection
  /** Lucide icon name used in menus, see src/components/pageIcons.ts */
  icon: string
  title: Localized<string>
  blocks: Localized<Block[]>
  updatedAt: number
  updatedBy: string
  /** Unpublished changes; only editors see them (in the editor). */
  draft?: PageContent
  /** Earlier published versions, newest first. */
  history: PageVersion[]
}

export interface PageContent {
  title: Localized<string>
  blocks: Localized<Block[]>
}

export interface PageVersion extends PageContent {
  id: string
  publishedAt: number
  publishedBy: string
}

export interface PostContent {
  title: string
  intro: string
  body: string[]
}

export type NotificationPrefs = Record<'new_post' | 'reply' | 'comment_like' | 'question_answered', boolean>

export interface Feedback {
  id: string
  authorId: string
  topic: 'idea' | 'problem' | 'other'
  text: string
  createdAt: number
}

export interface Location {
  id: string
  city: string
  country: CountryCode
  region: RegionId
  address: string
  postcode: string
  phone: string
  email: string
  description: string
  image: ImageRef
  /** e.g. "Hoofdkantoor", "Flagshipstore" */
  kind: string
}

/** A tile on the launchpad: a shortcut to another tool employees use. */
export interface LaunchpadLink {
  id: string
  label: Localized<string>
  url: string
  /** Lucide icon name, see src/components/launchpadIcons.ts */
  icon: string
  color: ColorKey
}

/** A deleted post or page; editors can restore it from the trash. */
export type TrashItem =
  | { id: string; kind: 'post'; post: Post; comments: Comment[]; deletedAt: number; deletedBy: string }
  | { id: string; kind: 'page'; page: Page; deletedAt: number; deletedBy: string }
