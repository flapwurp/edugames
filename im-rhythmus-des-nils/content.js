/* Im Rhythmus des Nils 0.6 – alle Texte und Zahlen.
   Hier darf geändert werden: nur die Wörter zwischen den Anführungszeichen und die Zahlen.
   Kommas, Klammern und Namen links vom Doppelpunkt bitte stehen lassen.
   {n}, {name} usw. sind Platzhalter, die das Spiel selbst ausfüllt. */

/* ---------- Zahlen ----------
   Die Arbeitskraft sieht man im Spiel nur als Balken ohne Zahlen. Die Werte hier bestimmen,
   wie viel vom Balken eine Arbeit verbraucht. Getreide wird dagegen in Säcken gezeigt. */
export const NUM = {
  startVorrat: 0,        // Säcke im Speicher zu Beginn
  bedarf: 10,            // so viele Säcke braucht die Familie (4 Personen) in einem Jahr
  ertragGut: 4,          // Säcke je Feld bei normaler Flut (Jahr 1 und 4)
  ertragNiedrig: 3,      // Uferfeld bei zu niedriger Flut (Jahr 2)
  ertragSchadufHalb: 2,  // mittleres Feld, mit dem Schaduf halb bewässert
  ertragSchadufVoll: 4,  // mittleres Feld, mit dem Schaduf voll bewässert
  ertragSpaet: 3,        // je Feld nach zu hoher Flut (späte Aussaat, Jahr 3)
  schadufHalb: 3,        // so viele Eimer, damit das mittlere Feld überhaupt wächst
  schadufVoll: 6,        // so viele Eimer für eine volle Ernte auf dem mittleren Feld
  dorfBeitrag: 1,        // Säcke für den Dorfspeicher beim Dorfbau (nur wenn etwas übrig ist)
  dorfspeicher: 8,       // so viel kann der Dorfspeicher in Jahr 3 einer Familie geben
  kraft: 48,             // Arbeitskraft der Familie in einem Jahr (voller Balken)
  kosten: {              // Arbeitskraft für jede Arbeit
    grenzstein: 3,       //   umgeworfenen Grenzstein aufrichten (je Feld)
    grenzeStreit: 4,     //   Grenze nach dem Hochwasser neu festlegen, mit Streit (je Feld)
    pfluegen: 4,         //   ein Feld pflügen
    saeen: 2,            //   ein Feld säen
    ernten: 4,           //   ein Feld ernten
    ernteKupfer: 1,      //   ein Feld ernten mit Kupfersicheln (Weberin)
    schadufBau: 4,       //   den Schaduf bauen
    eimer: 2,            //   ein Eimer mit dem Schaduf
    korb: 3,             //   einen Korb flechten
    deichAusbessern: 2   //   Deich nach dem Hochwasser ausbessern
  },
  hungerSchwaeche: 2,    // so viel weniger Arbeitskraft im nächsten Jahr je Sack, der gefehlt hat
  hofVerlassen: 4,       // fehlen in Jahr 2 so viele Säcke (oder mehr), muss die Familie den Hof verlassen
  korbTausch: 1,         // Säcke Getreide für einen Korb (nicht nach der schlechten Flut in Jahr 2)
  toepferTausch: 3,      // Säcke für die Krüge des Töpfers (Jahr 4)
  verwalterLohn: 3       // Säcke Lohn für den Speicherverwalter (Jahr 4)
};

export const GAME = {
  title: "Im Rhythmus des Nils",
  subtitle: "Vier Jahre auf einem Bauernhof im alten Ägypten",
  leitfrage: "Das alte Ägypten – ein Geschenk des Nils?",
  intro: [
    "Du lebst mit deiner Familie am Nil. Um euch herum ist Wüste, Regen gibt es fast nie.",
    "Vier Jahre lang bestellt ihr eure drei Felder. Jede Arbeit kostet Arbeitskraft – und die Arbeitskraft deiner Familie ist begrenzt. Du erlebst, was der Nil mit euch macht.",
    "Am Ende beantwortest du die Frage: War der Nil ein Geschenk?"
  ],
  hochkant: "Halte das iPad am besten quer."
};

export const SEASONS = [
  { id: "achet",  name: "Achet",  de: "Überschwemmung" },
  { id: "peret",  name: "Peret",  de: "Aussaat und Wachstum" },
  { id: "schemu", name: "Schemu", de: "Ernte und Trockenzeit" }
];

export const UI = {
  start: "Spiel starten",
  weiter: "Weiter",
  rolle: "Papyrusrolle",
  begriffe: "Begriffe",
  pause: "Pause",
  pauseTitel: "Das Spiel ist pausiert",
  pauseText: "Tippe auf „Weiter“, wenn es weitergeht.",
  neustart: "Spiel neu beginnen",
  schliessen: "Schließen",
  jahr: "Jahr {n}",
  naechsterMonat: "Nächster Monat",
  neuAufRolle: "Neu auf deiner Papyrusrolle",
  rolleLeer: "Hier sammelst du, was du über den Nil herausfindest.",
  vorrat: "Euer Speicher",
  familie: "Deine Familie: 4 Personen",
  kraft: "Arbeitskraft deiner Familie",
  kraftErnte: "Der schraffierte Teil ist für die Ernte.",
  kraftSchwach: "Der Hunger im letzten Jahr hat deine Familie geschwächt. Ihre Arbeitskraft ist kleiner als sonst.",
  kraftWenig: "Nur noch wenig Arbeitskraft übrig.",
  kraftLeer: "Die Arbeitskraft für dieses Jahr ist aufgebraucht.",
  kraftNeu: "Während der Flut ruht die Feldarbeit. Deine Familie hat sich erholt – die Arbeitskraft ist wieder voll.",
  buchung: {
    ueberschuss: "Überschuss aus der Ernte",
    gegessen: "aus dem Vorrat gegessen",
    koerbe: "Körbe gegen Getreide getauscht",
    dorf: "Beitrag zum Dorfspeicher",
    toepfer: "Krüge gegen Getreide getauscht",
    verwalter: "Lohn für den Speicherverwalter"
  },
  saecke: "{n} Säcke",
  sack: "1 Sack",
  geste: "So geht's:"
};

/* ---------- Merksätze (Papyrusrolle) ---------- */
export const MERKSAETZE = {
  steigt:   "Vier Monate lang steigt der Nil und überschwemmt das Land.",
  schlamm:  "Zurück bleibt fruchtbarer Schlamm. Er wird untergepflügt und es wird gesät. Vier Monate später wird geerntet.",
  kraft:    "Ohne die Arbeit der Menschen wächst nichts. Pflügen, säen, ernten: Jede Arbeit kostet Arbeitskraft, und die Arbeitskraft einer Familie ist begrenzt.",
  brache:   "Danach liegen die Felder vier Monate brach. Die Menschen erledigen andere Arbeiten.",
  kalender: "Nach diesem Rhythmus teilten die Ägypter ihr Jahr in drei Jahreszeiten zu je vier Monaten.",
  niedrig:  "Steigt der Nil zu wenig, bleiben Felder trocken. Dann droht Hunger.",
  hoch:     "Steigt der Nil zu hoch, zerstört das Wasser Häuser, Vorräte und Felder.",
  deich:    "Gemeinsam bauen die Menschen Dörfer und Deiche und schützen sich so vor dem Hochwasser.",
  vorrat:   "Im Dorf werden Vorräte angelegt und an alle verteilt, die in Not sind.",
  berufe:   "Weil das Dorf Vorräte hat, müssen nicht mehr alle auf dem Feld arbeiten. Einige übernehmen eine Aufgabe, die allen hilft, und werden aus dem Vorrat versorgt. Es entstehen neue Berufe.",
  teilung:  "Wenn Menschen verschiedene Arbeiten übernehmen und tauschen, sparen alle Arbeitskraft und haben mehr. Das nennt man Arbeitsteilung."
};
export const ROLLE_REIHENFOLGE = ["steigt", "schlamm", "kraft", "brache", "kalender", "niedrig", "hoch", "deich", "vorrat", "berufe", "teilung"];

/* ---------- Texte der Phasen ---------- */
export const TEXT = {
  sirius: {
    1: { titel: "Der Sirius erscheint", text: "Kurz vor Sonnenaufgang ist der helle Stern Sirius wieder am Himmel zu sehen. Für die Menschen in Ägypten heißt das: Ein neues Jahr beginnt – und bald kommt die Flut. Noch ist der Nil niedrig, eure Felder liegen trocken.", knopf: "Das Jahr beginnt" },
    2: { titel: "Jahr 2: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr wartet auf die Flut.", knopf: "Das Jahr beginnt" },
    3: { titel: "Jahr 3: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt – zum ersten Mal lebt ihr im Dorf hinter dem Deich.", knopf: "Das Jahr beginnt" },
    4: { titel: "Jahr 4: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr wartet im Dorf auf die Flut.", knopf: "Das Jahr beginnt" }
  },
  achet: {
    1: { titel: "Achet", monate: [
      "Der Nil beginnt zu steigen. Schau auf den Nilmesser.",
      "Das Wasser steigt weiter. Bald erreicht es das erste Feld.",
      "Das Feld am Ufer und das mittlere Feld stehen unter Wasser.",
      "Höchststand. Alle drei Felder sind überschwemmt. Euer Hof liegt höher und bleibt trocken."
    ], knopf: "Das Wasser sinkt" },
    2: { titel: "Jahr 2, Achet", monate: [
      "Der Nil beginnt zu steigen – wie jedes Jahr.",
      "Das Wasser steigt nur langsam. Jeden Tag schaut deine Familie auf den Nilmesser.",
      "Eigentlich müsste das Wasser längst höher stehen. Alle hoffen auf mehr.",
      "Höchststand – aber unter der Marke. Nur das Feld am Ufer wird überschwemmt. Mehr Wasser kommt nicht."
    ], knopf: "Das Wasser sinkt" },
    3: { titel: "Jahr 3, Achet", monate: [
      "Der Nil beginnt zu steigen – schneller als sonst.",
      "Das Wasser steigt und steigt. Alle drei Felder stehen schon unter Wasser.",
      "Das Wasser steht schon höher als in einem guten Jahr – über der Marke „gut“. Und es steigt weiter.",
      "Höchststand – weit über der Marke. Das Wasser reicht bis an die Krone des Deiches. Die Feldhütte am oberen Feld wird weggerissen. Hinter dem Deich bleibt das Dorf trocken."
    ], knopf: "Das Wasser sinkt" },
    4: { titel: "Jahr 4, Achet", monate: [
      "Der Nil beginnt zu steigen. Alle schauen auf den Nilmesser.",
      "Das Wasser steigt gleichmäßig.",
      "Das Feld am Ufer und das mittlere Feld stehen unter Wasser.",
      "Höchststand – genau an der Marke „gut“. Alle drei Felder sind überschwemmt. Ein gutes Jahr!"
    ], knopf: "Weiter" }
  },
  aussaat: {
    1: { titel: "Peret: Die Felder bestellen", text: "Das Wasser ist zurückgegangen. Auf den Feldern liegt schwarzer, nasser Schlamm. Die Flut hat die Grenzsteine umgeworfen. Bestelle jedes Feld – jede Arbeit kostet Arbeitskraft. Achte auf den Balken." },
    2: { titel: "Jahr 2, Peret: Die Felder bestellen", text: "Bestellt die Felder, die genug Wasser bekommen haben." },
    3: { titel: "Jahr 3, Peret: Die Grenzen sind fort", text: "Das Wasser stand zwei Monate länger auf den Feldern. Die Flut hat alle Grenzsteine fortgespült. Mit den Nachbarn streitet ihr: Wo war die Grenze? Ihr messt mühsam selbst nach. Das kostet Zeit und Arbeitskraft. Dann schnell pflügen und säen!" },
    4: { titel: "Jahr 4, Peret: Die Felder bestellen", text: "Wieder liegt fruchtbarer Schlamm auf den Feldern. Die Flut hat die Grenzsteine umgeworfen." },
    landvermesser: "Euer Landvermesser hat die Felder schon neu ausgemessen und die Grenzsteine gesetzt. Kein Streit, und ihr spart die Arbeitskraft dafür.",
    schritte: {
      grenzstein: { name: "Grenzstein aufrichten", hint: "Wische auf dem Stein nach oben." },
      grenzeNeu:  { name: "Grenze neu festlegen", hint: "Zieh das Messseil vom Stein aus am Feld entlang bis zum Ende." },
      pfluegen:   { name: "pflügen", hint: "Zieh das Rindergespann mit dem Finger über das ganze Feld." },
      saeen:      { name: "säen", hint: "Wische hin und her über das Feld, bis überall Saat liegt." }
    },
    spaeter: "später ernten",
    namen: ["Feld am Ufer", "mittleres Feld", "oberes Feld"],
    fertig: "Alle Felder bestellt",
    zuTrocken: "Zu trocken: Hierhin ist kein Wasser gekommen. Ohne Wasser wächst nichts.",
    zuHoch: "Das obere Feld liegt zu hoch. Das Wasser aus dem Graben kommt nicht hinauf.",
    schonGesaet: "Dieses Feld ist schon gesät.",
    keineKraft: "Dafür reicht eure Arbeitskraft nicht mehr. Ein Feld bestellt ihr nur, wenn ihr es auch ernten könnt.",
    nichtBestellt: "keine Arbeitskraft mehr",
    zuTrockenKurz: "zu trocken",
    bestellt: "gesät",
    tippen: "Nicht tippen – wische! "
  },
  wachsen: {
    monate: ["Die ersten Keime sind zu sehen.", "Die Halme wachsen.", "Die Ähren bilden sich."],
    fertig: "Vier Monate sind vergangen. Das Getreide ist reif.",
    2: "Wo kein Wasser hingekommen ist, bleibt die Erde kahl und rissig.",
    3: "Weil spät gesät wurde, bleiben die Halme kürzer als sonst.",
    zur: "Zur Ernte"
  },
  ernte: {
    titel: "Schemu: Ernte",
    text: "Wische über ein Feld, um es zu ernten. Deine Familie schneidet das Getreide mit Sicheln und trägt es in den Speicher.",
    3: "Spät, aber endlich: Ernte. Die Halme sind kurz, die Ähren klein. Wische über die Felder.",
    kupfer: "Mit den Kupfersicheln aus dem Tausch gegen Leinen geht die Ernte viel schneller. Schau auf den Balken.",
    hint: "Wische mit der Sichel durch die Halme, bis das ganze Feld abgeerntet ist.",
    nichts: "Hier gibt es nichts zu ernten.",
    geerntet: "Geerntet: {n} Säcke",
    fertig: "Alles eingebracht"
  },
  versorgung: {
    titel: "Reicht es für ein Jahr?",
    ernte: "Ihr habt {n} Säcke geerntet.",
    bedarf: "Deine Familie braucht {n} Säcke, um ein Jahr lang satt zu werden.",
    satt: "Es reicht. {n} Säcke kommen als Vorrat in den Speicher.",
    knapp: "Die Ernte allein reicht nicht. Ihr nehmt {n} Säcke aus dem Vorrat. Es reicht gerade so.",
    hunger: "Es fehlen {n} Säcke. Der Vorrat ist aufgebraucht. Bis zur nächsten Ernte hat deine Familie oft zu wenig zu essen.",
    nachbarn: "Den Nachbarn geht es genauso. Niemand hat etwas übrig, um euch zu helfen.",
    geholfen: "Die Ernte war klein. Aus dem Dorfspeicher bekommt deine Familie {n} Säcke. Auch andere Familien werden versorgt. Niemand muss hungern.",
    dorfAndere: "Andere Familien im Dorf hatten weniger. Sie bekommen Getreide aus dem Dorfspeicher. Niemand muss hungern."
  },
  trockenzeit: {
    titel: { 1: "Schemu: Die Felder liegen brach", 3: "Jahr 3, Trockenzeit", 4: "Jahr 4, Trockenzeit" },
    text: "Die Felder sind abgeerntet. Bis zur nächsten Flut wächst hier nichts. Was macht deine Familie mit der übrigen Arbeitskraft?",
    arbeiten: {
      ausbessern: { name: "Den Deich ausbessern", text: "Das Hochwasser hat am Deich gerissen. Jede Familie hilft beim Ausbessern – das geht vor.", hint: "Zieh einen Korb mit Erde vom Haufen auf den Deich.", fertig: "Der Deich ist wieder dicht.", nachbarn: "Eure Arbeitskraft ist aufgebraucht. Die Nachbarn bessern den Deich für euch mit aus." },
      koerbe:     { name: "Körbe flechten und tauschen", text: "Aus Schilf vom Nilufer flechtet ihr Körbe. Die Nachbarn geben euch für jeden Korb {n} Sack Getreide.", hint: "Wische im Zickzack über den Korb." }
    },
    pflichtZuerst: "Zuerst die Arbeit am Deich – das Dorf verlässt sich auf euch.",
    keineKraft: "Für einen weiteren Korb reicht eure Arbeitskraft nicht mehr.",
    gemacht: "Diese Trockenzeit: {liste}.",
    ende: "Trockenzeit beenden",
    toepfer: "Euer Töpfer hat aus Nilschlamm Krüge geformt und gebrannt. Ein Händler aus dem Nachbardorf tauscht sie gegen {n} Säcke Getreide.",
    verwalter: "Euer Speicherverwalter misst jede Ernte, schreibt auf, was jede Familie abgibt und bekommt, und hält den Dorfspeicher für das nächste schlechte Jahr bereit. Für diese Arbeit bekommt deine Familie {n} Säcke Lohn aus dem Dorfspeicher.",
    weberin: "Eure Weberin hat Leinen gewebt. Das Dorf hat es gegen Kupfersicheln getauscht. Mit ihnen hat die Ernte viel weniger Arbeitskraft gekostet – darum ist jetzt mehr übrig.",
    landvermesser: "Euer Landvermesser hat nach der Flut alle Felder ausgemessen und die Grenzsteine gesetzt. Es gab keinen Streit, und ihr habt Arbeitskraft gespart – darum ist jetzt mehr übrig."
  },
  jahresende: {
    1: { titel: "Ein Jahr ist vorbei", text: "Flut, Aussaat und Ernte, Trockenzeit – und dann erscheint wieder der Sirius. Achet, Peret, Schemu: Jede Jahreszeit dauert vier Monate.", knopf: "Weiter zu Jahr 2" },
    3: { titel: "Gemeinsam überstanden", text: "Das Hochwasser hat Häuser in der Gegend fortgerissen. Euer Dorf stand sicher hinter dem Deich. Der Dorfspeicher hat alle versorgt, die zu wenig hatten. Allein hätte deine Familie dieses Jahr kaum geschafft.", knopf: "Weiter zu Jahr 4" },
    4: { titel: "Vier Jahre sind vorbei", text: "Jahr 1 und Jahr 4 hatten die gleiche, gute Flut. Vergleiche in der Bilanz, was anders war.", knopf: "Zur Bilanz" }
  },
  schadufWahl: {
    titel: "Jahr 2, Peret: Eine neue Erfindung",
    text: "Das mittlere und das obere Feld sind trocken geblieben. Nur im Graben am Uferfeld steht noch Wasser. Ein Nachbar zeigt euch eine Erfindung: den Schaduf – einen langen Hebel mit Eimer und Gegengewicht. Damit kann man Wasser aus dem Graben auf das mittlere Feld heben.",
    optionen: {
      bauen: { name: "Den Schaduf bauen", text: "Aus Palmholz und Seil. Das Bauen und jeder Eimer kosten Arbeitskraft." },
      lassen: { name: "Keinen Schaduf bauen", text: "Ihr spart Arbeitskraft. Das mittlere Feld bleibt trocken." }
    },
    gebaut: "Ihr baut den Schaduf am Rand des mittleren Feldes.",
    gelassen: "Ihr spart eure Arbeitskraft. Das mittlere Feld bleibt in diesem Jahr trocken."
  },
  schaduf: {
    titel: "Jahr 2, Peret: Der Schaduf",
    text: "Zieh das Seil nach unten und lass los: Das Gegengewicht hebt den Eimer, das Wasser fließt aufs Feld. Ab {h} Eimern kann das Feld gesät werden, mit {v} Eimern bringt es eine volle Ernte.",
    plan: "Jeder Eimer kostet Arbeitskraft. Schau auf den Balken.",
    eimer: "Eimer: {n}",
    halb: "Das mittlere Feld ist feucht genug für eine kleine Ernte.",
    voll: "Das mittlere Feld ist gut bewässert. Mehr Wasser braucht es nicht.",
    muede: "Eimer für Eimer – harte Arbeit für die ganze Familie.",
    weiter: "Weiter zur Aussaat",
    hint: "Zieh am Seil nach unten und lass los."
  },
  dorfRat: {
    titel: "Jahr 2, Trockenzeit: Die Familien beraten",
    text: "Nach diesem schlechten Jahr treffen sich alle Familien. Die Ältesten zeigen am Nilmesser eine alte Marke ganz oben: So hoch stand der Nil einmal, als er Häuser fortriss. Allein kommt keine Familie gegen den Nil an – nicht gegen zu wenig Wasser und nicht gegen zu viel. Sie beschließen: Wir bauen gemeinsam ein Dorf, mit einem Deich und einem gemeinsamen Speicher.",
    knopf: "Gemeinsam ein Dorf bauen"
  },
  dorfbau: {
    titel: "Jahr 2: Ihr baut gemeinsam ein Dorf",
    text: "Alle Familien packen mit an. Deine Familie arbeitet mit, bis ihre Arbeitskraft für dieses Jahr aufgebraucht ist. Wer im Jahr schon viel gearbeitet hat, kann weniger beitragen – die anderen gleichen das aus.",
    schritte: {
      deich:    { name: "Den Deich aufschütten", hint: "Zieh Körbe mit Erde vom Haufen auf den Deich.", fertig: "Der Deich steht." },
      haeuser:  { name: "Häuser bauen", hint: "Zieh Körbe mit Lehmziegeln zu den Häusern.", fertig: "Die Häuser stehen hinter dem Deich." },
      speicher: { name: "Den Dorfspeicher bauen und füllen", hint: "Zieh den Korb mit Getreide in den Dorfspeicher.", fertig: "Im gemeinsamen Speicher liegt jetzt ein Vorrat für das ganze Dorf." }
    },
    beitrag: "Ihr gebt {n} Sack aus eurem Speicher in den Dorfspeicher.",
    keinBeitrag: "Ihr habt kein Getreide übrig. Familien mit mehr Vorrat geben mehr.",
    fertig: "Allein hätte das Jahre gedauert. Gemeinsam war es in einer Trockenzeit geschafft.",
    weiter: "Weiter zu Jahr 3"
  },
  verloren: {
    titel: "Deine Familie muss den Hof verlassen",
    text: "Es fehlte so viel Getreide, dass deine Familie nicht bis zur nächsten Ernte durchhalten kann. Sie gibt den Hof auf und zieht zu Verwandten.",
    gruende: "Wie es dazu kam:",
    flut: "Die Flut in Jahr 2 war zu niedrig. Es fehlten {n} Säcke.",
    koerbe: "In der Trockenzeit von Jahr 1 habt ihr nur {n} Körbe geflochten und getauscht. Euer Vorrat war klein.",
    keineKoerbe: "In der Trockenzeit von Jahr 1 habt ihr keine Körbe geflochten und getauscht. Ihr hattet kaum Vorrat.",
    schaduf: "Ihr habt keinen Schaduf gebaut. Das mittlere Feld blieb trocken.",
    eimer: "Mit dem Schaduf habt ihr nur wenig Wasser geschöpft.",
    nochmal: "Noch einmal ab der Trockenzeit in Jahr 1",
    versuch: "Neuer Versuch: Du bist wieder in der Trockenzeit nach der ersten Ernte."
  },
  beruf: {
    titel: "Jahr 4, Achet: Die Familien beraten",
    text: "Die Felder stehen unter Wasser, die Feldarbeit ruht. Die Flut ist gut – alle erwarten eine gute Ernte, und der Dorfspeicher kann wieder gefüllt werden. Die Familien überlegen, was im letzten Jahr besonders viel Arbeitskraft gekostet hat. Sie beschließen: Einige übernehmen nur noch eine Aufgabe, die allen hilft. Die anderen versorgen sie dafür mit Getreide aus dem Dorfspeicher. Wer aus deiner Familie übernimmt einen Beruf?",
    optionen: {
      toepfer: { name: "Töpfer", text: "Im letzten Jahr fehlten Krüge für die Vorräte. Er formt Krüge aus Nilschlamm, die das Dorf auch bei Händlern gegen Getreide tauscht." },
      weberin: { name: "Weberin", text: "Die Ernte mit den alten Sicheln war mühsam. Sie webt Leinen aus Flachs, das Dorf tauscht es gegen Sicheln aus Kupfer." },
      landvermesser: { name: "Landvermesser", text: "Nach dem Hochwasser gab es Streit um die Grenzen. Er misst nach jeder Flut die Felder aus und setzt die Grenzsteine." },
      verwalter: { name: "Speicherverwalter", text: "Beim Verteilen aus dem Dorfspeicher war nicht klar, wer wie viel bekommt. Er misst, schreibt alles auf und gibt gerecht aus." }
    },
    ergebnis: "Jemand aus deiner Familie arbeitet jetzt als {name}. Die anderen bestellen weiter eure Felder. Was das bringt, merkt ihr in diesem Jahr.",
    weiter: "Das Wasser sinkt"
  }
};

/* ---------- Bilanz ---------- */
export const BILANZ = {
  titel: "Vier Jahre am Nil",
  rolle: "Deine Papyrusrolle",
  tabelle: "Deine vier Jahre",
  zeilen: {
    flut: "Flut",
    ernte: "Ernte",
    kraft: "Wofür die Arbeitskraft gebraucht wurde",
    hilfe: "Hilfe von anderen",
    ergebnis: "Ergebnis",
    vorrat: "Vorrat am Jahresende"
  },
  kraftTeile: { felder: "Felder", schaduf: "Schaduf", dorf: "Dorf und Deich", koerbe: "Körbe", frei: "übrig" },
  flut: { gut: "gut", niedrig: "zu niedrig", hoch: "zu hoch" },
  vergleich: "Jahr 1 und Jahr 4: gleiche Flut",
  vergleichText: "Durch den Beruf in deiner Familie kamen in Jahr 4 {n} Säcke mehr in euren Speicher. {grund}",
  gruende: {
    toepfer: "Die Krüge eures Töpfers wurden gegen Getreide getauscht.",
    weberin: "Mit den Kupfersicheln (gegen Leinen getauscht) kostete die Ernte weniger Arbeitskraft. Mit der übrigen Kraft hat deine Familie Körbe geflochten.",
    landvermesser: "Der Landvermesser hat die Grenzsteine gesetzt. Mit der gesparten Kraft hat deine Familie Körbe geflochten.",
    verwalter: "Der Speicherverwalter bekam Lohn aus dem Dorfspeicher."
  },
  entscheidungen: "Deine Entscheidungen",
  weiter: "Weiter zur Quelle"
};

/* ---------- Quelle M3 – PLATZHALTER ---------- */
export const QUELLE = {
  placeholder: true,
  titel: "M3 Ein ägyptisches Lied über den Nil (2. Jahrtausend v. Chr.)",
  angabe: "Übersetzung folgt (gemeinfreie Fassung, z. B. A. Erman 1923)",
  bloecke: [
    { text: "[Platzhalter Block 1: Begrüßung des Nils – er ist gekommen, um Ägypten am Leben zu erhalten]" },
    { text: "[Platzhalter Block 2: Er lässt Gerste und Bohnen wachsen]" },
    { text: "[Platzhalter Block 3: Wenn er träge ist, werden alle arm, und das Land wird krank]" },
    { text: "[Platzhalter Block 4: Er kommt regelmäßig zu seiner Zeit]" },
    { text: "[Platzhalter Block 5: Man bringt ihm Opfer und ruft ihn: Komm nach Ägypten!]" }
  ]
};

export const QUELLTEXT = {
  titel: "Was sagten die Menschen damals?",
  text: "M3 ist eine Quelle: ein Lied, das Menschen im alten Ägypten über den Nil gesungen haben. Lies es und ordne dann die Aussagen ein.",
  frage: "Ordne die Aussagen zu",
  anleitung: "Zieh jede Aussage an die Stelle im Lied, wo sie steht – oder in das Feld „Steht nicht im Lied“. Du kannst auch erst eine Aussage antippen und dann die Stelle.",
  nichtFeld: "Steht nicht im Lied – das zeigt nur mein Spiel",
  ablegen: "hier ablegen",
  falsch: "Das passt hier nicht. ",
  richtig: "Genau.",
  nochmal: "Schau noch einmal ins Lied.",
  sagt: "Das sagt die Quelle",
  spiel: "Das zeigt dein Spiel – die Quelle belegt es nicht",
  schluss: "Im Lied kommt die Arbeit der Menschen nicht vor. Warum wohl? Denk daran: Das Lied ist ein Gebet an den Nil, den die Menschen als Gott verehrten.",
  weiter: "Weiter zum Urteil"
};

export const AUSSAGEN = [
  { text: "Der Nil erhält Ägypten am Leben.", imLied: true, stelle: 0,
    erklaerung: "Das steht gleich am Anfang des Liedes.", tipp: "Lies noch einmal den Anfang des Liedes." },
  { text: "Der Nil lässt Gerste und Bohnen wachsen.", imLied: true, stelle: 1,
    erklaerung: "Das Lied nennt Pflanzen, die durch den Nil wachsen.", tipp: "Such im Lied nach Pflanzen." },
  { text: "Bringt der Nil zu wenig Wasser, werden die Menschen arm.", imLied: true, stelle: 2,
    erklaerung: "Auch das Lied kennt die Gefahr, wenn die Flut ausbleibt – wie in deinem Jahr 2.", tipp: "Lies, was passiert, wenn der Nil „träge“ ist." },
  { text: "Der Nil kommt regelmäßig, jedes Jahr zu seiner Zeit.", imLied: true, stelle: 3,
    erklaerung: "Das Lied lobt, dass der Nil pünktlich kommt – wie im Kalender.", tipp: "Such im Lied nach einer Stelle über die Zeit." },
  { text: "Die Menschen bringen dem Nil Opfer und bitten ihn zu kommen.", imLied: true, stelle: 4,
    erklaerung: "Das Lied ist ein Gebet: Die Menschen verehren den Nil als Gott.", tipp: "Lies noch einmal den letzten Teil des Liedes." },
  { text: "Die Bauern müssen pflügen, säen und Wasser schöpfen.", imLied: false,
    erklaerung: "Das hast du im Spiel erlebt. Im Lied kommt die Arbeit der Bauern nicht vor.", tipp: "Such im Lied nach Arbeit. Findest du etwas? Vielleicht kennst du das aus dem Spiel." },
  { text: "Eine zu hohe Flut kann Häuser und Felder zerstören.", imLied: false,
    erklaerung: "Das hast du in Jahr 3 erlebt. Das Lied nennt nur die Gefahr, wenn zu wenig Wasser kommt.", tipp: "Das Lied nennt eine Gefahr. Ist es zu viel oder zu wenig Wasser?" },
  { text: "Die Menschen schließen sich zu Dörfern zusammen und bauen Deiche.", imLied: false,
    erklaerung: "Das zeigt dein Spiel. Das Lied sagt nichts darüber.", tipp: "Kommen Dörfer oder Deiche im Lied vor?" }
];

/* ---------- Urteil ---------- */
export const URTEIL = {
  titel: "War der Nil ein Geschenk?",
  text: "Wähle für jede Zeile einen Beleg. Dann schreibst du dein Urteil ins Heft.",
  wahlSpiel: "Ein Beleg aus deinem Spiel",
  wahlQuelle: "Ein Beleg aus dem Lied (M3)",
  wahlAllerdings: "Allerdings …",
  gelaender: [
    "Der Nil war für die Menschen im alten Ägypten ein Geschenk, weil …",
    "Das zeigt sich daran, dass …",
    "Auch im Lied (M3) heißt es, dass …",
    "Allerdings …"
  ],
  eigene: "deine eigene Begründung",
  stichpunkt: "Stichpunkt: ",
  heft: "Schreibe dein Urteil jetzt ins Heft. Du darfst auch zu einem anderen Ergebnis kommen, zum Beispiel: „Der Nil war nur zum Teil ein Geschenk, weil …“",
  impulsKnopf: "Fertig? Noch ein Denkanstoß"
};

export const QUELLE_BELEGE = [
  "der Nil Ägypten am Leben erhält",
  "durch den Nil Gerste und Bohnen wachsen",
  "der Nil jedes Jahr zu seiner Zeit kommt",
  "die Menschen arm werden, wenn der Nil ausbleibt"
];

export const ALLERDINGS = [
  "ohne die Arbeit der Menschen gab es keine Ernte",
  "die Flut war nicht jedes Jahr gleich – mal zu niedrig, mal zu hoch",
  "erst Dörfer, Deiche und Vorräte machten das Leben am Nil sicherer",
  "das Lied ist ein Gebet und lobt den Nil – über die Arbeit der Bauern sagt es nichts"
];

/* Belege aus dem Spiel – das Spiel wählt die passenden aus */
export const SPIELBELEGE = {
  schlamm: "nach der Flut fruchtbarer Schlamm auf den Feldern lag und dort Getreide wuchs",
  ernte1: "wir im normalen Jahr {n} Säcke geerntet haben – genug für ein ganzes Jahr",
  kraft: "jede Arbeit auf dem Feld Arbeitskraft gekostet hat und unsere Kraft nicht für alles gereicht hat",
  niedrig: "in Jahr 2 die Flut zu niedrig war und Felder trocken blieben",
  hunger: "meine Familie in Jahr 2 hungern musste",
  knapp: "in Jahr 2 die Ernte nicht gereicht hat und wir vom Vorrat leben mussten",
  schaduf: "wir in Jahr 2 mit dem Schaduf Eimer für Eimer Wasser schöpfen mussten",
  hoch: "in Jahr 3 die Flut zu hoch war und die Feldhütte fortriss",
  deich: "der Deich in Jahr 3 das Dorf vor dem Hochwasser geschützt hat",
  speicher: "der Dorfspeicher in Jahr 3 allen Familien geholfen hat, die zu wenig hatten",
  beruf: "durch die Arbeitsteilung im Dorf in Jahr 4 mehr übrig blieb als in Jahr 1"
};

export const IMPULS = {
  titel: "Das Spiel ist eine Darstellung",
  text: "Dieses Spiel wurde heute gemacht. Es zeigt das alte Ägypten vereinfacht. Was war damals wohl anders als im Spiel?",
  zurueck: "Zurück zum Urteil",
  fragen: [
    { frage: "Im Spiel entstehen das Dorf und die Berufe in zwei Jahren. Wie lange hat das wohl wirklich gedauert?",
      hinweis: "Dörfer und Berufe am Nil entstanden über viele Generationen. Das Spiel drängt diese lange Zeit in vier Jahre zusammen." },
    { frage: "Den Schaduf nutzten die Ägypter erst etwa ab 2000 v. Chr. – lange nach den ersten Dörfern. Warum zeigt ihn das Spiel trotzdem?",
      hinweis: "Spiele wählen aus und ordnen neu, damit man etwas erleben kann. Hier soll man spüren, wie viel Arbeit Bewässerung kostete." },
    { frage: "Wer bestimmte, wie viel Land eine Familie hatte?",
      hinweis: "Im Spiel hat deine Familie einfach drei Felder. Damals gehörte viel Land Tempeln, Beamten oder dem Pharao." },
    { frage: "Konnten die Menschen damals wissen, wie hoch die Flut wird?",
      hinweis: "Sie beobachteten den Fluss, maßen den Wasserstand und verglichen ihn mit früheren Jahren – sicher wissen konnten sie es nicht." },
    { frage: "Im Spiel hat deine Familie jedes Jahr gleich viel Arbeitskraft. War das damals wohl so?",
      hinweis: "Wie viel eine Familie schaffte, hing von vielem ab: Wie viele Menschen mithalfen, ob jemand krank war, ob sie Rinder hatten. Das Spiel vereinfacht das, damit man die Jahre vergleichen kann." }
  ]
};

/* ---------- Begriffe (immer über „Begriffe“ erreichbar) ---------- */
export const BEGRIFFE = [
  ["Achet, Peret, Schemu", "die drei Jahreszeiten im ägyptischen Kalender: Überschwemmung, Aussaat und Wachstum, Ernte und Trockenzeit – je vier Monate"],
  ["Sirius", "ein heller Stern; wenn er im Sommer kurz vor Sonnenaufgang erscheint, beginnt das ägyptische Jahr"],
  ["Nilmesser", "eine Säule mit Kerben am Fluss; daran sieht man, wie hoch das Wasser steigt"],
  ["Nilschwemme / Flut", "jedes Jahr steigt der Wasserstand des Nils, die Felder werden überschwemmt"],
  ["Schlamm", "bleibt nach der Flut auf den Feldern liegen und macht sie fruchtbar"],
  ["pflügen", "die Erde aufreißen und den Schlamm unterarbeiten, damit gesät werden kann"],
  ["Aussaat", "Samen in die Erde bringen"],
  ["brach liegen", "ein Feld wird nicht bestellt; auf ihm wächst nichts"],
  ["Schaduf", "ein Gerät mit langem Hebel und Gegengewicht, mit dem man Wasser in Eimern hochhebt"],
  ["Graben", "eine Rinne, in der Wasser fließt oder stehen bleibt"],
  ["Deich", "ein Damm aus Erde, der Häuser und Felder vor Hochwasser schützt"],
  ["Vorrat", "Getreide, das man für später speichert"],
  ["Überschuss", "was übrig bleibt, wenn alle satt sind"],
  ["Arbeitskraft", "wie viel Arbeit eine Familie in einem Jahr schaffen kann; im Spiel zeigt sie der Balken"],
  ["Grenzstein", "ein Stein am Rand eines Feldes; er zeigt, wo ein Feld aufhört und das nächste anfängt"],
  ["Kupfer", "ein Metall; Sicheln aus Kupfer schneiden besser als Sicheln aus Feuerstein"],
  ["Arbeitsteilung", "nicht alle machen dasselbe: Manche bauen Getreide an, andere töpfern, weben oder vermessen Land – und sie tauschen untereinander"]
];
