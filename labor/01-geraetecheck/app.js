// Labor, Schritt 1: Gerätecheck.
// Sammelt, was das Gerät für Spiele kann, und misst Grafik-Leistung, Download und Ton.
// Nichts verlässt das Gerät; der Download-Test lädt nur testdaten.bin aus diesem Ordner.

const $ = id => document.getElementById(id);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const de = n => n.toLocaleString("de-DE");

const GROUPS = ["Gerät", "Grafik", "Leistung", "Eingabe", "Ton", "Speicher und Netz"];
const rows = new Map();

function set(key, group, label, value, status = "info"){
  rows.set(key, { group, label, value, status });
  render();
}

function render(){
  $("results").innerHTML = GROUPS.map(g => {
    const list = [...rows.values()].filter(r => r.group === g);
    if (!list.length) return "";
    return `<section class="card"><h2>${g}</h2><dl>${list.map(r =>
      `<div class="row"><dt>${esc(r.label)}</dt><dd><span class="dot ${r.status}" aria-hidden="true"></span><span>${esc(r.value)}</span></dd></div>`
    ).join("")}</dl></section>`;
  }).join("");
}

/* ---------- Gerät ---------- */
function device(){
  const ua = navigator.userAgent;
  const iPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  const kind = iPad ? "iPad" : /iPhone/.test(ua) ? "iPhone" : /Android/.test(ua) ? "Android-Gerät" : "Computer";
  const safari = (ua.match(/Version\/([\d.]+).*Safari/) || [])[1];
  const other = /Edg\//.test(ua) ? "Edge" : /CriOS|Chrome\//.test(ua) ? "Chrome" : /FxiOS|Firefox\//.test(ua) ? "Firefox" : "unbekannt";
  set("kind", "Gerät", "Gerät", kind);
  set("browser", "Gerät", "Browser", safari ? `Safari ${safari}` : other, safari || !iPad ? "info" : "warn");
  set("cores", "Gerät", "Prozessorkerne (gemeldet)", navigator.hardwareConcurrency || "unbekannt");
  screenInfo();
  addEventListener("resize", screenInfo);
}

function screenInfo(){
  const dpr = devicePixelRatio || 1;
  set("view", "Gerät", "Sichtbare Fläche", `${innerWidth} × ${innerHeight} Punkte (${innerWidth > innerHeight ? "quer" : "hochkant"})`);
  set("dpr", "Gerät", "Pixeldichte", `${dpr}× · ${Math.round(screen.width * dpr)} × ${Math.round(screen.height * dpr)} Pixel`);
}

/* ---------- Grafik ---------- */
function graphics(){
  const c = document.createElement("canvas");
  const gl2 = c.getContext("webgl2");
  const gl = gl2 || c.getContext("webgl");
  set("webgl", "Grafik", "WebGL", gl2 ? "WebGL 2" : gl ? "nur WebGL 1" : "nicht verfügbar", gl2 ? "ok" : gl ? "warn" : "bad");
  if (gl){
    const tex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    set("tex", "Grafik", "Größte Textur", `${de(tex)} × ${de(tex)} Pixel`, tex >= 8192 ? "ok" : tex >= 4096 ? "warn" : "bad");
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    set("gpu", "Grafik", "Grafikchip (gemeldet)", dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  }
  set("offscreen", "Grafik", "OffscreenCanvas", "OffscreenCanvas" in window ? "vorhanden" : "fehlt", "OffscreenCanvas" in window ? "ok" : "warn");
}

/* ---------- Leistung ---------- */
function refreshRate(){
  return new Promise(res => {
    let n = 0, t0 = 0;
    const f = t => { if (!t0) t0 = t; else n++; if (t - t0 < 1000) requestAnimationFrame(f); else res(n / ((t - t0) / 1000)); };
    requestAnimationFrame(f);
  });
}

async function performanceInfo(){
  set("hz", "Leistung", "Bildwiederholrate", "wird gemessen …");
  const hz = await refreshRate();
  const r = hz > 100 ? 120 : hz > 50 ? 60 : Math.round(hz);
  set("hz", "Leistung", "Bildwiederholrate", `${r} Hz (gemessen ${hz.toFixed(0)})`, r >= 60 ? "ok" : "warn");
  set("bench", "Leistung", "Bewegte Figuren bei 60 fps", "noch nicht gemessen");
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav) set("load", "Speicher und Netz", "Diese Seite geladen in", `${de(Math.round(nav.duration))} ms`);
}

async function bench(){
  const btn = $("bench"), cv = $("stage");
  btn.disabled = true;
  cv.hidden = false;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  const W = cv.clientWidth, H = cv.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  // Eine vorgezeichnete Figur, wie bei einem Spiel mit vielen gleichen Objekten
  const spr = document.createElement("canvas");
  spr.width = spr.height = 32;
  const s = spr.getContext("2d"), g = s.createRadialGradient(13, 12, 2, 16, 16, 16);
  g.addColorStop(0, "#fff3c4"); g.addColorStop(.5, "#e0b04a"); g.addColorStop(1, "rgba(224,176,74,0)");
  s.fillStyle = g; s.beginPath(); s.arc(16, 16, 16, 0, Math.PI * 2); s.fill();

  const MAX = 32000, P = new Float32Array(MAX * 4);
  for (let i = 0; i < MAX; i++){ P[i*4] = Math.random() * W; P[i*4+1] = Math.random() * H; P[i*4+2] = (Math.random() - .5) * 3; P[i*4+3] = (Math.random() - .5) * 3; }

  const steps = [250, 500, 1000, 2000, 4000, 8000, 16000, 32000];
  let best = 0, last = "";
  for (const n of steps){
    set("bench", "Leistung", "Bewegte Figuren bei 60 fps", `läuft … ${de(n)} Figuren`);
    const fps = await run(ctx, spr, P, n, W, H, 1600);
    last = `${de(n)} → ${fps.toFixed(0)} fps`;
    if (fps >= 55) best = n; else break;
  }
  cv.hidden = true;
  btn.disabled = false;
  const status = best >= 4000 ? "ok" : best >= 1000 ? "warn" : "bad";
  set("bench", "Leistung", "Bewegte Figuren bei 60 fps", best ? `${de(best)}${best === MAX ? " oder mehr" : ""} (letzte Stufe: ${last})` : `unter 250 (${last})`, status);
}

function run(ctx, spr, P, n, W, H, ms){
  return new Promise(res => {
    let t0 = 0, frames = 0, warm = 0;
    const f = t => {
      if (!warm) warm = t;
      if (!t0 && t - warm > 300) t0 = t; else if (t0) frames++;
      ctx.fillStyle = "#0d1020"; ctx.fillRect(0, 0, W, H);
      for (let i = 0; i < n; i++){
        const k = i * 4;
        let x = P[k] + P[k+2], y = P[k+1] + P[k+3];
        if (x < 0 || x > W) P[k+2] *= -1;
        if (y < 0 || y > H) P[k+3] *= -1;
        P[k] = x; P[k+1] = y;
        ctx.drawImage(spr, x - 8, y - 8, 16, 16);
      }
      const now = t0 ? frames / ((t - t0) / 1000) : 0;
      ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(10, 10, 210, 30);
      ctx.fillStyle = "#fff"; ctx.font = "15px system-ui, sans-serif";
      ctx.fillText(`${de(n)} Figuren · ${now ? now.toFixed(0) : "…"} fps`, 20, 31);
      if (!t0 || t - t0 < ms) requestAnimationFrame(f); else res(frames / ((t - t0) / 1000));
    };
    requestAnimationFrame(f);
  });
}

/* ---------- Eingabe ---------- */
function input(){
  const tp = navigator.maxTouchPoints || 0;
  set("tp", "Eingabe", "Touch-Punkte (gemeldet)", tp || "kein Touch", tp > 1 ? "ok" : "info");
  set("fingers", "Eingabe", "Gleichzeitige Finger (getestet)", "noch nicht getestet");
  const area = $("touch"), active = new Set();
  let max = 0;
  const upd = () => {
    area.classList.toggle("on", active.size > 0);
    area.textContent = active.size ? `${active.size} Finger erkannt` : "Mit mehreren Fingern gleichzeitig hier tippen";
    if (active.size > max){ max = active.size; set("fingers", "Eingabe", "Gleichzeitige Finger (getestet)", `${max}`, max >= 2 ? "ok" : "info"); }
  };
  area.addEventListener("pointerdown", e => { active.add(e.pointerId); area.setPointerCapture?.(e.pointerId); upd(); });
  for (const ev of ["pointerup", "pointercancel", "lostpointercapture"]) area.addEventListener(ev, e => { active.delete(e.pointerId); upd(); });
}

/* ---------- Ton ---------- */
function soundInfo(){
  const AC = window.AudioContext || window.webkitAudioContext;
  set("audio", "Ton", "Web Audio", AC ? "vorhanden, Test per Knopf" : "fehlt", AC ? "info" : "bad");
}

function sound(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  const ctx = new AC();
  const o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime;
  o.type = "triangle";
  o.frequency.setValueAtTime(523, t); o.frequency.setValueAtTime(659, t + .15); o.frequency.setValueAtTime(784, t + .3);
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.25, t + .02); g.gain.setValueAtTime(.25, t + .42); g.gain.linearRampToValueAtTime(0, t + .5);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + .52);
  // Safari startet Web Audio im Zustand "suspended"; resume() direkt im Tipp-Handler gibt den Ton frei.
  ctx.resume().finally(() => {
    set("audio", "Ton", "Web Audio", ctx.state === "running" ? "läuft nach Tippen: drei Töne hörbar? Sonst Lautstärke prüfen" : `Zustand: ${ctx.state}`, ctx.state === "running" ? "ok" : "warn");
  });
  setTimeout(() => ctx.close(), 900);
}

/* ---------- Speicher und Netz ---------- */
function storageAndNet(){
  const tryStore = st => { try { st.setItem("__labor", "1"); st.removeItem("__labor"); return true; } catch { return false; } };
  const ss = tryStore(sessionStorage), ls = tryStore(localStorage);
  set("ss", "Speicher und Netz", "sessionStorage", ss ? "nutzbar" : "gesperrt", ss ? "ok" : "bad");
  set("ls", "Speicher und Netz", "localStorage", ls ? "nutzbar" : "gesperrt", ls ? "ok" : "warn");
  set("idb", "Speicher und Netz", "IndexedDB", "indexedDB" in window ? "vorhanden" : "fehlt", "indexedDB" in window ? "ok" : "warn");
  set("ws", "Speicher und Netz", "WebSocket (für Multiplayer)", "WebSocket" in window ? "vorhanden" : "fehlt", "WebSocket" in window ? "ok" : "bad");
  set("rtc", "Speicher und Netz", "WebRTC (Geräte direkt verbinden)", "RTCPeerConnection" in window ? "vorhanden" : "fehlt", "RTCPeerConnection" in window ? "ok" : "warn");
  set("wake", "Speicher und Netz", "Bildschirm wach halten", "wakeLock" in navigator ? "vorhanden" : "fehlt", "wakeLock" in navigator ? "ok" : "warn");
  const fs = document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen;
  set("fs", "Speicher und Netz", "Vollbild", fs ? "vorhanden" : "fehlt", fs ? "ok" : "warn");
  set("dl", "Speicher und Netz", "Download-Rate", "noch nicht gemessen");
}

async function net(){
  const btn = $("net");
  btn.disabled = true;
  const runs = [];
  try {
    for (let i = 0; i < 3; i++){
      set("dl", "Speicher und Netz", "Download-Rate", `läuft … Durchgang ${i + 1} von 3`);
      const t0 = performance.now();
      const r = await fetch(`testdaten.bin?t=${Date.now()}-${i}`, { cache: "no-store" });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const b = await r.arrayBuffer();
      runs.push(b.byteLength * 8 / ((performance.now() - t0) / 1000) / 1e6);
    }
    runs.sort((a, b) => a - b);
    const m = runs[1];
    set("dl", "Speicher und Netz", "Download-Rate", `${m.toFixed(1)} Mbit/s (mittlerer von 3 Durchgängen à 1 MB) · 20 MB bräuchten ca. ${de(Math.ceil(160 / m))} s`, m >= 25 ? "ok" : m >= 8 ? "warn" : "bad");
  } catch (e){
    set("dl", "Speicher und Netz", "Download-Rate", `fehlgeschlagen (${e.message})`, "bad");
  }
  btn.disabled = false;
}

/* ---------- Ergebnis kopieren ---------- */
async function copy(){
  const d = new Date();
  const text = [`Gerätecheck ${d.toLocaleDateString("de-DE")} ${d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}`,
    ...GROUPS.flatMap(g => {
      const list = [...rows.values()].filter(r => r.group === g);
      return list.length ? ["", `## ${g}`, ...list.map(r => `${r.label}: ${r.value}`)] : [];
    })].join("\n");
  const out = $("out"), btn = $("copy");
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "Kopiert";
    setTimeout(() => btn.textContent = "Ergebnis kopieren", 2000);
  } catch {
    out.hidden = false; out.value = text; out.focus(); out.select();
    btn.textContent = "Text unten markieren und kopieren";
  }
}

/* ---------- Start ---------- */
device();
graphics();
input();
soundInfo();
storageAndNet();
performanceInfo();
$("bench").addEventListener("click", bench);
$("net").addEventListener("click", net);
$("sound").addEventListener("click", sound);
$("copy").addEventListener("click", copy);
