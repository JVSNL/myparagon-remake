import { SquarePen } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { PostCard } from '../components/PostCard'
import { useT } from '../lib/preferences'
import { canPublish } from '../store/permissions'
import { sortedPosts } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

const PAGE_SIZE = 8

export function HomePage() {
  const t = useT()
  const { state, me } = useStore()
  const [visible, setVisible] = useState(PAGE_SIZE)
  const posts = sortedPosts(state)

  return (
    <>
      <PageHeader
        title={t('feed.title')}
        showLogo
        actions={
          canPublish(me) && (
            <Link
              to="/news/new"
              aria-label={t('feed.newPost')}
              className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2 lg:size-auto lg:gap-2 lg:bg-primary lg:px-4 lg:py-2.5 lg:text-sm lg:font-medium lg:text-on-primary lg:hover:bg-primary-hover"
            >
              <SquarePen className="size-[22px] lg:size-4" strokeWidth={1.75} aria-hidden="true" />
              <span className="hidden lg:inline">{t('feed.newPost')}</span>
            </Link>
          )
        }
      />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-muted">{t('feed.empty')}</p>
        ) : (
          <ul className="space-y-4">
            {posts.slice(0, visible).map((post) => (
              <li key={post.id} className="animate-fade-up">
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
        {visible < posts.length && (
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="mx-auto mt-6 block rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-primary hover:bg-surface-2"
          >
            {t('feed.loadMore')}
          </button>
        )}
      </div>
    </>
  )
}
