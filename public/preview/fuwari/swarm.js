/* Original implementation for this blog. No code from Swarm / Swarm Rebuild. */
(() => {
  if (window.blogSwarm) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const palette = ['#438bf1','#9270ed','#e98651','#33a68b','#df6394','#b28a32','#5270d9','#25a1b5','#a268c8','#d66356','#68a548','#6e83a4'];
  const names = ['Blue','Iris','Peach','Mint','Rose','Amber','Indigo','Cyan','Lilac','Coral','Lime','Slate'];
  const pointer = {x:innerWidth/2,y:160};
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
    // The real text nodes never change: typing clips the original glyph layout.
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
    const count=innerWidth<700?6:innerWidth<1100?8:12;
    for(let i=0;i<count;i++){
      const cursor=document.createElement('div');cursor.className='swarm-cursor';cursor.style.setProperty('--cursor-color',palette[i]);
      cursor.innerHTML=`<svg viewBox="-12 -12 36 44"><path class="swarm-arrow" d="M0 0 L20 16 L10 18 L7 28 Z" fill="${palette[i]}" stroke="white" stroke-width="1.8" stroke-linejoin="round"/><g class="swarm-cross" stroke="${palette[i]}" stroke-width="1.6"><path d="M-10 0H10M0-10V10"/></g><g class="swarm-ibeam" stroke="${palette[i]}" stroke-width="1.8"><path d="M0-8V8M-4-8H4M-4 8H4"/></g></svg><span class="swarm-cursor-label">${names[i]}</span>`;
      const frame=document.createElement('div');frame.className='swarm-frame';frame.style.setProperty('--cursor-color',palette[i]);
      frame.innerHTML='<i></i><i></i><i></i><i></i><span class="swarm-measure"></span>';
      const caret=document.createElement('div');caret.className='swarm-caret';caret.style.background=palette[i];
      const guide=document.createElement('div');guide.className='swarm-snap-guide';guide.style.borderColor=palette[i];
      layer.append(guide,frame,caret,cursor);
      agents.push({cursor,frame,caret,guide,index:i,x:innerWidth/2,y:Math.min(180,innerHeight/3),task:null,elapsed:0,phase:'idle',cooldown:i*35});
    }
    document.body.append(layer);
  }
  function pulse(agent,x,y){
    if(!layer)return;
    const ring=document.createElement('div');ring.className='swarm-click';ring.style.cssText=`left:${x}px;top:${y}px;border-color:${palette[agent.index]}`;
    layer.append(ring);ring.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:.9},{transform:'translate(-50%,-50%) scale(1.9)',opacity:0}],{duration:360}).onfinish=()=>ring.remove();
  }
  function measureGlyphs(task){
    const base=rect(task.el);task.glyphs=[];let weight=0;
    for(const part of task.texts){
      let offset=0;
      for(const letter of part.letters){
        const range=document.createRange();range.setStart(part.node,offset);offset+=letter.length;range.setEnd(part.node,offset);
        const box=range.getBoundingClientRect();
        weight+=/[，。！？；、,.!?;:]/.test(letter)?3:/\s/.test(letter)?.35:1;
        if(box.height>0)task.glyphs.push({x:box.right-base.left,top:box.top-base.top,bottom:box.bottom-base.top,weight});
      }
    }
    task.weight=weight;
  }
  function workRect(task){
    const r=rect(task.el);
    // A long article panel extends below the viewport; draw its visible opening,
    // then reveal the continuous background. Cursor and selection share this rect.
    const left=Math.max(18,r.left),top=Math.max(24,r.top);
    return {left,top,width:Math.max(1,Math.min(innerWidth-22,r.right)-left),height:Math.max(1,Math.min(innerHeight-100,r.bottom)-top)};
  }
  function beginTask(agent,task){
    agent.task=task;agent.elapsed=0;agent.fromX=agent.x;agent.fromY=agent.y;agent.phase='travel';task.state='running';
    const r=workRect(task),distance=Math.hypot(agent.x-r.left,agent.y-r.top);
    agent.travel=Math.min(720,340+distance*.3);
    agent.arc=(agent.index%2?1:-1)*Math.min(100,distance*.16);
    task.duration=task.type==='text'?Math.min(4200,Math.max(850,(task.length||0)*24)):task.type==='box'?1320:1150;
    task.el.classList.add('swarm-building');task.el.style.transition='none';task.el.style.animation='none';
    if(task.type==='text')measureGlyphs(task);
    agent.cursor.classList.remove('is-drawing','is-typing','is-idle');
    agent.frame.classList.toggle('is-text',task.type==='text');
    agent.frame.classList.toggle('is-media',task.type==='media');
  }
  function typeText(task,fraction){
    const count=task.weight*fraction;
    let glyph=task.glyphs[0];
    for(const g of task.glyphs){if(g.weight>count)break;glyph=g;}
    const r=rect(task.el);
    if(!glyph)return {x:r.left,y:r.top+12,height:20};
    const x=Math.min(r.width,Math.max(0,glyph.x)),top=Math.max(0,glyph.top),bottom=Math.min(r.height,glyph.bottom+2);
    // Previous lines plus the typed portion of this line; no reflow or center shift.
    task.el.style.clipPath=fraction>=1?'none':`polygon(0 0,100% 0,100% ${top}px,${x}px ${top}px,${x}px ${bottom}px,0 ${bottom}px)`;
    return {x:r.left+x,y:r.top+glyph.top,height:glyph.bottom-glyph.top};
  }
  function frameAt(agent,r,opacity=1){
    Object.assign(agent.frame.style,{left:`${r.left}px`,top:`${r.top}px`,width:`${Math.max(0,r.width)}px`,height:`${Math.max(0,r.height)}px`,opacity:String(opacity)});
  }
  function renderCursor(a){a.cursor.style.transform=`translate3d(${a.x}px,${a.y}px,0)`;}
  function draw(agent,dt,clock){
    const t=agent.task;
    agent.caret.style.opacity='0';agent.guide.style.opacity='0';
    if(!t){
      agent.phase='idle';agent.cooldown=Math.max(0,agent.cooldown-dt);
      // Idle cursors spread out, rather than piling into one corner.
      const columns=innerWidth<700?3:6;
      const slotX=28+(agent.index%columns)*(innerWidth-70)/Math.max(1,columns-1);
      const slotY=92+Math.floor(agent.index/columns)*47;
      const angle=clock/1900+agent.index*2.4;
      let targetX=slotX+Math.sin(angle)*13,targetY=slotY+Math.cos(angle)*9;
      const pd=Math.hypot(pointer.x-targetX,pointer.y-targetY);
      if(pd<70){targetX+=(targetX-pointer.x)*.8;targetY+=(targetY-pointer.y)*.8;}
      const blend=1-Math.exp(-dt/180);
      agent.x=mix(agent.x,targetX,blend);agent.y=mix(agent.y,targetY,blend);
      agent.cursor.classList.remove('is-drawing','is-typing');agent.cursor.classList.add('is-idle');
      agent.cursor.style.opacity='.55';agent.frame.style.opacity='0';
    }else{
      agent.elapsed+=dt;const r=workRect(t);const raw=rect(t.el);
      if(raw.bottom<15 || raw.top>innerHeight+80){complete(t);agent.task=null;agent.frame.style.opacity='0';return;}
      const elapsed=agent.elapsed-agent.travel;
      agent.cursor.style.opacity='1';
      if(elapsed<0){
        const targetX=t.type==='media'?r.left+(agent.index%2?1:-1)*Math.min(55,r.width*.13)+Math.min(32,r.width*.2):r.left;
        const targetY=t.type==='media'?r.top-24:r.top;
        const p=ease(agent.elapsed/agent.travel),controlX=(agent.fromX+targetX)/2+agent.arc,controlY=(agent.fromY+targetY)/2-agent.arc;
        agent.x=(1-p)**2*agent.fromX+2*(1-p)*p*controlX+p*p*targetX;
        agent.y=(1-p)**2*agent.fromY+2*(1-p)*p*controlY+p*p*targetY;
        agent.frame.style.opacity='0';
      }else if(t.type==='box'){
        agent.cursor.classList.add('is-drawing');
        if(agent.phase==='travel'){agent.phase='press';pulse(agent,r.left,r.top);}
        // Press -> drag upper-left to lower-right -> release -> fill.
        const p=Math.min(1,Math.max(0,(elapsed-150)/850));
        const drag=p*p*(3-2*p);
        const width=r.width*drag,height=r.height*drag;
        agent.x=r.left+width;agent.y=r.top+height;
        frameAt(agent,{...r,width,height});
        agent.frame.querySelector('span').textContent=`${Math.round(width)} × ${Math.round(height)}`;
        if(p>0&&p<1)agent.phase='drag';
        if(p>=1 && agent.phase!=='release'){agent.phase='release';pulse(agent,agent.x,agent.y);}
        if(elapsed>=1100){
          t.el.classList.remove('swarm-pending');t.el.style.opacity=String(Math.min(1,(elapsed-1100)/220));
          frameAt(agent,r,Math.max(0,1-(elapsed-1100)/220));
        }
      }else if(t.type==='text'){
        agent.cursor.classList.add('is-typing');
        if(agent.phase==='travel'){agent.phase='type';pulse(agent,raw.left,raw.top+12);}
        const p=Math.min(1,Math.max(0,(elapsed-100)/(t.duration-180)));
        const target=typeText(t,p);t.el.classList.remove('swarm-pending');
        agent.x=target.x;agent.y=target.y+target.height/2;
        Object.assign(agent.caret.style,{left:`${target.x}px`,top:`${target.y}px`,height:`${target.height}px`,opacity:String(Math.floor(clock/350)%2?.35:1)});
        frameAt(agent,r,elapsed<180?.35:0);
        agent.frame.querySelector('span').textContent='T';
        agent.guide.style.cssText+=`;left:${raw.left}px;top:${target.y+target.height}px;width:${Math.min(raw.width,innerWidth-raw.left)}px;opacity:${elapsed<300?.35:0}`;
      }else{
        if(agent.phase==='travel'){agent.phase='place';pulse(agent,agent.x,agent.y);}
        const p=Math.min(1,Math.max(0,(elapsed-100)/650)),move=ease(p);
        const offset=(agent.index%2?1:-1)*Math.min(55,r.width*.13)*(1-move);
        const ghost={...r,left:r.left+offset,top:r.top-24*(1-move)};
        frameAt(agent,ghost,elapsed<850?.8:Math.max(0,1-(elapsed-850)/300));
        agent.x=ghost.left+Math.min(32,r.width*.2);agent.y=ghost.top;
        agent.frame.querySelector('span').textContent=r.width<180?'':p<1?'拖入 · 放置':'✓ 对齐';
        if(elapsed>=750){
          if(agent.phase!=='release'){agent.phase='release';pulse(agent,agent.x,agent.y);}
          t.el.classList.remove('swarm-pending');t.el.style.opacity=String(Math.min(1,(elapsed-750)/280));
          agent.guide.style.cssText+=`;left:${r.left}px;top:${r.top}px;width:${r.width}px;opacity:${Math.max(0,.6-(elapsed-750)/600)}`;
        }
      }
      if(elapsed>=t.duration){complete(t);agent.task=null;agent.cooldown=60+(agent.index%3)*35;agent.frame.style.opacity='0';agent.caret.style.opacity='0';}
    }
    renderCursor(agent);
  }
  function chooseTask(agent){
    const ready=tasks.filter(t=>t.state==='pending' && t.parents.every(p=>p.state==='done') && rect(t.el).top<innerHeight-105 && rect(t.el).bottom>24);
    // Prefer nearby work but give every column a chance to progress.
    return ready.sort((a,b)=>{
      const ar=rect(a.el),br=rect(b.el);
      const score=r=>Math.hypot(r.left-agent.x,(r.top-agent.y)*.6)+Math.max(0,r.top)*.15;
      return score(ar)-score(br);
    })[0];
  }
  function arrangeLabels(){
    const occupied=[];
    for(const a of [...agents].sort((a,b)=>Number(!!b.task)-Number(!!a.task))){
      const label=a.cursor.querySelector('.swarm-cursor-label');
      const width=label.offsetWidth,height=label.offsetHeight;
      const candidates=[[14,24],[14,-height-13],[-width-12,24],[-width-12,-height-13],[18,48],[-width-12,48]];
      let chosen=candidates[0],best=Infinity;
      for(const candidate of candidates){
        const x=a.x+candidate[0],y=a.y+candidate[1];
        let cost=(x<8||x+width>innerWidth-8||y<22||y+height>innerHeight-85)?10000:0;
        for(const box of occupied)if(x<box.x+box.width+5&&x+width+5>box.x&&y<box.y+box.height+4&&y+height+4>box.y)cost+=100;
        if(cost<best){best=cost;chosen=candidate;}if(cost===0)break;
      }
      label.style.left=`${chosen[0]}px`;label.style.top=`${chosen[1]}px`;
      occupied.push({x:a.x+chosen[0],y:a.y+chosen[1],width,height});
    }
  }
  function tick(now){
    if(!active)return;
    try{
      const dt=Math.min(50,now-last)*speed;last=now;
      if(document.hidden){raf=requestAnimationFrame(tick);return;}
      if(now-startedAt<650){
        for(const a of agents){const angle=(now-startedAt)/550+a.index*Math.PI*2/agents.length;const radius=innerWidth<700?65:110;a.x=innerWidth/2+Math.cos(angle)*radius;a.y=Math.min(180,innerHeight/3)+Math.sin(angle)*radius*.55;a.cursor.style.opacity='1';renderCursor(a);}
      }else{
        for(const t of tasks){if(t.state==='pending' && rect(t.el).bottom<0)complete(t);}
        for(const a of agents){
          if(!a.task && a.cooldown<=0){const next=chooseTask(a);if(next)beginTask(a,next);}
          draw(a,dt,now);
        }
        const busy=agents.some(a=>a.task);
        progress.value=Math.round(done/tasks.length*100);
        caption.textContent=busy?`${agents.length} 个光标协作中`:done===tasks.length?'搭建完成':'向下滚动，继续搭建';
        if(tour && !busy){
          const next=tasks.find(t=>t.state==='pending');
          if(next){const r=rect(next.el);window.scrollBy(0,Math.min(dt*.18,Math.max(0,r.top-innerHeight*.45)));}
        }
        if(done===tasks.length){finish();return;}
      }
      arrangeLabels();
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
  window.addEventListener('pointermove',event=>{pointer.x=event.clientX;pointer.y=event.clientY;},{passive:true});
  function stopTour(){if(!tour)return;tour=false;dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');}
  window.addEventListener('wheel',stopTour,{passive:true});window.addEventListener('touchstart',e=>{if(!dock.contains(e.target))stopTour();},{passive:true});
  function bindSwup(){
    if(hookBound||!window.swup?.hooks)return;hookBound=true;
    window.swup.hooks.on('visit:start',()=>finish());
    window.swup.hooks.on('page:view',()=>{dock.classList.add('is-idle');});
  }
  document.addEventListener('swup:enable',bindSwup);bindSwup();
  // Explicitly exposed controls make the enhancement inspectable without changing article content.
  window.blogSwarm={start,stop:finish,get state(){return {active,pending:tasks.filter(t=>t.state==='pending').length,done,total:tasks.length,speed,tour,cursors:agents.length,workers:agents.map(a=>({phase:a.phase,type:a.task?.type,x:a.x,y:a.y,frame:{x:parseFloat(a.frame.style.left)||0,y:parseFloat(a.frame.style.top)||0,width:parseFloat(a.frame.style.width)||0,height:parseFloat(a.frame.style.height)||0}}))};}};
  function boot(){bindSwup();if(location.hash||reduced.matches)return;start();}
  if(document.readyState==='complete')setTimeout(boot,350);else window.addEventListener('load',()=>setTimeout(boot,350),{once:true});
})();
