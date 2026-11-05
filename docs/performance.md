# Lighthouse: vanilla (`main`) frente a Astro (`v2`)

Medición local, una corrida por versión, el 2026-11-05.

| | v1 | v2 |
| --- | --- | --- |
| URL | `http://127.0.0.1:4173` (el `index.html` de `main`, servido estático) | `http://127.0.0.1:4321` (`astro preview` del build de producción) |
| Herramienta | Lighthouse 13.6.0, Chrome headless, móvil (preset por defecto) | igual |

## Puntajes

| Categoría | v1 | v2 |
| --- | ---: | ---: |
| Performance | 90 | 99 |
| Accessibility | 79 | 100 |
| Best practices | 96 | 100 |
| SEO | 91 | 100 |

## Métricas de carga

| Métrica | v1 | v2 |
| --- | ---: | ---: |
| First Contentful Paint | 2,3 s | 1,6 s |
| Largest Contentful Paint | 2,3 s | 1,6 s |
| Speed Index | 5,9 s | 1,9 s |
| Total Blocking Time | 30 ms | 40 ms |
| Cumulative Layout Shift | 0 | 0,001 |
| Time to Interactive | 6,7 s | 5,4 s |
| Peso total transferido | 5.847 KiB | 4.203 KiB |
| JavaScript transferido | 1.487.839 B | 207.162 B |

El JavaScript de v1 está dominado por `scripts/three-module.js` (1.412.947 B transferidos, sin minificar). En v2 el chunk del fondo (`SceneBackground`) transfiere unos 133 KB y React DOM unos 66 KB. TagCloud queda en un chunk aparte de unos 4 KB. El resto de la página no carga un framework.

Las fotos de proyectos siguen siendo la mayor parte de los 4,2 MB. No se recomprimieron en esta migración.

## Cómo leerlo

Es una sola pasada en local, no un PageSpeed contra el deploy de Vercel. v1 además descarga jQuery, Slick, ScrollReveal (no se usa), TagCloud y Font Awesome desde CDN, así que su tiempo incluye esa red. Aun así el salto de Speed Index (5,9 s → 1,9 s) y de LCP (2,3 s → 1,6 s) coincide con sacar el bundle de 1,4 MB del camino del HTML.

El Total Blocking Time queda casi igual (30 ms → 40 ms): parsear Three y React sigue ocupando el hilo principal, pero ya no arrastra jQuery ni el módulo sin minificar.

## Accesibilidad que sí cambió el puntaje

Lighthouse marcaba contraste insuficiente en los botones SOURCE y en Generate: texto chico blanco (o gris heredado) sobre `rgb(27, 120, 226)`, ratio 4,34 frente al 4,5 que pide AA. El fondo de esos controles pasó a `#1b73e2` (ratio 4,57 con blanco) y Generate dejó de heredar el gris del contenedor. El azul del resto del sitio no se tocó.

Los informes crudos están en `docs/lighthouse-v1.json` y `docs/lighthouse-v2.json`.
