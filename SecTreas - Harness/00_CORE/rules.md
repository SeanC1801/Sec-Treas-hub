# Rules for Nico, Ian and Claude

Router: [agents.md](agents.md). Back to: [overview.md](../02_CONTEXT/overview.md). Next: [review-questions.md](../02_CONTEXT/review-questions.md).

## Part 1. Seeing the hub

There are two ways to open the hub. Use the first one unless you are testing your own changes.

### A. The live hub (start here)

- Open https://sec-treas-hub.vercel.app/ on desktop and on your phone. No login is needed.
- It shows the latest `main` on GitHub. It does not show changes you have made on your computer but have not merged yet.
- On the sign-in screen, choose "Test Officer" (the default) and press "Continue with Google". Nothing is sent to Google yet; this is a draft.
- Use the Treasurer / Secretary switch at the top of the Events page to see your side.

### B. Localhost (for your own changes)

Use this once you start changing code, because your changes are not on the live hub until Sean merges them.

1. Ask Sean to add your GitHub account as a collaborator on https://github.com/SeanC1801/Sec-Treas-hub.
2. Install Node.js 20 or newer and Git.
3. Type these in your terminal:
   - `git clone https://github.com/SeanC1801/Sec-Treas-hub.git`
   - `cd Sec-Treas-hub`
   - `npm install`
   - `npm run dev`
4. Open http://localhost:5173 on your computer.
5. To open localhost on your phone: type `npm run dev -- --host` instead, then open the "Network" address it prints (like `http://192.168.1.5:5173`) on a phone on the same Wi-Fi.
6. Before you make a pull request, type `npm run build` and make sure it finishes without errors.

## Part 2. Branches, commits and pull requests

Nico and Ian edit some of the same files (`src/hub.js`, `src/hub.css`, `src/styles.css`), so each task gets its own branch.

Order of branches (this avoids merge conflicts):

1. Your review comes first, on its own branch: `treasurer/T0-review` (Nico) or `secretary/S0-review` (Ian). Claude creates it at the very start of your first session, before writing anything (your plan, due dates and new tasks all go there).
2. Open the review's pull request as soon as the review is done, and wait until Sean merges it before starting any other task. The review sets every due date, so other branches made before it is merged will conflict with it.
3. Every other task starts from an up-to-date `main`, on its own branch.
4. Before you open a pull request, and again before pushing a fix to it, bring in the latest `main` with `git pull origin main`. If git reports a conflict, ask Claude to resolve it (keep both sides' lines unless they truly disagree), then commit.

What Claude may do (after asking you first):

- Update `main` and create the branch for a task:
  - `git checkout main`
  - `git pull`
  - `git checkout -b treasurer/T1-tracker-buttons` (Nico) or `git checkout -b secretary/S1-minutes-bar` (Ian)
- Bring the latest `main` into your branch: `git pull origin main`
- Make the code change.

What the AI must never do: commit, push, or open the pull request. It writes the exact commands for you, and you type them yourself. Like this:

1. See what changed: `git status`
2. Add the changed files: `git add src/hub.css "SecTreas - Harness/01_SPECS/treasurer.md" "SecTreas - Harness/04_LOGS"` (Claude lists the exact files: your code, your task file and your task log. Never `PROGRESS.md`.)
3. Commit: `git commit -m "Budget Tracker: make the Open buttons easier to tap"`. The pull request title starts with the task, like "T1: Budget Tracker buttons easier to tap" ([part 13](#part-13-checks-rubric-and-verification)).
4. Push: `git push -u origin treasurer/T1-tracker-buttons`
5. Open the pull request on GitHub:
   - Go to https://github.com/SeanC1801/Sec-Treas-hub
   - Press "Compare & pull request" on your branch
   - Base: `main`. Paste the description the AI wrote for you.
6. The pull request description says:
   - which task it is (like "T1"),
   - what changed,
   - how you checked it on desktop and on phone,
   - desktop and phone screenshots,
   - whether your senior validated it,
   - whether it is final (no flaws or errors on your localhost) or still in progress,
   - the changelog line for Sean (in the format at the end of [changelog.md](../04_LOGS/changelog.md)). Do not edit `changelog.md` itself: Sean adds your line when merging, so Nico's and Ian's pull requests never conflict.

Other rules:

- Branch names: `treasurer/T<number>-<short-name>` for Nico, `secretary/S<number>-<short-name>` for Ian.
- Never push to `main`. It goes live on Vercel straight away.
- Never merge your own pull request. Sean reviews and merges.
- If your branch has conflicts with `main`, ask the AI for the commands to fix them, or ask Sean.

## Part 3. What not to touch

- No backend: no Supabase, servers, databases, sign-in providers or API keys. Sean leads the backend and its security ([timeline.md](../01_SPECS/timeline.md)). Only work on it if Sean gives you a backend task there, and follow Sean's instructions.
- No real data. Use sample receipts, sample invoice numbers and sample amounts only. No real purchases, phone numbers, student numbers or ID photos in the code.
- Do not change document formats (letterhead, page sizes, Arial on documents, the approval chain Draft → President → Adviser → CSC Treasurer → CSC) without your senior's and Sean's yes.
- Do not add a new library or package without asking Sean first.
- Keep the design rules: sky background, paper cards, glass only on controls, Montserrat for the app, status always written in words (never colour alone), buttons at least 44 px to tap.
- Stay in your own files unless your task says otherwise:
  - Nico (Treasurer): `src/prototype.js`.
  - Ian (Secretary): `src/minutes.js`, `src/minutes.css`, `src/certs.js`, `src/certs.css`.
  - Shared, change carefully: `src/hub.js`, `src/hub.css`, `src/styles.css`, `index.html`.

## Part 4. How the AI talks to you

1. First it asks: "Are you Nico (Treasurer) or Ian (Secretary)?" If it is anyone else, it stops and asks them to talk to Sean.
2. It asks one question at a time and waits for your answer.
3. Every question is short and simple, and comes with an example answer, like:
   - "Is any button hard to press on your phone? Like: 'the Open button in Budget Tracker is too small.'"
4. When you ask the AI something, it answers in simple words and gives an example too, like:
   - You: "What is a branch?" AI: "A separate copy of the code for one task, like a draft folder, so your work does not mix with Ian's."
5. It asks before every step: before the plan, before creating the branch, and before changing files.
6. It never commits, pushes or opens the pull request. It gives you the commands to type (part 2).
7. If anything is unclear, it asks. It does not guess.

## Part 5. Validation from your senior

So the org knows what is changing, ask your senior before some steps:

- Nico asks Alexis (senior Treasurer). Ian asks Trizy (senior Secretary).
- Ask your senior:
  1. Before starting a task that changes what a document says or looks like (like the PDF and Word downloads, or wording on a printout).
  2. Before you mark a pull request as final.
- The AI reminds you and writes a short message you can send, like:
  - "Hi Alexis, I'm working on T3: downloading the Budget Request as PDF. It will look the same as the printout. Is that okay with you?"
- Write your senior's answer in the pull request (like "Validated by Alexis on Nov 22").
- If your senior says no or wants changes, tell the AI and add it to your task file.

## Part 6. Your guardrails

Before your first task, the AI asks: "Would you like to add guardrails to your work? Like: 'never delete a file', 'only touch my own files', 'show me every change before saving it'."

- Your answers go in "My guardrails" at the top of your task file, so the AI follows them every time.
- Examples you can pick from:
  - Never delete a file.
  - Only change files in my section (part 3).
  - Show me each change before saving it.
  - Ask me before installing anything.
  - Stop and ask if a task needs more than 3 files.
  - Remind me to ask my senior before any change to a document.
- You can add, change or remove guardrails at any time. Just tell the AI.

## Part 7. How to check your change

Check every task on both sizes, on localhost:

1. Desktop: a browser window at least 1280 px wide.
2. Phone: the browser's device mode at 375 px wide (in Chrome: right-click, Inspect, then the phone icon), and on your real phone if you can (part 1B, step 5).
3. On both sizes, check:
   - every button you touched can be seen and pressed, and nothing covers it,
   - nothing runs off the right edge of the screen,
   - the bottom bar (Continue, Print) stays at the bottom while you scroll,
   - the last field on the page can be scrolled above the bottom bar,
   - the browser console (F12, Console) shows no red errors.
4. Take a desktop screenshot and a phone screenshot for the pull request.

## Part 8. Updating Sean

Every time you open a pull request, tell Sean in two places:

1. A comment on the pull request that mentions Sean (@SeanC1801), like:
   - "@SeanC1801 T1 is ready. Final: yes, no flaws or errors on my localhost (desktop and phone). Validated by Alexis."
   - or: "@SeanC1801 T1 is ready for a look. Final: not yet. Still to do: the button looks small on my phone."
2. A short direct message to Sean with the link, like:
   - "Hi Sean, I opened the PR for T1 (Budget Tracker buttons): <link>. It's final, no flaws or errors on my localhost."

"Final" means: you checked it on localhost on desktop and phone, you found no flaws or errors, and your senior validated it if the task needed it. The AI writes both messages for you; you send them.

## Part 9. Templates for your documents

The hub makes each document from a template. If you use a template the hub does not match yet, the hub has to change, so tell the AI.

1. The AI asks about your templates during the review ([review-questions.md](../02_CONTEXT/review-questions.md), step 6).
2. Each template is written under "My templates" in your task file with:
   - its name (like "CSC Budget Request form"),
   - which document it makes,
   - where it is (a Google Drive link, a file, or "printed copy with Alexis"),
   - which version it is, and who gave it to you,
   - what is different from what the hub prints now.
3. Check with your senior that it is the newest version (Alexis for Nico, Trizy for Ian).
4. If a template file needs to go into the code:
   - use a blank copy: remove real names, amounts, receipts, signatures and student numbers first,
   - put it in `docs/templates/treasurer/` (Nico) or `docs/templates/secretary/` (Ian),
   - ask Sean before adding it, because the repository holds the chapter's documents.
5. Never paste a filled document with real data into the code or into the AI chat. Describe it, or use a blank copy.
6. Every difference between your template and the hub becomes a task in your task file. Ask your senior before changing how a document looks ([rules.md](rules.md), part 5).

## Part 10. Logging your work (so nothing is guessed)

Every task is written down from the first look to the final pull request. This keeps a true record, so you, Sean and Claude can see what really happened.

1. Before each session, the AI reads [changelog.md](../04_LOGS/changelog.md) and the task's log in `04_LOGS/tasks/`.
2. When a task starts, the AI copies [_TEMPLATE.md](../04_LOGS/tasks/_TEMPLATE.md) to `04_LOGS/tasks/<branch name>.md` (like `T1-tracker-buttons.md`).
3. The AI fills in each part as it happens:
   1. Initial: how it looks before any change, with proof (a file and line, or the screen and size).
   2. Plan: what will change, and your yes.
   3. Senior check: what you asked your senior, and their answer.
   4. Changes: one line per change, with the file and why.
   5. Checks: desktop, phone, console, `npm run build`, and anything not checked.
   6. Commands: the git commands it gave you to type.
   7. Final: the pull request link, whether it is final, and whether Sean was told.
4. When you open the pull request, Claude writes the changelog line (format at the end of [changelog.md](../04_LOGS/changelog.md)) into the pull request description. The task log goes in the pull request; `changelog.md` itself is Sean's, and the harness check blocks edits to it.
5. Rules for what goes in a log:
   - Only what was seen or said: give the file path, the command output, the screen and size, or quote the person.
   - If something was not checked, write "not checked". Never write "works" without checking.
   - Never invent results, approvals, links or data.
   - If you are blocked or unsure, write it in [blocked.md](../03_TRACKING/blocked.md) and stop.
6. New surprises in the code go in [learnings.md](../03_TRACKING/learnings.md). New decisions from Sean go in [decisions.md](../03_TRACKING/decisions.md).

## Part 11. Deadlines

You choose your deadline plan once, at the start. The dates are in [timeline.md](../01_SPECS/timeline.md).

1. Claude asks once: "Can you finish all your tasks by Monday, November 30 (Plan A), or will you follow the soft deadline and finish before December 15 (Plan B)?"
2. Claude writes your answer at the top of your task file ("Deadline plan: A" or "B", with the date you chose), then writes each task's due date from the timeline on the task, like `- Due: 2026-11-26 (Thursday, Plan A)`.
3. Every task you add during the review gets a due date from your plan:
   - Plan A: urgent bugs Fri, Nov 27; everything else Sun, Nov 29.
   - Plan B: urgent bugs Mon, Nov 30; everything else Thu, Dec 10.
   - Claude suggests the date, you confirm it.
4. At the start of every session, Claude shows you all your tasks in a table (task, title, due date, status, days left), taken from `npm run progress`, then says which one is due next.
5. "Due" means the pull request is open and marked final. Write the due date and the date it was done in the task log and in the changelog line of the pull request description.
6. If a task will be late, tell Sean that day and write it in [blocked.md](../03_TRACKING/blocked.md) with the new date you can make. Do not move a due date without telling Sean. You may switch from Plan A to Plan B once, after telling Sean.

## Part 12. The progress file (PROGRESS.md)

Sean follows your progress in one file at the top of the repository: [PROGRESS.md](../../PROGRESS.md). It shows every task: who, due date, status, days left, when it was submitted and verified, the pull request, and where the status was read from.

1. You never edit or commit `PROGRESS.md`. A GitHub Action rebuilds it on `main` every hour and after every merge. It reads your task file on `main` and on your branches, so your progress shows within the hour, even before Sean merges.
2. What you do keep up to date is your task file. Each task has these lines, and Claude updates them:
   - `- Due: YYYY-MM-DD (<weekday>, Plan A or B)`, or "not set yet" until you choose a plan,
   - `- Status:` one of
     - `not started`
     - `in progress` (from your first change on the task's branch)
     - `submitted YYYY-MM-DD` (the pull request is final: no flaws or errors on your localhost)
     - `returned YYYY-MM-DD: <reason>` (written by Sean: fix it and submit again)
     - `verified YYYY-MM-DD` (written only by Sean, after the rubric)
   - `- From: Sean's starting list`, `senior's suggestion`, or `your review`,
   - `- Pull request: <link>` once you open one.
3. Claude updates those lines when you choose your plan, when a task is added, when it starts, when it is submitted, when it is returned, and when a date changes. They go into your next commit on the task's branch. Push your branch right after a status change (Claude gives you the commands), because Sean only sees what is pushed.
4. Your branch only counts for its own task: `treasurer/T1-...` updates T1. New tasks from your review (on your T0 or S0 branch) show up too.
5. To preview the table on your computer, Claude can run `npm run progress`. It writes `PROGRESS.preview.md`, which git ignores, so it can never end up in a commit.
6. If the table looks wrong, the task files are right. Tell Sean; do not edit `PROGRESS.md`.

## Part 13. Checks, rubric and verification

Sean checks that your progress is real. Two things do this.

### The automatic harness check (on every pull request)

It runs from `main`, so it cannot be changed by a pull request. It marks your pull request red, and blocks the merge, if:

1. `PROGRESS.md` is changed.
2. `.github/`, `scripts/`, `.gitignore`, the rubric or `changelog.md` is changed (only Sean may).
3. A task is set to "verified" (only Sean may).
4. The branch is not named `treasurer/T<n>-...` or `secretary/S<n>-...`, or the pull request title does not include the task number.
5. You changed the other officer's task file.
6. Your task's status is still "not started" (the status was skipped).
7. Your task says "submitted" without a date, without the pull request link, without a task log in `04_LOGS/tasks/`, or with the log's Checks part (desktop, phone, build) not filled in.
8. A due date changed without an entry for that task in [blocked.md](../03_TRACKING/blocked.md).

The check's summary says what to fix in plain words. Ask Claude to fix it, then push again.

### The rubric (Sean, before a task counts as finished)

- When the check is green, Sean goes through the 8 checks in [rubric.md](rubric.md): done, desktop and phone, builds cleanly, logged, senior check, stayed in scope, safe data, on time.
- All pass: Sean merges and sets "verified" on `main`. Only then does [PROGRESS.md](../../PROGRESS.md) count the task as finished.
- Any fail: Sean sets "returned" with the reason on your branch. Fix it, then set "submitted" again.
- Before submitting, tick the rubric in your pull request yourself, but only what is true. Never tick something you did not check.
