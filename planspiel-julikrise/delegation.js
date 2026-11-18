/* Planspiel Julikrise 1914 – iPad einer Delegation.
   Zeigt nur, was der Lehrer-Laptop als „Sicht“ dieser Delegation schickt. Schickt Aktionen an den Laptop. */
import { STAATEN, TEAMS, RUNDEN, DOSSIERS, EUROPA_1914, BEGRIFFE, STRATEGIEBLATT, BEGRUENDUNG } from "./content.js";
import { RICHTUNGEN } from "./netz.js";
import { flagge } from "./flaggen.js";
import { verbinden, geraetKennung } from "./verbindung.js";

const LIMIT_NOTE = 100, LIMIT_BEGR = 300;
const app = document.getElementById("app");
const geraet = geraetKennung();
const esc = (t) => String(t ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const PHASE = { lage: "Lage", fenster: "Diplomatie", welle: "Entscheidung", aufloesung: "Auflösung", ausgang: "Ausgang", ende: "Ende" };

let raum = sessionStorage.getItem("julikrise-raum") || "";
let team = sessionStorage.getItem("julikrise-team") || "";
let sicht = null, reiter = "lage", letztePhase = "", verbindung = null, entwuerfe = {}, freieAn = [], prognoseStaat = null;

/* ---------- Verbindung ---------- */
function starten() {
  verbindung?.schliessen();
  verbindung = verbinden(raum, (m) => {
    if (m.typ === "sicht" && m.team === team) { sicht = m.sicht; zeichnen(); }
    if (m.typ === "fehler" && m.geraet === geraet) meldung(m.text);
    if (m.typ === "da") verbindung.senden({ typ: "hallo", geraet, team });
  });
  senden({ typ: "beitreten", team });
  verbindung.senden({ typ: "hallo", geraet, team });
  zeichnen();
}
const senden = (aktion) => verbindung.senden({ typ: "aktion", geraet, aktion: { ...aktion, geraet } });

function meldung(text) {
  document.querySelector(".fehler")?.remove();
  const d = document.createElement("div"); d.className = "fehler"; d.textContent = text; document.body.append(d);
  setTimeout(() => d.remove(), 4000);
}

/* ---------- Beitreten ---------- */
function beitretenZeichnen() {
  app.innerHTML = `<div class="start"><h1>Planspiel Julikrise 1914</h1><p class="sans">Gib den Raumcode von der Tafel ein und wähle deine Delegation.</p>
    <label style="color:var(--hell)">Raumcode</label><input id="raum" inputmode="numeric" maxlength="4" value="${esc(raum)}" style="max-width:180px;font-size:24px;letter-spacing:6px">
    <div class="delegationen">${TEAMS.map(t => `<button data-team="${t.id}" class="${t.id === team ? "an" : ""}">${flagge(t.staat[1], 48)}<span>${STAATEN[t.staat[1]].name}${t.id === "srb" ? "<br><small class=sans>ab Runde 4: Belgien</small>" : ""}</span></button>`).join("")}</div>
    <p style="margin-top:20px"><button class="knopf" id="los">Beitreten</button></p></div>`;
  app.querySelectorAll("[data-team]").forEach(b => b.onclick = () => { raum = app.querySelector("#raum").value.trim(); team = b.dataset.team; beitretenZeichnen(); });
  app.querySelector("#los").onclick = () => {
    raum = app.querySelector("#raum").value.trim();
    if (!/^\d{4}$/.test(raum) || !team) return meldung("Bitte Raumcode (4 Ziffern) und Delegation wählen.");
    sessionStorage.setItem("julikrise-raum", raum); sessionStorage.setItem("julikrise-team", team);
    starten();
  };
}

/* ---------- Hauptbildschirm ---------- */
function zeichnen() {
  if (!raum || !team || !verbindung) return beitretenZeichnen();
  if (!sicht) { app.innerHTML = `<div class="start"><h1>Verbinde …</h1><p class="sans">Raum ${esc(raum)} · ${STAATEN[TEAMS.find(t => t.id === team).staat[1]].name}. Warte auf den Lehrer-Laptop.</p><button class="knopf zweit" id="zurueck" style="color:var(--hell);border-color:var(--hell)">Anderen Raum wählen</button></div>`;
    app.querySelector("#zurueck").onclick = () => { verbindung.schliessen(); verbindung = null; zeichnen(); }; return; }

  // Reiter automatisch wechseln, wenn die Phase wechselt
  const p = sicht.phase.typ + (sicht.phase.nr ?? "") + sicht.runde;
  if (p !== letztePhase) {
    letztePhase = p;
    reiter = sicht.phase.typ === "fenster" ? "diplomatie" : sicht.phase.typ === "welle" && sicht.entscheidetJetzt ? "entscheidung" : "lage";
  }
  const fokus = document.activeElement?.id, pos = document.activeElement?.selectionStart;
  const s = sicht;
  app.innerHTML = `
    <div class="kopf">${flagge(s.staat, 66)}<div class="titel"><div>Delegation</div><h1>${STAATEN[s.staat].name}</h1></div>
      <div class="rechts">Runde ${s.runde} · ${esc(s.titel)}<b>${esc(s.zeitraum)}</b></div></div>
    ${band()}
    <div class="leiste">${s.framing.anzeigen.map(a => `<div class="anzeige ${a.stufe}"><div class="t"><span>${esc(a.titel)}</span><span class="stufen ${a.stufe}"><i></i><i></i><i></i></span></div><p>${esc(a.text)}</p></div>`).join("")}
      ${s.framing.uhren.map(u => `<div class="uhr">⏱ ${esc(u.text)}</div>`).join("")}</div>
    <div class="reiter">${[["lage", "Lage"], ["entscheidung", "Entscheidung"], ["diplomatie", "Diplomatie"], ["dossier", "Dossier"]].map(([id, t]) =>
      `<button data-reiter="${id}" class="${reiter === id ? "an" : ""}">${t}${punkt(id) ? '<span class="punkt"></span>' : ""}</button>`).join("")}</div>
    <div class="flaeche">${{ lage: lageZeichnen, entscheidung: entscheidungZeichnen, diplomatie: diplomatieZeichnen, dossier: dossierZeichnen }[reiter]()}</div>`;
  app.querySelectorAll("[data-reiter]").forEach(b => b.onclick = () => { reiter = b.dataset.reiter; zeichnen(); });
  verdrahten();
  if (fokus) { const e = document.getElementById(fokus); if (e) { e.focus(); try { e.setSelectionRange(pos, pos); } catch {} } }
}

function punkt(id) {
  const s = sicht;
  if (id === "diplomatie") return s.phase.typ === "fenster" && (s.vorlagen.some(v => v.pflicht) || s.noten.some(n => n.von !== team && !n.antworten.some(a => a.von === team) && !n.oeffentlich));
  if (id === "entscheidung") return s.entscheidetJetzt && !s.kabinett.beschlossen;
  return false;
}

function band() {
  const s = sicht, ph = s.phase.typ;
  if (s.grenze) return `<div class="band rot">${esc(s.grenze.titel)} – entscheidet neu.</div>`;
  if (ph === "welle" && s.entscheidetJetzt) return s.kabinett.beschlossen
    ? `<div class="band warten">Beschlossen: ${s.kabinett.beschlossen}. Wartet, bis alle in dieser Welle entschieden haben.</div>`
    : `<div class="band">Ihr entscheidet jetzt (Welle ${s.phase.nr + 1}). Einigt euch im Kabinett.</div>`;
  if (ph === "welle") return `<div class="band warten">Welle ${s.phase.nr + 1}: Andere entscheiden. ${s.meineWelle > s.phase.nr ? `Ihr entscheidet in Welle ${s.meineWelle + 1}.` : "Ihr habt in dieser Runde schon entschieden."}</div>`;
  if (ph === "fenster") return `<div class="band">Diplomatie vor Welle ${s.phase.nr}: Noten schreiben und beantworten.</div>`;
  if (ph === "lage") return `<div class="band">Runde ${s.runde}: Lest die Lage und euer Dossier. Bereitet eure Entscheidung vor.</div>`;
  if (ph === "aufloesung") return `<div class="band warten">Auflösung: Was 1914 geschah.</div>`;
  if (ph === "ausgang") return `<div class="band">Eure Julikrise hat einen anderen Weg genommen.</div>`;
  return `<div class="band warten">Das Spiel ist zu Ende.</div>`;
}

/* ---------- Reiter: Lage ---------- */
function lageZeichnen() {
  const s = sicht;
  let h = "";
  if (s.ausgang) h += ausgangKarte(s.ausgang);
  if (s.aufloesung) h += `<div class="ereignis"><div class="klein">Was 1914 geschah</div><ul>${s.aufloesung.map(t => `<li>${esc(t)}</li>`).join("")}</ul></div>`;
  if (s.ende) h += `<div class="ereignis"><h2>${esc(s.ende.titel)}</h2><ul>${s.ende.saetze.map(t => `<li>${esc(t)}</li>`).join("")}</ul><div class="klein">1914</div><p>${esc(s.ende.war1914)}</p></div>`;
  h += `<div class="zwei"><div><div class="klein">Die Lage · ${esc(s.zeitraum)}</div>${s.lage.map(t => `<p>${esc(t)}</p>`).join("")}
    ${s.hinweis ? `<div class="hinweis">${esc(s.hinweis)}</div>` : ""}
    ${s.geheim.length ? `<div class="akte"><div class="stempel">GEHEIM</div><div class="klein">Nur für euch</div>${s.geheim.map(t => `<p>${esc(t)}</p>`).join("")}</div>` : ""}</div>
    <div><div class="klein">Was bisher verkündet wurde</div>${s.verkuendet.length ? s.verkuendet.slice().reverse().map(e =>
      `<p class="sans" style="font-size:14px;margin:6px 0"><b>R${e.runde} · ${STAATEN[e.staat].name}:</b> ${esc(e.text)}</p>`).join("") : `<p class="sans" style="font-size:14px">Noch nichts.</p>`}
    ${s.framing.erinnerungen.length ? `<div class="klein">Erinnert euch</div>${s.framing.erinnerungen.map(e => `<details class="hinweis"><summary><b>${esc(e.titel)}</b></summary>${esc(e.text)}</details>`).join("")}` : ""}</div></div>`;
  return h;
}

function ausgangKarte(a) {
  return `<div class="ereignis"><div class="klein">Ausgang nach Runde ${a.runde}</div><h2>${esc(a.titel)}</h2>
    <div class="klein">Was den Unterschied machte</div><ul>${a.saetze.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="klein">Aber</div><p>${esc(a.aber)}</p><div class="klein">1914</div><p>${esc(a.war1914)}</p>
    <p class="sans" style="font-size:14px;opacity:.85">Wie angekündigt geht es jetzt mit der Akte 1914 weiter: Die nächste Runde beginnt so, wie es 1914 wirklich war.</p></div>`;
}

/* ---------- Reiter: Entscheidung ---------- */
function entscheidungZeichnen() {
  const s = sicht, k = s.kabinett, darf = s.entscheidetJetzt && !k.beschlossen;
  const erlaubt = s.grenze?.neu || ["A", "B", "C"];
  const stimmenFuer = (b) => Object.values(k.stimmen).filter(w => w === b).length;
  let h = "";
  if (s.grenze) h += `<div class="ereignis rot"><h2>${esc(s.grenze.titel)}</h2><p>${esc(s.grenze.text)}</p></div>`;
  if (!s.entscheidetJetzt && !k.beschlossen) h += `<div class="hinweis">Ihr entscheidet in Welle ${s.meineWelle + 1}${s.phase.typ === "welle" && s.phase.nr < s.meineWelle ? "" : " dieser Runde"}. Bereitet eure Begründung schon vor.</div>`;
  h += `<div class="zwei"><div><div class="klein">Eure Möglichkeiten</div>${Object.entries(s.karte.optionen).map(([b, o]) =>
    `<button class="option ${k.meineStimme === b || k.beschlossen === b ? "gewaehlt" : ""}" data-wahl="${b}" ${darf && erlaubt.includes(b) ? "" : "disabled"}>
      ${s.karte.kurswechsel.includes(b) ? '<span class="kurswechsel">KURSWECHSEL</span>' : ""}
      <span class="buchstabe">${b}</span><span><h3>${esc(o.text)}${stimmenFuer(b) ? `<span class="stimmen">${"<i>✓</i>".repeat(stimmenFuer(b))}</span>` : ""}</h3>
      <span class="abwaegung"><div><span>Dafür spricht</span>${esc(o.pro)}</div><div><span>Dagegen spricht</span>${esc(o.contra)}</div></span></span></button>`).join("")}
    ${s.karte.zusatz ? `<label>${esc(s.karte.zusatz.frage || "Zeitpunkt")}</label><div class="chips">${s.karte.zusatz.wahl.map(w => `<button class="chip ${s.wann === w ? "an" : ""}" data-wann="${esc(w)}" ${darf ? "" : "disabled"}>${esc(w)}</button>`).join("")}</div>` : ""}
    </div><div>
    <div class="klein">Prognose: Was werden andere tun?</div>
    <p class="sans" style="font-size:14px;margin:0 0 6px">Höchstens zwei Staaten, die noch nicht entschieden haben.</p>
    ${prognoseZeichnen()}
    <div class="klein">Unsere Begründung</div>
    ${BEGRUENDUNG.map(f => `<label for="b-${f.id}">${esc(f.frage)}</label><textarea id="b-${f.id}" data-feld="${f.id}" maxlength="${LIMIT_BEGR}" ${k.beschlossen ? "disabled" : ""}>${esc(entwuerfe[f.id] ?? s.begruendung[f.id] ?? "")}</textarea>`).join("")}
    </div></div>
    <div class="kabinett"><span class="sans" style="font-weight:600">Kabinett:</span>
      ${Object.entries(k.stimmen).map(([g, w]) => `<span class="stuhl a ${g === geraet ? "ich" : ""}">${w}</span>`).join("")}
      ${Array.from({ length: Math.max(0, k.geraete - Object.keys(k.stimmen).length) }, () => '<span class="stuhl"></span>').join("")}
      <span class="sans" style="font-size:14px;flex:1;min-width:200px">Der Beschluss gilt, wenn alle dieselbe Möglichkeit gewählt haben.</span>
      <button class="knopf" id="beschluss" ${darf ? "" : "disabled"}>${k.beschlossen ? `Beschlossen: ${k.beschlossen}` : "Beschluss fassen"}</button></div>`;
  return h;
}

function prognoseZeichnen() {
  const s = sicht, andere = Object.keys(RUNDEN[s.runde - 1].staaten).filter(x => x !== s.staat);
  const gesperrt = !!s.kabinett.beschlossen;
  return `<div class="chips">${andere.map(st => `<button class="chip ${prognoseStaat === st ? "an" : ""}" data-pstaat="${st}" ${gesperrt ? "disabled" : ""}>${STAATEN[st].kurz}${s.prognosen[st] ? ": " + RICHTUNGEN[s.prognosen[st]] : ""}</button>`).join("")}</div>
    ${prognoseStaat && !gesperrt ? `<div class="chips" style="margin-top:8px">${Object.entries(RICHTUNGEN).map(([r, t]) => `<button class="chip ${s.prognosen[prognoseStaat] === r ? "an" : ""}" data-prichtung="${r}">${STAATEN[prognoseStaat].kurz} ${t}</button>`).join("")}</div>` : ""}`;
}

/* ---------- Reiter: Diplomatie ---------- */
function diplomatieZeichnen() {
  const s = sicht, offen = s.phase.typ === "fenster";
  const andere = Object.keys(RUNDEN[s.runde - 1].staaten).filter(x => x !== s.staat);
  let h = `<div class="zwei"><div>`;
  if (!offen) h += `<div class="hinweis">Noten können nur in der Diplomatiephase verschickt werden.</div>`;
  if (offen && s.vorlagen.length) h += `<div class="klein">Noten aus der Vorlage</div>` + s.vorlagen.map(v => `
    <div class="telegramm"><div class="kopfzeile"><span>${v.pflicht ? "Pflicht" : "Vorschlag"} · ${esc(v.art)} an ${v.an.map(a => a === "alle" ? "alle" : STAATEN[a].name).join(", ")}</span></div>
    <p class="sans" style="margin:0 0 6px;font-size:14px">${esc(v.text)}</p>
    <textarea id="v-${v.index}" maxlength="${LIMIT_NOTE}" placeholder="Eure Note (höchstens ${LIMIT_NOTE} Zeichen)">${esc(entwuerfe["v" + v.index] ?? "")}</textarea>
    <div class="zaehler" data-zaehler="v-${v.index}"></div><button class="knopf" data-vorlage="${v.index}">Abschicken</button></div>`).join("");
  if (offen) h += `<div class="klein">Freie Note (eine pro Runde)</div>
    <div class="chips">${andere.map(st => `<button class="chip ${freieAn.includes(st) ? "an" : ""}" data-an="${st}">${STAATEN[st].kurz}</button>`).join("")}
      <button class="chip ${freieAn.includes("alle") ? "an" : ""}" data-an="alle">öffentlich an alle</button></div>
    <textarea id="frei" maxlength="${LIMIT_NOTE}" placeholder="Eure Note (höchstens ${LIMIT_NOTE} Zeichen)" style="margin-top:8px">${esc(entwuerfe.frei ?? "")}</textarea>
    <div class="zaehler" data-zaehler="frei"></div><button class="knopf" id="freiSenden">Abschicken</button>`;
  h += `</div><div><div class="klein">Posteingang und verschickte Noten</div>`;
  h += s.noten.length ? s.noten.slice().reverse().map(n => {
    const anUns = n.von !== team && (n.an.includes(s.staat) || n.an.includes("alle"));
    const beantwortet = n.antworten.some(a => a.von === team);
    return `<div class="telegramm"><div class="kopfzeile"><span>${n.von === team ? "Von uns" : "Von " + STAATEN[n.vonStaat].name} an ${n.an.map(a => a === "alle" ? "alle" : STAATEN[a].kurz).join(", ")}</span><span>R${n.runde} · ${esc(n.art)}</span></div>
      <span class="streifen">${esc(n.text)}</span>
      ${n.antworten.map(a => `<div class="antwort sans" style="font-size:14px"><b>Antwort ${a.von === team ? "von uns" : "von " + STAATEN[a.vonStaat].name}:</b> ${esc(a.text)}</div>`).join("")}
      ${anUns && !beantwortet ? `<textarea id="a-${n.id}" maxlength="${LIMIT_NOTE}" placeholder="Antwort (höchstens ${LIMIT_NOTE} Zeichen)" style="margin-top:8px">${esc(entwuerfe["a" + n.id] ?? "")}</textarea><button class="knopf zweit" data-antwort="${n.id}" style="margin-top:6px">Antworten</button>` : ""}</div>`;
  }).join("") : `<p class="sans" style="font-size:14px">Noch keine Noten.</p>`;
  return h + `</div></div>`;
}

/* ---------- Reiter: Dossier ---------- */
function dossierZeichnen() {
  const d = DOSSIERS[sicht.staat];
  return `<div class="zwei"><div><div class="klein">Wer wir sind</div><p>${esc(d.werWirSind)}</p>
    <div class="klein">Was wir wollen</div><ul>${d.wasWirWollen.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
    <div class="klein">Unsere Beziehungen</div>${Object.entries(d.beziehungen).map(([st, t]) => `<p style="margin:4px 0"><b>${STAATEN[st].name}:</b> ${esc(t)}</p>`).join("")}
    ${d.geheim.length ? `<div class="akte"><div class="stempel">GEHEIM</div><div class="klein">Nur für euch – das wissen die anderen nicht</div>${d.geheim.map(t => `<p>${esc(t)}</p>`).join("")}</div>` : ""}
    ${d.denkanstoss ? `<div class="hinweis"><b>Denkanstoß:</b> ${esc(d.denkanstoss)}</div>` : ""}
    <div class="klein">Strategieblatt</div><ol class="sans">${STRATEGIEBLATT.fragen.map(f => `<li>${esc(f)}</li>`).join("")}</ol><p class="sans" style="font-size:14px">Für Schnelle: ${esc(STRATEGIEBLATT.fuerSchnelle)}</p></div>
    <div><div class="klein">${esc(EUROPA_1914.titel)}</div>${EUROPA_1914.abschnitte.map(a => `<p><b>${esc(a.titel)}.</b> ${esc(a.text)}</p>${a.punkte ? `<ul>${a.punkte.map(p => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}`).join("")}
    <div class="klein">Wichtige Begriffe</div>${BEGRIFFE.map(([b, t]) => `<p style="margin:4px 0"><b>${esc(b)}:</b> ${esc(t)}</p>`).join("")}</div></div>`;
}

/* ---------- Bedienung ---------- */
function verdrahten() {
  const q = (sel) => app.querySelectorAll(sel);
  q("[data-wahl]").forEach(b => b.onclick = () => senden({ typ: "stimme", wahl: b.dataset.wahl }));
  q("[data-wann]").forEach(b => b.onclick = () => senden({ typ: "wann", wahl: b.dataset.wann }));
  q("[data-pstaat]").forEach(b => b.onclick = () => { prognoseStaat = prognoseStaat === b.dataset.pstaat ? null : b.dataset.pstaat; zeichnen(); });
  q("[data-prichtung]").forEach(b => b.onclick = () => { senden({ typ: "prognose", staat: prognoseStaat, richtung: b.dataset.prichtung }); prognoseStaat = null; });
  q("[data-feld]").forEach(t => {
    t.oninput = () => { entwuerfe[t.dataset.feld] = t.value; };
    t.onchange = () => senden({ typ: "begruendung", feld: t.dataset.feld, text: t.value });
  });
  const beschluss = app.querySelector("#beschluss");
  if (beschluss) beschluss.onclick = () => {
    for (const f of BEGRUENDUNG) if (entwuerfe[f.id] != null) senden({ typ: "begruendung", feld: f.id, text: entwuerfe[f.id] });
    senden({ typ: "beschliessen" });
  };
  // Noten mit Zeichenzähler
  q("textarea[maxlength]").forEach(t => {
    const z = app.querySelector(`[data-zaehler="${t.id}"]`);
    const zaehlen = () => { if (z) z.textContent = `${t.value.length} / ${t.maxLength}`; };
    zaehlen();
    if (!t.dataset.feld) t.oninput = () => { entwuerfe[t.id.replace("-", "")] = t.value; zaehlen(); };
  });
  q("[data-vorlage]").forEach(b => b.onclick = () => {
    const t = app.querySelector(`#v-${b.dataset.vorlage}`);
    senden({ typ: "note", vorlage: Number(b.dataset.vorlage), text: t.value }); delete entwuerfe["v" + b.dataset.vorlage];
  });
  q("[data-an]").forEach(b => b.onclick = () => {
    const a = b.dataset.an;
    freieAn = a === "alle" ? (freieAn.includes("alle") ? [] : ["alle"]) : freieAn.filter(x => x !== "alle");
    if (a !== "alle") freieAn = freieAn.includes(a) ? freieAn.filter(x => x !== a) : [...freieAn, a];
    zeichnen();
  });
  const frei = app.querySelector("#freiSenden");
  if (frei) frei.onclick = () => {
    if (!freieAn.length) return meldung("Bitte Empfänger wählen.");
    senden({ typ: "note", an: freieAn, art: freieAn.includes("alle") ? "öffentliche Erklärung" : "Note", text: app.querySelector("#frei").value });
    delete entwuerfe.frei; freieAn = [];
  };
  q("[data-antwort]").forEach(b => b.onclick = () => {
    senden({ typ: "antwort", note: Number(b.dataset.antwort), text: app.querySelector(`#a-${b.dataset.antwort}`).value });
    delete entwuerfe["a" + b.dataset.antwort];
  });
}

if (raum && team) starten(); else zeichnen();
