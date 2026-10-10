# Paragon huisstijl — volledige specificatie

Deze specificatie is afgeleid uit het officiële Paragon-templatebestand
("PPT Template with supporting graphic slides", maart 2023) en de goedgekeurde iconenbibliotheek,
inclusief de onderliggende thema-definitie. Alle waarden hieronder zijn exact; je hebt de
originele bestanden niet nodig.

## Inhoud

1. Slideformaat en raster
2. Kleur — primair palet
3. Kleur — secundair palet
4. Kleurvolgorde voor datavisualisatie
5. Signaalkleuren voor financiële slides
6. Themadefinitie (voor technische toepassing)
7. Typografie
8. Slidearchitectuur en de 50 layouts
9. Vaste posities en maten
10. Logo
11. Iconen en beeld
12. Bekende fouten en inconsistenties in het template

---

## 1. Slideformaat en raster

| Eigenschap | Waarde |
|---|---|
| Verhouding | 16:9 breedbeeld |
| Formaat | 33,87 × 19,05 cm |
| Formaat (inch) | 13,333 × 7,5 |
| Formaat (EMU) | 12.192.000 × 6.858.000 |

**Raster.** De standaard linkermarge voor inhoudslides is 1,70 cm (0,67") en het tekstblok van
een volle tekstslide begint op 1,04 cm (0,41") van links. De koptekst zit in de bovenste zone
tot ongeveer 4,8 cm (1,90"); daaronder begint de inhoud. Houd rechts en onder minimaal dezelfde
marge aan als links — asymmetrische witruimte leest als slordigheid.

Werk op een impliciet 12-koloms raster over de bruikbare breedte. In de praktijk komen twee
verdelingen het meest voor: half/half (tekst links, visual rechts) en een derde/tweederde
(tekst links smal, grote grafiek rechts).

---

## 2. Kleur — primair palet

Het primaire palet is blauw, oranje en grijs. Blauw draagt de merkidentiteit, oranje is het
accent, grijs is neutraal en achtergrondmateriaal.

| # | Naam | HEX | RGB | CMYK | Pantone |
|---|---|---|---|---|---|
| 1 | Donkerblauw | `#134D71` | 19, 77, 113 | 92 / 54 / 16 / 24 | 2133 C |
| 2 | Royal blue | `#238ACB` | 35, 138, 203 | 73 / 32 / 1 / 0 | 298 C |
| 3 | Sky blue | `#56BEEC` | 86, 190, 236 | 54 / 8 / 1 / 0 | 0821 C |
| 4 | Burnt sienna | `#C56603` | 197, 102, 3 | 4 / 59 / 98 / 12 | 717 C |
| 5 | Oranje | `#E38900` | 227, 137, 0 | 1 / 46 / 98 / 4 | 151 C |
| 6 | Donkergrijs | `#7F7F7F` | 127, 127, 127 | 52 / 43 / 40 / 2 | 444 C |
| 7 | Lichtgrijs | `#BFBFBF` | 191, 191, 191 | 23 / 17 / 15 / 0 | 427 C |

**Toepassing.** Primaire kleuren zijn accent, geen vulling. Ze voegen tonaal contrast toe aan een
overwegend witte pagina. Volvlaks merkkleur of fotografie hoort bij covers, sectiedividers en
statement-slides — niet bij inhoudslides.

**Aanvullende systeemkleuren uit het thema**

| Rol | HEX | Gebruik |
|---|---|---|
| Tekst / donker | `#3F3F3F` | Alle bodytekst en het merendeel van de iconen |
| Achtergrond / licht | `#FFFFFF` | Standaardachtergrond van elke inhoudslide |
| Hyperlink | `#DDF2FB` | Alleen op donkere achtergronden |
| Bezochte link | `#FEC037` | Alleen op donkere achtergronden |

Let op: de standaardtekstkleur is `#3F3F3F`, niet zwart. Gebruik geen `#000000` in tekst.

---

## 3. Kleur — secundair palet

Het secundaire palet is bedoeld voor presentaties die meer kleur nodig hebben dan zeven reeksen,
en voor gedempte tinten op donkere achtergronden of fotografie. Het vervangt het primaire palet
niet.

| # | Naam | HEX | RGB | CMYK | Pantone |
|---|---|---|---|---|---|
| 8 | Dark sage | `#007059` | 0, 112, 89 | 87 / 21 / 65 / 23 | 7482 C |
| 9 | Light sage | `#6CA885` | 108, 168, 133 | 58 / 11 / 52 / 1 | 2268 C |
| 10 | Berry | `#85406B` | 133, 64, 107 | 42 / 83 / 20 / 12 | 2602 C |
| 11 | Rose | `#E2A9B1` | 226, 169, 177 | 7 / 36 / 13 / 0 | 680 C |
| 12 | Coffee | `#8E7560` | 142, 117, 96 | 42 / 50 / 61 / 6 | 874 C |
| 13 | Caramel | `#CFA989` | 207, 169, 137 | 15 / 31 / 43 / 1 | 480 C |
| 14 | Sand | `#EFD18F` | 239, 209, 143 | 6 / 14 / 46 / 1 | 2001 C |

De HEX-waarden hierboven zijn de waarden zoals ze feitelijk in de templategrafieken zijn
geïmplementeerd. Zie sectie 12 — op de palet-slide staan voor drie kleuren afwijkende hexcodes
afgedrukt.

---

## 4. Kleurvolgorde voor datavisualisatie

Voor consistentie tussen decks worden kleuren in vaste volgorde toegekend aan datareeksen.
**Begin altijd met donkerblauw.**

```
 1  #134D71   Donkerblauw
 2  #238ACB   Royal blue
 3  #56BEEC   Sky blue
 4  #C56603   Burnt sienna
 5  #E38900   Oranje
 6  #7F7F7F   Donkergrijs
 7  #BFBFBF   Lichtgrijs
 8  #007059   Dark sage
 9  #6CA885   Light sage
10  #85406B   Berry
11  #E2A9B1   Rose
12  #8E7560   Coffee
13  #CFA989   Caramel
14  #EFD18F   Sand
```

**Kritieke afwijking van PowerPoint-gedrag.** De automatische kleurcyclus van het thema begint
bij accent1 (royal blue `#238ACB`); donkerblauw is in het thema vastgelegd als tekstkleur 2, niet
als accent. Elke automatisch ingekleurde grafiek is daardoor één kleur verschoven ten opzichte
van de huisstijl. **Zet de eerste datareeks altijd handmatig op `#134D71`.** In de
templategrafieken is dit ook zo gedaan.

**Meer dan veertien reeksen.** Loop niet door in willekeurige kleuren. Voeg categorieën samen
tot "Overig", of kies een ander visualisatietype. Veertien reeksen in één grafiek is vrijwel
altijd een ontwerpfout.

**Tinten.** Als één categorie meer dan één reeks nodig heeft (bijvoorbeeld dezelfde post in drie
jaren), gebruik dan lichtere en donkere tinten van dezelfde kleur in plaats van de volgende
kleur uit de reeks. Standaard tintstappen: 60%, 80% en 50% helderheid van de basiskleur.

---

## 5. Signaalkleuren voor financiële slides

Het merkpalet bevat bewust geen rood of groen. Voor financiële communicatie is een oordeelskleur
onmisbaar. Gebruik hiervoor deze set, die volledig binnen het goedgekeurde palet blijft:

| Betekenis | Naam | HEX |
|---|---|---|
| Gunstig, op koers, doel gehaald | Dark sage | `#007059` |
| Aandacht, risico, marginaal | Oranje | `#E38900` |
| Ongunstig, off track, doel gemist | Burnt sienna | `#C56603` |
| Neutraal, geen oordeel | Donkergrijs | `#7F7F7F` |

**Regels.**
- Gebruik deze vier kleuren uitsluitend als oordeel. Zodra dark sage ook een gewone datareeks
  inkleurt, verliest de kleur zijn betekenis in het hele deck.
- Zet nooit alleen op kleur. Ongeveer 8% van de mannelijke lezers ziet rood-groenverschillen
  slecht. Combineer kleur altijd met een teken (+/−), een pijl (▲/▼) of een tekstlabel.
- Wees consequent over slides heen. Eén slide met omgekeerde logica ondermijnt het hele deck.

---

## 6. Themadefinitie (voor technische toepassing)

Het thema heet **PARAGON Colour Theme**, met kleurenschema **ADJUSTED_PARAGON_PALETTE**.

| Themarol | HEX | Merknaam |
|---|---|---|
| dk1 / tx1 | `#3F3F3F` | Tekstgrijs |
| lt1 / bg1 | `#FFFFFF` | Wit |
| dk2 / tx2 | `#134D71` | Donkerblauw |
| lt2 / bg2 | `#FFFFFF` | Wit |
| accent1 | `#238ACB` | Royal blue |
| accent2 | `#56BEEC` | Sky blue |
| accent3 | `#C56603` | Burnt sienna |
| accent4 | `#E38900` | Oranje |
| accent5 | `#7F7F7F` | Donkergrijs |
| accent6 | `#BFBFBF` | Lichtgrijs |
| hlink | `#DDF2FB` | Hyperlink |
| folHlink | `#FEC037` | Bezochte link |

Donkerblauw is dus bereikbaar als thema-kleur `tx2` / `dk2`, niet als accent.

---

## 7. Typografie

**Lettertype: Roboto.** Het thema noemt formeel Titillium en Open Sans, maar de slidemaster
overschrijft beide met Roboto en vrijwel alle zichtbare tekst in het template is Roboto. Roboto
is dus in de praktijk het merklettertype. Zie sectie 12.

Roboto is een familie met meerdere gewichten en het template gebruikt er vier: **Light** voor
slidetitels, **Thin** voor de subtitel eronder, **Regular** voor bodytekst en **Bold** voor
nadruk en grote cijferaccenten.

| Toepassing | Font | Grootte | Kleur |
|---|---|---|---|
| Slidetitel | Roboto Light | 24 pt | `#134D71` |
| Subtitel (regel onder de titel) | Roboto Thin | 16 pt | `#3F3F3F` |
| Bodytekst | Roboto | 12 pt | `#3F3F3F` |
| Tussenkop in tekstblok | Roboto Bold | 12–14 pt | `#134D71` |
| Grote cijferaccenten (01, 02, …) | Roboto Bold | 80–100 pt | `#238ACB`, wit of `#134D71` |
| Cover — hoofdtitel | Roboto | 32 pt | Wit of `#134D71` |
| Cover — subtitel | Roboto Light | 24 pt | Wit of `#3F3F3F` |
| Cover — datum/auteur | Roboto | 14 pt | Wit of `#7F7F7F` |
| Sectiedivider | Roboto Bold | 54 pt | Wit, hoofdletters |
| Grafiektekst (assen, labels, legenda) | Roboto | 8 pt | `#3F3F3F` |
| Grafiektitel boven grafiek | Roboto Bold | 10–12 pt | `#3F3F3F` |
| Tabeltekst | Roboto | 9–11 pt | `#3F3F3F` |
| Paginanummer | Roboto | 8 pt | `#BFBFBF` |
| Bronvermelding / voetnoot | Roboto Light | 8–9 pt | `#7F7F7F` |

De grafiektekst in het template varieert tussen 7 en 10 pt. Standaardiseer op 8 pt; dat is de
meest gebruikte waarde en blijft leesbaar bij projectie.

De regel voor bronvermeldingen is een afgeleide Paragon-standaard: het template kent geen
voetnootopmaak. Zie ook sectie 12 punt 5 voor tabellen.

**Terugvaloptie.** Op systemen zonder Roboto: Arial. Wijk niet uit naar Calibri — dat is de
Office-standaard en valt direct op als niet-huisstijl.

**Regelafstand** 90% voor bodytekst; het kopblok gebruikt een vaste regelafstand van 28,8 pt.
Ruimte vóór alinea 10 pt op het eerste niveau.

**Opsommingen.** Het eerste niveau heeft geen bolletje: het is losse tekst met witruimte ertussen.
Diepere niveaus gebruiken een rond bolletje met een inspringing van ongeveer 1,0 cm per niveau.
Ga niet dieper dan twee niveaus — drie niveaus betekent dat de slide te veel wil.

**Hoofdlettergebruik.** Alleen sectiedividers in hoofdletters. Titels in gewone zinsvorm met
alleen de eerste letter en eigennamen groot. Geen Title Case, geen hoofdletters voor nadruk.

**Nadruk.** Bold, spaarzaam. Geen cursief (leest slecht op afstand), geen onderstreping (leest als
hyperlink), geen kleur als nadruk anders dan de signaalkleuren.

---

## 8. Slidearchitectuur en de 50 layouts

Het template bevat 50 benoemde layouts. Gebruik ze op naam; bouw geen losse slides vanaf blanco
als er een passende layout bestaat.

**Waarschuwing bij programmatisch zoeken op naam.** Vier layoutnamen hebben in het bestand een
naspatie: `Text Slide `, `Chart Slide `, `2_Title Slide ` en `3_Title Slide `. Vergelijk daarom
altijd met `.strip()`, nooit met een letterlijke `==`.

**Covers en afsluiting**

| Layout | Gebruik |
|---|---|
| `Front Cover_Light` | Standaardcover op lichte achtergrond |
| `1_Front Cover_dark` | Cover op donkerblauw of fotografie; formeler, geschikt voor RvC en investeerders |
| `Back Page_Light` / `Back Page_Dark` | Afsluitpagina, dankwoord of contactgegevens |

**Structuur**

| Layout | Gebruik |
|---|---|
| `Table of Contents` | Agenda; beeld links, negen genummerde regels rechts |
| `Slide Divider_Dark Blue` | Standaard sectiedivider — gebruik deze als default |
| `1_Slide Divider_Royal Blue` t/m `6_Slide Divider_Light grey` | Zes kleurvarianten van de divider (royal blue, sky blue, burnt sienna, oranje, donkergrijs, lichtgrijs) |

Voor de dividers geldt: kies één kleurlogica per deck en houd die vast. Twee zinnige systemen
zijn (a) alle dividers donkerblauw, of (b) elke sectie een eigen kleur in de vaste
paletvolgorde. Willekeurig wisselen leest als onzorgvuldigheid.

**Inhoud**

| Layout | Gebruik |
|---|---|
| `Text Slide` | Volle tekstslide, één kolom |
| `Text Page_Full` | Tekst over de volle breedte, voor langere passages |
| `Text & Picture` | Tekst met beeld |
| `Chart Slide` | Tekst links, volvlaks grafiek rechts — **de werkpaardlayout voor financiële slides** |
| `Text and chart_Dark_Blue` | Tekst plus grafiek met donkerblauwe accentbalk links |
| `2_Text and chart_Sky Blue` | Idem, sky blue accent |
| `1_Text and chart_Burnt Sienna` | Idem, burnt sienna accent |
| `3_Text and chart_Dark Grey` | Idem, donkergrijs accent |
| `Full Picture` | Volvlaks beeld |
| `Picture Slide 01` t/m `Picture Slide 18` | Achttien beeldcomposities |
| `Blank` | Alleen als geen enkele layout past |

**Personen**

| Layout | Gebruik |
|---|---|
| `Bio_1`, `Bio_2`, `Bio_3` | Individuele profielen |
| `Bio_Team_4`, `Bio_Team_8` | Teamoverzicht met vier of acht personen |
| `Feature Bio_Blue` / `_Orange` / `_Grey` | Uitgelicht profiel in drie kleurvarianten |

**Titelvarianten**

| Layout | Gebruik |
|---|---|
| `2_Title Slide`, `3_Title Slide` | Alternatieve titelpagina's |

**Aanvullende grafische slides** (in het templatebestand, achter de sectie "Graphic slides"):
North Star / KPI-raamwerk, 4-staps gauge met groot kerncijfer, hexagondiagram, 4-staps
infographic, drie organogramvarianten, drie venn-diagrammen (3, 4 en 5 sets), diverse
pijl-, cirkel- en stroomdiagrammen, kwadrantdiagram, percentagedonuts en een gelaagd
architectuurdiagram. Gebruik deze voor concepten en processen — niet voor cijfers. Voor cijfers
gelden de grafiekregels uit `tabellen-en-grafieken.md`.

---

## 9. Vaste posities en maten

Maten in cm; inch tussen haakjes waar dat handig is voor python-pptx.

**Koptekst — belangrijke uitzondering.** De kop staat bewust *niet* in de slidemaster. Het
template documenteert dit expliciet: de titel en subtitel worden van pagina naar pagina
gekopieerd, zodat ze per slide verplaatst kunnen worden en de inhoud niet in de weg zitten.
Behandel dit als ontwerpkeuze, niet als fout. Praktisch: neem het kopblok over uit de vorige
slide en verschuif het alleen als de inhoud daarom vraagt.

| Element | x | y | breedte | hoogte |
|---|---|---|---|---|
| Kopblok (titel + subtitel) | 1,70 cm | 1,60–2,00 cm | 5,3–10,2 cm | 2,54 cm |
| Tekstblok inhoudslide | 1,04 cm | 4,83 cm | 24,4 cm | 12,7 cm |
| Paginanummer | 25,8 cm | 17,65 cm | 7,6 cm | 1,0 cm |

**Chart Slide** — tekst links, grafiek volvlaks rechts

| Element | x | y | breedte | hoogte |
|---|---|---|---|---|
| Tekstblok | 1,04 cm | 4,83 cm | 14,2 cm | 12,7 cm |
| Grafiekvlak | 16,94 cm | 0 cm | 16,94 cm | 19,05 cm |

**Text and chart** — kicker boven, tekst links, grafiek rechts, accentbalk uiterst links

| Element | x | y | breedte | hoogte |
|---|---|---|---|---|
| Kickerregel | 4,22 cm | 4,37 cm | 21,8 cm | 2,3 cm |
| Accentbalk (kleur) | 0 cm | 7,16 cm | 3,58 cm | 8,97 cm |
| Tekstblok | 4,22 cm | 7,19 cm | 10,3 cm | 8,97 cm |
| Grafiekvlak | 16,28 cm | 7,19 cm | 15,7 cm | 8,97 cm |

**Table of Contents** — negen regels

| Element | Waarde |
|---|---|
| Beeld links | x 0, y 0, breedte 14,9 cm, volledige hoogte |
| Eerste regel | y 1,63 cm |
| Regelafstand | 1,85 cm |
| Label | x 16,89 cm, breedte 14,9 cm, hoogte 1,35 cm |
| Kleuraccent vóór het label | x 15,95 cm, breedte 0,58 cm |
| Paginanummer | x 31,95 cm, breedte 1,32 cm |

**Sectiedivider**

| Element | Waarde |
|---|---|
| Achtergrond | volvlaks, volledige slide |
| Accentbalk | x 2,84 cm, y 0, breedte 0,46 cm, hoogte 7,42 cm |
| Sectietitel | x 3,99 cm, y 7,42 cm, breedte 9,9 cm |

**Cover**

| Element | x | y | breedte |
|---|---|---|---|
| Hoofdtitel | 2,90 cm | 8,00 cm | 15,4 cm |
| Subtitel | 2,90 cm | 9,60 cm | 15,4 cm |
| Datum / auteur | 4,14 cm | 13,21 cm | 7,6 cm |

Deze waarden gelden voor `Front Cover_Light`. In `1_Front Cover_dark` staat het datum-/auteurvak
iets anders: x 4,11 cm, y 13,00 cm, breedte 8,12 cm. Titel en subtitel zijn gelijk.

---

## 10. Logo

Het logo is een woordmerk: **PARAGON** in kapitalen, waarbij de O is vervangen door een gestreepte
wereldbol. Het is eenkleurig — er zit geen tweede kleur, geen verloop en geen contour in.

De skill levert het logo mee in `assets/`. Gebruik die bestanden; zoek niet zelf een versie op.

| Bestand | Inhoud | Gebruik |
|---|---|---|
| `paragon-logo-blauw.svg` | Beeldmerk, `#134D71`, schaalbaar | Standaard. Vector: HTML, dashboards, drukwerk, PowerPoint 2016+ |
| `paragon-logo-wit.svg` | Beeldmerk, wit, schaalbaar | Op blauwe, donkere of fotoachtergrond |
| `paragon-logo-blauw.png` | 2324 × 424, transparant | Waar geen vector kan, zoals python-pptx |
| `paragon-logo-wit.png` | 2324 × 424, transparant | Idem, op donkere achtergrond |
| `paragon-logo-blauw-vrije-ruimte.png` | 2764 × 816, met ingebouwde marge | Sluit exact aan op de plaatsingsmaten van het template |
| `paragon-logo-wit-vrije-ruimte.png` | 2764 × 816, met ingebouwde marge | Idem, op donkere achtergrond |

### Kleurgebruik

**Blauw `#134D71` is de basis.** Gebruik die versie op elke witte of lichte achtergrond — dat is
de overgrote meerderheid van de inhoudslides.

**Wit zodra de achtergrond blauw of donker is.** Dus op covers, sectiedividers, volvlaks
gekleurde slides en fotografie. Op een lichte dividerkleur (lichtgrijs, sky blue) is wit niet
leesbaar: gebruik daar blauw.

| Achtergrond | Variant |
|---|---|
| Wit, lichtgrijs `#BFBFBF`, zeer lichte tinten | Blauw `#134D71` |
| Donkerblauw `#134D71`, royal blue `#238ACB` | Wit |
| Burnt sienna `#C56603`, oranje `#E38900`, donkergrijs `#7F7F7F` | Wit |
| Sky blue `#56BEEC` | Blauw — wit heeft te weinig contrast |
| Fotografie | Wit, en alleen op een rustig of verdonkerd deel van het beeld |

Geen andere kleuren. Het logo wordt nooit zwart, nooit oranje, nooit in een accentkleur en nooit
half transparant.

### Verhoudingen

Het beeldmerk is **581 × 106**, een verhouding van **5,48 : 1**. Schaal altijd proportioneel.

De bestanden met vrije ruimte zijn 691 × 204, verhouding **3,39 : 1**; het beeldmerk vult daarin
84,1% van de breedte en 52,0% van de hoogte. Die bestanden plaats je één-op-één in de kaders
hieronder, en dan klopt de vrije ruimte automatisch.

### Plaatsing

Standaardpositie is **rechtsboven**, overgenomen uit het template:

| Toepassing | Kader (versie met vrije ruimte) | Beeldmerk zelf |
|---|---|---|
| Inhoudslide, cover, blanco slide | x 27,52 cm, y 0,79 cm, 5,69 × 1,67 cm | x 27,97 cm, y 1,19 cm, 4,79 × 0,87 cm |
| Afsluitpagina, groot | x 20,72 cm, y 7,80 cm, 11,71 × 3,45 cm | x 21,65 cm, y 8,70 cm, 9,85 × 1,79 cm |

**Vrije ruimte.** Rondom het beeldmerk blijft minimaal een halve logohoogte vrij — bij de
standaardmaat is dat circa 0,44 cm. Binnen die zone komt geen tekst, geen lijn, geen icoon en
geen beeldrand. Dit is de marge die al in de `-vrije-ruimte`-bestanden zit.

**Minimale afmeting.** Niet kleiner dan 3,0 cm beeldmerkbreedte op een slide. Daaronder lopen de
strepen in de wereldbol dicht en wordt het merk een vlek. Voor drukwerk geldt 25 mm als ondergrens.

**Eén logo per slide.** Op een slide met een partnerlogo staat Paragon links, de partner rechts,
beide op gelijke optische hoogte — gelijk in hoogte van het beeldmerk, niet in kadergrootte.

### Toepassing per decktype

- **Covers en afsluitpagina:** altijd, in de witte variant als de cover gekleurd is.
- **Sectiedividers:** altijd, wit.
- **Inhoudslides:** rechtsboven, blauw. Bij een deck dat extern gaat (bank, investeerder,
  aandeelhouder) op elke slide; bij interne managementrapportages is alleen de cover genoeg —
  kies één lijn per deck en houd die vast.
- **Cijferslides:** het logo mag nooit boven of over een grafiek, tabel of datalabel vallen.
  Loopt de inhoud tot rechtsboven door, laat het logo dan weg op die slide.

### Wat niet mag

Niet uitrekken of samendrukken, niet roteren, niet spiegelen, geen schaduw of gloed, geen contour,
geen kader eromheen, geen kleurvariant buiten blauw en wit, niet in een vorm plaatsen, het
woordmerk en de bol niet losknippen of apart gebruiken, niet over een druk beeld zonder overlay,
en het logo nooit natypen in Roboto — de letters zijn een eigen tekening.

### Herkomst en beperking

De meegeleverde bestanden zijn afgeleid uit de witte logo-PNG in het officiële Paragon-template
(`ppt/media/image8.png`, 691 × 204). Omdat het merk eenkleurig is en de vorm volledig in het
alfakanaal zit, is de blauwe variant pixelexact herkleurd en wijkt hij niet af van het origineel.
De SVG's zijn uit datzelfde masker gevectoriseerd en renderen binnen één grijswaarde van de bron.

Wel een beperking: de bronresolutie is 691 × 204. Voor groot drukwerk is dat krap. De SVG's
ondervangen dat voor beeldschermgebruik en normaal drukwerk, maar als er een origineel
vectorbestand (AI, EPS of officiële SVG) bij marketing ligt, gebruik dat voor alles wat groter
wordt afgedrukt dan A4.

---

## 11. Iconen en beeld

**Iconen.** Gebruik bij voorkeur de goedgekeurde bibliotheek ("Approved icons library",
57 pagina's). De iconen zijn vectorvormen, geen afbeeldingen, en dus vrij schaalbaar en
herkleurbaar. De bibliotheek gebruikt hetzelfde Paragon-thema als het template.

De bibliotheek bevat twee soorten materiaal, met verschillende regels:

*Thin-line iconen* — het grootste deel. Technisch zijn dit meestal gevulde vectorpaden zonder
streek; de dunne-lijnindruk komt uit de vormgeometrie zelf, niet uit een lijndikte. Waar wel met
een streek gewerkt wordt is die 0,75 pt (fijne detaillering 0,25 pt). Regels: één kleur per
icoon, uit `#3F3F3F`, `#134D71` of `#238ACB`. Geen schaduw, geen verloop.

*Samengestelde graphics* — percentagedonuts (20% tot 80%), wereldkaarten, tijdlijnen en de
"editable graphics". Deze zijn bewust meerkleurig en gebruiken meerdere accentkleuren tegelijk.
Behandel ze als diagram, niet als icoon: laat de kleurtoekenning de datavolgorde uit sectie 4
volgen.

Beschikbare categorieën: generiek, teamwork, business, marketing, devices, milieu, hernieuwbare
energie, elektriciteit, brandstof, supply chain, logistiek, software, board & team, kantoor,
cloud & systemen, locatiemarkers, percentagedonuts, social media, bewerkbare graphics,
tijdlijnen, wereldkaarten, valuta en elektrische schema's.

**Let op bij hergebruik.** De bibliotheek bevat kleuren die niet in het palet staan, waaronder
`#808080` (lijkt op maar is niet de huisstijlgrijs `#7F7F7F`), `#000000`, `#E3E9ED`, `#D9D9D9`,
`#CFD9E0`, `#6B768C` en `#5F7D95`. Zet de kleur van een gekopieerd icoon dus altijd expliciet om
naar het palet in plaats van erop te vertrouwen dat het goed staat.

**Als de bibliotheek niet beschikbaar is.** Gebruik dan géén stockiconen of iconenfonts. Twee
werkbare alternatieven: laat het icoon weg (op cijferslides is dat vrijwel altijd een
verbetering), of teken een eenvoudige vorm in PowerPoint zelf met contour `#134D71`, lijndikte
0,75 pt en geen vulling. Meld bij oplevering dat de iconen niet uit de goedgekeurde bibliotheek
komen, zodat iemand ze later kan vervangen.

**Wanneer wel en niet.** Iconen ondersteunen een categorie of concept. Ze horen niet op
cijferslides: daar leidt een icoon naast een getal alleen af. Eén icoon per element, nooit
decoratief. Geen emoji en geen clipart.

**Beeld.** Fotografie is volvlaks — op covers, dividers en statement-slides. Zet geen tekst over
een druk beeld zonder donkere overlay. Beeld op een cijferslide is bijna altijd verkeerd.

---

## 12. Bekende fouten en inconsistenties in het template

Deze punten zijn geverifieerd in het bronbestand. Ze zijn belangrijk: wie het template klakkeloos
volgt neemt ze over.

**1. Het lettertype in het thema klopt niet met de praktijk.** Het themabestand declareert
Titillium als kopfont en Open Sans als bodyfont. De slidemaster overschrijft beide met Roboto,
en vrijwel alle zichtbare tekst in het template is Roboto. Werk met Roboto. Leg de vraag welke
van de twee de formele merkstandaard is bij marketing/brand neer — zolang dat niet is opgelost
blijft dit een latent risico bij externe drukwerkleveranciers.

**2. De automatische grafiekkleuren beginnen bij de verkeerde kleur.** Zie sectie 4. Zet de
eerste reeks handmatig op `#134D71`.

**3. Drie hexcodes op de palet-slide wijken af van de geïmplementeerde kleur.** De afgedrukte
hexcodes en de RGB-waarden op dezelfde slide zijn niet gelijk. De grafieken in het template
gebruiken de RGB-waarden. Volg die:

| Kleur | Afgedrukt op slide | Werkelijk geïmplementeerd |
|---|---|---|
| Berry | `#84416C` | `#85406B` |
| Rose | `#DEA8B0` | `#E2A9B1` |
| Caramel | `#CEAA8A` | `#CFA989` |

De afwijking is visueel verwaarloosbaar maar leidt tot twee versies van de huisstijl in omloop.
Gebruik consequent de rechterkolom.

**4. De volgorde van de secundaire kleuren wordt op twee plaatsen verschillend weergegeven.** De
swatch-volgorde op de paletslide wijkt af van de namenlijst ernaast. De grafiekdefinities in het
template volgen de namenlijst; die volgorde staat in sectie 3 en 4 en is leidend.

**5. Er is geen huisstijl-tabelstijl.** Het template bevat geen gedefinieerde tabelopmaak. Elke
tabel wordt handmatig opgemaakt, wat verklaart waarom tabellen tussen decks sterk verschillen.
`tabellen-en-grafieken.md` legt een vaste tabelspecificatie vast — gebruik die als standaard.

**6. Een deel van de slides is niet geharmoniseerd.** Ongeveer een derde van de templateslides
draagt lettertypedeclaraties die geen Roboto zijn: Gill Sans, Source Sans Pro Light, Neris Thin,
Open Sans, Open Sans Light, Lato Bold, Helvetica Light, Poppins Light, Poppins SemiBold,
Segoe UI Light, Arial en FontAwesome. Meestal is de zichtbare tekst wél Roboto en zit het
vreemde font in een lege of latente tekstdefinitie — die springt aan zodra iemand in die vorm
gaat typen. Dit zit niet alleen in het blok "Graphic slides": ook eerdere slides bevatten
Gill Sans.

Zet lettertype en kleuren daarom altijd expliciet om naar de huisstijl wanneer je een
templateslide hergebruikt, ook als hij er goed uitziet. Controleer dit ook bij het reviewen van
decks van collega's — dit is de meest voorkomende huisstijlfout in bestaande
Paragon-presentaties.

**7. Zwarte vormen zitten óók in vier layouts.** Behalve op losse slides staat `#000000` in de
vier `Text and chart`-layouts. Elke nieuwe slide op die layouts erft die zwarte elementen. Loop
ze na en zet ze om naar `#3F3F3F` of naar een paletkleur.
