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
- **Grafik:** sehr ansprechend, wichtig.
- **Grundidee bleibt:** gelenktes Spiel in fünf Runden, keine Kämpfe, Ende mit den Kriegserklärungen Anfang August 1914.

## Das Problem aus der Erprobung
Die Optionen jeder Runde waren für den Stand von 1914 geschrieben. Wich eine Delegation ab, passten die Karten der
anderen nicht mehr (Beispiel: Deutschland rät Wien in Runde 1 zur Mäßigung – in Runde 3 heißt die Option trotzdem
„Österreich-Ungarn den Rücken stärken“). Deshalb musste nach jeder Runde auf 1914 zurückgesetzt werden, und das wirkte
wie „eure Entscheidung zählt nicht“.

## Vorschlag: Entscheidungsnetz statt fester Karten
### 1. Weltzustand aus wenigen Merkmalen
Jede Entscheidung setzt ein oder zwei **Merkmale** der Welt, z. B.:

| Merkmal | mögliche Werte (Beispiel) | gesetzt von |
|---|---|---|
| `zusage` | voll · nur diplomatisch · Mäßigung | D, Runde 1 |
| `vorgehen` | militärisch · Großmächte · gemeinsame Ermittlung | Ö-U, Runde 1 |
| `ultimatum` | unannehmbar · erfüllbar · Angriff ohne Ultimatum | Ö-U, Runde 2 |
| `uebergabe` | sofort · während · nach dem Staatsbesuch | Ö-U, Runde 2 |
| `buendnisFR` | volle Treue · nur bei Angriff · Zurückhaltung | F, Runde 2/3 |
| `antwort` | fast alles · Ablehnung · alles | SRB, Runde 3 |
| `krieg_srb` | erklärt · Konferenz · angenommen | Ö-U, Runde 3 |
| `mob_r` | allgemein · teilweise · keine | R, Runde 4 |
| `gb_haltung` | offen · Beistand F · Neutralität | GB, Runde 4 |

Die Merkmale sind **für die SuS unsichtbar** (keine Zahlen, keine Regler). Sichtbar ist nur, was daraus folgt:
Lagetext, Optionen, Telegramme.

### 2. Karten mit Varianten
- **Lage** besteht aus Bausteinen: Jeder Satz kann an Merkmale gebunden sein („Serbien hat das Ultimatum vollständig
  angenommen …“).
- **Optionen** haben Varianten mit Bedingung. Beispiel D, Runde 3, wenn `zusage` = Mäßigung:
  A wird zu „Kurswechsel: Wien jetzt doch den Rücken stärken und die Konferenz ablehnen“, Contra „Wien hat unseren
  Rat gehört – ein Kurswechsel macht uns unberechenbar.“
- Eine Option kann wegfallen oder durch eine passende ersetzt werden, es bleiben aber immer **drei**.
- Damit das beherrschbar bleibt, hängt jede Karte von **höchstens zwei bis drei Merkmalen** ab. Ein Test prüft für
  jede erreichbare Merkmalskombination, dass jede Delegation drei sinnvolle Optionen bekommt.

### 3. Ausgänge
Nicht jeder Weg führt zum 4. August. Vorgesehen sind wenige benannte Ausgänge, z. B. „Krise beigelegt“
(Konferenz oder angenommenes Ultimatum), „Krieg auf dem Balkan begrenzt“, „Großer Krieg“. Erreicht die Klasse einen
Ausgang vor Runde 5, zeigt das Spiel eine **Ausgangskarte** (vorsichtig formuliert, als Vermutung gekennzeichnet) und
geht dann – **als vorher angekündigte Regel** – in die „Akte 1914“ über: Die übrigen Runden werden vom Stand 1914 aus
gespielt. Das Zurücksetzen passiert also höchstens einmal, an einer klar erkennbaren Stelle, und der abweichende Weg
bleibt in der Auswertung sichtbar.

**Offen für Rob:** Ist dieser eine angekündigte Übergang akzeptabel, oder soll ein früher Ausgang das Spiel beenden
(dann Restzeit für Reflexion)?

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
Richtung „Kabinettstisch 1914“: dunkelgrüner Tisch, Papierakten, roter Stempel „Geheim“, Telegrammstreifen,
Siegel der Delegation, Kalenderband 28. Juni – 4. August. Eigene Grafik, keine Vorlagen aus anderen Spielen.
Geplant: Europakarte 1914 als eigene SVG-Zeichnung, Telegrammlinien zwischen Hauptstädten, Mobilmachungsketten als
Animation, Siegel je Staat (stilisiert, keine echten Hoheitszeichen), passende Schriften (OFL) in `shared/fonts/`.

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
- [ ] Merkmale festlegen (Liste oben) und je Option eintragen, welche Merkmale sie setzt
- [ ] Je Runde und Staat: Welche Merkmale ändern Lage und Optionen? Varianten schreiben
- [ ] Ausgänge festlegen und Ausgangskarten schreiben
- [ ] Prüfwerkzeug: alle erreichbaren Kombinationen durchspielen, Tabelle „was sieht wer wann“ zum Gegenlesen
- [ ] Rob liest gegen

### C. Framing Controls (Inhalt)
- [ ] Je Runde und Staat ein bis zwei Anstöße auswählen (Stimmen, Stimmung, Grenzen, Interessen-Marken)
- [ ] Stimmungsanzeigen für Serbien, Russland, Großbritannien, Österreich-Ungarn (drei Stufen, Wortbegründung)
- [ ] Ereignisse für harte Grenzen (Teilmobilmachung, Krieg nur im Osten, Angriff ohne bereite Armee)
- [ ] Folgenkarten für Abweichungen
- [ ] Rob prüft

### D. Quellen
- [ ] Szögyény-Telegramm 5.7.1914 (Auszug), Ultimatum Punkte 1, 5, 6, Grey-Zitat (Überlieferung angeben)
- [ ] Belege für Stimmen ohne Delegation (Conrad, Moltke, Sasonow u. a.), Kürzungen gekennzeichnet
- [ ] Bildnachweise in `NACHWEISE.md`

### E. Grafik
- [ ] Rob gibt die Stilrichtung frei (Stilprobe)
- [ ] Schriften auswählen und in `shared/fonts/` ablegen
- [ ] Europakarte 1914 (SVG) mit Hauptstädten, Bündnissen, Belgien
- [ ] Siegel, Stempel, Telegramm, Akte, Kalender als Bausteine
- [ ] Tafelansicht (Laptop): große Karte, Kalender, Stand der Delegationen
- [ ] Animationen: Telegrammlinie, Verkündung, Mobilmachungskette
- [ ] Grafik-Galerie zur Abnahme (wie beim Nil)

### F. Technik
- [ ] `logik.js` ohne DOM: Runden, Phasen, Wellen, Merkmale, Varianten, Ausgänge, Sichtbarkeit, Kabinettsbeschluss
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
1. Entscheidungsnetz: Merkmale und Ausgänge so in Ordnung? Ein angekündigter Übergang in die „Akte 1914“ oder
   Spielende beim frühen Ausgang?
2. Framing Controls: eigene Ideen je Staat (wie Serbien/Wahlkampf), und ob Stimmungsanzeigen in drei Stufen passen.
3. Stilprobe: Richtung ja/nein, was fehlt.
4. Freitext in Noten: wie lang höchstens?
5. Prüfen, ob `content.js` mit den PDFs übereinstimmt (es fehlen die ersten drei Seiten des Spielleitungsskripts,
   die Regeln/Phasen – bei Bedarf nachreichen).
