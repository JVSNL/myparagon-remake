import { X } from 'lucide-react'
import { useId } from 'react'
import { DOCUMENTS } from '../../data/documents'
import type { Block, BlockType } from '../../data/types'
import { useT } from '../../lib/preferences'
import { fullName } from '../../store/selectors'
import { useStore } from '../../store/StoreProvider'
import { toLocalInput } from '../PostSettingsFields'
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
  'poll',
  'form',
  'event',
  'embed',
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
    case 'embed':
      return { id, type, url: 'https://', height: 360 }
    case 'poll':
      return { id, type, question: '', options: ['', ''] }
    case 'form':
      return { id, type, title: '', fields: [{ id: `${id}-f1`, label: '', kind: 'text', required: true }] }
    case 'event': {
      // Default: a week from now at 12:00. Uses the clock, so only call from event handlers.
      const start = new Date()
      start.setDate(start.getDate() + 7)
      start.setHours(12, 0, 0, 0)
      return { id, type, title: '', startsAt: start.getTime(), endsAt: start.getTime() + 3_600_000, location: '' }
    }
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
    block.type === 'people' ||
    block.type === 'form' ||
    block.type === 'embed') && (
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
    case 'embed':
      return (
        <div className="space-y-2">
          {titleField}
          <TextField label={t('field.url')} hint={t('field.embedHint')} value={block.url} onChange={(url) => onChange({ ...block, url })} />
          <div>
            <label htmlFor={`${id}-height`} className="text-xs font-medium text-heading">
              {t('field.height')}
            </label>
            <input
              id={`${id}-height`}
              type="number"
              min={160}
              max={900}
              step={20}
              value={block.height}
              onChange={(e) => onChange({ ...block, height: Math.min(900, Math.max(160, Number(e.target.value) || 360)) })}
              className={smallField}
            />
          </div>
          <TextField label={t('field.caption')} value={block.caption ?? ''} onChange={(caption) => onChange({ ...block, caption })} />
        </div>
      )
    case 'poll':
      return (
        <div className="space-y-2">
          <TextField label={t('field.question')} value={block.question} onChange={(question) => onChange({ ...block, question })} />
          <ListField
            items={block.options}
            onChange={(options) => onChange({ ...block, options })}
            create={() => ''}
            render={(option, update) => <TextField label={t('field.option')} value={option} onChange={update} />}
          />
        </div>
      )
    case 'form':
      return (
        <div className="space-y-2">
          {titleField}
          <TextField multiline label={t('field.intro')} value={block.intro ?? ''} onChange={(intro) => onChange({ ...block, intro })} />
          <ListField
            items={block.fields}
            onChange={(fields) => onChange({ ...block, fields })}
            create={() => ({ id: `${block.id}-f${Date.now().toString(36)}`, label: '', kind: 'text' as const, required: false })}
            render={(f, update) => (
              <>
                <TextField label={t('field.label')} value={f.label} onChange={(label) => update({ ...f, label })} />
                <div className="grid grid-cols-2 gap-2">
                  <label className="text-xs font-medium text-heading">
                    {t('field.kind')}
                    <select value={f.kind} onChange={(e) => update({ ...f, kind: e.target.value as typeof f.kind })} className={smallField}>
                      <option value="text">{t('field.kind.text')}</option>
                      <option value="textarea">{t('field.kind.textarea')}</option>
                      <option value="choice">{t('field.kind.choice')}</option>
                    </select>
                  </label>
                  <label className="mt-5 flex items-center gap-2 text-sm text-text">
                    <input type="checkbox" checked={f.required} onChange={(e) => update({ ...f, required: e.target.checked })} />
                    {t('field.required')}
                  </label>
                </div>
                {f.kind === 'choice' && (
                  <TextField
                    label={t('field.options')}
                    hint={t('field.optionsHint')}
                    value={(f.options ?? []).join(', ')}
                    onChange={(v) => update({ ...f, options: v.split(',').map((o) => o.trim()).filter(Boolean) })}
                  />
                )}
              </>
            )}
          />
        </div>
      )
    case 'event':
      return (
        <div className="space-y-2">
          <TextField label={t('field.title')} value={block.title} onChange={(title) => onChange({ ...block, title })} />
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs font-medium text-heading">
              {t('field.starts')}
              <input
                type="datetime-local"
                value={toLocalInput(block.startsAt)}
                onChange={(e) => {
                  const ts = new Date(e.target.value).getTime()
                  if (!Number.isNaN(ts)) onChange({ ...block, startsAt: ts, endsAt: block.endsAt && block.endsAt > ts ? block.endsAt : ts + 3_600_000 })
                }}
                className={smallField}
              />
            </label>
            <label className="text-xs font-medium text-heading">
              {t('field.ends')}
              <input
                type="datetime-local"
                value={block.endsAt ? toLocalInput(block.endsAt) : ''}
                min={toLocalInput(block.startsAt)}
                onChange={(e) => {
                  const ts = new Date(e.target.value).getTime()
                  onChange({ ...block, endsAt: Number.isNaN(ts) ? undefined : ts })
                }}
                className={smallField}
              />
            </label>
          </div>
          <TextField label={t('field.location')} value={block.location} onChange={(location) => onChange({ ...block, location })} />
          <TextField multiline label={t('field.description')} value={block.description ?? ''} onChange={(description) => onChange({ ...block, description })} />
          <label className="block text-xs font-medium text-heading">
            {t('field.capacity')}
            <input
              type="number"
              min={1}
              value={block.capacity ?? ''}
              placeholder={t('field.unlimited')}
              onChange={(e) => onChange({ ...block, capacity: e.target.value ? Math.max(1, Number(e.target.value)) : undefined })}
              className={smallField}
            />
          </label>
        </div>
      )
  }
}
