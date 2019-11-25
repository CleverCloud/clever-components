export function prepareNumberUnitFormatter (lang) {

  const numberFormatter = new Intl.NumberFormat(lang, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  function format (value, suffix) {
    return (value < 10)
      ? numberFormatter.format(value) + suffix
      : Math.round(value) + suffix;
  }

  return (value) => {
    if (value >= 1e6) {
      return format(value / 1e6, 'M');
    }
    if (value >= 1e3) {
      return format(value / 1e3, 'K');
    }
    return value;
  };
}
