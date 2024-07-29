/**
 * @param {string|null} countryCode
 * @return {string|null}
 */
export function getFlagUrl(countryCode) {
  return countryCode != null ? `https://assets.clever-cloud.com/flags/${countryCode.toLowerCase()}.svg` : null;
}

/**
 * @param {string|null} providerSlug
 * @return {string|null}
 */
export function getInfraProviderLogoUrl(providerSlug) {
  return providerSlug != null ? `https://assets.clever-cloud.com/infra/${providerSlug}.svg` : null;
}
