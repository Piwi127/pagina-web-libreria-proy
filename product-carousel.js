(() => {
  const wrapper = document.getElementById("product-swiper-wrapper");
  const empty = document.getElementById("product-swiper-empty");
  const countLabel = document.getElementById("product-swiper-count");
  if (!wrapper) return;

  const createSlide = (id, product, index, total) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "slide");
    slide.setAttribute("aria-label", `${index + 1} de ${total}`);
    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = id;
    card.dataset.title = product.title;
    const priceText = String(product.price || "S/ 0.00");
    card.dataset.price = priceText.replace("S/ ", "");
    card.dataset.category = product.category || "";
    card.dataset.rating = product.rating || "0";
    card.dataset.stock = String(product.stock || 0);
    card.dataset.tag = product.tag || "";

    const tagClass = product.tag === "oferta" ? "badge-sale" : "badge-new";
    const tagText = product.tag === "oferta" ? "Oferta" : "Nuevo";
    const stockText = product.stock <= 3 ? "Stock bajo" : "En stock";
    const stockClass = product.stock <= 3 ? "stock low" : "stock";

    const badge = document.createElement("span");
    badge.className = `badge ${tagClass}`;
    badge.textContent = tagText;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";

    const quickView = document.createElement("span");
    quickView.className = "quick-view";
    quickView.textContent = "Vista rapida";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const description = document.createElement("p");
    description.textContent = product.short || "";

    const meta = document.createElement("div");
    meta.className = "meta";
    const rating = document.createElement("span");
    rating.textContent = `Rating ${product.rating}`;
    const stock = document.createElement("span");
    stock.className = stockClass;
    stock.textContent = stockText;
    meta.append(rating, stock);

    const priceRow = document.createElement("div");
    priceRow.className = "price-row";
    const price = document.createElement("span");
    price.className = "price";
    price.textContent = "Muy pronto";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.addToCart = "";
    button.dataset.id = id;
    button.dataset.title = product.title;
    button.dataset.price = priceText.replace("S/ ", "");
    button.textContent = "Agregar";
    priceRow.append(price, button);

    card.append(
      badge,
      image,
      quickView,
      title,
      description,
      meta,
      priceRow
    );
    slide.appendChild(card);
    return slide;
  };

  const pickRandom = (entries, count) => {
    const copy = [...entries];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, count);
  };

  const renderCarousel = (products) => {
    const entries = Array.isArray(products)
      ? products.map((item) => [item.id, item])
      : Object.entries(products || {});
    if (entries.length === 0) {
      if (empty) empty.hidden = false;
      return false;
    }
    if (empty) empty.hidden = true;
    const selection = pickRandom(entries, Math.min(12, entries.length));
    wrapper.innerHTML = "";
    const fragment = document.createDocumentFragment();
    selection.forEach(([id, product], idx) => {
      fragment.appendChild(createSlide(id, product, idx, selection.length));
    });
    wrapper.appendChild(fragment);
    if (countLabel) {
      countLabel.textContent = `${selection.length} productos en el carrusel`;
    }
    return true;
  };

  const initSwiper = () => {
    if (typeof Swiper === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line no-new
    new Swiper(".product-swiper", {
      slidesPerView: 1,
      spaceBetween: 14,
      loop: true,
      speed: 550,
      slidesPerGroup: 1,
      grabCursor: true,
      autoplay: prefersReduced.matches
        ? false
        : {
            delay: 4200,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          },
      pagination: {
        el: ".product-swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".product-swiper-next",
        prevEl: ".product-swiper-prev",
      },
      breakpoints: {
        640: { slidesPerView: 2 },
        960: { slidesPerView: 3 },
      },
    });
  };

  let productsScriptLoaded = false;
  const loadProducts = () =>
    new Promise((resolve, reject) => {
      if (window.PRODUCTS) {
        productsScriptLoaded = true;
        resolve(window.PRODUCTS);
        return;
      }
      if (productsScriptLoaded) {
        resolve(window.PRODUCTS || {});
        return;
      }
      const script = document.createElement("script");
      script.src = "products.js";
      script.defer = true;
      script.onload = () => {
        productsScriptLoaded = true;
        resolve(window.PRODUCTS || {});
      };
      script.onerror = () => reject(new Error("No se pudo cargar products.js"));
      document.head.appendChild(script);
    });

  const boot = async () => {
    try {
      const products = await loadProducts();
      if (renderCarousel(products)) initSwiper();
    } catch (error) {
      console.warn(error);
      renderCarousel([]);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
