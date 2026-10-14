# Spot the Difference – Vorhaben

**Stand:** Prototyp mit zwei Szenen (14.10.2026). Arbeitstitel. Die allgemeinen Leitlinien in `CLAUDE.md` gelten.

## Eckdaten (von Rob festgelegt)
- **Fach / Gruppe:** Englisch, Klasse 6 (auch schon Klasse 5 denkbar)
- **Sozialform:** Paar, ein iPad pro Person, Rücken an Rücken
- **Einsatz:** Spiel für zwischendrin, keine Reflexionsphase nötig, ca. 10–15 Minuten
- **Sprachliche Einordnung:** Stufe 2 auf Robs Skala von 1 bis 5 (Who is it? = 1, Reactor Rescue = 5)

## Spielprinzip
Symmetrisches Info-Gap: Beide sehen fast dasselbe Bild (z. B. ein Kinderzimmer, ein Klassenzimmer, einen Park),
das sich an 5–7 Stellen unterscheidet. Niemand kennt die Lösung, niemand sieht das andere Bild. Die Unterschiede
findet man nur, indem beide beschreiben, vergleichen und nachfragen.

**Der Schritt gegenüber Who is it?:** Dort beschreibt eine Person und die andere stellt fast nur Ja/Nein-Fragen.
Hier sprechen beide gleich viel und wechseln ständig zwischen Beschreiben, Fragen, Bestätigen und Widersprechen.

**Grundkriterium:** Ohne Sprechen kann man keinen Unterschied finden.

## Sprachmittel (Kl. 5/6, vor der Ausarbeitung mit dem Lehrwerksstand von Green Line abgleichen)
- there is / there are, has got
- Präpositionen: in, on, under, next to, behind, in front of, between
- Farben, Zahlen, Plural, How many …?
- ggf. present progressive („A boy is reading.“), falls schon eingeführt
- Zustimmen und Widersprechen: „Me too.“ / „Not in my picture.“ / „In my picture it's …“

## Ideen für die Umsetzung
- **Szenen aus Bausteinen** erzeugen, wie die Personen in Who is it?: unbegrenzte Varianten aus dem Spielcode, keine Bildrechte.
  Szenen-Themen an Green-Line-Units anknüpfen (z. B. bedroom, classroom, park, market, birthday party).
- **Arten von Unterschieden:** fehlt/da, Farbe, Anzahl, Position (Präposition), ggf. Tätigkeit einer Person.
  Keine Unterschiede, die nur über Rot/Grün erkennbar sind (Farbsehschwäche).
- **Feste Redemittel-Leiste** wie in den anderen Spielen, hier für beide Rollen gleich, z. B.:
  „In my picture there is/are …“, „Is there a … in your picture?“, „Where is the …?“, „What colour is …?“
- **Hilfen:** „More phrases“ und eine Wortliste mit Bildern (für Klasse 5 wichtig), ohne Punktabzug.
- **„Oops, German!“** wie in Who is it?.
- **Feedback nach der Runde:** Beide Bilder nebeneinander, Unterschiede markiert, zu jedem Unterschied ein Mustersatz
  („In picture A there are three apples. In picture B there are two apples.“).

## Entscheidungen (mit Rob geklärt, 14.10.2026)
- **Zielgruppe:** vorerst nur Klasse 6. Ob es auch für Klasse 5 taugt, wird später entschieden.
- **Zeitlimit:** Jede Szene hat einen kleinen Countdown. Ziel ist, in der Zeit so viele Unterschiede wie möglich zu finden.
- **Fehltipp:** Ein Tipp auf eine Stelle ohne Unterschied zieht Zeit vom Countdown ab (Wert in `content.js`). Die Runde endet, wenn alle Unterschiede gefunden sind oder die Zeit abgelaufen ist.
- **Keine Wahl der Unterschiedsart** beim Markieren: Tippen auf die Stelle genügt.
- **Level:** Die Arten von Unterschieden sind auf allen Leveln gleich. Level ändern nur Menge und Hilfen.
- **Grundsatz Schwierigkeit (Rob):** Mehr Unterschiede machen ein Bild nicht schwerer, solange nicht auch mehr Dinge im Bild sind.
  Schwerer wird es über die Dichte: mehr Dinge, aber kaum mehr Unterschiede.
  Stand: Easy ca. 10 Dinge / 5 Unterschiede, Medium ca. 13 / 5, Hard ca. 17 / 6 (Werte `extras` und `differences` in `content.js`).
- **Runden:** 2 Szenen pro Spiel.
- **iPad:** Querformat, die Szene füllt den Bildschirm. Kleine Dinge stehen in Behältern oder Gruppen, die als Ganzes die Tippfläche sind (z. B. die Becher auf dem Tisch).
- **Szenen:** zuerst „Birthday party“ (Green Line 2, Unit 1 „It's my party“), danach „Park“ (Unit 2 „My friends and I“, Freizeitaktivitäten beschreiben).
- **Present progressive** ist in Klasse 6 eingeführt. Tätigkeiten von Personen sind daher eine Unterschiedsart („The girl is eating cake.“).
- **Punktestand:** noch offen, wird im Prototyp ausprobiert. Vorschlag: Jedes Gerät zählt für sich, kein Bestätigungscode.
  Wird ein Unterschied gefunden, tippen ihn beide in ihrem Bild an.

## Umsetzung im Prototyp (Vorschläge von Claude, mit Rob zu prüfen)
- Spieler 1 sieht Bild A, Spieler 2 Bild B. Beide Bilder entstehen aus dem Spielcode.
- Arten von Unterschieden: fehlt/da, Farbe, Anzahl, Ort (Präposition), Tätigkeit einer Person, Wetter vor dem Fenster.
  In jeder Runde mindestens ein Unterschied bei Ort, Anzahl und Tätigkeit.
- Farben ohne Rot und Grün; Farbunterschiede nur zwischen Farben, die sich auch in der Helligkeit deutlich unterscheiden.
- „Oops, German!“ kostet wie ein Fehltipp Zeit (statt eines Sterns wie in Who is it?).
- Auflösung nach jeder Runde: beide Bilder mit nummerierten Markierungen, zu jedem Unterschied zwei Mustersätze aus Sicht
  der beiden Spieler („In my picture there are three presents.“ – „In my picture there are four presents.“).

## Szenen
- **Birthday party** (Runde 1, `party.js`): Zimmer mit Fenster, Tisch, Sofa, Regal. Orte: on the windowsill, on the shelf, next to the plant,
  under the table, on/behind/in front of the sofa. Tätigkeiten: eating cake, drinking lemonade, reading, playing the guitar, taking a photo, waving, dancing.
- **In the park** (Runde 2, `park.js`): Baum, Bank, Teich, Picknickdecke. Orte: in/under the tree, on/under/next to the bench, on the blanket,
  in front of the pond. Tätigkeiten: eating an ice cream, listening to music, reading, taking a photo, waving, drinking lemonade, playing the guitar.
  Wetter: the sun is shining / it's cloudy. Kopfbedeckung: cap statt Partyhut.
- Figuren (Kinder, Tiere, kleine Dinge) liegen gemeinsam in `figures.js`, damit neue Szenen sie wiederverwenden.

## Nächster Schritt
Beide Szenen mit Klasse 6 testen. Danach entscheiden: Punktestand, „Oops, German!“, weitere Szenen (z. B. classroom, market).
