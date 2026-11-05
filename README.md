# Portafolio — v2

Sitio personal de Nahuel Galeano. Esta rama (`v2`) reemplaza el HTML, CSS y JavaScript sueltos por **Astro 7**. El contenido sigue siendo estático. React solo hidrata el fondo Three.js.

La versión anterior queda en `main`.

## Requisitos

- Node.js `>= 22.23.4` (lo pide Astro 7)
- npm 9 o superior

## Scripts

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # salida estática en dist/
npm run preview  # sirve dist/
```

## Despliegue

El build es estático (`dist/`). En Vercel el preset de Astro publica esa carpeta sin adapter. El sitio de producción sigue siendo [https://severaltool.vercel.app](https://severaltool.vercel.app); hay que apuntar el proyecto a la rama `v2` cuando se quiera reemplazar el deploy de `main`.

## Qué cambió

- Header, textos, proyectos, CV y footer son componentes `.astro`. No envían JavaScript.
- El icosaedro vive en `src/components/SceneBackground.tsx` y se monta con `client:only="react"`, así Three.js no corre en el build.
- El pixel ratio del canvas queda en `min(devicePixelRatio, 2)`. Al desmontar se liberan geometrías, materiales y el contexto WebGL.
- La nube de habilidades sigue siendo TagCloud. Los carruseles ya no usan jQuery ni Slick. El idioma, la navegación y el generador son scripts chicos.
- `scripts/three-module.js` (1,4 MB) salió del sitio. El detalle de la decisión está en `RESEARCH.md` y la medición en `docs/performance.md`.

## Notas

Las fuentes Khand de `Fonts/` y los scripts `main.py` / `scripts/main.py` no los usa la página. El generador del sitio está en `src/scripts/password.ts`.
