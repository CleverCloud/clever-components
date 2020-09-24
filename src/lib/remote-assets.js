export function getFlagUrl (countryCode) {
  return (countryCode != null)
    ? `https://static-assets.cellar.services.clever-cloud.com/flags/${countryCode.toLowerCase()}.svg`
    : countryCode;
}

export function getInfraProviderLogoUrl (providerSlug) {
  return (providerSlug != null)
    ? `https://static-assets.cellar.services.clever-cloud.com/infra/${providerSlug}.svg`
    : providerSlug;
}
