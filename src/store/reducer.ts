import type { AppNotification, Comment } from '../data/types'
import { canAnswerQuestions, canDeleteComment, canEditComment, canEditContent, canPublish } from './permissions'
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
        lang: action.lang ?? 'nl',
      }
      return { ...state, comments: [...state.comments, comment] }
    }

    case 'editComment': {
      const comment = state.comments.find((c) => c.id === action.commentId)
      const text = action.text.trim()
      if (!comment || !text || !canEditComment(me, comment)) return state
      // Stored translations no longer match the new text.
      return updateComment(state, comment.id, ({ translations: _stale, ...c }) => ({
        ...c,
        text,
        editedAt: action.now,
        lang: action.lang ?? c.lang,
      }))
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
        lang: input.lang ?? 'nl',
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

    case 'chooseRegion':
      return { ...state, regionChoice: { ...state.regionChoice, [me.id]: action.region } }

    case 'updateProfile': {
      if (me.id !== action.userId && me.role !== 'admin') return state
      const changes = { ...action.changes }
      for (const key of ['firstName', 'lastName', 'jobTitle', 'department', 'location', 'email', 'phone', 'bio'] as const) {
        if (changes[key] !== undefined) changes[key] = changes[key].trim()
      }
      if (changes.firstName === '' || changes.lastName === '') return state
      if (changes.skills) changes.skills = [...new Set(changes.skills.map((s) => s.trim()).filter(Boolean))]
      return { ...state, users: state.users.map((u) => (u.id === action.userId ? { ...u, ...changes } : u)) }
    }

    case 'startConversation': {
      const members = [...new Set([me.id, ...action.memberIds])].filter((id) => state.users.some((u) => u.id === id))
      if (members.length < 2) return state
      const kind = members.length === 2 && !action.name ? 'direct' : 'group'
      if (kind === 'direct') {
        const existing = state.conversations.find(
          (c) => c.kind === 'direct' && members.every((m) => c.memberIds.includes(m)),
        )
        if (existing) return state
      }
      const name = action.name?.trim()
      return {
        ...state,
        conversations: [
          ...state.conversations,
          { id: action.id, kind, ...(kind === 'group' ? { name: name || undefined } : {}), memberIds: members, createdAt: action.now },
        ],
      }
    }

    case 'sendMessage': {
      const text = action.text.trim()
      const conversation = state.conversations.find((c) => c.id === action.conversationId)
      if (!text || !conversation?.memberIds.includes(me.id)) return state
      return {
        ...state,
        messages: [...state.messages, { id: action.id, conversationId: conversation.id, authorId: me.id, text, createdAt: action.now }],
        chatRead: { ...state.chatRead, [me.id]: { ...state.chatRead[me.id], [conversation.id]: action.now } },
      }
    }

    case 'markConversationRead': {
      const conversation = state.conversations.find((c) => c.id === action.conversationId)
      if (!conversation?.memberIds.includes(me.id)) return state
      return { ...state, chatRead: { ...state.chatRead, [me.id]: { ...state.chatRead[me.id], [conversation.id]: action.now } } }
    }

    case 'colleagueMessage': {
      const conversation = state.conversations.find((c) => c.id === action.conversationId)
      if (!conversation?.memberIds.includes(action.authorId)) return state
      return {
        ...state,
        messages: [
          ...state.messages,
          { id: action.id, conversationId: conversation.id, authorId: action.authorId, text: action.text, createdAt: action.now },
        ],
      }
    }

    case 'askQuestion': {
      const text = action.text.trim()
      if (!text) return state
      return {
        ...state,
        questions: [{ id: action.id, authorId: me.id, text, visibility: action.visibility, createdAt: action.now }, ...state.questions],
      }
    }

    case 'answerQuestion':
    case 'boardAnswers': {
      const authorId = action.type === 'answerQuestion' ? me.id : action.authorId
      const author = state.users.find((u) => u.id === authorId) ?? null
      const question = state.questions.find((q) => q.id === action.questionId)
      const text = action.text.trim()
      if (!question || question.answer || !text || !canAnswerQuestions(author)) return state
      return {
        ...state,
        questions: state.questions.map((q) =>
          q.id === question.id ? { ...q, answer: { text, authorId, answeredAt: action.now } } : q,
        ),
        notifications: [
          {
            id: action.notificationId,
            userId: question.authorId,
            type: 'question_answered',
            actorId: authorId,
            postId: null,
            commentId: null,
            questionId: question.id,
            createdAt: action.now,
            read: false,
          },
          ...state.notifications,
        ],
      }
    }

    case 'savePageDraft': {
      if (!canEditContent(me) || !state.pages.some((p) => p.id === action.pageId)) return state
      return { ...state, pages: state.pages.map((p) => (p.id === action.pageId ? { ...p, draft: action.content } : p)) }
    }

    case 'discardPageDraft': {
      if (!canEditContent(me)) return state
      return { ...state, pages: state.pages.map((p) => (p.id === action.pageId ? { ...p, draft: undefined } : p)) }
    }

    case 'publishPage': {
      const page = state.pages.find((p) => p.id === action.pageId)
      if (!canEditContent(me) || !page?.draft || !page.draft.title.nl.trim()) return state
      // The version that was live until now goes into the history (max. 20 kept).
      const previous = { id: action.versionId, title: page.title, blocks: page.blocks, publishedAt: page.updatedAt, publishedBy: page.updatedBy }
      return {
        ...state,
        pages: state.pages.map((p) =>
          p.id === page.id
            ? {
                ...p,
                ...page.draft,
                draft: undefined,
                updatedAt: action.now,
                updatedBy: me.id,
                history: [previous, ...p.history].slice(0, 20),
              }
            : p,
        ),
      }
    }

    case 'restorePageVersion': {
      const page = state.pages.find((p) => p.id === action.pageId)
      const version = page?.history.find((v) => v.id === action.versionId)
      if (!canEditContent(me) || !page || !version) return state
      return {
        ...state,
        pages: state.pages.map((p) => (p.id === page.id ? { ...p, draft: { title: version.title, blocks: version.blocks } } : p)),
      }
    }

    case 'createPage': {
      const title = action.title.trim()
      const slug = action.slug.trim()
      if (!canEditContent(me) || !title || !/^[a-z0-9-]+$/.test(slug) || state.pages.some((p) => p.slug === slug)) return state
      return {
        ...state,
        pages: [
          ...state.pages,
          {
            id: action.id,
            slug,
            section: action.section,
            icon: 'file-text',
            title: { nl: title },
            blocks: { nl: [{ id: `${action.id}-b1`, type: 'hero', title, tone: 'navy' }] },
            updatedAt: action.now,
            updatedBy: me.id,
            history: [],
          },
        ],
      }
    }

    case 'updatePost': {
      const post = state.posts.find((p) => p.id === action.postId)
      const content = {
        title: action.content.title.trim(),
        intro: action.content.intro.trim(),
        body: action.content.body.map((b) => b.trim()).filter(Boolean),
      }
      if (!canEditContent(me) || !post || !content.title) return state
      const updated =
        action.lang === (post.lang ?? 'nl')
          ? { ...post, ...content, ...(action.image ? { image: action.image } : {}) }
          : { ...post, translations: { ...post.translations, [action.lang]: content } }
      return { ...state, posts: state.posts.map((p) => (p.id === post.id ? updated : p)) }
    }

    case 'removePostTranslation': {
      if (!canEditContent(me)) return state
      return {
        ...state,
        posts: state.posts.map((p) => {
          if (p.id !== action.postId || !p.translations) return p
          const { [action.lang]: _removed, ...rest } = p.translations
          return { ...p, translations: rest }
        }),
      }
    }

    case 'deletePost': {
      if (!canEditContent(me) || !state.posts.some((p) => p.id === action.postId)) return state
      return {
        ...state,
        posts: state.posts.filter((p) => p.id !== action.postId),
        comments: state.comments.filter((c) => c.postId !== action.postId),
        notifications: state.notifications.filter((n) => n.postId !== action.postId),
        bookmarks: Object.fromEntries(Object.entries(state.bookmarks).map(([u, ids]) => [u, ids.filter((id) => id !== action.postId)])),
      }
    }

    case 'setNotificationPrefs':
      return { ...state, notificationPrefs: { ...state.notificationPrefs, [me.id]: action.prefs } }

    case 'sendFeedback': {
      const text = action.text.trim()
      if (!text) return state
      return { ...state, feedback: [{ id: action.id, authorId: me.id, topic: action.topic, text, createdAt: action.now }, ...state.feedback] }
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
        lang: 'nl',
        ...(action.translations ? { translations: action.translations } : {}),
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
