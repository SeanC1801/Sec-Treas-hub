# SecTreas Hub — DESIGN_BRIEF.md

**Status: Draft v3 — pending anchor lock (Budget Request flow)**
2026-10-21 · Relocked after v1 was rejected for AI tells. Decisions come from the four-designer council (`COUNCIL.md`), the self-audit (`AUDIT_v1_tells.md`) and the sweep (`TREND_SWEEP_2026-10.md`).

Labels: **[User]** · **[Ref]** sky reference image · **[Council: name]** the member who owns the call · **[Sweep]**.

## 0. Revision log
| Version | Verdict | Lesson |
|---|---|---|
| v0 calm desk | Overwhelming, boring | Never show data twice; get a reference |
| v1 paper in the sky | "All AI tells" | Glass on content, gradient pill, pills everywhere, centered card column, cute copy, no light model |
| **v3 pencil, ink, stamp** | this brief | Content on paper, glass only on controls, one light source, human paper-trail details |

## 1. Concept: pencil, ink, stamp — under one clear sky
- **Sky** (backdrop, never interactive) — the reference image's sky, with fine film grain. [User, Ref, Sweep]
- **Paper** (all content) — a ledger sheet for items, the official document on Review. Solid, square-ish, lit from the top-left. [Council: Ines]
- **Glass** (controls only) — the top bar (phone) and the dock; popovers. Real glass: tint, blur, specular rim, edge refraction where supported. [Council: Kai; Apple HIG]
- **Pencil → ink → stamp** — draft entries appear in gray "pencil" in the right ledger columns while you type; Enter inks them; unfinished items stay in pencil ("needs a price"); submitting stamps the paper SUBMITTED with date and time. [Council: Bea, Kai]

## 2. Light model (new, applies to everything) [Council: Kai]
- One light source: the sun, top-left of the sky.
- Highlights: top and left edges only (1px, white 60–90%).
- Shadows: fall down-right (x ≈ +0.35 × y). Never straight down, never glows.
- Depth is reserved for: the dock, the primary key, popovers, the paper on Review, the stamp. Everything else is flat.

## 3. Typography [User + Council: Ines]
- **Montserrat** (UI): 500 body, 600 labels, 700 titles/numbers. Tabular figures on every amount.
- **IBM Plex Serif** (official paper only).
- Scale: 12 caption · 13 label · 15 body · 16 input · 20 phone title · **36/40 desktop activity title (−0.02em)** · 28 total (22 phone).
- Sentence case. Exception: the stamp (a depicted physical object; real stamps are uppercase).
- Column headers are the headings; no question headings.

## 4. Color [Ref, contrast-checked]
| Token | Value | Use |
|---|---|---|
| ink | `#0B2A4A` | text (14.5:1) |
| ink-2 | `#36506A` | secondary (8.4:1) |
| pencil | `#5A7690` | drafts, placeholders (4.7:1 on paper) |
| action | `#0F5BB5` | links, focus |
| key | `#0C4A98` flat, edge `#072F63` | the primary key (white text 8.6:1) |
| paper | `#FFFFFF`; sheet `#FDFEFF` | content surfaces |
| rule | `#D6E6F5`; double rule `#B9D3EC` | ledger lines (decorative) |
| glass | `rgba(236,246,255,.70)` + blur 18 + saturate 1.8 + brightness 1.05 | controls only |
| stamp ink | `#1D4FA8` | SUBMITTED stamp |
| leaf / sun / error | v1 values | status, always with words |

## 5. Geometry [Council: Ines]
Radius: paper 4 · inputs/tags/buttons 10 · glass bars 18 · popovers 14. **No pills** except the save-status dot. No radius above 18 anywhere.

## 6. Layout [Council: Ines, Rafa]
- **Desktop (≥ 960):** sky + wordmark; a two-column editorial grid: **left rail 300px** (kicker, activity title set big, details as a definition list, the three steps as a vertical list, approval path on Review, close link) and the **sheet** (max 720px). The dock floats over the sheet's bottom. No top bar, no cards.
- **Phone:** one compact glass top bar (close, title, save, step tabs) that shrinks after 24px of scroll; the sheet fills the width; the dock floats at the bottom and **slides away while the keyboard is up**.
- Every number once: line amount, category subtotal (single rule above, accounting style), grand total in the dock (+ "left of allotted" if set).

## 7. Motion budget [Council: Rafa]
Under 300ms, transform/opacity (+ color for ink). Press = 1px down + edge collapse. New entry = pencil→ink color settle (400ms) in its group. Total counts up (240ms). Stamp = 1.12→1 scale + −4° settle (220ms), once. Dock hide/show 200ms. No looping or ambient motion. Reduced motion: opacity only.

## 8. Features [Council: Bea, Rafa]
1. Quick add understands English and Taglish: "60 packs snacks at 65", "60 snacks tig-65", "3 kahon tubig 660", "2 x tape @45".
2. Optional **allotted budget** in Details → dock shows what's left or how much over (sun color + words).
3. **Copy link for the Auditor** + native share; Download PDF/Word.
4. Paper on Review: tap to zoom on phone.
5. Start from a past request (Library, later).
6. Offline-first save state; undo on delete; never-disabled key that explains.

## 9. Glass rules [Council: Kai + Rafa; Sweep]
- Only on: phone top bar, dock, popovers, toast.
- Fill ≥ 70% with blur; text on glass must pass 4.5:1 against white-paper-under-glass *and* deepest sky.
- Specular rim via a masked gradient border (top-left bright).
- Edge refraction (SVG displacement) on the dock only, Chromium only, generated to the dock's real size.
- `prefers-reduced-transparency` / `prefers-contrast: more` → solid `#F4F9FF` with a 1px edge.
- Never animate blur.

## 10. Forbidden list (v3)
1. Glass on content (lists, forms, paper).
2. Gradient buttons; gloss on buttons; pill buttons.
3. Cards for content; a centered column of stacked panels.
4. Radius > 18; uniform radius across tiers.
5. Shadows that ignore the light source; glows.
6. Question headings; puns; "Supercharge"-style copy; emoji.
7. Decorative meters, sparklines, skeleton-line icons.
8. Dev-tool keyboard hint rows in the main UI.
9. Check-in-a-circle success cards.
10. Repeating the same chip set in every row editor.
11. Blur carrying meaning; animated blur.
12. Purple/indigo; uppercase tracked labels (stamp excepted).
13. Same number shown twice; more than one primary key per screen.
14. Fake names (role labels until real names come from Profile).

## 11. Components
*Populated at lock.* Expected: sky, glass bar, dock (with lens), key button, ghost (secondary) button, ledger sheet, writing line + pencil row, ledger row + inline editor, category select (one per editor), tag, rail definition list, step list, approval list, paper, stamp, popover, toast.

## 12. Explored & rejected
- v0 calm desk (overwhelming, boring). v1 glass-card column with gel pill (AI tells). Using the reference image itself (text baked in; likely licensed).
