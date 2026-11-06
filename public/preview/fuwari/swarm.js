/* Blog cursor choreography. Independently implemented; original page stays intact. */
(() => {
  if (window.blogSwarm) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const colors = ['#F24E1E','#A259FF','#1ABCFE','#0ACF83','#FF7262','#CA9800','#9747FF','#E8467C','#14AE5C','#0D99FF','#E77B00','#00A5BD'];
  const names = ['Ada','Linus','Grace','Alan','Margaret','Ken','Barbara','Dennis','Radia','Guido','Frances','Bjarne','Hedy','Tim','Katherine','Edsger','Joan','Donald','Sophie','Niklaus','Anita','Brian','Mary','Rob','Ida','Yuki','Shafi','Leslie','Jean','Vint','Lynn','Bram','Mira','Finn','Lena','Noah','June','Kai','Iris','Leo','Nora','Owen','Zoe','Theo','Alma','Ravi','Luca','Remy'];
  const segmenter = new Intl.Segmenter('zh', {granularity:'grapheme'});
  const clamp = (n,a=0,b=1) => Math.max(a,Math.min(b,n));
  const lerp = (a,b,p) => a+(b-a)*p;
  const smooth = p => p*p*(3-2*p);
  const out = p => 1-(1-p)**3;
  const random = (a,b) => a+Math.random()*(b-a);
  const bounds = el => {const r=el.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height};};
  const mouse = {x:innerWidth/2,y:innerHeight/2,seen:false};
  let active=false, launching=false, layer, agents=[], tasks=[], guides=[], done=0, raf=0, generation=0, timer;
  let speed=1, tour=false, mode='idle', last=0, elapsed=0, finaleAt=0, lastScroll=scrollY, scrollVelocity=0, nextSpawn=0, nextId=0, peak=0;
  let sound=false, audio, soundAt=0, hookBound=false, stats={};
  const dock=document.createElement('div');
  dock.className='swarm-dock is-idle';dock.setAttribute('role','region');dock.setAttribute('aria-label','页面搭建动画控制');
  dock.innerHTML='<div class="swarm-status"><span class="swarm-dot"></span><span class="swarm-caption">光标协作</span><progress max="100" value="0" aria-label="搭建进度"></progress></div><button data-action="sound" aria-pressed="false" aria-label="打开动画音效">音效</button><button data-action="speed" aria-label="动画速度，当前 1 倍">1×</button><button data-action="tour" aria-pressed="false">导览</button><button data-action="skip">跳过</button><button data-action="replay">↗ 重播搭建</button><span class="swarm-screenreader" role="status" aria-live="polite"></span>';
  document.body.append(dock);
  const caption=dock.querySelector('.swarm-caption'), progress=dock.querySelector('progress');
  const announce=text=>{dock.querySelector('[role=status]').textContent=text;};
  const limits=()=>innerWidth<700?{intro:12,min:6,max:24,finale:18}:{intro:18,min:8,max:48,finale:36};

  function tone(kind,x=innerWidth/2) {
    if(!sound || !audio || audio.state!=='running')return;
    const now=audio.currentTime;
    if(now-soundAt<(kind==='key'?.035:.02))return;
    soundAt=now;
    const osc=audio.createOscillator(),gain=audio.createGain(),pan=audio.createStereoPanner();
    const notes=[261.63,293.66,329.63,392,440,523.25,587.33,659.25];
    osc.type=kind==='key'?'triangle':'sine';
    osc.frequency.value=kind==='key'?random(850,1300):kind==='click'?680:notes[Math.floor(clamp(x/innerWidth)*7)];
    const duration=kind==='key'?.035:kind==='click'?.055:.32;
    gain.gain.setValueAtTime(.0001,now);gain.gain.exponentialRampToValueAtTime(kind==='key'?.009:.035,now+.006);gain.gain.exponentialRampToValueAtTime(.0001,now+duration);
    pan.pan.value=clamp(x/innerWidth*2-1,-.8,.8);osc.connect(gain).connect(pan).connect(audio.destination);osc.start(now);osc.stop(now+duration+.02);
    osc.onended=()=>{osc.disconnect();gain.disconnect();pan.disconnect();};
  }
  function restore(t){
    if(!t.el)return;
    t.el.classList.remove('swarm-pending');t.el.inert=t.inert;
    if(t.aria===null)t.el.removeAttribute('aria-hidden');else t.el.setAttribute('aria-hidden',t.aria);
  }
  function complete(t){
    if(t.state==='done')return;
    restore(t);t.ghost?.remove();t.ghost=null;t.state='done';done++;
    stats.completed[t.type]=(stats.completed[t.type]||0)+1;
  }
  function finish(message='搭建完成，可以开始阅读。'){
    generation++;launching=false;active=false;mode='idle';tour=false;cancelAnimationFrame(raf);clearTimeout(timer);
    tasks.forEach(restore);tasks=[];guides=[];layer?.remove();layer=null;agents=[];
    document.documentElement.classList.remove('swarm-mode');dock.classList.add('is-idle');dock.classList.remove('is-finale');
    dock.querySelector('[data-action=skip]').textContent='跳过';dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');announce(message);
    if(dock.contains(document.activeElement)&&document.activeElement?.dataset.action!=='replay')dock.querySelector('[data-action=replay]').focus({preventScroll:true});
  }

  // Snapshot only display styles; clones are inert, detached from document identities.
  function snapshot(el){
    const copy=el.cloneNode(true),src=[el,...el.querySelectorAll('*')],dst=[copy,...copy.querySelectorAll('*')];
    const ids=new Map();
    dst.forEach((n,i)=>{if(n.id){const id=`swarm-copy-${nextId++}-${i}`;ids.set(n.id,id);n.id=id;}});
    src.forEach((n,i)=>{
      const target=dst[i],css=getComputedStyle(n);
      target.style.cssText=Array.from(css,p=>`${p}:${css.getPropertyValue(p)};`).join('');
      target.classList.remove('swarm-pending','onload-animation');
      target.style.animation='none';target.style.transition='none';
      for(const attr of [...target.attributes]){
        if(attr.name.startsWith('on')||attr.name==='autofocus')target.removeAttribute(attr.name);
        else if(attr.value.includes('#')){
          let value=attr.value;for(const [old,id] of ids)value=value.replaceAll(`url(#${old})`,`url(#${id})`).replaceAll(`href="#${old}"`,`href="#${id}"`);
          if((attr.name==='href'||attr.name==='xlink:href')&&ids.has(value.slice(1)))value=`#${ids.get(value.slice(1))}`;
          target.setAttribute(attr.name,value);
        }
      }
      if(n instanceof HTMLImageElement){target.src=n.currentSrc||n.src;target.removeAttribute('srcset');target.loading='eager';}
      if(n.classList.contains('onload-animation'))target.style.opacity='1';
    });
    Object.assign(copy.style,{position:'relative',left:'auto',top:'auto',right:'auto',bottom:'auto',margin:'0',transform:'none',opacity:'1',visibility:'visible',maxWidth:'none',maxHeight:'none'});
    copy.inert=true;copy.setAttribute('aria-hidden','true');return copy;
  }
  function collect(){
    const found=new Map();
    function add(selector,type){for(const el of document.querySelectorAll(selector)){
      const r=bounds(el),cs=getComputedStyle(el);
      if(found.has(el)||r.w<4||(r.h<2&&type!=='line')||cs.visibility==='hidden'||cs.display==='none'||el.closest('.float-panel-closed'))continue;
      found.set(el,{el,type,state:'pending',inert:el.inert,aria:el.getAttribute('aria-hidden'),r});
    }}
    add('#banner-wrapper, #navbar .card-base, #sidebar .card-base, #post-container, #swup-container .card-base','box');
    add('#navbar .card-base > a, #navbar .hidden.md\\:flex > a, #navbar .card-base > .flex','media');
    add('#sidebar img, #banner img','image');
    add('#sidebar .font-bold, #sidebar .text-neutral-400, #sidebar .btn-regular, #categories a, #tags a','text');
    add('#post-container > .onload-animation:not(.custom-md):not(.license-container), #post-cover','media');
    const title=document.querySelector('[data-pagefind-meta="title"]');
    if(title){found.delete(title.parentElement);found.set(title,{el:title,type:'text',state:'pending',inert:title.inert,aria:title.getAttribute('aria-hidden'),r:bounds(title)});}
    add('.custom-md h1, .custom-md h2, .custom-md h3, .custom-md h4, .custom-md p, .custom-md li','text');
    add('.custom-md .expressive-code, .custom-md .admonition, .custom-md .github-card, .custom-md table, .license-container','media');
    add('.custom-md img','image');add('.custom-md hr','line');add('#toc-inner-wrapper, .post-card','media');
    const list=[...found.values()];
    tasks=list.filter(t=>!list.some(p=>p!==t&&p.type!=='box'&&p.el.contains(t.el)));
    tasks.forEach((t,i)=>{
      t.id=i;t.parents=tasks.filter(p=>p!==t&&p.el.contains(t.el));t.r=bounds(t.el);
      t.font=parseFloat(getComputedStyle(t.el).fontSize)||16;
      if(t.type!=='box')t.template=snapshot(t.el);
      if(t.type==='text'){
        t.glyphs=[];let weight=0;const walker=document.createTreeWalker(t.el,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentElement.closest('svg,script,style,.anchor')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT});let node;
        while((node=walker.nextNode())){
          let index=0;
          for(const {segment} of segmenter.segment(node.nodeValue)){
            const range=document.createRange();range.setStart(node,index);index+=segment.length;range.setEnd(node,index);const r=range.getBoundingClientRect();
            weight+=random(.7,1.3)*(/[，。！？；、,.!?;:\n]/.test(segment)?3.5:1);
            if(r.height)t.glyphs.push({x:r.right-t.r.x,y:r.top-t.r.y,b:r.bottom-t.r.y,weight});
          }
        }
        t.weight=weight;t.text=t.el.textContent.trim();
      }
    });
    // A completed sibling is the source of a genuine copy operation.
    const groups=new Map();
    for(const t of tasks.filter(t=>['text','media','image'].includes(t.type))){
      if(t.type==='text'&&(t.text.length>90||t.font>=28))continue;
      const key=t.el.parentElement;const siblings=groups.get(key)||[];
      const master=siblings.find(m=>m.type===t.type&&m.el.tagName===t.el.tagName&&m.el.className===t.el.className&&t.r.w/m.r.w>.55&&t.r.w/m.r.w<1.8&&t.r.h/m.r.h>.6&&t.r.h/m.r.h<1.6);
      if(master){t.master=master;t.parents.push(master);}else siblings.push(t);
      groups.set(key,siblings);
    }
    // Align a few text blocks per vertical band to a shared guide.
    const bands=new Map();
    for(const t of tasks.filter(t=>t.type==='text'&&!t.master)){
      const key=`${Math.round(t.r.x/4)}:${Math.floor((t.r.y+scrollY)/850)}`;
      const list=bands.get(key)||[];list.push(t);bands.set(key,list);
    }
    for(const group of bands.values()){
      if(group.length<2)continue;
      const members=group.sort((a,b)=>b.font-a.font).slice(0,2),ref=members[0];
      const g={axis:'x',type:'guide',id:tasks.length+guides.length,state:'pending',ref,members,parents:ref.parents.filter(p=>p.type==='box'),r:{...ref.r},position:ref.r.x,alpha:0};
      guides.push(g);members.forEach(t=>t.guide=g);
    }
    const rows=new Map();
    for(const t of tasks.filter(t=>['text','media'].includes(t.type)&&t.r.h<100)){
      const key=Math.round(t.r.y/3);const row=rows.get(key)||[];row.push(t);rows.set(key,row);
    }
    for(const members of rows.values()){
      if(members.length<3)continue;
      const ref=members[0],g={axis:'y',type:'guide',id:tasks.length+guides.length,state:'pending',ref,members,parents:ref.parents.filter(p=>p.type==='box'),r:{...ref.r},position:ref.r.y,alpha:0};
      guides.push(g);members.forEach(t=>t.rowGuide=g);
    }
    tasks.push(...guides);tasks.sort((a,b)=>a.r.y-b.r.y);
    for(const t of tasks)if(t.el){t.el.classList.add('swarm-pending');t.el.inert=true;t.el.setAttribute('aria-hidden','true');}
    stats={completed:{},phases:{},peak:0,peakWorking:0,frames:0,slowFrames:0,dragError:0};
  }
  function createStage(){
    layer=document.createElement('div');layer.className='swarm-layer';layer.setAttribute('aria-hidden','true');
    layer.innerHTML='<div class="swarm-ruler-x"></div><div class="swarm-ruler-y"></div>';document.body.append(layer);
    for(const axis of ['x','y'])for(let n=100;n<(axis==='x'?innerWidth:innerHeight);n+=100){
      const label=document.createElement('span');label.className='swarm-ruler-label';label.textContent=String(n);label.style[axis==='x'?'left':'top']=`${n+2}px`;layer.querySelector(`.swarm-ruler-${axis}`).append(label);
    }
    for(const g of guides){g.line=document.createElement('div');g.line.className=`swarm-alignment${g.axis==='y'?' horizontal':''}`;layer.append(g.line);}
    for(let i=0;i<limits().intro;i++)spawn(true);
  }
  function spawn(intro=false){
    const id=nextId++,color=colors[id%colors.length],cursor=document.createElement('div');cursor.className='swarm-cursor';cursor.style.setProperty('--cursor-color',color);
    cursor.innerHTML=`<svg viewBox="-12 -12 36 44"><g class="swarm-arrow"><path d="M0 0 L19 16 L10 18 L7 27 Z" fill="${color}" stroke="white" stroke-width="1.7" stroke-linejoin="round"/></g><g class="swarm-cross" stroke="${color}" stroke-width="1.6"><path d="M-10 0H10M0-10V10"/></g><g class="swarm-ibeam" stroke="${color}" stroke-width="1.8"><path d="M0-8V8M-4-8H4M-4 8H4"/></g><g class="swarm-copy-icon" stroke="white" stroke-width="1.2" fill="${color}"><path d="M13 17h10v11H13zM17 21h10v11H17z"/></g><path class="swarm-pen" d="M0 0L6 17L14 14L17 6Z M0 0L10 10" fill="${color}" stroke="white" stroke-width="1.4"/><path class="swarm-resize" d="M-10 0H10M-6-4L-10 0L-6 4M6-4L10 0L6 4" fill="none" stroke="${color}" stroke-width="2"/></svg><span class="swarm-cursor-label">${names[id%names.length]}</span>`;
    const frame=document.createElement('div');frame.className='swarm-frame';frame.style.setProperty('--cursor-color',color);frame.innerHTML='<i></i><i></i><i></i><i></i><span class="swarm-measure"></span>';
    const caret=document.createElement('div');caret.className='swarm-caret';caret.style.background=color;
    const measure=document.createElement('div');measure.className='swarm-distance';measure.innerHTML='<span></span>';
    layer.append(frame,caret,measure,cursor);
    const a={id,color,cursor,frame,caret,measure,x:id%2?-40:innerWidth+40,y:random(60,innerHeight*.8),vx:0,vy:0,angle:0,orbit:random(65,165),spin:random(.65,1.35),force:random(3.5,6),maxSpeed:random(420,900),task:null,actions:[],phase:'intro',idle:0,home:agents.length<limits().min,opacity:1};
    if(!intro){a.phase='idle';a.opacity=0;}
    agents.push(a);peak=Math.max(peak,agents.length);stats.peak=peak;return a;
  }
  function tool(a,name){a.cursor.dataset.tool=name;a.cursor.classList.toggle('is-idle',!a.task);}
  function renderCursor(a){
    a.cursor.style.transform=`translate3d(${a.x}px,${a.y}px,0)`;
    a.cursor.querySelector('svg').style.transform=`rotate(${a.angle}deg)`;
    a.cursor.style.opacity=String(a.opacity);
  }
  function pulse(a){
    const ring=document.createElement('div');ring.className='swarm-click';ring.style.cssText=`left:${a.x}px;top:${a.y}px;border-color:${a.color}`;layer.append(ring);
    ring.animate([{transform:'translate(-50%,-50%) scale(.4)',opacity:.8},{transform:'translate(-50%,-50%) scale(1.6)',opacity:0}],{duration:260}).onfinish=()=>ring.remove();tone('click',a.x);
  }
  function frame(a,r,label,opacity=1){
    Object.assign(a.frame.style,{left:`${r.x}px`,top:`${r.y}px`,width:`${Math.max(0,r.w)}px`,height:`${Math.max(0,r.h)}px`,opacity:String(opacity)});
    a.frame.querySelector('span').textContent=label??`${Math.round(r.w)} × ${Math.round(r.h)}`;
  }
  function ghost(t,source=t){
    t.ghost?.remove();const node=document.createElement('div');node.className='swarm-object';node.inert=true;
    node.append(source.template.cloneNode(true));layer.prepend(node);t.ghost=node;t.offset={x:0,y:0,scale:1};return node;
  }
  function place(t,dx=0,dy=0,scale=1){
    t.offset={x:dx,y:dy,scale};const r=t.r;
    Object.assign(t.ghost.style,{left:`${r.x}px`,top:`${r.y}px`,width:`${r.w}px`,height:`${r.h}px`,transform:`translate(${dx}px,${dy}px) scale(${scale})`});
    const child=t.ghost.firstElementChild;child.style.width=`${r.w}px`;child.style.height=`${r.h}px`;
    return {x:r.x+dx,y:r.y+dy,w:r.w*scale,h:r.h*scale};
  }
  const action=(name,duration,update,enter,exit)=>({name,duration,update,enter,exit});
  function move(a,target,{name='travel',duration,shape='arrow',bend=.1,onMove}={}){
    let start,arc;
    return action(name,duration||400,p=>{
      const end=target(),q=name==='travel'?out(p):smooth(p);a.x=lerp(start.x,end.x,q)+Math.sin(Math.PI*q)*arc;a.y=lerp(start.y,end.y,q)-Math.sin(Math.PI*q)*arc*.6;onMove?.(q);
    },step=>{start={x:a.x,y:a.y};const end=target(),d=Math.hypot(end.x-a.x,end.y-a.y);if(!duration)step.duration=clamp(180+Math.sqrt(d)*17,180,850);arc=bend*Math.min(d,500)*(a.id%2?1:-1);tool(a,shape);});
  }
  function clickAction(a,name='select'){return action(name,130,()=>{},()=>pulse(a));}
  function glyphAt(t,p){let glyph;for(const g of t.glyphs){if(g.weight>p*t.weight)break;glyph=g;}return glyph;}
  function typeAction(a,t,{scale=1,dx=0,dy=0}={}){
    let lastGlyph;
    return action('type',clamp((t.glyphs?.length||0)*23,450,3300),p=>{
      const b=place(t,dx,dy,scale),g=glyphAt(t,p),child=t.ghost.firstElementChild;
      child.style.clipPath=!g?'inset(0 100% 100% 0)':p===1?'none':`polygon(0 0,100% 0,100% ${g.y}px,${g.x}px ${g.y}px,${g.x}px ${g.b+2}px,0 ${g.b+2}px)`;
      const x=b.x+(g?.x||0)*scale,y=b.y+(g?.y||0)*scale;
      Object.assign(a.caret.style,{left:`${x}px`,top:`${y}px`,height:`${((g?.b||t.font)-(g?.y||0))*scale}px`,opacity:String(Math.floor(elapsed/350)%2?.35:1)});
      // The mouse rests beside the text box; the insertion caret follows typing.
      a.x=b.x+Math.min(b.w,90)+20;a.y=b.y+Math.min(28,b.h)+18;
      frame(a,b,'',.3);
      if(g!==lastGlyph){tone('key',x);lastGlyph=g;}
    },()=>{tool(a,'ibeam');if(!t.ghost)ghost(t);t.ghost.firstElementChild.style.clipPath='inset(0 100% 100% 0)';},()=>{a.caret.style.opacity='0';t.ghost.firstElementChild.style.clipPath='none';});
  }
  function textActions(a,t){
    const scale=t.font>=28?Math.min(1,18/t.font):1,dx=t.guide?random(28,48):0,dy=t.guide?random(-6,6):0;
    const list=[move(a,()=>({x:t.r.x+dx,y:t.r.y+dy}),{shape:'cross'}),clickAction(a,'text-box')];
    list.push(action('text-box',450,p=>{
      const r={x:t.r.x+dx,y:t.r.y+dy,w:t.r.w*scale*smooth(p),h:Math.min(t.r.h,t.font*1.5)*scale*smooth(p)};
      frame(a,r);a.x=r.x+r.w;a.y=r.y+r.h;
    },()=>tool(a,'cross')));
    list.push(typeAction(a,t,{scale,dx,dy}));
    if(scale<1)list.push(action('grow',580,p=>{
      const sizes=[18,24,32,40,48,56,64,72,88,104,t.font].filter(n=>n<=t.font),s=sizes[Math.min(sizes.length-1,Math.floor(p*sizes.length))]/t.font;
      const r=place(t,dx,dy,s);frame(a,r,`${Math.round(t.font*s)} px`);a.x=r.x+r.w+12;a.y=r.y+18;
    },()=>tool(a,'arrow'),()=>tone('place',a.x)));
    if(t.guide){
      list.push(move(a,()=>({x:t.r.x+dx+Math.min(60,t.r.w/2),y:t.r.y+dy+16}),{name:'select-text',duration:240}),clickAction(a));
      list.push(action('snap',650,p=>{
        let x=dx*(1-smooth(p)),y=dy*(1-smooth(p));if(x<8){x=0;y=0;t.guide.flash=1;}
        const r=place(t,x,y);frame(a,r);a.x=r.x+Math.min(60,r.w/2);a.y=r.y+16;
      },()=>tool(a,'arrow'),()=>{place(t);tone('place',a.x);}));
    }
    list.push(action('settle',180,()=>frame(a,place(t),'',.65)));return list;
  }
  function boxActions(a,t){
    const end=()=>({x:Math.min(t.r.x+t.r.w,innerWidth-22),y:Math.max(t.r.y+Math.min(40,t.r.h),Math.min(t.r.y+t.r.h,innerHeight-90))});
    let endRect;
    return [move(a,()=>({x:t.r.x,y:t.r.y}),{shape:'cross'}),clickAction(a,'press'),action('draw',750,p=>{
      const e=end(),q=smooth(p),r={x:t.r.x,y:t.r.y,w:Math.max(0,(e.x-t.r.x)*q),h:Math.max(0,(e.y-t.r.y)*q)};
      a.x=r.x+r.w;a.y=r.y+r.h;frame(a,r);endRect=r;
      stats.dragError=Math.max(stats.dragError,Math.abs(a.x-r.x-r.w),Math.abs(a.y-r.y-r.h));
    },()=>{tool(a,'cross');a.frame.classList.add('is-placeholder');}),action('extend',220,p=>{
      const r={...t.r,w:lerp(endRect.w,t.r.w,out(p)),h:lerp(endRect.h,t.r.h,out(p))};frame(a,r);
    },()=>{tool(a,'arrow');pulse(a);}),action('fill',320,p=>{
      frame(a,t.r,undefined,1-p);
      if(t.type==='box'){
        if(p>.3)restore(t);
      }else{
        if(!t.ghost)ghost(t);place(t);t.ghost.style.clipPath=`inset(0 0 ${(1-out(p))*100}% 0)`;
      }
    },()=>tone('place',a.x),()=>a.frame.classList.remove('is-placeholder'))];
  }
  function spacing(a,src,dst){
    const vertical=Math.abs(dst.y-src.y)>Math.abs(dst.x-src.x),gap=vertical?dst.y-src.y-src.h:dst.x-src.x-src.w;
    if(gap<=0){a.measure.style.opacity='0';return;}
    const x=vertical?dst.x+Math.min(30,dst.w/2):src.x+src.w,y=vertical?src.y+src.h:dst.y+Math.min(20,dst.h/2);
    Object.assign(a.measure.style,{left:`${x}px`,top:`${y}px`,width:vertical?'0px':`${gap}px`,height:vertical?`${gap}px`:'0px',opacity:'1'});
    a.measure.classList.toggle('vertical',vertical);a.measure.firstElementChild.textContent=`${Math.round(gap)} px`;
  }
  function duplicateActions(a,t){
    const m=t.master;
    const list=[move(a,()=>({x:m.r.x+Math.min(50,m.r.w/2),y:m.r.y+Math.min(20,m.r.h/2)})),action('select-master',220,()=>frame(a,m.r),()=>pulse(a)),action('duplicate',850,p=>{
      const q=smooth(p),dx=(m.r.x-t.r.x)*(1-q),dy=(m.r.y-t.r.y)*(1-q),r=place(t,dx,dy);
      a.x=r.x+Math.min(50,r.w/2);a.y=r.y+Math.min(20,r.h/2);frame(a,r,'⌥ 复制');spacing(a,m.r,r);if(q>.9&&t.rowGuide)t.rowGuide.flash=1;
    },()=>{tool(a,'copy');ghost(t,m);a.frame.classList.add('is-copy');},()=>{a.measure.style.opacity='0';a.frame.classList.remove('is-copy');tone('place',a.x);}),action('settle-copy',180,()=>frame(a,place(t)),()=>tool(a,'arrow'))];
    if(t.type==='text'&&t.text!==m.text){
      list.push(clickAction(a,'edit-copy'),action('select-all',240,()=>{place(t);t.ghost.classList.add('is-selected');},null,()=>{ghost(t);t.ghost.classList.remove('is-selected');}));
      list.push(typeAction(a,t));
    }else list.push(action(t.type==='image'?'swap-image':'restyle',280,p=>{place(t);t.ghost.style.opacity=String(p);},()=>{ghost(t);pulse(a);}));
    list.push(action('settle',180,()=>frame(a,place(t),'',.6)));return list;
  }
  function lineActions(a,t){
    return [move(a,()=>({x:t.r.x,y:t.r.y+t.r.h/2}),{shape:'pen'}),clickAction(a,'anchor'),action('line',600,p=>{
      const x=t.r.x+t.r.w*smooth(p),y=t.r.y+t.r.h/2;frame(a,{x:t.r.x,y,w:x-t.r.x,h:0},'');a.x=x;a.y=y;
    },()=>tool(a,'pen')),clickAction(a,'anchor')];
  }
  function guideActions(a,t){
    const vertical=t.axis==='x';
    const from=()=>vertical?{x:10,y:clamp(t.ref.r.y+35,60,innerHeight-100)}:{x:clamp(t.ref.r.x+40,60,innerWidth-60),y:10};
    return [move(a,from),clickAction(a,'ruler'),action('guide',700,p=>{
      const origin=from();t.position=lerp(10,vertical?t.ref.r.x:t.ref.r.y,smooth(p));t.alpha=1;
      a.x=vertical?t.position:origin.x;a.y=vertical?origin.y:t.position;
    },()=>tool(a,vertical?'resize':'resize-y')),action('guide-release',120,()=>{},()=>{tone('place',a.x);t.position=vertical?t.ref.r.x:t.ref.r.y;})];
  }
  function assign(a,t){
    t.state='running';a.task=t;a.phase='travel';a.idle=0;a.age=0;a.actionStarted=false;a.angle=0;
    a.actions=t.type==='guide'?guideActions(a,t):t.master?duplicateActions(a,t):t.type==='text'?textActions(a,t):t.type==='line'?lineActions(a,t):boxActions(a,t);
  }
  function runActions(a,dt){
    const step=a.actions[0];
    if(!step){complete(a.task);a.task=null;a.phase='idle';a.frame.style.opacity='0';a.caret.style.opacity='0';a.measure.style.opacity='0';a.actions=[];return;}
    if(!a.actionStarted){a.actionStarted=true;a.age=0;a.phase=step.name;stats.phases[step.name]=(stats.phases[step.name]||0)+1;step.enter?.(step);}
    a.age+=dt;const p=clamp(a.age/step.duration);step.update?.(p);
    if(p>=1){step.exit?.();a.actions.shift();a.actionStarted=false;}
  }

  // Inertial orbit, neighbor alignment and separation keep idle agents in motion.
  function flock(a,list,dt,target,compact=false){
    const seconds=dt/1000,dx=a.x-target.x,dy=a.y-target.y,d=Math.hypot(dx,dy)||1;
    const radius=(compact?a.orbit*.7:a.orbit)*(1+.14*Math.sin(elapsed/900+a.id));
    const turn=Math.sin(elapsed/13000)>-.3?1:-1;
    let wantX=-dy/d*180*a.spin*turn-dx/d*(d-radius)*2.7,wantY=dx/d*180*a.spin*turn-dy/d*(d-radius)*2.7;
    let nx=0,ny=0,n=0;
    for(const other of list){if(other===a)continue;const sx=a.x-other.x,sy=a.y-other.y,dist=Math.hypot(sx,sy)||1;
      if(dist<85){nx+=other.vx;ny+=other.vy;n++;}
      if(dist<28){wantX+=sx/dist*(28-dist)*19;wantY+=sy/dist*(28-dist)*19;}
    }
    if(n){wantX=wantX*.85+nx/n*.15;wantY=wantY*.85+ny/n*.15;}
    if(mouse.seen){const mx=a.x-mouse.x,my=a.y-mouse.y,md=Math.hypot(mx,my)||1;if(md<65){wantX+=mx/md*(65-md)*22;wantY+=my/md*(65-md)*22;}}
    const max=a.maxSpeed*(d>300?1.8:1),length=Math.hypot(wantX,wantY);if(length>max){wantX*=max/length;wantY*=max/length;}
    const blend=1-Math.exp(-seconds*a.force);a.vx=lerp(a.vx,wantX,blend);a.vy=lerp(a.vy,wantY,blend);a.x+=a.vx*seconds;a.y+=a.vy*seconds;
    const desired=Math.atan2(a.vy,a.vx)*180/Math.PI+125,diff=((desired-a.angle+540)%360)-180;
    a.angle+=diff*(1-Math.exp(-seconds*5));tool(a,'arrow');
  }
  function updateRects(){for(const t of tasks){if(t.el)t.r=bounds(t.el);else t.r={...t.ref.r};}}
  function eligible(){return tasks.filter(t=>t.state==='pending'&&t.parents.every(p=>p.state==='done')&&t.r.y<innerHeight-80);}
  function pick(a,ready){
    return ready.reduce((best,t)=>{
      const off=t.r.y+t.r.h<0?innerHeight*3:0;
      const score=off+Math.max(0,t.r.y)*.35+Math.hypot(a.x-t.r.x,(a.y-t.r.y)*.7)-(t.type==='guide'?500:0);
      return !best||score<best.score?{task:t,score}:best;
    },null)?.task;
  }
  function labels(){
    const occupied=[];
    for(const a of agents){
      const label=a.cursor.querySelector('.swarm-cursor-label');
      let show=a.task||mode==='intro'||mode==='finale';
      const x=a.x+14,y=a.y+22,w=names[a.id%names.length].length*6+16;
      if(occupied.some(r=>x<r.x+r.w&&x+w>r.x&&y<r.y+20&&y+20>r.y))show=false;
      label.style.opacity=show?'1':'0';if(show)occupied.push({x,y,w});
      label.style.left=x+w>innerWidth-8?`${-w-10}px`:'14px';label.style.top=y+20>innerHeight-80?'-26px':'22px';
    }
  }
  function beginFinale(){
    mode='finale';finaleAt=elapsed;tour=false;dock.classList.add('is-finale');caption.textContent='搭建完成 · 移动鼠标试试';dock.querySelector('[data-action=skip]').textContent='开始阅读';
    dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');announce('页面已搭建完成。光标会短暂跟随鼠标，点击开始阅读可立即收起。');
    for(const a of agents){a.frame.style.opacity='0';a.caret.style.opacity='0';a.phase='finale';}
  }
  function tick(now){
    if(!active)return;
    try{
      const raw=now-last;last=now;if(document.hidden){raf=requestAnimationFrame(tick);return;}
      const dt=Math.min(50,raw);elapsed+=dt;stats.frames++;if(raw>34)stats.slowFrames++;
      scrollVelocity=lerp(scrollVelocity,Math.abs(scrollY-lastScroll)*1000/Math.max(dt,1),.15);lastScroll=scrollY;
      updateRects();
      if(mode==='intro'){
        const target={x:innerWidth/2,y:Math.min(innerHeight*.4,280)};
        for(const a of agents){flock(a,agents,dt,target);renderCursor(a);}
        if(elapsed>1550){mode='work';agents.forEach(a=>{a.angle=0;a.phase='idle';});}
      }else if(mode==='work'){
        const ready=eligible(),lim=limits(),want=clamp(lim.min+Math.ceil(ready.length*.9)+Math.floor(scrollVelocity/100),lim.min,lim.max);
        if(agents.length<want&&ready.length&&elapsed>nextSpawn){spawn();nextSpawn=elapsed+45;}
        stats.peakWorking=Math.max(stats.peakWorking,agents.length);
        const tempo=speed*clamp(1+scrollVelocity/1800+ready.length/60,1,2.4);
        const idleAgents=agents.filter(a=>!a.task);
        for(const a of [...agents]){
          if(a.phase!=='leave')a.opacity=Math.min(1,a.opacity+dt/220);
          if(!a.task&&a.phase!=='leave'){const t=pick(a,ready);if(t){ready.splice(ready.indexOf(t),1);assign(a,t);}}
          if(a.task){runActions(a,dt*tempo);a.angle*=Math.exp(-dt/80);}
          else{
            a.idle+=dt;a.phase='idle';
            if(!a.home&&a.idle>2600&&agents.length>want){
              a.phase='leave';const side=a.x>innerWidth/2?innerWidth+70:-70;a.x=lerp(a.x,side,1-Math.exp(-dt/250));a.opacity=Math.max(0,a.opacity-dt/650);
              if(a.opacity<=.01){a.cursor.remove();a.frame.remove();a.caret.remove();a.measure.remove();agents.splice(agents.indexOf(a),1);continue;}
            }else flock(a,idleAgents,dt,{x:innerWidth*(.5+.25*Math.sin(elapsed/4700)),y:Math.min(innerHeight*.35,240)},true);
          }
          renderCursor(a);
        }
        const busy=agents.some(a=>a.task);progress.value=tasks.length?Math.round(done/tasks.length*100):100;
        caption.textContent=busy?`${agents.length} 个光标协作中`:'向下滚动，继续搭建';
        if(tour&&!busy){const next=tasks.find(t=>t.state==='pending');if(next)window.scrollBy(0,clamp(next.r.y-innerHeight*.5,0,dt*.38));}
        if(done===tasks.length)beginFinale();
      }else{
        const target=mouse.seen?mouse:{x:innerWidth*(.5+.25*Math.sin(elapsed/1600)),y:innerHeight*(.45+.17*Math.cos(elapsed/2100))};
        if(mode==='finale'&&agents.length<limits().finale&&elapsed>nextSpawn){spawn();nextSpawn=elapsed+60;}
        if(elapsed-finaleAt>9500)mode='exit';
        for(const a of agents){
          if(mode==='exit'){a.phase='leave';a.x=lerp(a.x,a.id%2?innerWidth+100:-100,1-Math.exp(-dt/350));a.opacity=Math.max(0,a.opacity-dt/1000);}
          else{a.phase='finale';flock(a,agents,dt,target);a.opacity=Math.min(1,a.opacity+dt/200);}
          renderCursor(a);
        }
        if(mode==='exit'&&agents.every(a=>a.opacity===0)){finish();return;}
      }
      for(const g of guides){
        if(g.state==='done')g.position=g.axis==='x'?g.ref.r.x:g.ref.r.y;
        if(g.members.every(t=>t.state==='done'))g.alpha=Math.max(0,g.alpha-dt/500);
        g.flash=Math.max(0,(g.flash||0)-dt/250);
        Object.assign(g.line.style,{[g.axis==='x'?'left':'top']:`${g.position}px`,opacity:String(g.alpha*(g.flash?1:.65)),boxShadow:g.flash?'0 0 6px #f24822':'none'});
      }
      labels();raf=requestAnimationFrame(tick);
    }catch(error){console.error('Cursor animation stopped safely:',error);finish('已显示完整页面。');}
  }
  async function start({replay=false}={}){
    if(active||launching)finish();if(reduced.matches){announce('已遵循减少动态效果设置，显示完整页面。');return;}
    launching=true;const id=++generation;if(replay)window.scrollTo({top:0,behavior:'instant'});
    await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1200))]);if(id!==generation)return;
    document.documentElement.classList.add('swarm-mode','swarm-initialized');
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));if(id!==generation)return;
    try{
      done=0;agents=[];guides=[];elapsed=0;nextSpawn=0;nextId=0;peak=0;scrollVelocity=0;lastScroll=scrollY;collect();
      if(!tasks.length){finish();return;}
      createStage();active=true;launching=false;mode='intro';last=performance.now();dock.classList.remove('is-idle');progress.value=0;caption.textContent='光标正在集结';
      announce('页面搭建动画已开始。可以跳过，或向下滚动继续搭建。');raf=requestAnimationFrame(tick);timer=setTimeout(()=>finish('已显示完整页面。'),240000);
    }catch(error){console.error('Cursor animation unavailable:',error);finish('已显示完整页面。');}
  }
  dock.addEventListener('click',event=>{
    const name=event.target.closest('button')?.dataset.action;
    if(name==='skip')finish('已显示完整页面。');
    if(name==='replay')start({replay:true});
    if(name==='speed'){speed=speed%3+1;const btn=dock.querySelector('[data-action=speed]');btn.textContent=`${speed}×`;btn.setAttribute('aria-label',`动画速度，当前 ${speed} 倍`);}
    if(name==='tour'){tour=!tour;dock.querySelector('[data-action=tour]').setAttribute('aria-pressed',String(tour));}
    if(name==='sound'){
      sound=!sound;if(sound){audio??=new AudioContext();audio.resume().catch(()=>{});}const btn=dock.querySelector('[data-action=sound]');btn.setAttribute('aria-pressed',String(sound));btn.setAttribute('aria-label',sound?'关闭动画音效':'打开动画音效');btn.textContent=sound?'静音':'音效';
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(active||launching))finish('已退出动画。');});
  window.addEventListener('resize',()=>{if(active||launching)finish('窗口尺寸已改变，显示完整页面。');});
  window.addEventListener('pagehide',()=>finish());reduced.addEventListener('change',()=>{if(reduced.matches)finish('已遵循减少动态效果设置。');});
  window.addEventListener('pointermove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;mouse.seen=true;},{passive:true});
  function stopTour(){tour=false;dock.querySelector('[data-action=tour]').setAttribute('aria-pressed','false');}
  window.addEventListener('wheel',stopTour,{passive:true});window.addEventListener('touchstart',e=>{if(!dock.contains(e.target))stopTour();},{passive:true});
  function bindSwup(){if(hookBound||!window.swup?.hooks)return;hookBound=true;window.swup.hooks.on('visit:start',()=>finish());window.swup.hooks.on('page:view',()=>dock.classList.add('is-idle'));}
  document.addEventListener('swup:enable',bindSwup);bindSwup();
  window.blogSwarm={start,stop:finish,get state(){return {version:3,active,mode,pending:tasks.filter(t=>t.state==='pending').length,done,total:tasks.length,speed,tour,cursors:agents.length,stats,workers:agents.map(a=>({phase:a.phase,type:a.task?.type,x:a.x,y:a.y})),taskTypes:tasks.reduce((m,t)=>(m[t.master?'duplicate':t.type]=(m[t.master?'duplicate':t.type]||0)+1,m),{})};}};
  const boot=()=>{bindSwup();if(!location.hash&&!reduced.matches)start();};
  if(document.readyState==='complete')setTimeout(boot,350);else window.addEventListener('load',()=>setTimeout(boot,350),{once:true});
})();
