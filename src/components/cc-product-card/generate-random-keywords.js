import { randomString } from '../../lib/utils.js';

/**
 * @typedef {import('./cc-product-card.types.js').Keyword} Keyword
 */

/**
 * Returns a list of random keywords.
 *
 * @param {number} number
 * @returns {Array<Keyword>}
 */
export function generateRandomKeywords(number) {
  const keywords = [{ value: 'hidden', hidden: true }];

  for (let i = 0; i < number; i++) {
    const numberOfChars = Math.floor(Math.random() * 7 + 3);
    keywords.push({ value: randomString(numberOfChars), hidden: false });
  }

  return keywords;
}
