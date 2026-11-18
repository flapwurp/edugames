/* Planspiel Julikrise 1914 – Flaggen der Staaten im Sommer 1914 (eigene SVG-Zeichnungen, Seitenverhältnis 3:2).
   Vereinfachungen sind vermerkt. Farben bewusst etwas gedämpft, passend zum Papierlook. */

const quer = (farben) => farben.map((f, i) => `<rect y="${i * 20 / farben.length}" width="30" height="${20 / farben.length + 0.05}" fill="${f}"/>`).join("");
const hoch = (farben) => farben.map((f, i) => `<rect x="${i * 10}" width="10.05" height="20" fill="${f}"/>`).join("");

const ROT = "#c0272d", WEISS = "#f4f1e8", BLAU = "#22427a", SCHWARZ = "#1c1c1c", GELB = "#e8bf2a", GRUEN = "#3a7a46";

export const FLAGGEN = {
  d:   { titel: "Deutsches Reich: Schwarz-Weiß-Rot (Reichsflagge 1871–1918)", svg: () => quer([SCHWARZ, WEISS, ROT]) },
  oeu: { titel: "Österreich-Ungarn: Handelsflagge 1869–1918, vereinfacht ohne Wappen (links Österreich, rechts Ungarn)",
         svg: () => `<rect width="15" height="20" fill="${WEISS}"/><rect width="15" height="6.67" fill="${ROT}"/><rect y="13.33" width="15" height="6.67" fill="${ROT}"/>
                     <rect x="15" width="15" height="20" fill="${WEISS}"/><rect x="15" width="15" height="6.67" fill="${ROT}"/><rect x="15" y="13.33" width="15" height="6.67" fill="${GRUEN}"/>` },
  srb: { titel: "Königreich Serbien: Rot-Blau-Weiß (Handelsflagge, ohne Wappen)", svg: () => quer([ROT, BLAU, WEISS]) },
  bel: { titel: "Belgien: Schwarz-Gelb-Rot", svg: () => hoch([SCHWARZ, GELB, ROT]) },
  r:   { titel: "Russisches Reich: Weiß-Blau-Rot", svg: () => quer([WEISS, BLAU, ROT]) },
  f:   { titel: "Frankreich: Blau-Weiß-Rot", svg: () => hoch([BLAU, WEISS, ROT]) },
  gb:  { titel: "Vereinigtes Königreich: Union Flag (seit 1801)",
         svg: (id) => `<clipPath id="${id}t"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath>
           <g transform="scale(0.5 0.6667)"><rect width="60" height="30" fill="#1f2f63"/>
           <path d="M0,0 L60,30 M60,0 L0,30" stroke="${WEISS}" stroke-width="6"/>
           <path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#${id}t)" stroke="${ROT}" stroke-width="4"/>
           <path d="M30,0 v30 M0,15 h60" stroke="${WEISS}" stroke-width="10"/>
           <path d="M30,0 v30 M0,15 h60" stroke="${ROT}" stroke-width="6"/></g>` }
};

let zaehler = 0;
/* Flagge als SVG-Text, mit leichtem Faltenwurf und Schatten. */
export function flagge(staat, breite = 66) {
  const id = `fl${staat}${++zaehler}`;
  const f = FLAGGEN[staat];
  return `<svg class="flagge" width="${breite}" height="${breite * 2 / 3}" viewBox="0 0 30 20" role="img" aria-label="${f.titel}">
    <title>${f.titel}</title>
    <defs><linearGradient id="${id}w" x1="0" x2="1">
      <stop offset="0" stop-color="#000" stop-opacity=".18"/><stop offset=".3" stop-color="#fff" stop-opacity=".14"/>
      <stop offset=".55" stop-color="#000" stop-opacity=".12"/><stop offset=".8" stop-color="#fff" stop-opacity=".1"/>
      <stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient></defs>
    ${f.svg(id)}<rect width="30" height="20" fill="url(#${id}w)"/><rect width="30" height="20" fill="none" stroke="#000" stroke-opacity=".25" stroke-width=".4"/></svg>`;
}
