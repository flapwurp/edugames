"""Bild-Werkstatt für labor/03-bilder: macht aus den Originalen (werkzeug/original/) spielfertige Dateien (assets/).

Schritte:
  1. Nilkarte, Delta, Barken, Murchison: zuschneiden/verkleinern, als WebP speichern (klein, iPad-Safari kann es).
  2. Gizeh-Panorama: Straße, Fahrzeuge und Kiste entfernen (Pixel von daneben übernehmen bzw. Inpainting),
     Pyramiden über Umriss + Farbe freistellen (Himmel und Dunst werden durchsichtig), Boden als eigene Ebene.
  3. Menna-Malerei: zusätzlich eine „Umzeichnung“ (nur die Linien) als durchsichtige Ebene.

Aufruf aus dem Repo-Ordner:  python3 labor/03-bilder/werkzeug/bilder.py
Abhängigkeiten (nur für dieses Werkzeug, nicht für die Seite): Pillow, numpy, opencv-python
"""
import json
from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

HIER = Path(__file__).resolve().parent
ORIG = HIER / "original"
OUT = HIER.parent / "assets"


def webp(img, name, q=82):
    img.save(OUT / name, "WEBP", quality=q, method=6)
    return (OUT / name).stat().st_size


def einfach():
    groessen = {}
    groessen["nil-gesamt.webp"] = webp(Image.open(ORIG / "nil-gesamt.jpg"), "nil-gesamt.webp", 86)
    groessen["nil-delta.webp"] = webp(Image.open(ORIG / "nil-delta.jpg"), "nil-delta.webp", 82)
    for n in ("sonnenbarke-1", "sonnenbarke-4"):
        groessen[f"{n}.webp"] = webp(Image.open(ORIG / f"{n}.jpg"), f"{n}.webp", 80)
    m = Image.open(ORIG / "murchison-falls.jpg")
    m = m.resize((1200, round(1200 * m.height / m.width)), Image.LANCZOS)
    groessen["murchison-falls.webp"] = webp(m, "murchison-falls.webp", 78)
    return groessen


def strecke(punkte, x):
    """Lineare Interpolation einer Polylinie [(x, y), …] an Stelle x."""
    for (x0, y0), (x1, y1) in zip(punkte, punkte[1:]):
        if x0 <= x <= x1:
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return punkte[0][1] if x < punkte[0][0] else punkte[-1][1]


def gizeh():
    im = np.array(Image.open(ORIG / "gizeh-panorama.jpg").convert("RGB"))
    H, W = im.shape[:2]

    # 1) Straße: jede Spalte bekommt im Straßenband die Sandpixel von knapp unterhalb
    strasse = [(0, 850), (500, 801), (1000, 752), (1300, 713), (1500, 683), (1700, 668), (1905, 657)]
    for x in range(0, 1906):
        yc = strecke(strasse, x)
        h = int(round(20 - 10 * x / 1905))
        y0, y1 = int(yc - h), int(yc + h) + 1
        off = 2 * h + 8
        if y1 + off > H: off = -off          # am unteren Bildrand Sand von oberhalb nehmen
        im[y0:y1, x] = im[y0 + off:y1 + off, x]
    # Naht weichzeichnen
    band = np.zeros((H, W), np.uint8)
    for x in range(0, 1906):
        yc = strecke(strasse, x); h = 20 - 10 * x / 1905
        for yy in (yc - h, yc + h):
            band[int(yy) - 2:int(yy) + 3, x] = 255
    weich = cv2.GaussianBlur(im, (5, 5), 0)
    im[band > 0] = weich[band > 0]

    # 2) Kiste, Fahrzeuge, Personen: Pixel von daneben übernehmen (Stempel), Ränder weich überblenden
    for (x0, y0, x1, y1) in [(0, 603, 58, 636), (170, 584, 264, 637), (696, 610, 792, 640), (898, 610, 948, 642),
                             (978, 608, 1024, 642), (1066, 610, 1152, 640),
                             (1896, 636, 1962, 662), (2036, 640, 2054, 664), (1342, 644, 1406, 694)]:
        w = x1 - x0; dx = -(w + 14) if x0 - w - 14 >= 0 else (w + 14)
        xa, xb = max(0, x0 - 6), min(W, x1 + 6)
        quelle = im[y0 - 6:y1 + 6, xa + dx:xb + dx].astype(np.float32)
        ziel = im[y0 - 6:y1 + 6, xa:xb].astype(np.float32)
        hh, ww = ziel.shape[:2]
        ry = np.minimum(np.arange(hh), np.arange(hh)[::-1]); rx = np.minimum(np.arange(ww), np.arange(ww)[::-1])
        f = np.clip(np.minimum(ry[:, None], rx[None, :]) / 6, 0, 1)[..., None]
        im[y0 - 6:y1 + 6, xa:xb] = (quelle * f + ziel * (1 - f)).astype(np.uint8)

    # 3) Horizont (Oberkante des Bodens)
    horizont = [(0, 600), (620, 620), (1765, 643), (2100, 660), (2500, 690), (2775, 700), (3450, 702), (3690, 735), (3840, 742)]
    yy, xx = np.mgrid[0:H, 0:W]
    hor = np.array([strecke(horizont, x) for x in range(W)])
    boden_a = np.clip((yy - hor[None, :] + 2) / 4, 0, 1)  # weiche Kante über 4 px

    # 4) Pyramiden: Umriss (Polygon) × Farbe (Stein ist deutlich rötlicher als Himmel/Dunst)
    r, g, b = [im[..., i].astype(np.float32) for i in range(3)]
    stein = np.clip((r - b - 6) / 12, 0, 1)

    masken = []   # Umrisse aller Pyramiden: dort bekommt der Boden ein Loch

    # Polygone enden genau an der Fußlinie der Pyramide; darunter gehört alles zum Boden.
    # So bewegt sich jede Pyramide als Ganzes und bricht beim Wischen nicht durch.
    def ebene(polygone, name):
        m = Image.new("L", (W, H), 0)
        d = ImageDraw.Draw(m)
        for p in polygone: d.polygon(p, fill=255)
        innen = cv2.erode(np.array(m), np.ones((21, 21), np.uint8)).astype(np.float32) / 255  # sicher Stein
        m = np.array(m.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
        # Nur am Rand entscheidet die Farbe (Stufenkanten), innen ist alles Stein
        a = m * np.maximum(stein, innen)
        masken.append(m)
        ys, xs = np.where(a > 0.02)
        x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
        rgba = np.dstack([im[y0:y1, x0:x1], (a[y0:y1, x0:x1] * 255).astype(np.uint8)])
        size = webp(Image.fromarray(rgba, "RGBA"), name, 84)
        return {"datei": name, "x": int(x0), "y": int(y0), "w": int(x1 - x0), "h": int(y1 - y0), "bytes": size}

    vorne = ebene([[(100, 606), (513, 236), (770, 460), (1197, 14), (1770, 646), (620, 630)]], "gizeh-cheops-chephren.webp")
    hinten = ebene([[(2768, 704), (3128, 294), (3455, 702)]], "gizeh-mykerinos.webp")
    # Boden: unter den Pyramiden beginnt er erst an der Fußlinie (kein Loch, kein Pyramidenrest im Boden).
    # Die kleine Nebenpyramide am rechten Rand bleibt Teil des Bodens.
    fuss = {**{x: strecke([(100, 606), (620, 630), (1770, 646)], x) for x in range(100, 1771)},
            **{x: strecke([(2768, 704), (3455, 702)], x) for x in range(2768, 3456)}}
    hor2 = np.array([max(hor[x], fuss.get(x, -1)) for x in range(W)])
    boden_a = np.clip((yy - hor2[None, :] + 2) / 4, 0, 1)
    klein = Image.new("L", (W, H), 0)
    ImageDraw.Draw(klein).polygon([(3672, 770), (3812, 600), (3840, 626), (3840, 772)], fill=255)
    klein = np.array(klein.filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
    boden_a = np.maximum(boden_a, klein * stein)
    y_min_boden = 598
    y0 = min(int(min(y for _, y in horizont)) - 4, y_min_boden)
    rgba = np.dstack([im[y0:], (boden_a[y0:] * 255).astype(np.uint8)])
    boden = {"datei": "gizeh-boden.webp", "x": 0, "y": y0, "w": W, "h": H - y0,
             "bytes": webp(Image.fromarray(rgba, "RGBA"), "gizeh-boden.webp", 80)}
    # Spitzen der Pyramiden (für die Lichtrichtung in Schritt 5): x der Spitze, Bereich in x
    spitzen = [{"name": "Cheops", "x": 513, "von": 0, "bis": 770}, {"name": "Chephren", "x": 1197, "von": 770, "bis": 2000},
               {"name": "Mykerinos", "x": 3128, "von": 2000, "bis": 3840}]
    meta = {"breite": W, "hoehe": H, "horizont": horizont, "spitzen": spitzen, "ebenen": {"vorne": vorne, "hinten": hinten, "boden": boden}}
    (OUT / "gizeh.json").write_text(json.dumps(meta, indent=1))
    Image.fromarray(im).save("/tmp/gizeh_repariert.jpg", quality=90)
    return meta


def menna():
    bild = Image.open(ORIG / "menna-013.jpg").convert("RGB")
    size = webp(bild, "menna-013.webp", 84)
    g = cv2.cvtColor(np.array(bild), cv2.COLOR_RGB2GRAY)
    g = cv2.bilateralFilter(g, 9, 40, 9)
    linien = cv2.adaptiveThreshold(g, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY_INV, 17, 11)
    n, lab, stats, _ = cv2.connectedComponentsWithStats(linien, 8)
    klein = stats[:, cv2.CC_STAT_AREA] < 40          # Krümel entfernen
    klein[0] = False
    linien[np.isin(lab, np.where(klein)[0])] = 0
    linien = cv2.GaussianBlur(linien, (3, 3), 0)
    rgba = np.zeros((*linien.shape, 4), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3] = 40, 26, 14, linien
    size2 = webp(Image.fromarray(rgba, "RGBA"), "menna-013-linien.webp", 80)
    return {"menna-013.webp": size, "menna-013-linien.webp": size2}


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    print(einfach())
    print(json.dumps(gizeh(), indent=1))
    print(menna())
