import type { Lang, PostContent } from '../types'

type Translations<T> = Record<Exclude<Lang, 'nl'>, T>

/**
 * Hand-written English and German versions of the seed posts, keyed by post id.
 * They stand in for a translation service: with a real backend these would be
 * produced by machine translation (see src/lib/translate.ts).
 */
export const POST_TRANSLATIONS: Record<string, Translations<PostContent>> = {
  p01: {
    en: {
      title: 'Cycling along the Amstel: 62 kilometres and one flat tyre',
      intro: 'Fourteen colleagues, one shared lunch and a tyre change in record time. A look back at our Sunday ride.',
      body: [
        'At nine on Sunday morning, fourteen colleagues gathered at our Amsterdam office for the annual Amstel ride. The weather played along: sunshine, little wind and just the right temperature for cycling.',
        'After twenty kilometres Tim got a flat tyre. Within four minutes he was back on the pedals — a new record according to the mechanics present. Halfway we stopped at a farm for apple pie and fresh orange juice.',
        'Next month a ride through the dunes is on the schedule. Keep an eye on this channel to sign up!',
      ],
    },
    de: {
      title: 'Radtour entlang der Amstel: 62 Kilometer und ein Platten',
      intro: 'Vierzehn Kolleginnen und Kollegen, ein gemeinsames Mittagessen und ein Reifenwechsel in Rekordzeit. Ein Rückblick auf unsere Sonntagstour.',
      body: [
        'Am Sonntagmorgen um neun trafen sich vierzehn Kolleginnen und Kollegen an unserem Büro in Amsterdam zur jährlichen Amstel-Tour. Das Wetter spielte mit: Sonne, wenig Wind und genau die richtige Temperatur zum Radfahren.',
        'Nach zwanzig Kilometern hatte Tim einen Platten. Innerhalb von vier Minuten saß er wieder im Sattel — laut den anwesenden Mechanikern ein neuer Rekord. Auf halber Strecke machten wir auf einem Bauernhof Halt für Apfelkuchen und frischen Orangensaft.',
        'Nächsten Monat steht eine Tour durch die Dünen auf dem Programm. Behalte diesen Kanal für die Anmeldung im Blick!',
      ],
    },
  },
  p02: {
    en: {
      title: 'The great Nexora bake-off: meet the winners',
      intro: 'Twenty-two cakes, one very strict jury and a lemon tart that amazed everyone.',
      body: [
        'On Friday afternoon the Amsterdam canteen turned into a bakery. No fewer than twenty-two colleagues entered the first Nexora bake-off.',
        'The jury judged on taste, looks and originality. The winner was Amira with her lemon meringue tart. The audience award went to Lars, who had made a bicycle out of marzipan — luggage rack included.',
        'The recipe of the winning tart is now pinned on the board next to the coffee machine. Same time next year?',
      ],
    },
    de: {
      title: 'Das große Nexora-Backfest: Das sind die Gewinner',
      intro: 'Zweiundzwanzig Kuchen, eine sehr strenge Jury und eine Zitronentarte, die alle begeistert hat.',
      body: [
        'Am Freitagnachmittag verwandelte sich die Kantine in Amsterdam in eine Bäckerei. Ganze zweiundzwanzig Kolleginnen und Kollegen machten beim ersten Nexora-Backfest mit.',
        'Die Jury bewertete Geschmack, Aussehen und Originalität. Gewonnen hat Amira mit ihrer Zitronen-Baiser-Tarte. Der Publikumspreis ging an Lars, der ein Fahrrad aus Marzipan gebaut hatte — samt Gepäckträger.',
        'Das Rezept der Siegertarte hängt jetzt an der Pinnwand neben dem Kaffeeautomaten. Nächstes Jahr wieder?',
      ],
    },
  },
  p03: {
    en: {
      title: 'Quarterly update: the new cargo bike is on its way',
      intro: 'A short look back at the past quarter and a peek behind the scenes of our newest model.',
      body: [
        'Last quarter we sold more bikes than ever, especially in Copenhagen and Barcelona. Thanks to everyone who worked so hard for it.',
        'The design and engineering team is in the final testing phase of our new cargo bike. The first ones will be on the road in spring, and you get to try it out first.',
        'Do you have questions about our plans? Ask them via Ask the management in the app. We will answer them in the next update.',
      ],
    },
    de: {
      title: 'Quartalsupdate: Das neue Lastenrad kommt',
      intro: 'Ein kurzer Rückblick auf das letzte Quartal und ein Blick hinter die Kulissen unseres neuesten Modells.',
      body: [
        'Im letzten Quartal haben wir mehr Fahrräder verkauft als je zuvor, vor allem in Kopenhagen und Barcelona. Danke an alle, die dafür hart gearbeitet haben.',
        'Das Design- und Engineering-Team steckt in der letzten Testphase unseres neuen Lastenrads. Im Frühjahr sind die ersten Exemplare unterwegs, und ihr dürft es als Erste ausprobieren.',
        'Hast du Fragen zu unseren Plänen? Stell sie über „Frag die Geschäftsführung“ in der App. Wir beantworten sie im nächsten Update.',
      ],
    },
  },
  p04: {
    en: {
      title: 'Meet Pip, office dog of the month',
      intro: 'Pip is three, loves tennis balls and by now has more followers than our marketing team.',
      body: [
        'Every month we put one of our office dogs in the spotlight. This month it is Pip, Ayoub’s border collie.',
        'Pip comes along to Amsterdam on Tuesdays and Thursdays. He knows exactly who keeps biscuits in their drawer and guards the bike shed with great dedication.',
        'Do you also have an office pet that deserves the spotlight? Send a photo to the editorial team!',
      ],
    },
    de: {
      title: 'Darf ich vorstellen: Pip, Bürohund des Monats',
      intro: 'Pip ist drei, liebt Tennisbälle und hat inzwischen mehr Follower als unser Marketingteam.',
      body: [
        'Jeden Monat stellen wir einen unserer Bürohunde vor. Diesen Monat ist es Pip, der Border Collie von Ayoub.',
        'Pip kommt dienstags und donnerstags mit nach Amsterdam. Er weiß genau, wer Kekse in der Schublade hat, und bewacht den Fahrradkeller mit großer Hingabe.',
        'Hast du auch ein Bürotier, das ins Rampenlicht gehört? Schick ein Foto an die Redaktion!',
      ],
    },
  },
  p05: {
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
  p06: {
    en: {
      title: 'Rooftop vegetable garden: the first harvest is in',
      intro: 'Tomatoes, basil and a surprisingly large pumpkin. Our rooftop garden in Amsterdam is a success.',
      body: [
        'In spring, volunteers planted a vegetable garden on the roof of our Amsterdam office. This week was the first harvest: twelve kilos of tomatoes, heaps of basil and one pumpkin of almost eight kilos.',
        'The vegetables went to the canteen, where the cook turned them into a delicious soup. For now the pumpkin sits at reception as our mascot.',
        'Want to help in the garden? Every Wednesday at lunchtime there is weeding and watering.',
      ],
    },
    de: {
      title: 'Gemüsegarten auf dem Dach: Die erste Ernte ist da',
      intro: 'Tomaten, Basilikum und ein überraschend großer Kürbis. Unser Dachgarten in Amsterdam ist ein Erfolg.',
      body: [
        'Im Frühjahr haben Freiwillige auf dem Dach unseres Büros in Amsterdam einen Gemüsegarten angelegt. Diese Woche war die erste Ernte: zwölf Kilo Tomaten, Berge von Basilikum und ein Kürbis von fast acht Kilo.',
        'Das Gemüse ging an die Kantine, wo der Koch eine köstliche Suppe daraus gemacht hat. Der Kürbis steht vorerst als Maskottchen am Empfang.',
        'Möchtest du im Garten mithelfen? Jeden Mittwoch in der Mittagspause wird gejätet und gegossen.',
      ],
    },
  },
  p07: {
    en: {
      title: 'Pub quiz: Engineering wins (again)',
      intro: 'Forty questions, eight teams and one deciding question about the highest mountain in Denmark.',
      body: [
        'On Thursday evening eight teams competed for the coveted golden bike bell. It was an exciting evening with questions about music, sport, history and — of course — bikes.',
        'After forty questions Engineering and Customer Care were tied. The tie-breaker decided it: who knew how high the highest mountain in Denmark is? Engineering was only one metre off.',
        'The rematch is already planned for after the summer.',
      ],
    },
    de: {
      title: 'Pubquiz: Engineering gewinnt (schon wieder)',
      intro: 'Vierzig Fragen, acht Teams und eine entscheidende Frage zum höchsten Berg Dänemarks.',
      body: [
        'Am Donnerstagabend kämpften acht Teams um die begehrte goldene Fahrradklingel. Es wurde ein spannender Abend mit Fragen zu Musik, Sport, Geschichte und — natürlich — Fahrrädern.',
        'Nach vierzig Fragen lagen Engineering und Customer Care gleichauf. Die Schätzfrage entschied: Wer wusste, wie hoch der höchste Berg Dänemarks ist? Engineering lag nur einen Meter daneben.',
        'Die Revanche ist schon für nach dem Sommer geplant.',
      ],
    },
  },
  p08: {
    en: {
      title: 'Nexora at the Copenhagen bike fair',
      intro: 'Three days, thousands of visitors and a stand where the test rides were in constant demand.',
      body: [
        'At the big bike fair in Copenhagen we had our own stand for three days. Visitors could test our newest models on a track outside the hall.',
        'The city bike in the new colour “fjord blue” was especially popular. The Copenhagen team made dozens of new contacts with bike shops.',
      ],
    },
    de: {
      title: 'Nexora auf der Fahrradmesse in Kopenhagen',
      intro: 'Drei Tage, Tausende Besucher und ein Stand, an dem die Probefahrten heiß begehrt waren.',
      body: [
        'Auf der großen Fahrradmesse in Kopenhagen waren wir drei Tage lang mit einem eigenen Stand vertreten. Besucher konnten unsere neuesten Modelle auf einem Parcours vor der Halle testen.',
        'Besonders beliebt war das Stadtrad in der neuen Farbe „Fjordblau“. Das Team aus Kopenhagen hat Dutzende neue Kontakte zu Fahrradläden geknüpft.',
      ],
    },
  },
  p09: {
    en: {
      title: 'Book club is looking for new members',
      intro: 'One book a month, one evening of talking and always something tasty. Will you read along?',
      body: [
        'Our book club has been going for two years now and is looking for new members. We read all sorts: novels, thrillers, non-fiction and the occasional comic book.',
        'We meet once a month, alternating between the office and online, so colleagues from Antwerp, Copenhagen and Barcelona can join too.',
        'Interested? Send Greta a message in the chat.',
      ],
    },
    de: {
      title: 'Buchclub sucht neue Mitglieder',
      intro: 'Jeden Monat ein Buch, ein Abend zum Reden und immer etwas Leckeres dazu. Liest du mit?',
      body: [
        'Unseren Buchclub gibt es inzwischen seit zwei Jahren, und er sucht neue Mitglieder. Wir lesen alles Mögliche: Romane, Thriller, Sachbücher und ab und zu einen Comic.',
        'Wir treffen uns einmal im Monat, abwechselnd im Büro und online, damit auch Kolleginnen und Kollegen aus Antwerpen, Kopenhagen und Barcelona mitmachen können.',
        'Interesse? Schick Greta eine Nachricht im Chat.',
      ],
    },
  },
  p10: {
    en: {
      title: 'Watch out: phishing emails going around',
      intro: 'We are seeing more fake emails pretending to come from parcel services. Here is how to spot them.',
      body: [
        'In recent days several colleagues received emails about a “parcel that could not be delivered”. These emails are fake and try to steal your login details.',
        'In doubt? Do not click any links, but report the email with the “Report phishing” button in your mail program. The IT team will then take a look.',
      ],
    },
    de: {
      title: 'Achtung: Phishing-Mails im Umlauf',
      intro: 'Wir sehen mehr gefälschte Mails, die sich als Paketdienste ausgeben. So erkennst du sie.',
      body: [
        'In den letzten Tagen haben mehrere Kolleginnen und Kollegen Mails über ein „Paket, das nicht zugestellt werden konnte“ bekommen. Diese Mails sind gefälscht und wollen deine Zugangsdaten stehlen.',
        'Unsicher? Klick auf keine Links, sondern melde die Mail über die Schaltfläche „Phishing melden“ in deinem Mailprogramm. Das IT-Team schaut sie sich dann an.',
      ],
    },
  },
  p11: {
    en: {
      title: 'Paella workshop in Barcelona: recipe included',
      intro: 'The Barcelona team learned from a real chef how to make the perfect paella. We are happy to share the recipe.',
      body: [
        'On the roof terrace of our Barcelona office, chef Rosa gave a paella workshop for twenty colleagues. The secret? Do not stir, and be patient for the crispy bottom.',
        'The result was eaten with a view over the city. From today the recipe is on the People & culture page.',
      ],
    },
    de: {
      title: 'Paella-Workshop in Barcelona: Rezept inklusive',
      intro: 'Das Team in Barcelona hat von einer echten Köchin gelernt, wie die perfekte Paella gelingt. Das Rezept teilen wir gern.',
      body: [
        'Auf der Dachterrasse unseres Büros in Barcelona gab Köchin Rosa einen Paella-Workshop für zwanzig Kolleginnen und Kollegen. Das Geheimnis? Nicht umrühren und Geduld für den knusprigen Boden.',
        'Gegessen wurde mit Blick über die Stadt. Das Rezept steht ab heute auf der Seite Menschen & Kultur.',
      ],
    },
  },
  p12: {
    en: {
      title: 'Send in your favourite song for the workshop playlist',
      intro: 'The music is always on in the Eindhoven workshop. Which song should not be missing?',
      body: [
        'Our colleagues in the workshop prefer to work with music. That is why we are making a Nexora playlist together.',
        'Reply below this post with your favourite song. At the end of the month we will put the list online so everyone can listen to it.',
      ],
    },
    de: {
      title: 'Schick deinen Lieblingssong für die Werkstatt-Playlist',
      intro: 'In der Werkstatt in Eindhoven läuft immer Musik. Welcher Song darf nicht fehlen?',
      body: [
        'Unsere Kolleginnen und Kollegen in der Werkstatt arbeiten am liebsten mit Musik. Deshalb erstellen wir gemeinsam eine Nexora-Playlist.',
        'Antworte unter diesem Beitrag mit deinem Lieblingssong. Am Monatsende stellen wir die Liste online, damit alle sie anhören können.',
      ],
    },
  },
  p13: {
    en: {
      title: 'New bike shed at the Málaga office',
      intro: 'Forty spaces, chargers for e-bikes and finally a roof against the (rare) rain.',
      body: [
        'Since Monday our Málaga office has a covered bike shed with forty spaces. Twelve of them have a charger for e-bikes.',
        'You get in with your staff pass. Please do not leave your bike for longer than a week, so there is room for everyone.',
      ],
    },
    de: {
      title: 'Neuer Fahrradkeller am Büro in Málaga',
      intro: 'Vierzig Plätze, Ladepunkte für E-Bikes und endlich ein Dach gegen den (seltenen) Regen.',
      body: [
        'Seit Montag hat unser Büro in Málaga einen überdachten Fahrradabstellplatz mit vierzig Plätzen. Zwölf davon haben einen Ladepunkt für E-Bikes.',
        'Du kommst mit deinem Mitarbeiterausweis hinein. Lass dein Rad bitte nicht länger als eine Woche stehen, damit für alle Platz bleibt.',
      ],
    },
  },
  p14: {
    en: {
      title: 'Save the date: the Nexora summer party',
      intro: 'Music, a bike course and food from all four countries. Put the date in your calendar now.',
      body: [
        'This year we celebrate summer at all sites at once: a party at every location, with a live link between the offices.',
        'The programme and registration will follow in the app soon.',
      ],
    },
    de: {
      title: 'Save the Date: das Nexora-Sommerfest',
      intro: 'Musik, ein Radparcours und Essen aus allen vier Ländern. Trag dir den Termin schon mal ein.',
      body: [
        'Dieses Jahr feiern wir den Sommer an allen Standorten gleichzeitig: ein Fest an jedem Standort, mit Live-Schaltung zwischen den Büros.',
        'Programm und Anmeldung folgen bald in der App.',
      ],
    },
  },
}

/** English and German versions of the seed comments, keyed by their Dutch text. */
export const COMMENT_TRANSLATIONS: Record<string, Translations<string>> = {
  'Wat een mooie route! Volgende keer ben ik er zeker bij.': {
    en: 'What a lovely route! I am definitely joining next time.',
    de: 'Was für eine schöne Strecke! Nächstes Mal bin ich auf jeden Fall dabei.',
  },
  'Top, we rekenen op je! 🙌': {
    en: 'Great, we are counting on you! 🙌',
    de: 'Super, wir zählen auf dich! 🙌',
  },
  'Dank voor de organisatie, dit was echt een topdag.': {
    en: 'Thanks for organising, this was a really great day.',
    de: 'Danke für die Organisation, das war ein richtig toller Tag.',
  },
  'Vier minuten voor een band wisselen, Tim is een held 😅': {
    en: 'Four minutes to change a tyre, Tim is a hero 😅',
    de: 'Vier Minuten für einen Reifenwechsel, Tim ist ein Held 😅',
  },
  'Die marsepeinen fiets verdient een plek in de showroom!': {
    en: 'That marzipan bike deserves a spot in the showroom!',
    de: 'Das Marzipan-Fahrrad verdient einen Platz im Showroom!',
  },
  'Hij is helaas al opgegeten 😄': {
    en: 'Unfortunately it has already been eaten 😄',
    de: 'Leider ist es schon aufgegessen 😄',
  },
  'Leuk dat we de bakfiets als eersten mogen testen. Wanneer kunnen we ons inschrijven?': {
    en: 'Nice that we get to test the cargo bike first. When can we sign up?',
    de: 'Schön, dass wir das Lastenrad als Erste testen dürfen. Wann können wir uns anmelden?',
  },
  'Pip is de beste collega van de verdieping 🐶': {
    en: 'Pip is the best colleague on the floor 🐶',
    de: 'Pip ist der beste Kollege auf der Etage 🐶',
  },
  'Ziet er strak uit! Werkt de donkere modus ook op desktop?': {
    en: 'Looks sleek! Does dark mode work on desktop too?',
    de: 'Sieht schick aus! Funktioniert der Dunkelmodus auch am Desktop?',
  },
  'Zeker, kijk maar bij Instellingen → Weergave.': {
    en: 'Sure, have a look at Settings → Appearance.',
    de: 'Klar, schau mal unter Einstellungen → Darstellung.',
  },
  'Kunnen we ook een daktuin in Málaga beginnen? Genoeg zon hier ☀️': {
    en: 'Could we start a rooftop garden in Málaga too? Plenty of sun here ☀️',
    de: 'Können wir auch in Málaga einen Dachgarten anlegen? Sonne gibt es hier genug ☀️',
  },
}
