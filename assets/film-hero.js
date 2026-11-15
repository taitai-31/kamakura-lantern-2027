(() => {
  const video = document.querySelector('.hero-video');
  const button = document.getElementById('film-toggle');
  if (!video || !button) return;
  video.muted = true;
  video.playsInline = true;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const labels = {
    playing: {ja:'映像を停止',en:'Pause film'},
    paused: {ja:'映像を再生',en:'Play film'}
  };
  function update(playing){
    const label = labels[playing ? 'playing' : 'paused'];
    button.setAttribute('aria-pressed',String(playing));
    button.querySelector('.ja').textContent = label.ja;
    button.querySelector('.en').textContent = label.en;
    button.setAttribute('aria-label', document.documentElement.lang==='en'?label.en:label.ja);
  }
  if(reducedMotion.matches){ video.pause(); update(false); }
  else {
    const attempt = video.play();
    if(attempt && typeof attempt.catch==='function') attempt.catch(() => update(false));
  }
  button.addEventListener('click',() => {
    if(video.paused){video.play().then(()=>update(true)).catch(()=>update(false));}
    else {video.pause();update(false);}
  });
  video.addEventListener('pause',()=>update(false));
  video.addEventListener('play',()=>update(true));
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden)video.pause();
  });
  reducedMotion.addEventListener?.('change',event=>{
    if(event.matches){video.pause();update(false);}
  });
})();
