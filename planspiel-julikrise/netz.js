/* Planspiel Julikrise 1914 – Entscheidungsnetz (Entwurf zum Gegenlesen).
   Ansicht als Netz: netz.html

   Jede Entscheidung heißt "Runde.Staat", z. B. "1.d" = Deutsches Reich in Runde 1. Ihr Wert ist A, B oder C.
   wenn: { "1.d": ["A", "B"] }  heißt: gilt, wenn D in Runde 1 A oder B gewählt hat.
               Mehrere Einträge müssen alle zutreffen. "2.oeu.wann" ist die Zusatzfrage (Zeitpunkt des Ultimatums).
   Ein Buchstabe behält in allen Varianten möglichst dieselbe Richtung (A, B, C wie auf der Papierkarte),
   damit spätere Bedingungen eindeutig bleiben.

   VARIANTEN  ändern die Karte eines Staates: Optionen (ganz oder nur pro/contra), Marke „Kurswechsel“, Zusatzfrage.
   LAGE       ergänzt oder ersetzt den Lagetext einer Runde, für alle oder nur für bestimmte Staaten.
   GRENZEN    Ereignisse nach einer Entscheidung: Die Wirklichkeit antwortet, die Delegation entscheidet neu.
   AUSGAENGE  frühe Enden. Danach Übergang in die „Akte 1914“ (angekündigte Regel, siehe DESIGN.md).

   auch1914: true  = Variante greift auch auf dem Weg von 1914 (sonst bleibt dort alles wie auf Papier).

   Texte in "beleg" sind Arbeitsnotizen für Rob (Herkunft prüfen), sie erscheinen nicht im Spiel. */

export const VARIANTEN = [
  /* ---------- Runde 1 ---------- */
  { runde: 1, staat: "oeu", wenn: { "1.d": ["A"] },
    optionen: { B: { contra: "Berlin rät uns zur Zurückhaltung – ohne Deutschland sind wir gegen Russland zu schwach." } } },
  { runde: 1, staat: "oeu", wenn: { "1.d": ["B"] },
    optionen: { B: { contra: "Berlin unterstützt nur ein diplomatisches Vorgehen – ohne Deutschland sind wir gegen Russland zu schwach." } } },
  { runde: 1, staat: "oeu", wenn: { "1.srb": ["B"] },
    optionen: { C: { pro: "Serbien ermittelt schon selbst – darauf können wir aufbauen." } } },

  /* ---------- Runde 2 ---------- */
  { runde: 2, staat: "d", wenn: { "1.d": ["A"] }, kurswechsel: ["C"],
    optionen: {
      B: { text: "Bei unserem Rat bleiben und Österreich-Ungarn weiter zur Mäßigung drängen.", pro: "Wir bleiben glaubwürdig.", contra: "Wien ist enttäuscht; unser einziges Bündnis leidet." },
      C: { contra: "Wien hat unseren Rat zur Zurückhaltung gehört – ein Kurswechsel macht uns unberechenbar." } } },
  { runde: 2, staat: "d", wenn: { "1.d": ["B"] }, kurswechsel: ["C"],
    optionen: { C: { text: "Wien nun doch freie Hand geben, zu schnellem Handeln drängen und nach außen Ruhe zeigen." } } },

  { runde: 2, staat: "oeu", wenn: { "1.oeu": ["A"] },
    optionen: {
      A: { text: "Die Beratung abbrechen und doch ein Ultimatum stellen, das tief in Serbiens Eigenständigkeit eingreift.", pro: "Wir handeln selbst, statt andere entscheiden zu lassen.", contra: "Wir stehen vor Europa als wortbrüchig da." },
      B: { text: "Das Ergebnis der Beratung der Großmächte abwarten.", pro: "Ein großer Krieg wird unwahrscheinlich.", contra: "Andere entscheiden über unseren Streit – auch Russland redet mit." } },
    kurswechsel: ["A"] },
  { runde: 2, staat: "oeu", wenn: { "1.oeu": ["C"] },
    optionen: {
      B: { text: "Die gemeinsame Ermittlung fortsetzen und abwarten.", pro: "Die Täter werden gefunden, ohne dass es Krieg gibt.", contra: "Serbien kann die Ermittlungen verschleppen; unsere Generäle verlieren die Geduld." } } },
  { runde: 2, staat: "oeu", wenn: { "1.oeu": ["C"], "1.srb": ["B"] },
    optionen: { B: { pro: "Serbien hat schon Verdächtige festgenommen – die Ermittlung kommt voran." } } },
  { runde: 2, staat: "oeu", wenn: { "1.f": ["C"] },
    zusatz: { wahl: ["sofort", "später"], historisch: "später" } },

  { runde: 2, staat: "f", wenn: { "1.f": ["C"] },
    optionen: { A: { text: "Russland durch unseren Botschafter die volle Bündnistreue zusichern lassen." } } },
  { runde: 2, staat: "gb", wenn: { "1.f": ["A"] },
    optionen: { C: { text: "Gemeinsam mit Frankreich Österreich-Ungarn warnen, nicht zu weit zu gehen.", pro: "Zu zweit hat die Warnung mehr Gewicht.", contra: "Wir binden uns enger an Frankreich, als unser Kabinett will." } } },
  { runde: 2, staat: "gb", wenn: { "1.gb": ["B"], "1.oeu": ["A"] },
    optionen: { A: { text: "Die Beratung der Großmächte in London leiten.", pro: "Wir sind der Vermittler, der wir sein wollen.", contra: "Irland bleibt liegen, und scheitert die Beratung, stehen wir blamiert da." } } },
  { runde: 2, staat: "r", wenn: { "1.r": ["B"] },
    optionen: { A: { contra: "Wir haben Serbien öffentlich Unterstützung zugesagt – jetzt nur zu vermitteln wirkt wie ein Rückzieher." } } },
  { runde: 2, staat: "srb", wenn: { "1.srb": ["B"] },
    optionen: { A: { pro: "Unsere eigene Untersuchung läuft schon – Gespräche passen dazu." } } },

  /* ---------- Runde 3 ---------- */
  { runde: 3, staat: "srb", wenn: { "2.oeu": ["C"] },
    optionen: {
      A: { text: "Fast alles annehmen, aber Zeit für die Bestrafung der Täter verlangen.", pro: "Wir zeigen guten Willen und gewinnen Zeit.", contra: "Wien kann sagen: Das Ultimatum wurde nicht erfüllt." },
      C: { contra: "Die Nationalisten im Land werfen uns Schwäche vor." } } },

  { runde: 3, staat: "oeu", wenn: { "3.srb": ["C"] },
    optionen: {
      A: { text: "Die Annahme feststellen und den Erfolg verkünden.", pro: "Wir haben alles erreicht, ohne Krieg.", contra: "Unsere Generäle sind enttäuscht – das Problem Serbien bleibt." },
      B: { text: "Einen Grund suchen und Serbien trotzdem den Krieg erklären.", pro: "Wir lösen das Problem Serbien endlich.", contra: "Vor ganz Europa stehen wir als Angreifer da – Russland greift sicher ein." },
      C: { text: "Beamte nach Belgrad schicken und die Umsetzung genau prüfen.", pro: "Wir behalten den Druck auf Serbien.", contra: "Serbien könnte die Umsetzung verschleppen." } } },
  { runde: 3, staat: "oeu", wenn: { "3.srb": ["B"] },
    optionen: { B: { pro: "Serbien hat abgelehnt – Europa sieht uns im Recht." } } },
  { runde: 3, staat: "oeu", wenn: { "3.gb": ["A", "B"] },
    optionen: { A: { text: "Russland direkte Gespräche anbieten.", pro: "Wir verhandeln, ohne dass andere mitentscheiden.", contra: "Russland steht hinter Serbien – die Gespräche könnten zu nichts führen." } } },

  { runde: 3, staat: "d", wenn: { "3.gb": ["A", "B"] },
    optionen: {
      A: { text: "Österreich-Ungarn den Rücken stärken.", contra: "Wir lassen eine Gelegenheit zur Vermittlung verstreichen." },
      C: { text: "Selbst eine Vermittlung zwischen Wien und St. Petersburg anbieten.", pro: "Wir zeigen Europa, dass wir Frieden wollen.", contra: "Wien könnte sich bevormundet fühlen." } } },
  { runde: 3, staat: "d", wenn: { "2.d": ["A", "B"] }, kurswechsel: ["A"],
    optionen: { A: { contra: "Bisher haben wir zur Mäßigung geraten – ein Kurswechsel macht uns unberechenbar." } } },

  { runde: 3, staat: "r", wenn: { "2.f": ["C"] },
    optionen: { C: { contra: "Paris hat uns zur Zurückhaltung geraten – stehen wir am Ende allein?" } } },

  /* ---------- Runde 4 ---------- */
  { runde: 4, staat: "r", wenn: { "3.f": ["C"] },
    optionen: { C: { contra: "Paris drängt zur Zurückhaltung – ohne Frankreich sind wir gegen Deutschland zu schwach." } } },
  { runde: 4, staat: "d", wenn: { "4.r": ["B"] },
    optionen: {
      A: { text: "Russland auffordern, seine Kriegsvorbereitungen einzustellen.", pro: "Wir zeigen Stärke, ohne selbst mobilzumachen.", contra: "Russland könnte das als Drohung sehen." },
      B: { text: "Wien drängen, in Belgrad anzuhalten und zu verhandeln.", pro: "Der Krieg bleibt vielleicht auf den Balkan begrenzt.", contra: "Wien könnte sich im Stich gelassen fühlen." } } },
  { runde: 4, staat: "gb", wenn: { "4.f": ["C"] },
    optionen: { B: { contra: "Frankreich hat zuerst mobilgemacht – das Parlament wird uns kaum folgen." } } },
  { runde: 4, staat: "gb", wenn: { "4.f": ["B"] }, auch1914: true,
    optionen: { B: { pro: "Frankreich hat seine Truppen zurückgezogen – es ist nicht der Angreifer." } } },

  /* ---------- Runde 5 ---------- */
  { runde: 5, staat: "d", wenn: { "4.gb": ["C"] },
    optionen: { B: { pro: "England hat zugesagt, neutral zu bleiben – vielleicht bleibt es im Westen ruhig." } } },
  { runde: 5, staat: "f", wenn: { "4.gb": ["B"] },
    optionen: { B: { pro: "England hat uns Beistand zugesagt, wenn wir nicht die Angreifer sind." } } },
  { runde: 5, staat: "bel", wenn: { "5.d": ["B", "C"] },
    optionen: {
      A: { text: "Neutral bleiben und abwarten.", pro: "Wir halten uns aus dem Krieg heraus.", contra: "Wir wissen nicht, ob Deutschland seine Pläne ändert." },
      B: { text: "Frankreich und England um eine Garantie bitten.", pro: "Wir hätten mächtige Beschützer.", contra: "Deutschland könnte das als Parteinahme sehen." },
      C: { text: "Die Armee an die Grenzen schicken und neutral bleiben.", pro: "Wir zeigen allen: Wir verteidigen unser Land.", contra: "Unsere kleine Armee wird teuer – und kann kaum bestehen." } } },
  { runde: 5, staat: "gb", wenn: { "5.d": ["B", "C"] },
    optionen: {
      A: { text: "Frankreich beistehen und Deutschland ein Ultimatum stellen.", contra: "Belgien wurde nicht angegriffen – das Parlament hat keinen klaren Grund." } } },
  { runde: 5, staat: "gb", wenn: { "5.bel": ["A", "C"] },
    optionen: { A: { contra: "Belgien hat den Durchmarsch selbst erlaubt – das Parlament zweifelt am Kriegsgrund." } } }
];

export const LAGE = [
  { runde: 1, fuer: ["oeu"], wenn: { "1.d": ["A"] }, text: "Aus Berlin kommt der Rat, Zurückhaltung zu üben. Deutschland bietet an zu vermitteln." },
  { runde: 1, fuer: ["oeu"], wenn: { "1.srb": ["B"] }, text: "Serbien hat eine eigene Untersuchung begonnen und Verdächtige festgenommen." },
  { runde: 1, fuer: ["oeu"], wenn: { "1.r": ["B"] }, text: "Russland hat Serbien öffentlich Unterstützung zugesichert." },

  { runde: 2, fuer: "alle", wenn: { "1.oeu": ["A"] }, text: "Wien hat die Großmächte gebeten, gemeinsam über Serbien zu beraten." },
  { runde: 2, fuer: "alle", wenn: { "1.oeu": ["C"] }, text: "Wien fordert Serbien auf, gemeinsam mit österreichischen Beamten die Hintermänner des Attentats zu ermitteln." },
  { runde: 2, fuer: "alle", wenn: { "1.f": ["C"] }, ersetzt: true, text: "Europa wirkt ruhig. Kaiser Wilhelm II. bricht zu seiner jährlichen Schiffsreise nach Norwegen auf. Frankreichs Präsident Poincaré hat seinen Besuch beim Zaren abgesagt. In Wien wird hinter verschlossenen Türen beraten." },
  { runde: 2, fuer: ["r"], wenn: { "1.f": ["C"] }, text: "In St. Petersburg fragt man sich, ob auf Frankreich Verlass ist." },
  { runde: 2, fuer: ["gb"], wenn: { "1.f": ["A"] }, text: "Paris hat euch gebeten, eine gemeinsame Linie abzustimmen." },

  { runde: 3, fuer: "alle", wenn: { "2.oeu": ["C"] }, ersetzt: true, text: "Österreich-Ungarn übergibt Serbien ein Ultimatum mit 48 Stunden Frist. Es fordert, die Täter zu bestrafen und die Hetze gegen Österreich-Ungarn zu verbieten." },
  { runde: 3, fuer: ["f", "r"], wenn: { "2.oeu": ["A", "C"], "2.oeu.wann": ["sofort", "während des Staatsbesuchs"], "1.f": ["B"] }, text: "Das Ultimatum kam, während Präsident Poincaré noch in St. Petersburg war. Frankreich und Russland konnten sich absprechen." },
  { runde: 3, fuer: ["r"], wenn: { "2.f": ["C"] }, text: "Paris hat euch zur Zurückhaltung auf dem Balkan geraten." },

  { runde: 4, fuer: ["d", "gb"], wenn: { "4.r": ["C"] }, text: "Russland macht seine gesamte Armee mobil." },
  { runde: 4, fuer: ["d", "gb"], wenn: { "4.r": ["B"] }, text: "Russland verhandelt weiter und macht nicht mobil." },
  { runde: 4, fuer: ["gb"], wenn: { "4.f": ["C"] }, text: "Frankreich macht seine gesamte Armee mobil." },

  { runde: 5, fuer: ["bel", "gb"], wenn: { "5.d": ["B", "C"] }, text: "Deutschland hat keinen Durchmarsch durch Belgien gefordert." },
  { runde: 5, fuer: ["gb"], wenn: { "5.bel": ["A", "C"] }, text: "Belgien lässt deutsche Truppen durch." },
  { runde: 5, fuer: ["gb"], wenn: { "5.bel": ["B"] }, text: "Belgien lehnt den Durchmarsch ab. Deutsche Truppen marschieren ein." }
];

export const GRENZEN = [
  { runde: 2, staat: "oeu", wenn: { "2.oeu": ["B"], "1.oeu": ["B"] }, neu: ["A", "C"],
    titel: "Die Armee ist nicht bereit",
    text: "Generalstabschef Conrad meldet: Viele Soldaten sind im Ernteurlaub, die Armee ist erst in einigen Wochen bereit. Der ungarische Ministerpräsident Graf Tisza verweigert einem Angriff ohne Vorwarnung seine Zustimmung. Entscheidet neu.",
    beleg: "Ministerrat 7.7.1914 (Tisza); Ernteurlaube bis Ende Juli – prüfen und belegen" },
  { runde: 4, staat: "r", wenn: { "4.r": ["A"] }, neu: ["B", "C"],
    titel: "Die Generäle schlagen Alarm",
    text: "Eure Armeeführung meldet: Eine Mobilmachung nur gegen Österreich-Ungarn ist nicht vorbereitet. Sie bringt alle Pläne durcheinander und verzögert eine spätere Gesamtmobilmachung um Wochen. Entscheidet neu.",
    beleg: "29./30.7.1914: Sasonow, Januschkewitsch, Suchomlinow überzeugen den Zaren – prüfen und belegen" },
  { runde: 4, staat: "d", wenn: { "4.r": ["C"], "4.d": ["C"] }, neu: ["A", "B", "C"],
    titel: "Der Generalstab drängt",
    text: "Generalstabschef von Moltke drängt: Russland macht seine gesamte Armee mobil. Jeder Tag, den wir warten, gefährdet den Schlieffen-Plan. Entscheidet, ob ihr dabei bleibt.",
    beleg: "30./31.7.1914 – prüfen und belegen" },
  { runde: 5, staat: "d", wenn: { "5.d": ["B"] }, neu: ["A", "B", "C"],
    titel: "Es gibt keinen Plan für den Osten",
    text: "Generalstabschef von Moltke meldet: Für einen Krieg nur gegen Russland gibt es keinen Plan. Der Aufmarsch nach Westen läuft schon, ihn umzuwerfen dauert Wochen. Entscheidet, ob ihr dabei bleibt.",
    beleg: "1.8.1914, Moltke gegenüber Wilhelm II. (Moltke, Erinnerungen) – prüfen und belegen" }
];

/* nachRunde: wird nach dem Ende dieser Runde geprüft.
   weil: alle passenden Sätze werden gezeigt – so steht dort konkret, welche Entscheidung den Unterschied machte. */
export const AUSGAENGE = [
  { id: "frueh", nachRunde: 2, wenn: { "1.oeu": ["A", "C"], "2.oeu": ["B"] },
    titel: "Die Krise ist beigelegt – vorerst",
    weil: [
      { wenn: { "1.oeu": ["A"] }, text: "Österreich-Ungarn hat kein Ultimatum gestellt, sondern den Streit mit Serbien den Großmächten zur Beratung übergeben." },
      { wenn: { "1.oeu": ["C"] }, text: "Österreich-Ungarn hat kein Ultimatum gestellt, sondern gemeinsam mit Serbien die Hintermänner ermittelt." },
      { wenn: { "1.d": ["A", "B"] }, text: "Deutschland hatte Wien keine freie Hand gegeben." },
      { wenn: { "1.srb": ["B"] }, text: "Serbien hat selbst ermittelt und Verdächtige festgenommen." }
    ],
    aber: "Ob der Frieden gehalten hätte, weiß niemand. Der Streit zwischen Österreich-Ungarn und Serbien, die Rivalität mit Russland und das Wettrüsten blieben bestehen.",
    war1914: "Am 7. Juli 1914 beschloss Wien, gegen Serbien vorzugehen – mit der Zusage aus Berlin im Rücken." },
  { id: "antwort", nachRunde: 3, wenn: { "3.oeu": ["A", "C"] },
    titel: "Der große Krieg bleibt aus – vorerst",
    weil: [
      { wenn: { "3.oeu": ["A"], "3.gb": ["C"] }, text: "Österreich-Ungarn hat der Botschafterkonferenz zugestimmt." },
      { wenn: { "3.oeu": ["A"], "3.gb": ["A", "B"] }, text: "Österreich-Ungarn hat Russland direkte Gespräche angeboten." },
      { wenn: { "3.oeu": ["C"], "3.srb": ["A", "B"] }, text: "Österreich-Ungarn hat Serbiens Antwort angenommen." },
      { wenn: { "3.oeu": ["C"], "3.srb": ["C"] }, text: "Serbien hat das Ultimatum vollständig angenommen, und Österreich-Ungarn hat sich darauf eingelassen." },
      { wenn: { "3.srb": ["C"] }, text: "Serbien hat alle Forderungen erfüllt – Wien hatte keinen Kriegsgrund mehr." },
      { wenn: { "3.d": ["B", "C"] }, text: "Deutschland hat Wien gedrängt, nachzugeben oder zu verhandeln." }
    ],
    aber: "Ob der Frieden gehalten hätte, weiß niemand. Österreich-Ungarn hätte vor seinen Völkern als schwach dagestanden, Serbien blieb ein Unruheherd.",
    war1914: "Am 25. Juli 1914 brach Wien die Beziehungen ab, obwohl Serbien fast alles angenommen hatte. Am 28. Juli erklärte es Serbien den Krieg." },
  { id: "balkan", nachRunde: 4, wenn: { "4.r": ["B"], "4.d": ["B", "C"] },
    titel: "Der Krieg bleibt auf den Balkan begrenzt – vorerst",
    weil: [
      { wenn: {}, text: "Russland hat auf die Mobilmachung verzichtet." },
      { wenn: { "4.d": ["B"] }, text: "Deutschland hat Wien gedrängt, in Belgrad anzuhalten und zu verhandeln." },
      { wenn: { "4.oeu": ["A", "C"] }, text: "Österreich-Ungarn war bereit zu verhandeln." }
    ],
    aber: "Zwischen Österreich-Ungarn und Serbien herrschte trotzdem Krieg, Belgrad wurde beschossen. Ob Russland auf Dauer zugesehen hätte, ist offen.",
    war1914: "Am 30. Juli 1914 befahl der Zar die Generalmobilmachung. Am 1. August erklärte Deutschland Russland den Krieg." }
];

/* Ende nach Runde 5 – immer. Die Sätze zeigen, wie sich euer August 1914 vom tatsächlichen unterscheidet. */
export const ENDE = {
  titel: "Euer August 1914",
  weil: [
    { wenn: { "5.d": ["A"], "5.bel": ["B"], "5.gb": ["A"] }, text: "Wie 1914: Deutschland marschiert durch Belgien, Belgien wehrt sich, England tritt in den Krieg ein." },
    { wenn: { "5.gb": ["B"] }, text: "England bleibt neutral – Frankreich und Russland kämpfen ohne England." },
    { wenn: { "5.gb": ["C"] }, text: "England schützt nur Frankreichs Küste und kämpft nicht an Land." },
    { wenn: { "5.d": ["C"] }, text: "Deutschland greift Frankreich direkt an und achtet Belgiens Neutralität." },
    { wenn: { "5.d": ["B"] }, text: "Deutschland kämpft nur gegen Russland – im Westen ist es vorerst ruhig." },
    { wenn: { "5.bel": ["A", "C"] }, text: "Belgien lässt deutsche Truppen durch." }
  ],
  war1914: "Am 4. August 1914 marschierten deutsche Truppen in Belgien ein. England erklärte Deutschland am Abend den Krieg."
};
