import type { LaunchpadLink } from '../types'

/**
 * Fictional tools on the launchpad. Where the app has a matching page the tile opens it;
 * the other tiles open /tools/<id>, which explains that the link still has to be built.
 */
export const seedLaunchpad = (): LaunchpadLink[] => [
  { id: 'lp-roster', label: { nl: 'Rooster', en: 'Rota', de: 'Dienstplan' }, url: '/tools/lp-roster', icon: 'calendar-clock', color: 'royal' },
  { id: 'lp-leave', label: { nl: 'Verlof & HR', en: 'Leave & HR', de: 'Urlaub & HR' }, url: '/pages/people', icon: 'palmtree', color: 'sage' },
  { id: 'lp-expenses', label: { nl: 'Declaraties', en: 'Expenses', de: 'Spesen' }, url: '/pages/finance', icon: 'receipt', color: 'orange' },
  { id: 'lp-it', label: { nl: 'IT-servicedesk', en: 'IT service desk', de: 'IT-Servicedesk' }, url: '/pages/support', icon: 'life-buoy', color: 'sky' },
  { id: 'lp-lease', label: { nl: 'Fietsplan', en: 'Bike scheme', de: 'Dienstrad' }, url: '/pages/finance', icon: 'bike', color: 'berry' },
  { id: 'lp-learning', label: { nl: 'Leren', en: 'Learning', de: 'Lernen' }, url: '/tools/lp-learning', icon: 'graduation-cap', color: 'sienna' },
]
