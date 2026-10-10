import { Link } from 'react-router-dom'
import { PageHeader } from '../components/layout/PageHeader'
import { useT } from '../lib/preferences'

export function NotFoundPage() {
  const t = useT()
  return (
    <>
      <PageHeader title={t('notFound.title')} backTo="/" />
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <Link to="/" className="font-medium text-link hover:underline">
          {t('notFound.home')}
        </Link>
      </div>
    </>
  )
}
