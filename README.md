# EduGames

Lernspiele für Englisch und Geschichte. Die ersten beiden sind Info-Gap-Spiele: Zwei Spieler:innen sitzen Rücken an Rücken,
jede Person sieht nur die Hälfte der Informationen – gelöst wird das Spiel nur durch Sprechen.

Läuft im Browser (iPad Safari), ohne Anmeldung, ohne Server, ohne Datenspeicherung.

**Live:** https://flapwurp.github.io/edugames/

| Spiel | Für | Inhalt |
|---|---|---|
| [Who is it?](who-is-it/) | Kl. 5–7 | Personen beschreiben (has got, is wearing), Fragen stellen |
| [Reactor Rescue](reactor-rescue/) | Kl. 8–9 | Bedienungsanleitung lesen, Konditionalsätze, präzise beschreiben und anweisen |
| [Im Rhythmus des Nils](im-rhythmus-des-nils/) | Geschichte Kl. 6 | Einzelspiel (iPad quer): vier Jahre am Nil – Flut, Schlamm, Kalender, Arbeitskraft und Gesten, Schaduf, Deich, Vorräte, Berufe; Quellencheck und Urteil „Ein Geschenk des Nils?“ · [Grafik-Galerie](im-rhythmus-des-nils/galerie.html) · ältere Versionen: [0.1](im-rhythmus-des-nils-v0.1/), [0.2](im-rhythmus-des-nils-v0.2/), [0.3](im-rhythmus-des-nils-v0.3/), [0.4](im-rhythmus-des-nils-v0.4/), [0.5](im-rhythmus-des-nils-v0.5/) |

## So funktioniert das Zusammenspiel ohne Server

Spieler 1 startet ein Spiel und bekommt einen vierstelligen Code (die erste Ziffer ist das Level).
Spieler 2 gibt den Code ein. Beide Geräte erzeugen aus dem Code dieselbe Spielwelt und zeigen
jeweils ihre Hälfte. Am Ende einer Runde liest eine Person einen dreistelligen Bestätigungscode vor,
damit beide Geräte denselben Stand haben (`shared/sync.js`).

## Inhalte selbst ändern

Texte, Redemittel, Zeiten und Level stehen jeweils in `content.js`:

- `who-is-it/content.js` – Level, Redemittel, Merkmale der Personen
- `reactor-rescue/content.js` – Level, Zeiten, Redemittel, Glossar
- `im-rhythmus-des-nils/content.js` – alle Texte, Zahlen (Ernte, Bedarf, Arbeitskraft und Kosten jeder Arbeit, Schaduf-Eimer, Dorfspeicher, Berufe), Merksätze, Quelle M3 (noch Platzhalter), Begriffe

Nur die Wörter zwischen den Anführungszeichen ändern, Kommas und Klammern stehen lassen.
Die Regeln im Reactor-Handbuch stehen in `reactor-rescue/rules.js`, weil jeder Regeltext
direkt neben dem Code steht, der ihn prüft.

## Aufbau

```
index.html            Startseite
shared/               gemeinsamer Code (Zufall aus dem Spielcode, Sitzung, Sync, Dialoge, Schriften)
who-is-it/            app.js (Bildschirme) · people.js (Personen erzeugen/zeichnen) · content.js · style.css
reactor-rescue/       app.js (Bildschirme) · rules.js (Reaktor + Regeln) · manual.js (Handbuch) · content.js · style.css
im-rhythmus-des-nils/ app.js (Bildschirme) · gesture.js (Wischgesten) · sim.js (Ablauf, Ernte, Arbeitskraft, Versorgung) · scene.js (Querschnitt) · assets.js (Zeichnungen) · galerie.html · content.js
tests/                automatische Prüfungen (z. B. „jeder Reaktor ist lösbar“)
```

## Lokal testen

```
npm test              # automatische Prüfungen (Node 20+)
npm run serve         # Seite unter http://localhost:8000 öffnen
```

Die Seiten müssen über einen Webserver geöffnet werden (nicht per Doppelklick), weil sie aus mehreren Dateien bestehen.
