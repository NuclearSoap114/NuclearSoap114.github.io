import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import crypto from 'node:crypto';
import {load} from 'cheerio';
import {build} from 'esbuild';
import {renderHome,renderHomePanel,applyChirpyPickOverrides} from './home.mjs';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'../..');
const source=path.join(root,'experiments/fuwari');
const rendered=path.join(source,'dist');
const out=path.join(root,'dist/chirpy');
const base='/chirpy';
const requireSource=createRequire(path.join(source,'package.json'));
const read=p=>fs.readFileSync(p,'utf8');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function write(route,html){const dest=path.join(out,route,'index.html');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html);}
function prefix(href){return /^\/(?:notes|posts|about|archive)(?:\/|\?|$)/.test(href)||href==='/'?base+href:href;}
// Only the already-audited, publicly rendered notes are imported. Obsidian is never read here.
const home=load(read(path.join(rendered,'index.html')));
const directory=load(read(path.join(rendered,'notes/index.html')));
const avatar=home('.welcome-avatar img').attr('src');
const wallpaper=home('.welcome-art img').attr('src');
const notes=directory('[data-note]').map((i,e)=>({title:directory(e).text().trim(),url:directory(e).attr('href'),topic:directory(e).attr('data-topic'),category:directory(e).attr('data-category'),tags:JSON.parse(directory(e).attr('data-tags')||'[]')})).get();
if(notes.length===0)throw Error('No public notes found');
const topics=directory('[data-filter-topic]').map((i,e)=>({id:directory(e).attr('data-filter-topic'),title:directory(e).attr('data-topic-title')})).get().filter(t=>t.id);
applyChirpyPickOverrides(home,notes);
const picks=home('[data-home-article]').map((i,e)=>({title:home(e).find('h3').text(),url:home(e).attr('href')})).get();
const tags=[...new Set(notes.flatMap(n=>n.tags))];
const gate=home('#blog-welcome').prop('outerHTML')+home('#blog-replay').prop('outerHTML');
// SVG <use> references can point to definitions outside an extracted fragment.
const symbols=new Map();
for(const e of home('symbol').toArray())symbols.set(home(e).attr('id'),home(e).prop('outerHTML'));
function fragment(html,{content=false}={}){
 const $=load(html,null,false);
 $('script,style').remove();
 $('a[href]').each((i,e)=>$(e).attr('href',prefix($(e).attr('href'))));
 $('img').removeAttr('loading').attr('loading','lazy');
 $('[data-astro-cid]').removeAttr('data-astro-cid');
 if(content){
  $('.expressive-code').each((i,e)=>{
   const pre=$(e).find('pre').first();
   const lines=pre.find('.ec-line .code');
   const code=lines.length?lines.map((j,l)=>$(l).html()).get().join('\n'):escape(pre.find('code').text());
   const lang=pre.attr('data-language')||'text';
   $(e).replaceWith(`<div class="chirpy-code"><div class="code-heading"><span>${escape(lang)}</span><button type="button" data-copy-code aria-label="复制代码">复制</button></div><pre><code>${code}</code></pre></div>`);
  });
  $('.note-reading,.about-copy,.markdown-content').addClass('content');
 }
 $('symbol').each((i,e)=>symbols.set($(e).attr('id'),$(e).prop('outerHTML')));
 return $.html();
}
const iconPaths={home:'M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9',notes:'M4 4h16v16H4zM8 8h8M8 12h8M8 16h5',tags:'M3 3h8l10 10-8 8L3 11zM7 7h.01',archive:'M4 4h16v4H4zM5 8v12h14V8M9 12h6',about:'M12 17v-5M12 8h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',menu:'M4 6h16M4 12h16M4 18h16',search:'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',sun:'M12 2v2M12 20v2M2 12h2M20 12h2m-3-7 2-2M3 21l2-2m0-14L3 3m16 16 2 2M17 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0',arrow:'m7 14 5-5 5 5',external:'M14 3h7v7M21 3 10 14M10 3H3v18h18v-7'};
const icon=n=>`<svg class="chirpy-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[n]||iconPaths.notes}"/></svg>`;
function sidebar(active){
 const links=[['home','首页','/'],['notes','笔记','/notes/'],['tags','标签','/tags/'],['archive','归档','/archive/'],['about','关于','/about/']];
 return `<aside aria-label="侧边导航" id="sidebar" class="d-flex flex-column align-items-end"><header class="profile-wrapper"><a href="${base}/" id="avatar" class="rounded-circle"><img src="${avatar}" width="112" height="112" alt="NuclearSoap 的头像"></a><a class="site-title d-block" href="${base}/">NuclearSoap</a><p class="site-subtitle fst-italic mb-0">怕忘，先记下来。</p></header><nav class="flex-column flex-grow-1 w-100 ps-0"><ul class="nav">${links.map(([key,label,url])=>`<li class="nav-item ${key===active?'active':''}"><a href="${base+url}" class="nav-link" data-nav="${key}">${icon(key)}<span>${label}</span></a></li>`).join('')}</ul></nav><div class="sidebar-bottom d-flex flex-wrap align-items-center w-100"><button type="button" id="mode-toggle" class="btn btn-link" aria-label="切换深色模式">${icon('sun')}</button><span class="icon-border"></span><a href="https://github.com/NuclearSoap114" target="_blank" rel="noopener noreferrer" aria-label="GitHub NuclearSoap114">GH</a><a href="https://codeforces.com/profile/NuclearSoap" target="_blank" rel="noopener noreferrer" aria-label="Codeforces NuclearSoap">CF</a><a href="mailto:214864497@qq.com" aria-label="邮箱">@</a></div></aside>`;
}
function rightPanel(toc=''){
 return `<aside aria-label="文章导航" id="panel-wrapper" class="col-xl-3 ps-2 text-muted"><div class="access"><section><h2 class="panel-heading">挑几篇看看</h2><ul class="content list-unstyled ps-0 pb-1 ms-1 mt-2">${picks.map(p=>`<li><a href="${prefix(p.url)}">${escape(p.title)}</a></li>`).join('')}</ul></section><section><h2 class="panel-heading">主题标签</h2><div class="d-flex flex-wrap mt-3 mb-1 me-3">${tags.slice(0,12).map(t=>`<a class="post-tag btn btn-outline-primary" href="${base}/notes/?tag=${encodeURIComponent(t)}">${escape(t)}</a>`).join('')}</div></section></div>${toc}</aside>`;
}
function page({title,content,route,active='notes',toc=''}){
 const url=`https://nuclearsoap114.github.io${base}/${route}`;
 return `<!doctype html><html lang="zh-CN" class="blog-welcome-open"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>${escape(title)} - NuclearSoap</title><meta name="description" content="NuclearSoap 的算法、题解和课程笔记。"><meta name="robots" content="noindex,follow"><link rel="canonical" href="${url}"><link rel="icon" href="${home('link[rel=icon]').first().attr('href')}"><link rel="alternate" type="application/rss+xml" title="NuclearSoap" href="${base}/rss.xml"><script>try{const v=localStorage.getItem('chirpy-theme')||'system';const d=v==='dark'||(v==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.bsTheme=d?'dark':'light';document.documentElement.classList.toggle('dark',d)}catch(e){}</script><link rel="stylesheet" href="${base}/assets/chirpy.css"><link rel="stylesheet" href="${base}/assets/katex/katex.min.css"><link rel="stylesheet" href="${base}/assets/home.css?v=${assetVersion}"><link rel="stylesheet" href="${base}/assets/notebook.css?v=${assetVersion}"><link rel="stylesheet" href="${base}/assets/welcome.css?v=${assetVersion}"><link rel="stylesheet" href="${base}/assets/adapt.css?v=${assetVersion}"><link rel="stylesheet" href="${base}/assets/home-layout.css?v=${assetVersion}"></head><body><a class="skip-link" href="#chirpy-main">跳到正文</a>${sidebar(active)}<div id="main-wrapper" class="d-flex justify-content-center"><div class="container d-flex flex-column px-xxl-5"><header id="topbar-wrapper" class="flex-shrink-0" aria-label="顶栏"><div id="topbar" class="d-flex align-items-center justify-content-between px-lg-3 h-100"><nav id="breadcrumb" aria-label="当前位置"><a href="${base}/">首页</a>${active!=='home'?`<span>${escape(title)}</span>`:''}</nav><button type="button" id="sidebar-trigger" class="btn btn-link" aria-label="展开导航" aria-expanded="false">${icon('menu')}</button><div id="topbar-title">NuclearSoap</div><button type="button" id="search-trigger" class="btn btn-link" aria-label="搜索笔记">${icon('search')}</button><form id="chirpy-search-form" action="${base}/notes/" role="search"><label class="visually-hidden" for="search-input">搜索笔记</label>${icon('search')}<input id="search-input" name="q" type="search" placeholder="搜索笔记…" autocomplete="off"></form></div></header><div id="chirpy-content" data-active="${active}" data-title="${escape(title)}"><div class="row flex-grow-1"><main id="chirpy-main" aria-label="正文" class="col-12 col-lg-11 col-xl-9 px-md-4">${content}</main>${active==='home'?renderHomePanel({notes,topics,tags,base,escape}):rightPanel(toc)}</div><div class="row"><div id="tail-wrapper" class="col-12 col-lg-11 col-xl-9 px-md-4"><footer aria-label="网站信息" class="d-flex flex-column justify-content-center text-muted flex-lg-row justify-content-lg-between align-items-lg-center pb-lg-3"><p>© 2026 <a href="https://github.com/NuclearSoap114">NuclearSoap</a></p><p>主题 <a href="https://github.com/cotes2020/jekyll-theme-chirpy" target="_blank" rel="noopener noreferrer">Chirpy</a> · <a href="${base}/rss.xml">RSS</a></p></footer></div></div></div></div><aside aria-label="回到顶部"><button id="back-to-top" type="button" class="btn btn-lg btn-box-shadow" aria-label="回到顶部">${icon('arrow')}</button></aside></div><button id="mask" class="d-none position-fixed w-100 h-100 z-1" aria-label="关闭导航"></button>${fragment(gate)}<svg class="chirpy-symbols" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><defs>${[...symbols.values()].join('')}</defs></svg><noscript><style>.blog-welcome,#blog-replay{display:none!important}html.blog-welcome-open{overflow:auto!important}</style></noscript><script src="${base}/assets/site.js?v=${assetVersion}" defer></script><script src="/swarm-loader.js?v=8" defer></script></body></html>`;
}
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(path.join(out,'assets'),{recursive:true});
fs.cpSync(path.join(here,'vendor/chirpy.css'),path.join(out,'assets/chirpy.css'));
fs.cpSync(path.join(here,'vendor/LICENSE'),path.join(out,'assets/CHIRPY-LICENSE'));
for(const file of ['home','notebook','welcome'])fs.cpSync(path.join(source,`src/styles/${file}.css`),path.join(out,`assets/${file}.css`));
const katex=path.dirname(requireSource.resolve('katex'));
fs.cpSync(path.join(katex,'katex.min.css'),path.join(out,'assets/katex/katex.min.css'));
fs.cpSync(path.join(katex,'fonts'),path.join(out,'assets/katex/fonts'),{recursive:true});
const css=read(path.join(here,'assets/adapt.css')).replaceAll('__WALLPAPER__',wallpaper);
fs.writeFileSync(path.join(out,'assets/adapt.css'),css);
const homeCSS=read(path.join(here,'assets/home-layout.css'));
fs.writeFileSync(path.join(out,'assets/home-layout.css'),homeCSS);
const assetVersion=crypto.createHash('sha256').update(css+homeCSS+read(path.join(here,'assets/site.js'))+['home','notebook','welcome'].map(name=>read(path.join(source,`src/styles/${name}.css`))).join('')+read(path.join(source,'src/scripts/notebook.ts'))).digest('hex').slice(0,10);
await build({entryPoints:[path.join(here,'assets/site.js')],bundle:true,format:'iife',target:'es2020',outfile:path.join(out,'assets/site.js'),minify:true});
// Shared homepage, directory and contact information: no duplicated personal data.
write('',page({title:'NuclearSoap 的笔记本',active:'home',route:'',content:renderHome({home,notes,topics,wallpaper,fragment,escape,base,icon})}));
write('notes',page({title:'笔记',route:'notes/',content:fragment(directory('note-directory').prop('outerHTML'))}));
const about=load(read(path.join(rendered,'about/index.html')));
write('about',page({title:'关于',active:'about',route:'about/',content:fragment(about('article.notebook').prop('outerHTML'),{content:true})}));
const searchable=[];
for(const n of notes){
 const route=decodeURIComponent(n.url).replace(/^\//,'').replace(/\/$/,'');
 const $=load(read(path.join(rendered,route,'index.html')));
 const body=fragment($('.notebook').first().prop('outerHTML'),{content:true});
 const headings=$('.note-reading h2[id],.note-reading h3[id]').map((i,e)=>({id:$(e).attr('id'),title:$(e).clone().find('.anchor').remove().end().text().trim(),level:e.tagName})).get();
 const toc=headings.length?`<nav class="chirpy-toc" aria-label="文章目录"><h2 class="panel-heading">目录</h2><ol>${headings.map(h=>`<li class="${h.level}"><a href="#${escape(h.id)}">${escape(h.title)}</a></li>`).join('')}</ol></nav>`:'';
 write(route,page({title:n.title,route:route+'/',content:body,toc}));
 searchable.push({...n,url:prefix(n.url),text:$('.note-reading').text().replace(/\s+/g,' ').slice(0,160000)});
}
const setup=load(read(path.join(rendered,'posts/markdown-extended/index.html')));
const setupContent=setup('.markdown-content').prop('outerHTML');
write('posts/markdown-extended',page({title:'博客搭建笔记',active:'archive',route:'posts/markdown-extended/',content:`<article class="notebook notebook-card"><h1>博客搭建笔记</h1>${fragment(setupContent,{content:true})}</article>`}));
write('tags',page({title:'标签',active:'tags',route:'tags/',content:`<section class="chirpy-index"><h1>标签</h1><div id="tags" class="d-flex flex-wrap">${tags.map(t=>`<a class="tag" href="${base}/notes/?tag=${encodeURIComponent(t)}">${escape(t)}<span class="text-muted">${notes.filter(n=>n.tags.includes(t)).length}</span></a>`).join('')}</div></section>`}));
write('archive',page({title:'归档',active:'archive',route:'archive/',content:`<section class="chirpy-index"><h1>归档</h1><p class="text-muted">${notes.length} 篇公开笔记，按主题排列。</p>${topics.map(t=>`<section class="archive-topic"><h2>${escape(t.title)}</h2><ul>${notes.filter(n=>n.topic===t.id).map(n=>`<li><a href="${prefix(n.url)}">${escape(n.title)}</a>${n.category?`<small>${escape(n.category)}</small>`:''}</li>`).join('')}</ul></section>`).join('')}<section class="archive-topic"><h2>博客记录</h2><ul><li><a href="${base}/posts/markdown-extended/">博客搭建笔记</a></li></ul></section></section>`}));
fs.writeFileSync(path.join(out,'assets/search.json'),JSON.stringify(searchable));
// Keep RSS links inside this edition. Do not invent publication dates for imported notes.
fs.writeFileSync(path.join(out,'rss.xml'),`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>NuclearSoap</title><link>https://nuclearsoap114.github.io/chirpy/</link><description>算法、题解和课程笔记</description>${notes.map(n=>`<item><title>${escape(n.title)}</title><link>https://nuclearsoap114.github.io${prefix(n.url)}</link><guid>https://nuclearsoap114.github.io${prefix(n.url)}</guid><category>${escape(topics.find(t=>t.id===n.topic)?.title||'笔记')}</category></item>`).join('')}</channel></rss>`);
console.log(`Chirpy: ${notes.length} public notes + home, directory, tags, archive, about, blog setup. Existing pages untouched.`);
