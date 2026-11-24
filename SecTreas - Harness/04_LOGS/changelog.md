# Changelog: from the first build to now

Back to: [agents.md](../00_CORE/agents.md). Oldest first. Each entry is taken from the git history (`git log`) and checked against what the commit changed. Add new entries at the bottom, using the format at the end of this file.

How to check any entry yourself: `git show <commit> --stat`.

## November 4, 2026: first build

- 9790c8a: Added the design prototype and the design documents (`docs/design/`).
- bb59f9d: README states what the repository is for.
- 0c77ccc: Set up the Vite app from the v8 prototype, without the design review bar.
- ff09b2d: Treasurer drafts are saved on the device (browser storage).
- e3343ad: Added the hub shell: sign-in, Home, Tools, Library, Profile, and the approval path panel.
- 23f195a: Drafted the Secretary's Minutes flow on Letter paper.
- 2ea11a8: Drafted the Secretary's Certificates flow.
- 5a0fb18: Two officers per role, "Prepared by" prints the preparer, and the chapter logos.
- e7c0741: Home shows each role's tools; Library opens on Recents, grouped by month.
- a80b7e8: Liquidation: optional Proof step with winner IDs and photo pages.
- f01cfc6: Phone polish: the bottom bar fits, 44 px tap targets, room for the keyboard.

## November 5, 2026: Events

- f65080b: Events page: every activity with all of its documents.
- edcf4cd: Library merged into Events; chapter-blue month bands.
- 41c0705: Home became the welcome and guide page; coloured section bands.
- e3e8fed: "To do" band in ACM cyan from the letterhead.
- b55dfba: Home uses one blue for both roles; sections open and close from their headings.

## November 6, 2026: Home plan and sidebar

- b252538: Home rebuilt to the agreed plan (`docs/design/HOME_PLAN_2026-11.md`, section 9).
- 00eb4d6: Removed the team section and privacy note from the README.
- d413331 ("Updated version"): the sidebar (with a phone drawer and scrim) replaced the top bar and bottom tabs; Home got a two-column layout on desktop.
- 971f45f ("Updated"): "+ Create New" in the sidebar, collapsible sidebar, sidebar search, Templates and guides page, Home filters and foldable groups with status bars, and liquidation drafts that can start before the budget is approved.

## November 7, 2026: Events becomes the main page

- 33c3951 ("Updated version"): Home and "+ Create New" removed; Events is the first page and each event's tool rows start or open drafts. Minutes and certificates use the local date (no more one-day shift). Loading no longer crashes if a saved report is missing.
- 3fcf3f2 ("Update view lists"): Events Grid and List views, the event page with a background photo, the one-bar toolbar with the View menu, and calendar date tiles on cards.

## November 9, 2026: Budget Tracker, Test Officer, sample data

- 64ea6e8: Budget Tracker page in the layout of the chapter's sheet (Treasurer only), "Test Officer" as the default profile, and the main content centred beside the sidebar.
- fbd4dcc: Event cards lift on hover; sidebar search removed; the real receipts replaced with sample receipts in the app and in the archived prototypes.
- 0037e97: Calmer card hover (a 2 px lift and a deeper shadow); date text always fits inside the calendar tile.

## November 20, 2026: check and handoff

- Checked every screen on desktop and phone. Results in [findings.md](../03_TRACKING/findings.md).
- 0568bc9: Added the `Harness/` folder: the handoff for Nico and Ian, with tasks, rules, review questions, decisions, learnings, and these logs.
- (next commit): the folder was renamed from `Harness/` to `SecTreas - Harness/`, and every path now uses the new name; deadlines added (`01_SPECS/timeline.md`, a due date on every task). Every harness file links back to `agents.md`; the skills moved to `.claude/skills/` so they work with no install; `CLAUDE.md` added at the repo root (replacing `AGENTS.md`); START-HERE simplified for Claude Code.

## November 24, 2026: progress file, deadline plans, seniors' suggestions (not committed yet when written)

- `PROGRESS.md` at the repo root, made by `npm run progress` (`scripts/progress.mjs`) from the task files. Replaces putting the due date in commit messages.
- Deadline plans: Plan A (everything by Mon, Nov 30) or Plan B (before Dec 15), chosen once by Nico and by Ian ([timeline.md](../01_SPECS/timeline.md)).
- The seniors' suggestions became tasks T5 to T9 (Nico) and S5 to S9 (Ian). Own tasks from the review now start at T10 and S10.
- `AGENTS.md` (for Codex) points to `.agents/skills/`.
- Progress Action and harness check: `.github/workflows/progress.yml` rebuilds `PROGRESS.md` on main from main and every officer branch; `.github/workflows/harness-check.yml` checks every pull request (status not skipped, proof before "submitted", no hand edits, dates not moved silently). Rubric: [rubric.md](../00_CORE/rubric.md). Sean's setup: [github-setup.md](../02_CONTEXT/github-setup.md).
- Backend proposal for the seniors: [backend-proposal.md](../02_CONTEXT/backend-proposal.md) (Supabase free tier, built for all of CCS). Not decided yet.

---

## Format for new entries

Add one entry per pull request when it is opened, and update it when Sean merges it.

```
## <date>: <task number> <short title> (<Nico or Ian>)

- Branch: treasurer/T1-tracker-buttons
- Pull request: <link>
- What changed: <one or two lines, in plain words>
- Files: <list>
- Checked on: desktop <yes/no>, phone <yes/no>, build <passed/failed>
- Senior validation: <name and date, or "not needed">
- Due: <date> / Done: <date>
- Final: <yes, no flaws or errors on localhost / no, still to do: ...>
- Merged by Sean: <commit, date> (filled in after the merge)
- Task log: 04_LOGS/tasks/<file>.md
```
