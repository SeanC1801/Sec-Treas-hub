# SecTreas Hub

One place for the ACM-AUF Treasurer and Secretary to make their documents without retyping or reformatting them. The working system is due at the end of November 2026, deployed on Vercel and usable on phones.

> **Status: design prototype.** `index.html` is a clickable draft of the Treasurer side. Nothing is saved to a server yet, and nothing syncs with Google Drive. All data in it is sample data taken from the chapter's own documents.

## What's in the prototype

**Treasurer → Budget Requests:** Details → Program flow (optional) → Budget → Preview & print
- Budget lines are written as category · notes · amount, with a quick-add line ("Food 450 light refreshments for guests", Taglish works too).
- The document follows the CSC template: a letter to the CCS-CSC President through the CSC Treasurer, an optional Program Flow page, and a Budget Breakdown table. It prints on the chapter letterhead, Long bond (8.5 × 13 in).
- Optional co-host: the letter asks for the total event budget and the table shows the ACM share.

**Treasurer → Liquidation:** opens on the **First Semester budget tracker** (same columns as the Drive sheet "Breakdown of Expenses A.Y. '26–'27"), then Request → Receipts → Preview & print for each event
- Receipts are grouped by budget category; lines with the same invoice, reference and store print as one receipt with its own total.
- Excess (Deficit) is calculated per category and for the semester, so there are no hand-typed formula ranges.

**Both:** status workflow Draft → President signs → Adviser notes → CSC Treasurer → Approved by the CSC, undo on every delete, a Start over with confirmation, and the glass/paper "pencil, ink, stamp" design system.

The bar at the top of the page (View, Step, State, Glass) is a design review tool and is **not part of the product**.

## Preview it

Open `index.html` in a browser. No build step and no install are needed.

Useful URL parameters: `?area=liq` (Liquidation), `?step=review`, `?state=empty|attn|over|offline`, `?view=phone`, `?glass=solid`.

## Deploy on Vercel

1. In Vercel, **Add New → Project** and import this repository.
2. Framework preset: **Other**. Leave the build command and output directory empty.
3. Deploy. Every push to `main` redeploys.

## Repository layout

```
index.html                 the current prototype (Treasurer: Budget Requests + Liquidation)
vercel.json                static hosting settings
assets/
  letterhead.png           chapter letterhead used behind every printed page
  sky-wide.jpg, sky-tall.jpg
docs/design/
  DESIGN_BRIEF.md          design system: concept, light model, type, color, glass rules, forbidden list
  UX_MAP.md                flows and screens
  COUNCIL.md               four-designer review and decisions
  TREND_SWEEP_2026-10.md   research behind the design
  AUDIT_v1_tells.md, DESIGN_COUNCIL_anchor-v*.md, design-taste.md
prototypes/archive/        earlier versions, kept for reference
```

`index.html` is self-contained: images and the letterhead are embedded, and fonts load from Google Fonts.

## Next

- Secretary side (Minutes, Certificates) and the shared Home dashboard. Figma drafts are in progress.
- Profile page for officer and signatory names (they are fixed in the prototype for now).
- Backend: saving, sign-in, approvals, PDF/Word export, and sync with the Drive budget tracker.

## Team

Heaven (Lead), Jaeda, Nico, Jums. AUF-ACM Student Chapter.

This repository is private because it contains real officer names, the chapter letterhead and real receipt data.
