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

const PAGES: PageSeed[] = [
  // Divisions
  {
    slug: 'communicate',
    section: 'division',
    icon: 'mail',
    title: { nl: 'Nexora Communicate', en: 'Nexora Communicate', de: 'Nexora Communicate' },
    blocks: [
      { type: 'hero', title: 'Nexora Communicate', subtitle: 'Communicatie werkt pas echt als ze persoonlijk is.', tone: 'navy' },
      {
        type: 'text',
        text: 'Nexora Communicate verzorgt alle fysieke en digitale klantcommunicatie van onze klanten: van het voorbereiden van data en het opmaken van documenten tot het printen, versturen en digitaal afleveren.\n\nZo helpen we energieleveranciers, verzekeraars en gemeenten om hun klanten en inwoners helder, veilig en persoonlijk te informeren.',
      },
      { type: 'heading', text: 'Wat we doen' },
      {
        type: 'text',
        text: '- **Datavoorbereiding** en documentcreatie\n- **Print en verzending** van gepersonaliseerde poststukken\n- **Digitale levering** via e-mail, portaal en sms\n- **Archivering** en rapportage',
      },
      { type: 'feed', title: 'Nieuws uit Operations', channelId: 'c-ops', limit: 2 },
    ],
  },
  {
    slug: 'process',
    section: 'division',
    icon: 'workflow',
    title: { nl: 'Nexora Process', en: 'Nexora Process', de: 'Nexora Process' },
    blocks: [
      { type: 'hero', title: 'Nexora Process', subtitle: 'Efficiëntie met oog voor de mens.', tone: 'sky' },
      {
        type: 'text',
        text: 'Backoffice-werk bestaat vaak uit een mix van handmatige taken en deels geautomatiseerde processen. Nexora Process neemt die administratieve processen uit handen: soms zoals ze zijn, soms slimmer ingericht met automatisering.\n\nZo kunnen onze klanten zich richten op wat echt belangrijk is: hun eigen klanten.',
      },
      {
        type: 'steps',
        title: 'Zo werken we',
        steps: [
          { title: 'Analyseren', text: 'We brengen het huidige proces en de knelpunten in kaart.' },
          { title: 'Inrichten', text: 'We richten het proces opnieuw in en automatiseren waar het kan.' },
          { title: 'Uitvoeren', text: 'Ons team voert het proces uit volgens vaste afspraken.' },
          { title: 'Verbeteren', text: 'We rapporteren en verbeteren continu.' },
        ],
      },
    ],
  },
  {
    slug: 'logistics',
    section: 'division',
    icon: 'package',
    title: { nl: 'Nexora Logistics', en: 'Nexora Logistics', de: 'Nexora Logistics' },
    blocks: [
      { type: 'hero', title: 'Nexora Logistics', subtitle: 'Logistieke uitdagingen snel en strak geregeld.', tone: 'sage' },
      {
        type: 'text',
        text: 'Van opslag en orderpicking tot verpakken en verzenden: Nexora Logistics regelt fulfilment voor webshops, merken en organisaties. We leveren geen pakketjes, we leveren een merkbeleving.',
      },
      {
        type: 'callout',
        title: 'Sectoren',
        text: 'Food & beverage, gezondheid, telecom, cosmetica, goede doelen, publieke sector en abonnementen.',
        tone: 'sage',
      },
      { type: 'links', title: 'Links', items: [{ label: 'Meer over fulfilment (voorbeeldlink)', url: 'https://example.com/fulfilment' }] },
    ],
  },

  // Company
  {
    slug: 'strategy',
    section: 'company',
    icon: 'compass',
    title: { nl: 'Strategie', en: 'Strategy', de: 'Strategie' },
    blocks: [
      { type: 'hero', title: 'Strategie', subtitle: 'Waar we naartoe gaan, en waarom.', tone: 'navy' },
      { type: 'image', image: { kind: 'artwork', seed: 31, palette: 'navy' }, caption: 'Nexora Central Europe' },
      {
        type: 'callout',
        title: 'Onze visie',
        text: 'Een toonaangevende partner worden in zakelijke dienstverlening, met diensten die groei, klantloyaliteit en efficiëntie mogelijk maken.',
        tone: 'navy',
      },
      {
        type: 'callout',
        title: 'Onze missie',
        text: 'Elke dag communicatie en processen leveren die kloppen, op tijd zijn en persoonlijk aanvoelen.',
        tone: 'sky',
      },
      { type: 'heading', text: 'Onze kernwaarden' },
      {
        type: 'text',
        text: '- **Betrouwbaar** — we doen wat we zeggen\n- **Samen** — over landen en afdelingen heen\n- **Vernieuwend** — we blijven verbeteren\n- **Verantwoordelijk** — voor klanten, collega’s en omgeving',
      },
    ],
    blocksEn: [
      { type: 'hero', title: 'Strategy', subtitle: 'Where we are heading, and why.', tone: 'navy' },
      { type: 'image', image: { kind: 'artwork', seed: 31, palette: 'navy' }, caption: 'Nexora Central Europe' },
      {
        type: 'callout',
        title: 'Our vision',
        text: 'To become a leading partner in business services that enable growth, customer loyalty and efficiency.',
        tone: 'navy',
      },
      {
        type: 'callout',
        title: 'Our mission',
        text: 'To deliver communication and processes every day that are correct, on time and feel personal.',
        tone: 'sky',
      },
      { type: 'heading', text: 'Our core values' },
      {
        type: 'text',
        text: '- **Reliable** — we do what we say\n- **Together** — across countries and departments\n- **Innovative** — we keep improving\n- **Responsible** — for customers, colleagues and our surroundings',
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
      { type: 'quote', text: 'Duurzaam verbonden. Slimmer communiceren.' },
      {
        type: 'text',
        text: 'Milieu, duurzaamheid en verantwoordelijkheid gaan bij Nexora hand in hand. Ze zijn onderdeel van onze manier van werken en verankerd in ons kwaliteitsmanagementsysteem.\n\nIn 2030 willen we onze CO₂-uitstoot ten opzichte van 2020 halveren.',
      },
      {
        type: 'steps',
        title: 'Waar we aan werken',
        steps: [
          { title: 'Energie', text: 'Zonnepanelen op onze eigen daken en groene stroom op alle locaties.' },
          { title: 'Papier', text: 'FSC-gecertificeerd papier en minder misdruk dankzij digitale printstraten.' },
          { title: 'Mobiliteit', text: 'Elektrische leaseauto’s en een fietsplan voor iedereen.' },
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
      { type: 'hero', title: 'Certificaten', subtitle: 'Kwaliteit en veiligheid, onafhankelijk getoetst.', tone: 'sky' },
      {
        type: 'text',
        text: 'Onze klanten vertrouwen ons hun data en communicatie toe. Daarom laten we onze processen jaarlijks toetsen door onafhankelijke partijen.',
      },
      { type: 'files', title: 'Documenten', documentIds: ['iso-27001'] },
      {
        type: 'accordion',
        title: 'Overzicht',
        items: [
          { question: 'ISO/IEC 27001', answer: 'Informatiebeveiliging. Geldt voor alle locaties in Central Europe.' },
          { question: 'ISO 9001', answer: 'Kwaliteitsmanagement. Geldt voor productie en fulfilment.' },
          { question: 'ISO 14001', answer: 'Milieumanagement. Geldt voor onze printcentra.' },
          { question: 'FSC', answer: 'Verantwoord papiergebruik in alle printcentra.' },
        ],
      },
    ],
  },

  // Stories (departments)
  {
    slug: 'customers',
    section: 'story',
    icon: 'handshake',
    title: { nl: 'Customers', en: 'Customers', de: 'Kunden' },
    blocks: [
      { type: 'hero', title: 'Customers', subtitle: 'Sales, accountmanagement en klantenservice.', tone: 'warm' },
      {
        type: 'text',
        text: 'Onze klantteams zijn het eerste aanspreekpunt voor onze klanten. Ze kennen hun wensen, denken mee over verbeteringen en zorgen dat afspraken worden nagekomen.',
      },
      { type: 'people', title: 'Contactpersonen', userIds: [userId(44), userId(40), userId(43)] },
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
        text: 'Wij zorgen voor de interne communicatie (zoals deze app), onze website, social media, beurzen en campagnes. Heb je nieuws dat je wilt delen? Laat het ons weten!',
      },
      { type: 'people', title: 'Het team', userIds: [userId(13), userId(14), userId(15), userId(16), userId(17)] },
      { type: 'feed', title: 'Bedrijfsnieuws', channelId: 'c-company', limit: 2 },
    ],
  },
  {
    slug: 'operations',
    section: 'story',
    icon: 'factory',
    title: { nl: 'Operations', en: 'Operations', de: 'Operations' },
    blocks: [
      { type: 'hero', title: 'Operations', subtitle: 'Productie, planning en kwaliteit.', tone: 'navy' },
      {
        type: 'text',
        text: 'Operations zorgt dat elke dag miljoenen poststukken, documenten en pakketten correct en op tijd hun bestemming bereiken.',
      },
      { type: 'feed', title: 'Operations @ Work', channelId: 'c-ops', limit: 3 },
    ],
  },
  {
    slug: 'it',
    section: 'story',
    icon: 'server',
    title: { nl: 'IT & Infrastructuur', en: 'IT & Infrastructure', de: 'IT & Infrastruktur' },
    blocks: [
      { type: 'hero', title: 'IT & Infrastructuur', subtitle: 'Veilig en betrouwbaar werken, overal.', tone: 'sky' },
      {
        type: 'text',
        text: 'Het IT-team beheert onze systemen, netwerken en werkplekken en helpt je verder via de servicedesk.\n\nProblemen met je laptop of een account? Meld het via de [servicedesk (voorbeeldlink)](https://example.com/servicedesk).',
      },
      { type: 'feed', title: 'IT & Innovatie', channelId: 'c-it', limit: 2 },
    ],
  },
  {
    slug: 'finance',
    section: 'story',
    icon: 'landmark',
    title: { nl: 'Finance', en: 'Finance', de: 'Finanzen' },
    blocks: [
      { type: 'image', image: { kind: 'artwork', seed: 47, palette: 'sky' } },
      { type: 'heading', text: 'Afdelingsomschrijving' },
      {
        type: 'text',
        text: 'Finance draagt op verschillende manieren bij aan een gezonde en betrouwbare financiële huishouding van Nexora. Onze werkzaamheden bestaan onder andere uit:\n\n- **Crediteurenadministratie:** verwerken en betalen van leveranciersfacturen\n- **Debiteurenadministratie:** facturatie, debiteurenbeheer en opvolging\n- **Rapportages en inzicht:** maandcijfers, KPI’s en managementinformatie\n- **Budget en forecast:** opstellen, bewaken en bijsturen van budgetten',
      },
      { type: 'heading', text: 'Wie doet wat?' },
      { type: 'text', text: 'Overzicht van onze afdeling, met per rol de belangrijkste taken en contactpersonen.' },
      { type: 'files', documentIds: ['finance-organogram'] },
      {
        type: 'steps',
        title: 'Proces inkoopfacturen',
        steps: [
          { title: 'Inkoopbehoefte', text: 'De budgethouder start een bestelling.' },
          { title: 'Inkooporder', text: 'Boven € 500 maak je een inkooporder in het ERP-systeem.' },
          { title: 'Goedkeuring', text: 'Volgens het tekenbevoegdhedenschema.' },
          { title: 'Levering', text: 'De leverancier levert met het ordernummer.' },
          { title: 'Matching', text: 'De factuur wordt automatisch gematcht met de order.' },
          { title: 'Betaling', text: 'Automatisch geboekt en betaald binnen de termijn.' },
        ],
      },
      { type: 'files', documentIds: ['purchase-process'] },
      { type: 'heading', text: 'Inzicht in openstaande facturen' },
      { type: 'links', items: [{ label: 'Factuurportaal (voorbeeldlink)', url: 'https://example.com/facturen' }] },
      {
        type: 'carousel',
        title: 'Finance @ Work',
        slides: [
          { image: { kind: 'artwork', seed: 51, palette: 'navy' }, title: 'Teamdag in Utrecht' },
          { image: { kind: 'artwork', seed: 52, palette: 'sky' }, title: 'Eerste maandafsluiting in het nieuwe ERP' },
          { image: { kind: 'artwork', seed: 53, palette: 'warm' }, title: 'Workshop budgetteren voor managers' },
        ],
      },
      { type: 'feed', title: 'Finance @ Life', channelId: 'c-finance', limit: 2 },
      { type: 'people', title: 'Contactpersonen', userIds: [userId(7), userId(8), userId(9)] },
    ],
  },
  {
    slug: 'hr',
    section: 'story',
    icon: 'users',
    title: { nl: 'Human Resources', en: 'Human Resources', de: 'Personal' },
    blocks: [
      { type: 'hero', title: 'Human Resources', subtitle: 'Voor alles rond werken bij Nexora.', tone: 'warm' },
      {
        type: 'accordion',
        title: 'Veelgestelde vragen',
        items: [
          { question: 'Hoe vraag ik verlof aan?', answer: 'Via het HR-portaal. Je leidinggevende keurt het verzoek goed.' },
          { question: 'Wanneer wordt mijn salaris betaald?', answer: 'Rond de 25e van de maand. Je loonstrook vind je in het HR-portaal.' },
          { question: 'Ik ben ziek, wat nu?', answer: 'Meld je vóór 9.00 uur telefonisch ziek bij je leidinggevende.' },
        ],
      },
      { type: 'people', title: 'HR-team', userIds: [userId(5), userId(50), userId(51), userId(53)] },
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
        text: 'De ondernemingsraad praat namens alle medewerkers mee over belangrijke besluiten, zoals reorganisaties, arbeidsomstandigheden en regelingen.\n\nHeb je een vraag of een punt voor de agenda? Neem contact op met een van de leden.',
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
    slug: 'user-info',
    section: 'general',
    icon: 'file-text',
    title: { nl: 'Informatie voor de gebruiker', en: 'Information for users', de: 'Informationen für Nutzer' },
    blocks: [
      { type: 'heading', text: 'Over deze app' },
      {
        type: 'text',
        text: 'myNexora is de app voor alle medewerkers van Nexora Central Europe. Je vindt er nieuws, informatie over de organisatie en je collega’s.\n\nDit is een **demo met fictieve gegevens**. Alle namen, berichten en documenten zijn verzonnen.',
      },
      { type: 'files', title: 'Documenten', documentIds: ['house-rules'] },
    ],
  },
]

export const seedPages = (now: number): Page[] =>
  PAGES.map((p, i) => ({
    id: `pg-${p.slug}`,
    slug: p.slug,
    section: p.section,
    icon: p.icon,
    title: p.title,
    blocks: { nl: withIds(p.slug, p.blocks), ...(p.blocksEn ? { en: withIds(`${p.slug}-en`, p.blocksEn) } : {}) },
    updatedAt: now - (i + 1) * 86_400_000,
    updatedBy: userId(14),
  }))
