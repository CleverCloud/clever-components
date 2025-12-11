// FIXME: We're using `@typedef` instead of `@import` here due to a false positive from TS
// See: https://github.com/microsoft/TypeScript/issues/60908/
/**
 * @typedef {import('../components/cc-domain-management/cc-domain-management.types.js').DomainInfo} DomainInfo
 */

/**
 * Extracts `hostname`, `pathname`, `isWildcard` from a given `domain`
 *
 * @param {string} domain
 * @return {{ hostname: string, pathname: string, isWildcard: boolean }}
 */
export function parseDomain(domain) {
  const domainWithHttp = domain.match(/^https?:\/\//) != null ? domain : 'https://' + domain;
  // With firefox, 'https://*.toto.com' is considered invalid so we strip it off for the test
  // because we know this part is valid and we want the rest to be sanitized by the URL parser
  const isWildcard = domain.startsWith('*.');

  if (!isWildcard && domain.includes('*')) {
    throw new DomainParseError('invalid-wildcard', 'Invalid wildcard format. "*" may only be used as a subdomain');
  }

  try {
    const { hostname, pathname } = new URL(domainWithHttp.replace('*.', ''));

    return {
      hostname,
      pathname,
      isWildcard,
    };
  } catch {
    if (domain.length === 0) {
      throw new DomainParseError('empty', 'Empty domain value');
    }

    throw new DomainParseError('invalid-format', 'Invalid domain format');
  }
}

export class DomainParseError extends Error {
  /**
   * @param {'empty'|'invalid-wildcard'|'invalid-format'} code
   * @param {string} message
   */
  constructor(code, message) {
    super(message);

    this.code = code;
  }
}

/**
 * If isWildcard is `true`, returns `*.${hostname}`
 * else returns the `hostname` untouched
 *
 * @param {string} hostname
 * @param {boolean} isWildcard
 * @returns {string}
 */
export function getHostWithWildcard(hostname, isWildcard) {
  return [isWildcard ? '*.' : '', hostname].join('');
}

/**
 * @param {string} hostname
 * @param {string} pathPrefix
 * @param {boolean} isWildcard
 * @param {boolean} isHttpOnly
 * @returns {string}
 */
export function getDomainUrl(hostname, pathPrefix, isWildcard, isHttpOnly) {
  return [isHttpOnly ? 'http://' : 'https://', isWildcard ? 'www.' : '', hostname, pathPrefix].join('');
}

/**
 * @param {string} hostname
 * @return {boolean}
 */
export function isTestDomain(hostname) {
  return hostname.endsWith('cleverapps.io');
}

/**
 * Checks if the domain is a `cleverapps.io` domain and if it contains a subdomain.
 * For instance `subdomain.main.cleverapps.io` is HTTP only.
 *
 * @param {string} domain
 * @return {boolean} whether the domain is a `cleverapps.io` is HTTP only or not
 */
export function isTestDomainWithSubdomain(domain) {
  return isTestDomain(domain) && domain.split('.').length > 3;
}

/**
 * @param {DomainInfo} domainA
 * @param {DomainInfo} domainB
 * @returns {number}
 */
export function sortDomains(domainA, domainB) {
  if (domainA.isPrimary) {
    return -1;
  }

  if (domainB.isPrimary) {
    return 1;
  }

  const reversedDomainA = reverseDomain(domainA);
  const reversedDomainB = reverseDomain(domainB);

  return reversedDomainA.localeCompare(reversedDomainB);
}

/**
 * @param {DomainInfo} domain
 * @returns {string}
 */
function reverseDomain(domain) {
  return domain.hostname.split('.').reverse().join('.') + (domain.isWildcard ? '.*' : '') + domain.pathPrefix;
}
