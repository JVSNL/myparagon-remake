"""
Paragon huisstijl — constanten en helpers voor python-pptx.

Gebruik:
    import sys; sys.path.insert(0, "<pad naar skill>/scripts")
    from paragon_stijl import *

Bevat:
  - Kleurconstanten (primair, secundair, signaal) als RGBColor
  - De vaste kleurvolgorde voor datavisualisatie
  - Typografie- en maatconstanten
  - Getalnotatie in Nederlandse conventie
  - Helpers voor grafiek-, tabel- en KPI-tegelopmaak

Alle kleuren, maten en puntgroottes zijn overgenomen uit het officiele
Paragon-template. Drie dingen staan niet in het template en zijn afgeleide
Paragon-standaarden: de tabelopmaak (het template heeft geen tabelstijl),
de signaalkleuren voor varianties, en de tint TABEL_ARCERING. Ze zijn als
zodanig gemarkeerd.

Vereist: python-pptx
"""

from pptx.util import Cm, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR

# ---------------------------------------------------------------------------
# Kleuren
# ---------------------------------------------------------------------------

# Primair palet (posities 1 t/m 7 in de datavisualisatievolgorde)
DONKERBLAUW   = RGBColor(0x13, 0x4D, 0x71)   # #134D71
ROYAL_BLUE    = RGBColor(0x23, 0x8A, 0xCB)   # #238ACB
SKY_BLUE      = RGBColor(0x56, 0xBE, 0xEC)   # #56BEEC
BURNT_SIENNA  = RGBColor(0xC5, 0x66, 0x03)   # #C56603
ORANJE        = RGBColor(0xE3, 0x89, 0x00)   # #E38900
DONKERGRIJS   = RGBColor(0x7F, 0x7F, 0x7F)   # #7F7F7F
LICHTGRIJS    = RGBColor(0xBF, 0xBF, 0xBF)   # #BFBFBF

# Secundair palet (posities 8 t/m 14)
DARK_SAGE     = RGBColor(0x00, 0x70, 0x59)   # #007059
LIGHT_SAGE    = RGBColor(0x6C, 0xA8, 0x85)   # #6CA885
BERRY         = RGBColor(0x85, 0x40, 0x6B)   # #85406B
ROSE          = RGBColor(0xE2, 0xA9, 0xB1)   # #E2A9B1
COFFEE        = RGBColor(0x8E, 0x75, 0x60)   # #8E7560
CARAMEL       = RGBColor(0xCF, 0xA9, 0x89)   # #CFA989
SAND          = RGBColor(0xEF, 0xD1, 0x8F)   # #EFD18F

# Systeemkleuren
TEKST         = RGBColor(0x3F, 0x3F, 0x3F)   # #3F3F3F — standaard tekstkleur, geen zwart
WIT           = RGBColor(0xFF, 0xFF, 0xFF)

# Afgeleide tint, niet uit het merkpalet: alleen als rij-arcering in tabellen.
TABEL_ARCERING = RGBColor(0xF2, 0xF6, 0xF9)  # #F2F6F9 — 4% donkerblauw op wit

# Signaalkleuren voor financiele slides
GUNSTIG       = DARK_SAGE
AANDACHT      = ORANJE
ONGUNSTIG     = BURNT_SIENNA
NEUTRAAL      = DONKERGRIJS

# Vaste volgorde voor datareeksen. LET OP: PowerPoint start automatisch bij
# ROYAL_BLUE (accent1). Reeks 1 moet altijd handmatig op DONKERBLAUW.
DATAVOLGORDE = [
    DONKERBLAUW, ROYAL_BLUE, SKY_BLUE, BURNT_SIENNA, ORANJE,
    DONKERGRIJS, LICHTGRIJS,
    DARK_SAGE, LIGHT_SAGE, BERRY, ROSE, COFFEE, CARAMEL, SAND,
]

DIVIDER_KLEUREN = {
    "donkerblauw": DONKERBLAUW,
    "royal blue": ROYAL_BLUE,
    "sky blue": SKY_BLUE,
    "burnt sienna": BURNT_SIENNA,
    "oranje": ORANJE,
    "donkergrijs": DONKERGRIJS,
    "lichtgrijs": LICHTGRIJS,
}


def reekskleur(i):
    """Kleur voor datareeks i (0-based) volgens de vaste huisstijlvolgorde."""
    return DATAVOLGORDE[i % len(DATAVOLGORDE)]


def signaal(waarde, gunstig_is_positief=True, drempel=0.0):
    """Signaalkleur op basis van een variantie.

    drempel: absolute waarde waaronder de variantie als neutraal geldt.
    """
    if abs(waarde) <= drempel:
        return TEKST
    positief = waarde > 0
    if not gunstig_is_positief:
        positief = not positief
    return GUNSTIG if positief else ONGUNSTIG


# ---------------------------------------------------------------------------
# Typografie en maten
# ---------------------------------------------------------------------------

FONT = "Roboto"
FONT_LIGHT = "Roboto Light"       # slidetitels, cover-subtitel
FONT_THIN = "Roboto Thin"         # subtitel onder de slidetitel
FONT_FALLBACK = "Arial"

PT_TITEL         = Pt(24)
PT_SUBTITEL      = Pt(16)
PT_BODY          = Pt(12)
PT_TABEL         = Pt(10)
PT_TABEL_KOP     = Pt(10)
PT_GRAFIEK       = Pt(8)
PT_GRAFIEKTITEL  = Pt(12)
PT_VOETNOOT      = Pt(8)
PT_PAGINANR      = Pt(8)
PT_COVER_TITEL   = Pt(32)
PT_COVER_SUB     = Pt(24)
PT_COVER_DATUM   = Pt(14)
PT_DIVIDER       = Pt(54)
PT_KPI_CIJFER    = Pt(28)
PT_KPI_LABEL     = Pt(10)
PT_KPI_VERGL     = Pt(9)

LNSPC_KOP = Pt(28.8)              # vaste regelafstand van het kopblok

SLIDE_B = Emu(12192000)           # exact zoals in het template (33,87 cm)
SLIDE_H = Emu(6858000)            # 19,05 cm

MARGE_LINKS   = Cm(1.70)
KOP_X         = Cm(1.70)
KOP_Y         = Cm(1.60)
KOP_B         = Cm(10.21)
KOP_H         = Cm(2.54)
INHOUD_Y      = Cm(4.83)
PAGINANR_X    = Cm(25.80)
PAGINANR_Y    = Cm(17.65)

# Chart Slide: tekst links, grafiek volvlaks rechts
CHART_TEKST   = dict(x=Cm(1.04), y=Cm(4.83), w=Cm(14.20), h=Cm(12.70))
CHART_VLAK    = dict(x=Cm(16.94), y=Cm(0.00), w=Cm(16.94), h=Cm(19.05))

# Text and chart: kicker boven, tekst links, grafiek rechts, accentbalk links
TC_KICKER     = dict(x=Cm(4.22), y=Cm(4.37), w=Cm(21.80), h=Cm(2.30))
TC_ACCENTBALK = dict(x=Cm(0.00), y=Cm(7.16), w=Cm(3.58), h=Cm(8.97))
TC_TEKST      = dict(x=Cm(4.22), y=Cm(7.19), w=Cm(10.30), h=Cm(8.97))
TC_GRAFIEK    = dict(x=Cm(16.28), y=Cm(7.19), w=Cm(15.70), h=Cm(8.97))


# ---------------------------------------------------------------------------
# Getalnotatie (Nederlandse conventie)
# ---------------------------------------------------------------------------

def _nl(getal, decimalen):
    s = f"{getal:,.{decimalen}f}"
    return s.replace(",", "\x00").replace(".", ",").replace("\x00", ".")


def bedrag(waarde, eenheid="k", decimalen=None, valuta=True, haakjes=False,
           toon_eenheid=False):
    """Bedrag in Paragon-notatie.

    eenheid: "" (euro), "k" (duizenden), "mln" (miljoenen)
    haakjes: True zet negatieve bedragen tussen haakjes (tabelconventie)
    toon_eenheid: True hangt "k" of "mln" achter het bedrag. Gebruik dit voor
        losstaande cijfers zoals KPI-tegels. In tabellen hoort de eenheid in
        de kop, niet per cel: laat de standaard False staan.
    """
    deler = {"": 1, "k": 1_000, "mln": 1_000_000}[eenheid]
    if decimalen is None:
        decimalen = 1 if eenheid == "mln" else 0
    v = waarde / deler
    negatief = v < 0
    s = _nl(abs(v), decimalen)
    if valuta:
        s = "€ " + s
    if toon_eenheid and eenheid:
        s = f"{s} {eenheid}"
    if negatief:
        s = f"({s})" if haakjes else "− " + s
    return s


def procent(waarde, decimalen=1, teken=False):
    """Percentage in Paragon-notatie. waarde als 0.082 -> '8,2%'."""
    v = waarde * 100
    s = _nl(abs(v), decimalen) + "%"
    if v < 0:
        return "−" + s
    return ("+" + s) if teken else s


def procentpunt(waarde, decimalen=1):
    """Verschil in procentpunten. waarde als 0.02 -> '+2,0 pp'."""
    v = waarde * 100
    s = _nl(abs(v), decimalen) + " pp"
    return ("−" if v < 0 else "+") + s


# ---------------------------------------------------------------------------
# Opmaakhelpers
# ---------------------------------------------------------------------------

def zet_font(run_of_frame, grootte=None, kleur=TEKST, bold=False, font=FONT):
    """Zet huisstijlfont op een run, paragraph of text_frame."""
    runs = []
    if hasattr(run_of_frame, "paragraphs"):
        for p in run_of_frame.paragraphs:
            runs.extend(p.runs)
    elif hasattr(run_of_frame, "runs"):
        runs = list(run_of_frame.runs)
    else:
        runs = [run_of_frame]
    for r in runs:
        r.font.name = font
        if grootte is not None:
            r.font.size = grootte
        r.font.bold = bold
        r.font.color.rgb = kleur


def kop(slide, titel, subtitel=None, breedte=None):
    """Plaats het kopblok. Staat bewust niet in de master: per slide toevoegen.

    Titel in Roboto Light 24 pt donkerblauw, subtitel in Roboto Thin 16 pt
    tekstgrijs, met de vaste regelafstand van 28,8 pt uit het template.
    Standaardbreedte 10,21 cm; geef een grotere breedte mee als de titel
    langer is (het kopblok mag per slide verschuiven en verbreden).
    """
    tb = slide.shapes.add_textbox(KOP_X, KOP_Y, breedte or KOP_B, KOP_H)
    tf = tb.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.line_spacing = LNSPC_KOP
    r = p.add_run(); r.text = titel
    r.font.name = FONT_LIGHT; r.font.size = PT_TITEL; r.font.color.rgb = DONKERBLAUW
    if subtitel:
        p2 = tf.add_paragraph()
        p2.line_spacing = LNSPC_KOP
        r2 = p2.add_run(); r2.text = subtitel
        r2.font.name = FONT_THIN; r2.font.size = PT_SUBTITEL; r2.font.color.rgb = TEKST
    return tb


def paginanummer(slide, nummer):
    """Paginanummer rechtsonder: Roboto 8 pt, lichtgrijs #BFBFBF."""
    tb = slide.shapes.add_textbox(PAGINANR_X, PAGINANR_Y, Cm(7.62), Cm(1.0))
    p = tb.text_frame.paragraphs[0]
    p.alignment = PP_ALIGN.RIGHT
    r = p.add_run(); r.text = str(nummer)
    r.font.name = FONT; r.font.size = PT_PAGINANR; r.font.color.rgb = LICHTGRIJS
    return tb


def stijl_grafiek(chart, kleuren=None, legenda=True, datalabels=False,
                  rasterlijnen=True):
    """Pas de Paragon-grafiekopmaak toe.

    Zet reekskleuren volgens de vaste volgorde (start op donkerblauw),
    lettertype Roboto 8 pt, legenda onder, rasterlijnen licht.
    """
    from pptx.enum.chart import XL_LEGEND_POSITION

    kleuren = kleuren or DATAVOLGORDE
    for i, serie in enumerate(chart.plots[0].series):
        serie.format.fill.solid()
        serie.format.fill.fore_color.rgb = kleuren[i % len(kleuren)]
        serie.format.line.fill.background()

    chart.font.name = FONT
    chart.font.size = PT_GRAFIEK
    chart.font.color.rgb = TEKST

    chart.has_legend = legenda
    if legenda:
        chart.legend.position = XL_LEGEND_POSITION.BOTTOM
        chart.legend.include_in_layout = False

    try:
        plot = chart.plots[0]
        plot.gap_width = 219
        plot.overlap = -27
        plot.has_data_labels = datalabels
        if datalabels:
            dl = plot.data_labels
            dl.font.name = FONT
            dl.font.size = PT_GRAFIEK
            dl.font.color.rgb = TEKST
    except (AttributeError, ValueError):
        pass

    try:
        va = chart.value_axis
        va.has_major_gridlines = rasterlijnen and not datalabels
        if va.has_major_gridlines:
            va.major_gridlines.format.line.color.rgb = LICHTGRIJS
            va.major_gridlines.format.line.width = Pt(0.5)
        va.format.line.color.rgb = LICHTGRIJS
        chart.category_axis.format.line.color.rgb = LICHTGRIJS
    except (AttributeError, ValueError):
        pass

    return chart


def stijl_tabel(tabel, totaalrij=False, arcering=False):
    """Pas de Paragon-tabelopmaak toe op een python-pptx GraphicFrame.table."""
    n_rijen = len(tabel.rows)

    for j, cel in enumerate(tabel.rows[0].cells):
        cel.fill.solid()
        cel.fill.fore_color.rgb = DONKERBLAUW
        cel.vertical_anchor = MSO_ANCHOR.MIDDLE
        for p in cel.text_frame.paragraphs:
            for r in p.runs:
                r.font.name = FONT
                r.font.size = PT_TABEL_KOP
                r.font.bold = True
                r.font.color.rgb = WIT

    for i in range(1, n_rijen):
        laatste = (i == n_rijen - 1) and totaalrij
        for cel in tabel.rows[i].cells:
            cel.fill.solid()
            if arcering and i % 2 == 0 and not laatste:
                cel.fill.fore_color.rgb = TABEL_ARCERING
            else:
                cel.fill.fore_color.rgb = WIT
            cel.vertical_anchor = MSO_ANCHOR.MIDDLE
            for p in cel.text_frame.paragraphs:
                for r in p.runs:
                    r.font.name = FONT
                    r.font.size = PT_TABEL
                    r.font.bold = laatste
                    r.font.color.rgb = DONKERBLAUW if laatste else TEKST
    return tabel


def lijn_uit(cel, rechts=True):
    """Uitlijning van een tabelcel: bedragen rechts, labels links."""
    for p in cel.text_frame.paragraphs:
        p.alignment = PP_ALIGN.RIGHT if rechts else PP_ALIGN.LEFT


def kpi_tegel(slide, x, y, b, h, naam, waarde, vergelijkingen=()):
    """KPI-tegel: naam, hoofdcijfer, en tot twee vergelijkingen met signaalkleur.

    vergelijkingen: iterable van (label, tekst, kleur)
    """
    from pptx.enum.shapes import MSO_SHAPE

    kader = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, b, h)
    kader.fill.solid()
    kader.fill.fore_color.rgb = WIT
    kader.line.color.rgb = LICHTGRIJS
    kader.line.width = Pt(0.75)
    kader.shadow.inherit = False

    tb = slide.shapes.add_textbox(x + Cm(0.4), y + Cm(0.3), b - Cm(0.8), h - Cm(0.6))
    tf = tb.text_frame
    tf.word_wrap = True

    p = tf.paragraphs[0]
    r = p.add_run(); r.text = naam
    r.font.name = FONT; r.font.size = PT_KPI_LABEL; r.font.color.rgb = DONKERGRIJS

    p = tf.add_paragraph()
    r = p.add_run(); r.text = waarde
    r.font.name = FONT; r.font.size = PT_KPI_CIJFER
    r.font.bold = True; r.font.color.rgb = DONKERBLAUW

    for label, tekst, kleur in vergelijkingen:
        p = tf.add_paragraph()
        r1 = p.add_run(); r1.text = f"{label}   "
        r1.font.name = FONT; r1.font.size = PT_KPI_VERGL
        r1.font.color.rgb = DONKERGRIJS
        r2 = p.add_run(); r2.text = tekst
        r2.font.name = FONT; r2.font.size = PT_KPI_VERGL
        r2.font.bold = True; r2.font.color.rgb = kleur

    return kader, tb


def voetnoot(slide, tekst, y=None):
    """Bronvermelding linksonder: 8 pt, donkergrijs."""
    y = y if y is not None else Cm(17.65)
    tb = slide.shapes.add_textbox(MARGE_LINKS, y, Cm(22), Cm(0.9))
    p = tb.text_frame.paragraphs[0]
    r = p.add_run(); r.text = tekst
    r.font.name = FONT_LIGHT; r.font.size = PT_VOETNOOT
    r.font.color.rgb = DONKERGRIJS
    return tb


# ---------------------------------------------------------------------------
# Logo
# ---------------------------------------------------------------------------

# Beeldmerk 581 x 106 px -> verhouding 5,481 : 1
LOGO_RATIO = 581 / 106

# Standaardplaatsing rechtsboven, overgenomen uit het template
LOGO_X = Cm(27.97)
LOGO_Y = Cm(1.19)
LOGO_B = Cm(4.79)
LOGO_H = Cm(0.87)

# Groot, voor de afsluitpagina
LOGO_GROOT = dict(x=Cm(21.65), y=Cm(8.70), b=Cm(9.85), h=Cm(1.79))

LOGO_MIN_B = Cm(3.0)   # ondergrens: daaronder lopen de strepen in de bol dicht

# Achtergronden waarop het witte logo hoort. Op sky blue en lichtgrijs blijft
# het logo blauw — wit heeft daar te weinig contrast.
LOGO_WIT_OP = {
    str(DONKERBLAUW), str(ROYAL_BLUE), str(BURNT_SIENNA),
    str(ORANJE), str(DONKERGRIJS),
}


def logo_variant(achtergrond=None, donker=None):
    """Kies 'wit' of 'blauw' op basis van de achtergrond.

    achtergrond: RGBColor van het vlak waarop het logo komt. None = wit.
    donker: forceer handmatig (True -> wit, False -> blauw), bijvoorbeeld
        bij fotografie, waar de achtergrondkleur niet uit een vlak volgt.
    """
    if donker is not None:
        return "wit" if donker else "blauw"
    if achtergrond is None:
        return "blauw"
    return "wit" if str(achtergrond) in LOGO_WIT_OP else "blauw"


def logo_pad(variant="blauw", assets_dir=None, vrije_ruimte=False):
    """Pad naar het logobestand in assets/.

    vrije_ruimte=True geeft de versie met ingebouwde marge (verhouding 3,387),
    die exact in de plaatsingskaders van het template past.
    """
    from pathlib import Path
    if assets_dir is None:
        assets_dir = Path(__file__).resolve().parent.parent / "assets"
    achtervoegsel = "-vrije-ruimte" if vrije_ruimte else ""
    pad = Path(assets_dir) / f"paragon-logo-{variant}{achtervoegsel}.png"
    if not pad.exists():
        raise FileNotFoundError(f"Logobestand niet gevonden: {pad}")
    return str(pad)


def logo(slide, achtergrond=None, donker=None, x=None, y=None, breedte=None,
         groot=False, assets_dir=None):
    """Plaats het logo rechtsboven in de juiste kleurvariant.

    Schaalt altijd proportioneel: geef hooguit een breedte mee, de hoogte
    volgt. Onder de minimale breedte van 3,0 cm wordt een fout gegeven in
    plaats van stilzwijgend een onleesbaar logo te plaatsen.
    """
    variant = logo_variant(achtergrond, donker)
    if groot:
        x = LOGO_GROOT["x"] if x is None else x
        y = LOGO_GROOT["y"] if y is None else y
        breedte = LOGO_GROOT["b"] if breedte is None else breedte
    else:
        x = LOGO_X if x is None else x
        y = LOGO_Y if y is None else y
        breedte = LOGO_B if breedte is None else breedte

    if breedte < LOGO_MIN_B:
        raise ValueError(
            f"Logo te klein: {breedte.cm:.2f} cm breed, minimum is "
            f"{LOGO_MIN_B.cm:.1f} cm. Laat het logo liever weg dan het te verkleinen.")

    hoogte = Emu(int(breedte / LOGO_RATIO))
    return slide.shapes.add_picture(logo_pad(variant, assets_dir), x, y,
                                    breedte, hoogte)
