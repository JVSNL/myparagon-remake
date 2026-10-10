export type Role = 'employee' | 'editor' | 'admin'

export type CountryCode = 'NL' | 'BE' | 'DE' | 'PL' | 'CZ'

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
}

export interface Channel {
  id: string
  name: string
}

export type ArtworkPalette = 'navy' | 'sky' | 'warm' | 'sage'

export interface Artwork {
  seed: number
  palette: ArtworkPalette
}

/** Emoji -> ids of the users who reacted with it. */
export type Reactions = Record<string, string[]>

export interface Post {
  id: string
  channelId: string
  authorId: string
  title: string
  intro: string
  /** Body as plain paragraphs. */
  body: string[]
  artwork: Artwork
  createdAt: number
  reactions: Reactions
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
}

export type NotificationType = 'new_post' | 'reply' | 'comment_like' | 'post_reaction'

export interface AppNotification {
  id: string
  userId: string
  type: NotificationType
  actorId: string
  postId: string
  commentId: string | null
  createdAt: number
  read: boolean
}
