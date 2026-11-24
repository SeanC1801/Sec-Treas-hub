# Rubric: how Sean checks that a task is really done

Router: [agents.md](agents.md). Rules: [rules.md](rules.md), part 13. Progress: [PROGRESS.md](../../PROGRESS.md).

A task counts as finished only when Sean has checked it against this rubric and set it to "verified". Until then, "submitted" means "waiting for Sean". Only Sean may change this file.

## How it works

1. You finish a task: it works on your localhost, on desktop and phone, with no flaws or errors.
2. Claude sets `- Status: submitted YYYY-MM-DD` and the `- Pull request:` link in your task file. You tick the rubric in your pull request (only what is true).
3. The automatic harness check runs on your pull request. It must pass (green) first.
4. Sean checks every item below. All 8 must pass.
   - All pass: Sean merges the pull request, then sets `- Status: verified YYYY-MM-DD` on `main`.
   - Any fail: Sean does not merge. Sean sets `- Status: returned YYYY-MM-DD: <what to fix>` on your branch and comments on the pull request. Claude reads it next session, and the task goes back to work. A returned task is not finished, and its due date does not move unless Sean agrees.
5. [PROGRESS.md](../../PROGRESS.md) counts only verified tasks as finished.

## The 8 checks (pass or fail)

| # | Check | Passes when | How Sean checks it |
|---|---|---|---|
| 1 | Done | Every "Done when" point of the task is met. | Tries each point on the live preview or localhost. |
| 2 | Desktop and phone | Checked on a desktop (1280 px or wider) and a phone (375 px), nothing covered, nothing off the edge, bottom bars stay at the bottom. | Desktop and phone screenshots in the pull request, plus a quick look. |
| 3 | Builds cleanly | `npm run build` passes and the browser console has no red errors. | The pull request and the task log's Checks part. |
| 4 | Logged | The task log in `04_LOGS/tasks/` has all 7 parts filled in, with proof (file and line, screen and size, or quotes). Nothing written that was not seen. | Reads the task log. |
| 5 | Senior check | If the task changes what a document says or looks like, Alexis (Nico) or Trizy (Ian) validated it, with the date. | The pull request's Senior check part. |
| 6 | Stayed in scope | Only the task's own files changed. No rules, scripts, PROGRESS.md, README.md, changelog.md, or the other officer's task file. | The pull request's file list (the harness check also blocks most of these). |
| 7 | Safe data | Sample data only. No real receipts, names on new screens, student numbers, ID photos, or keys. | Reads the changes. |
| 8 | On time | Submitted by the due date, or the delay is in [blocked.md](../03_TRACKING/blocked.md) and Sean agreed to the new date. | PROGRESS.md and blocked.md. |

## Guardrails this rubric adds for you and Claude

- Never set "verified". Only Sean does.
- Never set "submitted" until checks 1 to 4 are true on your localhost.
- Never tick a rubric box that is not true. A false tick fails check 4 and the task is returned.
- Never edit PROGRESS.md, the rubric, `.github/` or `scripts/`. The harness check marks the pull request red if you do.
- If you are unsure whether a check passes, write it in the task log as "not sure" and ask Sean, instead of ticking it.
