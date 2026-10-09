/* Im Rhythmus des Nils – alle Texte und Werte.
   Hier darf geändert werden: nur die Wörter zwischen den Anführungszeichen und die Zahlen.
   Kommas, Klammern und Namen links vom Doppelpunkt bitte stehen lassen.
   {n}, {flut} usw. sind Platzhalter, die das Spiel selbst ausfüllt. */

export const GAME = {
  title: "Im Rhythmus des Nils",
  subtitle: "Zwei Jahre auf einem Bauernhof im alten Ägypten",
  leitfrage: "Das alte Ägypten – ein Geschenk des Nils?",
  intro: [
    "Du lebst mit deiner Familie in einem Dorf am Nil. Um euch herum ist Wüste. Regen gibt es fast nie.",
    "Zwei Jahre lang entscheidest du: Welche Felder bestellt ihr? Wer arbeitet wo? Was passiert mit der Ernte?",
    "Am Ende beantwortest du die Frage: War der Nil ein Geschenk?"
  ],
  familySize: 4,          // Familienmitglieder (Arbeitskraft)
  need: 8,                // Säcke Getreide, die die Familie für ein Jahr braucht
  dorfHelpers: 2          // so viele aus der Familie haben vor der zweiten Flut Zeit für Gemeinschaftsarbeit
};

/* Ägyptischer Kalender: Name oben, deutsche Übersetzung darunter */
export const SEASONS = [
  { id: "achet",  name: "Achet",  de: "Überschwemmung" },
  { id: "peret",  name: "Peret",  de: "Aussaat und Wachstum" },
  { id: "schemu", name: "Schemu", de: "Ernte" }
];

/* Ernte in Säcken je Feld. "flut" = Feld wurde überschwemmt und hat Schlamm bekommen,
   "bewaessert" = Wasser kam nur über Graben, Schaduf oder Kanal (kein Schlamm). */
export const YIELDS = {
  gut:     { flut: 4 },
  niedrig: { flut: 3 },
  hoch:    { flut: 3 },
  bewaessert: 2
};

/* Fluten. Jahr 1 ist für alle „gut“, Jahr 2 per Zufall eine der beiden anderen. */
export const FLOODS = {
  gut:     { name: "gute Flut",       text: "Der Nil steigt hoch genug. Das Wasser bedeckt die Felder am Ufer und die mittleren Felder." },
  niedrig: { name: "zu niedrige Flut", text: "Der Nil steigt dieses Jahr kaum. Nur die Felder direkt am Ufer werden überschwemmt." },
  hoch:    { name: "zu hohe Flut",     text: "Der Nil steigt höher als sonst. Alle Felder stehen unter Wasser – und das Wasser bleibt lange." }
};
export const YEAR2_FLOODS = [{ id: "niedrig" }, { id: "hoch" }];

export const ZONES = {
  ufer:  "Feld am Ufer",
  mitte: "mittleres Feld",
  rand:  "Feld am Wüstenrand"
};

export const DORF = {
  nachbarnGeben: 6,     // Säcke, die die anderen Familien in den Dorfspeicher geben
  handwerkBraucht: 3,   // Säcke, von denen die Menschen ohne eigene Felder ein Jahr leben
  berufe: [
    { name: "Weberin",       text: "webt aus Flachs Leinen für Kleidung" },
    { name: "Töpfer",        text: "macht Krüge für Wasser, Bier und Getreide" },
    { name: "Landvermesser", text: "misst nach der Flut die Felder neu aus" }
  ],
  aufgaben: {
    deich:  { name: "Deich ausbessern",         wer: "für das ganze Dorf", text: "Der Deich schützt Häuser und Uferfelder vor zu viel Wasser." },
    kanal:  { name: "Hauptkanal vertiefen",     wer: "für das ganze Dorf", text: "Ein tiefer Kanal bringt auch bei wenig Wasser etwas ins Land." },
    hof:    { name: "Auf dem Hof bleiben",       wer: "für deine Familie", text: "Flachs spinnen und das Garn gegen 1 Sack Getreide tauschen." }
  }
};

export const TEXT = {
  start: "Spiel starten",
  pause: "Pause",
  begriffe: "Begriffe",
  weiter: "Weiter",
  pauseTitel: "Das Spiel ist pausiert",
  pauseText: "Tippe auf „Weiter“, wenn es weitergeht.",

  probeTitel: "Ein Versuch vorab",
  probeText: "Zwei Felder, ein Fluss. Säe auf beiden Feldern und beobachte, was passiert.",
  probeSaeen: "Tippe auf beide Felder, um zu säen.",
  probeWachsen: "Zeit vergehen lassen",
  probeDeutung: "Am Fluss hat die Flut Wasser und fruchtbaren Schlamm hinterlassen – dort wächst das Getreide. Das Feld weiter weg hat kein Wasser bekommen und ist vertrocknet.",

  siriusTitel: "Der Sirius erscheint",
  siriusText: "Kurz vor Sonnenaufgang ist der helle Stern Sirius wieder am Himmel zu sehen. Für die Menschen in Ägypten heißt das: Ein neues Jahr beginnt – und bald kommt die Flut.",
  siriusKnopf: "Die Flut kommt",
  achetKnopf: "Das Wasser sinkt",
  achetText: "Beobachte, welche Felder unter Wasser stehen.",
  landvermesser: "Die Flut hat die Grenzsteine zwischen den Feldern weggespült. Der Landvermesser aus dem Dorf misst die Felder neu aus.",

  planTitel: "Wer arbeitet wo?",
  planText: "Tippe auf ein Feld, den Graben oder den Schaduf. Dann arbeitet dort ein Mitglied deiner Familie. Nochmal tippen holt es zurück.",
  planFrei: "Noch frei: {n}",
  planFertig: "Aussaat abschließen",
  wachsenTitel: "Die Pflanzen wachsen",
  ernteKnopf: "Zur Ernte",

  ernteTitel: "Ernte",
  ernteGesamt: "Ihr erntet {n} Säcke Getreide.",
  ernteBedarf: "Deine Familie braucht {n} Säcke, um ein Jahr satt zu werden.",
  verteilenText: "Es bleiben {n} Säcke übrig. Wohin damit? Tippe so oft, bis alle verteilt sind.",
  inVorrat: "1 Sack in den eigenen Vorrat",
  inDorf: "1 Sack in den Dorfspeicher",
  zurueck: "Rückgängig",
  vorratName: "Eigener Vorrat",
  dorfName: "Dorfspeicher",
  vorratInfo: "gehört nur deiner Familie",
  dorfInfo: "versorgt Menschen ohne eigene Felder und hilft in Notzeiten",
  knapp1: "Das reicht nicht ganz. Nachbarn helfen mit {n} Säcken aus dem Dorfspeicher. Trotzdem wird das Essen knapp.",

  dorfTitel: "Ein Dorf am Nil",
  dorfText: "Die Ernte ist eingebracht, bis zur nächsten Flut ist noch Zeit. Das Dorf ruft alle Familien zusammen: Der Deich ist beschädigt, und der Hauptkanal soll tiefer werden. Für jede Arbeit fehlt noch ein Helfer. Zwei aus deiner Familie haben Zeit. Was sollen sie tun?",
  hofErgebnis: "Auf dem Hof wurde Flachs gesponnen. Das Garn bringt {n} Säcke Getreide für den eigenen Vorrat.",
  dorfBerufe: "Im Dorf leben auch Menschen, die keine eigenen Felder bestellen. Sie leben von Getreide aus dem Dorfspeicher und tauschen ihre Arbeit dagegen ein.",
  dorfFertig: "Arbeit beginnen",

  versorgungTitel: "Reicht es für deine Familie?",
  jahr2Rest: "Was übrig bleibt, kommt in den eigenen Vorrat.",

  bilanzTitel: "Deine zwei Jahre am Nil",
  bilanzText: "Das hast du erlebt. Diese Karten sind deine Belege aus dem Spiel.",
  spalten: { natur: "Natur", arbeit: "Arbeit", gesellschaft: "Gesellschaft" },
  code: "Spiel-Nr.",

  quelleTitel: "Was sagten die Menschen damals?",
  quelleText: "M3 ist eine Quelle: ein Lied, das Menschen im alten Ägypten über den Nil gesungen haben. Lies es und ordne dann die Aussagen ein.",
  frage: "Steht das im Lied?",
  ja: "Steht im Lied",
  nein: "Steht nicht im Lied",
  quelleSchluss: "Im Lied kommt die Arbeit der Menschen nicht vor. Warum wohl? Denk daran: Das Lied ist ein Gebet an den Nil, den die Menschen als Gott verehrten.",
  drei: {
    sagt:   "Das sagt die Quelle",
    spiel:  "Das zeigt dein Spiel – die Quelle belegt es nicht"
  },
  richtig: "Genau.",
  nochmal: "Schau noch einmal ins Lied.",

  urteilTitel: "War der Nil ein Geschenk?",
  urteilText: "Wähle für jede Zeile einen Beleg. Dann schreibst du dein Urteil ins Heft.",
  wahlSpiel: "Ein Beleg aus deinem Spiel",
  wahlQuelle: "Ein Beleg aus dem Lied (M3)",
  wahlAllerdings: "Allerdings …",
  gelaender: [
    "Der Nil war für die Menschen im alten Ägypten ein Geschenk, weil …",
    "Das zeigt sich daran, dass …",
    "Auch im Lied (M3) heißt es, dass …",
    "Allerdings …"
  ],
  heft: "Schreibe dein Urteil jetzt ins Heft. Du darfst auch zu einem anderen Ergebnis kommen, zum Beispiel: „Der Nil war nur zum Teil ein Geschenk, weil …“",
  impulsKnopf: "Fertig? Noch ein Denkanstoß",
  impulsTitel: "Das Spiel ist eine Darstellung",
  impulsText: "Dieses Spiel wurde heute gemacht. Es zeigt das alte Ägypten vereinfacht. Was war damals wohl anders als im Spiel?",
  ende: "Ende"
};

/* Rückmeldung nach dem Wachsen, je Feld */
export const REASONS = {
  flut:        "Die Flut hat Wasser und fruchtbaren Schlamm gebracht.",
  flutNiedrig: "Das Feld wurde überschwemmt, aber diesmal blieb weniger Schlamm liegen.",
  spaet:       "Das Wasser stand lange. Erst spät konnte gesät werden.",
  nass:        "Das Feld stand noch unter Wasser, als gesät werden musste. Die Saat ist verfault.",
  graben:      "Über den Graben kam Wasser zum Feld – aber kein Schlamm.",
  schaduf:     "Mit dem Schaduf wurde Wasser geschöpft – mühsam, aber es hat gereicht.",
  kanal:       "Der tiefe Hauptkanal hat Wasser bis hierher gebracht.",
  trocken:     "Hierhin kam kein Wasser. Die Arbeit war umsonst."
};

/* Zusätzliche Rückmeldungen */
export const NOTES = {
  grabenUmsonst:  "Am Graben wurde gearbeitet, aber auf den Feldern am Wüstenrand hat niemand gesät.",
  grabenLeer:     "Der Nil war so niedrig, dass kaum Wasser in den Graben floss.",
  schadufUmsonst: "Am Schaduf wurde gearbeitet, aber es gab kein trockenes Feld, das Wasser brauchte.",
  hofNass:        "Das Wasser kam bis zum Hof. Ein Teil des eigenen Vorrats ist verdorben.",
  hofSicher:      "Der ausgebesserte Deich hat Hof und Uferfelder geschützt."
};

/* Belegkarten für die Bilanz. Die Bereiche: natur, arbeit, gesellschaft */
export const EVENTS = {
  flut1:        ["natur", "Jahr 1: Die Flut war gut. Felder am Ufer und in der Mitte bekamen Wasser und Schlamm."],
  flut2niedrig: ["natur", "Jahr 2: Die Flut war zu niedrig. Nur die Felder am Ufer wurden überschwemmt."],
  flut2hoch:    ["natur", "Jahr 2: Die Flut war zu hoch. Das Wasser stand lange auf den Feldern."],
  trocken:      ["natur", "Jahr {jahr}: Ein Feld ohne Wasser ist vertrocknet."],
  nass:         ["natur", "Jahr {jahr}: Auf einem Feld unter Wasser ist die Saat verfault."],
  schlamm:      ["natur", "Felder mit Schlamm von der Flut brachten die beste Ernte."],
  graben:       ["arbeit", "Jahr {jahr}: Erst durch den Graben bekamen die Felder am Wüstenrand Wasser."],
  schaduf:      ["arbeit", "Jahr {jahr}: Mit dem Schaduf wurde Wasser auf ein trockenes Feld geschöpft."],
  umsonst:      ["arbeit", "Jahr {jahr}: Ein Teil der Arbeit war umsonst, weil das Wasser fehlte."],
  ernte:        ["arbeit", "Jahr {jahr}: {n} Felder bestellt, {s} Säcke geerntet."],
  speicher:     ["gesellschaft", "Du hast {n} Säcke in den Dorfspeicher gegeben."],
  berufe:       ["gesellschaft", "Weberin, Töpfer und Landvermesser bauen kein Getreide an. Sie leben vom Dorfspeicher."],
  landvermesser:["gesellschaft", "Nach der Flut hat der Landvermesser die Feldgrenzen neu ausgemessen."],
  deich:        ["gesellschaft", "Mit deiner Hilfe hat das Dorf den Deich ausgebessert."],
  kanal:        ["gesellschaft", "Mit deiner Hilfe hat das Dorf den Hauptkanal vertieft."],
  deichFehlt:   ["gesellschaft", "Am Deich fehlten Helfer. Er blieb beschädigt."],
  kanalFehlt:   ["gesellschaft", "Am Hauptkanal fehlten Helfer. Er blieb flach."],
  deichHalf:    ["gesellschaft", "Der gemeinsam ausgebesserte Deich schützte Hof und Uferfelder."],
  kanalHalf:    ["gesellschaft", "Der gemeinsam vertiefte Kanal brachte Wasser trotz niedriger Flut."],
  hof:          ["arbeit", "Auf dem Hof wurde Flachs gesponnen und gegen {n} Säcke Getreide getauscht."],
  hofNass:      ["natur", "Das Hochwasser hat einen Teil des Vorrats auf dem Hof verdorben."],
  geholfen:     ["gesellschaft", "Im schlechten Jahr bekam deine Familie {n} Säcke aus dem Dorfspeicher."],
  vorratHalf:   ["gesellschaft", "Der eigene Vorrat aus Jahr 1 half im schlechten Jahr."],
  hunger:       ["gesellschaft", "Jahr {jahr}: Das Getreide reichte nicht. Deine Familie musste hungern."],
  satt:         ["gesellschaft", "Jahr {jahr}: Deine Familie wurde satt."]
};

/* Quelle M3 – PLATZHALTER.
   Hier kommt später der Text einer gemeinfreien Übersetzung hin (Kürzungen mit […]).
   Solange placeholder: true ist, zeigt das Spiel nur die Beschreibung der Blöcke. */
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

/* Aussagen für den Quellencheck. imLied: true/false. erklaerung: Rückmeldung danach. */
export const AUSSAGEN = [
  { text: "Der Nil erhält Ägypten am Leben.", imLied: true,
    tipp: "Lies noch einmal den Anfang des Liedes.",
    erklaerung: "Das steht gleich am Anfang des Liedes." },
  { text: "Der Nil lässt Gerste und Bohnen wachsen.", imLied: true,
    tipp: "Such im Lied nach Pflanzen.",
    erklaerung: "Das Lied nennt Pflanzen, die durch den Nil wachsen." },
  { text: "Bringt der Nil zu wenig Wasser, werden die Menschen arm.", imLied: true,
    tipp: "Lies, was passiert, wenn der Nil „träge“ ist.",
    erklaerung: "Auch das Lied kennt die Gefahr, wenn die Flut ausbleibt." },
  { text: "Der Nil kommt regelmäßig, jedes Jahr zu seiner Zeit.", imLied: true,
    tipp: "Such im Lied nach einer Stelle über die Zeit.",
    erklaerung: "Das Lied lobt, dass der Nil pünktlich kommt – wie im Kalender." },
  { text: "Die Menschen bringen dem Nil Opfer und bitten ihn zu kommen.", imLied: true,
    tipp: "Lies noch einmal den letzten Teil des Liedes.",
    erklaerung: "Das Lied ist ein Gebet: Die Menschen verehren den Nil als Gott." },
  { text: "Die Bauern müssen Gräben anlegen und Wasser schöpfen.", imLied: false,
    tipp: "Such im Lied nach Gräben oder Arbeit. Findest du etwas? Vielleicht kennst du das aus dem Spiel.",
    erklaerung: "Das hast du im Spiel erlebt. Im Lied kommt die Arbeit der Bauern nicht vor." },
  { text: "Das Dorf baut gemeinsam Deiche und Kanäle.", imLied: false,
    tipp: "Kommen Deiche oder Kanäle im Lied vor? Oder kennst du das aus dem Spiel?",
    erklaerung: "Das zeigt dein Spiel. Das Lied sagt nichts darüber." },
  { text: "Eine zu hohe Flut kann Felder und Häuser bedrohen.", imLied: false,
    tipp: "Das Lied nennt eine Gefahr. Ist es zu viel oder zu wenig Wasser?",
    erklaerung: "Das Lied nennt nur die Gefahr, wenn zu wenig Wasser kommt – nicht zu viel." }
];

/* Belege aus dem Lied für das Satzgeländer */
export const QUELLE_BELEGE = [
  "der Nil Ägypten am Leben erhält",
  "durch den Nil Gerste und Bohnen wachsen",
  "der Nil jedes Jahr zu seiner Zeit kommt",
  "die Menschen arm werden, wenn der Nil ausbleibt"
];

/* „Allerdings …“ – dazu kommen Karten aus dem eigenen Spiel */
export const ALLERDINGS = [
  "ohne die Arbeit der Menschen gab es keine gute Ernte",
  "die Flut war nicht jedes Jahr gleich",
  "Vorräte und die Hilfe des Dorfes waren in schlechten Jahren wichtig",
  "das Lied ist ein Gebet und lobt den Nil – über die Arbeit der Bauern sagt es nichts"
];

/* Denkanstöße für Schnelle (zum Aufklappen) */
export const IMPULSE = [
  { frage: "Wer bestimmte, wie viel Land eine Familie hatte?",
    hinweis: "Im Spiel hat deine Familie einfach sechs Felder. Damals gehörte viel Land Tempeln, Beamten oder dem Pharao." },
  { frage: "Konnten die Menschen damals wissen, wie hoch die Flut wird?",
    hinweis: "Im Spiel siehst du das Wasser von oben. Damals beobachteten die Menschen den Fluss, maßen den Wasserstand und verglichen mit früheren Jahren." },
  { frage: "Warum gibt es im Spiel genau zwei Jahre und nur Getreide?",
    hinweis: "Spiele vereinfachen. Damals wurden auch Gemüse, Flachs und Obst angebaut, und die Menschen hielten Tiere." }
];

/* Begriffe (immer über „Begriffe“ erreichbar) */
export const BEGRIFFE = [
  ["Achet, Peret, Schemu", "die drei Jahreszeiten im ägyptischen Kalender: Überschwemmung, Aussaat und Wachstum, Ernte"],
  ["Sirius", "ein heller Stern; wenn er im Sommer kurz vor Sonnenaufgang erscheint, beginnt das ägyptische Jahr"],
  ["Nilschwemme / Flut", "jedes Jahr steigt der Wasserstand des Nils, das Feld wird überschwemmt"],
  ["Schlamm", "bleibt nach der Flut auf den Feldern liegen und macht sie fruchtbar"],
  ["bewässern", "Wasser auf ein Feld leiten, z. B. über einen Graben"],
  ["Schaduf", "ein Gerät mit langem Hebel, mit dem man Wasser aus dem Fluss oder Graben schöpft"],
  ["Deich", "ein Erdwall, der Häuser und Felder vor Hochwasser schützt"],
  ["Kanal", "ein großer Graben, der Wasser weit ins Land bringt"],
  ["Aussaat", "Samen in die Erde bringen"],
  ["brach liegen", "ein Feld wird nicht bestellt"],
  ["Vorrat", "Getreide, das man für später speichert"],
  ["Überschuss", "was übrig bleibt, wenn alle satt sind – man hat einen Überschuss erwirtschaftet"],
  ["Arbeitsteilung", "nicht alle machen dasselbe: Manche bauen Getreide an, andere weben, töpfern oder vermessen Land"]
];
