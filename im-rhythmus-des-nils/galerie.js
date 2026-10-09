/* Galerie zur Abnahme der Grafik: Storyboard + einzelne Bausteine */
import * as A from "./assets.js";
import { scene, LEVEL, GROUND, big } from "./scene.js";

const F = (soil, plants) => ({ soil, plants });
const all = (soil, plants) => [F(soil, plants), F(soil, plants), F(soil, plants)];
const fam = (x, pose, n, extra = {}) => ({ x, pose, n, ...extra });

const STORY = [
  { year: 1, season: "achet", month: 1, title: "Der Sirius erscheint – ein neues Jahr beginnt",
    does: "Tippen: Das Jahr beginnt. Der Nil ist niedrig, die Felder liegen trocken.",
    st: { sky: "dawn", water: { level: LEVEL.tief }, fields: all("brache", "stoppel"), hof: { fill: 0.25 }, people: [fam(846, "winken", 0, { flip: true })] } },
  { year: 1, season: "achet", month: 2, title: "Achet, 2. Monat: Der Nil steigt",
    does: "„Nächster Monat“ tippen. Am Nilmesser steigt das Wasser.",
    st: { sky: "achet", water: { level: 404, kind: "flut" }, fields: all("trocken"), hof: { fill: 0.25 }, labels: ["nilmesser"] } },
  { year: 1, season: "achet", month: 3, title: "Achet, 3. Monat: Das Uferfeld und das mittlere Feld stehen unter Wasser",
    does: "Ein Feld nach dem anderen verschwindet unter dem trüben Flutwasser.",
    st: { sky: "achet", water: { level: 326, kind: "flut" }, fields: all("trocken"), hof: { fill: 0.25 } } },
  { year: 1, season: "achet", month: 4, title: "Achet, 4. Monat: Höchststand – alle Felder sind überschwemmt",
    does: "Der Hof liegt höher und bleibt trocken. Merksatz 1 erscheint.",
    st: { sky: "achet", water: { level: LEVEL.gut, kind: "flut" }, fields: all("trocken"), hof: { fill: 0.25 }, labels: ["nilmesser", "hof"], nmLabels: true, people: [fam(1080, "stehen", 1)] } },
  { year: 1, season: "peret", month: 5, title: "Peret: Das Wasser sinkt, zurück bleibt schwarzer Schlamm",
    does: "Die Felder glänzen dunkel. Antippen zeigt: „fruchtbarer Schlamm“.",
    st: { sky: "peret", water: { level: LEVEL.normal }, fields: all("schlamm"), hof: { fill: 0.25 }, labels: ["felder"] } },
  { year: 1, season: "peret", month: 5, title: "Peret: Pflügen und säen",
    does: "Feld antippen: Das Rindergespann pflügt den Schlamm unter, dahinter wird gesät.",
    st: { sky: "peret", water: { level: LEVEL.normal }, fields: [F("gepflueg", "saat"), F("gepflueg"), F("schlamm")], plow: { field: 1, x: 560, n: 1 }, hof: { fill: 0.25 }, people: [fam(250, "saeen", 2)] } },
  { year: 1, season: "peret", month: 7, title: "Peret: Das Getreide wächst",
    does: "Monat für Monat: Keim, Halm, Ähre.",
    st: { sky: "peret", water: { level: LEVEL.normal }, fields: [F("gepflueg", "aehre"), F("gepflueg", "aehre"), F("gepflueg", "halm")], hof: { fill: 0.25 }, people: [fam(660, "hacken", 3)] } },
  { year: 1, season: "schemu", month: 9, title: "Schemu: Ernte",
    does: "Felder antippen: Die Familie erntet mit Sicheln und trägt das Getreide in den Speicher.",
    st: { sky: "schemu", water: { level: LEVEL.tief }, fields: [F("gepflueg", "reif"), F("gepflueg", "stoppel"), F("gepflueg", "reif")], hof: { fill: 0.85 }, labels: ["speicher"], people: [fam(300, "ernten", 0), fam(690, "ernten", 2), fam(950, "tragen", 1)] } },
  { year: 1, season: "schemu", month: 11, title: "Schemu: Die Felder liegen brach – Zeit für andere Arbeiten",
    does: "Entscheidung 1: Krüge töpfern und gegen Getreide tauschen – oder einen Erdwall um den Hof aufschütten?",
    st: { sky: "schemu", water: { level: LEVEL.tief }, fields: all("brache", "stoppel"), hof: { fill: 0.7, wall: true }, extra: big(A.potter({ x: 1030, y: GROUND.site.y, n: 3 }), 1030, GROUND.site.y), people: [fam(818, "bauen", 0)] } },
  { year: 2, season: "achet", month: 4, title: "Jahr 2, Achet: Der Nil steigt zu wenig",
    does: "Der Pegel bleibt unter der Marke. Nur das Uferfeld wird überschwemmt.",
    st: { sky: "achet", water: { level: LEVEL.niedrig, kind: "flut" }, fields: all("trocken"), hof: { fill: 0.45, wall: true }, labels: ["nilmesser"], nmLabels: true, people: [fam(660, "stehen", 1), fam(690, "stehen", 2, { kind: true })] } },
  { year: 2, season: "peret", month: 6, title: "Jahr 2, Peret: Der Schaduf",
    does: "Ein Nachbar zeigt eine neue Erfindung. Schaduf antippen: Eimer für Eimer kommt Wasser aus dem Graben auf das mittlere Feld. Das obere Feld liegt zu hoch.",
    st: { sky: "peret", water: { level: LEVEL.tief }, ditchWater: true, fields: [F("gepflueg", "halm"), F("gepflueg", "jung"), F("trocken")], shaduf: { t: 1, n: 0 }, hof: { fill: 0.45, wall: true }, labels: ["schaduf", "graben"] } },
  { year: 2, season: "schemu", month: 9, title: "Jahr 2, Schemu: Eine kleine Ernte",
    does: "Das obere Feld ist vertrocknet. Der Speicher wird leer, die Schalen der Familie bleiben halb leer.",
    st: { sky: "schemu", water: { level: LEVEL.tief }, fields: [F("gepflueg", "reif"), F("gepflueg", "reif"), F("trocken", "verdorrt")], hof: { fill: 0.05, wall: true }, labels: ["speicher"], people: [fam(700, "stehen", 2), fam(728, "stehen", 3, { kind: true })] } },
  { year: 2, season: "schemu", month: 11, title: "Jahr 2, Brache: Die Familien bauen gemeinsam ein Dorf",
    does: "Antippen: Deich, Häuser und Dorfspeicher wachsen – viele Hände bauen mit. Am Nilmesser zeigt eine alte Marke, wie hoch der Nil einmal stand.",
    st: { sky: "schemu", water: { level: LEVEL.tief }, fields: [F("brache", "stoppel"), F("brache", "stoppel"), F("trocken", "verdorrt")], village: { stage: 0.6, dike: true }, oldMark: true, people: [fam(770, "bauen", 0), fam(880, "tragen", 4), fam(1000, "bauen", 5), fam(1090, "tragen", 2)] } },
  { year: 3, season: "achet", month: 4, title: "Jahr 3, Achet: Der Nil steigt zu hoch",
    does: "Das Wasser steht bis an die Deichkrone. Gestrichelt: So hoch stünde es ohne Deich im Dorf.",
    st: { sky: "achet", water: { level: LEVEL.hoch, kind: "flut" }, fields: all("brache"), village: { dike: true, fill: 0.55 }, ghost: LEVEL.hoch, hutRuined: true, labels: ["deich", "nilmesser"], nmLabels: true, people: [fam(1124, "stehen", 1)] } },
  { year: 3, season: "peret", month: 7, title: "Jahr 3, Peret: Spät gesät – der Landvermesser misst neu",
    does: "Die Flut hat die Grenzsteine weggespült. Das Wasser stand lange, die Saat kommt spät.",
    st: { sky: "peret", water: { level: LEVEL.normal }, fields: [F("schlamm", null), F("gepflueg", "keim"), F("gepflueg", "keim")].map(x => ({ ...x, boundary: false })), village: { dike: true, fill: 0.55 }, hutRuined: true, extra: big(A.surveyor({ x: 420, y: GROUND.f2.y, n: 4 }), 420, GROUND.f2.y) } },
  { year: 3, season: "schemu", month: 11, title: "Jahr 3, Schemu: Das Dorf versorgt alle – neue Berufe",
    does: "Der Dorfspeicher verteilt Getreide. Entscheidung 2: Wer aus deiner Familie übernimmt einen neuen Beruf?",
    st: { sky: "schemu", water: { level: LEVEL.tief }, fields: all("brache", "stoppel"), village: { dike: true, fill: 0.4 }, labels: ["dorfspeicher"],
      extra: big(A.steward({ x: 960, y: GROUND.site.y, n: 5 }), 960, GROUND.site.y) + big(A.potter({ x: 640, y: GROUND.f3.y, n: 2 }), 640, GROUND.f3.y) + big(A.weaver({ x: 420, y: GROUND.f2.y, n: 3 }), 420, GROUND.f2.y) } }
];

const SEASON = { achet: "Achet", peret: "Peret", schemu: "Schemu" };

function calendar(month, known){
  const names = [["Achet", "Überschwemmung"], ["Peret", "Aussaat und Wachstum"], ["Schemu", "Ernte und Trockenzeit"]];
  return `<div class="cal" aria-label="Kalender">${names.map(([n, d], b) => {
    const cells = [1, 2, 3, 4].map(k => { const m = b * 4 + k; return `<span class="m ${m < month ? "past" : m === month ? "now" : ""}"></span>`; }).join("");
    const name = b < known ? `<b>${n}</b><small>${d}</small>` : `<b class="unknown">?</b><small>&nbsp;</small>`;
    return `<div class="season ${b * 4 < month && month <= b * 4 + 4 ? "on" : ""}"><div class="cells">${cells}</div>${name}</div>`;
  }).join("")}</div>`;
}

function storyboard(){
  return STORY.map((x, i) => {
    const known = x.year > 1 ? 3 : Math.floor(x.month / 4);
    return `<figure class="shot">
      <div class="shot-head"><span class="num">${i + 1}</span><span class="yr">Jahr ${x.year}</span>${calendar(x.month, known)}</div>
      ${scene({ ...x.st, alt: x.title })}
      <figcaption><b>${x.title}</b><span>${x.does}</span></figcaption>
    </figure>`;
  }).join("");
}

function tile(svgInner, vb, title, wide = false){
  return `<figure class="tile ${wide === "full" ? "full" : wide ? "wide" : ""}"><svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg"><defs>${A.skyDefs()}</defs>${svgInner}</svg><figcaption>${title}</figcaption></figure>`;
}

function parts(){
  let h = "";
  h += `<h3>Familie und Arbeit</h3><div class="tiles">`;
  for (const [p, t] of [["stehen", "stehen"], ["gehen", "gehen"], ["hacken", "hacken"], ["saeen", "säen"], ["ernten", "ernten (Sichel)"], ["tragen", "tragen (Korb)"], ["bauen", "bauen (Lehmziegel)"], ["winken", "zeigen"]])
    h += tile(A.person({ x: 40, y: 92, pose: p, n: ["stehen", "hacken", "ernten", "bauen"].indexOf(p) >= 0 ? 0 : 2, scale: 1 }), "0 0 90 100", t);
  h += tile([0, 1, 2, 3].map(i => A.person({ x: 22 + i * 44, y: 92, pose: "stehen", n: i, kind: i === 3 })).join(""), "0 0 180 100", "die vier Familienmitglieder");
  h += `</div><h3>Feldarbeit</h3><div class="tiles">`;
  h += tile(A.fieldSoil("gepflueg", 0, 360, 110) + A.plowTeam({ x: 260, y: 110, scale: 1 }), "0 0 360 130", "Pflügen mit dem Rindergespann", true);
  h += tile(A.shaduf({ x: 150, y: 150, t: 0 }) + `<rect x="0" y="150" width="78" height="40" fill="${A.C.water}"/><path d="M0 150 L78 150 L78 190" fill="none" stroke="${A.C.ink}" stroke-width="2"/>`, "0 0 220 200", "Schaduf: Eimer unten");
  h += tile(A.shaduf({ x: 150, y: 150, t: 1 }) + `<rect x="0" y="160" width="78" height="30" fill="${A.C.water}"/>`, "0 0 220 200", "Schaduf: Eimer oben, gießt in den Trog");
  h += `</div><h3>Getreide</h3><div class="tiles">`;
  const st = [["saat", "Saat"], ["keim", "Keim"], ["jung", "jung"], ["halm", "Halm"], ["aehre", "Ähre"], ["reif", "reif"], ["stoppel", "Stoppeln"], ["verdorrt", "vertrocknet"], ["verfault", "verfault"]];
  h += tile(st.map(([k], i) => `<g transform="translate(${30 + i * 58} 84) scale(2)">${A.plant(k, 0, 0, A.rand(i + 3))}</g><path d="M${8 + i * 58} 84 l 44 0" stroke="${A.C.ink}" stroke-width="2.4"/>` +
    `<text x="${30 + i * 58}" y="104" text-anchor="middle" class="mini">${st[i][1]}</text>`).join(""), "0 0 525 112", "Wachstumsstufen", "full");
  h += `</div><h3>Felder</h3><div class="tiles">`;
  for (const [k, t] of [["trocken", "trocken, rissig"], ["schlamm", "nasser Schlamm nach der Flut"], ["gepflueg", "gepflügt"], ["gesaet", "gesät"]])
    h += tile(A.fieldSoil(k, 6, 214, 40, 3), "0 0 220 56", t);
  h += tile(A.fieldPlants("reif", 6, 214, 70, 4) + A.fieldSoil("gepflueg", 6, 214, 70, 3), "0 0 220 86", "reifes Feld");
  h += tile(A.fieldPlants("verdorrt", 6, 214, 70, 4) + A.fieldSoil("trocken", 6, 214, 70, 3), "0 0 220 86", "vertrocknetes Feld");
  h += `</div><h3>Hof, Dorf, Schutz</h3><div class="tiles">`;
  h += tile(A.house({ x: 10, y: 110 }) + A.granary({ x: 130, y: 110, fill: 0.7 }), "0 0 170 120", "Lehmziegelhaus und Kuppelspeicher (aufgeschnitten)");
  h += tile([0.05, 0.4, 0.9].map((v, i) => A.granary({ x: 34 + i * 62, y: 90, fill: v, ladder: false })).join(""), "0 0 190 100", "Speicher fast leer · halb · voll");
  h += tile(A.storeYard({ x: 10, y: 92, fill: 0.6 }), "0 0 170 100", "Dorfspeicher");
  h += tile(A.house({ x: 20, y: 90, ruined: true }), "0 0 130 100", "zerstörtes Haus");
  h += tile(A.dike({ x0: 10, x1: 150, y: 96, top: 30 }), "0 0 160 104", "Deich");
  h += tile(A.earthWall({ x: 10, y: 50, w: 60, h: 24 }), "0 0 80 56", "Erdwall am Hof");
  h += tile(A.nilometer({ x: 40, yBottom: 260, yTop: 10, marks: { niedrig: 170, gut: 120, hoch: 80, labels: true }, old: 50 }), "0 0 130 266", "Nilmesser mit Marken");
  h += `</div><h3>Berufe im Dorf</h3><div class="tiles">`;
  h += tile(A.potter({ x: 26, y: 90 }), "0 0 130 100", "Töpfer");
  h += tile(A.weaver({ x: 10, y: 92 }), "0 0 90 100", "Weberin");
  h += tile(A.surveyor({ x: 26, y: 92 }), "0 0 140 100", "Landvermesser (Messseil)");
  h += tile(A.steward({ x: 26, y: 92 }), "0 0 110 100", "Speicherverwalter (Messgefäß)");
  h += `</div><h3>Natur</h3><div class="tiles">`;
  h += tile(A.palm({ x: 60, y: 150, h: 120 }), "0 0 120 160", "Dattelpalme");
  h += tile(A.papyrus({ x: 50, y: 90, h: 70 }), "0 0 100 100", "Papyrus");
  h += tile(`<rect width="200" height="120" fill="url(#skyDawn)"/>${A.stars(200, 90)}${A.sirius(120, 50)}`, "0 0 200 120", "Sirius am Morgenhimmel");
  h += tile(A.ox({ x: 60, y: 92 }), "0 0 140 100", "Rind");
  h += `</div>`;
  return h;
}

function ui(){
  const rolle = [
    "Vier Monate lang steigt der Nil und überschwemmt das Land.",
    "Zurück bleibt fruchtbarer Schlamm. Er wird untergepflügt und es wird gesät. Vier Monate später wird geerntet."
  ];
  return `<div class="ui-row">
    <figure class="tile wide"><div class="pad">${calendar(1, 0)}</div><figcaption>Kalender zu Beginn: zwölf leere Monate</figcaption></figure>
    <figure class="tile wide"><div class="pad">${calendar(6, 2)}</div><figcaption>Kalender in Jahr 1, Peret: Achet ist benannt, sobald es erlebt wurde</figcaption></figure>
    <figure class="tile wide"><div class="pad">${calendar(13, 3)}</div><figcaption>Kalender nach Jahr 1</figcaption></figure>
  </div>
  <div class="ui-row">
    <figure class="tile wide"><div class="pad"><div class="scroll"><div class="rod"></div><ol>${rolle.map(t => `<li>${t}</li>`).join("")}<li class="todo">…</li></ol><div class="rod"></div></div></div><figcaption>Papyrusrolle mit Merksätzen</figcaption></figure>
    <figure class="tile"><div class="pad bowls">${A.bowl(1, 56)}${A.bowl(0.5, 56)}${A.bowl(0, 56)}</div><figcaption>Schalen: satt · knapp · Hunger</figcaption></figure>
    <figure class="tile"><div class="pad bowls">${A.sack(40)}${A.jar(40)}</div><figcaption>Sack, Krug</figcaption></figure>
  </div>`;
}

document.getElementById("story").innerHTML = storyboard();
document.getElementById("parts").innerHTML = parts();
document.getElementById("ui").innerHTML = ui();
