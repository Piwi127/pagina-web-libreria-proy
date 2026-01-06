(() => {
  const grid = document.getElementById("product-grid");
  if (!grid) return;

  const createCard = (id, product) => {
    const tagClass = product.tag === "oferta" ? "badge-sale" : "badge-new";
    const tagText = product.tag === "oferta" ? "Oferta" : "Nuevo";
    const stockText = product.stock <= 3 ? "Stock bajo" : "En stock";
    const stockClass = product.stock <= 3 ? "stock low" : "stock";

    const article = document.createElement("article");
    article.className = "card";
    article.dataset.id = id;
    article.dataset.title = product.title;
    article.dataset.price = product.price.replace("S/ ", "");
    article.dataset.category = product.category || "";
    article.dataset.rating = product.rating || "0";
    article.dataset.stock = String(product.stock || 0);
    article.dataset.tag = product.tag || "";

    const linkButton = product.link
      ? `<a class="btn-ghost" href="${product.link}" target="_blank" rel="noopener">Ver proveedor</a>`
      : "";

    article.innerHTML = `
      <span class="badge ${tagClass}">${tagText}</span>
      <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async" />
      <span class="quick-view">Vista rapida</span>
      <h3>${product.title}</h3>
      <p>${product.short || ""}</p>
      <div class="meta">
        <span>Rating ${product.rating}</span>
        <span class="${stockClass}">${stockText}</span>
      </div>
      <div class="price-row">
        <span class="price">${product.price}</span>
        <button data-add-to-cart>Agregar al carrito</button>
      </div>
      ${linkButton}
    `;

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
    entries.forEach(([id, product]) => {
      grid.appendChild(createCard(id, product));
    });
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
