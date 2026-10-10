import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App'
import { buildSeedState } from './data/seed'
import { DEMO_ACCOUNTS } from './data/seed/users'

const start = (userId: string | null = DEMO_ACCOUNTS.employee) => {
  const state = buildSeedState(Date.now())
  if (userId) {
    state.currentUserId = userId
    state.onboarded = [userId]
  }
  window.history.pushState({}, '', '/')
  return render(<App initialState={state} />)
}

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
