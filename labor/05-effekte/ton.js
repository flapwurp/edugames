// Labor, Schritt 5: Klangkulisse, komplett mit Web Audio berechnet (keine Tondateien).
// Wind (gefiltertes Rauschen), Vögel in der Morgendämmerung, Grillen in der Nacht.
// Startet erst nach einem Tippen: Safari gibt Ton nur nach einer Berührung frei.

export function erzeugeTon(){
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  const ctx = new AC();
  const master = ctx.createGain(); master.gain.value = 0; master.connect(ctx.destination);

  // Wind: Rauschen durch einen Bandpass, dessen Frequenz langsam wandert
  const n = ctx.sampleRate * 2, buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < n; i++){ last = last * .97 + (Math.random() * 2 - 1) * .03; d[i] = last * 6; }
  const rauschen = ctx.createBufferSource(); rauschen.buffer = buf; rauschen.loop = true;
  const band = ctx.createBiquadFilter(); band.type = "bandpass"; band.frequency.value = 500; band.Q.value = .7;
  const wind = ctx.createGain(); wind.gain.value = 0;
  rauschen.connect(band).connect(wind).connect(master);
  const lfo = ctx.createOscillator(), lfoTiefe = ctx.createGain();
  lfo.frequency.value = .07; lfoTiefe.gain.value = 260; lfo.connect(lfoTiefe).connect(band.frequency);
  rauschen.start(); lfo.start();

  const tiere = ctx.createGain(); tiere.gain.value = 1; tiere.connect(master);

  function grille(t, staerke){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.value = 4300 + Math.random() * 300; o.type = "sine";
    g.gain.value = 0; o.connect(g).connect(tiere);
    for (let k = 0; k < 3; k++){ const s = t + k * .045; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(.05 * staerke, s + .008); g.gain.linearRampToValueAtTime(0, s + .03); }
    o.start(t); o.stop(t + .2);
  }
  function vogel(t, staerke){
    const o = ctx.createOscillator(), g = ctx.createGain(), f0 = 2400 + Math.random() * 1200;
    o.type = "sine"; o.connect(g).connect(tiere);
    const teile = 2 + Math.floor(Math.random() * 3);
    g.gain.setValueAtTime(0, t);
    for (let k = 0; k < teile; k++){
      const s = t + k * .11;
      o.frequency.setValueAtTime(f0, s); o.frequency.exponentialRampToValueAtTime(f0 * (1.3 + Math.random() * .4), s + .07);
      g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(.06 * staerke, s + .015); g.gain.linearRampToValueAtTime(0, s + .08);
    }
    o.start(t); o.stop(t + teile * .11 + .1);
  }

  let stand = { wind: 0, nacht: 0, morgen: 0 }, an = false, naechsteGrille = 0, naechsterVogel = 0;
  setInterval(() => {                       // kleine Vorausplanung der Tierstimmen
    if (!an) return;
    const t = ctx.currentTime;
    if (stand.nacht > .05 && t > naechsteGrille){ grille(t + .05, stand.nacht); naechsteGrille = t + .35 + Math.random() * .8; }
    if (stand.morgen > .05 && t > naechsterVogel){ vogel(t + .05, stand.morgen); naechsterVogel = t + .6 + Math.random() * 2.2; }
  }, 80);

  return {
    async start(){ await ctx.resume(); an = true; master.gain.setTargetAtTime(.9, ctx.currentTime, .3); return ctx.state; },
    stop(){ an = false; master.gain.setTargetAtTime(0, ctx.currentTime, .2); },
    get laeuft(){ return an && ctx.state === "running"; },
    // wird jedes Bild aufgerufen; nur sanfte Übergänge
    stimmung(s){
      stand = s;
      wind.gain.setTargetAtTime(.05 + .2 * s.wind, ctx.currentTime, .5);
      band.Q.setTargetAtTime(.6 + .8 * s.wind, ctx.currentTime, .5);
    }
  };
}
