import type { LaunchpadLink } from '../types'

/** Fictional tools on the launchpad; the links point to example.com placeholders. */
export const seedLaunchpad = (): LaunchpadLink[] => [
  { id: 'lp-roster', label: { nl: 'Rooster', en: 'Rota', de: 'Dienstplan' }, url: 'https://example.com/rooster', icon: 'calendar-clock', color: 'royal' },
  { id: 'lp-leave', label: { nl: 'Verlof & HR', en: 'Leave & HR', de: 'Urlaub & HR' }, url: 'https://example.com/hr', icon: 'palmtree', color: 'sage' },
  { id: 'lp-expenses', label: { nl: 'Declaraties', en: 'Expenses', de: 'Spesen' }, url: 'https://example.com/declaraties', icon: 'receipt', color: 'orange' },
  { id: 'lp-it', label: { nl: 'IT-servicedesk', en: 'IT service desk', de: 'IT-Servicedesk' }, url: 'https://example.com/servicedesk', icon: 'life-buoy', color: 'sky' },
  { id: 'lp-lease', label: { nl: 'Fietsplan', en: 'Bike scheme', de: 'Dienstrad' }, url: 'https://example.com/fietsplan', icon: 'bike', color: 'berry' },
  { id: 'lp-learning', label: { nl: 'Leren', en: 'Learning', de: 'Lernen' }, url: 'https://example.com/leren', icon: 'graduation-cap', color: 'sienna' },
]
