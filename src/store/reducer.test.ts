import { describe, expect, it } from 'vitest'
import { buildSeedState } from '../data/seed'
import { DEMO_ACCOUNTS } from '../data/seed/users'
import { reducer } from './reducer'
import { notificationsFor, postContent } from './selectors'
import type { Action, AppState } from './state'

const NOW = Date.UTC(2026, 9, 10, 12)

const signedIn = (userId: string = DEMO_ACCOUNTS.employee): AppState =>
  reducer(buildSeedState(NOW), { type: 'login', userId })

const run = (state: AppState, ...actions: Action[]) => actions.reduce(reducer, state)

const addComment = (id: string, parentId: string | null = null, text = 'Hallo'): Action => ({
  type: 'addComment',
  id,
  postId: 'p01',
  parentId,
  text,
  now: NOW,
})

describe('seed', () => {
  it('has 60 users, posts and a demo account per role', () => {
    const state = buildSeedState(NOW)
    expect(state.users).toHaveLength(60)
    expect(state.posts.length).toBeGreaterThan(5)
    const roles = Object.values(DEMO_ACCOUNTS).map((id) => state.users.find((u) => u.id === id)?.role)
    expect(roles).toEqual(['employee', 'editor', 'admin'])
  })

  it('has at most one reaction per person per post', () => {
    for (const post of buildSeedState(NOW).posts) {
      const all = Object.values(post.reactions).flat()
      expect(new Set(all).size).toBe(all.length)
    }
  })

  it('only refers to existing users and posts', () => {
    const state = buildSeedState(NOW)
    const users = new Set(state.users.map((u) => u.id))
    const posts = new Set(state.posts.map((p) => p.id))
    expect(state.posts.every((p) => users.has(p.authorId))).toBe(true)
    expect(state.comments.every((c) => users.has(c.authorId) && posts.has(c.postId))).toBe(true)
    expect(state.users.every((u) => u.managerId === null || users.has(u.managerId))).toBe(true)
  })
})

describe('session', () => {
  it('ignores actions when nobody is signed in', () => {
    const state = buildSeedState(NOW)
    expect(reducer(state, { type: 'toggleBookmark', postId: 'p01' })).toBe(state)
  })

  it('does not sign in unknown users', () => {
    const state = buildSeedState(NOW)
    expect(reducer(state, { type: 'login', userId: 'nope' }).currentUserId).toBeNull()
  })

  it('tracks onboarding per user', () => {
    const state = run(signedIn(), { type: 'finishOnboarding' })
    expect(state.onboarded).toEqual([DEMO_ACCOUNTS.employee])
    expect(run(state, { type: 'restartOnboarding' }).onboarded).toEqual([])
  })
})

describe('reactions', () => {
  it('allows one reaction per person: another emoji replaces it', () => {
    const me = DEMO_ACCOUNTS.employee
    const state = run(
      signedIn(),
      { type: 'toggleReaction', postId: 'p02', emoji: '🦄' },
      { type: 'toggleReaction', postId: 'p02', emoji: '🐙' },
    )
    const reactions = state.posts.find((p) => p.id === 'p02')!.reactions
    expect(reactions['🦄']).toBeUndefined()
    expect(reactions['🐙']).toEqual([me])
    expect(Object.values(reactions).flat().filter((id) => id === me)).toHaveLength(1)
  })

  it('toggles any emoji and removes empty entries', () => {
    const me = DEMO_ACCOUNTS.employee
    let state = run(signedIn(), { type: 'toggleReaction', postId: 'p02', emoji: '🦄' })
    expect(state.posts.find((p) => p.id === 'p02')?.reactions['🦄']).toEqual([me])
    state = run(state, { type: 'toggleReaction', postId: 'p02', emoji: '🦄' })
    expect(state.posts.find((p) => p.id === 'p02')?.reactions['🦄']).toBeUndefined()
  })
})

describe('comments', () => {
  it('adds trimmed comments and ignores empty ones', () => {
    const before = signedIn()
    const state = run(before, addComment('x1', null, '  Mooi!  '), addComment('x2', null, '   '))
    expect(state.comments.length).toBe(before.comments.length + 1)
    expect(state.comments.at(-1)).toMatchObject({ id: 'x1', text: 'Mooi!', parentId: null })
  })

  it('keeps replies one level deep', () => {
    const state = run(signedIn(), addComment('top'), addComment('r1', 'top'), addComment('r2', 'r1'))
    expect(state.comments.find((c) => c.id === 'r2')?.parentId).toBe('top')
  })

  it('only lets the author edit', () => {
    const state = run(signedIn(), addComment('mine'))
    const edited = run(state, { type: 'editComment', commentId: 'mine', text: 'Nieuw', now: NOW + 1 })
    expect(edited.comments.find((c) => c.id === 'mine')).toMatchObject({ text: 'Nieuw', editedAt: NOW + 1 })
    const foreign = state.comments.find((c) => c.authorId !== DEMO_ACCOUNTS.employee)!
    expect(run(state, { type: 'editComment', commentId: foreign.id, text: 'Hack', now: NOW })).toBe(state)
  })

  it('lets admins delete any comment, employees only their own', () => {
    const foreign = signedIn().comments.find((c) => c.authorId !== DEMO_ACCOUNTS.employee && c.parentId)!
    const asEmployee = signedIn()
    expect(run(asEmployee, { type: 'deleteComment', commentId: foreign.id })).toBe(asEmployee)
    const asAdmin = run(signedIn(DEMO_ACCOUNTS.admin), { type: 'deleteComment', commentId: foreign.id })
    expect(asAdmin.comments.some((c) => c.id === foreign.id)).toBe(false)
  })

  it('soft-deletes a comment that has replies, and cleans up once the replies are gone', () => {
    let state = run(signedIn(), addComment('top'), addComment('reply', 'top'))
    state = run(state, { type: 'deleteComment', commentId: 'top' })
    expect(state.comments.find((c) => c.id === 'top')).toMatchObject({ deleted: true, text: '' })
    state = run(state, { type: 'deleteComment', commentId: 'reply' })
    expect(state.comments.some((c) => c.id === 'top' || c.id === 'reply')).toBe(false)
  })

  it('toggles likes', () => {
    const state = run(signedIn(), addComment('c'), { type: 'toggleCommentLike', commentId: 'c' })
    expect(state.comments.find((c) => c.id === 'c')?.likes).toEqual([DEMO_ACCOUNTS.employee])
  })
})

describe('bookmarks and notifications', () => {
  it('toggles bookmarks, most recent first', () => {
    const state = run(signedIn(), { type: 'toggleBookmark', postId: 'p01' }, { type: 'toggleBookmark', postId: 'p02' })
    expect(state.bookmarks[DEMO_ACCOUNTS.employee]).toEqual(['p02', 'p01'])
    expect(run(state, { type: 'toggleBookmark', postId: 'p02' }).bookmarks[DEMO_ACCOUNTS.employee]).toEqual(['p01'])
  })

  it('marks only your own notifications as read', () => {
    const state = run(signedIn(), { type: 'markAllNotificationsRead' })
    const mine = state.notifications.filter((n) => n.userId === DEMO_ACCOUNTS.employee)
    const others = state.notifications.filter((n) => n.userId !== DEMO_ACCOUNTS.employee)
    expect(mine.length).toBeGreaterThan(0)
    expect(mine.every((n) => n.read)).toBe(true)
    expect(others.some((n) => !n.read)).toBe(true)
  })

  it('notifies you when a colleague likes or replies to your comment', () => {
    const state = run(
      signedIn(),
      addComment('mine'),
      { type: 'colleagueLikesComment', actorId: 'u01', commentId: 'mine', notificationId: 'n1', now: NOW },
      { type: 'colleagueReplies', actorId: 'u02', parentId: 'mine', id: 'r', text: 'Eens!', notificationId: 'n2', now: NOW },
    )
    const mine = state.notifications.filter((n) => n.userId === DEMO_ACCOUNTS.employee).map((n) => n.type)
    expect(mine).toContain('comment_like')
    expect(mine).toContain('reply')
    expect(state.comments.find((c) => c.id === 'r')?.parentId).toBe('mine')
  })
})

describe('profiles and regions', () => {
  it('lets you edit your own profile, trimmed and with unique skills', () => {
    const me = DEMO_ACCOUNTS.employee
    const state = run(signedIn(), {
      type: 'updateProfile',
      userId: me,
      changes: { jobTitle: '  Senior Analyst ', skills: ['Excel', ' Excel', '', 'SQL'] },
    })
    expect(state.users.find((u) => u.id === me)).toMatchObject({ jobTitle: 'Senior Analyst', skills: ['Excel', 'SQL'] })
  })

  it('refuses empty names and other people’s profiles (unless admin)', () => {
    const state = signedIn()
    expect(run(state, { type: 'updateProfile', userId: DEMO_ACCOUNTS.employee, changes: { firstName: ' ' } })).toBe(state)
    expect(run(state, { type: 'updateProfile', userId: 'u01', changes: { bio: 'x' } })).toBe(state)
    const admin = run(signedIn(DEMO_ACCOUNTS.admin), { type: 'updateProfile', userId: 'u01', changes: { bio: 'Nieuw' } })
    expect(admin.users.find((u) => u.id === 'u01')?.bio).toBe('Nieuw')
  })

  it('remembers the chosen region per user', () => {
    const state = run(signedIn(), { type: 'chooseRegion', region: 'dach' })
    expect(state.regionChoice[DEMO_ACCOUNTS.employee]).toBe('dach')
  })
})

describe('chat', () => {
  it('reuses direct conversations and only lets members post', () => {
    let state = run(signedIn(), { type: 'startConversation', id: 'c1', memberIds: ['u01'], now: NOW })
    state = run(state, { type: 'startConversation', id: 'c2', memberIds: ['u01'], now: NOW })
    expect(state.conversations.filter((c) => c.id === 'c1' || c.id === 'c2')).toHaveLength(1)
    state = run(state, { type: 'sendMessage', id: 'm1', conversationId: 'c1', text: ' Hoi ', now: NOW })
    expect(state.messages.at(-1)).toMatchObject({ id: 'm1', text: 'Hoi', authorId: DEMO_ACCOUNTS.employee })
    const notMine = state.conversations.find((c) => !c.memberIds.includes(DEMO_ACCOUNTS.employee))!
    expect(run(state, { type: 'sendMessage', id: 'm2', conversationId: notMine.id, text: 'x', now: NOW })).toBe(state)
  })

  it('creates groups with a name and needs at least one other member', () => {
    const state = run(signedIn(), { type: 'startConversation', id: 'g', memberIds: ['u01', 'u02'], name: ' Team ', now: NOW })
    expect(state.conversations.find((c) => c.id === 'g')).toMatchObject({ kind: 'group', name: 'Team' })
    const alone = signedIn()
    expect(run(alone, { type: 'startConversation', id: 'x', memberIds: [], now: NOW })).toBe(alone)
  })
})

describe('Ask the Board', () => {
  it('lets the board answer and notifies the person who asked', () => {
    let state = run(signedIn(), { type: 'askQuestion', id: 'q', text: 'Vraag?', visibility: 'board', now: NOW })
    // An employee cannot answer
    expect(run(state, { type: 'answerQuestion', questionId: 'q', text: 'Ja', now: NOW, notificationId: 'n' })).toBe(state)
    state = run(state, { type: 'boardAnswers', questionId: 'q', authorId: 'u01', text: 'Ja', now: NOW, notificationId: 'n' })
    expect(state.questions.find((q) => q.id === 'q')?.answer).toMatchObject({ text: 'Ja', authorId: 'u01' })
    expect(state.notifications.find((n) => n.id === 'n')).toMatchObject({ userId: DEMO_ACCOUNTS.employee, type: 'question_answered' })
  })
})

describe('page editor', () => {
  const page = (state: AppState) => state.pages.find((p) => p.id === 'pg-strategy')!

  it('keeps drafts separate until publishing, and keeps the old version', () => {
    let state = signedIn(DEMO_ACCOUNTS.editor)
    const live = page(state)
    const content = { title: { nl: 'Nieuwe strategie' }, blocks: { nl: [] } }
    state = run(state, { type: 'savePageDraft', pageId: live.id, content })
    expect(page(state).title.nl).toBe('Strategie')
    expect(page(state).draft?.title.nl).toBe('Nieuwe strategie')
    state = run(state, { type: 'publishPage', pageId: live.id, versionId: 'v1', now: NOW })
    expect(page(state)).toMatchObject({ title: { nl: 'Nieuwe strategie' }, draft: undefined, updatedBy: DEMO_ACCOUNTS.editor })
    expect(page(state).history[0]).toMatchObject({ id: 'v1', title: live.title })
    state = run(state, { type: 'restorePageVersion', pageId: live.id, versionId: 'v1' })
    expect(page(state).draft?.title).toEqual(live.title)
  })

  it('is not available to employees', () => {
    const state = signedIn()
    const content = { title: { nl: 'x' }, blocks: { nl: [] } }
    expect(run(state, { type: 'savePageDraft', pageId: 'pg-strategy', content })).toBe(state)
  })

  it('creates pages with a unique, valid address', () => {
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    const created = run(editor, { type: 'createPage', id: 'pg-new', slug: 'nieuw', section: 'story', title: 'Nieuw', now: NOW })
    expect(created.pages.find((p) => p.id === 'pg-new')?.slug).toBe('nieuw')
    expect(run(editor, { type: 'createPage', id: 'x', slug: 'faq', section: 'story', title: 'Dubbel', now: NOW })).toBe(editor)
    expect(run(editor, { type: 'createPage', id: 'x', slug: 'Met Spatie', section: 'story', title: 'Fout', now: NOW })).toBe(editor)
  })
})

describe('post translations and deletion', () => {
  it('stores translations next to the Dutch original and removes them again', () => {
    const content = { title: 'Hello', intro: 'Intro', body: ['One', ' '] }
    let state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'updatePost', postId: 'p02', lang: 'en', content })
    const post = () => state.posts.find((p) => p.id === 'p02')!
    expect(post().translations?.en).toEqual({ title: 'Hello', intro: 'Intro', body: ['One'] })
    expect(postContent(post(), 'en').title).toBe('Hello')
    expect(postContent(post(), 'de').title).toBe(post().title)
    state = run(state, { type: 'removePostTranslation', postId: 'p02', lang: 'en' })
    expect(post().translations?.en).toBeUndefined()
  })

  it('deletes a post with its comments', () => {
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'deletePost', postId: 'p01' })
    expect(state.posts.some((p) => p.id === 'p01')).toBe(false)
    expect(state.comments.some((c) => c.postId === 'p01')).toBe(false)
  })
})

describe('notification settings and feedback', () => {
  it('hides switched-off notification types', () => {
    const me = DEMO_ACCOUNTS.employee
    const before = notificationsFor(signedIn(), me).length
    const state = run(signedIn(), {
      type: 'setNotificationPrefs',
      prefs: { new_post: false, reply: true, comment_like: true, question_answered: true },
    })
    expect(before).toBeGreaterThan(0)
    expect(notificationsFor(state, me).filter((n) => n.type === 'new_post')).toHaveLength(0)
  })

  it('stores feedback', () => {
    const state = run(signedIn(), { type: 'sendFeedback', id: 'f1', topic: 'idea', text: ' Donkere modus is top ', now: NOW })
    expect(state.feedback[0]).toMatchObject({ id: 'f1', text: 'Donkere modus is top', authorId: DEMO_ACCOUNTS.employee })
  })
})

describe('publishing', () => {
  const input = {
    channelId: 'c-company',
    title: ' Nieuw ',
    intro: 'Intro',
    body: ['Alinea 1', ' ', 'Alinea 2'],
    image: { kind: 'artwork' as const, seed: 1, palette: 'navy' as const },
  }

  it('is not allowed for employees', () => {
    const state = signedIn()
    expect(run(state, { type: 'createPost', id: 'new', input, now: NOW })).toBe(state)
  })

  it('lets editors publish and notifies everyone else', () => {
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPost', id: 'new', input, now: NOW })
    expect(state.posts[0]).toMatchObject({ id: 'new', title: 'Nieuw', body: ['Alinea 1', 'Alinea 2'] })
    const notified = state.notifications.filter((n) => n.postId === 'new')
    expect(notified).toHaveLength(59)
    expect(notified.some((n) => n.userId === DEMO_ACCOUNTS.editor)).toBe(false)
  })
})
