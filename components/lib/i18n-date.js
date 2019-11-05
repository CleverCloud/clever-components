const UNITS = [
  { unit: 'year', duration: 1000 * 60 * 60 * 24 * (365.25) },
  { unit: 'month', duration: 1000 * 60 * 60 * 24 * (365.25 / 12) },
  { unit: 'week', duration: 1000 * 60 * 60 * 24 * 7 },
  { unit: 'day', duration: 1000 * 60 * 60 * 24 },
  { unit: 'hour', duration: 1000 * 60 * 60 },
  { unit: 'minute', duration: 1000 * 60 },
  { unit: 'second', duration: 1000 },
];

export function prepareFormatDistanceToNow (lang, fallback, nowString) {

  const format = ('RelativeTimeFormat' in Intl)
    ? (value, unit) => new Intl.RelativeTimeFormat(lang, { numeric: 'auto' }).format(-value, unit)
    : fallback;

  return function (dateStr) {

    const date = new Date(dateStr).getTime();
    const now = new Date().getTime();
    const diff = now - date;

    for (const { unit, duration } of UNITS) {

      const value = diff / duration;
      const roundedValue = Math.round(value);

      if (value >= 1) {
        return format(roundedValue, unit);
      }
    }
    return nowString;
  };
}

export function prepareFormatDate (lang) {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
  };
  const dtf = new Intl.DateTimeFormat(lang, options);
  return (dateStr) => {
    const date = new Date(dateStr);
    return dtf.format(date);
  };
}
