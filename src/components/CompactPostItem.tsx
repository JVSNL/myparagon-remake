import { Link } from 'react-router-dom'
import type { Post } from '../data/types'
import { usePreferences } from '../lib/preferences'
import { formatRelative } from '../lib/time'
import { useNow } from '../lib/useNow'
import { PostImage } from './PostImage'
import { ReactionSummary } from './reactions/ReactionSummary'

/** Small post row used inside content pages (feed blocks). */
export function CompactPostItem({ post }: { post: Post }) {
  const { locale } = usePreferences()
  const now = useNow()
  return (
    <Link
      to={`/news/${post.id}`}
      className="flex gap-3 rounded-xl border border-border bg-surface p-3 transition-shadow hover:shadow-card"
    >
      <PostImage image={post.image} className="aspect-square w-20 shrink-0 rounded-lg sm:w-28 sm:aspect-[4/3]" />
      <span className="min-w-0 flex-1">
        <span className="line-clamp-2 font-medium text-heading">{post.title}</span>
        <span className="mt-0.5 line-clamp-2 text-sm text-muted">{post.intro}</span>
        <span className="mt-1.5 flex items-center gap-3 text-xs text-muted">
          {formatRelative(post.createdAt, now, locale)}
          <ReactionSummary post={post} />
        </span>
      </span>
    </Link>
  )
}
