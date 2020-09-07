export function prepareCountryName (lang) {
  return ({ code, name }) => {
    try {
      return new Intl.DisplayNames([lang], { type: 'region' }).of(code.toUpperCase());
    }
    catch (e) {
      return name;
    }
  };
}
