(() => {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;
  const elements = Array.from(document.querySelectorAll(".reveal-item"));
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("motion-active");
    const obs = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); obs.unobserve(entry.target); }
      }
    }, { rootMargin: "0px 0px 24px 0px", threshold: .06 });
    elements.forEach(el => obs.observe(el));
  }
  // Tiny, bounded parallax on 3 full-width photos; stop when not visible.
  if (window.matchMedia("(min-width: 911px)").matches) {
    const scenes = Array.from(document.querySelectorAll("[data-parallax]"));
    const visible = new Set();
    const obs = new IntersectionObserver(entries => entries.forEach(entry => {
      entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target);
      if (!entry.isIntersecting) entry.target.style.transform = "";
    }), {rootMargin:"80px 0px"});
    scenes.forEach(el => obs.observe(el));
    let scheduled = false;
    function tick() {
      scheduled = false;
      if (reduce.matches || document.hidden) return;
      const h = window.innerHeight || 800;
      for (const el of visible) {
        const r = el.parentElement.getBoundingClientRect();
        const amount = Math.max(-12, Math.min(12, (h/2 - (r.top + r.height/2)) * Number(el.dataset.parallax) * .1));
        el.style.transform = "translate3d(0," + amount.toFixed(1) + "px,0) scale(1.025)";
      }
    }
    window.addEventListener("scroll",()=>{if(!scheduled){scheduled=true;requestAnimationFrame(tick)}},{passive:true});
    window.addEventListener("resize",tick,{passive:true});
    tick();
  }
  reduce.addEventListener("change",() => {
    if (reduce.matches) {
      document.documentElement.classList.remove("motion-active");
      document.querySelectorAll(".reveal-item").forEach(el=>el.classList.add("is-visible"));
      document.querySelectorAll("[data-parallax]").forEach(el=>el.style.transform="");
    }
  });
})();
