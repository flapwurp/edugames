# EduGames – Arbeitsanweisungen für Claude

Projekt von Rob (Englisch/Geschichte, Gymnasium, NRW). Info-Gap-Spiele für den Unterricht,
gehostet über GitHub Pages, gespielt auf schulischen iPads (1:1-Ausstattung, Safari, MDM-verwaltet).

## Harte Rahmenbedingungen
- Muss in **iPad Safari** laufen. Reines HTML/CSS/JavaScript als ES-Module, **kein Build-Schritt**, keine Frameworks, keine npm-Abhängigkeiten im Spielcode.
- **Keine externen Requests** (kein CDN, keine Google Fonts, keine Analytics). Schriften liegen in `shared/fonts/`.
- **Keine Schülerdaten**: keine Namen, keine Logins, nichts verlässt das Gerät. Zustand nur in `sessionStorage`.
- Bedienoberfläche komplett **auf Englisch**; Doku und Kommunikation mit Rob auf Deutsch.
- Touch-first: große Tap-Flächen, kein Hover nötig, keine `alert()/confirm()` (eigene Dialoge in `shared/ui.js`).

## Architektur
- `shared/random.js`: Zufall aus dem Spielcode (`roundRng(code, round)`). Beide Geräte erzeugen damit dieselbe Welt – das ist die Grundlage des Spiels. Nie `Math.random()` für spielrelevante Inhalte.
- `shared/sync.js`: einzige Stelle für Kommunikation zwischen Geräten. Heute „manual“ (Bestätigungscode zum Vorlesen). Echter Multiplayer (z. B. Supabase) wird später hier eingebaut, Spiele rufen nur `encode/decode` bzw. künftige Funktionen dieser Datei auf.
- `shared/session.js`: Spielcode (erste Ziffer = Level), Spielerrollen pro Runde, Speichern.
- `shared/ui.js`: Dialoge, Toasts, Redemittel-Leiste, Hilfsfunktionen.
- Pro Spiel: `content.js` (von Rob editierbar, nur Daten), Logik-Datei(en) ohne DOM-Zugriff (testbar in Node), `app.js` (Bildschirme), `style.css`.
- Reactor Rescue: Regeltexte und Prüflogik stehen zusammen in `rules.js`, damit Handbuch und Spiel nie auseinanderlaufen.

## Didaktische Leitlinien (von Rob festgelegt)
- Die Spielmechanik muss die Kompetenz sein (dialogisches Sprechen), nicht Verpackung.
- Info-Gap strikt: Keine Seite darf die Informationen der anderen enthalten. Das Reactor-Handbuch beschreibt das Gerät **nicht**; der Expert darf nicht zum Vorleser werden.
- Handbuch: knapp, tabellarisch, Bilder nur zur Begriffserklärung; Reihenfolge je Modul: Anweisungen → Nachschlagetabelle → Begriffe.
- Reactor-Fachbegriffe bewusst begrenzt: hot, cold, neutral, marked, plain, run a diagnostic, pulses, steady. Sonst einfaches Englisch (cut, top/bottom wire).
- Konditionalsätze sind der Grammatikschwerpunkt (Typ 1 in Anweisungen, Typ 3 nach Explosion).
- Keine Kurbel o. ä. Mechaniken, bei denen der Expert den Bildschirm des Operators sehen müsste.

## Arbeitsweise
- Vor jedem Commit `npm test` ausführen; neue Spiellogik bekommt Tests (z. B. „jede Runde lösbar“, „gleicher Code = gleiche Welt“).
- Änderungen im Browser prüfen (Playwright/Chromium, mehrere Breiten inkl. iPad hochkant 768 px).
- Commit-Messages auf Deutsch, kurz und konkret.
