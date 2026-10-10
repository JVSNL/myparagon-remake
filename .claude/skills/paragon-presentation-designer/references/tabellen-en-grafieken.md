# Opmaakspecificatie tabellen en grafieken

Exacte opmaak. Voor de keuze *welk* grafiektype je gebruikt: zie `financiele-visualisatie.md`.

---

## Deel 1 — Grafieken

### Basisinstellingen

Deze waarden komen uit de grafieken in het officiële template en gelden als standaard.

| Instelling | Waarde |
|---|---|
| Lettertype grafiektekst | Roboto, 8 pt, `#3F3F3F` |
| Grafiektitel (los tekstvak boven de grafiek) | Roboto bold 10–12 pt, `#3F3F3F` |
| Tussenruimte kolommen (gap width) | 219% |
| Overlap reeksen (kolom, gegroepeerd) | −27% |
| Tussenruimte staven, horizontaal (gap width) | 150% |
| Legenda | Onder de grafiek |
| Afgeronde hoeken grafiekvlak | Uit |
| Rasterlijnen | Alleen op de waarde-as, dun, `#BFBFBF` |
| Kader om het grafiekvlak | Geen |
| Achtergrond grafiekvlak | Wit of transparant, nooit gekleurd |

### Kleurtoekenning

Volg de vaste volgorde uit `huisstijl.md` sectie 4, **beginnend met donkerblauw `#134D71`**.
PowerPoint doet dit niet vanzelf: de automatische cyclus start bij royal blue. Zet reeks 1
altijd expliciet.

Wanneer één reeks de boodschap is en de rest context: geef de hoofdreeks donkerblauw `#134D71`
en alle andere lichtgrijs `#BFBFBF`. Dit werkt beter dan zeven kleuren en is de standaard voor
board decks.

### Legenda en labels

- **Laat de legenda weg als het kan.** Bij twee of drie reeksen is een label direct naast de
  lijn of balk beter leesbaar; zet het label in de kleur van de reeks.
- **Datalabels boven rasterlijnen.** Als de exacte waarde ertoe doet, zet datalabels aan en haal
  de rasterlijnen en de waarde-as weg. Beide tonen is dubbelop.
- **Niet alles labelen.** Bij veel datapunten alleen het eerste, het laatste en de uitschieters.
- **Eenheid in de as-titel of de kop**, niet achter elk label.

### Assen

- Waarde-as van staaf- en kolomdiagrammen begint **altijd** bij nul. Bij een lijndiagram mag de
  as afgekapt worden als de variatie klein is — vermeld dat dan expliciet in het bijschrift.
- As-lijnen dun en licht `#BFBFBF`; as-labels `#3F3F3F` 8 pt.
- Maximaal vijf tot zeven schaalstappen op de waarde-as.
- Categorielabels horizontaal. Als ze niet passen: gebruik een horizontaal staafdiagram in plaats
  van labels schuin te zetten.
- Tijdreeksen lopen van links naar rechts, oudste eerst, met gelijke intervallen.

### Sorteren

- Tijdreeksen: chronologisch.
- Categorieën: aflopend op waarde, tenzij er een vaste natuurlijke volgorde is (P&L-volgorde,
  organisatorische volgorde, scenariovolgorde negatief-basis-positief).
- Sorteervolgorde blijft gelijk tussen perioden. Herordenen per maand maakt vergelijken onmogelijk.

### Waterval / bridge

| Element | Opmaak |
|---|---|
| Startbalk en eindbalk | `#134D71`, vanaf de nullijn |
| Positieve stap | `#007059` (dark sage) |
| Negatieve stap | `#C56603` (burnt sienna) |
| Subtotaal onderweg | `#7F7F7F` |
| Verbindingslijnen | 0,75 pt, `#BFBFBF`, gestreept |
| Datalabels | Op elke balk, met teken, 8 pt |
| Aantal tussenstappen | Vijf tot zeven; groepeer de rest als "Overig" |

### Actual versus forecast in één grafiek

| Element | Opmaak |
|---|---|
| Realisatie | Volledig gevuld, `#134D71` |
| Forecast | Zelfde kleur, 40% transparantie of diagonale arcering |
| Scheiding | Verticale stippellijn `#7F7F7F` op de overgang |
| Label | "Forecast" boven het prognosedeel, 8 pt `#7F7F7F` |
| Budgetreferentie | Horizontale lijn of tweede reeks in `#BFBFBF` |

### Voortgang naar doel

Enkele balk of donut, met de gerealiseerde waarde in `#134D71` en het restant in `#BFBFBF`.
Percentage groot in het midden (donut) of rechts van de balk, 24–32 pt bold `#134D71`. Het doel
als dunne verticale markering in `#3F3F3F` met label.

### Sparkline

Voor trends in KPI-tegels: lijn 1 pt `#7F7F7F`, geen assen, geen labels, laatste punt gemarkeerd
met een stip in `#134D71`. Hoogte circa 0,8 cm.

---

## Deel 2 — Tabellen

Het template bevat **geen** gedefinieerde tabelstijl. Onderstaande specificatie is daarom de
Paragon-standaard; pas hem consequent toe zodat tabellen tussen decks eindelijk gelijk worden.

### Standaard financiële tabel

| Element | Specificatie |
|---|---|
| Lettertype | Roboto, 9–11 pt |
| Koprij — achtergrond | `#134D71` |
| Koprij — tekst | Wit, bold, 10 pt |
| Koprij — hoogte | Circa 0,8 cm |
| Datarijen — achtergrond | Wit |
| Datarijen — arcering even rijen | `#F2F6F9` (zeer lichte tint van donkerblauw) — optioneel, alleen bij meer dan acht rijen |
| Datarijen — tekst | `#3F3F3F`, 10 pt |
| Rijhoogte | Circa 0,6 cm |
| Horizontale scheidingslijnen | 0,5 pt `#BFBFBF` |
| Verticale scheidingslijnen | Geen, behalve vóór een totaalkolom |
| Buitenrand | Geen |
| Totaalrij | Bovenlijn 1 pt `#134D71`, tekst bold `#134D71`, achtergrond wit |
| Subtotaalrij | Bovenlijn 0,5 pt `#7F7F7F`, tekst bold `#3F3F3F` |
| Celmarge links/rechts | 0,15 cm |

### Uitlijning

| Inhoud | Uitlijning |
|---|---|
| Tekstlabels, postnamen | Links |
| Alle bedragen en aantallen | Rechts |
| Percentages | Rechts |
| Perioden en datums | Rechts |
| Status- en signaalkolommen | Gecentreerd |
| Kolomkoppen | Gelijk aan de inhoud eronder |

Bedragen rechts uitlijnen is niet cosmetisch: het is de enige manier waarop cijfers van
verschillende ordegrootte visueel vergelijkbaar worden.

### Variantiekolommen

- Δ absoluut en Δ % naast elkaar, direct rechts van de vergelijkingskolom
- Signaalkleur alleen op de variantiewaarde, niet op de hele rij
- Gunstig `#007059`, ongunstig `#C56603`, binnen de drempel `#3F3F3F`
- Altijd een teken: `+` of `−`
- Zet de tekenconventie in een regel onder de tabel: "+ = gunstig voor resultaat"

### Signaal- en statuskolommen

Gebruik een gevulde cirkel van circa 0,35 cm in de signaalkleur, met daarnaast een kort
tekstlabel. Nooit alleen de kleur — dat is niet toegankelijk en niet printbaar in grijstinten.

| Status | Kleur | Label |
|---|---|---|
| Op koers | `#007059` | Op koers |
| Aandacht | `#E38900` | Aandacht |
| Off track | `#C56603` | Off track |
| Afgerond | `#7F7F7F` | Gereed |

### Omvang

- Maximaal circa twaalf rijen en acht kolommen op één slide
- Gaat het daaroverheen: splits over twee slides, groepeer regels, of verplaats detail naar de
  bijlage met een verwijzing
- Verklein het lettertype **niet** onder 9 pt om een tabel passend te maken. Een tabel die alleen
  leesbaar is met de neus op het scherm hoort niet in een board deck. (De 8 pt van as-labels,
  datalabels en bronvermeldingen is een vaste huisstijlgrootte en valt hier niet onder — de regel
  gaat over verkleinen om iets passend te krijgen)
- Herhaal de koprij als een tabel over twee slides doorloopt, met "(vervolg)" in de titel

### Bijschrift

Onder elke tabel, 8 pt `#7F7F7F`: eenheid, periode, bron en peildatum. Bijvoorbeeld:
"Bedragen in € 1.000, YTD juli 2026. Bron: Business Central, stand 5 augustus 2026."
