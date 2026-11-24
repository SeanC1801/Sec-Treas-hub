# Timeline: Plan A (by November 30) or Plan B (before December 15)

Router: [agents.md](../00_CORE/agents.md). Tasks: [treasurer.md](treasurer.md) (Nico), [secretary.md](secretary.md) (Ian). Progress: [PROGRESS.md](../../PROGRESS.md). Updated by Sean on November 24, 2026.

## Choose your plan (once, at the start)

Claude asks each of you once, at the start of your first session:

> "Can you finish all your tasks by Monday, November 30 (Plan A), or will you follow the soft deadline and finish before December 15 (Plan B)? Like: 'Plan A' or 'Plan B.'"

- Your answer applies to all your tasks.
- Claude writes your plan at the top of your task file ("Deadline plan: A" or "B"), and copies the due dates below onto each task. [PROGRESS.md](../../PROGRESS.md) picks it up within the hour.
- You can switch from A to B once, if you tell Sean. Write the reason in [blocked.md](../03_TRACKING/blocked.md).

"Due" means the pull request is open and final (no flaws or errors on your localhost). Sean reviews pull requests within one day.

## Due dates for every task

| Task | Nico (Treasurer) | Ian (Secretary) | Plan A: by Mon, Nov 30 | Plan B: before Dec 15 |
|---|---|---|---|---|
| Review your section | T0 | S0 | Wed, Nov 25 | Wed, Nov 25 |
| First bug fix | T1 Budget Tracker buttons | S1 Minutes bottom bar | Thu, Nov 26 | Fri, Nov 27 |
| Second bug fix | T2 Copy link for signers | S2 Certificates bottom bar | Fri, Nov 27 | Mon, Nov 30 |
| Senior's suggestion 1 | T5 Drive link on budget requests | S5 Events filters | Sat, Nov 28 | Wed, Dec 2 |
| Senior's suggestion 2 | T6 Editable budget requests | S6 Check marks and "not submitted" status | Sat, Nov 28 | Fri, Dec 4 |
| Senior's suggestion 3 | T7 Sidebar: Budget Requests and Liquidation Reports | S7 No names on the sign-in screen | Sun, Nov 29 | Mon, Dec 7 |
| Senior's suggestion 4 | T8 Send to the President for approval (screens) | S8 Access settings (screens) | Sun, Nov 29 | Wed, Dec 9 |
| Senior's suggestion 5 | T9 Status timeline for each document | S9 Hand a document over to another officer | Sun, Nov 29 | Thu, Dec 10 |
| PDF and Word downloads | T3 | S3 | Mon, Nov 30 | Fri, Dec 11 |
| Real phone checks | T4 | S4 | Mon, Nov 30 | Sat, Dec 12 |
| Final check on the live hub | | | Mon, Nov 30 | Mon, Dec 14 |

Your own tasks from the review (T10 and up, S10 and up):

- Plan A: urgent bugs due Fri, Nov 27; everything else due Sun, Nov 29.
- Plan B: urgent bugs due Mon, Nov 30; everything else due Thu, Dec 10.
- Claude suggests the date, you confirm it.

## Backend: database and security (Sean)

Sean plans the backend with the seniors, from their suggestions, starting from [backend-proposal.md](../02_CONTEXT/backend-proposal.md). T8 (send to the President) and S8 (access settings) are built as screens now and connected to the backend later. Sean adds the backend dates here once the plan is set.

## Daily rules

- At the start of each session, Claude shows all your tasks with their due dates and status, then says which is due next.
- Claude keeps your task file's Due and Status lines up to date, and you push them on your branch. [PROGRESS.md](../../PROGRESS.md) updates on its own within the hour ([rules.md](../00_CORE/rules.md), part 12).
- A task counts as finished only when Sean verifies it against the [rubric](../00_CORE/rubric.md) ([rules.md](../00_CORE/rules.md), part 13).
- At the end of each day you work, update your task log in `04_LOGS/tasks/`.
- If a task will be late, tell Sean that day and write it in [blocked.md](../03_TRACKING/blocked.md) with the new date you can make.
- If a senior has not answered within a day, tell Sean.
