import type { ChatMessage, Conversation, Question } from '../types'
import { userId } from './users'

const MIN = 60_000
const HOUR = 60 * MIN

interface ConversationSeed {
  id: string
  kind: Conversation['kind']
  name?: string
  members: number[]
  /** [author, minutes ago, text] */
  messages: [number, number, string][]
}

const CONVERSATIONS: ConversationSeed[] = [
  {
    id: 'cv-finance',
    kind: 'group',
    name: 'Finance team',
    members: [7, 8, 9, 10, 20],
    messages: [
      [7, 26 * 60, 'Goedemorgen allemaal! Herinnering: de maandafsluiting staat donderdag gepland.'],
      [9, 25 * 60, 'Top, de boekingen uit Keulen zijn vandaag rond.'],
      [8, 3 * 60, 'Wie heeft er nog een update over de forecast voor Q4?'],
      [10, 2 * 60, 'Ik stuur je vanmiddag de laatste cijfers van de crediteuren.'],
    ],
  },
  {
    id: 'cv-sanne-daan',
    kind: 'direct',
    members: [20, 8],
    messages: [
      [8, 4 * 60, 'Hoi Sanne, heb je even tijd om naar het dashboard te kijken?'],
      [20, 3.5 * 60, 'Zeker, om 14.00 uur?'],
      [8, 50, 'Prima, tot dan!'],
    ],
  },
  {
    id: 'cv-lunch',
    kind: 'group',
    name: 'Lunchwandeling Utrecht',
    members: [5, 15, 19, 20, 53, 60],
    messages: [
      [60, 30 * 60, 'Wie loopt er morgen mee? 12.30 uur bij de ingang 🚶'],
      [15, 29 * 60, 'Ik ben erbij!'],
      [5, 29 * 60, 'Ik ook, als het droog blijft ☀️'],
    ],
  },
  {
    id: 'cv-ruben-julia',
    kind: 'direct',
    members: [15, 14],
    messages: [
      [14, 6 * 60, 'Kun jij het bericht over het wandelweekend vandaag plaatsen?'],
      [15, 5 * 60, 'Doe ik! Ik heb nog een paar foto’s nodig van Lars.'],
    ],
  },
]

export const seedChat = (now: number) => {
  const conversations: Conversation[] = CONVERSATIONS.map((c) => ({
    id: c.id,
    kind: c.kind,
    ...(c.name ? { name: c.name } : {}),
    memberIds: c.members.map(userId),
    createdAt: now - 40 * HOUR,
  }))
  const messages: ChatMessage[] = CONVERSATIONS.flatMap((c) =>
    c.messages.map(([author, minutesAgo, text], i) => ({
      id: `${c.id}-m${i + 1}`,
      conversationId: c.id,
      authorId: userId(author),
      text,
      createdAt: now - minutesAgo * MIN,
    })),
  )
  return { conversations, messages }
}

export const seedQuestions = (now: number): Question[] => [
  {
    id: 'q1',
    authorId: userId(31),
    text: 'Komen er laadpalen bij de vestiging in Zwolle nu er zonnepanelen op het dak liggen?',
    visibility: 'public',
    createdAt: now - 9 * 24 * HOUR,
    answer: {
      authorId: userId(3),
      text: 'Goede vraag! Begin volgend jaar plaatsen we acht laadpunten op het terrein. Het eerste jaar is laden voor medewerkers gratis.',
      answeredAt: now - 7 * 24 * HOUR,
    },
  },
  {
    id: 'q2',
    authorId: userId(42),
    text: 'Wordt het wandelweekend volgend jaar ook voor andere vestigingen georganiseerd?',
    visibility: 'public',
    createdAt: now - 2 * HOUR,
  },
  {
    id: 'q3',
    authorId: userId(28),
    text: 'Hoe gaan we om met de stijgende papierprijzen? Heeft dat gevolgen voor onze klanten?',
    visibility: 'public',
    createdAt: now - 20 * 24 * HOUR,
    answer: {
      authorId: userId(2),
      text: 'We hebben langlopende inkoopcontracten, waardoor we de stijging grotendeels kunnen opvangen. Met klanten maken we per contract afspraken over indexering.',
      answeredAt: now - 18 * 24 * HOUR,
    },
  },
  {
    id: 'q4',
    authorId: userId(45),
    text: 'Ik heb een idee voor een nieuwe dienst voor een bestaande klant. Bij wie kan ik dat het best neerleggen?',
    visibility: 'board',
    createdAt: now - 26 * HOUR,
  },
]
