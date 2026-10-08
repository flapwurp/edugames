/* Game codes, players, rounds and saving the game state in the browser tab. */

/* A game code has 4 digits. The first digit is the level (1000–1999 = level 1, …). */
export const levelOf = code => Math.floor(code / 1000);
export const validCode = (code, levelCount) =>
  Number.isInteger(code) && code >= 1000 && code < (levelCount + 1) * 1000;
export const newCode = level => level * 1000 + Math.floor(Math.random() * 1000);

/* Player 1 has the first role in odd rounds, player 2 in even rounds. */
export const firstRolePlayer = round => (round % 2 === 1 ? 1 : 2);

/* Saves the game in sessionStorage, so a reload doesn't end the game. */
export function createStore(key, fresh){
  return {
    load(){ try { const r = sessionStorage.getItem(key); return r ? JSON.parse(r) : null; } catch (e){ return null; } },
    save(state){ try { sessionStorage.setItem(key, JSON.stringify(state)); } catch (e){} },
    fresh
  };
}
