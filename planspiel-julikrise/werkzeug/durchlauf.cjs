/* Probedurchlauf im Browser: Lehrer-Laptop + 7 iPad-Fenster spielen Runde 1, prüfen Geheimhaltung und Neuladen.
   Start: npm run serve (anderes Terminal), dann  node planspiel-julikrise/werkzeug/durchlauf.cjs <Ordner für Bilder> [Adresse] */
const { chromium } = require('playwright');
const OUT = process.argv[2] || '.', BASE = process.argv[3] || 'http://localhost:8000/planspiel-julikrise/';
const HIST1 = { oeu: 'B', d: 'C', srb: 'A', r: 'C', f: 'B', gb: 'C' };
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1180, height: 820 } });
  const errs = [];
  const neu = async (url, name) => { const p = await ctx.newPage(); p.on('pageerror', e => errs.push(name + ': ' + e.message)); await p.goto(url); return p; };
  const L = await neu(BASE + 'lehrer.html', 'lehrer');
  const raum = (await L.textContent('.raum b')).trim();
  const geraete = {};
  for (const [team, n] of [['oeu', 1], ['d', 2], ['srb', 1], ['r', 1], ['f', 1], ['gb', 1]]) {
    geraete[team] = [];
    for (let i = 0; i < n; i++) {
      const p = await neu(BASE + 'index.html', team + i);
      await p.fill('#raum', raum); await p.click(`[data-team="${team}"]`); await p.click('#los');
      geraete[team].push(p);
    }
  }
  await L.waitForTimeout(300);
  const weiter = async () => { await L.click('#weiter'); await L.waitForTimeout(250); };
  const entscheiden = async (team, wahl) => {
    for (const p of geraete[team]) { await p.click('[data-reiter="entscheidung"]'); await p.click(`[data-wahl="${wahl}"]`); await p.waitForTimeout(80); }
    const p = geraete[team][0];
    await p.fill('#b-verkuendung', `Wir wählen ${wahl}, weil es unseren Interessen dient.`);
    await p.dispatchEvent('#b-verkuendung', 'change');
    await p.waitForTimeout(80);
    await p.click('#beschluss'); await p.waitForTimeout(150);
  };

  await L.screenshot({ path: OUT + '/e2e-lehrer-lage.png' });
  await weiter(); // Fenster 1
  const oeu = geraete.oeu[0];
  await oeu.fill('#v-0', 'Steht ihr zu uns, wenn wir gegen Serbien vorgehen?');
  await oeu.click('[data-vorlage="0"]'); await oeu.waitForTimeout(200);
  const d0 = geraete.d[0];
  await d0.click('[data-reiter="diplomatie"]');
  await d0.fill('#a-1', 'Ja, wie auch immer ihr vorgeht.'); await d0.click('[data-antwort="1"]'); await d0.waitForTimeout(200);
  await d0.screenshot({ path: OUT + '/e2e-d-diplomatie.png' });
  await weiter(); // Welle 1
  // Kabinett uneinig testen
  await d0.click('[data-reiter="entscheidung"]'); await d0.click('[data-wahl="A"]');
  await geraete.d[1].click('[data-reiter="entscheidung"]'); await geraete.d[1].click('[data-wahl="C"]');
  await d0.waitForTimeout(150);
  await d0.screenshot({ path: OUT + '/e2e-d-entscheidung.png', fullPage: true });
  for (const t of ['d', 'srb', 'r', 'f', 'gb']) await entscheiden(t, HIST1[t]);
  await L.click('[data-modus="leitung"]'); await L.waitForTimeout(150);
  await L.screenshot({ path: OUT + '/e2e-lehrer-leitung.png', fullPage: true });
  await L.click('[data-modus="tafel"]');
  await weiter(); // Welle 2 (kein Fenster 2 in Runde 1)
  await entscheiden('oeu', 'B');
  await weiter(); // Auflösung
  await L.screenshot({ path: OUT + '/e2e-lehrer-aufloesung.png', fullPage: true });
  await geraete.r[0].click('[data-reiter="lage"]');
  const rText = await geraete.r[0].textContent('.flaeche');
  const oeuText = await oeu.textContent('.flaeche');
  console.log('Russland sieht Blankoscheck:', rText.includes('volle Unterstützung zusagen'), '| Wien sieht ihn:', oeuText.includes('volle Unterstützung zusagen'));
  await weiter(); // Runde 2
  await geraete.srb[0].screenshot({ path: OUT + '/e2e-srb-runde2.png' });
  // iPad hochkant
  await d0.setViewportSize({ width: 768, height: 1024 });
  await d0.click('[data-reiter="entscheidung"]'); await d0.waitForTimeout(100);
  await d0.screenshot({ path: OUT + '/e2e-d-hochkant.png' });
  // Neuladen des Laptops: Stand bleibt
  await L.reload(); await L.waitForTimeout(400);
  console.log('nach Neuladen:', (await L.textContent('.kopf h1')).trim());
  console.log('Fehler:', errs);
  await b.close();
})();
