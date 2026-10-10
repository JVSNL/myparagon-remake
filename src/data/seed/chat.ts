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
    id: 'cv-design',
    kind: 'group',
    name: 'Designteam',
    members: [35, 34, 37, 17, 20],
    messages: [
      [35, 26 * 60, 'Goedemorgen! Donderdag komen de nieuwe kleurstalen binnen, wie kijkt mee?'],
      [34, 25 * 60, 'Ik! Ben benieuwd naar het fjordblauw in het echt.'],
      [37, 3 * 60, 'Heeft iemand de foto’s van de gebruikerstest in het park al gedeeld?'],
      [17, 2 * 60, 'Komen eraan, ik zet ze vanmiddag in de map.'],
    ],
  },
  {
    id: 'cv-sanne-milan',
    kind: 'direct',
    members: [20, 35],
    messages: [
      [35, 4 * 60, 'Hoi Sanne, heb je even tijd om naar de schetsen van het stuur te kijken?'],
      [20, 3.5 * 60, 'Zeker, om 14.00 uur?'],
      [35, 50, 'Prima, tot dan!'],
    ],
  },
  {
    id: 'cv-lunch',
    kind: 'group',
    name: 'Lunchwandeling Amsterdam',
    members: [5, 15, 19, 20, 53, 60],
    messages: [
      [60, 30 * 60, 'Wie loopt er morgen mee? 12.30 uur bij de fietsenstalling 🚶'],
      [15, 29 * 60, 'Ik ben erbij!'],
      [53, 29 * 60, 'Ik neem Pip mee 🐶'],
    ],
  },
  {
    id: 'cv-ruben-julia',
    kind: 'direct',
    members: [15, 14],
    messages: [
      [14, 6 * 60, 'Kun jij het bericht over de Amsteltocht vandaag plaatsen?'],
      [15, 5 * 60, 'Doe ik! Ik heb nog een paar foto’s nodig van Tim.'],
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
    text: 'Komen er meer oplaadpunten voor e-bikes in de fietsenstalling in Eindhoven?',
    visibility: 'public',
    createdAt: now - 9 * 24 * HOUR,
    answer: {
      authorId: userId(3),
      text: 'Goede vraag! Volgende maand plaatsen we twintig extra oplaadpunten. Laden blijft voor medewerkers gratis.',
      answeredAt: now - 7 * 24 * HOUR,
    },
  },
  {
    id: 'q2',
    authorId: userId(42),
    text: 'Wordt de Amsteltocht volgend jaar ook in Kopenhagen en Barcelona georganiseerd?',
    visibility: 'public',
    createdAt: now - 2 * HOUR,
  },
  {
    id: 'q3',
    authorId: userId(28),
    text: 'Kunnen medewerkers met korting een Nexora-fiets leasen?',
    visibility: 'public',
    createdAt: now - 20 * 24 * HOUR,
    answer: {
      authorId: userId(2),
      text: 'Ja! Via het fietsplan lease je elke Nexora met 30% korting. Je vindt de details op de pagina van Finance.',
      answeredAt: now - 18 * 24 * HOUR,
    },
  },
  {
    id: 'q4',
    authorId: userId(45),
    text: 'Ik heb een idee voor een samenwerking met een fietsenwinkel in Valencia. Bij wie kan ik dat het best neerleggen?',
    visibility: 'board',
    createdAt: now - 26 * HOUR,
  },
]
