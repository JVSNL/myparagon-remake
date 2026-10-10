import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState, type FormEvent } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { Avatar } from '../components/Avatar'
import { fieldClass } from '../components/ImagePicker'
import { PageHeader } from '../components/layout/PageHeader'
import type { User } from '../data/types'
import { compressImage, MAX_UPLOAD_BYTES, saveImage } from '../lib/imageStore'
import { useT } from '../lib/preferences'
import { fullName } from '../store/selectors'
import { useStore } from '../store/StoreProvider'

export function ProfileEditPage() {
  const t = useT()
  const { userId } = useParams()
  const navigate = useNavigate()
  const { state, me, actions } = useStore()
  const user = state.users.find((u) => u.id === userId)
  const fileRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState(() =>
    user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          jobTitle: user.jobTitle,
          department: user.department,
          location: user.location,
          email: user.email,
          phone: user.phone,
          bio: user.bio,
          skills: user.skills.join(', '),
          photo: user.photo,
        }
      : null,
  )
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  if (!user || !form || !me || (me.id !== user.id && me.role !== 'admin')) return <Navigate to="/people" replace />

  const departments = [...new Set(state.users.map((u) => u.department))].sort()
  const set = (key: keyof typeof form) => (e: { target: { value: string } }) => setForm({ ...form, [key]: e.target.value })

  const onPhoto = async (file: File | undefined) => {
    if (!file) return
    setError(null)
    if (file.size > MAX_UPLOAD_BYTES) return setError(t('compose.photoTooLarge'))
    setBusy(true)
    try {
      const id = `avatar-${user.id}-${Date.now().toString(36)}`
      await saveImage(id, await compressImage(file))
      setForm({ ...form, photo: { kind: 'upload', id, alt: t('profile.photoAlt', { name: fullName(user) }) } })
    } catch {
      setError(t('compose.photoError'))
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!form.firstName.trim() || !form.lastName.trim()) return setError(t('profile.nameRequired'))
    const location = state.locations.find((l) => l.city === form.location)
    actions.updateProfile(user.id, {
      ...form,
      skills: form.skills.split(','),
      ...(location ? { country: location.country } : {}),
    })
    navigate(me.id === user.id ? '/profile' : `/people/${user.id}`, { replace: true })
  }

  const field = (key: 'firstName' | 'lastName' | 'jobTitle' | 'email' | 'phone', label: string, type = 'text') => (
    <div>
      <label htmlFor={`p-${key}`} className="text-sm font-medium text-heading">
        {label}
      </label>
      <input id={`p-${key}`} type={type} value={form[key]} onChange={set(key)} className={fieldClass} />
    </div>
  )

  const preview: Pick<User, 'id' | 'photo'> = { id: user.id, photo: form.photo }

  return (
    <>
      <PageHeader title={t('profile.edit')} backTo={`/people/${user.id}`} />
      <form onSubmit={submit} noValidate className="mx-auto max-w-2xl space-y-5 px-4 pt-6 lg:pt-0">
        <div className="flex items-center gap-4">
          <Avatar user={preview} size="xl" />
          <div className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-heading">{t('profile.photo')}</span>
            <input
              ref={fileRef}
              id="p-photo"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onPhoto(e.target.files?.[0])}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-primary hover:bg-surface-2"
            >
              <Camera className="size-4" aria-hidden="true" />
              {busy ? t('compose.processing') : t('profile.choosePhoto')}
            </button>
            {form.photo && (
              <button
                type="button"
                onClick={() => setForm({ ...form, photo: undefined })}
                className="inline-flex items-center gap-1.5 px-1 text-sm font-medium text-danger"
              >
                <Trash2 className="size-4" aria-hidden="true" />
                {t('profile.removePhoto')}
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {field('firstName', t('profile.firstName'))}
          {field('lastName', t('profile.lastName'))}
        </div>
        {field('jobTitle', t('profile.jobTitle'))}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="p-department" className="text-sm font-medium text-heading">
              {t('people.department')}
            </label>
            <input id="p-department" list="departments" value={form.department} onChange={set('department')} className={fieldClass} />
            <datalist id="departments">
              {departments.map((d) => (
                <option key={d} value={d} />
              ))}
            </datalist>
          </div>
          <div>
            <label htmlFor="p-location" className="text-sm font-medium text-heading">
              {t('people.location')}
            </label>
            <select id="p-location" value={form.location} onChange={set('location')} className={fieldClass}>
              {state.locations.map((l) => (
                <option key={l.id} value={l.city}>
                  {l.city}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {field('email', t('profile.email'), 'email')}
          {field('phone', t('profile.phone'), 'tel')}
        </div>
        <div>
          <label htmlFor="p-bio" className="text-sm font-medium text-heading">
            {t('profile.about')}
          </label>
          <textarea id="p-bio" rows={3} value={form.bio} onChange={set('bio')} className={fieldClass} />
        </div>
        <div>
          <label htmlFor="p-skills" className="text-sm font-medium text-heading">
            {t('profile.skills')}
          </label>
          <input id="p-skills" value={form.skills} onChange={set('skills')} aria-describedby="p-skills-hint" className={fieldClass} />
          <p id="p-skills-hint" className="mt-1 text-xs text-muted">
            {t('profile.skillsHint')}
          </p>
        </div>

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
        <div className="flex justify-end">
          <button type="submit" className="rounded-lg bg-primary px-5 py-2.5 font-medium text-on-primary hover:bg-primary-hover">
            {t('profile.save')}
          </button>
        </div>
      </form>
    </>
  )
}
