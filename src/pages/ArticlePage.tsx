import { Bookmark, MessageCircle, Pencil, SmilePlus } from 'lucide-react'
import { canEditContent } from '../store/permissions'
import { useEffect, useRef, useState } from 'react'
import type { Post } from '../data/types'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ChannelTag } from '../components/ChannelTag'
import { PostImage } from '../components/PostImage'
import { CommentSection } from '../components/comments/CommentSection'
import { PageHeader } from '../components/layout/PageHeader'
import { ReactionChips } from '../components/reactions/ReactionChips'
import { ReactionPicker } from '../components/reactions/ReactionPicker'
import { usePreferences } from '../lib/preferences'
import { formatFull } from '../lib/time'
import { channelName, isBookmarked, userById } from '../store/selectors'
import { usePostContent } from '../lib/usePostContent'
import { TranslationNote } from '../components/TranslationNote'
import { AvatarLink, PersonLink } from '../components/PersonLink'
import { useStore } from '../store/StoreProvider'

export function ArticlePage() {
  const { postId = '' } = useParams()
  const [params] = useSearchParams()
  const highlight = params.get('comment')
  const t = usePreferences().t
  const { state } = useStore()
  const post = state.posts.find((p) => p.id === postId)

  useEffect(() => {
    if (highlight) document.getElementById(`comment-${highlight}`)?.scrollIntoView({ block: 'center' })
  }, [highlight])

  if (!post) {
    return (
      <>
        <PageHeader title={t('feed.title')} backTo="/" />
        <p className="mx-auto max-w-2xl px-4 py-16 text-center text-muted">{t('post.notFound')}</p>
      </>
    )
  }

  return <Article post={post} highlight={highlight} />
}

function Article({ post, highlight }: { post: Post; highlight: string | null }) {
  const { t, locale } = usePreferences()
  const { state, me, actions } = useStore()
  const [pickerOpen, setPickerOpen] = useState(false)
  const formRef = useRef<HTMLDivElement>(null)
  const { content, translation } = usePostContent(post)
  const author = userById(state, post.authorId)
  const saved = !!me && isBookmarked(state, me.id, post.id)
  const myReactions = me ? Object.keys(post.reactions).filter((e) => post.reactions[e].includes(me.id)) : []

  const focusCommentForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    formRef.current?.querySelector('textarea')?.focus({ preventScroll: true })
  }

  const actionClass =
    'flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors hover:bg-surface-2'

  return (
    <>
      <PageHeader
        title={channelName(state, post.channelId)}
        backTo="/"
        actions={
          canEditContent(me) && (
            <Link
              to={`/beheer/posts/${post.id}`}
              aria-label={t('post.edit')}
              className="flex size-10 items-center justify-center rounded-full text-heading hover:bg-surface-2"
            >
              <Pencil className="size-5" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          )
        }
      />
      <article className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <PostImage image={post.image} className="aspect-[16/9] w-full rounded-xl" />

        <ChannelTag channelId={post.channelId} className="mt-5" />
        <h1 className="mt-1 text-[28px] leading-tight font-light text-heading sm:text-[34px]">{content.title}</h1>
        {content.intro && <p className="mt-3 text-lg leading-relaxed text-text">{content.intro}</p>}
        <TranslationNote translation={translation} className="mt-3" />

        {author && (
          <div className="mt-5 flex items-center gap-3 border-y border-border py-3">
            <AvatarLink user={author} size="md" />
            <div className="text-sm">
              <p className="font-medium text-heading">
                <PersonLink user={author} />
              </p>
              <p className="text-muted">
                {author.jobTitle} ·{' '}
                <time dateTime={new Date(post.createdAt).toISOString()}>{formatFull(post.createdAt, locale)}</time>
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-4 text-[17px] leading-relaxed text-text">
          {content.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8">
          <ReactionChips post={post} />
        </div>

        <div className="mt-4 flex gap-1 border-y border-border py-1 text-muted">
          <button type="button" className={actionClass} onClick={() => setPickerOpen(true)}>
            <SmilePlus className="size-5" aria-hidden="true" />
            {t('post.addReaction')}
          </button>
          <button type="button" className={actionClass} onClick={focusCommentForm}>
            <MessageCircle className="size-5" aria-hidden="true" />
            {t('post.comment')}
          </button>
          <button
            type="button"
            className={`${actionClass} ${saved ? 'text-primary' : ''}`}
            aria-pressed={saved}
            onClick={() => actions.toggleBookmark(post.id)}
          >
            <Bookmark className="size-5" fill={saved ? 'currentColor' : 'none'} aria-hidden="true" />
            {saved ? t('post.bookmarked') : t('post.bookmark')}
          </button>
        </div>

        <CommentSection postId={post.id} highlightId={highlight} formRef={formRef} />

        <p className="mt-10 text-center">
          <Link to="/" className="text-sm font-medium text-link hover:underline">
            ← {t('feed.title')}
          </Link>
        </p>
      </article>

      <ReactionPicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        selected={myReactions}
        onPick={(emoji) => actions.toggleReaction(post.id, emoji)}
      />
    </>
  )
}
