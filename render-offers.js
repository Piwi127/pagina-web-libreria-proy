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
    offers.forEach((offer) => {
      const message = encodeURIComponent(
        `Hola, quiero la oferta: ${offer.title}`
      );
      const article = document.createElement("article");
      article.className = "offer-card";
      article.innerHTML = `
        <h3>${offer.title}</h3>
        <p>${offer.description}</p>
        <div class="offer-price">${offer.price}</div>
        <a class="btn-primary" href="https://wa.me/${WHATSAPP_NUMBER}?text=${message}" target="_blank" rel="noopener">Aprovechar</a>
      `;
      grid.appendChild(article);
    });
  };

  const load = async () => {
    try {
      const response = await fetch("offers.json", { cache: "no-store" });
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
