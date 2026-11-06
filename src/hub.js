// The hub shell around the Treasurer flows: Sign in, Home, Tools, Library,
// Profile and the approval path panel. Front-end draft only: everything is
// kept on this device until the backend exists (see docs/design/UX_MAP.md).
import { TR } from "./prototype.js";
import { ROLES, getSession, setSession, me } from "./session.js";
import { minutesList, openMinutes, showMinutes, newMinutes } from "./minutes.js";
import { certList, openCerts, showCerts, newBatch, TYPES as CERT_TYPES } from "./certs.js";
import { eventList, eventById, addEvent, updateEvent, removeEvent, restoreEvent, sameEvent, mentions, lrDue, brDue } from "./events.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nf = new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const peso = (n) => "₱" + nf.format(Number(n) || 0);
const dShort = (d) => (d ? new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d.length === 10 ? d + "T00:00" : d)) : "");
const when = (t) => new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(t));
const { S, L, LRS, REQS, ORG, STAGE } = TR;
const device = $("#device");

/* ---------------- logos: AUF College of Computer Studies + AUF-ACM ---------------- */
const LOGOS = `<span class="logos" role="img" aria-label="AUF College of Computer Studies and AUF-ACM"><img class="ccs" src="/assets/auf-ccs.png" alt="" width="678" height="464"><img class="acm" src="/assets/auf-acm.png" alt="" width="1122" height="422"></span>`;
document.querySelectorAll(".hd-mark").forEach((a) => a.insertAdjacentHTML("afterbegin", LOGOS));

/* ---------------- UI state (per viewer convenience) ---------------- */
const UI_KEY = "sectreas:ui:v1";
const ui = Object.assign({ view: "hub", tab: "home", lens: "treasurer", q: "", filter: "all", type: "all" }, read(UI_KEY));
function read(k) { try { return JSON.parse(localStorage.getItem(k) || "null") || {}; } catch { return {}; } }
function keep() { try { localStorage.setItem(UI_KEY, JSON.stringify(ui)); } catch {} }

/* ---------------- Profile: officers and signatories (editable, on this device) ---------------- */
const ORG_KEY = "sectreas:org:v1";
const ORG0 = JSON.parse(JSON.stringify(ORG));
(function loadOrg() {
  const o = read(ORG_KEY);
  if (o && o.v === 1) {
    ORG.to = o.to; ORG.through = o.through; ORG.president = o.president; ORG.treasurer = o.treasurer; ORG.adviser = o.adviser; ORG.officers = o.officers;
    if (o.treasurers) ORG.treasurers = o.treasurers; if (o.secretaries) ORG.secretaries = o.secretaries;
  }
})();
function saveOrg() {
  try { localStorage.setItem(ORG_KEY, JSON.stringify({ v: 1, to: ORG.to, through: ORG.through, president: ORG.president, treasurer: ORG.treasurer, adviser: ORG.adviser, officers: ORG.officers, treasurers: ORG.treasurers, secretaries: ORG.secretaries })); } catch {}
}


/* ---------------- documents ---------------- */
// stage: 0 Draft · 1 With President · 2 With Adviser · 3 With CSC · 4 Approved
const NEXT = { 1: "president", 2: "adviser", 3: "treasurer" }; // who moves it forward (CSC stages recorded by the Treasurer)
const lastLog = (st) => (st.log && st.log.length ? st.log[st.log.length - 1] : null);
const lastAt = (st) => (st && st.log && st.log.length ? st.log[st.log.length - 1].at : 0);
const isReturned = (st) => st.stage === 0 && /^Returned/.test(lastLog(st)?.note || "");

function lrState(id) {
  if (L.req && L.req.id === id) return L;
  if (!LRS[id]) { const e = TR.evData(id); LRS[id] = { items: e.items, budget: [], uid: e.items.length, stage: 0, submitted: null, log: [] }; }
  return LRS[id];
}
function docs() {
  const out = [];
  for (const ev of TR.brList()) {
    const b = TR.brState(ev), e = eventById(ev), sum = b.items.reduce((a, i) => a + (Number(i.amt) || 0), 0);
    out.push({
      key: "br:" + ev, kind: "br", ev, title: b.d.name || (e && e.name) || "Untitled budget request", type: "Budget request",
      meta: [b.d.date ? dShort(b.d.date) : "No date yet", b.items.length ? peso(sum) : "No lines yet"].join(" · "),
      at: b.updated || lastAt(b) || Date.now(), st: () => TR.brState(ev), open: () => openBR(ev),
    });
  }
  for (const r of REQS.filter((x) => x.ok)) {
    const e = TR.evData(r.id), A = TR.evAllot(r), T = e.items.reduce((a, b) => a + TR.lTot(b), 0);
    out.push({
      key: "lr:" + r.id, kind: "lr", id: r.id, title: r.short || r.name, type: "Liquidation report",
      meta: A == null ? `${e.items.length ? peso(T) + " so far" : "Not started"} · budget not approved yet` : e.items.length ? `${peso(T)} of ${peso(A)}` : `Not started · ${peso(A)} allotted`,
      at: (LRS[r.id] || (L.req && L.req.id === r.id ? L : {})).updated || lastAt(lrState(r.id)) || Date.parse((r.date || "2026-10-15") + "T12:00"),
      st: () => lrState(r.id), open: () => { TR.BACK.hub = true; openFlow("liq", r.id); },
    });
  }
  for (const r of REQS.filter((x) => x.ok && !x.fromBR && !x.provisional)) {
    out.push({
      key: "bp:" + r.id, kind: "bp", id: r.id, title: r.short || r.name, type: "Budget request", past: true,
      meta: `Approved${r.approved ? " " + r.approved : ""} · ${peso(TR.reqTot(r))}`,
      at: Date.parse("2026-09-18T12:00"), st: () => ({ stage: 4, log: [], submitted: null }), open: () => openPath(doc("bp:" + r.id)),
    });
  }
  for (const m of minutesList()) {
    out.push({
      key: "mn:" + m.id, kind: "mn", id: m.id, title: `Meeting, ${m.date ? dShort(m.date) : "no date"}`, type: "Minutes",
      meta: `${m.location || "No location"} · ${m.present.length} present`, label: m.final ? "Final" : "Draft",
      at: m.updated || Date.parse(m.date + "T12:00"), st: () => ({ stage: m.final ? 4 : 0, log: [] }), open: () => { setView("sec"); openMinutes(m.id); },
    });
  }
  for (const c of certList()) {
    const n = String(c.names || "").split("\n").filter((x) => x.trim()).length;
    out.push({
      key: "ct:" + c.id, kind: "ct", id: c.id, title: c.event || "Untitled event", type: "Certificates",
      meta: `${CERT_TYPES[c.type].label} · ${n} ${n === 1 ? "name" : "names"}`, label: n ? "Ready" : "No names",
      at: c.updated || Date.parse(c.date + "T12:00"), st: () => ({ stage: n ? 4 : 0, log: [] }), open: () => { setView("cert"); openCerts(c.id); },
    });
  }
  return out;
}
const doc = (key) => docs().find((d) => d.key === key);
const stageOf = (d) => d.st().stage;
function statusLabel(d) { if (d.label) return d.label; const st = d.st(); return isReturned(st) ? "Returned" : STAGE[st.stage].b; }
const needsMe = (d) => !d.past && d.kind !== "mn" && d.kind !== "ct" && (NEXT[stageOf(d)] === me().role || (me().role === "treasurer" && isReturned(d.st())));

/* ---------------- views ---------------- */
function setView(v) {
  ui.view = v; keep();
  device.dataset.view = v;
  if (v === "hub") renderHub();
  if (v === "signin") renderSignin();
  if (v === "sec") showMinutes();
  if (v === "cert") showCerts();
}
addEventListener("hub:home", () => setView("hub"));
function openBR(ev, pre) { TR.openBR(ev, pre); openFlow("req"); }
function openFlow(area, lrId) {
  setView("flow");
  if (area === "liq") {
    TR.setArea("liq", { force: true });
    if (lrId) { const st = lrState(lrId); TR.openEvent(lrId); if (st.stage > 0) TR.go("done", { force: true, instant: true, noFocus: true }); }
  } else {
    TR.setArea("req", { force: true });
  }
}
addEventListener("hub:close", () => { setView("hub"); TR.toast("Saved. You’re back at the hub"); });
$("#apphead .hd-mark")?.addEventListener("click", (e) => { e.preventDefault(); setView("hub"); });

/* ---------------- hub chrome: Home · Library · Profile ---------------- */
const TABS = [["home", "Home", "i-home"], ["events", "Events", "i-cal"], ["profile", "Profile", "i-user"]];
const signerRole = () => me().role === "president" || me().role === "adviser";
/* the sidebar: brand, the three tabs, the role's two start buttons, and you */
function renderChrome() {
  if (ui.tab === "library") ui.tab = "events"; // Library is now part of Events
  if (!TABS.some((t) => t[0] === ui.tab) && ui.tab !== "guides") ui.tab = "home";
  const u = me(), role = lensRole();
  const cur = (k) => (k === ui.tab ? ' aria-current="page"' : "");
  // one "+ Create New", whose choices follow the role you're working as
  const MENU = role === "secretary" ? [["minutes", "Minutes", "For a meeting"], ["certs", "Certificate batch", "For an event"]]
    : [["br", "Budget request", "For an event"], ["lr", "Liquidation report", "For an event, before or after approval"]];
  const create = signerRole() ? "" : `<div class="side-start">
      <button class="key side-create" type="button" id="sideCreate" aria-expanded="${!!ui.createOpen}" aria-controls="createMenu" title="Create new"><svg class="i"><use href="#i-plus"/></svg><span class="lbl">Create New</span></button>
      ${ui.createOpen ? `<div class="create-menu" id="createMenu" role="menu" aria-label="Create new">${MENU.map(([k, l, d]) => `<button type="button" role="menuitem" data-create="${k}"><b>${l}</b><span>${d}</span></button>`).join("")}</div>` : ""}</div>`;
  const min = !!ui.sideMin;
  device.classList.toggle("side-min", min);
  const initials = u.name.replace(/^(Ms\.|Mr\.)\s*/, "").split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).slice(0, 2).join("");
  $("#side").innerHTML = `<div class="side-brand">${LOGOS}<span class="wm lbl">sectreas hub</span>
      <button class="icon-btn side-min-btn" type="button" id="sideMin" aria-label="${min ? "Expand the sidebar" : "Collapse the sidebar"}" aria-pressed="${min}"><svg class="i"><use href="#i-collapse"/></svg></button></div>
    <button class="side-search" type="button" id="sideSearch" title="Search (${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"} K)"><svg class="i"><use href="#i-search"/></svg><span class="lbl">Search</span><kbd class="lbl">${/Mac/.test(navigator.platform) ? "⌘" : "Ctrl"} K</kbd></button>
    <nav class="side-nav" aria-label="Hub">${TABS.map(([k, l, i]) => `<button type="button" data-tab="${k}"${cur(k)} title="${l}"><svg class="i" aria-hidden="true"><use href="#${i}"/></svg><span class="lbl">${l}</span></button>`).join("")}</nav>
    ${create}
    <div class="side-guides"><button type="button" data-tab="guides"${cur("guides")} title="Templates and guides"><svg class="i" aria-hidden="true"><use href="#i-book"/></svg><span class="lbl">Templates and guides</span></button></div>
    <div class="side-foot"><div class="me"><span class="av" aria-hidden="true">${esc(initials)}</span><span class="lbl"><b>${esc(u.name)}</b><span>${esc(ROLES[u.role])}</span></span></div><button class="icon-btn" type="button" id="sideOut" aria-label="Sign out" title="Sign out"><svg class="i"><use href="#i-out"/></svg></button></div>`;
}
// phones: the menu button opens the sidebar as a drawer
let sideFrom = null;
function openSide() { sideFrom = document.activeElement; $("#side").classList.add("open"); $("#sideScrim").hidden = false; $("#menuBtn").setAttribute("aria-expanded", "true"); $("#side [aria-current]")?.focus(); }
function closeSide(focusBack = true) { if (!$("#side").classList.contains("open")) return; $("#side").classList.remove("open"); $("#sideScrim").hidden = true; $("#menuBtn").setAttribute("aria-expanded", "false"); if (focusBack) sideFrom?.focus?.(); }
$("#menuBtn").addEventListener("click", () => ($("#side").classList.contains("open") ? closeSide() : openSide()));
$("#sideScrim").addEventListener("click", () => closeSide());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && $("#side").classList.contains("open")) closeSide(); });
$("#side").addEventListener("click", (e) => {
  const c = (s) => e.target.closest(s);
  const t = c("[data-tab]"); if (t) { ui.tab = t.dataset.tab; ui.pick = null; keep(); closeSide(false); renderHub(); $("#hub").scrollTop = 0; $("#hubMain h1")?.focus?.(); return; }
  if (c("#sideMin")) { ui.sideMin = !ui.sideMin; ui.createOpen = false; keep(); renderChrome(); $("#sideMin").focus(); return; }
  if (c("#sideCreate")) { if (ui.sideMin) { ui.sideMin = false; ui.createOpen = true; keep(); renderChrome(); $("#createMenu button")?.focus(); return; } /* collapsed: open the sidebar to show the choices */
    ui.createOpen = !ui.createOpen; keep(); renderChrome(); $(ui.createOpen ? "#createMenu button" : "#sideCreate")?.focus(); return; }
  const cr = c("[data-create]"); if (cr) {
    closeSide(false); markSetup("started"); ui.createOpen = false;
    const k = cr.dataset.create;
    if (k === "minutes") { keep(); setView("sec"); newMinutes(true); return; }
    ui.tab = "home"; ui.pick = k; keep(); renderHub(); $("#hub").scrollTop = 0; $(".start-pick button, .start-pick input")?.focus(); return;
  }
  if (c("#sideOut")) { closeSide(false); setSession(null); TR.toast("Signed out"); setView("signin"); }
});
document.addEventListener("click", (e) => {
  const t = e.target.closest("#hub [data-tab]"); if (t) { ui.tab = t.dataset.tab; keep(); renderHub(); $("#hub").scrollTop = 0; return; }
  const l = e.target.closest("[data-lens]");
  if (l) { ui.lens = l.dataset.lens; keep(); renderHub(); }
});

function titleBlock(kicker, h1, extra = "") {
  return `<div class="hub-title"><div class="kicker">${esc(kicker)}</div><h1 tabindex="-1">${esc(h1)}</h1>${extra}</div>`;
}
function renderHub() {
  renderChrome();
  const T = { home: renderHome, events: renderEvents, profile: renderProfile, guides: renderGuides }[ui.tab] || renderHome;
  $("#hubMain").innerHTML = T();
}

/* ---- rows ---- */
function docRow(d) {
  const st = d.st(), cls = isReturned(st) ? "ret" : "s" + st.stage;
  return `<li class="hrow"><button class="go" type="button" data-open="${d.key}"><span><span class="nm">${esc(d.title)}</span><span class="mt">${esc(d.type)} · ${esc(d.meta)}</span></span></button>
    <button class="stbtn ${cls}" type="button" data-path="${d.key}" aria-label="${esc(statusLabel(d))}. See who signs">${esc(statusLabel(d))}</button></li>`;
}
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o && o.closest("#hub")) { const d = doc(o.dataset.open); if (d) { if (needsMe(d) && me().role !== "treasurer") openPath(d); else d.open(); } return; }
  const p = e.target.closest("[data-path]");
  if (p && p.closest("#hub")) { const d = doc(p.dataset.path); if (d) (d.kind === "mn" || d.kind === "ct" ? d.open() : openPath(d)); return; }
  const tl = e.target.closest("[data-tool]");
  if (tl) { openTool(tl.dataset.tool); }
});

/* ---- Home: your tools, then what's waiting on you ---- */
const hello = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const firstName = (n) => (ORG.nick && ORG.nick[n]) || String(n).replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.)\s*/i, "").split(" ")[0];
const TOOLS = {
  br: ["Budget Requests", "Letter, program flow and budget breakdown for the CSC."],
  lr: ["Liquidation Reports", "Receipts per event, with the first semester tracker."],
  minutes: ["Minutes", "Meeting details, attendance, notes and action items."],
  certs: ["Certificates", "A batch of certificates from one list of names."],
};
const ROLE_TOOLS = { treasurer: ["br", "lr"], secretary: ["minutes", "certs"] };
function openTool(k) {
  if (k === "br") return openFlow("req");
  if (k === "lr") { TR.BACK.hub = false; openFlow("liq"); TR.go("tracker", { force: true, instant: true, noFocus: true }); return; }
  if (k === "minutes") { setView("sec"); openMinutes(null); return; }
  if (k === "certs") { setView("cert"); openCerts(null); return; }
}
const plural = (n, a, b) => `${n} ${n === 1 ? a : b}`;
function toolStatus(k) {
  const all = docs();
  if (k === "br") {
    const brs = all.filter((d) => d.kind === "br"), parts = [];
    const ret = brs.filter((d) => isReturned(d.st())).length, dr = brs.filter((d) => stageOf(d) === 0 && !isReturned(d.st())).length, mv = brs.filter((d) => stageOf(d) >= 1 && stageOf(d) <= 3).length;
    if (ret) parts.push(`${ret} returned`); if (dr) parts.push(plural(dr, "draft", "drafts")); if (mv) parts.push(`${mv} moving`);
    const ok = all.filter((d) => (d.kind === "bp" || d.kind === "br") && stageOf(d) === 4).length;
    if (ok) parts.push(`${ok} approved`);
    return parts.join(" · ") || "No requests yet";
  }
  if (k === "lr") {
    let A = 0, T = 0;
    for (const r of REQS.filter((x) => x.ok)) { const e = TR.evData(r.id); if (!e.items.length) continue; A += TR.evAllot(r); T += e.items.reduce((a, b) => a + TR.lTot(b), 0); }
    const x = A - T;
    return x >= 0 ? `Semester excess ${peso(x)}` : `Semester deficit (${peso(-x)})`;
  }
  if (k === "minutes") { const n = minutesList().filter((m) => !m.final).length; return plural(minutesList().length, "meeting", "meetings") + (n ? ` · ${n} draft` : ""); }
  if (k === "certs") return plural(certList().length, "batch", "batches");
  return "";
}
// a coloured heading band (Events and Profile; Home uses plain ledger headings)
const bandK = (kind, title, right = "") => `<div class="sheet-h band ${kind}"><h2>${esc(title)}</h2>${right ? `<span>${esc(right)}</span>` : ""}</div>`;
const lensRole = () => (signerRole() ? me().role : ui.lens);

/* ================= Home (agreed 2026-11-06, docs/design/HOME_PLAN_2026-11.md §9) ================= */
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const addDays = (iso, n) => { const d = new Date(iso + "T00:00"); d.setDate(d.getDate() + n); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };
const evOf = (d) => eventById(d.ev || d.id);
// the due date of a document, per D2: liquidation = day after the event, budget = set by the Treasurer
function dueOf(d) {
  if (d.kind === "br") return brDue(evOf(d));
  if (d.kind === "lr") return lrDue(evOf(d));
  return "";
}
const GROUPS = [["over", "Overdue"], ["today", "Today"], ["week", "This week"], ["later", "Later"], ["none", "No due date"]];
function groupOf(due) {
  if (!due) return "none";
  const t = todayISO();
  return due < t ? "over" : due === t ? "today" : due <= addDays(t, 7) ? "week" : "later";
}
const dueText = (due) => { if (!due) return ""; const g = groupOf(due); return g === "over" ? `was due ${dShort(due)}` : g === "today" ? "due today" : `due ${dShort(due)}`; };

/* what this person should do, each with its due date; plus what's waiting on others (Copy link) */
function todos() {
  const u = me(), all = docs(), T = [], W = [];
  const add = (d, verb, why, act) => T.push({ d, verb, why, act, due: dueOf(d) });
  if (signerRole()) {
    all.filter(needsMe).forEach((d) => add(d, u.role === "president" ? "Sign" : "Note", `${d.type} · waiting for your ${u.role === "president" ? "signature" : "note"}`, `data-path="${d.key}"`));
  } else if (lensRole() === "treasurer") {
    for (const d of all.filter((x) => x.kind === "br" || x.kind === "lr")) {
      const st = d.st(), sg = st.stage;
      if (isReturned(st)) {
        const l = lastLog(st), note = (l.note || "").replace(/^Returned:?\s*/, "");
        add(d, "Fix and resend", `${d.type} · returned by ${l.by}${note ? `: “${note}”` : ""}`, `data-open="${d.key}"`);
      } else if (sg === 3) add(d, "Record the CSC’s approval", `${d.type} · with the CSC`, `data-path="${d.key}"`);
      else if (sg === 0 && d.kind === "lr") {
        const e = TR.evData(d.id), due = dueOf(d), happened = !due || due <= addDays(todayISO(), 1);
        if (e.r.provisional) add(d, "Add receipts", "Liquidation draft · send it once the budget is approved", `data-open="${d.key}"`);
        else if (e.items.length) add(d, "Finish and send", `Liquidation report · ${d.meta}`, `data-open="${d.key}"`);
        else if (due && happened) add(d, "Liquidate", `Budget approved · the event was ${dShort(evOf(d).date)}`, `data-open="${d.key}"`);
      } else if (sg === 0 && d.kind === "br") {
        const b = d.st(), need = b.items.filter((i) => !(Number(i.amt) > 0)).length;
        add(d, b.items.length ? "Finish and send" : "Add budget lines", b.items.length ? (need ? `Budget request · ${plural(need, "line needs", "lines need")} an amount` : "Budget request · ready to send to the President") : "Budget request · no lines yet", `data-open="${d.key}"`);
      } else if (sg >= 1 && sg <= 2) W.push(d);
    }
  } else {
    minutesList().filter((m) => !m.final).forEach((m) => { const d = all.find((x) => x.key === "mn:" + m.id); add(d, "Finish minutes", "Minutes · not marked final yet", `data-open="mn:${m.id}"`); });
    certList().filter((c) => !String(c.names || "").trim()).forEach((c) => {
      const d = all.find((x) => x.key === "ct:" + c.id), e = c.evId && eventById(c.evId);
      T.push({ d, verb: "Add names", why: "Certificates · no names yet", act: `data-open="ct:${c.id}"`, due: e && e.date ? e.date : "" });
    });
  }
  // most urgent first: by group, then returned first, then by due date
  const rank = (t) => GROUPS.findIndex((g) => g[0] === groupOf(t.due));
  T.sort((a, b) => rank(a) - rank(b) || (b.verb === "Fix and resend") - (a.verb === "Fix and resend") || (a.due || "9").localeCompare(b.due || "9"));
  return { T, W };
}
const todoRow = (t) => `<li class="hrow single"><button class="go todo" type="button" ${t.act}><span><span class="nm"><span class="verb">${esc(t.verb)}</span> · ${esc(t.d.title)}</span><span class="mt">${esc(t.why)}${t.due ? ` · <span class="due ${groupOf(t.due)}">${esc(dueText(t.due))}</span>` : ""}</span></span><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button></li>`;
const waitRow = (d) => { const who = { 1: ORG.president, 2: ORG.adviser }[stageOf(d)];
  return `<li class="hrow"><button class="go" type="button" data-path="${d.key}"><span><span class="nm">${esc(d.title)}</span><span class="mt">${esc(d.type)} · with ${esc(who || "the signatory")}</span></span></button><button class="stbtn copy" type="button" data-copy="${d.key}" aria-label="Copy a link to ${esc(d.title)}">Copy link</button></li>`; };

/* things I finished today (from the status logs and minutes), for the Done today tray */
function doneToday() {
  const u = me(), t0 = new Date(todayISO() + "T00:00").getTime(), out = [];
  const SAID = { 1: "Sent to the President", 2: "Signed", 3: "Noted", 4: "Recorded the CSC’s approval" };
  for (const d of docs()) {
    if (d.kind === "mn") { const m = minutesList().find((x) => x.id === d.id); if (m && m.final && m.finalAt >= t0 && m.finalBy === u.name) out.push({ id: d.key + m.finalAt, at: m.finalAt, what: d.title, how: "Marked final" }); continue; }
    const st = d.st(); if (!st || !st.log) continue;
    st.log.filter((x) => x.at >= t0 && x.by === u.name && x.to > 0).forEach((x) => out.push({ id: d.key + x.at, at: x.at, what: d.title, how: SAID[x.to] }));
  }
  return out.sort((a, b) => b.at - a.at);
}
/* changes by other people since my last visit */
let LAST_VISIT = ui.lastSeen || 0;
ui.lastSeen = Date.now(); keep();
function sinceLast() {
  const u = me(), out = [];
  const DID = { 0: "returned", 1: "sent", 2: "signed", 3: "noted", 4: "recorded the CSC’s approval of" };
  for (const d of docs()) {
    if (d.kind === "mn") { const m = minutesList().find((x) => x.id === d.id); if (m && m.finalAt > LAST_VISIT && m.finalBy && m.finalBy !== u.name) out.push({ at: m.finalAt, text: `${m.finalBy} finished the ${d.title.replace("Meeting, ", "")} minutes` }); continue; }
    const st = d.st(); if (!st || !st.log) continue;
    st.log.filter((x) => x.at > LAST_VISIT && x.by !== u.name && !/^Unsent/.test(x.note || "")).forEach((x) => out.push({ at: x.at, text: `${x.by} ${DID[x.to]} the ${d.title} ${d.kind === "lr" ? "liquidation" : "budget"}` }));
  }
  return out.sort((a, b) => b.at - a.at).slice(0, 3);
}

/* an event's four documents as a small ledger strip: not started (pencil) / in progress (ink) / done (stamped) */
function strip(e) {
  const x = eventDocs(e), mark = (k, label, s) => `<span class="mk ${s}" title="${label}: ${{ todo: "not started", prog: "in progress", done: "done" }[s]}"><b>${k}</b><span class="sr">${label}: ${{ todo: "not started", prog: "in progress", done: "done" }[s]}</span></span>`;
  const b = x.bp || (x.b && x.b.stage === 4) ? "done" : x.b ? "prog" : "todo";
  const l = x.lr && x.lr.e.stage === 4 ? "done" : x.lr && x.lr.e.items.length ? "prog" : "todo";
  const c = x.certs.length ? (x.certs.every((v) => String(v.names || "").trim()) ? "done" : "prog") : "todo";
  const m = x.mins.length ? (x.mins.every((v) => v.final) ? "done" : "prog") : "todo";
  return `<span class="strip">${mark("B", "Budget request", b)}${mark("L", "Liquidation", l)}${mark("C", "Certificates", c)}${mark("M", "Minutes", m)}</span>`;
}

/* first-run checklist, per person */
function setupState() {
  const u = me(), s = (ui.setup || {})[u.name] || {};
  const steps = [["Sign in", true], ["Check the signatories in Profile", !!s.profile], ["Open an event in Events", !!s.events], [signerRole() ? "Open a document from your to-do list" : "Start your first document", signerRole() ? !!s.opened : !!s.started]];
  return { steps, done: steps.filter((x) => x[1]).length, skipped: !!s.skip };
}
const markSetup = (k) => { const n = me().name; ui.setup = { ...(ui.setup || {}), [n]: { ...((ui.setup || {})[n] || {}), [k]: true } }; keep(); };

const GUIDE = {
  treasurer: ["Start a budget request for an event and send it to the President when every line has an amount.",
    "It goes to the President, then the Adviser, then the CSC. When the CSC approves, record it here.",
    "The day after the event, liquidate it: add each receipt, and the winners’ IDs if there were cash prizes.",
    "Send the liquidation report the same way. Finished documents live in Events."],
  secretary: ["After each meeting, write the minutes: details, attendance, notes and action items. Mark them final when done.",
    "Before an event, start its certificates and paste the names.",
    "Check each name in the preview, then print all as one PDF.",
    "Finished minutes and certificates live in Events, under their event."],
  president: ["Documents waiting for your signature show in your to-do list.", "Open one, check it, then mark it as signed or return it with a note.", "Events shows where every document stands."],
  adviser: ["Documents waiting for your note show in your to-do list.", "Open one, check it, then mark it as noted or return it with a note.", "Events shows where every document stands."],
};
const semester = (d = new Date()) => { const m = d.getMonth(); return m >= 7 ? "1st semester" : m <= 4 ? "2nd semester" : "Summer"; };
const ledgerH = (title, count, cls = "") => `<div class="hl${cls ? " " + cls : ""}"><h2>${esc(title)}</h2>${count != null ? `<span class="cnt">${esc(count)}</span>` : ""}</div>`;

// what kind of work a to-do is, for the status bar: not started / in progress / waiting / returned
function kindOfTodo(t) {
  if (t.verb === "Fix and resend") return "ret";
  if (/^(Sign|Note|Record)/.test(t.verb)) return "wait";
  if (/^(Add budget lines|Liquidate|Add names)$/.test(t.verb)) return "todo";
  return "prog";
}
const KIND = { todo: ["not started", "pencil"], prog: ["in progress", "ink"], wait: ["waiting on a signature", "cyan"], ret: ["returned", "sun"], done: ["done", "leaf"] };
// a thin bar showing how a group splits by status, with the same in words for screen readers
function statusBar(kinds) {
  if (!kinds.length) return "";
  const n = {}; kinds.forEach((k) => (n[k] = (n[k] || 0) + 1));
  const order = ["ret", "todo", "prog", "wait", "done"].filter((k) => n[k]);
  const words = order.map((k) => `${n[k]} ${KIND[k][0]}`).join(", ");
  return `<span class="sbar" role="img" aria-label="${esc(words)}" title="${esc(words)}">${order.map((k) => `<span class="${KIND[k][1]}" style="flex:${n[k]}"></span>`).join("")}</span>`;
}
function renderHome() {
  const u = me(), role = lensRole(), now = new Date();
  const dateLine = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(now) + " · " + semester(now);
  const lens = (k, l) => `<button type="button" role="radio" data-lens="${k}" aria-checked="${role === k}"${role === k ? ' aria-current="page"' : ""}>${l}</button>`;
  const sw = signerRole() ? "" : `<div class="areas home-role" role="radiogroup" aria-label="Show work for">${lens("treasurer", "Treasurer")}${lens("secretary", "Secretary")}</div>`;
  const head = titleBlock(dateLine, firstName(u.name), `<div class="who-row"><p class="who">${esc(ROLES[u.role])}</p>${sw}</div>`);
  // To do
  const { T, W } = todos(), D = doneToday(), stamped = new Set(ui.stamped || []);
  // counts that filter the list (monday.com's count tiles, kept small and useful)
  const isRet = (t) => t.verb === "Fix and resend", isDraft = (t) => kindOfTodo(t) !== "wait" && !isRet(t);
  const F = [["all", "All", T.length + W.length], ["drafts", "Drafts", T.filter(isDraft).length], ["waiting", "Waiting", W.length + T.filter((t) => kindOfTodo(t) === "wait").length], ["returned", "Returned", T.filter(isRet).length], ["done", "Done today", D.length]];
  const hf = F.some((f) => f[0] === ui.homeFilter) ? ui.homeFilter : "all";
  const counts = `<div class="counts" role="radiogroup" aria-label="Show">${F.map(([k, l, n]) => `<button type="button" role="radio" aria-checked="${hf === k}" data-hf="${k}"><b>${n}</b><span>${l}</span></button>`).join("")}</div>`;
  const keepT = (t) => hf === "all" || (hf === "drafts" && isDraft(t)) || (hf === "returned" && isRet(t)) || (hf === "waiting" && kindOfTodo(t) === "wait");
  const TT = hf === "done" ? [] : T.filter(keepT), WW = hf === "all" || hf === "waiting" ? W : [];
  // groups fold away (remembered); each has a status bar
  const off = new Set(ui.grpOff || []);
  const grp = (id, label, items, rowFn, kinds) => {
    const closed = off.has(id), bar = statusBar(kinds);
    return `<li class="grp-h ${id}"><button type="button" data-grp="${id}" aria-expanded="${!closed}"><svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg><span class="gl">${label}</span><span class="gn">${items.length}</span></button>${bar}</li>` + (closed ? "" : items.map(rowFn).join(""));
  };
  let rows = "";
  for (const [g, label] of GROUPS) { const ts = TT.filter((t) => groupOf(t.due) === g); if (ts.length) rows += grp(g, label, ts, todoRow, ts.map(kindOfTodo)); }
  if (WW.length) rows += grp("waitg", "Waiting on others", WW, waitRow, WW.map(() => "wait"));
  const doneRows = D.map((x) => `<li class="done-row"><span class="tick" aria-hidden="true">✓</span><span><span class="nm">${esc(x.how)} · ${esc(x.what)}</span><span class="mt">${new Intl.DateTimeFormat("en-PH", { hour: "numeric", minute: "2-digit" }).format(new Date(x.at))}</span></span><span class="mini-stamp${stamped.has(x.id) ? "" : " fresh"}" aria-label="Done">DONE</span></li>`).join("");
  ui.stamped = [...new Set([...(ui.stamped || []), ...D.map((x) => x.id)])].slice(-50); keep();
  const todo = `<section class="sheet home-block">${ledgerH("To do", T.length ? String(T.length) : null, "todo")}
    ${counts}
    ${rows ? `<ul class="rows">${rows}</ul>` : hf !== "done" ? `<p class="empty">${hf === "all" ? "Nothing needs you right now." : "Nothing here. Tap All to see everything."}</p>` : ""}
    ${signerRole() ? "" : `<div class="todo-add"><button class="textbtn" type="button" data-opencreate="1"><svg class="i"><use href="#i-plus"/></svg>Create New</button></div>`}
    ${D.length && (hf === "all" || hf === "done") ? `<div class="done-tray"><div class="hl sub"><h3>Done today</h3></div><ul class="rows">${doneRows}</ul></div>` : ""}</section>`;
  // Coming up: next 3 events with a date
  const t = todayISO(), soon = eventList().filter((e) => e.date && e.date >= t).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 3);
  const coming = `<section class="sheet home-block">${ledgerH("Coming up")}${soon.length ? `<ul class="rows">${soon.map((e) => `<li class="hrow single"><button class="go" type="button" data-goevent="${e.id}"><span><span class="nm">${esc(e.name)}</span><span class="mt">${esc(dShort(e.date))}${e.venue ? " · " + esc(e.venue) : ""}</span></span>${strip(e)}</button></li>`).join("")}</ul>` : `<p class="empty">No dated events ahead. Add dates in Events.</p>`}</section>`;
  // Since you were last here
  const S2 = sinceLast();
  const since = S2.length ? `<section class="sheet home-block">${ledgerH("Since you were last here")}<ul class="rows since">${S2.map((x) => `<li><span class="nm">${esc(x.text)}</span><span class="mt">${esc(when(x.at))}</span></li>`).join("")}</ul></section>` : "";
  // Start something: chosen from the sidebar; the event picker opens here, at the top
  const pick = ui.pick === "br" ? [`Start a budget request`, evPick("data-brfor", eventList().filter((e) => { const x = eventDocs(e); return !x.b && !x.bp; }), "Every event already has a budget request.") + newEvForm("br")]
    : ui.pick === "lr" ? [`Start a liquidation report`, `<p class="lede">You can start before the budget is approved and send it once it is.</p>` + evPick("data-lrfor", eventList().filter((e) => { const x = eventDocs(e); return !(x.lr && (x.lr.e.items.length || x.lr.e.stage)); }), "Every event already has a liquidation report.") + newEvForm("lr") + `<div class="start-more"><button class="textbtn" type="button" data-tool="lr">Open the semester tracker</button></div>`]
    : ui.pick === "certs" ? [`Start a certificate batch`, evPick("data-ctfor", eventList(), "No events yet.") + newEvForm("certs")] : null;
  const start = pick ? `<section class="sheet home-block start-sheet">${ledgerH(pick[0])}<div class="start-pick">${pick[1]}</div></section>` : "";
  // Get set up (first run only)
  const su = setupState();
  const setup = su.skipped || su.done === su.steps.length ? "" : `<section class="sheet home-block">${ledgerH("Get set up", `${su.done} of ${su.steps.length}`)}<ul class="setup">${su.steps.map(([l, ok]) => `<li class="${ok ? "ok" : ""}"><span class="box" aria-hidden="true">${ok ? "✓" : ""}</span><span>${esc(l)}</span><span class="sr">${ok ? "done" : "not done"}</span></li>`).join("")}</ul><div class="pf-foot"><span></span><button class="textbtn" type="button" id="setupSkip">Skip</button></div></section>`;
  return head + `<div class="home-grid"><div class="home-main">${start}${setup}${todo}</div><div class="home-side">${coming}${since}</div></div>`;
}
const evPick = (attr, list, none) => list.length
  ? `<p class="lede">For which event?</p><ul class="ev-docs">${list.map((e) => `<li><button class="ev-doc" type="button" ${attr}="${e.id}"><span><span class="k">${esc(e.name)}</span><span class="s">${esc(e.date ? dShort(e.date) : "No date yet")}</span></span></button></li>`).join("")}</ul>`
  : `<p class="empty">${none}</p>`;
const newEvForm = (k) => `<div class="ev-edit tn"><div class="field"><label for="tnN">Or a new event</label><input class="line-in" id="tnN" autocomplete="off" placeholder="e.g. Christmas Party"></div><div class="two"><div class="field"><label for="tnD">Date</label><input class="line-in" id="tnD" type="date"></div><div class="field"><label for="tnV">Venue <span class="opt">(optional)</span></label><input class="line-in" id="tnV" autocomplete="off"></div></div><div class="m-foot" style="margin-top:0"><button class="textbtn" type="button" id="pickNo">Cancel</button><button class="ghost sm" type="button" data-tnew="${k}">Start for this new event</button></div></div>`;
async function copyLink(key) {
  const url = location.origin + location.pathname + "#doc=" + encodeURIComponent(key);
  try { await navigator.clipboard.writeText(url); TR.toast("Link copied. Paste it in the group chat"); }
  catch { if (navigator.share) navigator.share({ url }).catch(() => {}); else TR.toast(url); }
}
document.addEventListener("click", (e) => {
  const c = (s) => e.target.closest(s); if (!e.target.closest("#hub")) return;
  const hfb = c("[data-hf]"); if (hfb) { ui.homeFilter = ui.homeFilter === hfb.dataset.hf && hfb.dataset.hf !== "all" ? "all" : hfb.dataset.hf; keep(); renderHub(); document.querySelector(`[data-hf="${ui.homeFilter}"]`)?.focus(); return; }
  const gb = c("[data-grp]"); if (gb) { const o = new Set(ui.grpOff || []), k = gb.dataset.grp; o.has(k) ? o.delete(k) : o.add(k); ui.grpOff = [...o]; keep(); renderHub(); document.querySelector(`[data-grp="${k}"]`)?.focus(); return; }
  if (c("[data-opencreate]")) { ui.sideMin = false; ui.createOpen = true; keep(); renderChrome(); if (matchMedia("(max-width: 959px)").matches || device.clientWidth < 960) openSide(); $("#createMenu button")?.focus(); return; }
  const cp = c("[data-copy]"); if (cp) { e.stopPropagation(); copyLink(cp.dataset.copy); return; }
  if (c("#setupSkip")) { markSetup("skip"); renderHub(); return; }
  const pf = c("[data-pickfor]"); if (pf) { ui.pick = ui.pick === pf.dataset.pickfor ? null : pf.dataset.pickfor; renderHub(); return; }
  if (c("#pickNo")) { ui.pick = null; renderHub(); return; }
  if (c("[data-brfor],[data-lrfor],[data-ctfor],[data-tnew],[data-mnnew]")) markSetup("started");
  const lf = c("[data-lrfor]"); if (lf) { const x = eventById(lf.dataset.lrfor); ui.pick = null; TR.ensureReq(x.id, { name: x.name, date: x.date, venue: x.venue }); TR.BACK.hub = true; openFlow("liq", x.id); return; }
  const bf = c("[data-brfor]"); if (bf) { const x = eventById(bf.dataset.brfor); ui.pick = null; openBR(x.id, { name: x.name, date: x.date, venue: x.venue }); return; }
  const cf = c("[data-ctfor]"); if (cf) { const x = eventById(cf.dataset.ctfor); ui.pick = null; setView("cert"); newBatch({ event: x.name, date: x.date || todayISO(), evId: x.id }); return; }
  const tn = c("[data-tnew]"); if (tn) {
    const n = $("#tnN").value.trim(); if (!n) { $("#tnN").focus(); TR.toast("Give the new event a name"); return; }
    const x = addEvent({ name: n, date: $("#tnD").value, venue: $("#tnV").value }); ui.pick = null;
    if (tn.dataset.tnew === "br") openBR(x.id, { name: x.name, date: x.date, venue: x.venue });
    else if (tn.dataset.tnew === "lr") { TR.ensureReq(x.id, { name: x.name, date: x.date, venue: x.venue }); TR.BACK.hub = true; openFlow("liq", x.id); }
    else { setView("cert"); newBatch({ event: x.name, date: x.date || todayISO(), evId: x.id }); }
    return;
  }
  if (c("[data-mnnew]")) { setView("sec"); newMinutes(true); return; }
  const ge = c("[data-goevent]"); if (ge) { ui.tab = "events"; ui.evOpen = ge.dataset.goevent; markSetup("events"); keep(); renderHub(); $("#hub").scrollTop = 0; return; }
  if (c("[data-open],[data-path]") && signerRole()) markSetup("opened");
});

/* ---- filters (status and tool) used by the Events tab ---- */
const FILTERS = [["all", "All"], ["draft", "Drafts"], ["mine", "Needs action"], ["sub", "Submitted"], ["ok", "Approved"], ["ret", "Returned"]];
const TYPES_F = [["all", "All types"], ["br", "Budget requests"], ["lr", "Liquidation"], ["mn", "Minutes"], ["ct", "Certificates"]];
const filtersOn = () => ui.q.trim() || ui.filter !== "all" || ui.type !== "all";
function libMatch(d) {
  const st = d.st(), q = ui.q.trim().toLowerCase();
  if (q && !(d.title + " " + d.type + " " + d.meta).toLowerCase().includes(q)) return false;
  if (ui.type === "br" && d.kind !== "br" && d.kind !== "bp") return false;
  if (ui.type === "lr" && d.kind !== "lr") return false;
  if (ui.type === "mn" && d.kind !== "mn") return false;
  if (ui.type === "ct" && d.kind !== "ct") return false;
  return { all: true, draft: st.stage === 0 && !isReturned(st), mine: needsMe(d), sub: st.stage >= 1 && st.stage <= 3, ok: st.stage === 4, ret: isReturned(st) }[ui.filter];
}
const monthOf = (t) => new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(t));
// the search-and-filter bar, shared by the Events tab
function filterBar(extra = "") {
  const tag = (k, l, grp, cur) => `<button type="button" class="tagbtn" role="radio" aria-checked="${cur === k}" data-${grp}="${k}">${l}</button>`;
  const on = filtersOn(), sum = [ui.q.trim() && `“${ui.q.trim()}”`, ui.filter !== "all" && FILTERS.find((f) => f[0] === ui.filter)[1], ui.type !== "all" && TYPES_F.find((f) => f[0] === ui.type)[1]].filter(Boolean).join(" · ");
  const bar = `<div class="lib-bar">${extra}<button class="ghost sm" type="button" id="libF" aria-expanded="${!!ui.showF}" aria-controls="libCtl"><svg class="i"><use href="#i-search"/></svg>${on ? "Filters on" : "Search and filter"}</button>
      ${on ? `<span class="lib-sum">${esc(sum)}</span><button class="textbtn" type="button" id="libClear" style="margin:0">Clear</button>` : ""}</div>`;
  const ctl = ui.showF ? `<div class="lib-ctl" id="libCtl">
      <div class="search"><svg class="i" aria-hidden="true"><use href="#i-search"/></svg><input class="line-in" id="libQ" type="search" autocomplete="off" placeholder="Search events and documents" aria-label="Search events and documents" value="${esc(ui.q)}"></div>
      <div class="tags" role="radiogroup" aria-label="Status">${FILTERS.map(([k, l]) => tag(k, l, "flt", ui.filter)).join("")}</div>
      <div class="tags" role="radiogroup" aria-label="Tool">${TYPES_F.map(([k, l]) => tag(k, l, "typ", ui.type)).join("")}</div></div>` : "";
  return `<section class="sheet lib-top">${bar}${ctl}</section>`;
}
document.addEventListener("input", (e) => { if (e.target.id === "libQ") { ui.q = e.target.value; keep(); $("#evList").innerHTML = eventsBody(); } });
document.addEventListener("click", (e) => {
  if (e.target.closest("#libF")) { ui.showF = !ui.showF; keep(); renderHub(); if (ui.showF) $("#libQ")?.focus(); return; }
  if (e.target.closest("#libClear")) { ui.q = ""; ui.filter = "all"; ui.type = "all"; keep(); renderHub(); return; }
  const f = e.target.closest("[data-flt],[data-typ]");
  if (!f || !f.closest("#hub")) return;
  if (f.dataset.flt) ui.filter = f.dataset.flt; else ui.type = f.dataset.typ;
  keep(); renderHub();
});

/* ---- Events: each activity, and every document that belongs to it ---- */
const dMonth = (d) => (d ? new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(d + "T00:00")) : "Date not set");
function eventDocs(e) {
  const b = TR.brState(e.id), r = REQS.find((x) => x.id === e.id && x.ok);
  const bp = r && !r.fromBR && !r.provisional ? r : null;
  const lr = r ? { r, e: TR.evData(r.id) } : null;
  const certs = certList().filter((c) => c.evId === e.id || (!c.evId && sameEvent(e, c.event)));
  const mins = minutesList().filter((m) => mentions(e, m));
  return { b, bp, lr, certs, mins };
}
const brLabel = (st) => (isReturned(st) ? "Returned" : STAGE[st.stage].b);
function eventSummary(e, x) {
  const p = [];
  if (x.b) p.push(x.b.stage === 4 ? "Budget approved" : isReturned(x.b) ? "Budget returned" : x.b.stage === 0 ? "Budget draft" : "Budget " + STAGE[x.b.stage].b.toLowerCase());
  else if (x.bp) p.push("Budget approved"); else p.push("No budget yet");
  if (x.lr && x.lr.e.items.length) p.push(["LR draft", "LR with President", "LR with Adviser", "LR with CSC", "LR approved"][x.lr.e.stage]);
  if (x.certs.length) p.push(plural(x.certs.length, "certificate batch", "certificate batches"));
  if (x.mins.length) p.push(plural(x.mins.length, "meeting", "meetings"));
  return p.join(" · ");
}
const docBtn = (attrs, label, sub, status, cls = "") => `<li><button class="ev-doc" type="button" ${attrs}><span><span class="k">${esc(label)}</span><span class="s">${esc(sub)}</span></span>${status ? `<span class="stbtn ${cls}" style="text-decoration:none">${esc(status)}</span>` : ""}</button></li>`;
const addBtn = (attrs, label) => `<li><button class="ev-doc add" type="button" ${attrs}><svg class="i" aria-hidden="true"><use href="#i-plus"/></svg><span class="k">${esc(label)}</span></button></li>`;
const noteRow = (label, sub) => `<li><div class="ev-doc off"><span><span class="k">${esc(label)}</span><span class="s">${esc(sub)}</span></span></div></li>`;
function eventDrop(e, x) {
  const parts = {
    br: x.b ? docBtn(`data-evbr="${e.id}"`, "Budget Request", [x.b.d.date ? dShort(x.b.d.date) : "No date yet", x.b.items.length ? peso(x.b.items.reduce((a, i) => a + (Number(i.amt) || 0), 0)) : "No lines yet"].join(" · "), brLabel(x.b), isReturned(x.b) ? "ret" : "s" + x.b.stage)
      : x.bp ? docBtn(`data-path="bp:${x.bp.id}"`, "Budget Request", `Approved${x.bp.approved ? " " + x.bp.approved : ""} · ${peso(TR.reqTot(x.bp))}`, "Approved", "s4")
      : noteRow("Budget Request", "Not started · use + Create New in the sidebar"),
    lr: x.lr ? docBtn(`data-evlr="${e.id}"`, "Liquidation Report", x.lr.r.provisional ? `Draft · budget not approved yet` : x.lr.e.items.length ? `${peso(x.lr.e.items.reduce((a, b) => a + TR.lTot(b), 0))} of ${peso(TR.evAllot(x.lr.r))}` : `Not started · ${peso(TR.evAllot(x.lr.r))} allotted`, x.lr.e.items.length ? STAGE[x.lr.e.stage].b : "Start", "s" + x.lr.e.stage)
      : noteRow("Liquidation Report", "Not started · use + Create New in the sidebar"),
    certs: x.certs.map((c) => { const n = String(c.names || "").split("\n").filter((v) => v.trim()).length; return docBtn(`data-evct="${c.id}"`, "Certificates · " + CERT_TYPES[c.type].label, plural(n, "name", "names"), n ? "Ready" : "No names", n ? "s4" : "s0"); }).join("")
      + (x.certs.length ? "" : noteRow("Certificates", "None yet · use + Create New in the sidebar")),
    mins: x.mins.length ? x.mins.map((m) => docBtn(`data-evmn="${m.id}"`, `Minutes · Meeting, ${dShort(m.date)}`, "Talks about this event", m.final ? "Final" : "Draft", m.final ? "s4" : "s0")).join("")
      : noteRow("Minutes", "Not discussed in any minutes yet"),
  };
  const order = ui.lens === "secretary" && !signerRole() ? ["certs", "mins", "br", "lr"] : ["br", "lr", "certs", "mins"];
  const empty = !x.b && !x.bp && !x.certs.length;
  const edit = ui.evEdit === e.id
    ? `<div class="ev-edit"><div class="field"><label for="evN">Event</label><input class="line-in" id="evN" autocomplete="off" value="${esc(e.name)}"></div>
        <div class="two"><div class="field"><label for="evD">Date</label><input class="line-in" id="evD" type="date" value="${esc(e.date)}"></div><div class="field"><label for="evV">Venue</label><input class="line-in" id="evV" autocomplete="off" value="${esc(e.venue)}"></div></div>
        <div class="field"><label for="evB">Budget request due <span class="opt">(set by the Treasurer)</span></label><input class="line-in" id="evB" type="date" value="${esc(e.budgetDue || "")}"></div>
        <div class="m-foot" style="margin-top:0">${empty ? `<button class="textbtn danger" type="button" data-evdel="${e.id}">Delete event</button>` : "<span></span>"}<button class="ghost sm" type="button" data-evdone="${e.id}">Done</button></div></div>`
    : `<div class="ev-foot"><button class="textbtn" type="button" data-evedit="${e.id}">Edit name, dates or venue</button></div>`;
  return `<ul class="ev-docs">${order.map((k) => parts[k]).join("")}</ul>${edit}`;
}
// an event's documents as one status bar (budget, liquidation, each certificate batch, each set of minutes)
function eventBar(e, x) {
  const k = [];
  k.push(x.bp || (x.b && x.b.stage === 4) ? "done" : x.b ? (isReturned(x.b) ? "ret" : x.b.stage >= 1 ? "wait" : "prog") : "todo");
  k.push(x.lr && x.lr.e.stage === 4 ? "done" : x.lr && x.lr.e.stage >= 1 ? "wait" : x.lr && x.lr.e.items.length ? "prog" : "todo");
  x.certs.forEach((c) => k.push(String(c.names || "").trim() ? "done" : "prog"));
  x.mins.forEach((m) => k.push(m.final ? "done" : "prog"));
  return `<div class="ev-bar">${statusBar(k)}</div>`;
}
// the keys of every document that belongs to an event (to filter, and to find the ones with no event)
function eventKeys(e, x) {
  return [x.b && "br:" + e.id, x.bp && "bp:" + x.bp.id, x.lr && "lr:" + x.lr.r.id, ...x.certs.map((c) => "ct:" + c.id), ...x.mins.map((m) => "mn:" + m.id)].filter(Boolean);
}
const band = (title, count) => `<div class="sheet-h month band"><h2>${esc(title)}</h2><span>${esc(count)}</span></div>`;
function eventsBody() {
  const all = docs(), byKey = new Map(all.map((d) => [d.key, d])), used = new Set(), on = filtersOn(), q = ui.q.trim().toLowerCase();
  const shown = [];
  for (const e of eventList()) {
    const x = eventDocs(e), keys = eventKeys(e, x); keys.forEach((k) => used.add(k));
    const ds = keys.map((k) => byKey.get(k)).filter(Boolean);
    const nameHit = q && (e.name + " " + (e.venue || "")).toLowerCase().includes(q);
    const ok = !on || ds.some(libMatch) || (nameHit && ui.filter === "all" && ui.type === "all");
    if (ok) shown.push({ e, x });
  }
  shown.sort((a, b) => (!a.e.date) - (!b.e.date) || (b.e.date || "").localeCompare(a.e.date || "") || a.e.name.localeCompare(b.e.name));
  const groups = [];
  for (const it of shown) { const m = dMonth(it.e.date), g = groups[groups.length - 1]; if (g && g.m === m) g.rows.push(it); else groups.push({ m, rows: [it] }); }
  let html = groups.map((g) => `<section class="sheet">${band(g.m, plural(g.rows.length, "event", "events"))}<ul class="rows">${g.rows.map(({ e, x }) => {
    const open = ui.evOpen === e.id;
    return `<li class="hrow single ev${open ? " open" : ""}"><button class="go ev-h" type="button" data-evtoggle="${e.id}" aria-expanded="${open}"><span><span class="nm">${esc(e.name)}</span><span class="mt">${esc([e.date ? dShort(e.date) : "", e.venue].filter(Boolean).join(" · ") || "No date or venue yet")}</span><span class="ts">${esc(eventSummary(e, x))}</span></span><svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg></button>${eventBar(e, x)}${open ? eventDrop(e, x) : ""}</li>`;
  }).join("")}</ul></section>`).join("");
  // documents that belong to no event: newest first, under month labels
  const other = all.filter((d) => !used.has(d.key) && (!on || libMatch(d))).sort((a, b) => b.at - a.at);
  if (other.length) {
    let last = "", rows = "";
    for (const d of other) { const m = monthOf(d.at); if (m !== last) { rows += `<li class="sub-month" aria-hidden="true">${esc(m)}</li>`; last = m; } rows += docRow(d); }
    html += `<section class="sheet">${bandK("navy", "Other documents", plural(other.length, "document", "documents"))}<ul class="rows">${rows}</ul></section>`;
  }
  return html || `<section class="sheet"><p class="empty">Nothing matches. Try another status or clear the search.</p></section>`;
}
function renderEvents() {
  const head = titleBlock("Events", "Every activity", `<p>Tap an event to see its documents and where each one stands.</p>`);
  const add = ui.evAdding
    ? `<section class="sheet sheet-pad ev-new"><h2>New event</h2><div class="fields"><div class="field"><label for="evNewN">Event</label><input class="line-in" id="evNewN" autocomplete="off" placeholder="e.g. Christmas Party"></div>
        <div class="two"><div class="field"><label for="evNewD">Date</label><input class="line-in" id="evNewD" type="date"></div><div class="field"><label for="evNewV">Venue <span class="opt">(optional)</span></label><input class="line-in" id="evNewV" autocomplete="off" placeholder="e.g. EYA-CLI Laboratory"></div></div></div>
        <div class="m-foot"><button class="textbtn" type="button" id="evNewNo">Cancel</button><button class="ghost" type="button" id="evNewGo">Add event</button></div></section>`
    : "";
  const bar = filterBar(ui.evAdding ? "" : `<button class="ghost sm" type="button" id="evAdd"><svg class="i"><use href="#i-plus"/></svg>New event</button>`);
  return head + bar + add + `<div class="lib-months" id="evList">${eventsBody()}</div>`;
}
document.addEventListener("click", (e) => {
  const c = (s) => e.target.closest(s); if (!e.target.closest("#hub")) return;
  const t = c("[data-evtoggle]"); if (t) { markSetup("events"); ui.evOpen = ui.evOpen === t.dataset.evtoggle ? null : t.dataset.evtoggle; ui.evEdit = null; keep(); renderHub(); document.querySelector(`[data-evtoggle="${t.dataset.evtoggle}"]`)?.focus(); return; }
  if (c("#evAdd")) { ui.evAdding = true; renderHub(); $("#evNewN").focus(); return; }
  if (c("#evNewNo")) { ui.evAdding = false; renderHub(); return; }
  if (c("#evNewGo")) {
    const n = $("#evNewN").value.trim(); if (!n) { $("#evNewN").focus(); TR.toast("Give the event a name"); return; }
    const ev = addEvent({ name: n, date: $("#evNewD").value, venue: $("#evNewV").value });
    ui.evAdding = false; ui.evOpen = ev.id; keep(); renderHub(); TR.toast("Event added"); return;
  }
  const ed = c("[data-evedit]"); if (ed) { ui.evEdit = ed.dataset.evedit; renderHub(); $("#evN").focus(); return; }
  const dn = c("[data-evdone]"); if (dn) { ui.evEdit = null; renderHub(); return; }
  const dl = c("[data-evdel]"); if (dl) { const was = removeEvent(dl.dataset.evdel); ui.evOpen = null; ui.evEdit = null; keep(); renderHub(); TR.toast(`Deleted “${was.e.name}”`, () => { restoreEvent(was); ui.evOpen = was.e.id; renderHub(); }); return; }
  const ev = (k) => eventById(c(`[data-${k}]`).dataset[k.replace(/-([a-z])/g, (_, x) => x.toUpperCase())]);
  if (c("[data-evbr]")) { openBR(c("[data-evbr]").dataset.evbr); return; }
  if (c("[data-evbrnew]")) { const x = eventById(c("[data-evbrnew]").dataset.evbrnew); openBR(x.id, { name: x.name, date: x.date, venue: x.venue }); TR.toast("Budget request started for " + x.name); return; }
  if (c("[data-evlr]")) { TR.BACK.hub = true; openFlow("liq", c("[data-evlr]").dataset.evlr); return; }
  if (c("[data-evct]")) { setView("cert"); openCerts(c("[data-evct]").dataset.evct); return; }
  if (c("[data-evctnew]")) { const x = eventById(c("[data-evctnew]").dataset.evctnew); setView("cert"); newBatch({ event: x.name, date: x.date || new Date().toISOString().slice(0, 10), evId: x.id }); return; }
  if (c("[data-evmn]")) { setView("sec"); openMinutes(c("[data-evmn]").dataset.evmn); return; }
});
document.addEventListener("input", (e) => {
  const id = ui.evEdit; if (!id || !e.target.closest(".ev-edit")) return;
  updateEvent(id, { name: $("#evN").value, date: $("#evD").value, venue: $("#evV").value, budgetDue: $("#evB").value });
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id && e.target.id.startsWith("evNew")) { e.preventDefault(); $("#evNewGo")?.click(); } });

/* ---- Templates and guides (monday.com's "Knowledge files", our version) ---- */
function renderGuides() {
  const u = me(), gk = signerRole() ? u.role : lensRole() === "secretary" ? "secretary" : "treasurer";
  const head = titleBlock("AUF-ACM Student Chapter", "Templates and guides", `<p class="who">What the hub prints on, how it works for you, and the chapter’s deadlines.</p>`);
  const dl = (href, name, what) => `<li class="hrow single"><a class="go" href="${href}" download><span><span class="nm">${name}</span><span class="mt">${what}</span></span><svg class="i" aria-hidden="true"><use href="#i-down"/></svg></a></li>`;
  const files = `<section class="sheet">${bandK("navy", "Templates")}<ul class="rows">${dl("/assets/letterhead.png", "Chapter letterhead", "PNG · Long bond, 8.5 × 13 in · prints behind Budget Requests and Liquidation reports")}${dl("/assets/cert-bg.jpg", "Certificate background", "JPG · A4 landscape · the artwork behind every certificate")}${dl("/assets/auf-acm.png", "AUF-ACM logo", "PNG with a clear background")}${dl("/assets/auf-ccs.png", "AUF CCS logo", "PNG with a clear background")}</ul></section>`;
  const how = `<section class="sheet">${bandK("navy", `How the hub works for the ${ROLES[gk]}`)}<ol class="guide">${GUIDE[gk].map((g) => `<li>${esc(g)}</li>`).join("")}</ol><div style="height:var(--s4)"></div></section>`;
  const rules = `<section class="sheet">${bandK("navy", "Deadlines")}<ul class="guide rules"><li><b>Liquidation report:</b> due the day after the event (chapter meeting, Sep 11, 2026).</li><li><b>Budget request:</b> due on the date the Treasurer sets for each event, in Events → Edit.</li><li><b>Approval path:</b> President signs, Adviser notes, then the CSC Treasurer receives it and the CSC approves. The Treasurer records the CSC’s steps.</li></ul><div style="height:var(--s4)"></div></section>`;
  return head + files + how + rules;
}

/* ---- Search (monday.com's "Search for anything"): events and documents, opens the result ---- */
let srchFrom = null;
function openSearch() {
  srchFrom = document.activeElement; closeSide(false);
  let el = $("#srch");
  if (!el) { el = document.createElement("div"); el.id = "srch"; el.className = "srch"; el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true"); el.setAttribute("aria-label", "Search"); device.appendChild(el); }
  el.innerHTML = `<div class="srch-scrim" data-srchx></div><div class="srch-box"><div class="srch-in"><svg class="i"><use href="#i-search"/></svg><input class="line-in" id="srchQ" type="search" autocomplete="off" placeholder="Search events and documents" aria-label="Search events and documents"><button class="icon-btn" type="button" data-srchx aria-label="Close search"><svg class="i"><use href="#i-x"/></svg></button></div><ul class="rows" id="srchR"></ul></div>`;
  el.hidden = false; renderSearch(""); $("#srchQ").focus();
}
function closeSearch() { const el = $("#srch"); if (el) el.hidden = true; srchFrom?.focus?.(); }
function renderSearch(q) {
  q = q.trim().toLowerCase();
  const evs = eventList().filter((e) => !q || (e.name + " " + (e.venue || "")).toLowerCase().includes(q)).slice(0, 5);
  const ds = docs().filter((d) => !d.past && (!q || (d.title + " " + d.type + " " + d.meta).toLowerCase().includes(q))).sort((a, b) => b.at - a.at).slice(0, 8);
  const r = [...evs.map((e) => `<li class="hrow single"><button class="go" type="button" data-srchev="${e.id}"><span><span class="nm">${esc(e.name)}</span><span class="mt">Event${e.date ? " · " + esc(dShort(e.date)) : ""}</span></span></button></li>`),
    ...ds.map((d) => `<li class="hrow single"><button class="go" type="button" data-srchdoc="${d.key}"><span><span class="nm">${esc(d.title)}</span><span class="mt">${esc(d.type)} · ${esc(statusLabel(d))}</span></span></button></li>`)];
  $("#srchR").innerHTML = r.length ? (q ? "" : `<li class="grp">Recent</li>`) + r.join("") : `<li><p class="empty">Nothing matches “${esc(q)}”.</p></li>`;
}
document.addEventListener("input", (e) => { if (e.target.id === "srchQ") renderSearch(e.target.value); });
document.addEventListener("click", (e) => {
  if (e.target.closest("#sideSearch")) { openSearch(); return; }
  if (!e.target.closest("#srch")) return;
  if (e.target.closest("[data-srchx]")) { closeSearch(); return; }
  const ev = e.target.closest("[data-srchev]"); if (ev) { closeSearch(); ui.tab = "events"; ui.evOpen = ev.dataset.srchev; keep(); setView("hub"); $("#hub").scrollTop = 0; return; }
  const dd = e.target.closest("[data-srchdoc]"); if (dd) { closeSearch(); const d = doc(dd.dataset.srchdoc); if (d) d.open(); }
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k" && device.dataset.view === "hub") { e.preventDefault(); openSearch(); return; }
  if (e.key === "Escape" && $("#srch") && !$("#srch").hidden) { e.stopPropagation(); closeSearch(); }
}, true);

/* ---- Profile ---- */
const SIGN = [
  ["president", "Chapter President", () => ORG.president, (v) => (ORG.president = v)],
  ["t0", "Treasurer", () => ORG.treasurers[0], (v) => { ORG.treasurers[0] = v; ORG.treasurer = v; }],
  ["t1", "Treasurer", () => ORG.treasurers[1], (v) => (ORG.treasurers[1] = v)],
  ["s0", "Secretary", () => ORG.secretaries[0], (v) => (ORG.secretaries[0] = v)],
  ["s1", "Secretary", () => ORG.secretaries[1], (v) => (ORG.secretaries[1] = v)],
  ["adviser", "Adviser", () => ORG.adviser, (v) => (ORG.adviser = v)],
  ["through", "CSC Treasurer (the letter goes through)", () => ORG.through.name, (v) => (ORG.through.name = v)],
  ["to", "CSC President (the letter is addressed to)", () => ORG.to.name, (v) => (ORG.to.name = v)],
];
function renderProfile() {
  const u = me();
  const head = titleBlock("AUF-ACM Student Chapter", "Profile", `<p>Your account, the signatories and the officer list.</p>`);
  const you = `<section class="sheet">${bandK("navy", "You")}<div class="pf-me"><div><div class="nm">${esc(u.name)}</div><div class="mt">${ROLES[u.role]} · Signed in with your @auf.edu.ph Google account</div></div>
    <button class="ghost" type="button" id="signOut">Sign out</button></div></section>`;
  const sig = `<section class="sheet">${bandK("navy", "Signatories")}<div class="sheet-h"><p class="lede">Each document prints the Treasurer or Secretary who prepared it. The others print on every Budget Request and Liquidation report.</p></div>
    <div class="pf-grid">${SIGN.map(([k, l, g]) => `<div class="field"><label for="sg-${k}">${l}</label><input class="line-in" id="sg-${k}" data-sign="${k}" autocomplete="off" value="${esc(g())}"></div>`).join("")}</div></section>`;
  const offs = `<section class="sheet">${bandK("navy", "Officers")}<div class="sheet-h"><p class="lede">These print in the letterhead footer of the Budget Request and Liquidation report.</p></div>
    <div class="off-head" aria-hidden="true"><span>Name</span><span>Position</span><span class="sec">Section</span><span></span></div>
    <div id="offRows">${ORG.officers.map(offRow).join("")}</div>
    <div class="pf-foot"><button class="textbtn" type="button" id="offAdd">+ Add an officer</button><button class="textbtn danger" type="button" id="orgReset">Restore the chapter’s defaults</button></div>
    </section>`;
  markSetup("profile");
  const gk = signerRole() ? u.role : u.role === "secretary" ? "secretary" : "treasurer";
  const how = `<section class="sheet">${bandK("navy", "How the hub works")}<ol class="guide">${GUIDE[gk].map((g) => `<li>${esc(g)}</li>`).join("")}</ol><div style="height:var(--s4)"></div></section>`;
  return head + you + sig + offs;
}
const offRow = (o, i) => `<div class="off-row" data-off="${i}">
  <div class="field"><label class="sr" for="of-n${i}">Name</label><input class="line-in" id="of-n${i}" data-of="0" autocomplete="off" value="${esc(o[0])}" placeholder="Full name"></div>
  <div class="field"><label class="sr" for="of-p${i}">Position</label><input class="line-in" id="of-p${i}" data-of="1" autocomplete="off" value="${esc(o[1])}" placeholder="Position"></div>
  <div class="field sec"><label class="sr" for="of-s${i}">Section</label><input class="line-in" id="of-s${i}" data-of="2" autocomplete="off" value="${esc(o[2])}" placeholder="e.g. BSCS 3A"></div>
  <button class="icon-btn" type="button" data-offdel="${i}" aria-label="Remove ${esc(o[0] || "this officer")}"><svg class="i"><use href="#i-trash"/></svg></button></div>`;
document.addEventListener("input", (e) => {
  const s = e.target.closest("[data-sign]");
  if (s) { SIGN.find((x) => x[0] === s.dataset.sign)[3](s.value); saveOrg(); TR.saved(); return; }
  const o = e.target.closest("[data-of]");
  if (o) { const i = Number(o.closest("[data-off]").dataset.off); ORG.officers[i][Number(o.dataset.of)] = o.value; saveOrg(); }
});
document.addEventListener("click", (e) => {
  if (e.target.closest("#signOut")) { setSession(null); TR.toast("Signed out"); setView("signin"); return; }
  if (e.target.closest("#offAdd")) { ORG.officers.push(["", "", ""]); saveOrg(); renderHub(); $(`#of-n${ORG.officers.length - 1}`)?.focus(); return; }
  const d = e.target.closest("[data-offdel]");
  if (d) {
    const i = Number(d.dataset.offdel), was = ORG.officers.splice(i, 1)[0]; saveOrg(); renderHub();
    TR.toast(`Removed “${was[0] || "officer"}”`, () => { ORG.officers.splice(i, 0, was); saveOrg(); renderHub(); });
    return;
  }
  if (e.target.closest("#orgReset")) {
    const before = JSON.parse(JSON.stringify({ to: ORG.to, through: ORG.through, president: ORG.president, treasurer: ORG.treasurer, adviser: ORG.adviser, officers: ORG.officers, treasurers: ORG.treasurers, secretaries: ORG.secretaries }));
    Object.assign(ORG, JSON.parse(JSON.stringify(ORG0))); saveOrg(); renderHub();
    TR.toast("Chapter defaults restored", () => { Object.assign(ORG, before); saveOrg(); renderHub(); });
  }
});

/* ---------------- Sign in (draft: no real Google yet) ---------------- */
let signAs = 0;
function people() {
  return [...ORG.treasurers.map((n) => ["treasurer", n]), ["president", ORG.president], ["adviser", ORG.adviser], ...ORG.secretaries.map((n) => ["secretary", n])];
}
function renderSignin() {
  $("#signin").innerHTML = `<div class="si-mark">${LOGOS}<span>sectreas hub</span></div><div class="signin-l">
    <div class="si-head"><div class="kicker" style="font-size:13px;font-weight:600;color:var(--ink-2)">AUF-ACM Student Chapter</div><h1>Treasurer and Secretary documents, in the chapter’s format</h1>
      <p>For chapter officers only. Sign in with your @auf.edu.ph Google account.</p></div>
    <div class="sheet si-sheet">
      <button class="key" type="button" id="siGo">Continue with Google<svg class="i"><use href="#i-arrow"/></svg></button>
      <div class="si-as"><h2>Draft only: sign in as</h2>
        <div role="radiogroup" aria-label="Sign in as">${people().map(([k, n], i) => `<button class="reqrow" type="button" role="radio" aria-checked="${i === signAs}" data-as="${i}"><span class="rd" aria-hidden="true"></span><span><span class="nm">${esc(n)}</span><span class="mt">${ROLES[k]}</span></span><span></span></button>`).join("")}</div>
      </div>
    </div></div>`;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-as]");
  if (a) { signAs = Number(a.dataset.as); renderSignin(); $(`[data-as="${signAs}"]`).focus(); return; }
  if (e.target.closest("#siGo")) {
    const p = people()[signAs] || people()[0];
    setSession({ role: p[0], name: p[1] });
    ui.tab = "events"; ui.lens = p[0] === "secretary" ? "secretary" : "treasurer";
    setView("hub");
  }
});

/* ---------------- approval path panel ---------------- */
let apKey = null, apFrom = null, apReturning = false;
function openPath(d) { apKey = d.key; apFrom = document.activeElement; apReturning = false; renderPath(); $("#apScrim").hidden = false; $("#apSheet").hidden = false; $("#apSheet").querySelector("h2").focus(); }
function closePath() { $("#apScrim").hidden = true; $("#apSheet").hidden = true; apKey = null; apFrom && apFrom.focus && apFrom.focus(); }
function renderPath() {
  const d = doc(apKey); if (!d) return closePath();
  const st = d.st(), sg = st.stage, u = me(), ret = isReturned(st);
  const ROWS = [
    [1, "Treasurer", TR.prep(st), "Prepares and submits", "Submitted"],
    [2, "President", ORG.president, "Signs", "Signed"],
    [3, "Adviser", ORG.adviser, "Notes", "Noted"],
    [4, "CSC Treasurer", ORG.through.name, "Receives", "Received"],
    [4, "CSC", ORG.to.name, "Approves", "Approved"],
  ];
  const logFor = (to) => (st.log || []).filter((x) => x.to === to).pop();
  const nextIdx = ROWS.findIndex(([at]) => sg < at);
  const rows = ROWS.map(([at, role, name, does, past], i) => {
    const done = sg >= at || d.past, next = i === nextIdx && !d.past, lg = done && logFor(at);
    const cls = done ? "done" : next ? (ret && i === 0 ? "ret" : "next") : "";
    const stx = done ? past : next ? (ret && i === 0 ? "Returned" : "Next") : "Waiting";
    const det = lg ? `${esc(past)} ${when(lg.at)}${lg.by && lg.role !== role.toLowerCase() ? ` · recorded by <b>${esc(lg.by)}</b>` : ""}` : esc(does);
    return `<li class="${cls}"><span class="dot" aria-hidden="true"></span><span><span class="r">${esc(role)}</span><span class="d" style="display:block">${esc(name)}</span><span class="d" style="display:block">${det}</span></span><span class="st">${stx}</span></li>`;
  }).join("");
  const who = NEXT[sg], mineNow = !d.past && who === u.role;
  let now;
  if (d.past) now = `<b>Approved</b>A past budget request. Its approved amounts feed the Liquidation tracker.`;
  else if (ret) now = `<b>Returned to draft</b>${esc((lastLog(st).note || "").replace(/^Returned:?\s*/, "")) || "No note."} · ${esc(lastLog(st).by)}, ${when(lastLog(st).at)}`;
  else if (sg === 0) now = `<b>Draft</b>Not sent yet. Submit it from Preview & print.`;
  else if (sg === 4) now = `<b>${esc(STAGE[4].t)}</b>Done. Nothing else to sign.`;
  else if (mineNow) now = `<b>Your turn</b>${sg === 3 ? "The CSC officers don’t use the hub. Record it here once the CSC approves it." : `It’s waiting for your ${sg === 1 ? "signature" : "note"}.`}`;
  else now = `<b>${esc(STAGE[sg].t)}</b>Waiting for ${esc(ROWS[nextIdx]?.[2] || "")}${sg === 3 ? ". The Treasurer records the CSC’s approval." : "."}`;
  const ACT = { 1: "Mark as signed", 2: "Mark as noted", 3: "Record the CSC’s approval" };
  let acts = "";
  if (mineNow) {
    acts = apReturning
      ? `<div class="ap-ret"><label class="lab" for="apNote" style="font-weight:600;font-size:13px">Why is it going back?</label><textarea class="line-in grow-ta" id="apNote" rows="2" placeholder="e.g. Please split the snacks into two lines"></textarea>
          <button class="key" type="button" id="apRetGo">Return to the Treasurer</button><button class="ghost" type="button" id="apRetNo">Cancel</button></div>`
      : `<button class="key" type="button" id="apFwd">${ACT[sg]}<svg class="i"><use href="#i-check"/></svg></button>
         <button class="ghost" type="button" id="apOpen">Open the document</button>
         <button class="textbtn danger" type="button" id="apRet" style="justify-self:start;margin:0">Return with a note</button>`;
  } else if (!d.past && u.role === "treasurer") {
    acts = `<button class="${sg === 0 ? "key" : "ghost"}" type="button" id="apOpen">${sg === 0 ? "Open to finish and submit" : "Open the document"}</button>`;
  } else if (!d.past) {
    acts = `<button class="ghost" type="button" id="apOpen">Open the document</button>`;
  }
  const DID = { 0: "Back to draft", 1: "Submitted", 2: "Signed by the President", 3: "Noted by the Adviser", 4: "Approved by the CSC" };
  const hist = st.log || [];
  const log = hist.some((x) => x.to === 0) ? hist.slice(-8).reverse().map((x) => `<li><b>${esc(x.to === 0 ? (x.note || DID[0]) : DID[x.to])}</b> · ${esc(x.by)} · ${when(x.at)}</li>`).join("") : "";
  $("#apSheet").innerHTML = `<div class="ap-grab" aria-hidden="true"></div>
    <div class="ap-top"><div><h2 id="apT" tabindex="-1">${esc(d.title)}</h2><div class="mt">${esc(d.type)} · Who signs</div></div><button class="icon-btn" type="button" id="apX" aria-label="Close"><svg class="i"><use href="#i-x"/></svg></button></div>
    <p class="ap-now">${now}</p><ol class="path">${rows}</ol>
    ${acts ? `<div class="ap-acts">${acts}</div>` : ""}
    ${log ? `<ol class="ap-log" aria-label="History">${log}</ol>` : ""}`;
}
function moveDoc(d, to, note) {
  const st = d.st();
  st.stage = to; if (to === 0) st.submitted = null;
  TR.logStage(st, to, note);
  TR.saved();
  if (device.dataset.view === "flow") TR.go(TR.doc().step === "done" && to === 0 ? "review" : TR.doc().step, { force: true, instant: true, noFocus: true });
}
document.addEventListener("click", (e) => {
  if (!apKey) return;
  if (e.target.closest("#apX") || e.target.id === "apScrim") { closePath(); return; }
  const d = doc(apKey);
  if (e.target.closest("#apFwd")) {
    const to = d.st().stage + 1; moveDoc(d, to);
    TR.toast(to === 4 ? "Recorded. It’s approved" : to === 3 ? "Noted. It goes to the CSC Treasurer" : "Signed. It goes to the Adviser");
    renderPath(); if (device.dataset.view === "hub") renderHub(); return;
  }
  if (e.target.closest("#apRet")) { apReturning = true; renderPath(); $("#apNote").focus(); return; }
  if (e.target.closest("#apRetNo")) { apReturning = false; renderPath(); return; }
  if (e.target.closest("#apRetGo")) {
    const note = $("#apNote").value.trim(); moveDoc(d, 0, "Returned: " + (note || "No note")); apReturning = false;
    TR.toast("Returned to the Treasurer with your note"); renderPath(); if (device.dataset.view === "hub") renderHub(); return;
  }
  if (e.target.closest("#apOpen")) { closePath(); d.open(); if (d.kind === "br" && S.stage > 0) TR.go("done", { force: true, instant: true, noFocus: true }); }
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && apKey) { e.stopPropagation(); closePath(); } }, true);
// the status badge and status bar inside a workflow open the same panel
document.addEventListener("click", (e) => {
  if (device.dataset.view !== "flow") return;
  if (e.target.closest("#hdBadge,#statusBar,#phoneSigns")) {
    const k = TR.area() === "liq" ? (L.req ? "lr:" + L.req.id : null) : S.ev ? "br:" + S.ev : null;
    if (k) openPath(doc(k));
  }
});
$("#hdBadge")?.setAttribute("tabindex", "0");

/* ---------------- boot ---------------- */
if (!getSession()) setView("signin");
else setView(["flow", "sec", "cert"].includes(ui.view) ? ui.view : "hub");

/* a copied link (#doc=<key>) opens that document; until the server exists, only on the phone that has it */
function openFromHash() {
  const m = /^#doc=(.+)$/.exec(location.hash); if (!m) return;
  history.replaceState(null, "", location.pathname + location.search);
  if (!getSession()) return;
  const d = doc(decodeURIComponent(m[1]));
  if (d) d.open();
  else { setView("hub"); TR.toast("That document isn’t on this phone yet. Links will work for everyone once the hub has its server."); }
}
openFromHash();
addEventListener("hashchange", openFromHash);
