# Treasurer tasks

For: Nico (Christian Dominic Liwanag). Senior who validates: Alexis (Alexis Yumi M. Suzuki).

Deadline plan: not chosen yet. Claude asks Nico at the start: Plan A (everything by Mon, Nov 30) or Plan B (everything before Dec 15). See [timeline.md](timeline.md).

Router: [agents.md](../00_CORE/agents.md). Deadlines: [timeline.md](timeline.md). Back to: [overview.md](../02_CONTEXT/overview.md). Read first: [rules.md](../00_CORE/rules.md) and [review-questions.md](../02_CONTEXT/review-questions.md). Bug details: [findings.md](../03_TRACKING/findings.md). The Secretary list is in [secretary.md](secretary.md).

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

- Due: 2026-11-25 (Wednesday, both plans)
- Status: not started
- From: Sean's starting list (Nov 20)

1. Open the live hub: https://sec-treas-hub.vercel.app/ on your computer and your phone.
2. Answer every question in [review-questions.md](../02_CONTEXT/review-questions.md) with Claude, and list every flaw and error in your section.
3. Tell the AI about any templates you use (they go in "My templates" above) and your guardrails, if you want any ("My guardrails").
4. Claude adds your answers to "Your own tasks" at the end of this file and asks: "Would you like to add anything else?"
5. Before your first code change, set up localhost ([rules.md](../00_CORE/rules.md), part 1B).

## When a task is done (every task)

0. Keep the task's log up to date in `04_LOGS/tasks/` from the start ([rules.md](../00_CORE/rules.md), part 10).
1. Check it on localhost, desktop and phone ([rules.md](../00_CORE/rules.md), part 7).
2. If the task needed it, ask Alexis to validate ([rules.md](../00_CORE/rules.md), part 5).
3. The AI gives you the commands; you type them yourself ([rules.md](../00_CORE/rules.md), part 2): `git status`, `git add ...`, `git commit -m "<what changed>"`, `git push -u origin <branch>`, then open the pull request on GitHub.
4. Claude sets the task's Status to `submitted YYYY-MM-DD` and adds the `- Pull request:` link ([rules.md](../00_CORE/rules.md), part 12). Commit your task file, the task log and the changelog entry ([changelog.md](../04_LOGS/changelog.md)) with your work. Never commit `PROGRESS.md`; it updates on its own within the hour.
4b. The harness check must be green, then Sean checks the [rubric](../00_CORE/rubric.md). The task counts as finished only when Sean sets it to "verified" ([rules.md](../00_CORE/rules.md), part 13).
5. Tell Sean: a comment on the pull request mentioning @SeanC1801, and a direct message with the link. Say whether it is final (no flaws or errors on your localhost) ([rules.md](../00_CORE/rules.md), part 8).


## T1. Make the Budget Tracker's Open and Start buttons easy to tap

- Due: not set yet (Plan A: 2026-11-26, Plan B: 2026-11-27; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

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

- Due: not set yet (Plan A: 2026-11-27, Plan B: 2026-11-30; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

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

- Due: not set yet (Plan A: 2026-11-30, Plan B: 2026-12-11; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

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

- Due: not set yet (Plan A: 2026-11-30, Plan B: 2026-12-12; see [timeline.md](timeline.md))
- Status: not started
- From: Sean's starting list (Nov 20)

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

## T5. Add a Google Drive link to each budget request

- Due: not set yet (Plan A: 2026-11-28, Plan B: 2026-12-02; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Budget request link straight to either a drive link or gdrive."
- Branch: `treasurer/T5-drive-link`
- Steps:
  1. Ask Alexis where the chapter keeps budget requests in Google Drive, and what the link should open (the file, or the event's folder).
  2. On the Budget Request's Details step (`src/prototype.js`), add an optional field "Google Drive link".
  3. Accept only links that start with `https://drive.google.com/` or `https://docs.google.com/`. Any other link shows a clear message in words.
  4. Show an "Open in Drive" link next to the Budget Request on the event page and in the Budget Tracker's "Budget Request Document" column. It opens in a new tab.
  5. No file upload. Only the link is saved.
- Done when:
  - the link is saved with the request and survives a page reload,
  - it shows on the event page and in the Budget Tracker,
  - a wrong link is refused with a message,
  - it works on desktop and phone.

## T6. Make budget requests editable at any stage

- Due: not set yet (Plan A: 2026-11-28, Plan B: 2026-12-04; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Budget request should be editable."
- Branch: `treasurer/T6-editable-request`
- Steps:
  1. Check how it behaves today: open a Budget Request, send it to the President, and try to edit it. Write what you see in the task log (part 1, Initial). The send and "Undo send" code is in `src/prototype.js` (search `submit` and `unsend`).
  2. Ask Sean and Alexis: if a request is edited after it was sent, does it go back to Draft and need signing again? Write their answer in the task log.
  3. Add an "Edit" button on a sent request. Before editing, a short message explains what happens (like "Editing sends this back to Draft. The President will need to sign it again.").
  4. Record the edit in the status log (like "Edited after sending, back to Draft").
- Done when:
  - the Treasurer can edit a request at any stage,
  - the message shows before editing a sent request,
  - the status and the status log show what happened,
  - it works on desktop and phone.

## T7. Add Budget Requests and Liquidation Reports to the sidebar

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-07; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Side bar, budget request liquidation reports."
- Branch: `treasurer/T7-sidebar-lists`
- Steps:
  1. Ask Sean to confirm (the old Home page with these lists was removed on Nov 7; see [decisions.md](../03_TRACKING/decisions.md)). Write Sean's answer in the task log.
  2. In Treasurer mode, add two sidebar items: "Budget Requests" and "Liquidation Reports". The sidebar items are in `ALL_TABS` and `tabsNow()` in `src/hub.js`.
  3. Each opens a page listing every request or report across all events: event, date, amount, and status in words, sorted by due date. Tapping a row opens the document.
  4. Hide both items in Secretary mode and for the President and Adviser, like the Budget Tracker (`trackerOK()` in `src/hub.js`).
- Done when:
  - both items show only in Treasurer mode,
  - the lists show every request and report with the right status,
  - rows open the right document,
  - the collapsed sidebar and the phone drawer still look right.

## T8. Send to the President for approval (screens now, email later)

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-09; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Confirmation, directly sent to the email of the president for approval, then make progress on status person."
- Branch: `treasurer/T8-send-to-president`
- Steps:
  1. When the Treasurer sends a Budget Request or Liquidation Report to the President, show a confirmation screen with the email that will be sent: to the President (name from Profile), the subject, and a link to the document.
  2. A "Send for approval" button moves the status to "With the President" and writes it in the status log.
  3. Real email sending needs the backend. For now, show a clear note in words: "The email will be sent once the hub's server is ready. Please send the link to the President yourself for now." Do not use any email service or API key.
  4. Ask Alexis what the email should say, and write the answer in the task log.
- Done when:
  - the confirmation screen shows the right President, subject and link,
  - the status moves to "With the President" and the log shows it,
  - the note about email is clear,
  - no email service, key or server was added,
  - it works on desktop and phone.

## T9. Show a status timeline for each document

- Due: not set yet (Plan A: 2026-11-29, Plan B: 2026-12-10; see [timeline.md](timeline.md))
- Status: not started
- From: senior's suggestion (Nov 24)

- Senior's suggestion: "Transferring documents status." (This task covers the timeline. Ian's S9 covers handing a document over to another officer.)
- Branch: `treasurer/T9-status-timeline`
- Steps:
  1. Check what the approval panel already shows (`openPath()` and `renderPath()` in `src/hub.js`). Write it in the task log.
  2. Show every status change of a Budget Request and Liquidation Report as a timeline: the step (Draft, With the President, With the Adviser, With the CSC Treasurer, Approved), who moved it, the date and time, and any note. The status log is written by `logStage()` in `src/prototype.js`.
  3. Also show handovers from Ian's S9 when they appear in the log. Talk to Ian about the log entry's wording.
  4. Use words for every status, never colour alone.
- Done when:
  - every status change shows with who, when and the note,
  - it reads clearly on desktop and phone,
  - returned documents show the reason.

## Your own tasks

Added by Claude from your answers to [review-questions.md](../02_CONTEXT/review-questions.md). Number them T10, T11, and so on (T5 to T9 are the senior's suggestions above).

Every task here gets a due date when it is added, from your plan ([timeline.md](timeline.md)):

- Plan A: urgent bugs (something broken, covered or wrong on a document) due Fri, Nov 27; everything else due Sun, Nov 29.
- Plan B: urgent bugs due Mon, Nov 30; everything else due Thu, Dec 10.
- Claude suggests the date, you confirm it, and Claude writes it on the task. [PROGRESS.md](../../PROGRESS.md) picks it up within the hour.

Status is "not started", "in progress", "submitted YYYY-MM-DD" (pull request final), "returned YYYY-MM-DD: <reason>" (from Sean) or "verified YYYY-MM-DD" (only Sean, after the [rubric](../00_CORE/rubric.md)). Claude keeps it current; [PROGRESS.md](../../PROGRESS.md) is built from it.

Format for each task:

```
## T<number>. <short title>

- Due: YYYY-MM-DD (<weekday>, Plan <A or B>)
- Status: not started
- From: your review (<date>)

- What you saw or want: <in your words>
- Desktop, phone or both:
- Screen:
- Steps to see it (for a bug):
```

- (none yet)
