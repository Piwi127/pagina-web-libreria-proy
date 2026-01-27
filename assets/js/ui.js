(() => {
  document.documentElement.classList.add("js");
  // Disable right-click and image drag across the site (deterrent only).
  document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });
  document.addEventListener("dragstart", (event) => {
    const target = event.target;
    if (target && target.tagName === "IMG") {
      event.preventDefault();
    }
  });
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroPlay = document.querySelector(".hero-play");
  const modal = document.getElementById("promo-modal");
  const imageModal = document.getElementById("image-modal");
  const toast = document.getElementById("promo-toast");
  const modalClose = modal ? modal.querySelector(".promo-close") : null;
  const modalDismiss = modal
    ? modal.querySelector("[data-promo-dismiss]")
    : null;
  const toastClose = toast ? toast.querySelector("[data-toast-close]") : null;
  const imageModalClose = imageModal
    ? imageModal.querySelector(".image-modal-close")
    : null;
  const imageModalImg = imageModal ? imageModal.querySelector("img") : null;
  const featuredImageTrigger = document.querySelector(
    ".featured-spotlight-trigger"
  );

  let swiper = null;

  const setupMenuToggle = () => {
    const toggles = document.querySelectorAll(".menu-toggle");
    if (toggles.length === 0) return;

    toggles.forEach((toggle) => {
      const topbar = toggle.closest(".topbar");
      const menu = topbar
        ? topbar.querySelector(".menu")
        : document.querySelector(".menu");
      if (!menu) return;

      const closeMenu = () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        if (topbar) {
          topbar.classList.remove("menu-open");
        }
      };

      toggle.addEventListener("click", () => {
        const isOpen = menu.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
        if (topbar) {
          topbar.classList.toggle("menu-open", isOpen);
        }
      });

      menu.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
          closeMenu();
        }
      });

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        if (menu.contains(target) || toggle.contains(target)) return;
        closeMenu();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
        }
      });

      window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
          closeMenu();
        }
      });
    });
  };

  const initSwiper = () => {
    if (typeof Swiper === "undefined") return;
    swiper = new Swiper(".hero-swiper", {
      loop: true,
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 600,
      autoplay: prefersReduced.matches
        ? false
        : {
          delay: 5200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      a11y: {
        enabled: true,
      },
    });
  };

  const setPlayState = (isPlaying) => {
    if (!heroPlay) return;
    heroPlay.textContent = isPlaying ? "Pausar" : "Reproducir";
    heroPlay.setAttribute("aria-pressed", String(isPlaying));
  };

  const toggleAutoplay = () => {
    if (!swiper || !swiper.autoplay) return;
    if (swiper.autoplay.running) {
      swiper.autoplay.stop();
      setPlayState(false);
    } else {
      swiper.autoplay.start();
      setPlayState(true);
    }
  };

  const showToast = () => {
    if (!toast) return;
    toast.classList.add("show");
    const timeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 8000);
    if (toastClose) {
      toastClose.addEventListener(
        "click",
        () => {
          toast.classList.remove("show");
          clearTimeout(timeout);
        },
        { once: true }
      );
    }
  };

  const focusableSelector =
    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

  const trapFocus = (event) => {
    if (!modal || !modal.classList.contains("show")) return;
    if (event.key !== "Tab") return;
    const focusable = Array.from(modal.querySelectorAll(focusableSelector));
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const openModal = () => {
    if (!modal) return;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    const focusable = modal.querySelector(focusableSelector);
    if (focusable) focusable.focus();
    document.addEventListener("keydown", trapFocus);
  };

  const closeModal = () => {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", trapFocus);
  };

  const openImageModal = (img) => {
    if (!imageModal || !imageModalImg || !img) return;
    imageModalImg.src = img.src;
    imageModalImg.alt = img.alt || "Anuncio destacado";
    imageModal.classList.add("show");
    imageModal.setAttribute("aria-hidden", "false");
  };

  const closeImageModal = () => {
    if (!imageModal || !imageModalImg) return;
    imageModal.classList.remove("show");
    imageModal.setAttribute("aria-hidden", "true");
    imageModalImg.src = "";
    imageModalImg.alt = "";
  };

  const scheduleModal = () => {
    if (!modal || prefersReduced.matches) return;
    setTimeout(() => {
      openModal();
    }, 600);
  };

  const setupReveal = () => {
    const targets = document.querySelectorAll(".reveal");
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Sort entries by their DOM position to ensure consistent stagger order
        const visibleEntries = entries.filter(e => e.isIntersecting)
          .sort((a, b) => {
            return (a.target.compareDocumentPosition(b.target) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1;
          });

        visibleEntries.forEach((entry, index) => {
          setTimeout(() => {
            entry.target.classList.add("is-visible");
          }, index * 120); // 120ms stagger delay
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" }
    );
    targets.forEach((target) => observer.observe(target));
  };

  const setupParallax = () => {
    const layers = document.querySelectorAll("[data-parallax]");
    if (layers.length === 0 || prefersReduced.matches) return;
    let ticking = false;

    const update = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      layers.forEach((layer) => {
        const speed = Number(layer.dataset.parallax || "0.08");
        const offset = Math.min(scrollY * speed, 60);
        layer.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
  };

  initSwiper();
  setupReveal();
  setupParallax();
  setupMenuToggle();
  scheduleModal();

  let playBound = false;

  if (heroPlay && swiper && swiper.autoplay) {
    if (prefersReduced.matches) {
      heroPlay.disabled = true;
      heroPlay.textContent = "Autoplay desactivado";
    } else {
      setPlayState(swiper.autoplay.running);
      if (!playBound) {
        heroPlay.addEventListener("click", toggleAutoplay);
        playBound = true;
      }
    }
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (modalDismiss) modalDismiss.addEventListener("click", closeModal);
  if (imageModal) {
    imageModal.addEventListener("click", (event) => {
      if (event.target === imageModal) closeImageModal();
    });
  }
  if (imageModalClose) imageModalClose.addEventListener("click", closeImageModal);
  if (featuredImageTrigger) {
    featuredImageTrigger.addEventListener("click", () => {
      const img = featuredImageTrigger.querySelector("img");
      openImageModal(img);
    });
  }
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
      closeImageModal();
    }
  });

  prefersReduced.addEventListener("change", () => {
    if (!swiper || !swiper.autoplay) return;
    if (prefersReduced.matches) {
      swiper.autoplay.stop();
      setPlayState(false);
      if (heroPlay) {
        heroPlay.disabled = true;
        heroPlay.textContent = "Autoplay desactivado";
      }
    } else {
      swiper.autoplay.start();
      setPlayState(true);
      if (heroPlay) {
        heroPlay.disabled = false;
        if (!playBound) {
          heroPlay.addEventListener("click", toggleAutoplay);
          playBound = true;
        }
      }
    }
  });

  const ENDPOINT =
    "https://script.google.com/macros/s/AKfycbzRA2BQ2OgHVKehslT4KqlMdSaczfg73nQTQL7lCLH106yxw_QHBx70TL5Tmsr5yEHa0g/exec";

  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm && contactStatus) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      contactStatus.textContent = "Enviando...";

      if (contactForm.empresa.value) {
        contactStatus.textContent = "¡Listo!";
        contactForm.reset();
        return;
      }

      const payload = {
        nombre: contactForm.nombre.value.trim(),
        correo: contactForm.correo.value.trim(),
        mensaje: contactForm.mensaje.value.trim(),
        pagina: location.href,
      };

      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (data.ok) {
          contactStatus.textContent = "¡Mensaje enviado! Gracias 🙂";
          contactForm.reset();
        } else {
          contactStatus.textContent = "Ocurrió un error. Intenta otra vez.";
        }
      } catch (error) {
        contactStatus.textContent =
          "No se pudo enviar. Revisa tu conexión e intenta de nuevo.";
      }
    });
  }

})();
