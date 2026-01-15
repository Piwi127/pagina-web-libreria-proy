(() => {
  const CART_KEY = "cartItems";
  const panel = document.getElementById("cart-panel");
  if (!panel) {
    return;
  }

  const itemsContainer = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEls = document.querySelectorAll("[data-cart-count]");
  const toggleButtons = document.querySelectorAll("[data-cart-toggle]");
  const closeButton = panel.querySelector(".cart-close");
  const checkoutButton = panel.querySelector(".cart-checkout");
  const checkoutForm = document.getElementById("checkout-form");
  const paymentSection = document.getElementById("payment-section");
  const orderSummary = document.getElementById("order-summary");
  const downloadPdfButton = document.getElementById("download-pdf");
  const sendWhatsappButton = panel.querySelector("[data-send-whatsapp]");
  const customerName = document.getElementById("customer-name");
  const customerAddress = document.getElementById("customer-address");
  const customerPhone = document.getElementById("customer-phone");
  const customerNote = document.getElementById("customer-note");
  const whatsappLink = document.querySelector(".whatsapp-float");
  const WHATSAPP_NUMBER = "51947872207";

  const parsePrice = (value) => {
    if (typeof value === "number") return value;
    const normalized = String(value).replace(/[^0-9.]/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const formatMoney = (value) => `S/ ${value.toFixed(2)}`;

  const loadCart = () => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  };

  const saveCart = (items) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch (error) {
      console.warn("No se pudo guardar el carrito", error);
    }
  };

  const getCount = (items) =>
    items.reduce((total, item) => total + item.qty, 0);

  const updateCount = (items) => {
    const count = getCount(items);
    countEls.forEach((el) => {
      el.textContent = count;
    });
  };

  const renderCart = (items) => {
    if (!itemsContainer || !totalEl) {
      return;
    }

    itemsContainer.innerHTML = "";
    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "cart-empty";
      empty.textContent = "Tu carrito esta vacio.";
      itemsContainer.appendChild(empty);
      totalEl.textContent = "S/ 0.00";
      if (checkoutButton) checkoutButton.disabled = true;
      return;
    }

    let total = 0;
    items.forEach((item) => {
      const itemTotal = item.price * item.qty;
      total += itemTotal;

      const row = document.createElement("div");
      row.className = "cart-item";
      const variantLine = item.variant ? `<div class="cart-item-variant">${item.variant}</div>` : "";
      row.innerHTML = `
        <div>
          <div class="cart-item-title">${item.title}</div>
          ${variantLine}
          <div class="cart-item-meta">x${item.qty} - ${formatMoney(
        itemTotal
      )}</div>
        </div>
        <div class="cart-item-actions">
          <button data-qty-id="${item.id}" data-qty-variant="${item.variant || ""}" data-action="decrease" type="button">-</button>
          <span class="cart-qty">${item.qty}</span>
          <button data-qty-id="${item.id}" data-qty-variant="${item.variant || ""}" data-action="increase" type="button">+</button>
        </div>
      `;
      itemsContainer.appendChild(row);
    });

    totalEl.textContent = formatMoney(total);
    if (checkoutButton) checkoutButton.disabled = false;
  };

  const updateCartUI = (items) => {
    updateCount(items);
    renderCart(items);
    renderSummary(items);
  };

  const addToCart = (item) => {
    const items = loadCart();
    const existing = items.find(
      (cartItem) =>
        cartItem.id === item.id && cartItem.variant === item.variant
    );
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    saveCart(items);
    updateCartUI(items);
  };

  const updateQuantity = (id, variant, delta) => {
    const items = loadCart();
    const target = items.find(
      (item) => item.id === id && item.variant === variant
    );
    if (!target) return;
    target.qty += delta;
    const filtered = items.filter((item) => item.qty > 0);
    saveCart(filtered);
    updateCartUI(filtered);
  };

  const removeFromCart = (id, variant) => {
    const items = loadCart().filter(
      (item) => !(item.id === id && item.variant === variant)
    );
    saveCart(items);
    updateCartUI(items);
  };

  const openCart = () => {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
  };

  const closeCart = () => {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
  };

  toggleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      panel.classList.contains("open") ? closeCart() : openCart();
    });
  });

  if (closeButton) {
    closeButton.addEventListener("click", closeCart);
  }

  panel.addEventListener("click", (event) => {
    if (event.target === panel) {
      closeCart();
    }
  });

  if (itemsContainer) {
    itemsContainer.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (target.dataset.qtyId && target.dataset.action) {
        const delta = target.dataset.action === "increase" ? 1 : -1;
        updateQuantity(
          target.dataset.qtyId,
          target.dataset.qtyVariant || "",
          delta
        );
      }
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("[data-add-to-cart]");
    if (!button) return;
    event.stopPropagation();
    const card = button.closest("[data-id]");
    const id = button.dataset.id || (card ? card.dataset.id : "");
    const title =
      button.dataset.title || (card ? card.dataset.title : "Producto");
    const price = parsePrice(
      button.dataset.price || (card ? card.dataset.price : "0")
    );
    const variant = button.dataset.variant || "";

    if (!id) return;
    addToCart({ id, title, price, variant });
    openCart();
  });

  if (checkoutButton && checkoutForm) {
    checkoutButton.addEventListener("click", () => {
      checkoutForm.hidden = !checkoutForm.hidden;
      if (paymentSection) {
        paymentSection.hidden = checkoutForm.hidden;
      }
      renderSummary(loadCart());
    });
  }

  const buildWhatsappMessage = (items, total) => {
    const lines = [];
    lines.push("Hola, quiero realizar este pedido:");
    items.forEach((item) => {
      const variantText = item.variant ? ` (${item.variant})` : "";
      lines.push(
        `- ${item.title}${variantText} x${item.qty} (${formatMoney(
          item.price
        )})`
      );
    });
    lines.push(`Total: ${formatMoney(total)}`);
    if (customerName?.value) lines.push(`Nombre: ${customerName.value}`);
    if (customerPhone?.value) lines.push(`Telefono: ${customerPhone.value}`);
    if (customerAddress?.value)
      lines.push(`Direccion: ${customerAddress.value}`);
    if (customerNote?.value) lines.push(`Nota: ${customerNote.value}`);
    return lines.join("\n");
  };

  if (sendWhatsappButton) {
    sendWhatsappButton.addEventListener("click", () => {
      const items = loadCart();
      if (items.length === 0) return;
      if (
        !customerName?.value ||
        !customerAddress?.value ||
        !customerPhone?.value
      ) {
        alert("Completa nombre, direccion y telefono.");
        return;
      }
      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const message = encodeURIComponent(buildWhatsappMessage(items, total));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
      window.open(url, "_blank", "noopener");
    });
  }

  function renderSummary(items) {
    if (!orderSummary) return;
    orderSummary.innerHTML = "";
    if (!items || items.length === 0) {
      const empty = document.createElement("p");
      empty.textContent = "No hay productos en el pedido.";
      orderSummary.appendChild(empty);
      if (downloadPdfButton) downloadPdfButton.disabled = true;
      return;
    }

    items.forEach((item) => {
      const row = document.createElement("div");
      row.className = "order-item";
      const variantText = item.variant ? ` (${item.variant})` : "";
      row.innerHTML = `
        <strong>${item.title}${variantText}</strong>
        <span>${item.qty} x ${formatMoney(item.price)}</span>
      `;
      orderSummary.appendChild(row);
    });

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalLine = document.createElement("p");
    totalLine.textContent = `Total: ${formatMoney(total)}`;
    orderSummary.appendChild(totalLine);

    const customerLines = [];
    if (customerName?.value) customerLines.push(`Nombre: ${customerName.value}`);
    if (customerPhone?.value) customerLines.push(`Telefono: ${customerPhone.value}`);
    if (customerAddress?.value)
      customerLines.push(`Direccion: ${customerAddress.value}`);
    if (customerNote?.value) customerLines.push(`Nota: ${customerNote.value}`);
    customerLines.forEach((line) => {
      const info = document.createElement("p");
      info.textContent = line;
      orderSummary.appendChild(info);
    });

    if (downloadPdfButton) downloadPdfButton.disabled = false;
  }

  const buildPrintableHtml = (items) => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const rows = items
      .map((item) => {
        const variantText = item.variant ? ` (${item.variant})` : "";
        return `<tr>
          <td>${item.title}${variantText}</td>
          <td>${item.qty}</td>
          <td>${formatMoney(item.price)}</td>
          <td>${formatMoney(item.price * item.qty)}</td>
        </tr>`;
      })
      .join("");
    const customerInfo = [
      customerName?.value ? `Nombre: ${customerName.value}` : "",
      customerPhone?.value ? `Telefono: ${customerPhone.value}` : "",
      customerAddress?.value ? `Direccion: ${customerAddress.value}` : "",
      customerNote?.value ? `Nota: ${customerNote.value}` : "",
    ]
      .filter(Boolean)
      .map((line) => `<p>${line}</p>`)
      .join("");

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Pedido - Libreria Belen</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; color: #2f2621; }
            h1 { font-size: 20px; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border-bottom: 1px solid #e0d1be; padding: 8px; text-align: left; }
            th { background: #f5efe6; }
            .total { font-weight: 700; margin-top: 12px; }
            .qr-row { display: flex; gap: 16px; margin-top: 16px; }
            .qr-box { border: 2px dashed #d1b79f; padding: 24px; width: 45%; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Pedido - Libreria Belen</h1>
          ${customerInfo}
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p class="total">Total: ${formatMoney(total)}</p>
          <div class="qr-row">
            <div class="qr-box">QR Yape</div>
            <div class="qr-box">QR Plin</div>
          </div>
        </body>
      </html>
    `;
  };

  if (downloadPdfButton) {
    downloadPdfButton.addEventListener("click", () => {
      const items = loadCart();
      if (items.length === 0) return;
      const printWindow = window.open("", "_blank");
      if (!printWindow) return;
      printWindow.document.write(buildPrintableHtml(items));
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    });
  }

  [customerName, customerAddress, customerPhone, customerNote].forEach(
    (field) => {
      if (!field) return;
      field.addEventListener("input", () => renderSummary(loadCart()));
    }
  );

  if (whatsappLink) {
    whatsappLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=Hola%2C%20quiero%20informacion%20sobre%20un%20producto.`;
  }

  updateCartUI(loadCart());
})();
