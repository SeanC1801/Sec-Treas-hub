# Rules for Nico, Ian and their AI assistants

Back to: [overview.md](../02_CONTEXT/overview.md). Next: [review-questions.md](../02_CONTEXT/review-questions.md).

## Part 1. Seeing the hub

There are two ways to open the hub. Use the first one unless you are testing your own changes.

### A. The live hub (start here)

- Open https://sec-treas-hub.vercel.app/ on desktop and on your phone. No login is needed.
- It shows the latest `main` on GitHub. It does not show changes you have made on your computer but have not merged yet.
- On the sign-in screen, choose "Test Officer" (the default) and press "Continue with Google". Nothing is sent to Google yet; this is a draft.
- Use the Treasurer / Secretary switch at the top of the Events page to see your side.

### B. Localhost (for your own changes)

Use this once you start changing code, because your changes are not on the live hub until Sean merges them.

1. Ask Sean to add your GitHub account as a collaborator on https://github.com/SeanC1801/Sec-Treas-hub.
2. Install Node.js 20 or newer and Git.
3. Type these in your terminal:
   - `git clone https://github.com/SeanC1801/Sec-Treas-hub.git`
   - `cd Sec-Treas-hub`
   - `npm install`
   - `npm run dev`
4. Open http://localhost:5173 on your computer.
5. To open localhost on your phone: type `npm run dev -- --host` instead, then open the "Network" address it prints (like `http://192.168.1.5:5173`) on a phone on the same Wi-Fi.
6. Before you make a pull request, type `npm run build` and make sure it finishes without errors.

## Part 2. Branches, commits and pull requests

Nico and Ian edit some of the same files (`src/hub.js`, `src/hub.css`, `src/styles.css`), so each task gets its own branch.

What the AI may do (after asking you first):

- Update `main` and create the branch for a task:
  - `git checkout main`
  - `git pull`
  - `git checkout -b treasurer/T1-tracker-buttons` (Nico) or `git checkout -b secretary/S1-minutes-bar` (Ian)
- Make the code change.

What the AI must never do: commit, push, or open the pull request. It writes the exact commands for you, and you type them yourself. Like this:

1. See what changed: `git status`
2. Add the changed files: `git add src/hub.css` (the AI lists the exact files)
3. Commit: `git commit -m "Budget Tracker: make the Open buttons easier to tap"`
4. Push: `git push -u origin treasurer/T1-tracker-buttons`
5. Open the pull request on GitHub:
   - Go to https://github.com/SeanC1801/Sec-Treas-hub
   - Press "Compare & pull request" on your branch
   - Base: `main`. Paste the description the AI wrote for you.
6. The pull request description says:
   - which task it is (like "T1"),
   - what changed,
   - how you checked it on desktop and on phone,
   - desktop and phone screenshots,
   - whether your senior validated it,
   - whether it is final (no flaws or errors on your localhost) or still in progress.

Other rules:

- Branch names: `treasurer/T<number>-<short-name>` for Nico, `secretary/S<number>-<short-name>` for Ian.
- Never push to `main`. It goes live on Vercel straight away.
- Never merge your own pull request. Sean reviews and merges.
- If your branch has conflicts with `main`, ask the AI for the commands to fix them, or ask Sean.

## Part 3. What not to touch

- No backend: no Supabase, servers, databases, sign-in providers or API keys. Sean is designing the backend and its security separately.
- No real data. Use sample receipts, sample invoice numbers and sample amounts only. No real purchases, phone numbers, student numbers or ID photos in the code.
- Do not change document formats (letterhead, page sizes, Arial on documents, the approval chain Draft → President → Adviser → CSC Treasurer → CSC) without your senior's and Sean's yes.
- Do not add a new library or package without asking Sean first.
- Keep the design rules: sky background, paper cards, glass only on controls, Montserrat for the app, status always written in words (never colour alone), buttons at least 44 px to tap.
- Stay in your own files unless your task says otherwise:
  - Nico (Treasurer): `src/prototype.js`.
  - Ian (Secretary): `src/minutes.js`, `src/minutes.css`, `src/certs.js`, `src/certs.css`.
  - Shared, change carefully: `src/hub.js`, `src/hub.css`, `src/styles.css`, `index.html`.

## Part 4. How the AI talks to you

1. First it asks: "Are you Nico (Treasurer) or Ian (Secretary)?" If it is anyone else, it stops and asks them to talk to Sean.
2. It asks one question at a time and waits for your answer.
3. Every question is short and simple, and comes with an example answer, like:
   - "Is any button hard to press on your phone? Like: 'the Open button in Budget Tracker is too small.'"
4. When you ask the AI something, it answers in simple words and gives an example too, like:
   - You: "What is a branch?" AI: "A separate copy of the code for one task, like a draft folder, so your work does not mix with Ian's."
5. It asks before every step: before the plan, before creating the branch, and before changing files.
6. It never commits, pushes or opens the pull request. It gives you the commands to type (part 2).
7. If anything is unclear, it asks. It does not guess.

## Part 5. Validation from your senior

So the org knows what is changing, ask your senior before some steps:

- Nico asks Alexis (senior Treasurer). Ian asks Trizy (senior Secretary).
- Ask your senior:
  1. Before starting a task that changes what a document says or looks like (like the PDF and Word downloads, or wording on a printout).
  2. Before you mark a pull request as final.
- The AI reminds you and writes a short message you can send, like:
  - "Hi Alexis, I'm working on T3: downloading the Budget Request as PDF. It will look the same as the printout. Is that okay with you?"
- Write your senior's answer in the pull request (like "Validated by Alexis on Nov 22").
- If your senior says no or wants changes, tell the AI and add it to your task file.

## Part 6. Your guardrails

Before your first task, the AI asks: "Would you like to add guardrails to your work? Like: 'never delete a file', 'only touch my own files', 'show me every change before saving it'."

- Your answers go in "My guardrails" at the top of your task file, so the AI follows them every time.
- Examples you can pick from:
  - Never delete a file.
  - Only change files in my section (part 3).
  - Show me each change before saving it.
  - Ask me before installing anything.
  - Stop and ask if a task needs more than 3 files.
  - Remind me to ask my senior before any change to a document.
- You can add, change or remove guardrails at any time. Just tell the AI.

## Part 7. How to check your change

Check every task on both sizes, on localhost:

1. Desktop: a browser window at least 1280 px wide.
2. Phone: the browser's device mode at 375 px wide (in Chrome: right-click, Inspect, then the phone icon), and on your real phone if you can (part 1B, step 5).
3. On both sizes, check:
   - every button you touched can be seen and pressed, and nothing covers it,
   - nothing runs off the right edge of the screen,
   - the bottom bar (Continue, Print) stays at the bottom while you scroll,
   - the last field on the page can be scrolled above the bottom bar,
   - the browser console (F12, Console) shows no red errors.
4. Take a desktop screenshot and a phone screenshot for the pull request.

## Part 8. Updating Sean

Every time you open a pull request, tell Sean in two places:

1. A comment on the pull request that mentions Sean (@SeanC1801), like:
   - "@SeanC1801 T1 is ready. Final: yes, no flaws or errors on my localhost (desktop and phone). Validated by Alexis."
   - or: "@SeanC1801 T1 is ready for a look. Final: not yet. Still to do: the button looks small on my phone."
2. A short direct message to Sean with the link, like:
   - "Hi Sean, I opened the PR for T1 (Budget Tracker buttons): <link>. It's final, no flaws or errors on my localhost."

"Final" means: you checked it on localhost on desktop and phone, you found no flaws or errors, and your senior validated it if the task needed it. The AI writes both messages for you; you send them.

## Part 9. Templates for your documents

The hub makes each document from a template. If you use a template the hub does not match yet, the hub has to change, so tell the AI.

1. The AI asks about your templates during the review ([review-questions.md](../02_CONTEXT/review-questions.md), step 6).
2. Each template is written under "My templates" in your task file with:
   - its name (like "CSC Budget Request form"),
   - which document it makes,
   - where it is (a Google Drive link, a file, or "printed copy with Alexis"),
   - which version it is, and who gave it to you,
   - what is different from what the hub prints now.
3. Check with your senior that it is the newest version (Alexis for Nico, Trizy for Ian).
4. If a template file needs to go into the code:
   - use a blank copy: remove real names, amounts, receipts, signatures and student numbers first,
   - put it in `docs/templates/treasurer/` (Nico) or `docs/templates/secretary/` (Ian),
   - ask Sean before adding it, because the repository holds the chapter's documents.
5. Never paste a filled document with real data into the code or into the AI chat. Describe it, or use a blank copy.
6. Every difference between your template and the hub becomes a task in your task file. Ask your senior before changing how a document looks ([rules.md](rules.md), part 5).

## Part 10. Logging your work (so nothing is guessed)

Every task is written down from the first look to the final pull request. This keeps a true record, so you, Sean and any AI can see what really happened.

1. Before each session, the AI reads [changelog.md](../04_LOGS/changelog.md) and the task's log in `04_LOGS/tasks/`.
2. When a task starts, the AI copies [_TEMPLATE.md](../04_LOGS/tasks/_TEMPLATE.md) to `04_LOGS/tasks/<branch name>.md` (like `T1-tracker-buttons.md`).
3. The AI fills in each part as it happens:
   1. Initial: how it looks before any change, with proof (a file and line, or the screen and size).
   2. Plan: what will change, and your yes.
   3. Senior check: what you asked your senior, and their answer.
   4. Changes: one line per change, with the file and why.
   5. Checks: desktop, phone, console, `npm run build`, and anything not checked.
   6. Commands: the git commands it gave you to type.
   7. Final: the pull request link, whether it is final, and whether Sean was told.
4. When you open the pull request, the AI writes the entry for [changelog.md](../04_LOGS/changelog.md), using the format at its end. The task log and the changelog entry go in the same pull request.
5. Rules for what goes in a log:
   - Only what was seen or said: give the file path, the command output, the screen and size, or quote the person.
   - If something was not checked, write "not checked". Never write "works" without checking.
   - Never invent results, approvals, links or data.
   - If you are blocked or unsure, write it in [blocked.md](../03_TRACKING/blocked.md) and stop.
6. New surprises in the code go in [learnings.md](../03_TRACKING/learnings.md). New decisions from Sean go in [decisions.md](../03_TRACKING/decisions.md).
