// Builds PROGRESS.md (repo root) from the task files in "SecTreas - Harness/01_SPECS/".
//
//   npm run progress                          preview: writes PROGRESS.preview.md (not committed)
//   node scripts/progress.mjs --branches --write   what the GitHub Action runs on main: reads main and
//                                                  every treasurer/* and secretary/* branch, writes PROGRESS.md
//
// It only reads what is written in the task files (Due, Status, From, Pull request lines),
// so the table never says more than the task files do.
//
// Status values:  not started | in progress | returned YYYY-MM-DD: <reason> | submitted YYYY-MM-DD | verified YYYY-MM-DD
// Only Sean writes "verified" (after checking the rubric). "verified" is ignored on branches.
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { parseTaskFile } from "./lib/tasks.mjs";

const root = process.env.PROGRESS_ROOT || join(dirname(fileURLToPath(import.meta.url)), "..");
const SPECS_REL = "SecTreas - Harness/01_SPECS";
const PEOPLE = [
  { file: "treasurer.md", who: "Nico", role: "Treasurer", prefix: "treasurer", letter: "T" },
  { file: "secretary.md", who: "Ian", role: "Secretary", prefix: "secretary", letter: "S" },
];
const PLAN_END = { A: "2026-11-30", B: "2026-12-14" };
const USE_BRANCHES = process.argv.includes("--branches");
// Only the GitHub Action passes --write. Local runs write PROGRESS.preview.md (ignored by git),
// so a preview can never end up in an officer's commit.
const OUT = process.argv.includes("--write") ? "PROGRESS.md" : "PROGRESS.preview.md";

const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
// PROGRESS_TODAY=YYYY-MM-DD previews another day (testing only). The Action sets TZ=Asia/Manila.
const today = /^\d{4}-\d{2}-\d{2}$/.test(process.env.PROGRESS_TODAY || "") ? process.env.PROGRESS_TODAY : iso(new Date());
const days = (a, b) => Math.round((new Date(b + "T00:00") - new Date(a + "T00:00")) / 86400000);
const nice = (s) => new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" }).format(new Date(s + "T00:00"));
const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });

function readPerson(p) {
  const main = parseTaskFile(readFileSync(join(root, SPECS_REL, p.file), "utf8"));
  if (!USE_BRANCHES) return { ...p, ...main };
  let refs = [];
  try { refs = git("for-each-ref", "--format=%(refname:short)", `refs/remotes/origin/${p.prefix}/`).split("\n").filter(Boolean); } catch {}
  for (const ref of refs) {
    const branch = ref.replace(/^origin\//, "");
    const own = (branch.match(new RegExp(`^${p.prefix}/(${p.letter}\\d+)-`)) || [])[1]; // the task this branch is for
    let text; try { text = git("show", `${ref}:${SPECS_REL}/${p.file}`); } catch { continue; }
    const b = parseTaskFile(text);
    if (!main.plan && b.plan) main.plan = b.plan;
    for (const t of b.tasks.values()) {
      if (t.status.key === "verified") t.status = { key: "submitted", rank: 3, date: t.status.date, label: "Submitted" }; // only main can verify
      const m = main.tasks.get(t.id);
      if (!m) { main.tasks.set(t.id, { ...t, source: branch }); continue; } // new task, not merged yet
      const review = own === `${p.letter}0`; // the review branch (T0/S0) is where the plan's due dates are written
      if (review && !m.due && t.due && t.id !== own) { m.due = t.due; m.source = m.source === "main" ? `main (due date from ${branch})` : m.source; }
      if (t.id !== own || m.status.key === "verified") continue; // a branch speaks only for its own task
      if (t.status.rank > m.status.rank || (t.status.rank === m.status.rank && t.due && t.due !== m.due)) main.tasks.set(t.id, { ...m, due: t.due || m.due, status: t.status, pr: t.pr || m.pr, source: branch });
    }
  }
  return { ...p, ...main };
}

const effDue = (t, plan) => t.due || (plan && t.planDates[plan]) || null;
function dueCell(t, plan) {
  if (t.due) return nice(t.due);
  if (plan && t.planDates[plan]) return `${nice(t.planDates[plan])} (Plan ${plan}, not written on the task yet)`;
  if (t.planDates.A || t.planDates.B) return `Not set: A ${t.planDates.A ? nice(t.planDates.A) : "?"} / B ${t.planDates.B ? nice(t.planDates.B) : "?"}`;
  return "Not set";
}
const isLate = (t, plan) => { const d = effDue(t, plan); return d && t.status.rank < 3 && d < today; };
function leftCell(t, plan) {
  const d = effDue(t, plan);
  if (t.status.key === "verified") return "Done";
  if (t.status.key === "submitted") return t.status.date && d && t.status.date > d ? `Submitted ${days(d, t.status.date)} day(s) late` : "Waiting for Sean";
  if (!d) return "Waiting for plan";
  const n = days(today, d);
  return n < 0 ? `**Late by ${-n} day${n === -1 ? "" : "s"}**` : n === 0 ? "**Due today**" : `${n} day${n === 1 ? "" : "s"}`;
}
const statusCell = (s) => (s.key === "returned" ? `Returned${s.reason ? `: ${s.reason}` : ""}` : s.label);
const cell = (v) => String(v ?? "").replace(/\|/g, "/");

const people = PEOPLE.map(readPerson);
let md = `# Progress\n\nGenerated on ${today} by \`npm run progress${USE_BRANCHES ? " -- --branches" : ""}\`, from the task files in \`${SPECS_REL}/\`${USE_BRANCHES ? " on main and on every treasurer/* and secretary/* branch" : ""}. Do not edit this file by hand: it is rebuilt automatically.\n\n`;
md += `Final deadline: Plan A, Mon, Nov 30, 2026. Plan B (soft deadline), before Dec 15, 2026. Details: [timeline.md](SecTreas%20-%20Harness/01_SPECS/timeline.md).\n\n`;
md += `A task is **finished only when Sean has verified it** against the [rubric](SecTreas%20-%20Harness/00_CORE/rubric.md). "Submitted" means the pull request is final and waiting for Sean.\n\n`;
md += `## Summary\n\n| Who | Plan | Verified | Submitted (waiting for Sean) | Tasks left | Late | Next due |\n|---|---|---|---|---|---|---|\n`;
for (const p of people) {
  const all = [...p.tasks.values()];
  const verified = all.filter((t) => t.status.key === "verified").length;
  const submitted = all.filter((t) => t.status.key === "submitted").length;
  const open = all.filter((t) => t.status.rank < 3).sort((a, b) => (effDue(a, p.plan) || "9").localeCompare(effDue(b, p.plan) || "9"));
  const late = open.filter((t) => isLate(t, p.plan)).length;
  const next = open[0];
  md += `| ${p.who} (${p.role}) | ${p.plan ? `Plan ${p.plan} (by ${nice(PLAN_END[p.plan])})` : "Not chosen yet"} | ${verified} of ${all.length} | ${submitted} | ${all.length - verified} | ${late} | ${next ? cell(`${next.id} ${next.title}: ${dueCell(next, p.plan)}`) : "All submitted"} |\n`;
}
for (const p of people) {
  md += `\n## ${p.who} (${p.role})\n\nTask file: [${p.file}](SecTreas%20-%20Harness/01_SPECS/${p.file})\n\n| Task | Title | Due | Status | Days left | Submitted | Verified | From | Pull request | Read from |\n|---|---|---|---|---|---|---|---|---|---|\n`;
  const rows = [...p.tasks.values()].sort((a, b) => (effDue(a, p.plan) || "9").localeCompare(effDue(b, p.plan) || "9") || a.id.localeCompare(b.id, undefined, { numeric: true }));
  for (const t of rows) {
    md += `| ${t.id} | ${cell(t.title)} | ${cell(dueCell(t, p.plan))} | ${cell(statusCell(t.status))} | ${leftCell(t, p.plan)} | ${t.status.key === "submitted" && t.status.date ? nice(t.status.date) : ""} | ${t.status.key === "verified" && t.status.date ? nice(t.status.date) : ""} | ${cell(t.from)} | ${cell(t.pr)} | ${t.source} |\n`;
  }
}
md += `\n## How this file is made\n\n- Each row comes from a task heading (like \`## T1. ...\`) and its \`- Due:\`, \`- Status:\`, \`- From:\` and \`- Pull request:\` lines.\n- A GitHub Action rebuilds it on main every hour and after every merge, reading main and every officer branch ("Read from" shows which). A branch only counts for its own task, and "verified" only counts from main.\n- "Days left" is counted from the day the file was generated, in Manila time.\n`;
writeFileSync(join(root, OUT), md);

// The Action (--write) also refreshes the "Progress" block in README.md, between the PROGRESS markers.
let readmeNote = "";
if (OUT === "PROGRESS.md") {
  const readmePath = join(root, "README.md");
  let readme = ""; try { readme = readFileSync(readmePath, "utf8"); } catch {}
  const START = "<!-- PROGRESS:START -->", END = "<!-- PROGRESS:END -->";
  const a = readme.indexOf(START), b = readme.indexOf(END);
  if (a !== -1 && b > a) {
    const body = md.slice(md.indexOf("## Summary"), md.indexOf("\n## How this file is made")).trim().replace(/^## /gm, "### ");
    const block = `${START}\n_Updated ${today}. A task is finished only when Sean has verified it against the [rubric](SecTreas%20-%20Harness/00_CORE/rubric.md)._\n\n${body}\n${END}`;
    writeFileSync(readmePath, readme.slice(0, a) + block + readme.slice(b + END.length));
    readmeNote = " and README.md";
  }
}
console.log(`${OUT}${readmeNote} written (${people.map((p) => `${p.who}: ${p.tasks.size} tasks`).join(", ")}${USE_BRANCHES ? ", branches read" : ""}).`);
