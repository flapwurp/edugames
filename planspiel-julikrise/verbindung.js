/* Planspiel Julikrise 1914 – Verbindung zwischen Lehrer-Laptop und iPads.

   Heute: „lokal“ über BroadcastChannel – alle Fenster eines Browsers auf EINEM Rechner (Probedurchlauf, Test).
   Später: Supabase Realtime über shared/sync.js, mit derselben Schnittstelle (senden / empfangen).

   Nachrichten (keine Namen, keine Schülerdaten):
     iPad → Laptop:  { typ: "aktion", geraet, aktion }   { typ: "hallo", geraet }
     Laptop → iPads: { typ: "sicht", team, sicht }        { typ: "fehler", geraet, text }   { typ: "da" }
   Der Laptop ist die einzige Stelle mit dem vollen Spielstand. Jede Delegation bekommt nur ihre eigene Sicht.
   (Lokal empfangen alle Fenster alles; mit Supabase bekommt jede Delegation einen eigenen Kanal.) */

export function verbinden(raum, beiNachricht) {
  const kanal = new BroadcastChannel(`julikrise-${raum}`);
  kanal.onmessage = (e) => beiNachricht(e.data);
  return { senden: (nachricht) => kanal.postMessage(nachricht), schliessen: () => kanal.close(), art: "lokal" };
}

/* Zufällige Kennung pro Sitzung (kein Name). */
export function geraetKennung() {
  let id = sessionStorage.getItem("julikrise-geraet");
  if (!id) { id = Math.random().toString(36).slice(2, 10); sessionStorage.setItem("julikrise-geraet", id); }
  return id;
}

export const raumcodeNeu = () => String(1000 + Math.floor(Math.random() * 9000));
