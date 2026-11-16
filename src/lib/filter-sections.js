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
 * Default keywords:
 * - `is:<value>`: type, product or status, e.g. `is:app`, `is:postgresql-addon`, `is:running`,
 * - `project:<name>`: the project a resource belongs to,
 * - `tag:<tag>`: any tag the user put on a resource, written as is after the prefix, colons included:
 *   `tag:env:prod`, `tag:production`. The prefix is what tells a tag apart from free text containing a colon.
 *
 * Tags are read raw from the items (see `getTags`) and turned into `tag:<tag>` matchers here, so callers
 * hand over the tags as the API returns them and never have to know about the prefix.
 *
 * The prefixes are an explicit list rather than a generic `<word>:` pattern on purpose: free text can
 * legitimately contain a colon (a URL, an `app_xxx:yyy` id), and treating those as keywords would
 * silently return nothing.
 */

/** Keyword prefix under which an item's tags are matched. */
export const TAG_KEYWORD_PREFIX = 'tag:';

/** @type {Array<string>} */
export const DEFAULT_KEYWORD_PREFIXES = ['is:', 'project:', TAG_KEYWORD_PREFIX];

/**
 * Turns raw tags into `tag:<tag>` matchers: trimmed and lowercased, since the query is lowercased, with
 * blank and duplicate tags dropped.
 *
 * @param {Array<string>|null|undefined} tags - e.g. `['env:prod', 'Production']`
 * @returns {Array<string>} e.g. `['tag:env:prod', 'tag:production']`
 */
export function getTagMatchers(tags) {
  if (!Array.isArray(tags)) {
    return [];
  }
  const normalizedTags = tags.map((tag) => tag.trim().toLowerCase()).filter((tag) => tag !== '');
  return [...new Set(normalizedTags)].map((tag) => `${TAG_KEYWORD_PREFIX}${tag}`);
}

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
 * @param {Array<string>} matchers - the item's matchers, e.g. `['is:app', 'is:node', 'project:billing', 'tag:env:prod']`
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
 * @param {(item: S['items'][number]) => Array<string>|null|undefined} [options.getTags] - reads an item's raw tags,
 * matched by `tag:<tag>` tokens (see `getTagMatchers()`)
 * @param {Array<string>} [options.keywordPrefixes]
 * @param {'all'|'none'} [options.emptyQuery] - what an empty query yields: every non-empty section, or
 * nothing. A sidebar shows everything unfiltered; a search bar shows no result until something is typed.
 * @returns {Array<S>} the sections holding at least one matching item
 */
export function filterSections(sections, query, options = {}) {
  const {
    getMatchers = (item) => item.matchers ?? [],
    getTexts = (item) => [item.label, item.id],
    getTags = (item) => item.tags ?? [],
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
      items: section.items.filter((item) =>
        matchesFilterQuery(parsedQuery, [...getMatchers(item), ...getTagMatchers(getTags(item))], getTexts(item)),
      ),
    }))
    .filter((section) => section.items.length > 0);
}
