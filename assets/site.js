(() => {
  "use strict";

  // 専用予約サイトを公開したら、次の "" 内に実際のURLを入れてください。
  const RESERVATION_URL = "";

  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-nav");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      menu.setAttribute("aria-hidden", String(!open));
    });
    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.setAttribute("aria-hidden", "true");
      });
    });
  }

  if (!RESERVATION_URL) return;
  try {
    const url = new URL(RESERVATION_URL, window.location.href);
    if (!["https:", "http:"].includes(url.protocol)) return;
    const target = document.querySelector(".reservation-card");
    const pending = document.querySelector(".reservation-pending");
    if (!target || !pending) return;
    const button = document.createElement("a");
    button.className = "pill-button full";
    button.href = url.href;
    button.target = "_blank";
    button.rel = "noopener noreferrer";
    button.textContent = "予約・お支払いサイトへ進む ↗";
    pending.replaceWith(button);
    const announcement = target.querySelector("p:not(.summary-label):not(.reservation-note)");
    if (announcement) announcement.textContent = "ご予約・日時・人数の入力、空席確認、お支払いは外部の専用予約サイトで行ってください。";
  } catch (e) {
    // 予約URLの入力が不正な場合も案内ページの表示は維持します。
  }
})();