(function () {
  "use strict";

  const EMAIL = "pashamalik9371@gmail.com";

  document.getElementById("year").textContent = new Date().getFullYear();

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open);
    navToggle.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.querySelectorAll(".brutal-btn").forEach((btn) => {
    btn.addEventListener("mousedown", () => btn.classList.add("is-pressed"));
    const release = () => btn.classList.remove("is-pressed");
    btn.addEventListener("mouseup", release);
    btn.addEventListener("mouseleave", release);
  });

  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");

  const setActiveNav = () => {
    const scrollY = window.scrollY + 120;
    let current = "";

    sections.forEach((section) => {
      if (section.offsetTop <= scrollY) {
        current = section.getAttribute("id");
      }
    });

    navAnchors.forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`);
    });
  };

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  const revealEls = document.querySelectorAll(
    ".exp-card, .about-card, .stat, .edu-card, .skill-group, .project-card, .cert-card, .contact-card, .lang-card"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    revealObserver.observe(el);
  });

  const langBars = document.querySelectorAll(".lang-bar span");
  const barObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const width = entry.target.style.width;
          entry.target.style.width = "0";
          requestAnimationFrame(() => {
            entry.target.style.width = width;
          });
          barObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  langBars.forEach((bar) => barObserver.observe(bar));

  const copyBtn = document.getElementById("copyEmail");
  let toastEl = null;

  const showToast = (message) => {
    if (!toastEl) {
      toastEl = document.createElement("div");
      toastEl.className = "toast";
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = message;
    toastEl.classList.add("is-show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toastEl.classList.remove("is-show"), 2200);
  };

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      showToast("Email disalin!");
    } catch {
      showToast("Gagal menyalin — salin manual ya");
    }
  });

  const lightbox = document.getElementById("certLightbox");
  if (lightbox) {
    const lightboxImg = document.getElementById("certLightboxImg");
    const lightboxTitle = document.getElementById("certLightboxTitle");
    const lightboxClose = document.getElementById("certLightboxClose");
    const lightboxTabs = document.getElementById("certLightboxTabs");
    const tabButtons = lightboxTabs.querySelectorAll(".cert-lb-tab");

    let currentFront = "";
    let currentBack = "";

    const setLightboxSide = (side) => {
      const src = side === "back" && currentBack ? currentBack : currentFront;
      lightboxImg.src = src;
      tabButtons.forEach((tab) => {
        tab.classList.toggle("is-active", tab.dataset.side === side);
      });
    };

    const openLightbox = (front, title, back) => {
      currentFront = front;
      currentBack = back || "";
      lightboxImg.src = front;
      lightboxImg.alt = title;
      lightboxTitle.textContent = title;

      if (currentBack) {
        lightboxTabs.hidden = false;
        setLightboxSide("front");
      } else {
        lightboxTabs.hidden = true;
      }

      lightbox.hidden = false;
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.hidden = true;
      lightbox.setAttribute("aria-hidden", "true");
      lightboxImg.src = "";
      currentFront = "";
      currentBack = "";
      lightboxTabs.hidden = true;
      document.body.style.overflow = "";
    };

    document.querySelectorAll(".cert-detail-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openLightbox(btn.dataset.cert, btn.dataset.title, btn.dataset.certBack || "");
      });
    });

    tabButtons.forEach((tab) => {
      tab.addEventListener("click", () => setLightboxSide(tab.dataset.side));
    });

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-close]").addEventListener("click", closeLightbox);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
    });

    document.querySelectorAll(".project-preview-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        openLightbox(btn.dataset.img, btn.dataset.title, "");
      });
    });
  }
})();
