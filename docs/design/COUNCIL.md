# The Council — four designers, one product

2026-10-21 · SecTreas Hub, Budget Request anchor, round 1 (review of v1 → direction for v2)

Four designers with genuinely different taste review the same work. The goal is not a vote or an average (that produces a third look nobody chose). Each person **owns one layer** where their taste is load-bearing, they share one token system underneath, and conflicts are settled in writing with the reason.

---

## The members

### Ines — The Editor
*Swiss/editorial typographer. Believes type and grid are the identity; decoration is what you add when you have nothing to say.*
- Loves: ledgers, columnar pads, accounting conventions, Vignelli's subway manual, Stripe Press, real paperwork.
- Hates: cards, floating panels, centered columns, pills, "friendly" question headings.
- Taste in one line: *"If it doesn't line up, it doesn't add up."*

### Kai — The Materialist
*Tactile/skeuomorphic designer who grew up on Windows 7 and the Wii. Sincere about Frutiger Aero.*
- Loves: real optics (refraction, specular rims, caustics), one consistent light source, things that physically depress, rubber stamps, Teenage Engineering.
- Hates: "glass" that is just white + blur, gloss slapped on a gradient pill, shadows that ignore where the light is.
- Taste in one line: *"Every surface should know where the sun is."*

### Rafa — The Systems Engineer
*Interaction and performance engineer. GOV.UK-level rigor, Linear-level speed (not Linear's look).*
- Loves: states, keyboard and thumb flows, offline, 60fps on a ₱6,000 Android phone, accessibility settings.
- Hates: blur on dense content, decorative motion, anything that costs frames or hides the focused field.
- Taste in one line: *"The best detail is the one that never fails."*

### Bea — The Insider
*Human-centered researcher who has been an org treasurer in a Philippine university.*
- Loves: Taglish, how orgs actually work (allotted budgets, adviser signatures, "RECEIVED" stamps, sending files in the GC), prepaid-data reality.
- Hates: Silicon Valley copy, cute puns, features that look good in a demo but don't match the paper trail.
- Taste in one line: *"Make it feel like it was made by someone from the org."*

---

## Round 1 — each member's review of v1

| | Biggest problem in v1 | Big idea for v2 | Non-negotiable |
|---|---|---|---|
| **Ines** | A pile of identical rounded cards in a centered column; nothing aligns to anything; question headings. | **The ledger.** Items live on one columnar sheet with ruled lines, a double rule before the amount column, accounting rules (single rule above a subtotal). Desktop uses the width: an editorial left rail with the activity title set big, the sheet on the right. | Content on solid paper. No cards for content. Radius small. |
| **Kai** | The glass is fake (white + blur), the gel button is a gradient pill, and shadows fall straight down while the sun sits top-left. | **One light model.** Sun top-left; every highlight top-left, every shadow down-right. Real glass only on the floating bars: specular rim, slight tint, edge refraction where the browser can do it. A **rubber stamp** when you submit. A primary button that looks like a physical key and goes down when pressed. | Glass must look like glass. Stamp stays. |
| **Rafa** | Blur on content, chips repeated in every editor, dock covering the field you're typing in, tall phone header. | **Behavior budget.** Glass on max 2 surfaces per screen; refraction Chromium-only on the dock; dock slides away while typing on phones; header collapses on scroll; every state designed; under 300ms everything. | No meaning carried by blur. Works on a cheap Android. |
| **Bea** | It speaks like a startup ("What will you spend on?", "Clear skies"). The parser can't read Taglish. It ignores the allotted budget treasurers actually work against. | **The org's paper trail.** Taglish quick add ("60 snacks tig-65", "3 kahon tubig 660"). Optional *allotted budget* with what's left. *Copy link for the Auditor* (they'll paste it in the GC). Pencil = draft, ink = final, stamp = submitted. Plain words. | Copy sounds like a real officer. Features match how orgs work. |

---

## Reconciliation (load-bearing vs decorative)

Per Veronica's team protocol: separate what changes what the product *is* (load-bearing) from surface execution (decorative); share one token layer; let load-bearing differences own territory; write the split down.

### Territories
| Layer | Owner | What they decide |
|---|---|---|
| **Content layer** (ledger sheet, official paper, typography, grid) | Ines | Layout, type scale, rules, alignment |
| **Control layer** (top bar, dock, popovers, button physics, stamp, light model) | Kai | Materials, light, depth, tactility |
| **Behavior** (states, motion budget, perf, a11y, keyboard/thumb) | Rafa | Veto on anything that costs frames or fails a state |
| **Language & features** (copy, parser, allotted budget, sharing, paper trail) | Bea | Veto on copy and on features that don't match org reality |

### Shared token layer (everyone builds on this)
Spacing 4/8/12/16/24/32/48/64 · ink/action/status colors from v1 (contrast-checked) · Montserrat UI + Plex Serif paper · one light source (top-left) · motion curves and the 300ms ceiling.

### Conflicts and how they were settled
1. **Kai wants refraction on every glass surface; Rafa says blur is expensive.** → Refraction only on the dock, Chromium only; plain blur on the top bar; solid on request. *Reason: the dock is the one object people look at constantly; the effect earns its cost there.*
2. **Kai wants to keep the Aero gel button; Ines and Rafa say the gradient pill is the #1 AI tell.** → Keep the tactility, drop the gradient: a flat deep-blue **key** with a lit top-left edge and a darker bottom edge that collapses when pressed. Radius 10, not a pill. *Reason: physical behavior is load-bearing; the gloss gradient was decoration.*
3. **Ines wants the desktop editorial rail; Rafa worries it's more elements.** → The rail *replaces* the header card and the stepper (title, details, steps, approval live there), so the count goes down, not up. Phone keeps one compact top bar.
4. **Bea wants a Messenger button; Rafa wants no third-party embeds.** → "Copy link for the Auditor" + native share sheet. Works in any app, no SDK.
5. **Ines wants no headings at all on the items step; Bea wants a little guidance.** → Column headers are the heading; guidance lives in the empty writing line's placeholder, in Taglish-friendly examples.
6. **Kai wants the sky more dramatic; Ines wants it quieter.** → Sky stays as the reference; add fine film grain (the sweep's human texture) and nothing else. It's the backdrop, not the subject.
7. **Everyone wanted to keep:** paper as the Review hero, every number once, undo over confirm, quick add.

### The concept, restated by the council
**Pencil, ink, stamp.** You write items on a ledger in *pencil* (the quick-add reads it back in gray in the right columns), press Enter and it's *inked* into the ledger, and when you submit, the paper gets a real-looking *stamp*. All of it happens under one clear sky, with glass tools floating over the paper.

---

## Round 2 — review of v2
*Appended after v2 is built (see bottom of this file).*

## Round 2 — review of v2 (anchor-budget-request-v2.html)

Checked at 1440×900, 1280×800, 1024×768, 390×844 (touch) and 360×740 (touch, solid glass); states filled, empty, needs a price, over budget, offline, submitted. Headless Chromium can't render `backdrop-filter`, so glass blur and the dock lens must be checked on a real device.

| Member | Score /10 | Strongest | Still wrong (fixed in this round unless marked *open*) |
|---|---|---|---|
| **Ines** | 8.5 | The ledger: ruled lines, a continuous double rule before Amount, subtotals with a rule above, the big activity title in the rail. It reads like a treasurer's pad, not an app. | Blank lines in the empty state put the double rule in the wrong column (fixed). *Open:* rail feels empty on very tall screens; could hold "last saved" history later. |
| **Kai** | 8.5 | The stamp. Mostly solid ink with a few gaps, rotated, beside the details, with the real date and time. Also the key button that drops 1px. | Wordmark had a glow (fixed: shadow now falls down-right like everything else). *Open:* verify the dock lens and rim on a real Chrome and Safari device. |
| **Rafa** | 8 | Dock slides away while the keyboard is up; header compacts on scroll; every state renders; nothing disabled without a reason. | Details showed "Done" when empty (fixed: shows "Incomplete"). Unit cost was half-width on phones (fixed). Phone header glass raised to 86% so scrolled text can't compete (fixed). *Open:* lens map regenerates on resize; test on a ₱6k Android. |
| **Bea** | 9 | Taglish quick add ("3 kahon tubig 660" → 3 boxes, ₱220 each), allotted budget with "₱1,370.00 over budget", "Copy link for the Auditor… paste it in your org's group chat", "Has it now", Undo send. | *Open:* real officer names on signature lines once Profile exists; confirm AUF's required document font and signatory order. |

**AI-tell recheck against the v3 forbidden list:** no glass on content, no gradient or pill buttons, no card pile, no question headings or puns, no decorative meters, no check-circle success, no glows, one light direction, one primary key per screen. Clean.

**Council recommendation:** lock v2 as the anchor once the two device checks (glass/lens on real Chrome + Safari; performance on a mid-range Android) pass.
