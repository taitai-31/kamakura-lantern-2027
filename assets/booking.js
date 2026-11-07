
(() => {
  "use strict";

  // 予約先が確定したら URL を設定してください。空欄では決済・予約確定を行いません。
  const RESERVATION_URL = "";
  const CONTACT_MAIL = "info@aizu-sanson.com";
  const MAX_GUESTS = 15;
  const PLANS = {
    inbound: { name: "インバウンドプラン", adult: 6000, child: 5000, solo: 11000 },
    domestic1: { name: "国内プラン①", adult: 5000, child: 4000, solo: 9000 },
    domestic2: { name: "国内プラン②", adult: 3000, child: 2000, solo: 5000 }
  };
  const number = new Intl.NumberFormat("ja-JP");
  const person = { adult: 2, child: 0, preschool: 0 };
  const form = document.getElementById("bookingForm");
  if (!form) return;

  const $ = (id) => document.getElementById(id);
  const planRadios = [...form.querySelectorAll('input[name="plan"]')];
  const timeRadios = [...form.querySelectorAll('input[name="slot"]')];
  const dateInput = $("booking-date");
  const copyButton = $("copy-summary");
  const inquiryButton = $("inquiry-button");
  const feedback = $("form-feedback");
  const maxHint = $("headcount-hint");
  const navToggle = $("nav-toggle");
  const mobileNav = $("mobile-nav");

  const selected = (nodes) => nodes.find((input) => input.checked);
  const guestCount = () => person.adult + person.child + person.preschool;
  const todayDetails = () => {
    const raw = dateInput.value;
    if (!raw) return "日付を選択してください";
    const d = new Date(raw + "T12:00:00+09:00");
    if (Number.isNaN(d.getTime())) return "日付を選択してください";
    return new Intl.DateTimeFormat("ja-JP", { timeZone:"Asia/Tokyo", month:"long", day:"numeric", weekday:"short" }).format(d);
  };

  function calculate() {
    const key = selected(planRadios)?.value || "domestic1";
    const plan = PLANS[key];
    const solo = person.adult === 1 && person.child === 0;
    const adultTotal = solo ? plan.solo : plan.adult * person.adult;
    const childTotal = plan.child * person.child;
    const total = adultTotal + childTotal;
    const notes = [];
    if (solo) {
      notes.push("大人1名のためシングル料金 " + number.format(plan.solo) + "円を適用");
      if (person.preschool > 0) {
        notes.push("未就学児同伴でのシングル料金適用は要確認");
      }
    } else {
      notes.push("大人 " + person.adult + "名 × " + number.format(plan.adult) + "円 = " + number.format(adultTotal) + "円");
    }
    if (person.child > 0) notes.push("小学生 " + person.child + "名 × " + number.format(plan.child) + "円 = " + number.format(childTotal) + "円");
    if (person.preschool > 0) notes.push("未就学児 " + person.preschool + "名 × 0円（お椀・箸のみ）");
    return { plan, total, notes, solo };
  }

  function isValidDate() {
    return dateInput.value &&
      dateInput.value >= dateInput.min &&
      dateInput.value <= dateInput.max;
  }

  function createSummary() {
    const {plan, total, notes} = calculate();
    const selectedTime = selected(timeRadios)?.value || "10:45～12:00";
    return [
      "【南会津町 かまくら・ランタン祭り 2027／プラン選択内容】",
      "希望日：" + (isValidDate() ? todayDetails() : "未選択"),
      "希望時間：" + selectedTime,
      "プラン：" + plan.name,
      "人数：大人" + person.adult + "名／小学生" + person.child + "名／未就学児" + person.preschool + "名（計" + guestCount() + "名）",
      "概算合計：" + number.format(total) + "円（税込）",
      "内訳：" + notes.join("、"),
      "",
      "※これは料金の試算・お問い合わせ用情報です。空席確認、予約確定、決済は行われていません。",
      "※未就学児はお椀と箸のみ。料理内容、実施条件、キャンセル規定は主催者にご確認ください。"
    ].join("\n");
  }

  function updateButtons() {
    const total = guestCount();
    form.querySelectorAll("[data-step]").forEach((button) => {
      const type = button.dataset.person;
      const delta = Number(button.dataset.step);
      button.disabled = delta > 0 ? total >= MAX_GUESTS : person[type] <= (type === "adult" ? 1 : 0);
    });
    maxHint.textContent = "合計 " + total + " / " + MAX_GUESTS + "名（未就学児を含む）";
    maxHint.setAttribute("aria-live", "polite");
  }

  function render() {
    const {plan,total,notes,solo} = calculate();
    const time = selected(timeRadios)?.value || "10:45～12:00";
    const totalText = number.format(total);
    Object.keys(person).forEach((type) => {
      const display = $("count-" + type);
      if (display) display.textContent = String(person[type]);
    });
    $("summary-plan").textContent = plan.name;
    $("summary-date").textContent = todayDetails();
    $("summary-time").textContent = time;
    $("summary-count").textContent = "大人" + person.adult + "名・小学生" + person.child + "名・未就学児" + person.preschool + "名";
    $("summary-total").textContent = totalText;
    $("summary-breakdown").textContent = notes.join("／");
    $("mobile-price").textContent = totalText + "円";
    $("summary-rate-note").textContent = solo ?
      "大人1名のシングル料金を適用しています。" :
      "大人・小学生の人数に応じて計算しています。";
    planRadios.forEach((radio) => {
      radio.closest(".form-plan")?.classList.toggle("is-selected",radio.checked);
    });
    updateButtons();
  }

  form.querySelectorAll("[data-step]").forEach((button) => button.addEventListener("click", () => {
    const type = button.dataset.person;
    const delta = Number(button.dataset.step);
    const next = person[type] + delta;
    if (next < (type === "adult" ? 1 : 0)) return;
    if (delta > 0 && guestCount() >= MAX_GUESTS) {
      feedback.textContent = "1予約あたりの上限は15名です。";
      return;
    }
    person[type] = next;
    feedback.textContent = "";
    render();
  }));
  planRadios.forEach((node) => node.addEventListener("change", render));
  timeRadios.forEach((node) => node.addEventListener("change",render));
  dateInput.addEventListener("change", () => { feedback.textContent = ""; render(); });

  document.querySelectorAll("[data-choose-plan]").forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.dataset.choosePlan;
      const radio = planRadios.find((item) => item.value === value);
      if (!radio) return;
      radio.checked = true;
      feedback.textContent = "";
      render();
      document.getElementById("booking").scrollIntoView({behavior:"smooth",block:"start"});
    });
  });

  copyButton.addEventListener("click", async () => {
    const value = createSummary();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const temp = document.createElement("textarea");
        temp.value = value;
        temp.setAttribute("readonly","");
        temp.style.position = "fixed";
        temp.style.left = "-9999px";
        document.body.appendChild(temp);
        temp.select();
        const success = document.execCommand("copy");
        temp.remove();
        if (!success) throw new Error("copy not available");
      }
      feedback.textContent = "選択内容をコピーしました。";
    } catch (e) {
      feedback.textContent = "コピーできませんでした。お問い合わせボタンから内容を送れます。";
    }
  });

  inquiryButton.addEventListener("click", (event) => {
    if (!isValidDate()) {
      event.preventDefault();
      feedback.textContent = "先に希望日を選択してください（2027年1月23日〜2月23日）。";
      dateInput.focus();
      return;
    }
    const mailSubject = "かまくら・ランタン祭り2027 プラン問い合わせ";
    if (!RESERVATION_URL) {
      const mailBody = createSummary() + "\n\nお問い合わせ内容：\n";
      inquiryButton.href = "mailto:" + CONTACT_MAIL + "?subject=" +
        encodeURIComponent(mailSubject) + "&body=" + encodeURIComponent(mailBody);
    } else {
      inquiryButton.href = RESERVATION_URL;
      inquiryButton.target = "_blank";
      inquiryButton.rel = "noopener noreferrer";
    }
  });

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded",String(!expanded));
      mobileNav.setAttribute("aria-hidden",String(expanded));
    });
    mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded","false");
      mobileNav.setAttribute("aria-hidden","true");
    }));
  }

  if (RESERVATION_URL) {
    inquiryButton.textContent = "予約サイトへ進む ↗";
    $("booking-disclaimer").textContent = "空席確認・決済は外部予約サイトで行います。表示金額は事前の試算です。";
  }
  render();
})();
