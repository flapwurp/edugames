/* Reactor Rescue – the expert's manual (built from the rules in rules.js) */
import { CONFIG } from "./content.js";
import { WIRE_COLOURS, LAMP_COLOURS, INSTR, WIRE_TABLES, REG_UNITS, MODEL_TABLE, COLOUR_TABLE, CODE_RULES } from "./rules.js";

/* ---------- small pictures for the manual ---------- */
function icoWire(c, striped){
  const col = WIRE_COLOURS[c], edge = c === "black" ? "#2a2f38" : "#0b0f16";
  const band = c === "white" || c === "yellow" ? "#1b1f27" : "#f4f6f9";
  return `<svg class="ico" width="58" height="16" viewBox="0 0 58 16" aria-hidden="true"><path d="M4 8 C 20 2, 38 14, 54 8" stroke="${edge}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M4 8 C 20 2, 38 14, 54 8" stroke="${col}" stroke-width="7" fill="none" stroke-linecap="round"/>${striped ? `<path d="M4 8 C 20 2, 38 14, 54 8" stroke="${band}" stroke-width="7" fill="none" stroke-dasharray="3 6"/>` : ""}</svg>`;
}
const icoLight = on => `<svg class="ico" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="${on ? "#ffb02e" : "#2a3140"}" stroke="#46516b" stroke-width="2"/></svg>`;
const icoTest = `<svg class="ico" width="52" height="26" viewBox="0 0 52 26" aria-hidden="true"><rect x="1" y="1" width="50" height="24" rx="6" fill="#43567a"/><text x="26" y="17.5" text-anchor="middle" font-family="Chakra Petch,Arial,sans-serif" font-weight="700" font-size="12" fill="#fff" letter-spacing="1">TEST</text></svg>`;
const icoHazard = `<svg class="ico" width="58" height="14" viewBox="0 0 58 14" aria-hidden="true"><defs><pattern id="hz" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="12" height="12" fill="#1b1f27"/><rect width="6" height="12" fill="#f5c400"/></pattern></defs><rect width="58" height="14" rx="3" fill="url(#hz)"/></svg>`;
const icoGauge = `<svg class="ico" width="30" height="30" viewBox="0 0 30 30" aria-hidden="true"><circle cx="15" cy="15" r="13" fill="#e9eef4" stroke="#5b6779" stroke-width="2.5"/><path d="M15 15 L22 8" stroke="#1a2230" stroke-width="2.5" stroke-linecap="round"/></svg>`;
const icoLever = open => `<svg class="ico" width="40" height="58" viewBox="0 0 40 58" aria-hidden="true"><defs><pattern id="hz2" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#1b1f27"/><rect width="4" height="8" fill="#f5c400"/></pattern></defs><rect x="2" y="1" width="36" height="8" rx="2" fill="url(#hz2)"/><rect x="9" y="12" width="22" height="44" rx="5" fill="#0d131c"/><rect x="12" y="${open ? 15 : 37}" width="16" height="16" rx="4" fill="#c7d0dc"/></svg>`;

/* ---------- manual ---------- */
export function manualHTML(lv){
  const L = CONFIG.levels[lv];
  const eng = L.bulletins;
  const max = L.maxStrikes;
  const code = t => `<span class="code">${t}</span>`;
  const rows = arr => arr.map(r => `<tr>${r.map((c, i) => (i === 0 ? `<th>${c}</th>` : `<td>${c}</td>`)).join("")}</tr>`).join("");

  const terms = `<div class="tablewrap"><table class="terms">${[
    ["hot wire", icoWire("red") + icoWire("yellow"), "red or yellow"],
    ["cold wire", icoWire("blue") + icoWire("white"), "blue or white"],
    ["neutral wire", icoWire("black"), "black"],
    ["marked wire", icoWire("blue", true), "has stripes"],
    ["plain wire", icoWire("blue"), "no stripes"],
    ["run a diagnostic", icoTest, "the operator presses TEST"],
    ["pulses", icoLight(true) + icoLight(false), "the light next to TEST goes on and off"],
    ["steady", icoLight(true), "the light next to TEST stays on"]
  ].map(([a, b, c]) => `<tr><th>${a}</th><td class="pic">${b}</td><td>${c}</td></tr>`).join("")}</table></div>`;

  const wireTable = id => {
    const T = WIRE_TABLES[id];
    return `<div class="tablewrap"><table>
      <tr><th rowspan="2">${T.rowHead}</th><th colspan="${T.cols.length}">${T.colHead}</th></tr>
      <tr>${T.cols.map(c => `<th>${c}</th>`).join("")}</tr>
      ${["hot", "cold", "neutral"].map(r => `<tr><th>${r}</th>${T.cells[r].map(x => `<td class="cell">${x}</td>`).join("")}</tr>`).join("")}
    </table></div>`;
  };
  const instructions = `<div class="tablewrap"><table>
    ${Object.entries(INSTR).map(([k, v]) => `<tr><td class="cell">${k}</td><td>${v.t}</td></tr>`).join("")}
    <tr><td colspan="2"><b>first</b> = closest to the top &nbsp;&nbsp;|&nbsp;&nbsp; <b>last</b> = closest to the bottom</td></tr>
  </table></div>`;
  const regTable = `<div class="tablewrap"><table>
    <tr><th>Indicator light</th>${L.regUnits.map(u => `<th>${code(u)}</th>`).join("")}</tr>
    ${Object.keys(LAMP_COLOURS).map(c => `<tr><th>${c}</th>${L.regUnits.map(u => `<td class="cell">${REG_UNITS[u].patterns[c].split("").join(" ")}</td>`).join("")}</tr>`).join("")}
  </table></div>`;

  const units = [
    ...L.wireUnits.map(u => [u, "Wire unit", "4"]),
    ...L.regUnits.map(u => [u, "Flow regulator", "5"]),
    ["C-9", "Access lock", "6"],
    ["V-2", "Coolant valve – VEGA reactors only", "7"]
  ];
  if (eng) units.push(["M-5", "Magnetic clamp – ATLAS reactors only", "8"]);
  units.sort((a, b) => a[0].localeCompare(b[0]));

  const toc = [["m1", "1 At a glance"], ["m2", "2 Unit index"]];
  if (eng) toc.push(["m3", "3 Terms"]);
  toc.push(["m4", "4 Wire unit"], ["m5", "5 Flow regulator"], ["m6", "6 Access lock"], ["m7", "7 Coolant valve"]);
  if (eng) toc.push(["m8", "8 Magnetic clamp"], ["m9", "9 Service bulletins"]);
  else toc.push(["mg", "Glossary"]);

  let h = `<article class="manual">
  <h1>Reactor Stabilisation Manual</h1>
  <p class="edition">${L.name} edition – ${eng ? "HELIOS and ORION reactors" : "HELIOS reactors"}</p>
  <nav class="toc" aria-label="Contents">${toc.map(([id, t]) => `<a href="#${id}">${t}</a>`).join("")}</nav>

  <h2 id="m1">1 &nbsp;At a glance</h2>
  <div class="tablewrap"><table>${rows([
    ["You", "You can't see the reactor. The operator can, but has no manual."],
    ["Unit codes", `Every unit has a code, e.g. ${code("X-00")}. Ask for the codes, then use the unit index (2).`],
    ["Errors", `After <b>${max} errors</b> – or when the time is up – the reactor explodes. A cut wire can't be repaired.`],
    ["Finished?", "The operator gets a stabilisation code. Type it in at the bottom of your screen."]
  ])}</table></div>

  <h2 id="m2">2 &nbsp;Unit index</h2>
  <div class="tablewrap"><table><tr><th>Code</th><th>Unit</th><th>Section</th></tr>
    ${units.map(([c, n, s]) => `<tr><td>${code(c)}</td><td>${n}</td><td>${s}</td></tr>`).join("")}</table></div>`;

  if (eng) h += `
  <h2 id="m3">3 &nbsp;Terms</h2>${terms}`;

  const kTables = eng ? `Table ${code("K-12")} (4.2) or Table ${code("K-40")} (4.3), depending on the unit code` : `Table ${code("K-12")} (4.2)`;
  const wireSteps = [
    ["Goal", "Cut exactly <b>one</b> wire. Any other wire = error."],
    ["How", `Find your instruction letter in ${kTables}. Then follow that instruction (4.1).`]
  ];
  if (eng) wireSteps.splice(1, 0, ["Before you start", "Check service bulletin <b>SB-04</b>!"]);
  h += `
  <h2 id="m4">4 &nbsp;Wire unit (${L.wireUnits.map(code).join(", ")})</h2>
  <div class="tablewrap"><table>${rows(wireSteps)}</table></div>
  <h3>4.1 &nbsp;Instructions</h3>${instructions}
  <h3>4.2 &nbsp;Table ${code("K-12")}</h3>${wireTable("K-12")}
  ${eng ? `<h3>4.3 &nbsp;Table ${code("K-40")}</h3>${wireTable("K-40")}` : `<h3>4.3 &nbsp;Terms</h3>${terms}`}`;

  const regSteps = [
    ["Goal", "Set every lever to <b>open</b> or <b>closed</b>."],
    ["Target pattern", "Find it in Table R (5.2). <b>1</b> = open, <b>0</b> = closed. 1st digit = lever 1, 2nd digit = lever 2, …"],
    ["Finished?", "The operator presses ENGAGE. One wrong lever = error."]
  ];
  if (eng) regSteps.splice(2, 0, ["Light pulses?", "See service bulletin <b>SB-11</b>."]);
  const regTerms = [
    ["open lever", icoLever(true), "The handle points <b>towards</b> the hazard marking."],
    ["closed lever", icoLever(false), "The handle points <b>away from</b> the hazard marking."],
    ["lever 1", icoGauge, "The lever next to the pressure gauge. Count on from there."],
    ["hazard marking", icoHazard, "Yellow and black stripes on the unit."]
  ];
  h += `
  <h2 id="m5">5 &nbsp;Flow regulator (${L.regUnits.map(code).join(", ")})</h2>
  <h3>5.1 &nbsp;Instructions</h3>
  <div class="tablewrap"><table>${rows(regSteps)}</table></div>
  <h3>5.2 &nbsp;Table R &nbsp;–&nbsp; Target patterns</h3>${regTable}
  <h3>5.3 &nbsp;Terms</h3>
  <div class="tablewrap"><table class="terms">${regTerms.map(([x, y, z]) => `<tr><th>${x}</th><td class="pic">${y}</td><td>${z}</td></tr>`).join("")}</table></div>

  <h2 id="m6">6 &nbsp;Access lock (${code("C-9")})</h2>
  <div class="tablewrap"><table><tr><th>Digit</th><th>How to find it</th></tr>
    ${CODE_RULES[lv].map((r, i) => `<tr><td class="cell">${i + 1}</td><td>${r.t}</td></tr>`).join("")}
    <tr><td colspan="2">The operator types in all four digits and presses ENT. Wrong code = error.</td></tr></table></div>`;

  if (eng){
    h += `
  <div class="pair">
    <div><h3>Table A &nbsp;–&nbsp; Models</h3>
    <table><tr><th>Model</th><th>Digit</th></tr>${Object.entries(MODEL_TABLE).map(([m, v]) => `<tr><td class="code">${m.toUpperCase()}</td><td>${v}</td></tr>`).join("")}</table></div>
    <div><h3>Table B &nbsp;–&nbsp; Letters</h3>
    <table><tr><th>First letter</th><th>Digit</th></tr>
      <tr><td>A – F</td><td>4</td></tr><tr><td>G – M</td><td>7</td></tr><tr><td>N – T</td><td>2</td></tr><tr><td>U – Z</td><td>9</td></tr></table></div>
  </div>`;
  } else {
    h += `
  <h3>Table C &nbsp;–&nbsp; Indicator light</h3>
  <table><tr><th>Colour</th><th>Digit</th></tr>${Object.entries(COLOUR_TABLE).map(([c, v]) => `<tr><td>${c}</td><td>${v}</td></tr>`).join("")}</table>`;
  }

  h += `
  <h2 id="m7">7 &nbsp;Coolant valve (${code("V-2")})</h2>
  <div class="tablewrap"><table>${rows([
    ["Installed in", "VEGA reactors only"],
    ["Before you open it", "The coolant pressure must be below 40 bar."],
    ["Coolant level below ¼", "Refill the tank with blue coolant first."]
  ])}</table></div>`;

  if (eng){
    h += `
  <h2 id="m8">8 &nbsp;Magnetic clamp (${code("M-5")})</h2>
  <div class="tablewrap"><table>${rows([
    ["Installed in", "ATLAS reactors only"],
    ["Warning", "If the clamp were released during operation, the core would lose its magnetic field."],
    ["Release", "Only when the reactor has been switched off for at least ten minutes."]
  ])}</table></div>

  <h2 id="m9">9 &nbsp;Service bulletins</h2>
  <p>A bulletin replaces the normal rules when it applies to your reactor.</p>
  <div class="tablewrap"><table><tr><th>No.</th><th>Applies to</th><th>What changes</th></tr>
    <tr><td class="code">SB-02</td><td>VEGA reactors that have been running for more than six hours</td><td>Never open coolant valve ${code("V-2")}.</td></tr>
    <tr><td class="code">SB-04</td><td>Reactors whose serial number contains the same digit more than once (e.g. KT4A<b>4</b>2)</td><td>The wire unit is upside down. In section 4, the <b>bottom</b> wire counts as the top wire, and the <b>top</b> wire counts as the bottom wire. “Above” means “below”, and “below” means “above”.</td></tr>
    <tr><td class="code">SB-11</td><td>Flow regulators with a pulsing indicator light</td><td>Read the pattern from Table R backwards: the last digit is for lever 1.</td></tr>
  </table></div>`;
  } else {
    h += `
  <h2 id="mg">Glossary</h2>
  <table><tr><th>English</th><th>Deutsch</th></tr>${CONFIG.glossary.map(([e, g]) => `<tr><td>${e}</td><td>${g}</td></tr>`).join("")}</table>`;
  }
  return h + `</article>`;
}
