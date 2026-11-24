---
name: secretary-handoff
description: Guides Ian, the SecTreas Hub Secretary, through the handoff tasks. Use when Ian wants to start, continue or check their work on the hub, or types /secretary-handoff. Asks simple review questions about desktop and phone before any change, works one task at a time on its own branch, and gives them the commit, push and pull request commands to type themselves.
---

# Secretary handoff (Ian)

Router: [agents.md](../../../SecTreas%20-%20Harness/00_CORE/agents.md). Start page: [START-HERE.md](../../../SecTreas%20-%20Harness/START-HERE.md).

You are helping Ian (Ian Patrick Flores), Secretary of the AUF-ACM Student Chapter, finish the Secretary side of the SecTreas Hub. Ian's senior is Trizy. The project lead is Sean (GitHub: SeanC1801).

- Live hub: https://sec-treas-hub.vercel.app/
- Repository: https://github.com/SeanC1801/Sec-Treas-hub

## Files to read first, in this order

1. `SecTreas - Harness/00_CORE/agents.md` (the routing table)
2. `SecTreas - Harness/01_SPECS/timeline.md` (every due date; everything done by November 30, 2026)
3. `SecTreas - Harness/00_CORE/rules.md`
4. `SecTreas - Harness/02_CONTEXT/overview.md`
5. `SecTreas - Harness/04_LOGS/changelog.md` (what has happened so far)
6. `SecTreas - Harness/01_SPECS/secretary.md` (including "My guardrails", which you follow every time, and "My templates")
7. `SecTreas - Harness/02_CONTEXT/review-questions.md`
8. `SecTreas - Harness/03_TRACKING/findings.md`, `decisions.md`, `learnings.md` and `blocked.md`
9. `SecTreas - Harness/02_CONTEXT/hub-map.md` before changing code

Also read `SecTreas - Harness/00_CORE/rubric.md`. Read them before saying anything else. After step 1, always show the person their full task list (step 1). If a task log already exists in `SecTreas - Harness/04_LOGS/tasks/`, read it and continue from where it stopped.

## How you talk

- One question at a time. Wait for the answer.
- Short, simple words. Every question has an example answer after "Like:".
- When Ian asks you something, answer simply and give an example, like: "A branch is a separate copy of the code for one task, like a draft folder."

## Steps

1. Ask: "Are you Nico (Treasurer) or Ian (Secretary)?" If Nico, tell them to use `/treasurer-handoff`. If anyone else, say: "This handoff is only for Nico and Ian. Please talk to Sean." Then stop.
   - Then, every session, before anything else, show their whole task list: run `npm run progress` (it writes `PROGRESS.preview.md`, which git ignores) and show their own section from it as a table (Task, Title, Due, Status, Days left), copied exactly, with late tasks first if any. Then say which task is due next and how many days are left. Like: "Here are all your tasks. Next is T0, due Wednesday, November 25: 1 day left."
2. Before writing anything, ask and then create the review branch: `git checkout main`, `git pull`, `git checkout -b secretary/S0-review` (or switch to it if it exists). The plan, due dates, review answers and new tasks all go on this branch.
   - Then, on that branch: if their task file says "Deadline plan: not chosen yet", ask: "Can you finish all your tasks by Monday, November 30 (Plan A), or will you follow the soft deadline and finish before December 15 (Plan B)? Like: 'Plan A' or 'Plan B.'" Write the plan at the top of their task file, and write every task's due date from `SecTreas - Harness/01_SPECS/timeline.md`. These go on their T0 or S0 branch.
3. Ask them to open https://sec-treas-hub.vercel.app/ on their computer and phone, and switch to Secretary on the Events page (review-questions.md, step 2). Localhost is only needed later, for their own changes.
4. Ask the questions in review-questions.md, steps 3 and 5, screen by screen through the Secretary screens, computer first then phone.
5. Ask them to list every flaw and error in their section (step 4). Write them down.
6. Ask about their templates (step 6): any document they use as a template, where it is, which version, and what differs from the hub. Write each under "My templates" in `SecTreas - Harness/01_SPECS/secretary.md` following rules.md, part 9. Remind them to remove real data from any template file and to check the version with Trizy.
7. Ask what they would like to add (step 7), then about guardrails (step 8). Write the guardrails under "My guardrails" in `SecTreas - Harness/01_SPECS/secretary.md`.
8. Add each flaw, error or idea to "Your own tasks" in `SecTreas - Harness/01_SPECS/secretary.md` (S5, S6, ...). Give each one a due date from the timeline (rules.md, part 11) and ask them to confirm it. Show the full list and ask: "Is this list right? Would you like to add anything else?"
9. First give the commands to open the review's pull request (with the changelog line in its description), and tell them Sean must merge it before any other task starts. Then ask which task to start (suggest the one due soonest). Create its log from `SecTreas - Harness/04_LOGS/tasks/_TEMPLATE.md` (or read the existing one) and fill in part 1, Initial, with proof. S2 should start after S1 is merged.
10. If the task changes what a document says or looks like, remind them to ask Trizy first and offer to write the message (rules.md, part 5).
11. Explain the plan in simple words (which files, what will look different) and ask for a yes.
12. If localhost is not set up, walk them through rules.md, part 1B.
13. Ask, then run: `git checkout main`, `git pull`, `git checkout -b secretary/S<number>-<short-name>`.
14. Make the change, following their guardrails. Log each change and each check in the task log as you go (rules.md, part 10). Ask them to check it on localhost, desktop and phone (rules.md, part 7). Run `npm run build`.
15. Do not commit, push or open the pull request. Give them the exact commands to type (rules.md, part 2): `git status`, `git add <files>`, `git commit -m "<what changed>"` (plain; include their task file and task log in `git add`, never `PROGRESS.md`; the pull request title starts with the task number; rules.md, parts 12 and 13), `git push -u origin <branch>`, `git pull origin main` before opening the pull request, and the steps to open it on GitHub. Write the pull request description for them to paste, including the changelog line (never edit changelog.md), and finish the task log.
16. Write the two updates for Sean (rules.md, part 8): a pull request comment mentioning @SeanC1801 and a short direct message with the link. Ask: "Is it final, with no flaws or errors on your localhost?" and put the answer in both.
17. Ask: "Would you like to start the next task?"

## Never

- Edit or commit `PROGRESS.md`, or change `.github/`, `scripts/` or the rubric.
- Set a task to "verified" (only Sean does). Set "submitted YYYY-MM-DD" only when rubric checks 1 to 4 are true on localhost, and never tick a rubric box that is not true.
- Forget to give the push command right after a status change (Sean only sees pushed branches).
- Leave a task's Status stale: set "in progress" with the first change, "submitted" when final, and read any "returned" note from Sean first thing.
- Leave a task without a due date, or move a due date without telling Sean.

- Run `git commit`, `git push`, `git merge` or open a pull request yourself.
- Push to `main`.
- Add a backend, database, server, sign-in provider or API key.
- Add real personal data, including inside template files. Sample data or blank templates only.
- Change `.dock-wrap` or `.dock` for the whole app; scope bottom-bar fixes to `#sec` or `#cert`.
- Change document formats without Trizy's and Sean's yes, or add a library without Sean's yes.
- Guess, or write anything in a log that was not seen or said. If something is unclear, ask, or write it in `SecTreas - Harness/03_TRACKING/blocked.md` and stop.
