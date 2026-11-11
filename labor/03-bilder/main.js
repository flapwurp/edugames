// Labor, Schritt 3: Bilder im Spiel. Drei Szenen mit Phaser 4 (im Labor erlaubt, siehe CLAUDE.md).
// Aufteilung: Phaser zeichnet die Bilder, Marker und Effekte; Leiste, Infotafel und Bildnachweise
// sind normales HTML darüber (gestochen scharf, Text markierbar, Links klickbar).
// Inhalte und Bildnachweise stehen in content.js.

import Phaser from "../vendor/phaser.esm.min.js";
import { NACHWEISE, KARTE, GIZEH, QUELLE } from "./content.js";

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const $ = s => document.querySelector(s);
const txt = (size, color = "#efe4c8", extra = {}) => ({ fontFamily: FONT, fontSize: `${size}px`, color, resolution: DPR, ...extra });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const DATEI = { delta: "nil-delta.webp", murchison: "murchison-falls.webp", barke1: "sonnenbarke-1.webp", barke4: "sonnenbarke-4.webp" };

/* ---------------- HTML-Teil: Infotafel, Nachweise, Navigation ---------------- */
const kurz = k => { const n = NACHWEISE[k]; return `${esc(n.urheber)}, ${n.lizenzLink ? `<a href="${n.lizenzLink}" target="_blank" rel="noopener">${esc(n.lizenz)}</a>` : esc(n.lizenz)}`; };

function oeffneTafel(o){
  const p = $("#panel");
  p.querySelector("h2").textContent = o.name;
  p.querySelector(".inhalt").innerHTML = `<p>${esc(o.text)}</p>` + (o.bilder || []).map(k =>
    `<figure style="margin:0"><img src="assets/${DATEI[k]}" alt="${esc(NACHWEISE[k].titel)}" loading="lazy"><figcaption>Foto: ${kurz(k)}${NACHWEISE[k].bearbeitung ? " · " + esc(NACHWEISE[k].bearbeitung) : ""} · <a href="${NACHWEISE[k].link}" target="_blank" rel="noopener">Fundstelle</a></figcaption></figure>`).join("");
  p.hidden = false;
  p.scrollTop = 0;
}
const schliesseTafel = () => { $("#panel").hidden = true; };
$("#panel .x").addEventListener("click", schliesseTafel);

$("#nachweisliste").innerHTML = Object.values(NACHWEISE).map(n =>
  `<li><strong>${esc(n.titel)}</strong><br>${esc(n.urheber)} · ${n.lizenzLink ? `<a href="${n.lizenzLink}" target="_blank" rel="noopener">${esc(n.lizenz)}</a>` : esc(n.lizenz)} · <a href="${n.link}" target="_blank" rel="noopener">Fundstelle auf Wikimedia Commons</a>${n.bearbeitung ? `<br>Bearbeitung: ${esc(n.bearbeitung)}` : ""}</li>`).join("");
document.querySelectorAll(".nachweis-knopf").forEach(b => b.addEventListener("click", () => { $("#nachweise").hidden = false; }));
$("#nachweise-zu").addEventListener("click", () => { $("#nachweise").hidden = true; });
$("#nachweise").addEventListener("click", e => { if (e.target.id === "nachweise") $("#nachweise").hidden = true; });

document.querySelectorAll(".karte[data-ziel]").forEach(b => b.addEventListener("click", () => { location.hash = b.dataset.ziel; }));
$("#zurueck").addEventListener("click", () => { location.hash = ""; });

/* ---------------- Gemeinsame Szenen-Bausteine ---------------- */
function textur(scene, key, w, h, mal){
  if (scene.textures.exists(key)) return;
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  mal(c.getContext("2d"), w, h);
  scene.textures.addCanvas(key, c);
}

class Basis extends Phaser.Scene {
  ladeanzeige(){
    const cam = this.cameras.main.setOrigin(0, 0).setZoom(DPR).setBackgroundColor("#0e1a2b");
    const t = this.add.text(this.scale.width / DPR / 2, this.scale.height / DPR / 2, "Lade Bilder …", txt(20)).setOrigin(.5);
    this.load.on("progress", v => t.setText(`Lade Bilder … ${Math.round(v * 100)} %`));
    this.load.once("complete", () => { t.destroy(); cam.setOrigin(.5, .5); });
  }

  kopf(titel, nachweise){
    $("#titel").textContent = titel;
    $("#credit").innerHTML = nachweise.map(k => `Bild: ${kurz(k)}${NACHWEISE[k].bearbeitung ? ", bearbeitet" : ""} · <a href="${NACHWEISE[k].link}" target="_blank" rel="noopener">Fundstelle</a>`).join(" &nbsp;|&nbsp; ");
    $("#modus").hidden = true;
    textur(this, "marke", 64, 64, (c) => {
      c.fillStyle = "rgba(14,26,43,.75)"; c.beginPath(); c.arc(32, 32, 26, 0, Math.PI * 2); c.fill();
      c.lineWidth = 5; c.strokeStyle = "#d9b45a"; c.stroke();
      c.fillStyle = "#f3dc9a"; c.beginPath(); c.arc(32, 32, 9, 0, Math.PI * 2); c.fill();
    });
    textur(this, "ring", 64, 64, (c) => { c.lineWidth = 3; c.strokeStyle = "#f3dc9a"; c.beginPath(); c.arc(32, 32, 28, 0, Math.PI * 2); c.stroke(); });
    this.marken = [];
    this.scale.on("resize", this.groesse, this);
    this.events.once("shutdown", () => { this.scale.off("resize", this.groesse, this); schliesseTafel(); });
  }

  marke(o, x = o.x, y = o.y){
    const ring = this.add.image(x, y, "ring").setDepth(50).setAlpha(.8);
    const img = this.add.image(x, y, "marke").setDepth(51);
    const label = this.add.text(x, y, o.name, txt(14, "#ffffff", { backgroundColor: "#0e1a2bd9", padding: { x: 7, y: 4 } }))
      .setOrigin(0, .5).setDepth(51);
    const m = { o, x, y, img, ring, label, f: 1, puls: 0 };
    this.tweens.add({ targets: m, puls: 1, duration: 1600, repeat: -1, delay: Math.random() * 1600 });
    this.marken.push(m);
    return m;
  }

  waehle(m){
    oeffneTafel(m.o);
    this.tweens.add({ targets: m.img, angle: 360, duration: 500, ease: "Back.easeOut", onComplete: () => m.img.setAngle(0) });
  }

  // Kamera im Bild halten; ist das Bild kleiner als der Bildschirm, bleibt es mittig
  klemme(){
    const cam = this.cameras.main, vw = cam.width / cam.zoom, vh = cam.height / cam.zoom;
    const cx = vw >= this.W ? this.W / 2 : Phaser.Math.Clamp(cam.scrollX + cam.width / 2, vw / 2, this.W - vw / 2);
    const cy = vh >= this.H ? this.H / 2 : Phaser.Math.Clamp(cam.scrollY + cam.height / 2, vh / 2, this.H - vh / 2);
    cam.scrollX = cx - cam.width / 2; cam.scrollY = cy - cam.height / 2;
  }

  zeichneMarken(){
    const s = DPR / this.cameras.main.zoom;      // Marker bleiben auf dem Bildschirm gleich groß
    for (const m of this.marken){
      const x = m.ax ?? m.x;
      m.img.setPosition(x, m.y).setScale(s * .55);
      m.ring.setPosition(x, m.y).setScale(s * (.55 + m.puls * .5)).setAlpha(.8 * (1 - m.puls));
      m.label.setPosition(x + 22 * s, m.y).setScale(s);
    }
  }

  // Verschieben mit einem Finger, Zoomen mit zwei Fingern oder dem Mausrad, Schwung beim Loslassen
  steuerung({ minZoom, maxZoom, nurX = false }){
    const cam = this.cameras.main, inp = this.input;
    inp.addPointer(1);
    let pinch = null, weg = 0, vx = 0, vy = 0, unten = false;
    const welt = (sx, sy, z) => ({ x: (sx - cam.width / 2) / z + cam.scrollX + cam.width / 2, y: (sy - cam.height / 2) / z + cam.scrollY + cam.height / 2 });
    const zoomAuf = (sx, sy, z) => {
      z = Phaser.Math.Clamp(z, minZoom(), maxZoom());
      const a = welt(sx, sy, cam.zoom); cam.setZoom(z); const b = welt(sx, sy, z);
      cam.scrollX += a.x - b.x; if (!nurX) cam.scrollY += a.y - b.y;
    };
    inp.on("pointerdown", () => { unten = true; weg = 0; vx = vy = 0; });
    inp.on("pointermove", p => {
      const a = inp.pointer1, b = inp.pointer2;
      if (a.isDown && b.isDown){
        const d = Phaser.Math.Distance.Between(a.x, a.y, b.x, b.y), mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
        if (pinch && minZoom() < maxZoom()){
          zoomAuf(mx, my, cam.zoom * d / pinch.d);
          cam.scrollX -= (mx - pinch.mx) / cam.zoom; if (!nurX) cam.scrollY -= (my - pinch.my) / cam.zoom;
        }
        pinch = { d, mx, my }; weg += 100; return;
      }
      pinch = null;
      if (!p.isDown) return;
      const dx = p.x - p.prevPosition.x, dy = p.y - p.prevPosition.y;
      weg += Math.abs(dx) + Math.abs(dy);
      cam.scrollX -= dx / cam.zoom; vx = -dx / cam.zoom;
      if (!nurX){ cam.scrollY -= dy / cam.zoom; vy = -dy / cam.zoom; }
    });
    inp.on("pointerup", () => { pinch = null; if (!inp.pointer1.isDown && !inp.pointer2.isDown) unten = false; });
    inp.on("wheel", (p, over, dx, dy) => zoomAuf(p.x, p.y, cam.zoom * Math.exp(-dy * .0015)));
    const schwung = () => {
      if (!unten && (Math.abs(vx) + Math.abs(vy) > .05)){ cam.scrollX += vx; cam.scrollY += vy; vx *= .92; vy *= .92; }
    };
    this.events.on("update", schwung);
    this.events.once("shutdown", () => this.events.off("update", schwung));
    this.steuer = { tipp: () => weg < 10 * DPR, zoomAuf };
    // Antippen selbst auswerten: Weltpunkt berechnen und den nächsten Marker (Kreis oder Beschriftung) suchen
    inp.on("pointerup", p => {
      if (!this.steuer.tipp()) return;
      const w = cam.getWorldPoint(p.x, p.y), r = 28 * DPR / cam.zoom;
      const m = this.marken.find(m => Phaser.Math.Distance.Between(w.x, w.y, m.ax ?? m.x, m.y) < r || m.label.getBounds().contains(w.x, w.y));
      m ? this.waehle(m) : schliesseTafel();
    });
    return this.steuer;
  }
}

/* ---------------- Szene 1: Nilkarte ---------------- */
class Karte extends Basis {
  constructor(){ super("Karte"); }
  preload(){ this.ladeanzeige(); this.load.image("nil", "assets/nil-gesamt.webp"); }
  create(){
    this.kopf(KARTE.titel, [KARTE.bild]);
    const bild = this.add.image(0, 0, "nil").setOrigin(0);
    this.W = bild.width; this.H = bild.height;
    const cam = this.cameras.main.setBackgroundColor("#061022");
    this.minZ = () => Math.min(cam.height / this.H, cam.width / this.W);
    this.steuerung({ minZoom: this.minZ, maxZoom: () => DPR * 5 });
    cam.setZoom(Math.max(this.minZ(), DPR * KARTE.start.zoom)).centerOn(KARTE.start.x, KARTE.start.y);
    KARTE.orte.forEach(o => this.marke(o));
  }
  waehle(m){ super.waehle(m); this.cameras.main.pan(m.x, m.y, 700, "Sine.easeInOut"); }
  groesse(){ const cam = this.cameras.main; cam.setSize(this.scale.width, this.scale.height); if (cam.zoom < this.minZ()) cam.setZoom(this.minZ()); }
  update(){ this.klemme(); this.zeichneMarken(); }
}

/* ---------------- Szene 2: Gizeh in Ebenen (Parallaxe) ---------------- */
class Gizeh extends Basis {
  constructor(){ super("Gizeh"); }
  preload(){
    this.ladeanzeige();
    this.load.json("gizehMeta", "assets/gizeh.json");
    this.load.image("g-vorne", "assets/gizeh-cheops-chephren.webp");
    this.load.image("g-hinten", "assets/gizeh-mykerinos.webp");
    this.load.image("g-boden", "assets/gizeh-boden.webp");
  }
  create(){
    this.kopf(GIZEH.titel, [GIZEH.bild]);
    const meta = this.cache.json.get("gizehMeta"), W = this.W = meta.breite, H = this.H = meta.hoehe, F = GIZEH.ebenen;
    const cam = this.cameras.main.setBounds(0, 0, W, H).setBackgroundColor("#9fc1df");
    this.ebenen = [];
    const ebene = (obj, f) => { obj.baseX = obj.x; obj.f = f; this.ebenen.push(obj); return obj; };

    // Himmel und Niltal im Dunst sind gezeichnet (ersetzen Himmel und Stadt aus dem Foto)
    textur(this, "g-himmel", 4, 512, (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#6c9fd4"); g.addColorStop(.62, "#bcd2e4"); g.addColorStop(.8, "#dde5e6"); g.addColorStop(1, "#e7e3d6");
      c.fillStyle = g; c.fillRect(0, 0, w, h);
    });
    ebene(this.add.image(-1500, 0, "g-himmel").setOrigin(0).setDisplaySize(W + 3000, H), 0);
    textur(this, "g-niltal", 2048, 360, (c, w, h) => {
      let z = 7; const r = () => (z = (z * 16807) % 2147483647) / 2147483647;
      const dunst = c.createLinearGradient(0, 0, 0, h);
      dunst.addColorStop(0, "rgba(220,227,228,0)"); dunst.addColorStop(.42, "rgba(214,220,214,.92)");
      dunst.addColorStop(.62, "rgba(206,208,190,1)"); dunst.addColorStop(1, "rgba(204,186,148,1)");
      c.fillStyle = dunst; c.fillRect(0, 0, w, h);
      const feld = c.createLinearGradient(0, 168, 0, 214);                      // Fruchtland in der Ferne, weich
      feld.addColorStop(0, "rgba(128,150,108,0)"); feld.addColorStop(.5, "rgba(128,150,108,.38)"); feld.addColorStop(1, "rgba(128,150,108,0)");
      c.fillStyle = feld; c.fillRect(0, 168, w, 46);
      for (let x = 0; x < w; x += 6 + r() * 70){                                 // Palmen, klein und blass, in Gruppen
        const n = 1 + Math.floor(r() * 4);
        for (let i = 0; i < n; i++){
          const px = x + i * (5 + r() * 6), y = 194 + r() * 8, hh = 7 + r() * 9;
          c.strokeStyle = `rgba(108,124,100,${.22 + r() * .2})`; c.lineWidth = 1.3;
          c.beginPath(); c.moveTo(px, y); c.quadraticCurveTo(px + 1.5, y - hh / 2, px + .5, y - hh); c.stroke();
          for (let k = 0; k < 5; k++){ const a = -Math.PI * (.1 + .8 * k / 4); c.beginPath(); c.moveTo(px + .5, y - hh); c.lineTo(px + .5 + Math.cos(a) * 5, y - hh + Math.sin(a) * 3 + 2.5); c.stroke(); }
        }
      }
    });
    ebene(this.add.image(-1200, 430, "g-niltal").setOrigin(0).setDisplaySize(W + 2400, 360), F.niltal);

    const e = meta.ebenen;
    ebene(this.add.image(e.hinten.x, e.hinten.y, "g-hinten").setOrigin(0), F.hinten);
    ebene(this.add.image(e.vorne.x, e.vorne.y, "g-vorne").setOrigin(0), F.vorne);
    ebene(this.add.image(e.boden.x, e.boden.y, "g-boden").setOrigin(0), F.boden);

    // Staub, der über den Boden weht
    textur(this, "g-staub", 16, 16, (c) => { const g = c.createRadialGradient(8, 8, 0, 8, 8, 8); g.addColorStop(0, "rgba(255,240,215,.9)"); g.addColorStop(1, "rgba(255,240,215,0)"); c.fillStyle = g; c.fillRect(0, 0, 16, 16); });
    this.add.particles(0, 0, "g-staub", {
      emitZone: { type: "random", source: new Phaser.Geom.Rectangle(-200, 640, W + 200, 260) },
      speedX: { min: 25, max: 70 }, speedY: { min: -6, max: 4 }, lifespan: 7000, frequency: 70,
      scale: { min: .6, max: 2.2 }, alpha: { start: .45, end: 0 }
    }).setDepth(40);

    GIZEH.orte.forEach(o => { const m = this.marke(o); m.f = F[o.ebene]; });

    this.steuerung({ minZoom: () => this.fit(), maxZoom: () => this.fit(), nurX: true });
    this.groesse();
    // Kamerafahrt zum Start: von links in die Mitte
    cam.scrollX = this.scrollFuerLinks(0);
    this.tweens.add({ targets: cam, scrollX: this.scrollFuerLinks(Math.min(560, this.mitte())), duration: 3000, ease: "Sine.easeInOut", delay: 300 });
  }
  fit(){ const cam = this.cameras.main; return Math.max(cam.height / this.H, cam.width / this.W); }
  sichtbreite(){ return this.cameras.main.width / this.cameras.main.zoom; }
  mitte(){ return (this.W - this.sichtbreite()) / 2; }
  // Phaser zoomt um die Bildmitte; daraus folgt der Zusammenhang zwischen scrollX und linkem Bildrand
  scrollFuerLinks(l){ const cam = this.cameras.main; return l - (cam.width - cam.width / cam.zoom) / 2; }
  links(){ const cam = this.cameras.main; return cam.scrollX + (cam.width - cam.width / cam.zoom) / 2; }
  groesse(){ const cam = this.cameras.main; cam.setSize(this.scale.width, this.scale.height).setZoom(this.fit()); }
  update(){
    const d = Phaser.Math.Clamp(this.links(), 0, this.W - this.sichtbreite()) - this.mitte();
    for (const o of this.ebenen) o.x = o.baseX + d * (1 - o.f);
    for (const m of this.marken) m.ax = m.x + d * (1 - m.f);
    this.zeichneMarken();
  }
}

/* ---------------- Szene 3: Quelle untersuchen ---------------- */
const MODI = [["Foto", 1, 0], ["Foto + Linien", 1, 1], ["Umzeichnung", 0, 1]];
class Quelle extends Basis {
  constructor(){ super("Quelle"); }
  preload(){ this.ladeanzeige(); this.load.image("menna", "assets/menna-013.webp"); this.load.image("menna-linien", "assets/menna-013-linien.webp"); }
  create(){
    this.kopf(QUELLE.titel, [QUELLE.bild]);
    $("#credit").innerHTML = `${esc(QUELLE.hinweis)}<br>` + $("#credit").innerHTML;
    const foto = this.add.image(0, 0, "menna").setOrigin(0);
    this.W = foto.width; this.H = foto.height;
    this.add.rectangle(0, 0, this.W, this.H, 0xf1e6cc).setOrigin(0).setDepth(-1);
    const linien = this.add.image(0, 0, "menna-linien").setOrigin(0).setAlpha(0);
    const cam = this.cameras.main.setBackgroundColor("#0b1424");
    this.minZ = () => Math.min(cam.width / this.W, cam.height / this.H);
    this.steuerung({ minZoom: this.minZ, maxZoom: () => DPR * 4 });
    cam.setZoom(this.minZ()).centerOn(this.W / 2, this.H / 2);
    QUELLE.orte.forEach(o => this.marke(o));

    let modus = 0;
    const knopf = $("#modus");
    const setze = () => {
      const [name, a, b] = MODI[modus];
      knopf.textContent = `Ansicht: ${name}`;
      this.tweens.add({ targets: foto, alpha: a, duration: 400 });
      this.tweens.add({ targets: linien, alpha: b, duration: 400 });
    };
    this.modusKlick = () => { modus = (modus + 1) % MODI.length; setze(); };
    knopf.addEventListener("click", this.modusKlick);
    knopf.hidden = false;
    setze();
    this.events.once("shutdown", () => { knopf.removeEventListener("click", this.modusKlick); knopf.hidden = true; });
  }
  waehle(m){ super.waehle(m); this.cameras.main.pan(m.x, m.y, 700, "Sine.easeInOut"); }
  groesse(){ const cam = this.cameras.main; cam.setSize(this.scale.width, this.scale.height); if (cam.zoom < this.minZ()) cam.setZoom(this.minZ()); }
  update(){ this.klemme(); this.zeichneMarken(); }
}

class Leer extends Phaser.Scene { constructor(){ super("Leer"); } }

/* ---------------- Spiel und Navigation ---------------- */
const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: "spiel",
  backgroundColor: "#0e1a2b",
  scale: { mode: Phaser.Scale.NONE, width: innerWidth * DPR, height: innerHeight * DPR, zoom: 1 / DPR },
  input: { activePointers: 3 },
  scene: [Leer, Karte, Gizeh, Quelle]
});
addEventListener("resize", () => game.scale.resize(innerWidth * DPR, innerHeight * DPR));
window.labor = game;   // zum Ausprobieren in der Browser-Konsole

const SZENEN = { karte: "Karte", gizeh: "Gizeh", quelle: "Quelle" };
function route(){
  const ziel = SZENEN[location.hash.slice(1)];
  schliesseTafel();
  for (const s of game.scene.getScenes(true)) if (s.scene.key !== ziel) s.scene.stop();
  $("#menu").hidden = !!ziel;
  $("#leiste").hidden = !ziel;
  $("#credit").hidden = !ziel;
  if (ziel) game.scene.start(ziel);
}
addEventListener("hashchange", route);
game.events.once("ready", route);
