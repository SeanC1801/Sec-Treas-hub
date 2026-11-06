// Events: the chapter's activities, and every document that belongs to each.
// Front-end draft: saved on this device. The tracker's events are the starting list.
import { TR } from "./prototype.js";

const KEY = "sectreas:events:v1";
const norm = (s) => String(s || "").toLowerCase().replace(/[“”"’']/g, "").replace(/\s+/g, " ").trim();

function seed() {
  const list = TR.REQS.filter((r) => !r.fromBR).map((r) => ({ id: r.id, name: r.short || r.name, full: r.name, date: r.date || "", venue: r.venue || "" }));
  // the sample budget request in the Treasurer flow
  list.unshift({ id: "hack", name: "ACM-AUF Hackathon 2026", full: "", date: "2026-11-21", venue: "Computer Laboratory" });
  return list;
}
let DB = (() => { try { const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d && d.v === 1) return d; } catch {} return { v: 1, list: seed() }; })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch {} };

export const eventList = () => DB.list;
export const eventById = (id) => DB.list.find((e) => e.id === id) || null;
export function addEvent({ name, date, venue, budgetDue }) {
  const e = { id: "ev" + Date.now().toString(36), name: name.trim(), full: "", date: date || "", venue: (venue || "").trim(), budgetDue: budgetDue || "" };
  DB.list.push(e); save(); return e;
}
export function updateEvent(id, patch) { const e = eventById(id); if (e) { Object.assign(e, patch); save(); } return e; }
export function removeEvent(id) { const i = DB.list.findIndex((e) => e.id === id); if (i < 0) return null; const [e] = DB.list.splice(i, 1); save(); return { e, i }; }
export function restoreEvent({ e, i }) { DB.list.splice(i, 0, e); save(); }
export const resetEvents = () => { DB = { v: 1, list: seed() }; save(); };

// due dates: liquidation is due the day after the event (chapter minutes, Sep 11);
// a budget request is due whenever the Treasurer sets it (no default)
// local date, not toISOString (which would shift Manila midnight back a day)
const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
export const lrDue = (e) => { if (!e || !e.date) return ""; const d = new Date(e.date + "T00:00"); d.setDate(d.getDate() + 1); return iso(d); };
export const brDue = (e) => (e && e.budgetDue) || "";

// a document belongs to an event by its id, or (for older ones) by the event's name
export const sameEvent = (e, name) => !!name && [e.name, e.full].some((n) => n && norm(n) === norm(name));
// minutes belong to meetings; a meeting shows under every event it talks about
export function mentions(e, m) {
  const text = norm([m.objectives, m.callToOrder, m.reminders, ...m.topics.map((t) => t.title + " " + t.text), ...m.groups.map((g) => g.title + " " + g.rows.map((r) => r.task).join(" "))].join(" "));
  return [e.name, e.full].some((n) => n && n.length > 3 && text.includes(norm(n)));
}
