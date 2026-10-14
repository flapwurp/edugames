/* Spiele auf der Startseite (index.html).
   Neues Spiel: einen Block kopieren und die Werte zwischen den Anführungszeichen bzw. die Zahlen ändern.

   subject   "englisch" oder "geschichte" – bestimmt, unter welchem Fach das Spiel erscheint
   href      Ordner des Spiels
   image     Vorschaubild, 800 × 400 Pixel (2:1), liegt in shared/thumbs/ – erzeugen mit scripts/thumbs.py
   text      ein bis zwei Sätze, in der Sprache des Spiels
   players   Anzahl der Spieler:innen (1 = Einzelarbeit)
   minutes   [von, bis] in Minuten
   grades    [von, bis] Klassenstufe; bei nur einer Klasse beide Zahlen gleich
   stage     "alpha" (läuft, noch nicht im Unterricht erprobt), "beta" (spielbar, wird erprobt und verbessert)
             oder "" (fertig, kein Schild) */

export const SUBJECTS = {
  englisch: {
    label: "English",
    lang: "en",
    lead: "Games for two players. Sit back to back, talk – in English – and solve it together.",
    empty: "No games here yet."
  },
  geschichte: {
    label: "Geschichte",
    lang: "de",
    lead: "Spiele für den Geschichtsunterricht am iPad.",
    empty: "Hier gibt es noch keine Spiele."
  }
};

export const GAMES = [
  {
    subject: "englisch",
    title: "Who is it?",
    href: "who-is-it/",
    image: "shared/thumbs/who-is-it.webp",
    text: "One of you sees one person, the other one sees many. Describe, ask and find the right one.",
    players: 2,
    minutes: [10, 15],
    grades: [5, 7],
    stage: "beta"
  },
  {
    subject: "englisch",
    title: "Spot the Difference",
    href: "spot-the-difference/",
    image: "shared/thumbs/spot-the-difference.webp",
    text: "Your pictures are almost the same. Describe, ask and find the differences together!",
    players: 2,
    minutes: [10, 15],
    grades: [6, 6],
    stage: "beta"
  },
  {
    subject: "englisch",
    title: "Reactor Rescue",
    href: "reactor-rescue/",
    image: "shared/thumbs/reactor-rescue.webp",
    text: "One of you sees the reactor, the other one has the manual. Keep it stable before it explodes!",
    players: 2,
    minutes: [15, 20],
    grades: [8, 9],
    stage: "beta"
  },
  {
    subject: "geschichte",
    title: "Im Rhythmus des Nils",
    href: "im-rhythmus-des-nils/",
    image: "shared/thumbs/im-rhythmus-des-nils.webp",
    text: "Vier Jahre auf einem Bauernhof im alten Ägypten. War der Nil ein Geschenk?",
    players: 1,
    minutes: [20, 25],
    grades: [6, 6],
    stage: "alpha"
  }
];
