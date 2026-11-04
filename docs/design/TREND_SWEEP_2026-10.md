# Trend sweep — how human designers are working, Oct 2026

Run 2026-10-21 for SecTreas Hub. Every row says what it means for this product, not just what's trending.

## Overall direction
- **"Human touch" was the biggest trend of 2026.** Designers add hand-made marks, paper textures, grain, and keep small irregularities on purpose, specifically to separate their work from AI output. Typography as identity also held up. (Graphic Design Junction mid-year review; CrossGlobe "anti-AI-slop".)
- **Excessive glassmorphism and heavy 3D are fading.** Glass survives where it's used selectively with opaque reading zones. (GDJ review; daisyUI 2026 list.)
- **Personality over polish:** editorial pacing, type-first layouts, paper/ink/seal skeuomorphism, scrapbook/label UIs, biophilic calm. (daisyUI 18 trends.)
- **Blue is still the most trusted color;** orange became the common accent. (GDJ.)

## Glass, done properly (2026 practice)
- **Glass is for the control layer only** (bars, toolbars, popovers) floating above content; **never the content layer**. (Apple HIG materials.)
- Contrast is judged at the **worst moment**, not the average; body text only on more opaque fills; keep a 1px light edge for forced-colors; honor reduced transparency. (Superdesign glass rules.)
- Keep glass off dense data; limit blurred area (performance on older Android); never animate blur radius. (Superdesign, NN/g on Liquid Glass.)
- Real optics on the web: SVG displacement maps for edge refraction plus a specular rim, via `backdrop-filter: url(#filter)`. Works in Chromium only, so it must be progressive enhancement; use on a few floating elements. (LogRocket.)
- Skeuomorphism rules: **one light source** across the whole UI, gentle specular highlights, depth reserved for a few elements, controls that look raised must visibly depress. (Clay.)

## Craft details (kept from earlier sweep)
- Under 300ms; only transform/opacity; ease-out; press scale/offset; hover only on pointer devices; reduced motion keeps opacity. (Emil Kowalski.)
- Tabular numbers, ellipsis character, Intl formats, never block paste, focus first error, warn on unsaved, don't cover the focused element with sticky bars. (Vercel guidelines.)

## Mobile platform context
- iOS 26 Liquid Glass vs Android 16 Material 3 Expressive pulled in opposite directions (translucent vs bold solid color and shape). A web app for mostly-Android students should not depend on blur for meaning.

## What this means for SecTreas Hub
1. Content on solid paper; glass only on the top bar, the dock and popovers.
2. One light source: the sun in the top-left of the sky. Every highlight sits top-left, every shadow falls down-right.
3. A human signature asset: the ink stamp on submit, and pencil-vs-ink states.
4. Grain on the sky and a whisper of paper texture; no smooth plastic gradients.
5. Type carries identity (big editorial title on desktop), not decoration.
6. Refraction as Chromium-only enhancement on the dock; plain blur elsewhere; solid when asked.

Sources: graphicdesignjunction.com (Aug 2026 review), crossglobemarketing.com (anti-AI-slop), trends.daisyui.com (18 UI trends 2026), designrush.com (16 web trends), developer.apple.com HIG materials (via glama mirror), superdesign.dev (glassmorphism rules), blog.logrocket.com (liquid glass CSS+SVG), clay.global (skeuomorphism 2026), emilkowal.ski, vercel-labs web-interface-guidelines, androidcentral.com (M3 Expressive vs Liquid Glass).
