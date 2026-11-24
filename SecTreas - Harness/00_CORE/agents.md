# Instructions and routing for Claude Code

Read this file first. It says who you are helping, what to read, and when.

This is the SecTreas Hub (https://github.com/SeanC1801/Sec-Treas-hub), the AUF-ACM Student Chapter's web app for Treasurer and Secretary documents. Live hub: https://sec-treas-hub.vercel.app/. Project lead: Sean Caling (GitHub: SeanC1801).

Only two people work on the hub: Nico (Treasurer) and Ian (Secretary). Ask first: "Are you Nico (Treasurer) or Ian (Secretary)?" If it is anyone else, ask them to talk to Sean and stop.

## Routing table: what to read, and when

All paths are inside `SecTreas - Harness/`.

### 00_CORE: how to work

- [`00_CORE/agents.md`](agents.md): this file. Read first, every session.
- [`00_CORE/rules.md`](rules.md): setup, branches, the git commands the person types, limits, seniors, guardrails, testing, updating Sean, templates, and logging. Read every session, before any change.

### 01_SPECS: what to build

- [`01_SPECS/treasurer.md`](../01_SPECS/treasurer.md): Nico's tasks (T0 to T4, then "Your own tasks"), plus "My guardrails" and "My templates". Read when helping Nico.
- [`01_SPECS/timeline.md`](../01_SPECS/timeline.md): every deadline, from the review to the November 30 launch, including the database and security work. Read every session.
- [`PROGRESS.md`](../../PROGRESS.md) (repo root): Sean's progress table, rebuilt by a GitHub Action from the task files on main and on the officers' branches. Never edit or commit it.
- [`00_CORE/rubric.md`](rubric.md): the 8 pass/fail checks Sean uses before setting a task to "verified". Read before submitting a task.
- [`02_CONTEXT/github-setup.md`](../02_CONTEXT/github-setup.md): Sean's one-time GitHub setup (branch rules, token). Not for Nico and Ian.
- [`01_SPECS/secretary.md`](../01_SPECS/secretary.md): Ian's tasks (S0 to S4, then "Your own tasks"), plus "My guardrails" and "My templates". Read when helping Ian.

### 02_CONTEXT: facts about the hub and the people

- [`02_CONTEXT/overview.md`](../02_CONTEXT/overview.md): who is who, links, and the order of work. Read every session.
- [`02_CONTEXT/hub-map.md`](../02_CONTEXT/hub-map.md): how the code is laid out, where data is saved, page sizes, the status chain. Read before changing any code. Trust the code over this file if they disagree, and note the difference in [`03_TRACKING/learnings.md`](../03_TRACKING/learnings.md).
- [`02_CONTEXT/backend-proposal.md`](../02_CONTEXT/backend-proposal.md): the proposed database and security design (Supabase, for all of CCS). A proposal, not a decision. Read before any backend work.
- [`02_CONTEXT/review-questions.md`](../02_CONTEXT/review-questions.md): the questions to ask before any work. Read at the start of the first session, and whenever the person wants a new review.

### 03_TRACKING: what is known

- [`03_TRACKING/findings.md`](../03_TRACKING/findings.md): the November 20, 2026 check of the hub and the bugs found. Read before fixing a bug.
- [`03_TRACKING/decisions.md`](../03_TRACKING/decisions.md): decisions Sean has already made. Read before suggesting a change to how the hub works. Never reverse one without asking Sean.
- [`03_TRACKING/learnings.md`](../03_TRACKING/learnings.md): surprises and pitfalls found in the code. Read when something behaves strangely. Add to it when you find a new one.
- [`03_TRACKING/blocked.md`](../03_TRACKING/blocked.md): the handbrake. If you are blocked (no access, a senior has not answered, a template is missing, you are unsure), write it here and stop. Never invent data or answers.

### 04_LOGS: what has happened

- [`04_LOGS/changelog.md`](../04_LOGS/changelog.md): the history of the hub from the first commit to now. Read every session so you start from facts, not guesses.
- [`04_LOGS/tasks/`](../04_LOGS/tasks/): one log file per task, from the first look to the final pull request. Read the task's log before continuing it. Create one when a task starts, from [`04_LOGS/tasks/_TEMPLATE.md`](../04_LOGS/tasks/_TEMPLATE.md).

## Steps, every session

1. Ask: "Are you Nico (Treasurer) or Ian (Secretary)?"
2. Read [`00_CORE/rules.md`](rules.md), [`02_CONTEXT/overview.md`](../02_CONTEXT/overview.md), [`01_SPECS/timeline.md`](../01_SPECS/timeline.md), [`04_LOGS/changelog.md`](../04_LOGS/changelog.md), and their task file in `01_SPECS/`. Then show their whole task list: run `npm run progress` (it writes `PROGRESS.preview.md`, which git ignores) and show their own section from it as a table (Task, Title, Due, Status, Days left), copied exactly, with late tasks first if any. Then say which task is due next and how many days are left.
3. First session only: create the review branch (`treasurer/T0-review` or `secretary/S0-review`) before writing anything, then ask the questions in [`02_CONTEXT/review-questions.md`](../02_CONTEXT/review-questions.md) one at a time, in simple words, each with a "Like:" example. Have them list every flaw and error in their section, on computer and phone. Ask about their templates, guardrails, and anything they want to add. Give every new task a due date (rules.md, part 11).
4. Ask which task to work on. If its log in [`04_LOGS/tasks/`](../04_LOGS/tasks/) exists, read it and continue from where it stopped. If not, create it.
5. Remind them to ask their senior (Alexis for Nico, Trizy for Ian) before changing what a document says or looks like.
6. Work one task at a time on its own branch. Update the task log after every step ([`00_CORE/rules.md`](rules.md), part 10).
7. Never commit, push or open a pull request yourself. Give them the exact commands to type. Keep the task file's Due, Status, From and Pull request lines current; never edit or commit `PROGRESS.md` (`00_CORE/rules.md`, part 12). Never set "verified"; set "submitted YYYY-MM-DD" when the task is final, and remind them the harness check must be green and Sean checks the rubric (`00_CORE/rules.md`, part 13).
8. After the pull request, write the two updates for Sean (a pull request comment and a direct message), saying whether it is final. Write the changelog line into the pull request description (they never edit [`04_LOGS/changelog.md`](../04_LOGS/changelog.md).

## Never guess

- Write only what you saw: in a file (give the path), in a command's output, on screen (say which screen and size), or in the person's own words (quote them).
- If you did not check something, write "not checked". If you do not know, ask, or write it in [`03_TRACKING/blocked.md`](../03_TRACKING/blocked.md) and stop.
- Never invent test results, file contents, receipts, names or approvals.

## Claude Code

- The repo's [`CLAUDE.md`](../../CLAUDE.md) points every Claude Code session here automatically.
- The skills live in the repo at `.claude/skills/` and work as soon as the repo is open in Claude Code, with no install:
  - [`/treasurer-handoff`](../../.claude/skills/treasurer-handoff/SKILL.md) for Nico.
  - [`/secretary-handoff`](../../.claude/skills/secretary-handoff/SKILL.md) for Ian.
