const VALID_FLAGS = 'dgimsuy';
const REGEX_WITH_TRAILING_SLASH = /\/(?<expression>.+)\/(?<flags>[a-z]*)/i;

/**
 * @param {string} input
 * @return {RegExp}
 */
export function parseRegex(input) {
  if (input.startsWith('/')) {
    const m = input.match(REGEX_WITH_TRAILING_SLASH);

    if (m == null) {
      throw new Error('invalid regular expression format');
    }

    const { expression, flags } = m.groups;

    const validFlags = Array.from(new Set(flags))
      .filter((flag) => VALID_FLAGS.includes(flag))
      .join('');

    return new RegExp(expression, validFlags);
  } else {
    return new RegExp(input);
  }
}
