# Nahuel Galeano — portfolio

Static personal site. Astro renders the page as HTML. React hydrates only the Three.js background.

## Requirements

- Node.js `>= 22.23.4`
- npm 9 or newer

## Scripts

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # static output in dist/
npm run preview   # serves dist/
```

## Deploy

`npm run build` writes `dist/`. Vercel publishes that folder with the Astro preset and no adapter. Production: [https://severaltool.vercel.app](https://severaltool.vercel.app).
