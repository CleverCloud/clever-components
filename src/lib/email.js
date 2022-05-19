/**
 * Validates the given email address.
 *
 * @param {string} address
 * @return {'empty'|'invalid'|null} Returns null when validation passes.
 */
export function validateEmailAddress (address) {
  if (address == null || address === '') {
    return 'empty';
  }
  if (!address.match(/\S+@\S+\.\S+/gm)) {
    return 'invalid';
  }

  return null;
}
