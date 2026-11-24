# Secretary tasks

For: Ian (Ian Patrick Flores). Senior who validates: Trizy (Trizy Gabriel N. Nicdao).

Deadline plan: not chosen yet. Claude asks Ian at the start: Plan A (everything by Mon, Nov 30) or Plan B (everything before Dec 15). See [timeline.md](timeline.md).

Router: [agents.md](../00_CORE/agents.md). Deadlines: [timeline.md](timeline.md). Back to: [overview.md](../02_CONTEXT/overview.md). Read first: [rules.md](../00_CORE/rules.md) and [review-questions.md](../02_CONTEXT/review-questions.md). Bug details: [findings.md](../03_TRACKING/findings.md). The Treasurer list is in [treasurer.md](treasurer.md).

- Live hub: https://sec-treas-hub.vercel.app/ (shows `main`; use localhost for your own changes).
- Repository: https://github.com/SeanC1801/Sec-Treas-hub
- Branches: one per task, named `secretary/S<number>-<short-name>`. You type commit, push and the pull request yourself; Sean reviews and merges.

## My guardrails

Added by the AI from your answer in [review-questions.md](../02_CONTEXT/review-questions.md), step 8. The AI follows these every time.

- (none yet)

## My templates

Templates the hub follows now (from Sean). Compare them with yours during the review ([review-questions.md](../02_CONTEXT/review-questions.md), step 6):

- Minutes: the chapter's minutes of the September 11, 2026 meeting (`091126.docx`), on Letter (8.5 × 11 in), on the chapter letterhead: details, attendance, notes by topic, action items.
- Certificates: "Certificate Facilitators GA" (PDF), A4 landscape, on the certificate background (`public/assets/cert-bg.jpg`), with two signatories.

Your templates, added by the AI from your answers ([rules.md](../00_CORE/rules.md), part 9). For each: name, which document it makes, where it is, version and who gave it, and what is different from the hub.

- (none yet)

## Your side of the hub

- Minutes: `src/minutes.js` and `src/minutes.css`. Prints on Letter (8.5 × 11 in).
- Certificates: `src/certs.js` and `src/certs.css`. Prints on A4 landscape (297 × 210 mm).
- Events, event page, sidebar: `src/hub.js` and `src/hub.css` (shared with the Treasurer; keep changes small).
- The bottom bar style is shared too: `.dock-wrap` and `.dock` in `src/styles.css`. The Budget Request uses it and works correctly, so do not change how it behaves there.

## S0. Review your section (do this first)

- Due: 2026-11-25 (Wednesday, both plans)
- Status: not started
- From: Sean's starting list (Nov 20)

1. Open the live hub: https://sec-treas-hub.vercel.app/ on your computer and your phone. Switch to Secretary on the Events page.
2. Answer every question in [review-questions.md](../02_CONTEXT/review-questions.md) with Claude, and list every flaw and error in your section.
3. Tell the AI about any templates you use (they go in "My templates" above) and your guardrails, if you want any ("My guardrails").
4. Claude adds your answers to "Your own tasks" at the end of this file and asks: "Would you like to add anything else?"
5. Before your first code change, set up localhost ([rules.md](../00_CORE/rules.md), part 1B).
6. Open the pull request for this review on the review branch, and wait until Sean merges it before starting any other task ([rules.md](../00_CORE/rules.md), part 2).

## When a task is done (every task)

0. Keep the task's log up to date in `04_LOGS/tasks/` from the start ([rules.md](../00_CORE/rules.md), part 10).
1. Check it on localhost, desktop and phone ([rules.md](../00_CORE/rules.md), part 7).
2. If the task needed it, ask Trizy to validate ([rules.md](../00_CORE/rules.md), part 5).
3. The AI gives you the commands; you type them yourself ([rules.md](../00_CORE/rules.md), part 2): `git status`, `git add ...`, `git commit -m "<what changed>"`, `git push -u origin <branch>`, then open the pull request on GitHub.
4. Claude sets the task's Status to `submitted YYYY-MM-DD` and adds the `- Pull request:` link ([rules.md](../00_CORE/rules.md), part 12). Commit your task file and the task log with your work. The changelog line goes in the pull request description; Sean adds it to [changelog.md](../04_LOGS/changelog.md) when merging. Never commit `PROGRESS.md`; it updates on its own within the hour.
4b. The harness check must be green, then Sean checks the [rubric](../00_CORE/rubric.md). The task counts as finished only when Sean sets it to "verified" ([rules.md](../00_CORE/rules.md), part 13).
5. Tell Sean: a comment on the pull request mentioning @SeanC1801, and a direct message with the link. Say whether it is final (no flaws or errors on your localhost) ([rules.md](../00_CORE/rules.md), part 8).


## S1. Minutes: keep the bottom bar at the bottom

- Due: not set yet (Plan A: 2026-11-26, Plan B: 2026-11-27; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

- Bug: [findings.md](../03_TRACKING/findings.md), F1.
- Branch: `secretary/S1-minutes-bar`
- Steps:
  1. Open Code in the Dark, then its minutes. Scroll down on Details and watch the "Next / Continue" bar move up with the page.
  2. Cause: the bar (`<div class="dock-wrap">` at the end of the render in `src/minutes.js`) is inside `#sec`, and `#sec` is what scrolls (`src/minutes.css`: `position:absolute; inset:0; overflow:auto`).
  3. Fix it so the bar stays at the bottom of the screen while the content scrolls. Two ways (pick one and tell Claude to explain it to you first):
     - move the scrolling to an inner wrapper and keep the bar outside it, or
     - keep the bar where it is but make it stick to the bottom of `#sec` (for example `position:sticky; bottom:0`), scoped to `#sec` only.
  4. Keep space under the last field so it can be scrolled above the bar.
  5. Do not change `.dock-wrap` for the whole app. Scope your change to `#sec` (in `src/minutes.css`).
- Done when, on desktop and phone, on every step (Details, Notes, Action items, Preview & print):
  - the bar stays at the bottom while scrolling,
  - nothing is covered by the bar, including "Everyone was there", "Delete these minutes", the attendee names and the last action item,
  - the Budget Request's bottom bar still works as before.

## S2. Certificates: stop the bottom bar covering the signatory fields

- Due: not set yet (Plan A: 2026-11-27, Plan B: 2026-11-30; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

- Bug: [findings.md](../03_TRACKING/findings.md), F2.
- Branch: `secretary/S2-certificates-bar` (start after S1 is merged, so you can reuse the same fix).
- Steps:
  1. Desktop: open General Assembly, then its certificate batch. Scroll to the bottom of Details. The "Left" signatory's name and title are under the bar.
  2. Same cause as S1: the bar is inside `#cert`, which scrolls (`src/certs.css`).
  3. Apply the same fix as S1, scoped to `#cert`.
- Done when, on desktop and phone, on Details, Names and Preview & print:
  - the bar stays at the bottom while scrolling,
  - both signatories' name and title fields and "Delete this batch" can be seen and pressed.

## S3. Download Minutes and Certificates as PDF and Word

- Due: not set yet (Plan A: 2026-11-30, Plan B: 2026-12-11; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

- Why: officers need files to send, not only printouts.
- Branch: `secretary/S3-export`
- Steps:
  1. Before starting:
     - Ask Trizy: how should the minutes and certificates files look and be named? (Senior check: this task changes how documents are shared.)
     - Ask Sean: Minutes as PDF, Word (.docx), or both? Certificates as one PDF with every name, one PDF per name, or both? May you add a library? No new library without Sean's yes.
  2. Today, Preview & print sets the page size in `#pageSize` and calls `window.print()`:
     - Minutes: `src/minutes.js`, search for `8.5in 11in`.
     - Certificates: `src/certs.js`, search for `297mm 210mm`.
  3. Add "Download PDF" and/or "Download Word" next to Print.
  4. Use the templates under "My templates". If yours differ from what the hub prints, fix the hub first (as its own task) so the printout and the download both match.
  5. The file must match the printout: letterhead, page size, fonts, signatures.
  6. Name the files clearly, for example `Minutes - Sep 11, 2026.docx` or `Certificates - General Assembly.pdf`.
  7. Everything must happen in the browser. No upload to any server.
- Done when:
  - the downloaded files look the same as the printouts and your templates,
  - they work in Chrome on desktop and on an Android phone,
  - the existing Print buttons still work.

## S4. Test on a real Android phone

- Due: not set yet (Plan A: 2026-11-30, Plan B: 2026-12-12; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

- Why: the hub has only been tested in a desktop browser's phone mode.
- Branch: `secretary/S4-phone-checks` (for any fixes; the results go in the pull request).
- Steps (use a mid-range Android phone, Chrome):
  1. Open the live hub on your phone: https://sec-treas-hub.vercel.app/. To test your own changes, use localhost on the same Wi-Fi (`npm run dev -- --host`).
  2. Scroll Events, Minutes and Certificates. Write down any stutter or lag, especially on the glass bars.
  3. Write a full set of minutes with the on-screen keyboard: tap attendees, add topics and action items. Check the field you type in stays visible above the keyboard and the bottom bar.
  4. Paste a list of 30 names into a certificate batch. Check the preview shows every name and nothing is cut off.
  5. Print minutes (Letter) and a certificate batch (A4 landscape), or save as PDF from the print screen. Check the page sizes and that nothing is cut off.
  6. Write the results in the pull request: phone model, Android version, what worked, what did not, screenshots.
- Done when: all five checks are written up, and any problem you found is either fixed in this branch or added to "Your own tasks".

## S5. Filter events by date and by when they take place

- Due: not set yet (Plan A: 2026-11-28, Plan B: 2026-12-02; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Filter homepage, terms of: dates, activity, when it will take place."
- Branch: `secretary/S5-events-filters`
- Steps:
  1. Events is the home page now. Its filters are in `filterBar()` and `FILTERS` in `src/hub.js`, and the list is built in `eventsBody()`.
  2. Add date filters: "Upcoming", "This month", "Past", and "No date yet".
  3. Add a sort: by when the event takes place (soonest first), or newest first.
  4. Keep the search box for the activity name. Keep the filters working in both Grid and List views.
- Done when:
  - each date filter shows the right events,
  - the sort works,
  - search and the existing status filters still work,
  - it works in Grid and List, on desktop and phone.

## S6. Check marks on finished documents, and "Not submitted yet"

- Due: not set yet (Plan A: 2026-11-28, Plan B: 2026-12-04; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestions: "Check marks on accomplished tasks." and "Hasn't been submitted / Progress status."
- Branch: `secretary/S6-check-marks`
- Steps:
  1. On the event cards, the event page and the Budget Tracker, show a check mark with the word "Done" on finished documents.
  2. Drafts that were never sent say "Not submitted yet". Documents moving through the approval chain say where they are (like "With the President").
  3. Always words with the icon, never the icon or colour alone.
  4. Code: `eventSummary()`, `eventDrop()`, `docBtn()` and `eventKinds()` in `src/hub.js`.
- Done when:
  - finished documents show the check mark and "Done",
  - unsent drafts show "Not submitted yet",
  - it works on desktop and phone, in Grid and List.

## S7. No names on the sign-in screen

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-07; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Change homepage, dont show any names."
- Branch: `secretary/S7-signin-no-names`
- Steps:
  1. The sign-in screen lists every officer's full name (`people()` and `renderSignin()` in `src/hub.js`).
  2. Show roles only (like "Treasurer", "Secretary", "President", "Adviser", "Test Officer"), with no full names.
  3. Signing in as each role must still work.
  4. Names still print on documents as signatories. That stays (see [decisions.md](../03_TRACKING/decisions.md)).
- Done when:
  - no full name shows on the sign-in screen, on desktop and phone,
  - signing in still works for every role.

## S8. Access settings: who can use the hub (screens now, rules later)

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-09; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Limit to treasurer, core officers adviser president (give permission and remove access to specific officers)."
- Branch: `secretary/S8-access-settings`
- Steps:
  1. Ask Sean who may change access (like the President and the Adviser only). Write the answer in the task log.
  2. In Profile (`renderProfile()` in `src/hub.js`), add an "Access" section: each officer, their role, and an on/off switch labelled in words ("Has access" / "No access").
  3. Roles that can have access: Treasurer, Secretary, core officers, President, Adviser.
  4. For now this is saved on the device only (`sectreas:org:v1`). Add a note in words: "Access rules start working once the hub's server is ready." Do not add any server, database or key.
- Done when:
  - the Access section lists officers with roles and a clear on/off,
  - changes are saved and survive a reload,
  - the note about the server is clear,
  - it works on desktop and phone.

## S9. Hand a document over to another officer

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-10; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Transferring documents status." (This task covers handing over. Nico's T9 shows it in each document's timeline.)
- Branch: `secretary/S9-handover`
- Steps:
  1. Ask Sean which documents can be handed over (minutes and certificates, and also budget requests and liquidation reports?). Write the answer in the task log.
  2. Add a "Hand over" button on a document. It asks who to hand it to (officers of the same role) and asks to confirm.
  3. After a handover, the document's owner changes and the status log records it (like "Handed over from Ian to Trizy, Dec 3").
  4. Talk to Nico so the timeline in T9 shows handovers in the same words.
- Done when:
  - a document can be handed over with a confirm step,
  - the new owner shows on the document,
  - the log records the handover,
  - it works on desktop and phone.

## Your own tasks

Added by Claude from your answers to [review-questions.md](../02_CONTEXT/review-questions.md). Number them S10, S11, and so on (S5 to S9 are the senior's suggestions above).

Every task here gets a due date when it is added, from your plan ([timeline.md](timeline.md)):

- Plan A: urgent bugs (something broken, covered or wrong on a document) due Fri, Nov 27; everything else due Sun, Nov 29.
- Plan B: urgent bugs due Mon, Nov 30; everything else due Thu, Dec 10.
- Claude suggests the date, you confirm it, and Claude writes it on the task. [PROGRESS.md](../../PROGRESS.md) picks it up within the hour.

Status is "not started", "in progress", "submitted YYYY-MM-DD" (pull request final), "returned YYYY-MM-DD: <reason>" (from Sean) or "verified YYYY-MM-DD" (only Sean, after the [rubric](../00_CORE/rubric.md)). Claude keeps it current; [PROGRESS.md](../../PROGRESS.md) is built from it.

Format for each task:

```
## S<number>. <short title>

- Due: YYYY-MM-DD (<weekday>, Plan <A or B>)
- Status: not started
- From: your review (<date>)

- What you saw or want: <in your words>
- Desktop, phone or both:
- Screen:
- Steps to see it (for a bug):
```

- (none yet)
