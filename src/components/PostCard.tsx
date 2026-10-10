import { MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Post } from '../data/types'
import { usePreferences } from '../lib/preferences'
import { formatFull, formatRelative } from '../lib/time'
import { useNow } from '../lib/useNow'
import { channelName, commentCount } from '../store/selectors'
import { useStore } from '../store/StoreProvider'
import { Artwork } from './Artwork'
import { ReactionSummary } from './reactions/ReactionSummary'

export function PostCard({ post }: { post: Post }) {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const now = useNow()
  const comments = commentCount(state, post.id)

  return (
    <article className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow hover:shadow-lg">
      <Artwork artwork={post.artwork} className="aspect-[16/9] w-full" />
      <div className="p-4 sm:p-5">
        <p className="text-[13px] text-muted">
          <span className="font-medium text-primary">{channelName(state, post.channelId)}</span>
          <span aria-hidden="true"> · </span>
          <time dateTime={new Date(post.createdAt).toISOString()} title={formatFull(post.createdAt, locale)}>
            {formatRelative(post.createdAt, now, locale)}
          </time>
        </p>
        <h2 className="mt-1 text-xl leading-snug font-medium text-heading">
          {/* The whole card is clickable via this link's ::after overlay. */}
          <Link to={`/news/${post.id}`} className="after:absolute after:inset-0 focus-visible:outline-none">
            {post.title}
          </Link>
        </h2>
        <p className="mt-1.5 line-clamp-2 text-[15px] text-text">{post.intro}</p>
        <div className="mt-4 flex items-center justify-between">
          <ReactionSummary post={post} />
          {comments > 0 && (
            <span className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted">
              <MessageCircle className="size-4" aria-hidden="true" />
              {t('post.comments', { n: comments })}
            </span>
          )}
        </div>
      </div>
      {/* Focus ring for the card, driven by the link inside. */}
      <span className="pointer-events-none absolute inset-0 rounded-xl ring-focus group-has-[a:focus-visible]:ring-2" />
    </article>
  )
}
