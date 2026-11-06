# NuclearSoap 的博客

主站：https://nuclearsoap114.github.io/

本站使用 Fuwari 主题，先显示与主题一致的欢迎页，点击进入后运行基于 Swarm Rebuild 的页面动画。欢迎页默认不静音；完成后自动退场并显示重播按钮，重播会保留声音选择。上游原文件保留在 `swarm-rebuild.js`，博客适配版为 `swarm-blog.js`；来源和版本记录在 `experiments/fuwari/public/vendor/swarm-rebuild-source.txt`。

## 写文章

在 `experiments/fuwari/src/content/posts/` 添加 Markdown 文件，参考 `markdown-extended.md` 的标题、日期、摘要和标签格式。设置 `draft: false` 后会出现在归档和搜索中；首页由 `HomeFeed.astro` 单独选取笔记，不自动展示文章列表。公开仓库中的草稿源文件也能被别人看到。

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

笔记正文在 `experiments/fuwari/src/content/notes/`。页面按算法与竞赛、计算机网络、操作系统、计算机组成原理、软件工程、概率与统计、思政理论七个主题组织；算法保留“算法、tricker、题解、学习”四类。现有文件路径用于维持旧文章网址，不再作为页面的目录结构。

新增笔记需填写 title、series（原始来源）、subject、section、order。只有人工检查后明确标记 `public: true` 的笔记才会进入正文页面、目录、搜索和站点地图；省略该标记不会自动发布。私人笔记不要放进这个公开仓库，即使没有发布标记，仓库中的源文件也可被访问。

当前保留 183 篇公开笔记，撤下个人目标、训练进度、私人待办、无独立内容的索引和全文转载参考资料。撤下文件与修改前原件只保存在仓库外的本地备份，原始 Obsidian 笔记不改动。PDF、Word 和其他参考资料不发布。
