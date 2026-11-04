# Design Council — Anchor screen v0 (Budget Request, Step 1)

2026-10-21 · Checked by eye at 1440×900, 1280×800 and 390×844, in Filled, Empty and Error states, plus the item sheet and approval path. No console errors.
Rubric: Veronica Locked Pipeline, Phase F (12 points). You decide which findings to act on; nothing below has been changed yet.

## 5 strongest aspects

1. **Input mirrors output** (information hierarchy). Line items are grouped by category with subtotals, exactly like the printed document, so the treasurer edits the same structure the auditor will read.
2. **The most error-prone manual step is gone** (interaction clarity). Amount in words, subtotals and the total update live; the paper preview is always the real output.
3. **One primary action, always in the same place** (visual hierarchy, stable targets). "Continue to review" / "Review" sits in the sticky bar on both layouts; nothing else competes with it.
4. **Unhappy paths exist** (distinctiveness against the forbidden list, Cat 8). Empty state with a next step, a saved-but-invalid item with "Fix it", autosave status, delete with Undo instead of a confirm dialog.
5. **Color is one family and contrast is verified** (accessibility). Every value derives from ACM's #238CBA; the ACM blue itself is kept to non-text uses because it's only 3.8:1 on white.

## 10 most important problems, in priority order

1. **The sticky total bar eats the working area on laptops.** At 1280×800 only three line items are visible. *Principle: content over chrome; the frequent task needs the most space.* Fix: put the amount in words on the same line as the total and bring the bar to ~72px.
2. **On desktop you can't move an item to another category.** The category column was removed when items were grouped. *Principle: user control and freedom.* Fix: a small "Move to…" option in each row, or let the phone-style item sheet open from the row.
3. **Desktop table cells don't look editable at rest.** Their borders appear only on hover (1.35:1). *Principle: affordance; WCAG 1.4.11 non-text contrast.* Fix: a faint always-on underline or field background, plus an "Edit any cell" hint once.
4. **Off-scale spacing values crept in.** 6px, 9px, 10px, 13px and 2px appear in several components, against the 4/8/12/16/24 scale. *Principle: consistent rhythm (calm comes from geometry).* Fix: snap to the scale before locking.
5. **"Draft ▾" looks like a status dropdown, but it opens a read-only path.** *Principle: a control's look should match its outcome.* Fix: label it "Draft · Approval path" with a path icon, no chevron.
6. **The breakdown card repeats subtotals already shown in the group headers.** *Principle: signal-to-noise.* Fix: keep only the share-of-total bars, or drop the card and put percentages in the group headers.
7. **On phone, "Add item" sits below every item.** With 15+ items it's a long scroll for the most frequent action. *Principle: frequency of use → proximity (Fitts).* Fix: an "Add" action in the top area of the Line items card or in the sticky bar.
8. **The desktop preview is cut off by the total bar; the signature block isn't visible at 1280×800.** *Principle: visibility of system status.* Fix: a "Fit page" toggle that scales the paper to the column height.
9. **Date input uses the browser's US format (mm/dd/yyyy).** *Principle: match the real world.* Fix: a PH-friendly picker that shows "Nov 21, 2026" in the field.
10. **The role switcher does nothing on this screen, and its rule here is undefined.** Should Secretary mode still allow editing a budget request? *Principle: predictability.* Fix: decide the rule in `UX_MAP.md`; in this screen, switching should at least change the sidebar order.

## Unnecessary

- The "All documents" heading above a single Library link.
- Possibly the Breakdown card (see #6).

## Missing

- Offline / "saved on this device" state (in UX_MAP, not shown here).
- Real officer names on signature lines (should come from Profile; role labels are used now so nothing is invented).
- Keyboard flow for fast desktop entry (Enter moves to the next row).
- Where "Start from a past request" leads (Library, designed later).

## Drift toward generic

Low. The sidebar + content shell is a standard admin layout, justified by the app type. The stepper bars are a common pattern but this really is a 3-step sequence. What keeps it specific: the real paper preview, peso formatting, Philippine document conventions (particulars, amount in words, signature block). If those were stripped out it would read like a generic form, so they are load-bearing and should stay prominent.

## Rubric scores (quick read)

| # | Category | Read |
|---|---|---|
| 1 | Information hierarchy | Strong |
| 2 | Visual hierarchy | Strong, except #1 |
| 3 | Alignment | Good |
| 4 | Spacing | Needs fix (#4) |
| 5 | Typography | Good; Plex scale holds at both sizes |
| 6 | Density | Desktop slightly cramped at 1280 (#1, #8) |
| 7 | Component consistency | Good (first screen, sets the system) |
| 8 | Interaction clarity | Good, except #5 |
| 9 | Accessibility | Good, except #3 |
| 10 | Responsive behavior | Good; no horizontal scroll at any width |
| 11 | Forbidden list | Clean |
| 12 | Reads as this product | Yes |
