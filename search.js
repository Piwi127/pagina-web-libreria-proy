(() => {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const noResults = document.getElementById("no-results");
  const resultsCount = document.getElementById("results-count");
  const chips = Array.from(document.querySelectorAll(".chip"));
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");
  const ratingFilter = document.getElementById("rating-filter");

  if (!input || !button) {
    return;
  }

  let activeCategory = "all";

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const getCardText = (card) => {
    const title = card.dataset.title || "";
    const description = card.querySelector("p")?.textContent || "";
    const category = card.dataset.category || "";
    return normalize(`${title} ${description} ${category}`);
  };

  const getPrice = (card) => Number(card.dataset.price || 0);
  const getRating = (card) => Number(card.dataset.rating || 0);

  const updateCount = (visible) => {
    if (!resultsCount) return;
    const label = visible === 1 ? "resultado" : "resultados";
    resultsCount.textContent = `${visible} ${label}`;
  };

  const setActiveChip = (chip) => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeCategory = chip.dataset.category || "all";
  };

  const updatePriceLimits = () => {
    if (!priceRange || !priceValue) return;
    const cards = Array.from(document.querySelectorAll(".card"));
    if (cards.length === 0) return;
    const maxPrice = Math.ceil(
      Math.max(...cards.map((card) => getPrice(card) || 0))
    );
    if (!Number.isFinite(maxPrice) || maxPrice <= 0) return;
    if (
      !priceRange.dataset.initialized ||
      Number(priceRange.value) < maxPrice
    ) {
      priceRange.max = String(maxPrice);
      priceRange.value = String(maxPrice);
      priceValue.textContent = `S/ ${priceRange.value}`;
      priceRange.dataset.initialized = "1";
    }
  };

  const filterCards = () => {
    const cards = Array.from(document.querySelectorAll(".card"));
    const query = normalize(input.value.trim());
    const maxPrice = Number(priceRange ? priceRange.value : 9999);
    const minRating = Number(ratingFilter ? ratingFilter.value : 0);
    let visible = 0;

    if (cards.length === 0) {
      updateCount(0);
      if (noResults) noResults.hidden = false;
      return;
    }

    cards.forEach((card) => {
      const haystack = getCardText(card);
      const matchSearch = query === "" || haystack.includes(query);
      const matchCategory =
        activeCategory === "all" || card.dataset.category === activeCategory;
      const matchPrice = getPrice(card) <= maxPrice;
      const matchRating = getRating(card) >= minRating;
      const match = matchSearch && matchCategory && matchPrice && matchRating;

      card.style.display = match ? "" : "none";
      if (match) visible += 1;
    });

    updateCount(visible);
    if (noResults) {
      noResults.hidden = visible !== 0;
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      setActiveChip(chip);
      filterCards();
    });
  });

  if (priceRange && priceValue) {
    priceValue.textContent = `S/ ${priceRange.value}`;
    priceRange.addEventListener("input", () => {
      priceValue.textContent = `S/ ${priceRange.value}`;
      filterCards();
    });
  }

  if (ratingFilter) {
    ratingFilter.addEventListener("change", filterCards);
  }

  input.addEventListener("input", filterCards);
  button.addEventListener("click", filterCards);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      filterCards();
    }
  });

  updatePriceLimits();
  filterCards();

  document.addEventListener("products:rendered", () => {
    updatePriceLimits();
    filterCards();
  });
})();
