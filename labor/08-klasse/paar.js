/* Paar-Gerät: Spielfeld, eigene Züge senden, Züge des Partners einarbeiten. */
import { $, SERVER, KEY, ID, zeigeStatus, toast, wachhalten } from "./gemeinsam.js";
import { realtime } from "./realtime.js";
import { welt, leer, auswerten, darfZiehen, zugEinarbeiten, standUebernehmen, kanalName, FELDER, SCHAETZE, PAARE } from "./spiel.js";
import { gueltig, farben } from "../06-multiplayer/raum.js";

const [klasse, paarText] = location.hash.slice(1).split("-");
const paar = Number(paarText);
if (!gueltig(klasse ?? "") || !(paar >= 1 && paar <= PAARE)) location.replace("./" + location.search);

$("#klasseCode").textContent = klasse;
$("#paarNr").textContent = paar;
$("#verlassen").onclick = () => { rt.schliesse(); sessionStorage.removeItem(merkKey); location.href = "./" + location.search; };

/* Spielstand: auch in sessionStorage, damit Neuladen nichts verliert */
const merkKey = "labor08-stand-" + klasse + "-" + paar;
let stand = leer();
try { stand = standUebernehmen(stand, JSON.parse(sessionStorage.getItem(merkKey))); } catch {}
let w = welt(klasse, paar, stand.runde);
let partner = new Map(), farbe = farben([ID]);

const rt = realtime({ url: SERVER, key: KEY, bei: { status: zeigeStatus } });
wachhalten(rt);
const k = rt.kanal(kanalName(klasse, paar), {
  id: ID, meta: { rolle: "paar" },
  bei: {
    bereit: () => k.sende("stand?", { von: ID }),
    anwesenheit: m => {
      partner = new Map([...m].filter(([id, meta]) => id !== ID && meta.rolle === "paar"));
      farbe = farben([ID, ...partner.keys()]);
      zeichne();
    },
    nachricht: empfange,
  },
});

function setzeStand(neu){
  if (neu.runde !== stand.runde) w = welt(klasse, paar, neu.runde);
  stand = neu;
  sessionStorage.setItem(merkKey, JSON.stringify(stand));
  zeichne();
}

function empfange(event, p){
  switch (event){
    case "stand?":
      if (stand.zuege.length || stand.runde > 1) k.sende("stand", { stand });
      break;
    case "stand":
      setzeStand(standUebernehmen(stand, p.stand));
      break;
    case "zug": {
      const vorher = stand;
      const neu = zugEinarbeiten(stand, { von: p.von, feld: p.feld }, p.n, w);
      if (neu === vorher){ if (p.n > stand.zuege.length + 1) k.sende("stand?", { von: ID }); return; }
      const meinerWeg = vorher.zuege.length === p.n && vorher.zuege[p.n - 1].von === ID;
      if (meinerWeg) toast("Gleichzeitig getippt – der Zug deines Partners zählt");
      setzeStand(neu);
      break;
    }
  }
}

/* ---------- Spielfeld ---------- */
const feld = $("#feld");
const zellen = [...Array(FELDER)].map((_, i) => {
  const b = document.createElement("button");
  b.className = "zelle"; b.setAttribute("aria-label", "Feld " + (i + 1));
  b.onclick = () => tippe(i);
  feld.append(b);
  return b;
});

function tippe(i){
  if (!partner.size || !k.beigetreten || !darfZiehen(stand, ID, w)) return;
  if (stand.zuege.some(z => z.feld === i)) return;
  const zug = { von: ID, feld: i }, n = stand.zuege.length + 1;
  setzeStand(zugEinarbeiten(stand, zug, n, w));
  k.sende("zug", { ...zug, n });
}

$("#neueRunde").onclick = () => {
  setzeStand(leer(stand.runde + 1));
  k.sende("stand", { stand });
};

function zeichne(){
  const a = auswerten(w, stand), wer = new Map(stand.zuege.map(z => [z.feld, z.von]));
  zellen.forEach((z, i) => {
    const offen = a.offen.has(i), schatz = offen && w.schatz.has(i);
    z.className = "zelle" + (offen ? " offen" : "") + (schatz ? " schatz" : "");
    z.textContent = !offen ? "" : schatz ? "◆" : (w.zahl[i] || "");
    if (offen){
      const d = document.createElement("span"); d.className = "wer";
      d.style.background = (farbe.get(wer.get(i)) ?? { wert: "#9aa3b8" }).wert;
      z.append(d);
    }
  });
  const ich = darfZiehen(stand, ID, w);
  feld.classList.toggle("gesperrt", !partner.size || !ich);
  const meine = farbe.get(ID);
  $("#ansage").innerHTML =
    a.fertig ? "Alle Schätze gefunden – in <b>" + a.zuege + "</b> Zügen."
    : !partner.size ? "Warte auf dein Partner-iPad (gleicher Code, Paar " + paar + ")."
    : ich ? "<b>Du bist dran.</b> Deine Farbe: <span style=\"color:" + meine.wert + "\">" + meine.name + "</span>"
    : "Dein Partner ist dran …";
  $("#zahlen").textContent = "Runde " + stand.runde + " · Schätze " + a.gefunden + "/" + SCHAETZE + " · Züge " + a.zuege + " · Zahlen = Schätze auf den Nachbarfeldern";
  $("#partner").textContent = partner.size ? "Partner da" : "Partner fehlt";
  $("#neueRunde").hidden = !a.fertig;
}
zeichne();
