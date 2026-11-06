# Fuwari + 光标协作预览

预览路径：/preview/fuwari/posts/markdown-extended/

基于 saicaca/fuwari，原始提交 6d39b0dec41282e7852e23e032998a5789abee28。保留原 MIT 许可证。public/swarm.js 与 public/swarm.css 为独立实现，未采用 Swarm 或 Swarm Rebuild 的代码。

使用 pnpm 9.14.4 安装：

```sh
pnpm install --frozen-lockfile
FUWARI_BASE=/preview/fuwari/ pnpm build
```

将 dist 内容复制到仓库根目录 public/preview/fuwari，再运行根目录 npm run build。该预览独立于现有博客首页，默认 noindex。

功能：首屏自动搭建、随滚动领取任务、跳过、重播、1/2/3 倍速、自动导览。Esc 退出，窗口尺寸变化时恢复阅读。系统减少动态效果或无 JavaScript 时直接阅读。

已验证：电脑/手机、自动导览完成、正文恢复一致、导航、跳过/重播、减少动态效果、无 JavaScript、生产构建与类型检查。

头像与背景暂用主题随附示例，文章是演示内容。
