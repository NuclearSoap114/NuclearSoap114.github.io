import { getCollection } from "astro:content";
export async function getNotes() {
  return (await getCollection("notes")).sort((a,b) => a.data.order-b.data.order);
}
export function noteUrl(slug: string) { return `/notes/${slug.split('/').map(encodeURIComponent).join('/')}/`; }
export const subjectIds: Record<string,string> = { "算法与竞赛":"algorithms", "计算机组成原理":"computer-organization", "软件工程":"software-engineering", "操作系统":"operating-systems", "计算机网络":"networks", "概率论":"probability", "毛概":"mao-theory", "习概":"xi-theory" };

export function getNoteTags(note: { data: { title: string; series: string; subject: string; section: string } }): string[] {
 const {title,series,subject,section}=note.data;
 if(series !== '2026 暑假集训')return [subject,'期末复习'];
 const tags=['算法竞赛'];
 if(/DP|背包|最小支配集|状态压缩|树上最大点权路径和/.test(title))tags.push('动态规划');
 if(/网络流|最短|Floyd|图论|树上|二叉苹果树|Dinic/.test(title))tags.push('图论');
 if(/树状数组|线性基|笛卡尔树/.test(title))tags.push('数据结构');
 if(/莫比乌斯|欧拉|容斥|数论|整数分块|整除分块|线性筛|矩阵/.test(title))tags.push('数论与组合');
 if(/概率|期望/.test(title))tags.push('概率与期望');
 if(section==='学习')tags.push('做题复盘');
 return tags;
}
export function getNoteTagCounts(notes: Awaited<ReturnType<typeof getNotes>>) {
 const counts=new Map<string,number>();
 for(const note of notes)for(const tag of getNoteTags(note))counts.set(tag,(counts.get(tag)||0)+1);
 const order=['算法竞赛','动态规划','图论','数据结构','数论与组合','概率与期望','做题复盘','计算机网络','操作系统','计算机组成原理','软件工程','概率论','毛概','习概','期末复习'];
 return order.filter(tag=>counts.has(tag)).map(name=>({name,count:counts.get(name)!}));
}
export function tagUrl(tag:string) { return '/notes/?tag='+encodeURIComponent(tag); }

export const algorithmCategories = [
 {name:'算法',id:'algorithm',description:'知识点、常用模型与代码模板',icon:'material-symbols:account-tree-outline-rounded'},
 {name:'tricker',id:'tricker',description:'做题时积累的技巧和转化',icon:'material-symbols:lightbulb-outline-rounded'},
 {name:'题解',id:'solutions',description:'具体题目的思路与实现',icon:'material-symbols:code-rounded'},
 {name:'学习',id:'learning',description:'训练清单、计划和复盘',icon:'material-symbols:edit-note-rounded'},
] as const;
export function categoryUrl(category: string) { return '/notes/?category='+encodeURIComponent(category); }
export function getAlgorithmCategories(notes: Awaited<ReturnType<typeof getNotes>>) {
 return algorithmCategories.map(category=>({...category,count:notes.filter(n=>n.data.subject==='算法与竞赛'&&n.data.section===category.name).length}));
}
