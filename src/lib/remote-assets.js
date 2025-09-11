import { getAssetUrl } from './assets-url.js';

/**
 * @param {string|null} countryCode
 * @return {string|null}
 */
export function getFlagUrl(countryCode) {
  return countryCode != null ? getAssetUrl(`/flags/${countryCode.toLowerCase()}.svg`) : null;
}

/**
 * @param {string|null} providerSlug
 * @return {string|null}
 */
export function getInfraProviderLogoUrl(providerSlug) {
  return providerSlug != null ? getAssetUrl(`/infra/${providerSlug}.svg`) : null;
}
