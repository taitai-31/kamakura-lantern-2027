(() => {
  "use strict";
  const root = document.documentElement;
  const controls = Array.from(document.querySelectorAll("[data-lang]"));
  const menuButton = document.getElementById("menu-trigger");
  const menu = document.getElementById("mobile-nav");
  const titles = {
    ja: "南会津町 かまくら・ランタン祭り2027 | KAMAKURA & LANTERN",
    en: "Minamiaizu Kamakura & Lantern Festival 2027 | Hot Pot Plans"
  };
  const descriptions = {
    ja: "南会津町かまくら・ランタン祭り2027。雪のかまくらで鍋を囲む冬の体験。3つの鍋プランと料金をご案内。予約・決済は専用サイトにて。",
    en: "Enjoy hot pot inside a snow hut in Minamiaizu, Fukushima. Explore three set plans and prices. Reservations and payment will be handled on a separate booking website."
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
