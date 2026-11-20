# Hub map: facts about the code

Back to: [agents.md](../00_CORE/agents.md). Checked against the code on November 20, 2026. If the code and this file disagree, trust the code and write the difference in [learnings.md](../03_TRACKING/learnings.md).

## Stack

- Vite 6 with plain JavaScript modules. No framework. The only dependency is `vite` (in `package.json`).
- Deployed on Vercel from the `main` branch (`vercel.json`). The live hub is https://sec-treas-hub.vercel.app/.
- No backend yet. Everything is saved in the browser of the device you use.

## Files

- `index.html`: the page, the icons (`<symbol id="i-...">`) and the stylesheet links.
- `src/main.js`: entry point. Loads `prototype.js`, then `hub.js`, then `polish.js`.
- `src/prototype.js`: the Treasurer's work. Budget Requests, Liquidation Reports, receipts, proof photos, printing on Long bond. (Nico)
- `src/hub.js`, `src/hub.css`: the shell around everything. Sign-in, sidebar, Events (grid, list, event page), Budget Tracker, Profile, Templates and guides, the approval panel. (Shared)
- `src/minutes.js`, `src/minutes.css`: Minutes. (Ian)
- `src/certs.js`, `src/certs.css`: Certificates. (Ian)
- `src/events.js`: the list of events and due dates.
- `src/session.js`: who is signed in (draft sign-in, including "Test Officer").
- `src/photos.js`: proof photos, saved in the browser (IndexedDB).
- `src/styles.css`, `src/polish.css`, `src/proof.css`: shared styles, phone polish, proof-step styles. (Shared)
- `public/assets/`: `letterhead.png`, `cert-bg.jpg`, `auf-acm.png`, `auf-ccs.png`, and the sky backgrounds.
- `prototypes/archive/`: old design prototypes. Not used by the app.

## Screens (the `data-view` on `#device`)

- `signin`: the sign-in screen.
- `hub`: the sidebar and its pages: Events, Budget Tracker (Treasurer only), Profile, Templates and guides.
- `flow`: a Budget Request or Liquidation Report being edited (`src/prototype.js`).
- `sec`: Minutes (`src/minutes.js`). The scrolling area is `#sec`.
- `cert`: Certificates (`src/certs.js`). The scrolling area is `#cert`.

## Where data is saved (browser storage)

- `sectreas:session:v1`: who is signed in.
- `sectreas:ui:v1`: screen settings (open tab, grid or list, sidebar collapsed).
- `sectreas:treasurer:v1`: budget requests, liquidation reports, receipts.
- `sectreas:events:v1`: events.
- `sectreas:minutes:v1`: minutes.
- `sectreas:certs:v1`: certificate batches.
- `sectreas:org:v1`: officers and signatories (Profile).
- IndexedDB database `sectreas`, store `photos`: proof photos.

To start fresh in your browser: open the console (F12) and clear the site's storage, or use a private window.

## Documents and paper sizes

- Budget Request and Liquidation Report: Long bond, 8.5 × 13 in, Arial (`src/prototype.js`, search `8.5in 13in`).
- Minutes: Letter, 8.5 × 11 in (`src/minutes.js`, search `8.5in 11in`).
- Certificates: A4 landscape, 297 × 210 mm (`src/certs.js`, search `297mm 210mm`).
- Printing fills `#printArea` and calls `window.print()`. There is no PDF or Word download yet.

## Status chain (Budget Request and Liquidation Report)

From `STAGE` in `src/prototype.js`:

1. Draft
2. With the President (signs)
3. With the Adviser (notes)
4. With the CSC Treasurer
5. Approved by the CSC

The President and Adviser approve in the hub. The Treasurer records the CSC stages.

## Sample data

- The Budget Tracker and liquidation receipts use sample stores and invoice numbers ("Sample Mart", "SAMPLE-0001"). The event totals follow the chapter's sheet: ₱14,750.00 allotted, ₱14,591.45 actual, ₱158.55 excess.
- Use sample data only. See [rules.md](../00_CORE/rules.md), part 3.
