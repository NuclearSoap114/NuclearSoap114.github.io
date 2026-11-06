import { getCollection } from "astro:content";
export async function getNotes() {
  return (await getCollection("notes")).sort((a,b) => a.data.order-b.data.order);
}
export function noteUrl(slug: string) { return `/notes/${slug.split('/').map(encodeURIComponent).join('/')}/`; }
export const subjectIds: Record<string,string> = { "算法与竞赛":"algorithms", "计算机组成原理":"computer-organization", "软件工程":"software-engineering", "操作系统":"operating-systems", "计算机网络":"networks", "概率论":"probability", "毛概":"mao-theory", "习概":"xi-theory" };
