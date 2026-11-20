# Start here

For Nico (Treasurer) and Ian (Secretary).

## What this folder is

This folder is a guide for you and your AI assistant. It helps you finish your side of the SecTreas Hub before Sean builds the backend.

Your AI reads these files and then:

- asks you simple questions about your side of the hub, on your computer and your phone,
- writes down every flaw, error and idea you find as a task,
- asks about the templates you use for your documents,
- asks if you want guardrails (rules the AI must always follow),
- helps you fix one task at a time,
- writes down every step of each task, from the first look to the final pull request, so nothing is guessed.

You stay in control. The AI asks before it does anything, and it never saves (commits), uploads (pushes) or opens a pull request for you. It gives you the commands, and you type them.

## What to do

1. Accept Sean's invite to the GitHub repository (check your email): https://github.com/SeanC1801/Sec-Treas-hub
2. Open the live hub on your computer and your phone: https://sec-treas-hub.vercel.app/
3. Start your AI and point it to this folder:
   - Claude Code (recommended):
     1. Download the code: `git clone https://github.com/SeanC1801/Sec-Treas-hub.git`, then `cd Sec-Treas-hub`
     2. Install the skills once: `mkdir -p ~/.claude/skills && cp -r Harness/02_CONTEXT/skills/* ~/.claude/skills/`
     3. Open Claude Code inside the `Sec-Treas-hub` folder and type `/treasurer-handoff` (Nico) or `/secretary-handoff` (Ian).
     - Or simply drag this Harness folder into Claude Code and type: "Read Harness/START-HERE.md and Harness/00_CORE/agents.md, and follow them."
   - Any other AI (ChatGPT, Gemini, Cursor, Copilot): give it the files in this folder, or open the `Sec-Treas-hub` folder in it, and send this:
     - "Read Harness/00_CORE/agents.md and follow it. I am [Nico, the Treasurer / Ian, the Secretary]."
4. Answer your AI's questions. Short answers are fine.
5. When you finish a task, tell Sean (your AI writes the message for you).

## Good to know

- Ask your senior before changing what a document says or looks like: Alexis for Nico, Trizy for Ian.
- Use sample data only. Never put real receipts, names or signatures into the code or the AI chat.
- Deadline: end of November 2026.

## What is inside

- [START-HERE.md](START-HERE.md): this page.
- `00_CORE/`: how to work.
  - [agents.md](00_CORE/agents.md): instructions for any AI, and which file to read when.
  - [rules.md](00_CORE/rules.md): setup, branches, the commands you type, limits, seniors, guardrails, testing, updating Sean, templates, logging.
- `01_SPECS/`: your tasks.
  - [treasurer.md](01_SPECS/treasurer.md): Nico's tasks, guardrails and templates.
  - [secretary.md](01_SPECS/secretary.md): Ian's tasks, guardrails and templates.
- `02_CONTEXT/`: facts.
  - [overview.md](02_CONTEXT/overview.md): who is who, links, and the order of work.
  - [hub-map.md](02_CONTEXT/hub-map.md): how the code is laid out.
  - [review-questions.md](02_CONTEXT/review-questions.md): the questions your AI asks you.
  - `skills/`: the two Claude Code skills.
- `03_TRACKING/`: what is known.
  - [findings.md](03_TRACKING/findings.md): the November 20 check and the bugs found.
  - [decisions.md](03_TRACKING/decisions.md): what Sean has already decided.
  - [learnings.md](03_TRACKING/learnings.md): pitfalls in the code.
  - [blocked.md](03_TRACKING/blocked.md): write here if something stops you.
- `04_LOGS/`: what has happened.
  - [changelog.md](04_LOGS/changelog.md): the history of the hub, from the first build to now.
  - `tasks/`: one log per task, started from [_TEMPLATE.md](04_LOGS/tasks/_TEMPLATE.md).
