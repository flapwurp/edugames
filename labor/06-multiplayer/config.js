/* Zugang zum Supabase-Projekt „labor“ (Region Frankfurt).
   Der „publishable key“ darf öffentlich im Code stehen: Er sagt nur, welches Projekt gemeint ist.
   Was man damit darf, regeln die Einstellungen im Projekt. Den „secret key“ NIE hier eintragen. */
export const SUPABASE_URL = "https://hxjcecmashpvqhdhakyy.supabase.co";
export const SUPABASE_KEY = "sb_publishable_VipdKueKzrG9gbJubyZFrA_hUu-cvFO";

/* Wie oft ein Gerät Fingerbewegungen schickt (pro Sekunde).
   Gratis-Kontingent: 100 Nachrichten/s fürs ganze Projekt; jede Nachricht zählt
   einmal beim Senden und einmal pro Empfänger. */
export const BEWEGUNGEN_PRO_SEKUNDE = 10;
