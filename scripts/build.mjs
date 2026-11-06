import fs from 'node:fs';
import path from 'node:path';

const site = 'experiments/fuwari/dist';
if (!fs.existsSync(path.join(site, 'index.html'))) {
  throw new Error('Fuwari build missing. Run pnpm --dir experiments/fuwari build first.');
}
fs.rmSync('dist', {recursive: true, force: true});
fs.cpSync(site, 'dist', {recursive: true});
// Keep the comparison URLs shared earlier working after the main-site migration.
if (fs.existsSync('public/preview')) {
  fs.cpSync('public/preview', 'dist/preview', {recursive: true});
}
fs.writeFileSync('dist/.nojekyll', '');
console.log('已生成 Fuwari 主站与历史对照预览。');
