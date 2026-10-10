import type { ArtworkPalette, Channel, Comment, Post, Reactions } from '../types'
import { mulberry32 } from '../../lib/random'
import { userId } from './users'

export const seedChannels = (): Channel[] => [
  { id: 'c-company', name: 'Bedrijfsnieuws' },
  { id: 'c-board', name: 'Vanuit de directie' },
  { id: 'c-people', name: 'Mensen & cultuur' },
  { id: 'c-ops', name: 'Operations @ Work' },
  { id: 'c-finance', name: 'Finance @ Life' },
  { id: 'c-it', name: 'IT & Innovatie' },
  { id: 'c-green', name: 'Duurzaamheid' },
]

interface PostSeed {
  channel: string
  author: number
  hoursAgo: number
  palette: ArtworkPalette
  title: string
  intro: string
  body: string[]
}

const POSTS: PostSeed[] = [
  {
    channel: 'c-people',
    author: 15,
    hoursAgo: 3,
    palette: 'sage',
    title: 'Wandelweekend op de Veluwe',
    intro: 'Twee dagen, veertig kilometer en heel veel gezelligheid. Een terugblik op ons collega-weekend.',
    body: [
      'Afgelopen weekend trokken twaalf collega’s uit drie landen de wandelschoenen aan voor het jaarlijkse Nexora-wandelweekend. Zaterdag liepen we 22 kilometer door bossen en over heidevelden, met onderweg een welverdiende stop voor koffie en appeltaart.',
      '’s Avonds schoven we aan voor een gezamenlijk diner, waarna de quiz tot in de late uurtjes doorging. Het team Finance won met één punt voorsprong — de revanche staat al gepland.',
      'Zondag volgde nog een kortere route langs de sprengen. Moe maar voldaan keerde iedereen huiswaarts. Volgend jaar weer? Houd dit kanaal in de gaten voor de inschrijving.',
    ],
  },
  {
    channel: 'c-ops',
    author: 25,
    hoursAgo: 20,
    palette: 'navy',
    title: 'Nieuwe digitale printstraat in Keulen draait op volle toeren',
    intro: 'Na weken van voorbereiding is de nieuwe printstraat officieel in gebruik genomen. Dit betekent het voor onze capaciteit.',
    body: [
      'Het team in Keulen heeft de afgelopen weken hard gewerkt aan de installatie van een nieuwe digitale printstraat. Sinds maandag draait de lijn in productie en de eerste resultaten zijn veelbelovend.',
      'De nieuwe straat verhoogt onze capaciteit voor gepersonaliseerde poststukken met ongeveer dertig procent en verbruikt tegelijk minder energie per vel.',
      'Dank aan iedereen die heeft meegeholpen aan de planning, de installatie en de testruns. Benieuwd? Plan gerust een rondleiding in via het operationsteam.',
    ],
  },
  {
    channel: 'c-board',
    author: 1,
    hoursAgo: 30,
    palette: 'navy',
    title: 'Kwartaalupdate: samen op koers',
    intro: 'Een korte terugblik op het afgelopen kwartaal en een vooruitblik op wat er komen gaat.',
    body: [
      'Het afgelopen kwartaal hebben we als Nexora Central Europe goede stappen gezet. We verwelkomden vier nieuwe klanten en breidden onze samenwerking met twee bestaande klanten uit.',
      'Tegelijk vragen stijgende papier- en energiekosten om scherpe keuzes. We blijven investeren in automatisering en duurzame productie, zodat we ook op de lange termijn gezond groeien.',
      'Dank voor jullie inzet. Heb je vragen over de koers? Stel ze via Ask the Board — we beantwoorden ze in de volgende update.',
    ],
  },
  {
    channel: 'c-finance',
    author: 7,
    hoursAgo: 52,
    palette: 'sky',
    title: 'Onze facturatie: veel meer dan alleen facturen versturen',
    intro: 'Maak kennis met het team dat ervoor zorgt dat elke geleverde dienst een correcte en begrijpelijke factuur wordt.',
    body: [
      'Elke dag verwerkt ons facturatieteam honderden regels aan geleverde diensten. Daarbij controleren ze afspraken, tarieven en volumes, zodat de klant een factuur krijgt die klopt en begrijpelijk is.',
      'Achter de schermen werken ze nauw samen met sales, operations en de klantenservice. Een vraag over een factuur? Het team staat voor je klaar.',
    ],
  },
  {
    channel: 'c-it',
    author: 19,
    hoursAgo: 75,
    palette: 'sky',
    title: 'Welkom in de nieuwe myNexora-app',
    intro: 'Een frisse, snellere app met nieuws, collega’s en alles wat je nodig hebt op één plek.',
    body: [
      'Vanaf vandaag is de vernieuwde myNexora-app beschikbaar. We hebben goed geluisterd naar jullie feedback: de app is overzichtelijker, sneller en werkt net zo prettig op je telefoon als op je laptop.',
      'Reageer op berichten met elke emoji die je wilt, bewaar artikelen voor later en houd via het belletje bij wat er voor jou nieuw is.',
      'In de komende weken volgen nog meer onderdelen, zoals het smoelenboek, chat en de afdelingspagina’s. Laat via de feedbackknop weten wat je ervan vindt!',
    ],
  },
  {
    channel: 'c-green',
    author: 57,
    hoursAgo: 100,
    palette: 'sage',
    title: 'Zonnepanelen op het dak in Zwolle',
    intro: 'Ruim 1.200 panelen leveren voortaan een groot deel van de stroom voor ons fulfilmentcentrum.',
    body: [
      'Op het dak van ons fulfilmentcentrum in Zwolle liggen sinds deze maand ruim 1.200 zonnepanelen. Op een zonnige dag dekken ze bijna de helft van ons stroomverbruik.',
      'Het is een volgende stap in onze duurzaamheidsambitie: in 2030 willen we onze CO₂-uitstoot ten opzichte van 2020 halveren.',
    ],
  },
  {
    channel: 'c-people',
    author: 53,
    hoursAgo: 130,
    palette: 'warm',
    title: 'Welkom aan onze nieuwe collega’s',
    intro: 'Deze maand verwelkomen we elf nieuwe collega’s in vijf landen. Maak kennis!',
    body: [
      'We zijn blij dat we deze maand elf nieuwe collega’s mogen verwelkomen, van Poznań tot Gent. Ze versterken onder andere onze teams in operations, IT en de klantenservice.',
      'Kom je een nieuw gezicht tegen bij de koffieautomaat? Stel je even voor — zo voelt iedereen zich snel thuis.',
    ],
  },
  {
    channel: 'c-company',
    author: 14,
    hoursAgo: 170,
    palette: 'navy',
    title: 'Nexora op het regiocongres in Den Bosch',
    intro: 'Twee dagen vol gesprekken met gemeenten over persoonlijke en digitale klantcommunicatie.',
    body: [
      'Op het regiocongres in Den Bosch stonden we twee dagen met een stand om gemeenten te laten zien hoe we hun communicatie met inwoners persoonlijker en digitaler maken.',
      'De belangstelling was groot: we voerden tientallen gesprekken en plannen inmiddels vervolgafspraken met meerdere gemeenten.',
    ],
  },
  {
    channel: 'c-ops',
    author: 35,
    hoursAgo: 220,
    palette: 'warm',
    title: 'Lean-week: 47 verbeterideeën in vijf dagen',
    intro: 'Tijdens de lean-week dachten collega’s uit alle vestigingen mee over slimmer werken.',
    body: [
      'In de lean-week kwamen teams dagelijks samen bij het verbeterbord. Het resultaat: 47 ideeën, waarvan er twaalf direct zijn doorgevoerd.',
      'Het populairste idee? Een vaste plek voor elk gereedschap op de productievloer, waardoor zoeken tot het verleden behoort.',
    ],
  },
  {
    channel: 'c-it',
    author: 24,
    hoursAgo: 260,
    palette: 'sky',
    title: 'Let op: phishingmails in omloop',
    intro: 'We zien een toename van nepmails die zich voordoen als pakketbezorgers. Zo herken je ze.',
    body: [
      'De afgelopen dagen ontvingen meerdere collega’s mails over een “pakket dat niet bezorgd kon worden”. Deze mails zijn nep en proberen je inloggegevens te stelen.',
      'Twijfel je? Klik niet op links, maar meld de mail via de knop “Phishing melden” in je mailprogramma. Het IT-team kijkt er dan naar.',
    ],
  },
  {
    channel: 'c-finance',
    author: 9,
    hoursAgo: 320,
    palette: 'sky',
    title: 'Nieuw ERP-systeem geland in Keulen',
    intro: 'De overstap naar het nieuwe financiële systeem is afgerond. Tijd voor taart!',
    body: [
      'Na maanden van voorbereiding draait de administratie in Keulen sinds deze week volledig in het nieuwe ERP-systeem. Alle openstaande posten zijn overgezet en de eerste maandafsluiting verliep soepel.',
      'Dank aan iedereen die heeft getest, getraind en geduld heeft gehad. Volgende stap: de vestigingen in Polen en Tsjechië.',
    ],
  },
  {
    channel: 'c-people',
    author: 54,
    hoursAgo: 400,
    palette: 'warm',
    title: 'Inschrijving voor de leergangen is geopend',
    intro: 'Van leiderschap tot Excel: schrijf je in voor een van de nieuwe trainingen.',
    body: [
      'Ook dit najaar bieden we weer een breed aanbod aan trainingen. Nieuw zijn onder andere een leergang “Eerste keer leidinggeven” en een workshop over slim werken met AI-tools.',
      'Inschrijven kan tot het einde van de maand via je HR Business Partner.',
    ],
  },
]

const EMOJIS = ['👍', '🎉', '❤️', '💡', '🙏', '😂', '🚀']
const HOUR = 3_600_000

const seedReactions = (rand: () => number): Reactions => {
  const reactions: Reactions = {}
  const reacted = new Set<string>()
  const count = 3 + Math.floor(rand() * 25)
  for (let i = 0; i < count; i++) {
    // Weighted towards the first emojis, like real usage; one reaction per person.
    const emoji = EMOJIS[Math.floor(rand() ** 2 * EMOJIS.length)]
    const user = userId(1 + Math.floor(rand() * 60))
    if (reacted.has(user)) continue
    reacted.add(user)
    ;(reactions[emoji] ??= []).push(user)
  }
  return reactions
}

export const seedPosts = (now: number): Post[] => {
  const rand = mulberry32(42)
  return POSTS.map((p, i) => ({
    id: `p${String(i + 1).padStart(2, '0')}`,
    channelId: p.channel,
    authorId: userId(p.author),
    title: p.title,
    intro: p.intro,
    body: p.body,
    image: { kind: 'artwork', seed: 7 + i * 13, palette: p.palette },
    createdAt: now - p.hoursAgo * HOUR,
    reactions: seedReactions(rand),
  }))
}

interface CommentSeed {
  post: string
  author: number
  text: string
  minutesAfter: number
  replies?: Omit<CommentSeed, 'post' | 'replies'>[]
}

const COMMENTS: CommentSeed[] = [
  {
    post: 'p01',
    author: 42,
    minutesAfter: 20,
    text: 'Wat een mooie foto’s en wat klinkt dit gezellig! Volgend jaar ben ik er zeker bij.',
    replies: [{ author: 15, minutesAfter: 45, text: 'Top, we rekenen op je! 🙌' }],
  },
  {
    post: 'p01',
    author: 8,
    minutesAfter: 35,
    text: 'Dank voor de super organisatie, dit was echt quality time met collega’s.',
  },
  {
    post: 'p01',
    author: 31,
    minutesAfter: 90,
    text: 'Geweldige dagen gehad. Mijn benen voelen het nog steeds 😅',
  },
  {
    post: 'p02',
    author: 3,
    minutesAfter: 60,
    text: 'Knap werk van het hele team in Keulen. Goed om te zien!',
    replies: [{ author: 28, minutesAfter: 120, text: 'Dank je! Het was een flinke klus, maar hij draait als een zonnetje.' }],
  },
  {
    post: 'p03',
    author: 59,
    minutesAfter: 180,
    text: 'Fijn dat we zo open worden meegenomen in de cijfers. Ik ben benieuwd naar de plannen rond automatisering.',
  },
  {
    post: 'p04',
    author: 44,
    minutesAfter: 40,
    text: 'Onmisbaar team! Dank voor alle snelle hulp bij klantvragen.',
  },
  {
    post: 'p05',
    author: 21,
    minutesAfter: 15,
    text: 'Ziet er strak uit! Werkt de donkere modus ook op desktop?',
    replies: [{ author: 19, minutesAfter: 25, text: 'Zeker, kijk maar bij Instellingen → Weergave.' }],
  },
  {
    post: 'p06',
    author: 26,
    minutesAfter: 300,
    text: 'Mooie stap. Komen er ook laadpalen bij de vestiging?',
  },
]

export const seedComments = (posts: Post[]): Comment[] => {
  const createdAtOf = (postId: string) => posts.find((p) => p.id === postId)?.createdAt ?? 0
  const rand = mulberry32(7)
  const likes = () =>
    Array.from({ length: Math.floor(rand() * 5) }, () => userId(1 + Math.floor(rand() * 60))).filter(
      (v, i, a) => a.indexOf(v) === i,
    )
  const out: Comment[] = []
  let n = 1
  for (const c of COMMENTS) {
    const base = createdAtOf(c.post)
    const id = `cm${n++}`
    out.push({
      id,
      postId: c.post,
      parentId: null,
      authorId: userId(c.author),
      text: c.text,
      createdAt: base + c.minutesAfter * 60_000,
      editedAt: null,
      deleted: false,
      likes: likes(),
    })
    for (const r of c.replies ?? []) {
      out.push({
        id: `cm${n++}`,
        postId: c.post,
        parentId: id,
        authorId: userId(r.author),
        text: r.text,
        createdAt: base + r.minutesAfter * 60_000,
        editedAt: null,
        deleted: false,
        likes: likes(),
      })
    }
  }
  return out
}

