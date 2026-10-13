import type { Block, Localized, Page, PageSection } from '../types'
import { userId } from './users'

// Distributes Omit over the union, so each block keeps its own fields.
type NewBlock = Block extends infer B ? (B extends Block ? Omit<B, 'id'> : never) : never

interface PageSeed {
  slug: string
  section: PageSection
  icon: string
  title: Localized<string>
  blocks: NewBlock[]
  /** Optional English version of the blocks, to show translated content. */
  blocksEn?: NewBlock[]
}

const withIds = (slug: string, blocks: NewBlock[]): Block[] =>
  blocks.map((b, i) => ({ ...b, id: `${slug}-b${i + 1}` }) as Block)

/** A local date `inDays` from now at the given time (for events). */
const at = (now: number, inDays: number, hour: number, minute = 0) => {
  const d = new Date(now)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + inDays, hour, minute).getTime()
}

const pageSeeds = (now: number): PageSeed[] => [
  // Product lines
  {
    slug: 'city',
    section: 'division',
    icon: 'bike',
    title: { nl: 'Nexora City', en: 'Nexora City', de: 'Nexora City' },
    blocks: [
      { type: 'hero', title: 'Nexora City', subtitle: 'Licht, stil en gemaakt voor de stad.', tone: 'navy' },
      {
        type: 'text',
        text: 'Nexora City is onze populairste e-bike: een lichte stadsfiets met een verborgen accu, automatische versnellingen en een bereik van 90 kilometer.\n\nPerfect voor woon-werkverkeer, boodschappen en een spontaan rondje door het park.',
      },
      { type: 'heading', text: 'Kenmerken' },
      {
        type: 'text',
        text: '- **Gewicht:** 19 kilo\n- **Bereik:** tot 90 km\n- **Kleuren:** fjordblauw, zandsteen en grafiet\n- **Extra:** ingebouwde verlichting en slot via de app',
      },
      { type: 'feed', title: 'Laatste nieuws', channelId: 'c-company', limit: 2 },
    ],
  },
  {
    slug: 'cargo',
    section: 'division',
    icon: 'package',
    title: { nl: 'Nexora Cargo', en: 'Nexora Cargo', de: 'Nexora Cargo' },
    blocks: [
      { type: 'hero', title: 'Nexora Cargo', subtitle: 'Ruimte voor kinderen, boodschappen en de hond.', tone: 'warm' },
      {
        type: 'text',
        text: 'Onze bakfiets is in ontwikkeling en rijdt in het voorjaar de straat op. Hij heeft een bak voor twee kinderen of 80 kilo bagage, en stuurt net zo makkelijk als een gewone fiets.',
      },
      {
        type: 'steps',
        title: 'Van schets tot straat',
        steps: [
          { title: 'Ontwerp', text: 'De designstudio in Amsterdam maakte honderden schetsen.' },
          { title: 'Prototype', text: 'Engineering bouwde vijf prototypes in Eindhoven.' },
          { title: 'Testen', text: 'Duizenden kilometers op de testbaan en in de stad.' },
          { title: 'Productie', text: 'Assemblage in Málaga, vanaf het voorjaar.' },
        ],
      },
      {
        type: 'event',
        title: 'Proefrit met de nieuwe bakfiets',
        startsAt: at(now, 9, 12),
        endsAt: at(now, 9, 13, 30),
        location: 'Testbaan Eindhoven',
        description: 'Rij als een van de eersten op het prototype en vertel het engineeringteam wat je ervan vindt.',
        capacity: 12,
      },
    ],
  },
  {
    slug: 'trail',
    section: 'division',
    icon: 'mountain',
    title: { nl: 'Nexora Trail', en: 'Nexora Trail', de: 'Nexora Trail' },
    blocks: [
      { type: 'hero', title: 'Nexora Trail', subtitle: 'Voor wie het asfalt achter zich laat.', tone: 'sage' },
      {
        type: 'text',
        text: 'Nexora Trail is onze e-mountainbike voor bos, duin en berg. Met volledige vering, brede banden en een accu die een hele dag meegaat.',
      },
      {
        type: 'callout',
        title: 'Testritten',
        text: 'Elke eerste zaterdag van de maand organiseren we testritten vanuit onze winkels in Antwerpen en Kopenhagen.',
        tone: 'sage',
      },
      { type: 'links', title: 'Links', items: [{ label: 'Routes voor een testrit (voorbeeldlink)', url: 'https://example.com/routes' }] },
    ],
  },

  // Company
  {
    slug: 'strategy',
    section: 'company',
    icon: 'compass',
    title: { nl: 'Strategie', en: 'Strategy', de: 'Strategie' },
    blocks: [
      { type: 'hero', title: 'Strategie', subtitle: 'Waar we naartoe fietsen, en waarom.', tone: 'navy' },
      { type: 'image', image: { kind: 'artwork', seed: 31, palette: 'sky' }, caption: 'Nexora in 2030' },
      {
        type: 'callout',
        title: 'Onze visie',
        text: 'Een stad waarin de fiets voor iedereen de eerste keuze is.',
        tone: 'navy',
      },
      {
        type: 'callout',
        title: 'Onze missie',
        text: 'Fietsen maken die zo fijn rijden dat je de auto vanzelf laat staan.',
        tone: 'warm',
      },
      { type: 'heading', text: 'Onze kernwaarden' },
      {
        type: 'text',
        text: '- **Licht** — in gewicht, en in hoe we met elkaar omgaan\n- **Samen** — over landen en teams heen\n- **Nieuwsgierig** — we blijven proberen en verbeteren\n- **Verantwoordelijk** — voor mensen en planeet',
      },
    ],
    blocksEn: [
      { type: 'hero', title: 'Strategy', subtitle: 'Where we are riding to, and why.', tone: 'navy' },
      { type: 'image', image: { kind: 'artwork', seed: 31, palette: 'sky' }, caption: 'Nexora in 2030' },
      { type: 'callout', title: 'Our vision', text: 'A city where the bike is everyone’s first choice.', tone: 'navy' },
      { type: 'callout', title: 'Our mission', text: 'Make bikes that ride so well you leave the car at home.', tone: 'warm' },
      { type: 'heading', text: 'Our core values' },
      {
        type: 'text',
        text: '- **Light** — in weight, and in how we treat each other\n- **Together** — across countries and teams\n- **Curious** — we keep trying and improving\n- **Responsible** — for people and planet',
      },
    ],
  },
  {
    slug: 'sustainability',
    section: 'company',
    icon: 'leaf',
    title: { nl: 'Duurzaamheid', en: 'Sustainability', de: 'Nachhaltigkeit' },
    blocks: [
      { type: 'image', image: { kind: 'artwork', seed: 22, palette: 'sage' } },
      { type: 'heading', text: 'Duurzaamheid bij Nexora' },
      { type: 'quote', text: 'De groenste kilometer is de kilometer op de fiets.' },
      {
        type: 'text',
        text: 'Fietsen zijn duurzaam, maar het maken ervan kost energie en grondstoffen. Daarom werken we aan fietsen die langer meegaan en aan een schonere productie.\n\nIn 2030 willen we dat 80% van een Nexora-fiets uit gerecyclede of recyclebare materialen bestaat.',
      },
      {
        type: 'steps',
        title: 'Waar we aan werken',
        steps: [
          { title: 'Accu’s', text: 'Elke oude accu nemen we terug en geven we een tweede leven.' },
          { title: 'Onderdelen', text: 'Alle onderdelen zijn tien jaar lang leverbaar.' },
          { title: 'Energie', text: 'Zonnepanelen op onze locaties in Málaga en Eindhoven.' },
        ],
      },
      {
        type: 'form',
        title: 'Ideeënbus: maak Nexora groener',
        intro: 'Heb je een idee om afval, energie of reizen te besparen? Het duurzaamheidsteam leest alles.',
        fields: [
          { id: 'title', label: 'Je idee in één zin', kind: 'text', required: true },
          { id: 'details', label: 'Toelichting', kind: 'textarea', required: true },
          {
            id: 'site',
            label: 'Voor welke locatie?',
            kind: 'choice',
            options: ['Alle locaties', 'Amsterdam', 'Eindhoven', 'Antwerpen', 'Kopenhagen', 'Barcelona', 'Málaga'],
            required: false,
          },
        ],
      },
      { type: 'feed', title: 'Laatste nieuws', channelId: 'c-green', limit: 3 },
    ],
  },
  {
    slug: 'certificates',
    section: 'company',
    icon: 'badge-check',
    title: { nl: 'Certificaten', en: 'Certificates', de: 'Zertifikate' },
    blocks: [
      { type: 'hero', title: 'Certificaten', subtitle: 'Veilig en goed gemaakt, onafhankelijk getoetst.', tone: 'sky' },
      {
        type: 'text',
        text: 'Op een fiets moet je kunnen vertrouwen. Daarom laten we onze fietsen en processen regelmatig toetsen door onafhankelijke partijen.',
      },
      { type: 'files', title: 'Documenten', documentIds: ['iso-9001'] },
      {
        type: 'accordion',
        title: 'Overzicht',
        items: [
          { question: 'ISO 9001', answer: 'Kwaliteitsmanagement voor ontwerp, assemblage en onderhoud.' },
          { question: 'ISO 14001', answer: 'Milieumanagement voor onze assemblage in Málaga.' },
          { question: 'Veiligheidsnorm e-bikes', answer: 'Al onze e-bikes zijn getest volgens de Europese veiligheidsnorm voor elektrische fietsen.' },
        ],
      },
    ],
  },

  // Stories (departments)
  {
    slug: 'design',
    section: 'story',
    icon: 'palette',
    title: { nl: 'Design', en: 'Design', de: 'Design' },
    blocks: [
      { type: 'hero', title: 'Design', subtitle: 'Van eerste schets tot de kleur van de bel.', tone: 'warm' },
      {
        type: 'text',
        text: 'In de designstudio in Amsterdam bedenken we hoe een Nexora eruitziet en voelt. We schetsen, bouwen modellen van karton en klei, en testen alles met echte fietsers.',
      },
      {
        type: 'carousel',
        title: 'Design @ Work',
        slides: [
          { image: { kind: 'artwork', seed: 51, palette: 'warm' }, title: 'Kleurstalen voor het nieuwe model' },
          { image: { kind: 'artwork', seed: 52, palette: 'sky' }, title: 'Kartonnen prototype van de bakfiets' },
          { image: { kind: 'artwork', seed: 53, palette: 'navy' }, title: 'Gebruikerstest in het Vondelpark' },
        ],
      },
      { type: 'people', title: 'Het team', userIds: [userId(35), userId(20), userId(34), userId(37)] },
    ],
  },
  {
    slug: 'engineering',
    section: 'story',
    icon: 'wrench',
    title: { nl: 'Engineering', en: 'Engineering', de: 'Engineering' },
    blocks: [
      { type: 'hero', title: 'Engineering', subtitle: 'Accu’s, motoren en heel veel testkilometers.', tone: 'navy' },
      {
        type: 'text',
        text: 'In het lab in Eindhoven zorgen we dat elke Nexora sterk, veilig en zuinig is. Elke nieuwe fiets rijdt minstens 5.000 kilometer op onze testbaan voordat hij in productie gaat.',
      },
      { type: 'feed', title: 'Techniek & innovatie', channelId: 'c-it', limit: 2 },
      { type: 'people', title: 'Contactpersonen', userIds: [userId(25), userId(28), userId(29)] },
    ],
  },
  {
    slug: 'customer-care',
    section: 'story',
    icon: 'headset',
    title: { nl: 'Customer Care', en: 'Customer Care', de: 'Kundenservice' },
    blocks: [
      { type: 'hero', title: 'Customer Care', subtitle: 'Altijd een vriendelijke stem aan de lijn.', tone: 'sky' },
      {
        type: 'text',
        text: 'Ons Customer Care-team helpt fietsers met vragen over hun fiets, onderhoud en garantie. In vier talen, via telefoon, chat en e-mail.',
      },
      { type: 'people', title: 'Contactpersonen', userIds: [userId(40), userId(42), userId(43)] },
    ],
  },
  {
    slug: 'marketing',
    section: 'story',
    icon: 'megaphone',
    title: { nl: 'Marketing & Communications', en: 'Marketing & Communications', de: 'Marketing & Kommunikation' },
    blocks: [
      { type: 'hero', title: 'Marketing & Communications', subtitle: 'Het verhaal van Nexora, binnen en buiten.', tone: 'navy' },
      {
        type: 'text',
        text: 'Wij zorgen voor de interne communicatie (zoals deze app), onze website, social media, beurzen en campagnes. Heb je een leuk verhaal of een mooie foto? Laat het ons weten!',
      },
      { type: 'people', title: 'Het team', userIds: [userId(13), userId(14), userId(15), userId(16), userId(17)] },
      { type: 'feed', title: 'Bedrijfsnieuws', channelId: 'c-company', limit: 2 },
    ],
  },
  {
    slug: 'it',
    section: 'story',
    icon: 'server',
    title: { nl: 'IT', en: 'IT', de: 'IT' },
    blocks: [
      { type: 'hero', title: 'IT', subtitle: 'Veilig en betrouwbaar werken, overal.', tone: 'sky' },
      {
        type: 'text',
        text: 'Het IT-team beheert onze systemen, laptops en de Nexora-app voor fietsers, en helpt je verder via de servicedesk.\n\nProblemen met je laptop of een account? Meld het via de [servicedesk (voorbeeldlink)](https://example.com/servicedesk).',
      },
      { type: 'feed', title: 'Techniek & innovatie', channelId: 'c-it', limit: 2 },
    ],
  },
  {
    slug: 'finance',
    section: 'story',
    icon: 'landmark',
    title: { nl: 'Finance', en: 'Finance', de: 'Finanzen' },
    blocks: [
      { type: 'hero', title: 'Finance', subtitle: 'Declaraties, reizen en alles over geld.', tone: 'sage' },
      {
        type: 'text',
        text: 'Finance zorgt dat de cijfers kloppen en dat jij je gemaakte kosten snel terugkrijgt. Op deze pagina vind je alles over declaraties en zakelijke reizen.',
      },
      {
        type: 'steps',
        title: 'Zo dien je een declaratie in',
        steps: [
          { title: 'Bewaar je bon', text: 'Maak direct een foto van de bon.' },
          { title: 'Dien in', text: 'Binnen dertig dagen, via het declaratieformulier.' },
          { title: 'Akkoord', text: 'Je leidinggevende keurt de declaratie goed.' },
          { title: 'Uitbetaling', text: 'Met je volgende salaris.' },
        ],
      },
      { type: 'files', title: 'Documenten', documentIds: ['expense-process', 'travel-policy'] },
      {
        type: 'accordion',
        title: 'Veelgestelde vragen',
        items: [
          { question: 'Krijg ik mijn fietskilometers vergoed?', answer: 'Ja, € 0,23 per zakelijke kilometer op de fiets.' },
          { question: 'Kan ik een Nexora-fiets leasen?', answer: 'Ja, via het fietsplan met korting. Vraag het na bij People & Culture.' },
        ],
      },
      { type: 'people', title: 'Contactpersonen', userIds: [userId(8), userId(10), userId(9)] },
    ],
  },
  {
    slug: 'people',
    section: 'story',
    icon: 'users',
    title: { nl: 'People & Culture', en: 'People & Culture', de: 'People & Culture' },
    blocks: [
      { type: 'hero', title: 'People & Culture', subtitle: 'Voor alles rond werken bij Nexora.', tone: 'warm' },
      {
        type: 'poll',
        question: 'Welke teamactiviteit wil jij het volgende kwartaal?',
        options: ['Fietstocht door de duinen', 'Kookworkshop', 'Escaperoom', 'Bowlen'],
      },
      {
        type: 'event',
        title: 'Nexora-familiedag',
        startsAt: at(now, 20, 16),
        endsAt: at(now, 20, 22),
        location: 'Op alle vestigingen',
        description: 'Muziek, een fietsparcours voor kinderen en eten uit alle vier de landen, met een live verbinding tussen de kantoren. Neem je gezin gerust mee.',
      },
      {
        type: 'accordion',
        title: 'Veelgestelde vragen',
        items: [
          { question: 'Hoe vraag ik verlof aan?', answer: 'Via het HR-portaal. Je leidinggevende keurt het verzoek goed.' },
          { question: 'Wanneer wordt mijn salaris betaald?', answer: 'Rond de 25e van de maand. Je loonstrook vind je in het HR-portaal.' },
          { question: 'Mag mijn hond mee naar kantoor?', answer: 'Op dinsdag en donderdag, als je collega’s ermee akkoord zijn.' },
        ],
      },
      { type: 'people', title: 'Het team', userIds: [userId(5), userId(50), userId(51), userId(53)] },
      { type: 'feed', title: 'Mensen & cultuur', channelId: 'c-people', limit: 2 },
    ],
  },
  {
    slug: 'works-council',
    section: 'story',
    icon: 'scale',
    title: { nl: 'Ondernemingsraad', en: 'Works Council', de: 'Betriebsrat' },
    blocks: [
      { type: 'hero', title: 'Ondernemingsraad', subtitle: 'Jouw stem in belangrijke besluiten.', tone: 'sage' },
      {
        type: 'text',
        text: 'De ondernemingsraad praat namens alle medewerkers mee over belangrijke besluiten, zoals werktijden, thuiswerken en regelingen.\n\nHeb je een vraag of een punt voor de agenda? Neem contact op met een van de leden.',
      },
      { type: 'people', title: 'Voorzitter', userIds: [userId(59)] },
    ],
  },

  // General
  {
    slug: 'faq',
    section: 'general',
    icon: 'circle-help',
    title: { nl: 'FAQ', en: 'FAQ', de: 'FAQ' },
    blocks: [
      { type: 'image', image: { kind: 'artwork', seed: 12, palette: 'sky' } },
      {
        type: 'accordion',
        title: 'Veelgestelde vragen',
        items: [
          { question: 'Is de app veilig?', answer: 'Ja. Je logt in met je persoonlijke account en alle verbindingen zijn versleuteld.' },
          { question: 'Is het gebruik van de app vrijwillig?', answer: 'Ja. Alle belangrijke informatie is ook via je leidinggevende of het intranet beschikbaar.' },
          { question: 'Kan ik de app gebruiken zonder mobiele telefoon?', answer: 'Ja, myNexora werkt ook in de browser op je laptop of pc.' },
          { question: 'Hoe wijzig ik mijn profiel?', answer: 'Ga naar Menu → Mijn profiel en kies Bewerken.' },
          { question: 'Wat is de chat?', answer: 'Met de chat stuur je collega’s een bericht, één op één of in een groep.' },
          { question: 'Kan iemand anders dan de ontvanger mijn chatberichten lezen?', answer: 'Nee. Alleen de deelnemers van een gesprek kunnen de berichten lezen.' },
        ],
      },
    ],
  },
  {
    slug: 'support',
    section: 'general',
    icon: 'life-buoy',
    title: { nl: 'Support', en: 'Support', de: 'Support' },
    blocks: [
      { type: 'hero', title: 'Support', subtitle: 'Hulp nodig met de app?', tone: 'sky' },
      {
        type: 'text',
        text: 'Werkt iets niet zoals verwacht? Bekijk eerst de veelgestelde vragen. Kom je er niet uit, mail dan naar **app@nexora.example** of bel de servicedesk via **+31 20 555 0199**.',
      },
      { type: 'links', title: 'Handige links', items: [{ label: 'Veelgestelde vragen', url: '/pages/faq' }] },
    ],
  },
  {
    slug: 'legal',
    section: 'general',
    icon: 'scale',
    title: { nl: 'Juridische documenten', en: 'Legal documents', de: 'Rechtliche Dokumente' },
    blocks: [
      { type: 'heading', text: 'Privacyverklaring' },
      {
        type: 'text',
        text: 'myNexora verwerkt alleen de gegevens die nodig zijn om de app te laten werken: je naam, functie, vestiging en de berichten en reacties die je plaatst.\n\nDit is een **demo met fictieve gegevens**: alles wat je doet wordt alleen in je eigen browser bewaard.',
      },
      { type: 'heading', text: 'Gebruiksvoorwaarden' },
      {
        type: 'text',
        text: '- Wees respectvol in berichten, reacties en chats\n- Deel geen vertrouwelijke klantgegevens\n- Meld ongepaste inhoud bij de redactie',
      },
    ],
  },
  {
    slug: 'user-info',
    section: 'general',
    icon: 'file-text',
    title: { nl: 'Informatie voor de gebruiker', en: 'Information for users', de: 'Informationen für Nutzer' },
    blocks: [
      { type: 'heading', text: 'Over deze app' },
      {
        type: 'text',
        text: 'myNexora is de app voor alle medewerkers van Nexora. Je vindt er nieuws, informatie over de organisatie en je collega’s.\n\nDit is een **demo met fictieve gegevens**. Alle namen, berichten en documenten zijn verzonnen.',
      },
      { type: 'files', title: 'Documenten', documentIds: ['house-rules'] },
    ],
  },
]

export const seedPages = (now: number): Page[] =>
  pageSeeds(now).map((p, i) => ({
    id: `pg-${p.slug}`,
    slug: p.slug,
    section: p.section,
    icon: p.icon,
    title: p.title,
    blocks: { nl: withIds(p.slug, p.blocks), ...(p.blocksEn ? { en: withIds(`${p.slug}-en`, p.blocksEn) } : {}) },
    updatedAt: now - (i + 1) * 86_400_000,
    updatedBy: userId(14),
    history: [],
  }))
