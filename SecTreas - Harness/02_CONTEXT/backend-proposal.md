# Backend proposal: database and security

Router: [agents.md](../00_CORE/agents.md). Timeline: [timeline.md](../01_SPECS/timeline.md). Decisions: [decisions.md](../03_TRACKING/decisions.md).

Status: a proposal for Sean and the seniors to discuss (written November 24, 2026). Nothing here is decided yet. Once the seniors agree, Sean writes the decisions in [decisions.md](../03_TRACKING/decisions.md) and the backend dates in [timeline.md](../01_SPECS/timeline.md).

## What the backend must do

From Sean, November 24, 2026:

- Used by the whole College of Computer Studies (CCS), not only AUF-ACM.
- Keep historical data for years if the hub is used long term.
- Free or very cheap, with no subscription.
- Easy to debug and easy to reach.
- Safe: the data and who can access it are both protected.

From the seniors' suggestions (see T8 and S8 in [treasurer.md](../01_SPECS/treasurer.md) and [secretary.md](../01_SPECS/secretary.md)):

- Email the President when a document needs approval, then update its status.
- Limit access to the Treasurer, core officers, the Adviser and the President, and let access be given or removed per officer.
- Show every status change and handover of a document.

## Recommendation: Supabase, free tier, built for all of CCS

Supabase is already the chosen stack ([decisions.md](../03_TRACKING/decisions.md)). This is how to set it up for these needs.

### Why it fits

- Free, with no subscription.
- The database is standard PostgreSQL, so the data can be exported and moved with common tools (`pg_dump`) if the hub ever leaves Supabase.
- Google sign-in, limited to @auf.edu.ph accounts.
- Row level security: the database itself decides which rows each person can see or change. A bug in the hub cannot show one organization's documents to another.
- Easy to debug: a web dashboard, a SQL editor, and logs. No server to look after.

### Tables, ready for all of CCS

- `organizations`: one row per student organization (AUF-ACM first).
- `memberships`: who belongs to which organization, with what role (Treasurer, Secretary, core officer, President, Adviser), and whether their access is on or off. S8's access switches connect here.
- `events`, `budget_requests`, `liquidation_reports`, `receipts`, `minutes`, `certificate_batches`: each row has an `org_id`, an academic year and a term.
- `status_events`: an append-only list of every status change and handover (who, when, from, to, note). T9's timeline and S9's handovers read from it.
- Nothing is hard-deleted. Old records are archived, so the history stays.

### Security

- Sign-in only with @auf.edu.ph Google accounts.
- Row level security on every table: you only see rows of organizations you belong to, and only what your role allows.
- Approvals: only the President can sign and only the Adviser can note.
- Receipt and ID photos in a private storage bucket, opened only through short-lived links.
- The service key (which can bypass security) is kept only in Vercel's environment settings or Supabase functions, never in the code or the repo. The public key in the hub is safe because row level security protects the data.
- Two admins at least (Sean and one senior), so the hub is never locked out.
- Before launch, test each role (Treasurer, Secretary, President, Adviser, someone from another organization, and someone not signed in) and confirm each can only do what it should.

### Free-tier limits and how to handle them

These are the limits as Sean's assistant understood them in November 2026. Check https://supabase.com/pricing before deciding, because free tiers change.

- Free projects pause after about a week without use. Fix: a free scheduled GitHub Action that pings the project weekly.
- The free tier has no automatic backups. Fix: the same GitHub Action saves a nightly backup (`pg_dump`) to the organization's Google Drive or a private place only admins can reach.
- About 500 MB of database. Text records are small; this lasts years for CCS.
- About 1 GB of file storage. Photos are the real limit: roughly 5,000 photos at the hub's current compression. Fix: keep compressing photos, and archive older academic years' photos to Google Drive.
- No free custom email. Fix: a small Google Apps Script, running under the organization's Gmail, that sends the "please approve" email to the President when the hub asks it to. Free, and it sends from an address the President already knows.

### Rough plan

1. Design the tables, roles and security rules, and agree them with the seniors.
2. Create the Supabase project, tables, security rules, Google sign-in and the private photo bucket. Set up the weekly ping and nightly backup.
3. Connect the hub: save to the database instead of the browser, move photos to the bucket, connect T8 (email) and S8 (access settings).
4. Test every role, then launch.

## Options not recommended

- Google Sheets and Apps Script as the database: free and familiar, but a sheet has no per-row security. Anyone who can open the sheet sees everything, and it slows down as the history grows.
- Firebase: free tier with security rules, but its data model is weaker for reports and history, and file storage may need a paid plan.
- Cloudflare (Workers, D1, R2): a generous free tier that never pauses, but sign-in and security take much more do-it-yourself work, which is harder to debug and hand over.

## Questions for the seniors

1. Which CCS organizations would join, and when?
2. Who are the admins (at least two)?
3. Who can turn an officer's access on or off: the President, the Adviser, or both?
4. Should the approval email go from the organization's Gmail, or from a CCS address?
5. How many years of history must be kept, and who may see past years?
