# Research: migrating the portfolio to an island architecture

Date: 2026-11-04. Branch: `v2`. Baseline: `main` (`index.html`, `main.css`, `scripts/main.js`, `scripts/3d.js`).

## What the old site was

One static page. The visual identity was a WebGL background. There was no router, shared state, or CMS.

| Piece | Where it lived | Needs JavaScript? |
| --- | --- | --- |
| Hero, copy, projects, CV, footer | `index.html` + `main.css` | No |
| Icosahedron background | `scripts/3d.js` + `scripts/three-module.js` (1.4 MB) | Yes, browser only |
| Icon sphere | TagCloud 2.2 from a CDN, inside `3d.js` | Yes, at the skills section |
| Galleries | jQuery 3.6 + Slick 1.8 | Yes, but the effect is a crossfade |
| ES/EN toggle | `scripts/main.js` + `localStorage` | Yes, very little |
| Side nav | scroll offsets in `main.js` | Yes, very little |
| Password generator | `main.js` | Yes, very little |
| Social hover | listeners in `main.js` | No. CSS is enough |
| ScrollReveal | CDN in `index.html` | Never called |
| `main.py` / `scripts/main.py` | loose Python | Not used by the page |

The production HTML also had structural problems: `#load-window` sat outside `<body>`, buttons were nested in links, several galleries shared `id="carrousel5"`, and the nav lived in a second `<footer>`.

Three details in the 3D background change the motion if they are "fixed" blindly:

- Two `requestAnimationFrame` loops. The visible one added `0.0002` rad per frame on each axis.
- A `THREE.Clock` was created inside the frame, so `getDelta()` was ~0. The extra `0.5 * delta` never showed. Keeping that line with a persistent clock would speed the sphere up.
- `resize` ran only when `innerWidth % 10 === 0`, and nothing was disposed on exit.

## React + Vite, or Astro

This kind of portfolio is static HTML plus one heavy island (WebGL) and a few small ones. The metric that matters is how much JavaScript reaches the client before the first content, not how fast the dev server starts.

| Criterion | React + Vite (SPA) | Astro |
| --- | --- | --- |
| JS on first load | React, React DOM, and the runtime for the whole page, even when the markup has no state | Zero by default. Each island declares its script |
| LCP | The hero text waits for the tree to hydrate | The hero is HTML. The canvas is not the LCP element (fixed, behind the page, negative `z-index`) |
| TTI / TBT | One bundle competes for the main thread | Three.js is isolated. jQuery and Slick do not need to come along |
| Three.js and SSR | Vite has no SSR here, so `window` does not break the build. The renderer still has to be created in `useEffect` | The server has no `window`, `document`, or WebGL. The canvas must not render during the build |
| DX for this repo | Every section has to become JSX before the background can exist | Static sections stay HTML. Only the background, and any other island, leaves HTML |
| Bilingual content | React state in a wrapping layout, or context | A `data-lang` attribute and a few lines of script. Both languages were already in the HTML |

React + Vite would fit if the whole page were a 3D configurator. Here about 80% is text, images, and links. An SPA would pay for React just to toggle classes and read `localStorage`.

### A real case

[Achraf Garai](https://www.achrafgarai.com/moving-my-portfolio-from-next-js-to-astro/) moved a portfolio with Three.js scenes, Framer Motion, and video from Next.js to Astro. On Next, every page's bundle included React, React Three Fiber, and the animation libraries even when most of the view was static. On Astro the layout became HTML and the scenes became islands (`client:load` on the hero, `client:visible` below the fold, `client:idle` for utilities). What he reports: less JavaScript on pages without 3D, a better First Contentful Paint, and scenes that no longer compete with the rest of the tree for the main thread.

That is not the only measurement. [Oto Macenauer](https://www.macenauer.net/blog/moving-my-site-to-astro-548-kb-of-javascript-deleted/) measured a resume that was entirely `"use client"` with no `useState`: 548,939 bytes of JavaScript went to 0, with the same page height at 375, 768, and 1440 px. [Aniruddh Atrey](https://www.aniruddhatrey.com/blog/architecture-behind-3d-portfolio) splits the Three.js chunk (~1 MB) so it loads only where there is a scene. The pattern is the same. Three.js does not get smaller. It stops dragging the rest of the document.

That matches this repo. `three-module.js` was 1.4 MB and downloaded next to jQuery, Slick, an unused ScrollReveal, and two Font Awesome stylesheets.

## How Three.js is integrated

The background is an `IcosahedronGeometry(7, 5)`, an invisible mesh, points on the vertices, an `EdgesGeometry`, and a constant rotation. There are no orbit controls, no PBR materials, and no UI state inside the frame.

Options considered:

1. **`@react-three/fiber` + `@react-three/drei`.** The R3F reconciler pays off when the scene is a component tree that reacts to props. This scene has no props. `useFrame` exists so you do not call `setState` in the loop, but the loop already mutates `rotation` directly. Fiber and Drei would add another runtime on top of `three` to reproduce about 80 lines. The R3F guide says to mutate refs in `useFrame`, cap pixel ratio (`dpr={[1, 2]}`), and not recreate geometries. Those rules do not require Fiber.
2. **A React component that calls `three` inside `useEffect`.** This gives mount and cleanup (`dispose` of geometries, materials, and the renderer) and the `client:only="react"` directive. The cost is shipping React and React DOM for a single effect.
3. **A framework-free client module.** An Astro `<script>` only runs in the browser, so there is no SSR error, and the `three` chunk stays off the HTML. That is the smallest JavaScript. It does not give a component model the rest of the site will share.

**Decision:** Astro as the framework, and the background as a React island (`@astrojs/react`) mounted with `client:only="react"`, implemented with imperative `three`. React Three Fiber is not used.

Reasons:

- React stays on the canvas. Everything else is `.astro`. The React island keeps mount, resize, and dispose explicit.
- `client:visible` does not apply. The canvas is `position: fixed` over the first viewport. `client:only` loads on open, like `client:load`, but it does not try to render Three during the build. Astro docs: with `client:only` the server emits no HTML for the component, so a `slot="fallback"` is needed. The fallback is the same fixed container, so there is no layout shift. LCP stays the title, which is HTML.
- `client:idle` would delay the background that defines the cover. The sphere should start as soon as its module arrives.
- There is no `setState` in the effect. Rotation mutates the mesh. `setPixelRatio` is `min(devicePixelRatio, 2)`. Unmount disposes resources and cancels the loop.
- Resize listens on every event. The old `% 10` check was a bug.
- `prefers-reduced-motion: reduce` holds the sphere on the first frame. A hidden tab skips rendering.

The first port kept `0.0002` rad per frame so the broken clock would not speed the sphere up. That step is about 0.7 degrees per second, which reads as a still image. The follow-up uses one persistent clock and `renderer.setAnimationLoop`, at 0.16 rad/s on Y and 0.05 rad/s on X, so the wireframe keeps turning for as long as the tab is visible.

Other interaction stays out of React:

- The skill cloud is TagCloud, in a script owned by that section.
- Galleries are a vanilla crossfade (1500 ms, 450 ms opacity). jQuery and Slick are gone.
- The side nav uses `IntersectionObserver`. Hashes are `#top`, `#about`, `#skills`, `#work`, and `#resume`.
- Smooth scroll is `scroll-behavior: smooth`.
- The on-page password generator was removed in the follow-up. The Python project remains a card in Work.
- The page is English only. The ES/EN toggle is gone.
- Icons are inline SVG. Font Awesome and ScrollReveal are not loaded.

## Stack

- Astro 7 (static output) and TypeScript strict.
- React 19 only in `SceneBackground`.
- Official `three`, not the vendored bundle.
- TagCloud for the skill sphere.
- Static deploy: Vercel can publish `dist/` with no adapter. `site` is `https://severaltool.vercel.app`.

The environment was Node 24. This Astro release requires Node `>= 22.23.4`.

## Phases

1. **Research** — this file, on `v2`, before the new code.
2. **Project** — `package.json`, Astro, React, TypeScript, `.gitignore`. `main` stays untouched.
3. **Static shell** — layout, metadata, CSS, and sections as `.astro` components. Images moved from ``Img`s`` to `public/images/`.
4. **Background** — `client:only="react"` island, with cleanup on unmount.
5. **Small islands** — language (later removed), TagCloud, galleries, nav. Drop jQuery, Slick, ScrollReveal, and `three-module.js`.
6. **Check** — `astro build`, a browser pass, and Lighthouse against the vanilla site served locally. Results in `docs/performance.md`.
7. **Docs** — `README.md` with scripts and a migration note.

## Left unchanged on purpose, at migration time

- Project order, links, and photos.
- Scene parameters: radius 7, detail 5, camera at `(7, 0, 5)`.
- The full-screen loader does not come back. It covered the title and hurt LCP for a flash of about 100 ms.
- The Khand files in the repo are not referenced by the old CSS, so they are not part of the new site.

The follow-up after the migration changed the copy to English, removed the password section, replaced the type system, and gave the wireframe a clock-driven spin. Those are product changes, not part of the original migration constraint.
