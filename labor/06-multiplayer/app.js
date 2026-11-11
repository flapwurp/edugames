/* Labor Schritt 6: Bildschirme und Zeichnen. Netz in verbindung.js, Logik in raum.js. */
import { SUPABASE_URL, SUPABASE_KEY, BEWEGUNGEN_PRO_SEKUNDE } from "./config.js";
import { neuerCode, normalisiere, gueltig, kanal, neueId, farben, Messreihe, drossel, Zaehler } from "./raum.js";
import { verbinde } from "./verbindung.js";

const $ = s => document.querySelector(s);
const jetzt = () => performance.now();

/* Nur für lokale Tests: ?server=http://localhost:8787 (nachgebauter Server) */
const param = new URLSearchParams(location.search).get("server");
const lokal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
const SERVER = param && lokal ? param : SUPABASE_URL;

/* Gerätekennung bleibt für diese Sitzung gleich (auch nach Neuladen), sonst nichts gespeichert */
const ID = sessionStorage.getItem("labor06-id") || neueId();
sessionStorage.setItem("labor06-id", ID);

let verbindung = null, code = null;
let anwesend = new Map(), farbtabelle = farben([ID]);
const rtt = new Messreihe(60);
const gesendet = new Zaehler(3000), empfangen = new Zaehler(3000);
const darfBewegen = drossel(1000 / BEWEGUNGEN_PRO_SEKUNDE);
let serverMs = null, pingNr = 0;
const protokoll = [];

/* ---------- Startbildschirm ---------- */
const codeFeld = $("#codeFeld");
codeFeld.addEventListener("input", () => {
  codeFeld.value = normalisiere(codeFeld.value);
  $("#beitreten").disabled = !gueltig(codeFeld.value);
  $("#startFehler").textContent = codeFeld.value.length === 4 && !gueltig(codeFeld.value) ? "Codes enthalten kein I und kein O." : "";
});
codeFeld.addEventListener("keydown", e => { if (e.key === "Enter" && gueltig(codeFeld.value)) betrete(codeFeld.value); });
$("#beitreten").addEventListener("click", () => betrete(codeFeld.value));
$("#neu").addEventListener("click", () => betrete(neuerCode()));
$("#verlassen").addEventListener("click", verlasse);


function betrete(c){
  code = c;
  codeFeld.blur();            // Tastatur zu, bevor das Feld vermessen wird
  scrollTo(0, 0);
  sessionStorage.setItem("labor06-raum", c);
  $("#start").hidden = true; $("#raum").hidden = false;
  $("#raumCode").textContent = c;
  groesse();
  notiere("Raum " + c + " · Gerät " + ID + (SERVER !== SUPABASE_URL ? " · Testserver " + SERVER : ""));
  verbindung = verbinde({
    url: SERVER, key: SUPABASE_KEY, raum: kanal(c), id: ID, meta: { seit: Date.now() },
    bei: {
      nachricht: empfange,
      anwesenheit: m => { anwesend = m; neueAnwesenheit(); },
      status: zeigeStatus,
      log: notiere,
      server: ms => { serverMs = ms; },
    },
  });
  neueAnwesenheit();
}

function verlasse(){
  verbindung?.schliesse(); verbindung = null;
  sessionStorage.removeItem("labor06-raum");
  location.reload();
}

/* iPad aufgeweckt oder WLAN zurück: sofort prüfen */
document.addEventListener("visibilitychange", () => { if (!document.hidden) verbindung?.pruefe(); });
addEventListener("online", () => verbindung?.pruefe());

/* ---------- Anzeige ---------- */
function zeigeStatus(art, text){
  $("#punkt").className = "punkt " + art;
  $("#statusText").textContent = text;
}

function andere(){ return [...anwesend.keys()].filter(k => k !== ID); }

function neueAnwesenheit(){
  const ids = [...anwesend.keys(), ID];
  farbtabelle = farben(ids);
  const n = new Set(ids).size;
  $("#geraete").textContent = n === 1 ? "1 Gerät" : n + " Geräte";
  for (const id of geraete.keys()) if (!anwesend.has(id)) geraete.delete(id);
  const h = $("#hinweis");
  const eigene = farbtabelle.get(ID).name;
  if (n === 1) h.innerHTML = "Warte auf ein zweites iPad.<br>Dort diesen Code eingeben:<span class=\"gross\">" + code + "</span>";
  else h.innerHTML = "Tippe oder wische. Deine Farbe: <b style=\"color:" + farbtabelle.get(ID).wert + "\">" + eigene + "</b>";
  h.style.opacity = n === 1 ? 1 : .55;
}

function notiere(text){
  const z = new Date().toLocaleTimeString("de-DE");
  protokoll.push(z + " " + text);
  const li = document.createElement("li");
  li.innerHTML = "<time>" + z + "</time>";
  li.append(text);
  $("#logListe").prepend(li);
}

$("#protokollKnopf").addEventListener("click", e => {
  const p = $("#protokoll"); p.hidden = !p.hidden;
  e.currentTarget.setAttribute("aria-pressed", String(!p.hidden));
});

function ergebnis(){
  // iPadOS gibt sich als Mac aus; Touchpunkte verraten das iPad
  let ua = navigator.userAgent.match(/(iPad|iPhone|Macintosh|Windows NT [\d.]+|Android [\d.]+|Linux)/)?.[0] ?? "?";
  if (ua === "Macintosh" && navigator.maxTouchPoints > 1) ua = "iPad";
  const safari = navigator.userAgent.match(/Version\/([\d.]+)/)?.[1];
  const st = verbindung?.stand ?? {};
  return [
    "Labor 6 – Zwei iPads, ein Raum",
    new Date().toLocaleString("de-DE") + " · " + ua + (safari ? " · Safari " + safari : ""),
    "Geräte im Raum: " + new Set([...anwesend.keys(), ID]).size,
    "Verzögerung Gerät→Gerät (einfach, ≈ Hälfte von hin+zurück): Median " + ms(rtt.median / 2) + ", min " + ms(rtt.min / 2) + ", max " + ms(rtt.max / 2) + " (" + rtt.gesamt + " Messungen)",
    "Server (Herzschlag, hin+zurück): " + ms(serverMs),
    "Verbindungen: " + (st.verbindungen ?? 0) + " (Abbrüche: " + Math.max(0, (st.verbindungen ?? 0) - 1) + ")",
    "Nachrichten gesendet/empfangen: " + (st.gesendet ?? 0) + " / " + (st.empfangen ?? 0),
    st.mitToken ? "Hinweis: Beitritt brauchte den Schlüssel als Token" : "",
  ].filter(Boolean).join("\n");
}
const ms = v => v == null || !isFinite(v) ? "–" : Math.round(v) + " ms";

$("#kopieren").addEventListener("click", async () => {
  const text = ergebnis();
  try { await navigator.clipboard.writeText(text); toast("Ergebnis kopiert"); }
  catch {
    $("#protokoll").hidden = false;
    const t = $("#ergebnisText"); t.hidden = false; t.value = text; t.select();
    toast("Kopieren nicht erlaubt – Text steht im Protokoll");
  }
});

function toast(text){
  const d = document.createElement("div"); d.className = "toast"; d.textContent = text;
  document.body.append(d); setTimeout(() => d.remove(), 2200);
}

/* ---------- Nachrichten ---------- */
function sende(event, payload){
  if (verbindung?.sende(event, payload)) gesendet.neu(jetzt());
}

const geraete = new Map();   // id → {finger:[{x,y,zx,zy}], spur:[], zuletzt}
const wellen = [];           // {x,y,farbe,t}

function geraet(id){
  if (!geraete.has(id)) geraete.set(id, { finger: [], spur: [] });
  return geraete.get(id);
}

function empfange(event, p){
  empfangen.neu(jetzt());
  switch (event){
    case "tipp":
      wellen.push({ x: p.x, y: p.y, id: p.von, t: jetzt() });
      break;
    case "finger": {
      const g = geraet(p.von);
      const ziel = p.p ?? [];
      if (ziel.length !== g.finger.length) g.finger = ziel.map(([x, y]) => ({ x, y, zx: x, zy: y }));
      else ziel.forEach(([x, y], i) => { g.finger[i].zx = x; g.finger[i].zy = y; });
      break;
    }
    case "ping":
      sende("pong", { an: p.von, n: p.n, t: p.t });
      break;
    case "pong":
      if (p.an === ID) rtt.neu(jetzt() - p.t);
      break;
  }
}

/* alle 2 s messen, solange jemand da ist */
setInterval(() => {
  if (andere().length && verbindung?.beigetreten) sende("ping", { von: ID, n: ++pingNr, t: jetzt() });
}, 2000);

/* ---------- Eigene Finger ---------- */
const feld = $("#feld"), ctx = feld.getContext("2d");
let B = 0, H = 0, DPR = 1;
const eigene = new Map();   // pointerId → {x,y} (0…1)

let L = 0, O = 0;
/* Größe vom Canvas selbst nehmen, nicht vom Fenster: Auf dem iPad meldet das Fenster
   bei offener Tastatur eine kleinere Höhe, das Bild wurde dann verzerrt. */
function groesse(){
  const r = feld.getBoundingClientRect();
  if (!r.width || !r.height) return;
  DPR = Math.min(devicePixelRatio || 1, 2);
  B = r.width; H = r.height; L = r.left; O = r.top;
  const w = Math.round(B * DPR), h = Math.round(H * DPR);
  if (feld.width !== w || feld.height !== h){ feld.width = w; feld.height = h; }
}
new ResizeObserver(groesse).observe(feld);
addEventListener("resize", groesse);
visualViewport?.addEventListener("resize", () => { groesse(); if (!$("#raum").hidden) scrollTo(0, 0); });

const norm = e => [Math.round((e.clientX - L) / B * 1000) / 1000, Math.round((e.clientY - O) / H * 1000) / 1000];
const fingerliste = () => [...eigene.values()].map(f => [f.x, f.y]);

feld.addEventListener("pointerdown", e => {
  feld.setPointerCapture(e.pointerId);
  const [x, y] = norm(e);
  eigene.set(e.pointerId, { x, y });
  wellen.push({ x, y, id: ID, t: jetzt() });
  sende("tipp", { von: ID, x, y });
  sende("finger", { von: ID, p: fingerliste() });
});
feld.addEventListener("pointermove", e => {
  const f = eigene.get(e.pointerId); if (!f) return;
  [f.x, f.y] = norm(e);
  if (darfBewegen(jetzt())) sende("finger", { von: ID, p: fingerliste() });
});
const los = e => {
  if (!eigene.delete(e.pointerId)) return;
  sende("finger", { von: ID, p: fingerliste() });
};
feld.addEventListener("pointerup", los);
feld.addEventListener("pointercancel", los);

/* ---------- Zeichnen ---------- */
let vorher = jetzt(), anzeigeZeit = 0;

function bild(t){
  const dt = Math.min(100, t - vorher); vorher = t;
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  ctx.fillStyle = "#0f1420"; ctx.fillRect(0, 0, B, H);
  ctx.strokeStyle = "rgba(160,180,220,.07)"; ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 60; x < B; x += 60){ ctx.moveTo(x + .5, 0); ctx.lineTo(x + .5, H); }
  for (let y = 60; y < H; y += 60){ ctx.moveTo(0, y + .5); ctx.lineTo(B, y + .5); }
  ctx.stroke();

  // Wellen (Tippen)
  for (let i = wellen.length - 1; i >= 0; i--){
    const w = wellen[i], a = (t - w.t) / 800;
    if (a >= 1){ wellen.splice(i, 1); continue; }
    ctx.strokeStyle = farbe(w.id); ctx.globalAlpha = 1 - a; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(w.x * B, w.y * H, 20 + a * 90, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Finger der anderen: weich dem Ziel hinterher (Nachrichten kommen nur 10× pro Sekunde)
  const k = 1 - Math.exp(-dt / 70);
  for (const [id, g] of geraete){
    const c = farbe(id);
    for (const f of g.finger){ f.x += (f.zx - f.x) * k; f.y += (f.zy - f.y) * k; g.spur.push({ x: f.x, y: f.y, t }); }
    while (g.spur.length && t - g.spur[0].t > 600) g.spur.shift();
    for (const s of g.spur){
      ctx.globalAlpha = (1 - (t - s.t) / 600) * .5; ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(s.x * B, s.y * H, 10, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const f of g.finger){
      ctx.shadowColor = c; ctx.shadowBlur = 24; ctx.fillStyle = c;
      ctx.beginPath(); ctx.arc(f.x * B, f.y * H, 26, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // eigene Finger: Ring
  ctx.strokeStyle = farbe(ID); ctx.lineWidth = 4;
  for (const f of eigene.values()){ ctx.beginPath(); ctx.arc(f.x * B, f.y * H, 34, 0, Math.PI * 2); ctx.stroke(); }

  // Messwerte 4× pro Sekunde auffrischen
  if (t - anzeigeZeit > 250){
    anzeigeZeit = t;
    $("#wVerzoegerung").textContent = rtt.median == null ? "–" : "≈ " + Math.round(rtt.median / 2) + " ms";
    $("#wServer").textContent = ms(serverMs);
    const n = new Set([...anwesend.keys(), ID]).size;
    const rate = (gesendet.proSekunde(t) + empfangen.proSekunde(t)) * n;
    $("#wRate").textContent = "≈ " + Math.round(rate);
    $("#wAbbrueche").textContent = Math.max(0, (verbindung?.stand.verbindungen ?? 1) - 1);
  }
  requestAnimationFrame(bild);
}
const farbe = id => (farbtabelle.get(id) ?? { wert: "#9aa3b8" }).wert;
requestAnimationFrame(bild);

/* Nach Neuladen gleich wieder in den Raum */
const gemerkt = sessionStorage.getItem("labor06-raum");
if (gemerkt && gueltig(gemerkt)) betrete(gemerkt);
