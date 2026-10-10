import type { ArtworkPalette, Channel, Comment, Post, Reactions } from '../types'
import { mulberry32 } from '../../lib/random'
import { userId } from './users'

export const seedChannels = (): Channel[] => [
  { id: 'c-company', name: 'Bedrijfsnieuws', color: 'royal' },
  { id: 'c-board', name: 'Van de directie', color: 'navy' },
  { id: 'c-people', name: 'Mensen & cultuur', color: 'berry' },
  { id: 'c-sport', name: 'Sport & spel', color: 'orange' },
  { id: 'c-food', name: 'Eten & drinken', color: 'sienna' },
  { id: 'c-it', name: 'Techniek & innovatie', color: 'sky' },
  { id: 'c-green', name: 'Groen & duurzaam', color: 'sage' },
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
    channel: 'c-sport',
    author: 15,
    hoursAgo: 3,
    palette: 'sage',
    title: 'Fietstocht langs de Amstel: 62 kilometer en één lekke band',
    intro: 'Veertien collega’s, één gezamenlijke lunch en een bandenwissel in recordtijd. Een terugblik op onze zondagsrit.',
    body: [
      'Zondagochtend om negen uur verzamelden veertien collega’s zich bij ons kantoor in Amsterdam voor de jaarlijkse Amsteltocht. Het weer werkte mee: zon, weinig wind en een temperatuur waar je precies goed van gaat fietsen.',
      'Na twintig kilometer kreeg Tim een lekke band. Binnen vier minuten stond hij weer op de pedalen — een nieuw record volgens de aanwezige monteurs. Halverwege stopten we bij een boerderij voor appeltaart en verse jus d’orange.',
      'Volgende maand staat een rit door de duinen op de planning. Houd dit kanaal in de gaten voor de inschrijving!',
    ],
  },
  {
    channel: 'c-food',
    author: 60,
    hoursAgo: 20,
    palette: 'warm',
    title: 'Het grote Nexora-bakfestijn: dit zijn de winnaars',
    intro: 'Tweeëntwintig taarten, één zeer strenge jury en een citroentaart die iedereen versteld deed staan.',
    body: [
      'Vrijdagmiddag veranderde de kantine in Amsterdam in een bakkerij. Maar liefst tweeëntwintig collega’s deden mee aan het eerste Nexora-bakfestijn.',
      'De jury beoordeelde op smaak, uiterlijk en originaliteit. De winnaar werd Amira met haar citroen-merengue taart. De publieksprijs ging naar Lars, die een fiets van marsepein had gemaakt — inclusief bagagedrager.',
      'Het recept van de winnende taart staat inmiddels op het prikbord bij de koffieautomaat. Volgend jaar weer?',
    ],
  },
  {
    channel: 'c-board',
    author: 1,
    hoursAgo: 30,
    palette: 'navy',
    title: 'Kwartaalupdate: de nieuwe bakfiets komt eraan',
    intro: 'Een korte terugblik op het afgelopen kwartaal en een kijkje achter de schermen bij ons nieuwste model.',
    body: [
      'Het afgelopen kwartaal verkochten we meer fietsen dan ooit, vooral in Kopenhagen en Barcelona. Dank aan iedereen die daar hard voor heeft gewerkt.',
      'Het design- en engineeringteam zit in de laatste testfase van onze nieuwe bakfiets. In het voorjaar rijden de eerste exemplaren rond, en jullie mogen hem als eersten uitproberen.',
      'Heb je vragen over onze plannen? Stel ze via Vraag het de directie in de app. We beantwoorden ze in de volgende update.',
    ],
  },
  {
    channel: 'c-people',
    author: 53,
    hoursAgo: 52,
    palette: 'warm',
    title: 'Maak kennis met Pip, kantoorhond van de maand',
    intro: 'Pip is drie jaar, houdt van tennisballen en heeft inmiddels meer volgers dan ons marketingteam.',
    body: [
      'Elke maand zetten we een van onze kantoorhonden in het zonnetje. Deze maand is dat Pip, de border collie van Ayoub.',
      'Pip komt op dinsdag en donderdag mee naar Amsterdam. Hij weet precies wie er koekjes in de la heeft liggen en bewaakt de fietsenstalling met grote toewijding.',
      'Heb jij ook een kantoordier dat in het zonnetje gezet moet worden? Stuur een foto naar het redactieteam!',
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
    ],
  },
  {
    channel: 'c-green',
    author: 57,
    hoursAgo: 100,
    palette: 'sage',
    title: 'Moestuin op het dak: de eerste oogst is binnen',
    intro: 'Tomaten, basilicum en een verrassend grote pompoen. Onze daktuin in Amsterdam is een succes.',
    body: [
      'In het voorjaar legden vrijwilligers een moestuin aan op het dak van ons kantoor in Amsterdam. Deze week was de eerste oogst: twaalf kilo tomaten, bergen basilicum en één pompoen van bijna acht kilo.',
      'De groenten gingen naar de kantine, waar de kok er een heerlijke soep van maakte. De pompoen staat voorlopig als mascotte bij de receptie.',
      'Wil je meehelpen in de tuin? Elke woensdag tijdens de lunch wordt er gewied en gewaterd.',
    ],
  },
  {
    channel: 'c-sport',
    author: 29,
    hoursAgo: 130,
    palette: 'sky',
    title: 'Pubquiz: Engineering wint (alweer)',
    intro: 'Veertig vragen, acht teams en één beslissende vraag over de hoogste berg van Denemarken.',
    body: [
      'Donderdagavond streden acht teams om de felbegeerde gouden fietsbel. Het werd een spannende avond met vragen over muziek, sport, geschiedenis en — natuurlijk — fietsen.',
      'Na veertig vragen stonden Engineering en Customer Care gelijk. De schiftingsvraag besliste: wie wist hoe hoog de hoogste berg van Denemarken is? Engineering zat er slechts één meter naast.',
      'De revanche staat al gepland voor na de zomer.',
    ],
  },
  {
    channel: 'c-company',
    author: 14,
    hoursAgo: 170,
    palette: 'navy',
    title: 'Nexora op de fietsbeurs in Kopenhagen',
    intro: 'Drie dagen, duizenden bezoekers en een stand waar de testritten niet aan te slepen waren.',
    body: [
      'Op de grote fietsbeurs in Kopenhagen stonden we drie dagen met een eigen stand. Bezoekers konden onze nieuwste modellen testen op een parcours buiten de hal.',
      'Vooral de stadsfiets in de nieuwe kleur “fjordblauw” was populair. Het team uit Kopenhagen heeft tientallen nieuwe contacten met fietsenwinkels opgedaan.',
    ],
  },
  {
    channel: 'c-people',
    author: 54,
    hoursAgo: 220,
    palette: 'warm',
    title: 'Boekenclub zoekt nieuwe leden',
    intro: 'Elke maand een boek, één avond praten en altijd iets lekkers erbij. Lees jij mee?',
    body: [
      'Onze boekenclub bestaat inmiddels twee jaar en zoekt nieuwe leden. We lezen van alles: romans, thrillers, non-fictie en af en toe een stripboek.',
      'We komen één keer per maand samen, afwisselend op kantoor en online, zodat ook collega’s uit Antwerpen, Kopenhagen en Barcelona mee kunnen doen.',
      'Interesse? Stuur Greta een berichtje via de chat.',
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
    channel: 'c-food',
    author: 56,
    hoursAgo: 320,
    palette: 'warm',
    title: 'Paella-workshop in Barcelona: recept inbegrepen',
    intro: 'Het team in Barcelona leerde van een echte chef hoe je de perfecte paella maakt. Het recept delen we graag.',
    body: [
      'Op het dakterras van ons kantoor in Barcelona gaf chef Rosa een paella-workshop voor twintig collega’s. Het geheim? Niet roeren, en geduld hebben voor de krokante bodem.',
      'Het resultaat werd opgegeten met uitzicht over de stad. Het recept staat vanaf vandaag op de pagina van Mensen & cultuur.',
    ],
  },
  {
    channel: 'c-company',
    author: 15,
    hoursAgo: 400,
    palette: 'navy',
    title: 'Stuur je favoriete nummer in voor de werkplaats-playlist',
    intro: 'In de werkplaats in Eindhoven staat de muziek altijd aan. Welk nummer mag er niet ontbreken?',
    body: [
      'De collega’s in onze werkplaats werken het liefst met muziek. Daarom maken we samen een Nexora-playlist.',
      'Reageer onder dit bericht met jouw favoriete nummer. Aan het eind van de maand zetten we de lijst online, zodat iedereen hem kan beluisteren.',
    ],
  },
]

// Some posts are also available in English/German, to show multilingual content.
const TRANSLATIONS: Record<number, Post['translations']> = {
  4: {
    en: {
      title: 'Welcome to the new myNexora app',
      intro: 'A fresh, faster app with news, colleagues and everything you need in one place.',
      body: [
        'From today the renewed myNexora app is available. We listened carefully to your feedback: the app is clearer, faster and works just as well on your phone as on your laptop.',
        'React to posts with any emoji you like, save articles for later and keep track of what is new for you via the bell.',
      ],
    },
    de: {
      title: 'Willkommen in der neuen myNexora-App',
      intro: 'Eine frische, schnellere App mit News, Kolleginnen und Kollegen und allem, was du brauchst.',
      body: [
        'Ab heute ist die erneuerte myNexora-App verfügbar. Wir haben euer Feedback ernst genommen: Die App ist übersichtlicher, schneller und funktioniert auf dem Handy genauso gut wie am Laptop.',
        'Reagiere mit jedem beliebigen Emoji, speichere Artikel für später und behalte über die Glocke im Blick, was neu ist.',
      ],
    },
  },
}

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
    ...(TRANSLATIONS[i] ? { translations: TRANSLATIONS[i] } : {}),
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
    text: 'Wat een mooie route! Volgende keer ben ik er zeker bij.',
    replies: [{ author: 15, minutesAfter: 45, text: 'Top, we rekenen op je! 🙌' }],
  },
  {
    post: 'p01',
    author: 8,
    minutesAfter: 35,
    text: 'Dank voor de organisatie, dit was echt een topdag.',
  },
  {
    post: 'p01',
    author: 31,
    minutesAfter: 90,
    text: 'Vier minuten voor een band wisselen, Tim is een held 😅',
  },
  {
    post: 'p02',
    author: 3,
    minutesAfter: 60,
    text: 'Die marsepeinen fiets verdient een plek in de showroom!',
    replies: [{ author: 31, minutesAfter: 120, text: 'Hij is helaas al opgegeten 😄' }],
  },
  {
    post: 'p03',
    author: 59,
    minutesAfter: 180,
    text: 'Leuk dat we de bakfiets als eersten mogen testen. Wanneer kunnen we ons inschrijven?',
  },
  {
    post: 'p04',
    author: 44,
    minutesAfter: 40,
    text: 'Pip is de beste collega van de verdieping 🐶',
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
    text: 'Kunnen we ook een daktuin in Málaga beginnen? Genoeg zon hier ☀️',
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

