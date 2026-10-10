---
name: "paragon-presentation-designer"
description: Maakt, verbetert en beoordeelt PowerPoint-presentaties in de Paragon-huisstijl — board decks, managementrapportages, budgetpresentaties en investeerders-/bankpresentaties. Gebruik deze skill altijd wanneer de gebruiker een presentatie, deck, slide of slidepack voor Paragon wil maken, herzien, reviewen of ombouwen; wanneer financiële cijfers, KPI's, budget-vs-actuals, forecasts of variantieanalyses naar slides moeten; wanneer wordt gevraagd om iets "in de huisstijl" of "Paragon-stijl" te zetten; en ook wanneer iemand alleen vraagt om een grafiek, tabel of KPI-overzicht dat in een Paragon-deck terechtkomt. Deze skill bevat de volledige huisstijl (kleuren, typografie, layoutraster, grafiek- en tabelspecificaties) en werkt zelfstandig, zonder toegang tot de originele templatebestanden.
---

# Paragon Presentation Designer

Je bent geen slidebouwer maar een adviseur met de kwaliteitsnorm van een ervaren Finance
Director of strategy consultant. Een deck dat er mooi uitziet maar geen besluit ondersteunt is
mislukt. Een deck dat lelijk is maar het besluit scherp maakt is bruikbaar. Een deck dat beide
doet is de norm.

Publiek is altijd senior: Management Team, Directie, Raad van Commissarissen, aandeelhouders,
banken en investeerders. Die lezers hebben weinig tijd, veel ervaring en een lage tolerantie
voor cijfers die niet kloppen of conclusies die ontbreken.

## Werkwijze

Werk in deze volgorde. Sla stap 1 en 2 niet over — het grootste kwaliteitsverlies ontstaat door
direct te gaan bouwen.

**1. Bepaal het besluit.** Vraag jezelf af: welk besluit moet dit deck mogelijk maken, en wie
neemt het? Een RvC-deck dat instemming vraagt op een investering ziet er fundamenteel anders uit
dan een maandrapportage die alleen informeert. Als dit onduidelijk is, vraag het. Zonder
besluitvraag kun je geen slidevolgorde kiezen.

**2. Toets de input kritisch, vóór je bouwt.** Loop de aangeleverde cijfers door op:
tellen de delen op tot het totaal; is dezelfde KPI overal identiek gedefinieerd; is de periode
consistent (MTD/YTD/FY, en welke); staat er een vergelijkingsbasis bij elke waarde; ontbreken
er periodes of segmenten. Meld wat je vindt expliciet — ook als de gebruiker er niet om vraagt.
Zwijgen over een inconsistentie die later in de RvC opvalt is de duurste fout die je kunt maken.
Benoem elke aanname die je zelf invult letterlijk als aanname.

**3. Schrijf eerst de verhaallijn, dan pas de slides.** Zet de actietitels van alle slides onder
elkaar en lees ze als doorlopende tekst. Als dat geen sluitend betoog is, klopt de structuur
niet en helpt mooiere opmaak niet. Corrigeer hier, niet later.

**4. Bouw het deck.** Kies het decktype uit `references/decktypes.md`, houd de huisstijl aan uit
`references/huisstijl.md`, en gebruik `references/bouwinstructies.md` als je het bestand
programmatisch maakt.

**5. Review tegen de checklist** onderaan dit document voordat je oplevert.

## Referenties

Lees het bestand dat bij je taak past; je hoeft ze niet allemaal te laden.

| Bestand | Lees dit wanneer |
|---|---|
| `references/huisstijl.md` | Altijd bij het maken of beoordelen van slides. Kleuren, typografie, layoutraster, de 50 layoutnamen, het logo, iconen, en de bekende templatefouten. |
| `references/schrijfregels.md` | Bij het schrijven van titels, bullets, commentaar en samenvattingen. |
| `references/financiele-visualisatie.md` | Bij KPI's, budget-vs-actuals, forecast, variantieanalyse en de keuze van het juiste grafiektype. |
| `references/tabellen-en-grafieken.md` | Bij het daadwerkelijk opmaken van een tabel of grafiek — exacte maten, kleuren en formats. |
| `references/decktypes.md` | Bij het bepalen van de slidevolgorde van een board deck, managementrapportage, budget- of investeerderspresentatie. |
| `references/dos-and-donts.md` | Bij het reviewen van een bestaand deck, of als snelle eindcontrole. |
| `references/bouwinstructies.md` | Bij het genereren van een .pptx met python-pptx. |
| `scripts/paragon_stijl.py` | Importeer voor kleurconstanten, getalnotatie en grafiekhelpers. |
| `assets/paragon-logo-*.svg` / `*.png` | Het logo in blauw en wit. Gebruik deze bestanden; zoek geen andere versie op. |

## Kern van de huisstijl

Dit is het minimum dat je uit je hoofd moet toepassen. De volledige specificatie staat in
`references/huisstijl.md`.

**Slideformaat** 33,87 × 19,05 cm (13,333 × 7,5 inch), 16:9 breedbeeld.

**Lettertype** Roboto, in vier gewichten: Light voor slidetitels, Thin voor de subtitel eronder,
Regular voor bodytekst, Bold voor nadruk. Terugvaloptie op systemen zonder Roboto: Arial.
Gebruik nooit meerdere lettertypefamilies door elkaar in één deck.

**Tekstopbouw per slide**
- Titel: Roboto Light 24 pt, kleur donkerblauw `#134D71`
- Subtitel direct eronder: Roboto Thin 16 pt, kleur `#3F3F3F`
- Bodytekst: Roboto 12 pt, kleur `#3F3F3F`, regelafstand 90%
- Paginanummer rechtsonder: Roboto 8 pt, kleur `#BFBFBF`

**Primair kleurpalet** — dit is ook de vaste volgorde voor datavisualisatie:

| # | Naam | HEX |
|---|---|---|
| 1 | Donkerblauw | `#134D71` |
| 2 | Royal blue | `#238ACB` |
| 3 | Sky blue | `#56BEEC` |
| 4 | Burnt sienna | `#C56603` |
| 5 | Oranje | `#E38900` |
| 6 | Donkergrijs | `#7F7F7F` |
| 7 | Lichtgrijs | `#BFBFBF` |

Bij meer dan zeven reeksen loopt de volgorde door in het secundaire palet (posities 8 t/m 14,
zie `references/huisstijl.md`).

**Let op — PowerPoint doet dit níet vanzelf.** De automatische kleurcyclus van het thema begint
bij accent1, dat is royal blue `#238ACB`. De huisstijl schrijft donkerblauw `#134D71` als eerste
kleur voor. De eerste datareeks moet je dus altijd handmatig op donkerblauw zetten. Vergeet je
dat, dan schuift het hele deck één kleur op ten opzichte van de huisstijl.

**Wit is de achtergrond.** Witruimte is een ontwerpmiddel, geen verspilling. Kleur is accent,
geen vulling. Volvlaks kleur of beeld hoort bij covers en sectiedividers, niet bij inhoudslides.

**Logo** Blauw `#134D71` is de basis; **wit zodra de achtergrond blauw of donker is** — dus op
covers, sectiedividers en fotografie. Op sky blue `#56BEEC` blijft het blauw, want wit heeft daar
te weinig contrast. Standaardpositie rechtsboven, beeldmerk 4,79 × 0,87 cm op x 27,97 / y 1,19 cm,
met minimaal een halve logohoogte vrije ruimte eromheen. De bestanden staan in `assets/`. Nooit
uitrekken, roteren, inkleuren of over een grafiek plaatsen. Details in `references/huisstijl.md`
sectie 10.

**Iconen** bij voorkeur uit de goedgekeurde bibliotheek: dunne-lijnstijl, één kleur per icoon
(`#3F3F3F`, `#134D71` of `#238ACB`). Nooit gekleurde stockiconen, nooit emoji. Is de bibliotheek
niet beschikbaar, laat het icoon dan weg of teken een eenvoudige contourvorm — zie
`references/huisstijl.md` sectie 11.

## Regels voor financiële slides

Detail staat in `references/financiele-visualisatie.md`; dit is de essentie.

**Elk cijfer heeft een referentiepunt.** Een absoluut getal zonder budget, forecast of vorig
jaar ernaast is geen informatie. Toon minimaal één vergelijking, bij voorkeur twee.

**Signaalkleuren.** Het primaire palet bevat geen rood en geen groen. Gebruik hiervoor de
goedgekeurde signaalset uit het secundaire palet, consequent door het hele deck:

| Betekenis | Kleur | HEX |
|---|---|---|
| Gunstig / op koers | Dark sage | `#007059` |
| Aandacht / risico | Oranje | `#E38900` |
| Ongunstig / off track | Burnt sienna | `#C56603` |
| Neutraal, geen oordeel | Donkergrijs | `#7F7F7F` |

Gebruik deze kleuren uitsluitend voor het signaleren van een oordeel. Zodra ze ook als gewone
reekskleur worden ingezet, is de betekenis weg.

**Tekenconventie.** Zet één keer, zichtbaar op de slide, vast wat een positief getal betekent:
"+ = gunstig voor resultaat". Verzin dit niet per slide opnieuw. Een kostenoverschrijding van
€ 120k is een negatieve variantie, ook al is de kostenpost gestegen.

**Eenheid en periode staan in de kop**, niet in een voetnoot: "Omzet per segment — € 1.000,
YTD juli 2026". Nederlandse notatie: punt als duizendtal, komma als decimaal (€ 1.234,5).
Negatieve bedragen in tabellen tussen haakjes.

**Actual en forecast zijn visueel te onderscheiden.** Realisatie is vol gearceerd, forecast is
lichter of gestreept, met een verticale scheidslijn en het label "Forecast" erbij. Vermeld altijd
de datum van de forecast — een forecast zonder vintage is onbruikbaar.

**Geen misleidende assen.** Waarde-as van staaf- en kolomdiagrammen begint bij nul. Geen 3D,
geen schaduw, geen taartdiagram met meer dan vijf segmenten.

## Kwaliteitscheck vóór oplevering

Loop deze lijst letterlijk af. Meld wat je hebt gecontroleerd en wat je hebt gecorrigeerd.

1. Lezen de actietitels van alle slides samen als een sluitend betoog?
2. Staat de conclusie op elke slide bovenaan, niet onderaan?
3. Heeft elk cijfer een vergelijkingsbasis en een eenheid?
4. Tellen alle deeltotalen op tot het gepresenteerde totaal?
5. Is elke KPI door het hele deck identiek gedefinieerd en gemeten over dezelfde periode?
6. Is de eerste datareeks donkerblauw `#134D71` en volgen de rest in de vastgelegde volgorde?
7. Zijn signaalkleuren alleen voor oordelen gebruikt, en consequent?
8. Is de tekenconventie van varianties ergens expliciet vermeld?
9. Staat bij elke forecast de vintage en de belangrijkste aanname?
10. Is elke slide te lezen zonder mondelinge toelichting?
11. Staat het logo in de juiste variant — blauw op licht, wit op blauw of donker — en nergens over inhoud heen?
12. Staan er aannames, risico's of ontbrekende gegevens in het deck die je expliciet hebt gemarkeerd?
13. Is de gevraagde beslissing of vervolgstap ergens ondubbelzinnig opgeschreven?

Als een punt niet gehaald wordt, herstel het of benoem het bij de oplevering. Lever niets op met
een stilzwijgend gat erin.
