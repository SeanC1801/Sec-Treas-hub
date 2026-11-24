// Checks an officer's pull request against the harness rules, so the progress status cannot be skipped.
// The GitHub Action runs this file from MAIN (pull_request_target) and only READS the pull request's
// files with git. It never runs code from the pull request, so a pull request cannot change these rules.
//
// Env: BASE_REF (like origin/main), PR_REF (the pull request head), BRANCH, AUTHOR (GitHub login), TITLE.
// Exit 1 with plain-language fixes when a rule fails.
import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { parseTaskFile } from "./lib/tasks.mjs";

const LEAD = "SeanC1801"; // the project lead: the only one who may write "verified" or change the rules
const SPECS = "SecTreas - Harness/01_SPECS";
const LOGS = "SecTreas - Harness/04_LOGS/tasks";
const BLOCKED = "SecTreas - Harness/03_TRACKING/blocked.md";
const ROLES = { treasurer: { file: "treasurer.md", letter: "T", other: "secretary.md" }, secretary: { file: "secretary.md", letter: "S", other: "treasurer.md" } };

const { BASE_REF = "origin/main", PR_REF = "HEAD", BRANCH = "", AUTHOR = "", TITLE = "" } = process.env;
const git = (...a) => execFileSync("git", a, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
const show = (ref, path) => { try { return git("show", `${ref}:${path}`); } catch { return null; } };
const base = git("merge-base", BASE_REF, PR_REF).trim();
const changed = git("diff", "--name-only", base, PR_REF).split("\n").filter(Boolean);
const added = (path) => git("diff", "-U0", base, PR_REF, "--", path).split("\n").filter((l) => l.startsWith("+") && !l.startsWith("+++")).map((l) => l.slice(1));

const fails = [];
const fail = (rule, msg, fix) => fails.push({ rule, msg, fix });
const isLead = AUTHOR === LEAD;

// Rule 1. PROGRESS.md is built by the Action on main. Nobody edits it in a pull request.
if (changed.includes("PROGRESS.md"))
  fail("PROGRESS.md edited", "This pull request changes PROGRESS.md.", "Remove PROGRESS.md from your commits (`git checkout origin/main -- PROGRESS.md`, then commit). The Action rebuilds it on main by itself.");

// Rule 2. The rules and the Action belong to Sean.
const SEAN_ONLY = ["SecTreas - Harness/00_CORE/rubric.md", "SecTreas - Harness/04_LOGS/changelog.md", ".gitignore", "README.md"];
const ruleFiles = changed.filter((f) => f.startsWith(".github/") || f.startsWith("scripts/") || SEAN_ONLY.includes(f));
if (ruleFiles.length && !isLead)
  fail("Sean's files changed", `Only Sean may change: ${ruleFiles.join(", ")}.`, "Undo those changes (`git checkout origin/main -- <file>`, then commit). For the changelog, put your entry in the pull request description instead; Sean adds it when merging.");

// Rule 3. "verified" is written only by Sean.
for (const f of Object.values(ROLES)) {
  if (!isLead && added(`${SPECS}/${f.file}`).some((l) => /^- Status:\s*verified/i.test(l)))
    fail("Verified by someone else", `A task in ${f.file} was set to "verified".`, 'Only Sean sets "verified" after checking the rubric. Set it to "submitted YYYY-MM-DD" instead.');
}

if (!isLead) {
  // Rule 4. Branch name and title tell which task this is.
  const m = BRANCH.match(/^(treasurer|secretary)\/([TS]\d+)-/);
  if (!m || m[2][0] !== ROLES[m[1]].letter) {
    fail("Branch name", `The branch "${BRANCH}" does not name a task.`, "Name it treasurer/T<number>-<short-name> (Nico) or secretary/S<number>-<short-name> (Ian).");
  } else {
    const [, role, id] = m; const r = ROLES[role];
    if (!new RegExp(`\\b${id}\\b`).test(TITLE)) fail("Pull request title", `The title does not include ${id}.`, `Start the title with the task, like "${id}: <what changed>".`);

    // Rule 5. Stay in your own task file.
    if (changed.includes(`${SPECS}/${r.other}`)) fail("Other person's task file", `This pull request changes ${r.other}.`, `Only change your own task file (${r.file}). Ask Sean if the other one needs a change.`);

    // Rule 6. The status cannot be skipped.
    const head = parseTaskFile(show(PR_REF, `${SPECS}/${r.file}`) || "");
    const t = head.tasks.get(id);
    const codeChanged = changed.some((f) => f.startsWith("src/") || f.startsWith("public/") || f === "index.html");
    if (!t) fail("Task missing", `${id} is not in ${r.file}.`, `Add ${id} to ${r.file} (Claude does this when a task is added).`);
    else if (t.status.key === "none")
      fail("Status skipped", `${id} is "${t.status.label}"${codeChanged ? " but the code changed" : ""}.`, `Set "- Status: in progress" while working, and "- Status: submitted YYYY-MM-DD" when it is final.`);

    // Rule 7. "submitted" needs proof.
    if (t && t.status.key === "submitted") {
      if (!t.status.date) fail("Submitted without a date", `${id} says submitted with no date.`, 'Write it as "- Status: submitted YYYY-MM-DD".');
      if (!/^https:\/\/github\.com\/SeanC1801\/Sec-Treas-hub\/pull\/\d+/.test(t.pr)) fail("No pull request link", `${id} has no "- Pull request:" line with this pull request's link.`, "Add `- Pull request: https://github.com/SeanC1801/Sec-Treas-hub/pull/<number>` under the task.");
      const logs = git("ls-tree", "--name-only", PR_REF, `${LOGS}/`).split("\n").filter((p) => new RegExp(`/${id}-[^/]+\\.md$`).test(p));
      if (!logs.length) fail("No task log", `There is no task log for ${id} in 04_LOGS/tasks/.`, `Copy _TEMPLATE.md to 04_LOGS/tasks/${id}-<short-name>.md and fill it in.`);
      else {
        const log = show(PR_REF, logs[0]) || "";
        const checks = (log.split(/^## 5\. Checks/m)[1] || "").split(/^## 6\./m)[0];
        const empty = ["Desktop", "Phone", "`npm run build`"].filter((k) => { const l = checks.split("\n").find((x) => x.includes(k)) || ""; return !l || /<[^>]+>/.test(l); });
        if (empty.length) fail("Checks not filled in", `The task log's part 5 (Checks) is not filled in for: ${empty.join(", ")}.`, "Write what was checked and the result (passed or failed: what). Never write a result you did not see.");
      }
    }
  }

  // Rule 8. Due dates do not move silently.
  for (const r of Object.values(ROLES)) {
    const before = parseTaskFile(show(base, `${SPECS}/${r.file}`) || "").tasks;
    const after = parseTaskFile(show(PR_REF, `${SPECS}/${r.file}`) || "").tasks;
    const blockedAdded = added(BLOCKED).join("\n");
    for (const [id, a] of after) {
      const b = before.get(id);
      if (b && b.due && a.due && b.due !== a.due && !new RegExp(`\\b${id}\\b`).test(blockedAdded))
        fail("Due date moved", `${id}'s due date changed from ${b.due} to ${a.due} without a note in blocked.md.`, `Add an entry for ${id} to blocked.md (why, and the new date Sean agreed), or put the date back.`);
    }
  }
}

const out = fails.length
  ? `## Harness check: ${fails.length} problem${fails.length > 1 ? "s" : ""}\n\n` + fails.map((f, i) => `${i + 1}. **${f.rule}.** ${f.msg}\n   - Fix: ${f.fix}`).join("\n") + "\n\nAsk Claude to fix these, then push again. Rules: SecTreas - Harness/00_CORE/rules.md, part 13.\n"
  : `## Harness check: passed\n\nSean still checks the work against the rubric (SecTreas - Harness/00_CORE/rubric.md) before setting it to "verified".\n`;
console.log(out);
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, out);
process.exit(fails.length ? 1 : 0);
