(() => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches("[data-add-to-cart]")) {
      event.stopPropagation();
      return;
    }

    const card = target.closest(".card");
    if (!card) return;
    const id = card.dataset.id;
    if (id) {
      window.open(`detail.html?id=${id}`, "_blank", "noopener");
    }
  });
})();
