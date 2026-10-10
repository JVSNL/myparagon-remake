import { CheckCircle2, Clock, Lock } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { fieldClass } from '../components/ImagePicker'
import { PageHeader } from '../components/layout/PageHeader'
import type { Question } from '../data/types'
import { usePreferences } from '../lib/preferences'
import { formatRelative } from '../lib/time'
import { useNow } from '../lib/useNow'
import { canAnswerQuestions } from '../store/permissions'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

type Tab = 'all' | 'mine' | 'open'

function AnswerForm({ question }: { question: Question }) {
  const { t } = usePreferences()
  const { actions } = useStore()
  const [text, setText] = useState('')
  const id = `answer-${question.id}`
  return (
    <form
      className="mt-3 border-t border-border pt-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (text.trim()) actions.answerQuestion(question.id, text)
      }}
    >
      <label htmlFor={id} className="text-sm font-medium text-heading">
        {t('ask.answerLabel')}
      </label>
      <textarea id={id} rows={3} value={text} onChange={(e) => setText(e.target.value)} placeholder={t('ask.answerPlaceholder')} className={fieldClass} />
      <div className="mt-2 flex justify-end">
        <button type="submit" disabled={!text.trim()} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:opacity-40">
          {t('ask.answerSubmit')}
        </button>
      </div>
    </form>
  )
}

function QuestionCard({ question, showAnswerForm }: { question: Question; showAnswerForm: boolean }) {
  const { t, locale } = usePreferences()
  const { state } = useStore()
  const now = useNow()
  const author = state.users.find((u) => u.id === question.authorId)
  const answerer = question.answer ? state.users.find((u) => u.id === question.answer?.authorId) : undefined

  return (
    <article id={`q-${question.id}`} className="rounded-xl border border-border bg-surface p-4 shadow-card">
      <div className="flex items-center gap-2 text-sm">
        {author && <Avatar user={author} size="sm" />}
        <span className="font-medium text-heading">{author ? fullName(author) : '?'}</span>
        <span className="text-muted">· {formatRelative(question.createdAt, now, locale)}</span>
      </div>
      <p className="mt-2 text-[16px] text-text">{question.text}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium">
        {question.answer ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-[#007059]/12 px-2.5 py-1 text-[#00563f] dark:text-[#8cc9a6]">
            <CheckCircle2 className="size-3.5" aria-hidden="true" />
            {t('ask.answered')}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2.5 py-1 text-muted">
            <Clock className="size-3.5" aria-hidden="true" />
            {t('ask.waiting')}
          </span>
        )}
        {question.visibility === 'board' && (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2.5 py-1 text-primary">
            <Lock className="size-3.5" aria-hidden="true" />
            {t('ask.boardOnly')}
          </span>
        )}
      </div>
      {question.answer && (
        <div className="mt-3 rounded-lg border-l-4 border-primary bg-primary-soft/60 px-3.5 py-3">
          <p className="text-sm font-medium text-heading">{t('ask.answerBy', { name: answerer ? fullName(answerer) : '?' })}</p>
          <p className="mt-1 text-[15px] text-text">{question.answer.text}</p>
        </div>
      )}
      {showAnswerForm && !question.answer && <AnswerForm question={question} />}
    </article>
  )
}

export function AskBoardPage() {
  const { t } = usePreferences()
  const { state, me, actions } = useStore()
  const location = useLocation()
  const board = canAnswerQuestions(me)
  const [tab, setTab] = useState<Tab>(location.hash.startsWith('#q-') ? 'mine' : 'all')
  const [text, setText] = useState('')
  const [visibility, setVisibility] = useState<'public' | 'board'>('public')
  const [error, setError] = useState(false)
  const [sent, setSent] = useState(false)
  if (!me) return null

  const visible = state.questions.filter((q) => q.visibility === 'public' || q.authorId === me.id || board)
  const lists: Record<Tab, Question[]> = {
    all: visible.filter((q) => q.visibility === 'public' || board),
    mine: visible.filter((q) => q.authorId === me.id),
    open: visible.filter((q) => !q.answer),
  }
  const tabs: Tab[] = board ? ['all', 'open', 'mine'] : ['all', 'mine']
  const label: Record<Tab, string> = { all: t('ask.tabAll'), mine: t('ask.tabMine'), open: t('ask.tabOpen') }
  const list = [...lists[tab]].sort((a, b) => b.createdAt - a.createdAt)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return setError(true)
    actions.askQuestion(text, visibility)
    setText('')
    setSent(true)
    setTab('mine')
  }

  const option = (value: 'public' | 'board', title: string, hint: string) => (
    <label
      className={`flex cursor-pointer gap-3 rounded-xl border p-3 ${visibility === value ? 'border-primary bg-primary-soft' : 'border-border bg-surface'}`}
    >
      <input
        type="radio"
        name="visibility"
        value={value}
        checked={visibility === value}
        onChange={() => setVisibility(value)}
        className="mt-1 accent-[var(--primary)]"
      />
      <span>
        <span className="block text-sm font-medium text-heading">{title}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
    </label>
  )

  return (
    <>
      <PageHeader title={t('ask.title')} backTo="/general" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <p className="text-muted">{t('ask.intro')}</p>

        <form onSubmit={submit} noValidate className="mt-4 rounded-xl border border-border bg-surface p-4">
          <label htmlFor="question" className="text-sm font-medium text-heading">
            {t('ask.label')}
          </label>
          <textarea
            id="question"
            rows={3}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError(false)
              setSent(false)
            }}
            placeholder={t('ask.placeholder')}
            aria-invalid={error}
            aria-describedby={error ? 'question-error' : undefined}
            className={fieldClass}
          />
          {error && (
            <p id="question-error" className="mt-1 text-sm text-danger">
              {t('ask.required')}
            </p>
          )}
          <fieldset className="mt-4">
            <legend className="mb-2 text-sm font-medium text-heading">{t('ask.visibility')}</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {option('public', t('ask.public'), t('ask.publicHint'))}
              {option('board', t('ask.board'), t('ask.boardHint'))}
            </div>
          </fieldset>
          <div className="mt-4 flex items-center justify-end gap-3">
            {sent && (
              <p role="status" className="flex-1 text-sm text-[#00563f] dark:text-[#8cc9a6]">
                {t('ask.sent')}
              </p>
            )}
            <button type="submit" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover">
              {t('ask.submit')}
            </button>
          </div>
        </form>

        <div role="tablist" className="mt-6 flex gap-1 rounded-xl bg-surface-2 p-1">
          {tabs.map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium ${tab === value ? 'bg-surface text-primary shadow-card' : 'text-muted hover:text-text'}`}
            >
              {label[value]} <span className="tabular-nums">({lists[value].length})</span>
            </button>
          ))}
        </div>

        <div role="tabpanel" className="mt-4 space-y-3">
          {list.length === 0 ? (
            <p className="py-10 text-center text-muted">{t('ask.empty')}</p>
          ) : (
            list.map((q) => <QuestionCard key={q.id} question={q} showAnswerForm={board} />)
          )}
        </div>
      </div>
    </>
  )
}
