# SecTreas Hub — UX_MAP.md

**Status:** Locked (Phase B), revised 2026-10-21 after the v0 anchor was rejected as overwhelming · Project lead: ACM-AUF

**Revision:** every workflow is now *Details → Main task → Review*. Export merged into Review. Workflows run in focus mode (no sidebar or tab bar). The approval path appears from Review onward. Reason: one task per step, fewer zones on screen (see DESIGN_BRIEF §6).
**Scope of this file:** what exists and why. No color, type, or layout decisions here; those live in `DESIGN_BRIEF.md`.

Labels used below:
- **[User]** = decided by the project lead in conversation.
- **[V-default]** = Veronica-proposed default where the answer was "not sure, you decide." Revisit any time; it never silently becomes "confirmed."

---

## 1. Product in one line

A phone-first workspace where ACM-AUF's Treasurer and Secretary turn raw inputs (line items, receipts, meeting notes, name lists) into correctly formatted official documents, without retyping or reformatting by hand.

## 2. Users and goals

| User | Goal | Today's pain |
|---|---|---|
| Treasurer | Produce Budget Requests and Liquidation Reports that are correct and properly formatted | Manual math, reformatting the template every time, re-entering the same items for liquidation |
| Secretary | Produce formatted Minutes and batches of Certificates | Reformatting raw notes; making certificates one by one in Canva |
| Signatories (Auditor, President, Adviser) | See what needs their sign-off and where a document stands | Chasing documents in chat threads |

Success target: a recurring document takes under 5 minutes from open to export.

## 3. Global rules

- **One organization:** ACM-AUF only. No org switcher. [User]
- **Role switcher:** a "Treasurer | Secretary" toggle. Switching reorders Home and Tools; it does not hide the other role's tools. [User]
- **Tool priority order:** Budget Requests → Minutes → Liquidation Reports → Certificates. [User]
- **Mobile navigation:** bottom tab bar (Home, Tools, Library, Profile). Workflow screens hide the tab bar and show back + step indicator + one primary action. [User]
- **Approvals: both, navigable.** Every financial document prints with a signature block *and* carries an in-app status that anyone can tap to see the approval path. [User]
- **Every workflow:** 3 steps — Details → main task → Review (Review includes export and submit). Back never loses data.
- **Focus mode:** inside a workflow there's no sidebar and no tab bar; close (×) returns to where you came from.
- **Autosave** on every change; drafts survive closing the tab and going offline.
- **Currency:** Philippine peso (₱), two decimals, tabular figures. [V-default]

## 4. Approval model (combined: document + in-app)

Statuses: **Draft → Submitted → Noted → Approved**, with **Returned** as a side branch (goes back to Draft with a comment).

Default chain for Budget Requests and Liquidation Reports [V-default; confirm against ACM-AUF / school rules]:

| Order | Role | Action | Shows on the printed document as |
|---|---|---|---|
| 1 | Treasurer | Prepares, submits | Prepared by |
| 2 | Auditor | Notes / checks figures | Noted by |
| 3 | President | Approves | Approved by |
| 4 | Adviser | Approves (final) | Approved by |

How it's navigable:
- A **status chip** sits in every document header (e.g. "Draft"). Tapping it opens the **Approval path** panel: each role, its state (waiting / done / returned), date, and comment.
- **Home** shows a "Needs your action" list for whoever is next in a chain.
- **Library** filters by status.
- The printed document's signature block is generated from the same chain, so the paper and the app can never disagree.

## 5. Workflows

### 5.1 Budget Request (Treasurer) — *anchor workflow*

- **Entry:** Home tool card · Tools tab · Library "Duplicate" on an old request · "+ New" quick action.
- **Step 1 Details:** activity name, date, venue, fund source (4 fields, one screen).
- **Step 2 Items:** quick add ("60 packs snacks at 65") or full fields; items grouped by category with subtotals and share of total; grand total in the dock; live mini paper in the dock opens the full preview on demand. Items without a price can be saved and are flagged "needs a price".
- **Step 3 Review:** the paper (with amount in words and signature block) + approval path; download PDF/Word; Submit to Auditor (status → Submitted).
- **Success:** "Submitted to Auditor" confirmation, document lands in Library.
- **Failure states:** a line with qty or unit cost missing (inline error, line still saved); export fails (retry, draft kept); offline (draft saved on device, sync badge); user leaves mid-way (draft appears in "Continue where you left off").
- **Calculation rules owner:** Nico (budget breakdown, categories, rounding). Default categories until Nico confirms [V-default]: Printing, Food & Drinks, Supplies, Prizes & Tokens, Transportation, Other.

### 5.2 Liquidation Report (Treasurer)

- **Entry:** Home · Tools · from an Approved budget request ("Liquidate this").
- **Step 1 Details:** pick the approved budget request → its items pre-fill as "budgeted"; enter actual amount per item; attach receipt photo per item; add unbudgeted expenses.
- **Step 2 Review:** summary — budgeted vs actual per item, total spent, balance to return / overspend; missing-receipt warnings.
- **Step 3 Export:** formatted report + receipts appendix; submit.
- **Failure states:** receipt upload fails (per-photo retry, never blocks typing); item without a receipt (allowed with a reason, flagged on review); overspend (shown clearly, not blocked).

### 5.3 Minutes (Secretary)

- **Step 1 Details:** meeting details (type, date, time, venue, presiding officer); attendance (tap members present / absent / excused from the officer list); paste or type raw notes.
- **Step 2 Review:** formatted minutes beside the raw notes; edit inline; agenda items detected from notes, re-orderable.
- **Step 3 Export:** PDF / Word.
- **Failure states:** formatter can't detect structure (falls back to plain sections, says so); empty notes (button disabled with reason).

### 5.4 Certificates (Secretary)

- **Step 1 Details:** pick template → fill fixed fields (event, date, signatories) → add names (paste a list or upload CSV).
- **Step 2 Review:** live preview, flip through names; flag duplicates and over-long names that would overflow.
- **Step 3 Export:** "Generate all" with progress (n of N) → ZIP of PDFs or one combined PDF.
- **Failure states:** a name too long for the template (shrink-to-fit suggestion, per-name); a generation failure mid-batch (retry only the failed ones).

### 5.5 Library (everyone)

Search; filter chips (All, Drafts, Needs action, Submitted, Approved, Returned); type filter. Actions per document: open, duplicate, export again, view approval path.

## 6. Screen tree

| Screen | Purpose | Primary action | Secondary | Key states | Mobile behavior |
|---|---|---|---|---|---|
| Login | Get in | Sign in | — | wrong credentials, offline | Single column, no change |
| Home | Start or resume work | Open top tool for current role | Role switch, Needs your action, Continue drafts, Recent | first-use empty, nothing pending | Tab bar visible; tool cards stack |
| Tools | See all four tools in priority order for the role | Open a tool | Role switch | — | Tab bar visible |
| Budget Request (Details → Items → Review) | Build a correct, formatted request | Next / Review / Submit | Quick add, open paper, approval path (Review) | empty (suggestions), needs a price, autosaving, saved offline, export failed, submitted | Same single column on every size; dock with total + one gel button; paper on demand |
| Liquidation (3 steps) | Reconcile actual vs budgeted | Continue / Export / Submit | Attach receipt | missing receipt, overspend, upload failed | Same shell as Budget Request |
| Minutes (3 steps) | Turn notes into official minutes | Continue / Export | Attendance | empty notes, structure not detected | Edit/Preview tabs |
| Certificates (3 steps) | Bulk-generate certificates | Generate all | Flip preview | long-name overflow, duplicate names, partial failure | Preview above, names below |
| Library | Find and reuse past documents | Open | Duplicate, export, approval path | empty library, no search results | Tab bar visible; filters scroll horizontally as chips |
| Approval path (panel) | See where a document stands | Close / (if it's your turn) Note or Approve | Return with comment | waiting, returned | Bottom sheet |
| Profile | Name, role(s), sign out | — | Role default | — | Tab bar visible |

## 7. Anchor screen

**Budget Request — the whole 3-step flow, anchored on the Items step.** Most-used tool, and it exercises the hardest components (inputs, line items, live math, sticky total, status chip, Edit/Preview). Every other screen inherits its components once locked. [User]
