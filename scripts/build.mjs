import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';
import matter from 'gray-matter';
const config = JSON.parse(fs.readFileSync('site.json', 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const out = 'dist';
const posts = fs.readdirSync('content/posts').filter(f => f.endsWith('.md')).map(file => {
  const {data, content} = matter(fs.readFileSync(`content/posts/${file}`, 'utf8'));
  if (data.draft === true) return null;
  const slug = file.slice(0, -3);
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error(`文章文件名请用小写英文、数字和短横线：${file}`);
  const date = data.date instanceof Date ? data.date.toISOString().slice(0,10) : String(data.date);
  if (!data.title || !/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) throw new Error(`文章缺少标题或有效日期：${file}`);
  return {...data, date, slug, content, url:`/posts/${slug}/`};
}).filter(Boolean).sort((a,b)=> b.date.localeCompare(a.date));
fs.rmSync(out, {recursive:true, force:true}); fs.mkdirSync(out);
fs.cpSync('public', out, {recursive:true});
function write(file, data){ fs.mkdirSync(path.dirname(`${out}/${file}`),{recursive:true}); fs.writeFileSync(`${out}/${file}`,data); }
const nav = (url, label, current) => `<a href="${url}" ${current === url ? 'aria-current="page"':''}>${label}</a>`;
function page(title, content, current='/', description=config.description){return `<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)} · ${esc(config.title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${config.url}${current}"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/style.css"><link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml"></head>
<body><a class="skip" href="#main">跳到正文</a><div class="shell"><header><a class="brand" href="/" aria-label="${esc(config.title)} 首页"><span class="mark" aria-hidden="true">N.</span><span>${esc(config.title)}<small>个人博客 / PERSONAL JOURNAL</small></span></a><nav aria-label="主导航">${nav('/','首页',current)}${nav('/archive/','文章',current)}${nav('/about/','关于',current)}</nav></header><main id="main">${content}</main><footer><span>© ${new Date().getFullYear()} ${esc(config.title)}</span><div><a href="${config.github}">GitHub ↗</a><a href="/feed.xml">RSS 订阅 ↗</a></div></footer></div></body></html>`;}
function rows(items){return items.map(p=>`<article class="post-row"><time datetime="${p.date}">${p.date.replaceAll('-','.')}</time><div><h3><a href="${p.url}">${esc(p.title)}</a></h3><p>${esc(p.description || '')}</p><div class="tags">${(p.tags||[]).map(t=>`<span>${esc(t)}</span>`).join('')}</div></div><a class="arrow" href="${p.url}" aria-label="阅读 ${esc(p.title)}">↗</a></article>`).join('');}
const empty = `<div class="empty"><span class="empty-number" aria-hidden="true">01</span><div><h3>第一篇，留给值得记录的事。</h3><p>这里还没有公开文章，欢迎之后再来看看。</p></div></div>`;
write('index.html', page('首页',`<section class="hero"><div class="eyebrow"><span></span> ${esc(config.title)} 的文字空间</div><h1>把想法写下来，<br>让日子有迹可循<span class="accent">。</span></h1><p>${esc(config.description)}</p><a class="text-link" href="/about/">关于这个博客 <span>↗</span></a><div class="hero-note" aria-hidden="true">NOTES, IDEAS<br>& EVERYDAY LIFE.</div></section><section class="articles" aria-labelledby="latest"><div class="section-head"><h2 id="latest">最近的文字 <span> / ${String(posts.length).padStart(2,'0')}</span></h2><a href="/archive/">全部文章 ↗</a></div>${posts.length ? rows(posts.slice(0,5)) : empty}</section>`));
write('archive/index.html', page('全部文章',`<section class="page-heading"><div class="eyebrow">ARCHIVE / 文章归档</div><h1>文字的足迹<span class="accent">。</span></h1><p>共 ${posts.length} 篇公开文章，按时间排列。</p></section><section aria-label="文章列表">${posts.length ? rows(posts) : empty}</section>`,'/archive/'));
write('about/index.html', page('关于',`<section class="page-heading"><div class="eyebrow">ABOUT / 关于</div><h1>你好，这里是<br>${esc(config.title)}<span class="accent">。</span></h1></section><article class="prose">${marked.parse(fs.readFileSync('content/about.md','utf8'))}</article><a class="button" href="${config.github}">在 GitHub 找到我 ↗</a>`,'/about/'));
for (const p of posts) write(`posts/${p.slug}/index.html`,page(p.title,`<section class="page-heading"><a class="text-link" href="/archive/">← 返回文章列表</a><p><time datetime="${p.date}">${p.date}</time></p><h1>${esc(p.title)}</h1></section><article class="prose">${marked.parse(p.content)}</article><div class="post-end"><a href="/archive/">阅读其他文章 ↗</a></div>`,p.url,p.description));
write('404.html',page('页面未找到',`<section class="page-heading"><div class="eyebrow">404 / 走到了空白处</div><h1>这一页还没有故事。</h1><p>链接可能已变更，回首页看看吧。</p><a class="button" href="/">回到首页 ↗</a></section>`,'/404.html'));
write('feed.xml',`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(config.title)}</title><link>${config.url}</link><description>${esc(config.description)}</description><language>zh-CN</language>${posts.map(p=>`<item><title>${esc(p.title)}</title><link>${config.url}${p.url}</link><guid>${config.url}${p.url}</guid><pubDate>${new Date(p.date+'T00:00:00+08:00').toUTCString()}</pubDate><description>${esc(p.description || p.title)}</description></item>`).join('')}</channel></rss>`);
write('sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${['/','/archive/','/about/',...posts.map(p=>p.url)].map(url=>`<url><loc>${config.url}${url}</loc></url>`).join('')}</urlset>`);
write('robots.txt',`User-agent: *\nAllow: /\nSitemap: ${config.url}/sitemap.xml\n`);
write('.nojekyll','');
console.log(`已生成博客：${posts.length} 篇公开文章。`);
