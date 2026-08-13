/**
 * Filter grammar shared by the resource lists that narrow sections of items with a text query:
 * `cc-search-bar` (global search) and the console's own sidebar.
 *
 * The tokenizing and the matching semantics live here; what differs legitimately between call sites
 * (which fields hold the text, what an empty query means) stays configurable.
 *
 * Grammar:
 * - the query is lowercased, trimmed, and split on whitespace into tokens,
 * - a token starting with one of `keywordPrefixes`, followed by at least one character, is a *keyword*:
 *   the item passes only if that exact token is among its matchers,
 * - any other token is *free text*: the item passes only if the token is a substring of at least one of
 *   its text fields,
 * - every token must pass (AND between tokens, OR across an item's text fields),
 * - a section with no item is dropped, whether the query emptied it or it was already empty.
 *
 * The prefixes are an explicit list rather than a generic `<word>:` pattern on purpose: free text can
 * legitimately contain a colon (a URL, an `app_xxx:yyy` id), and treating those as keywords would
 * silently return nothing.
 */

/** @type {Array<string>} */
export const DEFAULT_KEYWORD_PREFIXES = ['is:', 'project:'];

/**
 * Splits a raw query into keyword tokens and free-text tokens.
 *
 * @param {string} query - the raw user input
 * @param {Array<string>} [keywordPrefixes] - prefixes marking a token as a keyword
 * @returns {{ keywordTokens: Array<string>, textTokens: Array<string> }}
 */
export function parseFilterQuery(query, keywordPrefixes = DEFAULT_KEYWORD_PREFIXES) {
  const normalized = query.trim().toLowerCase();
  if (normalized === '') {
    return { keywordTokens: [], textTokens: [] };
  }
  const tokens = normalized.split(/\s+/);
  // A bare prefix (`is:`) is free text, not a keyword matching everything: the user is mid-typing.
  /** @param {string} token */
  const isKeyword = (token) =>
    keywordPrefixes.some((prefix) => token.startsWith(prefix) && token.length > prefix.length);
  return {
    keywordTokens: tokens.filter(isKeyword),
    textTokens: tokens.filter((token) => !isKeyword(token)),
  };
}

/**
 * Tells whether an item passes the parsed query.
 *
 * @param {{ keywordTokens: Array<string>, textTokens: Array<string> }} parsedQuery
 * @param {Array<string>} matchers - the item's matchers, e.g. `['is:app', 'is:node', 'project:billing']`
 * @param {Array<string|null|undefined>} texts - the item's searchable text fields, e.g. its label and id
 * @returns {boolean}
 */
export function matchesFilterQuery({ keywordTokens, textTokens }, matchers, texts) {
  if (!keywordTokens.every((keyword) => matchers.includes(keyword))) {
    return false;
  }
  const lowerCasedTexts = texts.filter((text) => text != null).map((text) => text.toLowerCase());
  return textTokens.every((token) => lowerCasedTexts.some((text) => text.includes(token)));
}

/**
 * Filters sections and their items with the grammar above, without mutating the input.
 *
 * @template {{ items: Array<any> }} S
 * @param {Array<S>} sections
 * @param {string} query
 * @param {object} [options]
 * @param {(item: S['items'][number]) => Array<string>} [options.getMatchers] - reads an item's matchers
 * @param {(item: S['items'][number]) => Array<string|null|undefined>} [options.getTexts] - reads an item's text fields
 * @param {Array<string>} [options.keywordPrefixes]
 * @param {'all'|'none'} [options.emptyQuery] - what an empty query yields: every non-empty section, or
 * nothing. A sidebar shows everything unfiltered; a search bar shows no result until something is typed.
 * @returns {Array<S>} the sections holding at least one matching item
 */
export function filterSections(sections, query, options = {}) {
  const {
    getMatchers = (item) => item.matchers ?? [],
    getTexts = (item) => [item.label, item.id],
    keywordPrefixes = DEFAULT_KEYWORD_PREFIXES,
    emptyQuery = 'all',
  } = options;

  const parsedQuery = parseFilterQuery(query, keywordPrefixes);
  const hasQuery = parsedQuery.keywordTokens.length > 0 || parsedQuery.textTokens.length > 0;
  if (!hasQuery) {
    // Still drop the empty ones: the contract is "sections holding at least one item", so a caller never
    // has to re-chain that filter — the kind of per-consumer detail that made the two grammars drift.
    // Section objects are returned as-is here, since no item was filtered out.
    return emptyQuery === 'none' ? [] : sections.filter((section) => section.items.length > 0);
  }

  return sections
    .map((section) => ({
      ...section,
      items: section.items.filter((item) => matchesFilterQuery(parsedQuery, getMatchers(item), getTexts(item))),
    }))
    .filter((section) => section.items.length > 0);
}
