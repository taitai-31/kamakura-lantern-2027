/* Progressive enhancement: links and details also work without this file. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  const running = new Set();
  const detailsInMotion = new Set();
  const detailStates = new WeakMap();
  const enabled = () => !capture && !reduced.matches && !root.classList.contains('motion-paused') && !document.hidden;
  function animate(element, frames, options) {
    if (!enabled() || typeof element.animate !== 'function') return null;
    const animation = element.animate(frames, options);
    running.add(animation);
    animation.finished.then(() => running.delete(animation), () => running.delete(animation));
    return animation;
  }
  document.querySelectorAll('.overview-features, .options-grid, .booking-steps, .timeline').forEach(group => {
    Array.from(group.children).forEach((child,index) => child.style.setProperty('--motion-delay',(index % 3 * 90) + 'ms'));
  });
  document.querySelectorAll('.button,.side-reserve,.hero-link,.menu-button,.motion-toggle').forEach(button => {
    button.addEventListener('click', event => {
      if (!enabled() || typeof button.animate !== 'function') return;
      const rect = button.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height) * 2;
      const x = event.detail ? event.clientX - rect.left : rect.width / 2;
      const y = event.detail ? event.clientY - rect.top : rect.height / 2;
      const ripple = document.createElement('span');
      ripple.className = 'button-ripple';
      ripple.setAttribute('aria-hidden','true');
      Object.assign(ripple.style,{width:diameter+'px',height:diameter+'px',left:(x-diameter/2)+'px',top:(y-diameter/2)+'px'});
      button.prepend(ripple);
      const animation = animate(ripple,[{transform:'scale(0)',opacity:.55},{transform:'scale(1)',opacity:0}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
      if (animation) animation.finished.then(() => ripple.remove(), () => ripple.remove());
      else ripple.remove();
    });
  });
  document.querySelectorAll('.faq-list details').forEach(detail => {
    const summary = detail.querySelector('summary');
    let state = {desired:detail.open,animation:null};
    detailStates.set(detail,state);
    summary.addEventListener('click', event => {
      if (!enabled() || typeof detail.animate !== 'function') return;
      event.preventDefault();
      const start = detail.getBoundingClientRect().height;
      state.desired = state.animation ? !state.desired : !detail.open;
      if (state.animation) state.animation.cancel();
      detail.style.height = 'auto';
      detail.open = true;
      const end = state.desired ? detail.getBoundingClientRect().height : summary.getBoundingClientRect().height + 2;
      detail.style.overflow = 'hidden';
      detail.style.height = start + 'px';
      const animation = animate(detail,[{height:start+'px'},{height:end+'px'}],{duration:300,easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
      state.animation = animation;
      detailsInMotion.add(detail);
      const finish = () => {
        if (state.animation !== animation) return;
        detail.open = state.desired;
        detail.style.removeProperty('height');
        detail.style.removeProperty('overflow');
        state.animation = null;
        detailsInMotion.delete(detail);
        if (animation) animation.cancel();
      };
      if (animation) animation.finished.then(finish, () => {});
      else finish();
    });
  });
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target,[{opacity:.35,transform:'translateY(22px) scale(.975)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:850,easing:'cubic-bezier(.22,1,.36,1)'});
      imageObserver.unobserve(entry.target);
    }),{threshold:.12});
    document.querySelectorAll('.scene-visual,.plan-visual,.overview-photo,.access-landscape').forEach(element => imageObserver.observe(element));
    document.querySelectorAll('a[href="#plans"]').forEach(link => link.addEventListener('click', () => {
      if (!enabled()) return;
      const plan = document.getElementById('plans');
      const panel = plan.querySelector('.plan-panel');
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting)) return;
        observer.disconnect();
        animate(panel,[{boxShadow:'0 0 0 0 rgba(169,88,32,0)'},{boxShadow:'0 0 0 5px rgba(169,88,32,.18)',offset:.35},{boxShadow:'0 0 0 0 rgba(169,88,32,0)'}],{duration:1100,easing:'ease-out'});
      },{threshold:.12});
      observer.observe(panel);
      window.setTimeout(() => observer.disconnect(),3000);
    }));
  }
  function stopMotion() {
    if (enabled()) return;
    detailsInMotion.forEach(detail => {
      const state = detailStates.get(detail);
      if (state.animation) state.animation.cancel();
      state.animation = null;
      detail.open = state.desired;
      detail.style.removeProperty('height');
      detail.style.removeProperty('overflow');
    });
    detailsInMotion.clear();
    running.forEach(animation => animation.cancel());
    running.clear();
  }
  reduced.addEventListener('change',stopMotion);
  window.addEventListener('festival:motionchange',stopMotion);
  document.addEventListener('visibilitychange',stopMotion);
})();
