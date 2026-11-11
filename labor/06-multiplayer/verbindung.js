/* =====================================================================
   VERBINDUNG zu Supabase Realtime – ohne Bibliothek, direkt per WebSocket.

   Supabase Realtime spricht das „Phoenix Channels“-Protokoll: JSON-Nachrichten
   der Form {topic, event, payload, ref, join_ref}. Wir brauchen davon nur:
     phx_join    einem Kanal (= Raum) beitreten
     broadcast   Nachricht an alle anderen im Raum (wird nicht gespeichert)
     presence    „ich bin da“ – Supabase meldet, wer gerade im Raum ist
     heartbeat   alle 25 s ein Lebenszeichen, sonst trennt der Server

   Diese Datei greift nicht aufs DOM zu und läuft auch in Node (Tests).
   Wenn ein echtes Spiel Echtzeit braucht, wandert sie nach shared/sync.js.
   ===================================================================== */

const HERZSCHLAG_MS = 25000;
const BEITRITT_TIMEOUT_MS = 10000;
const WARTEZEITEN_MS = [1000, 2000, 5000, 10000];

/*
  opt = {
    url, key,            Supabase-Projekt
    raum,                Kanalname
    id,                  Kennung dieses Geräts (Presence-Schlüssel)
    meta,                was andere über uns sehen (z. B. {seit})
    bei: { nachricht(event, payload), anwesenheit(Map id→meta),
           status(art, text), log(text), server(ms) }
  }
*/
export function verbinde(opt){
  const { url, key, raum, id, meta = {}, bei = {} } = opt;
  const topic = "realtime:" + raum;
  const wsUrl = url.replace(/^http/, "ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(key) + "&vsn=1.0.0";
  const log = t => bei.log?.(t);
  const status = (art, text) => { stand.status = art; bei.status?.(art, text); };

  const stand = { status: "neu", verbindungen: 0, gesendet: 0, empfangen: 0, mitToken: false };
  const anwesend = new Map();
  const offen = new Map();          // ref → Rückruf für phx_reply
  let ws = null, ref = 0, joinRef = null, beigetreten = false, beendet = false;
  let herz = null, herzRef = null, herzZeit = 0, versuch = 0, neuTimer = null, beitrittTimer = null;

  function push(t, event, payload, rueckruf, eigenerJoinRef){
    if (!ws || ws.readyState !== 1) return null;
    const r = String(++ref);
    const jr = eigenerJoinRef ?? (t === topic ? joinRef : null);
    ws.send(JSON.stringify({ topic: t, event, payload, ref: r, join_ref: jr }));
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
      log(stand.verbindungen === 1 ? "Verbunden mit Supabase" : "Wieder verbunden (" + stand.verbindungen + ". Verbindung)");
      beitreten();
      clearInterval(herz);
      herz = setInterval(herzschlag, HERZSCHLAG_MS);
    };
    ws.onmessage = e => { if (dieses === ws) empfange(e.data); };
    ws.onerror = () => { if (dieses === ws) log("Verbindungsfehler"); };
    ws.onclose = e => {
      if (dieses !== ws) return;
      clearInterval(herz); clearTimeout(beitrittTimer);
      beigetreten = false; herzRef = null; offen.clear();
      if (anwesend.size){ anwesend.clear(); bei.anwesenheit?.(new Map(anwesend)); }
      if (beendet) return;
      log("Getrennt (Code " + e.code + (e.reason ? ", " + e.reason : "") + ")");
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

  function beitreten(){
    const payload = {
      config: {
        broadcast: { self: false, ack: false },
        presence: { key: id, enabled: true },
        postgres_changes: [],
        private: false,
      },
    };
    if (stand.mitToken) payload.access_token = key;
    const r = String(ref + 1);
    joinRef = r;
    clearTimeout(beitrittTimer);
    beitrittTimer = setTimeout(() => { log("Keine Antwort auf Beitritt – neu verbinden"); ws?.close(); }, BEITRITT_TIMEOUT_MS);
    push(topic, "phx_join", payload, antwort => {
      clearTimeout(beitrittTimer);
      if (antwort.status === "ok"){
        beigetreten = true;
        status("verbunden", "Verbunden");
        log("Raum betreten");
        push(topic, "presence", { type: "presence", event: "track", payload: meta });
        setTimeout(() => { if (!herzRef) herzschlag(); }, 500);   // erste Messung zum Server gleich
        return;
      }
      const grund = JSON.stringify(antwort.response ?? antwort);
      log("Beitritt abgelehnt: " + grund);
      if (!stand.mitToken){ stand.mitToken = true; log("Zweiter Versuch mit Schlüssel als Token"); beitreten(); }
      else { status("fehler", "Beitritt abgelehnt"); ws?.close(); }
    }, r);
  }

  function herzschlag(){
    if (herzRef){ log("Herzschlag unbeantwortet – neu verbinden"); ws?.close(); return; }
    herzZeit = performance.now();
    herzRef = push("phoenix", "heartbeat", {}, () => {
      herzRef = null;
      bei.server?.(performance.now() - herzZeit);
    });
  }

  function empfange(text){
    let m;
    try { m = JSON.parse(text); } catch { return; }
    if (m.event === "phx_reply"){
      const r = offen.get(m.ref);
      if (r){ offen.delete(m.ref); r(m.payload ?? {}); }
      return;
    }
    if (m.topic !== topic) return;
    switch (m.event){
      case "broadcast":
        stand.empfangen++;
        bei.nachricht?.(m.payload?.event, m.payload?.payload ?? {});
        break;
      case "presence_state":
        anwesend.clear();
        for (const [k, v] of Object.entries(m.payload ?? {})) anwesend.set(k, letzteMeta(v));
        bei.anwesenheit?.(new Map(anwesend));
        break;
      case "presence_diff":
        for (const k of Object.keys(m.payload?.leaves ?? {})) anwesend.delete(k);
        for (const [k, v] of Object.entries(m.payload?.joins ?? {})) anwesend.set(k, letzteMeta(v));
        bei.anwesenheit?.(new Map(anwesend));
        break;
      case "phx_error":
      case "phx_close":
        log("Server: " + m.event + " – trete neu bei");
        beigetreten = false;
        setTimeout(() => { if (!beendet && ws?.readyState === 1) beitreten(); }, 1000);
        break;
      case "system":
        log("Server meldet: " + JSON.stringify(m.payload));
        break;
    }
  }

  const letzteMeta = v => { const ms = v?.metas ?? []; return ms[ms.length - 1] ?? {}; };

  oeffnen();

  return {
    stand,
    get beigetreten(){ return beigetreten; },
    /* Nachricht an alle anderen im Raum. false, wenn gerade nicht verbunden. */
    sende(event, payload){
      if (!beigetreten) return false;
      push(topic, "broadcast", { type: "broadcast", event, payload });
      stand.gesendet++;
      return true;
    },
    /* Nach dem Aufwachen des iPads: Verbindung sofort prüfen statt auf den Timer zu warten */
    pruefe(){
      if (beendet) return;
      if (!ws || ws.readyState > 1){ versuch = 0; oeffnen(); }
      else if (ws.readyState === 1 && !herzRef) herzschlag();
    },
    schliesse(){
      beendet = true;
      clearInterval(herz); clearTimeout(neuTimer); clearTimeout(beitrittTimer);
      if (ws?.readyState === 1) push(topic, "phx_leave", {});
      ws?.close();
      status("beendet", "Raum verlassen");
    },
  };
}
