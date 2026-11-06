# NuclearSoap114 的博客

主站：https://nuclearsoap114.github.io/

本站使用 Fuwari 主题，默认运行 Swarm Rebuild 原版页面动画。核心动画文件未作修改，来源和版本记录在 `experiments/fuwari/public/vendor/swarm-rebuild-source.txt`。

## 写文章

在 `experiments/fuwari/src/content/posts/` 添加 Markdown 文件，参考 `markdown-extended.md` 的标题、日期、摘要和标签格式。设置 `draft: false` 后会出现在网站上；公开仓库中的草稿源文件也能被别人看到。

- 博客名称、头像、简介、菜单：`experiments/fuwari/src/config.ts`
- 关于页面：`experiments/fuwari/src/content/spec/about.md`
- 图片：`experiments/fuwari/public/images/`，正文使用 `/images/example.jpg`
- 动画启动入口：`experiments/fuwari/public/swarm-loader.js`

## 本地预览

使用 Node.js 22 和 pnpm 9.14.4：

```sh
pnpm --dir experiments/fuwari install --frozen-lockfile
npm run check
npm run build
npm run preview
```

浏览器打开 http://127.0.0.1:4173。页面默认使用原版动画；添加 `?swarm=custom` 可对照之前独立实现的版本。

## 发布

提交到 `main` 后，GitHub Actions 会从 Fuwari 源码构建主站并发布到 GitHub Pages。构建结果位于 `dist/`，不提交。

`public/preview/fuwari/` 保存之前已分享的对照预览，构建时一并保留。旧博客的 `content/`、`site.json` 和根目录旧静态文件不再用于主站构建。
