# Planspiel Julikrise 1914 – Design-Entscheidungen

**Stand:** Entwurf, 18.11.2026. Inhalte der Papierfassung liegen in `content.js`, Stilprobe in `stilprobe.html`.
Noch keine Spiellogik. Grundlage ist die Papierfassung, die im Herbst 2026 in zwei 9. Klassen gespielt wurde.

**Fach / Gruppe:** Geschichte, Klasse 9 · **Sozialform:** Klasse in 6 Delegationen à 4–5 SuS, ein iPad pro Kind
(1:1), dazu der Lehrer-Monitor auf dem Laptop an der Tafel
**Leitfrage (Reihe):** Wie konnte aus der Begeisterung vom August 1914 ein Krieg werden, dessen Tote bis heute auf
unseren Denkmälern stehen?
**Kompetenz (SiLP, IF 6):** UK – das Handeln der Politiker in der Julikrise nach **Interessen**, **Möglichkeiten und
Grenzen** sowie **beabsichtigten und unbeabsichtigten Folgen** beurteilen
**Platz in der Reihe:** nach der Einstiegsstunde (Kontrastbilder, Kriegerdenkmal), vor dem Kriegsverlauf
**Dauer:** eher 5 Einzelstunden inkl. Reflexion (Rob). Ausnahme von der 10–25-Minuten-Regel, weil es ein Planspiel ist.
**Lehrwerk:** Forum Geschichte 3, Kap. 3, S. 68–73 (Kriegsschuld)

## Entscheidungen von Rob
- **Verbindung:** Das Spiel darf über das Netz laufen (Supabase). Es werden **keine personenbezogenen Daten**
  übertragen: kein Name, kein Login; nur Raumcode, zufällige Gerätekennung, Delegation, Wahl, Prognose, Begründungs-
  stichworte und Notentext. Nichts wird dauerhaft gespeichert. Hinweis im Spiel: keine Namen in Noten schreiben,
  die Lehrkraft liest alles mit.
- **Rollen:** Delegationen ohne Einzelrollen, der Staat handelt als Einheit. Nichts im Spiel belohnt Eskalation.
- **Dekonstruktion:** Die Reflexion im Unterricht reicht vorerst. Eine Seite „Wo das Spiel vereinfacht“ kann später
  am Ende der Auswertung ergänzt werden.
- **Rahmen:** 1:1-iPads, Laptop an der Tafel. Ein eigener WLAN-Test ist nicht nötig.
- **Grafik:** sehr ansprechend, wichtig. Stilprobe „Kabinettstisch“ gefällt (18.11.). Mehr mit Bildern arbeiten:
  historische Flagge je Delegation in der Kopfzeile, gemeinfreie historische Bilder zur Lage jeder Runde.
- **Früher Ausgang:** angekündigter Übergang in die „Akte 1914“. Vorher nennt die Ausgangskarte **konkret**, an welcher
  Stelle und durch welche Entscheidung der Krieg (vorerst) verhindert wurde.
- **Freitext in Noten:** streng begrenzt, etwa so lang wie das Telegramm in der Stilprobe (höchstens 100 Zeichen).
- **Framing Controls:** viel mehr davon; Stimmungsanzeigen in drei Stufen sind gut.
- **Grundidee bleibt:** gelenktes Spiel in fünf Runden, keine Kämpfe, Ende mit den Kriegserklärungen Anfang August 1914.

## Das Problem aus der Erprobung
Die Optionen jeder Runde waren für den Stand von 1914 geschrieben. Wich eine Delegation ab, passten die Karten der
anderen nicht mehr (Beispiel: Deutschland rät Wien in Runde 1 zur Mäßigung – in Runde 3 heißt die Option trotzdem
„Österreich-Ungarn den Rücken stärken“). Deshalb musste nach jeder Runde auf 1914 zurückgesetzt werden, und das wirkte
wie „eure Entscheidung zählt nicht“.

## Vorschlag: Entscheidungsnetz statt fester Karten
### 0. Grundsatz für jede Karte (Rob, 18.11.)
Jede Delegation hat in jeder Runde **drei Optionen**: **eine historische**, die bei gründlicher Analyse von Dossier,
Lage und Handeln der anderen (und mit Hilfe der Framing Controls) die überzeugendste ist, und **zwei weitere**, die in
**andere Richtungen** gehen, aber für die Zeit plausibel sind. Das Papiermaterial ist dafür Ausgangspunkt, nicht
Vorgabe: Passt eine Option nicht, wird sie ersetzt.

Geprüft am 18.11., vier Optionen ersetzt, weil zwei Optionen in dieselbe Richtung gingen oder eine Option zu vage war:

| Karte | alt | neu | Grund |
|---|---|---|---|
| D, Runde 2, A | England über Wiens Pläne informieren | Russland schon jetzt warnen, sich herauszuhalten | A und B waren beide „Mäßigung“; England einzuweihen hieße, den Verbündeten zu verraten. Neu: Abschreckung (Lokalisierungsgedanke) |
| R, Runde 2, B | Frankreich nicht einbinden, allein handeln | Wien direkt warnen: Russland lässt Serbien nicht im Stich | „allein handeln“ war zu vage |
| D, Runde 3, C | Konferenzvorschlag unterstützen | Russland warnen: weitere Kriegsvorbereitungen zwingen uns zur Mobilmachung | B und C waren beide „Mäßigung“; neu die Richtung Abschreckung |
| BEL, Runde 5, A | Durchmarsch erlauben | Zeit gewinnen: Bedenkzeit, Garantiemächte fragen | A und C waren beide „Durchmarsch erlauben“ |

Alle übrigen Karten erfüllen den Grundsatz. Grenzfälle, die bleiben: Ö-U Runde 1 A („Großmächte beraten lassen“)
widerspricht Wiens Interessen stark, ist als Gegenrichtung aber gewollt; R Runde 3 A (Den Haag) schlug 1914 Serbien
vor, nicht Russland.

### 1. Weltzustand aus Merkmalen
Jede Entscheidung setzt **Merkmale** der Welt (`SETZT` in `netz.js`), z. B. D wählt in Runde 1 „Mäßigung“ →
„Berlins Linie gegenüber Wien: Rat zur Mäßigung“. Die letzte Entscheidung zählt: Gibt Berlin in Runde 2 doch freie
Hand, ändert sich das Merkmal. Karten, Lage, Grenzen und Ausgänge fragen **nur Merkmale** ab, nie einzelne
Buchstaben. So bedeutet „Mäßigung“ dasselbe, egal in welcher Runde Berlin dazu geraten hat.

Derzeit 22 Merkmale, darunter: Berlins Linie, Wiens Kurs, Ultimatum, Zeitpunkt, Serbiens Haltung und Antwort,
Russlands Haltung, Staatsbesuch, Frankreich zu Russland, Englands Haltung, Konferenz, Krieg Wien–Belgrad, russische
Mobilmachung, Belgiens Haltung, Deutschlands Vorgehen im Westen. Die vollständige Liste mit Werten und dem Stand von
1914 nach jeder Runde zeigt `netz.html`.

**Stimmungsanzeigen** sind ebenfalls Merkmale (drei Stufen), die nur ein Staat sieht: Ansehen Österreich-Ungarns,
Vertrauen Wiens in Berlin (für D), Ansehen des Zaren, Rückhalt der serbischen Regierung. Sie steigen bei Entscheidungen
in Richtung 1914 und fallen bei den anderen (Entwurf, Block C).

Die Merkmale selbst sind **für die SuS unsichtbar** (keine Zahlen, keine Regler). Sichtbar ist nur, was daraus folgt:
Lagetext, Optionen, Telegramme, Stimmungsanzeigen in Worten.

### 2. Karten mit Varianten
- **Lage** besteht aus Bausteinen: Jeder Satz kann an Merkmale gebunden sein („Serbien hat das Ultimatum vollständig
  angenommen …“).
- **Optionen** haben Varianten mit Bedingung. Beispiel D, Runde 3, wenn Berlins Linie = Mäßigung:
  A wird zu „Kurswechsel: Wien jetzt doch den Rücken stärken und die Konferenz ablehnen“, Contra „Wien hat unseren
  Rat gehört – ein Kurswechsel macht uns unberechenbar.“
- Eine Option kann wegfallen oder durch eine passende ersetzt werden, es bleiben aber immer **drei**.
- Eine Variante kann festlegen, was eine Option in diesem Fall bewirkt („setzt“). Dann hängt nichts mehr davon ab,
  dass ein Buchstabe überall dasselbe bedeutet.

### 3. Ausgänge
Nicht jeder Weg führt zum 4. August. Vorgesehen sind wenige benannte Ausgänge, z. B. „Krise beigelegt“
(Konferenz oder angenommenes Ultimatum), „Krieg auf dem Balkan begrenzt“, „Großer Krieg“. Erreicht die Klasse einen
Ausgang vor Runde 5, zeigt das Spiel eine **Ausgangskarte** (vorsichtig formuliert, als Vermutung gekennzeichnet) und
geht dann – **als vorher angekündigte Regel** – in die „Akte 1914“ über: Die übrigen Runden werden vom Stand 1914 aus
gespielt. Das Zurücksetzen passiert also höchstens einmal, an einer klar erkennbaren Stelle, und der abweichende Weg
bleibt in der Auswertung sichtbar.

Von Rob bestätigt (18.11.). Die Ausgangskarte setzt sich aus Sätzen zusammen, die genau zu den Entscheidungen der
Klasse passen („… weil Österreich-Ungarn Serbiens Antwort angenommen hat“), dazu „Aber …“ (was offen bleibt) und
„1914 …“ (was tatsächlich geschah). Umsetzung: `AUSGAENGE` in `netz.js`.

**Umsetzung des Netzes:** `netz.js` (Merkmale, SETZT, Varianten, Lage, Grenzen, Ausgänge; editierbar wie
`content.js`), `logik.js` (berechnet Welle für Welle die Merkmale; eine Karte sieht nur, was vorher entschieden wurde),
Ansicht `netz.html` (Entscheidungen → Merkmale → was sich ändert). Tests in `tests/planspiel-julikrise-netz.test.js`:
alle Werte bekannt; auf dem Weg von 1914 bleibt jede Karte wie auf Papier, ohne Grenze und frühen Ausgang;
4000 zufällige Partien mit immer drei vollständigen Optionen, jeder Ausgang mit konkretem Grund, und jede Variante,
jede Grenze und jeder Ausgang wird mindestens einmal erreicht.

### 4. Framing Controls (Lenkung ohne Vorgabe)
Grundsatz: Die Lenkung kommt aus **historisch belegten Kräften**, nicht aus einer Spielleitung, die „richtig“ sagt.
Fachlich: Anstöße, die als Information aus der Zeit erscheinen, müssen echt oder klar als vereinfachte Darstellung
gekennzeichnet sein. Erfundene Zitate werden nicht als Quellen ausgegeben.

| Mittel | Wirkung | Beispiel |
|---|---|---|
| **Stimmen ohne Delegation** | Druck von Kräften, die niemand am Tisch spielt | Conrad drängt in Wien auf Krieg; Moltke drängt auf Tempo; russische Generäle; britisches Kabinett gespalten |
| **Stimmung im Land** | Innenpolitik als Grenze, qualitativ (drei Stufen, keine Zahlen) | Serbien: Wahlkampf, nationalistische Presse; Russland: Ansehen des Zaren; GB: Irland |
| **Interessen-Bezug an Optionen** | kleine Marke „passt zu unserem Ziel: …“ aus dem Dossier | D: „Verbündeten erhalten“ an der Zusage |
| **Harte Grenzen als Ereignis** | Wahl ist möglich, aber die Wirklichkeit antwortet | R wählt Teilmobilmachung → die Generäle melden: nicht vorbereitet, Chaos (so 1914 am 29./30. Juli) |
| **Zeitdruck** | Uhr und Kalender laufen, Noten kommen verspätet | Ultimatum 48 Stunden; Schlieffen-Plan |
| **Ungleiches Wissen** | Jede Delegation sieht nur, was ihr Staat wusste | Entente erfährt nichts vom Blankoscheck |
| **Folgenkarte** | Abweichung bekommt eine Folge, gemessen an den eigenen Interessen | „Was würde das für euer Ansehen als Großmacht bedeuten?“ |

**Weitere Ideen (Sammlung, noch auszuarbeiten):**
- *Stimmungsanzeigen (drei Stufen, mit Wortbegründung):* Serbien „Rückhalt der Regierung“ (Wahlkampf, Nationalisten);
  Ö-U „Ansehen als Großmacht“ und „Geduld der Generäle“; Russland „Ansehen des Zaren“ (panslawistische Presse, Streiks);
  Deutschland „Vertrauen Wiens“; Frankreich „Festigkeit des Bündnisses“; GB „Kabinett geeint/gespalten“, „Irland“.
- *Stimmen ohne Delegation:* Monarchen (Franz Joseph, Wilhelm II., Nikolaus II.), Generalstäbe (Conrad, Moltke,
  Januschkewitsch), Kriegsminister, Botschafterberichte (Lichnowsky aus London, Szögyény aus Berlin), Parlament,
  Zeitungsschlagzeilen, Börse (Kurse fallen Ende Juli).
- *Erinnerungskarten an Präzedenzfälle:* „1908/09: Russland wich zurück, weil Berlin hinter Wien stand“, „1912/13:
  Konferenz in London“, „Marokko 1911“. So argumentierten die Regierenden selbst.
- *Unser Wort:* Öffentliche Erklärungen und Zusagen binden; spätere Abweichung erscheint als „Kurswechsel“
  (schon im Netz angelegt).
- *Uhren:* Fristen sichtbar (48 Stunden), Tage bis zur Kampfbereitschaft je Armee, Ernteurlaub, Kaiser auf Nordlandreise
  (Antwort aus Berlin kommt später), Poincaré auf See (schlecht erreichbar).
- *Unsicheres Wissen:* Gerüchte als „unbestätigt“ markiert; Missverständnisse (Lichnowsky-Telegramm 1. August).
- *Stimmen im Kabinett:* zwei Positionen innerhalb der eigenen Regierung (Bethmann Hollweg gegen Moltke, Tisza gegen
  Conrad, Grey gegen die Kriegsgegner im Kabinett).
- *Reihenfolge und Sichtbarkeit:* wer zuerst entscheidet, wer wessen Entscheidung sieht.

**Zum Beispiel Serbien (Wahlkampf):** Meinungsumfragen gab es 1914 noch nicht; im Spiel wären sie ein Anachronismus.
Besser: Schlagzeilen und Berichte aus dem Wahlkampf. Die Skupština war im Juni 1914 aufgelöst worden, die Wahl stand
für August an (Datum prüfen). Eine Stimmungsanzeige „Rückhalt der Regierung“ (schwach – mittel – stark) mit Begründung
in Worten („Die Nationalisten werfen Pašić Schwäche gegenüber Wien vor“) lenkt Richtung „Abwarten, Wahlkampf“, ohne
es vorzuschreiben. Echte Schlagzeilen nur mit Beleg; sonst als Darstellung gekennzeichnet.

### 5. Prognose und Kabinettsbeschluss
- Vor jeder Entscheidung tippt die Delegation an, was sie von zwei anderen Staaten erwartet. Nach der Welle zeigt
  das Spiel, was wirklich geschah. Das ist das Material für „beabsichtigte und unbeabsichtigte Folgen“.
- Eine Entscheidung gilt erst, wenn alle Geräte der Delegation dieselbe Option gewählt haben.

### 6. Auswertung
Automatisch: je Runde Wahl, Begründung, Prognose, was geheim war, und „Hier seid ihr abgebogen – hier ging es 1914
weiter“. **Keine Quote „wie 1914“.**

## Grafik (Stilprobe in `stilprobe.html`)
Richtung „Kabinettstisch 1914“ (von Rob angenommen): dunkelgrüner Tisch, Papierakten, roter Stempel „Geheim“, Telegrammstreifen,
Siegel der Delegation, Kalenderband 28. Juni – 4. August. Eigene Grafik, keine Vorlagen aus anderen Spielen.
Geplant: Europakarte 1914 als eigene SVG-Zeichnung, Telegrammlinien zwischen Hauptstädten, Mobilmachungsketten als
Animation, passende Schriften (OFL) in `shared/fonts/`.
- **Flaggen:** historische Flaggen von 1914 als eigene SVG-Zeichnungen in der Kopfzeile (Deutsches Reich
  schwarz-weiß-rot, Österreich-Ungarn, Serbien, Belgien, Russland, Frankreich, Großbritannien).
- **Bilder zur Lage:** je Runde ein gemeinfreies historisches Foto oder Plakat (z. B. Festnahme in Sarajevo,
  Poincaré in St. Petersburg, Mobilmachungsaufrufe, Menschenmengen August 1914). Herkunft und Lizenz in `NACHWEISE.md`;
  Bildunterschrift mit Datum, Ort und Hinweis, ob es eine Quelle (zeitgenössisches Foto) ist.

## Roadmap (nach Aufgaben)
Jeder Block endet mit etwas, das Rob prüfen kann. Die Papierfassung bleibt Notfallplan, bis das Spiel einmal
erfolgreich gelaufen ist.

### A. Grundlagen
- [x] Ordner, `DESIGN.md`
- [x] Papierfassung vollständig in `content.js` (Dossiers, Lage, Optionen mit Pro/Contra, Noten, Auflösungen,
      Option 1914), Tests auf Vollständigkeit
- [x] Stilprobe Delegationsbildschirm
- [ ] Rob prüft `content.js` gegen seine PDFs

### B. Entscheidungsnetz (Inhalt)
- [x] Entwurf in `netz.js`: Varianten, Lagebausteine, Grenzen, drei frühe Ausgänge, Ende; Ansicht `netz.html`; Tests
- [x] Umbau auf Merkmale (Entscheidung → Merkmal → Wirkung), Stimmungsanzeigen als Merkmale
- [x] Alle 30 Karten auf „1 historisch + 2 plausible andere Richtungen“ geprüft, 4 Optionen ersetzt
- [ ] Rob liest gegen (in `netz.html` Karte antippen)
- [x] `netz.html` übersichtlicher (drei Spalten)
- [ ] Lücken schließen: Weg „Deutschland wartet in Runde 4 trotz russischer Mobilmachung“, Varianten für Runde 5
      nach abweichendem Runde-4-Verlauf, Wirkung der Noten (z. B. „Halt in Belgrad“) auf die Karten
- [ ] Belege der Grenzen prüfen (Feld `beleg`)

### C. Framing Controls (Inhalt)
- [ ] Sammlung oben ausarbeiten und deutlich erweitern (Rob: „viel mehr“)
- [ ] Je Runde und Staat zwei bis drei Anstöße auswählen (Stimmen, Stimmung, Grenzen, Interessen-Marken)
- [ ] Stimmungsanzeigen für Serbien, Russland, Großbritannien, Österreich-Ungarn (drei Stufen, Wortbegründung)
- [ ] Ereignisse für harte Grenzen (Teilmobilmachung, Krieg nur im Osten, Angriff ohne bereite Armee)
- [ ] Folgenkarten für Abweichungen
- [ ] Rob prüft

### D. Quellen
- [ ] Szögyény-Telegramm 5.7.1914 (Auszug), Ultimatum Punkte 1, 5, 6, Grey-Zitat (Überlieferung angeben)
- [ ] Belege für Stimmen ohne Delegation (Conrad, Moltke, Sasonow u. a.), Kürzungen gekennzeichnet
- [ ] Bildnachweise in `NACHWEISE.md`

### E. Grafik
- [x] Rob gibt die Stilrichtung frei (Stilprobe)
- [ ] Flaggen 1914 als SVG
- [ ] Gemeinfreie Bilder zur Lage suchen (Claude schlägt vor, Rob wählt), `NACHWEISE.md`
- [ ] Schriften auswählen und in `shared/fonts/` ablegen
- [ ] Europakarte 1914 (SVG) mit Hauptstädten, Bündnissen, Belgien
- [ ] Siegel, Stempel, Telegramm, Akte, Kalender als Bausteine
- [ ] Tafelansicht (Laptop): große Karte, Kalender, Stand der Delegationen
- [ ] Animationen: Telegrammlinie, Verkündung, Mobilmachungskette
- [ ] Grafik-Galerie zur Abnahme (wie beim Nil)

### F. Technik
- [x] `logik.js` Teil Netz: Varianten, Lage, Grenzen, Ausgänge, Akte 1914 (mit Tests)
- [ ] `logik.js` ohne DOM, Rest: Runden, Phasen, Wellen, Merkmale, Varianten, Ausgänge, Sichtbarkeit, Kabinettsbeschluss
- [ ] Tests: jede Runde durchspielbar, Geheimes erreicht nie fremde Delegationen, immer drei Optionen,
      Kabinettsbeschluss nur bei Einigkeit, Ausgänge erreichbar
- [ ] Verbindung über `shared/sync.js` (Supabase Realtime, aufbauend auf `labor/08-klasse/`): Raumcode,
      Delegation wählen, Wiederverbinden nach Neuladen, Lehrer-Laptop als maßgeblicher Stand
- [ ] Nachrichtenmenge gegen das Kontingent prüfen (100 Nachrichten/s): nur Ereignisse, keine Dauerströme
- [ ] Simulation mit 30 Testgeräten in Node
- [ ] Notfall: Lehrkraft kann eine Wahl am Laptop eintragen

### G. Delegations-App (iPad)
- [ ] Beitreten (Raumcode, Delegation)
- [ ] Dossier, Strategieblatt, Begriffe, Europa 1914 (jederzeit erreichbar)
- [ ] Lage, Geheimakte, Posteingang
- [ ] Noten schreiben: Pflichtnote als Formular, Vorschlag halb vorgefertigt, eine freie Note pro Runde
- [ ] Prognose, Entscheidung mit Begründungsgerüst, Kabinettsbeschluss, Verkündung
- [ ] Folgenkarte, Akte 1914

### H. Lehrer-Monitor (Laptop)
- [ ] Raum öffnen, Phasensteuerung mit Timer, Stand jeder Delegation
- [ ] Verkünden je Welle, Folgen, „Was 1914 geschah“, Geheimakten
- [ ] Mitlesen aller Noten
- [ ] Auswertung „Unsere Entscheidungen und 1914“ (druckbar A4 quer)

### I. Telegramme mit Laufzeit
- [ ] Laufzeit je Strecke, verspätete Noten nach der Welle, Linie auf der Karte

### J. Karte und Ketten
- [ ] Mobilmachungs- und Bündnisketten, die niemand anhält; Kalender läuft mit

### K. Erprobung und Abschluss
- [ ] Durchlauf mit Rob (ein Laptop, mehrere Browserfenster)
- [ ] Einsatz in einer 9. Klasse, danach `DESIGN.md` nachführen
- [ ] `games.js`, README, Vorschaubild; Stand `alpha` → `beta`

Reihenfolge: B, C und E zuerst (brauchen Robs Urteil), F parallel. G und H, sobald B steht. I und J zuletzt.

## Was von Rob noch gebraucht wird
1. Entscheidungsnetz in `netz.html` gegenlesen: Stimmen die Varianten, Grenzen und Ausgangstexte?
2. Ideen für weitere Framing Controls je Staat.
3. Bilder: Soll Claude Kandidaten auf Wikimedia Commons heraussuchen?
4. Erste drei Seiten des Spielleitungsskripts (Regeln/Phasen), falls vorhanden.
