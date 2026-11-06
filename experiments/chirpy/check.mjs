import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';import {load} from 'cheerio';
const here=path.dirname(fileURLToPath(import.meta.url)),root=path.resolve(here,'../..'),dist=path.join(root,'dist'),source=path.join(root,'experiments/fuwari/dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const errors=[],notes=new Set();let pages=0,formulaErrors=0,unchanged=0;
for(const f of walk(path.join(dist,'chirpy')).filter(f=>f.endsWith('.html'))){
 pages++;const $=load(fs.readFileSync(f,'utf8'));formulaErrors+=$('.katex-error').length;
 if($('.note-reading').length)notes.add(f);
 for(const e of $('a[href],img[src],script[src],link[href]').toArray()){
  const v=$(e).attr('href')||$(e).attr('src');if(!v?.startsWith('/')||v.startsWith('//'))continue;
  const p=decodeURIComponent(v.split(/[?#]/)[0]);let target=path.join(dist,p);if(p.endsWith('/'))target=path.join(target,'index.html');
  if(!fs.existsSync(target))errors.push(`Missing ${v} from ${path.relative(dist,f)}`);
  if(/^\/(notes|posts|about|archive)\//.test(v))errors.push(`Edition escape ${v}`);
 }
 if($('script[src*="googletag"],script[src*="goatcounter"]').length)errors.push('Unexpected analytics');
}
// The main edition must remain byte-identical to its own rendered pages.
for(const f of walk(source).filter(f=>['index.html','404.html'].includes(path.basename(f)))){const dest=path.join(dist,path.relative(source,f));if(!fs.existsSync(dest)||!fs.readFileSync(f).equals(fs.readFileSync(dest)))errors.push('Original page changed: '+dest);else unchanged++}
const $=load(fs.readFileSync(path.join(source,'notes/index.html'),'utf8'));if(notes.size!==$('[data-note]').length)errors.push('Public-note count mismatch');
if(formulaErrors)errors.push('Formula rendering error');
console.log({pages,publicNotes:notes.size,formulaErrors,unchangedOriginalPages:unchanged,errors:errors.slice(0,15)});
if(errors.length)process.exitCode=1;
