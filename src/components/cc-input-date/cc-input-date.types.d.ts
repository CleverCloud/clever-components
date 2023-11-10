export type InputDateValueState = InputDateValueStateEmpty | InputDateValueStateNaD | InputDateValueStateValid;

export interface InputDateValueStateEmpty {
  state: 'empty';
}

export interface InputDateValueStateNaD {
  state: 'NaD',
  value: string;
}

export interface InputDateValueStateValid {
  state: 'valid',
  value: string;
  date: Date;
}
