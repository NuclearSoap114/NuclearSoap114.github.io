# NuclearSoap114 的博客

网址：https://nuclearsoap114.github.io/

## 首次发布

1. 将本项目提交至 NuclearSoap114/NuclearSoap114.github.io 的 main 分支。
2. 打开仓库 Settings → Pages，在 Build and deployment 下将 Source 选为 GitHub Actions。
3. 在 Actions → 发布博客 中运行工作流，等待发布成功。

本版本替换原来的图片首页，不保留旧页面入口；旧版本仍在 Git 历史中。

## 写文章

在 content/posts/ 下复制 first-post.md，文件名使用小写英文、数字、短横线，例如 reading-notes.md。

修改顶部的标题、日期、摘要和标签，正文用 Markdown 编写。将 draft 改为 false 并提交后，网站自动更新。draft: true 的文章不会出现在发布的网站中，但公开仓库里的源文件仍能被别人看到，请勿提交私密内容。

图片存到 public/images/，正文写：

```markdown
![图片描述](/images/example.jpg)
```

修改 site.json 可以更改博客名称和简介；content/about.md 是关于页面。

## 本地预览

需要 Node.js 22 或更高版本，以及 Python 3。

```sh
npm ci
npm run build
npm run preview
```

浏览器打开 http://127.0.0.1:4173。修改文章后再次运行 npm run build。

## 目录说明

- content/：文章和关于页面
- public/：样式、图标和图片
- scripts/build.mjs：生成网站
- dist/：生成结果，不提交
- .github/workflows/pages.yml：自动发布配置

网站包含首页、文章归档、关于、独立文章页、404 页面、RSS 和站点地图。没有访客跟踪脚本，无需数据库或付费服务。
