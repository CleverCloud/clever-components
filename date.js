function formatDate (dateObject, format, timeZone) {

  if (format === 'none') {
    return '';
  }

  const dtf = Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    fractionalSecondDigits: 3,
    timeZoneName: 'longOffset',
    timeZone: (timeZone === 'local') ? undefined : timeZone,
  });

  const datePartsArray = dtf.formatToParts(dateObject);
  const d = Object.fromEntries(datePartsArray.map(({ type, value }) => [type, value]));

  const time = `${d.hour}:${d.minute}:${d.second}`;

  if (format === 'short') {
    return time;
  }

  const timezoneOffset = (d.timeZoneName === 'GMT') ? 'Z' : d.timeZoneName.slice(3);
  const precisionAndZone = `.${d.fractionalSecond}${timezoneOffset}`;

  if (format === 'time') {
    return time + precisionAndZone;
  }

  const date = `${d.year}-${d.month}-${d.day}T`;

  return date + time + precisionAndZone;
}

const date = new Date('2021-02-03T04:05:06.789Z');

console.log(JSON.stringify(formatDate(date, 'full', 'UTC')));
console.log(JSON.stringify(formatDate(date, 'time', 'UTC')));
console.log(JSON.stringify(formatDate(date, 'short', 'UTC')));
console.log(JSON.stringify(formatDate(date, 'none', 'UTC')));

console.log(JSON.stringify(formatDate(date, 'full', 'local')));
console.log(JSON.stringify(formatDate(date, 'time', 'local')));
console.log(JSON.stringify(formatDate(date, 'short', 'local')));
console.log(JSON.stringify(formatDate(date, 'none', 'local')));

console.log(JSON.stringify(formatDate(date, 'full', 'America/Los_Angeles')));
console.log(JSON.stringify(formatDate(date, 'time', 'America/Los_Angeles')));
console.log(JSON.stringify(formatDate(date, 'short', 'America/Los_Angeles')));
console.log(JSON.stringify(formatDate(date, 'none', 'America/Los_Angeles')));
