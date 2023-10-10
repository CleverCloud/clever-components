import { i18n } from '../../../lib/i18n.js';

/**
 * @type {ValidValidation}
 */
export const VALID = { valid: true };

/**
 * @param {string} code
 * @return {InvalidValidation}
 */
export const invalid = (code) => {
  return {
    valid: false,
    code,
  };
};

const isEmpty = (value) => {
  if (value == null) {
    return true;
  }
  if (typeof value === 'string') {
    return value.length === 0;
  }
  if (typeof value === 'number') {
    return Number.isNaN(value);
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }
  return false;
};

export class RequiredValidator {
  constructor (required, nextValidator) {
    this._required = required;
    this._nextValidator = nextValidator;
  }

  getErrorMessage (code) {
    if (code === 'empty') {
      return i18n('validation-controller.error.empty');
    }

    if (this._nextValidator != null) {
      return this._nextValidator.getErrorMessage(code);
    }

    throw new Error('Unsupported error code');
  }

  validate (value) {
    if (isEmpty(value)) {
      return this._required ? invalid('empty') : VALID;
    }

    if (this._nextValidator == null) {
      return VALID;
    }

    return this._nextValidator.validate(value);
  }
}

export class NumberValidator {
  /**
   * @param {number} [min]
   * @param {number} [max]
   */
  constructor ({ min, max }) {
    this._min = min;
    this._max = max;
  }

  _parse (value) {
    if (typeof value === 'number') {
      return value;
    }
    if (typeof value === 'string') {
      return Number(value);
    }
    return null;
  }

  _getRange () {
    if (this._min == null && this._max == null) {
      return null;
    }

    return { min: this._min ?? -Infinity, max: this._max ?? Infinity };
  }

  /**
   * @param {'badType'|'rangeUnderflow'|'rangeOverflow'} code
   */
  getErrorMessage (code) {
    if (code === 'badType') {
      return i18n('validation-controller.error.badType');
    }
    if (code === 'rangeUnderflow') {
      return i18n('validation-controller.error.rangeUnderflow');
    }
    if (code === 'rangeOverflow') {
      return i18n('validation-controller.error.rangeOverflow');
    }

    throw new Error('Unsupported error code');
  }

  validate (value) {
    // check is number
    const num = this._parse(value);
    if (num == null) {
      return invalid('badType');
    }

    // check range
    const range = this._getRange();
    if (range == null) {
      return VALID;
    }

    if (num < range.min) {
      return invalid('rangeUnderflow');
    }
    if (num > range.max) {
      return invalid('rangeOverflow');
    }

    return VALID;
  }
}

export class EmailValidator {

  /**
   * @param {'badEmail'} code
   */
  getErrorMessage (code) {
    if (code === 'badEmail') {
      return i18n('validation-controller.error.bad-email');
    }

    throw new Error('Unsupported error code');
  }

  validate (value) {
    if (!value.match(/^\S+@\S+\.\S+$/gm)) {
      return invalid('badEmail');
    }

    return VALID;
  }
}

export class FunctionValidator {
  constructor (fn) {
    this._fn = fn;
  }

  validate (value) {
    return this._fn();
  }
}
