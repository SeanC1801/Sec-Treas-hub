// Proof photos (winner IDs, receipts) kept on this device only, in IndexedDB.
// Photos are shrunk before they're stored so a phone doesn't fill up.
// Front-end draft: the backend will move these to private storage with expiring links.
const DB_NAME = "sectreas", STORE = "photos";
export const PHOTOS = new Map(); // id -> data URL, loaded at start so documents render at once

function db() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function tx(mode, fn) {
  const d = await db();
  return new Promise((res, rej) => { const t = d.transaction(STORE, mode), s = t.objectStore(STORE), out = fn(s); t.oncomplete = () => res(out && out.result); t.onerror = () => rej(t.error); });
}
export async function loadPhotos() {
  try {
    const d = await db();
    await new Promise((res) => {
      const c = d.transaction(STORE).objectStore(STORE).openCursor();
      c.onsuccess = () => { const k = c.result; if (!k) return res(); PHOTOS.set(k.key, k.value); k.continue(); };
      c.onerror = () => res();
    });
  } catch {}
  return PHOTOS;
}
export async function addPhoto(file, max = 1400) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
  const url = c.toDataURL("image/jpeg", 0.82);
  const id = "ph" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  PHOTOS.set(id, url);
  try { await tx("readwrite", (st) => st.put(url, id)); } catch {}
  return id;
}
// removing keeps the image in memory until the page closes, so Undo can put it back
export async function dropPhoto(id) { try { await tx("readwrite", (st) => st.delete(id)); } catch {} }
export async function keepPhoto(id) { const u = PHOTOS.get(id); if (u) try { await tx("readwrite", (st) => st.put(u, id)); } catch {} }
