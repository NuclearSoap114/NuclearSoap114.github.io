import Swup from 'swup';
import '../../fuwari/src/scripts/notebook.ts';
const root=document.documentElement;
const media=matchMedia('(prefers-color-scheme: dark)');
function theme(mode){const dark=mode==='dark'||(mode==='system'&&media.matches);root.dataset.bsTheme=dark?'dark':'light';root.classList.toggle('dark',dark);document.querySelector('#mode-toggle')?.setAttribute('aria-label',dark?'切换浅色模式':'切换深色模式');}
try{theme(localStorage.getItem('chirpy-theme')||'system')}catch{theme('system')}
media.addEventListener('change',()=>{try{if(!localStorage.getItem('chirpy-theme'))theme('system')}catch{}});
document.querySelector('#mode-toggle').addEventListener('click',()=>{const mode=root.dataset.bsTheme==='dark'?'light':'dark';try{localStorage.setItem('chirpy-theme',mode)}catch{}theme(mode)});
const menu=document.querySelector('#sidebar-trigger');
function closeMenu(){document.body.removeAttribute('sidebar-display');document.querySelector('#mask').classList.add('d-none');menu.setAttribute('aria-expanded','false');}
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));document.body.toggleAttribute('sidebar-display',open);document.querySelector('#mask').classList.toggle('d-none',!open)});
document.querySelector('#mask').addEventListener('click',closeMenu);
document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();document.body.classList.remove('search-open')}});
document.querySelector('#search-trigger').addEventListener('click',()=>{document.body.classList.toggle('search-open');if(document.body.classList.contains('search-open'))document.querySelector('#search-input').focus()});
window.swup=new Swup({containers:['#chirpy-content','#breadcrumb'],animationSelector:false,linkSelector:'a[href^="/chirpy/"]'});
let indexPromise;
function getIndex(){return indexPromise ||= fetch('/chirpy/assets/search.json').then(r=>{if(!r.ok)throw Error('Search unavailable');return r.json()}).catch(e=>{indexPromise=null;throw e})}
async function enhanceSearch(directory){
 if(directory.dataset.searchReady)return;directory.dataset.searchReady='loading';
 try{
  const index=await getIndex();if(!directory.isConnected)return;
  const entries=new Map(index.map(n=>[n.url,n.text]));
  for(const row of directory.querySelectorAll('[data-note]'))row.dataset.search+=' '+(entries.get(row.getAttribute('href'))||'');
  directory.dataset.searchReady='ready';directory.querySelector('#notes-query').dispatchEvent(new Event('input'));
 }catch{delete directory.dataset.searchReady;const status=directory.querySelector('#notes-count');if(status)status.textContent='正文搜索暂时不可用，仍可按标题与分类查找。'}
}
function pageReady(){
 document.querySelector('link[rel=canonical]')?.setAttribute('href','https://nuclearsoap114.github.io'+location.pathname);
 const active=document.querySelector('#chirpy-content').dataset.active;
 for(const link of document.querySelectorAll('[data-nav]')){const selected=link.dataset.nav===active;link.closest('li').classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')}
 const directory=document.querySelector('note-directory');
 if(directory){const input=directory.querySelector('#notes-query');const q=new URLSearchParams(location.search).get('q');if(q){input.value=q;input.dispatchEvent(new Event('input'));enhanceSearch(directory)}input.addEventListener('focus',()=>enhanceSearch(directory),{once:true})}
 // Native anchors stay local to this edition, including links to a note section.
 if(location.hash){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView())}
}
window.swup.hooks.on('visit:start',()=>{closeMenu();document.body.classList.remove('search-open')});
window.swup.hooks.on('page:view',pageReady);pageReady();
document.dispatchEvent(new Event('swup:enable'));
document.querySelector('#chirpy-search-form').addEventListener('submit',event=>{event.preventDefault();const q=document.querySelector('#search-input').value.trim();window.swup.navigate('/chirpy/notes/'+(q?'?q='+encodeURIComponent(q):''))});
document.querySelector('#back-to-top').addEventListener('click',()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'}));
addEventListener('scroll',()=>document.querySelector('#back-to-top').classList.toggle('show',scrollY>300),{passive:true});
document.addEventListener('click',async event=>{const button=event.target.closest('[data-copy-code]');if(!button)return;try{await navigator.clipboard.writeText(button.closest('.chirpy-code').querySelector('code').textContent);button.textContent='已复制';setTimeout(()=>{if(button.isConnected)button.textContent='复制'},1600)}catch{button.textContent='请选中代码复制'}});
