import { Bookmark } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { PostCard } from '../components/PostCard'
import { useT } from '../lib/preferences'
import { useNow } from '../lib/useNow'
import type { Post } from '../data/types'
import { canSeePost } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function BookmarksPage() {
  const t = useT()
  const { state, me } = useStore()
  const now = useNow()
  const posts = (me ? (state.bookmarks[me.id] ?? []) : [])
    .map((id) => state.posts.find((p) => p.id === id))
    .filter((p): p is Post => p !== undefined && canSeePost(p, me, now))

  return (
    <>
      <PageHeader title={t('bookmarks.title')} backTo="/menu" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <Bookmark className="mx-auto size-10 text-muted" strokeWidth={1.5} aria-hidden="true" />
            <p className="mx-auto mt-3 max-w-xs text-muted">{t('bookmarks.empty')}</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
