/* Planspiel Julikrise 1914 – Entscheidungsnetz (Entwurf zum Gegenlesen). Ansicht: netz.html

   So funktioniert es:
   1. Entscheidungen setzen MERKMALE (Tabelle SETZT). Beispiel: D wählt in Runde 1 „Mäßigung“ →
      deutscheLinie = maessigung. Die letzte Entscheidung zählt; spätere Entscheidungen können ein Merkmal ändern.
   2. Karten, Lage, Grenzen und Ausgänge fragen nur Merkmale ab:  wenn: { deutscheLinie: ["maessigung"] }
      Mehrere Einträge müssen alle zutreffen. Eine Karte sieht nur Merkmale aus Entscheidungen, die vorher gefallen sind
      (frühere Runde oder frühere Welle).
   3. Eine Variante kann bei einer Option mit „setzt“ festlegen, was diese Option bewirkt – dann gilt das statt SETZT.

   Merkmale mit „anzeige“ sind Stimmungsanzeigen (drei Stufen), die nur der genannte Staat sieht (Framing Controls).
   Anzeigen mit „stufen: true“ ändern sich schrittweise: In SETZT steht dann "+1" oder "-1".
   Fällt eine solche Anzeige unter „schwach“, ist sie „gekippt“: Dann tritt der KIPPPUNKT ein (Text und Folgen).
   auch1914: true = Variante greift auch auf dem Weg von 1914 (sonst bleibt dort jede Karte wie auf Papier).
   Texte in „beleg“ sind Arbeitsnotizen (Herkunft prüfen), sie erscheinen nicht im Spiel. */

export const MERKMALE = {
  deutscheLinie:   { name: "Berlins Linie gegenüber Wien", start: "offen",
                     werte: { offen: "noch offen", freieHand: "freie Hand / Rückendeckung", diplomatisch: "nur diplomatische Unterstützung", maessigung: "Rat zur Mäßigung" } },
  wiensKurs:       { name: "Wiens Kurs gegenüber Serbien", start: "offen",
                     werte: { offen: "noch offen", hart: "hart, militärisch", grossmaechte: "Großmächte / Verhandlung", ermittlung: "gemeinsame Ermittlung", einlenkend: "lenkt ein" } },
  ultimatum:       { name: "Ultimatum an Serbien", start: "keins",
                     werte: { keins: "keins", unannehmbar: "kaum annehmbar", erfuellbar: "erfüllbar", angriff: "Angriff ohne Vorwarnung" } },
  uebergabe:       { name: "Zeitpunkt des Ultimatums", start: "nachBesuch",
                     werte: { vorBesuch: "vor dem Staatsbesuch", waehrendBesuch: "während des Staatsbesuchs", nachBesuch: "nach dem Staatsbesuch / später" } },
  serbienHaltung:  { name: "Serbiens Haltung nach dem Attentat", start: "offen",
                     werte: { offen: "noch offen", leugnen: "weist alles zurück", ermittelt: "ermittelt selbst", russlandGerufen: "ruft Russland" } },
  serbAntwort:     { name: "Serbiens Antwort", start: "offen",
                     werte: { offen: "noch keine", fastAlles: "fast alles angenommen", abgelehnt: "abgelehnt", alles: "alles angenommen" } },
  russlandHaltung: { name: "Russlands Haltung", start: "abwartend",
                     werte: { abwartend: "abwartend", hinterSerbien: "steht hinter Serbien", nachgiebig: "rät zum Nachgeben", vermittelnd: "will vermitteln" } },
  staatsbesuch:    { name: "Staatsbesuch Poincaré", start: "ja", werte: { ja: "findet statt", abgesagt: "abgesagt" } },
  frankreichEngland: { name: "Paris hat sich mit London abgestimmt", start: "nein", werte: { nein: "nein", ja: "ja" } },
  buendnisFR:      { name: "Frankreich zu Russland", start: "offen",
                     werte: { offen: "noch offen", fest: "volle Bündnistreue", bedingt: "nur bei deutschem Angriff", zurueckhaltend: "rät zur Zurückhaltung" } },
  englandHaltung:  { name: "Englands Haltung", start: "abseits",
                     werte: { abseits: "abseits (Irland)", mahnend: "mahnt Wien", nachfragend: "fragt in Berlin nach", vermittelnd: "vermittelt",
                              entente: "signalisiert Frankreich/Russland Unterstützung", offen: "legt sich nicht fest", beistandF: "sagt Frankreich Beistand zu",
                              neutralZugesagt: "sagt Deutschland Neutralität zu", krieg: "Ultimatum an Deutschland", neutral: "bleibt neutral", kueste: "schützt nur die Küste" } },
  konferenz:       { name: "Konferenzvorschlag Englands", start: "keine", werte: { keine: "keiner", vorgeschlagen: "vorgeschlagen" } },
  krieg:           { name: "Krieg zwischen Wien und Belgrad", start: "nein", werte: { nein: "nein", ja: "erklärt" } },
  mobRussland:     { name: "Russische Mobilmachung", start: "keine", werte: { keine: "keine", teil: "nur gegen Österreich-Ungarn", allgemein: "gesamte Armee" } },
  grosserKrieg:    { name: "Deutschland eskaliert gegen Russland", start: "nein", werte: { nein: "nein", ja: "Kriegsgefahr ausgerufen / Krieg erklärt" } },
  frankreichAuftreten: { name: "Frankreichs Auftreten Ende Juli", start: "offen",
                     werte: { offen: "noch offen", bremst: "bremst Russland", defensiv: "Truppen zurückgezogen", mobil: "gesamte Armee mobil" } },
  belgien:         { name: "Belgiens Haltung", start: "neutral",
                     werte: { neutral: "neutral", nachgiebig: "würde Durchmarsch dulden", anlehnung: "bittet Garantiemächte um Schutz", bewaffnet: "neutral und mobil",
                              zoegert: "bittet um Bedenkzeit", widerstand: "lehnt ab und wehrt sich", durchlass: "lässt Truppen durch" } },
  westen:          { name: "Deutschlands Vorgehen im Westen", start: "offen",
                     werte: { offen: "noch offen", durchBelgien: "durch Belgien", keinAngriff: "kein Angriff im Westen", direkt: "direkt über die Grenze" } },

  /* Stimmungsanzeigen (Entwurf, Block C). Sie schubsen in Richtung 1914, ohne es vorzuschreiben. */
  ansehenWien:     { name: "Ansehen Österreich-Ungarns als Großmacht", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["oeu"], titel: "Unser Ansehen als Großmacht", text: {
                       stark: "Europa und die Völker im eigenen Reich sehen: Wien lässt sich nichts gefallen.",
                       mittel: "Nach dem Mord am Thronfolger fragen alle: Wie reagiert Wien?",
                       schwach: "In Budapest, Prag und Zagreb heißt es, Wien lasse sich von Serbien vorführen." } } },
  vertrauenWiens:  { name: "Vertrauen Wiens in Berlin", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["d"], titel: "Vertrauen unseres Verbündeten", text: {
                       stark: "Wien verlässt sich fest auf uns.",
                       mittel: "Wien wartet ab, wie fest wir zu ihm stehen.",
                       schwach: "In Wien fragt man, ob auf Berlin noch Verlass ist. Unser einziger Verbündeter wankt." } } },
  ansehenZar:      { name: "Ansehen des Zaren", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["r"], titel: "Ansehen des Zaren im eigenen Land", text: {
                       stark: "Zeitungen und Minister loben die Festigkeit des Zaren.",
                       mittel: "Die Zeitungen fragen, ob Russland die Serben diesmal schützt.",
                       schwach: "Man spricht vom dritten Rückzieher nach 1909 und 1913. In St. Petersburg wird gestreikt." } } },
  rueckhaltPasic:  { name: "Rückhalt der serbischen Regierung", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["srb"], titel: "Rückhalt der Regierung (Wahlkampf)", text: {
                       stark: "Der Wahlkampf läuft gut. Die Regierung wirkt fest und unabhängig.",
                       mittel: "Die Wahl steht bevor. Die Nationalisten beobachten jeden Schritt gegenüber Wien.",
                       schwach: "Die Nationalisten werfen Pašić vor, vor Wien einzuknicken. Die Wahl ist in Gefahr." } } },
  druckGeneralstabD: { name: "Druck des deutschen Generalstabs", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["d"], titel: "Druck des Generalstabs", text: {
                       stark: "Moltke drängt: Jeder Tag, den Russland mobilmacht, gefährdet den Schlieffen-Plan.",
                       mittel: "Der Generalstab beobachtet Russland genau. Noch ist Zeit.",
                       schwach: "Der Generalstab sieht keinen Grund zur Eile." } } },
  druckArmeeR:     { name: "Druck der russischen Armeeführung", start: "schwach", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["r"], titel: "Druck der Armeeführung", text: {
                       stark: "Die Generäle drängen: Unsere Mobilmachung dauert Wochen – wer zu spät beginnt, verliert.",
                       mittel: "Die Generäle bereiten sich vor und fragen, wann der Zar entscheidet.",
                       schwach: "Die Armeeführung hält sich zurück." } } },
  vertrauenRF:     { name: "Vertrauen Russlands in Frankreich", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["f"], titel: "Vertrauen unseres Verbündeten Russland", text: {
                       stark: "St. Petersburg verlässt sich fest auf Paris.",
                       mittel: "St. Petersburg wartet, wie fest Paris zum Bündnis steht.",
                       schwach: "In St. Petersburg fragt man, ob auf Frankreich Verlass ist. Ohne Russland stehen wir allein gegen Deutschland." } } },
  parlamentGB:     { name: "Bereitschaft des britischen Parlaments zum Krieg", start: "schwach", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["gb"], titel: "Parlament und Öffentlichkeit", text: {
                       stark: "Die Stimmung kippt: Viele Abgeordnete sehen einen klaren Grund, einzugreifen.",
                       mittel: "Das Kabinett ist gespalten. Ein klarer Grund würde vieles ändern.",
                       schwach: "Parlament und Zeitungen reden über Irland. Für einen Krieg auf dem Balkan gäbe es keine Mehrheit." } } },
  vertrauenBEL:    { name: "Vertrauen Belgiens in die Garantiemächte", start: "mittel", werte: { stark: "stark", mittel: "mittel", schwach: "schwach" },
                     anzeige: { fuer: ["bel"], titel: "Vertrauen in unsere Garantiemächte", text: {
                       stark: "London hat deutlich gemacht: Belgiens Neutralität ist ihm wichtig.",
                       mittel: "Frankreich hat zugesagt, unsere Neutralität zu achten. Aus London kommt nichts Genaues.",
                       schwach: "Es sieht so aus, als würde uns niemand beistehen." } } },

  /* Stimmungsanzeigen mit Kipppunkt (schrittweise, Rob 18.11.) */
  zusammenhaltOeu: { name: "Zusammenhalt des Vielvölkerreichs", start: "mittel", stufen: true, werte: { stark: "stark", mittel: "mittel", schwach: "schwach", gekippt: "gekippt" },
                     anzeige: { fuer: ["oeu"], titel: "Zusammenhalt unseres Reiches", text: {
                       stark: "Die Völker des Reiches sehen: Wien handelt. Die serbischen Nationalisten im eigenen Land werden leiser.",
                       mittel: "In Bosnien und Kroatien beobachtet man genau, ob Wien sich von Serbien herausfordern lässt.",
                       schwach: "Südslawische Nationalisten im Reich werden lauter. Tschechen und Ungarn fordern mehr Rechte.",
                       gekippt: "Unruhen in Bosnien und Kroatien. In Wien heißt es: Das Reich beginnt zu zerfallen." } } },
  souveraenitaetSrb: { name: "Serbiens Souveränität", start: "stark", stufen: true, werte: { stark: "stark", mittel: "mittel", schwach: "schwach", gekippt: "gekippt" },
                     anzeige: { fuer: ["srb"], titel: "Unsere Souveränität", text: {
                       stark: "Serbien entscheidet allein über seine Polizei, seine Armee und seine Zeitungen.",
                       mittel: "Wien mischt sich in unsere inneren Angelegenheiten ein.",
                       schwach: "Fremde Beamte reden in Belgrad mit. Viele sagen: Wir sind nicht mehr Herr im eigenen Land.",
                       gekippt: "Offiziere der „Schwarzen Hand“ drohen der Regierung offen. Pašić muss um seine Macht fürchten." } } },
  bindungEngland:  { name: "Englands Bindung an Frankreich", start: "mittel", stufen: true, werte: { stark: "stark", mittel: "mittel", schwach: "schwach", gekippt: "gekippt" },
                     anzeige: { fuer: ["f"], titel: "Englands Bindung an uns", text: {
                       stark: "London rückt näher. Ein festes Bündnis mit England wäre unsere größte Sicherheit.",
                       mittel: "Unsere Generäle sprechen sich mit den britischen ab – ein Bündnis ist das nicht.",
                       schwach: "London hält sich zurück. Ohne England ist ein Krieg gegen Deutschland sehr riskant.",
                       gekippt: "In London heißt es: Frankreichs Streit ist nicht Englands Streit. Wir stehen ohne England da." } } },
  irlandGB:        { name: "Innenpolitische Stabilität (Irland)", start: "mittel", stufen: true, werte: { stark: "stark", mittel: "mittel", schwach: "schwach", gekippt: "gekippt" },
                     anzeige: { fuer: ["gb"], titel: "Lage in Irland", text: {
                       stark: "Die Regierung kümmert sich um Irland. Die Lage beruhigt sich etwas.",
                       mittel: "In Irland stehen sich bewaffnete Gruppen gegenüber. Die Regierung verhandelt.",
                       schwach: "Während London auf den Kontinent schaut, rüsten in Irland beide Seiten weiter auf.",
                       gekippt: "In Irland fallen Schüsse. Truppen werden gebraucht, das Kabinett ist mit sich selbst beschäftigt." } } },
  souveraenitaetBel: { name: "Belgiens Souveränität", start: "stark", stufen: true, werte: { stark: "stark", mittel: "mittel", schwach: "schwach", gekippt: "gekippt" },
                     anzeige: { fuer: ["bel"], titel: "Unsere Souveränität und Neutralität", text: {
                       stark: "Belgien ist neutral und entscheidet selbst.",
                       mittel: "Die Großmächte behandeln Belgien wie ein Durchgangsland.",
                       schwach: "Belgien gilt kaum noch als neutral. Wer uns schützen soll, ist unklar.",
                       gekippt: "Belgien hat seine Neutralität verspielt. Keine Garantiemacht fühlt sich mehr verpflichtet." } } }
};

/* Was jede Entscheidung setzt. "2.oeu.wann" ist die Zusatzfrage zum Zeitpunkt des Ultimatums. */
export const SETZT = {
  "1.d":   { A: { deutscheLinie: "maessigung", vertrauenWiens: "schwach" }, B: { deutscheLinie: "diplomatisch" }, C: { deutscheLinie: "freieHand", vertrauenWiens: "stark" } },
  "1.srb": { A: { serbienHaltung: "leugnen", rueckhaltPasic: "mittel" }, B: { serbienHaltung: "ermittelt", rueckhaltPasic: "schwach" }, C: { serbienHaltung: "russlandGerufen" } },
  "1.r":   { A: { russlandHaltung: "nachgiebig", ansehenZar: "schwach" }, B: { russlandHaltung: "hinterSerbien", ansehenZar: "stark" }, C: { russlandHaltung: "abwartend" } },
  "1.f":   { A: { frankreichEngland: "ja", bindungEngland: "+1" }, B: { staatsbesuch: "ja" }, C: { staatsbesuch: "abgesagt", vertrauenRF: "schwach" } },
  "1.gb":  { A: { englandHaltung: "mahnend", irlandGB: "-1" }, B: { englandHaltung: "vermittelnd", irlandGB: "-1" }, C: { englandHaltung: "abseits", irlandGB: "+1" } },
  "1.oeu": { A: { wiensKurs: "grossmaechte", ansehenWien: "schwach", zusammenhaltOeu: "-1" }, B: { wiensKurs: "hart", ansehenWien: "stark", zusammenhaltOeu: "+1" }, C: { wiensKurs: "ermittlung", souveraenitaetSrb: "-1" } },

  "2.d":   { A: { deutscheLinie: "freieHand", vertrauenWiens: "stark" }, B: { deutscheLinie: "maessigung", vertrauenWiens: "schwach" }, C: { deutscheLinie: "freieHand", vertrauenWiens: "stark" } },
  "2.srb": { A: { rueckhaltPasic: "schwach", souveraenitaetSrb: "-1" }, B: { rueckhaltPasic: "stark" }, C: { rueckhaltPasic: "stark" } },
  "2.r":   { A: { russlandHaltung: "vermittelnd" }, B: { russlandHaltung: "hinterSerbien", ansehenZar: "stark" }, C: { russlandHaltung: "hinterSerbien" } },
  "2.f":   { A: { buendnisFR: "fest", vertrauenRF: "stark" }, B: { buendnisFR: "bedingt", vertrauenRF: "mittel" }, C: { buendnisFR: "zurueckhaltend", vertrauenRF: "schwach" } },
  "2.gb":  { A: { englandHaltung: "nachfragend", irlandGB: "-1" }, B: { englandHaltung: "abseits", irlandGB: "+1" }, C: { englandHaltung: "mahnend", irlandGB: "-1" } },
  "2.oeu": { A: { ultimatum: "unannehmbar", wiensKurs: "hart", ansehenWien: "stark", zusammenhaltOeu: "+1", souveraenitaetSrb: "-1" }, B: { ultimatum: "angriff", wiensKurs: "hart" }, C: { ultimatum: "erfuellbar", wiensKurs: "einlenkend", ansehenWien: "schwach", zusammenhaltOeu: "-1" } },
  "2.oeu.wann": { "sofort": { uebergabe: "vorBesuch" }, "während des Staatsbesuchs": { uebergabe: "waehrendBesuch" }, "nach dem Staatsbesuch": { uebergabe: "nachBesuch" }, "später": { uebergabe: "nachBesuch" } },

  "3.srb": { A: { serbAntwort: "fastAlles" }, B: { serbAntwort: "abgelehnt", rueckhaltPasic: "stark", souveraenitaetSrb: "+1" }, C: { serbAntwort: "alles", rueckhaltPasic: "schwach", souveraenitaetSrb: "-1" } },
  "3.r":   { A: { russlandHaltung: "vermittelnd" }, B: { russlandHaltung: "nachgiebig", ansehenZar: "schwach" }, C: { russlandHaltung: "hinterSerbien", ansehenZar: "stark", druckArmeeR: "mittel", druckGeneralstabD: "stark" } },
  "3.f":   { A: { buendnisFR: "fest", vertrauenRF: "stark" }, B: { buendnisFR: "bedingt", vertrauenRF: "mittel", bindungEngland: "+1" }, C: { buendnisFR: "zurueckhaltend", vertrauenRF: "schwach" } },
  "3.gb":  { A: { englandHaltung: "abseits", irlandGB: "+1", bindungEngland: "-1" }, B: { englandHaltung: "entente", irlandGB: "-1", bindungEngland: "+1" }, C: { englandHaltung: "vermittelnd", konferenz: "vorgeschlagen", irlandGB: "-1" } },
  "3.oeu": { A: { wiensKurs: "grossmaechte", ansehenWien: "schwach", zusammenhaltOeu: "-1" }, B: { wiensKurs: "hart", krieg: "ja", ansehenWien: "stark", druckArmeeR: "stark", zusammenhaltOeu: "+1" }, C: { wiensKurs: "einlenkend", ansehenWien: "schwach", zusammenhaltOeu: "-1" } },
  "3.d":   { A: { deutscheLinie: "freieHand", vertrauenWiens: "stark" }, B: { deutscheLinie: "maessigung", vertrauenWiens: "schwach" }, C: { deutscheLinie: "freieHand" } },

  "4.oeu": { A: { wiensKurs: "grossmaechte" }, B: { wiensKurs: "hart" }, C: { wiensKurs: "einlenkend" } },
  "4.bel": { A: { belgien: "nachgiebig", souveraenitaetBel: "-1" }, B: { belgien: "anlehnung", souveraenitaetBel: "-1" }, C: { belgien: "bewaffnet" } },
  "4.r":   { A: { mobRussland: "teil" }, B: { mobRussland: "keine", ansehenZar: "schwach", druckGeneralstabD: "mittel" }, C: { mobRussland: "allgemein", druckGeneralstabD: "stark" } },
  "4.f":   { A: { frankreichAuftreten: "bremst", vertrauenRF: "schwach" }, B: { frankreichAuftreten: "defensiv", parlamentGB: "mittel", bindungEngland: "+1" }, C: { frankreichAuftreten: "mobil", parlamentGB: "schwach", bindungEngland: "-1" } },
  "4.d":   { A: { grosserKrieg: "ja" }, B: { grosserKrieg: "ja" }, C: { deutscheLinie: "maessigung" } },
  "4.gb":  { A: { englandHaltung: "offen", irlandGB: "-1" }, B: { englandHaltung: "beistandF", vertrauenBEL: "stark", irlandGB: "-1" }, C: { englandHaltung: "neutralZugesagt", vertrauenBEL: "schwach", irlandGB: "+1" } },

  "5.d":   { A: { westen: "durchBelgien", parlamentGB: "stark", souveraenitaetBel: "-1" }, B: { westen: "keinAngriff" }, C: { westen: "direkt" } },
  "5.bel": { A: { belgien: "zoegert" }, B: { belgien: "widerstand", parlamentGB: "stark" }, C: { belgien: "durchlass", parlamentGB: "mittel", souveraenitaetBel: "-1" } },
  "5.gb":  { A: { englandHaltung: "krieg" }, B: { englandHaltung: "neutral" }, C: { englandHaltung: "kueste" } },
  "5.f": {}, "5.r": {}, "5.oeu": {}
};

/* Kipppunkte: Fällt eine schrittweise Anzeige unter „schwach“, tritt das ein. Der Text steht in der Anzeige („gekippt“). */
export const KIPPPUNKTE = {
  zusammenhaltOeu:   { setzt: { ansehenWien: "schwach" } },
  souveraenitaetSrb: { setzt: { rueckhaltPasic: "schwach" } },
  bindungEngland:    { setzt: { vertrauenRF: "schwach" } },
  irlandGB:          { setzt: { parlamentGB: "schwach" } },
  souveraenitaetBel: { setzt: { vertrauenBEL: "schwach" } }
};

export const VARIANTEN = [
  /* ---------- Runde 1 ---------- */
  { runde: 1, staat: "oeu", wenn: { deutscheLinie: ["maessigung"] },
    optionen: { B: { contra: "Berlin rät uns zur Zurückhaltung – ohne Deutschland sind wir gegen Russland zu schwach." } } },
  { runde: 1, staat: "oeu", wenn: { deutscheLinie: ["diplomatisch"] },
    optionen: { B: { contra: "Berlin unterstützt nur ein diplomatisches Vorgehen – ohne Deutschland sind wir gegen Russland zu schwach." } } },
  { runde: 1, staat: "oeu", wenn: { serbienHaltung: ["ermittelt"] },
    optionen: { C: { pro: "Serbien ermittelt schon selbst – darauf können wir aufbauen." } } },

  /* ---------- Runde 2 ---------- */
  { runde: 2, staat: "d", wenn: { deutscheLinie: ["maessigung"] }, kurswechsel: ["A", "C"],
    optionen: {
      B: { text: "Bei unserem Rat bleiben und Österreich-Ungarn weiter zur Mäßigung drängen.", pro: "Wir bleiben glaubwürdig.", contra: "Wien ist enttäuscht; unser einziges Bündnis leidet." },
      C: { contra: "Wien hat unseren Rat zur Zurückhaltung gehört – ein Kurswechsel macht uns unberechenbar." } } },
  { runde: 2, staat: "d", wenn: { deutscheLinie: ["diplomatisch"] }, kurswechsel: ["C"],
    optionen: { C: { text: "Wien nun doch freie Hand geben, zu schnellem Handeln drängen und nach außen Ruhe zeigen." } } },

  { runde: 2, staat: "oeu", wenn: { wiensKurs: ["grossmaechte"] }, kurswechsel: ["A"],
    optionen: {
      A: { text: "Die Beratung abbrechen und doch ein Ultimatum stellen, das tief in Serbiens Eigenständigkeit eingreift.", pro: "Wir handeln selbst, statt andere entscheiden zu lassen.", contra: "Wir stehen vor Europa als wortbrüchig da." },
      B: { text: "Das Ergebnis der Beratung der Großmächte abwarten.", pro: "Ein großer Krieg wird unwahrscheinlich.", contra: "Andere entscheiden über unseren Streit – auch Russland redet mit.",
           setzt: { ultimatum: "keins", wiensKurs: "grossmaechte", ansehenWien: "schwach" } } } },
  { runde: 2, staat: "oeu", wenn: { wiensKurs: ["ermittlung"] },
    optionen: {
      B: { text: "Die gemeinsame Ermittlung fortsetzen und abwarten.", pro: "Die Täter werden gefunden, ohne dass es Krieg gibt.", contra: "Serbien kann die Ermittlungen verschleppen; unsere Generäle verlieren die Geduld.",
           setzt: { ultimatum: "keins", wiensKurs: "ermittlung", ansehenWien: "schwach" } } } },
  { runde: 2, staat: "oeu", wenn: { wiensKurs: ["ermittlung"], serbienHaltung: ["ermittelt"] },
    optionen: { B: { pro: "Serbien hat schon Verdächtige festgenommen – die Ermittlung kommt voran." } } },
  { runde: 2, staat: "oeu", wenn: { staatsbesuch: ["abgesagt"] },
    zusatz: { wahl: ["sofort", "später"], historisch: "später" } },

  { runde: 2, staat: "f", wenn: { staatsbesuch: ["abgesagt"] },
    optionen: { A: { text: "Russland durch unseren Botschafter die volle Bündnistreue zusichern lassen." } } },
  { runde: 2, staat: "gb", wenn: { frankreichEngland: ["ja"] },
    optionen: { C: { text: "Gemeinsam mit Frankreich Österreich-Ungarn warnen, nicht zu weit zu gehen.", pro: "Zu zweit hat die Warnung mehr Gewicht.", contra: "Wir binden uns enger an Frankreich, als unser Kabinett will." } } },
  { runde: 2, staat: "gb", wenn: { englandHaltung: ["vermittelnd"], wiensKurs: ["grossmaechte"] },
    optionen: { A: { text: "Die Beratung der Großmächte in London leiten.", pro: "Wir sind der Vermittler, der wir sein wollen.", contra: "Irland bleibt liegen, und scheitert die Beratung, stehen wir blamiert da.",
                     setzt: { englandHaltung: "vermittelnd" } } } },
  { runde: 2, staat: "r", wenn: { russlandHaltung: ["hinterSerbien"] },
    optionen: { A: { contra: "Wir haben Serbien öffentlich Unterstützung zugesagt – jetzt nur zu vermitteln wirkt wie ein Rückzieher." } } },
  { runde: 2, staat: "srb", wenn: { serbienHaltung: ["ermittelt"] },
    optionen: { A: { pro: "Unsere eigene Untersuchung läuft schon – Gespräche passen dazu." } } },

  /* ---------- Runde 3 ---------- */
  { runde: 3, staat: "srb", wenn: { ultimatum: ["erfuellbar"] },
    optionen: {
      A: { text: "Fast alles annehmen, aber Zeit für die Bestrafung der Täter verlangen.", pro: "Wir zeigen guten Willen und gewinnen Zeit.", contra: "Wien kann sagen: Das Ultimatum wurde nicht erfüllt." },
      C: { contra: "Die Nationalisten im Land werfen uns Schwäche vor." } } },

  { runde: 3, staat: "oeu", wenn: { serbAntwort: ["alles"] },
    optionen: {
      A: { text: "Die Annahme feststellen und den Erfolg verkünden.", pro: "Wir haben alles erreicht, ohne Krieg.", contra: "Unsere Generäle sind enttäuscht – das Problem Serbien bleibt.",
           setzt: { wiensKurs: "einlenkend" } },
      B: { text: "Einen Grund suchen und Serbien trotzdem den Krieg erklären.", pro: "Wir lösen das Problem Serbien endlich.", contra: "Vor ganz Europa stehen wir als Angreifer da – Russland greift sicher ein." },
      C: { text: "Beamte nach Belgrad schicken und die Umsetzung genau prüfen.", pro: "Wir behalten den Druck auf Serbien.", contra: "Serbien könnte die Umsetzung verschleppen." } } },
  { runde: 3, staat: "oeu", wenn: { serbAntwort: ["abgelehnt"] },
    optionen: { B: { pro: "Serbien hat abgelehnt – Europa sieht uns im Recht." } } },
  { runde: 3, staat: "oeu", wenn: { konferenz: ["keine"] },
    optionen: { A: { text: "Russland direkte Gespräche anbieten.", pro: "Wir verhandeln, ohne dass andere mitentscheiden.", contra: "Russland steht hinter Serbien – die Gespräche könnten zu nichts führen." } } },

  { runde: 3, staat: "d", wenn: { konferenz: ["keine"] },
    optionen: { A: { text: "Österreich-Ungarn den Rücken stärken.", contra: "Wir lassen eine Gelegenheit zur Vermittlung verstreichen." } } },
  { runde: 3, staat: "d", wenn: { deutscheLinie: ["maessigung"] }, kurswechsel: ["A"],
    optionen: { A: { contra: "Bisher haben wir zur Mäßigung geraten – ein Kurswechsel macht uns unberechenbar." } } },

  { runde: 3, staat: "r", wenn: { buendnisFR: ["zurueckhaltend"] },
    optionen: { C: { contra: "Paris hat uns zur Zurückhaltung geraten – stehen wir am Ende allein?" } } },

  /* ---------- Runde 4 ---------- */
  { runde: 4, staat: "r", wenn: { buendnisFR: ["zurueckhaltend"] },
    optionen: { C: { contra: "Paris drängt zur Zurückhaltung – ohne Frankreich sind wir gegen Deutschland zu schwach." } } },
  { runde: 4, staat: "d", wenn: { mobRussland: ["keine"] },
    optionen: {
      A: { text: "Russland auffordern, seine Kriegsvorbereitungen einzustellen.", pro: "Wir zeigen Stärke, ohne selbst mobilzumachen.", contra: "Russland könnte das als Drohung sehen.", setzt: {} },
      B: { text: "Wien drängen, in Belgrad anzuhalten und zu verhandeln.", pro: "Der Krieg bleibt vielleicht auf den Balkan begrenzt.", contra: "Wien könnte sich im Stich gelassen fühlen.",
           setzt: { deutscheLinie: "maessigung" } } } },
  { runde: 4, staat: "gb", wenn: { frankreichAuftreten: ["mobil"] },
    optionen: { B: { contra: "Frankreich hat zuerst mobilgemacht – das Parlament wird uns kaum folgen." } } },
  { runde: 4, staat: "gb", wenn: { frankreichAuftreten: ["defensiv"] }, auch1914: true,
    optionen: { B: { pro: "Frankreich hat seine Truppen zurückgezogen – es ist nicht der Angreifer." } } },

  /* ---------- Runde 5 ---------- */
  { runde: 5, staat: "d", wenn: { englandHaltung: ["neutralZugesagt"] },
    optionen: { B: { pro: "England hat zugesagt, neutral zu bleiben – vielleicht bleibt es im Westen ruhig." } } },
  { runde: 5, staat: "f", wenn: { englandHaltung: ["beistandF"] },
    optionen: { B: { pro: "England hat uns Beistand zugesagt, wenn wir nicht die Angreifer sind." } } },
  { runde: 5, staat: "bel", wenn: { westen: ["keinAngriff", "direkt"] },
    optionen: {
      A: { text: "Neutral bleiben und abwarten.", pro: "Wir halten uns aus dem Krieg heraus.", contra: "Wir wissen nicht, ob Deutschland seine Pläne ändert.", setzt: { belgien: "neutral" } },
      B: { text: "Frankreich und England um eine Garantie bitten.", pro: "Wir hätten mächtige Beschützer.", contra: "Deutschland könnte das als Parteinahme sehen.", setzt: { belgien: "anlehnung" } },
      C: { text: "Die Armee an die Grenzen schicken und neutral bleiben.", pro: "Wir zeigen allen: Wir verteidigen unser Land.", contra: "Unsere kleine Armee wird teuer – und kann kaum bestehen.", setzt: { belgien: "bewaffnet" } } } },
  { runde: 5, staat: "gb", wenn: { westen: ["keinAngriff", "direkt"] },
    optionen: { A: { text: "Frankreich beistehen und Deutschland ein Ultimatum stellen.", contra: "Belgien wurde nicht angegriffen – das Parlament hat keinen klaren Grund." } } },
  { runde: 5, staat: "gb", wenn: { belgien: ["durchlass"] },
    optionen: { A: { contra: "Belgien hat den Durchmarsch selbst erlaubt – das Parlament zweifelt am Kriegsgrund." } } }
];

export const LAGE = [
  { runde: 1, fuer: ["oeu"], wenn: { deutscheLinie: ["maessigung"] }, text: "Aus Berlin kommt der Rat, Zurückhaltung zu üben. Deutschland bietet an zu vermitteln." },
  { runde: 1, fuer: ["oeu"], wenn: { serbienHaltung: ["ermittelt"] }, text: "Serbien hat eine eigene Untersuchung begonnen und Verdächtige festgenommen." },
  { runde: 1, fuer: ["oeu"], wenn: { russlandHaltung: ["hinterSerbien"] }, text: "Russland hat Serbien öffentlich Unterstützung zugesichert." },

  { runde: 2, fuer: "alle", wenn: { wiensKurs: ["grossmaechte"] }, text: "Wien hat die Großmächte gebeten, gemeinsam über Serbien zu beraten." },
  { runde: 2, fuer: "alle", wenn: { wiensKurs: ["ermittlung"] }, text: "Wien fordert Serbien auf, gemeinsam mit österreichischen Beamten die Hintermänner des Attentats zu ermitteln." },
  { runde: 2, fuer: "alle", wenn: { staatsbesuch: ["abgesagt"] }, ersetzt: true, text: "Europa wirkt ruhig. Kaiser Wilhelm II. bricht zu seiner jährlichen Schiffsreise nach Norwegen auf. Frankreichs Präsident Poincaré hat seinen Besuch beim Zaren abgesagt. In Wien wird hinter verschlossenen Türen beraten." },
  { runde: 2, fuer: ["r"], wenn: { staatsbesuch: ["abgesagt"] }, text: "In St. Petersburg fragt man sich, ob auf Frankreich Verlass ist." },
  { runde: 2, fuer: ["gb"], wenn: { frankreichEngland: ["ja"] }, text: "Paris hat euch gebeten, eine gemeinsame Linie abzustimmen." },

  { runde: 3, fuer: "alle", wenn: { ultimatum: ["erfuellbar"] }, ersetzt: true, text: "Österreich-Ungarn übergibt Serbien ein Ultimatum mit 48 Stunden Frist. Es fordert, die Täter zu bestrafen und die Hetze gegen Österreich-Ungarn zu verbieten." },
  { runde: 3, fuer: ["f", "r"], wenn: { uebergabe: ["vorBesuch", "waehrendBesuch"], staatsbesuch: ["ja"] }, text: "Das Ultimatum kam, während Präsident Poincaré noch in St. Petersburg war. Frankreich und Russland konnten sich absprechen." },
  { runde: 3, fuer: ["r"], wenn: { buendnisFR: ["zurueckhaltend"] }, text: "Paris hat euch zur Zurückhaltung auf dem Balkan geraten." },

  { runde: 4, fuer: ["d", "gb"], wenn: { mobRussland: ["allgemein"] }, text: "Russland macht seine gesamte Armee mobil." },
  { runde: 4, fuer: ["d", "gb"], wenn: { mobRussland: ["keine"] }, text: "Russland verhandelt weiter und macht nicht mobil." },
  { runde: 4, fuer: ["gb"], wenn: { frankreichAuftreten: ["mobil"] }, text: "Frankreich macht seine gesamte Armee mobil." },

  { runde: 5, fuer: ["bel", "gb"], wenn: { westen: ["keinAngriff", "direkt"] }, text: "Deutschland hat keinen Durchmarsch durch Belgien gefordert." },
  { runde: 5, fuer: ["gb"], wenn: { belgien: ["durchlass"] }, text: "Belgien lässt deutsche Truppen durch." },
  { runde: 5, fuer: ["gb"], wenn: { belgien: ["zoegert"] }, text: "Belgien hat um Bedenkzeit gebeten. Deutschland wartet nicht: Seine Truppen marschieren ein." },
  { runde: 5, fuer: ["gb"], wenn: { belgien: ["widerstand"] }, text: "Belgien lehnt den Durchmarsch ab. Deutsche Truppen marschieren ein." }
];

/* Grenzen werden direkt nach der eigenen Entscheidung geprüft (die eigene Entscheidung zählt schon mit). */
export const GRENZEN = [
  { runde: 2, staat: "oeu", wenn: { ultimatum: ["angriff"] }, neu: ["A", "C"],
    titel: "Die Armee ist nicht bereit",
    text: "Generalstabschef Conrad meldet: Viele Soldaten sind im Ernteurlaub, die Armee ist erst in einigen Wochen bereit. Der ungarische Ministerpräsident Graf Tisza verweigert einem Angriff ohne Vorwarnung seine Zustimmung. Entscheidet neu.",
    beleg: "Ministerrat 7.7.1914 (Tisza); Ernteurlaube bis Ende Juli – prüfen und belegen" },
  { runde: 4, staat: "r", wenn: { mobRussland: ["teil"] }, neu: ["B", "C"],
    titel: "Die Generäle schlagen Alarm",
    text: "Eure Armeeführung meldet: Eine Mobilmachung nur gegen Österreich-Ungarn ist nicht vorbereitet. Sie bringt alle Pläne durcheinander und verzögert eine spätere Gesamtmobilmachung um Wochen. Entscheidet neu.",
    beleg: "29./30.7.1914: Sasonow, Januschkewitsch, Suchomlinow überzeugen den Zaren – prüfen und belegen" },
  { runde: 4, staat: "d", wenn: { mobRussland: ["allgemein"], grosserKrieg: ["nein"] }, neu: ["A", "B", "C"],
    titel: "Der Generalstab drängt",
    text: "Generalstabschef von Moltke drängt: Russland macht seine gesamte Armee mobil. Jeder Tag, den wir warten, gefährdet den Schlieffen-Plan. Entscheidet, ob ihr dabei bleibt.",
    beleg: "30./31.7.1914 – prüfen und belegen" },
  { runde: 5, staat: "d", wenn: { westen: ["keinAngriff"] }, neu: ["A", "B", "C"],
    titel: "Es gibt keinen Plan für den Osten",
    text: "Generalstabschef von Moltke meldet: Für einen Krieg nur gegen Russland gibt es keinen Plan. Der Aufmarsch nach Westen läuft schon, ihn umzuwerfen dauert Wochen. Entscheidet, ob ihr dabei bleibt.",
    beleg: "1.8.1914, Moltke gegenüber Wilhelm II. (Moltke, Erinnerungen) – prüfen und belegen" }
];

/* nachRunde: wird nach dem Ende dieser Runde geprüft. weil: alle passenden Sätze werden gezeigt. */
export const AUSGAENGE = [
  { id: "frueh", nachRunde: 2, wenn: { ultimatum: ["keins"] },
    titel: "Die Krise ist beigelegt – vorerst",
    weil: [
      { wenn: { wiensKurs: ["grossmaechte"] }, text: "Österreich-Ungarn hat kein Ultimatum gestellt, sondern den Streit mit Serbien den Großmächten zur Beratung übergeben." },
      { wenn: { wiensKurs: ["ermittlung"] }, text: "Österreich-Ungarn hat kein Ultimatum gestellt, sondern gemeinsam mit Serbien die Hintermänner ermittelt." },
      { wenn: { deutscheLinie: ["maessigung", "diplomatisch"] }, text: "Deutschland hatte Wien keine freie Hand gegeben." },
      { wenn: { serbienHaltung: ["ermittelt"] }, text: "Serbien hat selbst ermittelt und Verdächtige festgenommen." }
    ],
    aber: "Ob der Frieden gehalten hätte, weiß niemand. Der Streit zwischen Österreich-Ungarn und Serbien, die Rivalität mit Russland und das Wettrüsten blieben bestehen.",
    war1914: "Am 7. Juli 1914 beschloss Wien, gegen Serbien vorzugehen – mit der Zusage aus Berlin im Rücken." },
  { id: "antwort", nachRunde: 3, wenn: { krieg: ["nein"] },
    titel: "Der große Krieg bleibt aus – vorerst",
    weil: [
      { wenn: { wiensKurs: ["grossmaechte"], konferenz: ["vorgeschlagen"] }, text: "Österreich-Ungarn hat der Botschafterkonferenz zugestimmt." },
      { wenn: { wiensKurs: ["grossmaechte"], konferenz: ["keine"] }, text: "Österreich-Ungarn hat Russland direkte Gespräche angeboten." },
      { wenn: { wiensKurs: ["einlenkend"], serbAntwort: ["fastAlles", "abgelehnt"] }, text: "Österreich-Ungarn hat Serbiens Antwort angenommen." },
      { wenn: { serbAntwort: ["alles"] }, text: "Serbien hat alle Forderungen erfüllt – Wien hatte keinen Kriegsgrund mehr." },
      { wenn: { ultimatum: ["erfuellbar"] }, text: "Wien hatte ein Ultimatum gestellt, das Serbien erfüllen konnte." },
      { wenn: { deutscheLinie: ["maessigung"] }, text: "Deutschland hat Wien gedrängt, nachzugeben." }
    ],
    aber: "Ob der Frieden gehalten hätte, weiß niemand. Österreich-Ungarn hätte vor seinen Völkern als schwach dagestanden, Serbien blieb ein Unruheherd.",
    war1914: "Am 25. Juli 1914 brach Wien die Beziehungen ab, obwohl Serbien fast alles angenommen hatte. Am 28. Juli erklärte es Serbien den Krieg." },
  { id: "balkan", nachRunde: 4, wenn: { mobRussland: ["keine"], grosserKrieg: ["nein"] },
    titel: "Der Krieg bleibt auf den Balkan begrenzt – vorerst",
    weil: [
      { wenn: {}, text: "Russland hat auf die Mobilmachung verzichtet." },
      { wenn: { deutscheLinie: ["maessigung"] }, text: "Deutschland hat Wien gedrängt, in Belgrad anzuhalten und zu verhandeln." },
      { wenn: { wiensKurs: ["grossmaechte", "einlenkend"] }, text: "Österreich-Ungarn war bereit zu verhandeln." },
      { wenn: { buendnisFR: ["zurueckhaltend"] }, text: "Frankreich hatte Russland zur Zurückhaltung geraten." }
    ],
    aber: "Zwischen Österreich-Ungarn und Serbien herrschte trotzdem Krieg, Belgrad wurde beschossen. Ob Russland auf Dauer zugesehen hätte, ist offen.",
    war1914: "Am 30. Juli 1914 befahl der Zar die Generalmobilmachung. Am 1. August erklärte Deutschland Russland den Krieg." }
];

export const ENDE = {
  titel: "Euer August 1914",
  weil: [
    { wenn: { westen: ["durchBelgien"], belgien: ["widerstand"], englandHaltung: ["krieg"] }, text: "Wie 1914: Deutschland marschiert durch Belgien, Belgien wehrt sich, England tritt in den Krieg ein." },
    { wenn: { englandHaltung: ["neutral"] }, text: "England bleibt neutral – Frankreich und Russland kämpfen ohne England." },
    { wenn: { englandHaltung: ["kueste"] }, text: "England schützt nur Frankreichs Küste und kämpft nicht an Land." },
    { wenn: { westen: ["direkt"] }, text: "Deutschland greift Frankreich direkt an und achtet Belgiens Neutralität." },
    { wenn: { westen: ["keinAngriff"] }, text: "Deutschland kämpft nur gegen Russland – im Westen ist es vorerst ruhig." },
    { wenn: { belgien: ["durchlass"] }, text: "Belgien lässt deutsche Truppen durch." },
    { wenn: { belgien: ["zoegert"] }, text: "Belgien bittet um Bedenkzeit – deutsche Truppen marschieren trotzdem ein." },
    { wenn: { englandHaltung: ["krieg"], westen: ["durchBelgien"], belgien: ["zoegert", "durchlass"] }, text: "England tritt in den Krieg ein, weil Deutschland Belgiens Neutralität verletzt." }
  ],
  war1914: "Am 4. August 1914 marschierten deutsche Truppen in Belgien ein. England erklärte Deutschland am Abend den Krieg."
};
