/* Im Rhythmus des Nils – Lehrerkonsole: an jede Stelle des Spiels springen, ohne alles durchzuspielen.

   Öffnen: an die Adresse „#lehrer“ anhängen, z. B. https://flapwurp.github.io/edugames/im-rhythmus-des-nils/#lehrer
   und das Passwort eingeben. Danach bleibt unten links der Knopf „Lehrkraft“, bis der Tab geschlossen wird.

   Im Code steht nur der SHA-256-Wert des Passworts, nicht das Passwort selbst. Das hält Kinder fern, ist aber kein
   echter Schutz (der Code ist öffentlich). Für die Konsole gibt es nichts zu schützen: Sie spielt nur vor.

   Der Sprung startet ein neues Spiel und lässt es mit den normalen Spielregeln bis zur gewählten Stelle laufen
   (app.js → jumpTo). Wie gespielt wird, legt der „Weg“ fest. */
import { esc, openSheet, closeSheet, toast } from "../shared/ui.js";

const HASH = "bc8e71d1d0e253c079c7f144a82d377ccd43f14d1bb6ca8240dba102bec0c035";
const KEY = "nil-lehrer";

/* Sprungziele: year/phase = Anfang dieser Phase; screen = Bildschirm nach dem Spiel */
export const ZIELE = [
  { gruppe: "Jahr 1 – gute Flut", ziele: [
    { label: "Sirius erscheint", year: 1, phase: "sirius" },
    { label: "Überschwemmung (Achet)", year: 1, phase: "achet" },
    { label: "Felder bestellen", year: 1, phase: "aussaat" },
    { label: "Ernte", year: 1, phase: "ernte" },
    { label: "Trockenzeit (Körbe)", year: 1, phase: "trockenzeit" }
  ] },
  { gruppe: "Jahr 2 – zu niedrige Flut", ziele: [
    { label: "Sirius erscheint", year: 2, phase: "sirius" },
    { label: "Schaduf bauen?", year: 2, phase: "schadufWahl" },
    { label: "Felder bestellen", year: 2, phase: "aussaat" },
    { label: "Reicht es für ein Jahr?", year: 2, phase: "versorgung" },
    { label: "Hof verlassen (verloren)", year: 2, phase: "verloren", weg: { koerbe1: 0, schaduf: "lassen" } },
    { label: "Die Familien beraten", year: 2, phase: "dorfRat" },
    { label: "Dorf bauen", year: 2, phase: "dorfbau" }
  ] },
  { gruppe: "Jahr 3 – zu hohe Flut", ziele: [
    { label: "Sirius erscheint", year: 3, phase: "sirius" },
    { label: "Hochwasser (Achet)", year: 3, phase: "achet" },
    { label: "Grenzen neu festlegen", year: 3, phase: "aussaat" },
    { label: "Dorfspeicher hilft", year: 3, phase: "versorgung" },
    { label: "Trockenzeit (Deich ausbessern)", year: 3, phase: "trockenzeit" }
  ] },
  { gruppe: "Jahr 4 – gute Flut", ziele: [
    { label: "Sirius erscheint", year: 4, phase: "sirius" },
    { label: "Berufe wählen", year: 4, phase: "beruf" },
    { label: "Felder bestellen", year: 4, phase: "aussaat" },
    { label: "Trockenzeit (Beruf)", year: 4, phase: "trockenzeit" }
  ] },
  { gruppe: "Nach dem Spiel", ziele: [
    { label: "Bilanz", screen: "bilanz" },
    { label: "Quelle: Nilhymnus", screen: "quelle" },
    { label: "Urteil", screen: "urteil" },
    { label: "Denkanstoß", screen: "impuls" }
  ] }
];

const WEG = {
  koerbe1: { label: "Körbe in Jahr 1", opts: [["max", "so viele wie möglich"], ["2", "2"], ["1", "1"], ["0", "keine"]] },
  schaduf: { label: "Schaduf in Jahr 2", opts: [["bauen", "bauen"], ["lassen", "nicht bauen"]] },
  eimer: { label: "Eimer schöpfen", opts: [["6", "6 (volle Ernte)"], ["3", "3 (kleine Ernte)"]] },
  beruf: { label: "Beruf in Jahr 4", opts: [["toepfer", "Töpfer"], ["weberin", "Weberin"], ["landvermesser", "Landvermesser"], ["verwalter", "Speicherverwalter"]] }
};
const wahl = {};   // zuletzt gewählter Weg (nur in diesem Tab)

const unlocked = () => { try { return sessionStorage.getItem(KEY) === "1"; } catch { return false; } };

async function sha256(text){
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function showButton(){
  if (document.querySelector(".lehrer-knopf")) return;
  const b = document.createElement("button");
  b.className = "lehrer-knopf"; b.type = "button"; b.textContent = "Lehrkraft";
  b.addEventListener("click", () => openMenu());
  document.body.appendChild(b);
}

function askPassword(){
  if (!window.crypto?.subtle){ toast("Die Lehrerkonsole geht nur über https.", "", 3600); return; }
  openSheet(`<h2>Lehrerkonsole</h2>
    <form class="lehrer-login"><label>Passwort <input type="password" autocomplete="off" autocapitalize="off" spellcheck="false"></label>
    <p class="fb" hidden>Das Passwort stimmt nicht.</p>
    <div class="btnrow"><button type="button" class="btn secondary" data-act="closeSheet">Abbrechen</button><button class="btn">Öffnen</button></div></form>`, false);
  const form = document.querySelector(".lehrer-login"), input = form.querySelector("input");
  input.focus();
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (await sha256(input.value.trim()) !== HASH){ form.querySelector(".fb").hidden = false; input.select(); return; }
    try { sessionStorage.setItem(KEY, "1"); } catch {}
    showButton(); openMenu();
  });
}

function openMenu(){
  const sel = (k, w) => `<label>${esc(w.label)} <select data-weg="${k}">${w.opts.map(([v, t]) =>
    `<option value="${v}" ${wahl[k] === v ? "selected" : ""}>${esc(t)}</option>`).join("")}</select></label>`;
  let n = 0;
  const gruppen = ZIELE.map(g => `<section><h3>${esc(g.gruppe)}</h3><div class="ziele">${g.ziele.map(z =>
    `<button type="button" class="opt" data-ziel="${n++}">${esc(z.label)}</button>`).join("")}</div></section>`).join("");
  openSheet(`<div class="lehrer-menu"><h2>Lehrerkonsole: Springen</h2>
    <p>Startet ein neues Spiel und spielt es bis zur gewählten Stelle vor.</p>
    <fieldset class="weg"><legend>Weg</legend>${Object.entries(WEG).map(([k, w]) => sel(k, w)).join("")}</fieldset>
    ${gruppen}<div class="btnrow"><button type="button" class="btn secondary" data-act="closeSheet">Schließen</button></div></div>`, false);
  const root = document.querySelector(".lehrer-menu");
  root.querySelectorAll("select").forEach(s => s.addEventListener("change", () => { wahl[s.dataset.weg] = s.value; }));
  root.querySelectorAll("[data-ziel]").forEach(b => b.addEventListener("click", () => {
    const z = ZIELE.flatMap(g => g.ziele)[+b.dataset.ziel];
    const w = {};
    root.querySelectorAll("select").forEach(s => { w[s.dataset.weg] = s.value; });
    const weg = { koerbe1: w.koerbe1 === "max" ? null : +w.koerbe1, schaduf: w.schaduf, eimer: +w.eimer, beruf: w.beruf, ...(z.weg || {}) };
    closeSheet();
    const ok = jump(z, weg);
    toast(ok ? `Gesprungen: ${z.label}` : "Auf diesem Weg kommt man dort nicht hin (z. B. Hof verlassen). Der Weg endet hier.", "", 3600);
  }));
}

let jump = () => false;

/* jumpTo(ziel, weg) kommt aus app.js und gibt zurück, ob das Ziel erreicht wurde */
export function initLehrer(jumpTo){
  jump = jumpTo;
  if (unlocked()) showButton();
  const check = () => {
    if (location.hash !== "#lehrer") return;
    history.replaceState(null, "", location.pathname + location.search);
    unlocked() ? openMenu() : askPassword();
  };
  window.addEventListener("hashchange", check);
  check();
}
