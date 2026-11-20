# Findings: check of the hub on November 20, 2026

Back to: [overview.md](../02_CONTEXT/overview.md). Tasks that fix these: [treasurer.md](../01_SPECS/treasurer.md), [secretary.md](../01_SPECS/secretary.md).

## How the hub was checked

- Sizes: desktop at 1280 px and 1440 px wide, phone at 375 px wide.
- Every visible button, link and field on each screen was scrolled into view and tested for:
  - covered by something else,
  - running off the edge of the screen,
  - too small to tap (under 32 px),
  - missing a name for screen readers.
- Every safe button on the hub screens was pressed to make sure it does something. Delete, send, sign-out and print buttons were skipped.
- The bottom bar on each step was checked while scrolling to the end of the page.
- The four download links in Templates and guides were opened.
- The browser console was watched for errors.

## What passed

- Sign-in screen: all buttons clear on desktop and phone.
- Sidebar: open, collapse, and phone drawer (menu button, close by tapping outside or pressing Esc) all work.
- Events: grid view, list view, the View menu, filters, search, New event, the event page, Edit name/dates/venue, Add photo, and Back to all events. Nothing covered, nothing dead.
- Budget Tracker: all buttons respond; totals still add up (₱14,750.00 allotted, ₱14,591.45 actual, ₱158.55 excess).
- Profile and Templates and guides: everything responds; all four downloads open.
- Budget Request (Details, Program flow, Budget, Preview & print) and Liquidation Report (Request, Receipts, Proof, Preview & print), on desktop and phone: nothing covered; the bottom bar stays at the bottom; the last item on each page can be scrolled above it.
- Phone: the menu button stays in the top-left corner while scrolling and is never covered.
- No errors in the browser console.

## Bugs found

### F1. Minutes: the bottom bar scrolls away and covers content (phone and desktop)

- Where: Minutes, every step (Details, Notes, Action items, Preview & print).
- Steps to see it:
  1. Switch to Secretary on the Events page.
  2. Open Code in the Dark, then "Minutes · Meeting, Sep 11, 2026".
  3. Scroll down on Details.
- What happens: the "Next / Continue" bar moves up with the page and ends up in the middle of the screen, covering attendee names. On Preview & print (desktop) the Print / Back to draft bar floats over the printed page. Buttons hit while checking: an attendee chip, "Everyone was there", "Delete these minutes", a topic heading, a topic note, an action item.
- What should happen: the bar stays fixed at the bottom of the screen, like it does in the Budget Request.
- Why: the bar (`.dock-wrap`, built in `src/minutes.js`, styled in `src/styles.css`) sits inside `#sec`, and `#sec` is the element that scrolls (`src/minutes.css`, `overflow:auto`). So the bar scrolls with the content.
- Fixed by task: [secretary.md](../01_SPECS/secretary.md), S1.

### F2. Certificates: the bottom bar covers the signatory fields (desktop)

- Where: Certificates, Details step, desktop.
- Steps to see it:
  1. Switch to Secretary on the Events page.
  2. Open General Assembly, then its certificate batch.
  3. Scroll to the bottom of Details.
- What happens: the "Next / Continue" bar sits on top of the "Left" signatory's name and title fields, even when scrolled all the way down.
- Why: same cause as F1. The bar is inside `#cert`, which is the element that scrolls (`src/certs.css`).
- Fixed by task: [secretary.md](../01_SPECS/secretary.md), S2.

### F3. Budget Tracker: the Open and Start buttons are too small to tap

- Where: Budget Tracker, the "Budget Request Document" and "Liquidation Report Document" columns. Desktop and phone.
- What happens: each Open / Start button is about 37 × 26 px. The hub's rule is at least 44 px tall.
- Code: `renderTracker()` in `src/hub.js`; style `.tk-tbl .docs .textbtn` in `src/hub.css`.
- Fixed by task: [treasurer.md](../01_SPECS/treasurer.md), T1.

## Not bugs (checked and fine)

- Budget Request, Budget step: the Qty and Price each fields look covered, but they sit inside the closed "Work it out from quantity × price" section, so they are hidden on purpose.
- Add photo on an event page opens the computer's file picker. It works; the check cannot see the picker.
- The glass bottom bar blurs content that scrolls under it. Everything can still be scrolled above it.

## Missing features (not bugs)

- Copy link for documents waiting on the President or Adviser was removed with the old Home page. Task: [treasurer.md](../01_SPECS/treasurer.md), T2.
- No PDF or Word download. Every document can only be printed. Tasks: [treasurer.md](../01_SPECS/treasurer.md), T3 and [secretary.md](../01_SPECS/secretary.md), S3.
- Not yet tested on a real Android phone: glass effect speed, camera for photos, printing. Tasks: [treasurer.md](../01_SPECS/treasurer.md), T4 and [secretary.md](../01_SPECS/secretary.md), S4.
