(() => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const createCard = (id, product) => {
    const ratingValue = Number(product.rating || 0);
    const priceValue = Number(String(product.price || "").replace(/[^\d.]/g, ""));
    const isOffer = product.tag === "oferta";
    const isTop = ratingValue >= 4.5 && priceValue >= 8;
    const tagClass = isOffer ? "badge-sale" : isTop ? "badge-top" : "badge-new";
    const tagText = isOffer ? "Oferta" : isTop ? "Top" : "Nuevo";
    const stockText = product.stock <= 3 ? "Stock bajo" : "En stock";
    const stockClass = product.stock <= 3 ? "stock low" : "stock";
    const priceText = String(product.price || "S/ 0.00");

    const article = document.createElement("article");
    article.className = "card";
    article.dataset.id = id;
    article.dataset.title = product.title;
    article.dataset.price = priceText.replace("S/ ", "");
    article.dataset.category = product.category || "";
    article.dataset.rating = product.rating || "0";
    article.dataset.stock = String(product.stock || 0);
    article.dataset.tag = product.tag || "";

    const badge = document.createElement("span");
    badge.className = `badge ${tagClass}`;
    badge.textContent = tagText;

    const imageWrap = document.createElement("div");
    imageWrap.className = "image-frame";
    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.title;
    image.loading = "lazy";
    image.decoding = "async";
    const logo = document.createElement("img");
    logo.className = "image-logo";
    logo.src = "assets/img/logonuevo.png";
    logo.alt = "Librería Belén";
    logo.loading = "lazy";
    logo.decoding = "async";
    imageWrap.append(image, logo);

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
    price.textContent = "PROXIMAMENTE";
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.addToCart = "";
    button.textContent = "Agregar al carrito";
    priceRow.append(price, button);

    article.append(
      badge,
      imageWrap,
      quickView,
      title,
      description,
      meta,
      priceRow
    );

    return article;
  };

  const render = () => {
    const products = window.PRODUCTS || {};
    const entries = Object.entries(products);
    if (entries.length === 0) {
      grid.innerHTML =
        "<p class=\"no-results\">No se encontraron productos para mostrar.</p>";
      return false;
    }

    grid.innerHTML = "";
    const fragment = document.createDocumentFragment();
    entries.forEach(([id, product]) => {
      fragment.appendChild(createCard(id, product));
    });
    grid.appendChild(fragment);
    document.dispatchEvent(new Event("products:rendered"));
    return true;
  };

  if (!render()) {
    let attempts = 0;
    const timer = setInterval(() => {
      attempts += 1;
      if (render() || attempts > 20) {
        clearInterval(timer);
      }
    }, 100);
  }
})();
