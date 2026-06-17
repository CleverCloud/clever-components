/**
 * Shared helpers for the reglage-based config in the `manage-*` scripts.
 */

import { readFileSync } from 'node:fs';
import { z } from 'zod';

/**
 * @import { InvalidConfigError } from '@clevercloud/reglage'
 */

/**
 * Pick a subset of option definitions from an OPTIONS catalogue. The catalogue is
 * passed explicitly so this helper can be reused across scripts that each declare
 * their own OPTIONS.
 *
 * The arguments are the source of truth for the type system: the returned value is
 * typed as `Readonly<Pick<O, K>>`, where `K` is inferred as the union of the literal
 * key entries. The generic constraint `K extends keyof O` keeps the literal types
 * (the array does not widen to `string[]`) and a typo in a key fails to compile
 * because each entry must be a `keyof O`.
 *
 * @template {Record<string, unknown>} O
 * @template {keyof O} K
 * @param {readonly K[]} keys - option names the action reads
 * @param {O} options - the option catalogue to pick from
 * @returns {Readonly<Pick<O, K>>}
 */
export const pickKeysFromObject = (keys, options) => {
  /** @type {Partial<Pick<O, K>>} */
  const result = {};
  for (const key of keys) {
    result[key] = options[key];
  }
  return /** @type {Readonly<Pick<O, K>>} */ (result);
};

/**
 * Generate description blocks from an OPTIONS catalogue that have a documentation property, with the
 * option names padded to a common width.
 *
 * @param {Record<string, { documentation: string }>} options
 * @returns {string}
 */
export function describeOptions(options) {
  const pad = Math.max(...Object.keys(options).map((name) => name.length));
  return Object.entries(options)
    .map(([name, { documentation }]) => `  ${name.padEnd(pad)}  ${documentation}`)
    .join('\n');
}

/**
 * Print the issues from a reglage validation error and exit.
 *
 * @param {InvalidConfigError} error
 * @returns {never}
 */
export function exitWithConfigErrors(error) {
  console.error('Environment validation errors:');
  const issues = error.issues ?? [];
  issues.forEach((issue) => console.error(`  - ${issue.key}: ${issue.message}`));
  console.error('\nRun with no arguments to see usage information.');
  process.exit(1);
}

/**
 * Build a Zod schema that ignores its input and resolves to the contents of
 * `filePath`, turning any read error into a validation issue. Use as the
 * return value of a reglage refinement when a field should resolve to a
 * file's contents.
 *
 * @param {string} filePath
 * @param {string} label - human label used in the read-error message, e.g. 'message' or 'body'
 */
export const readFileAsSchema = (filePath, label) =>
  z.unknown().transform((_value, ctx) => {
    try {
      return readFileSync(filePath, { encoding: 'utf-8' });
    } catch (error) {
      ctx.addIssue({
        code: 'custom',
        message: `cannot read ${label} file ${filePath}: ${error instanceof Error ? error.message : 'unknown'}`,
      });
      return z.NEVER;
    }
  });
