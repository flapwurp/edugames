# EduGames – Arbeitsanweisungen für Claude

Projekt von Rob (Englisch und Geschichte, Gymnasium, NRW). Lernspiele für den Unterricht,
gehostet über GitHub Pages, gespielt auf schulischen iPads (1:1-Ausstattung, Safari, MDM-verwaltet).

Diese Datei gilt für **alle** Spiele. Was nur ein Spiel betrifft, steht in der `DESIGN.md`
im jeweiligen Spielordner – vor Änderungen an einem Spiel immer zuerst dort lesen.
Neue Spiele bekommen ebenfalls eine eigene `DESIGN.md`.

## Harte Rahmenbedingungen
- Muss in **iPad Safari** laufen. Reines HTML/CSS/JavaScript als ES-Module, **kein Build-Schritt**, keine Frameworks, keine npm-Abhängigkeiten im Spielcode.
- **Keine externen Requests** (kein CDN, keine Google Fonts, keine Analytics). Schriften liegen in `shared/fonts/`.
- **Keine Schülerdaten**: keine Namen, keine Logins, nichts verlässt das Gerät. Zustand nur in `sessionStorage`.
- **Sprache der Bedienoberfläche:** Englischspiele komplett auf Englisch, Geschichtsspiele auf Deutsch. Doku und Kommunikation mit Rob auf Deutsch.
- Touch-first: große Tap-Flächen, kein Hover nötig, keine `alert()/confirm()` (eigene Dialoge in `shared/ui.js`).

## Didaktische Leitlinien (von Rob festgelegt)

**Grundkriterium:** Die Spielmechanik muss selbst die Kompetenz sein. Prüfstein: Funktioniert das Spiel
genauso, wenn man den Fachinhalt austauscht, ist der Inhalt nur Verpackung – so ein Spiel wird nicht gebaut
(Beispiel: ein Escape Game, in dem man nur Begriffe Definitionen zuordnet).

**Einbettung in den Unterricht**
- Ob ein Spiel eine Reflexionsphase braucht, hängt vom Spiel ab: kurze Spiele „für zwischendrin“ brauchen keine, komplexe Spiele schon.
- Die Reflexion muss **nicht** ins Spiel eingebaut werden – sie gehört in den Unterricht. Beim Entwurf eines Spiels klären, ob und wie reflektiert wird.

**Geschichte**
- Jedes Geschichtsspiel ist eine Geschichtsdarstellung. Beim Entwurf **immer bei Rob nachfragen, ob und wie das Spiel dekonstruiert werden soll** – aber keine Dekonstruktion automatisch einbauen.
- Fachbegriffe zwingend korrekt: „Quelle“ nur für echte Quellen; Lehrbuch-Verfassertexte sind Darstellungen. Quellen nur echt, korrekt belegt und ohne stille Veränderungen (Kürzungen kennzeichnen).

**Sensible Themen** (Krieg, Gewalt, Kolonialismus, NS, Menschenrechte)
- Keine pauschalen Verbote, aber Rollen und Perspektiven beim Entwurf **immer kritisch mit Rob durchsprechen** – besonders, wenn SuS Täter- oder Entscheiderrollen übernehmen oder Gewalt im Spiel Punkte bringen könnte.

**Sozialform und Wettbewerb**
- Je nach Spiel sind alle Sozialformen möglich (Einzel, Paar, Gruppe, Klasse).
- Wettbewerb steht nie im Vordergrund. Punkte oder Sterne am Ende sind in Ordnung, wo sie die Leistung sichtbar machen; keine klassenweiten Ranglisten.

**Differenzierung**
- Level verändern Menge, Tempo und Hilfen – **nicht** den kognitiven Anspruch. Höhere Level sind qualitativ anspruchsvoller, nicht nur länger.
- Hilfen (Redemittel, Glossar, Tipps) sind jederzeit erreichbar und kosten höchstens etwas Zeit, nie Punkte.

**Feedback**
- Fehler haben im Spiel eine spürbare Folge und werden danach erklärt (was wäre richtig gewesen, warum). Nie nur „falsch“.

**Umfang und Wiederverwendung**
- Eine Spielrunde dauert 10–25 Minuten und passt mit Einstieg in eine Einzelstunde.
- Spiele für wiederholten Einsatz brauchen Varianten, damit sie nicht durch Auswendiglernen lösbar werden.
- Inhalte (Texte, Wörter, Level) stehen in `content.js` und müssen sich ohne Programmierkenntnisse austauschen lassen.

## Architektur
- `shared/random.js`: Zufall aus dem Spielcode (`roundRng(code, round)`). Bei Mehrgeräte-Spielen erzeugen alle Geräte damit dieselbe Welt. Nie `Math.random()` für spielrelevante Inhalte.
- `shared/sync.js`: einzige Stelle für Kommunikation zwischen Geräten. Heute „manual“ (Bestätigungscode zum Vorlesen). Echter Multiplayer (z. B. Supabase) wird später hier eingebaut; Spiele rufen nur Funktionen dieser Datei auf.
- `shared/session.js`: Spielcode (erste Ziffer = Level), Spielerrollen pro Runde, Speichern.
- `shared/ui.js`: Dialoge, Toasts, Redemittel-Leiste, Hilfsfunktionen.
- Pro Spiel: `content.js` (nur Daten, von Rob editierbar), Logik-Datei(en) ohne DOM-Zugriff (testbar in Node), `app.js` (Bildschirme), `style.css`, `DESIGN.md` (Spielidee und spielspezifische Entscheidungen).
- Neue Spiele werden auf der Startseite `index.html` und in der Tabelle in `README.md` ergänzt.

## Arbeitsweise
- Beim Entwurf eines neuen Spiels zuerst mit Rob klären: Lernziel und Kompetenz, Lerngruppe, Platz in der Reihe, Sozialform, Reflexion (ja/nein, wie), bei Geschichte die Dekonstruktion, bei sensiblen Themen die Rollen.
- Vor jedem Commit `npm test` ausführen; neue Spiellogik bekommt Tests (z. B. „jede Runde lösbar“, „gleicher Code = gleiche Welt“).
- Änderungen im Browser prüfen (Playwright/Chromium, mehrere Breiten inkl. iPad hochkant 768 px), über einen lokalen Webserver (`npm run serve`).
- Neue grundsätzliche Entscheidungen von Rob hier bzw. in der passenden `DESIGN.md` festhalten.
- Commit-Messages auf Deutsch, kurz und konkret, ohne Link zur Code Session
