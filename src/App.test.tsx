import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { buildSeedState } from './data/seed'
import { DEMO_ACCOUNTS } from './data/seed/users'
import { createTranslationCache } from './lib/translate'
import { setTranslationCache } from './lib/useTranslated'
import { FEATURES } from './lib/features'

const start = (userId: string | null = DEMO_ACCOUNTS.employee, path = '/') => {
  const state = buildSeedState(Date.now())
  if (userId) {
    state.currentUserId = userId
    state.onboarded = [userId]
  }
  window.history.pushState({}, '', path)
  return render(<App initialState={state} />)
}

describe('translated content', () => {
  afterEach(() => localStorage.removeItem('mynexora:prefs'))

  it('shows posts and comments in the chosen language, with the original one click away', async () => {
    localStorage.setItem('mynexora:prefs', JSON.stringify({ language: 'de' }))
    const user = userEvent.setup()
    start(DEMO_ACCOUNTS.employee, '/news/p01')
    expect(await screen.findByRole('heading', { name: /Radtour entlang der Amstel/ })).toBeInTheDocument()
    expect(screen.getByText(/Nächstes Mal bin ich auf jeden Fall dabei/)).toBeInTheDocument()

    await user.click(screen.getAllByRole('button', { name: 'Original anzeigen' })[0])
    expect(screen.getByRole('heading', { name: /Fietstocht langs de Amstel/ })).toBeInTheDocument()
  })

  it('machine-translates content without a stored translation', async () => {
    localStorage.setItem('mynexora:prefs', JSON.stringify({ language: 'nl' }))
    setTranslationCache(createTranslationCache({ translate: async (texts) => texts.map((text) => `NL: ${text}`) }))
    const state = buildSeedState(Date.now())
    state.currentUserId = DEMO_ACCOUNTS.employee
    state.onboarded = [DEMO_ACCOUNTS.employee]
    state.posts[0] = { ...state.posts[0], title: 'Grüße aus Kopenhagen', lang: 'de', translations: undefined }
    window.history.pushState({}, '', `/news/${state.posts[0].id}`)
    render(<App initialState={state} />)
    expect(await screen.findByRole('heading', { name: 'NL: Grüße aus Kopenhagen' })).toBeInTheDocument()
    expect(screen.getByText('Vertaald uit het Duits (automatisch)')).toBeInTheDocument()
    setTranslationCache(null)
  })

  it('links authors to their profile', async () => {
    localStorage.setItem('mynexora:prefs', JSON.stringify({ language: 'nl' }))
    const user = userEvent.setup()
    start(DEMO_ACCOUNTS.employee, '/news/p01')
    await screen.findByRole('heading', { name: /Fietstocht/ })
    await user.click(screen.getAllByRole('link', { name: /Bekijk het profiel van Ruben Bakker/ })[0])
    expect(await screen.findByRole('heading', { name: 'Ruben Bakker', level: 1 })).toBeInTheDocument()
  })
})

describe.skipIf(!FEATURES.launchpad)('launchpad', () => {
  afterEach(() => localStorage.removeItem('mynexora:prefs'))

  it('explains that a tool without a link is not connected yet', async () => {
    localStorage.setItem('mynexora:prefs', JSON.stringify({ language: 'nl' }))
    const user = userEvent.setup()
    start()
    await user.click(await screen.findByRole('link', { name: 'Rooster' }))
    expect(await screen.findByRole('heading', { name: 'Rooster is nog niet gekoppeld' })).toBeInTheDocument()
    expect(screen.getByText('Dit is een demo met fictieve gegevens.')).toBeInTheDocument()
  })
})

describe('App', () => {
  it('sends visitors to the demo login', async () => {
    start(null)
    expect(await screen.findByRole('heading', { name: /myNexora/ })).toBeInTheDocument()
  })

  it('walks a new user through the welcome slides to the feed', async () => {
    const user = userEvent.setup()
    start(null)
    await user.click(screen.getAllByRole('button', { name: /Sanne Visser/ })[0])
    expect(screen.getByText(/1 \/|Stap 1|Step 1|Schritt 1/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Overslaan|Skip|Überspringen/ }))
    expect(await screen.findAllByRole('article')).not.toHaveLength(0)
  })

  it('opens an article, reacts to it and saves it', async () => {
    const user = userEvent.setup()
    start()
    const firstCard = (await screen.findAllByRole('article'))[0]
    await user.click(within(firstCard).getByRole('link'))

    const save = await screen.findByRole('button', { name: /Bewaren|Save|Speichern/ })
    await user.click(save)
    expect(screen.getByRole('button', { name: /Bewaard|Saved|Gespeichert/ })).toHaveAttribute('aria-pressed', 'true')

    await user.type(screen.getAllByRole('textbox').at(-1)!, 'Wat een mooi verhaal')
    await user.click(screen.getAllByRole('button', { name: /Versturen|Send|Senden/ }).at(-1)!)
    expect(screen.getByText('Wat een mooi verhaal')).toBeInTheDocument()
  })

  it('shows the publish button only to editors', async () => {
    start()
    await screen.findAllByRole('article')
    expect(screen.queryByRole('link', { name: /Nieuw bericht|New post|Neuer Beitrag/ })).not.toBeInTheDocument()
  })
})
