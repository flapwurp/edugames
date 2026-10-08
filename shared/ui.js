/* Small UI helpers shared by all games: escaping, timer text, stars, dialogs, toasts. */

export const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const clockText = seconds => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

export const starText = n => `<span>${"★".repeat(n)}</span><span class="empty">${"★".repeat(Math.max(0, 3 - n))}</span>`;

/* The row of key phrases that is always visible during a round */
export const keyStrip = (phrases, role) =>
  `<ul class="keyphrases ${role}" aria-label="Key phrases">${phrases.map(p => `<li>${esc(p)}</li>`).join("")}</ul>`;

/* Bottom sheet dialog. Elements with data-act="closeSheet" close it. */
export function openSheet(html, withClose = true){
  const root = document.getElementById("sheet-root");
  const close = withClose ? `<button class="btn secondary close" data-act="closeSheet">Close</button>` : "";
  root.innerHTML = `<div class="sheet" data-act="closeSheet"><div class="panel" role="dialog" aria-modal="true">${html}${close}</div></div>`;
  root.querySelector(".panel").addEventListener("click", e => { if (!e.target.closest('[data-act="closeSheet"]')) e.stopPropagation(); });
}
export function closeSheet(){ document.getElementById("sheet-root").innerHTML = ""; }
export const sheetOpen = () => document.getElementById("sheet-root").innerHTML !== "";

/* "Leave game?" dialog – the buttons trigger data-act="closeSheet" / "doQuit" */
export function confirmQuit(){
  openSheet(`<h2>Leave this game?</h2><p>Your stars will be lost.</p>
    <div class="btnrow"><button class="btn secondary" data-act="closeSheet">Stay in the game</button>
    <button class="btn" data-act="doQuit">Leave game</button></div>`, false);
}

let toastTimer = null;
export function toast(msg, kind = "", ms = 2000){
  let el = document.querySelector(".toast");
  if (!el){ el = document.createElement("div"); el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.className = "toast" + (kind ? " " + kind : "");
  el.textContent = msg;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.remove(), ms);
}
export function clearToast(){ const el = document.querySelector(".toast"); if (el) el.remove(); }
