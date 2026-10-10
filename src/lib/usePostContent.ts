import type { Post, PostContent } from '../data/types'
import { usePreferences } from './preferences'
import { useTranslated, type Translated } from './useTranslated'

/**
 * Title, intro and body of a post in the reader's language. With `summary`
 * only the title and intro are translated, which is all a feed card shows.
 */
export function usePostContent(post: Post, { summary = false } = {}): { content: PostContent; translation: Translated } {
  const { locale } = usePreferences()
  const pickTexts = (c: PostContent) => (summary ? [c.title, c.intro] : [c.title, c.intro, ...c.body])
  const stored = post.translations?.[locale]
  const translation = useTranslated(pickTexts(post), post.lang ?? 'nl', stored ? pickTexts(stored) : null)
  const [title, intro, ...body] = translation.texts
  return { content: { title, intro, body: summary ? post.body : body }, translation }
}
