export type Timezone = 'local' | 'UTC';

export type DateFormat = 'datetime-iso' | 'datetime-short';

export interface DateFormattedParts {
  date: string;
  separator: 'T' | ' ';
  time: string;
  millisecond?: string;
  timezone?: Timezone;
}

export type DateFormattedPart = keyof DateFormattedParts;

export interface DateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond?: number;
  timezone?: Timezone;
}

export type DatePart = keyof DateParts;
