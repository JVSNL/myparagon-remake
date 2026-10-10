import type { AppNotification, Comment } from '../data/types'
import { canDeleteComment, canEditComment, canPublish } from './permissions'
import type { Action, AppState } from './state'

const toggle = (list: string[], value: string) =>
  list.includes(value) ? list.filter((v) => v !== value) : [...list, value]

const currentUser = (state: AppState) => state.users.find((u) => u.id === state.currentUserId) ?? null

const updateComment = (state: AppState, id: string, fn: (c: Comment) => Comment): AppState => ({
  ...state,
  comments: state.comments.map((c) => (c.id === id ? fn(c) : c)),
})

export function reducer(state: AppState, action: Action): AppState {
  if (action.type === 'reset') return action.state
  if (action.type === 'login') {
    return state.users.some((u) => u.id === action.userId) ? { ...state, currentUserId: action.userId } : state
  }

  const me = currentUser(state)
  if (!me) return state

  switch (action.type) {
    case 'logout':
      return { ...state, currentUserId: null }

    case 'finishOnboarding':
      return state.onboarded.includes(me.id) ? state : { ...state, onboarded: [...state.onboarded, me.id] }

    case 'restartOnboarding':
      return { ...state, onboarded: state.onboarded.filter((id) => id !== me.id) }

    case 'toggleReaction':
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== action.postId) return p
          // One reaction per person: picking another emoji replaces it, the same one removes it.
          const previous = Object.keys(p.reactions).find((e) => p.reactions[e].includes(me.id))
          const reactions: typeof p.reactions = {}
          for (const [emoji, users] of Object.entries(p.reactions)) {
            const rest = users.filter((id) => id !== me.id)
            if (rest.length > 0) reactions[emoji] = rest
          }
          if (previous !== action.emoji) reactions[action.emoji] = [...(reactions[action.emoji] ?? []), me.id]
          return { ...p, reactions }
        }),
      }

    case 'addComment': {
      const text = action.text.trim()
      if (!text || !state.posts.some((p) => p.id === action.postId)) return state
      // Replies stay one level deep: a reply to a reply hangs under the top-level comment.
      const parent = action.parentId ? state.comments.find((c) => c.id === action.parentId) : null
      const parentId = parent ? (parent.parentId ?? parent.id) : null
      const comment: Comment = {
        id: action.id,
        postId: action.postId,
        parentId,
        authorId: me.id,
        text,
        createdAt: action.now,
        editedAt: null,
        deleted: false,
        likes: [],
      }
      return { ...state, comments: [...state.comments, comment] }
    }

    case 'editComment': {
      const comment = state.comments.find((c) => c.id === action.commentId)
      const text = action.text.trim()
      if (!comment || !text || !canEditComment(me, comment)) return state
      return updateComment(state, comment.id, (c) => ({ ...c, text, editedAt: action.now }))
    }

    case 'deleteComment': {
      const comment = state.comments.find((c) => c.id === action.commentId)
      if (!comment || !canDeleteComment(me, comment)) return state
      const hasReplies = state.comments.some((c) => c.parentId === comment.id && !c.deleted)
      if (hasReplies) {
        // Keep a placeholder so the replies keep their context.
        return updateComment(state, comment.id, (c) => ({ ...c, deleted: true, text: '', likes: [] }))
      }
      const remaining = state.comments.filter((c) => c.id !== comment.id)
      // Drop a soft-deleted parent once its last reply is gone.
      const parent = comment.parentId ? remaining.find((c) => c.id === comment.parentId) : undefined
      const orphan = parent?.deleted && !remaining.some((c) => c.parentId === parent.id && !c.deleted)
      return {
        ...state,
        comments: orphan && parent ? remaining.filter((c) => c.id !== parent.id && c.parentId !== parent.id) : remaining,
        notifications: state.notifications.filter((n) => n.commentId !== comment.id),
      }
    }

    case 'toggleCommentLike': {
      const comment = state.comments.find((c) => c.id === action.commentId)
      if (!comment || comment.deleted) return state
      return updateComment(state, comment.id, (c) => ({ ...c, likes: toggle(c.likes, me.id) }))
    }

    case 'toggleBookmark': {
      const mine = state.bookmarks[me.id] ?? []
      const next = mine.includes(action.postId) ? mine.filter((id) => id !== action.postId) : [action.postId, ...mine]
      return { ...state, bookmarks: { ...state.bookmarks, [me.id]: next } }
    }

    case 'markNotificationRead':
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.notificationId && n.userId === me.id ? { ...n, read: true } : n,
        ),
      }

    case 'markAllNotificationsRead':
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.userId === me.id ? { ...n, read: true } : n)),
      }

    case 'createPost': {
      const { input } = action
      if (!canPublish(me) || !input.title.trim() || !state.channels.some((c) => c.id === input.channelId)) {
        return state
      }
      const post = {
        id: action.id,
        channelId: input.channelId,
        authorId: me.id,
        title: input.title.trim(),
        intro: input.intro.trim(),
        body: input.body.map((p) => p.trim()).filter(Boolean),
        image: input.image,
        createdAt: action.now,
        reactions: {},
      }
      const notifications: AppNotification[] = state.users
        .filter((u) => u.id !== me.id)
        .map((u) => ({
          id: `n-${u.id}-${post.id}`,
          userId: u.id,
          type: 'new_post',
          actorId: me.id,
          postId: post.id,
          commentId: null,
          createdAt: action.now,
          read: false,
        }))
      return { ...state, posts: [post, ...state.posts], notifications: [...notifications, ...state.notifications] }
    }

    case 'colleagueLikesComment': {
      const comment = state.comments.find((c) => c.id === action.commentId)
      if (!comment || comment.deleted || comment.likes.includes(action.actorId)) return state
      const liked = updateComment(state, comment.id, (c) => ({ ...c, likes: [...c.likes, action.actorId] }))
      return {
        ...liked,
        notifications: [
          {
            id: action.notificationId,
            userId: comment.authorId,
            type: 'comment_like',
            actorId: action.actorId,
            postId: comment.postId,
            commentId: comment.id,
            createdAt: action.now,
            read: false,
          },
          ...liked.notifications,
        ],
      }
    }

    case 'colleagueReplies': {
      const parent = state.comments.find((c) => c.id === action.parentId)
      if (!parent || parent.deleted) return state
      const reply: Comment = {
        id: action.id,
        postId: parent.postId,
        parentId: parent.parentId ?? parent.id,
        authorId: action.actorId,
        text: action.text,
        createdAt: action.now,
        editedAt: null,
        deleted: false,
        likes: [],
      }
      return {
        ...state,
        comments: [...state.comments, reply],
        notifications: [
          {
            id: action.notificationId,
            userId: parent.authorId,
            type: 'reply',
            actorId: action.actorId,
            postId: parent.postId,
            commentId: reply.id,
            createdAt: action.now,
            read: false,
          },
          ...state.notifications,
        ],
      }
    }
  }
}
