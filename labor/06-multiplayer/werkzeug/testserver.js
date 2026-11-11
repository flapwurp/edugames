/* Nachgebauter Supabase-Realtime-Server für lokale Tests (Node, ohne Pakete).
   Kann nur, was Schritt 6 braucht: phx_join, broadcast, presence, heartbeat, phx_leave.
   Start von Hand:  node labor/06-multiplayer/werkzeug/testserver.js 8787
   Dann im Browser: …/labor/06-multiplayer/?server=http://localhost:8787               */
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

export function starteTestserver(port = 0){
  const kanaele = new Map();   // topic → Map(socket → {key, meta, joinRef})
  const sockets = new Set();
  let phx = 0;

  const server = createServer((req, res) => { res.writeHead(404); res.end(); });

  server.on("upgrade", (req, sock) => {
    if (!req.url.startsWith("/realtime/v1/websocket") || !/apikey=/.test(req.url)){ sock.destroy(); return; }
    const accept = createHash("sha1").update(req.headers["sec-websocket-key"] + GUID).digest("base64");
    sock.write("HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: " + accept + "\r\n\r\n");
    sockets.add(sock);
    let puffer = Buffer.alloc(0);
    sock.on("data", d => {
      puffer = Buffer.concat([puffer, d]);
      for (;;){
        const f = rahmen(puffer); if (!f) break;
        puffer = puffer.subarray(f.laenge);
        if (f.op === 8){ sock.end(); break; }
        if (f.op === 1) nachricht(sock, f.daten.toString("utf8"));
      }
    });
    sock.on("close", () => { sockets.delete(sock); verlasseAlle(sock); });
    sock.on("error", () => {});
  });

  function rahmen(b){
    if (b.length < 2) return null;
    const op = b[0] & 15, maske = b[1] & 128;
    let n = b[1] & 127, i = 2;
    if (n === 126){ if (b.length < 4) return null; n = b.readUInt16BE(2); i = 4; }
    else if (n === 127){ if (b.length < 10) return null; n = Number(b.readBigUInt64BE(2)); i = 10; }
    const m = maske ? b.subarray(i, i + 4) : null; if (maske) i += 4;
    if (b.length < i + n) return null;
    const daten = Buffer.from(b.subarray(i, i + n));
    if (m) for (let k = 0; k < n; k++) daten[k] ^= m[k & 3];
    return { op, daten, laenge: i + n };
  }

  function schicke(sock, obj){
    if (sock.destroyed) return;
    const d = Buffer.from(JSON.stringify(obj));
    const kopf = d.length < 126 ? Buffer.from([0x81, d.length])
      : d.length < 65536 ? Buffer.from([0x81, 126, d.length >> 8, d.length & 255])
      : (() => { const h = Buffer.alloc(10); h[0] = 0x81; h[1] = 127; h.writeBigUInt64BE(BigInt(d.length), 2); return h; })();
    sock.write(Buffer.concat([kopf, d]));
  }

  const antwort = (sock, m, payload) => schicke(sock, { topic: m.topic, event: "phx_reply", payload, ref: m.ref, join_ref: m.join_ref });
  const zustand = k => Object.fromEntries([...k.values()].filter(e => e.meta).map(e => [e.key, { metas: [{ ...e.meta, phx_ref: e.phxRef }] }]));

  function nachricht(sock, text){
    const m = JSON.parse(text);
    if (m.topic === "phoenix" && m.event === "heartbeat") return antwort(sock, m, { status: "ok", response: {} });
    const k = kanaele.get(m.topic);
    switch (m.event){
      case "phx_join": {
        if (!kanaele.has(m.topic)) kanaele.set(m.topic, new Map());
        kanaele.get(m.topic).set(sock, { key: m.payload?.config?.presence?.key || "anon", meta: null, self: !!m.payload?.config?.broadcast?.self });
        antwort(sock, m, { status: "ok", response: { postgres_changes: [] } });
        schicke(sock, { topic: m.topic, event: "presence_state", payload: zustand(kanaele.get(m.topic)), ref: null });
        return;
      }
      case "broadcast":
        for (const [s, e] of k ?? []) if (s !== sock || e.self) schicke(s, { topic: m.topic, event: "broadcast", payload: m.payload, ref: null });
        return;
      case "presence": {
        const e = k?.get(sock); if (!e) return;
        e.meta = m.payload.payload ?? {}; e.phxRef = "p" + (++phx);
        const joins = { [e.key]: { metas: [{ ...e.meta, phx_ref: e.phxRef }] } };
        for (const s of k.keys()) schicke(s, { topic: m.topic, event: "presence_diff", payload: { joins, leaves: {} }, ref: null });
        return antwort(sock, m, { status: "ok", response: {} });
      }
      case "phx_leave":
        verlasse(sock, m.topic);
        return antwort(sock, m, { status: "ok", response: {} });
    }
  }

  function verlasse(sock, topic){
    const k = kanaele.get(topic); const e = k?.get(sock); if (!e) return;
    k.delete(sock);
    if (e.meta){
      const leaves = { [e.key]: { metas: [{ ...e.meta, phx_ref: e.phxRef }] } };
      for (const s of k.keys()) schicke(s, { topic, event: "presence_diff", payload: { joins: {}, leaves }, ref: null });
    }
  }
  const verlasseAlle = sock => { for (const t of kanaele.keys()) verlasse(sock, t); };

  return new Promise(ok => server.listen(port, "127.0.0.1", () => ok({
    url: "http://127.0.0.1:" + server.address().port,
    /* Simuliert einen Abbruch (iPad im Standby, WLAN weg) */
    trenneAlle(){ for (const s of sockets) s.destroy(); },
    stopp(){ for (const s of sockets) s.destroy(); return new Promise(r => server.close(r)); },
  })));
}

if (process.argv[1] === fileURLToPath(import.meta.url)){
  const s = await starteTestserver(Number(process.argv[2] ?? 8787));
  console.log("Testserver läuft:", s.url);
}
