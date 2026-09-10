import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import MarkdownIt from 'markdown-it';
import GithubSlugger from 'github-slugger';
import { chromium } from 'playwright';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ignored = new Set(['node_modules', '.git', '.cache', '.qa']);

export async function walk(dir = root) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue;
    const name = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(name));
    else if (entry.isFile()) files.push(name);
  }
  return files.sort();
}

export function markdown() {
  const md = new MarkdownIt({ html: true });
  md.core.ruler.push('heading_ids', state => {
    const slugger = new GithubSlugger();
    for (let i = 0; i < state.tokens.length; i++) {
      const token = state.tokens[i];
      if (token.type !== 'heading_open') continue;
      const title = (state.tokens[i + 1].children ?? [])
        .filter(child => ['text', 'code_inline'].includes(child.type))
        .map(child => child.content).join('');
      token.attrSet('id', slugger.slug(title));
    }
  });
  return md;
}

export function children(tokens) {
  return tokens.flatMap(token => [token, ...children(token.children ?? [])]);
}

export async function readMarkdown(file) {
  const source = await readFile(file, 'utf8');
  const md = markdown();
  return { source, tokens: md.parse(source, {}), md };
}

export async function launchBrowser() {
  const executablePath = process.env.DOCS_CHROMIUM_PATH;
  return chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
}

export const relative = file => path.relative(root, file).split(path.sep).join('/');
