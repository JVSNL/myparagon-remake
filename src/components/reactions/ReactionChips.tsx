import { useState } from 'react'
import type { Post } from '../../data/types'
import { useT } from '../../lib/preferences'
import { fullName, topReactions } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'

/** Slack-style reaction chips: tap one to add or remove your own reaction. */
export function ReactionChips({ post }: { post: Post }) {
  const t = useT()
  const { state, me, actions } = useStore()
  const [popped, setPopped] = useState<string | null>(null)
  const reactions = topReactions(post)
  if (reactions.length === 0) return null

  const names = (ids: string[]) => {
    const list = ids.map((id) =>
      id === me?.id ? t('reactions.you') : fullName(state.users.find((u) => u.id === id) ?? { firstName: '?', lastName: '' }),
    )
    return list.length > 5 ? `${list.slice(0, 5).join(', ')} +${list.length - 5}` : list.join(', ')
  }

  return (
    <ul className="flex flex-wrap gap-2">
      {reactions.map(([emoji, users]) => {
        const mine = !!me && users.includes(me.id)
        return (
          <li key={emoji}>
            <button
              type="button"
              aria-pressed={mine}
              title={t('reactions.by', { emoji, names: names(users) })}
              aria-label={`${t('reactions.toggle', { emoji })} (${users.length})`}
              onClick={() => {
                actions.toggleReaction(post.id, emoji)
                setPopped(emoji)
              }}
              className={`flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-sm transition-colors ${
                mine
                  ? 'border-c-orange bg-c-orange-soft font-medium text-c-orange-text'
                  : 'border-border bg-surface text-text hover:bg-surface-2'
              }`}
            >
              <span key={popped === emoji ? `${emoji}-pop` : emoji} className={popped === emoji ? 'animate-pop' : ''}>
                {emoji}
              </span>
              {users.length}
            </button>
          </li>
        )
      })}
    </ul>
  )
}
