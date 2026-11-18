/* Planspiel Julikrise 1914 – alle Texte.
   Übernommen aus der Papierfassung (Robs überarbeitete PDFs, Herbst 2026): Dossiers 02–07,
   Material für alle (01), Notenvordrucke (08), Übersicht Ablauf / Spielleitungsskript (001).

   Hier darf geändert werden: nur die Wörter zwischen den Anführungszeichen.
   Kommas, Klammern und Namen links vom Doppelpunkt bitte stehen lassen.

   Kürzel der Staaten:  oeu Österreich-Ungarn · d Deutsches Reich · srb Serbien · bel Belgien
                        r Russland · f Frankreich · gb Großbritannien
   Das Team Serbien spielt ab Runde 4 Belgien (siehe TEAMS).

   Noch NICHT enthalten: Varianten der Optionen je nach früheren Entscheidungen (Entscheidungsnetz)
   und die Framing Controls. Beides kommt, sobald Rob das Modell in DESIGN.md freigegeben hat. */

export const STAATEN = {
  oeu: { name: "Österreich-Ungarn", kurz: "Ö-U", hauptstadt: "Wien" },
  d:   { name: "Deutsches Reich", kurz: "D", hauptstadt: "Berlin" },
  srb: { name: "Serbien", kurz: "SRB", hauptstadt: "Belgrad" },
  bel: { name: "Belgien", kurz: "BEL", hauptstadt: "Brüssel" },
  r:   { name: "Russland", kurz: "R", hauptstadt: "St. Petersburg" },
  f:   { name: "Frankreich", kurz: "F", hauptstadt: "Paris" },
  gb:  { name: "Großbritannien", kurz: "GB", hauptstadt: "London" }
};

/* Sechs Delegationen (Tische). Ein Team spielt je Runde einen Staat. */
export const TEAMS = [
  { id: "oeu", staat: { 1: "oeu", 2: "oeu", 3: "oeu", 4: "oeu", 5: "oeu" } },
  { id: "d",   staat: { 1: "d", 2: "d", 3: "d", 4: "d", 5: "d" } },
  { id: "srb", staat: { 1: "srb", 2: "srb", 3: "srb", 4: "bel", 5: "bel" } },
  { id: "r",   staat: { 1: "r", 2: "r", 3: "r", 4: "r", 5: "r" } },
  { id: "f",   staat: { 1: "f", 2: "f", 3: "f", 4: "f", 5: "f" } },
  { id: "gb",  staat: { 1: "gb", 2: "gb", 3: "gb", 4: "gb", 5: "gb" } }
];

/* ---------- Material für alle (01) ---------- */
export const EUROPA_1914 = {
  titel: "Europa im Sommer 1914",
  abschnitte: [
    { titel: "Die Großmächte und ihre Bündnisse",
      text: "Deutschland und Österreich-Ungarn sind seit 1879 verbündet. Italien kam 1882 hinzu (Dreibund), gilt aber als unsicherer Partner. Frankreich und Russland sind seit 1894 verbündet. Großbritannien hat sich 1904 mit Frankreich und 1907 mit Russland verständigt (Triple Entente). An einen Bündnisvertrag ist es aber nicht gebunden." },
    { titel: "Wettrüsten",
      text: "Alle Großmächte vergrößern ihre Armeen. Deutschland baut seit 1898 eine große Kriegsflotte – Großbritannien antwortet mit noch mehr Schiffen." },
    { titel: "Konfliktherd Marokko",
      text: "1905 und 1911 streiten Deutschland und Frankreich um Einfluss in Marokko. Beide Male stellt sich Großbritannien auf die Seite Frankreichs, Deutschland muss zurückweichen." },
    { titel: "Konfliktherd Balkan",
      text: "Das Osmanische Reich hat seine Gebiete auf dem Balkan größtenteils verloren. Dort sind neue Staaten entstanden, darunter Serbien. Serbien will alle Südslawen vereinen – auch die, die in Österreich-Ungarn leben. Österreich-Ungarn fürchtet deshalb um seinen Zusammenhalt. Russland sieht sich als Schutzmacht der Serben.",
      punkte: [
        "1908/09: Österreich-Ungarn annektiert Bosnien und Herzegowina. Serbien und Russland protestieren. Weil Deutschland hinter Österreich-Ungarn steht, muss Russland nachgeben.",
        "1912/13: In zwei Balkankriegen vergrößert sich Serbien stark. Österreich-Ungarn und Russland stehen kurz vor einem Krieg; Großbritannien und Deutschland vermitteln."
      ] },
    { titel: "Belgien",
      text: "Belgien ist seit 1839 dauerhaft neutral. Großbritannien, Frankreich und Preußen haben diese Neutralität garantiert." }
  ]
};

export const BEGRIFFE = [
  ["Bündnis", "Vertrag, in dem sich Staaten gegenseitige Hilfe versprechen."],
  ["Neutralität", "Ein Staat beteiligt sich nicht an einem Krieg anderer Staaten."],
  ["Ultimatum", "Letzte Forderung mit Frist. Wird sie nicht erfüllt, droht Gewalt."],
  ["Mobilmachung", "Die Armee wird für den Krieg bereit gemacht: Soldaten werden einberufen und an die Grenzen gebracht."],
  ["Generalstab", "Die Planungsabteilung des Militärs, die Kriegspläne entwirft."],
  ["Annexion", "Ein Staat nimmt ein fremdes Gebiet in Besitz und erklärt es zu seinem eigenen."],
  ["Note", "Offizielle schriftliche Mitteilung einer Regierung an eine andere."]
];

/* ---------- Dossiers (02–07) ---------- */
export const DOSSIERS = {
  oeu: {
    werWirSind: "Wir sind ein Vielvölkerstaat mit rund 50 Millionen Menschen. Deutsche, Ungarn, Tschechen, Polen, Kroaten, Serben, Rumänen und weitere Völker leben unter unserem Kaiser Franz Joseph, der seit 1848 regiert und 83 Jahre alt ist. Viele dieser Völker fordern mehr Rechte, manche einen eigenen Staat. Unsere Armee ist groß, aber schlechter ausgerüstet als die deutsche oder die russische.",
    wasWirWollen: [
      "Unser Reich zusammenhalten.",
      "Serbien als Unruheherd ausschalten. Es stachelt die Südslawen in unserem Reich auf.",
      "Als Großmacht ernst genommen werden, vor allem auf dem Balkan."
    ],
    beziehungen: {
      d: "Unser einziger verlässlicher Verbündeter (Bündnis seit 1879). 1908/09 hat Berlin fest zu uns gestanden. Ohne Deutschland können wir gegen Russland nicht bestehen.",
      srb: "Unser gefährlichster Nachbar. Serbien will alle Südslawen vereinen – auch die in unserem Reich. Seit wir 1908 Bosnien annektiert haben, hetzen serbische Zeitungen und Vereine gegen uns.",
      r: "Unser Rivale auf dem Balkan und Schutzmacht Serbiens. 1908/09 musste Russland nachgeben, weil Deutschland hinter uns stand.",
      f: "Kaum eigene Streitpunkte. Aber Frankreich ist mit Russland verbündet.",
      gb: "Früher oft freundlich zu uns. Heute arbeitet London eng mit Frankreich und Russland zusammen."
    },
    geheim: [
      "Unser Generalstabschef Conrad von Hötzendorf fordert seit Jahren einen Krieg gegen Serbien.",
      "Einen Krieg gegen Russland können wir allein nicht gewinnen.",
      "Wenn wir nach dem Mord an unserem Thronfolger nichts tun, halten uns alle für schwach – die anderen Großmächte und die Völker in unserem eigenen Reich."
    ],
    denkanstoss: "Was passiert mit einem Vielvölkerstaat, der eine Demütigung hinnimmt – und was, wenn er zu hart reagiert?"
  },
  d: {
    werWirSind: "Das Deutsche Kaiserreich besteht seit 1871. Wir haben rund 67 Millionen Einwohner, die stärkste Wirtschaft und das stärkste Heer auf dem europäischen Festland. Seit 1898 bauen wir eine große Kriegsflotte. Kaiser ist Wilhelm II., Reichskanzler ist Theobald von Bethmann Hollweg.",
    wasWirWollen: [
      "Als Weltmacht anerkannt werden, mit Kolonien und einer starken Flotte.",
      "Unseren einzigen Verbündeten Österreich-Ungarn erhalten.",
      "Einen Krieg gegen Frankreich und Russland zugleich vermeiden oder ihn, wenn er kommt, schnell gewinnen.",
      "England möglichst aus einem Krieg heraushalten."
    ],
    beziehungen: {
      oeu: "Unser einziger verlässlicher Verbündeter (seit 1879). Zerfällt Österreich-Ungarn, stehen wir allein zwischen Frankreich und Russland.",
      srb: "Uns eigentlich gleichgültig. Aber Serbien bedroht unseren Verbündeten.",
      r: "Seit 1890 haben wir keinen Vertrag mehr mit Russland. Russland rüstet stark auf und baut Eisenbahnen bis an unsere Grenze.",
      f: "Unser Gegner seit dem Krieg 1870/71. Frankreich will Elsass-Lothringen zurück und ist mit Russland verbündet. Wir fühlen uns eingekreist.",
      gb: "Wegen unserer Flotte ist das Verhältnis gespannt. Zuletzt haben wir uns in Kolonialfragen geeinigt. Wir hoffen, dass England neutral bleibt.",
      bel: "Neutral. 1839 hat auch Preußen die Neutralität Belgiens garantiert."
    },
    geheim: [
      "Unser Kriegsplan, der Schlieffen-Plan: Im Krieg gegen Frankreich und Russland wollen wir zuerst Frankreich in etwa sechs Wochen besiegen und danach gegen Russland kämpfen. Weil die Grenze zu Frankreich stark befestigt ist, sollen unsere Truppen durch Belgien marschieren.",
      "Der Plan funktioniert nur, wenn wir schneller sind als Russland. Für uns bedeutet Mobilmachung deshalb fast sofort Krieg.",
      "Generalstabschef von Moltke meint: In zwei, drei Jahren ist Russlands Armee zu stark. Wenn Krieg, dann lieber jetzt."
    ],
    denkanstoss: "Was ist wichtiger: einen großen Krieg zu vermeiden oder den einzigen Verbündeten nicht zu verlieren?"
  },
  srb: {
    werWirSind: "Wir sind ein kleines Königreich mit rund 4,5 Millionen Menschen. In den Balkankriegen 1912/13 haben wir unser Gebiet fast verdoppelt. Doch unsere Armee ist erschöpft, viele Soldaten sind gefallen. Ministerpräsident ist Nikola Pašić.",
    wasWirWollen: [
      "Unsere Unabhängigkeit bewahren.",
      "Irgendwann alle Südslawen (Serben, Kroaten, Slowenen) in einem Staat vereinen. Viele von ihnen leben in Österreich-Ungarn, vor allem in Bosnien.",
      "Jetzt keinen Krieg gegen Österreich-Ungarn führen, dafür sind wir zu schwach."
    ],
    beziehungen: {
      oeu: "Unser mächtiger Nachbar. 1908 hat er Bosnien annektiert, wo viele Serben leben. Wien will uns klein halten.",
      r: "Unsere Schutzmacht und unsere „slawischen Brüder“. Einen Bündnisvertrag gibt es nicht. 1908/09 hat Russland uns nicht geholfen.",
      f: "Frankreich hat uns Geld geliehen, mit dem wir Waffen gekauft haben.",
      d: "Weit weg, aber fest an der Seite Österreich-Ungarns.",
      gb: "Weit weg. Interessiert sich wenig für uns."
    },
    geheim: [
      "Der Geheimbund „Schwarze Hand“ wird von serbischen Offizieren geführt. Unsere Regierung hat ihn nicht unter Kontrolle.",
      "Es gab Gerüchte über Pläne gegen den Thronfolger. Eine gründliche Untersuchung dieser Vorgänge könnte unangenehme Dinge über unsere Offiziere ans Licht bringen."
    ],
    denkanstoss: "Wie weit können wir nachgeben, ohne unsere Unabhängigkeit aufzugeben?"
  },
  bel: {
    kurzdossier: true,
    werWirSind: "Wir sind ein kleines Königreich mit rund 7,5 Millionen Menschen, König ist Albert I. Seit 1839 ist Belgien dauerhaft neutral. Großbritannien, Frankreich und Preußen (heute Deutschland) haben diese Neutralität garantiert. Unser Land liegt zwischen Frankreich und Deutschland – auf dem kürzesten Weg nach Paris. Unsere Armee ist klein, wir haben aber starke Festungen in Lüttich, Namur und Antwerpen.",
    wasWirWollen: [
      "Neutral bleiben und nicht in einen Krieg der Großmächte hineingezogen werden.",
      "Unsere Unabhängigkeit und unser Gebiet bewahren."
    ],
    beziehungen: {
      gb: "Unser wichtigster Garant. England will nicht, dass eine Großmacht die Küste gegenüber England beherrscht.",
      f: "Nachbar und Garantiemacht.",
      d: "Nachbar und Garantiemacht. Seine Armee ist viel stärker als unsere.",
      r: "Weit weg.",
      oeu: "Weit weg."
    },
    geheim: [],
    denkanstoss: ""
  },
  r: {
    werWirSind: "Wir sind das größte Land der Erde mit rund 170 Millionen Menschen und vielen Völkern. Zar ist Nikolaus II. 1905 haben wir einen Krieg gegen Japan verloren, danach kam es zu einer Revolution. Viele Menschen sind arm, im Juli 1914 streiken Arbeiter in St. Petersburg. Wir rüsten stark auf, bis etwa 1917 soll unsere Armee modern sein.",
    wasWirWollen: [
      "Einfluss auf dem Balkan.",
      "Die Serben als slawisches Brudervolk schützen.",
      "Keine weitere Demütigung: 1908/09 und 1912/13 mussten wir auf dem Balkan nachgeben."
    ],
    beziehungen: {
      f: "Unser Verbündeter seit 1894. Frankreich hat uns viel Geld für Eisenbahnen und Rüstung geliehen.",
      gb: "1907 haben wir uns mit England über Asien geeinigt. Ein Bündnis ist das aber nicht.",
      srb: "Unser Schützling. Einen Vertrag haben wir nicht, aber ganz Russland erwartet, dass wir Serbien beistehen.",
      oeu: "Unser Rivale auf dem Balkan. Wien will Serbien klein halten.",
      d: "Steht fest hinter Österreich-Ungarn. Kaiser Wilhelm II. und Zar Nikolaus II. sind miteinander verwandt."
    },
    geheim: [
      "Unser Land ist riesig, unser Eisenbahnnetz dünn. Eine Mobilmachung dauert bei uns Wochen, bei Deutschland nur Tage.",
      "Unsere Armeeführung meldet: Es gibt nur einen Mobilmachungsplan: gegen Österreich-Ungarn und Deutschland zugleich. Eine Mobilmachung nur gegen Österreich-Ungarn ist nicht vorbereitet.",
      "Viele Minister fürchten: Ein weiterer Rückzieher könnte das Ansehen des Zaren im eigenen Land zerstören."
    ],
    denkanstoss: ""
  },
  f: {
    werWirSind: "Frankreich ist eine Republik mit rund 40 Millionen Menschen – Deutschland hat rund 67 Millionen. Präsident ist Raymond Poincaré. 1871 haben wir den Krieg gegen Deutschland verloren und Elsass-Lothringen abtreten müssen. 1913 haben wir den Wehrdienst auf drei Jahre verlängert, um mit dem deutschen Heer mithalten zu können. Wir besitzen ein großes Kolonialreich.",
    wasWirWollen: [
      "Sicherheit vor Deutschland.",
      "Das Bündnis mit Russland erhalten.",
      "England fest an unsere Seite binden.",
      "Viele Franzosen träumen davon, Elsass-Lothringen zurückzugewinnen."
    ],
    beziehungen: {
      r: "Unser Verbündeter seit 1894. Ohne Russland haben wir gegen Deutschland keine Chance.",
      gb: "Seit 1904 arbeiten wir eng zusammen (Entente cordiale), unsere Generäle und Admirale sprechen sich ab. Ein Bündnisvertrag ist das nicht – England muss uns nicht helfen.",
      d: "Unser Gegner seit 1870/71. In den Marokkokrisen 1905 und 1911 hat Deutschland uns bedroht.",
      oeu: "Kaum eigene Streitpunkte, aber Verbündeter Deutschlands.",
      srb: "Wir haben Serbien Geld geliehen.",
      bel: "Neutral. 1839 haben auch wir seine Neutralität garantiert."
    },
    geheim: [
      "Unser Kriegsplan (Plan XVII) sieht vor, im Kriegsfall sofort in Elsass-Lothringen anzugreifen.",
      "Ohne England ist ein Krieg gegen Deutschland sehr riskant.",
      "England wird uns nur helfen, wenn wir nicht als Angreifer dastehen."
    ],
    denkanstoss: ""
  },
  gb: {
    werWirSind: "Großbritannien beherrscht das größte Weltreich der Erde. Unsere Flotte ist die stärkste der Welt. Wir sind eine parlamentarische Monarchie: Regierungschef ist Premierminister Asquith, Außenminister ist Sir Edward Grey. Im Sommer 1914 beschäftigt uns vor allem Irland: Dort droht ein Bürgerkrieg.",
    wasWirWollen: [
      "Gleichgewicht in Europa: Keine Macht darf den Kontinent beherrschen.",
      "Unsere Herrschaft über die Meere und unseren Welthandel sichern.",
      "Die Küste gegenüber England – vor allem Belgien – darf nicht in die Hand einer Großmacht fallen.",
      "Einen Krieg möglichst vermeiden, da wir uns auf unsere inneren Angelegenheiten (besonders Irland) konzentrieren müssen."
    ],
    beziehungen: {
      f: "Seit 1904 arbeiten wir eng zusammen, unsere Militärs sprechen sich ab. Einen Bündnisvertrag haben wir nicht.",
      r: "1907 haben wir uns über Asien geeinigt. Ganz trauen wir Russland nicht.",
      d: "Die deutsche Flotte bedroht unsere Seeherrschaft, das deutsche Heer ist das stärkste Europas. Zuletzt hat sich das Verhältnis etwas entspannt.",
      oeu: "Keine direkten Streitpunkte.",
      srb: "Weit weg. Ein Krieg wegen Serbien wäre unseren Bürgern kaum zu erklären.",
      bel: "1839 haben wir die Neutralität Belgiens garantiert."
    },
    geheim: [
      "Das Parlament würde einem Krieg nur zustimmen, wenn es einen klaren Grund gibt."
    ],
    denkanstoss: ""
  }
};

export const STRATEGIEBLATT = {
  fragen: [
    "Was wollen wir erreichen?",
    "Wer hilft uns – wer bedroht uns?",
    "Was dürfen wir auf keinen Fall hinnehmen?"
  ],
  fuerSchnelle: "Was wisst ihr über die anderen Staaten, was diese vielleicht nicht über euch wissen?"
};

/* Begründungsgerüst auf jeder Entscheidungskarte */
export const BEGRUENDUNG = [
  { id: "interessen", frage: "Unsere Interessen (Dossier)" },
  { id: "lage", frage: "Die Lage und was bisher geschah" },
  { id: "andere", frage: "Was andere getan oder uns mitgeteilt haben" },
  { id: "folgen", frage: "Welche Folgen erwarten wir?" },
  { id: "verkuendung", frage: "Verkündung: „Wir wählen …, weil …“" }
];

export const NOTENARTEN = ["Anfrage", "Bitte", "Rat", "Warnung", "Angebot", "Zusage", "Forderung", "Vorschlag", "Abstimmung", "öffentliche Erklärung"];

/* ---------- Die fünf Runden ----------
   wellen:    wer in welcher Entscheidungswelle entscheidet
   fenster:   Diplomatie vor Welle 1 (1) bzw. vor Welle 2 (2)
              pflicht: true = Pflichtnote, false = Vorschlag (freiwillig)
   historisch: die Option, die 1914 gewählt wurde – wird den SuS erst in der Auflösung gezeigt
   platzhalter: Quellen, die noch fehlen (echte Quelle mit Beleg einsetzen) */
export const RUNDEN = [
  {
    nr: 1,
    titel: "Sarajevo",
    zeitraum: "28. Juni – 6. Juli 1914",
    lage: [
      "Am 28. Juni 1914 erschießt der 19-jährige bosnische Serbe Gavrilo Princip in Sarajevo den österreichischen Thronfolger Franz Ferdinand und seine Frau Sophie. Sarajevo gehört seit 1908 zu Österreich-Ungarn.",
      "Die Ermittlungen zeigen: Die Attentäter wurden in Serbien bewaffnet. Ob die serbische Regierung beteiligt war, ist unklar."
    ],
    worumEsGeht: [
      "Wer steckt hinter dem Attentat – und war die serbische Regierung beteiligt?",
      "Wie wird Österreich-Ungarn auf den Mord reagieren?",
      "Bleibt das eine Sache zwischen Wien und Belgrad – oder werden die Großmächte hineingezogen?"
    ],
    wellen: [["d", "srb", "r", "f", "gb"], ["oeu"]],
    fenster: {
      1: [
        { von: "oeu", an: ["d"], art: "Anfrage", pflicht: true, text: "Steht ihr zu uns, wenn wir gegen Serbien vorgehen?" },
        { von: "srb", an: ["r"], art: "Anfrage", pflicht: false, text: "Steht ihr zu uns, falls Wien uns beschuldigt?" },
        { von: "f", an: ["gb"], art: "Anfrage", pflicht: false, text: "Wie schätzt ihr die Lage nach dem Attentat ein?" },
        { von: "gb", an: ["oeu"], art: "Anfrage", pflicht: false, text: "Welche Schritte plant Wien?" }
      ],
      2: []
    },
    spielleitung: "Ö-U liest vor Welle 2 die Antwort aus Berlin und entscheidet. R, F und GB kennen nur die öffentliche Lage. Das ist gewollt: Vom deutschen „Blankoscheck“ erfuhren sie 1914 nichts (Geheimdiplomatie).",
    staaten: {
      oeu: {
        geheim: ["Außenminister Berchtold schickt seinen Mitarbeiter Graf Hoyos mit einem Brief von Kaiser Franz Joseph nach Berlin. Ihr wollt wissen, ob Deutschland zu euch steht."],
        hinweis: "Ihr entscheidet erst, wenn die Antwort aus Berlin da ist.",
        optionen: {
          A: { text: "Die Großmächte bitten, gemeinsam über Serbien zu beraten.", pro: "Wir stehen nicht allein da und wirken besonnen.", contra: "Andere reden mit – Serbien kommt womöglich ungestraft davon." },
          B: { text: "Ein militärisches Vorgehen gegen Serbien vorbereiten.", pro: "Wir zeigen Stärke – nach außen und gegenüber den Völkern im eigenen Reich.", contra: "Russland könnte Serbien beistehen; allein sind wir zu schwach." },
          C: { text: "Serbien auffordern, zusammen mit uns die Hintermänner zu ermitteln.", pro: "Die Täter werden gefunden, ohne dass es Krieg gibt.", contra: "Serbien kann die Ermittlungen verschleppen; wir wirken nachgiebig." }
        },
        historisch: "B"
      },
      d: {
        geheim: ["Am 5. Juli trifft Graf Hoyos aus Wien mit einem Brief von Kaiser Franz Joseph in Berlin ein. Kaiser und Reichskanzler müssen antworten."],
        hinweis: "Eure Entscheidung ist zugleich eure Antwort an Österreich-Ungarn. Schreibt sie als geheime Note nach Wien.",
        optionen: {
          A: { text: "Österreich-Ungarn raten, sich zurückzuhalten, und eine Vermittlung anbieten.", pro: "Ein großer Krieg wird unwahrscheinlicher.", contra: "Wien könnte sich im Stich gelassen fühlen – unser einziger Verbündeter." },
          B: { text: "Unterstützung zusagen, aber nur für ein diplomatisches Vorgehen.", pro: "Wir stehen zu Wien, begrenzen aber das Risiko.", contra: "Wien wirkt schwach; Russland lässt sich davon kaum beeindrucken." },
          C: { text: "Österreich-Ungarn die volle Unterstützung zusagen, wie auch immer es vorgeht.", pro: "Wien kann entschlossen handeln; vielleicht weicht Russland zurück wie 1909.", contra: "Wir geben die Kontrolle aus der Hand und riskieren einen Krieg mit Russland." }
        },
        historisch: "C"
      },
      srb: {
        geheim: ["Offiziere unserer Armee haben Kontakt zur „Schwarzen Hand“. Eine gründliche Untersuchung könnte für uns unangenehm werden."],
        optionen: {
          A: { text: "Jede Beteiligung zurückweisen und abwarten.", pro: "Wir geben keine Schuld zu und wahren unser Gesicht.", contra: "Wien könnte unser Schweigen als Beweis unserer Schuld sehen." },
          B: { text: "Eine eigene Untersuchung beginnen und Verdächtige festnehmen.", pro: "Wir zeigen guten Willen und nehmen Wien Argumente.", contra: "Die Untersuchung könnte Verbindungen zu unseren Offizieren aufdecken." },
          C: { text: "Russland bitten, uns öffentlich den Rücken zu stärken.", pro: "Mit Russland im Rücken wird Wien vorsichtiger.", contra: "Das wirkt wie ein Schuldeingeständnis und kann die Krise verschärfen." }
        },
        historisch: "A"
      },
      r: {
        geheim: [],
        hinweis: "Ihr kennt nur die öffentliche Lage. Achtet auf Noten aus Belgrad.",
        optionen: {
          A: { text: "Serbien raten, Österreich-Ungarn entgegenzukommen.", pro: "Die Krise könnte sich schnell beruhigen.", contra: "Wir lassen unseren Schützling allein – schon wieder." },
          B: { text: "Serbien öffentlich unsere Unterstützung zusichern.", pro: "Wien weiß, dass Serbien nicht allein ist.", contra: "Wir legen uns fest, bevor wir wissen, was Wien plant." },
          C: { text: "Abwarten und die Lage beobachten.", pro: "Wir behalten alle Möglichkeiten offen.", contra: "Wir wissen nicht, was Wien und Berlin gerade besprechen." }
        },
        historisch: "C"
      },
      f: {
        geheim: ["Euer Präsident plant einen Besuch beim russischen Zaren."],
        optionen: {
          A: { text: "Vor dem Besuch erst eine gemeinsame Linie mit England abstimmen.", pro: "Wir binden England frühzeitig ein.", contra: "England ist mit Irland beschäftigt; das kostet Zeit." },
          B: { text: "Den Staatsbesuch wie geplant durchführen.", pro: "Wir zeigen Russland unsere Verbundenheit.", contra: "Während des Besuchs ist unsere Regierung weit weg von Paris." },
          C: { text: "Den Staatsbesuch absagen.", pro: "Wir vermeiden den Eindruck, gegen Österreich-Ungarn zu planen.", contra: "Russland könnte an unserer Bündnistreue zweifeln." }
        },
        historisch: "B"
      },
      gb: {
        geheim: ["In Irland stehen sich bewaffnete Gruppen gegenüber. Die Regierung fürchtet einen Bürgerkrieg. Parlament und Zeitungen reden über kaum etwas anderes."],
        optionen: {
          A: { text: "Österreich-Ungarn zur Mäßigung auffordern.", pro: "Wir zeigen früh, dass uns der Frieden wichtig ist.", contra: "Wien könnte das als Einmischung empfinden." },
          B: { text: "Die Großmächte zu gemeinsamen Gesprächen einladen.", pro: "Wir sind der Vermittler, der wir sein wollen.", contra: "Wir können uns nicht auf Irland fokussieren." },
          C: { text: "Den Mord als Angelegenheit des Balkans behandeln.", pro: "Wir können uns um Irland kümmern.", contra: "Wir verlieren vielleicht wertvolle Zeit, falls die Krise wächst." }
        },
        historisch: "C"
      }
    },
    aufloesung: [
      "5. Juli: Kaiser Wilhelm II. empfängt den österreichischen Botschafter und sagt zu: Deutschland werde auch dann an der Seite Österreich-Ungarns stehen, wenn es zum Krieg mit Russland kommt. Am 6. Juli bestätigt Reichskanzler Bethmann Hollweg die Zusage. Sie wird später „Blankoscheck“ genannt.",
      "7. Juli: Der Ministerrat in Wien beschließt, gegen Serbien vorzugehen.",
      "Serbien weist jede Beteiligung zurück.",
      "Russland, Frankreich und Großbritannien erfahren von der deutschen Zusage nichts. London ist mit Irland beschäftigt."
    ],
    platzhalter: ["Quelle (projizieren): Telegramm des österreichisch-ungarischen Botschafters Graf Szögyény an Außenminister Berchtold, Berlin, 5. Juli 1914 – Auszug mit der Zusage Wilhelms II."],
    abweichungen: "Häufig: D wählt Mäßigung oder nur diplomatische Unterstützung. Dann steht Ö-U ohne Rückendeckung da und entscheidet sich eher gegen ein militärisches Vorgehen. Diese Abhängigkeit in der Auswertung aufgreifen: Warum gab Berlin 1914 freie Hand?"
  },
  {
    nr: 2,
    titel: "Das Ultimatum",
    zeitraum: "7. – 23. Juli 1914",
    lage: [
      "Europa wirkt ruhig. Kaiser Wilhelm II. bricht zu seiner jährlichen Schiffsreise nach Norwegen auf. Frankreichs Präsident Poincaré besucht vom 20. bis 23. Juli den Zaren in St. Petersburg. In Wien wird hinter verschlossenen Türen beraten."
    ],
    worumEsGeht: [
      "Was hat Wien vor – und wann handelt es?",
      "Wie fest halten die Verbündeten zusammen: Berlin zu Wien, Paris zu St. Petersburg?",
      "Kann Serbien einem Konflikt noch ausweichen?"
    ],
    wellen: [["d", "srb", "r", "f", "gb"], ["oeu"]],
    fenster: {
      1: [
        { von: "d", an: ["oeu"], art: "Rat", pflicht: true, text: "Teilt Wien mit, wie schnell und wie hart es gegen Serbien vorgehen soll." },
        { von: "srb", an: ["r"], art: "Bitte", pflicht: false, text: "Bittet Russland um die Zusicherung, dass es Serbien nicht im Stich lässt." },
        { von: "gb", an: ["d"], art: "Anfrage", pflicht: false, text: "Wisst ihr, was Wien plant?" }
      ],
      2: [
        { von: "oeu", an: ["d"], art: "Anfrage", pflicht: false, text: "Nach der Erklärung aus St. Petersburg: Gilt euer Wort trotzdem?" }
      ]
    },
    staatsbesuch: {
      teilnehmer: ["f", "r"],
      text: "Staatsbesuch: Zwei von euch treffen sich mit zwei Vertretern des anderen Landes vor der Tür (3 Minuten). Ihr entscheidet, was ihr vereinbart. Nach dem Treffen könnt ihr eine gemeinsame öffentliche Erklärung abgeben.",
      spielleitung: "Die gemeinsame Erklärung wird mit Welle 1 verkündet – Ö-U hört sie vor seiner Entscheidung."
    },
    staaten: {
      oeu: {
        geheim: [
          "Deutschland steht hinter euch. Der ungarische Ministerpräsident Graf Tisza lehnt einen Angriff ohne Vorwarnung ab, einem Ultimatum stimmt er zu.",
          "Viele eurer Soldaten sind im Ernteurlaub. Die Armee ist erst in einigen Wochen bereit."
        ],
        optionen: {
          A: { text: "Ein Ultimatum stellen, das tief in Serbiens Eigenständigkeit eingreift – z. B.: Unsere Beamten ermitteln in Serbien mit.", pro: "Serbien muss sich unterordnen – oder wir haben einen Grund zum Krieg.", contra: "Russland wird ein solches Ultimatum kaum hinnehmen." },
          B: { text: "Serbien ohne Vorwarnung angreifen.", pro: "Schnell, bevor sich andere einmischen.", contra: "Unsere Armee ist noch nicht bereit, Tisza ist dagegen, und wir stehen als Angreifer da." },
          C: { text: "Ein Ultimatum stellen, das Serbien erfüllen kann – z. B.: Bestrafung der Täter.", pro: "Europa sieht uns im Recht.", contra: "Serbien erfüllt es – und das Problem Serbien bleibt bestehen." }
        },
        zusatz: { frage: "Wann übergeben wir es?", wahl: ["sofort", "während des Staatsbesuchs", "nach dem Staatsbesuch"], historisch: "nach dem Staatsbesuch" },
        historisch: "A"
      },
      d: {
        geheim: ["Der Kaiser geht auf Reise, damit in Europa niemand Verdacht schöpft."],
        optionen: {
          A: { text: "England über die Pläne Wiens informieren und um Vermittlung bitten.", pro: "England könnte einen großen Krieg verhindern.", contra: "Wien fühlt sich verraten; unsere Zusage verliert an Wert." },
          B: { text: "Österreich-Ungarn zur Mäßigung drängen.", pro: "Das Risiko eines großen Krieges sinkt.", contra: "Wir widersprechen unserer eigenen Zusage an Wien." },
          C: { text: "Österreich-Ungarn zu schnellem Handeln drängen und nach außen Ruhe zeigen.", pro: "Je schneller Wien handelt, desto eher bleibt der Konflikt auf den Balkan begrenzt.", contra: "Greift Russland doch ein, stecken wir mitten in einem Krieg." }
        },
        historisch: "C"
      },
      srb: {
        geheim: ["Ministerpräsident Pašić ist im Wahlkampf durch das Land unterwegs. Unsere Armee ist nach den Balkankriegen erschöpft."],
        optionen: {
          A: { text: "Österreich-Ungarn Gespräche über die Ermittlungen anbieten.", pro: "Wir wirken kooperativ und nehmen Wien Argumente.", contra: "Das wirkt wie ein Eingeständnis; die Nationalisten im Land wären empört." },
          B: { text: "Abwarten – der Wahlkampf geht weiter.", pro: "Wir provozieren niemanden und bleiben im Wahlkampf stark.", contra: "Wir sind unvorbereitet, falls Wien plötzlich handelt." },
          C: { text: "Unsere Armee in Bereitschaft versetzen.", pro: "Wir sind gewappnet, falls Wien angreift.", contra: "Wien könnte das als Drohung verstehen – und unsere Armee ist erschöpft." }
        },
        historisch: "B"
      },
      r: {
        geheim: [],
        optionen: {
          A: { text: "Mit Frankreich gemeinsam eine Vermittlung vorschlagen.", pro: "Zusammen haben wir mehr Gewicht als allein.", contra: "Vermitteln kann als Schwäche gelten – nach den Rückziehern 1909 und 1913." },
          B: { text: "Frankreich nicht einbinden und allein handeln.", pro: "Wir behalten volle Freiheit.", contra: "Ohne Frankreich sind wir gegen Deutschland zu schwach." },
          C: { text: "Frankreich um die feste Zusage bitten, im Ernstfall an unserer Seite zu stehen.", pro: "Mit Frankreich im Rücken können wir fest auftreten.", contra: "Eine feste Zusage kann uns beide in einen Krieg ziehen." }
        },
        historisch: "C"
      },
      f: {
        geheim: [],
        optionen: {
          A: { text: "Russland die volle Bündnistreue zusichern.", pro: "Russland bleibt fest an unserer Seite.", contra: "Russland könnte sich zu sicher fühlen und riskanter handeln." },
          B: { text: "Unterstützung nur für den Fall zusagen, dass Deutschland angreift.", pro: "Wir werden nicht in einen Balkankrieg hineingezogen.", contra: "Russland könnte uns für unzuverlässig halten." },
          C: { text: "Russland zur Zurückhaltung auf dem Balkan raten.", pro: "Die Balkankrise bleibt vielleicht klein.", contra: "Russland ist verärgert – unser wichtigstes Bündnis leidet." }
        },
        historisch: "A"
      },
      gb: {
        geheim: [],
        hinweis: "Falls ihr in Berlin nachfragt, ist das eure Entscheidung (Möglichkeit A).",
        optionen: {
          A: { text: "In Berlin nachfragen, was Österreich-Ungarn plant.", pro: "Wir erfahren vielleicht, was geplant ist.", contra: "Berlin muss uns nicht ehrlich antworten." },
          B: { text: "Abwarten – Irland hat Vorrang.", pro: "Wir kümmern uns um das drängendste Problem im eigenen Land.", contra: "Wir werden womöglich von der Krise überrascht." },
          C: { text: "Österreich-Ungarn warnen, nicht zu weit zu gehen.", pro: "Wien weiß, dass Europa genau hinschaut.", contra: "Ohne genaue Informationen wirkt die Warnung unbegründet." }
        },
        historisch: "B"
      }
    },
    aufloesung: [
      "7. Juli: Der Ministerrat in Wien beschließt ein Ultimatum an Serbien. Es wird absichtlich so formuliert, dass Serbien es kaum annehmen kann.",
      "Übergeben wird es erst am 23. Juli um 18 Uhr – nachdem Poincaré St. Petersburg verlassen hat. So sollen sich Frankreich und Russland nicht absprechen können.",
      "Berlin drängt Wien zur Eile. Der Kaiser bleibt auf Reise, damit niemand Verdacht schöpft.",
      "Poincaré versichert dem Zaren die Bündnistreue Frankreichs.",
      "Serbiens Regierung ist mitten im Wahlkampf und wird überrascht. London schaut vor allem auf Irland."
    ],
    platzhalter: [],
    abweichungen: "Häufig: Ö-U wählt ein erfüllbares Ultimatum oder übergibt es während des Staatsbesuchs. Auflösen und in der Auswertung fragen: Warum wollte Wien 1914 ein Ultimatum, das Serbien kaum annehmen konnte?"
  },
  {
    nr: 3,
    titel: "Die Antwort",
    zeitraum: "23. – 28. Juli 1914",
    lage: [
      "Am 23. Juli um 18 Uhr übergibt Österreich-Ungarn Serbien ein Ultimatum. Serbien hat 48 Stunden Zeit – bis zum 25. Juli, 18 Uhr.",
      "Die wichtigsten Forderungen: Serbien soll jede Hetze gegen Österreich-Ungarn verbieten und nationalistische Vereine auflösen. Es soll Offiziere und Beamte entlassen, die Wien benennt. Österreichische Beamte sollen in Serbien bei den Ermittlungen gegen die Hintermänner des Attentats mitwirken."
    ],
    worumEsGeht: [
      "Wie antwortet Serbien auf das Ultimatum – und wie reagiert Wien darauf?",
      "Stellt sich Russland hinter Serbien?",
      "Gibt es noch jemanden, der zwischen Wien und Belgrad vermitteln kann?"
    ],
    wellen: [["srb", "r", "f", "gb"], ["oeu", "d"]],
    fenster: {
      1: [
        { von: "r", an: ["srb"], art: "Rat", pflicht: true, text: "Gebt Belgrad einen Rat, wie es auf das Ultimatum antworten soll." },
        { von: "gb", an: ["d", "f"], art: "Anfrage", pflicht: true, text: "Würdet ihr einer Konferenz der Botschafter zustimmen?" },
        { von: "d", an: ["alle"], art: "öffentliche Erklärung", pflicht: false, text: "Erklärt öffentlich: Der Streit geht nur Österreich-Ungarn und Serbien etwas an." },
        { von: "oeu", an: ["r"], art: "Warnung", pflicht: false, text: "Warnt Russland, sich aus dem Streit mit Serbien herauszuhalten." },
        { von: "srb", an: ["gb"], art: "Bitte", pflicht: false, text: "Bittet England, im Streit mit Wien zu vermitteln." }
      ],
      2: [
        { von: "oeu", an: ["d"], art: "Abstimmung", pflicht: false, text: "Nach Serbiens Antwort: Nehmen wir die Antwort oder eine Konferenz an – oder bleiben wir hart?" }
      ]
    },
    spielleitung: "Serbiens Antwort wird mit Welle 1 öffentlich verkündet, ebenso ein Konferenzvorschlag Englands. In Fenster 2 stimmen sich Ö-U und D ab; D hat dabei die Geheimnachricht zum Kaiser auf dem Tisch.",
    staaten: {
      oeu: {
        geheim: [],
        hinweis: "Ihr entscheidet, nachdem Serbiens Antwort vorgelesen wurde.",
        optionen: {
          A: { text: "Einer Konferenz zustimmen und weiter verhandeln.", pro: "Wir vermeiden einen großen Krieg.", contra: "Andere entscheiden mit – Serbien kommt glimpflich davon." },
          B: { text: "Die Beziehungen zu Serbien abbrechen und Serbien den Krieg erklären.", pro: "Wir lösen das Problem Serbien endlich.", contra: "Serbien hat viel angenommen; Europa könnte uns als Angreifer sehen, und Russland greift vielleicht ein." },
          C: { text: "Serbiens Antwort annehmen.", pro: "Wir erreichen viel, ohne Krieg.", contra: "Eine zentrale Forderung wurde nicht erfüllt – wir wirken schwach." }
        },
        historisch: "B"
      },
      d: {
        geheim: ["Kaiser Wilhelm II. ist am 27. Juli zurückgekehrt. Er ist mit der serbischen Antwort zufrieden. Die Armeeführung sieht das anders und drängt auf einen Krieg."],
        optionen: {
          A: { text: "Den Konferenzvorschlag ablehnen und Österreich-Ungarn den Rücken stärken.", pro: "Wir halten unser Wort gegenüber Wien.", contra: "Wir lehnen eine Chance auf Frieden ab – vor den Augen Europas." },
          B: { text: "Österreich-Ungarn drängen, Serbiens Antwort anzunehmen.", pro: "Der Kaiser selbst sieht keinen Grund mehr für einen Krieg.", contra: "Wien könnte sich verraten fühlen; unser Wort verliert an Wert." },
          C: { text: "Den Konferenzvorschlag unterstützen.", pro: "Wir zeigen England, dass wir Frieden wollen.", contra: "Auf einer Konferenz könnten Wien und wir überstimmt werden." }
        },
        historisch: "A"
      },
      srb: {
        geheim: ["Unsere Armee ist erschöpft. Allein können wir gegen Österreich-Ungarn nicht bestehen."],
        hinweis: "Wartet auf den Rat aus St. Petersburg. Eure Antwort wird öffentlich vorgelesen.",
        optionen: {
          A: { text: "Fast alle Forderungen annehmen, aber österreichische Ermittler in Serbien ablehnen.", pro: "Wir zeigen guten Willen, bleiben aber Herr im eigenen Land.", contra: "Wien kann sagen: Das Ultimatum wurde nicht erfüllt." },
          B: { text: "Das Ultimatum ablehnen.", pro: "Wir bleiben ein unabhängiger Staat.", contra: "Ein Krieg mit Österreich-Ungarn ist dann fast sicher – und wir sind erschöpft." },
          C: { text: "Das Ultimatum vollständig annehmen.", pro: "Wien hat keinen Grund mehr für einen Krieg.", contra: "Österreichische Beamte ermitteln in unserem Land – wir sind nicht mehr ganz unabhängig." }
        },
        oeffentlich: true,
        historisch: "A"
      },
      r: {
        geheim: [],
        hinweis: "Euer Rat an Serbien ist gleichzeitig eure Entscheidung für diese Runde.",
        optionen: {
          A: { text: "Vorschlagen, den Streit vor das internationale Schiedsgericht in Den Haag zu bringen.", pro: "Ein neutrales Gericht wirkt fair.", contra: "Das dauert lange, und Wien wird kaum zustimmen." },
          B: { text: "Serbien raten nachzugeben und selbst nichts unternehmen.", pro: "Wir riskieren keinen Krieg.", contra: "Das wäre unser dritter Rückzieher – unser Ansehen leidet, auch im eigenen Land." },
          C: { text: "Serbien Unterstützung zusagen und mit ersten Kriegsvorbereitungen beginnen.", pro: "Wir sind vorbereitet und schrecken Wien ab.", contra: "Berlin könnte unsere Vorbereitungen als Bedrohung sehen." }
        },
        historisch: "C"
      },
      f: {
        geheim: [],
        optionen: {
          A: { text: "Russland unsere Bündnistreue bestätigen.", pro: "Russland kann sich auf uns verlassen.", contra: "Falls Russland hart gegen Österreich vorgeht, könnten wir in einen Krieg gezogen werden." },
          B: { text: "Englands Vermittlungsvorschlag aktiv unterstützen.", pro: "Wir zeigen England, dass wir Frieden wollen.", contra: "Russland könnte meinen, wir wichen aus." },
          C: { text: "Russland zur Zurückhaltung drängen.", pro: "Die Gefahr eines großen Krieges sinkt.", contra: "Wir setzen unser wichtigstes Bündnis aufs Spiel." }
        },
        historisch: "A"
      },
      gb: {
        geheim: [],
        optionen: {
          A: { text: "Neutral bleiben und abwarten.", pro: "Wir halten uns alle Wege offen.", contra: "Die Krise könnte außer Kontrolle geraten, während wir zusehen." },
          B: { text: "Frankreich und Russland unsere Unterstützung signalisieren.", pro: "Deutschland könnte vorsichtiger werden.", contra: "Russland könnte sich ermutigt fühlen – und unser Kabinett ist gespalten." },
          C: { text: "Eine Konferenz der Botschafter Englands, Frankreichs, Deutschlands und Italiens vorschlagen.", pro: "Wir vermitteln – wie schon 1912/13.", contra: "Lehnen Wien und Berlin ab, stehen wir blamiert da." }
        },
        oeffentlich: true,
        historisch: "C"
      }
    },
    aufloesung: [
      "24./25. Juli: Russland beschließt, Serbien zu unterstützen, und beginnt ab dem 26. Juli mit Kriegsvorbereitungen. Belgrad rät es aber zu einer gemäßigten Antwort.",
      "25. Juli, kurz vor 18 Uhr: Serbien nimmt fast alle Forderungen an, lehnt aber die Mitwirkung österreichischer Beamter bei Ermittlungen in Serbien ab. Zugleich macht es seine Armee mobil. Der österreichische Gesandte bricht die Beziehungen sofort ab und reist ab.",
      "26. Juli: Großbritannien schlägt eine Botschafterkonferenz vor. Deutschland und Österreich-Ungarn lehnen ab.",
      "28. Juli: Wilhelm II. hält die serbische Antwort für ausreichend – doch sein Vorschlag bleibt ohne Wirkung. Am selben Tag erklärt Österreich-Ungarn Serbien den Krieg.",
      "Frankreichs Regierung ist auf der Rückreise; der französische Botschafter in St. Petersburg versichert Russland die Bündnistreue."
    ],
    platzhalter: ["Quelle (vorlesen oder projizieren): Ultimatum Österreich-Ungarns an Serbien, 23. Juli 1914 – Auszug mit den Punkten 1, 5 und 6."],
    abweichungen: "Häufig: SRB nimmt das Ultimatum vollständig an. Die Karten für Ö-U funktionieren trotzdem. Starke Leitfrage für die Auswertung: Serbien nahm 1914 fast alles an – warum reichte das Wien nicht?"
  },
  {
    nr: 4,
    titel: "Mobilmachung",
    zeitraum: "28. – 31. Juli 1914",
    lage: [
      "28. Juli: Österreich-Ungarn erklärt Serbien den Krieg. 29. Juli: Österreichische Geschütze beschießen Belgrad.",
      "In allen Hauptstädten tagen die Regierungen. Ab dieser Runde spielt das Team Serbien den Staat Belgien."
    ],
    worumEsGeht: [
      "Bleibt der Krieg auf Österreich-Ungarn und Serbien begrenzt?",
      "Machen die Großmächte ihre Armeen mobil – und was folgt daraus?",
      "Auf wessen Seite steht England?"
    ],
    wellen: [["oeu", "bel", "r", "f"], ["d", "gb"]],
    fenster: {
      1: [
        { von: "d", an: ["r"], art: "Warnung", pflicht: true, text: "Warnt Russland vor einer Mobilmachung." },
        { von: "d", an: ["oeu"], art: "Vorschlag", pflicht: false, text: "Schlagt Wien vor, nach der Besetzung Belgrads anzuhalten und zu verhandeln." },
        { von: "r", an: ["f"], art: "Anfrage", pflicht: false, text: "Steht ihr zu uns, wenn wir mobilmachen?" },
        { von: "oeu", an: ["d"], art: "Anfrage", pflicht: false, text: "Was tut ihr, wenn Russland mobilmacht?" },
        { von: "gb", an: ["d", "f"], art: "Anfrage", pflicht: true, text: "Werdet ihr die Neutralität Belgiens achten?" },
        { von: "bel", an: ["gb"], art: "Anfrage", pflicht: false, text: "Steht ihr zu eurer Garantie für unsere Neutralität?" }
      ],
      2: [
        { von: "d", an: ["gb"], art: "Angebot", pflicht: false, text: "Bietet England an: Wir annektieren kein französisches Gebiet, wenn ihr neutral bleibt." },
        { von: "f", an: ["gb"], art: "Bitte", pflicht: false, text: "Bittet England um Beistand und begründet, warum nicht ihr die Angreifer seid." }
      ]
    },
    spielleitung: "Die notenreichste Runde, vor allem für D (am besten mit fünf SuS besetzen). Das Team Serbien liest in der Lagephase das Kurzdossier Belgien (halbe Seite).",
    staaten: {
      oeu: {
        geheim: [],
        optionen: {
          A: { text: "Eine Vermittlung der Großmächte annehmen.", pro: "Ein großer Krieg wird vielleicht verhindert.", contra: "Wir haben Serbien den Krieg erklärt – jetzt zurückzuweichen wirkt schwach." },
          B: { text: "Die Vermittlung ablehnen und die gesamte Armee mobilmachen.", pro: "Wir sind auch gegen Russland gerüstet.", contra: "Russland wird darin eine Drohung sehen." },
          C: { text: "Belgrad besetzen und dann verhandeln.", pro: "Wir haben ein Faustpfand und verhandeln aus einer starken Position.", contra: "Serbien bleibt als Unruheherd bestehen – ein halber Sieg." }
        },
        historisch: "B"
      },
      d: {
        geheim: ["Der Schlieffen-Plan verlangt Tempo: Jeder Tag, den Russland früher mobilmacht, gefährdet den Plan."],
        hinweis: "Ihr entscheidet, nachdem Russland entschieden hat.",
        optionen: {
          A: { text: "Den „Zustand drohender Kriegsgefahr“ ausrufen und Russland und Frankreich ein Ultimatum stellen.", pro: "Wir verlieren keine Zeit, falls Russland ernst macht.", contra: "Danach gibt es kaum noch einen Weg zurück." },
          B: { text: "Russland sofort den Krieg erklären.", pro: "Der Schlieffen-Plan läuft ohne jede Verzögerung an.", contra: "Wir stehen vor aller Welt als Angreifer da." },
          C: { text: "Weiter vermitteln und abwarten.", pro: "Vielleicht lässt sich der Krieg noch verhindern.", contra: "Jeder Tag Warten gefährdet unseren Kriegsplan." }
        },
        historisch: "A"
      },
      bel: {
        geheim: [],
        hinweis: "Lest zuerst euer Kurzdossier. Ihr seid ab jetzt die Regierung Belgiens.",
        optionen: {
          A: { text: "Deutschland signalisieren, dass wir einen Durchmarsch dulden könnten.", pro: "Vielleicht bleibt uns der Krieg erspart.", contra: "Wir brechen selbst unsere Neutralität; Frankreich und England wären empört." },
          B: { text: "Frankreich und England schon jetzt um Schutz bitten.", pro: "Wir hätten mächtige Beschützer.", contra: "Deutschland könnte das als Parteinahme gegen sich sehen." },
          C: { text: "Unsere Neutralität bekräftigen und die Armee mobilmachen.", pro: "Wir zeigen allen: Wir verteidigen unser Land.", contra: "Gegen eine Großmacht kann unsere kleine Armee kaum bestehen." }
        },
        historisch: "C"
      },
      r: {
        geheim: [],
        optionen: {
          A: { text: "Nur gegen Österreich-Ungarn mobilmachen.", pro: "Deutschland sieht, dass es nicht gemeint ist.", contra: "Darauf ist unsere Armee nicht vorbereitet. Es könnte zu Chaos kommen und wir wären schwächer." },
          B: { text: "Weiter verhandeln und abwarten.", pro: "Die Tür zum Frieden bleibt offen.", contra: "Belgrad wird beschossen, und wir verlieren wertvolle Zeit." },
          C: { text: "Die gesamte Armee mobilmachen.", pro: "Wir sind rechtzeitig bereit, egal was kommt.", contra: "Deutschland könnte darin einen Grund zum Krieg sehen." }
        },
        historisch: "C",
        historischHinweis: "zunächst A: Der Zar ordnete am 29. Juli erst eine Teilmobilmachung an."
      },
      f: {
        geheim: [],
        optionen: {
          A: { text: "Russland drängen, mit der Mobilmachung zu warten.", pro: "Deutschland bekommt keinen Vorwand.", contra: "Russland könnte uns für unzuverlässig halten." },
          B: { text: "Unsere Truppen 10 km hinter die Grenze zu Deutschland zurückziehen.", pro: "England sieht: Nicht wir sind die Angreifer.", contra: "Wir geben Deutschland an der Grenze einen Vorsprung." },
          C: { text: "Sofort die gesamte Armee mobilmachen.", pro: "Wir sind bereit, wenn Deutschland angreift.", contra: "Wir könnten als Angreifer dastehen – dann hilft uns England kaum." }
        },
        historisch: "B"
      },
      gb: {
        geheim: [],
        optionen: {
          A: { text: "Uns auf keine Seite festlegen.", pro: "Beide Seiten bleiben vorsichtig, weil sie unsere Haltung nicht kennen.", contra: "Frankreich fühlt sich im Stich gelassen, Deutschland wird vielleicht zu mutig." },
          B: { text: "Frankreich unseren Beistand zusagen.", pro: "Deutschland könnte zurückschrecken.", contra: "Das Kabinett ist gespalten; Russland und Frankreich fühlen sich vielleicht zu sicher." },
          C: { text: "Deutschland zusagen, neutral zu bleiben.", pro: "Wir bleiben aus dem Krieg heraus.", contra: "Siegt Deutschland, beherrscht es den Kontinent." }
        },
        historisch: "A"
      }
    },
    aufloesung: [
      "29. Juli: Deutschland schlägt Wien vor, nach der Besetzung Belgrads anzuhalten und zu verhandeln („Halt in Belgrad“). Wien lehnt ab und macht am 31. Juli die gesamte Armee mobil.",
      "29. Juli: Deutschland bietet England an, im Krieg kein französisches Gebiet in Europa zu annektieren, wenn England neutral bleibt. Außenminister Grey lehnt ab und warnt: Deutschland solle nicht mit Englands Neutralität rechnen.",
      "29. Juli: Der Zar unterschreibt die Generalmobilmachung. Nach einem Telegramm Wilhelms II. nimmt er sie zurück und ordnet nur eine Teilmobilmachung an. 30. Juli: Minister und Generäle überzeugen ihn, dass die Teilmobilmachung nicht funktioniert. Er befiehlt die Generalmobilmachung.",
      "30. Juli: Frankreich zieht seine Truppen 10 km von der Grenze zurück, um nicht als Angreifer dazustehen.",
      "31. Juli: Deutschland ruft den „Zustand drohender Kriegsgefahr“ aus und stellt Russland und Frankreich ein Ultimatum.",
      "31. Juli: England fragt nach der Neutralität Belgiens. Frankreich sagt zu, Deutschland weicht aus. Belgien macht seine Armee mobil."
    ],
    platzhalter: [],
    abweichungen: "Häufig: R wählt die Teilmobilmachung. Das hat der Zar am 29. Juli zunächst auch getan – in der Auflösung ausdrücklich hervorheben. Wählt GB den Beistand für F, auflösen: London legte sich 1914 bis zum Schluss nicht fest."
  },
  {
    nr: 5,
    titel: "Kriegserklärungen",
    zeitraum: "1. – 4. August 1914",
    lage: [
      "1. August: Deutschland erklärt Russland den Krieg. Deutschland und Frankreich machen ihre Armeen mobil.",
      "In Berlin, Paris und anderen Städten jubeln Menschenmengen – viele andere haben Angst."
    ],
    worumEsGeht: [
      "Wird aus dem Krieg im Osten auch ein Krieg im Westen?",
      "Was geschieht mit Staaten, die neutral bleiben wollen?",
      "Tritt England in den Krieg ein?"
    ],
    wellen: [["d", "f", "r", "oeu"], ["bel"], ["gb"]],
    fenster: {
      1: [
        { von: "f", an: ["gb"], art: "Bitte", pflicht: true, text: "Bittet England um Hilfe." },
        { von: "f", an: ["r"], art: "Bitte", pflicht: false, text: "Bittet Russland, schnell anzugreifen, um euch zu entlasten." },
        { von: "oeu", an: ["d"], art: "Anfrage", pflicht: false, text: "Greift ihr zuerst Russland oder Frankreich an? Wir brauchen eure Hilfe im Osten." }
      ],
      2: [
        { von: "d", an: ["bel"], art: "Forderung", pflicht: true, nurWenn: { staat: "d", wahl: "A" }, text: "Nur falls ihr den Durchmarsch fordert: Schickt die Forderung als Note an Belgien." },
        { von: "bel", an: ["gb"], art: "Anfrage", pflicht: false, text: "Helft ihr uns, wenn wir den Durchmarsch ablehnen?" }
      ]
    },
    spielleitung: "Drei Wellen – die engste Runde. Wählt D den Durchmarsch, geht die Forderung in Fenster 2 als Note an Belgien; Belgien kann England dann noch um Hilfe fragen, bevor es entscheidet. GB entscheidet zuletzt.",
    staaten: {
      oeu: {
        geheim: [],
        optionen: {
          A: { text: "Weiter nur gegen Serbien kämpfen.", pro: "Wir konzentrieren uns auf unser eigentliches Ziel.", contra: "Russland marschiert – unsere Grenze im Osten ist offen." },
          B: { text: "Deutschland bitten, Russland allein aufzuhalten.", pro: "Wir können Serbien schnell besiegen.", contra: "Deutschland kämpft zuerst im Westen und braucht dort seine Truppen." },
          C: { text: "Russland den Krieg erklären.", pro: "Wir stehen zu unserem Bündnis mit Deutschland.", contra: "Wir müssen an zwei Fronten kämpfen: gegen Serbien und gegen Russland." }
        },
        historisch: "C"
      },
      d: {
        geheim: ["Nach dem Schlieffen-Plan muss Frankreich in wenigen Wochen besiegt werden. Die Grenze zu Frankreich ist stark befestigt. Der schnellste Weg führt durch Belgien."],
        optionen: {
          A: { text: "Frankreich den Krieg erklären und von Belgien den Durchmarsch fordern.", pro: "Der Schlieffen-Plan kann starten wie vorbereitet.", contra: "Belgiens Neutralität hat auch Preußen garantiert – England könnte eingreifen." },
          B: { text: "Nur gegen Russland kämpfen und im Westen abwarten.", pro: "England bleibt vielleicht neutral.", contra: "Für einen Krieg nur im Osten haben wir keinen Plan; Frankreich rüstet trotzdem." },
          C: { text: "Frankreich den Krieg erklären und direkt über die deutsch-französische Grenze angreifen.", pro: "Wir achten Belgiens Neutralität.", contra: "Die Grenze ist stark befestigt – der Angriff wäre langsam und verlustreich." }
        },
        historisch: "A"
      },
      bel: {
        geheim: [],
        hinweis: "Ihr entscheidet, nachdem Deutschland entschieden hat.",
        optionen: {
          A: { text: "Den Durchmarsch erlauben.", pro: "Unser Land bleibt vielleicht vom Krieg verschont.", contra: "Wir brechen unsere Neutralität und verlieren unsere Ehre." },
          B: { text: "Den Durchmarsch ablehnen und uns verteidigen.", pro: "Wir bleiben neutral und unabhängig.", contra: "Die deutsche Armee ist viel stärker als unsere." },
          C: { text: "Den Durchmarsch erlauben, wenn Deutschland Entschädigung zusagt.", pro: "Wir bekommen wenigstens etwas für den Schaden.", contra: "Wir wären Deutschlands Helfer im Krieg gegen Frankreich." }
        },
        historisch: "B"
      },
      r: {
        geheim: [],
        optionen: {
          A: { text: "Zuerst Österreich-Ungarn angreifen.", pro: "Wir helfen Serbien direkt.", contra: "Frankreich steht dann allein gegen Deutschlands Hauptmacht." },
          B: { text: "Schnell in Ostpreußen angreifen, auch wenn noch nicht alle Truppen bereit sind.", pro: "Wir entlasten Frankreich, unseren wichtigsten Verbündeten.", contra: "Unsere Truppen sind noch nicht vollständig bereit." },
          C: { text: "Abwarten, bis die Mobilmachung abgeschlossen ist.", pro: "Wir greifen später mit voller Kraft an.", contra: "Frankreich könnte in der Zwischenzeit geschlagen werden." }
        },
        historisch: "B"
      },
      f: {
        geheim: [],
        optionen: {
          A: { text: "Deutschland Verhandlungen anbieten.", pro: "Vielleicht lässt sich der Krieg noch aufhalten.", contra: "Deutschland macht bereits mobil – Verhandeln wirkt schwach und kostet Zeit." },
          B: { text: "Abwarten und uns auf die Verteidigung beschränken.", pro: "England sieht: Wir sind nicht die Angreifer.", contra: "Wir überlassen Deutschland den ersten Schlag." },
          C: { text: "In Elsass-Lothringen angreifen.", pro: "Wir holen vielleicht verlorenes Land zurück und binden deutsche Truppen.", contra: "Ein Angriff auf befestigte Stellungen kostet viele Soldaten." }
        },
        historisch: "C"
      },
      gb: {
        geheim: [],
        hinweis: "Ihr entscheidet zuletzt, nachdem Deutschland und Belgien entschieden haben.",
        optionen: {
          A: { text: "Deutschland ein Ultimatum stellen: Belgiens Neutralität achten – sonst Krieg.", pro: "Wir schützen Belgien und das Gleichgewicht in Europa.", contra: "Wir ziehen unser Land in einen großen Krieg." },
          B: { text: "Neutral bleiben.", pro: "Wir bleiben aus dem Krieg heraus.", contra: "Siegt Deutschland, beherrscht es den Kontinent – und die Küste gegenüber England." },
          C: { text: "Nur Frankreichs Küste mit unserer Flotte schützen.", pro: "Wir helfen Frankreich, ohne selbst an Land zu kämpfen.", contra: "Das reicht vielleicht nicht, um Frankreich zu retten." }
        },
        historisch: "A"
      }
    },
    aufloesung: [
      "2. August: Deutschland besetzt Luxemburg und fordert von Belgien den Durchmarsch. Es verspricht Entschädigung.",
      "2. August: England sagt Frankreich zu, die französische Küste mit seiner Flotte zu schützen.",
      "3. August: Belgien lehnt ab. Deutschland erklärt Frankreich den Krieg.",
      "4. August: Deutsche Truppen marschieren in Belgien ein. England stellt Deutschland ein Ultimatum und erklärt am späten Abend den Krieg.",
      "6. August: Österreich-Ungarn erklärt Russland den Krieg.",
      "Im August greift Frankreich in Elsass-Lothringen an, Russland marschiert früher als geplant in Ostpreußen ein."
    ],
    schluss: "Der britische Außenminister Grey am Abend des 3. August 1914: „In ganz Europa gehen die Lichter aus. Wir werden sie in unserem Leben nicht wieder leuchten sehen.“",
    platzhalter: [],
    abweichungen: "Häufig: BEL erlaubt den Durchmarsch gegen Entschädigung oder GB bleibt neutral. Auflösen und fragen: Warum war Belgien für England der entscheidende Punkt?"
  }
];

/* ---------- Auswertung (01, Seite 2) ---------- */
export const AUSWERTUNG = {
  titel: "Die Julikrise 1914 beurteilen",
  aufgabe: "Wählt eine Entscheidung eines Staates aus der Julikrise 1914. Beurteilt sie nach den drei Kriterien und formuliert ein begründetes Urteil.",
  kriterien: [
    { titel: "Interessen", frage: "Welche Interessen verfolgte der Staat mit dieser Entscheidung?" },
    { titel: "Möglichkeiten und Grenzen", frage: "Welche anderen Möglichkeiten hatte er? Was schränkte ihn ein (Bündnisse, Militärpläne, Zeitdruck, Ansehen)?" },
    { titel: "Folgen", frage: "Welche Folgen waren beabsichtigt? Welche waren unbeabsichtigt?" }
  ],
  satzanfaenge: [
    "Aus Sicht von … war die Entscheidung nachvollziehbar, weil …",
    "Eingeschränkt wurde … durch …",
    "Beabsichtigt war …, tatsächlich führte die Entscheidung aber zu …",
    "Insgesamt halten wir die Entscheidung für …, weil …"
  ],
  zusatz: "Hätte der Krieg verhindert werden können? Nennt eine Stelle in der Julikrise, an der ein anderer Weg möglich gewesen wäre, und begründet eure Meinung."
};
