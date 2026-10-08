/* =====================================================================
   REACTOR RESCUE – SETTINGS AND SHORT TEXTS
   You can edit this file without any programming knowledge:
   change only the words/numbers and keep commas and brackets.
   The rules of the manual (instructions, tables) are in rules.js,
   because each rule text belongs to the code that checks it.
   ===================================================================== */

export const CONFIG = {
  roundsPerGame: 2,             // reactors per game (players swap roles after each reactor)
  germanPenaltySeconds: 20,     // "Oops, German!" costs this many seconds
  stars: [3, 2, 1],             // stars for 0, 1, 2 mistakes
  levels: {
    1: { name: "Cadet",    info: "One version of each unit, terms explained where you need them, glossary",
         seconds: 420, maxStrikes: 3, wires: [4, 5], models: ["Helios"], wireUnits: ["K-12"], regUnits: ["R-20"], bulletins: false },
    2: { name: "Engineer", info: "Two versions of each unit, separate terminology, service bulletins",
         seconds: 480, maxStrikes: 3, wires: [4, 6], models: ["Helios", "Orion"], wireUnits: ["K-12", "K-40"], regUnits: ["R-20", "R-31"], bulletins: true }
  },
  keyPhrases: {
    operator: [
      "From top to bottom, the wires are …",
      "The … wire has got stripes.",
      "The gauge is on the left / right.",
      "The code on this unit is …"
    ],
    expert: [
      "Can you describe the … ?",
      "Where exactly is the … ?",
      "If the light pulses, …",
      "Cut the … wire."
    ]
  },
  glossary: [   // shown in the Cadet manual
    ["unit", "Baugruppe, Modul"], ["wire", "Kabel"], ["stripes", "Streifen"], ["marked", "markiert"],
    ["neither … nor", "weder … noch"], ["directly below", "direkt unter"], ["to pulse", "blinken, pulsieren"], ["steady", "gleichmäßig leuchtend"],
    ["lever", "Hebel"], ["handle", "Griff"], ["to point towards", "zeigen auf"], ["hazard marking", "Warnmarkierung"],
    ["gauge", "Messanzeige"], ["pattern", "Muster"], ["digit", "Ziffer"], ["serial number", "Seriennummer"]
  ]
};
