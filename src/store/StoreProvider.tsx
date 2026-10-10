import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react'
import { buildSeedState, STATE_VERSION } from '../data/seed'
import { userId as seedUserId } from '../data/seed/users'
import type { Feedback, ImageRef, Lang, NotificationPrefs, PageContent, PageSection, PostContent, RegionId, User } from '../data/types'
import { clearImages } from '../lib/imageStore'
import { readJson, writeJson } from '../lib/storage'
import { reducer } from './reducer'
import type { Action, AppState, NewPostInput, ProfileChanges } from './state'

const KEY = 'mynexora:state'

export const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`

const loadState = (): AppState => {
  const saved = readJson<AppState>(KEY)
  return saved?.version === STATE_VERSION ? saved : buildSeedState(Date.now())
}

const randomOf = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

const COMMENT_REPLIES = [
  'Helemaal mee eens! 👍',
  'Goed punt, daar had ik nog niet zo naar gekeken.',
  'Dank voor het delen!',
  'Haha, herkenbaar 😄',
  'Mooi gezegd. Laten we het er bij de koffie eens over hebben.',
]

const CHAT_REPLIES = [
  'Klinkt goed!',
  'Ik kijk er straks naar 👍',
  'Top, dank je!',
  'Prima, laten we dat doen.',
  'Goed idee. Zal ik een afspraak inplannen?',
  'Haha, precies 😄',
]

const BOARD_ANSWERS = [
  'Dank voor je vraag! We nemen dit mee in het volgende directieoverleg en komen er in de kwartaalupdate op terug.',
  'Goede vraag. Hier wordt aan gewerkt; je leidinggevende kan je er binnenkort meer over vertellen.',
]

/** Simulated colleagues, so a demo without a backend still feels alive. */
interface Simulator {
  comment: (commentId: string, isReply: boolean) => void
  chat: (conversationId: string) => void
  question: (questionId: string) => void
}

interface StoreValue {
  state: AppState
  me: User | null
  actions: ReturnType<typeof createActions>
  /** conversationId -> userId of the colleague currently "typing". */
  typing: Record<string, string>
}

const StoreContext = createContext<StoreValue | null>(null)

function createActions(dispatch: (a: Action) => void, simulate: Simulator, getState: () => AppState) {
  return {
    login: (userId: string) => dispatch({ type: 'login', userId }),
    logout: () => dispatch({ type: 'logout' }),
    finishOnboarding: () => dispatch({ type: 'finishOnboarding' }),
    restartOnboarding: () => dispatch({ type: 'restartOnboarding' }),
    toggleReaction: (postId: string, emoji: string) => dispatch({ type: 'toggleReaction', postId, emoji }),
    addComment: (postId: string, text: string, parentId: string | null = null) => {
      const id = newId('cm')
      dispatch({ type: 'addComment', id, postId, parentId, text, now: Date.now() })
      simulate.comment(id, parentId !== null)
      return id
    },
    editComment: (commentId: string, text: string) => dispatch({ type: 'editComment', commentId, text, now: Date.now() }),
    deleteComment: (commentId: string) => dispatch({ type: 'deleteComment', commentId }),
    toggleCommentLike: (commentId: string) => dispatch({ type: 'toggleCommentLike', commentId }),
    toggleBookmark: (postId: string) => dispatch({ type: 'toggleBookmark', postId }),
    markNotificationRead: (notificationId: string) => dispatch({ type: 'markNotificationRead', notificationId }),
    markAllNotificationsRead: () => dispatch({ type: 'markAllNotificationsRead' }),
    createPost: (input: NewPostInput) => {
      const id = newId('p')
      dispatch({ type: 'createPost', id, input, now: Date.now() })
      return id
    },
    chooseRegion: (region: RegionId) => dispatch({ type: 'chooseRegion', region }),
    updateProfile: (userId: string, changes: ProfileChanges) => dispatch({ type: 'updateProfile', userId, changes }),
    /** Opens the existing direct conversation with these people, or starts a new one. Returns its id. */
    startConversation: (memberIds: string[], name?: string) => {
      const state = getState()
      const me = state.currentUserId
      if (!name && memberIds.length === 1 && me) {
        const existing = state.conversations.find(
          (c) => c.kind === 'direct' && c.memberIds.includes(me) && c.memberIds.includes(memberIds[0]),
        )
        if (existing) return existing.id
      }
      // Direct chats get a stable id, so starting one twice (e.g. a double click) opens the same chat.
      const direct = !name && memberIds.length === 1 && me
      const id = direct ? `dm-${[me, memberIds[0]].sort().join('-')}` : newId('cv')
      dispatch({ type: 'startConversation', id, memberIds, name, now: Date.now() })
      return id
    },
    sendMessage: (conversationId: string, text: string) => {
      dispatch({ type: 'sendMessage', id: newId('m'), conversationId, text, now: Date.now() })
      simulate.chat(conversationId)
    },
    markConversationRead: (conversationId: string) =>
      dispatch({ type: 'markConversationRead', conversationId, now: Date.now() }),
    askQuestion: (text: string, visibility: 'public' | 'board') => {
      const id = newId('q')
      dispatch({ type: 'askQuestion', id, text, visibility, now: Date.now() })
      simulate.question(id)
      return id
    },
    answerQuestion: (questionId: string, text: string) =>
      dispatch({ type: 'answerQuestion', questionId, text, now: Date.now(), notificationId: newId('n') }),
    savePageDraft: (pageId: string, content: PageContent) => dispatch({ type: 'savePageDraft', pageId, content }),
    discardPageDraft: (pageId: string) => dispatch({ type: 'discardPageDraft', pageId }),
    publishPage: (pageId: string) => dispatch({ type: 'publishPage', pageId, versionId: newId('v'), now: Date.now() }),
    restorePageVersion: (pageId: string, versionId: string) => dispatch({ type: 'restorePageVersion', pageId, versionId }),
    createPage: (slug: string, section: PageSection, title: string) => {
      const id = newId('pg')
      dispatch({ type: 'createPage', id, slug, section, title, now: Date.now() })
      return id
    },
    updatePost: (postId: string, lang: Lang, content: PostContent, image?: ImageRef) =>
      dispatch({ type: 'updatePost', postId, lang, content, image }),
    removePostTranslation: (postId: string, lang: Exclude<Lang, 'nl'>) => dispatch({ type: 'removePostTranslation', postId, lang }),
    deletePost: (postId: string) => dispatch({ type: 'deletePost', postId }),
    setNotificationPrefs: (prefs: NotificationPrefs) => dispatch({ type: 'setNotificationPrefs', prefs }),
    sendFeedback: (topic: Feedback['topic'], text: string) =>
      dispatch({ type: 'sendFeedback', id: newId('fb'), topic, text, now: Date.now() }),
    resetDemo: () => {
      void clearImages()
      dispatch({ type: 'reset', state: buildSeedState(Date.now()) })
    },
  }
}

export function StoreProvider({ children, initialState }: { children: ReactNode; initialState?: AppState }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => s ?? loadState())
  const [typing, setTyping] = useState<Record<string, string>>({})
  const stateRef = useRef(state)
  const timers = useRef<number[]>([])

  useEffect(() => {
    stateRef.current = state
    writeJson(KEY, state)
  }, [state])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const actions = useMemo(() => {
    const later = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, ms))
    const others = (ids?: string[]) =>
      (ids ?? stateRef.current.users.map((u) => u.id)).filter((id) => id !== stateRef.current.currentUserId)

    const simulate: Simulator = {
      // Someone likes your comment, and someone replies to new top-level comments.
      comment: (commentId, isReply) => {
        const pool = others()
        if (pool.length === 0) return
        later(4000, () =>
          dispatch({ type: 'colleagueLikesComment', actorId: randomOf(pool), commentId, notificationId: newId('n'), now: Date.now() }),
        )
        if (isReply) return
        later(9000, () =>
          dispatch({
            type: 'colleagueReplies',
            actorId: randomOf(pool),
            parentId: commentId,
            id: newId('cm'),
            text: randomOf(COMMENT_REPLIES),
            notificationId: newId('n'),
            now: Date.now(),
          }),
        )
      },
      // Another member of the conversation starts typing and answers.
      chat: (conversationId) => {
        const conversation = stateRef.current.conversations.find((c) => c.id === conversationId)
        const pool = others(conversation?.memberIds)
        if (pool.length === 0) return
        const author = randomOf(pool)
        later(1500, () => setTyping((t) => ({ ...t, [conversationId]: author })))
        later(4500, () => {
          setTyping(({ [conversationId]: _, ...rest }) => rest)
          dispatch({ type: 'colleagueMessage', id: newId('m'), conversationId, authorId: author, text: randomOf(CHAT_REPLIES), now: Date.now() })
        })
      },
      // The CEO answers new questions.
      question: (questionId) =>
        later(8000, () =>
          dispatch({
            type: 'boardAnswers',
            questionId,
            authorId: seedUserId(1),
            text: randomOf(BOARD_ANSWERS),
            now: Date.now(),
            notificationId: newId('n'),
          }),
        ),
    }
    return createActions(dispatch, simulate, () => stateRef.current)
  }, [])

  const me = state.users.find((u) => u.id === state.currentUserId) ?? null

  useEffect(() => {
    // Logging out cancels pending simulated activity.
    if (!me) {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [me])

  const value = useMemo(() => ({ state, me, actions, typing }), [state, me, actions, typing])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
