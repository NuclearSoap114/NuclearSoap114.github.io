/* Welcome screen, sound preference and replay lifecycle for the blog. */
(() => {
  if (window.blogEntrance) return;
  const base = new URL('.', document.currentScript.src);
  const mode = new URLSearchParams(location.search).get('swarm');
  const gate = document.getElementById('blog-welcome');
  const enter = document.getElementById('welcome-enter');
  const mute = document.getElementById('welcome-muted');
  const hint = document.getElementById('welcome-sound-hint');
  const replay = document.getElementById('blog-replay');
  const status = document.getElementById('welcome-status');
  let phase = 'welcome', entered = false, muted = false, navigating = false, serial = 0;
  let enginePromise, preparedAudio, activeApp, bound = false;
  const inertBefore = new Map();
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const frame = () => new Promise(resolve => requestAnimationFrame(resolve));
  function load(path) {
    return new Promise((resolve, reject) => {
      const tag = document.createElement('script');
      tag.src = new URL(path, base).href;
      tag.onload = resolve;
      tag.onerror = () => { tag.remove(); reject(new Error('Animation could not load')); };
      document.body.append(tag);
    });
  }
  function releasePage() {
    for (const [el, value] of inertBefore) el.inert = value;
    inertBefore.clear();
    document.documentElement.classList.remove('blog-welcome-open');
  }
  function hideGate() {
    gate.hidden = true;
    gate.setAttribute('aria-hidden', 'true');
    releasePage();
  }
  function closePreparedAudio() {
    if (window.__blogSwarmAudioContext === preparedAudio) {
      delete window.__blogSwarmAudioContext;
      if (preparedAudio?.state !== 'closed') preparedAudio?.close().catch(() => {});
    }
  }
  function prepareSound() {
    window.__blogSwarmMuted = muted;
    if (muted) return;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      preparedAudio = new Audio({latencyHint:'interactive'});
      window.__blogSwarmAudioContext = preparedAudio;
      // Called synchronously from Enter/Replay, so the user's click unlocks audio.
      preparedAudio.resume().catch(() => {});
    } catch (_) {}
  }
  function showReplay(restoreFocus = false) {
    if (!entered || navigating || phase === 'loading' || phase === 'playing') return;
    replay.hidden = false;
    if (restoreFocus) replay.focus({preventScroll:true});
  }
  async function play(first = false) {
    if (phase === 'loading' || phase === 'playing') return;
    const id = ++serial;
    phase = 'loading';
    replay.hidden = true;
    prepareSound();
    let releaseEntrance;
    let prepared;
    if (first) {
      entered = true;
      enter.disabled = true;
      mute.disabled = true;
      enter.querySelector('span').textContent = '正在准备…';
      gate.setAttribute('aria-busy', 'true');
      status.textContent = '正在准备这场小小的搭建';
      prepared = new Promise(resolve => {
        window.__blogSwarmEntrance = {
          ready: resolve,
          released: new Promise(done => { releaseEntrance = done; }),
        };
      });
      // Keep the opaque welcome above the preparing canvas; never flash the finished page.
      releasePage();
    }
    window.scrollTo({top:0, behavior:'instant'});
    try {
      await Promise.race([document.fonts.ready, wait(1200)]);
      await frame(); await frame();
      if (id !== serial) return;
      window.__blogSwarmManualStart = true;
      if (!window.__swarmRebuild) {
        enginePromise ||= load('vendor/swarm-blog.js?v=8').catch(error => { enginePromise = null; throw error; });
        await enginePromise;
      }
      if (id !== serial) return;
      window.__swarmRebuild.start();
      activeApp = window.__swarmRebuild.app;
      if (first) {
        let timeout;
        try {
          await Promise.race([prepared, new Promise((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Animation preparation timed out')), 15000);
          })]);
        } finally { clearTimeout(timeout); }
        if (id !== serial) return;
        enter.querySelector('span').textContent = '欢迎来访';
        status.textContent = '';
        gate.classList.add('is-leaving');
        await wait(matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 660);
        hideGate();
        gate.removeAttribute('aria-busy');
      }
      phase = 'playing';
      releaseEntrance?.();
    } catch (error) {
      console.error('[blog-entrance]', error);
      activeApp = null;
      window.__swarmRebuild?.stop(false);
      closePreparedAudio();
      hideGate();
      phase = 'reading';
      showReplay();
    } finally {
      releaseEntrance?.();
      delete window.__blogSwarmEntrance;
      if (id !== serial) closePreparedAudio();
    }
  }

  window.blogEntrance = { get state() { return {phase, entered, muted}; } };

  // Keep the historical comparison modes directly accessible.
  if (mode === 'original' || mode === 'custom') {
    hideGate();phase = 'comparison';
    if (mode === 'custom') {
      const css = document.createElement('link');css.rel = 'stylesheet';css.href = new URL('swarm.css?v=3', base).href;
      css.onload = () => load('swarm.js?v=3').catch(console.error);document.head.append(css);
    } else {
      const boot = () => setTimeout(() => load('vendor/swarm-rebuild.js').catch(console.error), 1200);
      if (document.readyState === 'complete') boot();else window.addEventListener('load', boot, {once:true});
    }
  } else {
    for (const el of document.body.children) {
      if (el === gate || el === replay || ['SCRIPT','STYLE','NOSCRIPT'].includes(el.tagName)) continue;
      inertBefore.set(el, el.inert);el.inert = true;
    }
    mute.checked = false;
    window.__blogSwarmMuted = false;
    mute.addEventListener('change', () => {
      muted = mute.checked;
      window.__blogSwarmMuted = muted;
      hint.textContent = muted ? '进入时保持安静' : '进入时播放音效';
    });
    enter.addEventListener('click', () => play(true));
    replay.addEventListener('click', () => play());
    const qq = document.getElementById('welcome-qq');
    qq.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(qq.dataset.qq);
        status.textContent = 'QQ 号已复制';
      } catch (_) { status.textContent = `QQ：${qq.dataset.qq}，可长按号码复制`; }
    });
    gate.addEventListener('keydown', event => {
      if (phase === 'loading') {
        event.stopPropagation();
        if (event.key === 'Escape') event.preventDefault();
      }
      if (event.key !== 'Tab' || gate.hidden) return;
      const controls = [...gate.querySelectorAll('a[href],button:not(:disabled),input:not(:disabled)')];
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === gate)) { event.preventDefault();last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault();first.focus(); }
    });
    gate.focus({preventScroll:true});
    window.addEventListener('blog:swarm-sound', event => {
      muted = !!event.detail.muted;
      mute.checked = muted;
      hint.textContent = muted ? '进入时保持安静' : '进入时播放音效';
    });
    window.addEventListener('blog:swarm-ended', event => {
      if (event.detail?.instance !== activeApp) return;
      activeApp = null;
      if (phase === 'playing') phase = 'reading';
      showReplay(!!event.detail?.restoreFocus);
    });
  }
  function bindNavigation() {
    if (bound || !window.swup?.hooks) return;
    bound = true;
    window.swup.hooks.on('visit:start', () => {
      navigating = true;serial++;replay.hidden = true;activeApp = null;
      closePreparedAudio();
      window.__swarmRebuild?.stop(false);
      if (entered) phase = 'reading';
    });
    window.swup.hooks.on('page:view', () => {
      navigating = false;
      if (entered && phase !== 'loading' && !window.__swarmRebuild?.app) { phase = 'reading';showReplay(); }
    });
  }
  document.addEventListener('swup:enable', bindNavigation);
  bindNavigation();
  window.addEventListener('pagehide', () => { serial++;closePreparedAudio(); }, {once:true});
})();
