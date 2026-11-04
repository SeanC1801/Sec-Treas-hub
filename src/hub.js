// The hub shell around the Treasurer flows: Sign in, Home, Tools, Library,
// Profile and the approval path panel. Front-end draft only: everything is
// kept on this device until the backend exists (see docs/design/UX_MAP.md).
import { TR } from "./prototype.js";
import { ROLES, getSession, setSession, me } from "./session.js";
import { minutesList, openMinutes, newMinutes, showMinutes } from "./minutes.js";

const $ = (s) => document.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const nf = new Intl.NumberFormat("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const peso = (n) => "₱" + nf.format(Number(n) || 0);
const dShort = (d) => (d ? new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d.length === 10 ? d + "T00:00" : d)) : "");
const when = (t) => new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(t));
const { S, L, LRS, REQS, ORG, STAGE } = TR;
const device = $("#device");

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
  }
})();
function saveOrg() {
  try { localStorage.setItem(ORG_KEY, JSON.stringify({ v: 1, to: ORG.to, through: ORG.through, president: ORG.president, treasurer: ORG.treasurer, adviser: ORG.adviser, officers: ORG.officers })); } catch {}
}
const secretaryName = () => (ORG.officers.find((o) => /secretary/i.test(o[1])) || ["Secretary"])[0];

/* ---------------- documents ---------------- */
// stage: 0 Draft · 1 With President · 2 With Adviser · 3 With CSC · 4 Approved
const NEXT = { 1: "president", 2: "adviser", 3: "treasurer" }; // who moves it forward (CSC stages recorded by the Treasurer)
const lastLog = (st) => (st.log && st.log.length ? st.log[st.log.length - 1] : null);
const isReturned = (st) => st.stage === 0 && /^Returned/.test(lastLog(st)?.note || "");

function lrState(id) {
  if (L.req && L.req.id === id) return L;
  if (!LRS[id]) { const e = TR.evData(id); LRS[id] = { items: e.items, budget: [], uid: e.items.length, stage: 0, submitted: null, log: [] }; }
  return LRS[id];
}
function docs() {
  const out = [];
  out.push({
    key: "br:cur", kind: "br", title: S.d.name || "Untitled budget request", type: "Budget request",
    meta: [S.d.date ? dShort(S.d.date) : "No date yet", S.items.length ? peso(TR.total()) : "No lines yet"].join(" · "),
    st: () => S, open: () => openFlow("req"),
  });
  for (const r of REQS.filter((x) => x.ok)) {
    const e = TR.evData(r.id), A = TR.evAllot(r), T = e.items.reduce((a, b) => a + TR.lTot(b), 0);
    out.push({
      key: "lr:" + r.id, kind: "lr", id: r.id, title: r.short || r.name, type: "Liquidation report",
      meta: e.items.length ? `${peso(T)} of ${peso(A)}` : `Not started · ${peso(A)} allotted`,
      st: () => lrState(r.id), open: () => openFlow("liq", r.id),
    });
  }
  for (const r of REQS.filter((x) => x.ok)) {
    out.push({
      key: "bp:" + r.id, kind: "bp", id: r.id, title: r.short || r.name, type: "Budget request", past: true,
      meta: `Approved${r.approved ? " " + r.approved : ""} · ${peso(TR.reqTot(r))}`,
      st: () => ({ stage: 4, log: [], submitted: null }), open: () => openPath(doc("bp:" + r.id)),
    });
  }
  for (const m of minutesList()) {
    out.push({
      key: "mn:" + m.id, kind: "mn", id: m.id, title: `Meeting, ${m.date ? dShort(m.date) : "no date"}`, type: "Minutes",
      meta: `${m.location || "No location"} · ${m.present.length} present`, label: m.final ? "Final" : "Draft",
      st: () => ({ stage: m.final ? 4 : 0, log: [] }), open: () => { setView("sec"); openMinutes(m.id); },
    });
  }
  return out;
}
const doc = (key) => docs().find((d) => d.key === key);
const stageOf = (d) => d.st().stage;
function statusLabel(d) { if (d.label) return d.label; const st = d.st(); return isReturned(st) ? "Returned" : STAGE[st.stage].b; }
const needsMe = (d) => !d.past && d.kind !== "mn" && (NEXT[stageOf(d)] === me().role || (me().role === "treasurer" && isReturned(d.st())));

/* ---------------- views ---------------- */
function setView(v) {
  ui.view = v; keep();
  device.dataset.view = v;
  if (v === "hub") renderHub();
  if (v === "signin") renderSignin();
  if (v === "sec") showMinutes();
}
addEventListener("hub:home", () => setView("hub"));
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

/* ---------------- hub chrome ---------------- */
const TABS = [["home", "Home", "i-home"], ["tools", "Tools", "i-tools"], ["library", "Library", "i-lib"], ["profile", "Profile", "i-user"]];
function renderChrome() {
  const cur = (k) => (k === ui.tab ? ' aria-current="page"' : "");
  $("#hubNav").innerHTML = TABS.map(([k, l]) => `<button type="button" data-tab="${k}"${cur(k)}>${l}</button>`).join("");
  $("#tabbar").innerHTML = TABS.map(([k, l, i]) => `<button type="button" data-tab="${k}"${cur(k)}><svg class="i" aria-hidden="true"><use href="#${i}"/></svg>${l}</button>`).join("");
  $("#hubTitle").textContent = TABS.find((t) => t[0] === ui.tab)[1];
  const lens = (k, l) => `<button type="button" role="radio" data-lens="${k}" aria-checked="${ui.lens === k}"${ui.lens === k ? ' aria-current="page"' : ""}>${l}</button>`;
  $("#roleSwitch").innerHTML = lens("treasurer", "Treasurer") + lens("secretary", "Secretary");
  $("#roleSwitch").hidden = ui.tab === "profile";
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
  return `<div class="hub-title"><div class="kicker">${esc(kicker)}</div><h1>${esc(h1)}</h1>${extra}</div>`;
}
function renderHub() {
  renderChrome();
  const T = { home: renderHome, tools: renderTools, library: renderLibrary, profile: renderProfile }[ui.tab] || renderHome;
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
  if (p && p.closest("#hub")) { const d = doc(p.dataset.path); if (d) (d.kind === "mn" ? d.open() : openPath(d)); return; }
  const tl = e.target.closest("[data-tool]");
  if (tl) { openTool(tl.dataset.tool); }
});

/* ---- Home ---- */
const hello = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; };
const firstName = (n) => String(n).replace(/^(Ms\.|Mr\.|Mrs\.|Dr\.)\s*/i, "").split(" ")[0];
function renderHome() {
  const u = me(), all = docs();
  const mine = all.filter(needsMe);
  const drafts = all.filter((d) => !d.past && stageOf(d) === 0 && !isReturned(d.st()) && (d.kind !== "br" || S.d.name || S.items.length));
  const signer = u.role === "president" || u.role === "adviser";
  const top = ui.lens === "secretary" ? ["minutes", "Minutes"] : ["br", "Budget Requests"];
  const key = signer ? `<button class="key" type="button" data-tab="library">Library<svg class="i"><use href="#i-arrow"/></svg></button>`
    : `<button class="key" type="button" data-tool="${top[0]}">${top[1]}<svg class="i"><use href="#i-arrow"/></svg></button>`;
  const head = titleBlock(`${ROLES[u.role]} · A.Y. 2026–27`, `${hello()}, ${firstName(u.name)}`, key);
  const needs = `<section class="sheet"><div class="sheet-h"><h2>Needs your action</h2><p class="lede">${mine.length ? "Your turn on these." : "Nothing is waiting on you."}</p></div>
    ${mine.length ? `<ul class="rows">${mine.map(docRow).join("")}</ul>` : ""}</section>`;
  let cont;
  if (signer) {
    const moving = all.filter((d) => !d.past && stageOf(d) >= 1 && stageOf(d) <= 3 && !needsMe(d));
    cont = `<section class="sheet"><div class="sheet-h"><h2>On its way</h2><p class="lede">Submitted documents that are with someone else.</p></div>
      ${moving.length ? `<ul class="rows">${moving.map(docRow).join("")}</ul>` : `<p class="empty">Nothing else is moving right now.</p>`}</section>`;
  } else if (ui.lens === "secretary") {
    const md = all.filter((d) => d.kind === "mn").sort((a, b) => b.key.localeCompare(a.key)).slice(0, 4);
    cont = `<section class="sheet"><div class="sheet-h"><h2>Recent minutes</h2><p class="lede">Drafts save on this device as you type.</p></div>
      ${md.length ? `<ul class="rows">${md.map(docRow).join("")}</ul>` : `<p class="empty">No minutes yet.</p>`}</section>`;
  } else {
    const list = drafts.slice(0, 4);
    cont = `<section class="sheet"><div class="sheet-h"><h2>Continue where you left off</h2><p class="lede">Drafts save on this device as you type.</p></div>
      ${list.length ? `<ul class="rows">${list.map(docRow).join("")}</ul>` : `<p class="empty">No drafts.</p>`}
      ${drafts.length > list.length ? `<div class="pf-foot"><button class="textbtn" type="button" data-tab="library">See all ${drafts.length} in Library</button></div>` : ""}</section>`;
  }
  return head + needs + cont;
}

/* ---- Tools ---- */
const TOOLS = {
  br: ["Budget Requests", "Letter, program flow and budget breakdown for the CSC.", "treasurer"],
  lr: ["Liquidation Reports", "Receipts per event, with the first semester tracker.", "treasurer"],
  minutes: ["Minutes", "Meeting details, attendance and notes, formatted.", "secretary"],
  certs: ["Certificates", "A batch of certificates from one list of names.", "secretary"],
};
function openTool(k) {
  if (k === "br") return openFlow("req");
  if (k === "lr") { openFlow("liq"); TR.go("tracker", { force: true, instant: true, noFocus: true }); return; }
  if (k === "minutes") { setView("sec"); openMinutes(null); return; }
  TR.toast(`${TOOLS[k][0]} is being drafted next`);
}
function renderTools() {
  const order = ui.lens === "secretary" ? ["minutes", "certs", "br", "lr"] : ["br", "lr", "minutes", "certs"];
  const head = titleBlock("Tools", ui.lens === "secretary" ? "Secretary tools first" : "Treasurer tools first", `<p>Switch Treasurer or Secretary to change the order. Nothing is hidden.</p>`);
  const meta = (k) => {
    if (k === "br") return S.stage === 0 ? (S.d.name ? "1 draft" : "No draft") : STAGE[S.stage].b;
    if (k === "lr") { const n = REQS.filter((r) => r.ok && TR.evData(r.id).stage === 0).length; return `${n} in draft`; }
    if (k === "minutes") { const n = minutesList().filter((m) => !m.final).length; return `${minutesList().length} meetings${n ? ` · ${n} draft` : ""}`; }
    return "";
  };
  const rows = order.map((k) => `<li class="hrow single"><button class="go" type="button" data-tool="${k}"><span><span class="nm">${TOOLS[k][0]}</span><span class="mt">${TOOLS[k][1]}</span></span>
    ${meta(k) ? `<span class="soon" style="color:var(--ink-2)">${esc(meta(k))}</span>` : `<span class="soon">Drafting next</span>`}</button></li>`).join("");
  return head + `<section class="sheet"><ul class="rows" style="border-top:0">${rows}</ul></section>`;
}

/* ---- Library ---- */
const FILTERS = [["all", "All"], ["draft", "Drafts"], ["mine", "Needs action"], ["sub", "Submitted"], ["ok", "Approved"], ["ret", "Returned"]];
function libMatch(d) {
  const st = d.st(), q = ui.q.trim().toLowerCase();
  if (q && !(d.title + " " + d.type + " " + d.meta).toLowerCase().includes(q)) return false;
  if (ui.type === "br" && d.kind !== "br" && d.kind !== "bp") return false;
  if (ui.type === "lr" && d.kind !== "lr") return false;
  if (ui.type === "mn" && d.kind !== "mn") return false;
  return { all: true, draft: st.stage === 0 && !isReturned(st), mine: needsMe(d), sub: st.stage >= 1 && st.stage <= 3, ok: st.stage === 4, ret: isReturned(st) }[ui.filter];
}
function renderLibrary() {
  const head = titleBlock("Library", "Every document", `<p>Tap one to open it. Tap its status to see who signs.</p>`);
  const tag = (k, l, grp, cur) => `<button type="button" class="tagbtn" role="radio" aria-checked="${cur === k}" data-${grp}="${k}">${l}</button>`;
  const ctl = `<section class="sheet"><div class="lib-ctl">
      <div class="search"><svg class="i" aria-hidden="true"><use href="#i-search"/></svg><input class="line-in" id="libQ" type="search" autocomplete="off" placeholder="Search by event or type" aria-label="Search the library" value="${esc(ui.q)}"></div>
      <div class="tags" role="radiogroup" aria-label="Status">${FILTERS.map(([k, l]) => tag(k, l, "flt", ui.filter)).join("")}</div>
      <div class="tags" role="radiogroup" aria-label="Type">${[["all", "All types"], ["br", "Budget requests"], ["lr", "Liquidation"], ["mn", "Minutes"]].map(([k, l]) => tag(k, l, "typ", ui.type)).join("")}</div>
    </div><ul class="rows" id="libRows">${libRows()}</ul></section>`;
  return head + ctl;
}
function libRows() {
  const list = docs().filter(libMatch);
  return list.length ? list.map(docRow).join("") : `<li><p class="empty">Nothing matches. Try another status or clear the search.</p></li>`;
}
document.addEventListener("input", (e) => { if (e.target.id === "libQ") { ui.q = e.target.value; keep(); $("#libRows").innerHTML = libRows(); } });
document.addEventListener("click", (e) => {
  const f = e.target.closest("[data-flt],[data-typ]");
  if (!f || !f.closest("#hub")) return;
  if (f.dataset.flt) ui.filter = f.dataset.flt; else ui.type = f.dataset.typ;
  keep(); renderHub();
});

/* ---- Profile ---- */
const SIGN = [
  ["president", "Chapter President", () => ORG.president, (v) => (ORG.president = v)],
  ["treasurer", "Chapter Treasurer", () => ORG.treasurer, (v) => (ORG.treasurer = v)],
  ["adviser", "Adviser", () => ORG.adviser, (v) => (ORG.adviser = v)],
  ["through", "CSC Treasurer (the letter goes through)", () => ORG.through.name, (v) => (ORG.through.name = v)],
  ["to", "CSC President (the letter is addressed to)", () => ORG.to.name, (v) => (ORG.to.name = v)],
];
function renderProfile() {
  const u = me();
  const head = titleBlock("AUF-ACM Student Chapter", "Profile", `<p>Your account, the signatories and the officer list.</p>`);
  const you = `<section class="sheet"><div class="sheet-h"><h2>You</h2></div><div class="pf-me"><div><div class="nm">${esc(u.name)}</div><div class="mt">${ROLES[u.role]} · Signed in with your @auf.edu.ph Google account</div></div>
    <button class="ghost" type="button" id="signOut">Sign out</button></div></section>`;
  const sig = `<section class="sheet"><div class="sheet-h"><h2>Signatories</h2><p class="lede">These names print on the Budget Request letter and the Liquidation report.</p></div>
    <div class="pf-grid">${SIGN.map(([k, l, g]) => `<div class="field"><label for="sg-${k}">${l}</label><input class="line-in" id="sg-${k}" data-sign="${k}" autocomplete="off" value="${esc(g())}"></div>`).join("")}</div></section>`;
  const offs = `<section class="sheet"><div class="sheet-h"><h2>Officers</h2><p class="lede">Used for attendance in Minutes and for who you can sign in as.</p></div>
    <div class="off-head" aria-hidden="true"><span>Name</span><span>Position</span><span class="sec">Section</span><span></span></div>
    <div id="offRows">${ORG.officers.map(offRow).join("")}</div>
    <div class="pf-foot"><button class="textbtn" type="button" id="offAdd">+ Add an officer</button><button class="textbtn danger" type="button" id="orgReset">Restore the chapter’s defaults</button></div>
    <p class="note" style="padding:0 var(--s4) var(--s5)">The printed letterhead’s footer is part of the image, so it doesn’t change with these names yet.</p></section>`;
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
    const before = JSON.parse(JSON.stringify({ to: ORG.to, through: ORG.through, president: ORG.president, treasurer: ORG.treasurer, adviser: ORG.adviser, officers: ORG.officers }));
    Object.assign(ORG, JSON.parse(JSON.stringify(ORG0))); saveOrg(); renderHub();
    TR.toast("Chapter defaults restored", () => { Object.assign(ORG, before); saveOrg(); renderHub(); });
  }
});

/* ---------------- Sign in (draft: no real Google yet) ---------------- */
let signAs = "treasurer";
function people() {
  return [["treasurer", ORG.treasurer], ["president", ORG.president], ["adviser", ORG.adviser], ["secretary", secretaryName()]];
}
function renderSignin() {
  $("#signin").innerHTML = `<div class="si-mark">sectreas hub</div><div class="signin-l">
    <div class="si-head"><div class="kicker" style="font-size:13px;font-weight:600;color:var(--ink-2)">AUF-ACM Student Chapter</div><h1>Treasurer and Secretary documents, in the chapter’s format</h1>
      <p>For chapter officers only. Sign in with your @auf.edu.ph Google account.</p></div>
    <div class="sheet si-sheet">
      <button class="key" type="button" id="siGo">Continue with Google<svg class="i"><use href="#i-arrow"/></svg></button>
      <div class="si-as"><h2>Draft only: sign in as</h2>
        <div role="radiogroup" aria-label="Sign in as">${people().map(([k, n]) => `<button class="reqrow" type="button" role="radio" aria-checked="${k === signAs}" data-as="${k}"><span class="rd" aria-hidden="true"></span><span><span class="nm">${esc(n)}</span><span class="mt">${ROLES[k]}</span></span><span></span></button>`).join("")}</div>
      </div>
    </div></div>`;
}
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-as]");
  if (a) { signAs = a.dataset.as; renderSignin(); $(`[data-as="${signAs}"]`).focus(); return; }
  if (e.target.closest("#siGo")) {
    const p = people().find((x) => x[0] === signAs);
    setSession({ role: p[0], name: p[1] });
    ui.tab = "home"; ui.lens = p[0] === "secretary" ? "secretary" : "treasurer";
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
    [1, "Treasurer", ORG.treasurer, "Prepares and submits", "Submitted"],
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
    const k = TR.area() === "liq" ? (L.req ? "lr:" + L.req.id : null) : "br:cur";
    if (k) openPath(doc(k));
  }
});
$("#hdBadge")?.setAttribute("tabindex", "0");

/* ---------------- boot ---------------- */
if (!getSession()) setView("signin");
else setView(ui.view === "flow" || ui.view === "sec" ? ui.view : "hub");
