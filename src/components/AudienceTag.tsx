import { Users } from 'lucide-react'
import { regionById } from '../data/regions'
import type { Post } from '../data/types'
import { useT } from '../lib/preferences'

/** "Only for Iberia": shown on posts that target specific regions. */
export function AudienceTag({ post, className = '' }: { post: Post; className?: string }) {
  const t = useT()
  if (!post.audience?.length) return null
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-0.5 text-xs font-medium text-muted ${className}`}>
      <Users className="size-3.5" aria-hidden="true" />
      {t('audience.only', { regions: post.audience.map((id) => regionById(id).name).join(', ') })}
    </span>
  )
}
