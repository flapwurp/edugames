/* Mini-Spiel „Schatzsuche“ – reine Logik, ohne DOM und ohne Netz (in Node testbar).

   Grundidee (wie in den echten Spielen): Die Welt wird NICHT übertragen.
   Jedes Gerät erzeugt sie selbst aus Klassencode + Paarnummer + Runde.
   Über das Netz gehen nur die Züge („Feld 12 aufgedeckt“).
   So kann auch der Lehrer-Monitor jedes Spielfeld selbst nachrechnen.

   Regeln: 5 × 5 Felder, 3 Schätze. Aufgedeckte Felder zeigen, wie viele
   Schätze daneben liegen. Die beiden Geräte decken abwechselnd auf. */
import { roundRng, shuffle } from "../../shared/random.js";
import { ZEICHEN } from "../06-multiplayer/raum.js";

export const SEITE = 5, FELDER = SEITE * SEITE, SCHAETZE = 3, PAARE = 15;

export const kanalName = (klasse, paar) => "labor08-" + klasse + "-p" + paar;

/* Klassencode (4 Buchstaben) + Paar → eine Zahl für roundRng */
export function codeZahl(klasse, paar){
  let n = 0;
  for (const c of klasse) n = n * ZEICHEN.length + ZEICHEN.indexOf(c);
  return n * 32 + paar;
}

export function welt(klasse, paar, runde){
  const rng = roundRng(codeZahl(klasse, paar), runde);
  const schatz = new Set(shuffle([...Array(FELDER).keys()], rng).slice(0, SCHAETZE));
  const zahl = [...Array(FELDER).keys()].map(i => nachbarn(i).filter(j => schatz.has(j)).length);
  return { schatz, zahl };
}

export function nachbarn(i){
  const x = i % SEITE, y = Math.floor(i / SEITE), r = [];
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++){
    const nx = x + dx, ny = y + dy;
    if ((dx || dy) && nx >= 0 && ny >= 0 && nx < SEITE && ny < SEITE) r.push(ny * SEITE + nx);
  }
  return r;
}

/* Spielstand = Runde + Liste der Züge [{von, feld}]. Alles andere wird daraus berechnet. */
export const leer = (runde = 1) => ({ runde, zuege: [] });

export function auswerten(w, stand){
  const offen = new Set(stand.zuege.map(z => z.feld));
  const gefunden = [...offen].filter(f => w.schatz.has(f)).length;
  return { offen, gefunden, fertig: gefunden === SCHAETZE, zuege: stand.zuege.length };
}

/* Darf `id` jetzt ziehen? Abwechselnd: nie zweimal hintereinander dasselbe Gerät. */
export function darfZiehen(stand, id, w){
  if (auswerten(w, stand).fertig) return false;
  const letzter = stand.zuege[stand.zuege.length - 1];
  return !letzter || letzter.von !== id;
}

export function zugGueltig(stand, zug, w){
  return Number.isInteger(zug.feld) && zug.feld >= 0 && zug.feld < FELDER
    && !stand.zuege.some(z => z.feld === zug.feld)
    && darfZiehen(stand, zug.von, w);
}

/* Ein Zug kommt übers Netz. n = laufende Nummer des Zugs (1, 2, 3 …).
   Gleichzeitige Züge (beide tippen fast gleichzeitig als Zug n): Es gewinnt die kleinere Geräte-Kennung,
   beide Geräte entscheiden gleich, ohne sich abzusprechen. */
export function zugEinarbeiten(stand, zug, n, w){
  if (n === stand.zuege.length + 1) return zugGueltig(stand, zug, w) ? { ...stand, zuege: [...stand.zuege, zug] } : stand;
  if (n === stand.zuege.length){
    const meiner = stand.zuege[n - 1];
    if (meiner.von !== zug.von && zug.von < meiner.von){
      const vorher = { ...stand, zuege: stand.zuege.slice(0, -1) };
      return zugGueltig(vorher, zug, w) ? { ...vorher, zuege: [...vorher.zuege, zug] } : stand;
    }
  }
  return stand;   // veraltet oder Lücke – wird über „stand“ nachgeholt
}

/* Kompletter Stand vom Partner (nach Neuladen, Beitritt, Lücke): neuere Runde oder mehr Züge gewinnt. */
export function standUebernehmen(meiner, fremd){
  if (!fremd || !Array.isArray(fremd.zuege)) return meiner;
  if (fremd.runde > meiner.runde) return fremd;
  if (fremd.runde === meiner.runde && fremd.zuege.length > meiner.zuege.length) return fremd;
  return meiner;
}
