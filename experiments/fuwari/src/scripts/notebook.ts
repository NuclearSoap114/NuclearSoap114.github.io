function openNoteAnchor() {
 const target=document.getElementById(decodeURIComponent(location.hash.slice(1)));
 if(target instanceof HTMLDetailsElement)target.open=true;
 else if(target)for(const group of target.closest('[data-topic-section]')?.querySelectorAll<HTMLDetailsElement>('details')||[])group.open=true;
}
class NoteDirectory extends HTMLElement {
 private initialized=false;
 connectedCallback(){
  if(this.initialized)return;this.initialized=true;
  const input=this.querySelector<HTMLInputElement>('#notes-query');if(!input)return;
  const rows=[...this.querySelectorAll<HTMLAnchorElement>('[data-note]')];
  const tagButtons=[...this.querySelectorAll<HTMLButtonElement>('[data-filter-tag]')];
  const categoryButtons=[...this.querySelectorAll<HTMLButtonElement>('[data-filter-category]')];
  const topicButtons=[...this.querySelectorAll<HTMLButtonElement>('[data-filter-topic]')];
  const params=new URLSearchParams(location.search);
  let activeCategory=params.get('category')||'',activeTag=params.get('tag')||'',activeTopic=params.get('topic')||'';
  if(!categoryButtons.some(b=>b.dataset.filterCategory===activeCategory))activeCategory='';
  if(!tagButtons.some(b=>b.dataset.filterTag===activeTag))activeTag='';
  if(!topicButtons.some(b=>b.dataset.filterTopic===activeTopic))activeTopic='';
  if(activeCategory)activeTopic='algorithms';
  const apply=(updateUrl=false)=>{
   const words=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let count=0;
   for(const row of rows){
    const tags:string[]=JSON.parse(row.dataset.tags||'[]');
    row.hidden=!!(activeTopic&&row.dataset.topic!==activeTopic)||!!(activeCategory&&row.dataset.category!==activeCategory)||!!(activeTag&&!tags.includes(activeTag))||!words.every(w=>(row.dataset.search||'').toLocaleLowerCase().includes(w));
    if(!row.hidden)count++;
   }
   const filtered=words.length>0||!!activeTag||!!activeCategory||!!activeTopic;
   for(const group of this.querySelectorAll<HTMLDetailsElement>('.notes-subject')){
    const matches=[...group.querySelectorAll<HTMLElement>('[data-note]')].some(n=>!n.hidden);
    group.hidden=filtered&&!matches;group.open=filtered&&matches;
   }
   for(const topic of this.querySelectorAll<HTMLElement>('[data-topic-section]'))topic.hidden=filtered&&![...topic.querySelectorAll<HTMLElement>('[data-note]')].some(n=>!n.hidden);
   for(const button of tagButtons)button.setAttribute('aria-pressed',String(button.dataset.filterTag===activeTag));
   for(const button of categoryButtons)button.setAttribute('aria-pressed',String(button.dataset.filterCategory===activeCategory));
   for(const button of topicButtons)button.setAttribute('aria-pressed',String(button.dataset.filterTopic===activeTopic));
   const algorithmFilters=this.querySelector<HTMLElement>('.notes-category-filter');if(algorithmFilters)algorithmFilters.hidden=!!activeTopic&&activeTopic!=='algorithms';
   const status=this.querySelector('#notes-count');
   const topicTitle=topicButtons.find(b=>b.dataset.filterTopic===activeTopic)?.dataset.topicTitle;
   const selection=[activeTopic?topicTitle:'',activeCategory,activeTag].filter(Boolean);
   if(status)status.textContent=filtered?`找到 ${count} 篇笔记${selection.length?' · '+selection.join(' / '):''}`:`共 ${rows.length} 篇笔记，点击分类展开目录。`;
   const clear=this.querySelector<HTMLButtonElement>('#notes-clear');if(clear)clear.hidden=!filtered;
   const empty=this.querySelector<HTMLElement>('#notes-empty');if(empty)empty.hidden=count>0;
   if(updateUrl){
    const url=new URL(location.href);url.hash='';
    for(const [key,value] of [['topic',activeTopic],['category',activeCategory],['tag',activeTag]])if(value)url.searchParams.set(key,value);else url.searchParams.delete(key);
    history.replaceState(history.state,'',url);
   }
  };
  input.addEventListener('input',()=>apply());
  for(const button of tagButtons)button.addEventListener('click',()=>{activeTag=button.dataset.filterTag||'';apply(true);});
  for(const button of categoryButtons)button.addEventListener('click',()=>{activeCategory=button.dataset.filterCategory||'';if(activeCategory)activeTopic='algorithms';apply(true);});
  for(const button of topicButtons)button.addEventListener('click',()=>{activeTopic=button.dataset.filterTopic||'';activeCategory='';activeTag='';apply(true);});
  this.querySelector('#notes-clear')?.addEventListener('click',()=>{activeTag='';activeCategory='';activeTopic='';input.value='';apply(true);input.focus();});
  apply();openNoteAnchor();
 }
}
if(!customElements.get('note-directory'))customElements.define('note-directory',NoteDirectory);
window.addEventListener('hashchange',openNoteAnchor);
document.addEventListener('click',async event=>{
 const button=(event.target as Element)?.closest<HTMLButtonElement>('[data-copy-qq]');if(!button)return;
 const status=document.getElementById('profile-copy-status');
 try {await navigator.clipboard.writeText(button.dataset.copyQq||'');if(status)status.textContent='QQ 号已复制';}
 catch {if(status)status.textContent=`QQ：${button.dataset.copyQq}，可长按号码复制`;}
});
