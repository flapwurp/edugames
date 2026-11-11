// Labor, Schritt 3: alle Texte, Orte und Bildnachweise. Nur Daten, kein Code.
// Koordinaten (x, y) sind Pixel im jeweiligen Bild. Texte zwischen den Anführungszeichen ändern,
// Kommas und Klammern stehen lassen.

export const NACHWEISE = {
  nil: {
    titel: "Der Nil aus dem All (Satellitenbild-Mosaik)",
    urheber: "NASA",
    lizenz: "gemeinfrei (Public Domain)",
    link: "https://commons.wikimedia.org/wiki/File:Nile_composite_NASA.jpg"
  },
  delta: {
    titel: "Nil und Nildelta aus dem Orbit, 5. Februar 2003",
    urheber: "Jacques Descloitres, MODIS Rapid Response Team, NASA/GSFC",
    lizenz: "gemeinfrei (Public Domain)",
    link: "https://commons.wikimedia.org/wiki/File:Nile_River_and_delta_from_orbit.jpg"
  },
  murchison: {
    titel: "The Nile near Murchison Falls (Viktoria-Nil, Uganda), 2022",
    urheber: "Fiktube",
    lizenz: "CC BY-SA 4.0",
    lizenzLink: "https://creativecommons.org/licenses/by-sa/4.0/deed.de",
    link: "https://commons.wikimedia.org/wiki/File:Beautiful_nature_along_Nile_River_01.jpg",
    bearbeitung: "verkleinert"
  },
  gizeh: {
    titel: "Westansicht der Pyramiden, im Hintergrund im Dunst das Niltal, 2019",
    urheber: "Rolfcosar",
    lizenz: "CC BY-SA 4.0",
    lizenzLink: "https://creativecommons.org/licenses/by-sa/4.0/deed.de",
    link: "https://commons.wikimedia.org/wiki/File:Pyramiden_von_Gizeh.jpg",
    bearbeitung: "in Ebenen zerlegt, Himmel und Stadt im Dunst entfernt, Straße und Fahrzeuge wegretuschiert. Die bearbeiteten Ebenen stehen ebenfalls unter CC BY-SA 4.0."
  },
  barke1: {
    titel: "Sonnenbarke des Cheops (la barque solaire), 2007",
    urheber: "Jon Bodsworth, www.egyptarchive.co.uk",
    lizenz: "Copyrighted free use (freie Nutzung erlaubt)",
    link: "https://commons.wikimedia.org/wiki/File:Barque-solaire1.jpg",
    bearbeitung: "verkleinert"
  },
  barke4: {
    titel: "Kraweel-Beplankung der Sonnenbarke, 2005",
    urheber: "Bradipus (Aufnahme: Alex Lbh)",
    lizenz: "CC BY-SA 3.0",
    lizenzLink: "https://creativecommons.org/licenses/by-sa/3.0/deed.de",
    link: "https://commons.wikimedia.org/wiki/File:Barque_Solaire4.JPG",
    bearbeitung: "verkleinert"
  },
  menna: {
    titel: "Grabkammer des Menna, Ackerschreiber des Königs, Szene: Wallfahrt nach Abydos",
    urheber: "Maler der Grabkammer des Menna; Reproduktion: The Yorck Project (2002)",
    lizenz: "gemeinfrei (Public Domain)",
    link: "https://commons.wikimedia.org/wiki/File:Maler_der_Grabkammer_des_Menna_013.jpg",
    bearbeitung: "„Umzeichnung“: Linien automatisch aus dem Bild berechnet"
  }
};

export const KARTE = {
  titel: "Der Nil von oben",
  bild: "nil",
  start: { x: 180, y: 260, zoom: 2 },
  orte: [
    { x: 120, y: 48, name: "Mittelmeer", text: "Hier mündet der Nil ins Mittelmeer." },
    { x: 150, y: 138, name: "Nildelta", text: "Unterägypten: Der Nil verzweigt sich in viele Arme. Das Schwemmland ist besonders fruchtbar.", bilder: ["delta"] },
    { x: 147, y: 197, name: "Memphis und Gizeh", text: "An der Spitze des Deltas lag Memphis, lange die Hauptstadt Ägyptens. Gleich daneben stehen die Pyramiden von Gizeh. Heute liegt hier Kairo." },
    { x: 108, y: 243, name: "Faiyum", text: "Eine Senke westlich des Nils mit einem See, bewässert über einen Seitenarm des Flusses." },
    { x: 178, y: 330, name: "Kemet und Deschret", text: "Im Satellitenbild sieht man, was die Ägypter Kemet („schwarzes Land“) und Deschret („rotes Land“) nannten: ein schmaler grüner Streifen am Fluss, ringsum Wüste." },
    { x: 240, y: 505, name: "Theben (Luxor)", text: "Oberägypten: Theben war im Neuen Reich ein religiöses Zentrum. Auf der Westseite liegen viele Gräber, auch das Grab des Menna mit der Bootsmalerei aus dieser Werkstatt." },
    { x: 266, y: 603, name: "Assuan, 1. Katarakt", text: "Felsen und Stromschnellen im Fluss. Hier lag lange die Südgrenze Ägyptens." },
    { x: 214, y: 700, name: "Nassersee", text: "Ein moderner Stausee hinter dem Assuan-Hochdamm, fertig 1970. Im Alten Ägypten gab es ihn nicht. Seit dem Bau des Damms bleibt die jährliche Nilflut aus." },
    { x: 236, y: 1205, name: "Khartum", text: "Hier fließen Weißer Nil und Blauer Nil zusammen. Der Blaue Nil kommt aus dem Hochland von Äthiopien und bringt im Sommer das Hochwasser und den fruchtbaren Schlamm." },
    { x: 172, y: 2112, name: "Viktoria-Nil", text: "Zwischen Viktoriasee und Albertsee in Uganda heißt der Fluss Viktoria-Nil. Hier stürzt er bei den Murchison-Fällen durch eine Felsschlucht.", bilder: ["murchison"] },
    { x: 290, y: 2290, name: "Viktoriasee", text: "Der größte See Afrikas. Er gilt als Hauptquelle des Weißen Nils." }
  ]
};

export const GIZEH = {
  titel: "Gizeh in Ebenen",
  bild: "gizeh",
  // f = wie stark eine Ebene beim Wischen mitwandert (1 = Boden, kleiner = weiter weg)
  ebenen: { niltal: 0.42, hinten: 0.82, vorne: 0.88, boden: 1 },
  orte: [
    { x: 470, y: 400, ebene: "vorne", name: "Cheops-Pyramide", text: "Grabmal des Königs Cheops (Chufu), 4. Dynastie, um 2600 bis 2500 v. Chr. Ursprünglich rund 146 m hoch und die größte Pyramide Ägyptens. Hier wirkt sie kleiner, weil sie weiter hinten steht." },
    { x: 1150, y: 360, ebene: "vorne", name: "Chephren-Pyramide", text: "Grabmal des Königs Chephren (Chafre). Sie steht auf höherem Grund und wirkt deshalb oft größer als die Cheops-Pyramide." },
    { x: 1197, y: 95, ebene: "vorne", name: "Rest der Verkleidung", text: "An der Spitze ist ein Rest der glatten Verkleidung aus hellem Kalkstein erhalten. Ursprünglich waren die Pyramiden ganz so verkleidet; der Stein wurde später als Baumaterial abgetragen." },
    { x: 300, y: 640, ebene: "boden", name: "Sonnenbarke des Cheops", text: "1954 fand man neben der Cheops-Pyramide ein zerlegtes Schiff aus Zedernholz in einer Grube. Es wurde wieder zusammengesetzt und stand lange in einem eigenen Museum. Heute ist es im Grand Egyptian Museum.", bilder: ["barke1", "barke4"] },
    { x: 2300, y: 600, ebene: "niltal", name: "Niltal im Dunst", text: "Im Dunst liegt das Niltal. Heute steht dort die Großstadt Gizeh/Kairo. In dieser Szene ist sie durch eine gezeichnete Ebene ersetzt: Das Bild ist also bearbeitet." },
    { x: 3128, y: 520, ebene: "hinten", name: "Mykerinos-Pyramide", text: "Grabmal des Königs Mykerinos (Menkaure), die kleinste der drei großen Pyramiden von Gizeh, ursprünglich rund 65 m hoch." },
    { x: 3780, y: 700, ebene: "boden", name: "Nebenpyramide", text: "Kleinere Nebenpyramiden neben den großen. Sie werden meist als Gräber von Königinnen gedeutet." }
  ]
};

export const QUELLE = {
  titel: "Quelle: Boot im Grab des Menna",
  bild: "menna",
  hinweis: "Wandmalerei im Grab des Menna (TT 69), Theben-West, um 1422–1411 v. Chr.",
  orte: [
    { x: 1250, y: 300, name: "Segel", text: "Ein großes Segel, oben und unten an einer Querstange (Rah) befestigt. Mit dem Nordwind konnten Boote nilaufwärts nach Süden segeln." },
    { x: 905, y: 250, name: "Mast und Taue", text: "Viele Taue halten den Mast und die obere Rah." },
    { x: 490, y: 470, name: "Mann auf der Rah", text: "Ein Seemann steht auf der unteren Rah, vielleicht um das Segel zu richten." },
    { x: 1000, y: 815, name: "Ruderer", text: "Eine Reihe von Ruderern sitzt im Boot. Ruder und Segel konnten sich ergänzen." },
    { x: 1080, y: 680, name: "Kajüte", text: "Ein Aufbau mit bunt verzierten Wänden, eine Art Kajüte." },
    { x: 1560, y: 610, name: "Steuermann", text: "Ein Mann bedient das große Steuerruder am Heck." },
    { x: 230, y: 640, name: "Mann am Bug", text: "Vorn auf dem Boot steht ein Mann mit einem Stab neben einem kleinen Aufbau." },
    { x: 680, y: 560, name: "Riss im Putz", text: "Die Malerei ist rund 3400 Jahre alt. Schäden wie dieser Riss gehören zur Quelle; sie werden hier nicht wegretuschiert." },
    { x: 960, y: 55, name: "Fries", text: "Ein bunter Streifen als oberer Rand der Wandmalerei." }
  ]
};
