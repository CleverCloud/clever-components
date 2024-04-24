import semver from 'semver';

/**
 *
 * @param {CdnEnvironment} cdnEnvironment
 * @param {string} name
 * @return {string}
 */
export function toCdnEntryName(cdnEnvironment, name) {
  if (name == null) {
    throw new Error('Invalid CDN entry name: It cannot be null.');
  }

  const result = name.trim();

  if (result.length === 0) {
    throw new Error('Invalid CDN entry name: It cannot be empty.');
  }

  if (cdnEnvironment.semver) {
    if (semver.valid(result) == null) {
      throw new Error(`Invalid CDN entry name '${result}': It must be a valid version.`);
    }

    return result;
  }

  return result.replaceAll('/', '-').replaceAll(' ', '-');
}
