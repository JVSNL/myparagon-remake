# Financiële visualisatie, KPI's, budget-vs-actuals en forecast

Dit bestand gaat over *wat* je toont en *waarom*. Voor de exacte opmaak van tabellen en grafieken:
zie `tabellen-en-grafieken.md`.

## Inhoud

1. Kies het juiste grafiektype
2. KPI's presenteren
3. Budget versus actuals
4. Variantieanalyse en de bridge
5. Forecast presenteren
6. Getalnotatie en conventies
7. Terugkerende slidevormen
8. Wat er standaard misgaat

---

## 1. Kies het juiste grafiektype

Kies op basis van de boodschap, niet op basis van wat er beschikbaar is.

| Boodschap | Grafiektype | Toelichting |
|---|---|---|
| Ontwikkeling over tijd, veel punten | Lijndiagram | Vanaf circa acht perioden; maximaal vier lijnen |
| Ontwikkeling over tijd, weinig punten | Kolomdiagram | Tot circa acht perioden; nul op de as |
| Vergelijking tussen categorieën | Staafdiagram (horizontaal) | Sorteer aflopend; horizontaal als de labels lang zijn |
| Actual versus budget per categorie | Gegroepeerd kolom- of staafdiagram | Maximaal twee reeksen; anders wordt het onleesbaar |
| Opbouw van een verschil | Waterval / bridge | Standaard voor variantieverklaring |
| Samenstelling op één moment | 100% gestapelde staaf | Beter dan een taartdiagram |
| Samenstelling over tijd | Gestapeld kolomdiagram | Maximaal vijf componenten |
| Aandeel, één simpele boodschap | Taartdiagram | Alleen bij maximaal vijf segmenten en één duidelijk punt |
| Voortgang naar een doel | Enkele voortgangsbalk of donut | Eén cijfer, groot |
| Twee variabelen tegen elkaar | Spreidingsdiagram | Zeldzaam in board decks; alleen bij een echt verband |
| Bandbreedte of scenario | Lijn met gearceerd vlak | Basisscenario als lijn, bandbreedte als vlak |
| Status per onderwerp | Statustabel met signaalkleur | Voor projectvoortgang en actielijsten |

**Vermijd altijd:** 3D-grafieken, dubbele y-assen (bijna altijd misleidend — gebruik twee
grafieken onder elkaar of indexeer naar 100), radardiagrammen, gestapelde grafieken waar het om
totalen gaat, en taartdiagrammen met meer dan vijf segmenten.

## 2. KPI's presenteren

**Elke KPI heeft vijf eigenschappen** die vastliggen voordat hij op een slide komt: definitie
(exacte formule), bron (systeem en rapport), eigenaar (wie is verantwoordelijk), frequentie
(hoe vaak gemeten) en doel (budget, norm of target). Ontbreekt er één, meld dat.

**De KPI-tegel.** Standaardopbouw, van boven naar beneden:

```
┌──────────────────────────────┐
│ Naam KPI              ▲       │   naam 10 pt, signaalpijl rechtsboven
│                              │
│ € 12,4 mln                   │   hoofdcijfer 28–32 pt bold, #134D71
│                              │
│ vs budget   +3,2%            │   vergelijkingen 9 pt, #7F7F7F
│ vs LY       +8,1%            │   waarde in signaalkleur
└──────────────────────────────┘
```

Regels:
- Maximaal zes tot acht tegels op één slide, in een raster van 3×2 of 4×2
- Altijd minimaal één vergelijking per tegel, bij voorkeur twee (budget én vorig jaar)
- De signaalkleur zit op de vergelijking, niet op het hoofdcijfer
- Een sparkline van de laatste twaalf perioden onderin de tegel voegt veel toe; houd hem
  eenkleurig `#7F7F7F` zonder assen
- Zet de tegels in vaste volgorde, elke periode dezelfde. Herordenen naar "wat er goed uitziet"
  ondermijnt vertrouwen

**Kies weinig KPI's.** Een MT-dashboard met twintig KPI's stuurt nergens op. Zes tot acht op de
hoofdpagina, de rest in de bijlage. Onderscheid daarbij:
- *Uitkomst-KPI's* (omzet, EBITDA, kasstroom) — vertellen wat er gebeurd is
- *Stuur-KPI's* (orderintake, pipeline-conversie, DSO, bezettingsgraad) — voorspellen wat er
  gaat gebeuren

Een board deck met alleen uitkomst-KPI's kijkt uitsluitend achteruit. Neem minstens twee
stuur-KPI's op.

## 3. Budget versus actuals

**Standaardtabel.** Deze kolomopbouw dekt vrijwel elke managementrapportage:

| Kolom | Toelichting |
|---|---|
| Post | Regelbenaming, links uitgelijnd |
| Actual periode | Realisatie huidige maand of kwartaal |
| Budget periode | Budget dezelfde periode |
| Δ | Absoluut verschil |
| Δ % | Procentueel verschil |
| Actual YTD | Cumulatief realisatie |
| Budget YTD | Cumulatief budget |
| Δ YTD | Absoluut verschil cumulatief |
| FY forecast | Actuele prognose heel jaar |
| FY budget | Budget heel jaar |
| Δ FY | Verwachte afwijking heel jaar |

Wordt dit te breed, splits dan: periode op de linkerhelft, YTD en FY op de rechterhelft — of
twee slides. Verklein het lettertype niet onder 9 pt.

**Materialiteitsdrempel.** Spreek vooraf af vanaf welk bedrag of percentage een variantie wordt
toegelicht — bijvoorbeeld boven € 50k *en* boven 5%. Zet die drempel op de slide. Zonder drempel
krijg je óf een muur van triviale toelichtingen, óf willekeur in wat wel en niet verklaard wordt.

**Tekenconventie.** Leg vast en vermeld: "+ = gunstig voor resultaat". Bij kosten betekent dat
een positieve variantie *lagere* kosten. Dit is de meest voorkomende bron van misverstanden in
managementrapportages; los het op met één regel tekst.

**Toelichten, niet herhalen.** De tabel toont het verschil; de tekst verklaart het. Elke
materiële variantie krijgt een oorzaak, een kwantificering en een oordeel structureel/incidenteel.

## 4. Variantieanalyse en de bridge

**De waterval is de standaardvorm** voor het verklaren van een verschil: van budget naar actual,
van vorig jaar naar dit jaar, van vorige forecast naar huidige forecast.

Opmaakregels:
- Startbalk en eindbalk in donkerblauw `#134D71`, volledig van de nullijn af
- Positieve tussenstappen in dark sage `#007059`, negatieve in burnt sienna `#C56603`
- Maximaal vijf tot zeven tussenstappen. Meer stappen betekent dat je moet groeperen;
  restposten samen als "Overig"
- Datalabel op elke balk, met teken
- Verbindingslijntjes tussen de balken, dun, `#BFBFBF`
- Start- en eindwaarde ook in de as-labels

**Decomponeer waar het kan.** Een blended variantie is bijna nooit het echte verhaal. Splits
naar de drijver:

- *Omzet*: prijs × volume × mix × valuta
- *Brutomarge*: verkoopprijs, inkoopprijs, mix, productiviteit
- *Personeelskosten*: formatie (FTE) × tarief × inhuur
- *Overige kosten*: volume-gedreven versus vast, en indexatie

Een omzetvariantie die half prijs en half volume is, vertelt een fundamenteel ander verhaal dan
één die volledig uit één grote order komt. Schrijf dat op.

**Onderscheid P&L van kasstroom.** Een resultaat kan er goed uitzien terwijl het kas kost, en
omgekeerd. Meld dit expliciet bij elke materiële post waar dat speelt (voorraden, onderhanden
werk, debiteuren, investeringen, voorzieningen).

## 5. Forecast presenteren

**Maak actual en forecast visueel onmiskenbaar verschillend.** Realisatie volvlaks, forecast in
een lichtere tint of gearceerd, met een verticale scheidslijn en het label "Forecast" boven het
prognosegedeelte. Een grafiek waarin je realisatie en prognose niet uit elkaar kunt houden is
onbruikbaar en, bij externe partijen, riskant.

**Elke forecast krijgt een vintage.** "Forecast per 31 juli 2026 (FC-3)". Zonder datum weet
niemand welke versie hij leest.

**Toon de bridge tussen forecastversies.** Van vorige forecast naar huidige, met de reden per
stap. Dit is vaak de meest gestelde vraag in een RvC-vergadering; heb het antwoord op een slide
klaarstaan.

**Scenario's.** Bij materiële onzekerheid: basis, positief en negatief scenario, elk met een
kans en met de één of twee variabelen die het verschil maken. Werk niet met vijf scenario's —
drie is het maximum dat een gremium kan afwegen. Vermeld altijd de kernaanname per scenario en
wat de uitkomst zou veranderen.

**Wees expliciet over wat er is meegenomen.** Zijn nog niet getekende orders meegerekend? Is de
cao-verhoging verwerkt? Zit de investering in de kasstroomprognose? Zet dit in een kader
"Aannames in deze forecast" naast de grafiek.

## 6. Getalnotatie en conventies

| Onderwerp | Regel |
|---|---|
| Duizendtalscheiding | Punt: `1.234` |
| Decimaalteken | Komma: `12,4` |
| Valuta | `€ 1.234` — euroteken vóór het bedrag met spatie |
| Eenheid | In de kop of as-titel: "€ 1.000" of "€ mln", nooit per cel herhalen |
| Afronding bedragen | ≥ € 1 mln: één decimaal in miljoenen. < € 1 mln: hele duizenden |
| Percentages | Hele procenten of één decimaal — één keuze per deck |
| Procentpunten | Bij marge- en ratioverschillen: "+2 pp", niet "+2%" |
| Negatieve bedragen | Tabellen: tussen haakjes `(1.234)`. Tekst en labels: minteken |
| Periode | Altijd expliciet: "Jul-26", "YTD jul-26", "FY26" |
| Nulwaarden | `–` in plaats van `0` als er niets is; `0` alleen bij een echte nul |
| Niet beschikbaar | `n.b.` met een voetnoot waarom |
| Vergelijkbaarheid | Meld herclassificaties en wijzigingen in de consolidatiekring |

**Schijnprecisie.** € 4.238.917 in een board deck is geen precisie maar ruis. Schrijf € 4,2 mln.
Bewaar de precisie voor de bijlage of het onderliggende model.

## 7. Terugkerende slidevormen

Deze vormen dekken het grootste deel van elke financiële presentatie. Gebruik ze als bouwstenen.

**A. KPI-overzicht** — zes tot acht tegels, actual met vergelijking versus budget en vorig jaar,
signaalkleur op de vergelijking.

**B. P&L-brug** — waterval van budget naar actual, of van vorig jaar naar dit jaar, met vijf tot
zeven stappen.

**C. Omzetontwikkeling** — kolommen per periode met een lijn voor cumulatief of voor de
vergelijkingsbasis; segmentuitsplitsing als gestapelde kolom.

**D. Marge-analyse** — brutomarge in procenten als lijn tegen omzet in absolute kolommen; of
een marge-bridge met prijs, kosten en mix.

**E. Kostenoverzicht** — horizontale staven per kostensoort, aflopend gesorteerd, met budget als
tweede reeks of als markering.

**F. Kasstroom** — waterval van openingskas naar eindkas, met operationeel, investeringen en
financiering als hoofdblokken.

**G. Werkkapitaal** — DSO, DIO en DPO als lijnen over twaalf perioden, plus het kaseffect in
euro's.

**H. Forecast-ontwikkeling** — actual tot en met de laatste gesloten periode, forecast daarna,
met de bridge naar de vorige forecastversie ernaast.

**I. Scenario-overzicht** — drie kolommen (negatief, basis, positief) met de kernvariabelen als
rijen en de uitkomst onderaan, plus de kans per scenario.

**J. Investeringsvoorstel** — investeringsbedrag, terugverdientijd, NPV en IRR in tegels;
gevoeligheidsanalyse op de twee belangrijkste variabelen; kasstroomprofiel over de looptijd.

**K. Bankconvenanten** — ratio's per meetmoment met de norm als horizontale lijn, headroom
expliciet in absolute bedragen, en de prognose van de volgende twee meetmomenten.

**L. Actie- en besluitenlijst** — actie, eigenaar, deadline, status in signaalkleur.

## 8. Wat er standaard misgaat

Een korte lijst van fouten die in vrijwel elke ongereviewde financiële presentatie voorkomen.
Controleer hier expliciet op.

1. **Cijfers zonder vergelijkingsbasis.** Een absoluut getal zegt niets zonder budget, forecast
   of vorig jaar.
2. **Y-as begint niet bij nul** bij een staaf- of kolomdiagram, waardoor een klein verschil groot
   lijkt.
3. **Ongedefinieerde KPI's.** "Marge" kan brutomarge, contributiemarge of EBITDA-marge zijn.
4. **Wisselende periodedefinities** binnen één deck: de ene slide YTD, de andere rolling twelve
   months, zonder dat het er staat.
5. **Deeltotalen die niet optellen** tot het gepresenteerde totaal, meestal door afronding of een
   vergeten eliminatiepost.
6. **Forecast zonder aannames** en zonder vintage.
7. **Timing gepresenteerd als prestatie.** Een besparing die alleen uitgesteld is, is geen
   besparing.
8. **Kleur zonder betekenis.** Signaalkleuren die ook als gewone reekskleur zijn gebruikt.
9. **Te veel decimalen**, wat precisie suggereert die het onderliggende model niet heeft.
10. **Geen kasstroom.** Een deck met alleen P&L verbergt de helft van het verhaal.
11. **Geen gevraagd besluit.** Het gremium leest, knikt en beslist niets.
12. **Bijlagen die het hoofdverhaal bevatten.** Wat ertoe doet staat vooraan.
