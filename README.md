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
- Ofertas cargadas desde `offers.json`.
- Vista rapida y navegacion al detalle desde las tarjetas.

## Datos

- `products.js`: catalogo completo de productos y metadatos.
- `featured-products.json`: productos destacados para el home.
- `offers.json`: ofertas y promociones.

## Tecnologias

- HTML5, CSS3 y JavaScript (vanilla).
- Swiper via CDN.
- Google Fonts (Fraunces y Manrope).

## Como ejecutar

No requiere build. Abre `index.html` en el navegador.

## Estructura

- `index.html`, `catalogo.html`, `detail.html`: vistas principales.
- `styles.css`: estilos globales.
- `render-products.js`, `product-carousel.js`, `render-offers.js`: render de cards, carruseles y ofertas.
- `search.js`: busqueda y filtros.
- `cart.js`: carrito y checkout por WhatsApp.
- `cards.js`: navegacion al detalle desde tarjetas.
