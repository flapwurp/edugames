# Im Rhythmus des Nils – Design-Entscheidungen

**Fach / Gruppe:** Geschichte, Klasse 6 (Pilot: 6e) · **Sozialform:** Einzelarbeit, ein iPad pro Person
**Leitfrage:** Das alte Ägypten – ein Geschenk des Nils?
**Kompetenz:** SK – den Einfluss naturgegebener Voraussetzungen auf die Entstehung der Hochkultur Ägyptens erklären;
UK3 – historisches Handeln unter Berücksichtigung von Handlungsspielräumen beurteilen; Quelle und eigene Erfahrung unterscheiden
**Platz in der Reihe:** ersetzt Forum Geschichte 6, S. 44–45 („Das alte Ägypten – ein Geschenk des Nils?“). Was dort im
Verfassertext steht, erfahren die SuS im Spiel selbst (siehe Abdeckung unten).
**Dauer:** Ziel 15–18 Min., höchstens 20 Min. · Bedienoberfläche auf Deutsch

Ausgangskonzept: Robs Projektinstruktionen „Im Rhythmus des Nils“ (Okt. 2026). Diese Datei hält fest, was davon gilt
und was seither entschieden wurde.

## Spielprinzip
Die SuS führen einen kleinen Bauernhof am Nil durch **zwei Jahre**. Jedes Jahr läuft im ägyptischen Kalender ab:
Sirius erscheint → Überschwemmung → Aussaat und Wachstum → Ernte. Sie entscheiden, welche Felder sie bestellen,
wo die Familie arbeitet, wohin die Ernte geht und ob sie Leute für die Gemeinschaftsarbeit des Dorfes schicken.
Am Ende stehen eine Bilanz, ein Quellencheck mit M3 und ein Satzgeländer. Das Urteil schreiben die SuS ins Heft.

Struktur jeder Entscheidung: Entscheidung → sichtbare Folge auf der Spielfläche → kurze Deutung → Anpassung im nächsten Jahr.

## Festgelegte Entscheidungen
- **Reflexion im Spiel (Ausnahme von der Grundregel):** Bilanz, Quellencheck und Satzgeländer gehören hier ins Spiel.
  **Keine Tastatureingabe:** Das Spiel liefert Bilanz und Satzgeländer; das Urteil wird im Heft formuliert.
- **Dekonstruktion:** im Unterrichtsgespräch danach. Im Spiel nur ein Impuls für Schnelle auf dem letzten Bildschirm:
  „Das Spiel ist eine Darstellung von heute. Was war damals wohl anders als im Spiel?“ mit 2–3 Denkanstößen zum
  Aufklappen (z. B. „Wer bestimmte, wie viel Land eine Familie hatte?“), ohne Eingabefeld.
- **Zwei Jahre.** Jahr 1: Flut für alle **„gut“**. Jahr 2: **begrenzter Zufall** – „zu niedrig“ oder „zu hoch“.
  Jedes Kind erlebt ein Problem, aber nicht alle dasselbe (Anlass fürs Unterrichtsgespräch). Zufall über
  `shared/random.js` aus einem Startcode, nicht `Math.random()`; der Code steht klein auf der Bilanz.
- **Arbeitskraft = Familienmitglieder** (4 Figuren), die man Feldern, Graben oder Schaduf zuteilt – keine Punkte.
- **Ressourcen:** Wasser/Wasserzugang, Arbeitskraft, Getreide. Getreide wird in Säcken angezeigt, ohne Kilo- oder
  Mengenangaben, die Genauigkeit vortäuschen. Alle Werte stehen in `content.js` und sind vorläufig (Test).
- **Kornspeicher in Phase 3:** Der Überschuss geht in den eigenen Vorrat oder in den Dorfspeicher.
- **Phase 4 = Gemeinschaftsarbeit an Deich und Hauptkanal** (eine Entscheidung). Berufe erscheinen als sichtbare Folge
  im Dorfbild, nie als Zähler. Keine Gleichung „mehr Getreide = mehr Berufe“.
- **Kein Staat, keine Abgaben** (gehört zu den Stationen „Pharao“ und „Schrift“; ggf. eigenes Nil-Schreiber-Spiel).
- **Kalender und Sirius werden abgebildet:** Jahreszeitenleiste oben (Überschwemmung · Aussaat und Wachstum · Ernte);
  jedes Jahr beginnt mit dem Sirius am Morgenhimmel.
- **Kein endgültiges Scheitern.** Eine schlechte Ernte hat Folgen (Hunger, Hilfe aus dem Speicher), das Spiel geht weiter.
- **Wortschatz von S. 45** (Wasserstand steigt/sinkt, Feld wird überschwemmt, Wasser schöpfen, pflügen/bewässern,
  Aussaat, ernten, brach liegen, Vorräte speichern, Überschuss erwirtschaften) taucht in Rückmeldungen und im
  Satzgeländer auf und ist jederzeit über „Begriffe“ erreichbar.
- **Pause** jederzeit; Zustand nur in `sessionStorage`.

## Quelle M3 (Nilhymnus)
Ägyptisches Lied über den Nil, 2. Jahrtausend v. Chr. Im Schulbuch nach Jan Assmann (1975) – **diese Übersetzung wird
nicht verwendet** (urheberrechtlich geschützt, Repo ist öffentlich). Verwendet wird eine gemeinfreie oder offen lizenzierte
Übersetzung (Erman 1923 oder Thesaurus Linguae Aegyptiae), Kürzungen mit […] gekennzeichnet, mit vollständiger Angabe.

Auszüge (Zeilen nach der Schulbuchfassung):

| Block | Z. | Funktion |
|---|---|---|
| Begrüßung, „Ägypten am Leben erhalten“ | 1–2 | Nil als Lebensgrundlage |
| Gerste und Bohnen | 4–5 | Abgleich mit der eigenen Ernte |
| „faul“ → Armut, Krankheit | 6–9 | Quelle nennt selbst die Gefahr einer schwachen Flut |
| „kommt zu seiner Zeit“ | 10–11 | Regelmäßigkeit, Rhythmus |
| „Man opfert dir … Komm nach Ägypten!“ | 15–17 | Perspektive: Gebet an einen Gott |

Nicht verwendet: Fische/Zugvögel, „habgierig“; „Nasen verstopft“ wird gekürzt oder erklärt.

Quellencheck – drei Fragen:
- **Sagt die Quelle:** Der Nil gibt Leben und Nahrung, kommt regelmäßig; bleibt er aus, herrscht Not.
- **Zeigt mein Spiel:** Ernte braucht Arbeit und Organisation (Graben, Schaduf, Deich, Speicher).
- **Belegt die Quelle nicht:** die Arbeit der Menschen; die Gefahr einer zu hohen Flut.

## Spielfläche
Eine gemeinsame Karte (iPad hochkant): Nil am Rand, davor **Uferfelder** (2), **mittlere Felder** (2),
**Randfelder** (2) zur Wüste hin; Bewässerungsgraben mit Schaduf, Hof, eigener Vorrat, Dorf mit Dorfspeicher und Deich.
Wasser, Schlamm und Pflanzen verändern sich sichtbar. Oben die Jahreszeitenleiste, unten die Familienfiguren.

Ertragsmodell (vorläufig): überschwemmt mit Schlamm = beste Ernte; nur bewässert = mittlere Ernte; bestellt, aber
trocken = keine Ernte (die Arbeit war umsonst). Jedes bestellte Feld braucht 1 Person; Graben instand setzen bzw.
Schaduf bedienen je 1 Person.

| Flut | Uferfelder | mittlere Felder | Randfelder |
|---|---|---|---|
| gut (Jahr 1) | überschwemmt | überschwemmt | trocken – nur über Graben |
| zu niedrig | überschwemmt | trocken – über Graben/Schaduf, mit Hauptkanal leichter | trocken – nur mit Hauptkanal |
| zu hoch | zu lange unter Wasser, Hof bedroht – ohne Deich späte Aussaat, schwächere Ernte | überschwemmt | überschwemmt |

## Ablauf und Interaktionen

| # | Phase | Entscheidung | Bedingungen | Folge im Spiel | Historischer Zusammenhang | Rückmeldung (Beispiel) | Beitrag zur Leitfrage |
|---|---|---|---|---|---|---|---|
| 0 | Sirius (Jahr 1) | – (antippen) | – | Sirius erscheint, Kalender startet, Wasser steigt | Ägypter richteten den Kalender nach Flut und Sirius aus | „Wenn der Sirius vor Sonnenaufgang erscheint, kommt bald die Flut.“ | Natur: Rhythmus |
| 1 | Die Nilflut kommt (2–3 Min.) | Probefelder: an einem Uferfeld und einem Randfeld je säen | Lage zum Fluss | Wasser sinkt, Uferfeld schwarz von Schlamm und grün; Randfeld vertrocknet | Flut bringt Wasser und Schlamm, aber nicht überall hin | „Am Fluss blieb fruchtbarer Schlamm liegen. Weiter weg kam kein Wasser an.“ | Natur |
| 2 | Wasser auf die Felder, Jahr 1 (3–4 Min.) | Felder wählen, 4 Familienmitglieder auf Felder / Graben / Schaduf verteilen | 4 Personen, Flut „gut“ | Felder wachsen sichtbar oder vertrocknen | Ernte braucht Wasser **und** Arbeit | erst nach dem Wachstum, z. B. „Du hast mehr Felder bestellt, aber niemand hat das Wasser dorthin gebracht.“ | Arbeit |
| 3 | Ernten, lagern, versorgen (3 Min.) | Überschuss nach der Versorgung der Familie: eigener Vorrat oder Dorfspeicher | Ernte aus #2 | Säcke wandern in Vorrat bzw. Dorfspeicher; im Dorf sind Weberin, Töpfer, Landvermesser zu sehen, die selbst kein Getreide anbauen | Überschüsse ermöglichen Vorräte und Arbeitsteilung | „Die Weberin baut kein Getreide an. Sie lebt vom Speicher und stellt Leinen her.“ | Gesellschaft |
| 4 | Ein Dorf am Nil (2–3 Min.) | 0, 1 oder 2 Familienmitglieder zu Deich und Hauptkanal schicken – oder eigenen Graben vorbereiten | Familie, Ruf des Dorfes | Deich / Kanal wird fertig oder nicht; eigener Graben besser oder schlechter vorbereitet | Deiche und Kanäle baute die Dorfgemeinschaft gemeinsam | „Mit deiner Hilfe reicht es: Der Hauptkanal führt jetzt weiter ins Land.“ | Gesellschaft, Arbeit |
| 5 | Jahr 2 (3–4 Min.) | wie #2, mit Wissen aus Jahr 1 | zufällige Flut (niedrig/hoch), Deich/Kanal aus #4, Graben | Folgen der Flut; Landvermesser setzt nach der Flut die Feldgrenzen neu; Versorgung: Ernte + Vorrat + ggf. Hilfe aus dem Dorfspeicher | Abhängigkeit von der Flut; Vorräte und Gemeinschaft fangen schlechte Jahre auf | „Die Flut war zu niedrig. Der Kanal brachte trotzdem Wasser zu den mittleren Feldern.“ | Natur, Arbeit, Gesellschaft |
| 6 | Bilanz (1 Min.) | – | eigene Ereignisse | Belegkarten in drei Spalten: Natur · Arbeit · Gesellschaft | – | – | Material für das Urteil |
| 7 | Quellencheck M3 (2 Min.) | Aussagen in „sagt die Quelle / zeigt mein Spiel / sagt die Quelle nicht“ einordnen | Auszug M3, eigene Belegkarten | Rückmeldung mit Begründung, keine Punkte | Quelle zeigt eine Perspektive (Gebet), keine vollständige Beschreibung | „Im Lied kommt die Arbeit der Bauern nicht vor. Warum wohl?“ | Quellenbeleg |
| 8 | Satzgeländer (1–2 Min.) | je einen Spielbeleg, Quellenbeleg und ein „Allerdings“ antippen | Belegkarten, M3 | Satzgeländer mit gewählten Stichpunkten: „Der Nil war ein Geschenk, weil … Das zeigt sich daran, dass … Allerdings …“ | begründetes Urteil | – | Urteil ins Heft |
| 9 | Impuls für Schnelle | Denkanstöße aufklappen | – | – | Spiel als Darstellung | – | Vorbereitung Unterrichtsgespräch |

## Abdeckung des Verfassertexts S. 44–45
| Inhalt im Buch | im Spiel |
|---|---|
| Nilschwemme, Schlamm, fruchtbares Land | #1, #2 |
| Anbau, Land liegt brach | #2 (unbestellte Felder liegen brach) |
| Kalender, Sirius | #0, Jahreszeitenleiste |
| Flut zu hoch / zu niedrig, Hungersnot | #5 |
| Deiche, Dämme, Kanäle als Gemeinschaftsarbeit | #4 |
| Schaduf (M2) | #2, #5 |
| Vorräte in Speichern für schlechte Jahre | #3, #5 |
| Arbeitsteilung, Handwerk, Landvermesser | #3, #5 (Dorfbild) |
| Händler, Tempel- und Pyramidenbau, Mathematiker | nicht im Spiel – Unterrichtsgespräch bzw. Stationen |

## Offen / geplant
- Übersetzung von M3 beschaffen und gegen die Schulbuchfassung abgleichen (Erman 1923 oder TLA).
- Saatgut als eigener Posten bei der Ernteverteilung? (historisch richtig, aber eine Entscheidung mehr)
- Ägyptische Namen der Jahreszeiten (Achet, Peret, Schemu) nur im Begriffsfenster oder gar nicht?
- Darstellung der Familie (Figuren ohne feste Geschlechterrollen; Bäuerinnen arbeiteten mit).
- Werte im Ertragsmodell nach dem ersten Test anpassen; tatsächliche Spieldauer messen.
