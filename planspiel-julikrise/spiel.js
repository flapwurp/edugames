/* Planspiel Julikrise 1914 – Spielkern (ohne DOM, testbar in Node).

   Ereignisbasiert: Der ganze Spielstand entsteht aus einer Liste von Aktionen.
   anwenden(spiel, aktion) → { spiel } oder { spiel, fehler } (dann bleibt der Stand unverändert).
   Gleiche Aktionen in gleicher Reihenfolge ergeben auf jedem Gerät denselben Stand. Für den Mehrgeräte-Betrieb
   (shared/sync.js) müssen deshalb nur Aktionen übertragen werden – keine Namen, keine Schülerdaten.

   Aktionen der Geräte:   beitreten, stimme, wann, begruendung, prognose, beschliessen, note, antwort
   Aktionen der Lehrkraft (lehrer: true):  weiter, lehrerWahl (Notfall), aktenOeffnen, entfernen

   Ablauf einer Runde: Lage → (Fenster → Welle) je Welle → Auflösung → ggf. Ausgang → nächste Runde.
   Nach der fünften Runde: Ende; die Lehrkraft öffnet die Geheimakten. */
import { RUNDEN, TEAMS, STAATEN } from "./content.js";
import { GEHEIM, RICHTUNGEN } from "./netz.js";
import { karte, lage, framing, grenze, ausgang, ende, akte1914 } from "./logik.js";

export const LIMIT = { note: 100, begruendung: 300, verkuendungMin: 10, prognosen: 2, freieNoten: 1 };

export const staatVon = (team, runde) => TEAMS.find(t => t.id === team)?.staat[runde];
const schluessel = (runde, team) => `${runde}.${staatVon(team, runde)}`;

/* Phasen einer Runde. Ein Fenster (Diplomatie) gibt es vor Welle 1 immer, vor weiteren Wellen nur mit Noten. */
export function ablauf(runde) {
  const r = RUNDEN[runde - 1];
  const p = [{ typ: "lage" }];
  r.wellen.forEach((_, w) => {
    if (w === 0 || r.fenster[w + 1]?.length) p.push({ typ: "fenster", nr: w + 1 });
    p.push({ typ: "welle", nr: w });
  });
  p.push({ typ: "aufloesung" });
  return p;
}

export function neuesSpiel() {
  return {
    runde: 1, schritt: 0, phase: { typ: "lage" },
    geraete: {},            // Gerätekennung → Team
    zustand: {},            // Entscheidungen, aus denen das Netz die Welt berechnet
    stimmen: {},            // "Runde.Staat" → { Gerät: Buchstabe }
    wann: {},               // Zusatzfrage (Zeitpunkt des Ultimatums)
    begruendungen: {},      // "Runde.Staat" → { Feld: Text }
    prognosen: {},          // "Runde.Staat" → { anderer Staat: Richtung }
    grenzen: {},            // offene Grenze: "Runde.Staat" → { titel, text, neu, erste }
    grenzeGenutzt: {},
    verkuendet: {},         // "Runde.Staat" → true, sobald die Welle vorbei ist
    noten: [],
    verlauf: [],            // alle endgültigen Entscheidungen der Klasse (bleiben auch nach einem Ausgang)
    ausgaenge: [],
    akten: false
  };
}

const imSpiel = (s, team) => TEAMS.some(t => t.id === team);
const geraeteVon = (s, team) => Object.entries(s.geraete).filter(([, t]) => t === team).map(([g]) => g);
const teamVon = (s, geraet) => s.geraete[geraet];
const welleTeams = (s) => s.phase.typ !== "welle" ? [] :
  TEAMS.filter(t => RUNDEN[s.runde - 1].wellen[s.phase.nr].includes(t.staat[s.runde])).map(t => t.id);
const entschieden = (s, key) => key in s.zustand;
const istLaenge = (text, max, min = 1) => typeof text === "string" && text.trim().length >= min && text.length <= max;

const H = {
  beitreten(s, a) {
    if (!imSpiel(s, a.team)) return "Diese Delegation gibt es nicht.";
    s.geraete[a.geraet] = a.team;
  },

  stimme(s, a) {
    const team = teamVon(s, a.geraet);
    if (!team) return "Gerät ist keiner Delegation beigetreten.";
    if (!welleTeams(s).includes(team)) return "Eure Delegation entscheidet gerade nicht.";
    const key = schluessel(s.runde, team);
    if (entschieden(s, key)) return "Ihr habt schon beschlossen.";
    const erlaubt = s.grenzen[key]?.neu || ["A", "B", "C"];
    if (!erlaubt.includes(a.wahl)) return "Diese Möglichkeit steht nicht mehr zur Wahl.";
    (s.stimmen[key] ||= {})[a.geraet] = a.wahl;
  },

  wann(s, a) {
    const team = teamVon(s, a.geraet);
    if (!team) return "Gerät ist keiner Delegation beigetreten.";
    const k = karte(s.runde, staatVon(team, s.runde), s.zustand);
    if (!k.zusatz || !k.zusatz.wahl.includes(a.wahl)) return "Diese Angabe passt nicht.";
    s.wann[schluessel(s.runde, team)] = a.wahl;
  },

  begruendung(s, a) {
    const team = teamVon(s, a.geraet);
    if (!team) return "Gerät ist keiner Delegation beigetreten.";
    if (!istLaenge(a.text, LIMIT.begruendung, 0)) return `Höchstens ${LIMIT.begruendung} Zeichen.`;
    const key = schluessel(s.runde, team);
    if (entschieden(s, key)) return "Ihr habt schon beschlossen.";
    (s.begruendungen[key] ||= {})[a.feld] = a.text;
  },

  prognose(s, a) {
    const team = teamVon(s, a.geraet);
    if (!team) return "Gerät ist keiner Delegation beigetreten.";
    if (!(a.richtung in RICHTUNGEN)) return "Unbekannte Richtung.";
    const eigen = staatVon(team, s.runde);
    if (a.staat === eigen || !RUNDEN[s.runde - 1].staaten[a.staat]) return "Für diesen Staat geht keine Prognose.";
    const key = schluessel(s.runde, team);
    if (entschieden(s, key)) return "Prognosen gehen nur vor dem eigenen Beschluss.";
    if (s.verkuendet[`${s.runde}.${a.staat}`] || entschieden(s, `${s.runde}.${a.staat}`)) return "Dieser Staat hat schon entschieden.";
    const p = (s.prognosen[key] ||= {});
    if (!(a.staat in p) && Object.keys(p).length >= LIMIT.prognosen) return `Höchstens ${LIMIT.prognosen} Prognosen pro Runde.`;
    p[a.staat] = a.richtung;
  },

  beschliessen(s, a) {
    const team = teamVon(s, a.geraet);
    if (!welleTeams(s).includes(team)) return "Eure Delegation entscheidet gerade nicht.";
    const key = schluessel(s.runde, team), staat = staatVon(team, s.runde);
    if (entschieden(s, key)) return "Ihr habt schon beschlossen.";
    const geraete = geraeteVon(s, team), st = s.stimmen[key] || {};
    if (geraete.some(g => !st[g])) return "Noch haben nicht alle im Kabinett abgestimmt.";
    const wahlen = new Set(geraete.map(g => st[g]));
    if (wahlen.size !== 1) return "Das Kabinett ist sich nicht einig.";
    const k = karte(s.runde, staat, s.zustand);
    if (k.zusatz && !s.wann[key]) return k.zusatz.frage || "Bitte noch den Zeitpunkt wählen.";
    if (!istLaenge(s.begruendungen[key]?.verkuendung, LIMIT.begruendung, LIMIT.verkuendungMin)) return "Bitte zuerst die Verkündung formulieren: „Wir wählen …, weil …“";
    entscheiden(s, team, [...wahlen][0], false);
  },

  lehrerWahl(s, a) {
    if (!a.lehrer) return "Nur die Lehrkraft.";
    if (!welleTeams(s).includes(a.team)) return "Diese Delegation entscheidet gerade nicht.";
    const key = schluessel(s.runde, a.team);
    if (entschieden(s, key)) return "Schon entschieden.";
    const k = karte(s.runde, staatVon(a.team, s.runde), s.zustand);
    if (k.zusatz) s.wann[key] ||= a.wann || k.zusatz.historisch;
    entscheiden(s, a.team, a.wahl, true);
  },

  note(s, a) {
    const team = teamVon(s, a.geraet);
    if (!team) return "Gerät ist keiner Delegation beigetreten.";
    if (s.phase.typ !== "fenster") return "Noten gehen nur in der Diplomatiephase.";
    if (!istLaenge(a.text, LIMIT.note)) return `Eine Note hat höchstens ${LIMIT.note} Zeichen.`;
    const staat = staatVon(team, s.runde), r = RUNDEN[s.runde - 1];
    let an, art, pflicht = false, vorlage = null;
    if (a.vorlage != null) {
      const v = r.fenster[s.phase.nr]?.[a.vorlage];
      if (!v || v.von !== staat) return "Diese Vorlage gehört nicht zu euch.";
      if (s.noten.some(n => n.runde === s.runde && n.fenster === s.phase.nr && n.vorlage === a.vorlage)) return "Diese Note ist schon verschickt.";
      ({ an, art, pflicht } = v); vorlage = a.vorlage;
    } else {
      const frei = s.noten.filter(n => n.runde === s.runde && n.von === team && n.vorlage == null).length;
      if (frei >= LIMIT.freieNoten) return "Ihr habt eure freie Note in dieser Runde schon verschickt.";
      an = a.an; art = a.art || "Note";
      if (!Array.isArray(an) || !an.length || an.some(x => x !== "alle" && (!r.staaten[x] || x === staat))) return "Ungültige Empfänger.";
    }
    s.noten.push({ id: s.noten.length + 1, runde: s.runde, fenster: s.phase.nr, von: team, vonStaat: staat, an, art, pflicht, vorlage,
      oeffentlich: an.includes("alle") || art === "öffentliche Erklärung", text: a.text, antworten: [] });
  },

  antwort(s, a) {
    const team = teamVon(s, a.geraet);
    const n = s.noten.find(x => x.id === a.note);
    if (!team || !n) return "Note nicht gefunden.";
    const staat = staatVon(team, n.runde);
    if (!n.an.includes(staat) && !n.an.includes("alle")) return "Diese Note ist nicht an euch gerichtet.";
    if (n.antworten.some(x => x.von === team)) return "Ihr habt schon geantwortet.";
    if (!istLaenge(a.text, LIMIT.note)) return `Eine Antwort hat höchstens ${LIMIT.note} Zeichen.`;
    n.antworten.push({ von: team, vonStaat: staat, text: a.text });
  },

  weiter(s, a) {
    if (!a.lehrer) return "Nur die Lehrkraft.";
    if (s.phase.typ === "ende") return "Das Spiel ist zu Ende.";
    if (s.phase.typ === "welle") {
      const offen = welleTeams(s).filter(t => !entschieden(s, schluessel(s.runde, t)));
      if (offen.length) return `Noch nicht entschieden: ${offen.map(t => STAATEN[staatVon(t, s.runde)].name).join(", ")}.`;
      for (const t of welleTeams(s)) s.verkuendet[schluessel(s.runde, t)] = true;
    }
    if (s.phase.typ === "ausgang") return naechsteRunde(s, true);
    if (s.phase.typ === "aufloesung") {
      const aus = ausgang(s.runde, s.zustand);
      if (aus && s.runde < 5) {
        s.ausgaenge.push({ runde: s.runde, id: aus.id, titel: aus.titel, saetze: aus.saetze, aber: aus.aber, war1914: aus.war1914 });
        s.phase = { typ: "ausgang" };
        return;
      }
      if (s.runde === 5) { s.phase = { typ: "ende" }; return; }
      return naechsteRunde(s, false);
    }
    s.schritt++;
    s.phase = ablauf(s.runde)[s.schritt];
  },

  aktenOeffnen(s, a) {
    if (!a.lehrer) return "Nur die Lehrkraft.";
    if (s.phase.typ !== "ende") return "Die Geheimakten öffnen sich am Ende.";
    s.akten = true;
  },

  entfernen(s, a) {
    if (!a.lehrer) return "Nur die Lehrkraft.";
    delete s.geraete[a.geraet];
    for (const st of Object.values(s.stimmen)) delete st[a.geraet];
  }
};

function entscheiden(s, team, wahl, lehrer) {
  const staat = staatVon(team, s.runde), key = `${s.runde}.${staat}`;
  const k = karte(s.runde, staat, s.zustand);
  s.zustand[key] = wahl;
  if (s.wann[key]) s.zustand[`${key}.wann`] = s.wann[key];
  const g = !lehrer && !s.grenzeGenutzt[key] ? grenze(s.runde, staat, s.zustand) : null;
  if (g) {
    s.grenzeGenutzt[key] = true;
    s.grenzen[key] = { titel: g.titel, text: g.text, neu: g.neu, erste: wahl };
    s.stimmen[key] = {};
    delete s.zustand[key];
    return;
  }
  delete s.grenzen[key];
  s.verlauf.push({ runde: s.runde, team, staat, wahl, wann: s.wann[key] || null, text: k.optionen[wahl].text,
    richtung: k.optionen[wahl].richtung, historisch: RUNDEN[s.runde - 1].staaten[staat].historisch,
    grenze: s.grenzeGenutzt[key] ? true : false, lehrer });
}

function naechsteRunde(s, nachAusgang) {
  if (nachAusgang) {
    /* Akte 1914: Die Welt geht vom Stand 1914 weiter. Die Entscheidungen der Klasse bleiben im Verlauf. */
    s.zustand = akte1914(s.runde);
  }
  s.runde++;
  s.schritt = 0;
  s.phase = ablauf(s.runde)[0];
}

export function anwenden(spiel, aktion) {
  const h = H[aktion?.typ];
  if (!h) return { spiel, fehler: "Unbekannte Aktion." };
  const s = structuredClone(spiel);
  const fehler = h(s, aktion);
  return fehler ? { spiel, fehler } : { spiel: s };
}

/* Alle Aktionen nacheinander (z. B. nach dem Neuladen). Fehlerhafte Aktionen werden übersprungen. */
export const nachspielen = (aktionen) => aktionen.reduce((s, a) => anwenden(s, a).spiel, neuesSpiel());

/* ---------- Was ein Gerät sehen darf ---------- */
function darfSehen(s, team, key) {
  if (!s.verkuendet[key]) return false;
  if (s.akten || !(key in GEHEIM)) return true;
  const gespielt = new Set(Object.values(TEAMS.find(t => t.id === team).staat));
  return GEHEIM[key].some(st => gespielt.has(st)) || key.endsWith(`.${staatVon(team, Number(key.split(".")[0]))}`);
}

export function sicht(s, team, geraet) {
  const staat = staatVon(team, s.runde), key = `${s.runde}.${staat}`;
  const k = karte(s.runde, staat, s.zustand);
  const card = RUNDEN[s.runde - 1].staaten[staat];
  const sichtbar = n => n.von === team || n.oeffentlich || n.an.includes(staatVon(team, n.runde));
  return {
    runde: s.runde, titel: RUNDEN[s.runde - 1].titel, zeitraum: RUNDEN[s.runde - 1].zeitraum, phase: s.phase,
    staat, lage: lage(s.runde, staat, s.zustand), geheim: card.geheim || [], hinweis: card.hinweis || "",
    framing: framing(s.runde, staat, s.zustand),
    karte: { optionen: Object.fromEntries(Object.entries(k.optionen).map(([b, o]) => [b, { text: o.text, pro: o.pro, contra: o.contra }])),
             kurswechsel: k.kurswechsel, zusatz: k.zusatz ? { frage: k.zusatz.frage, wahl: k.zusatz.wahl } : null },
    entscheidetJetzt: welleTeams(s).includes(team),
    meineWelle: RUNDEN[s.runde - 1].wellen.findIndex(w => w.includes(staat)), wellen: RUNDEN[s.runde - 1].wellen.length,
    grenze: s.grenzen[key] ? { titel: s.grenzen[key].titel, text: s.grenzen[key].text, neu: s.grenzen[key].neu } : null,
    kabinett: { geraete: geraeteVon(s, team).length, stimmen: s.stimmen[key] || {}, meineStimme: s.stimmen[key]?.[geraet] || null,
                beschlossen: entschieden(s, key) ? s.zustand[key] : null },
    wann: s.wann[key] || null,
    begruendung: s.begruendungen[key] || {},
    prognosen: s.prognosen[key] || {},
    noten: s.noten.filter(sichtbar).map(n => ({ ...n, antworten: n.antworten.filter(x => x.von === team || n.von === team || n.oeffentlich) })),
    vorlagen: s.phase.typ === "fenster" ? (RUNDEN[s.runde - 1].fenster[s.phase.nr] || []).map((v, i) => ({ ...v, index: i }))
      .filter(v => v.von === staat && !s.noten.some(n => n.runde === s.runde && n.fenster === s.phase.nr && n.vorlage === v.index)) : [],
    verkuendet: s.verlauf.filter(e => darfSehen(s, team, `${e.runde}.${e.staat}`))
      .map(e => ({ runde: e.runde, staat: e.staat, text: e.text })),
    aufloesung: s.phase.typ === "aufloesung" || s.phase.typ === "ausgang" ? RUNDEN[s.runde - 1].aufloesung : null,
    ausgang: s.phase.typ === "ausgang" ? s.ausgaenge[s.ausgaenge.length - 1] : null,
    ende: s.phase.typ === "ende" ? ende(s.zustand) : null,
    akten: s.akten
  };
}

/* Lehrer-Monitor: sieht alles, dazu offene Pflichtnoten und den Stand jeder Delegation. */
export function lehrerSicht(s) {
  const r = RUNDEN[s.runde - 1];
  const pflichtOffen = s.phase.typ !== "fenster" ? [] :
    (r.fenster[s.phase.nr] || []).map((v, i) => ({ ...v, index: i }))
      .filter(v => v.pflicht && !s.noten.some(n => n.runde === s.runde && n.fenster === s.phase.nr && n.vorlage === v.index));
  return {
    runde: s.runde, titel: r.titel, phase: s.phase, ablauf: ablauf(s.runde),
    delegationen: TEAMS.map(t => {
      const key = schluessel(s.runde, t.id);
      return { team: t.id, staat: t.staat[s.runde], geraete: geraeteVon(s, t.id).length,
        entscheidetJetzt: welleTeams(s).includes(t.id), beschlossen: entschieden(s, key) ? s.zustand[key] : null,
        stimmen: s.stimmen[key] || {}, grenze: s.grenzen[key]?.titel || null };
    }),
    pflichtOffen, noten: s.noten, verlauf: s.verlauf, ausgaenge: s.ausgaenge, akten: s.akten,
    aufloesung: r.aufloesung
  };
}

/* ---------- Auswertung „Unsere Entscheidungen und 1914“ ---------- */
export function auswertung(s) {
  return s.verlauf.map(e => {
    const key = `${e.runde}.${e.staat}`, card = RUNDEN[e.runde - 1].staaten[e.staat];
    const prog = Object.entries(s.prognosen[key] || {}).map(([ziel, richtung]) => {
      const tat = s.verlauf.find(x => x.runde === e.runde && x.staat === ziel);
      return { staat: ziel, erwartet: RICHTUNGEN[richtung], tatsaechlich: tat ? RICHTUNGEN[tat.richtung] : null,
        getroffen: tat ? tat.richtung === richtung : null };
    });
    return { runde: e.runde, staat: e.staat, name: STAATEN[e.staat].name, wahl: e.wahl, text: e.text,
      historisch: e.historisch, text1914: card.optionen[e.historisch].text, wie1914: e.wahl === e.historisch,
      geheim: key in GEHEIM, grenze: e.grenze, verkuendung: s.begruendungen[key]?.verkuendung || "", prognosen: prog };
  });
}
