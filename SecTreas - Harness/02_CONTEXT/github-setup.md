# GitHub setup (Sean only, once)

Router: [agents.md](../00_CORE/agents.md). Rules: [rules.md](../00_CORE/rules.md), part 13.

The repository is public (https://github.com/SeanC1801/Sec-Treas-hub), so these protections are free. Do them once, after the `.github/` folder is pushed to `main`. Nico and Ian do not need to read this.

## 1. Give Nico and Ian write access

Settings → Collaborators → add each GitHub account with the **Write** role. They need it to push their branches. The rules below stop them from pushing to `main`.

## 2. A token so the Progress Action can update main

The Action that rebuilds PROGRESS.md must push to `main`, which will be protected. It pushes as you, using a token only it can read.

1. Your GitHub profile → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
2. Name: `sectreas-progress`. Expiration: 90 days (set a reminder to renew it).
3. Repository access: **Only select repositories** → `Sec-Treas-hub`.
4. Permissions → Repository permissions → **Contents: Read and write**. Nothing else.
5. Generate, and copy the token.
6. Repository → Settings → Secrets and variables → Actions → New repository secret. Name: `PROGRESS_TOKEN`. Paste the token.

The Progress workflow runs only from `main` (after merges, hourly, or by hand), so the token is never exposed to an officer's branch.

## 3. Protect main with a ruleset

Repository → Settings → Rules → Rulesets → New ruleset → New branch ruleset.

1. Name: `protect main`. Enforcement: **Active**.
2. Bypass list: add **Repository admin** (you, and the Action through your token).
3. Target branches: **Include default branch**.
4. Turn on:
   - Restrict deletions
   - Block force pushes
   - Require a pull request before merging (required approvals: 0 is fine, since you merge yourself)
   - Require status checks to pass → add the check **harness-check** (it appears in the list after the check has run once on any pull request)
5. Save.

Now Nico and Ian can only change `main` through a pull request, and a red harness check blocks the merge.

## 4. Check that it works

1. Actions tab → **Progress** → Run workflow. PROGRESS.md on `main` should update (or say it is already up to date).
2. Ask Nico or Ian to open their first pull request. The **Harness check** should appear on it. If it fails, its summary says what to fix in plain words.

## How you verify a task

1. Open the pull request. The harness check must be green.
2. Go through the 8 checks in [rubric.md](../00_CORE/rubric.md).
3. If all 8 pass: merge the pull request, then on `main` set the task to `- Status: verified YYYY-MM-DD` in the officer's task file (you can edit it on GitHub and commit straight to `main` as an admin).
4. If any fail: do not merge. On the officer's branch, set `- Status: returned YYYY-MM-DD: <what to fix>`, and comment on the pull request.
5. PROGRESS.md updates within the hour (or run the Progress workflow by hand).

Only your account may write "verified". The harness check fails any pull request that does it, including if you add it inside an officer's pull request, so always verify on `main` after merging.
