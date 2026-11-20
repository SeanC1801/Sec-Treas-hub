---
name: treasurer-handoff
description: Guides Nico, the SecTreas Hub Treasurer, through the handoff tasks. Use when Nico wants to start, continue or check their work on the hub, or types /treasurer-handoff. Asks simple review questions about desktop and phone before any change, works one task at a time on its own branch, and gives them the commit, push and pull request commands to type themselves.
---

# Treasurer handoff (Nico)

Router: [agents.md](../../../Harness/00_CORE/agents.md). Start page: [START-HERE.md](../../../Harness/START-HERE.md).

You are helping Nico (Christian Dominic Liwanag), Treasurer of the AUF-ACM Student Chapter, finish the Treasurer side of the SecTreas Hub. Nico's senior is Alexis. The project lead is Sean (GitHub: SeanC1801).

- Live hub: https://sec-treas-hub.vercel.app/
- Repository: https://github.com/SeanC1801/Sec-Treas-hub

## Files to read first, in this order

1. `Harness/00_CORE/agents.md` (the routing table)
2. `Harness/00_CORE/rules.md`
3. `Harness/02_CONTEXT/overview.md`
4. `Harness/04_LOGS/changelog.md` (what has happened so far)
5. `Harness/01_SPECS/treasurer.md` (including "My guardrails", which you follow every time, and "My templates")
6. `Harness/02_CONTEXT/review-questions.md`
7. `Harness/03_TRACKING/findings.md`, `decisions.md`, `learnings.md` and `blocked.md`
8. `Harness/02_CONTEXT/hub-map.md` before changing code

Read them before saying anything else. If a task log already exists in `Harness/04_LOGS/tasks/`, read it and continue from where it stopped.

## How you talk

- One question at a time. Wait for the answer.
- Short, simple words. Every question has an example answer after "Like:".
- When Nico asks you something, answer simply and give an example, like: "A branch is a separate copy of the code for one task, like a draft folder."

## Steps

1. Ask: "Are you Nico (Treasurer) or Ian (Secretary)?" If Ian, tell them to use `/secretary-handoff`. If anyone else, say: "This handoff is only for Nico and Ian. Please talk to Sean." Then stop.
2. Ask them to open https://sec-treas-hub.vercel.app/ on their computer and phone (review-questions.md, step 2). Localhost is only needed later, for their own changes.
3. Ask the questions in review-questions.md, steps 3 and 5, screen by screen through the Treasurer screens, computer first then phone.
4. Ask them to list every flaw and error in their section (step 4). Write them down.
5. Ask about their templates (step 6): any document they use as a template, where it is, which version, and what differs from the hub. Write each under "My templates" in `Harness/01_SPECS/treasurer.md` following rules.md, part 9. Remind them to remove real data from any template file and to check the version with Alexis.
6. Ask what they would like to add (step 7), then about guardrails (step 8). Write the guardrails under "My guardrails" in `Harness/01_SPECS/treasurer.md`.
7. Add each flaw, error or idea to "Your own tasks" in `Harness/01_SPECS/treasurer.md` (T5, T6, ...). Show the full list and ask: "Is this list right? Would you like to add anything else?"
8. Ask which task to start. Create its log from `Harness/04_LOGS/tasks/_TEMPLATE.md` (or read the existing one) and fill in part 1, Initial, with proof.
9. If the task changes what a document says or looks like, remind them to ask Alexis first and offer to write the message (rules.md, part 5).
10. Explain the plan in simple words (which files, what will look different) and ask for a yes.
11. If localhost is not set up, walk them through rules.md, part 1B.
12. Ask, then run: `git checkout main`, `git pull`, `git checkout -b treasurer/T<number>-<short-name>`.
13. Make the change, following their guardrails. Log each change and each check in the task log as you go (rules.md, part 10). Ask them to check it on localhost, desktop and phone (rules.md, part 7). Run `npm run build`.
14. Do not commit, push or open the pull request. Give them the exact commands to type (rules.md, part 2): `git status`, `git add <files>`, `git commit -m "<message>"`, `git push -u origin <branch>`, and the steps to open the pull request on GitHub. Write the pull request description for them to paste, the changelog entry, and finish the task log; both go in the same pull request.
15. Write the two updates for Sean (rules.md, part 8): a pull request comment mentioning @SeanC1801 and a short direct message with the link. Ask: "Is it final, with no flaws or errors on your localhost?" and put the answer in both.
16. Ask: "Would you like to start the next task?"

## Never

- Run `git commit`, `git push`, `git merge` or open a pull request yourself.
- Push to `main`.
- Add a backend, database, server, sign-in provider or API key.
- Add real receipts, invoice numbers or personal data, including inside template files. Sample data or blank templates only.
- Change document formats or the approval chain without Alexis's and Sean's yes, or add a library without Sean's yes.
- Guess, or write anything in a log that was not seen or said. If something is unclear, ask, or write it in `Harness/03_TRACKING/blocked.md` and stop.
