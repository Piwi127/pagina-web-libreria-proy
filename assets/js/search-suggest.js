(() => {
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const suggest = document.getElementById("search-suggest");

  if (!input || !suggest) return;

  const normalize = (value) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  let productsIndex = [];
  let productsLoaded = false;

  const buildIndex = (products) => {
    const entries = Array.isArray(products)
      ? products.map((item) => [item.id, item])
      : Object.entries(products || {});
    productsIndex = entries.map(([id, product]) => {
      const title = product.title || "";
      const category = product.category || "";
      const short = product.short || "";
      return {
        id,
        title,
        category,
        short,
        image: product.image || "",
        text: normalize(`${title} ${category} ${short}`),
      };
    });
  };

  const loadProducts = () =>
    new Promise((resolve, reject) => {
      if (window.PRODUCTS) {
        productsLoaded = true;
        resolve(window.PRODUCTS);
        return;
      }
      if (productsLoaded) {
        resolve(window.PRODUCTS || {});
        return;
      }
      const script = document.createElement("script");
      script.src = "assets/js/products.js";
      script.defer = true;
      script.onload = () => {
        productsLoaded = true;
        resolve(window.PRODUCTS || {});
      };
      script.onerror = () => reject(new Error("No se pudo cargar products.js"));
      document.head.appendChild(script);
    });

  const hideSuggest = () => {
    suggest.hidden = true;
    input.setAttribute("aria-expanded", "false");
  };

  const showSuggest = () => {
    suggest.hidden = false;
    input.setAttribute("aria-expanded", "true");
  };

  const clearActive = () => {
    suggest
      .querySelectorAll(".search-suggest-item.is-active")
      .forEach((item) => item.classList.remove("is-active"));
  };

  const setActiveByIndex = (index) => {
    const items = Array.from(suggest.querySelectorAll(".search-suggest-item"));
    if (items.length === 0) return;
    const clamped = Math.max(0, Math.min(index, items.length - 1));
    clearActive();
    items[clamped].classList.add("is-active");
    items[clamped].scrollIntoView({ block: "nearest" });
  };

  const renderResults = (results) => {
    suggest.innerHTML = "";

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-suggest-empty";
      empty.textContent = "Sin resultados.";
      suggest.appendChild(empty);
      showSuggest();
      return;
    }

    results.forEach((product) => {
      const link = document.createElement("a");
      link.href = `detail.html?id=${product.id}`;
      link.className = "search-suggest-item";
      link.setAttribute("role", "option");

      const thumb = document.createElement("img");
      thumb.className = "search-suggest-thumb";
      thumb.src = product.image;
      thumb.alt = product.title;
      thumb.loading = "lazy";
      thumb.decoding = "async";

      const text = document.createElement("div");
      text.className = "search-suggest-text";
      const title = document.createElement("h4");
      title.textContent = product.title;
      const meta = document.createElement("p");
      meta.textContent = product.category || "Producto";
      text.append(title, meta);

      const cta = document.createElement("span");
      cta.className = "search-suggest-cta";
      cta.textContent = "Ver detalle";

      link.append(thumb, text, cta);
      suggest.appendChild(link);
    });

    showSuggest();
  };

  const scoreResult = (product, query) => {
    const title = normalize(product.title);
    if (title.startsWith(query)) return 0;
    const idxTitle = title.indexOf(query);
    if (idxTitle >= 0) return 1;
    const idxText = product.text.indexOf(query);
    if (idxText >= 0) return 2;
    return 3;
  };

  const filterProducts = (query) => {
    if (!query) {
      hideSuggest();
      return;
    }
    if (productsIndex.length === 0) {
      renderResults([]);
      return;
    }
    const matches = productsIndex
      .filter((product) => product.text.includes(query))
      .sort((a, b) => scoreResult(a, query) - scoreResult(b, query))
      .slice(0, 6);
    renderResults(matches);
  };

  const handleInput = () => {
    const query = normalize(input.value.trim());
    filterProducts(query);
  };

  const handleKeyDown = (event) => {
    if (suggest.hidden) return;
    const items = Array.from(suggest.querySelectorAll(".search-suggest-item"));
    if (items.length === 0) return;

    const currentIndex = items.findIndex((item) =>
      item.classList.contains("is-active")
    );
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveByIndex(currentIndex + 1);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveByIndex(currentIndex - 1);
    }
    if (event.key === "Enter") {
      const active =
        items[currentIndex] || items[0];
      if (active) {
        active.click();
      }
    }
    if (event.key === "Escape") {
      hideSuggest();
    }
  };

  const handleOutsideClick = (event) => {
    if (!(event.target instanceof HTMLElement)) return;
    if (event.target.closest(".search-wrap")) return;
    hideSuggest();
  };

  const boot = async () => {
    try {
      const products = await loadProducts();
      buildIndex(products);
    } catch (error) {
      console.warn(error);
    }
  };

  input.addEventListener("input", handleInput);
  input.addEventListener("keydown", handleKeyDown);
  if (button) {
    button.addEventListener("click", handleInput);
  }
  document.addEventListener("click", handleOutsideClick);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
