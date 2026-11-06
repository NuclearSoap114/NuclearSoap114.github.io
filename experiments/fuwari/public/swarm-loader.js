/* Run the unmodified upstream engine by default on the main blog. */
(() => {
  const base = new URL('.', document.currentScript.src);
  const original = new URLSearchParams(location.search).get('swarm') !== 'custom';
  function script(path) {
    const tag = document.createElement('script');
    tag.src = new URL(path, base).href;
    document.body.append(tag);
  }
  if (!original) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = new URL('swarm.css?v=3', base).href;
    css.onload = () => script('swarm.js?v=3');
    document.head.append(css);
    return;
  }
  // Let Fuwari's entrance animation settle before upstream snapshots the page.
  const boot = () => setTimeout(() => script('vendor/swarm-rebuild.js'), 1200);
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
