/* Planspiel Julikrise 1914 – Lehrer-Monitor (Laptop an der Tafel).
   Der Laptop ist die einzige Stelle mit dem vollen Spielstand: Er nimmt Aktionen der iPads an, wendet sie an
   (spiel.js) und schickt jeder Delegation nur ihre Sicht. Die Aktionsliste liegt in sessionStorage,
   nach dem Neuladen wird alles nachgespielt.

   Zwei Ansichten: „Tafel“ (für den Beamer, nur Öffentliches) und „Spielleitung“ (alles, nicht projizieren). */
import { STAATEN, TEAMS, RUNDEN } from "./content.js";
import { GEHEIM } from "./netz.js";
import { neuesSpiel, anwenden, nachspielen, sicht, lehrerSicht, auswertung, ablauf, staatVon } from "./spiel.js";
import { flagge } from "./flaggen.js";
import { verbinden, raumcodeNeu } from "./verbindung.js";

const app = document.getElementById("app");
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const PHASE = { lage: "Lage", fenster: "Diplomatie", welle: "Welle", aufloesung: "Auflösung", ausgang: "Ausgang", ende: "Ende" };
const DAUER = { lage: 6, fenster: 5, welle: 4, aufloesung: 3, ausgang: 3, ende: 0 };   // Minuten, Richtwerte für den Timer

let raum = sessionStorage.getItem("julikrise-lehrer-raum");
if (!raum) { raum = raumcodeNeu(); sessionStorage.setItem("julikrise-lehrer-raum", raum); }
let aktionen = JSON.parse(sessionStorage.getItem("julikrise-aktionen") || "[]");
let spiel = nachspielen(aktionen);
let modus = "tafel", timerEnde = null, bestaetigen = null;

const verbindung = verbinden(raum, (m) => {
  if (m.typ === "aktion") ausfuehren(m.aktion, m.geraet);
  if (m.typ === "hallo") senden(m.team);
});

function ausfuehren(aktion, geraet) {
  const r = anwenden(spiel, aktion);
  if (r.fehler) { if (geraet) verbindung.senden({ typ: "fehler", geraet, text: r.fehler }); else meldung(r.fehler); return false; }
  const vorher = spiel.phase.typ + spiel.runde;
  spiel = r.spiel; aktionen.push(aktion);
  sessionStorage.setItem("julikrise-aktionen", JSON.stringify(aktionen));
  if (spiel.phase.typ + spiel.runde !== vorher) timerStart();
  senden(); zeichnen();
  return true;
}
const lehrer = (aktion) => ausfuehren({ ...aktion, lehrer: true });

/* Jede Delegation bekommt nur ihre eigene Sicht. */
function senden(nur) {
  for (const t of TEAMS) if (!nur || nur === t.id) verbindung.senden({ typ: "sicht", team: t.id, sicht: sicht(spiel, t.id, null) });
}

function meldung(text) {
  document.querySelector(".fehler")?.remove();
  const d = document.createElement("div"); d.className = "fehler"; d.textContent = text; document.body.append(d);
  setTimeout(() => d.remove(), 4000);
}

function timerStart() { const m = DAUER[spiel.phase.typ] || 0; timerEnde = m ? Date.now() + m * 60000 : null; }
setInterval(() => { const t = document.querySelector(".timer"); if (t) timerSchreiben(t); }, 1000);
function timerSchreiben(el) {
  if (!timerEnde) { el.textContent = ""; return; }
  const rest = Math.round((timerEnde - Date.now()) / 1000), a = Math.abs(rest);
  el.textContent = `${rest < 0 ? "−" : ""}${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")}`;
  el.classList.toggle("ab", rest < 0);
}

/* ---------- Zeichnen ---------- */
function zeichnen() {
  const L = lehrerSicht(spiel), r = RUNDEN[spiel.runde - 1];
  const tag = tagIndex(spiel.runde);
  app.innerHTML = `
    <div class="kopf"><div class="titel"><div>Planspiel Julikrise 1914</div><h1>Runde ${spiel.runde} · ${esc(r.titel)}</h1></div>
      <div class="kalender">${Array.from({ length: 38 }, (_, i) => `<div class="tag ${i < tag ? "vorbei" : ""} ${i === tag ? "jetzt" : ""}"></div>`).join("")}</div>
      <div class="rechts"><b>${esc(r.zeitraum)}</b>${PHASE[spiel.phase.typ]}${spiel.phase.typ === "welle" ? " " + (spiel.phase.nr + 1) : ""}</div></div>
    <div class="steuer">
      <span class="raum">RAUM<b>${raum}</b></span>
      <div class="ablauf">${phasenleiste()}</div>
      <span class="timer"></span>
      <div class="modus" style="margin-left:auto"><button data-modus="tafel" class="${modus === "tafel" ? "an" : ""}">Tafel</button><button data-modus="leitung" class="${modus === "leitung" ? "an" : ""}">Spielleitung</button></div>
      ${spiel.phase.typ === "ende" ? (spiel.akten ? "" : `<button class="knopf" id="akten">Geheimakten öffnen</button>`) : `<button class="knopf" id="weiter">Weiter ›</button>`}
    </div>
    <div class="lehrer">${modus === "tafel" ? tafel(L) : leitung(L)}</div>
    ${bestaetigen ? `<div class="fehler" style="background:#2b2622;bottom:auto;top:30%">${esc(bestaetigen.text)}<div style="margin-top:10px;display:flex;gap:8px;justify-content:center"><button class="knopf" id="ja">Ja</button><button class="knopf zweit" id="nein" style="color:#fff;border-color:#fff">Abbrechen</button></div></div>` : ""}`;
  timerSchreiben(app.querySelector(".timer"));
  app.querySelectorAll("[data-modus]").forEach(b => b.onclick = () => { modus = b.dataset.modus; zeichnen(); });
  app.querySelector("#weiter")?.addEventListener("click", () => lehrer({ typ: "weiter" }));
  app.querySelector("#akten")?.addEventListener("click", () => { bestaetigen = { text: "Geheimakten jetzt für alle öffnen?", ja: () => lehrer({ typ: "aktenOeffnen" }) }; zeichnen(); });
  app.querySelectorAll("[data-notfall]").forEach(b => b.onclick = () => {
    const [team, wahl] = b.dataset.notfall.split(":");
    bestaetigen = { text: `Für ${STAATEN[staatVon(team, spiel.runde)].name} „${wahl}“ eintragen (Notfall)?`, ja: () => lehrer({ typ: "lehrerWahl", team, wahl }) }; zeichnen();
  });
  app.querySelector("#neu")?.addEventListener("click", () => { bestaetigen = { text: "Ganz neues Spiel beginnen? Der jetzige Stand geht verloren.", ja: neuesSpielStarten }; zeichnen(); });
  app.querySelector("#drucken")?.addEventListener("click", () => window.print());
  app.querySelector("#ja")?.addEventListener("click", () => { const f = bestaetigen.ja; bestaetigen = null; f(); zeichnen(); });
  app.querySelector("#nein")?.addEventListener("click", () => { bestaetigen = null; zeichnen(); });
}

function tagIndex(runde) { return [0, 9, 25, 30, 34][runde - 1]; }   // 28.6. = Tag 0

function phasenleiste() {
  const a = ablauf(spiel.runde);
  const jetzt = ["ausgang", "ende"].includes(spiel.phase.typ) ? a.length : spiel.schritt;
  return a.map((p, i) => `<span class="${i === jetzt ? "jetzt" : i < jetzt ? "vorbei" : ""}">${PHASE[p.typ]}${p.typ === "welle" ? " " + (p.nr + 1) : p.typ === "fenster" ? "" : ""}</span>`).join("")
    + (spiel.phase.typ === "ausgang" ? `<span class="jetzt">Ausgang</span>` : "");
}

/* Was in der Runde öffentlich verkündet ist (geheime Entscheidungen erst mit den Geheimakten). */
const oeffentlich = (e) => spiel.akten || !(`${e.runde}.${e.staat}` in GEHEIM);

function tafel(L) {
  const r = RUNDEN[spiel.runde - 1];
  let h = "";
  if (spiel.phase.typ === "ausgang") { const a = spiel.ausgaenge.at(-1); h += `<div class="ereignis gross"><div class="klein">Ausgang nach Runde ${a.runde}</div><h2>${esc(a.titel)}</h2><div class="klein">Was den Unterschied machte</div><ul>${a.saetze.map(t => `<li>${esc(t)}</li>`).join("")}</ul><div class="klein">Aber</div><p>${esc(a.aber)}</p><div class="klein">1914</div><p>${esc(a.war1914)}</p><p class="sans">Weiter geht es mit der Akte 1914.</p></div>`; }
  if (spiel.phase.typ === "aufloesung") h += `<div class="ereignis gross"><div class="klein">Was 1914 geschah</div><ul>${r.aufloesung.map(t => `<li>${esc(t)}</li>`).join("")}</ul>${r.schluss ? `<p><i>${esc(r.schluss)}</i></p>` : ""}</div>`;
  if (spiel.phase.typ === "ende") h += endeKarte();
  if (spiel.phase.typ === "lage") h += `<div class="flaeche gross" style="border-radius:4px;min-height:0;margin:0 0 14px"><div class="klein">Die Lage · für alle</div>${r.lage.map(t => `<p>${esc(t)}</p>`).join("")}<div class="klein">Worum es jetzt geht</div><ul>${r.worumEsGeht.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
  h += `<div class="kacheln">${L.delegationen.map(d => {
    const e = spiel.verlauf.find(x => x.runde === spiel.runde && x.staat === d.staat);
    const verk = e && spiel.verkuendet[`${e.runde}.${e.staat}`];
    return `<div class="kachel ${d.entscheidetJetzt ? "dran" : ""} ${d.beschlossen ? "fertig" : ""}"><div class="kopfz">${flagge(d.staat, 42)}<h3>${STAATEN[d.staat].name}</h3></div>
      <div class="status">${d.geraete} iPad${d.geraete === 1 ? "" : "s"} · ${d.entscheidetJetzt ? (d.beschlossen ? "hat beschlossen ✓" : d.grenze ? "muss neu entscheiden" : "berät …") : verk ? "verkündet" : "wartet"}</div>
      ${verk ? `<div class="wahl">${oeffentlich(e) ? esc(e.text) : "<i>Die Entscheidung ist geheim.</i>"}</div>` : ""}</div>`;
  }).join("")}</div>`;
  const oeffentlicheNoten = spiel.noten.filter(n => n.oeffentlich && n.runde === spiel.runde);
  if (oeffentlicheNoten.length) h += `<div class="flaeche" style="border-radius:4px;min-height:0"><div class="klein">Öffentliche Erklärungen</div>${oeffentlicheNoten.map(n => `<div class="telegramm"><div class="kopfzeile"><span>${STAATEN[n.vonStaat].name} an alle</span></div><span class="streifen">${esc(n.text)}</span></div>`).join("")}</div>`;
  return h;
}

function leitung(L) {
  const r = RUNDEN[spiel.runde - 1];
  let h = `<div class="hinweis nicht-drucken" style="background:#f6d9d4">Spielleitung: nicht an die Tafel projizieren – hier stehen auch geheime Entscheidungen und private Noten.</div>`;
  h += `<div class="kacheln">${L.delegationen.map(d => {
    const zaehl = Object.values(d.stimmen).reduce((a, w) => (a[w] = (a[w] || 0) + 1, a), {});
    const k = r.staaten[d.staat];
    return `<div class="kachel ${d.entscheidetJetzt ? "dran" : ""} ${d.beschlossen ? "fertig" : ""}"><div class="kopfz">${flagge(d.staat, 42)}<h3>${STAATEN[d.staat].name}</h3></div>
      <div class="status">${d.geraete} iPad${d.geraete === 1 ? "" : "s"} · Stimmen: ${Object.entries(zaehl).map(([w, n]) => `${w}×${n}`).join(" ") || "–"} · 1914: ${k.historisch}</div>
      ${d.beschlossen ? `<div class="wahl"><b>${d.beschlossen}</b> ${esc(k.optionen[d.beschlossen]?.text || "")}</div>` : ""}
      ${d.grenze ? `<div class="wahl" style="color:var(--rot)">Grenze: ${esc(d.grenze)}</div>` : ""}
      ${d.entscheidetJetzt && !d.beschlossen ? `<div class="notfall">Notfall: ${["A", "B", "C"].map(b => `<button data-notfall="${d.team}:${b}">${b}</button>`).join("")}</div>` : ""}</div>`;
  }).join("")}</div>`;
  h += `<div class="flaeche" style="border-radius:4px;min-height:0"><div class="zwei"><div>`;
  if (L.pflichtOffen.length) h += `<div class="klein">Offene Pflichtnoten</div>${L.pflichtOffen.map(v => `<p class="sans" style="margin:4px 0">${STAATEN[v.von].kurz} → ${v.an.map(a => a === "alle" ? "alle" : STAATEN[a].kurz).join(", ")}: ${esc(v.text)}</p>`).join("")}`;
  if (r.spielleitung) h += `<div class="klein">Hinweis zur Runde</div><p class="sans" style="font-size:14px">${esc(r.spielleitung)}</p>`;
  if (r.platzhalter.length) h += `<div class="klein">Quelle zeigen (noch Platzhalter)</div><p class="sans" style="font-size:14px">${esc(r.platzhalter.join(" · "))}</p>`;
  h += `<div class="klein">Typische Abweichungen</div><p class="sans" style="font-size:14px">${esc(r.abweichungen)}</p>`;
  h += `<div class="klein">Alle Noten dieser Runde</div>${spiel.noten.filter(n => n.runde === spiel.runde).map(n =>
    `<div class="telegramm"><div class="kopfzeile"><span>${STAATEN[n.vonStaat].kurz} → ${n.an.map(a => a === "alle" ? "alle" : STAATEN[a].kurz).join(", ")}${n.pflicht ? " · Pflicht" : ""}</span><span>${esc(n.art)}</span></div><span class="streifen">${esc(n.text)}</span>${n.antworten.map(a => `<div class="antwort sans" style="font-size:14px"><b>${STAATEN[a.vonStaat].kurz}:</b> ${esc(a.text)}</div>`).join("")}</div>`).join("") || `<p class="sans" style="font-size:14px">Keine.</p>`}`;
  h += `</div><div><div class="klein">Auswertung bisher</div>${auswertungTabelle()}
    <p class="nicht-drucken" style="margin-top:14px"><button class="knopf zweit" id="drucken">Auswertung drucken</button> <button class="knopf zweit" id="neu">Neues Spiel</button></p></div></div></div>`;
  return h;
}

function auswertungTabelle() {
  const a = auswertung(spiel);
  if (!a.length) return `<p class="sans" style="font-size:14px">Noch keine Entscheidungen.</p>`;
  return `<table><tr><th>R</th><th>Staat</th><th>Unsere Wahl</th><th>1914</th><th>Prognosen</th></tr>${a.map(e => `<tr>
    <td>${e.runde}</td><td>${STAATEN[e.staat].kurz}${e.geheim ? " 🔒" : ""}</td>
    <td><b>${e.wahl}</b> ${esc(e.text)}${e.verkuendung ? `<br><i>${esc(e.verkuendung)}</i>` : ""}</td>
    <td class="${e.wie1914 ? "ja" : "nein"}">${e.wie1914 ? "wie 1914" : `1914: ${e.historisch}`}</td>
    <td>${e.prognosen.map(p => `${STAATEN[p.staat].kurz}: ${esc(p.erwartet)} ${p.getroffen == null ? "" : p.getroffen ? '<span class="ja">✓</span>' : `<span class="nein">✗</span> (${esc(p.tatsaechlich)})`}`).join("<br>")}</td></tr>`).join("")}</table>`;
}

function endeKarte() {
  const s = sicht(spiel, "d", null).ende;
  return `<div class="ereignis gross"><h2>${esc(s.titel)}</h2><ul>${s.saetze.map(t => `<li>${esc(t)}</li>`).join("")}</ul><div class="klein">1914</div><p>${esc(s.war1914)}</p>
    ${spiel.ausgaenge.length ? `<div class="klein">Unterwegs habt ihr den Krieg (vorerst) verhindert</div><ul>${spiel.ausgaenge.map(a => `<li>Nach Runde ${a.runde}: ${esc(a.titel)} – ${esc(a.saetze[0])}</li>`).join("")}</ul>` : ""}
    ${spiel.akten ? `<div class="klein">Geheimakten</div><ul>${spiel.verlauf.filter(e => `${e.runde}.${e.staat}` in GEHEIM).map(e => `<li>Runde ${e.runde}, ${STAATEN[e.staat].name}: ${esc(e.text)}</li>`).join("")}</ul>` : `<p class="sans">Die Geheimakten sind noch verschlossen.</p>`}</div>`;
}

function neuesSpielStarten() {
  aktionen = []; spiel = neuesSpiel(); sessionStorage.setItem("julikrise-aktionen", "[]");
  raum = raumcodeNeu(); sessionStorage.setItem("julikrise-lehrer-raum", raum);
  location.reload();
}

timerStart();
zeichnen();
senden();
verbindung.senden({ typ: "da" });
