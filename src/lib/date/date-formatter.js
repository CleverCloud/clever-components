/**
 * @typedef {import('./date.types.js').DateFormat} DateFormat
 * @typedef {import('./date.types.js').Timezone} Timezone
 * @typedef {import('./date.types.js').DateFormattedParts} DateFormattedParts
 * @typedef {import('./date.types.js').DateFormattedPart} DateFormattedPart
 * @typedef {import('./date.types.js').DatePart} DatePart
 * @typedef {import('./date.types.js').DateParts} DateParts
 */

/**
 * Stores instance of `Intl.DateTimeFormat` by timezone.
 *
 * It has been put in a kind of Cache because:
 *
 * * creating an Intl.DateTimeFormat is expensive.
 * * the format is always the same for a given timezone.
 *
 * @type {Map<Timezone, Intl.DateTimeFormat>}
 */
const DATE_TIME_FORMATS_BY_TIMEZONE = new Map();

/**
 * @param {Timezone} timezone
 * @return {Intl.DateTimeFormat}
 */
function getDateTimeFormat(timezone) {
  let format = DATE_TIME_FORMATS_BY_TIMEZONE.get(timezone);
  if (format == null) {
    format = new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
      hourCycle: 'h23',
      timeZoneName: 'longOffset',
      timeZone: timezone === 'local' ? undefined : timezone,
    });
    DATE_TIME_FORMATS_BY_TIMEZONE.set(timezone, format);
  }
  return format;
}

/**
 * `DateFormatter` is a class for formatting date into text.
 *
 * It supports a small amount of formats:
 *
 * * `datetime-iso`: 2023-10-12T16:03:15.052Z
 * * `datetime-short`: 2023-10-12 16:03:15
 *
 * It supports `UTC` and `local` timezones.
 */
export class DateFormatter {
  /**
   * @param {DateFormat} format The date format.
   * @param {Timezone} timezone The timezone.
   */
  constructor(format, timezone) {
    /** @type {DateFormat} */
    this._format = format;
    /** @type {Timezone} */
    this._timezone = timezone;

    this._isIso = this._format === 'datetime-iso';
    this._isMillisIncluded = this._isIso;
    this._isZoneOffsetIncluded = this._isIso;
  }

  /**
   * @param {Date} date - The date to format
   * @return {string} - The date formatted according to the format and timezone specified in constructor.
   */
  format(date) {
    const parts = this.formatToParts(date);

    return Object.values(parts)
      .filter((partValue) => partValue != null)
      .join('');
  }

  /**
   * @param {Date} date
   * @return {DateFormattedParts}
   */
  formatToParts(date) {
    const parts = this.toParts(date);

    /** @type {DateFormattedParts} */
    const result = {
      date: `${parts.year}-${parts.month}-${parts.day}`,
      separator: this._isIso ? 'T' : ' ',
      time: `${parts.hour}:${parts.minute}:${parts.second}`,
    };

    if (this._isMillisIncluded) {
      result.millisecond = `.${parts.millisecond}`;
    }

    if (this._isZoneOffsetIncluded) {
      result.timezone = parts.timezone;
    }

    return result;
  }

  /**
   *
   * @param {Date} date
   * @param {(part: {value: string, type: 'part'|'separator'}) => *} mapper
   * @return {Array<*>}
   */
  mapParts(date, mapper) {
    const parts = this.toParts(date);

    const dateSeparator = separator('-');
    const timeSeparator = separator(':');

    const items = [
      part(parts.year),
      dateSeparator,
      part(parts.month),
      dateSeparator,
      part(parts.day),
      separator(this._isIso ? 'T' : ' '),
      part(parts.hour),
      timeSeparator,
      part(parts.minute),
      timeSeparator,
      part(parts.second),
    ];

    if (this._isMillisIncluded) {
      items.push({ value: '.', type: 'separator' });
      items.push(part(parts.millisecond));
    }

    if (this._isZoneOffsetIncluded) {
      items.push(part(parts.timezone));
    }

    return items.map(mapper);
  }

  /**
   * @param {Date} date
   * @return {DateParts}
   */
  toParts(date) {
    const dtf = getDateTimeFormat(this._timezone);
    const datePartsArray = dtf.formatToParts(date);
    const dateParts = Object.fromEntries(datePartsArray.map(({ type, value }) => [type, value]));

    /** @type {DateParts} */
    const result = {
      year: dateParts.year,
      month: dateParts.month,
      day: dateParts.day,
      hour: dateParts.hour,
      minute: dateParts.minute,
      second: dateParts.second,
    };

    if (this._isMillisIncluded) {
      result.millisecond = dateParts.fractionalSecond;
    }

    if (this._isZoneOffsetIncluded) {
      result.timezone = dateParts.timeZoneName === 'GMT' ? 'Z' : dateParts.timeZoneName.slice(3);
    }

    return result;
  }
}

/**
 * @param {string} value
 * @return {{value: string, type: 'part'}}
 */
function part(value) {
  return { value, type: 'part' };
}

/**
 * @param {string} value
 * @return {{value: string, type: 'separator'}}
 */
function separator(value) {
  return { value, type: 'separator' };
}
