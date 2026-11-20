# Treasurer tasks

For: Nico (Christian Dominic Liwanag). Senior who validates: Alexis (Alexis Yumi M. Suzuki).

Router: [agents.md](../00_CORE/agents.md). Back to: [overview.md](../02_CONTEXT/overview.md). Read first: [rules.md](../00_CORE/rules.md) and [review-questions.md](../02_CONTEXT/review-questions.md). Bug details: [findings.md](../03_TRACKING/findings.md). The Secretary list is in [secretary.md](secretary.md).

- Live hub: https://sec-treas-hub.vercel.app/ (shows `main`; use localhost for your own changes).
- Repository: https://github.com/SeanC1801/Sec-Treas-hub
- Branches: one per task, named `treasurer/T<number>-<short-name>`. You type commit, push and the pull request yourself; Sean reviews and merges.

## My guardrails

Added by the AI from your answer in [review-questions.md](../02_CONTEXT/review-questions.md), step 8. The AI follows these every time.

- (none yet)

## My templates

Templates the hub follows now (from Sean). Compare them with yours during the review ([review-questions.md](../02_CONTEXT/review-questions.md), step 6):

- Budget Request: the CSC Budget Request format on Long bond (8.5 × 13 in), Arial, on the chapter letterhead (`public/assets/letterhead.png`): request letter, program flow, budget breakdown.
- Liquidation Report: the CSC Liquidation Report format on Long bond, Arial: receipt table per budget category, plus optional proof pages (cash prize winners' IDs).
- Budget Tracker: the sheet "AUF-ACM Student Chapter Breakdown of Expenses A.Y. '26–'27" (columns Event, Invoice Number, Brand / Store, Unit Price, Particulars, Units, Total Unit Price, Total Actual Expense, Allotted Budget, Excess (Deficit), and the two document columns). The app uses sample receipts only.

Your templates, added by the AI from your answers ([rules.md](../00_CORE/rules.md), part 9). For each: name, which document it makes, where it is, version and who gave it, and what is different from the hub.

- (none yet)

## Your side of the hub

- Budget Requests: `src/prototype.js` (the Budget Requests area of the flow).
- Liquidation Reports, receipts, proof photos and printing: `src/prototype.js` (the Liquidation area).
- Budget Tracker page: `renderTracker()` in `src/hub.js`, styles under "Budget Tracker" in `src/hub.css`.
- Events, event page, sidebar: `src/hub.js` and `src/hub.css` (shared with the Secretary; keep changes small).
- Documents print on Long bond paper (8.5 × 13 in) in Arial.

## T0. Review your section (do this first)

1. Open the live hub: https://sec-treas-hub.vercel.app/ on your computer and your phone.
2. Answer every question in [review-questions.md](../02_CONTEXT/review-questions.md) with Claude, and list every flaw and error in your section.
3. Tell the AI about any templates you use (they go in "My templates" above) and your guardrails, if you want any ("My guardrails").
4. Claude adds your answers to "Your own tasks" at the end of this file and asks: "Would you like to add anything else?"
5. Before your first code change, set up localhost ([rules.md](../00_CORE/rules.md), part 1B).

## When a task is done (every task)

0. Keep the task's log up to date in `04_LOGS/tasks/` from the start ([rules.md](../00_CORE/rules.md), part 10).
1. Check it on localhost, desktop and phone ([rules.md](../00_CORE/rules.md), part 7).
2. If the task needed it, ask Alexis to validate ([rules.md](../00_CORE/rules.md), part 5).
3. The AI gives you the commands; you type them yourself ([rules.md](../00_CORE/rules.md), part 2): `git status`, `git add ...`, `git commit -m "..."`, `git push -u origin <branch>`, then open the pull request on GitHub.
4. Add the changelog entry ([changelog.md](../04_LOGS/changelog.md)) and finish the task log, in the same pull request.
5. Tell Sean: a comment on the pull request mentioning @SeanC1801, and a direct message with the link. Say whether it is final (no flaws or errors on your localhost) ([rules.md](../00_CORE/rules.md), part 8).


## T1. Make the Budget Tracker's Open and Start buttons easy to tap

- Bug: [findings.md](../03_TRACKING/findings.md), F3.
- Branch: `treasurer/T1-tracker-buttons`
- Steps:
  1. Open Budget Tracker in the sidebar (Treasurer mode).
  2. Look at the last two columns: "Budget Request Document" and "Liquidation Report Document".
  3. Make each Open / Start button at least 44 px tall and wide, without making the table rows much taller. A tappable area bigger than the visible text is fine.
  4. Code: style `.tk-tbl .docs .textbtn` in `src/hub.css`; buttons are made in `renderTracker()` in `src/hub.js`.
- Done when:
  - every Open / Start button measures at least 44 × 44 px,
  - the table still fits on a 1440 px desktop without scrolling sideways,
  - on phone the table still scrolls sideways inside its card and the page does not,
  - the buttons still open the right document.

## T2. Bring back "Copy link" for documents waiting on a signer

- Why: when a Budget Request or Liquidation Report is with the President or the Adviser, the Treasurer used to copy a link and paste it in the group chat. That button was lost when the old Home page was removed.
- Branch: `treasurer/T2-copy-link`
- Steps:
  1. Ask Sean where the button should appear, and ask Alexis if this is how the Treasurer shares documents with the signers. Suggested: on the event page, next to a Budget Request or Liquidation Report whose status is "With the President" or "With the Adviser".
  2. The function already exists: `copyLink(key)` in `src/hub.js`. Keys look like `br:<event id>` (budget request) and `lr:<event id>` (liquidation report).
  3. A button with `data-copy="<key>"` already calls `copyLink` through an existing click handler in `src/hub.js`.
  4. The button must not sit inside another button (the document rows on the event page are buttons). Put it beside the row.
  5. Label it "Copy link" in words. After a press, the toast says "Link copied. Paste it in the group chat".
- Done when:
  - the button shows only for documents with the President or the Adviser,
  - pressing it copies a link like `http://localhost:5173/#doc=br%3Ahack`,
  - opening that link opens the document,
  - it works and is not covered on desktop and phone.

## T3. Download the Budget Request and Liquidation Report as PDF and Word

- Why: officers need files to send, not only printouts.
- Branch: `treasurer/T3-export`
- Steps:
  1. Before starting:
     - Ask Alexis: does the downloaded file need anything the printout does not have? (Senior check: this task changes how documents are shared.)
     - Ask Sean: which formats first (PDF, Word, or both), and may you add a library? No new library without Sean's yes.
  2. Today, Preview & print fills `#printArea` and calls `window.print()` with the page size set in `#pageSize` (`src/prototype.js`, search for `8.5in 13in`).
  3. Add a "Download PDF" and/or "Download Word" button next to Print on the Preview & print step and on the final step.
  4. Use the templates under "My templates". If yours differ from what the hub prints, fix the hub first (as its own task) so the printout and the download both match.
  5. The file must match the printout: letterhead, Long bond (8.5 × 13 in), Arial, the same pages (letter, program flow, budget breakdown; for liquidation, the receipt table and the optional proof pages).
  6. Name the files clearly, for example `Budget Request - ACM-AUF Hackathon 2026.pdf`.
  7. Everything must happen in the browser. No upload to any server.
- Done when:
  - the downloaded file looks the same as the printout and your template,
  - it works in Chrome on desktop and on an Android phone,
  - the existing Print button still works.

## T4. Test on a real Android phone

- Why: the hub has only been tested in a desktop browser's phone mode.
- Branch: `treasurer/T4-phone-checks` (for any fixes; the results go in the pull request).
- Steps (use a mid-range Android phone, Chrome):
  1. Open the live hub on your phone: https://sec-treas-hub.vercel.app/. To test your own changes, use localhost on the same Wi-Fi (`npm run dev -- --host`).
  2. Scroll Events, the Budget Tracker and a Liquidation Report. Write down any stutter or lag, especially on the glass bars.
  3. Liquidation Report, Proof step: take a photo with the camera and choose one from the gallery. Check it shows, survives a page reload, and prints.
  4. Type in a Budget Request with the on-screen keyboard. Check the field you type in stays visible.
  5. Print a Budget Request and a Liquidation Report (or save as PDF from the print screen). Check the page size is Long bond and nothing is cut off.
  6. Write the results in the pull request: phone model, Android version, what worked, what did not, screenshots.
- Done when: all five checks are written up, and any problem you found is either fixed in this branch or added to "Your own tasks".

## Your own tasks

Added by Claude from your answers to [review-questions.md](../02_CONTEXT/review-questions.md). Number them T5, T6, and so on. For each one write: what you saw or want, desktop/phone/both, which screen, and steps to see it.

- (none yet)
