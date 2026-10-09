/* Im Rhythmus des Nils 0.2 – alle Texte und Zahlen.
   Hier darf geändert werden: nur die Wörter zwischen den Anführungszeichen und die Zahlen.
   Kommas, Klammern und Namen links vom Doppelpunkt bitte stehen lassen.
   {n}, {s} usw. sind Platzhalter, die das Spiel selbst ausfüllt. */

/* ---------- Zahlen (Säcke Getreide) ---------- */
export const NUM = {
  startVorrat: 1,       // Vorrat zu Beginn
  bedarf: 10,           // so viel braucht die Familie in einem Jahr
  ertragGut: 4,         // je Feld bei normaler Flut
  ertragNiedrig: 3,     // Uferfeld bei zu niedriger Flut (weniger Schlamm)
  ertragBewaessert: 2,  // mittleres Feld, mit dem Schaduf voll bewässert
  ertragSpaet: 2,       // je Feld nach zu hoher Flut (späte Aussaat)
  schadufHalb: 3,       // so viele Eimer, damit das mittlere Feld überhaupt wächst
  schadufVoll: 6,       // so viele Eimer für eine volle Ernte auf dem mittleren Feld
  kruegeTausch: 2,      // Tauschgetreide für die Krüge (Entscheidung 1)
  dorfspeicher: 8       // Inhalt des Dorfspeichers in Jahr 3
};

export const GAME = {
  title: "Im Rhythmus des Nils",
  subtitle: "Drei Jahre auf einem Bauernhof im alten Ägypten",
  leitfrage: "Das alte Ägypten – ein Geschenk des Nils?",
  intro: [
    "Du lebst mit deiner Familie am Nil. Um euch herum ist Wüste, Regen gibt es fast nie.",
    "Drei Jahre lang bestellt ihr eure drei Felder. Du entscheidest, was deine Familie tut – und erlebst, was der Nil mit euch macht.",
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
  vorrat: "Vorrat im Speicher",
  saecke: "{n} Säcke",
  sack: "1 Sack"
};

/* ---------- Merksätze (Papyrusrolle) ---------- */
export const MERKSAETZE = {
  steigt:   "Vier Monate lang steigt der Nil und überschwemmt das Land.",
  schlamm:  "Zurück bleibt fruchtbarer Schlamm. Er wird untergepflügt und es wird gesät. Vier Monate später wird geerntet.",
  brache:   "Danach liegen die Felder vier Monate brach. Die Menschen erledigen andere Arbeiten.",
  kalender: "Nach diesem Rhythmus teilten die Ägypter ihr Jahr in drei Jahreszeiten zu je vier Monaten.",
  niedrig:  "Steigt der Nil zu wenig, bleiben Felder trocken. Dann droht Hunger.",
  hoch:     "Steigt der Nil zu hoch, zerstört das Wasser Häuser, Vorräte und Felder.",
  deich:    "Gemeinsam bauen die Menschen Dörfer und Deiche und schützen sich so vor dem Hochwasser.",
  vorrat:   "Im Dorf werden Vorräte angelegt und an alle verteilt, die in Not sind.",
  berufe:   "Weil das Dorf Vorräte hat und gemeinsam arbeitet, müssen nicht mehr alle auf dem Feld arbeiten. Es entstehen neue Berufe."
};
export const ROLLE_REIHENFOLGE = ["steigt", "schlamm", "brache", "kalender", "niedrig", "hoch", "deich", "vorrat", "berufe"];

/* ---------- Texte der Phasen ---------- */
export const TEXT = {
  sirius: {
    1: { titel: "Der Sirius erscheint", text: "Kurz vor Sonnenaufgang ist der helle Stern Sirius wieder am Himmel zu sehen. Für die Menschen in Ägypten heißt das: Ein neues Jahr beginnt – und bald kommt die Flut. Noch ist der Nil niedrig, eure Felder liegen trocken.", knopf: "Das Jahr beginnt" },
    2: { titel: "Jahr 2: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt. Ihr wartet auf die Flut.", knopf: "Das Jahr beginnt" },
    3: { titel: "Jahr 3: Der Sirius erscheint wieder", text: "Ein neues Jahr beginnt – zum ersten Mal lebt ihr im Dorf.", knopf: "Das Jahr beginnt" }
  },
  achet: {
    monate: [
      "Der Nil beginnt zu steigen. Schau auf den Nilmesser.",
      "Das Wasser steigt weiter. Bald erreicht es das erste Feld.",
      "Das Feld am Ufer und das mittlere Feld stehen unter Wasser.",
      "Höchststand. Alle drei Felder sind überschwemmt. Euer Hof liegt höher und bleibt trocken."
    ],
    knopf1: "Das Wasser sinkt",
    2: { titel: "Jahr 2, Achet: Der Nil steigt zu wenig", text: "Vier Monate lang wartet ihr. Doch am Nilmesser bleibt das Wasser unter der Marke. Nur das Feld am Ufer wird überschwemmt.", knopf: "Das Wasser sinkt" },
    3: { titel: "Jahr 3, Achet: Der Nil steigt zu hoch", text: "Das Wasser steigt und steigt – höher als bei jeder Flut, die ihr kennt. Es steht bis an die Krone des Deiches. Die Feldhütte am oberen Feld wird weggerissen. Hinter dem Deich bleibt das Dorf trocken.", knopf: "Das Wasser sinkt" }
  },
  aussaat: {
    1: { titel: "Peret: Pflügen und säen", text: "Das Wasser ist zurückgegangen. Auf den Feldern liegt schwarzer, nasser Schlamm. Tippe jedes Feld zweimal an: erst pflügen, dann säen." },
    2: { titel: "Jahr 2, Peret: Pflügen und säen", text: "Bestellt die Felder, die genug Wasser bekommen haben. Tippe ein Feld zweimal an: erst pflügen, dann säen." },
    3: { titel: "Jahr 3, Peret: Endlich säen", text: "Das Wasser stand zwei Monate länger auf den Feldern. Jetzt ist es spät – schnell pflügen und säen!" },
    pfluegen: "pflügen",
    saeen: "säen",
    fertig: "Alle Felder bestellt",
    zuTrocken: "Zu trocken: Hierhin ist kein Wasser gekommen. Ohne Wasser wächst nichts.",
    zuHoch: "Das obere Feld liegt zu hoch. Das Wasser aus dem Graben kommt nicht hinauf.",
    schonGesaet: "Dieses Feld ist schon gesät."
  },
  wachsen: {
    monate: ["Die ersten Keime sind zu sehen.", "Die Halme wachsen.", "Die Ähren bilden sich."],
    fertig: "Vier Monate sind vergangen. Das Getreide ist reif.",
    2: "Das Getreide wächst. Auf dem Feld am Ufer und dort, wo ihr Wasser geschöpft habt, wird es grün.",
    3: "Das Getreide wächst – aber spät. Die Halme sind kürzer als sonst."
  },
  ernte: {
    titel: "Schemu: Ernte",
    text: "Tippe die Felder an. Deine Familie erntet mit Sicheln und trägt das Getreide in den Speicher.",
    3: "Spät, aber endlich: Ernte im Dorf. Tippe die Felder an.",
    nichts: "Hier gibt es nichts zu ernten.",
    fertig: "Alles eingebracht"
  },
  versorgung: {
    titel: "Reicht es für ein Jahr?",
    ernte: "Ihr habt {n} Säcke geerntet.",
    bedarf: "Deine Familie braucht {n} Säcke, um ein Jahr lang satt zu werden.",
    satt: "Es reicht. {n} Säcke kommen als Vorrat in den Speicher.",
    knapp: "Die Ernte allein reicht nicht. Ihr nehmt {n} Säcke aus dem Vorrat. Jetzt ist der Speicher leer – und damit gerade so genug.",
    hunger: "Es fehlen {n} Säcke. Der Vorrat ist aufgebraucht. Bis zur nächsten Ernte hat deine Familie oft zu wenig zu essen.",
    nachbarn: "Den Nachbarn geht es genauso. Niemand hat etwas übrig, um euch zu helfen.",
    geholfen: "Die Ernte war klein. Aus dem Dorfspeicher bekommt deine Familie {n} Säcke. Auch andere Familien werden versorgt. Niemand muss hungern.",
    vorrat1: "Euer Vorrat: {n} Säcke."
  },
  brache: {
    titel: "Schemu: Die Felder liegen brach",
    text: "Die Felder sind abgeerntet. Bis zur nächsten Flut wächst hier nichts mehr. Vier Monate Zeit für andere Arbeiten. Was soll deine Familie tun?",
    optionen: {
      kruege: { name: "Krüge töpfern und tauschen", text: "Aus Nilschlamm Krüge formen und brennen. Die Krüge tauscht ihr bei Nachbarn gegen Getreide." },
      wall: { name: "Einen Erdwall um den Hof aufschütten", text: "Ein Wall aus Erde soll den Hof schützen, falls der Nil einmal zu hoch steigt." }
    },
    ergebnis: {
      kruege: "Ihr tauscht eure Krüge gegen {n} Säcke Getreide. Euer Vorrat wächst.",
      wall: "Rund um den Hof steht jetzt ein Erdwall. Ob er nötig sein wird? Das weiß niemand."
    }
  },
  jahresende: {
    titel: "Ein Jahr ist vorbei",
    text: "Flut, Aussaat und Ernte, Trockenzeit – und dann erscheint wieder der Sirius. Achet, Peret, Schemu: Jede Jahreszeit dauert vier Monate.",
    knopf: "Weiter zu Jahr 2"
  },
  schaduf: {
    titel: "Jahr 2, Peret: Der Schaduf",
    text: "Das mittlere und das obere Feld sind trocken geblieben. Nur im Graben am Uferfeld steht noch Wasser. Ein Nachbar zeigt euch eine Erfindung: den Schaduf. Tippe den Schaduf an, um Wasser zu schöpfen.",
    eimer: "Eimer: {n}",
    halb: "Das mittlere Feld wird feucht. Es reicht für eine kleine Ernte.",
    voll: "Das mittlere Feld ist gut bewässert. Mehr Wasser braucht es nicht.",
    muede: "Eimer für Eimer – das ist harte Arbeit für die ganze Familie.",
    weiter: "Weiter zur Aussaat",
    zuWenig: "Noch zu trocken zum Säen."
  },
  dorfbau: {
    titel: "Jahr 2: Die Familien schließen sich zusammen",
    text: "Nach diesem schlechten Jahr treffen sich die Familien. Die Ältesten zeigen am Nilmesser eine alte Marke ganz oben: So hoch stand der Nil einmal, als er Häuser fortriss. Allein kann sich keine Familie schützen. Gemeinsam wollen sie ein Dorf bauen – mit Deich und gemeinsamem Speicher.",
    schritte: [
      { knopf: "Den Deich aufschütten", text: "Viele Familien schleppen Erde und Schilf. Der Deich wächst." },
      { knopf: "Häuser bauen", text: "Aus Nilschlamm und Stroh formen alle zusammen Lehmziegel. Die Häuser stehen hinter dem Deich." },
      { knopf: "Den Dorfspeicher bauen", text: "Jede Familie gibt etwas Getreide. Im gemeinsamen Speicher liegt jetzt ein Vorrat für das ganze Dorf." }
    ],
    fertig: "Allein hätte das Jahre gedauert. Gemeinsam war es in einer Trockenzeit geschafft.",
    weiter: "Weiter zu Jahr 3"
  },
  vermessen: {
    titel: "Jahr 3, Peret: Die Felder sind verschwunden",
    text: "Das Wasser ist endlich gesunken. Aber die Flut hat die Grenzsteine zwischen den Feldern fortgespült. Wem gehört welches Feld? Im Dorf gibt es jemanden, der das ausmessen kann.",
    knopf: "Den Landvermesser holen",
    fertig: "Mit seinem Messseil misst der Landvermesser die Felder neu aus und setzt die Grenzsteine."
  },
  beruf: {
    titel: "Jahr 3, Trockenzeit: Neue Berufe im Dorf",
    text: "Das Dorf hat einen Vorrat, und viele Arbeiten erledigen die Familien gemeinsam. Deshalb müssen nicht mehr alle auf dem Feld arbeiten. Das Dorf braucht Menschen für andere Aufgaben. Wer aus deiner Familie übernimmt einen neuen Beruf?",
    optionen: {
      toepfer: { name: "Töpfer", text: "Das Dorf braucht viele Krüge, um Getreide, Wasser und Öl aufzubewahren." },
      weberin: { name: "Weberin", text: "Aus Flachs vom Feld wird Leinen für Kleidung gewebt." },
      landvermesser: { name: "Landvermesser", text: "Nach jeder Flut müssen die Felder neu ausgemessen werden." },
      verwalter: { name: "Speicherverwalter", text: "Jemand muss das Getreide im Dorfspeicher messen, aufschreiben und gerecht ausgeben." }
    },
    ergebnis: "Jemand aus deiner Familie arbeitet jetzt als {name}. Dafür bekommt ihr Getreide aus dem Dorfspeicher. Eure Felder bestellen die anderen aus der Familie.",
    weiter: "Zur Bilanz"
  }
};

/* ---------- Bilanz ---------- */
export const BILANZ = {
  titel: "Drei Jahre am Nil",
  rolle: "Deine Papyrusrolle",
  vergleich: "Jahr 2 und Jahr 3 im Vergleich",
  allein: "Jahr 2 – allein",
  dorf: "Jahr 3 – im Dorf",
  zeilen: ["Flut", "Schutz", "Ernte", "Hilfe von anderen", "Ergebnis"],
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
  frage: "Steht das im Lied?",
  ja: "Steht im Lied",
  nein: "Steht nicht im Lied",
  richtig: "Genau.",
  nochmal: "Schau noch einmal ins Lied.",
  sagt: "Das sagt die Quelle",
  spiel: "Das zeigt dein Spiel – die Quelle belegt es nicht",
  schluss: "Im Lied kommt die Arbeit der Menschen nicht vor. Warum wohl? Denk daran: Das Lied ist ein Gebet an den Nil, den die Menschen als Gott verehrten.",
  weiter: "Weiter zum Urteil"
};

export const AUSSAGEN = [
  { text: "Der Nil erhält Ägypten am Leben.", imLied: true,
    erklaerung: "Das steht gleich am Anfang des Liedes.", tipp: "Lies noch einmal den Anfang des Liedes." },
  { text: "Der Nil lässt Gerste und Bohnen wachsen.", imLied: true,
    erklaerung: "Das Lied nennt Pflanzen, die durch den Nil wachsen.", tipp: "Such im Lied nach Pflanzen." },
  { text: "Bringt der Nil zu wenig Wasser, werden die Menschen arm.", imLied: true,
    erklaerung: "Auch das Lied kennt die Gefahr, wenn die Flut ausbleibt – wie in deinem Jahr 2.", tipp: "Lies, was passiert, wenn der Nil „träge“ ist." },
  { text: "Der Nil kommt regelmäßig, jedes Jahr zu seiner Zeit.", imLied: true,
    erklaerung: "Das Lied lobt, dass der Nil pünktlich kommt – wie im Kalender.", tipp: "Such im Lied nach einer Stelle über die Zeit." },
  { text: "Die Menschen bringen dem Nil Opfer und bitten ihn zu kommen.", imLied: true,
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
  niedrig: "in Jahr 2 die Flut zu niedrig war und Felder trocken blieben",
  hunger: "meine Familie in Jahr 2 hungern musste",
  knapp: "in Jahr 2 unser ganzer Vorrat aufgebraucht wurde",
  schaduf: "wir in Jahr 2 mit dem Schaduf Eimer für Eimer Wasser schöpfen mussten",
  hoch: "in Jahr 3 die Flut zu hoch war und die Feldhütte fortriss",
  deich: "der Deich in Jahr 3 das Dorf vor dem Hochwasser geschützt hat",
  speicher: "der Dorfspeicher in Jahr 3 alle Familien versorgt hat"
};

export const IMPULS = {
  titel: "Das Spiel ist eine Darstellung",
  text: "Dieses Spiel wurde heute gemacht. Es zeigt das alte Ägypten vereinfacht. Was war damals wohl anders als im Spiel?",
  zurueck: "Zurück zum Urteil",
  fragen: [
    { frage: "Im Spiel entsteht das Dorf in einer einzigen Trockenzeit. Wie lange hat das wohl wirklich gedauert?",
      hinweis: "Dörfer am Nil entstanden über viele Generationen. Das Spiel drängt diese lange Zeit in drei Jahre zusammen." },
    { frage: "Den Schaduf nutzten die Ägypter erst etwa ab 2000 v. Chr. – lange nach den ersten Dörfern. Warum zeigt ihn das Spiel trotzdem?",
      hinweis: "Spiele wählen aus und ordnen neu, damit man etwas erleben kann. Hier soll man spüren, wie viel Arbeit Bewässerung kostete." },
    { frage: "Wer bestimmte, wie viel Land eine Familie hatte?",
      hinweis: "Im Spiel hat deine Familie einfach drei Felder. Damals gehörte viel Land Tempeln, Beamten oder dem Pharao." },
    { frage: "Konnten die Menschen damals wissen, wie hoch die Flut wird?",
      hinweis: "Sie beobachteten den Fluss, maßen den Wasserstand und verglichen ihn mit früheren Jahren – sicher wissen konnten sie es nicht." }
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
  ["Arbeitsteilung", "nicht alle machen dasselbe: Manche bauen Getreide an, andere töpfern, weben oder vermessen Land"]
];
