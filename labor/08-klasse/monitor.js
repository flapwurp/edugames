/* Lehrer-Monitor: hört alle Paar-Kanäle über EINE Verbindung mit und rechnet jedes Feld selbst nach. */
import { $, SERVER, KEY, zeigeStatus } from "./gemeinsam.js";
import { realtime } from "./realtime.js";
import { welt, leer, auswerten, darfZiehen, zugEinarbeiten, standUebernehmen, kanalName, FELDER, SCHAETZE, PAARE } from "./spiel.js";
import { gueltig, neuerCode, neueId } from "../06-multiplayer/raum.js";

let klasse = location.hash.slice(1);
if (!gueltig(klasse)){ klasse = neuerCode(); history.replaceState(null, "", "#" + klasse); }
$("#klasseCode").textContent = klasse;

const RUHIG_MS = 30000;
let serverMs = null;
const rt = realtime({ url: SERVER, key: KEY, bei: { status: zeigeStatus, server: ms => { serverMs = ms; } } });
document.addEventListener("visibilitychange", () => { if (!document.hidden) rt.pruefe(); });
$("#ende").onclick = () => { rt.schliesse(); stoppeBots(); location.href = "./" + location.search; };

/* Nachrichten im Projekt: jede Nachricht zählt beim Senden einmal und bei jedem Empfänger einmal */
const last = [];
function zaehle(gewicht){ last.push([performance.now(), gewicht]); }
function rate(){
  const t = performance.now();
  while (last.length && t - last[0][0] > 3000) last.shift();
  return last.reduce((s, [, g]) => s + g, 0) / 3;
}

/* ---------- Ein Eintrag pro Paar ---------- */
const paare = [];
for (let p = 1; p <= PAARE; p++){
  const e = { p, stand: leer(), w: welt(klasse, p, 1), geraete: 0, zuletzt: 0, karte: null };
  e.kanal = rt.kanal(kanalName(klasse, p), {
    sichtbar: false,     // der Monitor zählt nicht als Spieler
    bei: {
      bereit: () => e.kanal.sende("stand?", { von: "monitor" }),
      anwesenheit: m => { e.geraete = [...m.values()].filter(x => x.rolle === "paar").length; zeichne(e); },
      nachricht: (event, x) => empfange(e, event, x),
    },
  });
  e.karte = document.createElement("article");
  e.karte.className = "paar";
  e.karte.innerHTML = "<h3><span>Paar " + p + "</span><span class=\"geraete\"></span></h3><div class=\"mini\">" + "<i></i>".repeat(FELDER) + "</div><div class=\"info\"></div>";
  $("#paare").append(e.karte);
  paare.push(e);
  zeichne(e);
}

function setze(e, neu){
  if (neu.runde !== e.stand.runde) e.w = welt(klasse, e.p, neu.runde);
  if (neu !== e.stand) e.zuletzt = Date.now();
  e.stand = neu;
  zeichne(e);
}

function empfange(e, event, x){
  zaehle(e.geraete + 1);
  if (event === "stand") setze(e, standUebernehmen(e.stand, x.stand));
  if (event === "zug"){
    const neu = zugEinarbeiten(e.stand, { von: x.von, feld: x.feld }, x.n, e.w);
    if (neu === e.stand && x.n > e.stand.zuege.length + 1) e.kanal.sende("stand?", { von: "monitor" });
    setze(e, neu);
  }
}

function zeichne(e){
  const a = auswerten(e.w, e.stand), aktiv = e.geraete > 0 || a.zuege > 0;
  const ruhig = aktiv && e.geraete > 1 && !a.fertig && e.zuletzt && Date.now() - e.zuletzt > RUHIG_MS;
  e.karte.className = "paar" + (aktiv ? " aktiv" : "") + (a.fertig ? " fertig" : ruhig ? " ruhig" : "");
  e.karte.querySelector(".geraete").textContent = "●".repeat(e.geraete) || "–";
  e.karte.querySelectorAll(".mini i").forEach((z, i) => {
    const offen = a.offen.has(i), schatz = e.w.schatz.has(i);
    z.className = (offen ? "offen" : "") + (offen && schatz ? " schatz" : "") + (!offen && schatz ? " versteckt" : "");
    z.textContent = offen && !schatz && e.w.zahl[i] ? e.w.zahl[i] : "";
  });
  const seit = e.zuletzt ? Math.round((Date.now() - e.zuletzt) / 1000) : null;
  e.karte.querySelector(".info").textContent =
    !aktiv ? "frei"
    : "Runde " + e.stand.runde + " · " + a.gefunden + "/" + SCHAETZE + " Schätze · " + a.zuege + " Züge"
      + (a.fertig ? " · fertig" : seit != null ? " · letzter Zug vor " + seit + " s" : "");
}

/* Kennzahlen und „ruhig seit …“ jede Sekunde auffrischen */
setInterval(() => {
  paare.forEach(zeichne);
  $("#wPaare").textContent = paare.filter(e => e.geraete > 0).length;
  $("#wGeraete").textContent = paare.reduce((s, e) => s + e.geraete, 0);
  $("#wRate").textContent = "≈ " + Math.round(rate());
  $("#wServer").textContent = serverMs == null ? "–" : Math.round(serverMs) + " ms";
}, 1000);

/* ---------- Testpaare: simulierte iPads, damit man den Monitor ohne 30 Geräte sieht ----------
   Jedes simulierte iPad hat eine eigene Verbindung, wie ein echtes. Sie belasten das Kontingent echt. */
let bots = [];
const BOT_PAARE = [12, 13, 14, 15];

function bot(p){
  const id = neueId(), r = realtime({ url: SERVER, key: KEY });
  let stand = leer(), w = welt(klasse, p, 1), da = 0, timer = null;
  const k = r.kanal(kanalName(klasse, p), {
    id, meta: { rolle: "paar" },
    bei: {
      bereit: () => k.sende("stand?", { von: id }),
      anwesenheit: m => { da = [...m.values()].filter(x => x.rolle === "paar").length; plane(); },
      nachricht: (event, x) => {
        if (event === "stand?" && stand.zuege.length) k.sende("stand", { stand });
        if (event === "stand") neu(standUebernehmen(stand, x.stand));
        if (event === "zug") neu(zugEinarbeiten(stand, { von: x.von, feld: x.feld }, x.n, w));
      },
    },
  });
  function neu(s){ if (s.runde !== stand.runde) w = welt(klasse, p, s.runde); stand = s; plane(); }
  function plane(){
    clearTimeout(timer);
    if (da < 2) return;
    if (auswerten(w, stand).fertig){
      // nur ein Bot startet die neue Runde (der mit dem letzten Zug)
      if (stand.zuege.at(-1)?.von === id) timer = setTimeout(() => { neu(leer(stand.runde + 1)); k.sende("stand", { stand }); }, 6000);
      return;
    }
    if (!darfZiehen(stand, id, w)) return;
    timer = setTimeout(() => {
      const frei = [...Array(FELDER).keys()].filter(f => !stand.zuege.some(z => z.feld === f));
      const zug = { von: id, feld: frei[Math.floor(Math.random() * frei.length)] }, n = stand.zuege.length + 1;
      neu(zugEinarbeiten(stand, zug, n, w));
      k.sende("zug", { ...zug, n });
    }, 1500 + Math.random() * 3500);
  }
  return () => { clearTimeout(timer); r.schliesse(); };
}

function stoppeBots(){ bots.forEach(s => s()); bots = []; }
$("#bots").onclick = e => {
  const an = !bots.length;
  if (an) bots = BOT_PAARE.flatMap(p => [bot(p), bot(p)]);
  else stoppeBots();
  e.currentTarget.setAttribute("aria-pressed", String(an));
  e.currentTarget.textContent = an ? "Testpaare stoppen (12–15)" : "Testpaare simulieren";
};
addEventListener("pagehide", stoppeBots);
