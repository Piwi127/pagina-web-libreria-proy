# Libreria Belen - sitio web

Proyecto front-end en HTML, CSS y JavaScript para una libreria con catalogo, carrito, servicios de redaccion y detalle de productos.

## Como ejecutar

No requiere build. Abre `index.html` en el navegador.

## Estructura

- `index.html`: home principal con hero, carrusel, destacados y contacto rapido.
- `catalogo.html`, `detail.html`: catalogo y ficha de detalle.
- `ofertas.html`, `contacto.html`: promociones y contacto.
- `trabajos.html`, `redaccion.html` y subpaginas: servicios y formularios.
- `sitemap.xml`: mapa del sitio para SEO.
- `assets/css/styles.css`: estilos globales.
- `assets/js`: logica de carruseles, render, carrito, filtros y UI.
- `assets/data`: datos de ofertas y destacados.
- `assets/img`: imagenes y recursos visuales.

## Paginas

- `index.html`: home con carrusel, destacados, ofertas, noticias y contacto rapido.
- `catalogo.html`: landing del catalogo con aviso de actualizacion y CTA a WhatsApp.
- `detail.html`: vista detallada de cada producto con variantes, specs y resenas.
- `ofertas.html`: listado de promociones cargadas desde JSON.
- `contacto.html`: formulario, datos de la tienda y mapa base.
- `trabajos.html`: servicios de trabajos e investigaciones con modal por apartado.
- `redaccion.html`: landing de redaccion con accesos a formularios por tipo.
- `redaccion-cv.html`: ficha de CV con formulario embebido de Google Forms.
- `redaccion-documentos.html`: formulario para documentos en general.
- `redaccion-revision.html`: formulario de revision y mejora de documentos.

## Funcionalidades principales

- Busqueda y filtros por categoria, precio y rating (cuando el catalogo esta activo).
- Carrito persistente en `localStorage` con control de cantidades y variantes.
- Checkout con resumen, descarga en PDF y envio del pedido por WhatsApp.
- Carruseles con Swiper para hero y trabajos destacados.
- Ofertas y promociones desde `assets/data/offers.json`.
- Vista rapida y navegacion al detalle desde tarjetas.
- Formularios personalizados por servicio en trabajos e investigaciones.
- Contacto con envio a Google Apps Script y mensajes de estado.
- Animaciones de reveal, parallax y modales promocionales en el home.

## Datos y contenido

- `assets/js/products.js`: catalogo completo de productos y metadatos.
- `assets/js/product-specs.js`: specs adicionales y galerias para la ficha de detalle.
- `assets/data/featured-products.json`: productos destacados para el home.
- `assets/data/offers.json`: ofertas y promociones.

## Scripts principales

- `assets/js/render-products.js`, `assets/js/product-carousel.js`, `assets/js/render-offers.js`: render de cards, carruseles y ofertas.
- `assets/js/search.js`: busqueda, filtros y paginacion.
- `assets/js/cart.js`: carrito, checkout, PDF y WhatsApp.
- `assets/js/cards.js`: navegacion al detalle desde tarjetas.
- `assets/js/ui.js`: modales, promos, reveal, parallax y envio de formularios.

## Tecnologias

- HTML5, CSS3 y JavaScript (vanilla).
- Swiper via CDN.
- Google Fonts (Fraunces y Manrope).

## Mejoras nuevas

- Ticker de noticias en el hero con mensajes rotativos.
- Hero con control de autoplay (play/pausa) y accesibilidad mejorada.
- Spotlight destacado con modal de imagen ampliada.
- Seccion de campanas y testimonios para reforzar conversion.
- Toast promocional y modal con disparo por tiempo, scroll y salida.
- Animaciones reveal con stagger y parallax respetando `prefers-reduced-motion`.
- WhatsApp flotante con enlace dinamico a pedidos.
- Marcado JSON-LD en home, catalogo y detalle para SEO.
