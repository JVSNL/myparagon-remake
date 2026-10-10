import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { PostImage } from '../components/PostImage'
import type { CountryCode } from '../data/types'
import { useT } from '../lib/preferences'
import { useStore } from '../store/StoreProvider'

export function LocationsPage() {
  const t = useT()
  const { state } = useStore()
  const [country, setCountry] = useState<CountryCode | 'all'>('all')
  const countries = [...new Set(state.locations.map((l) => l.country))]
  const locations = state.locations.filter((l) => country === 'all' || l.country === country)

  const chip = (active: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? 'border-primary bg-primary text-on-primary' : 'border-border bg-surface text-text hover:bg-surface-2'
    }`

  return (
    <>
      <PageHeader title={t('locations.title')} backTo="/menu" />
      <div className="mx-auto max-w-2xl px-4 pt-4 lg:pt-0">
        <p className="mb-4 text-muted">{t('locations.subtitle')}</p>
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label={t('locations.title')}>
          <button type="button" aria-pressed={country === 'all'} onClick={() => setCountry('all')} className={chip(country === 'all')}>
            {t('locations.filterAll')}
          </button>
          {countries.map((c) => (
            <button key={c} type="button" aria-pressed={country === c} onClick={() => setCountry(c)} className={chip(country === c)}>
              {t(`country.${c}`)}
            </button>
          ))}
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {locations.map((loc) => (
            <li key={loc.id} className="flex flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-card">
              <PostImage image={loc.image} className="aspect-[16/9] w-full" />
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs font-medium tracking-wide text-primary uppercase">{loc.kind}</p>
                <h2 className="text-xl font-medium text-heading">{loc.city}</h2>
                <address className="mt-1 text-[15px] text-text not-italic">
                  {loc.address}
                  <br />
                  {loc.postcode} {loc.city}, {t(`country.${loc.country}`)}
                </address>
                <p className="mt-2 flex-1 text-sm text-muted">{loc.description}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-sm font-medium">
                  <a href={`tel:${loc.phone.replace(/\s/g, '')}`} className="flex flex-col items-center gap-1 rounded-lg bg-primary-soft py-2 text-primary">
                    <Phone className="size-4" aria-hidden="true" />
                    {t('locations.call')}
                  </a>
                  <a href={`mailto:${loc.email}`} className="flex flex-col items-center gap-1 rounded-lg bg-primary-soft py-2 text-primary">
                    <Mail className="size-4" aria-hidden="true" />
                    {t('locations.mail')}
                  </a>
                  <a
                    href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(`${loc.postcode} ${loc.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 rounded-lg bg-primary-soft py-2 text-primary"
                  >
                    <MapPin className="size-4" aria-hidden="true" />
                    {t('locations.route')}
                  </a>
                </div>
                <p className="mt-3 text-xs text-muted tabular-nums select-all">
                  {loc.phone} · {loc.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
