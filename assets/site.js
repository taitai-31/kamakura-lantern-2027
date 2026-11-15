(() => {
  "use strict";
  const root = document.documentElement;
  // When the dedicated snow-hut checkout site is ready, set its real HTTPS URL here.
  const KAMAKURA_BOOKING_URL = "";
  const kamakuraButton = document.getElementById("kamakura-booking-button");
  if (KAMAKURA_BOOKING_URL && kamakuraButton) {
    try {
      const url = new URL(KAMAKURA_BOOKING_URL);
      if (url.protocol === "https:") {
        const link = document.createElement("a");
        link.id = kamakuraButton.id;
        link.className = "reserve-option-link";
        link.href = url.href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.innerHTML = kamakuraButton.innerHTML;
        kamakuraButton.replaceWith(link);
        const note = link.nextElementSibling;
        if (note && note.tagName === "SMALL") note.hidden = true;
      }
    } catch (_) { /* keep button disabled until valid URL is set */ }
  }

  const controls = Array.from(document.querySelectorAll("[data-lang]"));
  const menuButton = document.getElementById("menu-trigger");
  const menu = document.getElementById("mobile-nav");
  const titles = {
    ja: "会津山村リゾート かまくら・竹ランタン祭り2027",
    en: "Aizu Sanson Resort · Kamakura & Bamboo Lantern Festival 2027"
  };
  const descriptions = {
    ja: "南会津の雪のかまくらで、温かい鍋を。75分のかまくら体験とコテージA棟の宿泊をそれぞれご案内。",
    en: "Enjoy a 75-minute snow hut hot pot experience in Minamiaizu, or book a stay in Cottage A at Aizu Sanson Resort."
  };
  const switchLanguage = (lang, save = true) => {
    if (lang !== "ja" && lang !== "en") return;
    root.lang = lang;
    document.title = titles[lang];
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", descriptions[lang]);
    controls.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.lang === lang)));
    if (menuButton) menuButton.setAttribute("aria-label", lang === "en" ? "Toggle menu" : "メニューを開閉");
    if (save) {
      try { localStorage.setItem("kamakura-language", lang); } catch (_) { /* storage may be disabled */ }
    }
  };
  let initial = "ja";
  try {
    const fromUrl = new URLSearchParams(location.search).get("lang");
    if (fromUrl === "ja" || fromUrl === "en") initial = fromUrl;
    else {
      const stored = localStorage.getItem("kamakura-language");
      if (stored === "ja" || stored === "en") initial = stored;
    }
  } catch (_) { /* keep Japanese default */ }
  switchLanguage(initial, false);
  controls.forEach(button => button.addEventListener("click", () => switchLanguage(button.dataset.lang)));
  if (menuButton && menu) {
    menuButton.addEventListener("click", () => {
      const open = menuButton.getAttribute("aria-expanded") !== "true";
      menuButton.setAttribute("aria-expanded", String(open));
      menu.hidden = !open;
    });
    menu.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menu.hidden = true;
    }));
    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && !menu.hidden) {
        menu.hidden = true;
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.focus();
      }
    });
  }
})();
