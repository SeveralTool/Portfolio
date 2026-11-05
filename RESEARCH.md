# Investigación: migración del portafolio a un stack con islas

Fecha: 2026-11-04. Rama: `v2`. Base medida: `main` (`index.html`, `main.css`, `scripts/main.js`, `scripts/3d.js`).

## Qué hay hoy

El sitio es una sola página estática con identidad visual apoyada en un fondo WebGL. No hay router, ni estado compartido, ni CMS.

| Pieza | Dónde vive | ¿Necesita JavaScript? |
| --- | --- | --- |
| Hero, textos, proyectos, CV, footer | `index.html` + `main.css` | No |
| Fondo icosaedro | `scripts/3d.js` + `scripts/three-module.js` (1,4 MB) | Sí, solo en el navegador |
| Nube de iconos | TagCloud 2.2 por CDN, dentro de `3d.js` | Sí, al llegar a habilidades |
| Carruseles | jQuery 3.6 + Slick 1.8 | Sí, pero el efecto es un fundido |
| Idioma ES/EN | `scripts/main.js` + `localStorage` | Sí, muy poco |
| Nav lateral | offsets de scroll en `main.js` | Sí, muy poco |
| Generador de contraseñas | `main.js` | Sí, muy poco |
| Hover de redes | listeners en `main.js` | No: alcanza con CSS |
| ScrollReveal | CDN en `index.html` | No se llama en ningún script |
| `main.py` / `scripts/main.py` | Python suelto | No los usa la página |

El HTML de producción además tiene problemas que la migración puede corregir sin cambiar la estética: `#load-window` está fuera de `<body>`, hay `<button>` dentro de `<a>`, varios carruseles comparten `id="carrousel5"`, y la navegación vive en un segundo `<footer>`.

En el fondo 3D hay tres detalles que sí cambian el comportamiento si se “arreglan” a ciegas:

- Hay dos bucles `requestAnimationFrame`. El visible es el que suma `0.0002` rad por frame en cada eje.
- Se crea un `THREE.Clock` dentro del frame, así que `getDelta()` vale ~0. La rotación extra `0.5 * delta` no se ve. Conservar esa línea con un reloj persistente aceleraría la esfera.
- El `resize` solo corre cuando `innerWidth % 10 === 0`, y no hay `dispose` al salir.

## React + Vite, o Astro

Un portafolio de este tipo es HTML estático con una isla pesada (WebGL) y cuatro islas chicas. La métrica que importa no es la velocidad del dev server: es cuánto JavaScript llega al cliente antes del primer contenido.

| Criterio | React + Vite (SPA) | Astro |
| --- | --- | --- |
| JS en el primer load | React, React DOM y el runtime de toda la página, aunque el markup no tenga estado | Cero por defecto. Cada isla declara su script |
| LCP | El texto del hero espera a que hidrate el árbol | El hero es HTML. El canvas no es el elemento LCP (queda fijo, detrás, `z-index` negativo) |
| TTI / TBT | Un solo bundle compite con el hilo principal | Three.js se aísla. jQuery y Slick no hace falta traerlos |
| Three.js y SSR | En Vite no hay SSR, así que `window` no rompe el build. Igual hay que crear el renderer en `useEffect` | El servidor no tiene `window`, `document` ni WebGL. Hay que evitar renderizar el canvas en el build |
| DX de este repo | Hay que reescribir cada sección a JSX para poder usar un fondo | Las secciones estáticas siguen siendo HTML. Solo el fondo (y, si hiciera falta, otras islas) salen del HTML |
| Contenido bilingüe | Estado de React en un layout que envuelve todo, o contexto | `data-lang` en `<html>` y un script de unas líneas. El HTML de ambos idiomas ya está en la página, como ahora |

React + Vite sería razonable si la página entera fuera un configurador 3D. Aquí el 80 % es texto, imágenes y enlaces. Convertirlo en SPA paga el runtime de React para marcar clases y leer `localStorage`.

### Caso real

[Achraf Garai](https://www.achrafgarai.com/moving-my-portfolio-from-next-js-to-astro/) migró un portafolio con escenas Three.js, Framer Motion y video desde Next.js a Astro. En Next el bundle de cada página incluía React, React Three Fiber y las librerías de animación aunque la mayor parte de la vista fuera estática. En Astro el layout quedó en HTML y las escenas pasaron a islas (`client:load` en el hero, `client:visible` debajo del pliegue, `client:idle` en utilidades). El resultado que documenta: menos JavaScript en páginas sin 3D, mejor First Contentful Paint y escenas que ya no compiten con el resto del árbol por el hilo principal.

No es el único dato. [Oto Macenauer](https://www.macenauer.net/blog/moving-my-site-to-astro-548-kb-of-javascript-deleted/) midió un currículum que era todo `"use client"` sin un solo `useState`: 548.939 bytes de JavaScript pasaron a 0, con la misma altura de página en 375, 768 y 1440 px. [Aniruddh Atrey](https://www.aniruddhatrey.com/blog/architecture-behind-3d-portfolio) separa el chunk de Three.js (~1 MB) para que solo cargue donde hay escena. El patrón es el mismo: el peso de Three no desaparece, pero deja de arrastrar al resto del documento.

Eso encaja con este repositorio. El `three-module.js` actual pesa 1,4 MB y se descarga junto con jQuery, Slick, ScrollReveal (muerto) y dos hojas de Font Awesome.

## Cómo integrar Three.js

El fondo es un `IcosahedronGeometry(7, 5)`, una malla invisible, puntos en los vértices, `EdgesGeometry` y una rotación constante. No hay controles de órbita, ni materiales PBR, ni estado de UI dentro del frame.

Opciones consideradas:

1. **`@react-three/fiber` + `@react-three/drei`.** El reconciler de R3F conviene cuando la escena es un árbol de componentes que reacciona a props. Aquí no hay props. `useFrame` existe para no usar `setState` en el loop, pero el loop actual ya muta `rotation` directo. Sumar Fiber y Drei agrega otro runtime encima de `three` para reproducir ~80 líneas. La guía de R3F pide mutar refs en `useFrame`, limitar el pixel ratio (`dpr={[1, 2]}`) y no recrear geometrías. Esas reglas se pueden cumplir sin Fiber.
2. **Componente React que llama a `three` dentro de `useEffect`.** Cumple el ciclo montar / limpiar (`dispose` de geometrías, materiales y renderer) y la directiva `client:only="react"`. El costo es enviar React y React DOM (~runtime que esta página no usa para nada más) solo para un efecto.
3. **Módulo de cliente sin framework.** Un `<script>` de Astro solo corre en el navegador, así que no hay error de SSR, y el chunk de `three` queda separado del HTML. Es el menor JS posible. No aporta un modelo de componentes que el resto del sitio vaya a compartir.

**Decisión:** Astro como framework, y el fondo como isla React (`@astrojs/react`) montada con `client:only="react"`, implementada con `three` imperativo. No se usa React Three Fiber.

Motivos:

- El prompt pide esa frontera: React solo para el canvas, el resto en `.astro`. Dejar el fondo en React mantiene el ciclo de vida (montaje, `resize`, `dispose`) explícito y deja un lugar donde más adelante puede entrar interacción sin reescribir la página.
- `client:visible` no aplica. El canvas es `position: fixed` sobre el primer viewport. `client:only` carga al abrir la página, igual que `client:load`, pero no intenta renderizar Three en el build. Documentación de Astro: con `client:only` el servidor no emite HTML del componente; hace falta un `slot="fallback"` para no dejar un hueco. El fallback es el mismo contenedor fijo, así que no hay salto de layout. El LCP sigue siendo el título, que es HTML.
- `client:idle` retrasaría el fondo que define la portada. Se prioriza que la esfera arranque en cuanto el módulo llega, no después del idle.
- Dentro del efecto no hay `setState`. La rotación muta la malla. `setPixelRatio` queda en `min(devicePixelRatio, 2)`. Al desmontar se hace `dispose` y se cancela el frame.
- La velocidad se conserva en `0.0002` rad/frame. No se “corrige” el reloj roto, porque eso cambiaría la animación que ya está en producción.
- El `resize` sí se corrige: pasa a escuchar el evento siempre. Es un bug, no un rasgo visual.
- `prefers-reduced-motion: reduce` deja la esfera quieta en el primer frame. `visibilitychange` pausa el loop con la pestaña oculta.

El resto de la interacción no entra en React, para no multiplicar islas del mismo runtime:

- Idioma: `data-lang` en `<html>`, con un script inline mínimo para evitar el flash, y CSS. Español sigue siendo el default sin JS (`.eng { display: none }`).
- Nube de habilidades: TagCloud, igual que ahora, en un script de la sección. Así el chunk no bloquea el hero.
- Carruseles: fundido en vanilla (1500 ms, transición 500 ms). Se eliminan jQuery y Slick.
- Hover de redes: CSS `:hover`.
- Nav: `IntersectionObserver` en lugar de offsets con el ajuste manual de `-5000`. Los `href` siguen apuntando a `#nivel1` … `#nivel6`.
- Scroll suave: `scroll-behavior: smooth`, que ya estaba en el CSS. Se elimina el `preventDefault` que reimplementaba el mismo ease.
- Generador: mismo alfabeto, largo 32 y temporizador de 10 s. Se usa `crypto.getRandomValues` en lugar de `Math.random`.

Font Awesome queda en una sola hoja CSS (iconos), sin el kit JS y sin la segunda hoja 5.15. ScrollReveal no se reintroduce.

## Stack elegido

- Astro 7 (salida estática) y TypeScript strict.
- React 19 solo en `SceneBackground`.
- `three` oficial, no el bundle vendido.
- TagCloud para la esfera de iconos.
- CSS global portado de `main.css` (misma tipografía Braah One, mismos breakpoints 1249 / 1000 / 560, mismo layout de grilla).
- Deploy estático: `dist/` lo puede publicar Vercel sin adapter. `site` queda en `https://severaltool.vercel.app`.

Node del entorno: 24. Astro 7 pide Node `>=22.12`.

## Plan por fases

1. **Investigación** — este archivo, en `v2`, antes del código nuevo.
2. **Proyecto** — `package.json`, Astro, React, TypeScript, `.gitignore`. La rama `main` no se toca.
3. **Shell estático** — layout, metadatos, CSS y secciones (hero, intro, habilidades, proyectos, generador, CV, footer, nav) como componentes `.astro`. Imágenes de ``Img`s`` a `public/images/`.
4. **Fondo** — isla `client:only="react"` con la escena portada y limpieza al desmontar.
5. **Islas chicas** — idioma, TagCloud, carrusel, contraseña, nav. Quitar jQuery, Slick, ScrollReveal y `three-module.js`.
6. **Verificación** — `astro build`, recorrido en el navegador (idioma, anclas, carrusel, contraseña, canvas) y Lighthouse contra la versión vanilla servida en local. Resultados en `docs/performance.md`.
7. **Documentación** — `README.md` con scripts y nota de migración.

## Qué no se va a cambiar a propósito

- Copy bilingüe, orden de proyectos, enlaces y fotos.
- Parámetros de la escena (radio 7, detalle 5, cámara en `(7, 0, 5)`, color de aristas `rgb(15, 15, 15)`, tamaño de punto `0.001`).
- La pantalla de carga a pantalla completa no vuelve: tapa el título y empeora el LCP para un flash de ~100 ms. El fondo y la tipografía siguen siendo la identidad.
- Las fuentes Khand del repo no están referenciadas por `main.css`. No entran al sitio nuevo.
