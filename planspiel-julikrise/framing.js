/* Planspiel Julikrise 1914 – Framing Controls (Lenkung ohne Vorgabe), Entwurf.
   Die Stimmungsanzeigen stehen als Merkmale in netz.js (Eintrag „anzeige“). Hier stehen die übrigen Anstöße.

   Grundsatz: Die Lenkung kommt aus Kräften, die es 1914 wirklich gab. Nichts sagt „wählt das“.

   art – wie der Text im Spiel gekennzeichnet wird (Fachbegriffe!):
     "zitat"     echtes, belegtes Zitat (= Quelle). Nur mit vollständigem Beleg, Kürzungen mit […].
     "sinngemäß" Darstellung: so äußerte sich die Person, aber nicht wörtlich. Im Spiel: „sinngemäß“.
     "bericht"   Nachricht oder Bericht in vereinfachter Form (Darstellung).
     "gerücht"   unbestätigte Nachricht. Im Spiel: „unbestätigt“.
   wenn – optional, Merkmale wie in netz.js. Fehlt es, erscheint der Text immer.
   beleg – Arbeitsnotiz für Rob, erscheint nicht im Spiel. „prüfen“ heißt: noch nicht am Original geprüft. */

export const STIMMEN = [
  /* ---------- Runde 1: Sarajevo ---------- */
  { runde: 1, staat: "oeu", wer: "Generalstabschef Conrad von Hötzendorf", art: "sinngemäß",
    text: "Jetzt muss abgerechnet werden. Wer jetzt zögert, verliert Bosnien und am Ende das Reich.",
    beleg: "Conrad drängt ab 29.6.1914 auf Krieg gegen Serbien (Conrad, Aus meiner Dienstzeit, Bd. 4) – prüfen" },
  { runde: 1, staat: "oeu", wer: "Graf Tisza, ungarischer Ministerpräsident", art: "sinngemäß",
    text: "Ein Krieg gegen Serbien wäre ein schwerer Fehler. Wir hätten Europa gegen uns.",
    beleg: "Denkschrift Tiszas an Franz Joseph, 1.7.1914 – prüfen" },
  { runde: 1, staat: "d", wer: "Kaiser Wilhelm II., Randbemerkung auf einem Bericht aus Wien", art: "zitat",
    text: "Jetzt oder nie.",
    beleg: "Randvermerk Wilhelms II. auf dem Bericht des Botschafters Tschirschky vom 30.6.1914 – Wortlaut und Edition prüfen" },
  { runde: 1, staat: "d", wer: "Aus dem Generalstab", art: "sinngemäß",
    text: "Russland rüstet auf. In zwei, drei Jahren ist es zu stark. Wenn es zum Krieg kommt, dann besser jetzt.",
    beleg: "Haltung Moltkes, u. a. Gespräch mit Jagow Mai/Juni 1914 – prüfen" },
  { runde: 1, staat: "srb", wer: "Serbische Zeitungen", art: "bericht",
    text: "Manche Blätter verteidigen die Attentäter als Patrioten. In Wien liest man das genau.",
    beleg: "Pressereaktionen in Belgrad nach dem 28.6.1914 – prüfen, ggf. Beispiel nennen" },
  { runde: 1, staat: "r", wer: "Panslawistische Zeitungen", art: "bericht",
    text: "Russland ist die Schutzmacht der Slawen. Es darf Serbien nicht ein drittes Mal im Stich lassen.",
    beleg: "russische Presse Juli 1914 – prüfen" },
  { runde: 1, staat: "f", wer: "Außenministerium in Paris", art: "bericht",
    text: "Aus Wien kommen beruhigende Nachrichten. Der Besuch beim Zaren ist seit Langem geplant und wichtig für das Bündnis.",
    beleg: "Reiseplanung Poincaré/Viviani – prüfen" },
  { runde: 1, staat: "gb", wer: "Londoner Zeitungen", art: "bericht",
    text: "Seitenweise Berichte über Irland. Sarajevo steht weiter hinten.",
    beleg: "Home-Rule-Krise Juli 1914 – allgemein belegt" },
  { runde: 1, staat: "gb", wer: "Aus dem Außenministerium", art: "sinngemäß",
    text: "Wien hat Grund zur Empörung. Solange der Streit auf Serbien begrenzt bleibt, ist das keine Sache Englands.",
    beleg: "Einschätzungen im Foreign Office Anfang Juli 1914 – prüfen" },

  /* ---------- Runde 2: Das Ultimatum ---------- */
  { runde: 2, staat: "oeu", wer: "Außenminister Graf Berchtold", art: "sinngemäß",
    text: "Das Ultimatum muss so sein, dass Serbien es kaum annehmen kann. Sonst ist nichts gewonnen.",
    beleg: "Ministerrat 7.7.1914 und Vorbereitung der Note – prüfen" },
  { runde: 2, staat: "oeu", wer: "Graf Tisza", art: "sinngemäß", wenn: { deutscheLinie: ["freieHand"] },
    text: "Nach der Zusage aus Berlin stimme ich einem Ultimatum zu – aber keinem Überfall ohne Vorwarnung.",
    beleg: "Tisza ändert seine Haltung bis 14.7.1914 – prüfen" },
  { runde: 2, staat: "d", wer: "Reichskanzler Bethmann Hollweg (aus dem Tagebuch seines Mitarbeiters Riezler)", art: "sinngemäß",
    text: "Ein Handeln gegen Serbien kann zum Weltkrieg führen. Es ist ein Sprung ins Dunkle – aber vielleicht unsere Pflicht.",
    beleg: "Riezler-Tagebuch, Eintrag 14.7.1914 („Sprung ins Dunkle“) – Wortlaut prüfen, dann ggf. als Zitat" },
  { runde: 2, staat: "d", wer: "Staatssekretär von Jagow", art: "sinngemäß",
    text: "Der Streit muss auf Wien und Belgrad begrenzt bleiben. Je schneller Wien handelt, desto eher halten sich die anderen heraus.",
    beleg: "Lokalisierungsgedanke, Jagow an Lichnowsky 18.7.1914 – prüfen" },
  { runde: 2, staat: "srb", wer: "Aus dem Wahlkampf", art: "bericht",
    text: "Pašić reist durch das Land. Die Wahl ist im August. Wer jetzt vor Wien nachgibt, verliert sie.",
    beleg: "Skupština aufgelöst Juni 1914, Wahl für August angesetzt – Datum prüfen" },
  { runde: 2, staat: "r", wer: "Aus Wien", art: "gerücht",
    text: "Es heißt, Wien bereite eine scharfe Note an Belgrad vor.",
    beleg: "Hinweise erreichten Petersburg Mitte Juli (u. a. über Rom) – prüfen" },
  { runde: 2, staat: "f", wer: "Botschafter Paléologue in St. Petersburg", art: "sinngemäß",
    text: "Der Zar braucht jetzt die Gewissheit, dass Frankreich fest an seiner Seite steht.",
    beleg: "Paléologue, Juli 1914 – prüfen" },
  { runde: 2, staat: "gb", wer: "Aus dem Kabinett", art: "bericht",
    text: "Im Buckingham-Palast verhandeln die Parteien über Irland. Scheitert das, droht Bürgerkrieg.",
    beleg: "Buckingham-Palast-Konferenz 21.–24.7.1914 – allgemein belegt" },

  /* ---------- Runde 3: Die Antwort ---------- */
  { runde: 3, staat: "oeu", wer: "Anweisung an den Gesandten in Belgrad", art: "bericht",
    text: "Wird das Ultimatum nicht vollständig angenommen, bricht der Gesandte sofort die Beziehungen ab und reist ab.",
    beleg: "Weisung an Giesl, Juli 1914 – prüfen" },
  { runde: 3, staat: "oeu", wer: "Generalstabschef Conrad", art: "sinngemäß", wenn: { serbAntwort: ["fastAlles", "alles"] },
    text: "Serbiens schöne Worte ändern nichts. Wenn wir jetzt nachgeben, kommt die nächste Krise bestimmt.",
    beleg: "Conrad, Ende Juli 1914 – prüfen" },
  { runde: 3, staat: "d", wer: "Kaiser Wilhelm II., Randbemerkung zur serbischen Antwort", art: "zitat", wenn: { serbAntwort: ["fastAlles", "alles"] },
    text: "Damit fällt jeder Kriegsgrund fort.",
    beleg: "Randbemerkung Wilhelms II. vom 28.7.1914 („… aber damit fällt jeder Kriegsgrund fort“) – Wortlaut prüfen" },
  { runde: 3, staat: "d", wer: "Generalstab", art: "sinngemäß",
    text: "Russland bereitet sich vor. Wien muss jetzt handeln, sonst verlieren wir den Vorsprung.",
    beleg: "Druck des Generalstabs 26.–28.7.1914 – prüfen" },
  { runde: 3, staat: "srb", wer: "Prinzregent Alexander an den Zaren", art: "bericht",
    text: "Belgrad bittet St. Petersburg um Hilfe. Ohne Russland kann Serbien nicht bestehen.",
    beleg: "Telegramm Alexanders an Nikolaus II., 24.7.1914 – prüfen" },
  { runde: 3, staat: "r", wer: "Ministerrat", art: "sinngemäß",
    text: "Nach 1909 und 1913 können wir nicht schon wieder zurückweichen. Das Ansehen Russlands steht auf dem Spiel.",
    beleg: "Ministerrat 24./25.7.1914 (u. a. Kriwoschein) – prüfen" },
  { runde: 3, staat: "f", wer: "Aus dem Außenministerium", art: "bericht",
    text: "Präsident und Ministerpräsident sind auf See, auf der Rückreise aus Russland. Telegramme erreichen sie nur schwer.",
    beleg: "Rückreise Poincaré/Viviani 23.–29.7.1914 – allgemein belegt" },
  { runde: 3, staat: "gb", wer: "Außenminister Grey", art: "sinngemäß",
    text: "Eine Konferenz hat 1912/13 den Frieden gerettet. Vielleicht gelingt es wieder.",
    beleg: "Greys Vorschlag einer Botschafterkonferenz, 26.7.1914 – prüfen" },

  /* ---------- Runde 4: Mobilmachung ---------- */
  { runde: 4, staat: "oeu", wer: "Generalstabschef Conrad", art: "sinngemäß",
    text: "Wenn Russland mobilmacht, müssen wir die ganze Armee aufbieten – sonst stehen wir im Osten wehrlos da.",
    beleg: "Ende Juli 1914 – prüfen" },
  { runde: 4, staat: "d", wer: "Generalstabschef von Moltke", art: "sinngemäß",
    text: "Jeder Tag zählt. Wenn Russland mobilmacht und wir warten, ist der Schlieffen-Plan verloren.",
    beleg: "Moltke 30./31.7.1914 – prüfen" },
  { runde: 4, staat: "d", wer: "Telegramm aus St. Petersburg", art: "bericht",
    text: "Der Zar schreibt dem Kaiser: Er bittet, Wien zu mäßigen. Die beiden Monarchen telegrafieren täglich.",
    beleg: "„Willy-Nicky-Telegramme“ 29.–31.7.1914 – allgemein belegt" },
  { runde: 4, staat: "bel", wer: "König Albert I.", art: "sinngemäß",
    text: "Belgien wird seine Neutralität verteidigen, gegen jeden, der sie verletzt.",
    beleg: "Haltung Alberts I., Ende Juli 1914 – prüfen" },
  { runde: 4, staat: "r", wer: "Generalstabschef Januschkewitsch", art: "sinngemäß",
    text: "Eine Teilmobilmachung ist nicht vorbereitet. Wer jetzt nicht ganz mobilmacht, verliert Wochen.",
    beleg: "29./30.7.1914 – prüfen" },
  { runde: 4, staat: "f", wer: "Generalstabschef Joffre", art: "sinngemäß",
    text: "Jeder Tag ohne Mobilmachung kostet uns Kilometer Land an der Grenze.",
    beleg: "Joffre an die Regierung, 30./31.7.1914 – prüfen" },
  { runde: 4, staat: "gb", wer: "Aus dem Kabinett", art: "bericht",
    text: "Mehrere Minister drohen mit Rücktritt, falls England in einen Krieg eintritt.",
    beleg: "Kabinett Asquith Ende Juli 1914 (u. a. Morley, Burns) – prüfen" },

  /* ---------- Runde 5: Kriegserklärungen ---------- */
  { runde: 5, staat: "oeu", wer: "Generalstabschef Conrad", art: "sinngemäß",
    text: "Unser Hauptgegner ist Serbien. Aber wenn Russland angreift, brauchen wir jeden Mann im Osten.",
    beleg: "Aufmarschfrage Anfang August 1914 – prüfen" },
  { runde: 5, staat: "d", wer: "Botschafter Lichnowsky aus London", art: "bericht", wenn: { englandHaltung: ["offen", "neutralZugesagt"] },
    text: "Grey deutet an, England könne neutral bleiben, wenn wir Frankreich nicht angreifen.",
    beleg: "Lichnowsky-Telegramm 1.8.1914 (Missverständnis) – prüfen" },
  { runde: 5, staat: "bel", wer: "Aus der Regierung", art: "bericht",
    text: "Deutschland verlangt freien Durchmarsch und gibt zwölf Stunden Zeit.",
    beleg: "Deutsche Note vom 2.8.1914, Frist 12 Stunden – prüfen" },
  { runde: 5, staat: "r", wer: "Bitte aus Paris", art: "bericht",
    text: "Frankreich bittet: Greift so schnell wie möglich an, damit Deutschland Truppen im Osten braucht.",
    beleg: "französisch-russische Absprachen; Bitten Anfang August 1914 – prüfen" },
  { runde: 5, staat: "f", wer: "Präsident Poincaré", art: "sinngemäß",
    text: "Alle Franzosen stehen jetzt zusammen. Niemand soll sagen, wir hätten angegriffen.",
    beleg: "„Union sacrée“, Botschaft Poincarés 4.8.1914 – prüfen" },
  { runde: 5, staat: "gb", wer: "Unterhaus", art: "bericht", wenn: { westen: ["durchBelgien"] },
    text: "Seit Belgien bedroht ist, ist die Stimmung umgeschlagen. Viele Abgeordnete sagen: Jetzt gibt es einen klaren Grund.",
    beleg: "Debatte und Grey-Rede im Unterhaus 3.8.1914 – allgemein belegt" }
];

/* Erinnerungskarten: So argumentierten die Regierenden selbst mit früheren Krisen. */
export const ERINNERUNGEN = [
  { id: "bosnien", fuer: ["oeu", "d", "r", "srb"], ab: 1, titel: "Erinnert euch: 1908/09",
    text: "Österreich-Ungarn nahm Bosnien in Besitz. Russland protestierte – und gab nach, weil Deutschland fest hinter Wien stand." },
  { id: "balkankriege", fuer: ["oeu", "r", "srb"], ab: 1, titel: "Erinnert euch: 1912/13",
    text: "In den Balkankriegen wuchs Serbien stark. Wien und St. Petersburg standen kurz vor einem Krieg. Russland wich erneut zurück." },
  { id: "konferenz", fuer: ["gb", "d", "f"], ab: 2, titel: "Erinnert euch: Londoner Konferenz 1912/13",
    text: "Die Großmächte verhandelten in London über den Balkan. Ein großer Krieg wurde verhindert." },
  { id: "marokko", fuer: ["f", "d", "gb"], ab: 2, titel: "Erinnert euch: Marokko 1905 und 1911",
    text: "Deutschland drohte Frankreich. Beide Male stellte sich England an die Seite Frankreichs, Deutschland musste zurückweichen." },
  { id: "1870", fuer: ["f"], ab: 1, titel: "Erinnert euch: 1870/71",
    text: "Frankreich verlor den Krieg gegen Deutschland und musste Elsass-Lothringen abgeben." },
  { id: "japan", fuer: ["r"], ab: 3, titel: "Erinnert euch: 1905",
    text: "Russland verlor den Krieg gegen Japan. Danach kam es zu einer Revolution. Mancher warnt: Ein neuer Krieg könnte das Zarenreich erschüttern." },
  { id: "1839", fuer: ["bel", "gb"], ab: 4, titel: "Erinnert euch: 1839",
    text: "Großbritannien, Frankreich und Preußen garantierten Belgiens Neutralität – für immer." }
];

/* Uhren und Fristen: Zeitdruck als Grenze. */
export const UHREN = [
  { runde: 1, fuer: ["oeu"], text: "Viele Soldaten sind im Ernteurlaub. Die Armee ist erst in einigen Wochen voll bereit.", beleg: "prüfen" },
  { runde: 2, fuer: "alle", text: "20.–23. Juli: Präsident Poincaré ist in St. Petersburg.", wenn: { staatsbesuch: ["ja"] } },
  { runde: 2, fuer: ["d"], text: "Der Kaiser ist auf Nordlandreise. Seine Antworten kommen verspätet." },
  { runde: 3, fuer: "alle", text: "Frist des Ultimatums: 25. Juli, 18 Uhr – 48 Stunden." },
  { runde: 4, fuer: ["d"], text: "Schlieffen-Plan: Deutschland braucht für die Mobilmachung Tage, Russland Wochen. Jeder Tag Vorsprung Russlands zählt." },
  { runde: 4, fuer: ["r"], text: "Unsere Mobilmachung dauert Wochen, die deutsche nur Tage." },
  { runde: 5, fuer: ["d"], text: "Schlieffen-Plan: Frankreich muss in etwa sechs Wochen besiegt sein, bevor Russland bereit ist." },
  { runde: 5, fuer: ["bel"], text: "Deutsche Frist: 12 Stunden.", wenn: { westen: ["durchBelgien"] } }
];
