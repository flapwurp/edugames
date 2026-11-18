# Planspiel Julikrise 1914 – Design-Entscheidungen

**Stand:** Entwurf, 18.11.2026. Noch kein Code. Grundlage ist die Papierfassung, die im Herbst 2026 in zwei
9. Klassen gespielt wurde (Dossiers, Rundenkarten, Notenvordrucke, Spielleitungsskript, Tafel-Tool als Claude-Artefakt).

**Fach / Gruppe:** Geschichte, Klasse 9 · **Sozialform:** Klasse in 6 Delegationen à 4–5 SuS, ein iPad pro Kind,
dazu der Lehrer-Monitor an der digitalen Tafel
**Leitfrage (Reihe):** Wie konnte aus der Begeisterung vom August 1914 ein Krieg werden, dessen Tote bis heute auf
unseren Denkmälern stehen?
**Kompetenz (SiLP, IF 6):** UK – das Handeln der Politiker in der Julikrise nach **Interessen**, **Möglichkeiten und
Grenzen** sowie **beabsichtigten und unbeabsichtigten Folgen** beurteilen
**Platz in der Reihe:** nach der Einstiegsstunde (Kontrastbilder, Kriegerdenkmal), vor dem Kriegsverlauf
**Dauer:** 4–5 Einzelstunden inkl. Reflexion. Ausnahme von der 10–25-Minuten-Regel, weil es ein Planspiel ist
(Absprache mit Rob noch offen).
**Lehrwerk:** Forum Geschichte 3, Kap. 3, S. 68–73 (Kriegsschuld)

## Übernommen aus der Papierfassung (von Rob festgelegt)
- **Gelenktes Nachspielen**, kein offener Sandkasten: Nach jeder Runde gilt wieder der Stand von 1914.
- 6 Delegationen: Österreich-Ungarn, Deutsches Reich, Serbien (ab Runde 4 Belgien), Russland, Frankreich,
  Großbritannien. **Keine Rollen innerhalb der Delegation**, der Staat handelt als Einheit.
- 5 Runden: Sarajevo – Ultimatum – Antwort – Mobilmachung – Kriegserklärungen. Je drei Optionen, gleich gewichtig,
  ohne die Folgen vorwegzunehmen.
- Entscheidungswellen mit Diplomatiephasen davor; Pflichtnoten, Notenvorschläge, eine freie Note pro Runde.
- Begründungsgerüst: Interessen – Lage – Handeln der anderen – erwartete Folgen – „Wir wählen …, weil …“.
- **Geheimhaltung:** Vertrauliche Entscheidungen (z. B. Blankoscheck) werden erst in den Geheimakten aufgedeckt.
- Keine Kämpfe. Das Spiel endet mit den Kriegserklärungen Anfang August 1914.
- Reflexion im Unterricht, nicht im Spiel (Weichen, Kontingenz, Verantwortung, „Das Spiel ist ein Modell, keine Quelle“).

## Ideen für die digitale Fassung (Vorschlag, noch nicht entschieden)
1. Jede Delegation sieht nur, was ihr Staat 1914 wissen konnte.
2. Noten als Telegramme mit Verzögerung, sichtbar als Linie auf der Karte.
3. Mobilmachung als Kette, die niemand anhält (russische Gesamtmobilmachung, Schlieffen-Plan → Belgien, Bündnisfall).
4. **Prognose** vor jeder Entscheidung („Russland wird nachgeben“), danach Abgleich.
5. **Kabinettsbeschluss:** Eine Entscheidung gilt erst, wenn alle in der Delegation dieselbe Option gewählt haben.
6. Auswertung „Unsere Entscheidungen und 1914“ entsteht automatisch, mit Prognosen und Geheimakten.

Bewusst **nicht**: Regler für Haltungen („Aggressivität 70 %“), Punkte für „wie 1914“, Truppenbewegungen.

## Offene Grundsatzfrage: ahistorische Entscheidungen
Problem aus der Erprobung: Wählt eine Delegation eine Option, die den Krieg verhindert hätte, muss die Spielleitung
für die nächste Runde den Stand von 1914 setzen. Das wirkt wie „eure Entscheidung zählt nicht“ und hat das Spiel in
einer Lerngruppe beschädigt. Lösungsansätze und Empfehlung: siehe Abschnitt „Weichenspiel“ unten, Entscheidung durch Rob.

### Vorschlag „Weichenspiel“
- **Spielvertrag vorab statt Korrektur hinterher.** Von Anfang an klar: Wir spielen fünf Weichen der Julikrise.
  An jeder Weiche entscheidet ihr wirklich. Danach zeigt die Akte, welchen Weg Europa 1914 genommen hat, und von dort
  geht es weiter. Das Zurücksetzen ist Regel, nicht Eingriff.
- **Die eigene Entscheidung bekommt eine Folge**, bevor die Akte kommt: eine kurze Karte „Was hätte das für euch
  bedeutet?“, gemessen an den Interessen im eigenen Dossier (z. B. Österreich-Ungarn lässt Serbien gewähren →
  Großmachtstellung, Nationalitätenfrage, Druck des Generalstabs), ausdrücklich als **Vermutung** gekennzeichnet,
  nicht als „So wäre es gekommen“.
- **Abweichung ist Material, nicht Fehler.** Jede abweichende Wahl wird mit Begründung und Prognose gespeichert und
  in der Reflexion zur Frage: Was wusstet ihr, was 1914 niemand wusste? Was war den Regierenden 1914 wichtig, das euch
  heute unwichtig ist? Das ist Kontingenz (es gab Alternativen) und Grenzen (warum wurden sie nicht genommen?).
- **Keine Quote „wie 1914“** in der Auswertung, sondern „Hier seid ihr abgebogen – und hier ging 1914 weiter“.

## Roadmap
Jede Stufe endet mit einem einsetzbaren Spiel. Die Papierfassung bleibt bis zum ersten erfolgreichen Einsatz
als Notfallplan.

### Stufe 0 – Klärung und Inhalte (bis Weihnachten 2026)
- Robs Entscheidungen einholen (Liste „Was von Rob gebraucht wird“).
- Robs überarbeitete Material-PDFs in `content.js` überführen: Dossiers, Lageblätter, Rundenkarten (Optionen mit
  Pro/Contra), Notenvordrucke, Geheimakten, Auflösungstexte „Was 1914 geschah“.
- Platzhalter-Quellen durch echte, belegte Quellen ersetzen (Szögyény-Telegramm 5.7.1914, Ultimatum Punkte 1, 5, 6,
  Karte Europa 1914), Kürzungen gekennzeichnet.
- Rob prüft `content.js` fachlich, bevor Code darauf aufbaut.

### Labor parallel – Schul-WLAN mit einer ganzen Klasse (früh, weil es alles entscheidet)
- `labor/08-klasse/` mit ~30 iPads im Schulnetz: Verbindungsaufbau, Verzögerung, Abbrüche, Nachrichtenmenge
  gegen das Kontingent (100 Nachrichten/s). Ergebnis in `labor/ERGEBNISSE.md`.
- Erst danach fällt die Entscheidung, ob das Spiel Supabase nutzt oder ohne Netz läuft (siehe Stufe 1).

### Stufe 1 – Kernspiel (Januar–März 2027)
- `logik.js` ohne DOM: Runden, Phasen, Wellen, Kabinettsbeschluss, Sichtbarkeit je Delegation, Geheimakten,
  Rücksetzen auf 1914. Tests in Node: jede Runde durchspielbar, Geheimes erreicht nie fremde Delegationen,
  Kabinettsbeschluss nur bei Einigkeit, Rücksetzen ergibt immer den Stand 1914.
- Delegations-App (iPad): Dossier, Lage, Optionen mit Begründungsgerüst, Prognose, Abstimmung im Kabinett.
- Lehrer-Monitor (Laptop an der Tafel): Phasensteuerung mit Timer, Stand jeder Delegation, Aufdecken,
  Folgenkarte und „Was 1914 geschah“, Geheimakten, automatische Auswertung (druckbar, A4 quer).
- Übertragung nur über `shared/sync.js`. Zuerst ein **Modus ohne Netz** (Delegation liest Code vor, Lehrkraft
  tippt ein) als Rückfallebene, dann – falls Rob zustimmt – Supabase.
- Probelauf mit einer Lerngruppe vor dem Schuljahr 2027/28.

### Stufe 2 – Telegramme (April–Mai 2027)
- Pflichtnoten als Formular, Vorschläge halb vorgefertigt, eine kurze freie Note pro Runde.
- Laufzeit je Strecke, verspätete Noten kommen nach der Welle an. Lehrkraft liest alles mit.

### Stufe 3 – Karte und Ketten (Juni–August 2027)
- Europakarte 1914 (eigene Zeichnung oder gemeinfreie Vorlage), Kalender 28. Juni – 4. August.
- Mobilmachungs- und Bündnisketten als Animation, die niemand anhält.

### Danach
- Einsatz in Klasse 9 im Schuljahr 2027/28, Auswertung, `DESIGN.md` nachführen.

## Was von Rob gebraucht wird
1. Entscheidung zum Umgang mit ahistorischen Entscheidungen (Vorschlag „Weichenspiel“ oder anders).
2. Supabase für ein echtes Spiel: ja/nein; wenn ja, Freitext erlaubt (Länge?) und Rücksprache mit der
   Datenschutzbeauftragten.
3. Dekonstruktion: Reicht die Reflexion im Unterricht („Modell, keine Quelle“), oder soll das Spiel selbst etwas
   zeigen (z. B. „Wo das Spiel vereinfacht“ in der Auswertung)?
4. Entscheiderrollen bei einem Kriegsthema: Bestätigung, dass die Delegationen ohne Einzelrollen bleiben und
   nichts im Spiel Punkte für Eskalation bringt.
5. Das Material: die überarbeiteten PDFs (00–08, Spielleitungsskript), die Übersichtsblätter, ggf. die Word-Fassungen.
6. Rahmen: Wie viele iPads, gibt es den Tafel-Laptop mit Browser, Dauer (4 oder 5 ES), Termin für Probelauf und
   WLAN-Test.
