import type { Post } from '../../data/types'
import { useT } from '../../lib/preferences'
import { reactionTotal, topReactions } from '../../store/selectors'

/** Compact "👍🎉❤️ 24" line used on cards. */
export function ReactionSummary({ post }: { post: Post }) {
  const t = useT()
  const total = reactionTotal(post)
  if (total === 0) return null
  const top = topReactions(post).slice(0, 3)
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted">
      <span className="flex -space-x-1" aria-hidden="true">
        {top.map(([emoji]) => (
          <span
            key={emoji}
            className="flex size-6 items-center justify-center rounded-full bg-surface-2 text-sm ring-2 ring-surface"
          >
            {emoji}
          </span>
        ))}
      </span>
      <span aria-hidden="true">{total}</span>
      <span className="sr-only">{t('post.reactions', { n: total })}</span>
    </span>
  )
}
