import { useState, type FormEvent } from 'react'
import { fieldClass } from '../components/ImagePicker'
import { PageHeader } from '../components/layout/PageHeader'
import type { Feedback } from '../data/types'
import { useT } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

const TOPICS: Feedback['topic'][] = ['idea', 'problem', 'other']

export function FeedbackPage() {
  const t = useT()
  const { actions } = useStore()
  const [topic, setTopic] = useState<Feedback['topic']>('idea')
  const [text, setText] = useState('')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return setError(true)
    actions.sendFeedback(topic, text)
    setText('')
    setSent(true)
  }

  return (
    <>
      <PageHeader title={t('feedback.title')} backTo="/settings" />
      <form onSubmit={submit} noValidate className="mx-auto max-w-2xl space-y-5 px-4 pt-4 lg:pt-0">
        <p className="text-muted">{t('feedback.intro')}</p>
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-heading">{t('feedback.topic')}</legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((value) => (
              <label
                key={value}
                className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-focus ${
                  topic === value ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-text'
                }`}
              >
                <input type="radio" name="topic" value={value} checked={topic === value} onChange={() => setTopic(value)} className="sr-only" />
                {t(`feedback.${value}`)}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="feedback-text" className="text-sm font-medium text-heading">
            {t('feedback.text')}
          </label>
          <textarea
            id="feedback-text"
            rows={6}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError(false)
              setSent(false)
            }}
            aria-invalid={error}
            className={fieldClass}
          />
          {error && <p className="mt-1 text-sm text-danger">{t('feedback.required')}</p>}
        </div>
        <div className="flex items-center justify-end gap-3">
          {sent && (
            <p role="status" className="flex-1 text-sm text-[#00563f] dark:text-[#8cc9a6]">
              {t('feedback.thanks')}
            </p>
          )}
          <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover">
            {t('feedback.send')}
          </button>
        </div>
      </form>
    </>
  )
}
