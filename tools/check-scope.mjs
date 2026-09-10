import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { root } from './lib.mjs';

// Integration cases exercise the actual CLI and keep all fixtures in ignored QA output.
await mkdir(path.join(root, '.qa'), { recursive: true });
const fixture = await mkdtemp(path.join(root, '.qa/scope-'));
await mkdir(path.join(fixture, '.github'), { recursive: true });
await mkdir(path.join(fixture, 'docs'), { recursive: true });
const guide = '# 개념\n\n목적을 설명합니다.\n\n- 핵심 하나\n- 핵심 둘\n\n---\n\n## 설명\n\n내용입니다.\n';
const run = () => {
  const result = spawnSync(process.execPath, [path.join(root, 'tools/check-docs.mjs'), fixture], { encoding: 'utf8' });
  if (result.error) throw result.error;
  return { status: result.status, output: result.stdout + result.stderr };
};

await writeFile(path.join(fixture, 'AGENTS.md'), '# Rules\n\nKeep instructions short.\n');
await writeFile(path.join(fixture, 'CHANGELOG.md'), '# Changes\n\n## Unreleased\n\nNo changes.\n');
await writeFile(path.join(fixture, '.github/PULL_REQUEST_TEMPLATE.md'), '## 변경 목적\n\nDescribe the change.\n');
await writeFile(path.join(fixture, 'docs/AGENTS.md'), '# Local instructions\n\nKeep local rules.\n');
await writeFile(path.join(fixture, 'docs/concept.md'), guide);
assert.equal(run().status, 0, 'Management Markdown must not inherit Docs layout requirements.');

await writeFile(path.join(fixture, 'docs/concept.md'), guide.replace('---\n\n', ''));
const missingSeparator = run();
assert.equal(missingSeparator.status, 1);
assert.match(missingSeparator.output, /Missing major-section separator/);
await writeFile(path.join(fixture, 'docs/concept.md'), guide);

await writeFile(path.join(fixture, '.github/PULL_REQUEST_TEMPLATE.md'), '## 검증\n\n[missing](../missing.md)\n');
const brokenManagementLink = run();
assert.equal(brokenManagementLink.status, 1);
assert.match(brokenManagementLink.output, /Missing link target/);

await writeFile(path.join(fixture, '.github/PULL_REQUEST_TEMPLATE.md'), '## 검증\n\n[guide](../docs/concept.md#설명)\n');
assert.equal(run().status, 0, 'Valid management links and Korean anchors must pass.');
console.log('PASS: 4 scope scenarios (management exemption, Docs enforcement, broken link, valid Korean anchor).');
