import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { root, walk, readMarkdown, relative, launchBrowser } from './lib.mjs';

const require = createRequire(import.meta.url);
const output = path.join(root, '.qa/site');
await mkdir(output, { recursive: true });
await copyFile(require.resolve('github-markdown-css/github-markdown.css'), path.join(output, 'github-markdown.css'));
const files = await walk();
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (const file of files) {
  const rel = relative(file);
  if (!/\.(md|png|mmd)$/.test(file) && rel !== 'tools/mermaid-config.json') continue;
  const target = path.join(output, rel.replace(/\.md$/, '.html'));
  await mkdir(path.dirname(target), { recursive: true });
  if (!file.endsWith('.md')) { await copyFile(file, target); continue; }
  const { source, md } = await readMarkdown(file);
  const defaultLink = md.renderer.rules.link_open ?? ((tokens, i, options, env, self) => self.renderToken(tokens, i, options));
  md.renderer.rules.link_open = (tokens, i, options, env, self) => {
    const href = tokens[i].attrGet('href');
    if (href && !/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) tokens[i].attrSet('href', href.replace(/\.md(?=#|$)/, '.html'));
    return defaultLink(tokens, i, options, env, self);
  };
  const css = path.relative(path.dirname(target), path.join(output, 'github-markdown.css')).split(path.sep).join('/');
  const html = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(rel)} — local QA</title><link rel="stylesheet" href="${css}"><style>
body{margin:0;background:#fff;color:#1f2328}.markdown-body{box-sizing:border-box;max-width:980px;margin:0 auto;padding:32px 40px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Malgun Gothic",sans-serif}.qa-note{max-width:900px;margin:20px auto 0;padding:0 20px;font:12px/1.5 sans-serif;color:#59636e}@media(prefers-color-scheme:dark){body{background:#0d1117;color:#f0f6fc}.qa-note{color:#9198a1}}@media(max-width:767px){.markdown-body{padding:24px}}
</style></head><body><aside class="qa-note">로컬 배치 검사 · GitHub / Zed 실제 화면이 아님</aside><main class="markdown-body">${md.render(source)}</main></body></html>`;
  await writeFile(target, html);
}

const browser = await launchBrowser();
const checks = [];
try {
  for (const colorScheme of ['light', 'dark']) {
    for (const width of [1280, 1000]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme, deviceScaleFactor: 1 });
      for (const name of ['concept', 'architecture', 'reference']) {
        await page.goto(pathToFileURL(path.join(output, 'examples', `${name}.html`)).href);
        await page.evaluate(() => document.fonts.ready);
        const metrics = await page.evaluate(() => {
          const main = document.querySelector('main');
          const summary = main.querySelector('ul');
          const images = [...main.querySelectorAll('img')];
          const heading = main.querySelector('h1');
          return {
            titleVisible: heading.getBoundingClientRect().bottom < innerHeight,
            summaryVisible: summary.getBoundingClientRect().bottom < innerHeight,
            pageOverflow: document.documentElement.scrollWidth > innerWidth,
            contentOverflow: [...main.querySelectorAll('table,pre,img')].some(el => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth),
            imagesLoaded: images.every(img => img.complete && img.naturalWidth > 0),
            imageCount: images.length
          };
        });
        const result = { name, colorScheme, width, ...metrics };
        checks.push(result);
        if (width === 1280) await page.screenshot({ path: path.join(root, '.qa', `${name}-${colorScheme}.png`), fullPage: true });
      }
      await page.close();
    }
  }
} finally {
  await browser.close();
}
await writeFile(path.join(root, '.qa/layout-checks.json'), JSON.stringify(checks, null, 2) + '\n');
const failures = checks.filter(c => !c.titleVisible || !c.summaryVisible || c.pageOverflow || c.contentOverflow || !c.imagesLoaded);
console.log(`Local preview: ${relative(output)}`);
console.log(`${checks.length - failures.length}/${checks.length} layout scenarios passed (3 documents × 2 themes × 2 widths).`);
if (failures.length) { console.error(failures); process.exitCode = 1; }
