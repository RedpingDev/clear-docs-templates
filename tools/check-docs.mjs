import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { root as defaultRoot, walk, readMarkdown, children } from './lib.mjs';

const root = process.argv[2] ? path.resolve(process.argv[2]) : defaultRoot;
const relative = file => path.relative(root, file).split(path.sep).join('/');
const files = await walk(root);
const docs = files.filter(file => file.endsWith('.md'));
const parsed = new Map();
const failures = [];
let linkCount = 0;
let imageCount = 0;
for (const file of docs) parsed.set(file, await readMarkdown(file));
const fail = (file, reason) => failures.push(`${relative(file)}: ${reason}`);

for (const [file, { source, tokens }] of parsed) {
  const flat = children(tokens);
  const isDocs = /^(docs|templates|examples)\//.test(relative(file))
    && !/^(?:AGENTS(?:\.override)?|README|CHANGELOG)\.md$/i.test(path.basename(file));
  const headings = tokens.filter(t => t.type === 'heading_open');
  if (isDocs) {
    if (headings.filter(t => t.tag === 'h1').length !== 1) fail(file, 'Expected one H1.');
    if (headings.some(t => Number(t.tag.slice(1)) > 3)) fail(file, 'Heading exceeds H3.');
    if (tokens[0]?.type !== 'heading_open' || tokens[0]?.tag !== 'h1') fail(file, 'Must begin with title.');
    if (tokens[3]?.type !== 'paragraph_open') fail(file, 'Purpose paragraph must follow title.');
    if (tokens[6]?.type !== 'bullet_list_open') fail(file, 'Summary list must follow purpose.');
    const end = tokens.findIndex((t, i) => i > 6 && t.type === 'bullet_list_close');
    const summaryCount = tokens.slice(6, end).filter(t => t.type === 'list_item_open').length;
    if (summaryCount < 2 || summaryCount > 3) fail(file, 'Summary must contain 2–3 items.');
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'heading_open' && tokens[i].tag === 'h2' && tokens[i - 1]?.type !== 'hr') {
        fail(file, `Missing major-section separator at line ${tokens[i].map[0] + 1}.`);
      }
    }
    if (headings.filter(t => t.tag === 'h2').length >= 5) {
      const beforeBody = source.slice(0, source.indexOf('\n## '));
      if (!beforeBody.includes('**바로가기:**')) fail(file, 'Five or more H2 sections require compact TOC.');
    }
    if (flat.some(t => t.type.startsWith('html') && /<\/?(?:br|style|details)\b/i.test(t.content.replace(/<!--[\s\S]*?-->/g, '')))) {
      fail(file, 'Docs must not rely on breaks, CSS, or collapsed details.');
    }
  }
  if (relative(file).startsWith('examples/') && /\{\{|\[확인 필요:/.test(source)) fail(file, 'Unresolved example placeholder.');
  let columns = 0;
  for (const token of flat) {
    if (token.type === 'tr_open') columns = 0;
    if (token.type === 'th_open') columns++;
    if (isDocs && token.type === 'tr_close' && columns > 4) fail(file, 'Table exceeds four columns.');
    if (isDocs && token.type === 'fence' && !token.info.trim()) fail(file, 'Code block needs language.');
    const isImage = token.type === 'image';
    if (!isImage && token.type !== 'link_open') continue;
    const href = token.attrGet(isImage ? 'src' : 'href');
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) continue;
    linkCount++;
    let decoded;
    try { decoded = decodeURIComponent(href); } catch { fail(file, `Invalid encoded link: ${href}`); continue; }
    const hashAt = decoded.indexOf('#');
    const linkPath = (hashAt >= 0 ? decoded.slice(0, hashAt) : decoded).split('?')[0];
    const fragment = hashAt >= 0 ? decoded.slice(hashAt + 1) : '';
    const target = linkPath ? path.resolve(path.dirname(file), linkPath) : file;
    if (path.relative(root, target).startsWith('..') || path.isAbsolute(linkPath)) {
      fail(file, `Link must stay repository-relative: ${href}`); continue;
    }
    try { await access(target); } catch { fail(file, `Missing link target: ${href}`); continue; }
    if (fragment && parsed.has(target)) {
      const targetDoc = parsed.get(target);
      const ids = targetDoc.tokens.filter(t => t.type === 'heading_open').map(t => t.attrGet('id'));
      for (const match of targetDoc.source.matchAll(/<a\s+id="([^"]+)"/g)) ids.push(match[1]);
      if (!ids.includes(fragment)) fail(file, `Missing anchor: ${href}`);
    }
    if (isImage) {
      imageCount++;
      if (isDocs) {
        if (!token.content.trim()) fail(file, 'Image needs meaningful alt text.');
        if (path.extname(target).toLowerCase() !== '.png') fail(file, 'Inline diagram must be PNG.');
        try { await access(target.slice(0, -4) + '.mmd'); } catch { fail(file, `Missing matching Mermaid source: ${href}`); }
      }
      if (path.extname(target).toLowerCase() === '.png') {
        const png = await readFile(target);
        if (!png.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) fail(file, `Invalid PNG: ${href}`);
      }
    }
  }
}
for (const file of files.filter(file => file.endsWith('.mmd'))) {
  try { await access(file.slice(0, -4) + '.png'); } catch { fail(file, 'Missing rendered PNG.'); }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`PASS: ${docs.length} Markdown files, ${linkCount} local links, ${imageCount} inline images; Docs style rules and general link checks passed.`);
}
