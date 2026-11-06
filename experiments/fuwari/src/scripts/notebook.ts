class NoteDirectory extends HTMLElement {
 private initialized=false;
 connectedCallback(){
  if(this.initialized)return;this.initialized=true;
  const root=this,input=this.querySelector<HTMLInputElement>('#notes-query');if(!input)return;
  const rows=[...this.querySelectorAll<HTMLAnchorElement>('[data-note]')];
  const buttons=[...this.querySelectorAll<HTMLButtonElement>('[data-filter-tag]')];
  let activeTag=new URLSearchParams(location.search).get('tag')||'';
  if(!buttons.some(b=>b.dataset.filterTag===activeTag))activeTag='';
  const apply=(updateUrl=false)=>{
   const words=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let count=0;
   for(const row of rows){const tags:string[]=JSON.parse(row.dataset.tags||'[]');row.hidden=!!(activeTag&&!tags.includes(activeTag))||!words.every(w=>(row.dataset.search||'').toLocaleLowerCase().includes(w));if(!row.hidden)count++;}
   const filtered=words.length>0||!!activeTag;
   for(const section of root.querySelectorAll<HTMLElement>('.notes-section'))section.hidden=![...section.querySelectorAll<HTMLElement>('[data-note]')].some(n=>!n.hidden);
   for(const group of root.querySelectorAll<HTMLDetailsElement>('.notes-subject')){group.hidden=![...group.querySelectorAll<HTMLElement>('.notes-section')].some(n=>!n.hidden);group.open=filtered&&!group.hidden;}
   for(const series of root.querySelectorAll<HTMLElement>('[data-series]'))series.hidden=![...series.querySelectorAll<HTMLElement>('.notes-subject')].some(n=>!n.hidden);
   for(const button of buttons)button.setAttribute('aria-pressed',String(button.dataset.filterTag===activeTag));
   const status=root.querySelector('#notes-count');if(status)status.textContent=filtered?`找到 ${count} 篇${activeTag?'「'+activeTag+'」':''}笔记`:`共 ${rows.length} 篇笔记，点击专题展开目录。`;
   const clear=root.querySelector<HTMLButtonElement>('#notes-clear');if(clear)clear.hidden=!filtered;
   if(updateUrl){const url=new URL(location.href);if(activeTag)url.searchParams.set('tag',activeTag);else url.searchParams.delete('tag');history.replaceState(history.state,'',url);}
  };
  input.addEventListener('input',()=>apply());
  for(const button of buttons)button.addEventListener('click',()=>{activeTag=button.dataset.filterTag||'';apply(true);});
  this.querySelector('#notes-clear')?.addEventListener('click',()=>{activeTag='';input.value='';apply(true);input.focus();});
  apply();
  const target=document.getElementById(location.hash.slice(1));if(target instanceof HTMLDetailsElement)target.open=true;
 }
}
if(!customElements.get('note-directory'))customElements.define('note-directory',NoteDirectory);
window.addEventListener('hashchange',()=>{const target=document.getElementById(location.hash.slice(1));if(target instanceof HTMLDetailsElement)target.open=true;});

 document.addEventListener('click', async event => {
  const button=(event.target as Element)?.closest<HTMLButtonElement>('[data-copy-qq]');
  if(!button)return;
  const status=document.getElementById('profile-copy-status');
  try { await navigator.clipboard.writeText(button.dataset.copyQq || '');if(status)status.textContent='QQ 号已复制'; }
  catch { if(status)status.textContent=`QQ：${button.dataset.copyQq}，可长按号码复制`; }
 });
