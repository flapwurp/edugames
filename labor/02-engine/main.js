// Labor, Schritt 2: Engine-Test „Flussfahrt“ mit Phaser 4.
// Ausnahme von „keine Frameworks“ nur für diesen Ordner (siehe CLAUDE.md, Labor).
// Getestet wird: Laden mit Fortschritt, Sammelbild (Atlas), Animationen, Tweens, Partikel,
// Kamera mit Verfolgung, Minikarte als zweite Kamera, Touch-Steuerung, Ton, Vollbild, Retina-Schärfe.

import Phaser from "./phaser.esm.min.js";

const DPR = Math.min(window.devicePixelRatio || 1, 2);
const W = 3200, H = 1800;          // Weltgröße in Punkten
const FUNDE = 6;                   // Amphoren im Fluss
const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';

// Flussverlauf: Mitte und halbe Breite in Abhängigkeit von x
const riverY = x => H / 2 + 260 * Math.sin(x / 520) + 90 * Math.sin(x / 210 + 1);
const riverHW = x => 300 + 60 * Math.sin(x / 400 + 2);

// Fester Zufall, damit die Welt bei jedem Start gleich aussieht
function seeded(seed){
  return () => {
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const txt = (size, color = "#efe4c8", extra = {}) => ({ fontFamily: FONT, fontSize: `${size}px`, color, resolution: DPR, ...extra });

// Kamera für Bedienelemente: Koordinaten in Punkten, scharf auf Retina
function uiCam(cam){ cam.setOrigin(0, 0).setZoom(DPR); return cam; }
const cssW = scene => scene.scale.width / DPR;
const cssH = scene => scene.scale.height / DPR;

/* ---------------- Laden ---------------- */
class Laden extends Phaser.Scene {
  constructor(){ super("laden"); }
  preload(){
    uiCam(this.cameras.main).setBackgroundColor("#0e1a2b");
    const cx = cssW(this) / 2, cy = cssH(this) / 2;
    const label = this.add.text(cx, cy - 34, "Lade …", txt(20)).setOrigin(.5);
    this.add.rectangle(cx, cy, 320, 12, 0x24344f).setOrigin(.5);
    const bar = this.add.rectangle(cx - 160, cy, 320, 12, 0xd9b45a).setOrigin(0, .5).setScale(0, 1);
    this.load.on("progress", v => { bar.setScale(v, 1); label.setText(`Lade … ${Math.round(v * 100)} %`); });
    this.load.atlas("sprites", "assets/sprites.png", "assets/sprites.json");
    this.load.audio("pling", "assets/pling.wav");
    this.load.audio("wasser", "assets/wasser.wav");
  }
  create(){
    this.anims.create({ key: "rudern", frames: this.anims.generateFrameNames("sprites", { prefix: "boat_", start: 0, end: 3 }), frameRate: 8, repeat: -1 });
    this.anims.create({ key: "flattern", frames: this.anims.generateFrameNames("sprites", { prefix: "bird_", start: 0, end: 1 }), frameRate: 6, repeat: -1 });
    this.scene.start("titel");
  }
}

/* ---------------- Titel ---------------- */
class Titel extends Phaser.Scene {
  constructor(){ super("titel"); }
  create(){
    uiCam(this.cameras.main).setBackgroundColor("#0e1a2b");
    this.funken = this.add.particles(0, 0, "sprites", {
      frame: "sparkle", lifespan: 2200, speed: { min: 6, max: 24 }, scale: { start: .5, end: 0 },
      alpha: { start: .9, end: 0 }, frequency: 90, blendMode: "ADD",
      emitZone: { type: "random", source: new Phaser.Geom.Rectangle(0, 0, cssW(this), cssH(this)) }
    });
    this.titel = this.add.text(0, 0, "Flussfahrt", txt(54, "#f3dc9a", { fontStyle: "bold" })).setOrigin(.5);
    this.unter = this.add.text(0, 0, "Labor · Schritt 2 · Engine-Test mit Phaser " + Phaser.VERSION, txt(18, "#9aa3cc")).setOrigin(.5);
    this.hinweis = this.add.text(0, 0, "Tippen zum Starten", txt(24)).setOrigin(.5);
    this.tweens.add({ targets: this.hinweis, alpha: .35, duration: 900, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    this.layout();
    this.scale.on("resize", this.layout, this);
    this.events.once("shutdown", () => this.scale.off("resize", this.layout, this));
    this.input.once("pointerdown", () => {
      navigator.wakeLock?.request("screen").catch(() => {});
      this.scene.start("fluss");
    });
  }
  layout(){
    const w = cssW(this), h = cssH(this);
    this.cameras.main.setSize(this.scale.width, this.scale.height);
    this.titel.setPosition(w / 2, h / 2 - 50);
    this.unter.setPosition(w / 2, h / 2 + 4);
    this.hinweis.setPosition(w / 2, h / 2 + 70);
    this.funken.emitZones[0]?.source?.setSize?.(w, h);
  }
}

/* ---------------- Flussfahrt ---------------- */
class Fluss extends Phaser.Scene {
  constructor(){ super("fluss"); }

  create(){
    const rnd = seeded(2026), R = (a, b) => a + (b - a) * rnd();
    this.welt = this.add.layer();
    this.hud = this.add.layer();
    this.gefunden = 0;
    this.ziel = null;

    this.malHintergrund(rnd, R);

    // Glitzern auf dem Wasser
    for (let i = 0; i < 80; i++){
      const x = R(0, W), y = riverY(x) + R(-.8, .8) * riverHW(x);
      const s = this.add.image(x, y, "sprites", "glint").setScale(R(.3, .7), .5).setAlpha(0).setBlendMode("ADD");
      this.welt.add(s);
      this.tweens.add({ targets: s, alpha: R(.25, .5), x: x + R(-14, 14), duration: R(900, 1800), yoyo: true, repeat: -1, delay: R(0, 2000), ease: "Sine.easeInOut" });
    }

    // Schilf am Ufer: viele einzeln animierte Objekte als Lasttest
    for (let i = 0; i < 420; i++){
      const x = R(0, W), side = rnd() < .5 ? -1 : 1;
      const y = riverY(x) + side * (riverHW(x) + R(-4, 30));
      const r = this.add.image(x, y, "sprites", "reed").setOrigin(.5, 1).setScale(R(.4, .62)).setDepth(y);
      this.welt.add(r);
      this.tweens.add({ targets: r, angle: { from: R(-7, -2), to: R(2, 7) }, duration: R(1300, 2300), yoyo: true, repeat: -1, delay: R(0, 1500), ease: "Sine.easeInOut" });
    }

    // Palmen auf dem Land
    for (let i = 0; i < 80; i++){
      const x = R(0, W), side = rnd() < .5 ? -1 : 1;
      const y = Phaser.Math.Clamp(riverY(x) + side * (riverHW(x) + R(230, 460)), 40, H - 40);
      const p = this.add.image(x, y, "sprites", "palm").setScale(R(.42, .68)).setRotation(R(0, 6.28)).setDepth(5000 + y);
      this.welt.add(p);
      this.tweens.add({ targets: p, angle: p.angle + R(3, 6), duration: R(2200, 3400), yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
    }

    // Amphoren mit Funkeln
    this.amphoren = [];
    for (let i = 0; i < FUNDE; i++){
      const x = 380 + i * (W - 760) / (FUNDE - 1) + R(-120, 120);
      const y = riverY(x) + R(-.45, .45) * riverHW(x);
      const a = this.add.image(x, y, "sprites", "amphora").setScale(.5).setDepth(y);
      this.tweens.add({ targets: a, y: y + 5, angle: { from: -9, to: 9 }, duration: R(1100, 1500), yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      const f = this.add.particles(0, 0, "sprites", {
        frame: "sparkle", lifespan: 1000, speed: { min: 4, max: 16 }, scale: { start: .32, end: 0 },
        alpha: { start: 1, end: 0 }, frequency: 240, blendMode: "ADD",
        emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 22) }
      }).startFollow(a).setDepth(y + 1);
      this.welt.add([a, f]);
      this.amphoren.push({ a, f, weg: false });
    }

    // Boot, Kielwasser, Zielmarke
    const sx = 220;
    this.boot = this.add.sprite(sx, riverY(sx), "sprites", "boat_0").setScale(.5).setDepth(3000);
    this.kiel = this.add.particles(0, 0, "sprites", {
      frame: "ripple", lifespan: 1700, speed: 0, scale: { start: .14, end: .9 }, alpha: { start: .4, end: 0 },
      frequency: 110, emitting: false
    }).startFollow(this.boot).setDepth(2999);
    this.marke = this.add.image(0, 0, "sprites", "ripple").setAlpha(0).setDepth(2998);
    this.burst = this.add.particles(0, 0, "sprites", {
      frame: "sparkle", lifespan: 900, speed: { min: 60, max: 220 }, scale: { start: .6, end: 0 },
      alpha: { start: 1, end: 0 }, blendMode: "ADD", emitting: false
    }).setDepth(9500);
    this.welt.add([this.kiel, this.marke, this.boot, this.burst]);

    // Vogelschwarm über allem
    this.voegel = [];
    for (let i = 0; i < 26; i++){
      const b = this.add.sprite(R(0, W), R(100, H - 100), "sprites", "bird_0").setScale(R(.35, .55)).setDepth(9000);
      b.play({ key: "flattern", startFrame: i % 2 });
      b.y0 = b.y; b.v = R(55, 95); b.ph = R(0, 6.28);
      this.welt.add(b);
      this.voegel.push(b);
    }

    // Kameras: Welt (folgt dem Boot), Bedienung, Minikarte
    const cam = this.cameras.main;
    cam.setBounds(0, 0, W, H).setZoom(DPR * .72).setBackgroundColor("#d8b878");
    cam.startFollow(this.boot, false, .08, .08);
    cam.ignore(this.hud);
    this.hudCam = uiCam(this.cameras.add(0, 0, this.scale.width, this.scale.height));
    this.hudCam.ignore(this.welt);
    this.karte = this.cameras.add(0, 0, 10, 10).setBackgroundColor("#0e1a2b");
    this.karte.ignore(this.hud);
    this.punkt = this.add.image(0, 0, "sprites", "dot").setTint(0xff5a4a).setScale(3).setDepth(9999);
    this.welt.add(this.punkt);
    cam.ignore(this.punkt);

    this.baueHud();
    this.layout();
    this.scale.on("resize", this.layout, this);
    this.events.once("shutdown", () => this.scale.off("resize", this.layout, this));

    // Steuerung: Tippen setzt das Ziel, mit gedrücktem Finger kann man lenken
    const setze = p => {
      const wp = cam.getWorldPoint(p.x, p.y);
      const x = Phaser.Math.Clamp(wp.x, 40, W - 40), hw = riverHW(x) - 34, cy = riverY(x);
      this.ziel = { x, y: Phaser.Math.Clamp(wp.y, cy - hw, cy + hw) };
      this.marke.setPosition(this.ziel.x, this.ziel.y).setScale(.2).setAlpha(.8);
      this.tweens.add({ targets: this.marke, scale: .7, alpha: 0, duration: 700, ease: "Quad.easeOut" });
      if (this.hilfe.alpha === 1) this.tweens.add({ targets: this.hilfe, alpha: 0, duration: 600, delay: 1500 });
    };
    this.input.on("pointerdown", (p, over) => { if (!over.length) setze(p); });
    this.input.on("pointermove", p => { if (p.isDown && !this.input.hitTestPointer(p).length) setze(p); });

    this.sound.play("wasser", { loop: true, volume: .35 });
  }

  malHintergrund(rnd, R){
    const g = this.add.graphics();
    this.welt.add(g);
    g.fillStyle(0xd8b878, 1).fillRect(0, 0, W, H);
    for (let i = 0; i < 1600; i++) g.fillStyle(rnd() < .5 ? 0xc9a466 : 0xe9cd95, .55).fillCircle(R(0, W), R(0, H), R(1, 3.2));
    const band = (from, to) => {           // Fläche zwischen zwei Abständen von der Flussmitte
      const pts = [];
      for (let x = 0; x <= W; x += 32) pts.push({ x, y: riverY(x) + from(x) });
      for (let x = W; x >= 0; x -= 32) pts.push({ x, y: riverY(x) + to(x) });
      return pts;
    };
    // Fruchtland (Kemet) an beiden Ufern, mit Furchen
    for (const s of [-1, 1]){
      g.fillStyle(0x5f7f34, 1).fillPoints(band(x => s * (riverHW(x) + 210), x => s * (riverHW(x) - 6)), true);
      g.lineStyle(2, 0x4d6c28, .55);
      for (let k = 24; k < 200; k += 17){
        g.beginPath();
        for (let x = 0; x <= W; x += 32){ const y = riverY(x) + s * (riverHW(x) + k); x ? g.lineTo(x, y) : g.moveTo(x, y); }
        g.strokePath();
      }
    }
    // Wasser in drei Tiefen
    g.fillStyle(0x6aa6c6, 1).fillPoints(band(x => -riverHW(x) - 4, x => riverHW(x) + 4), true);
    g.fillStyle(0x3478a6, 1).fillPoints(band(x => -riverHW(x) + 18, x => riverHW(x) - 18), true);
    g.fillStyle(0x2a6491, 1).fillPoints(band(x => -riverHW(x) * .55, x => riverHW(x) * .55), true);
  }

  baueHud(){
    const add = o => { this.hud.add(o); return o; };
    this.panel = add(this.add.graphics());
    this.zaehler = add(this.add.text(0, 0, "", txt(20, "#f3dc9a", { fontStyle: "bold" })));
    this.info = add(this.add.text(0, 0, "", txt(13, "#c9cce4", { backgroundColor: "#0e1a2bb3", padding: { x: 8, y: 4 } })));
    this.hilfe = add(this.add.text(0, 0, "Tippe aufs Wasser, um hinzurudern. Finde die 6 Amphoren.", txt(19, "#ffffff", { backgroundColor: "#0e1a2bcc", padding: { x: 14, y: 10 } })).setOrigin(.5, 1));
    this.rahmen = add(this.add.graphics());
    this.knoepfe = [
      this.knopf("Vollbild", () => this.scale.isFullscreen ? this.scale.stopFullscreen() : this.scale.startFullscreen()),
      this.knopf("Ton aus", k => { this.sound.mute = !this.sound.mute; k.t.setText(this.sound.mute ? "Ton an" : "Ton aus"); })
    ];
    this.zaehlerText();
    this.time.addEvent({ delay: 500, loop: true, callback: () => {
      const teile = this.amphoren.reduce((n, o) => n + o.f.getAliveParticleCount(), 0) + this.kiel.getAliveParticleCount() + this.burst.getAliveParticleCount();
      this.info.setText(`${Math.round(this.game.loop.actualFps)} fps · ${this.welt.list.length} Objekte · ${teile} Partikel · ${this.tweens.getTweens().length} Tweens`);
    } });
  }

  knopf(label, cb){
    const k = { g: this.add.graphics(), t: this.add.text(0, 0, label, txt(17, "#efe4c8")).setOrigin(.5), z: this.add.zone(0, 0, 112, 48).setOrigin(0).setInteractive() };
    k.z.on("pointerdown", (p, lx, ly, e) => { e.stopPropagation(); cb(k); });
    this.hud.add([k.g, k.t, k.z]);
    return k;
  }

  zaehlerText(){ this.zaehler.setText(`Amphoren  ${this.gefunden} / ${FUNDE}`); }

  layout(){
    const w = cssW(this), h = cssH(this), sw = this.scale.width, sh = this.scale.height;
    this.cameras.main.setSize(sw, sh);
    this.hudCam.setSize(sw, sh);
    // Minikarte oben rechts
    const mw = Math.min(220, w * .28), mh = mw * H / W, mx = w - mw - 14, my = 14;
    this.karte.setViewport(mx * DPR, my * DPR, mw * DPR, mh * DPR).setZoom(mw * DPR / W).centerOn(W / 2, H / 2);
    this.km = { mx, my, mw, mh };
    this.panel.clear().fillStyle(0x0e1a2b, .78).fillRoundedRect(14, 14, 230, 46, 12);
    this.zaehler.setPosition(30, 26);
    this.info.setPosition(14, h - 34);
    this.hilfe.setPosition(w / 2, h - 44);
    this.knoepfe.forEach((k, i) => {
      const x = w - 14 - (i + 1) * 120 + 8, y = h - 62;
      k.g.clear().fillStyle(0x0e1a2b, .78).fillRoundedRect(x, y, 112, 48, 12).lineStyle(1, 0xd9b45a, .6).strokeRoundedRect(x, y, 112, 48, 12);
      k.t.setPosition(x + 56, y + 24);
      k.z.setPosition(x, y);
    });
  }

  sammle(o){
    o.weg = true;
    o.f.stop();
    this.burst.explode(36, o.a.x, o.a.y);
    this.sound.play("pling", { volume: .7, detune: this.gefunden * 100 });
    this.tweens.add({ targets: o.a, x: this.boot.x, y: this.boot.y, scale: 0, angle: 360, duration: 450, ease: "Back.easeIn", onComplete: () => o.a.setVisible(false) });
    this.gefunden++;
    this.zaehlerText();
    this.tweens.add({ targets: this.zaehler, scale: 1.25, duration: 140, yoyo: true });
    if (this.gefunden === FUNDE) this.time.delayedCall(700, () => this.geschafft());
  }

  geschafft(){
    const w = cssW(this), h = cssH(this);
    const g = this.add.graphics().fillStyle(0x0e1a2b, .85).fillRoundedRect(w / 2 - 210, h / 2 - 90, 420, 180, 18);
    const t = this.add.text(w / 2, h / 2 - 34, "Alle Amphoren gefunden", txt(28, "#f3dc9a", { fontStyle: "bold" })).setOrigin(.5);
    const k = this.knopf("Noch mal", () => this.scene.restart());
    this.hud.add([g, t]);
    this.hud.bringToTop(k.g); this.hud.bringToTop(k.t); this.hud.bringToTop(k.z);
    k.g.fillStyle(0xd9b45a, 1).fillRoundedRect(w / 2 - 56, h / 2 + 12, 112, 48, 12);
    k.t.setColor("#0e1a2b").setPosition(w / 2, h / 2 + 36);
    k.z.setPosition(w / 2 - 56, h / 2 + 12);
    for (let i = 0; i < 4; i++) this.time.delayedCall(i * 180, () => this.burst.explode(40, this.boot.x + Phaser.Math.Between(-80, 80), this.boot.y + Phaser.Math.Between(-60, 60)));
  }

  update(time, delta){
    const dt = Math.min(delta, 50) / 1000, b = this.boot;
    if (this.ziel){
      const dx = this.ziel.x - b.x, dy = this.ziel.y - b.y, d = Math.hypot(dx, dy);
      if (d < 10){
        this.ziel = null;
      } else {
        const soll = Math.atan2(dy, dx);
        b.rotation = Phaser.Math.Angle.RotateTo(b.rotation, soll, 3.2 * dt);
        const abw = Math.abs(Phaser.Math.Angle.Wrap(soll - b.rotation));
        const v = 175 * (abw > 1.2 ? .3 : 1) * Math.min(1, d / 80 + .25);
        b.x = Phaser.Math.Clamp(b.x + Math.cos(b.rotation) * v * dt, 40, W - 40);
        const cy = riverY(b.x), hw = riverHW(b.x) - 34;
        b.y = Phaser.Math.Clamp(b.y + Math.sin(b.rotation) * v * dt, cy - hw, cy + hw);
      }
    }
    const faehrt = !!this.ziel;
    if (faehrt && !b.anims.isPlaying) b.play("rudern");
    if (!faehrt && b.anims.isPlaying){ b.stop(); b.setFrame("boat_0"); }
    if (faehrt !== this.kiel.emitting) faehrt ? this.kiel.start() : this.kiel.stop();

    for (const o of this.amphoren) if (!o.weg && Phaser.Math.Distance.Between(b.x, b.y, o.a.x, o.a.y) < 64) this.sammle(o);

    for (const v of this.voegel){
      v.x += v.v * dt;
      v.y = v.y0 + Math.sin(time / 900 + v.ph) * 24;
      if (v.x > W + 40) v.x = -40;
    }

    // Minikarte: Bootspunkt und sichtbarer Ausschnitt
    this.punkt.setPosition(b.x, b.y);
    const { mx, my, mw } = this.km, f = mw / W, wv = this.cameras.main.worldView;
    this.rahmen.clear().lineStyle(1.5, 0xd9b45a, .9).strokeRect(mx, my, mw, this.km.mh)
      .lineStyle(1.5, 0xffffff, .9).strokeRect(mx + wv.x * f, my + wv.y * f, wv.width * f, wv.height * f);
  }
}

const game = new Phaser.Game({
  type: Phaser.WEBGL,
  parent: "spiel",
  backgroundColor: "#0e1a2b",
  scale: { mode: Phaser.Scale.NONE, width: innerWidth * DPR, height: innerHeight * DPR, zoom: 1 / DPR },
  input: { activePointers: 3 },
  scene: [Laden, Titel, Fluss]
});
addEventListener("resize", () => game.scale.resize(innerWidth * DPR, innerHeight * DPR));
