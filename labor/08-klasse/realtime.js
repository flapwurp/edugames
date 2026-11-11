/* =====================================================================
   Supabase Realtime mit MEHREREN Kanälen über EINE Verbindung.
   Weiterentwicklung von ../06-multiplayer/verbindung.js (dort: ein Kanal).

   Der Lehrer-Monitor hört 15 Paar-Kanäle gleichzeitig mit. Eine Verbindung
   pro Kanal wäre verschwenderisch (Gratis-Tarif: 200 Verbindungen).
   Kein DOM-Zugriff, läuft auch in Node (Tests).
   ===================================================================== */

const HERZSCHLAG_MS = 25000;
const BEITRITT_TIMEOUT_MS = 10000;
const WARTEZEITEN_MS = [1000, 2000, 5000, 10000];

/* bei: { status(art, text), log(text), server(ms) } */
export function realtime({ url, key, bei = {} }){
  const wsUrl = url.replace(/^http/, "ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(key) + "&vsn=1.0.0";
  const log = t => bei.log?.(t);
  const stand = { status: "neu", verbindungen: 0, gesendet: 0, empfangen: 0, mitToken: false };
  const kanaele = new Map();   // topic → Kanal
  const offen = new Map();     // ref → Rückruf
  let ws = null, ref = 0, beendet = false;
  let herz = null, herzRef = null, herzZeit = 0, versuch = 0, neuTimer = null;
  const status = (art, text) => { stand.status = art; bei.status?.(art, text); };

  function push(topic, event, payload, rueckruf, joinRef = null){
    if (!ws || ws.readyState !== 1) return null;
    const r = String(++ref);
    ws.send(JSON.stringify({ topic, event, payload, ref: r, join_ref: joinRef }));
    if (rueckruf) offen.set(r, rueckruf);
    return r;
  }

  function oeffnen(){
    clearTimeout(neuTimer);
    if (beendet) return;
    status("verbinde", "Verbinde …");
    try { ws = new WebSocket(wsUrl); }
    catch (e){ log("WebSocket nicht möglich: " + e.message); return spaeter(); }
    const dieses = ws;
    ws.onopen = () => {
      if (dieses !== ws) return;
      stand.verbindungen++; versuch = 0;
      log(stand.verbindungen === 1 ? "Verbunden" : "Wieder verbunden (" + stand.verbindungen + ". Verbindung)");
      status("verbunden", "Verbunden");
      for (const k of kanaele.values()) k.beitreten();
      clearInterval(herz);
      herz = setInterval(herzschlag, HERZSCHLAG_MS);
      setTimeout(() => { if (!herzRef) herzschlag(); }, 500);
    };
    ws.onmessage = e => { if (dieses === ws) empfange(e.data); };
    ws.onerror = () => { if (dieses === ws) log("Verbindungsfehler"); };
    ws.onclose = e => {
      if (dieses !== ws) return;
      clearInterval(herz); herzRef = null; offen.clear();
      for (const k of kanaele.values()) k.getrennt();
      if (beendet) return;
      log("Getrennt (Code " + e.code + ")");
      spaeter();
    };
  }

  function spaeter(){
    const ms = WARTEZEITEN_MS[Math.min(versuch, WARTEZEITEN_MS.length - 1)];
    versuch++;
    status("getrennt", "Getrennt – neuer Versuch in " + Math.round(ms / 1000) + " s");
    clearTimeout(neuTimer);
    neuTimer = setTimeout(oeffnen, ms);
  }

  function herzschlag(){
    if (herzRef){ log("Herzschlag unbeantwortet – neu verbinden"); ws?.close(); return; }
    herzZeit = performance.now();
    herzRef = push("phoenix", "heartbeat", {}, () => { herzRef = null; bei.server?.(performance.now() - herzZeit); });
  }

  function empfange(text){
    let m;
    try { m = JSON.parse(text); } catch { return; }
    if (m.event === "phx_reply"){
      const r = offen.get(m.ref);
      if (r){ offen.delete(m.ref); r(m.payload ?? {}); }
      return;
    }
    kanaele.get(m.topic)?.empfange(m);
  }

  /* Einen Kanal (= Raum) betreten.
     opt: { id, meta, sichtbar (Presence: andere sehen mich), bei: { nachricht(event, payload), anwesenheit(Map), bereit() } } */
  function kanal(name, opt = {}){
    const topic = "realtime:" + name;
    const { id = "", meta = {}, sichtbar = true } = opt;
    const b = opt.bei ?? {};
    const anwesend = new Map();
    let joinRef = null, beigetreten = false, timer = null;
    const letzteMeta = v => { const ms = v?.metas ?? []; return ms[ms.length - 1] ?? {}; };

    const k = {
      beitreten(){
        const payload = { config: { broadcast: { self: false, ack: false }, presence: { key: id, enabled: true }, postgres_changes: [], private: false } };
        if (stand.mitToken) payload.access_token = key;
        joinRef = String(ref + 1);
        clearTimeout(timer);
        timer = setTimeout(() => { log(name + ": keine Antwort auf Beitritt"); ws?.close(); }, BEITRITT_TIMEOUT_MS);
        push(topic, "phx_join", payload, a => {
          clearTimeout(timer);
          if (a.status === "ok"){
            beigetreten = true;
            if (sichtbar) push(topic, "presence", { type: "presence", event: "track", payload: meta }, null, joinRef);
            b.bereit?.();
            return;
          }
          log(name + ": Beitritt abgelehnt " + JSON.stringify(a.response ?? a));
          if (!stand.mitToken){ stand.mitToken = true; k.beitreten(); }
          else status("fehler", "Beitritt abgelehnt");
        }, joinRef);
      },
      getrennt(){
        clearTimeout(timer); beigetreten = false;
        if (anwesend.size){ anwesend.clear(); b.anwesenheit?.(new Map()); }
      },
      empfange(m){
        switch (m.event){
          case "broadcast":
            stand.empfangen++;
            b.nachricht?.(m.payload?.event, m.payload?.payload ?? {});
            break;
          case "presence_state":
            anwesend.clear();
            for (const [k2, v] of Object.entries(m.payload ?? {})) anwesend.set(k2, letzteMeta(v));
            b.anwesenheit?.(new Map(anwesend));
            break;
          case "presence_diff":
            for (const k2 of Object.keys(m.payload?.leaves ?? {})) anwesend.delete(k2);
            for (const [k2, v] of Object.entries(m.payload?.joins ?? {})) anwesend.set(k2, letzteMeta(v));
            b.anwesenheit?.(new Map(anwesend));
            break;
          case "phx_error": case "phx_close":
            log(name + ": " + m.event + " – trete neu bei");
            beigetreten = false;
            setTimeout(() => { if (!beendet && kanaele.has(topic) && ws?.readyState === 1) k.beitreten(); }, 1000);
            break;
          case "system":
            log(name + ": " + JSON.stringify(m.payload));
            break;
        }
      },
      get beigetreten(){ return beigetreten; },
      sende(event, payload){
        if (!beigetreten) return false;
        push(topic, "broadcast", { type: "broadcast", event, payload }, null, joinRef);
        stand.gesendet++;
        return true;
      },
      verlasse(){
        if (beigetreten) push(topic, "phx_leave", {}, null, joinRef);
        k.getrennt(); kanaele.delete(topic);
      },
    };
    kanaele.set(topic, k);
    if (ws?.readyState === 1) k.beitreten();
    return k;
  }

  oeffnen();

  return {
    stand, kanal,
    pruefe(){
      if (beendet) return;
      if (!ws || ws.readyState > 1){ versuch = 0; oeffnen(); }
      else if (ws.readyState === 1 && !herzRef) herzschlag();
    },
    schliesse(){
      beendet = true;
      for (const k of [...kanaele.values()]) k.verlasse();
      clearInterval(herz); clearTimeout(neuTimer);
      ws?.close();
      status("beendet", "Getrennt");
    },
  };
}
