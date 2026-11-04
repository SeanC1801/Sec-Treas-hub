// Secretary · Certificates. Front-end draft: saved on this device.
// Flow: Details → Names → Preview & print. One design for every type, copied
// from "Certificate Facilitators GA.pdf": A4 landscape, the chapter artwork
// (public/assets/cert-bg.jpg, text removed), Libre Baskerville in #1800AD.
import { TR } from "./prototype.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ORG = TR.ORG;
const KEY = "sectreas:certs:v1";

export const TYPES = {
  facilitator: { label: "Facilitator", title: ["CERTIFICATE OF", "RECOGNITION"],
    reason: (ev) => `In grateful recognition of their invaluable service as Facilitator of the ${ev} of the AUF-ACM Student Chapter. Their commitment to open dialogue and collaborative governance reflects the chapter's spirit of leadership, teamwork, and service to the computing community.` },
  participation: { label: "Participation", title: ["CERTIFICATE OF", "PARTICIPATION"],
    reason: (ev) => `In recognition of their active participation in the ${ev} of the AUF-ACM Student Chapter. Their enthusiasm and willingness to learn reflect the chapter's spirit of growth, collaboration, and service to the computing community.` },
  winner: { label: "Winner", title: ["CERTIFICATE OF", "ACHIEVEMENT"],
    reason: (ev) => `In recognition of their outstanding performance, placing {award} in the ${ev} of the AUF-ACM Student Chapter. Their skill and dedication reflect the chapter's spirit of excellence, creativity, and service to the computing community.` },
};

/* ---------------- data ---------------- */
const SAMPLE = () => ({
  id: "c-ga-fac", type: "facilitator", event: "General Assembly", date: "2026-10-06", venue: "EYA-CLI Building Angeles University Foundation, Angeles City, Philippines",
  reason: TYPES.facilitator.reason("General Assembly"), reasonEdited: false,
  names: "TRIZY GABRIEL NICDAO\nJAEDA MARTHENA IRAL\nIAN PATRICK FLORES\nJAN ALDRINN FLORES\nZOIE CARLISLE MENDOZA",
  left: { name: "LAUREN KAILEY FRANCISCO", title: "AUF-ACM CHAIR" },
  right: { name: "MS. MELISSA M. PANTIG, MCS", title: "AUF-ACM ADVISER" },
  updated: Date.parse("2026-10-06T09:00:00"),
});
const blank = () => ({
  id: "c" + Date.now().toString(36), type: "participation", event: "", date: new Date().toISOString().slice(0, 10),
  venue: "EYA-CLI Building Angeles University Foundation, Angeles City, Philippines", reason: TYPES.participation.reason("[event]"), reasonEdited: false, names: "",
  left: { name: String(ORG.president).toUpperCase(), title: "AUF-ACM CHAIR" },
  right: { name: "MS. " + String(ORG.adviser).toUpperCase() + ", MCS", title: "AUF-ACM ADVISER" },
  updated: Date.now(),
});
let DB = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d && d.v === 1) return d; } catch {}
  return { v: 1, list: [SAMPLE()], cur: null, step: "list", at: 0 };
}
let saveT;
function save(touch = true) {
  const c = cur(); if (c && touch) c.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch {}
  const b = $("#certSave"); if (b) { b.classList.add("saving"); b.querySelector(".t").textContent = "Saving…"; clearTimeout(saveT); saveT = setTimeout(() => { b.classList.remove("saving"); b.querySelector(".t").textContent = "Saved"; }, 600); }
}
const cur = () => DB.list.find((c) => c.id === DB.cur) || null;
export const certList = () => DB.list;

/* ---------------- names: one per line; "Name — 1st Place" for winners ---------------- */
function people(c) {
  const seen = new Map(), out = [];
  String(c.names || "").split("\n").forEach((raw, i) => {
    const line = raw.trim(); if (!line) return;
    const m = line.split(/\s+[—–-]\s+|\t/);
    const name = m[0].trim(), award = (m[1] || "").trim(), k = name.toLowerCase().replace(/\s+/g, " ");
    const dup = seen.has(k); seen.set(k, true);
    out.push({ name, award, dup, line: i + 1 });
  });
  return out;
}
const MAX_NAME_PT = 34, MIN_NAME_PT = 22; // the name line is 640pt wide on a 842pt page
let ctx;
function namePt(name) {
  ctx = ctx || document.createElement("canvas").getContext("2d");
  ctx.font = `700 ${MAX_NAME_PT}px "Libre Baskerville", Georgia, serif`;
  const w = ctx.measureText(name).width;
  return Math.max(MIN_NAME_PT, Math.min(MAX_NAME_PT, (MAX_NAME_PT * 640) / Math.max(w, 1)));
}
const tooLong = (name) => namePt(name) <= MIN_NAME_PT + 0.01 && (() => { ctx.font = `700 ${MIN_NAME_PT}px "Libre Baskerville", Georgia, serif`; return ctx.measureText(name).width > 640; })();

/* ---------------- the certificate ---------------- */
const ord = (n) => { const s = ["th", "st", "nd", "rd"], v = n % 100; return n + "<sup>" + (s[(v - 20) % 10] || s[v] || s[0]) + "</sup>"; };
function givenLine(c) {
  if (!c.date) return "";
  const d = new Date(c.date + "T00:00");
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(d);
  return `Given this ${ord(d.getDate())} of ${month}, ${d.getFullYear()} at ${esc(c.venue)}.`;
}
function reasonHTML(c, award) {
  let h = esc(c.reason.replace("{award}", award || "{award}"));
  const bold = [c.event, "AUF-ACM Student Chapter", award].filter((x) => x && x.trim());
  for (const b of bold) h = h.split(esc(b)).join(`<b>${esc(b)}</b>`);
  return h;
}
function certHTML(c, p) {
  const T = TYPES[c.type];
  const pt = namePt(p.name);
  return `<div class="cpg"><div class="c-in">
    <div class="c-title"><span>${T.title[0]}</span><span>${T.title[1]}</span></div>
    <div class="c-to">is presented to</div>
    <div class="c-name" style="font-size:calc(100cqi*${pt.toFixed(2)}/842.25)">${esc(p.name)}</div>
    <div class="c-body"><p>${reasonHTML(c, p.award)}</p><p>${givenLine(c)}</p></div>
    <div class="c-sig l"><b>${esc(c.left.name)}</b><span>${esc(c.left.title)}</span></div>
    <div class="c-sig r"><b>${esc(c.right.name)}</b><span>${esc(c.right.title)}</span></div>
  </div></div>`;
}

/* ---------------- flow UI ---------------- */
const STEPS = [["details", "Details"], ["names", "Names"], ["review", "Preview & print"]];
const root = $("#cert");
const dShort = (d) => (d ? new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d + "T00:00")) : "No date");
const batchTitle = (c) => `${TYPES[c.type].label} · ${c.event || "Untitled event"}`;

export function openCerts(id) { DB.back = id ? "hub" : null; DB.cur = id || null; DB.step = id ? "review" : "list"; DB.at = 0; save(false); render(); root.scrollTop = 0; }
export const showCerts = () => render();
function go(step) { DB.step = step; save(false); render(); root.scrollTop = 0; $("#certMain h2")?.focus({ preventScroll: true }); }

function stepDone(c, k) {
  if (!c) return false;
  if (k === "details") return !!(c.event.trim() && c.date && c.venue.trim());
  if (k === "names") return people(c).length > 0;
  return false;
}
function render() {
  const c = cur(), list = DB.step === "list" || !c;
  const idx = STEPS.findIndex((s) => s[0] === DB.step);
  const title = list ? "Certificates" : batchTitle(c);
  const n = c ? people(c).length : 0;
  const tabs = list ? "" : `<nav class="tabs" aria-label="Steps"><div><ol>${STEPS.map(([k, l], i) => `<li><button class="stepbtn" type="button" data-cgo="${k}"${i === idx ? ' aria-current="step"' : ""} data-done="${stepDone(c, k)}">${l === "Preview & print" ? "Preview" : l}</button></li>`).join("")}</ol></div></nav>`;
  const rail = list
    ? `<div class="kicker">Secretary</div><h1>Certificates</h1><p class="rail-p">A batch of certificates from one list of names, in the chapter’s design.</p>`
    : `<div class="kicker">Certificates · ${TYPES[c.type].label}</div><h1>${esc(c.event || "Untitled event")}</h1>
       <dl><dt>Given</dt><dd>${esc(dShort(c.date))}</dd><dt>Names</dt><dd>${n}</dd></dl>
       <ol class="steps">${STEPS.map(([k, l], i) => `<li><button class="rstep" type="button" data-cgo="${k}"${i === idx ? ' aria-current="step"' : ""}><span class="n">${i + 1}</span><span class="lb">${l}</span><span class="mark">${stepDone(c, k) ? '<span class="ok">Done</span>' : i === idx ? '<span class="now">In progress</span>' : ""}</span></button></li>`).join("")}</ol>`;
  root.innerHTML = `
    <header class="topbar glass"><div class="tb-row"><button class="icon-btn" type="button" data-cclose aria-label="Close. Your certificates are saved"><svg class="i"><use href="#i-x"/></svg></button>
      <div class="tb-t"><div class="tb-title">${esc(title)}</div><div class="tb-sub">${list ? "Secretary" : `Certificates · ${n} ${n === 1 ? "name" : "names"}`}</div></div>
      <span class="save" id="certSave" role="status" aria-live="polite"><span class="dot" aria-hidden="true"></span><span class="t">Saved</span></span></div>${tabs}</header>
    <div class="layout"><aside class="rail">${rail}<div class="closeline"><button class="textbtn" type="button" data-cclose>Close</button></div></aside>
      <main class="main" id="certMain">${list ? listView() : { details: detailsView, names: namesView, review: reviewView }[DB.step](c)}</main></div>
    <div class="dock-wrap"><div class="dock glass">${dockView(c, list)}</div></div>`;
  root.querySelectorAll("textarea.grow-ta").forEach(grow);
}
function dockView(c, list) {
  if (list) return `<div class="tot"><div class="l">Batches</div><div class="v">${DB.list.length}</div></div><button class="key" type="button" id="cNew">New batch<svg class="i"><use href="#i-arrow"/></svg></button>`;
  const P = people(c);
  if (DB.step === "review")
    return `<div class="tot"><div class="l">${P.length ? `${Math.min(DB.at, P.length - 1) + 1} of ${P.length}` : "No names"}</div><div class="s">A4 landscape</div></div>
      <button class="key" type="button" id="cPrint"${P.length ? "" : ' aria-disabled="true"'}><svg class="i"><use href="#i-print"/></svg>Print all ${P.length || ""}</button>`;
  const i = STEPS.findIndex((s) => s[0] === DB.step), nx = STEPS[i + 1];
  return `<div class="tot"><div class="l">Next</div><div class="s">${nx[1]}</div></div><button class="key" type="button" data-cgo="${nx[0]}">Continue<svg class="i"><use href="#i-arrow"/></svg></button>`;
}
function listView() {
  const rows = DB.list.slice().sort((a, b) => b.updated - a.updated).map((c) => `<li class="hrow"><button class="go" type="button" data-copen="${c.id}"><span><span class="nm">${esc(c.event || "Untitled event")}</span><span class="mt">${TYPES[c.type].label} · ${esc(dShort(c.date))} · ${people(c).length} names</span></span><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button></li>`).join("");
  return `<div class="hub-title"><div class="kicker">Secretary</div><h1>Certificates</h1></div><section class="sheet"><div class="sheet-h"><h2>Batches</h2><p class="lede">One batch is one event and one type. Tap one to print it again.</p></div><ul class="rows">${rows || '<li><p class="empty">No batches yet.</p></li>'}</ul></section>`;
}
function detailsView(c) {
  const types = Object.entries(TYPES).map(([k, t]) => `<button type="button" class="tagbtn" role="radio" aria-checked="${c.type === k}" data-ctype="${k}">${t.label}</button>`).join("");
  return `<section class="sheet sheet-pad"><h2 tabindex="-1">Certificate details</h2><p class="lede">Every certificate in this batch shares these.</p>
    <div class="fields"><div class="field"><span class="lab" id="ctL">Type</span><div class="tags" role="radiogroup" aria-labelledby="ctL">${types}</div></div>
      <div class="field"><label for="cEv">Event</label><input class="line-in" id="cEv" data-cf="event" autocomplete="off" placeholder="e.g. General Assembly" value="${esc(c.event)}"></div>
      <div class="two"><div class="field"><label for="cDate">Given on</label><input class="line-in" id="cDate" type="date" data-cf="date" value="${esc(c.date)}"></div>
      <div class="field"><label for="cVen">Given at</label><input class="line-in" id="cVen" data-cf="venue" autocomplete="off" value="${esc(c.venue)}"></div></div>
      <div class="field"><label for="cWhy">Why it’s given</label><textarea class="line-in grow-ta" id="cWhy" data-cf="reason" rows="3">${esc(c.reason)}</textarea>
        <p class="lede fhelp">${c.type === "winner" ? "{award} becomes each winner’s place from the names list. " : ""}The event and the chapter name print in bold.${c.reasonEdited ? ` <button class="textbtn" type="button" id="cWhyReset" style="margin:0;padding:0">Use the standard wording</button>` : ""}</p></div></div></section>
  <section class="sheet sheet-pad"><h2>Signed by</h2><p class="lede">From Profile. Change them here for this batch only.</p>
    <div class="fields"><div class="two"><div class="field"><label for="cLn">Left</label><input class="line-in" id="cLn" data-cs="left.name" autocomplete="off" value="${esc(c.left.name)}"></div>
      <div class="field"><label for="cLt">Left title</label><input class="line-in" id="cLt" data-cs="left.title" autocomplete="off" value="${esc(c.left.title)}"></div></div>
      <div class="two"><div class="field"><label for="cRn">Right</label><input class="line-in" id="cRn" data-cs="right.name" autocomplete="off" value="${esc(c.right.name)}"></div>
      <div class="field"><label for="cRt">Right title</label><input class="line-in" id="cRt" data-cs="right.title" autocomplete="off" value="${esc(c.right.title)}"></div></div></div>
    <div class="m-foot"><span></span><button class="textbtn danger" type="button" id="cDel"><svg class="i"><use href="#i-trash"/></svg>Delete this batch</button></div></section>`;
}
function namesView(c) {
  const P = people(c), bad = P.filter((p) => p.dup || tooLong(p.name));
  const hint = c.type === "winner" ? "One per line, with the place after a dash: “Juan Dela Cruz — 1st Place”." : "One per line. Paste straight from a sheet or the attendance list.";
  const flags = bad.length ? `<ul class="c-flags">${bad.map((p) => `<li>Line ${p.line}: <b>${esc(p.name)}</b> ${p.dup ? "is listed twice." : "is too long to fit at the smallest size. Shorten the middle name or use an initial."}</li>`).join("")}</ul>` : "";
  const shrunk = P.filter((p) => !p.dup && namePt(p.name) < MAX_NAME_PT - 0.5 && !tooLong(p.name)).length;
  return `<section class="sheet sheet-pad"><h2 tabindex="-1">Names <span class="opt">(${P.length})</span></h2><p class="lede">${hint}</p>
    <div class="fields"><div class="field"><label for="cNames" class="sr">Names</label><textarea class="line-in grow-ta c-names" id="cNames" data-cf="names" rows="6" placeholder="${c.type === "winner" ? "e.g. Juan Dela Cruz — 1st Place" : "e.g. Juan Dela Cruz"}">${esc(c.names)}</textarea></div></div>
    <div id="cFlags">${flags}${shrunk ? `<p class="lede fhelp">${shrunk} long ${shrunk === 1 ? "name is" : "names are"} set a little smaller so ${shrunk === 1 ? "it fits" : "they fit"} on one line.</p>` : ""}</div></section>`;
}
function reviewView(c) {
  const P = people(c);
  if (!P.length) return `<h2 class="sr" tabindex="-1">Preview</h2><section class="sheet sheet-pad"><h2>No names yet</h2><p class="lede">Add names to see the certificates.</p><button class="ghost" type="button" data-cgo="names" style="margin-top:var(--s4)">Add names</button></section>`;
  DB.at = Math.min(DB.at || 0, P.length - 1);
  const p = P[DB.at];
  return `<h2 class="sr" tabindex="-1">Preview and print</h2><div class="cpaper" aria-label="Certificate for ${esc(p.name)}">${certHTML(c, p)}</div>
    <div class="c-flip"><button class="ghost sm" type="button" id="cPrev" aria-label="Previous name"${DB.at === 0 ? " disabled" : ""}>←</button><span><b>${esc(p.name)}</b>${p.dup ? ' <span class="c-warn">Listed twice</span>' : ""}</span><button class="ghost sm" type="button" id="cNext" aria-label="Next name"${DB.at === P.length - 1 ? " disabled" : ""}>→</button></div>
    <p class="hint">A4 landscape. Print all saves one PDF with a page per name.</p>`;
}

/* ---------------- events ---------------- */
function grow(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
root.addEventListener("input", (e) => {
  const c = cur(), t = e.target; if (!c) return;
  if (t.matches("textarea.grow-ta")) grow(t);
  if (t.dataset.cf) {
    const f = t.dataset.cf; c[f] = t.value;
    if (f === "event" && !c.reasonEdited) { c.reason = TYPES[c.type].reason(c.event || "[event]"); const w = $("#cWhy"); if (w) { w.value = c.reason; grow(w); } }
    if (f === "reason") c.reasonEdited = true;
    save();
    if (f === "names") { const P = people(c); $("#cFlags").outerHTML = `<div id="cFlags">${namesView(c).split('<div id="cFlags">')[1].split("</section>")[0]}`; $(".sheet h2 .opt", root).textContent = `(${P.length})`; $(".tb-sub", root).textContent = `Certificates · ${P.length} ${P.length === 1 ? "name" : "names"}`; }
    if (f === "event") $(".tb-title", root).textContent = batchTitle(c);
    return;
  }
  if (t.dataset.cs) { const [side, k] = t.dataset.cs.split("."); c[side][k] = t.value; save(); }
});
root.addEventListener("click", (e) => {
  const c = cur(), q = (s) => e.target.closest(s);
  if (q("[data-cclose]")) {
    if (DB.step !== "list" && !DB.back) { DB.step = "list"; DB.cur = null; save(false); render(); TR.toast("Saved. Back to your batches"); }
    else { DB.back = null; DB.step = "list"; DB.cur = null; save(false); dispatchEvent(new CustomEvent("hub:home")); }
    return;
  }
  const g = q("[data-cgo]"); if (g) { go(g.dataset.cgo); return; }
  const o = q("[data-copen]"); if (o) { DB.back = null; DB.cur = o.dataset.copen; DB.at = 0; go("review"); return; }
  if (q("#cNew")) { DB.back = null; const n = blank(); DB.list.unshift(n); DB.cur = n.id; go("details"); return; }
  if (!c) return;
  const ty = q("[data-ctype]");
  if (ty) { c.type = ty.dataset.ctype; if (!c.reasonEdited) c.reason = TYPES[c.type].reason(c.event || "[event]"); save(); render(); return; }
  if (q("#cWhyReset")) { c.reason = TYPES[c.type].reason(c.event || "[event]"); c.reasonEdited = false; save(); render(); return; }
  if (q("#cDel")) {
    const i = DB.list.indexOf(c); DB.list.splice(i, 1); DB.cur = null; DB.step = "list"; save(); render();
    TR.toast("Batch deleted", () => { DB.list.splice(i, 0, c); DB.cur = c.id; DB.step = "details"; save(); render(); });
    return;
  }
  if (q("#cPrev")) { DB.at = Math.max(0, DB.at - 1); save(false); render(); $("#cPrev")?.focus(); return; }
  if (q("#cNext")) { DB.at = DB.at + 1; save(false); render(); $("#cNext")?.focus(); return; }
  if (q("#cPrint")) {
    const P = people(c); if (!P.length) { TR.toast("Add names first"); return; }
    $("#printArea").innerHTML = `<div class="cpaper cprint">${P.map((p) => certHTML(c, p)).join("")}</div>`;
    $("#pageSize").textContent = "@page{size:297mm 210mm;margin:0}";
    window.print();
  }
});
root.addEventListener("keydown", (e) => {
  if (DB.step !== "review" || e.target.matches("input,textarea")) return;
  if (e.key === "ArrowRight") $("#cNext")?.click();
  if (e.key === "ArrowLeft") $("#cPrev")?.click();
});
