(() => {
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;

    if (target.matches("[data-add-to-cart]")) {
      event.stopPropagation();
      return;
    }

    if (target.closest("a, button, input, select, textarea, [role='button']")) {
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
