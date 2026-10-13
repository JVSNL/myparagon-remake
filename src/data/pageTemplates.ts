import type { Block } from './types'

export type PageTemplateId = 'blank' | 'department' | 'news' | 'faq' | 'howto'

/**
 * Starting points for new pages. Placeholder texts are Dutch, like the rest of
 * the seed content; editors replace them in the editor.
 */
export const PAGE_TEMPLATES: Record<PageTemplateId, (title: string, id: string) => Block[]> = {
  blank: (title, id) => [{ id: `${id}-b1`, type: 'hero', title, tone: 'navy' }],

  department: (title, id) => [
    { id: `${id}-b1`, type: 'hero', title, subtitle: 'Wie we zijn en wat we doen', tone: 'sky' },
    { id: `${id}-b2`, type: 'text', text: 'Vertel in een paar zinnen waar het team aan werkt en hoe collega’s jullie kunnen bereiken.' },
    { id: `${id}-b3`, type: 'people', title: 'Het team', userIds: [] },
    { id: `${id}-b4`, type: 'feed', title: 'Laatste nieuws', channelId: 'c-company', limit: 3 },
    { id: `${id}-b5`, type: 'links', title: 'Handige links', items: [{ label: 'Veelgestelde vragen', url: '/pages/faq' }] },
  ],

  news: (title, id) => [
    { id: `${id}-b1`, type: 'hero', title, tone: 'navy' },
    { id: `${id}-b2`, type: 'callout', title: 'Uitgelicht', text: 'Zet hier het belangrijkste bericht van dit moment.', tone: 'warm' },
    { id: `${id}-b3`, type: 'feed', title: 'Bedrijfsnieuws', channelId: 'c-company', limit: 5 },
    { id: `${id}-b4`, type: 'feed', title: 'Mensen & cultuur', channelId: 'c-people', limit: 3 },
  ],

  faq: (title, id) => [
    { id: `${id}-b1`, type: 'hero', title, subtitle: 'Antwoorden op de vragen die we het vaakst krijgen', tone: 'sage' },
    {
      id: `${id}-b2`,
      type: 'accordion',
      items: [
        { question: 'Eerste vraag', answer: 'Het antwoord op de eerste vraag.' },
        { question: 'Tweede vraag', answer: 'Het antwoord op de tweede vraag.' },
      ],
    },
    { id: `${id}-b3`, type: 'callout', title: 'Staat je vraag er niet bij?', text: 'Stel hem via [Vraag het de directie](/ask) of neem contact op met het team.', tone: 'navy' },
  ],

  howto: (title, id) => [
    { id: `${id}-b1`, type: 'hero', title, tone: 'warm' },
    { id: `${id}-b2`, type: 'text', text: 'Leg in één alinea uit waar deze handleiding over gaat en voor wie hij is.' },
    {
      id: `${id}-b3`,
      type: 'steps',
      title: 'Zo werkt het',
      steps: [
        { title: 'Stap één', text: 'Wat je als eerste doet.' },
        { title: 'Stap twee', text: 'Wat je daarna doet.' },
        { title: 'Stap drie', text: 'Hoe je het afrondt.' },
      ],
    },
    { id: `${id}-b4`, type: 'files', title: 'Documenten', documentIds: [] },
  ],
}

export const PAGE_TEMPLATE_IDS = Object.keys(PAGE_TEMPLATES) as PageTemplateId[]
