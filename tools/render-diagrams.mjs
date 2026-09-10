import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { root, walk, launchBrowser, relative } from './lib.mjs';

const require = createRequire(import.meta.url);
const mermaidBundle = path.join(path.dirname(require.resolve('mermaid/package.json')), 'dist', 'mermaid.min.js');
const configText = await readFile(path.join(root, 'tools/mermaid-config.json'), 'utf8');
const config = JSON.parse(configText);
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const inputs = process.argv.slice(2);
const files = inputs.length ? inputs.map(file => path.resolve(file))
  : (await walk()).filter(file => file.endsWith('.mmd') && /^(templates|examples)\//.test(relative(file)));
if (!files.length) throw new Error('No Mermaid source files found.');
const browser = await launchBrowser();
const results = [];

try {
  const page = await browser.newPage({ viewport: { width: 900, height: 1000 }, deviceScaleFactor: 2 });
  await page.setContent('<html lang="ko"><head><meta charset="utf-8"></head><body><main id="diagram"></main></body></html>');
  // These styles are only baked into PNGs; Markdown does not depend on CSS.
  await page.addStyleTag({ content: 'body{margin:0}#diagram{box-sizing:border-box;width:800px;padding:40px;background:#f8fafc;}#diagram svg{display:block;margin:0 auto;width:100%;max-width:100%;height:auto;}' });
  await page.addScriptTag({ path: mermaidBundle });
  await page.evaluate(value => window.mermaid.initialize(value), config);
  for (const file of files) {
    if (path.extname(file).toLowerCase() !== '.mmd') throw new Error(`Expected .mmd: ${file}`);
    const source = await readFile(file, 'utf8');
    await page.evaluate(async definition => {
      const host = document.querySelector('#diagram');
      host.replaceChildren();
      const { svg } = await window.mermaid.render('docs-diagram', definition);
      host.innerHTML = svg;
      await document.fonts.ready;
    }, source);
    const output = file.slice(0, -4) + '.png';
    const bytes = await page.locator('#diagram').screenshot({ path: output, animations: 'disabled' });
    results.push({ source: relative(file), output: relative(output), sourceHash: hash(source), pngHash: hash(bytes), configHash: hash(configText) });
    console.log(`Rendered ${relative(output)}`);
  }
} finally {
  await browser.close();
}
await mkdir(path.join(root, '.qa'), { recursive: true });
await writeFile(path.join(root, '.qa/diagrams.json'), JSON.stringify(results, null, 2) + '\n');
