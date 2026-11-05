# Lighthouse: vanilla (`main`) vs Astro (`v2`)

Local measurement, one run each, on 2026-11-05. Numbers below are from that pass, before the later English redesign. They describe the migration, not a fresh audit of the current layout.

| | v1 | v2 |
| --- | --- | --- |
| URL | `http://127.0.0.1:4173` (the `main` `index.html`, served as static files) | `http://127.0.0.1:4321` (`astro preview` of the production build) |
| Tool | Lighthouse 13.6.0, headless Chrome, mobile default | same |

## Scores

| Category | v1 | v2 |
| --- | ---: | ---: |
| Performance | 90 | 99 |
| Accessibility | 79 | 100 |
| Best practices | 96 | 100 |
| SEO | 91 | 100 |

## Load metrics

| Metric | v1 | v2 |
| --- | ---: | ---: |
| First Contentful Paint | 2.3 s | 1.6 s |
| Largest Contentful Paint | 2.3 s | 1.6 s |
| Speed Index | 5.9 s | 1.9 s |
| Total Blocking Time | 30 ms | 40 ms |
| Cumulative Layout Shift | 0 | 0.001 |
| Time to Interactive | 6.7 s | 5.4 s |
| Total transfer size | 5,847 KiB | 4,203 KiB |
| JavaScript transferred | 1,487,839 B | 207,162 B |

v1 JavaScript was dominated by `scripts/three-module.js` (1,412,947 B transferred, unminified). On v2 the background chunk (`SceneBackground`) transferred about 133 KB and React DOM about 66 KB. TagCloud was a separate chunk of about 4 KB. The rest of the page did not load a framework.

Project screenshots were still most of the 4.2 MB. They were not recompressed in the migration.

## How to read this

This is one local pass, not PageSpeed against the Vercel deploy. v1 also downloaded jQuery, Slick, ScrollReveal (unused), TagCloud, and Font Awesome from CDNs, so its times include that network. The Speed Index drop (5.9 s to 1.9 s) and the LCP drop (2.3 s to 1.6 s) line up with removing the 1.4 MB bundle from the HTML path.

Total Blocking Time stayed almost flat (30 ms to 40 ms). Parsing Three.js and React still hits the main thread, without jQuery or the unminified module.

## Accessibility change that moved the score

Lighthouse flagged the source buttons and the password Generate control: small white or inherited gray text on `rgb(27, 120, 226)`, ratio 4.34 against the 4.5 required for AA. Those controls moved to `#1b73e2` (4.57 with white). The password section has since been removed.

Raw reports: `docs/lighthouse-v1.json` and `docs/lighthouse-v2.json`.
