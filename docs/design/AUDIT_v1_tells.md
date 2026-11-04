# Audit — AI tells in anchor v1 (self-audit, Veronica Audit mode)

2026-10-21 · Checked against `tells.md` (Oct 2026) plus today's sweeps. You were right: v1 had a lot of them. The overall read is **strongly generic** — not because of any one choice, but because almost every surface was the statistically likely version of "Frutiger Aero app".

Highest-impact single fix: **stop putting content in glass cards.** Glass belongs to the floating controls only; content sits on a solid surface. (Apple's own HIG says this; v1 broke it everywhere.)

| # | Where in v1 | Tell | Category | Severity |
|---|---|---|---|---|
| 1 | Header, composer, list, approval, success: all rounded white-glass cards stacked in a centered column | "Card pile" / glass on every surface | Cat 3 + glass costume (contested list) | **Strong** |
| 2 | Primary button: blue-to-dark-blue vertical gradient pill with gloss | Blue-to-dark gradient is the #1 statistical AI default (2026) | Cat 1 | **Strong** |
| 3 | Pills everywhere: buttons, chips, status, toast, dock (999px) + 20px panels | Uniform extreme radius | Cat 3 | **Strong** |
| 4 | Single centered 640px column floating on a blurred backdrop | The default AI layout skeleton for "calm app" | Cat 3 | **Strong** |
| 5 | Soft blurry sky + frosted panels | The 2025–26 "glassmorphism landing" look; "excessive glassmorphism" now listed as fading | Cat 1/4, contested | Medium |
| 6 | "What will you spend on?", "What's the activity?" | Conversational question headings (Typeform-ish), now common in generated forms | Cat 5 | Medium |
| 7 | "Clear skies. Nothing added yet." | Cute metaphor pun copy | Cat 5 | Medium |
| 8 | Share-of-total mini bars next to every category | Decorative mini-meters, the cousin of decorative sparklines | Cat 3 | Medium |
| 9 | `/ focus · ↵ add · esc clear` key hints | Dev-tool garnish (Linear look) in a student finance app | Cat 1 (Linear) | Medium |
| 10 | Success screen: big check in a circle + "Sent to …" + two buttons in a card | The default success template | Cat 3 | Medium |
| 11 | Dark pill toast bottom-center | Untouched Sonner-style default | Cat 3 | Weak |
| 12 | Three equal progress bars labeled under | Default stepper | Cat 3 | Weak |
| 13 | Mini paper icon of gray lines | Skeleton-line decoration | Cat 3 | Weak |
| 14 | Montserrat everywhere | Free-template font (kept because you chose it; how it's used must carry it) | Cat 2 | Weak, deliberate |
| 15 | Shadows straight down, highlight on top edge only, sun in sky top-left | No consistent light model: the light in the sky and the light on the UI disagree | Not catalogued (new) | Medium |
| 16 | Category chips repeated 6× inside every opened row | Everything visible at once inside the editor | Cat 8 | Medium |

What was *not* a tell and stays: the paper as the Review hero, one primary action per step, every number once, quick add, undo instead of confirm, solid fallback for reduced transparency.

New guardrails added to Veronica from this audit: see `tells.md` Cat 3 additions (glass card pile, pill-everything), Cat 5 (question headings, metaphor puns), and the new **Category 9: No light model**.
