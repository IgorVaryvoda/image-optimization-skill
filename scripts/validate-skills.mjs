#!/usr/bin/env node
/**
 * Repo-wide skill validation. No dependencies.
 *
 * Checks every skill under skills/:
 * - SKILL.md exists with frontmatter containing name + description
 * - frontmatter name matches the directory name
 * - description stays within Claude Code's 1024-char limit
 * - SKILL.md stays under 500 lines (warn above 300)
 * - every relative markdown link in every .md file resolves to a real file
 * - evals/evals.json parses and has at least one eval
 * - agents/openai.yaml exists (warn only)
 * - bundled scripts (.mjs) pass `node --check`
 *
 * Usage: node scripts/validate-skills.mjs
 * Exits 1 on any error; warnings do not fail the run.
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = path.join(repoRoot, 'skills');

let errors = 0;
let warnings = 0;
const err = (msg) => { errors++; console.error(`ERROR   ${msg}`); };
const warn = (msg) => { warnings++; console.warn(`warning ${msg}`); };

const rel = (p) => path.relative(repoRoot, p);

function parseFrontmatter(text, file) {
  if (!text.startsWith('---')) {
    err(`${rel(file)}: missing frontmatter`);
    return {};
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    err(`${rel(file)}: unterminated frontmatter`);
    return {};
  }
  const fm = {};
  for (const line of text.slice(3, end).split('\n')) {
    const m = line.match(/^(\w[\w-]*):\s*(.*)$/);
    if (m) fm[m[1]] = m[2].trim();
  }
  return fm;
}

function* mdFiles(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* mdFiles(p);
    else if (entry.name.endsWith('.md')) yield p;
  }
}

function checkLinks(file) {
  const text = readFileSync(file, 'utf8');
  // [text](target) — skip images ![, external URLs, and pure anchors
  for (const m of text.matchAll(/(?<!\!)\[[^\]]*\]\(([^)\s]+)\)/g)) {
    const target = m[1];
    if (/^(https?:|mailto:|#)/.test(target)) continue;
    const clean = target.split('#')[0];
    if (!clean) continue;
    const resolved = path.resolve(path.dirname(file), decodeURIComponent(clean));
    if (!existsSync(resolved)) {
      err(`${rel(file)}: broken link -> ${target}`);
    }
  }
}

const skillDirs = readdirSync(skillsDir, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => path.join(skillsDir, e.name));

for (const dir of skillDirs) {
  const name = path.basename(dir);
  const skillMd = path.join(dir, 'SKILL.md');

  if (!existsSync(skillMd)) {
    err(`${rel(dir)}: missing SKILL.md`);
    continue;
  }

  const text = readFileSync(skillMd, 'utf8');
  const fm = parseFrontmatter(text, skillMd);

  if (!fm.name) err(`${rel(skillMd)}: frontmatter missing "name"`);
  else if (fm.name !== name) err(`${rel(skillMd)}: frontmatter name "${fm.name}" != directory "${name}"`);

  if (!fm.description) err(`${rel(skillMd)}: frontmatter missing "description"`);
  else if (fm.description.length > 1024) {
    err(`${rel(skillMd)}: description is ${fm.description.length} chars (limit 1024)`);
  }

  const lines = text.split('\n').length;
  if (lines > 500) err(`${rel(skillMd)}: ${lines} lines (keep SKILL.md under 500; move detail to references/)`);
  else if (lines > 300) warn(`${rel(skillMd)}: ${lines} lines (consider moving detail to references/)`);

  const evalsPath = path.join(dir, 'evals', 'evals.json');
  if (existsSync(evalsPath)) {
    try {
      const data = JSON.parse(readFileSync(evalsPath, 'utf8'));
      if (!Array.isArray(data.evals) || data.evals.length === 0) {
        warn(`${rel(evalsPath)}: no evals defined`);
      }
    } catch (e) {
      err(`${rel(evalsPath)}: invalid JSON (${e.message})`);
    }
  } else {
    warn(`${rel(dir)}: no evals/evals.json`);
  }

  if (!existsSync(path.join(dir, 'agents', 'openai.yaml'))) {
    warn(`${rel(dir)}: no agents/openai.yaml`);
  }

  for (const md of mdFiles(dir)) checkLinks(md);

  const scriptsDir = path.join(dir, 'scripts');
  if (existsSync(scriptsDir) && statSync(scriptsDir).isDirectory()) {
    for (const entry of readdirSync(scriptsDir)) {
      if (entry.endsWith('.mjs') || entry.endsWith('.js')) {
        try {
          execFileSync('node', ['--check', path.join(scriptsDir, entry)], { stdio: 'pipe' });
        } catch (e) {
          err(`${rel(path.join(scriptsDir, entry))}: syntax check failed\n${e.stderr}`);
        }
      }
    }
  }
}

checkLinks(path.join(repoRoot, 'README.md'));

console.log(`\n${skillDirs.length} skills checked: ${errors} error(s), ${warnings} warning(s)`);
if (errors > 0) process.exit(1);
