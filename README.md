# NuclearSoap114 的博客

主站：https://nuclearsoap114.github.io/

本站使用 Fuwari 主题，先显示与主题一致的欢迎页，点击进入后运行基于 Swarm Rebuild 的页面动画。欢迎页默认不静音；完成后自动退场并显示重播按钮，重播会保留声音选择。上游原文件保留在 `swarm-rebuild.js`，博客适配版为 `swarm-blog.js`；来源和版本记录在 `experiments/fuwari/public/vendor/swarm-rebuild-source.txt`。

## 写文章

在 `experiments/fuwari/src/content/posts/` 添加 Markdown 文件，参考 `markdown-extended.md` 的标题、日期、摘要和标签格式。设置 `draft: false` 后会出现在网站上；公开仓库中的草稿源文件也能被别人看到。

- 博客名称、头像、简介、菜单：`experiments/fuwari/src/config.ts`
- 关于页面：`experiments/fuwari/src/content/spec/about.md`
- 图片：`experiments/fuwari/public/images/`，正文使用 `/images/example.jpg`
- 欢迎页：`experiments/fuwari/src/components/WelcomeGate.astro`
- 欢迎页样式：`experiments/fuwari/src/styles/welcome.css`
- 动画启动入口：`experiments/fuwari/public/swarm-loader.js`

## 本地预览

使用 Node.js 22 和 pnpm 9.14.4：

```sh
pnpm --dir experiments/fuwari install --frozen-lockfile
npm run check
npm run build
npm run preview
```

浏览器打开 http://127.0.0.1:4173。页面默认使用博客适配版；添加 `?swarm=original` 可查看未修改的原版，`?swarm=custom` 可对照之前独立实现的版本。

## 发布

提交到 `main` 后，GitHub Actions 会从 Fuwari 源码构建主站并发布到 GitHub Pages。构建结果位于 `dist/`，不提交。

`public/preview/fuwari/` 保存之前已分享的对照预览，构建时一并保留。旧博客的 `content/`、`site.json` 和根目录旧静态文件不再用于主站构建。

欢迎页使用 GitHub 公开头像，以及用户明确同意展示的邮箱、QQ、Codeforces（见 config.ts 的 welcomeContacts）；未加入其他个人资料。欢迎页在动画画布准备好后再退出，避免完整页面先闪现再重建。

## 学习笔记

笔记正文在 `experiments/fuwari/src/content/notes/`，按集训、课程、专题归档。新增笔记需填写 title、series、subject、section、order；文件路径决定默认网址，也可用 slug 固定网址。目录、搜索、相邻笔记和站点地图随构建更新。

本批整理了 210 篇正文：37 篇暑假集训、173 篇期末复习。Obsidian 链接已转换，公式与代码保留；本地路径、学校名称及疑似真实学号已处理。参考 PDF、Word、压缩包与原始 Obsidian 文件未上传。空白页及仅有缺失截图的页面未发布，网络流笔记的一张缺失配图保留文字说明。
