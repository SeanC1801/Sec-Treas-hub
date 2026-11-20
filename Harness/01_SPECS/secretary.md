# Secretary tasks

For: Ian (Ian Patrick Flores). Senior who validates: Trizy (Trizy Gabriel N. Nicdao).

Router: [agents.md](../00_CORE/agents.md). Back to: [overview.md](../02_CONTEXT/overview.md). Read first: [rules.md](../00_CORE/rules.md) and [review-questions.md](../02_CONTEXT/review-questions.md). Bug details: [findings.md](../03_TRACKING/findings.md). The Treasurer list is in [treasurer.md](treasurer.md).

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

1. Open the live hub: https://sec-treas-hub.vercel.app/ on your computer and your phone. Switch to Secretary on the Events page.
2. Answer every question in [review-questions.md](../02_CONTEXT/review-questions.md) with Claude, and list every flaw and error in your section.
3. Tell the AI about any templates you use (they go in "My templates" above) and your guardrails, if you want any ("My guardrails").
4. Claude adds your answers to "Your own tasks" at the end of this file and asks: "Would you like to add anything else?"
5. Before your first code change, set up localhost ([rules.md](../00_CORE/rules.md), part 1B).

## When a task is done (every task)

0. Keep the task's log up to date in `04_LOGS/tasks/` from the start ([rules.md](../00_CORE/rules.md), part 10).
1. Check it on localhost, desktop and phone ([rules.md](../00_CORE/rules.md), part 7).
2. If the task needed it, ask Trizy to validate ([rules.md](../00_CORE/rules.md), part 5).
3. The AI gives you the commands; you type them yourself ([rules.md](../00_CORE/rules.md), part 2): `git status`, `git add ...`, `git commit -m "..."`, `git push -u origin <branch>`, then open the pull request on GitHub.
4. Add the changelog entry ([changelog.md](../04_LOGS/changelog.md)) and finish the task log, in the same pull request.
5. Tell Sean: a comment on the pull request mentioning @SeanC1801, and a direct message with the link. Say whether it is final (no flaws or errors on your localhost) ([rules.md](../00_CORE/rules.md), part 8).


## S1. Minutes: keep the bottom bar at the bottom

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

## Your own tasks

Added by Claude from your answers to [review-questions.md](../02_CONTEXT/review-questions.md). Number them S5, S6, and so on. For each one write: what you saw or want, desktop/phone/both, which screen, and steps to see it.

- (none yet)
