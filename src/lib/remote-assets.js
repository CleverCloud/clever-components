export function getFlagUrl (countryCode) {
  return (countryCode != null)
    ? `https://assets.clever-cloud.com/flags/${countryCode.toLowerCase()}.svg`
    : countryCode;
}

export function getInfraProviderLogoUrl (providerSlug) {
  return (providerSlug != null)
    ? `https://assets.clever-cloud.com/infra/${providerSlug}.svg`
    : providerSlug;
}
