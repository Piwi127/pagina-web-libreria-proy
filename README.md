# Libreria Belen - sitio web

Proyecto front-end en HTML, CSS y JavaScript para una libreria con catalogo, carrito, servicios de redaccion y detalle de productos.

## Paginas

- `index.html`: home con hero, carrusel, destacados, ofertas y formulario rapido de contacto.
- `catalogo.html`: landing del catalogo con aviso de actualizacion y CTA a WhatsApp.
- `detail.html`: vista detallada de cada producto con variantes, specs y resenas.
- `ofertas.html`: listado de promociones cargadas desde JSON.
- `contacto.html`: formulario de contacto, datos de la tienda y mapa base.
- `trabajos.html`: servicios de trabajos e investigaciones con modal de formularios por apartado.
- `redaccion.html`: landing de redaccion con accesos a formularios por tipo.
- `redaccion-cv.html`: ficha de CV con formulario embebido de Google Forms.
- `redaccion-documentos.html`: formulario para documentos en general.
- `redaccion-revision.html`: formulario de revision y mejora de documentos.

## Funcionalidades principales

- Busqueda y filtros por categoria, precio y rating (cuando el catalogo esta activo).
- Carrito persistente en `localStorage` con control de cantidades y variantes.
- Checkout con resumen, descarga en PDF e envio del pedido por WhatsApp.
- Carruseles con Swiper para hero y trabajos destacados.
- Ofertas y promociones desde `assets/data/offers.json`.
- Vista rapida y navegacion al detalle desde tarjetas.
- Formularios personalizados por servicio en trabajos e investigaciones.
- Contacto con envio a Google Apps Script y mensajes de estado.
- Animaciones de reveal, parallax y modales promocionales en el home.

## Datos

- `assets/js/products.js`: catalogo completo de productos y metadatos.
- `assets/js/product-specs.js`: specs adicionales y galerias para la ficha de detalle.
- `assets/data/featured-products.json`: productos destacados para el home.
- `assets/data/offers.json`: ofertas y promociones.

## Tecnologias

- HTML5, CSS3 y JavaScript (vanilla).
- Swiper via CDN.
- Google Fonts (Fraunces y Manrope).

## Como ejecutar

No requiere build. Abre `index.html` en el navegador.

## Estructura

- `index.html`, `catalogo.html`, `detail.html`: vistas principales.
- `ofertas.html`, `contacto.html`: landing de promociones y contacto.
- `trabajos.html`, `redaccion.html` y subpaginas: servicios y formularios.
- `assets/css/styles.css`: estilos globales.
- `assets/js/render-products.js`, `assets/js/product-carousel.js`, `assets/js/render-offers.js`: render de cards, carruseles y ofertas.
- `assets/js/search.js`: busqueda, filtros y paginacion.
- `assets/js/cart.js`: carrito, checkout, PDF y WhatsApp.
- `assets/js/cards.js`: navegacion al detalle desde tarjetas.
- `assets/js/ui.js`: modales, reveal, parallax y envio de formularios de contacto.
- `assets/img`: imagenes y recursos visuales.

## Cambios recientes

- Nuevas paginas de ofertas, contacto y redaccion (CV, documentos y revision).
- Landing de catalogo con aviso de actualizacion y CTA directa a WhatsApp.
- Checkout con resumen, descarga PDF y seccion de pago con QR.
- Modales promocionales, toast y animaciones de reveal/parallax en el home.
- Ampliacion de contenidos y modal de formularios en `trabajos.html`.
