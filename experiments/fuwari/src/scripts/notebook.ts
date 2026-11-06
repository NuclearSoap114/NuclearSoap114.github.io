
 class NoteDirectory extends HTMLElement {
  private initialized=false;
  connectedCallback(){
  if(this.initialized)return;this.initialized=true;
  const root=this;const input=root.querySelector<HTMLInputElement>('#notes-query');if(!input)return;
  const target=document.getElementById(location.hash.slice(1));if(target instanceof HTMLDetailsElement)target.open=true;
  const rows=[...root.querySelectorAll<HTMLAnchorElement>('[data-note]')];
  input.addEventListener('input',()=>{
   const words=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);let count=0;
   for(const row of rows){row.hidden=!words.every(w=>(row.dataset.search||'').toLocaleLowerCase().includes(w));if(!row.hidden)count++;}
   for(const section of root.querySelectorAll<HTMLElement>('.notes-section'))section.hidden=![...section.querySelectorAll<HTMLElement>('[data-note]')].some(n=>!n.hidden);
   for(const group of root.querySelectorAll<HTMLDetailsElement>('.notes-subject')){group.hidden=![...group.querySelectorAll<HTMLElement>('.notes-section')].some(n=>!n.hidden);group.open=words.length>0&&!group.hidden;}
   for(const series of root.querySelectorAll<HTMLElement>('[data-series]'))series.hidden=![...series.querySelectorAll<HTMLElement>('.notes-subject')].some(n=>!n.hidden);
   const status=root.querySelector('#notes-count');if(status)status.textContent=words.length?`找到 ${count} 篇笔记`:`共 ${rows.length} 篇笔记，点击专题展开目录。`;
  });
 }
 }
 if(!customElements.get('note-directory'))customElements.define('note-directory',NoteDirectory);


 document.addEventListener('click', async event => {
  const button=(event.target as Element)?.closest<HTMLButtonElement>('[data-copy-qq]');
  if(!button)return;
  const status=document.getElementById('profile-copy-status');
  try { await navigator.clipboard.writeText(button.dataset.copyQq || '');if(status)status.textContent='QQ 号已复制'; }
  catch { if(status)status.textContent=`QQ：${button.dataset.copyQq}，可长按号码复制`; }
 });
