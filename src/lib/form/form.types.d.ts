import { EventWithTarget } from '../events.types.js';
import { Validity } from './validation.types.js';

export type FormControlData = null | File | string | FormData;

export type FormDataMap = { [key: string]: FormControlData | Array<FormControlData> };

export interface FormControlElementLike {
  get willValidate(): boolean;
  checkValidity: () => boolean;
  get validationMessage(): string;
}

export type OnValidCallback = (formData: FormDataMap, formElement: HTMLFormElement) => void;
export type OnInvalidCallback = (formValidity: FormValidity, formElement: HTMLFormElement) => void;

export interface SubmitHandlerCallbacks {
  onValid?: OnValidCallback;
  onInvalid?: OnInvalidCallback;
}

export type HTMLFormElementEvent = EventWithTarget<HTMLFormElement>;

export type FormValidity = Array<FormControlValidity>;

interface FormControlValidity {
  name: string;
  validity: Validity;
}
