import type { Comment, User } from '../data/types'

export const canPublish = (user: User | null) => user?.role === 'editor' || user?.role === 'admin'

/** Editors and admins manage pages and posts in the editor. */
export const canEditContent = canPublish

/** Board members and admins see board-only questions and can answer them. */
export const canAnswerQuestions = (user: User | null) => user?.department === 'Board' || user?.role === 'admin'

export const canEditComment = (user: User | null, comment: Comment) =>
  !!user && !comment.deleted && comment.authorId === user.id

export const canDeleteComment = (user: User | null, comment: Comment) =>
  !!user && !comment.deleted && (comment.authorId === user.id || user.role === 'admin')
