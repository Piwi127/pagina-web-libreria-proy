(() => {
  const grid = document.getElementById("offers-grid");
  const empty = document.getElementById("offers-empty");
  const WHATSAPP_NUMBER = "51947872207";

  const render = (offers) => {
    if (!grid) return;
    grid.innerHTML = "";
    if (!offers || offers.length === 0) {
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    const fragment = document.createDocumentFragment();
    offers.forEach((offer) => {
      const message = encodeURIComponent(
        `Hola, quiero la oferta: ${offer.title}`
      );
      const article = document.createElement("article");
      article.className = "offer-card";

      const title = document.createElement("h3");
      title.textContent = offer.title;
      const description = document.createElement("p");
      description.textContent = offer.description;
      const price = document.createElement("div");
      price.className = "offer-price";
      price.textContent = offer.price;
      const link = document.createElement("a");
      link.className = "btn-primary";
      link.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = "Aprovechar";

      article.append(title, description, price, link);
      fragment.appendChild(article);
    });
    grid.appendChild(fragment);
  };

  const load = async () => {
    try {
      const response = await fetch("assets/data/offers.json", { cache: "no-store" });
      if (!response.ok) throw new Error("No se pudo cargar ofertas");
      const data = await response.json();
      render(data);
    } catch (error) {
      console.warn(error);
      render([]);
    }
  };

  if (grid) {
    load();
  }
})();
