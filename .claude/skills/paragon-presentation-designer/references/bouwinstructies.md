# Bouwinstructies — een Paragon-deck programmatisch maken

Voor het genereren van een `.pptx` met python-pptx. Voor inhoudelijke keuzes: zie de andere
referentiebestanden.

## Twee routes

**Route A — bouwen vanaf het officiële template (voorkeur).** Als het bestand
"PPT Template with supporting graphic slides.pptx" beschikbaar is, open het en gebruik de
benoemde layouts. Je erft dan thema, kleuren, master en alle vijftig layouts. Dit levert altijd
het beste resultaat.

**Route B — bouwen vanaf blanco.** Als het template er niet is, bouw je vanaf een lege
presentatie en zet je alle opmaak expliciet. `scripts/paragon_stijl.py` bevat daarvoor alle
constanten en helpers. Het resultaat is huisstijlconform maar mist de layoutvarianten; meld dat
bij oplevering en adviseer de gebruiker het bestand daarna één keer door de template-master te
halen.

## Route A — werken met het template

```python
from pathlib import Path
from pptx import Presentation

TEMPLATE = Path("/absoluut/pad/naar/PPT Template with supporting graphic slides.pptx")
if not TEMPLATE.exists():
    raise SystemExit("Template niet gevonden — gebruik Route B")

prs = Presentation(TEMPLATE)

# Bekijk welke layouts beschikbaar zijn
for i, layout in enumerate(prs.slide_layouts):
    print(i, repr(layout.name))

# Kies op naam, niet op index — indexen verschuiven bij een templateupdate.
# Let op: vier layoutnamen hebben een naspatie ("Text Slide ", "Chart Slide ",
# "2_Title Slide ", "3_Title Slide "). Vergelijk daarom altijd met .strip().
def layout(prs, naam):
    for l in prs.slide_layouts:
        if l.name.strip().lower() == naam.strip().lower():
            return l
    raise KeyError(f"Layout '{naam}' niet gevonden")

slide = prs.slides.add_slide(layout(prs, "Chart Slide"))
```

**Controleer de geërfde layout.** De vier `Text and chart`-layouts bevatten zwarte vormen
(`#000000`) die niet in de huisstijl zitten. Loop na het toevoegen van een slide de shapes langs
en zet die om naar `#3F3F3F` of een paletkleur.

**Verwijder de voorbeeldslides.** Het template bevat 84 gevulde slides. Haal ze weg voordat je
begint, anders lever je een deck met lorem ipsum op:

```python
xml_slides = prs.slides._sldIdLst
for sld in list(xml_slides):
    xml_slides.remove(sld)
```

**Belangrijke layoutnamen** (volledige lijst in `huisstijl.md` sectie 8):
`Front Cover_Light`, `1_Front Cover_dark`, `Table of Contents`, `Slide Divider_Dark Blue`,
`Text Slide`, `Chart Slide`, `Text and chart_Dark_Blue`, `Text & Picture`, `Blank`,
`Back Page_Light`.

## Route B — bouwen vanaf blanco

```python
import sys
sys.path.insert(0, "<pad naar skill>/scripts")
from paragon_stijl import *

from pptx import Presentation
from pptx.util import Cm, Pt

prs = Presentation()
prs.slide_width, prs.slide_height = SLIDE_B, SLIDE_H   # 33,87 x 19,05 cm
blanco = prs.slide_layouts[6]

slide = prs.slides.add_slide(blanco)
kop(slide, "Omzet blijft 4% achter op budget", "YTD juli 2026, bedragen in € 1.000")
```

## Het kopblok

De kop staat bewust niet in de slidemaster van het template — dat is een ontwerpkeuze, zodat de
kop per slide verplaatst kan worden. Voeg hem dus per slide toe. De helper `kop()` doet dit met
de juiste opmaak: titel Roboto Light 24 pt `#134D71`, subtitel Roboto Thin 16 pt `#3F3F3F`,
regelafstand 28,8 pt, op x 1,70 cm en y 1,60 cm, standaardbreedte 10,21 cm.

Bij een langere actietitel geef je een grotere breedte mee — het kopblok mag per slide
verbreden en verschuiven, dat is juist waarom het niet in de master staat:

```python
kop(slide, "Omzet blijft 4% achter op budget door vertraagde uitrol Nederland",
    "YTD juli 2026, bedragen in € 1.000", breedte=Cm(20))
```

## Grafieken

```python
from pptx.chart.data import CategoryChartData
from pptx.enum.chart import XL_CHART_TYPE

data = CategoryChartData()
data.categories = ["Jan", "Feb", "Mrt", "Apr"]
data.add_series("Actual", (12.1, 13.4, 11.8, 12.9))
data.add_series("Budget", (12.5, 13.9, 12.6, 12.4))

gf = slide.shapes.add_chart(
    XL_CHART_TYPE.COLUMN_CLUSTERED,
    TC_GRAFIEK["x"], TC_GRAFIEK["y"], TC_GRAFIEK["w"], TC_GRAFIEK["h"],
    data,
)
stijl_grafiek(gf.chart, datalabels=True)
```

`stijl_grafiek()` zet in één keer: reekskleuren volgens de vaste volgorde beginnend bij
donkerblauw, Roboto 8 pt, legenda onderaan, gap width 219%, overlap −27%, en lichte rasterlijnen
die automatisch verdwijnen zodra je datalabels aanzet.

**Eén reeks benadrukken.** Voor board decks vaak beter dan een volledig palet:

```python
stijl_grafiek(gf.chart, kleuren=[DONKERBLAUW, LICHTGRIJS, LICHTGRIJS])
```

**Waarde-as bij nul.** python-pptx laat PowerPoint de as bepalen; forceer hem bij staaf- en
kolomdiagrammen expliciet:

```python
gf.chart.value_axis.minimum_scale = 0
```

**Waterval.** python-pptx kent geen watervaltype. Bouw hem als een gestapelde kolomgrafiek met
een onzichtbare basisreeks:

```python
basis   = [0, 12.1, 11.6, 11.9, 0]        # onzichtbare sokkel per staaf
zichtbaar = [12.1, -0.5, 0.3, 0.7, 12.9]  # de werkelijke staafhoogtes

data = CategoryChartData()
data.categories = ["Budget", "Prijs", "Volume", "Mix", "Actual"]
data.add_series("basis", basis)
data.add_series("waarde", [abs(v) for v in zichtbaar])

gf = slide.shapes.add_chart(XL_CHART_TYPE.COLUMN_STACKED, x, y, w, h, data)
ch = gf.chart
ch.plots[0].series[0].format.fill.background()          # sokkel onzichtbaar
punten = ch.plots[0].series[1].points
for i, v in enumerate(zichtbaar):
    punten[i].format.fill.solid()
    if i in (0, len(zichtbaar) - 1):
        punten[i].format.fill.fore_color.rgb = DONKERBLAUW   # start en eind
    else:
        punten[i].format.fill.fore_color.rgb = GUNSTIG if v > 0 else ONGUNSTIG
ch.has_legend = False
```

**Actual versus forecast.** Zet de forecastpunten in dezelfde kleur met transparantie, en teken
de scheidslijn als een losse vorm. Transparantie vergt directe XML-manipulatie:

```python
from pptx.oxml.ns import qn
from lxml import etree

def transparant(punt, kleur, alpha_pct=40):
    punt.format.fill.solid()
    punt.format.fill.fore_color.rgb = kleur
    srgb = punt.format.fill.fore_color._xFill.find(qn("a:srgbClr"))
    a = etree.SubElement(srgb, qn("a:alpha"))
    a.set("val", str(int((100 - alpha_pct) * 1000)))
```

## Tabellen

```python
rijen, kolommen = 6, 5
tbl = slide.shapes.add_table(rijen, kolommen,
                             Cm(1.70), Cm(6.0), Cm(20.0), Cm(6.0)).table

for i, rij in enumerate(data_rijen):
    for j, waarde in enumerate(rij):
        cel = tbl.cell(i, j)
        cel.text = waarde
        lijn_uit(cel, rechts=(j > 0))        # labels links, bedragen rechts

stijl_tabel(tbl, totaalrij=True, arcering=True)
```

`stijl_tabel()` zet de koprij donkerblauw met witte bold tekst, datarijen wit met optionele
lichte arcering, en de laatste rij als totaalrij in bold donkerblauw.

**Signaalkleur op een variantiecel:**

```python
cel = tbl.cell(2, 3)
for p in cel.text_frame.paragraphs:
    for r in p.runs:
        r.font.color.rgb = signaal(-120_000, gunstig_is_positief=True, drempel=50_000)
```

**Belangrijk:** python-pptx past standaard een Office-tabelstijl toe met blauwe banding die niet
in de huisstijl zit. `stijl_tabel()` overschrijft elke cel expliciet; roep hem altijd aan.

## KPI-tegels

```python
kolommen, rijen = 4, 2
breedte, hoogte = Cm(7.2), Cm(4.2)
x0, y0, tussen = Cm(1.70), Cm(6.0), Cm(0.6)

for n, k in enumerate(kpis):
    i, j = divmod(n, kolommen)
    kpi_tegel(
        slide,
        x0 + j * (breedte + tussen),
        y0 + i * (hoogte + tussen),
        breedte, hoogte,
        k["naam"],
        bedrag(k["waarde"], "mln", toon_eenheid=True),
        [("vs budget", procent(k["vs_budget"], teken=True),
          signaal(k["vs_budget"])),
         ("vs LY", procent(k["vs_ly"], teken=True),
          signaal(k["vs_ly"]))],
    )
```

## Getalnotatie

Gebruik altijd de helpers, nooit handmatige f-strings — dat is de snelste manier om een deck met
twee notatieconventies te krijgen.

| Functie | Voorbeeld | Uitvoer |
|---|---|---|
| `bedrag(4238917, "mln")` | miljoenen, tabelgebruik | `€ 4,2` |
| `bedrag(4238917, "mln", toon_eenheid=True)` | losstaand cijfer | `€ 4,2 mln` |
| `bedrag(-1234567, "k", haakjes=True)` | tabelconventie negatief | `(€ 1.235)` |
| `procent(0.082, teken=True)` | variantie | `+8,2%` |
| `procentpunt(0.02)` | margeverschil | `+2,0 pp` |
| `signaal(-120000)` | oordeelskleur | `#C56603` |

## Lettertype-inbedding

Roboto is geen standaard Office-lettertype. Op een pc zonder Roboto valt PowerPoint terug op een
vervanger en verschuift de hele lay-out. Twee opties:

1. Adviseer de ontvangers Roboto te installeren (gratis, Google Fonts) — de juiste oplossing voor
   interne decks.
2. Lever bij externe verspreiding een PDF naast het `.pptx`. Een PDF bevat de lettertypen en toont
   bij iedereen hetzelfde.

python-pptx kan geen lettertypen inbedden. Als het deck extern gaat en het `.pptx` bewerkbaar
moet blijven, gebruik dan `Arial` (`FONT_FALLBACK`) en meld die afwijking.

## Het logo

De logobestanden staan in `assets/`. De helper `logo()` kiest de kleurvariant, plaatst het
rechtsboven op de maten uit het template en schaalt proportioneel.

```python
# Witte inhoudslide -> blauw logo, standaardpositie rechtsboven
logo(slide)

# Gekleurde of donkere achtergrond -> wit logo
logo(slide, achtergrond=DONKERBLAUW)

# Fotografie: de achtergrondkleur volgt niet uit een vlak, dus forceer handmatig
logo(slide, donker=True)

# Afsluitpagina, groot
logo(slide, achtergrond=DONKERBLAUW, groot=True)
```

`logo_variant()` geeft alleen de keuze terug (`"blauw"` of `"wit"`) als je zelf wilt plaatsen,
en `logo_pad()` het pad naar het bestand. Met `vrije_ruimte=True` krijg je de versie met
ingebouwde marge, die één-op-één in de plaatsingskaders van het template past.

**Volgorde van toevoegen.** python-pptx plaatst vormen in de volgorde waarin je ze toevoegt.
Zet het achtergrondvlak van een divider dus neer *voordat* je het logo plaatst, anders verdwijnt
het logo eronder.

**Schalen.** Geef hooguit een breedte mee; de hoogte volgt uit de vaste verhouding 5,481 : 1.
Onder 3,0 cm breedte geeft de helper een fout in plaats van stilzwijgend een onleesbaar logo te
plaatsen — laat het logo in dat geval weg.

**SVG.** PowerPoint 2016 en nieuwer kan SVG tonen, maar python-pptx kan het niet invoegen.
Gebruik daar de PNG's. De SVG's zijn bedoeld voor HTML-dashboards, drukwerk en handmatig invoegen
in PowerPoint.

**Conflict met inhoud.** Het logo staat op dezelfde hoogte als de rechterbovenhoek van het
contentvlak. Loopt een grafiek of tabel daar doorheen, laat het logo dan weg op die slide in
plaats van het te verschuiven.

## Controle na het genereren

Draai dit script op het opgeleverde bestand. Het rapporteert in plaats van te crashen, zodat je
alle bevindingen in één keer ziet.

```python
import re, zipfile

TOEGESTANE_FONTS = {"Roboto", "Roboto Light", "Roboto Thin", "Roboto Medium",
                    "Roboto Black", "Arial"}
DATAVOLGORDE_HEX = ["134D71", "238ACB", "56BEEC", "C56603", "E38900",
                    "7F7F7F", "BFBFBF"]

def controleer(pad):
    z = zipfile.ZipFile(pad)
    meldingen = []

    def lees(naam):
        return z.read(naam).decode("utf-8", "ignore")

    # 1. Eerste datareeks van elke grafiek is donkerblauw.
    #    In een grafiek die via een themakleur is ingekleurd staat er geen
    #    srgbClr maar schemeClr val="tx2" — dat is óók donkerblauw en dus goed.
    for naam in sorted(n for n in z.namelist()
                       if re.match(r"ppt/charts/chart\d+\.xml$", n)):
        d = lees(naam)
        eerste = re.search(r'<c:ser>.*?</c:ser>', d, re.S)
        if not eerste:
            continue
        s = eerste.group(0)
        srgb = re.search(r'srgbClr val="([0-9A-Fa-f]{6})"', s)
        scheme = re.search(r'schemeClr val="(tx2|dk2)"', s)
        if scheme:
            continue
        if not srgb or srgb.group(1).upper() != "134D71":
            meldingen.append(
                f"{naam}: reeks 1 is niet donkerblauw "
                f"({srgb.group(1) if srgb else 'geen expliciete kleur'})")

    # 2. Geen vreemde lettertypen. Scan alleen wat je zelf hebt geschreven:
    #    slides, layouts en masters. Het thema van een blanco python-pptx
    #    presentatie bevat tientallen Office-fonts en is geen fout.
    fonts = set()
    for naam in z.namelist():
        if re.match(r"ppt/(slides|slideLayouts|slideMasters|charts)/.*\.xml$", naam):
            fonts |= set(re.findall(r'<a:latin typeface="([^"+][^"]*)"', lees(naam)))
    vreemd = fonts - TOEGESTANE_FONTS
    if vreemd:
        meldingen.append(f"vreemde lettertypen: {sorted(vreemd)}")

    # 3. Geen resterende placeholdertekst
    tekst = " ".join(lees(n) for n in z.namelist()
                     if re.match(r"ppt/slides/slide\d+\.xml$", n))
    for verboden in ("Lorem ipsum", "Click to edit", "Add text here",
                     "You can replace this text", "Edit text here",
                     "Your Text Here", "SECTION HEADER", "Heading Title"):
        if verboden in tekst:
            meldingen.append(f"placeholdertekst blijven staan: '{verboden}'")

    # 4. Geen zwart in tekst of vormen — de huisstijl gebruikt #3F3F3F
    for naam in sorted(n for n in z.namelist()
                       if re.match(r"ppt/slides/slide\d+\.xml$", n)):
        if 'srgbClr val="000000"' in lees(naam):
            meldingen.append(f"{naam}: bevat zwart #000000")

    return meldingen

for m in controleer("output.pptx"):
    print("LET OP:", m)
```

**Bij Route A verwacht je meldingen uit het template zelf.** De templategrafieken zijn ingekleurd
met themakleuren en met het secundaire palet, en de voorbeeldslides staan vol placeholdertekst
en zwarte vormen. Verwijder eerst alle voorbeeldslides; wat daarna nog gemeld wordt gaat over
jouw eigen slides.

Loop daarna nog de inhoudelijke checklist uit `SKILL.md` af. De technische controle zegt niets
over of het deck een besluit ondersteunt — dat blijft handwerk.
