# Learnings: surprises and pitfalls in the code

Back to: [agents.md](../00_CORE/agents.md). Read this when something behaves strangely. Add a new entry at the bottom when you find one: the date, what happened, why, and what to do instead.

1. Dates shift back a day. `new Date().toISOString()` gives the UTC date, which is yesterday before 8 AM in Manila. Build dates from local parts instead (see `iso()` in `src/events.js`). Found in early November 2026; fixed for minutes and certificates on 2026-11-07 (commit 33c3951).
2. A bottom bar placed inside the element that scrolls will scroll with the content. That is the cause of findings F1 (Minutes) and F2 (Certificates). Keep the bar outside the scrolling element, or make it sticky. Found 2026-11-20.
3. Layout uses container queries on `#device` (`container: app`), not the window size. Desktop starts at 960 px wide. Use `@container app (...)` for layout rules. Set up in the first build, November 2026.
4. The Treasurer data is saved again when the page closes (`pagehide`). Editing `localStorage` by hand in the console gets overwritten. Change data through the app instead. Found in early November 2026.
5. Clicks on icons inside buttons can miss the button. Icons use `pointer-events: none`. Keep that on new icons. Found in the first build, November 2026.
6. The class name `.lh` was already used by the letterhead; the hub uses `.hl` for its headings. Check a class name is not taken before adding one. Found in the first build, November 2026.
7. If a saved Budget Request or Liquidation Report no longer exists, loading the page used to crash. `restore()` in `src/prototype.js` now checks first. Fixed 2026-11-07 (commit 33c3951).
8. Hover effects that grow a card (scale) can cover the toolbar above the grid. Keep hover lifts small (2 px) and never raise a card above other elements. Found 2026-11-09.
9. In a browser tab that is hidden, CSS transitions may not run, so measurements taken right after opening the sidebar can be wrong. Wait, or check with the tab visible. Found 2026-11-20.
