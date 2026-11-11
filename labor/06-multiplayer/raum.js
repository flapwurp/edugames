/* Spiellogik ohne DOM und ohne Netz: Raumcodes, Farben, Messwerte, Drossel.
   In Node testbar (tests/labor-multiplayer.test.js). */

/* Ohne I und O, damit niemand sie mit 1 und 0 verwechselt. 24^4 ≈ 330.000 Codes. */
export const ZEICHEN = "ABCDEFGHJKLMNPQRSTUVWXYZ";
export const LAENGE = 4;

function sichererZufall(){
  const a = new Uint32Array(1);
  globalThis.crypto.getRandomValues(a);
  return a[0] / 2 ** 32;
}

export function neuerCode(zufall = sichererZufall){
  let s = "";
  for (let i = 0; i < LAENGE; i++) s += ZEICHEN[Math.floor(zufall() * ZEICHEN.length)];
  return s;
}

/* Eingabe aufräumen: Großbuchstaben, nur Buchstaben, höchstens 4 */
export function normalisiere(text){
  return String(text).toUpperCase().replace(/[^A-Z]/g, "").slice(0, LAENGE);
}

export function gueltig(code){
  return code.length === LAENGE && [...code].every(c => ZEICHEN.includes(c));
}

/* Kanalname bei Supabase. Präfix trennt das Labor von späteren Spielen. */
export const kanal = code => "labor06-" + code;

/* Zufällige Geräte-Kennung, nur für diese Sitzung. Kein Name, kein Login. */
export function neueId(zufall = sichererZufall){
  let s = "";
  for (let i = 0; i < 8; i++) s += Math.floor(zufall() * 16).toString(16);
  return s;
}

/* Farben: alle Geräte sortieren die Kennungen gleich und kommen so auf dieselben Farben. */
export const FARBEN = [
  { name: "Gold",    wert: "#f2b94b" },
  { name: "Türkis",  wert: "#3fc7c0" },
  { name: "Rot",     wert: "#ef6a5b" },
  { name: "Violett", wert: "#a98bf0" },
  { name: "Grün",    wert: "#7bd16a" },
  { name: "Blau",    wert: "#5aa2f0" },
];
export function farben(ids){
  const m = new Map();
  [...new Set(ids)].sort().forEach((id, i) => m.set(id, FARBEN[i % FARBEN.length]));
  return m;
}

/* Messreihe für Laufzeiten (behält die letzten n Werte) */
export class Messreihe {
  constructor(n = 60){ this.n = n; this.werte = []; this.gesamt = 0; }
  neu(ms){ this.werte.push(ms); this.gesamt++; if (this.werte.length > this.n) this.werte.shift(); }
  get anzahl(){ return this.werte.length; }
  get median(){
    if (!this.werte.length) return null;
    const s = [...this.werte].sort((a, b) => a - b), h = s.length >> 1;
    return s.length % 2 ? s[h] : (s[h - 1] + s[h]) / 2;
  }
  get min(){ return this.werte.length ? Math.min(...this.werte) : null; }
  get max(){ return this.werte.length ? Math.max(...this.werte) : null; }
}

/* Drossel: true höchstens alle `abstand` Millisekunden */
export function drossel(abstand){
  let zuletzt = -Infinity;
  return jetzt => {
    if (jetzt - zuletzt < abstand) return false;
    zuletzt = jetzt; return true;
  };
}

/* Nachrichten pro Sekunde, gleitend über ein Zeitfenster */
export class Zaehler {
  constructor(fenster = 3000){ this.fenster = fenster; this.zeiten = []; }
  neu(jetzt){ this.zeiten.push(jetzt); this.aufraeumen(jetzt); }
  aufraeumen(jetzt){ while (this.zeiten.length && jetzt - this.zeiten[0] > this.fenster) this.zeiten.shift(); }
  proSekunde(jetzt){ this.aufraeumen(jetzt); return this.zeiten.length / (this.fenster / 1000); }
}
