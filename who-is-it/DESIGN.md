# Who is it? – Design-Entscheidungen

**Fach / Gruppe:** Englisch, Klasse 5–7 (Pilot: 6e) · **Sozialform:** Paar, ein iPad pro Person
**Kompetenz:** dialogisches Sprechen – Personen beschreiben (has got, is wearing), Ja/Nein-Fragen, Nachfragen
**Einsatz:** kurzes Spiel für zwischendrin, keine Reflexionsphase nötig

## Spielprinzip
Zwei Modi, Auswahl beim Start (Team game / Versus). Der Spielcode enthält Level und Modus
(x000–x499 = Team game, x500–x999 = Versus), Spieler 2 bekommt beim Beitreten automatisch denselben Modus.

- **Team game (Info-Gap):** Der **Describer** sieht eine Person, der **Guesser** sieht 6–12 Personen und findet durch Fragen die richtige.
  Rollenwechsel nach jeder Runde, 4 Runden pro Spiel.
- **Versus (wie das Brettspiel):** Beide sehen dasselbe Brett (12–24 Personen) und haben je eine andere geheime Person.
  Abwechselnd eine Ja/Nein-Frage; wer die Person des anderen zuerst richtig rät, gewinnt. Falsch geraten = verloren.
  Kein Timer. Wer rät, sagt es dem Partner; der tippt „My partner guessed“ und gibt an, ob richtig oder falsch geraten wurde.
  „Oops, German!“ = nächste Frage aussetzen. 4 Spiele, am Ende „You won X of 4“ (nur Punkte am Ende, kein Ranking).

## Festgelegte Entscheidungen
- Personen werden aus Merkmalen erzeugt (keine Bilddateien, keine Bildrechte).
- **Hautfarbe ist ein normales Merkmal (Rob, 16.10.2026):** light / brown / dark skin, kann wie jedes andere Merkmal unterscheiden und steht in Wortliste und „More phrases“. Auf Expert ist sie nicht im Pool (zu auffällig), dort haben alle Personen eines Bretts dieselbe Hautfarbe.
- Drei feste Redemittel je Rolle sind während der Runde dauerhaft sichtbar; die vollständige Liste und eine Wortliste gibt es über „More phrases“ (ohne Punktabzug).
- „Oops, German!“ kostet einen Stern; Sterne: 3 / 2 / 1 je nach Fehlversuchen.
- Jedes Gerät zählt die Sterne der eigenen Raterunden; das Paar addiert am Ende.
- Bedienoberfläche komplett auf Englisch.

## Pilot 6e (16.10.2026) und Änderungen danach
- Lief gut: ca. 15 Minuten beschäftigt, viel Englisch, Spaß; danach wurde es eintönig (erwartet).
- **Fairness (Fehler bestätigt und behoben):** Auf Medium und Hard waren alle anderen Personen Abwandlungen der gesuchten Person.
  Dadurch war die gesuchte Person immer die „typischste“ und nie die, die als Einzige anders aussieht. Jetzt sind alle Personen
  Abwandlungen einer unsichtbaren Musterperson; die gesuchte Person wird zufällig gewählt. Ein Test prüft das (`tests/who-is-it.test.js`).
- **Mehr Merkmale** (Wunsch der SuS): Frisuren ponytail, bun, spiky hair; Brillen round, square, sunglasses; freckles; earrings; a necklace.
- **Höherer Schwierigkeitsgrad:** neues Level 4 „Expert“ (12 Personen bzw. 24 im Versus).
- **Gute Fragen schließen Gruppen aus (Rob, 16.10.2026):** Die erste Fassung von Expert ließ sich nur Person für Person lösen,
  weil jedes Merkmal nur bei einer Person vorkam. Jetzt gilt für alle Level: Pro Runde unterscheiden sich nur einige Merkmale
  (`vary` aus `pool` in `content.js`), alles andere ist bei allen gleich. Jede Ausprägung teilen sich mindestens ein Viertel der
  Personen (mindestens 2) – keine Einzelmerkmale, eine Ja/Nein-Frage streicht immer eine Gruppe. Schwierigkeit entsteht über die
  Zahl der Personen und darüber, welche Merkmale sich unterscheiden: auf Expert nur unauffällige (Brillenform, Ohrringe,
  Sommersprossen, Kette, Muster, Frisur, Bart, Kopfbedeckung). Tests prüfen Fairness und Mindestanteil.
- **Versus-Modus** als Alternative (Wunsch der SuS), siehe oben.

## Offen / geplant
- Weitere Rätseltypen im selben Gerüst, z. B. „Arrange the room“ (Ortsangaben) oder „Find the way“ (Wegbeschreibungen).
