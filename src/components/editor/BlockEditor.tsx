import { X } from 'lucide-react'
import { useId } from 'react'
import { DOCUMENTS } from '../../data/documents'
import type { Block, BlockType } from '../../data/types'
import { useT } from '../../lib/preferences'
import { fullName } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { ImageField, ListField, smallField, TextField, ToneField } from './fields'

export const BLOCK_TYPES: BlockType[] = [
  'hero',
  'heading',
  'text',
  'callout',
  'quote',
  'image',
  'carousel',
  'steps',
  'links',
  'files',
  'accordion',
  'feed',
  'people',
]

const placeholderImage = () => ({ kind: 'artwork' as const, seed: Math.floor(Math.random() * 1000), palette: 'navy' as const })

/** A new block of the given type with sensible starting content. */
export function createBlock(type: BlockType, id: string): Block {
  switch (type) {
    case 'hero':
      return { id, type, title: '', subtitle: '', tone: 'navy' }
    case 'heading':
      return { id, type, text: '' }
    case 'text':
      return { id, type, text: '' }
    case 'callout':
      return { id, type, title: '', text: '', tone: 'navy' }
    case 'quote':
      return { id, type, text: '' }
    case 'image':
      return { id, type, image: placeholderImage() }
    case 'carousel':
      return { id, type, slides: [{ image: placeholderImage(), title: '' }] }
    case 'steps':
      return { id, type, steps: [{ title: '', text: '' }] }
    case 'links':
      return { id, type, items: [{ label: '', url: 'https://' }] }
    case 'files':
      return { id, type, documentIds: [] }
    case 'accordion':
      return { id, type, items: [{ question: '', answer: '' }] }
    case 'feed':
      return { id, type, channelId: 'c-company', limit: 3 }
    case 'people':
      return { id, type, userIds: [] }
  }
}

/** Form for one block; every change is passed up immediately. */
export function BlockEditor({ block, onChange }: { block: Block; onChange: (block: Block) => void }) {
  const t = useT()
  const { state } = useStore()
  const id = useId()

  // Optional section title shared by list-like blocks.
  const titleField = (block.type === 'carousel' ||
    block.type === 'steps' ||
    block.type === 'links' ||
    block.type === 'files' ||
    block.type === 'accordion' ||
    block.type === 'feed' ||
    block.type === 'people') && (
    <TextField label={t('field.title')} value={block.title ?? ''} onChange={(title) => onChange({ ...block, title })} />
  )

  switch (block.type) {
    case 'hero':
      return (
        <div className="space-y-2">
          <TextField label={t('field.title')} value={block.title} onChange={(title) => onChange({ ...block, title })} />
          <TextField label={t('field.subtitle')} value={block.subtitle ?? ''} onChange={(subtitle) => onChange({ ...block, subtitle })} />
          <ToneField value={block.tone} onChange={(tone) => onChange({ ...block, tone })} />
        </div>
      )
    case 'heading':
      return <TextField label={t('field.text')} value={block.text} onChange={(text) => onChange({ ...block, text })} />
    case 'text':
      return (
        <TextField multiline label={t('field.text')} hint={t('field.textHint')} value={block.text} onChange={(text) => onChange({ ...block, text })} />
      )
    case 'callout':
      return (
        <div className="space-y-2">
          <TextField label={t('field.title')} value={block.title} onChange={(title) => onChange({ ...block, title })} />
          <TextField multiline label={t('field.text')} hint={t('field.textHint')} value={block.text} onChange={(text) => onChange({ ...block, text })} />
          <ToneField value={block.tone} onChange={(tone) => onChange({ ...block, tone })} />
        </div>
      )
    case 'quote':
      return (
        <div className="space-y-2">
          <TextField multiline label={t('field.text')} value={block.text} onChange={(text) => onChange({ ...block, text })} />
          <TextField label={t('field.author')} value={block.author ?? ''} onChange={(author) => onChange({ ...block, author })} />
        </div>
      )
    case 'image':
      return (
        <div className="space-y-2">
          <ImageField value={block.image} onChange={(image) => onChange({ ...block, image })} />
          <TextField label={t('field.caption')} value={block.caption ?? ''} onChange={(caption) => onChange({ ...block, caption })} />
        </div>
      )
    case 'carousel':
      return (
        <div className="space-y-2">
          {titleField}
          <ListField
            items={block.slides}
            onChange={(slides) => onChange({ ...block, slides })}
            create={() => ({ image: placeholderImage(), title: '' })}
            render={(slide, update) => (
              <>
                <ImageField value={slide.image} onChange={(image) => update({ ...slide, image })} />
                <TextField label={t('field.caption')} value={slide.title} onChange={(title) => update({ ...slide, title })} />
              </>
            )}
          />
        </div>
      )
    case 'steps':
      return (
        <div className="space-y-2">
          {titleField}
          <ListField
            items={block.steps}
            onChange={(steps) => onChange({ ...block, steps })}
            create={() => ({ title: '', text: '' })}
            render={(step, update) => (
              <>
                <TextField label={t('field.title')} value={step.title} onChange={(title) => update({ ...step, title })} />
                <TextField label={t('field.text')} value={step.text} onChange={(text) => update({ ...step, text })} />
              </>
            )}
          />
        </div>
      )
    case 'links':
      return (
        <div className="space-y-2">
          {titleField}
          <ListField
            items={block.items}
            onChange={(items) => onChange({ ...block, items })}
            create={() => ({ label: '', url: 'https://' })}
            render={(item, update) => (
              <>
                <TextField label={t('field.label')} value={item.label} onChange={(label) => update({ ...item, label })} />
                <TextField label={t('field.url')} value={item.url} onChange={(url) => update({ ...item, url })} />
              </>
            )}
          />
        </div>
      )
    case 'accordion':
      return (
        <div className="space-y-2">
          {titleField}
          <ListField
            items={block.items}
            onChange={(items) => onChange({ ...block, items })}
            create={() => ({ question: '', answer: '' })}
            render={(item, update) => (
              <>
                <TextField label={t('field.question')} value={item.question} onChange={(question) => update({ ...item, question })} />
                <TextField multiline label={t('field.answer')} value={item.answer} onChange={(answer) => update({ ...item, answer })} />
              </>
            )}
          />
        </div>
      )
    case 'files':
      return (
        <div className="space-y-2">
          {titleField}
          <fieldset>
            <legend className="text-xs font-medium text-heading">{t('field.documents')}</legend>
            {DOCUMENTS.map((doc) => (
              <label key={doc.id} className="mt-1 flex items-center gap-2 text-sm text-text">
                <input
                  type="checkbox"
                  checked={block.documentIds.includes(doc.id)}
                  onChange={(e) =>
                    onChange({
                      ...block,
                      documentIds: e.target.checked ? [...block.documentIds, doc.id] : block.documentIds.filter((d) => d !== doc.id),
                    })
                  }
                />
                {doc.name}
              </label>
            ))}
          </fieldset>
        </div>
      )
    case 'feed':
      return (
        <div className="space-y-2">
          {titleField}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor={`${id}-channel`} className="text-xs font-medium text-heading">
                {t('field.channel')}
              </label>
              <select
                id={`${id}-channel`}
                value={block.channelId}
                onChange={(e) => onChange({ ...block, channelId: e.target.value })}
                className={smallField}
              >
                {state.channels.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-limit`} className="text-xs font-medium text-heading">
                {t('field.limit')}
              </label>
              <input
                id={`${id}-limit`}
                type="number"
                min={1}
                max={10}
                value={block.limit}
                onChange={(e) => onChange({ ...block, limit: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })}
                className={smallField}
              />
            </div>
          </div>
        </div>
      )
    case 'people':
      return (
        <div className="space-y-2">
          {titleField}
          <ul className="space-y-1">
            {block.userIds.map((userId) => {
              const user = state.users.find((u) => u.id === userId)
              return (
                <li key={userId} className="flex items-center justify-between rounded-lg bg-surface-2 px-2.5 py-1.5 text-sm">
                  {user ? fullName(user) : userId}
                  <button
                    type="button"
                    aria-label={`${t('field.removeItem')}: ${user ? fullName(user) : userId}`}
                    onClick={() => onChange({ ...block, userIds: block.userIds.filter((u) => u !== userId) })}
                    className="text-muted hover:text-danger"
                  >
                    <X className="size-4" aria-hidden="true" />
                  </button>
                </li>
              )
            })}
          </ul>
          <label htmlFor={`${id}-add`} className="sr-only">
            {t('field.addPerson')}
          </label>
          <select
            id={`${id}-add`}
            value=""
            onChange={(e) => e.target.value && onChange({ ...block, userIds: [...block.userIds, e.target.value] })}
            className={smallField}
          >
            <option value="">{t('field.addPerson')}</option>
            {[...state.users]
              .filter((u) => !block.userIds.includes(u.id))
              .sort((a, b) => a.lastName.localeCompare(b.lastName))
              .map((u) => (
                <option key={u.id} value={u.id}>
                  {fullName(u)} — {u.jobTitle}
                </option>
              ))}
          </select>
        </div>
      )
  }
}
