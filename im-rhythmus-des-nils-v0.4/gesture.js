/* Im Rhythmus des Nils – Gesten auf dem Querschnitt (ohne Zeitdruck).
   Jede Tippfläche mit data-g bekommt eine Geste. Während der Geste zeichnet dieses Modul eine leichte
   Rückmeldung in die Szene; erst wenn die Geste fertig ist, meldet es sich bei app.js (onDone).
   Bricht man ab, bleibt der Fortschritt erhalten.

   Gesten:
   pflug  – Gespann von links nach rechts über das Feld ziehen
   seil   – Messseil vom Stein aus am Feld entlang ziehen
   saat   – hin und her über das Feld wischen, bis überall Saat liegt
   ernte  – mit der Sichel durch die Halme wischen, bis alles abgeerntet ist
   stein  – auf dem umgefallenen Grenzstein nach oben wischen
   zug    – am Seil des Schadufs nach unten ziehen und loslassen
   korb   – Korb vom Haufen zum Ziel ziehen (Deich, Erdwall, Haus)
   flecht – im Zickzack über den Korb wischen */
import * as A from "./assets.js";
import { big, groundY } from "./scene.js";

const progress = new Map();
let sess = null;
let handlers = { onDone(){}, onTap(){}, canStart(){ return true; } };

export const resetProgress = () => progress.clear();
export const getProgress = key => progress.get(key);

const NS = "http://www.w3.org/2000/svg";
function toSvg(svg, e){
  const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
  return p.matrixTransform(svg.getScreenCTM().inverse());
}
const num = (el, k) => Number(el.dataset[k]);

/* Rückmeldung zeichnen */
function draw(){
  const s = sess, d = s.el.dataset, t = s.type;
  let svg = "";
  if (t === "pflug" || t === "seil"){
    const x0 = num(s.el, "x0"), x1 = num(s.el, "x1"), y = num(s.el, "y");
    const px = x0 + (x1 - x0) * s.p.v;
    if (t === "pflug"){
      svg += `<clipPath id="fxClip"><rect x="${x0}" y="${y - 40}" width="${Math.max(0, px - x0)}" height="60"/></clipPath>`;
      svg += `<g clip-path="url(#fxClip)">${A.fieldSoil("gepflueg", x0, x1, y, 14)}</g>`;
      svg += big(A.plowTeam({ x: px + 40, y, n: 1 }), px + 40, y, 0.92);
    } else {
      svg += `<path d="M${x0} ${y - 14} L ${px} ${y - 14}" stroke="${A.C.goldDark}" stroke-width="3" stroke-dasharray="9 3"/>`;
      svg += A.person({ x: px + 8, y: groundY(px + 8), pose: "seil", n: 0, scale: 1.32 });
    }
  }
  if (t === "saat" || t === "ernte"){
    const x0 = num(s.el, "x0"), x1 = num(s.el, "x1"), y = num(s.el, "y");
    const w = (x1 - x0) / s.p.bins.length;
    s.p.bins.forEach((on, i) => {
      if (!on) return;
      const bx = x0 + i * w;
      if (t === "saat") for (let k = 0; k < 3; k++) svg += `<ellipse cx="${(bx + w * (k + 0.5) / 3).toFixed(1)}" cy="${(y - 3 - ((i * 7 + k * 5) % 5)).toFixed(1)}" rx="1.8" ry="1.2" fill="${A.C.goldLight}" stroke="${A.C.goldDark}" stroke-width=".6"/>`;
    });
    if (t === "ernte") s.p.bins.forEach((on, i) => { const bx = x0 + i * w; svg += A.fieldPlants(on ? "stoppel" : (d.stage || "reif"), bx, bx + w + 0.5, y - 1, 3 + i * 5, 1.3); });
    if (s.x != null){
      const fx = Math.max(x0, Math.min(x1, s.x));
      svg += A.person({ x: fx - 14, y: groundY(fx - 14), pose: t === "saat" ? "saeen" : (d.kupfer ? "ernten2" : "ernten"), n: 2, scale: 1.32 });
    }
  }
  if (t === "stein"){
    const x = num(s.el, "sx"), y = num(s.el, "sy");
    const a = -90 * (1 - s.p.v);
    svg += `<g transform="rotate(${a.toFixed(1)} ${x + 5} ${y})"><path d="M${x - 5} ${y} L ${x - 4} ${y - 12} L ${x + 4} ${y - 12} L ${x + 5} ${y} Z" fill="${A.C.stone}" stroke="${A.C.ink}" stroke-width="1.4"/></g>`;
    svg += `<path d="M${x + 22} ${y - 6} l 0 -30 m -7 8 l 7 -8 l 7 8" fill="none" stroke="#fffaf0" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/>`;
  }
  if (t === "zug"){
    const x = num(s.el, "sx"), y = num(s.el, "sy");
    svg += big(A.shaduf({ x, y, t: 0.5 - 0.5 * s.p.v, n: 0, rope: 110 }), x, y, 1.18);
  }
  if (t === "korb" && s.x != null){
    svg += `<g transform="translate(${s.x.toFixed(1)} ${s.y.toFixed(1)})">${A.basketLoad(d.load || "erde")}</g>`;
    const tx = num(s.el, "tx"), ty = num(s.el, "ty");
    svg += `<circle cx="${tx}" cy="${ty}" r="34" fill="none" stroke="#fffaf0" stroke-width="3" stroke-dasharray="8 6"/>`;
  }
  if (t === "flecht"){
    const x = num(s.el, "sx"), y = num(s.el, "sy");
    svg += big(A.weaveBasket({ x, y, p: s.p.v }), x, y, 1.3);
  }
  s.fx.innerHTML = svg;
}

function start(el, e){
  const svg = el.ownerSVGElement;
  const type = el.dataset.g, id = el.dataset.id;
  const ok = handlers.canStart(type, id, el);
  if (ok !== true){ handlers.onTap(type, id, el, ok); return; }
  const key = type + ":" + id;
  let p = progress.get(key);
  if (!p){
    p = { v: 0 };
    if (type === "saat" || type === "ernte") p.bins = new Array(14).fill(false);
    if (type === "flecht"){ p.rev = 0; p.dir = 0; p.ext = null; }
    progress.set(key, p);
  }
  svg.querySelectorAll(`g.fx[data-key="${key}"]`).forEach(g => g.remove());
  const pos = toSvg(svg, e);
  sess = { el, svg, type, id, key, p, x0: pos.x, y0: pos.y, x: null, y: null, moved: 0, fx: document.createElementNS(NS, "g") };
  sess.fx.setAttribute("class", "fx");
  sess.fx.dataset.key = key;
  sess.fx.setAttribute("pointer-events", "none");
  svg.appendChild(sess.fx);
  if (type === "zug") svg.querySelectorAll(".shaduf-static").forEach(g => g.setAttribute("visibility", "hidden"));
  if (type === "ernte") svg.querySelectorAll(".plants-" + id).forEach(g => g.setAttribute("visibility", "hidden"));
  if (type === "stein") svg.querySelectorAll(".stone-" + id).forEach(g => g.setAttribute("visibility", "hidden"));
  try { el.setPointerCapture(e.pointerId); } catch (_){ /* ältere Browser */ }
  move(e);
}

function move(e){
  const s = sess; if (!s) return;
  const q = toSvg(s.svg, e);
  s.moved = Math.max(s.moved, Math.hypot(q.x - s.x0, q.y - s.y0));
  const lx = s.x;
  s.x = q.x; s.y = q.y;
  const el = s.el, t = s.type;
  if (t === "pflug" || t === "seil"){
    const x0 = num(el, "x0"), x1 = num(el, "x1");
    const cur = x0 + (x1 - x0) * s.p.v;
    // nur weiter, wenn der Finger am Gespann bleibt (kein Springen ans Ende)
    if (q.x > cur && q.x < cur + 90) s.p.v = Math.min(1, (q.x - x0) / (x1 - x0));
  }
  if (t === "saat" || t === "ernte"){
    const x0 = num(el, "x0"), x1 = num(el, "x1"), w = (x1 - x0) / s.p.bins.length;
    const a = Math.min(lx ?? q.x, q.x), b = Math.max(lx ?? q.x, q.x);
    s.p.bins.forEach((_, i) => { const c = x0 + (i + 0.5) * w; if (c >= a - w * 0.7 && c <= b + w * 0.7) s.p.bins[i] = true; });
    s.p.v = s.p.bins.filter(Boolean).length / s.p.bins.length;
  }
  if (t === "stein") s.p.v = Math.max(s.p.v, Math.min(1, (s.y0 - q.y) / 40));
  if (t === "zug") s.p.v = Math.max(0, Math.min(1, (q.y - s.y0) / 60));
  if (t === "flecht" && lx != null){
    const dx = q.x - lx;
    if (Math.abs(dx) > 2){
      const dir = Math.sign(dx);
      if (s.p.ext == null) s.p.ext = q.x;
      if (dir !== s.p.dir){
        if (s.p.dir !== 0 && Math.abs(q.x - s.p.ext) > 16) s.p.rev++;
        s.p.dir = dir; s.p.ext = q.x;
      }
      s.p.v = Math.min(1, s.p.rev / 6);
    }
  }
  draw();
  if (["pflug", "seil", "saat", "ernte"].includes(t) && s.p.v >= 0.92) finish(true);
  else if (t === "stein" && s.p.v >= 1) finish(true);
  else if (t === "flecht" && s.p.v >= 1) finish(true);
}

function end(e){
  const s = sess; if (!s) return;
  if (s.type === "zug") return finish(s.p.v >= 0.7);
  if (s.type === "korb"){
    const tx = num(s.el, "tx"), ty = num(s.el, "ty");
    return finish(s.x != null && Math.hypot(s.x - tx, s.y - ty) < 70);
  }
  if (s.moved < 8 && s.p.v === 0){ cleanup(); handlers.onTap(s.type, s.id, s.el); return; }
  cleanup(true);   // angefangene Arbeit bleibt sichtbar
}

function cleanup(keep = false){
  if (!sess) return;
  if (!keep){
    sess.fx.remove();
    sess.svg.querySelectorAll(".shaduf-static").forEach(g => g.removeAttribute("visibility"));
    if (sess.type === "ernte" && !progress.get(sess.key)?.v) sess.svg.querySelectorAll(".plants-" + sess.id).forEach(g => g.removeAttribute("visibility"));
    if (sess.type === "stein") sess.svg.querySelectorAll(".stone-" + sess.id).forEach(g => g.removeAttribute("visibility"));
  }
  sess = null;
}

function finish(done){
  const s = sess;
  if (s.type === "zug" || s.type === "korb"){ progress.delete(s.key); }
  cleanup();
  if (done){ progress.delete(s.key); handlers.onDone(s.type, s.id, s.el); }
}

export function initGestures(h){
  handlers = { ...handlers, ...h };
  document.addEventListener("pointerdown", e => {
    const el = e.target.closest?.("[data-g]");
    if (!el || sess) return;
    e.preventDefault();
    start(el, e);
  });
  document.addEventListener("pointermove", e => { if (sess){ e.preventDefault(); move(e); } }, { passive: false });
  document.addEventListener("pointerup", end);
  document.addEventListener("pointercancel", () => cleanup());
  // Seite darf während einer Geste nicht scrollen
  document.addEventListener("touchmove", e => { if (sess) e.preventDefault(); }, { passive: false });
  // Tastatur: Enter auf einer Tippfläche erledigt die Arbeit ohne Geste
  document.addEventListener("keydown", e => {
    const el = e.target.closest?.("[data-g]");
    if (!el || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    const ok = handlers.canStart(el.dataset.g, el.dataset.id, el);
    if (ok !== true) handlers.onTap(el.dataset.g, el.dataset.id, el, ok);
    else handlers.onDone(el.dataset.g, el.dataset.id, el);
  });
}
