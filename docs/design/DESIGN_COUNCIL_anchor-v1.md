# Design Council — Anchor v1 (Budget Request: Details → Items → Review → Submitted)

2026-10-21 · Checked by eye at 1440×900, 1280×800, 390×844 and inside a 370px phone frame; states Filled, Empty, Needs a price, Offline, Solid glass; keyboard focus pass. No console errors.
Note: the headless test browser doesn't render `backdrop-filter`, so screenshots show glass without blur. Panels were made ≥80–90% opaque so legibility never depends on the blur; check the real blur on an actual phone.

## What changed from v0, and why it's no longer overwhelming

| v0 | v1 | Principle |
|---|---|---|
| 6 zones on screen (sidebar, header, 3 cards, preview, total bar) | 3 zones: header, one task, dock | Focus mode; fewer simultaneous choices (Hick's law) |
| Same numbers shown 3× (rows, breakdown card, paper) | Every number once: row amount, category subtotal, dock total | Single source of truth |
| 5-field form per item | One sentence: "60 packs snacks at 65", shown back as chips before adding | Recognition over recall; error prevention |
| Activity + items + preview on one screen | Details → Items → Review, one job each | Progressive disclosure (NN/g) |
| Separate phone sheet and desktop table | One inline row editor on every size | Consistency; less to build |
| Approval chip on every step | Approval only on Review | Show it where the decision happens |

## 5 strongest aspects

1. **Structure, not styling, fixed the overwhelm** (information hierarchy). Three zones and each number once.
2. **Quick add is the most "top 1%" piece** (interaction clarity). It reads the sentence back as chips, guesses the category, and lets you override it before adding. "3 cases of water for 660" correctly becomes ₱220.00 each.
3. **Materials carry meaning** (distinctiveness). Sky = background, glass = tools, paper = the official output. The Review step makes the paper the hero, which is exactly what officers need to trust.
4. **The concept does work** (concept). The cloud is the save indicator; offline is a cloud with a slash; the empty state is a lone cloud with "Clear skies." Decoration and status are the same object.
5. **Small details are handled** (accessibility, craft). Total counts up in tabular figures without jitter; primary button never disabled (it explains and points to the problem); undo instead of confirm; solid-glass fallback for reduced transparency; round focus rings visible on sky and glass; `/`, `Enter`, `Esc`, `Ctrl/⌘+Enter` shortcuts on desktop.

## 10 most important problems, in priority order

1. **Quick add only understands English phrasing.** Officers may type Taglish ("60 snacks tig-65", "3 case tubig 660"). *Principle: match the user's language.* Fix: add Filipino patterns (tig-, piraso, kahon, tubig) and test with 2–3 real officers; until then, the "Reads as" preview keeps mistakes visible before they're added.
2. **On phones, the keyboard plus the dock can cover the field being edited.** *Principle: never obscure the focused element.* Fix: hide the dock while an input is focused on touch devices; bring it back on blur.
3. **The phone header is tall (~130px) for the whole session.** *Principle: content over chrome.* Fix: collapse to a one-line header (title + progress bar) after scrolling 24px.
4. **Paper on phone Review is small text with no zoom.** *Principle: legibility.* Fix: tap the paper to open it full-screen with pinch-zoom.
5. **Glass blur on low-end Android phones may cost battery and frame rate** (the main real-world complaint about Liquid Glass). *Principle: performance is UX.* Fix: test on a mid-range Android; if it stutters, default those devices to the solid variant (already built).
6. **Native date field shows US format (11/21/2026).** *Principle: match the real world.* Fix: a date picker that displays "Sat, Nov 21, 2026".
7. **"Each one gets notified" promises something not designed yet.** *Principle: honest copy.* Fix: keep only if notifications ship in v1; otherwise say "Each one sees it in their Library."
8. **The share-of-total meter may be noise for most officers.** *Principle: signal-to-noise.* Fix: ask Nico if the percentage helps budget review; drop it if not.
9. **Two ways to add an item (sentence and separate fields).** *Principle: one obvious way.* It's justified as an accessibility fallback; watch in testing whether anyone uses it, and keep it low-key.
10. **The wordmark sits directly on the sky.** Logos are exempt from contrast rules and it now sits on the darker sampled corner, but check it on a cheap, dim phone screen.

## Unnecessary
- Nothing major. The kicker "Budget request · step 2 of 3" repeats what the progress bar shows; could drop "step 2 of 3".

## Missing (designed later, by plan)
- Home, Library, Liquidation, Minutes, Certificates (Phase E, after lock).
- Export-failed and returned-by-Auditor states.

## Drift toward generic
Low. The risky parts of Aero (bubbles, orbs, glass everywhere) were left out on purpose. If the sky were removed it would still read as this product because of the quick add, the paper, and the peso-specific details.

## Rubric (quick read)

| # | Category | Read |
|---|---|---|
| 1 | Information hierarchy | Strong |
| 2 | Visual hierarchy | Strong; one gel button per screen |
| 3 | Alignment | Good |
| 4 | Spacing | Fixed: scale only (4/8/12/16/24/32/48/64) |
| 5 | Typography | Good; Montserrat 500+ holds on glass |
| 6 | Density | Calm; phone header could shrink (#3) |
| 7 | Component consistency | Strong; one editor everywhere |
| 8 | Interaction clarity | Strong |
| 9 | Accessibility | Good; #2 and #6 open |
| 10 | Responsive | Good down to 370px |
| 11 | Forbidden list | Clean |
| 12 | Reads as this product | Yes |
