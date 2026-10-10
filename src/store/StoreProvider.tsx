import { createContext, useContext, useEffect, useMemo, useReducer, useRef, type ReactNode } from 'react'
import { buildSeedState, STATE_VERSION } from '../data/seed'
import type { RegionId, User } from '../data/types'
import { clearImages } from '../lib/imageStore'
import { readJson, writeJson } from '../lib/storage'
import { reducer } from './reducer'
import type { Action, AppState, NewPostInput, ProfileChanges } from './state'

const KEY = 'mynexora:state'

const newId = (prefix: string) =>
  `${prefix}-${typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`

const loadState = (): AppState => {
  const saved = readJson<AppState>(KEY)
  return saved?.version === STATE_VERSION ? saved : buildSeedState(Date.now())
}

const CANNED_REPLIES = [
  'Helemaal mee eens! 👍',
  'Goed punt, daar had ik nog niet zo naar gekeken.',
  'Dank voor het delen!',
  'Haha, herkenbaar 😄',
  'Mooi gezegd. Laten we het er bij de koffie eens over hebben.',
]

interface StoreValue {
  state: AppState
  me: User | null
  actions: ReturnType<typeof createActions>
}

const StoreContext = createContext<StoreValue | null>(null)

function createActions(dispatch: (a: Action) => void, simulate: (commentId: string, isReply: boolean) => void) {
  return {
    login: (userId: string) => dispatch({ type: 'login', userId }),
    logout: () => dispatch({ type: 'logout' }),
    finishOnboarding: () => dispatch({ type: 'finishOnboarding' }),
    restartOnboarding: () => dispatch({ type: 'restartOnboarding' }),
    toggleReaction: (postId: string, emoji: string) => dispatch({ type: 'toggleReaction', postId, emoji }),
    addComment: (postId: string, text: string, parentId: string | null = null) => {
      const id = newId('cm')
      dispatch({ type: 'addComment', id, postId, parentId, text, now: Date.now() })
      simulate(id, parentId !== null)
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
    resetDemo: () => {
      void clearImages()
      dispatch({ type: 'reset', state: buildSeedState(Date.now()) })
    },
  }
}

export function StoreProvider({ children, initialState }: { children: ReactNode; initialState?: AppState }) {
  const [state, dispatch] = useReducer(reducer, initialState, (s) => s ?? loadState())
  const stateRef = useRef(state)
  const timers = useRef<number[]>([])

  useEffect(() => {
    stateRef.current = state
    writeJson(KEY, state)
  }, [state])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const actions = useMemo(() => {
    // Simulated colleagues: someone likes your comment after a few seconds,
    // and someone replies to new top-level comments, so notifications have
    // something to show in a demo without a backend.
    const simulate = (commentId: string, isReply: boolean) => {
      const others = stateRef.current.users.filter((u) => u.id !== stateRef.current.currentUserId)
      if (others.length === 0) return
      const pick = () => others[Math.floor(Math.random() * others.length)].id
      timers.current.push(
        window.setTimeout(
          () =>
            dispatch({
              type: 'colleagueLikesComment',
              actorId: pick(),
              commentId,
              notificationId: newId('n'),
              now: Date.now(),
            }),
          4000,
        ),
      )
      if (isReply) return
      timers.current.push(
        window.setTimeout(
          () =>
            dispatch({
              type: 'colleagueReplies',
              actorId: pick(),
              parentId: commentId,
              id: newId('cm'),
              text: CANNED_REPLIES[Math.floor(Math.random() * CANNED_REPLIES.length)],
              notificationId: newId('n'),
              now: Date.now(),
            }),
          9000,
        ),
      )
    }
    return createActions(dispatch, simulate)
  }, [])

  const me = state.users.find((u) => u.id === state.currentUserId) ?? null

  useEffect(() => {
    // Logging out cancels pending simulated activity.
    if (!me) {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
  }, [me])

  const value = useMemo(() => ({ state, me, actions }), [state, me, actions])
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}
