/* Im Rhythmus des Nils 0.4 – alle Texte und Zahlen.
   Hier darf geändert werden: nur die Wörter zwischen den Anführungszeichen und die Zahlen.
   Kommas, Klammern und Namen links vom Doppelpunkt bitte stehen lassen.
   {n}, {k} usw. sind Platzhalter, die das Spiel selbst ausfüllt. */

/* ---------- Zahlen ---------- */
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
  dorfBeitrag: 1,        // Säcke für den Dorfspeicher beim Einzug ins Dorf (falls vorhanden)
  dorfspeicher: 8,       // so viel kann der Dorfspeicher in Jahr 3 einer Familie geben
  kraft: 22,             // Arbeitskraft der Familie in einem Jahr
  kosten: {              // Arbeitskraft für jede Arbeit
    grenzstein: 1,       //   umgeworfenen Grenzstein aufrichten (je Feld)
    grenzeStreit: 2,     //   Grenze nach dem Hochwasser neu festlegen (je Feld)
    pfluegen: 2,         //   ein Feld pflügen
    saeen: 1,            //   ein Feld säen
    ernten: 2,           //   ein Feld ernten
    ernteKupfer: 1,      //   ein Feld ernten mit Kupfersicheln (Weberin)
    schadufBau: 2,       //   den Schaduf bauen
    eimer: 1,            //   ein Eimer mit dem Schaduf
    korb: 1,             //   einen Korb flechten
    erdwall: 4,          //   Erdwall um den Hof (insgesamt, auch über zwei Jahre)
    deich: 4,            //   Anteil einer Familie am Deich
    deichAusbessern: 1,  //   Deich nach dem Hochwasser ausbessern
    haus: 8              //   zerstörtes Haus wieder aufbauen
  },
  hausLadung: 2,         // so viel Kraft kostet eine Ladung Lehmziegel beim Hausbau
  korbTausch: 1,         // Säcke Getreide für einen Korb (nur in guten Jahren)
  toepferTausch: 3,      // Säcke für die Krüge des Töpfers (Jahr 4)
  verwalterLohn: 3       // Säcke Lohn für den Speicherverwalter (Jahr 4)
};

export const GAME = {
  title: "Im Rhythmus des Nils",
  subtitle: "Vier Jahre auf einem Bauernhof im alten Ägypten",
  leitfrage: "Das alte Ägypten – ein Geschenk des Nils?",
  intro: [
    "Du lebst mit deiner Familie am Nil. Um euch herum ist Wüste, Regen gibt es fast nie.",
    "Vier Jahre lang bestellt ihr eure drei Felder. Jede Arbeit kostet Kraft – und eure Kraft ist begrenzt. Du entscheidest, was deine Familie tut, und erlebst, was der Nil mit euch macht.",
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
  kraft: "Arbeitskraft",
  kraftRest: "{n} von {k} übrig",
  kraftReserve: "{n} davon braucht ihr noch, um eure Felder fertig zu bestellen und zu ernten.",
  kraftNeu: "Ein neues Jahr: Deine Familie hat wieder {k} Kraft.",
  kraftSchuld: "Im letzten Jahr ist Arbeit am Deich liegen geblieben: {n} Kraft holt ihr in der Trockenzeit nach.",
  verbrauch: {
    felder: "Felder",
    schaduf: "Schaduf",
    schutz: "Deich, Erdwall, Haus",
    koerbe: "Körbe",
    nachholen: "Deich nachgeholt"
  },
  buchung: {
    ueberschuss: "Überschuss aus der Ernte",
    gegessen: "aus dem Vorrat gegessen",
    koerbe: "Körbe gegen Getreide getauscht",
    dorf: "Beitrag zum Dorfspeicher",
    flut: "vom Hochwasser verdorben",
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
  kraft:    "Ohne die Arbeit der Menschen wächst nichts. Pflügen, säen, ernten: Jede Arbeit kostet Kraft, und die Kraft einer Familie ist begrenzt.",
  brache:   "Danach liegen die Felder vier Monate brach. Die Menschen erledigen andere Arbeiten.",
  kalender: "Nach diesem Rhythmus teilten die Ägypter ihr Jahr in drei Jahreszeiten zu je vier Monaten.",
  niedrig:  "Steigt der Nil zu wenig, bleiben Felder trocken. Dann droht Hunger.",
  hoch:     "Steigt der Nil zu hoch, zerstört das Wasser Häuser, Vorräte und Felder.",
  deich:    "Gemeinsam bauen die Menschen Dörfer und Deiche und schützen sich so vor dem Hochwasser.",
  vorrat:   "Im Dorf werden Vorräte angelegt und an alle verteilt, die in Not sind.",
  berufe:   "Weil das Dorf Vorräte hat und gemeinsam arbeitet, müssen nicht mehr alle auf dem Feld arbeiten. Es entstehen neue Berufe.",
  teilung:  "Wenn Menschen verschiedene Arbeiten übernehmen und tauschen, sparen alle Kraft und haben mehr. Das nennt man Arbeitsteilung."
};
export const ROLLE_REIHENFOLGE = ["steigt", "schlamm", "kraft", "brache", "kalender", "niedrig", "hoch", "deich", "vorrat", "berufe", "teilung"];

/* ---------- Texte der Phasen ---------- */
export const TEXT = {
  sirius: {
    1: { titel: "Der Sirius erscheint", text: "Kurz vor Sonnenaufgang ist der helle Stern Sirius wieder am Himmel zu sehen. Für die Menschen in Ägypten heißt das: Ein neues Jahr beginnt – und bald kommt die Flut. Noch ist der Nil niedrig, eure Felder liegen trocken.", knopf: "Das Jahr beginnt" },
    2: { titel: "Jahr 2: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr wartet auf die Flut.", knopf: "Das Jahr beginnt" },
    3: { titel: "Jahr 3: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt – zum ersten Mal lebt ihr im Dorf.", knopf: "Das Jahr beginnt" },
    "3allein": { titel: "Jahr 3: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr lebt weiter allein auf eurem Hof. Die Nachbarn wohnen jetzt im Dorf hinter dem Deich.", knopf: "Das Jahr beginnt" },
    4: { titel: "Jahr 4: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Im Dorf arbeitet jetzt jemand aus deiner Familie als {beruf}.", knopf: "Das Jahr beginnt" },
    "4allein": { titel: "Jahr 4: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr lebt weiter allein auf eurem Hof.", knopf: "Das Jahr beginnt" }
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
      "Das Wasser steht schon höher als in einem guten Jahr – über der Marke „gut“. Und es steigt weiter."
    ],
      dorf: "Höchststand – weit über der Marke. Das Wasser reicht bis an die Krone des Deiches. Die Feldhütte am oberen Feld wird weggerissen. Hinter dem Deich bleibt das Dorf trocken.",
      wall: "Höchststand – weit über der Marke. Das Wasser steht bis an euren Erdwall. Er hält! Haus und Speicher bleiben trocken. Auch das Dorf der Nachbarn hinter dem Deich bleibt trocken.",
      ohne: "Höchststand – weit über der Marke. Das Wasser reißt die Lehmmauern eures Hauses ein und dringt in den Speicher. Euer Hof ist zerstört, der Vorrat verdorben. Die Nachbarn im Dorf hinter dem Deich bleiben trocken.",
      halbWall: "Euer Erdwall war nicht fertig geworden.",
      knopf: "Das Wasser sinkt" },
    4: { titel: "Jahr 4, Achet", monate: [
      "Der Nil beginnt zu steigen. Alle schauen auf den Nilmesser.",
      "Das Wasser steigt gleichmäßig.",
      "Das Feld am Ufer und das mittlere Feld stehen unter Wasser.",
      "Höchststand – genau an der Marke „gut“. Alle drei Felder sind überschwemmt. Ein gutes Jahr!"
    ], knopf: "Das Wasser sinkt" }
  },
  aussaat: {
    1: { titel: "Peret: Die Felder bestellen", text: "Das Wasser ist zurückgegangen. Auf den Feldern liegt schwarzer, nasser Schlamm. Die Flut hat die Grenzsteine umgeworfen. Bestelle jedes Feld – jede Arbeit kostet Kraft." },
    2: { titel: "Jahr 2, Peret: Die Felder bestellen", text: "Bestellt die Felder, die genug Wasser bekommen haben." },
    3: { titel: "Jahr 3, Peret: Die Grenzen sind fort", text: "Das Wasser stand zwei Monate länger auf den Feldern. Die Flut hat alle Grenzsteine fortgespült. Mit den Nachbarn streitet ihr: Wo war die Grenze? Ihr messt mühsam selbst nach. Das kostet Zeit und Kraft. Dann schnell pflügen und säen!" },
    4: { titel: "Jahr 4, Peret: Die Felder bestellen", text: "Wieder liegt fruchtbarer Schlamm auf den Feldern. Die Flut hat die Grenzsteine umgeworfen." },
    landvermesser: "Euer Landvermesser hat die Felder schon neu ausgemessen und die Grenzsteine gesetzt. Kein Streit, und ihr spart die Kraft dafür.",
    schritte: {
      grenzstein: { name: "Grenzstein aufrichten", hint: "Wische auf dem Stein nach oben." },
      grenzeNeu:  { name: "Grenze neu festlegen", hint: "Zieh das Messseil vom Stein aus am Feld entlang bis zum Ende." },
      pfluegen:   { name: "pflügen", hint: "Zieh das Rindergespann mit dem Finger über das ganze Feld." },
      saeen:      { name: "säen", hint: "Wische hin und her über das Feld, bis überall Saat liegt." }
    },
    namen: ["Feld am Ufer", "mittleres Feld", "oberes Feld"],
    fertig: "Alle Felder bestellt",
    zuTrocken: "Zu trocken: Hierhin ist kein Wasser gekommen. Ohne Wasser wächst nichts.",
    zuHoch: "Das obere Feld liegt zu hoch. Das Wasser aus dem Graben kommt nicht hinauf.",
    schonGesaet: "Dieses Feld ist schon gesät.",
    keineKraft: "Dafür reicht eure Kraft nicht mehr. Ein Feld bestellt ihr nur, wenn ihr es auch ernten könnt.",
    nichtBestellt: "keine Kraft mehr",
    zuTrockenKurz: "zu trocken",
    bestellt: "gesät",
    offen: "noch nicht bestellt",
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
    3: "Spät, aber endlich: Ernte. Wische über die Felder.",
    kupfer: "Mit den Kupfersicheln aus dem Tausch gegen Leinen geht die Ernte doppelt so schnell: nur {n} Kraft pro Feld.",
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
    dorfAndere: "Auch die anderen Familien im Dorf hatten wenig. Wer nicht genug hat, bekommt Getreide aus dem Dorfspeicher. Niemand muss hungern.",
    alleinHunger: "Es fehlen {n} Säcke. Niemand hilft euch: Die Familien im Dorf versorgen sich aus ihrem gemeinsamen Speicher – ihr gehört nicht dazu."
  },
  trockenzeit: {
    titel: { 1: "Schemu: Die Felder liegen brach", 2: "Jahr 2, Trockenzeit: Allein auf dem Hof", 3: "Jahr 3, Trockenzeit: Arbeit am Deich", 4: "Jahr 4, Trockenzeit" },
    text: "Die Felder sind abgeerntet. Bis zur nächsten Flut wächst hier nichts. Was macht deine Familie mit der übrigen Kraft?",
    arbeiten: {
      nachholen:  { name: "Arbeit am Deich nachholen", text: "Im letzten Jahr hat euch Kraft für den Deich gefehlt. Das holt ihr jetzt nach: noch {n} Kraft.", hint: "Zieh Körbe mit Erde vom Haufen auf den Deich." },
      ausbessern: { name: "Den Deich ausbessern", text: "Das Hochwasser hat am Deich gerissen. Jede Familie hilft beim Ausbessern: {n} Kraft.", hint: "Zieh einen Korb mit Erde vom Haufen auf den Deich." },
      koerbe:     { name: "Körbe flechten und tauschen", text: "Aus Schilf vom Nilufer flechtet ihr Körbe. Die Nachbarn geben euch für jeden Korb {n} Sack Getreide. Jeder Korb kostet 1 Kraft.", hint: "Wische im Zickzack über den Korb.", nein: "Niemand hat Getreide übrig, um Körbe einzutauschen." },
      erdwall:    { name: "Am Erdwall bauen", text: "Ein Wall aus Erde um den Hof soll Haus und Speicher schützen, falls der Nil einmal zu hoch steigt. Geschafft: {w} von {n} Kraft.", hint: "Zieh Körbe mit Erde vom Haufen auf den Wall.", fertig: "Der Erdwall ist fertig. Ob er nötig sein wird? Das weiß niemand." }
    },
    pflichtZuerst: "Zuerst die Arbeit am Deich – das Dorf verlässt sich auf euch.",
    keineKraft: "Eure Kraft für dieses Jahr ist aufgebraucht.",
    nochSchuld: "Es fehlen noch {n} Kraft. Die holt ihr im nächsten Jahr nach.",
    gemacht: "Diese Trockenzeit: {liste}.",
    ende: "Trockenzeit beenden",
    rest: "Übrige Kraft: {n}. Damit ruht ihr euch aus.",
    toepfer: "Euer Töpfer hat aus Nilschlamm Krüge geformt und gebrannt. Ein Händler aus dem Nachbardorf tauscht sie gegen {n} Säcke Getreide.",
    verwalter: "Euer Speicherverwalter misst jede Ernte, schreibt auf, was jede Familie abgibt und bekommt, und hält den Dorfspeicher für das nächste schlechte Jahr bereit. Für diese Arbeit bekommt deine Familie {n} Säcke Lohn aus dem Dorfspeicher.",
    weberin: "Eure Weberin hat Leinen gewebt. Das Dorf hat es gegen Kupfersicheln getauscht. Mit ihnen hat die Ernte {n} Kraft weniger gekostet – diese Kraft habt ihr jetzt übrig.",
    landvermesser: "Euer Landvermesser hat nach der Flut alle Felder ausgemessen und die Grenzsteine gesetzt. Es gab keinen Streit, und ihr habt {n} Kraft gespart – diese Kraft habt ihr jetzt übrig."
  },
  jahresende: {
    1: { titel: "Ein Jahr ist vorbei", text: "Flut, Aussaat und Ernte, Trockenzeit – und dann erscheint wieder der Sirius. Achet, Peret, Schemu: Jede Jahreszeit dauert vier Monate.", knopf: "Weiter zu Jahr 2" },
    4: { titel: "Vier Jahre sind vorbei", text: "Jahr 1 und Jahr 4 hatten die gleiche, gute Flut. Vergleiche in der Bilanz, was anders war.", knopf: "Zur Bilanz" }
  },
  schadufWahl: {
    titel: "Jahr 2, Peret: Eine neue Erfindung",
    text: "Das mittlere und das obere Feld sind trocken geblieben. Nur im Graben am Uferfeld steht noch Wasser. Ein Nachbar zeigt euch eine Erfindung: den Schaduf – einen langen Hebel mit Eimer und Gegengewicht. Damit kann man Wasser aus dem Graben auf das mittlere Feld heben.",
    optionen: {
      bauen: { name: "Den Schaduf bauen", text: "Aus Palmholz und Seil: {n} Kraft. Danach schöpft die Familie Eimer für Eimer – jeder Eimer kostet 1 Kraft." },
      lassen: { name: "Keinen Schaduf bauen", text: "Ihr spart eure Kraft. Das mittlere Feld bleibt trocken." }
    },
    gebaut: "Ihr baut den Schaduf am Rand des mittleren Feldes.",
    gelassen: "Ihr spart eure Kraft. Das mittlere Feld bleibt in diesem Jahr trocken."
  },
  schaduf: {
    titel: "Jahr 2, Peret: Der Schaduf",
    text: "Zieh das Seil nach unten und lass los: Das Gegengewicht hebt den Eimer, das Wasser fließt aufs Feld. Ab {h} Eimern kann das Feld gesät werden, mit {v} Eimern bringt es eine volle Ernte.",
    plan: "Denk daran: Kraft, die ihr jetzt verbraucht, fehlt euch nach der Ernte in der Trockenzeit.",
    eimer: "Eimer: {n}",
    halb: "Das mittlere Feld ist feucht genug für eine kleine Ernte.",
    voll: "Das mittlere Feld ist gut bewässert. Mehr Wasser braucht es nicht.",
    muede: "Eimer für Eimer – harte Arbeit für die ganze Familie.",
    weiter: "Weiter zur Aussaat",
    hint: "Zieh am Seil nach unten und lass los."
  },
  dorfWahl: {
    titel: "Jahr 2, Trockenzeit: Ins Dorf oder allein?",
    text: "Nach diesem schlechten Jahr treffen sich die Familien. Die Ältesten zeigen am Nilmesser eine alte Marke ganz oben: So hoch stand der Nil einmal, als er Häuser fortriss. Einige Familien wollen gemeinsam ein Dorf bauen – mit Deich und gemeinsamem Speicher. Was macht deine Familie?",
    optionen: {
      dorf: { name: "Ins Dorf ziehen", text: "Ihr arbeitet am Deich mit: {d} Kraft. Dazu gebt ihr {n} Sack in den gemeinsamen Speicher. Fehlt euch Kraft, holt ihr die Arbeit im nächsten Jahr nach." },
      allein: { name: "Allein auf dem Hof bleiben", text: "Ihr behaltet eure Kraft und euer Getreide. Euren Hof schützt nur ein eigener Erdwall – geschafft sind {w} von {e} Kraft." }
    },
    kraftInfo: "Ihr habt noch {k} Kraft übrig.",
    allein: "Ihr bleibt auf eurem Hof. Die Nachbarn bauen ihr Dorf ohne euch, weiter oben hinter einem Deich."
  },
  dorfbau: {
    titel: "Jahr 2: Ihr baut gemeinsam ein Dorf",
    schritte: [
      { name: "Den Deich aufschütten", text: "Viele Familien schleppen Erde und Schilf. Euer Anteil: {n} Kraft.", hint: "Zieh Körbe mit Erde vom Haufen auf den Deich.", fertig: "Der Deich wächst." },
      { name: "Häuser bauen", text: "Aus Nilschlamm und Stroh formen alle zusammen Lehmziegel. Die Häuser stehen hinter dem Deich.", knopf: "Mitbauen" },
      { name: "Den Dorfspeicher füllen", text: "Jede Familie gibt etwas Getreide. Im gemeinsamen Speicher liegt jetzt ein Vorrat für das ganze Dorf.", knopf: "Getreide abgeben" }
    ],
    fehlt: "Eure Kraft ist aufgebraucht. Die fehlenden {n} Kraft für den Deich holt ihr im nächsten Jahr nach.",
    weiterBauen: "Weiter",
    fertig: "Allein hätte das Jahre gedauert. Gemeinsam war es in einer Trockenzeit geschafft.",
    weiter: "Weiter zu Jahr 3"
  },
  hausbau: {
    titel: "Jahr 3: Ihr baut euer Haus wieder auf",
    text: "Bevor ihr säen könnt, braucht ihr wieder ein Dach über dem Kopf. Das kostet {n} Kraft – Kraft, die euch auf den Feldern fehlt.",
    hint: "Zieh Körbe mit Lehmziegeln zum Haus.",
    fertig: "Das Haus steht wieder. Jetzt schnell auf die Felder!"
  },
  beruf: {
    titel: "Jahr 3, Trockenzeit: Neue Berufe im Dorf",
    text: "Das Dorf hat einen Vorrat, und viele Arbeiten erledigen die Familien gemeinsam. Deshalb müssen nicht mehr alle auf dem Feld arbeiten. Wer aus deiner Familie übernimmt einen neuen Beruf? Was er oder sie tut, merkt ihr im nächsten Jahr.",
    optionen: {
      toepfer: { name: "Töpfer", text: "Formt Krüge aus Nilschlamm. Die Krüge tauscht das Dorf bei Händlern gegen Getreide." },
      weberin: { name: "Weberin", text: "Webt Leinen aus Flachs. Das Leinen tauscht das Dorf gegen Sicheln aus Kupfer." },
      landvermesser: { name: "Landvermesser", text: "Misst nach jeder Flut die Felder neu aus und setzt die Grenzsteine. Dann gibt es keinen Streit mehr." },
      verwalter: { name: "Speicherverwalter", text: "Misst das Getreide im Dorfspeicher, schreibt alles auf und gibt es gerecht aus. Dafür bekommt er Lohn aus dem Speicher." }
    },
    ergebnis: "Jemand aus deiner Familie arbeitet jetzt als {name}. Die anderen bestellen weiter eure Felder. Im nächsten Jahr zeigt sich, was das bringt.",
    weiter: "Weiter zu Jahr 4",
    alleinTitel: "Jahr 3, Trockenzeit: Allein auf dem Hof",
    allein: "Im Dorf arbeiten jetzt ein Töpfer, eine Weberin, ein Landvermesser und ein Speicherverwalter. Sie bekommen Getreide aus dem Dorfspeicher. Deine Familie kann niemanden entbehren: Wer nicht auf dem Feld arbeitet, bekommt bei euch nichts zu essen."
  },
  verloren: {
    titel: "Deine Familie muss den Hof verlassen",
    text: "Zwei Jahre hintereinander hat das Getreide nicht gereicht. Deine Familie kann den Hof nicht mehr halten und zieht zu Verwandten ins Dorf.",
    gruende: "Wie es dazu kam:",
    nochmal: "Noch einmal ab „Ins Dorf oder allein?“",
    weiter: "Trotzdem weiter zur Bilanz"
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
    felder: "Kraft für die Felder",
    schaduf: "Kraft für den Schaduf",
    schutz: "Kraft für Deich, Erdwall, Haus",
    koerbe: "Kraft für Körbe",
    frei: "Kraft übrig",
    hilfe: "Hilfe von anderen",
    ergebnis: "Ergebnis",
    vorrat: "Vorrat am Jahresende"
  },
  flut: { gut: "gut", niedrig: "zu niedrig", hoch: "zu hoch" },
  vergleich: "Jahr 1 und Jahr 4: gleiche Flut",
  vergleichDorf: "Durch den Beruf in deiner Familie kamen in Jahr 4 {n} Säcke mehr in euren Speicher. {grund}",
  vergleichAllein: "Allein auf dem Hof war Jahr 4 wie Jahr 1. Im Dorf haben die Familien in diesem Jahr durch die Berufe mehr übrig.",
  gruende: {
    toepfer: "Die Krüge eures Töpfers wurden gegen Getreide getauscht.",
    weberin: "Mit den Kupfersicheln (gegen Leinen getauscht) kostete die Ernte weniger Kraft. Die freie Kraft steckte deine Familie in Körbe.",
    landvermesser: "Der Landvermesser hat die Grenzsteine gesetzt. Die gesparte Kraft steckte deine Familie in Körbe.",
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
  kraft: "jede Arbeit auf dem Feld Kraft gekostet hat und unsere Kraft nicht für alles gereicht hat",
  niedrig: "in Jahr 2 die Flut zu niedrig war und Felder trocken blieben",
  hunger: "meine Familie in Jahr 2 hungern musste",
  knapp: "in Jahr 2 die Ernte nicht gereicht hat und wir vom Vorrat leben mussten",
  satt2: "wir in Jahr 2 nur mit dem Schaduf genug geerntet haben",
  schaduf: "wir in Jahr 2 mit dem Schaduf Eimer für Eimer Wasser schöpfen mussten",
  hoch: "in Jahr 3 die Flut zu hoch war und die Feldhütte fortriss",
  alleinZerstoert: "unser Hof in Jahr 3 vom Hochwasser zerstört wurde, weil wir allein geblieben sind",
  alleinWall: "uns in Jahr 3 nur unser Erdwall vor dem Hochwasser geschützt hat",
  alleinHunger: "uns in Jahr 3 niemand geholfen hat, weil wir nicht im Dorf waren",
  dorfGeschuetzt: "das Dorf hinter dem Deich in Jahr 3 trocken geblieben ist",
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
    { frage: "Im Spiel hat deine Familie jedes Jahr genau 22 Kraft. Was ist an dieser Zahl ausgedacht?",
      hinweis: "Die Zahl ist ausgedacht, damit man vergleichen kann. Wie viel eine Familie schaffte, hing von vielem ab: Wie viele Menschen mithalfen, ob jemand krank war, ob sie Rinder hatten." }
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
  ["Arbeitskraft", "wie viel Arbeit eine Familie in einem Jahr schaffen kann; im Spiel kostet jede Arbeit Kraft"],
  ["Grenzstein", "ein Stein am Rand eines Feldes; er zeigt, wo ein Feld aufhört und das nächste anfängt"],
  ["Erdwall", "ein Wall aus aufgeschütteter Erde rund um einen Hof"],
  ["Kupfer", "ein Metall; Sicheln aus Kupfer schneiden besser als Sicheln aus Feuerstein"],
  ["Arbeitsteilung", "nicht alle machen dasselbe: Manche bauen Getreide an, andere töpfern, weben oder vermessen Land – und sie tauschen untereinander"]
];
