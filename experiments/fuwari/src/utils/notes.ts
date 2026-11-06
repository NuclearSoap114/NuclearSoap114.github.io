import { getCollection } from 'astro:content';

type NoteInfo = { data: { title: string; subject: string; section: string } };
export async function getNotes() {
 return (await getCollection('notes')).filter(note=>note.data.public).sort((a,b)=>a.data.order-b.data.order);
}
export function noteUrl(slug: string) { return `/notes/${slug.split('/').map(encodeURIComponent).join('/')}/`; }
export const noteTopics = [
 {id:'algorithms',title:'算法与竞赛',description:'算法、tricker、题解与学习方法',subjects:['算法与竞赛'],icon:'material-symbols:code-rounded'},
 {id:'networks',title:'计算机网络',description:'网络分层、协议与数据传输',subjects:['计算机网络'],icon:'material-symbols:lan-outline-rounded'},
 {id:'operating-systems',title:'操作系统',description:'进程、内存、文件与调度',subjects:['操作系统'],icon:'material-symbols:terminal-rounded'},
 {id:'computer-organization',title:'计算机组成原理',description:'数据表示、指令与硬件结构',subjects:['计算机组成原理'],icon:'material-symbols:memory-rounded'},
 {id:'software-engineering',title:'软件工程',description:'需求分析、设计、建模与测试',subjects:['软件工程'],icon:'material-symbols:account-tree-outline-rounded'},
 {id:'probability',title:'概率与统计',description:'随机变量、分布、估计与检验',subjects:['概率论'],icon:'material-symbols:functions-rounded'},
 {id:'political-theory',title:'思政理论',description:'毛概与习概的知识整理',subjects:['毛概','习概'],icon:'material-symbols:menu-book-outline-rounded'},
];
export function topicForNote(note: NoteInfo) {
 const topic=noteTopics.find(t=>t.subjects.includes(note.data.subject));
 if(!topic)throw new Error(`Unknown note subject: ${note.data.subject}`);
 return topic;
}
export function getNoteTopics(notes: Awaited<ReturnType<typeof getNotes>>) {
 return noteTopics.map(topic=>({...topic,count:notes.filter(n=>topic.subjects.includes(n.data.subject)).length}));
}
export function topicUrl(id:string) { return '/notes/?topic='+encodeURIComponent(id); }
// Retain the anchor names previously shared in article links.
export const subjectIds: Record<string,string> = { '算法与竞赛':'algorithms','计算机组成原理':'computer-organization','软件工程':'software-engineering','操作系统':'operating-systems','计算机网络':'networks','概率论':'probability','毛概':'mao-theory','习概':'xi-theory' };
export function getNoteTags(note: NoteInfo): string[] {
 const {title,subject}=note.data;
 if(subject!=='算法与竞赛')return [subject];
 const tags=['算法竞赛'];
 if(/DP|背包|最小支配集|状态压缩|树上最大点权路径和/.test(title))tags.push('动态规划');
 if(/网络流|最短|Floyd|图论|树上|二叉苹果树|Dinic/.test(title))tags.push('图论');
 if(/树状数组|线性基|笛卡尔树/.test(title))tags.push('数据结构');
 if(/莫比乌斯|欧拉|容斥|数论|整数分块|整除分块|线性筛|矩阵/.test(title))tags.push('数论与组合');
 if(/概率|期望/.test(title))tags.push('概率与期望');
 if(/复盘/.test(title))tags.push('做题复盘');
 return tags;
}
export function getNoteTagCounts(notes: Awaited<ReturnType<typeof getNotes>>) {
 const counts=new Map<string,number>();
 for(const note of notes)for(const tag of getNoteTags(note))counts.set(tag,(counts.get(tag)||0)+1);
 const order=['算法竞赛','动态规划','图论','数据结构','数论与组合','概率与期望','做题复盘','计算机网络','操作系统','计算机组成原理','软件工程','概率论','毛概','习概'];
 return order.filter(tag=>counts.has(tag)).map(name=>({name,count:counts.get(name)!}));
}
export function tagUrl(tag:string) { return '/notes/?tag='+encodeURIComponent(tag); }
export const algorithmCategories = [
 {name:'算法',id:'algorithm',description:'知识点、常用模型与代码模板',icon:'material-symbols:account-tree-outline-rounded'},
 {name:'tricker',id:'tricker',description:'做题时积累的技巧和转化',icon:'material-symbols:lightbulb-outline-rounded'},
 {name:'题解',id:'solutions',description:'具体题目的思路与实现',icon:'material-symbols:code-rounded'},
 {name:'学习',id:'learning',description:'学习方法与公开复盘',icon:'material-symbols:edit-note-rounded'},
] as const;
export function categoryUrl(category:string) { return '/notes/?category='+encodeURIComponent(category); }
export function getAlgorithmCategories(notes: Awaited<ReturnType<typeof getNotes>>) {
 return algorithmCategories.map(category=>({...category,count:notes.filter(n=>n.data.subject==='算法与竞赛'&&n.data.section===category.name).length}));
}
