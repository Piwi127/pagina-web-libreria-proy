(() => {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const noResults = document.getElementById("no-results");
  const resultsCount = document.getElementById("results-count");
  const pagination = document.getElementById("pagination");
  const pageNumbers = document.getElementById("page-numbers");
  const pageStatus = document.getElementById("page-status");
  const pageButtons = pagination
    ? Array.from(pagination.querySelectorAll("[data-page]"))
    : [];
  const chips = Array.from(document.querySelectorAll(".chip"));
  const priceRange = document.getElementById("price-range");
  const priceValue = document.getElementById("price-value");
  const ratingFilter = document.getElementById("rating-filter");

  if (!input || !button) {
    return;
  }

  let activeCategory = "all";
  let currentPage = 1;
  const pageSize = 8;

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

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

  let cards = [];
  let cardCache = new Map();
  let filteredCards = [];

  const buildCardCache = () => {
    cards = Array.from(document.querySelectorAll(".card"));
    cardCache = new Map();
    cards.forEach((card) => {
      const title = card.dataset.title || "";
      const description = card.querySelector("p")?.textContent || "";
      const category = card.dataset.category || "";
      cardCache.set(card, {
        text: normalize(`${title} ${description} ${category}`),
        price: getPrice(card),
        rating: getRating(card),
        category,
      });
    });
  };

  const updatePriceLimits = () => {
    if (!priceRange || !priceValue) return;
    if (cards.length === 0) return;
    const maxPrice = Math.ceil(
      Math.max(
        ...cards.map((card) => {
          const data = cardCache.get(card);
          return data ? data.price : getPrice(card) || 0;
        })
      )
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

  const updatePagination = (total) => {
    if (!pagination || !pageNumbers) return;
    const totalPages = Math.ceil(total / pageSize);
    if (totalPages <= 1) {
      pagination.hidden = true;
      if (pageStatus) pageStatus.textContent = "";
      return;
    }

    pagination.hidden = false;
    pageNumbers.innerHTML = "";
    for (let i = 1; i <= totalPages; i += 1) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "page-number";
      button.dataset.page = String(i);
      button.textContent = String(i);
      if (i === currentPage) {
        button.classList.add("active");
      }
      pageNumbers.appendChild(button);
    }

    pageButtons.forEach((button) => {
      const direction = button.dataset.page;
      if (direction === "prev") {
        button.disabled = currentPage <= 1;
      }
      if (direction === "next") {
        button.disabled = currentPage >= totalPages;
      }
    });

    if (pageStatus) {
      pageStatus.textContent = `Pagina ${currentPage} de ${totalPages}`;
    }
  };

  const applyPagination = () => {
    if (filteredCards.length === 0) {
      if (pagination) pagination.hidden = true;
      if (pageStatus) pageStatus.textContent = "";
      return;
    }

    const totalPages = Math.ceil(filteredCards.length / pageSize);
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    filteredCards.forEach((card, index) => {
      card.style.display = index >= start && index < end ? "" : "none";
    });

    updatePagination(filteredCards.length);
  };

  const filterCards = (resetPage = false) => {
    const query = normalize(input.value.trim());
    const maxPrice = Number(priceRange ? priceRange.value : 9999);
    const minRating = Number(ratingFilter ? ratingFilter.value : 0);
    let visible = 0;
    filteredCards = [];

    if (cards.length === 0) {
      updateCount(0);
      if (noResults) noResults.hidden = false;
      return;
    }

    cards.forEach((card) => {
      const data =
        cardCache.get(card) ||
        (() => {
          const title = card.dataset.title || "";
          const description = card.querySelector("p")?.textContent || "";
          const category = card.dataset.category || "";
          return {
            text: normalize(`${title} ${description} ${category}`),
            price: getPrice(card),
            rating: getRating(card),
            category,
          };
        })();
      const matchSearch = query === "" || data.text.includes(query);
      const matchCategory =
        activeCategory === "all" || data.category === activeCategory;
      const matchPrice = data.price <= maxPrice;
      const matchRating = data.rating >= minRating;
      const match = matchSearch && matchCategory && matchPrice && matchRating;

      if (match) {
        filteredCards.push(card);
        visible += 1;
      } else {
        card.style.display = "none";
      }
    });

    updateCount(visible);
    if (noResults) {
      noResults.hidden = visible !== 0;
    }

    if (resetPage) currentPage = 1;
    applyPagination();
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      setActiveChip(chip);
      filterCards(true);
    });
  });

  if (priceRange && priceValue) {
    priceValue.textContent = `S/ ${priceRange.value}`;
    priceRange.addEventListener("input", () => {
      priceValue.textContent = `S/ ${priceRange.value}`;
      filterCards(true);
    });
  }

  if (ratingFilter) {
    ratingFilter.addEventListener("change", () => filterCards(true));
  }

  input.addEventListener("input", () => filterCards(true));
  button.addEventListener("click", () => filterCards(true));
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      filterCards(true);
    }
  });

  if (pagination) {
    pagination.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const page = target.dataset.page;
      if (!page) return;
      if (page === "prev") {
        currentPage -= 1;
      } else if (page === "next") {
        currentPage += 1;
      } else {
        currentPage = Number(page);
      }
      applyPagination();
    });
  }

  buildCardCache();
  updatePriceLimits();
  filterCards(true);

  document.addEventListener("products:rendered", () => {
    buildCardCache();
    updatePriceLimits();
    filterCards(true);
  });
})();
