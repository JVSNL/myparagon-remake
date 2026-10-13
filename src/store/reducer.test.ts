import { describe, expect, it } from 'vitest'
import { buildSeedState } from '../data/seed'
import { DEMO_ACCOUNTS } from '../data/seed/users'
import { reducer } from './reducer'
import { notificationsFor, postContent, postStats, visiblePosts } from './selectors'
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
    const state = run(signedIn(), { type: 'chooseRegion', region: 'nordics' })
    expect(state.regionChoice[DEMO_ACCOUNTS.employee]).toBe('nordics')
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
    state = run(state, { type: 'removePostTranslation', postId: 'p02', lang: 'en' })
    expect(post().translations?.en).toBeUndefined()
    expect(postContent(post(), 'en').title).toBe(post().title)
  })

  it('treats the language a post was written in as the original', () => {
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    const input = { channelId: 'c-company', title: 'Hallo zusammen', intro: '', body: ['Text'], image: { kind: 'artwork' as const, seed: 1, palette: 'navy' as const }, lang: 'de' as const }
    let state = run(editor, { type: 'createPost', id: 'p-de', input, now: NOW })
    const post = () => state.posts.find((p) => p.id === 'p-de')!
    expect(post().lang).toBe('de')
    expect(postContent(post(), 'de').title).toBe('Hallo zusammen')
    // Saving the German version edits the original, saving Dutch adds a translation.
    state = run(state, { type: 'updatePost', postId: 'p-de', lang: 'de', content: { title: 'Hallo alle', intro: '', body: ['Text'] } })
    state = run(state, { type: 'updatePost', postId: 'p-de', lang: 'nl', content: { title: 'Hallo allemaal', intro: '', body: ['Tekst'] } })
    expect(post().title).toBe('Hallo alle')
    expect(post().translations?.nl?.title).toBe('Hallo allemaal')
  })
})

describe('comment languages', () => {
  it('records the language of a new comment and drops stale translations on edit', () => {
    let state = run(signedIn(), { type: 'addComment', id: 'c-en', postId: 'p01', parentId: null, text: 'Great ride!', now: NOW, lang: 'en' })
    expect(state.comments.find((c) => c.id === 'c-en')?.lang).toBe('en')

    state = { ...state, comments: state.comments.map((c) => (c.id === 'c-en' ? { ...c, translations: { de: 'Tolle Tour!' } } : c)) }
    state = run(state, { type: 'editComment', commentId: 'c-en', text: 'Mooie rit!', now: NOW, lang: 'nl' })
    const edited = state.comments.find((c) => c.id === 'c-en')!
    expect(edited.translations).toBeUndefined()
    expect(edited.lang).toBe('nl')
  })

  it('keeps translations of simulated replies', () => {
    const state = run(signedIn(), {
      type: 'colleagueReplies',
      actorId: 'u02',
      parentId: 'cm1',
      id: 'c-sim',
      text: 'Dank voor het delen!',
      translations: { en: 'Thanks for sharing!' },
      notificationId: 'n-sim',
      now: NOW,
    })
    expect(state.comments.find((c) => c.id === 'c-sim')?.translations?.en).toBe('Thanks for sharing!')
  })

  it('deletes a post with its comments', () => {
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'deletePost', postId: 'p01', trashId: 'tr1', now: NOW })
    expect(state.posts.some((p) => p.id === 'p01')).toBe(false)
    expect(state.comments.some((c) => c.postId === 'p01')).toBe(false)
  })
})

describe('notification settings and feedback', () => {
  it('hides switched-off notification types', () => {
    const me = DEMO_ACCOUNTS.employee
    const before = notificationsFor(signedIn(), me, NOW).length
    const state = run(signedIn(), {
      type: 'setNotificationPrefs',
      prefs: { new_post: false, reply: true, comment_like: true, question_answered: true },
    })
    expect(before).toBeGreaterThan(0)
    expect(notificationsFor(state, me, NOW).filter((n) => n.type === 'new_post')).toHaveLength(0)
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

describe('trash', () => {
  it('moves a deleted post with its comments to the trash and restores it', () => {
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    const comments = editor.comments.filter((c) => c.postId === 'p01').length
    let state = run(editor, { type: 'deletePost', postId: 'p01', trashId: 'tr1', now: NOW })
    expect(state.trash).toHaveLength(1)
    expect(state.trash[0]).toMatchObject({ kind: 'post', deletedBy: DEMO_ACCOUNTS.editor })
    state = run(state, { type: 'restoreFromTrash', trashId: 'tr1' })
    expect(state.trash).toHaveLength(0)
    expect(state.posts.some((p) => p.id === 'p01')).toBe(true)
    expect(state.comments.filter((c) => c.postId === 'p01')).toHaveLength(comments)
  })

  it('restores a page only while its address is free, and purges for good', () => {
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    const page = editor.pages[0]
    let state = run(editor, { type: 'deletePage', pageId: page.id, trashId: 'tr2', now: NOW })
    expect(state.pages.some((p) => p.id === page.id)).toBe(false)
    const taken = run(state, { type: 'createPage', id: 'pg-x', slug: page.slug, section: 'story', title: 'Bezet', now: NOW })
    expect(run(taken, { type: 'restoreFromTrash', trashId: 'tr2' })).toBe(taken)
    expect(run(state, { type: 'restoreFromTrash', trashId: 'tr2' }).pages.some((p) => p.id === page.id)).toBe(true)
    expect(run(state, { type: 'purgeFromTrash', trashId: 'tr2' }).trash).toHaveLength(0)
  })

  it('is off limits for employees', () => {
    const state = signedIn()
    expect(run(state, { type: 'deletePage', pageId: state.pages[0].id, trashId: 'x', now: NOW })).toBe(state)
  })
})

describe('page templates', () => {
  it('creates a page with the blocks of a template', () => {
    const blocks = [{ id: 'pg-t-b1', type: 'heading' as const, text: 'Hallo' }]
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPage', id: 'pg-t', slug: 'sjabloon', section: 'story', title: 'Sjabloon', now: NOW, blocks })
    expect(state.pages.find((p) => p.id === 'pg-t')?.blocks.nl).toEqual(blocks)
  })
})

describe('roles', () => {
  it('lets admins change roles of others, never their own', () => {
    const admin = signedIn(DEMO_ACCOUNTS.admin)
    const changed = run(admin, { type: 'setUserRole', userId: DEMO_ACCOUNTS.employee, role: 'editor' })
    expect(changed.users.find((u) => u.id === DEMO_ACCOUNTS.employee)?.role).toBe('editor')
    expect(run(admin, { type: 'setUserRole', userId: DEMO_ACCOUNTS.admin, role: 'employee' })).toBe(admin)
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    expect(run(editor, { type: 'setUserRole', userId: DEMO_ACCOUNTS.employee, role: 'admin' })).toBe(editor)
  })
})

describe('launchpad', () => {
  it('saves valid tiles for admins only', () => {
    const admin = signedIn(DEMO_ACCOUNTS.admin)
    const links = [
      { id: 'a', label: { nl: ' Rooster ' }, url: 'https://example.com', icon: 'clock', color: 'navy' as const },
      { id: 'b', label: { nl: '' }, url: 'https://example.com', icon: 'clock', color: 'navy' as const },
      { id: 'c', label: { nl: 'Fout' }, url: 'javascript:alert(1)', icon: 'clock', color: 'navy' as const },
      { id: 'd', label: { nl: 'Intern' }, url: '/pages/faq', icon: 'clock', color: 'navy' as const },
    ]
    const saved = run(admin, { type: 'saveLaunchpad', links })
    expect(saved.launchpad.map((l) => l.id)).toEqual(['a', 'd'])
    expect(saved.launchpad[0].label.nl).toBe('Rooster')
    const editor = signedIn(DEMO_ACCOUNTS.editor)
    expect(run(editor, { type: 'saveLaunchpad', links })).toBe(editor)
  })
})

describe('audiences and scheduling', () => {
  const input = { channelId: 'c-company', title: 'Alleen voor Iberia', intro: '', body: ['Hola'], image: { kind: 'photo' as const, id: 'paella' } }
  const userIn = (state: AppState, country: string) => state.users.find((u) => u.country === country && u.role === 'employee')!

  it('shows a targeted post and its notification only to that region', () => {
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPost', id: 'p-es', input: { ...input, audience: ['iberia'] }, now: NOW })
    const spanish = userIn(state, 'ES')
    const dutch = userIn(state, 'NL')
    expect(visiblePosts(state, spanish, NOW).some((p) => p.id === 'p-es')).toBe(true)
    expect(visiblePosts(state, dutch, NOW).some((p) => p.id === 'p-es')).toBe(false)
    expect(notificationsFor(state, spanish.id, NOW).some((n) => n.postId === 'p-es')).toBe(true)
    expect(notificationsFor(state, dutch.id, NOW).some((n) => n.postId === 'p-es')).toBe(false)
  })

  it('treats all regions as everyone', () => {
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPost', id: 'p-all', input: { ...input, audience: ['benelux', 'nordics', 'iberia'] }, now: NOW })
    expect(state.posts.find((p) => p.id === 'p-all')?.audience).toBeUndefined()
  })

  it('keeps a scheduled post and its notifications hidden until it is published', () => {
    const later = NOW + 86_400_000
    const state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPost', id: 'p-later', input: { ...input, publishAt: later }, now: NOW })
    const employee = state.users.find((u) => u.id === DEMO_ACCOUNTS.employee)!
    expect(state.posts.find((p) => p.id === 'p-later')?.createdAt).toBe(later)
    expect(visiblePosts(state, employee, NOW).some((p) => p.id === 'p-later')).toBe(false)
    expect(notificationsFor(state, employee.id, NOW).some((n) => n.postId === 'p-later')).toBe(false)
    expect(visiblePosts(state, employee, later).some((p) => p.id === 'p-later')).toBe(true)
    expect(notificationsFor(state, employee.id, later).some((n) => n.postId === 'p-later')).toBe(true)
  })

  it('updates the audience and moves the publication time while scheduled', () => {
    const later = NOW + 86_400_000
    let state = run(signedIn(DEMO_ACCOUNTS.editor), { type: 'createPost', id: 'p-x', input: { ...input, publishAt: later }, now: NOW })
    state = run(state, { type: 'updatePostSettings', postId: 'p-x', audience: ['nordics'], publishAt: NOW + 3_600_000, now: NOW })
    const post = state.posts.find((p) => p.id === 'p-x')!
    expect(post.audience).toEqual(['nordics'])
    expect(post.createdAt).toBe(NOW + 3_600_000)
    const notified = state.notifications.filter((n) => n.postId === 'p-x').map((n) => n.userId)
    expect(notified.every((id) => state.users.find((u) => u.id === id)?.country === 'DK')).toBe(true)
    // A published post keeps its date.
    const published = run(state, { type: 'updatePostSettings', postId: 'p01', audience: [], publishAt: NOW + 1, now: NOW })
    expect(published.posts.find((p) => p.id === 'p01')?.createdAt).toBe(state.posts.find((p) => p.id === 'p01')?.createdAt)
  })

  it('seeds one scheduled post and one post for Iberia only', () => {
    const state = signedIn()
    expect(state.posts.filter((p) => p.createdAt > NOW)).toHaveLength(1)
    expect(state.posts.filter((p) => p.audience?.includes('iberia'))).toHaveLength(1)
  })
})

describe('read statistics', () => {
  it('counts each reader once, out of the audience', () => {
    const state = signedIn()
    const post = state.posts.find((p) => p.id === 'p02')!
    const before = postStats(state, post)
    const once = run({ ...state, reads: { ...state.reads, p02: [] } }, { type: 'markPostRead', postId: 'p02' })
    const twice = run(once, { type: 'markPostRead', postId: 'p02' })
    expect(twice.reads.p02).toEqual([DEMO_ACCOUNTS.employee])
    expect(before.audience).toBe(state.users.length)
    expect(before.readRate).toBeGreaterThan(0)
    expect(before.readRate).toBeLessThanOrEqual(1)
  })
})
