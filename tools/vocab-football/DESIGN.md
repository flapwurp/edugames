# Vocab Football – Entwurf und Entscheidungen

**Kein Edu-Game**, sondern die digitale Version des analogen Vokabelfußballs, den Rob an der Tafel spielt.
Die didaktischen Leitlinien aus `CLAUDE.md` gelten für die Edu-Games, nicht für dieses Werkzeug
(Wettbewerb steht hier bewusst im Vordergrund, der Inhalt ist austauschbar).

## Einsatz
- Englisch Kl. 6 und 9, Spiel für zwischendurch (z. B. nach einer Klassenarbeit). Kein festes Ende, kein Timer.
- Läuft auf Robs **Windows-Laptop** an der digitalen Tafel, Bildschirm **gespiegelt**, die Tafel ist per USB-C Touch-Eingabe.
  Nicht für die Schul-iPads gedacht.
- Oberfläche auf Englisch.

## Ablauf (wie analog)
- Zwei Teams, je **1 Schütze + 2 Passer** an der Tafel. Nur der Schütze schreibt (analog mit Tafelstift), die Passer helfen.
- Die App zeigt das Wort, die Teams schreiben, wer fertig ist, ruft „Stopp“.
- Lehrkraft tippt: **✓ Team** (richtig), **✗ Not yet** (falsch – nur Rückmeldung, die Zeit läuft weiter, bis ein Team richtig liegt) oder **Skip**.
- Richtige Antwort: Die Lösung erscheint, der Schütze **wischt den Ball** an der Tafel.
- Nach jedem Wort **Wechsel**: Schütze zurück ins Team, ein Passer wird Schütze, ein neuer Passer kommt nach vorn (App zeigt das an, speichert keine Namen).

## Spielfeld
- Ballpositionen −2 … +2. Jede richtige Antwort = eine Position Richtung gegnerisches Tor (wie analog „+1“).
- Steht der Ball auf ±2 vor dem gegnerischen Tor, löst die nächste richtige Antwort dieses Teams einen **Torschuss** aus.

## Geschicklichkeit (bewusst klein)
- **Pässe:** Wischen ist reine Show, der Pass kommt immer an.
- **Torschuss:** Torwart pendelt im Tor und hechtet nach kurzer Reaktionszeit zum Ball.
  Ecke, in der er gerade nicht steht = meist Tor; Mitte = meist gehalten; zu nah am Pfosten = Pfosten/daneben.
  Schneller wischen = schnellerer Ball.
- **Fehlschuss kostet nur eine Runde:** Der Ball bleibt vor dem Tor liegen, das Team darf bei der nächsten richtigen Antwort erneut schießen.
- Richtwerte (Simulation in `tests/vocab-football.test.js`): „normal“ ≈ 3 von 4 gut gezielten Schüssen drin, Schüsse in die Mitte ≈ 1 von 4.
  Stellschrauben in `content.js` (`CONFIG.keeper`).

## Vokabellisten
- Dauerhafte Listen in `content.js` (Englisch ; Deutsch, eine Zeile pro Vokabel, oder Tab aus Word/Excel). Bearbeitbar direkt auf GitHub.
- Spontan: „Paste a list …“ im Startbildschirm (bleibt nur bis zum Schließen des Tabs).
- Abfragerichtung umschaltbar: Englisch → Deutsch, Deutsch → Englisch, gemischt.

## Bedienung für die Lehrkraft
- Undo (↶) nimmt Fehlklicks Schritt für Schritt zurück.
- Tastatur: ← / → richtig links/rechts, ↓ Not yet, S Skip, Enter nächstes Wort, Z Undo, F Vollbild.
- Klänge werden im Browser erzeugt (keine Dateien), abschaltbar.
