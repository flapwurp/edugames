import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { SUBJECTS, GAMES } from "../games.js";

const root = new URL("../", import.meta.url);
const range = v => Array.isArray(v) && v.length === 2 && v.every(Number.isInteger) && v[0] <= v[1];

test("jedes Spiel auf der Startseite ist vollständig verschlagwortet", () => {
  for (const g of GAMES){
    assert.ok(SUBJECTS[g.subject], `${g.title}: unbekanntes Fach "${g.subject}"`);
    for (const k of ["title", "href", "image", "text"]) assert.ok(typeof g[k] === "string" && g[k].trim(), `${g.title}: ${k} fehlt`);
    assert.ok(Number.isInteger(g.players) && g.players >= 1, `${g.title}: players`);
    assert.ok(range(g.minutes), `${g.title}: minutes`);
    assert.ok(range(g.grades) && g.grades[0] >= 5 && g.grades[1] <= 13, `${g.title}: grades`);
    assert.ok(["alpha", "beta", ""].includes(g.stage), `${g.title}: stage`);
  }
});

test("Links und Vorschaubilder der Startseite existieren", () => {
  for (const g of GAMES){
    assert.ok(existsSync(new URL(g.href + "index.html", root)), `${g.title}: ${g.href} fehlt`);
    assert.ok(existsSync(new URL(g.image, root)), `${g.title}: ${g.image} fehlt`);
  }
});

test("Werkzeuge aus tools/ stehen nicht auf der Startseite", () => {
  for (const g of GAMES) assert.ok(!g.href.startsWith("tools/"), `${g.title} ist ein Werkzeug`);
});
