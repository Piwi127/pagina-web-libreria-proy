(() => {
  document.documentElement.classList.add("js");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const heroPlay = document.querySelector(".hero-play");
  const modal = document.getElementById("promo-modal");
  const toast = document.getElementById("promo-toast");
  const modalClose = modal ? modal.querySelector(".promo-close") : null;
  const modalDismiss = modal
    ? modal.querySelector("[data-promo-dismiss]")
    : null;
  const toastClose = toast ? toast.querySelector("[data-toast-close]") : null;

  let swiper = null;

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

  const modalKey = "promo-modal-last";
  const toastKey = "promo-toast-seen";
  const sessionExitKey = "promo-exit-seen";

  const canShowModal = () => {
    const last = Number(localStorage.getItem(modalKey) || "0");
    const now = Date.now();
    return now - last > 48 * 60 * 60 * 1000;
  };

  const scheduleModal = () => {
    if (!modal || prefersReduced.matches || !canShowModal()) return;
    let shown = false;
    const timer = setTimeout(() => {
      if (shown) return;
      shown = true;
      try {
        localStorage.setItem(modalKey, String(Date.now()));
      } catch (error) {
        console.warn("No se pudo guardar estado del modal", error);
      }
      openModal();
    }, 9000);

    const onScroll = () => {
      if (shown) return;
      const scrollPct =
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
        100;
      if (scrollPct > 40) {
        shown = true;
        try {
          localStorage.setItem(modalKey, String(Date.now()));
        } catch (error) {
          console.warn("No se pudo guardar estado del modal", error);
        }
        openModal();
        window.removeEventListener("scroll", onScroll);
        clearTimeout(timer);
      }
    };
    window.addEventListener("scroll", onScroll);
  };

  const scheduleToast = () => {
    if (!toast || sessionStorage.getItem(toastKey)) return;
    setTimeout(() => {
      showToast();
      sessionStorage.setItem(toastKey, "1");
    }, 6000);
  };

  const setupExitIntent = () => {
    if (window.matchMedia("(pointer: fine)").matches === false) return;
    if (!modal || sessionStorage.getItem(sessionExitKey)) return;
    const onMouseLeave = (event) => {
      if (event.clientY <= 0) {
        sessionStorage.setItem(sessionExitKey, "1");
        openModal();
        document.removeEventListener("mouseleave", onMouseLeave);
      }
    };
    document.addEventListener("mouseleave", onMouseLeave);
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
  scheduleModal();
  scheduleToast();
  setupExitIntent();

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
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeModal();
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

  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(contactForm);
      const nombre = (formData.get("nombre") || "").toString().trim();
      const correo = (formData.get("correo") || "").toString().trim();
      const mensaje = (formData.get("mensaje") || "").toString().trim();
      const lines = [];
      if (nombre) lines.push(`Nombre: ${nombre}`);
      if (correo) lines.push(`Correo: ${correo}`);
      if (mensaje) lines.push(`Mensaje: ${mensaje}`);
      const body = encodeURIComponent(lines.join("\n"));
      window.location.href = `mailto:contacto@libreriabelen.pe?subject=Consulta%20desde%20la%20web&body=${body}`;
    });
  }
})();
