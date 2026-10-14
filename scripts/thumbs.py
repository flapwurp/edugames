"""Erzeugt die Vorschaubilder der Startseite (shared/thumbs/*.webp, 800 × 400) aus den laufenden Spielen.
Voraussetzung: Python mit playwright und Pillow, Webserver läuft (npm run serve).
Aufruf aus dem Repo-Ordner: python3 scripts/thumbs.py . [who-is-it-code]"""
import sys, io
from PIL import Image
from playwright.sync_api import sync_playwright

REPO = sys.argv[1]
WIO_CODE = sys.argv[2] if len(sys.argv) > 2 else "1502"
BASE = "http://localhost:8000/"
W, H = 800, 400  # 2:1


def save(png_bytes, name, fx=0.5, fy=0.5):
    im = Image.open(io.BytesIO(png_bytes)).convert("RGB")
    w, h = im.size
    if w / h > W / H:
        nw = round(h * W / H); x = round((w - nw) * fx)
        im = im.crop((x, 0, x + nw, h))
    else:
        nh = round(w * H / W); y = round((h - nh) * fy)
        im = im.crop((0, y, w, y + nh))
    im = im.resize((W, H), Image.LANCZOS)
    im.save(f"{REPO}/shared/thumbs/{name}.webp", "WEBP", quality=82, method=6)
    print(name, "ok")


def clicks(pg, sels):
    for s in sels:
        pg.click(s); pg.wait_for_timeout(300)


with sync_playwright() as p:
    b = p.chromium.launch()
    ctx = dict(device_scale_factor=2)

    # Who is it? – Personenauswahl der ratenden Person, 4 Spalten
    pg = b.new_page(viewport={"width": 1024, "height": 900}, **ctx)
    pg.goto(BASE + "who-is-it/")
    clicks(pg, ["[data-act=join]"]); pg.fill("input", WIO_CODE); clicks(pg, ["[data-act=doJoin]"])
    if pg.query_selector("[data-act=start]"):
        clicks(pg, ["[data-act=start]"])
    box = pg.evaluate("""() => {
      const grid = document.querySelector('.lineup');
      grid.style.gridTemplateColumns = 'repeat(3, 1fr)'; grid.style.width = "500px"; grid.style.margin = '0 auto';
      const r = grid.getBoundingClientRect(); return {x:r.left, y:r.top, w:r.width, h:r.height}; }""")
    pg.wait_for_timeout(200)
    h = box["h"] + 36; w = h * 2
    shot = pg.screenshot(clip={"x": box["x"] + box["w"] / 2 - w / 2, "y": box["y"] - 18, "width": w, "height": h})
    save(shot, "who-is-it")
    pg.close()

    # Reactor Rescue – Reaktorkern vom Startbildschirm (das Bedienpult soll vor dem Spiel nicht zu sehen sein)
    pg = b.new_page(viewport={"width": 1024, "height": 768}, reduced_motion="reduce", **ctx)
    pg.goto(BASE + "reactor-rescue/"); pg.wait_for_timeout(500)
    r = pg.locator(".core").bounding_box()
    h = r["height"] * 1.35; w = h * 2
    cx = r["x"] + r["width"] / 2; cy = r["y"] + r["height"] / 2
    pg.evaluate("document.querySelector('.title,.lead,.stack') && document.querySelectorAll('.title,.lead,.stack').forEach(e => e.style.visibility = 'hidden')")
    save(pg.screenshot(clip={"x": cx - w / 2, "y": max(0, cy - h / 2), "width": w, "height": h}), "reactor-rescue")
    pg.close()

    # Spot the Difference – Partyszene
    pg = b.new_page(viewport={"width": 1024, "height": 768}, **ctx)
    pg.goto(BASE + "spot-the-difference/")
    clicks(pg, ["[data-act=new]", "[data-act=level]", "[data-act=toIntro]", "[data-act=start]"])
    save(pg.screenshot(clip={"x": 26, "y": 66, "width": 972, "height": 556}), "spot-the-difference", fy=0.45)
    pg.close()

    # Im Rhythmus des Nils – Ernte am Fluss, ohne Beschriftungen
    pg = b.new_page(viewport={"width": 1150, "height": 900}, **ctx)
    pg.goto(BASE + "im-rhythmus-des-nils/galerie.html"); pg.wait_for_timeout(500)
    pg.evaluate("""async () => { const m = await import('/im-rhythmus-des-nils/scene.js');
      const F = (soil, plants) => ({ soil, plants }); const fam = (x, pose, n) => ({ x, pose, n });
      document.body.style.margin = '0';
      document.body.innerHTML = '<div id=t style="width:1150px">' + m.scene({ sky: 'schemu', water: { level: m.LEVEL.normal },
        fields: [F('gepflueg','reif'), F('gepflueg','reif'), F('gepflueg','reif')], hof: { fill: 0.85 },
        people: [fam(280,'ernten',0), fam(500,'ernten',2), fam(690,'ernten',1)] }) + '</div>'; }""")
    pg.wait_for_timeout(300)
    r = pg.locator("#t svg").bounding_box()
    save(pg.screenshot(clip={"x": 20, "y": r["y"] + 10, "width": 720, "height": 360}), "im-rhythmus-des-nils")
    pg.close()
    b.close()
