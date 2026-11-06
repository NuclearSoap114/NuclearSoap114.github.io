/* Original choreography with a small set of blog-specific adaptations. */
(() => {
  const base = new URL('.', document.currentScript.src);
  const mode = new URLSearchParams(location.search).get('swarm');
  function script(path, onerror) {
    const tag = document.createElement('script');
    tag.src = new URL(path, base).href;
    if (onerror) tag.onerror = onerror;
    document.body.append(tag);
  }
  if (mode === 'custom') {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('swarm.css?v=3', base).href;
    css.onload = () => script('swarm.js?v=3');
    document.head.append(css);
    return;
  }
  const adapted = mode !== 'original';
  let preparedAudio;
  if (adapted) {
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      preparedAudio = new Audio({latencyHint:'interactive'});
      window.__blogSwarmAudioContext = preparedAudio;
      // Attempt autoplay normally; never bypass the browser's gesture policy.
      preparedAudio.resume().catch(() => {});
    } catch (_) {}
    const unlock = () => {
      const api = window.__swarmRebuild;
      if (api) {
        const sound = api.app?.sfx;
        if (sound?.on) sound.resume();
      } else if (preparedAudio && preparedAudio.state !== 'closed') {
        preparedAudio.resume().catch(() => {});
      }
    };
    for (const event of ['pointerdown','touchend','keydown']) {
      window.addEventListener(event, unlock, {capture:true, passive:true});
    }
    window.addEventListener('pagehide', () => {
      for (const event of ['pointerdown','touchend','keydown']) window.removeEventListener(event, unlock, true);
      if (window.__blogSwarmAudioContext === preparedAudio) {
        delete window.__blogSwarmAudioContext;
        preparedAudio?.close().catch(() => {});
      }
    }, {once:true});
  }
  const boot = () => setTimeout(() => script(adapted ? 'vendor/swarm-blog.js?v=6' : 'vendor/swarm-rebuild.js', () => {
    if (preparedAudio && preparedAudio.state !== 'closed') preparedAudio.close().catch(() => {});
    delete window.__blogSwarmAudioContext;
  }), 1200);
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot, {once:true});
  let bound = false;
  function bindNavigation() {
    if (bound || !window.swup?.hooks) return;
    bound = true;
    window.swup.hooks.on('visit:start', () => window.__swarmRebuild?.stop(false));
  }
  document.addEventListener('swup:enable', bindNavigation);
  bindNavigation();
})();
