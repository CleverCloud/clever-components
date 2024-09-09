export type Timezone = 'local' | 'UTC';

export type DateFormat = 'datetime-iso' | 'datetime-short';

export interface DateFormattedParts {
  date: string;
  separator: 'T' | ' ';
  time: string;
  millisecond?: string;
  timezone?: string;
}

export type DateFormattedPart = keyof DateFormattedParts;

export interface DateParts {
  year: string;
  month: string;
  day: string;
  hour: string;
  minute: string;
  second: string;
  millisecond?: string;
  timezone?: string;
}

export type DatePart = keyof DateParts;
