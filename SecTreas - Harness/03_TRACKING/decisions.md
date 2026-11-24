# Decisions already made

Back to: [agents.md](../00_CORE/agents.md). These were decided by Sean (the project lead). Do not reverse one without asking Sean. If a new decision is made, add it at the bottom with the date and who decided.

## Product and documents

- Two sides: Treasurer (Budget Requests, Liquidation Reports, Budget Tracker) and Secretary (Minutes, Certificates). By 2026-11-04.
- Documents print in Arial. Budget Request and Liquidation Report on Long bond (8.5 × 13 in). Minutes on Letter (8.5 × 11 in). Certificates on A4 landscape. By 2026-11-04.
- Approval chain: Draft → President (signs) → Adviser (notes) → CSC Treasurer (receives) → CSC (approves). The President and Adviser approve in the hub; the Treasurer records the CSC stages. By 2026-11-04.
- "Prepared by" prints the officer who prepared the document. 2026-11-04.
- A liquidation report is due the day after the event. A budget request's due date is set by hand per event. 2026-11-06.
- The design stays: sky background, paper cards, glass only on controls, Montserrat in the app, status always in words, no purple, 44 px tap targets. By 2026-11-04.

## Screens

- Home was removed. Events is the first page; each event's tool rows start or open its drafts. 2026-11-07.
- Events has a Grid view (default, remembered per person) and a List view. Grid cards open an event page with an optional background photo. 2026-11-07.
- The Budget Tracker follows the layout of the chapter's "Breakdown of Expenses" sheet and is for the Treasurer only. 2026-11-09.
- The draft sign-in's default profile is "Test Officer", so test printouts never carry a real officer's name. 2026-11-09.
- Receipts in the app are sample data, never the real purchases from the sheet. 2026-11-09.
- Event cards use a calm hover: a slightly deeper shadow and a 2 px lift, nothing more. 2026-11-09.
- The sidebar has no search; the Events search box is the one search (Ctrl or ⌘ K jumps to it). 2026-11-09.

## Backend

- The backend will use Supabase, with Google sign-in for @auf.edu.ph accounts. It is built only after both the Treasurer and Secretary sides are done. Sean designs the backend and its security. 2026-11 (before 2026-11-06).
- Until then, everything is saved in the browser of the device in use.

## Handoff

- Only Nico (Treasurer) and Ian (Secretary) work on the hub in this round. Their seniors validate: Alexis for Nico, Trizy for Ian. 2026-11-20.
- One branch per task and a pull request into `main`. Sean reviews and merges. 2026-11-20.
- The AI may create branches and pull `main`; it never commits, pushes or opens a pull request. The officer types those commands. 2026-11-20.
- After each pull request, the officer tells Sean in a pull request comment and a direct message, saying whether it is final. 2026-11-20.
- Template files go into the code only as blank copies, and only after asking Sean. 2026-11-20.
- Original deadline: everything, including the database and security, by Monday, November 30, 2026 (2026-11-20). Updated on 2026-11-24: Plan A or Plan B per person, and backend dates set by Sean after planning with the seniors.
- Progress is tracked in `PROGRESS.md` at the repo root. A GitHub Action rebuilds it on main hourly and after merges, reading main and every officer branch; officers never commit it. Commit messages stay plain. 2026-11-24 (replaces the commit-message rule of 2026-11-20).
- Each of Nico and Ian chooses once: Plan A (everything by Mon, Nov 30) or Plan B (soft deadline, before Dec 15). 2026-11-24.
- The seniors' suggestions (Nov 24) are tasks T5 to T9 (Nico) and S5 to S9 (Ian). Email to the President and access settings are built as screens now and connected to the backend later. 2026-11-24.
- Deploying to the whole campus is a long-term goal, not this round. The hub stays ACM-only for now. 2026-11-24.
- The repository stays public (the old receipts in git history and officer names are acceptable). Public means branch rules and checks are free. 2026-11-24.
- A task is finished only when Sean verifies it against the 8-point pass/fail rubric (`00_CORE/rubric.md`). Officers set "submitted"; only Sean sets "verified" or "returned". 2026-11-24.
- Every pull request into main must pass the harness check (`.github/workflows/harness-check.yml`), which runs from main so it cannot be bypassed. 2026-11-24.
