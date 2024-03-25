import { Validation } from "./validation.types";
import { EventWithTarget } from "../events.types";
import { InputElement } from "./input-element";

export type InputData = null | File | string | FormData;

export type AggregatedFormData = { [key: string]: InputData | Array<InputData> };

export type NativeInputElement =
  HTMLInputElement & { type: Omit<HTMLInputType, 'button' | 'reset' | 'submit'> }
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type HTMLInputType =
  'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'month'
  | 'number'
  | 'password'
  | 'radio'
  | 'range'
  | 'reset'
  | 'search'
  | 'submit'
  | 'tel'
  | 'text'
  | 'time'
  | 'url'
  | 'week';


export type HTMLFormElementEvent = EventWithTarget<HTMLFormElement>;

export type FormValidation = Array<InputValidation>;

interface InputValidation {
  name: string;
  validation: Validation;
}

export type DescribedInputElement = {native: true, element: NativeInputElement} | {native: false, element: InputElement};
