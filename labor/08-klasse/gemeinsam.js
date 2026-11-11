/* Was Paar-Seite und Monitor beide brauchen */
import { SUPABASE_URL, SUPABASE_KEY } from "../06-multiplayer/config.js";
import { neueId } from "../06-multiplayer/raum.js";

export const $ = s => document.querySelector(s);

/* Nur für lokale Tests: ?server=http://localhost:8787 (nachgebauter Server aus Schritt 6) */
const param = new URLSearchParams(location.search).get("server");
const lokal = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
export const SERVER = param && lokal ? param : SUPABASE_URL;
export const KEY = SUPABASE_KEY;

/* Zufällige Kennung pro Tab und Sitzung – kein Name, kein Login */
export const ID = sessionStorage.getItem("labor08-id") || neueId();
sessionStorage.setItem("labor08-id", ID);

export function zeigeStatus(art, text){
  const p = $("#punkt"); if (p) p.className = "punkt " + art;
  const t = $("#statusText"); if (t) t.textContent = text;
}

export function toast(text){
  const d = document.createElement("div"); d.className = "toast"; d.textContent = text;
  document.body.append(d); setTimeout(() => d.remove(), 2400);
}

/* Nach dem Aufwachen des iPads Verbindung sofort prüfen */
export function wachhalten(rt){
  document.addEventListener("visibilitychange", () => { if (!document.hidden) rt.pruefe(); });
  addEventListener("online", () => rt.pruefe());
}
