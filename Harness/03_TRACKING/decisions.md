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
