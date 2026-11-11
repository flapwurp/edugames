"""Erzeugt die Grafiken und Klänge für labor/02-engine.

Grafiken: Jede Figur ist als SVG beschrieben, wird in Chromium (Playwright) gerastert
und mit Pillow zu einem Sammelbild (Atlas) gepackt: assets/sprites.png + assets/sprites.json
im JSON-Hash-Format, das Phaser direkt laden kann. Gezeichnet wird in doppelter Größe,
im Spiel mit Faktor 0,5 angezeigt (scharf auf Retina-iPads).

Klänge: kurze WAV-Dateien, mit numpy berechnet (pling.wav, wasser.wav als Schleife).

Aufruf aus dem Repo-Ordner:  python3 labor/02-engine/werkzeug/atlas.py
"""
import asyncio, json, math, wave
from pathlib import Path
import numpy as np
from PIL import Image
from playwright.async_api import async_playwright

OUT = Path(__file__).resolve().parent.parent / "assets"

def boat(k):
    a = [-28, -10, 10, -10][k]  # Ruderwinkel je Bild
    oars = ""
    for x0 in (44, 62):
        for side in (-1, 1):
            ang = math.radians(180 + a * side if side == -1 else 180 - a)
            y0 = 28 + side * 15
            x1, y1 = x0 + math.cos(ang) * 30, y0 + side * abs(math.sin(math.radians(70))) * 22 + math.sin(ang) * 6
            oars += f'<line x1="{x0}" y1="{y0}" x2="{x1:.1f}" y2="{y1:.1f}" stroke="#4a2a12" stroke-width="2.5" stroke-linecap="round"/>'
            oars += f'<ellipse cx="{x1:.1f}" cy="{y1:.1f}" rx="5" ry="2.6" fill="#6b4220" transform="rotate({math.degrees(ang):.0f} {x1:.1f} {y1:.1f})"/>'
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="128" height="88" viewBox="-8 -16 128 88">
{oars}
<path d="M8 28 Q22 7 70 9 Q102 12 110 28 Q102 44 70 47 Q22 49 8 28Z" fill="#7a4a26" stroke="#3f230e" stroke-width="2"/>
<path d="M18 28 Q28 15 70 16 Q96 18 102 28 Q96 38 70 40 Q28 41 18 28Z" fill="#b07a44"/>
<path d="M26 22 L96 22 M24 28 L102 28 M26 34 L96 34" stroke="#8a5a2c" stroke-width="1.2" opacity=".7"/>
<path d="M34 6 Q70 18 100 50 Q66 30 30 12Z" fill="#f4ead0" stroke="#c9b48a" stroke-width="1.2"/>
<path d="M34 6 L100 50" stroke="#5a3a1a" stroke-width="2.2"/>
<circle cx="64" cy="28" r="4.5" fill="#3a2210"/>
<circle cx="30" cy="28" r="6" fill="#e8d2a8" stroke="#6b4a2a" stroke-width="1.2"/>
</svg>'''

SPRITES = {
    **{f"boat_{k}": boat(k) for k in range(4)},
    "amphora": '''<svg xmlns="http://www.w3.org/2000/svg" width="48" height="66" viewBox="0 0 48 66">
<path d="M17 4 H31 V10 Q31 13 34 15 Q44 22 42 38 Q40 52 24 63 Q8 52 6 38 Q4 22 14 15 Q17 13 17 10Z" fill="#b5653a" stroke="#6e3417" stroke-width="2"/>
<path d="M14 15 Q6 16 8 26 M34 15 Q42 16 40 26" fill="none" stroke="#6e3417" stroke-width="3" stroke-linecap="round"/>
<path d="M12 30 Q24 34 36 30" fill="none" stroke="#e9c79a" stroke-width="2.5" opacity=".8"/>
<path d="M14 40 Q24 43 34 40" fill="none" stroke="#3b1a0a" stroke-width="2" opacity=".5"/>
<ellipse cx="16" cy="26" rx="3" ry="8" fill="#f2c79c" opacity=".55"/>
<rect x="15" y="2" width="18" height="5" rx="2" fill="#8a4524"/>
</svg>''',
    "reed": '''<svg xmlns="http://www.w3.org/2000/svg" width="22" height="86" viewBox="0 0 22 86">
<path d="M11 86 Q9 50 12 14" fill="none" stroke="#557233" stroke-width="3" stroke-linecap="round"/>
<path d="M11 70 Q2 52 3 36" fill="none" stroke="#6f8f3c" stroke-width="2.5" stroke-linecap="round"/>
<path d="M11 62 Q20 46 19 30" fill="none" stroke="#7f9f46" stroke-width="2.2" stroke-linecap="round"/>
<ellipse cx="12" cy="12" rx="3.6" ry="10" fill="#7a5a2e"/>
</svg>''',
    "palm": "".join([
        '<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="-75 -75 150 150">',
        '<circle r="70" fill="#000" opacity=".12"/>',
        *[f'<path d="M0 0 Q{20*math.cos(t+0.5):.1f} {20*math.sin(t+0.5):.1f} {66*math.cos(t):.1f} {66*math.sin(t):.1f} Q{20*math.cos(t-0.5):.1f} {20*math.sin(t-0.5):.1f} 0 0Z" fill="{c}" stroke="#2c4a1c" stroke-width="1"/>'
          for i in range(10) for t, c in [(i * math.tau / 10, "#3f6b2a" if i % 2 else "#548a35")]],
        *[f'<path d="M0 0 L{60*math.cos(i*math.tau/10):.1f} {60*math.sin(i*math.tau/10):.1f}" stroke="#2c4a1c" stroke-width="1.4"/>' for i in range(10)],
        '<circle r="9" fill="#6b4a2a"/><circle r="5" fill="#8a6338"/></svg>']),
    "bird_0": '''<svg xmlns="http://www.w3.org/2000/svg" width="44" height="24" viewBox="0 0 44 24">
<path d="M2 6 Q12 2 22 14 Q32 2 42 6 Q32 8 22 20 Q12 8 2 6Z" fill="#20232b"/></svg>''',
    "bird_1": '''<svg xmlns="http://www.w3.org/2000/svg" width="44" height="24" viewBox="0 0 44 24">
<path d="M2 18 Q12 14 22 12 Q32 14 42 18 Q32 16 22 18 Q12 16 2 18Z" fill="#20232b"/></svg>''',
    "sparkle": '''<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="-17 -17 34 34">
<path d="M0 -16 Q2 -2 16 0 Q2 2 0 16 Q-2 2 -16 0 Q-2 -2 0 -16Z" fill="#fff8dc"/><circle r="3" fill="#fff"/></svg>''',
    "ripple": '''<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
<ellipse cx="22" cy="22" rx="19" ry="19" fill="none" stroke="#fff" stroke-width="3"/></svg>''',
    "dot": '''<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><circle cx="7" cy="7" r="6" fill="#fff"/></svg>''',
    "glint": '''<svg xmlns="http://www.w3.org/2000/svg" width="40" height="8" viewBox="0 0 40 8"><rect x="1" y="2" width="38" height="4" rx="2" fill="#fff"/></svg>''',
}

async def render():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path="/usr/bin/google-chrome")
        pg = await b.new_page()
        html = "<body style='margin:0;background:transparent'>" + "".join(
            f"<div id='{k}' style='display:inline-block;line-height:0;margin:4px'>{v}</div>" for k, v in SPRITES.items())
        await pg.set_content(html)
        imgs = {}
        for k in SPRITES:
            path = f"/tmp/sprite_{k}.png"
            await pg.locator(f"#{k}").screenshot(path=path, omit_background=True)
            imgs[k] = Image.open(path).convert("RGBA")
        await b.close()
        return imgs

def pack(imgs):
    # einfache Reihen-Packung, 2 px Abstand gegen Farbsäume
    W, pad, x, y, row = 512, 2, 0, 0, 0
    pos = {}
    for k, im in sorted(imgs.items(), key=lambda kv: -kv[1].height):
        w, h = im.size
        if x + w > W: x, y, row = 0, y + row + pad, 0
        pos[k] = (x, y); x += w + pad; row = max(row, h)
    H = y + row
    sheet = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    frames = {}
    for k, (x, y) in pos.items():
        im = imgs[k]; sheet.paste(im, (x, y))
        w, h = im.size
        frames[k] = {"frame": {"x": x, "y": y, "w": w, "h": h}, "rotated": False, "trimmed": False,
                     "spriteSourceSize": {"x": 0, "y": 0, "w": w, "h": h}, "sourceSize": {"w": w, "h": h}}
    sheet.save(OUT / "sprites.png", optimize=True)
    (OUT / "sprites.json").write_text(json.dumps({"frames": frames, "meta": {"image": "sprites.png", "size": {"w": W, "h": H}, "scale": "1"}}, indent=1))
    return W, H

def wav(name, data, rate=22050):
    data = np.clip(data, -1, 1)
    with wave.open(str(OUT / name), "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(rate)
        f.writeframes((data * 32000).astype("<i2").tobytes())

def sounds():
    r = 22050
    t = np.arange(int(r * .7)) / r
    pling = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * d) * a for f, d, a in [(1318, 6, .5), (1976, 8, .3), (2637, 11, .15)])
    pling[: int(r * .004)] *= np.linspace(0, 1, int(r * .004))
    wav("pling.wav", pling * .8)
    rng = np.random.default_rng(7)
    n = int(r * 4)
    noise = np.cumsum(rng.standard_normal(n)); noise -= np.convolve(noise, np.ones(400) / 400, "same")
    noise /= np.abs(noise).max()
    tt = np.arange(n) / r
    water = noise * (.55 + .25 * np.sin(2 * np.pi * .5 * tt) + .2 * np.sin(2 * np.pi * 1.25 * tt + 1))
    fade = int(r * .5)  # nahtlose Schleife durch Überblenden von Ende und Anfang
    water[:fade] = water[:fade] * np.linspace(0, 1, fade) + water[-fade:] * np.linspace(1, 0, fade)
    wav("wasser.wav", water[:-fade] * .5)

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    print("Atlas", pack(asyncio.run(render())))
    sounds()
    for f in sorted(OUT.iterdir()): print(f.name, f.stat().st_size)
