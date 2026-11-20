# SecTreas Hub handoff: overview

The Harness folder tells Nico (Treasurer) and Ian (Secretary), and Claude Code, what is left to do on the SecTreas Hub before the backend is built.

- Project lead: Sean Caling (GitHub: SeanC1801)
- Working on the hub: Nico (Christian Dominic Liwanag, Treasurer) and Ian (Ian Patrick Flores, Secretary). Nobody else.
- Seniors who validate the work: Alexis (senior Treasurer) for Nico, Trizy (senior Secretary) for Ian.
- Live hub (always shows the latest `main`): https://sec-treas-hub.vercel.app/
- Repository: https://github.com/SeanC1801/Sec-Treas-hub (private; ask Sean to add you as a collaborator)
- Deadline for this round: end of November 2026
- Written: November 20, 2026

## Who reads what

1. Read [START-HERE.md](../START-HERE.md), then this file.
2. Read [rules.md](../00_CORE/rules.md) next: setup, branches, the git commands you type yourself, seniors, guardrails, testing, updating Sean, and templates.
3. Answer [review-questions.md](review-questions.md) with Claude before starting any task.
4. Nico then opens [treasurer.md](../01_SPECS/treasurer.md).
5. Ian then opens [secretary.md](../01_SPECS/secretary.md).
6. [findings.md](../03_TRACKING/findings.md) lists what was checked on November 20 and the bugs that were found. The task files point to it.

## Using Claude Code

- Open the cloned repo in Claude Code. The skills load these files for you, with no install:
  - Nico: `/treasurer-handoff` (file: [SKILL.md](../../.claude/skills/treasurer-handoff/SKILL.md))
  - Ian: `/secretary-handoff` (file: [SKILL.md](../../.claude/skills/secretary-handoff/SKILL.md))

## The order of work

1. Open the live hub: https://sec-treas-hub.vercel.app/ (desktop and phone).
2. Claude asks you the questions in [review-questions.md](review-questions.md). You list the flaws and errors you find in your own section of the hub.
3. Claude asks which documents you use as templates ([rules.md](../00_CORE/rules.md), part 9), and if you would like to add guardrails to your work ([rules.md](../00_CORE/rules.md), part 6).
4. Claude adds your answers to your task file as new tasks and asks you to confirm the list.
5. Pick one task. Claude explains its plan in simple words and waits for your yes.
6. If the task changes what a document says or looks like, ask your senior first ([rules.md](../00_CORE/rules.md), part 5).
7. Set up the hub on your computer (localhost) so you can see your changes before they are on GitHub ([rules.md](../00_CORE/rules.md), part 1).
8. Claude makes a branch and the change, and writes down every step in the task's log ([rules.md](../00_CORE/rules.md), part 10). You check it on desktop and phone on localhost.
9. Claude gives you the commit, push and pull request commands. You type them yourself ([rules.md](../00_CORE/rules.md), part 2).
10. Tell Sean about the pull request, and whether it is final ([rules.md](../00_CORE/rules.md), part 8).
11. Go back to step 5 for the next task.

## Files in this folder

- [START-HERE.md](../START-HERE.md): what this folder is and what to do first.
- [overview.md](overview.md): this page.
- [agents.md](../00_CORE/agents.md): instructions for Claude, and which file to read when.
- `.claude/skills/` (in the repo, outside this folder): the two Claude Code skills (`/treasurer-handoff`, `/secretary-handoff`).
- [rules.md](../00_CORE/rules.md): setup, branches, git commands, limits, seniors, guardrails, testing, updating Sean, templates.
- [review-questions.md](review-questions.md): the questions to answer before any work.
- [treasurer.md](../01_SPECS/treasurer.md): Nico's tasks, in order.
- [secretary.md](../01_SPECS/secretary.md): Ian's tasks, in order.
- [findings.md](../03_TRACKING/findings.md): the November 20 check of the hub, and the bugs found.
- [hub-map.md](hub-map.md): facts about the code: files, screens, where data is saved, paper sizes, the status chain.
- [decisions.md](../03_TRACKING/decisions.md): what Sean has already decided.
- [learnings.md](../03_TRACKING/learnings.md): surprises and pitfalls in the code.
- [blocked.md](../03_TRACKING/blocked.md): where to write anything that stops you.
- [changelog.md](../04_LOGS/changelog.md): the history of the hub, from the first build to now.
- `04_LOGS/tasks/`: one log per task, from the first look to the final pull request.
