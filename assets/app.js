/* No runtime framework, build step or tracking SDK required. */
(() => {
  'use strict';
  const config = Object.assign({bookingStatus:'coming-soon', bookingUrl:'', siteUrl:'', indexable:false, announcement:'', analyticsEnabled:false}, window.FESTIVAL_CONFIG || {});
  const root = document.documentElement;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const capture = new URLSearchParams(location.search).get('capture') === '1';
  if (capture) root.classList.add('capture');
  const safeUrl = (value) => { try { const url = new URL(value); return /^https?:$/.test(url.protocol) ? url.href : ''; } catch { return ''; } };
  const bookingUrl = safeUrl(config.bookingUrl);
  // An absent URL never creates a fake booking or payment flow.
  let status = ['coming-soon','open','suspended','ended'].includes(config.bookingStatus) ? config.bookingStatus : 'coming-soon';
  if (status === 'open' && !bookingUrl) status = 'coming-soon';
  if (Date.now() > Date.parse('2027-02-23T23:59:59+09:00')) status = 'ended';
  const states = {
    'coming-soon': {banner:'2027年冬、開催予定。ご予約の受付開始は、こちらでお知らせします。',heading:'ご予約の受付開始をお待ちください。',copy:'受付開始日・開催日・営業時間が決まり次第、本ページでご案内します。',label:'予約のご案内'},
    open: {banner:'ご予約を受付中です。開催日・空き状況は予約ページをご確認ください。',heading:'ご希望の日付と体験を選んで、ご予約ください。',copy:'予約・お支払いは外部予約サイトでお手続きいただけます。',label:'空き状況を見て予約'},
    suspended: {banner:'現在、ご予約の受付を一時停止しています。再開のご案内をお待ちください。',heading:'ご予約の受付を一時停止しています。',copy:'再開日や開催状況は、本ページでお知らせします。',label:'開催・予約のご案内'},
    ended: {banner:'本イベントの開催期間は終了しました。ご関心をお寄せいただき、ありがとうございました。',heading:'本イベントの予約受付は終了しました。',copy:'ご来場・ご検討いただいた皆さま、ありがとうございました。',label:'イベントのご案内'}
  };
  const state = states[status];
  document.getElementById('event-status').textContent = config.announcement || state.banner;
  document.getElementById('reservation-status-heading').textContent = state.heading;
  document.getElementById('reservation-status-copy').textContent = state.copy;
  document.querySelectorAll('[data-booking-label]').forEach(n => { n.textContent = state.label; });
  document.querySelectorAll('.booking-link').forEach(link => {
    if (status === 'open') { link.href = bookingUrl; if (link.id === 'reservation-primary') document.getElementById('reservation-primary-label').textContent = '予約サイトへ進む'; }
    else if (link.id === 'reservation-primary') link.href = 'tel:' + String(config.contactPhone || '0241662108').replace(/[^\d+]/g,'');
    else link.href = '#reservation';
    link.addEventListener('click', () => {
      if (status !== 'open') return;
      const detail = {event:'booking_link_click', position:link.dataset.position || 'unknown', destination:bookingUrl};
      // Measurement is opt-in. No personal or payment data is collected here.
      if (config.analyticsEnabled) {
        if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
        if (typeof config.onBookingClick === 'function') { try { config.onBookingClick(detail); } catch {} }
        window.dispatchEvent(new CustomEvent('festival:booking-click',{detail}));
      }
    });
  });
  const siteUrl = safeUrl(config.siteUrl);
  if (siteUrl) {
    const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link'); canonical.rel = 'canonical'; canonical.href = siteUrl; if (!canonical.parentNode) document.head.appendChild(canonical);
    const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta'); ogUrl.setAttribute('property','og:url'); ogUrl.content = siteUrl; if (!ogUrl.parentNode) document.head.appendChild(ogUrl);
    document.querySelector('meta[property="og:image"]').content = new URL('assets/images/ogp.jpg',siteUrl.endsWith('/') ? siteUrl : siteUrl + '/').href;
  }
  if (config.indexable) document.querySelector('meta[name="robots"]').content = 'index, follow';

  const durationLabel = document.getElementById('duration-label');
  const price = document.getElementById('base-price');
  const description = document.getElementById('duration-description');
  document.querySelectorAll('input[name="duration"]').forEach(input => input.addEventListener('change', () => {
    const long = input.value === '120';
    durationLabel.textContent = long ? '120分' : '60分';
    price.textContent = long ? '7,000' : '3,500';
    description.textContent = long ? '食事と雪あそびを組み合わせる方に。鍋セットは120分プラン限定の予定です。' : 'かまくらでの休憩や雪あそびに。食事なしでの利用も可能な予定です。';
    price.classList.remove('price-changing'); requestAnimationFrame(() => price.classList.add('price-changing'));
  }));

  const menu = document.getElementById('menu-dialog');
  const policy = document.getElementById('policy-dialog');
  function openDialog(dialog) { if (typeof dialog.showModal === 'function') { dialog.showModal(); document.body.classList.add('dialog-open'); } }
  function closeDialog(dialog) { dialog.close(); }
  document.querySelector('.menu-button').addEventListener('click', () => openDialog(menu));
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => closeDialog(dialog));
    dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) closeDialog(dialog); });
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeDialog(menu)));
  const policyTexts = {
    privacy: {title:'プライバシーについて',text:'このページに予約情報やカード情報を入力するフォームはありません。予約受付開始後、お名前・ご連絡先などの情報は予約サイトでお預かりします。個人情報の取り扱いについては、予約時に提示されるプライバシーポリシーをご確認ください。'},
    cancel: {title:'変更・キャンセルについて',text:'予約の変更方法、取消期限、キャンセル料、荒天・少雪時の振替や返金条件は、現在準備中です。正式な条件は、予約受付開始後の予約ページでご案内します。ご予約前に、必ず内容をご確認ください。'}
  };
  document.querySelectorAll('[data-open-policy]').forEach(button => button.addEventListener('click', () => {
    const type = button.dataset.openPolicy;
    const url = safeUrl(type === 'privacy' ? config.privacyPolicyUrl : config.cancellationPolicyUrl);
    if (url) { location.href = url; return; }
    const content = policyTexts[type]; if (!content) return;
    document.getElementById('policy-heading').textContent = content.title;
    const paragraph = document.createElement('p'); paragraph.textContent = content.text;
    document.getElementById('policy-content').replaceChildren(paragraph);
    openDialog(policy);
  }));
  const sellerUrl = safeUrl(config.sellerInformationUrl);
  if (sellerUrl) { const a = document.createElement('a'); a.textContent = '販売者・決済に関する案内'; a.href = sellerUrl; document.querySelector('.footer-bottom>div').appendChild(a); }

  const header = document.getElementById('header');
  const mobileBooking = document.querySelector('.mobile-booking');
  const progress = document.querySelector('.reading-progress');
  const driftObjects = Array.from(document.querySelectorAll('[data-drift]'));
  let scrollQueued = false;
  function updateScroll() {
    scrollQueued = false;
    const y = window.scrollY;
    header.classList.toggle('scrolled',y > 110);
    mobileBooking.classList.toggle('visible',y > Math.min(window.innerHeight * .55,460));
    const range = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = 'scaleX(' + (range > 0 ? Math.min(1, y/range) : 0) + ')';
    if (!reduced.matches && !capture && !root.classList.contains('motion-paused')) {
      driftObjects.forEach(object => {
        const rect = object.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > window.innerHeight + 100) return;
        const offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * Number(object.dataset.drift || 0);
        object.style.setProperty('--drift', Math.max(-35,Math.min(35,offset)) + 'px');
      });
    }
  }
  window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScroll); } }, {passive:true});
  window.addEventListener('resize',updateScroll,{passive:true}); updateScroll();

  let revealObserver;
  function setReveals() {
    if (capture || reduced.matches || !('IntersectionObserver' in window)) return;
    root.classList.add('motion-ready');
    revealObserver = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); } }),{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    document.querySelectorAll('.reveal').forEach(n => revealObserver.observe(n));
  }
  setReveals();
  if ('IntersectionObserver' in window) {
    const navLinks = Array.from(document.querySelectorAll('.desktop-nav a'));
    const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (!entry.isIntersecting) return; navLinks.forEach(a => { if (a.hash === '#' + entry.target.id) a.setAttribute('aria-current','location'); else a.removeAttribute('aria-current'); }); }),{rootMargin:'-15% 0px -60% 0px'});
    ['experience','plans','access','faq'].forEach(id => navObserver.observe(document.getElementById(id)));
  }

  // Ambient snow: lightweight canvas, capped pixel ratio and particle count.
  const canvas = document.getElementById('snow');
  const ctx = canvas.getContext('2d');
  const toggle = document.querySelector('.motion-toggle');
  let paused = false, snowVisible = true, frame = 0, w = 0, h = 0, particles = [], lastTime = 0;
  function resizeSnow() {
    const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
    const dpr = Math.min(window.devicePixelRatio || 1,1.5);
    canvas.width = w*dpr; canvas.height = h*dpr;
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = w < 760 ? 38 : 72;
    particles = Array.from({length:count},() => ({x:Math.random()*w,y:Math.random()*h,r:.45+Math.random()*1.8,v:9+Math.random()*20,phase:Math.random()*6.28,opacity:.12+Math.random()*.5}));
  }
  function canAnimate() { return !paused && !reduced.matches && !capture && !document.hidden && snowVisible; }
  function draw(time) {
    frame = 0; if (!canAnimate()) return;
    const dt = Math.min((time-(lastTime || time))/1000,.05); lastTime = time;
    ctx.clearRect(0,0,w,h);
    particles.forEach(p => { p.y += p.v*dt; p.x += Math.sin(time*.0004+p.phase)*8*dt; if (p.y > h+5) { p.y = -5; p.x = Math.random()*w; } ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle = 'rgba(255,255,255,'+p.opacity+')'; ctx.fill(); });
    frame = requestAnimationFrame(draw);
  }
  function syncSnow() { if (canAnimate() && !frame) { lastTime = 0; frame = requestAnimationFrame(draw); } else if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; } }
  function setPaused(value) { paused = value; root.classList.toggle('motion-paused',paused); toggle.setAttribute('aria-pressed',String(paused)); toggle.querySelector('.motion-label').textContent = paused ? '動きを再開する' : '動きを止める'; toggle.querySelector('span:first-child').textContent = paused ? '▷' : 'Ⅱ'; syncSnow(); }
  toggle.addEventListener('click', () => setPaused(!paused));
  if (ctx) { resizeSnow(); window.addEventListener('resize',resizeSnow,{passive:true}); if ('IntersectionObserver' in window) new IntersectionObserver(entries => {snowVisible = entries[0].isIntersecting; syncSnow();}).observe(document.querySelector('.hero')); document.addEventListener('visibilitychange',syncSnow); syncSnow(); }
  reduced.addEventListener('change', () => { if (reduced.matches) { root.classList.remove('motion-ready'); revealObserver?.disconnect(); } syncSnow(); });
})();
