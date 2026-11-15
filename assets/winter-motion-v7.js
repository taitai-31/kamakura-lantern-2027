/* Non-obstructive movement. No text fades, looped marquees or scroll-based hiding. */
(() => {
  'use strict';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const cards = Array.from(document.querySelectorAll('[data-soft-reveal]'));
  if (cards.length && 'IntersectionObserver' in window && !reduce.matches) {
    // Only movement, no opacity change: all copy stays readable.
    document.documentElement.classList.add('ui-motion');
    const observer = new IntersectionObserver(items => {
      for (const item of items) {
        if (item.isIntersecting) {
          item.target.classList.add('ui-inview');
          observer.unobserve(item.target);
        }
      }
    }, {threshold: 0.07, rootMargin: '0px 0px 20px 0px'});
    cards.forEach(card => observer.observe(card));
    reduce.addEventListener?.('change', event => {
      if (event.matches) {
        document.documentElement.classList.remove('ui-motion');
        cards.forEach(el => el.classList.add('ui-inview'));
        observer.disconnect();
      }
    });
  }
})();
