# Im Rhythmus des Nils – Design-Entscheidungen

**Stand:** Version 0.6 spielbar (10.10.2026). Grafik von Rob abgenommen (`galerie.html`). Ältere Versionen bleiben spielbar:
`im-rhythmus-des-nils-v0.1/` bis `-v0.5/` (Branches `archiv/nil-v0.1` bis `archiv/nil-v0.5`).

## Neu in 0.6 (Robs Rückmeldung vom 10.10.2026)
- **Balken repariert.** Fehler in 0.5: Der goldene Teil zeigte „Kraft minus alles, was begonnene Felder noch brauchen“.
  Beim Beginnen eines Feldes sprang er deshalb stark zurück, bei den nächsten Schritten blieb er stehen, und zwischen
  Schaduf und Aussaat schien er sich wieder zu füllen. Jetzt zeigt die Länge linear genau die verbleibende Arbeitskraft.
  Der schraffierte Teil am Ende ist nur die Kraft für die Ernte der Felder, die in diesem Jahr noch geerntet werden.
- **Berufswahl:** Alle vier Berufe sind von Anfang an zu sehen; nach der Wahl ist der eigene markiert.
- **Verlieren nach Option C (Rob):**
  - Hunger schwächt: Je Sack, der im Vorjahr fehlte, startet das nächste Jahr mit weniger Arbeitskraft
    (`NUM.hungerSchwaeche`). Der Balken ist dann von Anfang an kürzer, mit Hinweis beim Sirius.
  - Schwerer Hunger kostet den Hof: Fehlen in Jahr 2 mindestens `NUM.hofVerlassen` (4) Säcke, muss die Familie den Hof
    verlassen. Mit den jetzigen Zahlen nur ohne Schaduf und mit höchstens einem Korb in Jahr 1. Danach geht es nur mit
    „Noch einmal ab der Trockenzeit in Jahr 1“ weiter (kein Überspringen, damit Jahr 3 und 4 nicht fehlen).
  - Geschwächt in Jahr 3: Die Felder gehen sich noch aus, für den Deich und Körbe bleibt weniger oder nichts
    („Die Nachbarn bessern den Deich für euch mit aus“). Am Ende von Jahr 4 fehlt dann ein Sack.

## Neu in 0.5 (Robs Entscheidungen vom 10.10.2026) – Stand vor 0.6
- **Arbeitskraft als Balken ohne Zahlen** (Rob: 0.4 war „zu excelig“). Der Balken leert sich mit jeder Arbeit;
  der schraffierte Teil mit Sichel ist für die Ernte reserviert. Die Werte stehen nur in `content.js` (`NUM.kraft`,
  `NUM.kosten`), im Spiel und in der Bilanz erscheinen keine Kraft-Zahlen (Bilanz: gestapelter Balken je Jahr).
  Begriff „Arbeitskraft“; „Zeit“ als Alternative im Hinterkopf behalten (Rob).
- **Das Dorf entsteht automatisch** nach der Ernte in Jahr 2 („Die Familien beraten“). Weggefallen: Entscheidung
  Dorf/allein, Erdwall, zerstörter Hof, Wiederaufbau, Nachholen von Deich-Arbeit, Verlieren.
- **Dorfbau in einem Durchgang:** Deich (2 Gesten), Häuser (2), Dorfspeicher bauen und füllen (1). Die Familie arbeitet
  mit, bis ihre Arbeitskraft für das Jahr aufgebraucht ist; die übrige Kraft wird gleichmäßig auf die Gesten verteilt.
  Wer viel geschöpft hat, trägt weniger bei – „die anderen gleichen das aus“. Das Dorf wird immer fertig.
- **Beitrag zum Dorfspeicher** nur, wenn Getreide übrig ist (mit 6 Eimern: 1 Sack; ohne Schaduf oder mit 3 Eimern: nichts,
  eigener Text).
- **Trockenzeiten:** J1 Körbe (Rob: zeigt, dass die Menschen in der Trockenzeit anderen Arbeiten nachgehen), J2 Dorfbau,
  J3 Deich ausbessern (Pflicht) und Körbe, J4 Körbe. Tausch nur nicht nach der schlechten Flut in J2.
- **Berufe am Anfang von Jahr 4** (Achet, Felder unter Wasser): Die Flut ist gut, eine gute Ernte ist zu erwarten.
  Die Familien beraten, was im letzten Jahr viel Arbeitskraft gekostet hat; die Beschreibung jedes Berufs knüpft
  daran an. Jahr 3 endet mit „Gemeinsam überstanden“. (Rob testet, ob sich das logisch anfühlt.)
- Korrekturen: Ernte immer mit derselben Figur; Getreide in J3 bei der Ernte reif; vor der Berufswahl zeigt das Dorf
  noch keine Berufe.
- Zahlen (versteckt): Arbeitskraft 48; Feld = Grenzstein 3, pflügen 4, säen 2, ernten 4 (Kupfersichel 1);
  nach dem Hochwasser Grenze 4; Schaduf 4, Eimer 2; Korb 3; Deich ausbessern 2.
  Ergebnis: J1 3 Körbe; J2 ohne Schaduf Hunger (2 Säcke fehlen), mit 3 Eimern gerade so, mit 6 Eimern gerade so + 1 Sack
  Beitrag; J3 Dorfspeicher hilft bzw. gerade so; J4 mit jedem Beruf 9 Säcke am Ende (ohne Beruf wären es 6).

## Neu in 0.4 (Robs Entscheidungen vom 9.10.2026) – Stand vor 0.5
- **Arbeitskraft als knappe Größe.** Die Familie hat pro Jahr 22 Kraft (Anzeige als Kästchen: verbraucht – noch
  nötig – frei). Jede Arbeit kostet Kraft. Ein Feld kann man nur anfangen, wenn die Kraft bis zur Ernte reicht.
  Übrige Kraft wird in der Trockenzeit eingesetzt. Ziel: Die Arbeit der Menschen wird sichtbar („Der Nil schenkt
  Wasser und Schlamm, aber nicht die Arbeit“).
- **Gesten statt Tippen, ohne Zeitdruck** (Rob: „Quicktimeevent war ungeschickt gewählt, kein Zeitdruck“).
  Grenzstein aufrichten = nach oben wischen · pflügen = Gespann über das Feld ziehen · säen = hin und her wischen ·
  ernten = mit der Sichel durch die Halme wischen · Schaduf = am Seil ziehen und loslassen · Deich/Erdwall/Haus =
  Korb vom Haufen ans Ziel ziehen · Körbe flechten = Zickzack. Abbrechen ist erlaubt, der Fortschritt bleibt.
  Antippen zeigt nur einen Hinweis. Tastatur: Enter erledigt die Arbeit (Barrierefreiheit). Code: `gesture.js`.
- **Kein Fischfang** (Rob: führt vom Lernziel weg). Die einzige allgemeine Verwendung übriger Kraft ist
  „Körbe flechten und tauschen“ (Schilf vom Nilufer, 1 Kraft → 1 Sack) – und das nur in guten Jahren (J1, J4),
  denn nach schlechten Fluten hat niemand Getreide zum Tauschen. Daneben: Erdwall, Deich.
- **Schaduf kostet Kraft statt Getreide** (Bau 2, jeder Eimer 1). Weniger Eimer sind jetzt eine echte Wahl:
  Kraft, die man in J2 schöpft, fehlt in der Trockenzeit für Deich oder Erdwall.
- **Dorf kostet Kraft für den Deich** (Rob). Ins Dorf: 4 Kraft am Deich + 1 Sack Beitrag. Fehlt Kraft, wird sie im
  nächsten Jahr nachgeholt (in der Trockenzeit, vor allem anderen). Im Dorf in J3: Deich ausbessern (1 Kraft).
  Allein: Nur ein **fertiger** Erdwall (4 Kraft, über J1 und J2 baubar) schützt Haus und Vorrat. Ohne ihn zerstört das
  Hochwasser den Hof; der Wiederaufbau kostet 8 Kraft – dann reicht es nur noch für zwei Felder.
- **Jahr 3 ohne Landvermesser** (Rob: Arbeitsteilung erst am Ende): Nach dem Hochwasser sind alle Grenzsteine fort,
  man streitet mit den Nachbarn und misst selbst nach (2 Kraft je Feld, Geste: Messseil ziehen). Das erlebte Problem
  begründet den Beruf.
- **Jahr 4, normale Flut wie in Jahr 1.** Jede Familie im Dorf stellt **einen** Beruf, der **einen** Vorteil bringt;
  alle Vorteile sind gleich groß (+3), damit der Klassenvergleich offen bleibt:

| Beruf | Vorteil in Jahr 4 | sichtbar als |
|---|---|---|
| Töpfer | Krüge aus Nilschlamm werden beim Händler gegen 3 Säcke Getreide getauscht | Töpfer, Buchung im Speicher |
| Weberin | Leinen gegen Kupfersicheln: Ernten kostet 1 statt 2 Kraft je Feld (3 Kraft frei → 3 Körbe) | Kupfersichel bei der Ernte |
| Landvermesser | misst nach der Flut alles aus, setzt die Grenzsteine: 0 statt 3 Kraft (3 Kraft frei) | Seilspanner am Feld, Steine stehen schon |
| Speicherverwalter | misst, schreibt auf, verteilt gerecht, hält den Speicher bereit; dafür Lohn aus dem Dorfspeicher: 3 Säcke | Verwalter mit Messgefäß, Buchung „Lohn“ |

  Landvermesser **ohne** Kanalbau (Rob: Grenzsteine und weniger Chaos reichen). Speicherverwalter: Deutung als
  bezahlte Verwaltungsarbeit (Umverteilung aus dem Speicher) – zur Abnahme durch Rob. Allein gibt es keinen Beruf.
- **Kleine Korrekturen:** J3-Flut steigt über vier Monate sichtbar über die Marke „gut“; J2 (und alle Jahre) wachsen
  Monat für Monat; die hackende Person steht auf einem bestellten Feld; nicht bestellte Felder zeigen keine Pflanzen;
  Landvermesser neu gezeichnet: **eine** Person spannt das geknotete Messseil vom Pflock aus, daneben der Grenzstein.
- **Bilanz:** Tabelle über alle vier Jahre (Ernte, Kraft für Felder/Schaduf/Schutz/Körbe, Hilfe, Ergebnis, Vorrat)
  und der Vergleich Jahr 1 – Jahr 4 (gleiche Flut, Unterschied = Beruf).
- Neue Merksätze: „kraft“ (nach der ersten Ernte), „teilung“ (Arbeitsteilung, Trockenzeit J4).

### Wege durch das Spiel (Zahlen aus `content.js`, geprüft mit `simulate()` in den Tests)
J1: Felder 18 Kraft, 4 frei → Körbe (+4) oder Erdwall. Ernte 12, Bedarf 10.
J2: Uferfeld 3 Säcke; mittleres Feld mit Schaduf 2 (3 Eimer) bzw. 4 (6 Eimer). Felder + Schaduf voll = 19 Kraft.

| J1 | Schaduf | Dorf/allein | J2 | J3 | Ende |
|---|---|---|---|---|---|
| Körbe | kein | Dorf | Hunger | geholfen | J4: 9 Säcke |
| Körbe | 3 Eimer | allein + Erdwall in J2 | knapp | knapp (Wall hält) | J4: 6 |
| Körbe | 6 Eimer | allein (Wall wird nicht fertig) | knapp | Hof zerstört, Hunger | J4: 6 |
| Körbe | 6 Eimer | Dorf | knapp, Deich 1 Kraft nachholen | knapp | J4: 9 |
| halber Wall | 6 Eimer | allein + Wall fertig | knapp | knapp | J4: 6 |
| ganzer Wall | jede | allein | Hunger | Hunger → **Hof verlassen** | – |

Im Dorf hungert in J3 niemand. Allein überlebt nur, wer vorgesorgt hat (Erdwall **und** Vorrat).
Jahr 4: Dorf mit Beruf 8–9 Säcke, allein 6.

## Neu in 0.3 (Robs Rückmeldung zu 0.2) – Stand vor 0.4
- **Mehr echte Entscheidungen**, alle als Karte mit zwei Möglichkeiten; Getreide ist die einzige mitlaufende Größe:

| Wann | Entscheidung | Kosten | Folge |
|---|---|---|---|
| J1 Brache | Krüge tauschen (+3) oder Erdwall | Zeit | Krüge helfen in J2; Wall nur, wenn man in J3 allein bleibt (Haus bleibt stehen, Vorrat halb) |
| J2 Peret | Schaduf bauen oder nicht | 1 Sack, dann Eimer schöpfen | mittleres Feld trägt (2 bei 6 Eimern, 1 bei 3) |
| J2 Brache | Ins Dorf oder allein bleiben | Dorf: 1 Sack + Arbeit am Deich | J3: im Dorf hält der Deich, der Speicher hilft; allein: Hof/Vorrat zerstört, keine Hilfe |
| J3 Brache | Neuer Beruf (nur im Dorf) | 1 Person weniger auf dem Feld | Arbeitsteilung; allein nicht möglich |

- Die Dorfgründung ist damit doch eine Entscheidung (Rob, 9.10.: „genau so bauen“).
- **Verlieren:** zwei Hungerjahre hintereinander → „Deine Familie muss den Hof verlassen“ mit Gründen; danach
  „Noch einmal ab ‚Ins Dorf oder allein?‘“ oder trotzdem weiter zur Bilanz.
- **Zahlen:** Start mit leerem Speicher; jede Änderung wird im Speicher sichtbar verbucht (letzte vier Buchungen).
  Bedarf 10; J1 3 × 4; J2 Uferfeld 4, mittleres Feld 0/1/2; J3 3 × 2; Dorfspeicher hilft bis 8.
  J2 reicht nur mit Krügen + Schaduf + 6 Eimern gerade so; sonst Hunger. Im Dorf hungert in J3 niemand, allein immer.
- **Jahr 2, Achet** in vier Klicks: Die Familie wartet Monat für Monat, das Wasser bleibt unter der Marke.
- **Familie mit Schalen:** vier Figuren mit je einer Schale, „Deine Familie: 4 Personen“.
- **Kein Doppeltipp-Zoom** (Ursache des „Zoom-Effekts“ am Schaduf).
- **Quellenarbeit:** Aussagen zufällig gemischt; per Ziehen oder Antippen an die passende Stelle im Lied bzw. in das
  Feld „Steht nicht im Lied – das zeigt nur mein Spiel“. Falsche Zuordnung → Tipp, Karte bleibt liegen.

**Fach / Gruppe:** Geschichte, Klasse 6 (Pilot: 6e) · **Sozialform:** Einzelarbeit, ein iPad pro Person
**Leitfrage:** Das alte Ägypten – ein Geschenk des Nils?
**Kompetenz:** SK – den Einfluss naturgegebener Voraussetzungen auf die Entstehung der Hochkultur Ägyptens erklären;
UK3 – historisches Handeln unter Berücksichtigung von Handlungsspielräumen beurteilen; Quelle und eigene Erfahrung unterscheiden
**Platz in der Reihe:** ersetzt Forum Geschichte 6, S. 44–45 („Das alte Ägypten – ein Geschenk des Nils?“).
**Dauer:** Ziel 15–20 Min. (vier Jahre), höchstens 25 Min. – beim Test mit der 6e messen · Bedienoberfläche auf Deutsch

## Warum Version 0.2
Robs Rückmeldung zu 0.1: Grafik zu abstrakt (Schaduf nur als Wort), Ablauf bis zur Quellenarbeit zu verschachtelt –
die Kinder lösen ein Verteilungsrätsel (6 Felder, 4 Personen, 8 Orte) statt den Rhythmus des Nils zu erleben.
Zeit ist nicht spürbar, Deutungen werden nicht gesichert, das Dorf ist Nebensache statt Antwort auf ein Problem.

## Sachwissen am Ende (von Rob festgelegt)
1. Der Nil steigt vier Monate lang deutlich an.
2. Danach bleibt fruchtbarer Schlamm zurück; er wird untergepflügt, es wird gesät (vereinfacht: Getreide),
   vier Monate später wird geerntet.
3. Danach liegen die Felder vier Monate brach; man widmet sich anderen Aufgaben.
4. Dieser Rhythmus führte zum Kalender: drei Jahreszeiten zu je vier Monaten.
5. Die Flut war unsicher: zu stark → Zerstörung, zu schwach → Versorgungsprobleme.
6. Als Antwort entstanden Dörfer: Schutz vor Überflutung; Vorräte anlegen und verteilen; daraus Arbeitsteilung
   und neue Berufe.

## Spielprinzip
Querschnitt durch das Niltal: links der Nil mit Nilmesser, nach rechts ansteigend drei Felder (Ufer, Mitte, oben),
dann der Hof bzw. später das Dorf, dahinter die Wüste. Wasserstand, Schlamm, Pflanzen und Vorräte sind direkt sichtbar.
Drei Jahre, drei Lernschritte:

| Jahr | Flut | Lernschritt |
|---|---|---|
| 1 | normal | **Rhythmus** – Flut, Schlamm, Aussaat, Ernte, Brache; der Kalender entsteht |
| 2 | **zu niedrig** | **Unsicherheit, allein** – Felder bleiben trocken, Schaduf als mühsame Hilfe, Hunger |
| 3 | **zu hoch** | **Das Dorf als Antwort** – Deich hält, Speicher verteilt, neue Berufe |

**Kein Zufall** (Rob, 9.10.): Alle Kinder spielen dieselbe Abfolge. Begründung der Reihenfolge: Jahr 2 zeigt die
schleichende Gefahr (Hunger), die die Familie allein nicht auffangen kann; Jahr 3 zeigt die dramatische Gefahr
(Zerstörung) – und dass das Dorf beides auffängt: Der Deich schützt vor dem Hochwasser, der Speicher gleicht die späte,
kleine Ernte aus. So wird jede Antwort des Dorfes an einer erlebten Gefahr geprüft.

## Merksätze (Papyrusrolle)
Jeder Punkt des Sachwissens wird an einer festen Stelle erlebt; danach erscheint ein Merksatz und wird auf einer
Papyrusrolle gesammelt (jederzeit aufrufbar, in der Bilanz vollständig). Die Rolle ersetzt verstreute Rückmeldungen.

| Sachwissen | erlebt in | Merksatz (Entwurf) |
|---|---|---|
| 1 | J1 Achet: Monat für Monat steigt das Wasser am Nilmesser, ein Feld nach dem anderen verschwindet | „Vier Monate lang steigt der Nil und überschwemmt das Land.“ |
| 2 | J1 Peret: Wasser sinkt, Schlamm glänzt; Pflügen (Ochsengespann), Säen, vier Wachstumsstufen, Ernte | „Zurück bleibt fruchtbarer Schlamm. Er wird untergepflügt und es wird gesät. Vier Monate später wird geerntet.“ |
| 3 | J1 Schemu: Felder reißen auf; Entscheidung 1 (was tut die Familie jetzt?) | „Danach liegen die Felder brach. Die Menschen erledigen andere Arbeiten.“ |
| 4 | Kalenderband: 12 leere Monatsfelder; jeder Block erhält seinen Namen, wenn er erlebt wurde; Sirius eröffnet das Jahr | „Nach diesem Rhythmus teilten die Ägypter ihr Jahr in drei Jahreszeiten zu je vier Monaten.“ |
| 5a | J2: Pegel bleibt unter der Marke, obere Felder trocken | „Steigt der Nil zu wenig, bleiben Felder trocken. Dann droht Hunger.“ |
| 5b | J3: Pegel steigt über die Marke | „Steigt der Nil zu hoch, zerstört das Wasser Häuser, Vorräte und Felder.“ |
| 6a | J2 Brache: Dorfgründung, Deich wird gemeinsam gebaut; J3: Deich hält | „Gemeinsam bauen die Menschen Dörfer und Deiche und schützen sich vor dem Hochwasser.“ |
| 6b | J3: Speicher versorgt alle Familien nach der späten Ernte | „Im Dorf werden Vorräte angelegt und verteilt.“ |
| 6c | J3 Brache: Berufe | „Einige Menschen müssen nicht mehr auf dem Feld arbeiten. Es entstehen neue Berufe.“ |

Berufe werden immer mit dem Bedarf des Dorfes begründet (Töpfer: Vorratskrüge; Landvermesser: Feldgrenzen nach der Flut;
Speicherverwalter: Getreide messen und ausgeben; Weberin: Leinen) – keine Gleichung „mehr Getreide = mehr Berufe“.

## Ablauf (umgesetzt in 0.2, Zielzeit 17–19 Min., noch nicht gemessen)
1. **Start** (½ Min.): Leitfrage, die Familie, der Hof am Nil.
2. **Jahr 1 – ein normales Jahr** (5–6 Min.), Monat für Monat:
   Sirius → Achet (4 Tipps, Wasser steigt bis über alle drei Felder, Hof bleibt trocken) →
   Peret (Wasser sinkt, Schlamm; Pflügen und Säen per Tipp; 4 Wachstumsstufen) →
   Schemu (Ernte im 1. Monat, Säcke in den Kuppelspeicher am Hof; danach Brache).
   **Entscheidung 1** (allein, Brache): Krüge töpfern und gegen Getreide tauschen (mehr Vorrat)
   oder einen Erdwall um den Hof aufschütten (Schutz vor Hochwasser).
3. **Jahr 2 – allein, Flut zu niedrig** (3–4 Min.), ein Tipp pro Jahreszeit:
   Pegel bleibt tief, nur das Uferfeld wird überschwemmt. Ein Nachbar zeigt den **Schaduf** (Innovation): Mit ihm
   heben die Kinder Eimer für Eimer Wasser aus dem Restwasser am Ufer auf das mittlere Feld – mühsam, aber es rettet
   das Feld. Das obere Feld liegt zu hoch und vertrocknet. Kleine Ernte, Vorrat wird aufgebraucht, die Familie hungert;
   den Nachbarn geht es genauso. Folge von Entscheidung 1: Tauschgetreide hilft; der Erdwall nützt in diesem Jahr nichts.
   Brache: Die Familien schließen sich zusammen und **bauen gemeinsam** Deich, Kornspeicher und Häuser (antippen, die
   Nachbarn bauen mit; „Allein hätte das Jahre gedauert“). Die Alten zeigen am Nilmesser die Marke einer großen Flut.
4. **Jahr 3 – im Dorf, Flut zu hoch** (3 Min.):
   Wasser steigt bis an die Deichkrone; gestrichelt ist zu sehen, wo es ohne Deich stünde. Was außerhalb lag
   (Feldhütte, Schaduf, Grenzsteine) ist zerstört. Späte Aussaat, kleine Ernte, der Landvermesser misst die Felder neu
   aus, der Speicher verteilt – niemand hungert. Ein Teil der Ernte geht wieder in den Speicher.
   **Entscheidung 2** (Brache): Ein Familienmitglied übernimmt einen neuen Beruf (Töpfer, Weberin, Landvermesser,
   Speicherverwalter); das Dorfbild zeigt die Folge.
5. **Bilanz** (1 Min.): Papyrusrolle mit allen Merksätzen; Jahr 2 („allein“) und Jahr 3 („im Dorf“) nebeneinander.
6. **Quellencheck M3, Satzgeländer, Denkanstoß** wie in 0.1; zusätzliche Aussage „Die Menschen schließen sich zu
   Dörfern zusammen“ (steht nicht im Lied).

Kürzen, falls zu lang: zuerst Peret in Jahr 1 auf 3 Tipps, nie die Quellenarbeit.

## Festgelegte Entscheidungen
- **Reflexion im Spiel (Ausnahme von der Grundregel):** Bilanz, Quellencheck und Satzgeländer gehören ins Spiel.
  **Keine Tastatureingabe:** Das Urteil wird im Heft formuliert.
- **Dekonstruktion:** im Unterrichtsgespräch. Im Spiel nur ein Impuls für Schnelle mit Denkanstößen zum Aufklappen.
  Neu: „Im Spiel entsteht das Dorf in einem Jahr – wie lange hat das wirklich gedauert?“ und „Den Schaduf gab es in
  Ägypten erst viel später als die ersten Dörfer (etwa ab 2000 v. Chr., Angabe Rob). Warum zeigt ihn das Spiel trotzdem?“
- **Kalender:** Achet (Überschwemmung) · Peret (Aussaat und Wachstum) · **Schemu (Ernte und Trockenzeit)** – Ernte im
  ersten Monat von Schemu, danach Brache. Ägyptischer Name oben, deutsche Übersetzung direkt darunter.
- **Schaduf bleibt** (Rob): zeigt die Innovation; als Gerät im Profil gezeichnet, bei der Arbeit animiert.
- **Getreide** als Füllstand im aufgeschnittenen Kuppelspeicher und als Schalen der Familie (voll / halb / leer),
  kein Sackrechnen. Zahlen nur intern in `content.js`.
- **Familie:** vier Figuren ohne feste Geschlechterrollen; alle arbeiten auf dem Feld.
- **Kein Staat, keine Abgaben.** Kein Saatgut-Posten. Kein endgültiges Scheitern.
- **Grafik:** eigene SVGs, einheitlicher flächiger Stil, Querschnitt; Abnahme über `galerie.html`, bevor das Gameplay
  gebaut wird. Canva oder externe Bilder nur im Notfall (Rob).
- **Pause** jederzeit; Zustand nur in `sessionStorage`.
- **Querformat** (Rob): Das Spiel wird auf dem iPad quer gespielt. Oben Kalenderband, darunter die Szene, unten
  Text links und Knöpfe, Vorrat und neue Merksätze rechts. Hochkant funktioniert es auch, mit Hinweis „quer halten“.
- **Berufe** in einer eigenen Nahansicht des Dorfes (nicht auf den Feldern).
- **Dorfgründung** ist gemeinsames Bauen, keine Entscheidung (Rob bestätigt) – so lernen alle dasselbe über Schutz und Vorräte.
- **Schaduf-Datierung** im Denkanstoß: in Ägypten etwa ab 2000 v. Chr. (Angabe Rob).
- **Zahlen 0.2** (`content.js`, `NUM`): Bedarf 10 Säcke/Jahr; Jahr 1: 3 × 4 = 12; Jahr 2: Uferfeld 3, mittleres Feld
  mit Schaduf 2 (6 Eimer) bzw. 1 (3 Eimer), oberes 0; Krüge bringen 2 Säcke; Jahr 3: 3 × 2 (späte Aussaat),
  Dorfspeicher 8. Folge: Jahr 2 reicht nur mit Krügen **und** vollem Schaduf gerade so (Vorrat danach leer), sonst
  Hunger; Jahr 3 versorgt der Dorfspeicher alle. Getestet in `tests/im-rhythmus-des-nils.test.js`.

## Quelle M3 (Nilhymnus)
Ägyptisches Lied über den Nil, 2. Jahrtausend v. Chr. Im Schulbuch nach Jan Assmann (1975) – **diese Übersetzung wird
nicht verwendet** (urheberrechtlich geschützt, Repo ist öffentlich). Verwendet wird eine gemeinfreie oder offen lizenzierte
Übersetzung (Erman 1923 oder Thesaurus Linguae Aegyptiae), Kürzungen mit […] gekennzeichnet, mit vollständiger Angabe.
**Bis dahin steht in `content.js` ein deutlich markierter Platzhalter.**

| Block | Z. | Funktion |
|---|---|---|
| Begrüßung, „Ägypten am Leben erhalten“ | 1–2 | Nil als Lebensgrundlage |
| Gerste und Bohnen | 4–5 | Abgleich mit der eigenen Ernte |
| „faul“ → Armut, Krankheit | 6–9 | Quelle nennt selbst die Gefahr einer schwachen Flut |
| „kommt zu seiner Zeit“ | 10–11 | Regelmäßigkeit, Rhythmus |
| „Man opfert dir … Komm nach Ägypten!“ | 15–17 | Perspektive: Gebet an einen Gott |

Quellencheck: **Sagt die Quelle** (Leben, Nahrung, Regelmäßigkeit, Not bei schwacher Flut) ·
**Zeigt mein Spiel** (Arbeit, Schaduf, Deich, Speicher, Dorf) · **Belegt die Quelle nicht** (Arbeit der Menschen,
Gefahr einer zu hohen Flut).

## Abdeckung des Verfassertexts S. 44–45
| Inhalt im Buch | im Spiel |
|---|---|
| Nilschwemme, Schlamm, fruchtbares Land | J1 Achet/Peret |
| Anbau, Land liegt brach | J1 Peret/Schemu |
| Kalender, Sirius | Kalenderband, Sirius zu Jahresbeginn |
| Flut zu hoch / zu niedrig, Hungersnot | J2, J3 |
| Deiche, Dämme als Gemeinschaftsarbeit | J2 Trockenzeit (Deich kostet Kraft), J3 |
| Schaduf (M2) | J2 |
| Vorräte in Speichern für schlechte Jahre | J1–J3 |
| Arbeitsteilung, Handwerk, Landvermesser | J3 Streit um Grenzen, Berufswahl; J4 Vorteile der Berufe |
| Händler (Tausch) | J4: Krüge gegen Getreide, Leinen gegen Kupfersicheln |
| Tempel- und Pyramidenbau, Mathematiker | nicht im Spiel – Unterrichtsgespräch bzw. Stationen |

## Offen
- 0.5 im Test mit der 6e prüfen (Berufe am Anfang von Jahr 4 logisch?). Aus 0.4 weiterhin: Spieldauer mit vier Jahren und Gesten; werden die Gesten verstanden (Hinweis „So geht's“)?
  Wird anders entschieden, wird verloren, hilft die Wiederholung? Funktionieren die Gesten auf den Schul-iPads (Safari)?
- Speicherverwalter: Deutung „Lohn aus dem Dorfspeicher“ von Rob abnehmen lassen.
- Übersetzung von M3 beschaffen und den Platzhalter ersetzen.
- Werte nach dem ersten Test anpassen; Spieldauer messen.
