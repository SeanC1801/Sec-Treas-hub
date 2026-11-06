# SecTreas Hub

**What this repo is for:** the code and design files for the SecTreas Hub, a web app where the ACM-AUF Treasurer and Secretary make their official documents in one place, without retyping or reformatting them.

## Who it's for

- **Treasurer:** Budget Requests and Liquidation Reports.
- **Secretary:** Minutes and Certificates (not built yet).

## What it does

- Fill in a form, and the hub produces the document in the chapter's format, on the chapter letterhead, ready to print.
- Tracks each document's status: Draft, President, Adviser, CSC, Approved.
- Works on phones. Deployed on Vercel.

**Deadline:** end of November 2026.

## Status

Design prototype. `index.html` is a clickable draft of the Treasurer side. Nothing is saved to a server yet, and nothing syncs with Google Drive. All data in it is sample data.

Screenshots of the hub will be added here once the design is final.

## Try it

```
npm install
npm run dev
```

The frozen design prototype is `prototypes/archive/anchor-treasurer-v8.html` (opens directly in a browser).

## Deploy

On Vercel: **Add New → Project**, import this repo; the **Vite** preset is picked up from `vercel.json`. Every push to `main` redeploys.

## What's in the repo

```
index.html          app markup (Vite entry)
src/                app styles and scripts
public/assets/      letterhead and background images
vercel.json         hosting settings
docs/design/        design brief, UX map and research
prototypes/archive/ earlier versions
```

