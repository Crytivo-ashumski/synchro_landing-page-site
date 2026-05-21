(() => {
  let activeScreenshot = 0;

  const modalTriggers = document.querySelectorAll("[data-open-modal]");
  const closeButtons = document.querySelectorAll("[data-close-modal]");
  const modals = document.querySelectorAll("[data-modal]");
  const signupForms = document.querySelectorAll("[data-signup-form]");
  const trailerIframe = document.querySelector("[data-trailer-iframe]");
  const trailerEmbed = trailerIframe?.closest(".video-embed");
  const trailerFallback = document.querySelector("[data-trailer-fallback]");
  const carouselImage = document.querySelector("[data-carousel-image]");
  const carouselEyebrow = document.querySelector("[data-carousel-eyebrow]");
  const carouselTitle = document.querySelector("[data-carousel-title]");
  const carouselThumbs = document.querySelectorAll("[data-carousel-thumb]");
  const scrollProgress = document.querySelector("[data-scroll-progress]");
  const scrollTopButton = document.querySelector("[data-scroll-top]");
  const kickstarterUrl = "https://www.kickstarter.com/projects/crytivogames/synchro";
  const signupRedirectDelayMs = 2500;
  const screenshots = [
    {
      title: "Propaganda On The Wall",
      eyebrow: "Screenshot 01",
      src: carouselThumbs[0]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro screenshot showing a green corporate billboard that says Get Fat You Are What You Eat above a city walkway",
    },
    {
      title: "Titan At The Edge",
      eyebrow: "Screenshot 02",
      src: carouselThumbs[1]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro exploration screenshot showing an armed mutant on a ruined platform with a massive machine in the red Solar-30 skyline",
    },
    {
      title: "The Monster Underneath",
      eyebrow: "Screenshot 03",
      src: carouselThumbs[2]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro scanner screenshot revealing a shadowy monster beside a human character during a dialogue choice",
    },
    {
      title: "Synchronized Fire",
      eyebrow: "Screenshot 04",
      src: carouselThumbs[3]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro combat screenshot showing a sniper attack hitting multiple mutants during a synchronous battle",
    },
    {
      title: "Snowbound Outskirts",
      eyebrow: "Screenshot 05",
      src: carouselThumbs[4]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro exploration screenshot showing a resistance fighter crossing snowy post-apocalyptic ruins outside Solar-30",
    },
    {
      title: "Plan Before They Move",
      eyebrow: "Screenshot 06",
      src: carouselThumbs[5]?.querySelector("img")?.src || carouselImage?.src,
      alt: "Synchro tactical combat screenshot showing attack paths, hit chance, enemy range, and turn planning",
    },
  ];

  function canUseYouTubeEmbed() {
    return window.location.protocol === "http:" || window.location.protocol === "https:";
  }

  function getYouTubeEmbedUrl(videoId) {
    if (!videoId || !canUseYouTubeEmbed()) {
      return "";
    }

    const params = new URLSearchParams({
      playsinline: "1",
      rel: "0",
    });

    if (window.location.origin && window.location.origin !== "null") {
      params.set("origin", window.location.origin);
    }

    return `https://www.youtube.com/embed/${videoId}?${params}`;
  }

  function loadTrailer() {
    const trailerUrl = getYouTubeEmbedUrl(trailerIframe?.dataset.youtubeId);
    const canLoadTrailer = Boolean(trailerUrl);

    if (trailerEmbed) {
      trailerEmbed.hidden = !canLoadTrailer;
    }

    if (trailerFallback) {
      trailerFallback.hidden = canLoadTrailer;
    }

    if (canLoadTrailer && trailerIframe) {
      trailerIframe.src = trailerUrl;
    }
  }

  function openModal(name) {
    const modal = document.querySelector(`[data-modal="${name}"]`);
    if (modal) {
      closeModals();
      if (name === "trailer") {
        loadTrailer();
      }
      modal.hidden = false;
    }
  }

  function closeModals() {
    modals.forEach((modal) => {
      modal.hidden = true;
    });
    if (trailerIframe) {
      trailerIframe.src = "";
    }
  }

  function renderCarousel(index) {
    activeScreenshot = (index + screenshots.length) % screenshots.length;
    const screenshot = screenshots[activeScreenshot];
    carouselImage.src = screenshot.src;
    carouselImage.alt = screenshot.alt;
    carouselEyebrow.textContent = screenshot.eyebrow;
    carouselTitle.textContent = screenshot.title;
    carouselThumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === activeScreenshot);
    });
  }

  function renderScrollUi() {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (scrollTopButton) {
      const isVisible = scrollTop > 560;
      scrollTopButton.classList.toggle("is-visible", isVisible);
      scrollTopButton.tabIndex = isVisible ? 0 : -1;
    }
  }

  function handleSignupSubmit(event) {
    if (!event.currentTarget.checkValidity()) {
      return;
    }

    window.setTimeout(() => {
      openModal("signup-thanks");
    }, 0);

    window.setTimeout(() => {
      window.location.assign(kickstarterUrl);
    }, signupRedirectDelayMs);
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openModal(trigger.dataset.openModal);
    });
  });

  closeButtons.forEach((button) => {
    button.addEventListener("click", closeModals);
  });

  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModals();
      }
    });
  });

  signupForms.forEach((form) => {
    form.addEventListener("submit", handleSignupSubmit);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModals();
    }
  });

  document.querySelector("[data-carousel-prev]")?.addEventListener("click", () => {
    renderCarousel(activeScreenshot - 1);
  });

  document.querySelector("[data-carousel-next]")?.addEventListener("click", () => {
    renderCarousel(activeScreenshot + 1);
  });

  carouselThumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      renderCarousel(Number(thumb.dataset.carouselThumb));
    });
  });

  scrollTopButton?.addEventListener("click", () => {
    scrollTopButton.blur();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", renderScrollUi, { passive: true });
  window.addEventListener("resize", renderScrollUi);
  renderScrollUi();
})();
