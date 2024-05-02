/**
 * @typedef {import('../components/common.types.js').Zone} Zone
 */

const CLEVER_CLOUD_ZONE = 'infra:clever-cloud';
export const PRIVATE_ZONE = 'scope:private';

/**
 * Sort zones as follows:
 * 1. Clever Cloud zones "infra:clever-cloud"
 * 2. Private zones "scope:private"
 * 3. Alphanum sort on city
 *
 * @template {Zone} T
 * @param {T[]} rawZones
 * @returns {T[]}
 */
export function sortZones (rawZones) {
  if (rawZones == null) {
    return null;
  }
  return [...rawZones].sort((a, b) => {
    if (a == null || b == null) {
      return 0;
    }
    const aIsCleverCloud = a.tags.includes(CLEVER_CLOUD_ZONE);
    const bIsCleverCloud = b.tags.includes(CLEVER_CLOUD_ZONE);
    if (aIsCleverCloud !== bIsCleverCloud) {
      return aIsCleverCloud ? -1 : 1;
    }
    const aIsPrivate = a.tags.includes(PRIVATE_ZONE);
    const bIsPrivate = b.tags.includes(PRIVATE_ZONE);
    if (aIsCleverCloud && bIsCleverCloud) {
      if (aIsPrivate !== bIsPrivate) {
        return aIsPrivate ? 1 : -1;
      }
      if (aIsPrivate && bIsPrivate) {
        return (a.displayName ?? '').localeCompare((b.displayName ?? ''));
      }
    }
    if (aIsPrivate !== bIsPrivate) {
      return aIsPrivate ? -1 : 1;
    }
    return a.city.localeCompare(b.city);
  });
}
