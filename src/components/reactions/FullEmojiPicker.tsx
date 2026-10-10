import EmojiPicker, { EmojiStyle, Theme } from 'emoji-picker-react'

interface Props {
  onPick: (emoji: string) => void
  dark: boolean
  locale: string
}

const SEARCH: Record<string, string> = { nl: 'Zoeken', en: 'Search', de: 'Suchen' }

export default function FullEmojiPicker({ onPick, dark, locale }: Props) {
  return (
    <EmojiPicker
      onEmojiClick={(data) => onPick(data.emoji)}
      theme={dark ? Theme.DARK : Theme.LIGHT}
      // Native emojis: no images loaded from a CDN.
      emojiStyle={EmojiStyle.NATIVE}
      lazyLoadEmojis
      width="100%"
      height={380}
      previewConfig={{ showPreview: false }}
      searchPlaceholder={SEARCH[locale] ?? SEARCH.en}
    />
  )
}
