'use strict';
/**
 * Minimal fast-glob replacement, wired in via package.json "overrides" for
 * @next/eslint-plugin-next only.
 *
 * Why: @next/eslint-plugin-next pins fast-glob@3.3.1 → micromatch → braces@3.0.3,
 * which is flagged by GHSA-vfj7-8cjw-p6xm (high) with no patched release.
 * The plugin calls fast-glob only to expand `settings.next.rootDir` globs
 * (monorepos) — this project does not set it. This shim implements that one
 * call with Node's built-in fs.globSync (Node >= 22), so no vulnerable code
 * is installed. Remove the override once the upstream chain is fixed.
 */
const fs = require('node:fs');
const path = require('node:path');

function globSync(pattern, options = {}) {
  if (typeof fs.globSync !== 'function') {
    throw new Error('fast-glob shim: fs.globSync requires Node.js >= 22.');
  }
  const cwd = options.cwd || process.cwd();
  const patterns = Array.isArray(pattern) ? pattern : [pattern];
  const results = patterns.flatMap((p) => fs.globSync(p, { cwd }));
  if (!options.onlyDirectories) return results;
  return results.filter((p) => {
    try {
      return fs.statSync(path.resolve(cwd, p)).isDirectory();
    } catch {
      return false;
    }
  });
}

module.exports = { globSync, sync: globSync };
