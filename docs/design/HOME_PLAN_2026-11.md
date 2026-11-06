# SecTreas Hub — Home: trend sweep, audit and improvement plan

**Status:** decisions agreed 2026-11-06 (see §9) · not built yet
**Method:** Veronica pipeline (classify → ground → audit → references → lock) + a fresh trend sweep.
**Scope:** the Home tab only, for all four roles (Treasurer, Secretary, President, Adviser). Events and Profile stay as they are unless a decision below says otherwise.

---

## 0. Classification (said out loud so it can be corrected)

- **Type:** hybrid, about 60% task dashboard and 40% consumer-mobile. It's a work tool (scan, act, done) used on personal phones by students, where feel matters too. Clarity comes first, and personality goes where it costs nothing to scanning.
- **Mode:** Audit of the current Home, then a plan. No build yet.
- **Context:** team (Heaven as lead, with Jaeda, Nico and Jums; the design council in `COUNCIL.md`).
- **Speed:** locked pipeline. There are weeks left, and real documents get built against this.
- **Grounding:** `DESIGN_BRIEF.md` v3 ("pencil, ink, stamp", sky / paper / glass), `UX_MAP.md`, `design-taste.md`, and the earlier `TREND_SWEEP_2026-10.md`.

**The one job of Home**, as we'll use it to judge every idea below:
> *Open the hub and know, in about three seconds, the one thing you should do next, then do it in one tap.*

---

## 1. Audit of the current Home (what's actually there today)

| # | Finding | Where | Why it matters | Severity |
|---|---|---|---|---|
| A1 | **Four headings of equal weight** (To do, Your tools, Coming up, Your role) stacked as full-width colour bands | Whole page | Nothing tells the eye what matters first, so the page reads like an FAQ accordion. This is the "no information hierarchy" tell. | High |
| A2 | **No time dimension.** The to-do list has no due dates, "overdue" or "today". | To do | The chapter's own Sep 11 minutes say liquidation is due *the day after the event* and budget requests by a set Monday. Home ignores the thing officers are actually chased about. | High |
| A3 | **"Good afternoon, Alexis"** greeting above a generic list | Header | The greeting-plus-stack opening is the stock dashboard opening. It's friendly but says nothing specific. | Medium |
| A4 | **Repetitive to-do rows** ("Finish and send · …" ×5), all the same weight | To do | When everything looks the same, nothing gets done first. The verb repeats instead of the situation being described. | Medium |
| A5 | **Tools hidden in an accordion inside an accordion** (section ▸ tool ▸ in-progress list ▸ "New…") | Your tools | Starting a budget takes 3–4 taps and some guessing. Collapsed by default means unseen by default. | Medium |
| A6 | **The money is buried.** The semester excess (₱158.55) only shows as a small line under the Liquidation tool. | Your tools | It's the Treasurer's one number, and the GCash pattern every student knows puts it first. | Medium |
| A7 | **No "what changed".** Nothing shows that the Adviser noted your budget at 2:41 PM. | — | Officers currently learn this from the group chat, and the hub should replace that. | Medium |
| A8 | **The role guide is a permanent section** | Bottom | Onboarding content that stays forever turns into noise. It should be first-run only. | Low |
| A9 | **No way to nudge someone.** You see "With Adviser" but can't do anything about it. | Statuses | The real-world move is to message the Adviser in the group chat. The hub could prepare that message. | Medium |
| A10 | **Sample data dominates** (5 identical LR drafts) | To do | The page is designed around fake data, not a real week. We should test with real chapter data. | Process |

What already works and stays: the glass bar, paper surfaces, the stamp concept, the role switch on Home only, and the cyan To do colour from the letterhead.

---

## 2. Trend sweep — November 2026 (what top teams are doing, and what it means for us)

**Task "Today" homes have converged on one list ordered by urgency, not separate sections.** Todoist's Today view puts everything due today across all projects in one list ([Todoist](https://www.todoist.com/de/help/articles/team-members-find-your-way-in-lesson-4-make-it-part-of-your-day-dejqdxASO)). Sunsama's Today view is "the view you have open most of the day" ([Sunsama](https://help.sunsama.com/docs/usage-guides/today-view)). Linear's *My Issues* uses a **Focus** grouping, ordered by what you'd want to work on first: urgent first, then SLA-bound ([Linear docs](https://linear-web.pages.dev/docs/my-issues)). Things 3 splits *Today* and *This Evening* within one screen ([9to5Mac](https://9to5mac.com/2017/05/18/things-3-mac-iphone-ipad-watch/)).
→ *For us:* replace the four equal sections with **one Focus-ordered list**.

**Students already know a due-date to-do model.** Google Classroom's To-do page has *Assigned / Missing / Done*, ordered by due date, and every title links straight to the work ([Alice Keeler](https://alicekeeler.com/2021/03/22/students-find-missing-work-in-google-classroom/), [Perkins](https://www.perkins.org/resource/google-classroom-using-nvdajaws-part-3/)).
→ *For us:* borrow the **honest "Missing/overdue" bucket and due-date grouping**. Our officers use Classroom every day.

**Government services use task lists for long, multi-session work** with plain status tags (Not started / In progress / Completed) ([GOV.UK Design System](https://design-system.service.gov.uk/patterns/complete-multiple-tasks), [HMRC status tags](https://design.tax.service.gov.uk/hmrc-design-patterns/status-tags-in-task-list-pages)).
→ *For us:* each event is a small task list (Budget → Liquidation → Certificates → Minutes). Show it as a **compact status strip**, not prose.

**Emphasis beats uniformity, and it's measured.** Google's Material 3 Expressive research reports people found key elements up to 4× faster on some actions. A 48-person study found 33% faster fixation and 20% faster task completion, and older users reached parity with younger ones ([Android Authority](https://www.androidauthority.com/google-material-3-expressive-details-3554486/), [UX Tigers](https://www.uxtigers.com/post/ux-roundup-20260831)). Most of our users are on Android.
→ *For us:* **one visually dominant "next" action**, larger and coloured, instead of equal rows.

**Home should resume work first and show metrics second.** Cloudflare's account home is the pattern-library example ([SaaSFrame](https://www.saasframe.io/patterns/dashboard?fefca4bb_page=1)). E-wallets like GCash lead with the balance and the two or three most-used actions ([NoypiGeeks](https://www.noypigeeks.com/apps-games-softwares/gcash-app-new-look/), [VP0](https://vp0.com/blogs/gcash-ui-clone-figma)).
→ *For us:* a next action at the top, the money as one honest number, and no stat-card row.

**Empty states and onboarding** should invite rather than look like errors, use short checklists placed where the empty space is, and stay skippable and out of the way ([Userpilot](https://userpilot.com/blog/progressive-disclosure/), [Design Project](https://www.newsletter.designproject.io/p/onboarding-ux-design-guide)).
→ *For us:* the role guide becomes a **first-run "Get set up" checklist** that disappears when done.

**"Human" is the counter-trend to AI polish.** Agencies call it *anti-AI crafting*, *naive design* or *intentional imperfection*: visible handwork and "human labour signals". The stress is on *intent*, not sloppiness ([Creative Bloq](https://creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026), [DesignRush](https://www.designrush.com/best-designs/print/trends/naive-design-trend-2026), [GDJ review](https://graphicdesignjunction.com/2026/08/did-the-2026-web-design-trends-predictions-come-true/)). Caveat: this is mostly established in print and branding, less as a UI system.
→ *For us:* we already have the right metaphor (pencil, ink, stamp). Use it on Home's **completion moments**, not as decoration.

**Current AI-UI tells to avoid** (checked Nov 2026; nothing new since the Sep list). The left-border accent card is still the most recognised tell. Also: hairline border plus wide shadow, Inter/Geist/Space Grotesk/Instrument Serif by default, purple or blue gradients, and stock placeholder names ([Impeccable "slop"](https://924b8765.impeccable-2rv.pages.dev/slop), [Built In](https://builtin.com/articles/ai-design-slop-era), [Noqta](https://noqta.tn/blog/ai-design-slop-overused-ui-patterns-fix-2026)). The trap for *our* Home is the **"Good morning, Name" + stat cards + quick-action grid** dashboard, the same skeleton as every generated admin home.

---

## 3. How the professionals would do this (methods we'll copy)

| Method | Who uses it | How we apply it (this month) |
|---|---|---|
| **Top-tasks analysis** | Gerry McGovern; gov.uk | Each officer ranks 10 candidate Home tasks in a 5-minute form. Whatever lands in the top 3 owns the screen. |
| **Jobs-to-be-done, per role** | Intercom, Basecamp | One sentence per role: "When ___, I want to ___, so I can ___". These are already drafted in §5. |
| **Content-first, with real data** | Mailchimp, gov.uk ("no lorem ipsum") | Load the real first-semester events, deadlines and statuses before judging the layout (fixes A10). |
| **Service blueprint of the approval chain** | IDEO, service designers | Map who holds a document at each stage and how they're reminded today (the group chat). That gives the "Nudge" feature (§4.6). |
| **Heuristic evaluation** (Nielsen's 10) | NN/g | A 30-minute pass on the new Home before testing. |
| **5-user think-aloud test** | NN/g ("5 users find ~85% of issues") | Alexis, Nico, Trizy, Ian and one non-officer, on their own phones, with 3 tasks each. Time-to-task is measured against UX_MAP's "under 5 minutes" goal. |
| **Design council critique** | Already in `COUNCIL.md` | Ines, Kai, Rafa and Bea review the anchor before it locks. |
| **Accessibility check, WCAG 2.2 AA** | Everyone serious | Contrast at the worst moment, 44 px targets, status never shown by colour alone. |

**How we make it feel human** (from the research, turned into rules we can check):
1. **Specific over general.** Use real names, amounts and dates on every line ("Ms. Pantig noted it · Nov 4, 2:41 PM"), never "Your document was updated".
2. **A voice.** Copy written officer-to-officer, plain and occasionally Taglish where the chapter really talks that way (Bea's veto). It's never cute and never startup copy.
3. **Intentional imperfection with a source.** Hand-made marks only where a real object would have them: the rubber stamp, a pencil tick, a torn ledger stub. Never random wobble.
4. **Moments, not motion.** One satisfying moment per completed task (inked, then stamped) and nothing ambient.
5. **Made with the users.** The five-person test and top-tasks vote above. A human process produces human output.

---

## 4. References, and what we take from each ("steal like an artist")

Kleon's rule as we'll use it: **good theft studies, credits, steals from many, and transforms; bad theft skims one source and imitates its surface** ([CreativeLive / Kleon](https://www.creativelive.com/blog/why-stealing-is-creative/), [TED transcript](https://www.ted.com/podcasts/why-stealing-other-peoples-ideas-can-be-a-good-thing-transcript)). So for each reference we take the *thinking*, never the look, and remix it into pencil, ink and stamp.

| Reference | What we take (the thinking) | What we leave (the surface) | Our transformation |
|---|---|---|---|
| **Google Classroom To-do** | Due-date grouping and an honest *Missing* bucket that students already understand | Google's cards and grey UI | Our to-do list grouped **Overdue · Today · This week · Later**, with overdue in sun-orange plus the words "overdue · was due Sep 29" |
| **Linear "Focus"** | One list sorted by what you'd do first | Dark, dense, monospace | Ordering rule: *returned → overdue → due today → waiting on you → this week* |
| **Things 3 Today / This Evening** | Two buckets on one calm screen; finishing feels good | The checkbox animation | Finished items get **inked and stamped "DONE"** and stay in a small "Done today" tray until tomorrow |
| **GOV.UK task list** | Plain status tags per sub-task | The gov styling | Each event as a 4-mark **ledger strip**: B · L · C · M, each pencil (not started), ink (in progress) or stamped (done), with words for screen readers |
| **GCash home** | Lead with the one number and the 2–3 main actions | The fintech gradient card | The Treasurer's **fund stub**: a torn ledger slip with "Semester excess ₱158.55 · 2 events over budget", tapping into the tracker |
| **Material 3 Expressive** | Size and colour emphasis on the one key action, measured to be faster | Blobby shapes | A **Next up** slip: the single most urgent task, larger, with our pressable key |
| **Messenger group chat** (where the chapter actually coordinates) | Reminders happen in the group chat, by a person | — | **"Remind them"**: prepares a short polite message plus a link to paste into the group chat (no SDK, no auto-send) |
| **Sunsama daily planning** | A ritual that starts the day | Calendar-heavy layout | A quiet date line: "Fri, Nov 6 · Week 12 of the 1st semester · Hackathon in 15 days" |

---

## 5. Jobs-to-be-done per role (draft, to be confirmed by the top-tasks vote)

- **Treasurer:** When I open the hub between classes, I want to see what's due or returned and fix it in one tap, so the chapter's money paperwork is never late.
- **Secretary:** After a meeting or before an event, I want to start the minutes or certificates quickly, so nothing waits on me.
- **President / Adviser:** When something needs my signature, I want to see it, check it and sign it, so I'm not the bottleneck.
- **Everyone:** I want to know what changed since I last looked, without scrolling the group chat.

---

## 6. Proposed Home (the anchor to build once agreed)

Top to bottom on a phone (desktop puts 1–2 in the left rail and 3–6 in the sheet):

1. **Date line + name.** "Fri, Nov 6 · Week 12, 1st semester" over "Alexis · Treasurer". It replaces the "Good afternoon" greeting with something specific. *(fixes A3)*
2. **Next up**, the one dominant slip. It shows the single most urgent thing: what, why and when ("Liquidate **Code in the Dark** · the event was Sep 28; due the next day"), with one big key. When nothing's due it says "Nothing due. Next: Hackathon budget, due Nov 14". *(fixes A1, A4)*
3. **To do**, Focus-ordered and due-grouped. Groups are **Overdue · Today · This week · Later**, and each row shows a verb, the document and the due date. Rows waiting on someone else offer **Remind them**. Done items show inked and stamped, then move to "Done today". *(fixes A2, A9)*
4. **Your money** (Treasurer only): the fund stub. **Last meeting** (Secretary only): "Sep 11 minutes · final · 13 present", plus "Start minutes". *(fixes A6)*
5. **Coming up**: the next 3 events, each with its B · L · C · M ledger strip. Tapping one opens it in Events. *(GOV.UK + Events tab)*
6. **Since you were last here**: up to 3 changes by others ("Ms. Pantig noted the Hackathon budget · 2:41 PM"). *(fixes A7)*
7. **Start something**: two plain buttons for the role ("New budget request", "Liquidate an event" / "New minutes", "New certificate batch"). This replaces the nested tool accordion. *(fixes A5)*
8. **Get set up** (first run only, then gone): check signatories, add officer emails, try the sample. *(fixes A8)*

**What we remove:** the four equal colour bands and the collapse-by-default accordion. Headings become typographic again (the ledger style the council liked), and colour is kept for meaning: cyan = needs you, sun = overdue, leaf = done, stamp blue = submitted.

**Motion budget:** the count-up of the fund number (240 ms), the stamp on completion (220 ms, once), and nothing else. Reduced motion keeps opacity only.

**Counter-audit of this plan against the tells:** no stat-card row (the money is *one* line on a paper stub); no left-stripe status cards (status is tag + words); no greeting cliché; no uniform motion; no generic numbered steps (the ledger strip is a real sequence); real data before judging. *Still at risk:* the "Next up" slip could drift into a hero card. Keep it paper, keep it a single line plus one key.

---

## 7. Decisions we need to agree on before building

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Replace the four equal sections with one Focus-ordered to-do list | yes / keep sections | ✅ **Agreed 2026-11-06:** one list grouped by due date (Overdue · Today · This week · Later) |
| D2 | Add due dates. Liquidation = day after the event (from the chapter's minutes). Budget request due = ? | event − 7 days / set per event / none | ✅ **Agreed 2026-11-06:** the Treasurer sets each budget deadline by hand, with no default. Budgets without one go in a "No due date" group at the end (as in Google Classroom). |
| D3 | "Next up" slip at the top | yes / no | ✅ **Agreed 2026-11-06: no slip.** The list's first row is the most urgent. §6 item 2 is dropped. |
| D4 | Treasurer fund stub (Semester excess) on Home | yes / no | ✅ **Agreed 2026-11-06: no.** The money stays on the Liquidation tool and tracker only. §6 item 4 is dropped, including the Secretary's "Last meeting" slip (confirmed 2026-11-06). |
| D5 | "Remind them" message for the group chat | yes / no / later | ✅ **Agreed 2026-11-06: "Copy link" only.** It copies a link straight to the document, with no prepared message. ⚠️ Until the backend exists, a link opens the hub but the document lives only on the sender's phone. |
| D6 | "Since you were last here" feed (3 items) | yes / no | ✅ **Agreed 2026-11-06: yes**, up to 3 changes by others, hidden when there's nothing new |
| D7 | Completion moment: ink, stamp "DONE", "Done today" tray | yes / no | ✅ **Agreed 2026-11-06:** stamp once (220 ms) plus a "Done today" tray until tomorrow |
| D8 | Drop the colour bands on Home for typographic headings, with colour only for meaning | drop / keep bands | ✅ **Agreed 2026-11-06:** plain ledger headings on Home. Events keeps its month bands. The ACM cyan stays as the "needs you" accent (e.g. the To do count), not as a band. |
| D9 | Role guide becomes a first-run "Get set up" checklist | yes / keep permanent | ✅ **Agreed 2026-11-06:** a first-run checklist, skippable, with "How the hub works" moved to Profile |
| D10 | Copy voice: plain English with occasional Taglish | English only / light Taglish | ✅ **Agreed 2026-11-06: plain English only**, specific and officer-to-officer, no Taglish |
| D11 | Run the top-tasks vote and the 5-user test before locking | yes / skip | ✅ **Agreed 2026-11-06: skip both.** Build it, then adjust from the officers' feedback on the Vercel link. |

**Open questions:**
- Who decides budget request deadlines, the Treasurer or the CSC calendar?
- Should "Remind them" be allowed for the CSC officers who don't use the hub?
- Is a week number ("Week 12") meaningful to AUF students, or should it just be the date?

---

## 8. Rough effort once agreed

- To do engine with due dates, Focus order, Next up and the Done tray: about 1 day
- Fund stub, Last meeting, Coming up strips: about ½ day
- Changes feed and Remind them: about ½ day
- Get set up, copy pass, motion: about ½ day
- Testing (top tasks + 5 users) and fixes: about 1 day

This is front-end only, on today's on-device data. All of it maps 1:1 onto the backend later.

---

## 9. Agreed Home (the version to build)

Phone, top to bottom (desktop puts 1 in the left rail):

1. **Date line + name.** "Fri, Nov 6 · 1st semester", then "Alexis · Treasurer". *(The week number is still open; leave it out unless confirmed.)*
2. **To do.** One list grouped **Overdue · Today · This week · Later · No due date**, most urgent first. Each row shows a verb, the document and its due date. Liquidation is due the day after the event; budget deadlines are set by hand per event. Rows waiting on someone else have **Copy link**. Finished items are stamped "DONE" once and sit in **Done today** until tomorrow. The count uses the ACM cyan accent.
3. **Coming up.** The next 3 events, each with its B · L · C · M ledger strip, opening in Events.
4. **Since you were last here.** Up to 3 changes by other officers, hidden when nothing is new.
5. **Start something.** Two plain buttons for the role.
6. **Get set up.** First run only, skippable. "How the hub works" moves to Profile.

Plain ledger headings, with colour only for meaning (overdue sun, done leaf, needs-you cyan). Plain English copy. No money slip, no "Next up" slip, no colour bands, no permanent role guide. Testing happens after building, from feedback on the live link.

**Needs a small addition to Events/Budget Request:** a "Budget due" date field per event, set by the Treasurer (D2).
