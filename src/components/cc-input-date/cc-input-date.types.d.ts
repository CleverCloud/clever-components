export type InputDateValueState = InputDateValueStateEmpty | InputDateValueStateNaD | InputDateValueStateValid;

export interface InputDateValueStateEmpty {
  type: 'empty';
}

export interface InputDateValueStateNaD {
  type: 'NaD';
  value: string;
}

export interface InputDateValueStateValid {
  type: 'valid';
  value: string;
  date: Date;
}
