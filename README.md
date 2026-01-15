# Libreria Belen - sitio web

Proyecto front-end en HTML, CSS y JavaScript para una libreria con catalogo, carrito y detalle de productos.

## Paginas

- `index.html`: home con hero, carrusel de anuncios, productos destacados y ofertas.
- `catalogo.html`: grilla completa con filtros, busqueda y rating.
- `detail.html`: vista detallada de cada producto con variantes.

## Funcionalidades principales

- Buscador y filtros por categoria, precio y rating.
- Carrito persistente en `localStorage` con control de cantidades.
- Checkout basico que envia el pedido por WhatsApp.
- Carrusel de productos destacados con Swiper.
- Ofertas cargadas desde `assets/data/offers.json`.
- Vista rapida y navegacion al detalle desde las tarjetas.
- Formularios personalizados por servicio en la pagina de trabajos.

## Datos

- `assets/js/products.js`: catalogo completo de productos y metadatos.
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
- `assets/css/styles.css`: estilos globales.
- `assets/js/render-products.js`, `assets/js/product-carousel.js`, `assets/js/render-offers.js`: render de cards, carruseles y ofertas.
- `assets/js/search.js`: busqueda y filtros.
- `assets/js/cart.js`: carrito y checkout por WhatsApp.
- `assets/js/cards.js`: navegacion al detalle desde tarjetas.
- `trabajos.html`: pagina de servicios con modal de formularios por apartado.
- `assets/img`: imagenes y recursos visuales.

## Cambios recientes

- Reorganizacion de archivos en `assets/` (css, js, data, img).
- Ampliacion de contenido en "Servicios disponibles" y "Como trabajamos".
- Modal con formularios completos y personalizados por apartado en `trabajos.html`.
