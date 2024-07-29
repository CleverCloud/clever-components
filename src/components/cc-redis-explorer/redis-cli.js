import { isStringEmpty } from '../../lib/utils.js';

/**
 * @param {string} commandString
 * @return {{command: string, args: Array<string>}|null}
 */
export function parseRedisCommand(commandString) {
  if (isStringEmpty(commandString)) {
    return null;
  }

  /** @type {Array<string>} */
  const arr = [];
  /** @param {string} c */
  function append(c) {
    if (arr.length === 0) {
      arr.push('');
    }
    arr[arr.length - 1] += c;
  }

  const len = commandString.length;
  let inQuote = false;
  let i = 0;
  while (i < len) {
    const char = commandString.charAt(i);
    const nextChar = i < len - 1 ? commandString.charAt(i + 1) : null;

    if (char === '\\' && nextChar === '\\') {
      append('\\');
      i++;
    } else if (char === '\\' && nextChar === '"') {
      append('"');
      i++;
    } else if (char === '"') {
      inQuote = !inQuote;
    } else if (char === ' ' && !inQuote) {
      arr.push('');
    } else {
      append(char);
    }
    i++;
  }

  if (inQuote) {
    throw new Error('unclosed quote');
  }

  const [command, ...args] = arr;
  return { command, args };
}

/**
 * @param {null|string|number|Array<any>} result
 * @return {Array<string>}
 */
export function transformResultForCLI(result) {
  /** @type {Array<string>} */
  const lines = [];
  innerTransformResultForCLI(result, 0, lines);
  console.log(lines);
  return lines;
}

/**
 *
 * @param {null|string|number|Array<any>} result
 * @param {number} indent
 * @param {Array<string>} lines
 * @return {void}
 */
export function innerTransformResultForCLI(result, indent, lines) {
  if (result == null) {
    lines.push(`(nil)`);
  } else if (typeof result === 'string') {
    lines.push(`"${result}"`);
  } else if (typeof result === 'number') {
    lines.push(`(integer) ${result}`);
  } else if (Array.isArray(result)) {
    if (result.length === 0) {
      lines.push('(empty array)');
    } else {
      const prefix = ' '.repeat((indent + 1) * 3);

      result.forEach((it, i) => {
        /** @type {Array<string>} */
        const innerLines = [];
        innerTransformResultForCLI(it, indent + 1, innerLines);
        innerLines.forEach((l, j) => {
          if (j === 0) {
            lines.push(`${i + 1}) ${l}`);
          } else {
            lines.push(`${prefix}${l}`);
          }
        });
      });
    }
  } else {
    lines.push(`"${result}"`);
  }
}
