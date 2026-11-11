// Labor, Schritt 5: Gizeh im Tageslauf.
// Die drei Foto-Ebenen aus Schritt 3 werden in einem einzigen WebGL-Shader zusammengesetzt.
// Der Shader berechnet pro Bildpunkt: Himmel, Wolken, Sonne, Sterne, Licht auf den Pyramidenseiten,
// Schatten am Morgen und Hitzeflimmern über dem Horizont. Ohne Phaser, damit sichtbar wird,
// was dabei wirklich passiert. Ton: ton.js (Web Audio, nichts wird geladen).

import { erzeugeTon } from "./ton.js";

const $ = s => document.querySelector(s);
const QUALI = location.hash === "#hoch" ? 2 : 1.5;                 // Standard „mittel“ (siehe labor/ERGEBNISSE.md)
const Q = Math.min(window.devicePixelRatio || 1, QUALI);
const ASSETS = "../03-bilder/assets/";
const W = 3840, H = 913;
const F = { niltal: .42, hinten: .82, vorne: .88, boden: 1 };       // Parallaxe wie in Schritt 3

// Himmelsfarben über den Tag: [Stunde, oben, Mitte, Horizont]
const HIMMEL = [
  [0, "#04081a", "#0a1438", "#1a2350"], [4.8, "#0a1438", "#2a2e64", "#6e4c74"], [5.9, "#23417e", "#c98a74", "#f3b67c"],
  [7.2, "#2f63b0", "#86aedb", "#f0d6a8"], [10, "#2a67bf", "#6ea6e0", "#cfe3ee"], [14, "#2a67bf", "#76aadf", "#d8e5e8"],
  [17.2, "#2b5aa6", "#d49a74", "#f6c788"], [18.4, "#1a2860", "#8c4b6e", "#e8805a"], [19.6, "#0b1640", "#25285a", "#3c2f5e"], [24, "#04081a", "#0a1438", "#1a2350"]
];
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
const mixv = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function himmel(h){
  let i = 0; while (i < HIMMEL.length - 2 && h > HIMMEL[i + 1][0]) i++;
  const A = HIMMEL[i], B = HIMMEL[i + 1], t = (h - A[0]) / (B[0] - A[0]);
  return [1, 2, 3].map(k => mixv(hex(A[k]), hex(B[k]), t));
}

/* ---------- Shader ---------- */
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;
uniform vec2 uRes; uniform float uScale, uLeft, uMitte, uT, uFlimmern;
uniform sampler2D tH, tV, tB, tN;
uniform vec4 rH, rV, rB, rN;
uniform vec3 skyTop, skyMid, skyHor, sunCol, light, amb, sun;
uniform float side, front, dayF, night, heat, golden, schatten;
uniform vec4 apex;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++){ v += a * noise(p); p *= 2.03; a *= .5; } return v; }
vec4 lay(sampler2D t, vec4 r, vec2 p){
  vec2 uv = (p - r.xy) / r.zw;
  if (uv.x < 0. || uv.y < 0. || uv.x > 1. || uv.y > 1.) return vec4(0.);
  return texture2D(t, uv);
}
// Licht auf einer Pyramidenseite: links/rechts der Spitze, je nach Sonnenstand
vec3 licht(vec3 c, float seite, float dunst){
  float lit = .55 + .45 * front + .28 * seite * side;
  vec3 r = c * (amb + light * lit * 1.15);
  return mix(r, skyHor * (.55 + .45 * dayF), dunst);
}
float imDreieck(vec2 p, vec2 a, vec2 b, vec2 c){
  float d1 = (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
  float d2 = (p.x - c.x) * (b.y - c.y) - (b.x - c.x) * (p.y - c.y);
  float d3 = (p.x - a.x) * (c.y - a.y) - (c.x - a.x) * (p.y - a.y);
  return ((d1 < 0. || d2 < 0. || d3 < 0.) && (d1 > 0. || d2 > 0. || d3 > 0.)) ? 0. : 1.;
}
void main(){
  vec2 sp = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y) / uScale;   // Bildschirmpunkt in Bildpixeln
  float y = sp.y, d = uLeft - uMitte, skyX = sp.x + uMitte;

  // Hitzeflimmern: kleine, wandernde Verschiebung in einem Band über dem Horizont
  float band = smoothstep(480., 610., y) * (1. - smoothstep(700., 870., y));
  float w = noise(vec2(sp.x * .045, y * .32 - uT * 4.5)) - .5;
  vec2 shim = vec2(w * 3.4, w * .9) * heat * band * uFlimmern;

  // Himmel, Sterne, Wolken, Sonne
  float hh = clamp(y / 650., 0., 1.);
  vec3 col = mix(skyTop, skyMid, smoothstep(0., .65, hh));
  col = mix(col, skyHor, smoothstep(.6, 1., hh));
  float rs = hash(floor(vec2(skyX, y) * .5));
  col += vec3(step(.9966, rs) * night * (1. - hh * .8) * (.55 + .45 * sin(uT * 2. + rs * 80.)));
  float wolke = smoothstep(.56, .84, fbm(vec2(skyX * .0021 + uT * .004, y * .0095))) * (1. - smoothstep(240., 520., y));
  vec3 wfarbe = amb * 1.15 + light * .85 + sunCol * golden * .45;
  col = mix(col, wfarbe, wolke * .72);
  float sd = length(vec2(skyX - sun.x, y - sun.y));
  col += sunCol * sun.z * (smoothstep(30., 25., sd) * 1.6 + .5 * exp(-sd / 90.) + .2 * exp(-sd / 380.));

  // Niltal im Dunst (gezeichnet)
  vec4 n = lay(tN, rN, vec2(sp.x + uLeft - d * (1. - ${F.niltal.toFixed(2)}), y) + shim * .5);
  col = mix(col, mix(n.rgb * (amb + light), skyHor, .5), n.a);

  // Mykerinos (hintere Ebene)
  vec2 pH = vec2(sp.x + uLeft - d * (1. - ${F.hinten.toFixed(2)}), y) + shim;
  vec4 a = lay(tH, rH, pH);
  col = mix(col, licht(a.rgb, clamp((pH.x - apex.z) / 40., -1., 1.), .2 + .12 * (1. - dayF)), a.a);

  // Cheops und Chephren (vordere Ebene)
  vec2 pV = vec2(sp.x + uLeft - d * (1. - ${F.vorne.toFixed(2)}), y) + shim * .7;
  vec4 v = lay(tV, rV, pV);
  float ax = pV.x < 770. ? apex.x : apex.y;
  col = mix(col, licht(v.rgb, clamp((pV.x - ax) / 40., -1., 1.), .06 + .1 * (1. - dayF)), v.a);

  // Boden mit Schattenkeilen, wenn die Sonne vor dem Betrachter steht (morgens)
  vec2 pB = vec2(sp.x + uLeft, y) + shim * .6;
  vec4 b = lay(tB, rB, pB);
  float L = schatten, versatz = -side * L * .9;
  float ov = d * (1. - ${F.vorne.toFixed(2)}), oh = d * (1. - ${F.hinten.toFixed(2)});
  float s1 = 0., s2 = 0.;
  for (int k = -1; k <= 1; k++){                    // drei Proben nebeneinander: weichere Schattenkanten
    vec2 q = pB + vec2(float(k) * 6., 0.);
    s1 += imDreieck(q, vec2(620. + ov, 630.), vec2(1770. + ov, 646.), vec2(1197. + ov + versatz, 640. + L)) / 3.;
    s2 += imDreieck(q, vec2(2768. + oh, 704.), vec2(3455. + oh, 702.), vec2(3128. + oh + versatz, 702. + L * .7)) / 3.;
  }
  s1 *= 1. - .75 * smoothstep(0., L, pB.y - 640.);      // Schatten wird zur Spitze hin heller
  s2 *= 1. - .75 * smoothstep(0., L * .7, pB.y - 702.);
  float sch = max(s1, s2) * step(1., L) * .38 * dayF;
  vec3 bc = b.rgb * (amb + light * (.6 + .4 * front) * 1.1) * (1. - sch);
  col = mix(col, bc, b.a);

  vec2 q = gl_FragCoord.xy / uRes - .5;
  col *= 1. - .35 * dot(q, q);
  gl_FragColor = vec4(col, 1.);
}`;

/* ---------- Niltal-Textur (wie Schritt 3) ---------- */
function niltal(){
  const c = document.createElement("canvas"); c.width = 2048; c.height = 360;
  const x = c.getContext("2d");
  let z = 7; const r = () => (z = (z * 16807) % 2147483647) / 2147483647;
  const g = x.createLinearGradient(0, 0, 0, 360);
  g.addColorStop(0, "rgba(220,227,228,0)"); g.addColorStop(.42, "rgba(214,220,214,.92)"); g.addColorStop(.62, "rgba(206,208,190,1)"); g.addColorStop(1, "rgba(204,186,148,1)");
  x.fillStyle = g; x.fillRect(0, 0, 2048, 360);
  const f = x.createLinearGradient(0, 168, 0, 214); f.addColorStop(0, "rgba(128,150,108,0)"); f.addColorStop(.5, "rgba(128,150,108,.38)"); f.addColorStop(1, "rgba(128,150,108,0)");
  x.fillStyle = f; x.fillRect(0, 168, 2048, 46);
  for (let px0 = 0; px0 < 2048; px0 += 6 + r() * 70){
    const n = 1 + Math.floor(r() * 4);
    for (let i = 0; i < n; i++){
      const px = px0 + i * (5 + r() * 6), y = 194 + r() * 8, hh = 7 + r() * 9;
      x.strokeStyle = `rgba(108,124,100,${.22 + r() * .2})`; x.lineWidth = 1.3;
      x.beginPath(); x.moveTo(px, y); x.quadraticCurveTo(px + 1.5, y - hh / 2, px + .5, y - hh); x.stroke();
      for (let k = 0; k < 5; k++){ const a = -Math.PI * (.1 + .8 * k / 4); x.beginPath(); x.moveTo(px + .5, y - hh); x.lineTo(px + .5 + Math.cos(a) * 5, y - hh + Math.sin(a) * 3 + 2.5); x.stroke(); }
    }
  }
  return c;
}

/* ---------- WebGL einrichten ---------- */
const cv = $("#bild");
const gl = cv.getContext("webgl", { antialias: false, alpha: false, premultipliedAlpha: false });
if (!gl){ $("#fehler").hidden = false; $("#fehler").textContent = "Dieses Gerät unterstützt kein WebGL."; throw new Error("kein WebGL"); }
function shader(typ, src){ const s = gl.createShader(typ); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
const prog = gl.createProgram();
gl.attachShader(prog, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
gl.useProgram(prog);
gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
const ort = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(ort); gl.vertexAttribPointer(ort, 2, gl.FLOAT, false, 0, 0);
const U = {};
for (const n of ["uRes", "uScale", "uLeft", "uMitte", "uT", "uFlimmern", "tH", "tV", "tB", "tN", "rH", "rV", "rB", "rN", "skyTop", "skyMid", "skyHor", "sunCol", "light", "amb", "sun", "side", "front", "dayF", "night", "heat", "golden", "schatten", "apex"])
  U[n] = gl.getUniformLocation(prog, n);

function textur(einheit, quelle){
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + einheit); gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, quelle);
  for (const [k, v] of [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]])
    gl.texParameteri(gl.TEXTURE_2D, k, v);
}
const ladeBild = src => new Promise((ok, fehl) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => fehl(new Error(src)); i.src = src; });

/* ---------- Zustand und Steuerung ---------- */
let stunde = +$("#stunde").value, laeuft = false, flimmern = 1, links = 0, schwung = 0, ziehen = null;
const ton = erzeugeTon();
const sicht = () => cv.width / skala();
const skala = () => Math.max(cv.height / H, cv.width / W);
const mitte = () => (W - sicht()) / 2;
const klemme = () => { links = Math.min(Math.max(links, 0), W - sicht()); };

function groesse(){ cv.width = Math.round(innerWidth * Q); cv.height = Math.round(innerHeight * Q); gl.viewport(0, 0, cv.width, cv.height); klemme(); }
addEventListener("resize", groesse);

cv.addEventListener("pointerdown", e => { ziehen = { x: e.clientX }; schwung = 0; cv.setPointerCapture(e.pointerId); });
cv.addEventListener("pointermove", e => {
  if (!ziehen) return;
  const dx = (e.clientX - ziehen.x) * Q / skala(); ziehen.x = e.clientX;
  links -= dx; schwung = -dx; klemme();
});
const los = () => { ziehen = null; };
cv.addEventListener("pointerup", los); cv.addEventListener("pointercancel", los);

const regler = $("#stunde"), uhr = $("#uhr");
const zeigeUhr = () => { const m = Math.round(stunde * 60) % 1440; uhr.textContent = `${String(m / 60 | 0).padStart(2, "0")}:${String(m % 60).padStart(2, "0")} Uhr`; };
regler.addEventListener("input", () => { stunde = +regler.value; zeigeUhr(); });
const spur = []; for (let h = 0; h <= 24; h++) spur.push(`rgb(${himmel(h)[2].map(v => Math.round(v * 255)).join(",")}) ${(h / 24 * 100).toFixed(1)}%`);
regler.style.setProperty("--spur", `linear-gradient(90deg,${spur.join(",")})`);
$("#lauf").addEventListener("click", e => { laeuft = !laeuft; e.currentTarget.setAttribute("aria-pressed", laeuft); e.currentTarget.textContent = laeuft ? "Anhalten" : "Tag ablaufen lassen"; });
$("#flimmern").addEventListener("click", e => { flimmern = flimmern ? 0 : 1; e.currentTarget.setAttribute("aria-pressed", !!flimmern); });
$("#ton").addEventListener("click", async e => {
  const b = e.currentTarget;
  if (!ton){ b.textContent = "Kein Ton"; return; }
  if (ton.laeuft){ ton.stop(); b.textContent = "Ton an"; b.setAttribute("aria-pressed", "false"); }
  else { await ton.start(); b.textContent = "Ton aus"; b.setAttribute("aria-pressed", "true"); }
});

/* ---------- Licht aus der Uhrzeit berechnen ---------- */
// Der Fotograf blickt nach Osten (Westansicht der Pyramiden): morgens geht die Sonne vor ihm auf,
// mittags steht sie rechts (Süden) hoch am Himmel, abends geht sie hinter ihm unter.
function licht(h){
  const altN = Math.sin(Math.PI * (h - 6) / 12);                 // -1 … 1
  const altGrad = altN * 65;
  const rel = (h - 6) / 12 * 180;                                // 0 = vorn (Osten), 90 = rechts (Süden), 180 = hinten (Westen)
  const rad = rel * Math.PI / 180;
  const dayF = smooth(-.12, .2, altN), night = 1 - smooth(-.25, 0, altN);
  const golden = dayF * (1 - smooth(.05, .45, altN));
  const sunCol = mixv([1, .5, .22], [1, .97, .88], smooth(0, .55, altN));
  const light = sunCol.map(v => v * dayF * .78);
  const amb = mixv([.1, .13, .27], [.42, .45, .52], dayF).map((v, i) => v + golden * [.1, .04, 0][i]);
  const heat = smooth(.6, .95, altN);
  const front = -Math.cos(rad), side = Math.sin(rad);
  const sunX = 1920 + rel * 24, sunY = 640 - altGrad * 24;
  const sichtbar = h > 5.5 && h < 9.5 ? smooth(-2, 0, altGrad) : 0;
  const schatten = front < 0 && altN > .02 ? Math.min(320, 70 / Math.tan(Math.max(.05, altGrad * Math.PI / 180))) * -front : 0;
  return { dayF, night, golden, sunCol, light, amb, heat, front, side, sun: [sunX, sunY, sichtbar], schatten,
    ton: { wind: .25 + .75 * heat + .3 * golden, nacht: night, morgen: smooth(5, 5.8, h) * (1 - smooth(7.5, 8.5, h)) } };
}

/* ---------- Start ---------- */
const meta = await (await fetch(ASSETS + "gizeh.json")).json();
const E = meta.ebenen;
const [bH, bV, bB] = await Promise.all([E.hinten, E.vorne, E.boden].map(e => ladeBild(ASSETS + e.datei)));
textur(0, bH); textur(1, bV); textur(2, bB); textur(3, niltal());
gl.uniform1i(U.tH, 0); gl.uniform1i(U.tV, 1); gl.uniform1i(U.tB, 2); gl.uniform1i(U.tN, 3);
gl.uniform4f(U.rH, E.hinten.x, E.hinten.y, E.hinten.w, E.hinten.h);
gl.uniform4f(U.rV, E.vorne.x, E.vorne.y, E.vorne.w, E.vorne.h);
gl.uniform4f(U.rB, E.boden.x, E.boden.y, E.boden.w, E.boden.h);
gl.uniform4f(U.rN, -1200, 430, W + 2400, 360);
const sp = Object.fromEntries(meta.spitzen.map(s => [s.name, s.x]));
gl.uniform4f(U.apex, sp.Cheops, sp.Chephren, sp.Mykerinos, 0);
groesse();
links = 0;
let ziel = Math.min(560, mitte()), einfahrt = true;     // Kamerafahrt zum Start
zeigeUhr();

let t0 = performance.now(), letzt = t0, bilder = 0, fpsZeit = t0;
function bild(jetzt){
  const dt = Math.min(.05, (jetzt - letzt) / 1000); letzt = jetzt;
  if (laeuft){ stunde = (stunde + dt * .6) % 24; regler.value = stunde.toFixed(2); zeigeUhr(); }
  if (einfahrt && !ziehen){ links += (ziel - links) * .03; if (Math.abs(ziel - links) < 1) einfahrt = false; }
  if (ziehen) einfahrt = false;
  if (!ziehen && Math.abs(schwung) > .05){ links += schwung; schwung *= .92; klemme(); }

  const L = licht(stunde), [top, mid, hor] = himmel(stunde);
  gl.uniform2f(U.uRes, cv.width, cv.height); gl.uniform1f(U.uScale, skala());
  gl.uniform1f(U.uLeft, links); gl.uniform1f(U.uMitte, mitte()); gl.uniform1f(U.uT, (jetzt - t0) / 1000); gl.uniform1f(U.uFlimmern, flimmern);
  gl.uniform3fv(U.skyTop, top); gl.uniform3fv(U.skyMid, mid); gl.uniform3fv(U.skyHor, hor);
  gl.uniform3fv(U.sunCol, L.sunCol); gl.uniform3fv(U.light, L.light); gl.uniform3fv(U.amb, L.amb); gl.uniform3fv(U.sun, L.sun);
  gl.uniform1f(U.side, L.side); gl.uniform1f(U.front, L.front); gl.uniform1f(U.dayF, L.dayF); gl.uniform1f(U.night, L.night);
  gl.uniform1f(U.heat, L.heat); gl.uniform1f(U.golden, L.golden); gl.uniform1f(U.schatten, L.schatten);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  if (ton?.laeuft) ton.stimmung(L.ton);

  bilder++;
  if (jetzt - fpsZeit > 500){ $("#fps").textContent = `${Math.round(bilder * 1000 / (jetzt - fpsZeit))} fps · Auflösung ${Q}×`; bilder = 0; fpsZeit = jetzt; }
  requestAnimationFrame(bild);
}
requestAnimationFrame(bild);
window.labor = { setzeStunde: h => { stunde = h; regler.value = h; zeigeUhr(); } };   // zum Ausprobieren in der Konsole
