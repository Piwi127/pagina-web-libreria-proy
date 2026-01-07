(() => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const createCard = (id, product) => {
    const tagClass = product.tag === "oferta" ? "badge-sale" : "badge-new";
    const tagText = product.tag === "oferta" ? "Oferta" : "Nuevo";
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
    price.textContent = priceText;
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.addToCart = "";
    button.textContent = "Agregar al carrito";
    priceRow.append(price, button);

    article.append(
      badge,
      image,
      quickView,
      title,
      description,
      meta,
      priceRow
    );

    if (product.link) {
      const link = document.createElement("a");
      link.className = "btn-ghost";
      link.href = product.link;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Ver proveedor";
      article.appendChild(link);
    }

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
