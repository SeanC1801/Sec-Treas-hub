// Secretary · Minutes of the meeting. Front-end draft: saved on this device.
// Flow: Details & attendance → Notes → Action items → Preview & print.
// The document copies the chapter's template (091126.docx): Letter 8.5 × 11 in,
// Arial 12, the letterhead's top strip on every page, blue headings, names as mentions.
import { TR } from "./prototype.js";
import { me } from "./session.js";

const $ = (s, r = document) => r.querySelector(s);
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const ORG = TR.ORG;
const KEY = "sectreas:minutes:v1";

/* ---------------- data ---------------- */
const SAMPLE = () => ({
  id: "m091126", date: "2026-09-11", start: "20:00", end: "21:30", location: "Discord Channel",
  present: ["LAUREN KAILEY FRANCISCO", "TRIZY GABRIEL NICDAO", "ALISTAIRE MARC GULLIVER ESPINOSA", "JULLIAN MANALO", "ELICIA KLYDE MARTIGNE APOSTOL", "JAN ALDRINN FLORES", "IAN PATRICK FLORES", "CHRISTIAN DOMINIC LIWANAG", "MARK JEMIEL GUEVARRA", "SEAN KEITH HEAVEN CALING", "Jaeda Marthena Iral", "ZOIE CARLISLE MENDOZA", "JACOB ANTONIO"],
  objectives: "To discuss the event details and logistics for the upcoming General Assembly and Code in the Dark events scheduled after exams.\nTo establish deadlines for budget requests, publication materials, and proposal letters for October.",
  callToOrder: "The onboarding started at 8:00 PM, but the meeting proper started at 9 PM.",
  topics: [
    { title: "Administrative & Financials", text: "The deadline to submit budget requests for the upcoming events is Monday, September 14, primarily for signing and printing.\nLiquidation reports must be submitted the day immediately following the event.\nLAUREN KAILEY FRANCISCO and TRIZY GABRIEL NICDAO will seek assistance from Ma'am Mhelle to reserve a venue on Monday, September 14.\nOnce publication materials are complete, JULLIAN MANALO and MARK JEMIEL GUEVARRA will create write-ups.\nThese write-ups will be posted on MS Teams next week on Friday, September 18, after exams.\nThe team will also ask Sir Brent for approval to post the materials on Facebook." },
    { title: "General Assembly Details", text: "The General Assembly is scheduled for September 22, with ALISTAIRE MARC GULLIVER ESPINOSA serving as the event head.\nThe program will feature an official introduction to ACM to orient new and prospective members.\nA retrospective segment will be included to introduce and highlight the events hosted by the chapter last year.\nTo keep the assembly highly engaging, various interactive games will be facilitated for the attendees.\nA dedicated networking event segment will be held to allow students and attendees to connect and mingle.\nThe prizes for the games will be planned once the budget is secured; if delayed, LAUREN KAILEY FRANCISCO will cover the initial costs." },
    { title: "Code in the Dark Details", text: "Code in the Dark will be headed by LANCE JACOB SILVERIO.\nA specific program repository in GitHub will be utilized for this event.\nSince this is a competition, a traditional program flow is not needed.\nThe format will be similar to MSD's Likha't Malaya from last year.\nThe target participant count is 20-25 CCS students across the CS, IT, and MMA programs.\nSupport from 1st and 2nd-year officers is needed to recruit participants, as their batches are mostly exposed to web development." },
    { title: "October Events Preview", text: "The chapter will hold events during the 3rd and 4th weeks of October." },
  ],
  groups: [
    { title: "Administrative & Logistics Tasks", rows: [
      { task: "Reserve event venue via Ma'am Mhelle", who: ["LAUREN KAILEY FRANCISCO", "TRIZY GABRIEL NICDAO"], due: "Sep 14, 2026" },
      { task: "Process budget requests", who: ["ALEXIS YUMI SUZUKI", "CHRISTIAN DOMINIC LIWANAG"], due: "Sep 14, 2026" },
      { task: "Create write-ups and post on MS Teams", who: ["JULLIAN MANALO", "MARK JEMIEL GUEVARRA"], due: "Sep 18, 2026" },
      { task: "Create proposal letters for October events", who: ["LAUREN KAILEY FRANCISCO", "TRIZY GABRIEL NICDAO", "IAN PATRICK FLORES"], due: "Sep 21, 2026" }] },
    { title: "General Assembly Tasks (Event Date: September 22, 2026)", rows: [
      { task: "Create publication materials", who: ["ZOIE CARLISLE MENDOZA"], due: "Sep 15, 2026" },
      { task: "Create the program flow", who: ["IAN PATRICK FLORES"], due: "Sep 18, 2026" },
      { task: "Draft emcee script based on program flow and serve as Emcees", who: ["TRIZY GABRIEL NICDAO", "Jaeda Marthena Iral"], due: "Before Sep 22, 2026" },
      { task: "Create the PowerPoint presentation", who: ["JAN ALDRINN FLORES"], due: "Before Sep 22, 2026" }] },
    { title: "Code in the Dark Tasks", rows: [
      { task: "Create publication materials", who: ["JACOB ANTONIO"], due: "Sep 16, 2026" },
      { task: "Prepare the specific GitHub repository", who: ["LANCE JACOB SILVERIO"], due: "Before event" },
      { task: "Create the registration forms for participants", who: ["ALISTAIRE MARC GULLIVER ESPINOSA"], due: "Before event" },
      { task: "Create certificate templates (participation, facilitators, winners)", who: ["JAN ALDRINN FLORES", "ZOIE CARLISLE MENDOZA", "JACOB ANTONIO"], due: "Before event" }] },
  ],
  reminders: "Ensure all liquidation reports are prepared for submission the very next day after each respective event.",
  adjournment: "The meeting was officially adjourned at around 9:30 PM.",
  final: true, updated: Date.parse("2026-09-12T10:00:00"), preparedBy: "Trizy Gabriel N. Nicdao",
});
const ROSTER0 = ["LAUREN KAILEY FRANCISCO", "TRIZY GABRIEL NICDAO", "ALISTAIRE MARC GULLIVER ESPINOSA", "ALEXIS YUMI SUZUKI", "JULLIAN MANALO", "ELICIA KLYDE MARTIGNE APOSTOL", "JAN ALDRINN FLORES", "IAN PATRICK FLORES", "CHRISTIAN DOMINIC LIWANAG", "MARK JEMIEL GUEVARRA", "SEAN KEITH HEAVEN CALING", "Jaeda Marthena Iral", "ZOIE CARLISLE MENDOZA", "JACOB ANTONIO", "LANCE JACOB SILVERIO", "PAUL ANDREI CALMA"];
const blank = () => ({ id: "m" + Date.now().toString(36), date: (() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; })(), start: "", end: "", location: "", present: [], objectives: "", callToOrder: "", topics: [{ title: "", text: "" }], groups: [{ title: "", rows: [] }], reminders: "", adjournment: "", final: false, updated: Date.now(), preparedBy: me().role === "secretary" ? me().name : null });

let DB = load();
function load() {
  try { const d = JSON.parse(localStorage.getItem(KEY) || "null"); if (d && d.v === 1) return d; } catch {}
  return { v: 1, roster: ROSTER0.slice(), list: [SAMPLE()], cur: null, step: "list" };
}
let saveT;
function save(touch = true) {
  const m = cur(); if (m && touch) m.updated = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch {}
  const b = $("#secSave"); if (b) { b.classList.add("saving"); b.querySelector(".t").textContent = "Saving…"; clearTimeout(saveT); saveT = setTimeout(() => { b.classList.remove("saving"); b.querySelector(".t").textContent = "Saved"; }, 600); }
}
const cur = () => DB.list.find((m) => m.id === DB.cur) || null;
export const minutesList = () => DB.list;

/* ---------------- formatting ---------------- */
const dLong = (d) => (d ? new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(d + "T00:00")) : "");
const dShort = (d) => (d ? new Intl.DateTimeFormat("en-PH", { month: "short", day: "numeric", year: "numeric" }).format(new Date(d + "T00:00")) : "No date");
const t12 = (t) => { if (!t) return ""; const [h, m] = t.split(":").map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`; };
const lines = (s) => String(s || "").split("\n").map((x) => x.trim()).filter(Boolean);
const secretary = (m) => (m && m.preparedBy) || ORG.secretaries[0];
// names from the roster become mentions, as in the chapter's Google Docs minutes
function mention(text) {
  let h = esc(text);
  const names = DB.roster.slice().sort((a, b) => b.length - a.length);
  for (const n of names) {
    const re = new RegExp("(^|[^A-Za-z>])(" + n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")(?![A-Za-z])", "gi");
    h = h.replace(re, (_, a, b) => `${a}<span class="mn-at">${b}</span>`);
  }
  return h;
}

/* ---------------- the document (blocks → Letter pages) ---------------- */
function blocks(m) {
  const B = [];
  const H = (t) => B.push(`<h3 class="mh">${esc(t)}</h3>`);
  const UL = (arr, bold) => arr.forEach((x) => B.push(`<ul class="ml"><li${bold ? ' class="b"' : ""}>${mention(x)}</li></ul>`));
  B.push(`<h1 class="mt1">MINUTES OF THE MEETING</h1><h2 class="mt2">${esc(dLong(m.date).toUpperCase())}</h2>`);
  H("Meeting Details");
  B.push(`<p class="b">Date: ${esc(dLong(m.date))}</p><p class="b">Time: ${esc([t12(m.start), t12(m.end)].filter(Boolean).join(" – "))}</p><p class="b">Location: ${esc(m.location)}</p>`);
  H("Attendees");
  m.present.forEach((n) => B.push(`<ul class="ml"><li><span class="mn-at">${esc(n)}</span></li></ul>`));
  if (lines(m.objectives).length) { H("Meeting Objectives"); UL(lines(m.objectives), true); }
  if (m.callToOrder.trim()) { H("Call to Order"); B.push(`<p class="j">${mention(m.callToOrder)}</p>`); }
  const tps = m.topics.filter((t) => t.title.trim() || lines(t.text).length);
  if (tps.length) {
    H("Discussion Highlights");
    tps.forEach((t) => { if (t.title.trim()) B.push(`<p class="b j">${esc(t.title)}</p>`); UL(lines(t.text)); });
  }
  const gs = m.groups.filter((g) => g.rows.length);
  if (gs.length) {
    H("Action Items & Task Delegation");
    gs.forEach((g) => {
      if (g.title.trim()) B.push(`<p class="b">${esc(g.title)}</p>`);
      B.push(`<table class="mtab"><colgroup><col style="width:46.2%"><col style="width:34.4%"><col style="width:19.4%"></colgroup><thead><tr><th>Task Description</th><th>Assigned Officer(s)</th><th>Deadline</th></tr></thead><tbody>${g.rows.map((r) => `<tr><td>${esc(r.task)}</td><td>${r.who.map((n) => `<span class="mn-at">${esc(n)}</span>`).join("<br>")}</td><td>${esc(r.due)}</td></tr>`).join("")}</tbody></table>`);
    });
  }
  if (lines(m.reminders).length) { H("Other Reminders"); UL(lines(m.reminders), true); }
  if (m.adjournment.trim()) { H("Adjournment"); B.push(`<p class="j">${mention(m.adjournment)}</p>`); }
  B.push(`<div class="msig"><p>Prepared by:</p><p class="b">${esc(secretary(m))}</p><p class="mh-c">Secretary, ${esc(ORG.name)}</p></div>`);
  return B;
}
// lay blocks onto pages the way Word would: fill a page, then start the next
function pagesHTML(m) {
  const B = blocks(m);
  const meas = document.createElement("div");
  meas.className = "mpaper"; meas.style.cssText = "position:absolute;left:-9999px;top:0;width:816px;visibility:hidden";
  meas.innerHTML = `<div class="mpg"><div class="mbody"></div></div>`;
  document.body.appendChild(meas);
  const body = $(".mbody", meas), max = body.clientHeight;
  const pages = [[]];
  for (const b of B) {
    body.insertAdjacentHTML("beforeend", b);
    if (body.scrollHeight > max + 1 && pages[pages.length - 1].length) { pages.push([b]); body.innerHTML = b; }
    else pages[pages.length - 1].push(b);
  }
  meas.remove();
  return pages.map((p) => `<div class="mpg"><div class="mhead" aria-hidden="true"></div><div class="mbody">${p.join("")}</div></div>`).join("");
}

/* ---------------- the flow UI ---------------- */
const STEPS = [["details", "Details"], ["notes", "Notes"], ["actions", "Action items"], ["review", "Preview & print"]];
const root = $("#sec");
let openRow = null; // "g:r" of the action row being edited

export function openMinutes(id) {
  DB.back = id ? "hub" : null; DB.cur = id || null; DB.step = id ? ((DB.list.find((x) => x.id === id) || {}).final ? "review" : "details") : "list"; save(false);
  render(); root.scrollTop = 0;
}
export function newMinutes(fromHub, pre) {
  DB.back = fromHub ? "hub" : null;
  const m = Object.assign(blank(), pre || {}); DB.list.unshift(m); DB.cur = m.id; DB.step = "details"; save();
  render(); root.scrollTop = 0;
}
function go(step) { DB.step = step; openRow = null; save(false); render(); root.scrollTop = 0; $("#secMain h2")?.focus({ preventScroll: true }); }

function render() {
  const m = cur(), list = DB.step === "list" || !m;
  const idx = STEPS.findIndex((s) => s[0] === DB.step);
  const title = list ? "Minutes" : `Meeting, ${dShort(m.date)}`;
  const stepsPh = list ? "" : `<nav class="tabs" aria-label="Steps"><div><ol>${STEPS.map(([k, l], i) => `<li><button class="stepbtn" type="button" data-sgo="${k}"${i === idx ? ' aria-current="step"' : ""} data-done="${stepDone(m, k)}">${l === "Preview & print" ? "Preview" : l}</button></li>`).join("")}</ol></div></nav>`;
  const rail = list
    ? `<div class="kicker">Secretary</div><h1>Minutes</h1><p class="rail-p">Each meeting’s minutes, in the chapter’s format, on Letter paper.</p>`
    : `<div class="kicker">Minutes${m.final ? " · Final" : " · Draft"}</div><h1>${esc(title)}</h1>
       <dl><dt>Time</dt><dd>${esc([t12(m.start), t12(m.end)].filter(Boolean).join(" – ") || "—")}</dd><dt>Where</dt><dd>${esc(m.location || "—")}</dd><dt>Present</dt><dd>${m.present.length}</dd></dl>
       <ol class="steps">${STEPS.map(([k, l], i) => `<li><button class="rstep" type="button" data-sgo="${k}"${i === idx ? ' aria-current="step"' : ""}><span class="n">${i + 1}</span><span class="lb">${l}</span><span class="mark">${stepDone(m, k) ? '<span class="ok">Done</span>' : i === idx ? '<span class="now">In progress</span>' : ""}</span></button></li>`).join("")}</ol>`;
  root.innerHTML = `
    <header class="topbar glass"><div class="tb-row"><button class="icon-btn" type="button" data-sclose aria-label="Close. Your minutes are saved"><svg class="i"><use href="#i-x"/></svg></button>
      <div class="tb-t"><div class="tb-title">${esc(title)}</div><div class="tb-sub">${list ? "Secretary" : "Minutes · " + (m.final ? "Final" : "Draft")}</div></div>
      <span class="save" id="secSave" role="status" aria-live="polite"><span class="dot" aria-hidden="true"></span><span class="t">Saved</span></span></div>${stepsPh}</header>
    <div class="layout"><aside class="rail">${rail}<div class="closeline"><button class="textbtn" type="button" data-sclose>Close</button></div></aside>
      <main class="main" id="secMain">${list ? listView() : { details: detailsView, notes: notesView, actions: actionsView, review: reviewView }[DB.step](m)}</main></div>
    <div class="dock-wrap"><div class="dock glass">${dockView(m, list)}</div></div>`;
  if (DB.step === "review" && m) $("#mPages").innerHTML = pagesHTML(m);
  root.querySelectorAll("textarea.grow-ta").forEach(grow);
}
function stepDone(m, k) {
  if (!m) return false;
  if (k === "details") return !!(m.date && m.location && m.present.length);
  if (k === "notes") return !!(lines(m.objectives).length || m.topics.some((t) => lines(t.text).length));
  if (k === "actions") return m.groups.some((g) => g.rows.length);
  return m.final;
}
function dockView(m, list) {
  if (list) return `<div class="tot"><div class="l">Meetings</div><div class="v">${DB.list.length}</div></div><button class="key" type="button" id="mNew">New minutes<svg class="i"><use href="#i-arrow"/></svg></button>`;
  const i = STEPS.findIndex((s) => s[0] === DB.step);
  if (DB.step === "review")
    return `<div class="tot"><div class="l">${m.final ? "Final" : "Draft"}</div><div class="s">Letter</div></div><button class="ghost" type="button" id="mPrint"><svg class="i"><use href="#i-print"/></svg>Print</button>
      <button class="key" type="button" id="mFinal">${m.final ? "Back to draft" : "Mark as final"}</button>`;
  const nx = STEPS[i + 1];
  return `<div class="tot"><div class="l">Next</div><div class="s">${nx[1]}</div></div><button class="key" type="button" data-sgo="${nx[0]}">Continue<svg class="i"><use href="#i-arrow"/></svg></button>`;
}

function listView() {
  const rows = DB.list.slice().sort((a, b) => (b.date || "").localeCompare(a.date || "")).map((m) => `<li class="hrow"><button class="go" type="button" data-mopen="${m.id}"><span><span class="nm">Meeting, ${esc(dShort(m.date))}</span><span class="mt">${esc(m.location || "No location yet")} · ${m.present.length} present</span></span></button><span class="stbtn ${m.final ? "s4" : "s0"}" style="text-decoration:none;cursor:default">${m.final ? "Final" : "Draft"}</span></li>`).join("");
  return `<div class="hub-title"><div class="kicker">Secretary</div><h1>Minutes</h1></div><section class="sheet"><div class="sheet-h"><h2>Meetings</h2><p class="lede">Newest first. Tap one to edit or print it.</p></div><ul class="rows">${rows || '<li><p class="empty">No minutes yet.</p></li>'}</ul></section>`;
}
function detailsView(m) {
  const roster = DB.roster.map((n) => `<button type="button" class="tagbtn" role="checkbox" aria-checked="${m.present.includes(n)}" data-pres="${esc(n)}">${esc(n)}</button>`).join("");
  return `<section class="sheet sheet-pad"><h2 tabindex="-1">Meeting details</h2><p class="lede">These fill in the top of the minutes.</p>
    <div class="fields"><div class="two"><div class="field"><label for="mDate">Date</label><input class="line-in" id="mDate" type="date" data-mf="date" value="${esc(m.date)}"></div>
      <div class="field"><label for="mLoc">Location</label><input class="line-in" id="mLoc" data-mf="location" autocomplete="off" placeholder="e.g. Discord Channel, EYA-CLI…" value="${esc(m.location)}"></div></div>
      <div class="two"><div class="field"><label for="mStart">Start</label><input class="line-in" id="mStart" type="time" data-mf="start" value="${esc(m.start)}"></div>
      <div class="field"><label for="mEnd">End</label><input class="line-in" id="mEnd" type="time" data-mf="end" value="${esc(m.end)}"></div></div></div></section>
  <section class="sheet sheet-pad"><h2>Attendees <span class="opt">(${m.present.length} present)</span></h2><p class="lede">Tap who was there. They’re listed in the order you tap.</p>
    <div class="tags" id="mRoster">${roster}</div>
    <div class="m-add"><input class="line-in" id="mNewName" autocomplete="off" placeholder="Add someone not on the list…" aria-label="Add a name"><button class="ghost sm" type="button" id="mAddName">Add</button></div>
    <div class="m-foot"><button class="textbtn" type="button" id="mAll">Everyone was there</button><button class="textbtn danger" type="button" id="mDel"><svg class="i"><use href="#i-trash"/></svg>Delete these minutes</button></div></section>`;
}
const ta = (id, f, v, ph, hint) => `<div class="field"><label for="${id}">${f}</label><textarea class="line-in grow-ta" id="${id}" rows="2" data-mf="${id.slice(1).toLowerCase()}" placeholder="${ph}">${esc(v)}</textarea>${hint ? `<p class="lede fhelp">${hint}</p>` : ""}</div>`;
function notesView(m) {
  const topics = m.topics.map((t, i) => `<div class="m-topic" data-ti="${i}"><div class="field"><label for="mtT${i}">Topic</label><input class="line-in" id="mtT${i}" data-tt="${i}" autocomplete="off" placeholder="e.g. General Assembly Details" value="${esc(t.title)}"></div>
      <div class="field"><label for="mtX${i}">Points <span class="opt">(one per line)</span></label><textarea class="line-in grow-ta" id="mtX${i}" data-tx="${i}" rows="3" placeholder="e.g. The General Assembly is on September 22…">${esc(t.text)}</textarea></div>
      ${m.topics.length > 1 ? `<button class="textbtn danger" type="button" data-tdel="${i}">Remove topic</button>` : ""}</div>`).join("");
  return `<section class="sheet sheet-pad"><h2 tabindex="-1">Objectives and call to order</h2><p class="lede">One point per line. Names on the attendance list turn into mentions.</p>
      <div class="fields">${ta("mObjectives", "Meeting objectives", m.objectives, "e.g. To discuss the logistics for the General Assembly…")}${ta("mCalltoorder", "Call to order", m.callToOrder, "e.g. The meeting started at 8:00 PM.")}</div></section>
    <section class="sheet sheet-pad"><h2>Discussion highlights</h2><p class="lede">A topic, then its points, one per line.</p><div class="fields">${topics}</div>
      <button class="textbtn" type="button" id="mTopicAdd" style="margin-top:var(--s4)">+ Add a topic</button></section>
    <section class="sheet sheet-pad"><h2>Closing</h2><div class="fields">${ta("mReminders", "Other reminders <span class=\"opt\">(one per line)</span>", m.reminders, "e.g. Liquidation reports are due the day after each event.")}${ta("mAdjournment", "Adjournment", m.adjournment, "e.g. The meeting was adjourned at 9:30 PM.")}</div></section>`;
}
function actionsView(m) {
  const pool = [...new Set([...m.present, ...DB.roster])];
  const gr = m.groups.map((g, gi) => {
    const rows = g.rows.map((r, ri) => {
      const k = gi + ":" + ri, open = openRow === k;
      return `<li class="m-row${open ? " open" : ""}"><button class="m-rowbtn" type="button" data-ropen="${k}" aria-expanded="${open}"><span class="nm">${esc(r.task) || '<span class="pencil">Task</span>'}</span><span class="mt">${r.who.length ? esc(r.who.join(", ")) : '<span class="pencil">No one assigned</span>'}</span><span class="due">${esc(r.due) || "—"}</span></button>
        ${open ? `<div class="m-ed"><div class="field"><label for="ra${k}">Task description</label><input class="line-in" id="ra${k}" data-rf="task" data-k="${k}" autocomplete="off" value="${esc(r.task)}"></div>
          <div class="field"><span class="lab">Assigned officer(s)</span><div class="tags">${[...r.who, ...pool.filter((n) => !r.who.includes(n))].map((n) => `<button type="button" class="tagbtn" role="checkbox" aria-checked="${r.who.includes(n)}" data-rwho="${esc(n)}" data-k="${k}">${esc(n)}</button>`).join("")}</div></div>
          <div class="field"><label for="rd${k}">Deadline</label><input class="line-in" id="rd${k}" data-rf="due" data-k="${k}" autocomplete="off" placeholder="e.g. Sep 14, 2026 or Before event" value="${esc(r.due)}"></div>
          <div class="m-foot"><button class="textbtn danger" type="button" data-rdel="${k}"><svg class="i"><use href="#i-trash"/></svg>Remove</button><button class="ghost sm" type="button" data-ropen="${k}">Done</button></div></div>` : ""}</li>`;
    }).join("");
    return `<section class="sheet m-group"><div class="sheet-pad" style="padding-bottom:var(--s2)"><div class="field"><label for="mg${gi}">Group</label><input class="line-in" id="mg${gi}" data-gt="${gi}" autocomplete="off" placeholder="e.g. General Assembly Tasks (Event Date: September 22, 2026)" value="${esc(g.title)}"></div></div>
      <div class="m-thead" aria-hidden="true"><span>Task</span><span>Deadline</span></div><ul class="m-rows">${rows}</ul>
      <div class="m-foot" style="padding:var(--s3) var(--s4) var(--s4)"><button class="textbtn" type="button" data-radd="${gi}">+ Add a task</button>${m.groups.length > 1 ? `<button class="textbtn danger" type="button" data-gdel="${gi}">Remove group</button>` : ""}</div></section>`;
  }).join("");
  return `<div class="m-intro"><h2 class="sr" tabindex="-1">Action items</h2></div>${gr}<button class="ghost" type="button" id="mGroupAdd" style="justify-self:start">+ Add a group</button>`;
}
function reviewView(m) {
  return `<h2 class="sr" tabindex="-1">Preview and print</h2><div class="mpaper" id="mPages" aria-label="The minutes, as they print"></div>
    <p class="hint">Letter, 8.5 × 11 in. Prints with the letterhead strip on every page.</p>`;
}

/* ---------------- events ---------------- */
function grow(t) { t.style.height = "auto"; t.style.height = t.scrollHeight + 2 + "px"; }
const FIELD = { date: "date", location: "location", start: "start", end: "end", objectives: "objectives", calltoorder: "callToOrder", reminders: "reminders", adjournment: "adjournment" };
root.addEventListener("input", (e) => {
  const m = cur(), t = e.target; if (!m) return;
  if (t.matches("textarea.grow-ta")) grow(t);
  if (t.dataset.mf) { m[FIELD[t.dataset.mf]] = t.value; save(); if (t.dataset.mf === "date") $(".tb-title", root).textContent = `Meeting, ${dShort(m.date)}`; return; }
  if (t.dataset.tt) { m.topics[+t.dataset.tt].title = t.value; save(); return; }
  if (t.dataset.tx) { m.topics[+t.dataset.tx].text = t.value; save(); return; }
  if (t.dataset.gt) { m.groups[+t.dataset.gt].title = t.value; save(); return; }
  if (t.dataset.rf) { const [g, r] = t.dataset.k.split(":").map(Number); m.groups[g].rows[r][t.dataset.rf] = t.value; save(); }
});
root.addEventListener("click", (e) => {
  const m = cur(), c = (s) => e.target.closest(s);
  if (c("[data-sclose]")) {
    if (DB.step !== "list" && !DB.back) { DB.step = "list"; DB.cur = null; save(false); render(); TR.toast("Saved. Back to your meetings"); }
    else { DB.back = null; DB.step = "list"; DB.cur = null; save(false); dispatchEvent(new CustomEvent("hub:home")); }
    return;
  }
  const sg = c("[data-sgo]"); if (sg) { go(sg.dataset.sgo); return; }
  const mo = c("[data-mopen]"); if (mo) { DB.back = null; DB.cur = mo.dataset.mopen; go(DB.list.find((x) => x.id === DB.cur).final ? "review" : "details"); return; }
  if (c("#mNew")) { DB.back = null; newMinutes(); return; }
  if (!m) return;
  const pr = c("[data-pres]");
  if (pr) { const n = pr.dataset.pres, i = m.present.indexOf(n); i < 0 ? m.present.push(n) : m.present.splice(i, 1); pr.setAttribute("aria-checked", i < 0); save(); $(".sheet h2 .opt", root.querySelectorAll(".sheet")[1]).textContent = `(${m.present.length} present)`; return; }
  if (c("#mAll")) { m.present = DB.roster.slice(); save(); render(); return; }
  if (c("#mAddName")) {
    const inp = $("#mNewName"), n = inp.value.trim(); if (!n) { inp.focus(); return; }
    if (!DB.roster.includes(n)) DB.roster.push(n);
    if (!m.present.includes(n)) m.present.push(n);
    save(); render(); $("#mNewName").focus(); return;
  }
  if (c("#mDel")) {
    const i = DB.list.indexOf(m), was = m; DB.list.splice(i, 1); DB.cur = null; DB.step = "list"; save(); render();
    TR.toast("Minutes deleted", () => { DB.list.splice(i, 0, was); DB.cur = was.id; DB.step = "details"; save(); render(); });
    return;
  }
  if (c("#mTopicAdd")) { m.topics.push({ title: "", text: "" }); save(); render(); $(`#mtT${m.topics.length - 1}`).focus(); return; }
  const td = c("[data-tdel]");
  if (td) { const i = +td.dataset.tdel, was = m.topics.splice(i, 1)[0]; save(); render(); TR.toast(`Removed “${was.title || "topic"}”`, () => { m.topics.splice(i, 0, was); save(); render(); }); return; }
  if (c("#mGroupAdd")) { m.groups.push({ title: "", rows: [] }); save(); render(); $(`#mg${m.groups.length - 1}`).focus(); return; }
  const gd = c("[data-gdel]");
  if (gd) { const i = +gd.dataset.gdel, was = m.groups.splice(i, 1)[0]; save(); render(); TR.toast(`Removed “${was.title || "group"}”`, () => { m.groups.splice(i, 0, was); save(); render(); }); return; }
  const ra = c("[data-radd]");
  if (ra) { const g = +ra.dataset.radd; m.groups[g].rows.push({ task: "", who: [], due: "" }); openRow = g + ":" + (m.groups[g].rows.length - 1); save(); render(); $(`#ra${openRow.replace(":", "\\:")}`).focus(); return; }
  const ro = c("[data-ropen]");
  if (ro) { openRow = openRow === ro.dataset.ropen ? null : ro.dataset.ropen; render(); return; }
  const rw = c("[data-rwho]");
  if (rw) { const [g, r] = rw.dataset.k.split(":").map(Number), w = m.groups[g].rows[r].who, n = rw.dataset.rwho, i = w.indexOf(n); i < 0 ? w.push(n) : w.splice(i, 1); rw.setAttribute("aria-checked", i < 0); save(); return; }
  const rd = c("[data-rdel]");
  if (rd) { const [g, r] = rd.dataset.rdel.split(":").map(Number), was = m.groups[g].rows.splice(r, 1)[0]; openRow = null; save(); render(); TR.toast(`Removed “${was.task || "task"}”`, () => { m.groups[g].rows.splice(r, 0, was); save(); render(); }); return; }
  if (c("#mFinal")) { m.final = !m.final; m.finalAt = m.final ? Date.now() : null; m.finalBy = me().name; save(); render(); TR.toast(m.final ? "Marked as final" : "Back to draft"); return; }
  if (c("#mPrint")) {
    $("#printArea").innerHTML = `<div class="mpaper mprint">${pagesHTML(m)}</div>`;
    $("#pageSize").textContent = "@page{size:8.5in 11in;margin:0}";
    window.print();
  }
});
root.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.id === "mNewName") { e.preventDefault(); $("#mAddName").click(); } });
addEventListener("resize", () => { if (document.querySelector("#device").dataset.view === "sec" && DB.step === "review" && cur()) $("#mPages").innerHTML = pagesHTML(cur()); });

export const showMinutes = () => render();
