import { mkdir, readFile, writeFile, copyFile } from 'node:fs/promises';
const original = 'https://ram0o7.github.io/Snake/';
const url = new URL(process.env.SITE_URL || original);
if (url.protocol !== 'https:' || url.search || url.hash || url.username || url.password) throw new Error('SITE_URL must be an HTTPS URL without credentials, query or hash.');
const base = url.href.replace(/\/*$/, '/');
await mkdir('dist', { recursive: true });
for (const file of ['index.html','styles.css','game.js','engine.js','touch-controls.js','music.js','food.mp3','gameover.mp3','music.mp3','in-game.mp3','favicon.svg','robots.txt','sitemap.xml','_headers','.nojekyll']) {
  if (['index.html','robots.txt','sitemap.xml'].includes(file)) {
    const source = await readFile(file, 'utf8');
    await writeFile(`dist/${file}`, source.replaceAll(original, base));
  } else await copyFile(file, `dist/${file}`);
}
console.log(`Static site built in dist/ for ${base}`);
