/* Original implementation for this blog. No code from Swarm / Swarm Rebuild. */
(() => {
  if (window.blogSwarm) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#438bf1', '#9270ed', '#e98651', '#33a68b'];
  const names = ['Blue', 'Iris', 'Peach', 'Mint'];
  const segmenter = new Intl.Segmenter('zh', { granularity: 'grapheme' });
  let active = false, tasks = [], agents = [], layer, raf = 0, last = 0, speed = 1, tour = false;
  let runId = 0, done = 0, startedAt = 0, safetyTimer = 0, launching = false, hookBound = false;
  const dock = document.createElement('div');
  dock.className = 'swarm-dock is-idle';
  dock.setAttribute('role', 'region');
  dock.setAttribute('aria-label', '页面搭建动画控制');
  dock.innerHTML = '<div class="swarm-status"><span class="swarm-dot"></span><span class="swarm-caption">光标协作</span><progress max="100" value="0" aria-label="搭建进度"></progress></div><button data-action="speed" aria-label="动画速度，当前 1 倍">1×</button><button data-action="tour" aria-pressed="false">自动导览</button><button data-action="skip">跳过</button><button data-action="replay">↗ 重播搭建</button><span class="swarm-screenreader" role="status" aria-live="polite"></span>';
  document.body.append(dock);
  const caption = dock.querySelector('.swarm-caption');
  const progress = dock.querySelector('progress');
  const announce = text => { dock.querySelector('[role=status]').textContent = text; };
  const all = selector => [...document.querySelectorAll(selector)];
  const ease = p => 1 - Math.pow(1 - p, 3);
  const mix = (a,b,p) => a+(b-a)*p;
  const rect = el => el.getBoundingClientRect();
  const visibleElement = el => {
    const r=rect(el); const s=getComputedStyle(el);
    return r.width>5 && r.height>4 && s.display!=='none' && s.visibility!=='hidden' && !el.closest('.float-panel-closed');
  };
  function restore(task) {
    if (task.texts) task.texts.forEach(t => { t.node.nodeValue=t.value; });
    task.el.classList.remove('swarm-pending','swarm-building');
    if (task.originalStyle === null) task.el.removeAttribute('style'); else task.el.setAttribute('style',task.originalStyle);
    task.el.inert=task.inert;
    if(task.aria === null) task.el.removeAttribute('aria-hidden'); else task.el.setAttribute('aria-hidden',task.aria);
  }
  function complete(task) {
    if(task.state==='done') return;
    restore(task); task.state='done'; done++;
  }
  function finish(message='搭建完成，可以开始阅读。') {
    runId++; launching=false; active=false; tour=false;
    cancelAnimationFrame(raf); clearTimeout(safetyTimer);
    tasks.forEach(restore); tasks=[];
    layer?.remove(); layer=null; agents=[];
    document.documentElement.classList.remove('swarm-mode');
    dock.classList.add('is-idle');
    dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');
    announce(message);
    if(dock.contains(document.activeElement) && document.activeElement?.dataset.action!=='replay') dock.querySelector('[data-action=replay]').focus({preventScroll:true});
  }
  function collect() {
    const found = new Map();
    function add(selector,type) {
      for(const el of all(selector)) {
        if(!visibleElement(el) || found.has(el)) continue;
        found.set(el,{el,type,state:'pending',originalStyle:el.getAttribute('style'),inert:el.inert,aria:el.getAttribute('aria-hidden')});
      }
    }
    add('#banner-wrapper, #navbar .card-base, #sidebar .card-base, #post-container, #swup-container .card-base','box');
    add('#navbar .card-base > a, #navbar .hidden.md\\:flex > a, #navbar .card-base > .flex','media');
    add('#sidebar img','media');
    add('#sidebar .font-bold, #sidebar .text-neutral-400, #sidebar .btn-regular, #categories a, #tags a','text');
    add('#post-container > .onload-animation:not(.custom-md):not(.license-container), #post-cover','media');
    // The title is typed separately from its containing decoration.
    const title=document.querySelector('[data-pagefind-meta="title"]');
    if(title && visibleElement(title)) {
      if(found.has(title.parentElement)) found.delete(title.parentElement);
      found.set(title,{el:title,type:'text',state:'pending',originalStyle:title.getAttribute('style'),inert:title.inert,aria:title.getAttribute('aria-hidden')});
    }
    add('.custom-md h1, .custom-md h2, .custom-md h3, .custom-md h4, .custom-md p, .custom-md li','text');
    add('.custom-md .expressive-code, .custom-md .admonition, .custom-md .github-card, .custom-md table, .custom-md img, .license-container','media');
    add('#toc-inner-wrapper, .post-card','media');
    // Media blocks reveal intact; do not rewrite code, SVGs or interactive widgets.
    for(const [el,task] of found) {
      if(task.type==='text' && el.closest('.expressive-code')) found.delete(el);
    }
    const list=[...found.values()];
    // Discard inner typing tasks where an outer typing task already owns the text.
    tasks=list.filter(t=>!list.some(p=>p!==t && p.type==='text' && p.el.contains(t.el)));
    tasks.forEach(t=>{
      const r=rect(t.el);t.height=r.height;t.width=r.width;
      t.parents=tasks.filter(p=>p!==t && p.el.contains(t.el));
      if(t.type==='text') {
        const walker=document.createTreeWalker(t.el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('svg,script,style,.anchor')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});
        t.texts=[];let n;
        while((n=walker.nextNode())) t.texts.push({node:n,value:n.nodeValue,letters:[...segmenter.segment(n.nodeValue)].map(x=>x.segment)});
        t.length=t.texts.reduce((sum,n)=>sum+n.letters.length,0);
      }
    });
    tasks.sort((a,b)=>rect(a.el).top-rect(b.el).top || rect(a.el).left-rect(b.el).left);
    for(const t of tasks) {
      t.el.classList.add('swarm-pending');t.el.inert=true;t.el.setAttribute('aria-hidden','true');
    }
  }
  function createStage() {
    layer=document.createElement('div');layer.className='swarm-layer';layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<div class="swarm-ruler-x"></div><div class="swarm-ruler-y"></div>';
    const count=innerWidth<700?2:4;
    const left=rect(document.querySelector('#post-container')||document.querySelector('main')).left;
    const guide=document.createElement('div');guide.className='swarm-guide';guide.style.left=`${Math.max(18,left)}px`;layer.append(guide);
    for(let i=0;i<count;i++){
      const cursor=document.createElement('div');cursor.className='swarm-cursor';cursor.style.setProperty('--cursor-color',palette[i]);
      cursor.innerHTML=`<svg viewBox="0 0 28 32"><path d="M2 2 L24 18 L14 20 L10 29 Z" fill="${palette[i]}" stroke="white" stroke-width="2" stroke-linejoin="round"/></svg><span class="swarm-cursor-label">${names[i]}</span>`;
      const frame=document.createElement('div');frame.className='swarm-frame';frame.style.setProperty('--cursor-color',palette[i]);frame.innerHTML='<span class="swarm-measure"></span>';
      layer.append(frame,cursor);
      agents.push({cursor,frame,index:i,x:innerWidth/2,y:Math.min(180,innerHeight/3),task:null,elapsed:0});
    }
    document.body.append(layer);
  }
  function beginTask(agent,task){
    agent.task=task;agent.elapsed=0;agent.fromX=agent.x;agent.fromY=agent.y;task.state='running';
    task.duration=task.type==='text'?Math.min(1900,Math.max(550,(task.length||0)*18)):task.type==='box'?650:850;
    task.el.classList.add('swarm-building');
    if(task.type==='text'){
      task.el.style.minHeight=`${task.height}px`;
      task.texts.forEach(t=>{t.node.nodeValue='';});
    }
    task.el.style.transition='none';task.el.style.animation='none';
  }
  function typeText(task,fraction){
    let count=Math.floor(task.length*fraction),lastNode=null,lastOffset=0;
    for(const part of task.texts){
      const n=Math.max(0,Math.min(count,part.letters.length));
      const value=part.letters.slice(0,n).join('');
      if(part.node.nodeValue!==value) part.node.nodeValue=value;
      if(n>0){lastNode=part.node;lastOffset=value.length;}
      count-=n;
    }
    if(lastNode && lastOffset){
      const range=document.createRange();range.setStart(lastNode,Math.max(0,lastOffset-1));range.setEnd(lastNode,lastOffset);
      const r=range.getBoundingClientRect();return {x:r.right,y:r.bottom-4};
    }
    const r=rect(task.el);return {x:r.left,y:r.top+15};
  }
  function draw(agent,dt,clock){
    const t=agent.task;
    if(!t){
      const angle=clock/1400+agent.index*Math.PI/2;
      const targetX=innerWidth-80-Math.cos(angle)*24,targetY=innerHeight-110+Math.sin(angle)*22;
      agent.x=mix(agent.x,targetX,.04);agent.y=mix(agent.y,targetY,.04);
      agent.cursor.style.opacity='.65';agent.frame.style.opacity='0';
    }else{
      agent.elapsed+=dt;const r=rect(t.el);const travel=300;
      const p=Math.min(1,Math.max(0,(agent.elapsed-travel)/t.duration));
      let target={x:r.left,y:r.top};
      if(agent.elapsed<travel){
        const move=ease(agent.elapsed/travel);agent.x=mix(agent.fromX,r.left,move);agent.y=mix(agent.fromY,r.top,move);
      }else{
        t.el.classList.remove('swarm-pending');
        if(t.type==='text') target=typeText(t,p);
        else{
          const reveal=ease(p);
          t.el.style.clipPath=`inset(0 ${100-reveal*100}% ${t.type==='box'?100-reveal*100:0}% 0)`;
          target={x:r.left+r.width*reveal,y:t.type==='box'?r.top+Math.min(r.height,innerHeight-r.top-35)*reveal:r.top+Math.min(r.height*.5,120)};
        }
        agent.x=mix(agent.x,target.x,.38);agent.y=mix(agent.y,target.y,.38);
      }
      const h=Math.min(r.height,Math.max(0,innerHeight-r.top-30));
      Object.assign(agent.frame.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${r.width*(t.type==='box'?Math.max(.01,ease(p)):1)}px`,height:`${h*(t.type==='box'?Math.max(.01,ease(p)):1)}px`,opacity:agent.elapsed>travel?'0.8':'0'});
      agent.frame.querySelector('span').textContent=t.type==='text'?'T · 排版':`${Math.round(r.width*ease(p))} × ${Math.round(r.height*ease(p))}`;
      agent.cursor.style.opacity='1';
      if(p>=1){complete(t);agent.task=null;agent.frame.style.opacity='0';}
    }
    agent.cursor.style.transform=`translate3d(${Math.max(10,Math.min(innerWidth-35,agent.x))}px,${Math.max(20,Math.min(innerHeight-40,agent.y))}px,0)`;
  }
  function tick(now){
    if(!active)return;
    try{
      const dt=Math.min(50,now-last)*speed;last=now;
      if(document.hidden){raf=requestAnimationFrame(tick);return;}
      if(now-startedAt<650){
        for(const a of agents){const angle=(now-startedAt)/300+a.index*Math.PI/2;a.x=innerWidth/2+Math.cos(angle)*38;a.y=Math.min(180,innerHeight/3)+Math.sin(angle)*25;a.cursor.style.opacity='1';a.cursor.style.transform=`translate(${a.x}px,${a.y}px)`;}
      }else{
        for(const t of tasks){if(t.state==='pending' && rect(t.el).bottom<0)complete(t);}
        for(const a of agents){
          if(!a.task){const next=tasks.find(t=>t.state==='pending' && t.parents.every(p=>p.state==='done') && rect(t.el).top<innerHeight-65 && rect(t.el).bottom>0);if(next)beginTask(a,next);}
          draw(a,dt,now);
        }
        const busy=agents.some(a=>a.task);
        progress.value=Math.round(done/tasks.length*100);
        caption.textContent=busy?'光标正在搭建':done===tasks.length?'搭建完成':'向下滚动，继续搭建';
        if(tour && !busy){
          const next=tasks.find(t=>t.state==='pending');
          if(next){const r=rect(next.el);window.scrollBy(0,Math.min(4*speed,Math.max(0,r.top-innerHeight*.45)));}
        }
        if(done===tasks.length){finish();return;}
      }
      raf=requestAnimationFrame(tick);
    }catch(error){console.error('Cursor animation stopped safely:',error);finish('已显示完整页面。');}
  }
  async function start({replay=false}={}){
    if(active||launching)finish();
    if(reduced.matches){announce('已遵循减少动态效果设置，显示完整页面。');return;}
    launching=true;const id=++runId;
    if(replay)window.scrollTo({top:0,behavior:'instant'});
    await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1000))]);
    if(id!==runId)return;
    document.documentElement.classList.add('swarm-mode','swarm-initialized');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    if(id!==runId)return;
    try{
      done=0;agents=[];collect();
      if(!tasks.length){finish();return;}
      createStage();active=true;launching=false;startedAt=performance.now();last=startedAt;
      dock.classList.remove('is-idle');progress.value=0;caption.textContent='光标正在集结';
      announce('页面搭建动画已开始。可以跳过，或向下滚动继续搭建。');
      raf=requestAnimationFrame(tick);
      safetyTimer=setTimeout(()=>finish('已显示完整页面。'),180000);
    }catch(error){console.error('Cursor animation unavailable:',error);finish('已显示完整页面。');}
  }
  dock.addEventListener('click',event=>{
    const action=event.target.closest('button')?.dataset.action;
    if(action==='skip')finish('已跳过动画，完整页面可直接阅读。');
    if(action==='replay')start({replay:true});
    if(action==='speed'){
      speed=speed%3+1;const btn=dock.querySelector('[data-action=speed]');btn.textContent=`${speed}×`;btn.setAttribute('aria-label',`动画速度，当前 ${speed} 倍`);
    }
    if(action==='tour'){tour=!tour;dock.querySelector('[data-action=tour]').setAttribute('aria-pressed',String(tour));}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(active||launching))finish('已退出动画。');});
  window.addEventListener('resize',()=>{if(active||launching)finish('窗口尺寸已改变，显示完整页面。');});
  window.addEventListener('pagehide',()=>finish());
  reduced.addEventListener('change',()=>{if(reduced.matches)finish('已遵循减少动态效果设置。');});
  function stopTour(){if(!tour)return;tour=false;dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');}
  window.addEventListener('wheel',stopTour,{passive:true});window.addEventListener('touchstart',e=>{if(!dock.contains(e.target))stopTour();},{passive:true});
  function bindSwup(){
    if(hookBound||!window.swup?.hooks)return;hookBound=true;
    window.swup.hooks.on('visit:start',()=>finish());
    window.swup.hooks.on('page:view',()=>{dock.classList.add('is-idle');});
  }
  document.addEventListener('swup:enable',bindSwup);bindSwup();
  // Explicitly exposed controls make the enhancement inspectable without changing article content.
  window.blogSwarm={start,stop:finish,get state(){return {active,pending:tasks.filter(t=>t.state==='pending').length,done,total:tasks.length,speed,tour};}};
  function boot(){bindSwup();if(location.hash||reduced.matches)return;start();}
  if(document.readyState==='complete')setTimeout(boot,350);else window.addEventListener('load',()=>setTimeout(boot,350),{once:true});
})();
