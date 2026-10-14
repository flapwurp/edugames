/* Vocab Football – Vokabellisten und Einstellungen.

   SO KOMMT EINE NEUE LISTE DAZU
   1. Einen Block von { name: ... } bis }, unten kopieren und darunter einfügen.
   2. Den Namen ändern (erscheint im Auswahlmenü).
   3. Die Vokabeln zwischen die beiden Backticks ` ` einfügen: eine Vokabel pro Zeile,
      erst Englisch, dann Deutsch. Getrennt durch
        - einen Tabulator (entsteht automatisch beim Kopieren aus einer Word- oder Excel-Tabelle mit zwei Spalten) oder
        - ein Semikolon:   the cinema ; das Kino
   Leere Zeilen und Zeilen, die mit # beginnen, werden ignoriert (gut für Überschriften).
   Steht in einer Liste Deutsch vorne, bei dieser Liste  first: "de",  ergänzen (siehe zweites Beispiel).

   Spontan geht es auch ohne diese Datei: Im Startbildschirm „Paste a list“ wählen und die Liste einfügen.
   Die eingefügte Liste bleibt nur bis zum Schließen des Browser-Tabs erhalten. */

export const LISTS = [
  {
    name: "Example: At school",
    words: `
# Beispielliste – Englisch zuerst, getrennt mit Semikolon
pencil case ; Federmäppchen
ruler ; Lineal
rubber ; Radiergummi
exercise book ; Heft
timetable ; Stundenplan
break ; Pause
classroom ; Klassenzimmer
homework ; Hausaufgaben
to be late ; zu spät sein
to borrow ; (sich etwas) ausleihen
board ; Tafel
headteacher ; Schulleiter/in
`
  },
  {
    name: "Example: Free time (German first)",
    first: "de",
    words: `
schwimmen gehen ; to go swimming
Freizeit ; free time
Verein ; club
Mannschaft ; team
gewinnen ; to win
verlieren ; to lose
Eintrittskarte ; ticket
langweilig ; boring
aufregend ; exciting
sich treffen ; to meet
`
  },
];

/* Einstellungen – nur die Zahlen ändern */
export const CONFIG = {
  teams: ["Red", "Blue"],          // Standardnamen der Teams (im Startbildschirm änderbar)
  firstColumn: "en",               // was in den Listen vorne steht, wenn nichts anderes angegeben ist: "en" oder "de"

  /* Torwart. Ziel bei "normal": etwa drei von vier gut gezielten Schüssen sind drin,
     Schüsse genau in die Mitte nur etwa jeder vierte.
     size   = wie groß er ist (Anteil der halben Torhöhe)
     swing  = wie weit er im Tor hin und her pendelt (0–1)
     period = Sekunden für einmal hin und zurück
     dive   = wie schnell er zum Ball hechtet
     react  = Reaktionszeit in Sekunden, bevor er hechtet */
  keeper: {
    easy:   { size: 0.22, swing: 0.55, period: 3.2, dive: 70,  react: 0.18 },
    normal: { size: 0.25, swing: 0.60, period: 2.6, dive: 100, react: 0.15 },
    hard:   { size: 0.29, swing: 0.65, period: 2.1, dive: 140, react: 0.12 },
  },
};
