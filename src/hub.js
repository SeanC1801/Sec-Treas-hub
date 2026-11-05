// The hub shell around the Treasurer flows: Sign in, Home, Tools, Library,
// Profile and the approval path panel. Front-end draft only: everything is
// kept on this device until the backend exists (see docs/design/UX_MAP.md).
import { TR } from "./prototype.js";
import { ROLES, getSession, setSession, me } from "./session.js";
import { minutesList, openMinutes, showMinutes, newMinutes } from "./minutes.js";
import { certList, openCerts, showCerts, newBatch, TYPES as CERT_TYPES } from "./certs.js";
import { eventList, eventById, addEvent, updateEvent, removeEvent, restoreEvent, sameEvent, mentions } from "./events.js";

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
      meta: e.items.length ? `${peso(T)} of ${peso(A)}` : `Not started · ${peso(A)} allotted`,
      at: (LRS[r.id] || (L.req && L.req.id === r.id ? L : {})).updated || lastAt(lrState(r.id)) || Date.parse((r.date || "2026-10-15") + "T12:00"),
      st: () => lrState(r.id), open: () => { TR.BACK.hub = true; openFlow("liq", r.id); },
    });
  }
  for (const r of REQS.filter((x) => x.ok && !x.fromBR)) {
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
function renderChrome() {
  if (ui.tab === "library") ui.tab = "events"; // Library is now part of Events
  if (!TABS.some((t) => t[0] === ui.tab)) ui.tab = "home";
  const cur = (k) => (k === ui.tab ? ' aria-current="page"' : "");
  $("#hubNav").innerHTML = TABS.map(([k, l]) => `<button type="button" data-tab="${k}"${cur(k)}>${l}</button>`).join("");
  $("#tabbar").innerHTML = TABS.map(([k, l, i]) => `<button type="button" data-tab="${k}"${cur(k)}><svg class="i" aria-hidden="true"><use href="#${i}"/></svg>${l}</button>`).join("");
  $("#hubTitle").textContent = TABS.find((t) => t[0] === ui.tab)[1];
  const lens = (k, l) => `<button type="button" role="radio" data-lens="${k}" aria-checked="${ui.lens === k}"${ui.lens === k ? ' aria-current="page"' : ""}>${l}</button>`;
  $("#roleSwitch").innerHTML = lens("treasurer", "Treasurer") + lens("secretary", "Secretary");
  // the switch only changes Home's tools, so it shows on Home, for the officers who have tools
  $("#roleSwitch").hidden = ui.tab !== "home" || signerRole(); // the role switch lives on Home only
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-tab]");
  if (t && (t.closest("#hub") || t.closest("#tabbar"))) { e.preventDefault(); ui.tab = t.dataset.tab; keep(); renderHub(); $("#hub").scrollTop = 0; return; }
  const l = e.target.closest("[data-lens]");
  if (l) { ui.lens = l.dataset.lens; keep(); renderHub(); }
});

function titleBlock(kicker, h1, extra = "") {
  // phone: at the top of the page; desktop: in the rail
  $("#hubRail").innerHTML = `<div class="kicker">${esc(kicker)}</div><h1>${esc(h1)}</h1>${extra}`;
  return `<div class="hub-title">${ui.tab === "home" ? LOGOS : ""}<div class="kicker">${esc(kicker)}</div><h1>${esc(h1)}</h1>${extra}</div>`;
}
function renderHub() {
  renderChrome();
  const T = { home: renderHome, events: renderEvents, profile: renderProfile }[ui.tab] || renderHome;
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
// a coloured heading band: kind = todo | tre | sec | navy | month
const bandK = (kind, title, right = "") => `<div class="sheet-h band ${kind}"><h2>${esc(title)}</h2>${right ? `<span>${esc(right)}</span>` : ""}</div>`;
const lensRole = () => (signerRole() ? me().role : ui.lens);
const roleKind = () => (lensRole() === "secretary" ? "sec" : "tre");

/* the to-do list: what this role should do next, each item opens the exact spot */
function todos() {
  const u = me(), all = docs(), T = [];
  const add = (verb, what, why, act, warn) => T.push({ verb, what, why, act, warn });
  if (signerRole()) {
    all.filter(needsMe).forEach((d) => add(u.role === "president" ? "Sign" : "Note", d.title, `${d.type} · waiting for you`, `data-path="${d.key}"`));
    return T;
  }
  if (lensRole() === "treasurer") {
    all.filter((d) => (d.kind === "br" || d.kind === "lr") && isReturned(d.st())).forEach((d) => {
      const l = lastLog(d.st()), note = (l.note || "").replace(/^Returned:?\s*/, "");
      add("Fix and resend", d.title, `${d.type} · returned by ${firstName(l.by)}${note ? `: “${note}”` : ""}`, `data-open="${d.key}"`, true);
    });
    all.filter((d) => (d.kind === "br" || d.kind === "lr") && stageOf(d) === 3).forEach((d) => add("Record the CSC’s approval", d.title, `${d.type} · with the CSC`, `data-path="${d.key}"`));
    all.filter((d) => d.kind === "lr" && stageOf(d) === 0 && !isReturned(d.st())).forEach((d) => {
      const e = TR.evData(d.id), past = e.r.date && new Date(e.r.date + "T23:59") < new Date();
      add(e.items.length ? "Finish and send" : "Liquidate", d.title, e.items.length ? `Liquidation report · ${d.meta}` : `Budget approved${past ? ` · the event was ${dShort(e.r.date)}; liquidation is due the next day` : ""}`, `data-open="${d.key}"`, past && !e.items.length);
    });
    all.filter((d) => d.kind === "br" && stageOf(d) === 0 && !isReturned(d.st())).forEach((d) => {
      const b = d.st(), need = b.items.filter((i) => !(Number(i.amt) > 0)).length;
      add(b.items.length ? "Finish and send" : "Add budget lines", d.title, b.items.length ? (need ? `Budget request · ${plural(need, "line needs", "lines need")} an amount` : "Budget request · ready to send to the President") : "Budget request · no lines yet", `data-open="${d.key}"`);
    });
  } else {
    minutesList().filter((m) => !m.final).forEach((m) => add("Finish minutes", `Meeting, ${dShort(m.date)}`, "Minutes · not marked final yet", `data-open="mn:${m.id}"`));
    certList().filter((c) => !String(c.names || "").trim()).forEach((c) => add("Add names", c.event || "Untitled event", "Certificates · no names yet", `data-open="ct:${c.id}"`));
  }
  return T;
}
const todoRow = (t) => `<li class="hrow single"><button class="go todo" type="button" ${t.act}><span><span class="nm"><span class="verb${t.warn ? " warn" : ""}">${esc(t.verb)}</span> · ${esc(t.what)}</span><span class="mt">${esc(t.why)}</span></span><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button></li>`;

/* the tools: where work starts and where in-progress work lives */
const evPick = (attr, list, none) => list.length
  ? `<div class="pick"><p class="lede">For which event?</p><ul class="ev-docs">${list.map((e) => `<li><button class="ev-doc" type="button" ${attr}="${e.id}"><span><span class="k">${esc(e.name)}</span><span class="s">${esc(e.date ? dShort(e.date) : "No date yet")}</span></span></button></li>`).join("")}</ul></div>`
  : `<p class="empty">${none}</p>`;
function toolDrop(k) {
  const all = docs(), rows = (ds) => (ds.length ? `<ul class="rows inprog">${ds.map(docRow).join("")}</ul>` : `<p class="empty">Nothing in progress.</p>`);
  const newEv = `<div class="ev-edit"><div class="field"><label for="tnN">Or a new event</label><input class="line-in" id="tnN" autocomplete="off" placeholder="e.g. Christmas Party"></div><div class="two"><div class="field"><label for="tnD">Date</label><input class="line-in" id="tnD" type="date"></div><div class="field"><label for="tnV">Venue <span class="opt">(optional)</span></label><input class="line-in" id="tnV" autocomplete="off"></div></div><div class="m-foot" style="margin-top:0"><span></span><button class="ghost sm" type="button" data-tnew="${k}">Start for this new event</button></div></div>`;
  if (k === "br") {
    const prog = all.filter((d) => d.kind === "br" && stageOf(d) < 4).sort((a, b) => b.at - a.at);
    const free = eventList().filter((e) => { const x = eventDocs(e); return !x.b && !x.bp; });
    return rows(prog) + (ui.pick === "br" ? evPick("data-brfor", free, "Every event already has a budget request.") + newEv : `<ul class="ev-docs">${addBtn('data-pickfor="br"', "New budget request")}</ul>`);
  }
  if (k === "lr") {
    const prog = all.filter((d) => d.kind === "lr" && stageOf(d) < 4).sort((a, b) => b.at - a.at);
    return rows(prog) + `<ul class="ev-docs">${addBtn('data-tool="lr"', "Open the semester tracker")}</ul>`;
  }
  if (k === "minutes") {
    const prog = all.filter((d) => d.kind === "mn" && d.label === "Draft").sort((a, b) => b.at - a.at);
    return rows(prog) + `<ul class="ev-docs">${addBtn('data-mnnew="1"', "New minutes")}${addBtn('data-tool="minutes"', "All meetings")}</ul>`;
  }
  const prog = all.filter((d) => d.kind === "ct").sort((a, b) => b.at - a.at).slice(0, 4);
  return rows(prog) + (ui.pick === "certs" ? evPick("data-ctfor", eventList(), "No events yet.") + newEv : `<ul class="ev-docs">${addBtn('data-pickfor="certs"', "New certificate batch")}${addBtn('data-tool="certs"', "All batches")}</ul>`);
}
const GUIDE = {
  treasurer: ["Open Budget Requests below and start one for the event. Send it to the President when every line has an amount.",
    "It goes to the President, then the Adviser, then the CSC. When the CSC approves, record it here; your to-do list reminds you.",
    "The day after the event, liquidate it: add each receipt, and the winners’ IDs if there were cash prizes.",
    "Send the Liquidation Report the same way. Finished documents live in Events."],
  secretary: ["After each meeting, open Minutes below: details, attendance, notes and action items. Mark them final when done.",
    "Before an event, start its certificates from Certificates below, then paste the names.",
    "Check each name in the preview, then print all as one PDF.",
    "Finished minutes and certificates live in Events, under their event."],
  president: ["Documents waiting for your signature show in your to-do list.", "Open one, check it, then mark it as signed or return it with a note.", "Events shows where every document stands."],
  adviser: ["Documents waiting for your note show in your to-do list.", "Open one, check it, then mark it as noted or return it with a note.", "Events shows where every document stands."],
};
// Home's main sections open and close from their heading band
const SEC_DEFAULT = { todo: true, tools: true, coming: false, guide: false };
const secOpen = (id) => ((ui.secOpen || {})[id] ?? SEC_DEFAULT[id]);
function homeSection(id, kind, title, right, body) {
  const open = secOpen(id);
  return `<section class="sheet home-sec${open ? " open" : ""}"><button class="sheet-h band ${kind} band-btn" type="button" data-sec="${id}" aria-expanded="${open}" aria-controls="hs-${id}">
      <h2>${esc(title)}</h2><span class="band-r">${right ? `<span>${esc(right)}</span>` : ""}<svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg></span></button>
    <div id="hs-${id}"${open ? "" : " hidden"}>${open ? body : ""}</div></section>`;
}
function renderHome() {
  const u = me(), role = lensRole(), all = docs(), T = todos();
  const head = titleBlock(`${ROLES[u.role]} · A.Y. 2026–27`, `${hello()}, ${firstName(u.name)}`, `<p>${signerRole() ? "Here’s what needs you today." : `Here’s what to do next as ${role === "secretary" ? "Secretary" : "Treasurer"}.`}</p>`);
  const todo = homeSection("todo", "todo", "To do", T.length ? String(T.length) : "",
    T.length ? `<ul class="rows">${(ui.todoAll ? T : T.slice(0, 4)).map(todoRow).join("")}</ul>${T.length > 4 ? `<div class="pf-foot"><span></span><button class="textbtn" type="button" id="todoAll">${ui.todoAll ? "Show fewer" : `Show all ${T.length}`}</button></div>` : ""}` : `<p class="empty">You’re all caught up.</p>`);
  let tools;
  if (!signerRole()) {
    const tl = ROLE_TOOLS[role] || ROLE_TOOLS.treasurer;
    tools = homeSection("tools", "tre", "Your tools", "Start and continue work", `<ul class="rows">${tl.map((k) => {
      const open = ui.toolOpen === k;
      return `<li class="hrow single ev tool${open ? " open" : ""}"><button class="go ev-h" type="button" data-toolopen="${k}" aria-expanded="${open}"><span><span class="nm">${TOOLS[k][0]}</span><span class="mt">${TOOLS[k][1]}</span><span class="ts">${esc(toolStatus(k))}</span></span><svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg></button>${open ? `<div class="tool-drop">${toolDrop(k)}</div>` : ""}</li>`;
    }).join("")}</ul>`);
  } else {
    const moving = all.filter((d) => !d.past && stageOf(d) >= 1 && stageOf(d) <= 3 && !needsMe(d));
    tools = homeSection("tools", "tre", "On its way", plural(moving.length, "document", "documents"), moving.length ? `<ul class="rows">${moving.map(docRow).join("")}</ul>` : `<p class="empty">Nothing else is moving right now.</p>`);
  }
  const now = new Date(), soon = eventList().filter((e) => e.date && new Date(e.date + "T23:59") >= now && new Date(e.date + "T00:00") - now < 31 * 864e5).sort((a, b) => a.date.localeCompare(b.date));
  const coming = homeSection("coming", "tre", "Coming up", soon.length ? plural(soon.length, "event", "events") : "Next 30 days",
    soon.length ? `<ul class="rows">${soon.map((e) => `<li class="hrow single"><button class="go" type="button" data-goevent="${e.id}"><span><span class="nm">${esc(e.name)}</span><span class="mt">${esc(dShort(e.date))}${e.venue ? " · " + esc(e.venue) : ""}</span><span class="ts">${esc(eventSummary(e, eventDocs(e)))}</span></span><svg class="i" aria-hidden="true"><use href="#i-arrow"/></svg></button></li>`).join("")}</ul>` : `<p class="empty">No events in the next 30 days.</p>`);
  const gk = signerRole() ? u.role : role;
  const guide = homeSection("guide", "tre", `Your role in ${GUIDE[gk].length} steps`, "", `<ol class="guide">${GUIDE[gk].map((g) => `<li>${esc(g)}</li>`).join("")}</ol><div style="height:var(--s4)"></div>`);
  return head + todo + tools + coming + guide;
}
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-sec]"); if (!b || !b.closest("#hub")) return;
  ui.secOpen = { ...(ui.secOpen || {}), [b.dataset.sec]: !secOpen(b.dataset.sec) }; keep(); renderHub();
  document.querySelector(`[data-sec="${b.dataset.sec}"]`)?.focus();
});
document.addEventListener("click", (e) => {
  const c = (s) => e.target.closest(s); if (!e.target.closest("#hub")) return;
  const to = c("[data-toolopen]"); if (to) { ui.toolOpen = ui.toolOpen === to.dataset.toolopen ? null : to.dataset.toolopen; ui.pick = null; keep(); renderHub(); document.querySelector(`[data-toolopen="${to.dataset.toolopen}"]`)?.focus(); return; }
  const pf = c("[data-pickfor]"); if (pf) { ui.pick = pf.dataset.pickfor; renderHub(); return; }
  const bf = c("[data-brfor]"); if (bf) { const x = eventById(bf.dataset.brfor); ui.pick = null; openBR(x.id, { name: x.name, date: x.date, venue: x.venue }); return; }
  const cf = c("[data-ctfor]"); if (cf) { const x = eventById(cf.dataset.ctfor); ui.pick = null; setView("cert"); newBatch({ event: x.name, date: x.date || new Date().toISOString().slice(0, 10), evId: x.id }); return; }
  const tn = c("[data-tnew]"); if (tn) {
    const n = $("#tnN").value.trim(); if (!n) { $("#tnN").focus(); TR.toast("Give the new event a name"); return; }
    const x = addEvent({ name: n, date: $("#tnD").value, venue: $("#tnV").value }); ui.pick = null;
    if (tn.dataset.tnew === "br") openBR(x.id, { name: x.name, date: x.date, venue: x.venue });
    else { setView("cert"); newBatch({ event: x.name, date: x.date || new Date().toISOString().slice(0, 10), evId: x.id }); }
    return;
  }
  if (c("#todoAll")) { ui.todoAll = !ui.todoAll; keep(); renderHub(); return; }
  if (c("[data-mnnew]")) { setView("sec"); newMinutes(true); return; }
  const ge = c("[data-goevent]"); if (ge) { ui.tab = "events"; ui.evOpen = ge.dataset.goevent; keep(); renderHub(); $("#hub").scrollTop = 0; return; }
  const gd = c("[data-guide]"); if (gd) { ui.guideOff = { ...(ui.guideOff || {}), [gd.dataset.guide]: !(ui.guideOff || {})[gd.dataset.guide] }; keep(); renderHub(); }
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
  const bp = r && !r.fromBR ? r : null;
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
      : noteRow("Budget Request", "Not started · start it from Budget Requests on Home"),
    lr: x.lr ? docBtn(`data-evlr="${e.id}"`, "Liquidation Report", x.lr.e.items.length ? `${peso(x.lr.e.items.reduce((a, b) => a + TR.lTot(b), 0))} of ${peso(TR.evAllot(x.lr.r))}` : `Not started · ${peso(TR.evAllot(x.lr.r))} allotted`, x.lr.e.items.length ? STAGE[x.lr.e.stage].b : "Start", "s" + x.lr.e.stage)
      : noteRow("Liquidation Report", "Opens once the budget request is approved"),
    certs: x.certs.map((c) => { const n = String(c.names || "").split("\n").filter((v) => v.trim()).length; return docBtn(`data-evct="${c.id}"`, "Certificates · " + CERT_TYPES[c.type].label, plural(n, "name", "names"), n ? "Ready" : "No names", n ? "s4" : "s0"); }).join("")
      + (x.certs.length ? "" : noteRow("Certificates", "None yet · start them from Certificates on Home")),
    mins: x.mins.length ? x.mins.map((m) => docBtn(`data-evmn="${m.id}"`, `Minutes · Meeting, ${dShort(m.date)}`, "Talks about this event", m.final ? "Final" : "Draft", m.final ? "s4" : "s0")).join("")
      : noteRow("Minutes", "Not discussed in any minutes yet"),
  };
  const order = ui.lens === "secretary" && !signerRole() ? ["certs", "mins", "br", "lr"] : ["br", "lr", "certs", "mins"];
  const empty = !x.b && !x.bp && !x.certs.length;
  const edit = ui.evEdit === e.id
    ? `<div class="ev-edit"><div class="field"><label for="evN">Event</label><input class="line-in" id="evN" autocomplete="off" value="${esc(e.name)}"></div>
        <div class="two"><div class="field"><label for="evD">Date</label><input class="line-in" id="evD" type="date" value="${esc(e.date)}"></div><div class="field"><label for="evV">Venue</label><input class="line-in" id="evV" autocomplete="off" value="${esc(e.venue)}"></div></div>
        <div class="m-foot" style="margin-top:0">${empty ? `<button class="textbtn danger" type="button" data-evdel="${e.id}">Delete event</button>` : "<span></span>"}<button class="ghost sm" type="button" data-evdone="${e.id}">Done</button></div></div>`
    : `<div class="ev-foot"><button class="textbtn" type="button" data-evedit="${e.id}">Edit name, date or venue</button></div>`;
  return `<ul class="ev-docs">${order.map((k) => parts[k]).join("")}</ul>${edit}`;
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
    return `<li class="hrow single ev${open ? " open" : ""}"><button class="go ev-h" type="button" data-evtoggle="${e.id}" aria-expanded="${open}"><span><span class="nm">${esc(e.name)}</span><span class="mt">${esc([e.date ? dShort(e.date) : "", e.venue].filter(Boolean).join(" · ") || "No date or venue yet")}</span><span class="ts">${esc(eventSummary(e, x))}</span></span><svg class="i chev" aria-hidden="true"><use href="#i-chev"/></svg></button>${open ? eventDrop(e, x) : ""}</li>`;
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
  const head = titleBlock("Events", "Every activity", `<p>Tap an event to see its documents and where each one stands, or start the ones it still needs.</p>`);
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
  const t = c("[data-evtoggle]"); if (t) { ui.evOpen = ui.evOpen === t.dataset.evtoggle ? null : t.dataset.evtoggle; ui.evEdit = null; keep(); renderHub(); document.querySelector(`[data-evtoggle="${t.dataset.evtoggle}"]`)?.focus(); return; }
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
  updateEvent(id, { name: $("#evN").value, date: $("#evD").value, venue: $("#evV").value });
});
document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id && e.target.id.startsWith("evNew")) { e.preventDefault(); $("#evNewGo")?.click(); } });

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
