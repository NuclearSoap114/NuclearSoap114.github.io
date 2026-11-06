import {load} from 'cheerio';

// Chirpy-only composition. Content and animated diagrams still come from the shared picks.
export function renderHome({home,notes,topics,wallpaper,fragment,escape,base,icon}) {
 const $=load(home('.home-feed').prop('outerHTML'),null,false);
 const title=$('.home-intro h1').text();
 const description=$('.home-intro p').text();
 $('.home-intro').remove();
 $('.home-selection .home-section-heading>span').replaceWith(`<a href="/notes/">全部笔记 ${icon('external')}</a>`);
 $('.home-feature>.home-article-meta').prepend('<span class="ch-feature-badge">精选 01</span>');
 $('.home-short').each((i,e)=>$(e).addClass(`ch-pick-${i+2}`));
 const algorithms=$('.home-category').map((i,e)=>{
  const el=$(e);
  return `<a class="ch-library-row" href="${el.attr('href')}"><span class="ch-library-icon">${el.find('svg').prop('outerHTML')}</span><span class="ch-library-label"><strong>${escape(el.find('strong').text())}</strong><small>${escape(el.find('p').text())}</small></span><span class="ch-library-count">${escape(el.find('.home-category-top span').text())}</span><span aria-hidden="true">↗</span></a>`;
 }).get().join('');
 const courses=$('.home-course-topic').map((i,e)=>{
  const el=$(e);
  return `<a class="ch-library-row" href="${el.attr('href')}"><span class="ch-library-icon">${el.find('svg').prop('outerHTML')}</span><strong class="ch-library-label">${escape(el.find('strong').text())}</strong><span class="ch-library-count">${escape(el.find('small').text())}</span><span aria-hidden="true">↗</span></a>`;
 }).get().join('');
 $('.home-category-section').remove();
 $('section[aria-labelledby="home-courses"]').remove();
 $('.home-feed').append(`<section class="ch-library" id="home-library" aria-labelledby="home-library-title"><div class="home-section-heading"><h2 id="home-library-title">按分类翻翻</h2><a href="/notes/">完整目录 ${icon('external')}</a></div><div class="ch-library-grid"><div class="ch-library-group"><h3>算法与竞赛 <small>${notes.filter(n=>n.topic==='algorithms').length} 篇</small></h3><nav aria-label="算法笔记分类">${algorithms}</nav></div><div class="ch-library-group"><h3>课程笔记 <small>${notes.filter(n=>n.topic!=='algorithms').length} 篇</small></h3><nav aria-label="课程主题">${courses}</nav></div></div></section>`);
 const hero=`<header class="ch-home-intro"><div class="ch-intro-copy"><span class="ch-intro-kicker">NUCLEARSOAP / NOTES</span><h1>${escape(title)}</h1><p>${escape(description)}</p><div class="ch-intro-links"><a href="${base}/notes/">${notes.length} 篇笔记 <span aria-hidden="true">↗</span></a><span class="ch-intro-divider" aria-hidden="true"></span><span>${topics.length} 个主题</span><a class="ch-about-link" href="${base}/about/">关于我 <span aria-hidden="true">↗</span></a></div></div><figure class="ch-intro-picture"><img src="${wallpaper}" alt="雪山" width="600" height="400"><figcaption>怕忘，先记下来。</figcaption></figure></header>`;
 return `<div class="chirpy-home">${hero}${fragment($.html())}</div>`;
}

export function renderHomePanel({notes,topics,tags,base,escape}) {
 return `<aside aria-label="笔记导航" id="panel-wrapper" class="col-xl-3 ps-2 text-muted ch-home-panel"><div class="ch-panel-sticky"><section><h2 class="panel-heading">笔记目录 <span>${notes.length}</span></h2><nav class="ch-panel-topics" aria-label="按主题查找">${topics.map(t=>`<a href="${base}/notes/?topic=${encodeURIComponent(t.id)}"><span>${escape(t.title)}</span><small>${notes.filter(n=>n.topic===t.id).length}</small></a>`).join('')}</nav></section><section><h2 class="panel-heading">按标签找</h2><div class="d-flex flex-wrap mt-3 mb-1">${tags.slice(0,9).map(t=>`<a class="post-tag btn btn-outline-primary" href="${base}/notes/?tag=${encodeURIComponent(t)}">${escape(t)}</a>`).join('')}</div></section><div class="ch-panel-bottom"><a href="${base}/archive/">浏览归档 <span aria-hidden="true">↗</span></a><p>算法、题解，还有课程里的知识点。</p></div></div></aside>`;
}

// Homepage recommendations can differ between editions; keep this existing Chirpy pick.
export function applyChirpyPickOverrides(home,notes) {
 const note=notes.find(n=>n.title==='全概率与贝叶斯');
 if(!note)throw new Error('Missing Chirpy probability recommendation');
 const card=home('.home-more').last();
 card.attr('href',note.url).attr('class','home-article home-more home-probability');
 card.find('h3').text(note.title);
 card.find('.home-article-meta').text('概率与统计 · 条件概率');
 card.find('.home-more-copy p').text('从样本空间的划分出发，整理全概率公式、贝叶斯公式及两者的关系。');
 card.find('.home-mini-art').html('<span>P(A | B)</span><span class="home-probability-arrow">↔</span><span>P(B | A)</span>');
}
