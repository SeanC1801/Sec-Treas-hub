# Start here

For Nico (Treasurer) and Ian (Secretary).

## What this folder is

This folder is a guide for you and Claude Code. It helps you finish your side of the SecTreas Hub before Sean builds the backend.

Claude reads these files and then:

- asks you simple questions about your side of the hub, on your computer and your phone,
- shows you all your tasks, with due dates and status, at the start of every session,
- writes down every flaw, error and idea you find as a task,
- asks about the templates you use for your documents,
- asks if you want guardrails (rules the AI must always follow),
- helps you fix one task at a time,
- writes down every step of each task, from the first look to the final pull request, so nothing is guessed.

You stay in control. Claude asks before it does anything, and it never saves (commits), uploads (pushes) or opens a pull request for you. It gives you the commands, and you type them.

## What to do

1. Accept Sean's invite to the GitHub repository (check your email): https://github.com/SeanC1801/Sec-Treas-hub
2. Download the code. In your terminal, type:
   - `git clone https://github.com/SeanC1801/Sec-Treas-hub.git`
   - `cd Sec-Treas-hub`
3. Open Claude Code inside the `Sec-Treas-hub` folder (type `claude`).
4. Type `/treasurer-handoff` (Nico) or `/secretary-handoff` (Ian). Nothing to install; the skills come with the repo.
5. Answer Claude's questions. Short answers are fine. It will ask you to open the live hub on your computer and phone: https://sec-treas-hub.vercel.app/
6. When you finish a task, tell Sean (Claude writes the message for you).

## Good to know

- Ask your senior before changing what a document says or looks like: Alexis for Nico, Trizy for Ian.
- Use sample data only. Never put real receipts, names or signatures into the code or the AI chat.
- Deadline: at the start, Claude asks you to choose Plan A (everything by Monday, November 30) or Plan B (soft deadline, before December 15). Each task then gets its due date from [timeline.md](01_SPECS/timeline.md).
- Your progress shows in [PROGRESS.md](../PROGRESS.md) at the top of the repository. It updates by itself within the hour from your task file. Never edit or commit it.
- Sean checks every finished task with a [rubric](00_CORE/rubric.md) of 8 pass/fail checks. A task only counts as finished when Sean marks it "verified". An automatic check on every pull request also makes sure your status is up to date.

## What is inside

- [START-HERE.md](START-HERE.md): this page.
- `00_CORE/`: how to work.
  - [agents.md](00_CORE/agents.md): instructions for Claude, and which file to read when.
  - [rules.md](00_CORE/rules.md): setup, branches, the commands you type, limits, seniors, guardrails, testing, updating Sean, templates, logging.
- `01_SPECS/`: your tasks.
  - [treasurer.md](01_SPECS/treasurer.md): Nico's tasks, guardrails and templates.
  - [secretary.md](01_SPECS/secretary.md): Ian's tasks, guardrails and templates.
  - [timeline.md](01_SPECS/timeline.md): every due date, up to November 30.
- `02_CONTEXT/`: facts.
  - [overview.md](02_CONTEXT/overview.md): who is who, links, and the order of work.
  - [hub-map.md](02_CONTEXT/hub-map.md): how the code is laid out.
  - [backend-proposal.md](02_CONTEXT/backend-proposal.md): the proposed database and security design.
  - [review-questions.md](02_CONTEXT/review-questions.md): the questions Claude asks you.
- `03_TRACKING/`: what is known.
  - [findings.md](03_TRACKING/findings.md): the November 20 check and the bugs found.
  - [decisions.md](03_TRACKING/decisions.md): what Sean has already decided.
  - [learnings.md](03_TRACKING/learnings.md): pitfalls in the code.
  - [blocked.md](03_TRACKING/blocked.md): write here if something stops you.
- `04_LOGS/`: what has happened.
  - [changelog.md](04_LOGS/changelog.md): the history of the hub, from the first build to now.
  - `tasks/`: one log per task, started from [_TEMPLATE.md](04_LOGS/tasks/_TEMPLATE.md).

Outside this folder, in the repo:

- [CLAUDE.md](../CLAUDE.md): tells every Claude Code session to read this harness.
- `.claude/skills/`: the two skills, [/treasurer-handoff](../.claude/skills/treasurer-handoff/SKILL.md) and [/secretary-handoff](../.claude/skills/secretary-handoff/SKILL.md).
- [PROGRESS.md](../PROGRESS.md): the progress table Sean reads (rebuilt automatically).
- [rubric.md](00_CORE/rubric.md): how Sean checks your work.
