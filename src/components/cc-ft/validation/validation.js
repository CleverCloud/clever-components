export class Validator {
  constructor (required) {
    this._required = required;
  }

  /**
   *
   * @param {any} value
   * @return {Validation}
   */
  validate (value) {
    if (isEmpty(value)) {
      return this._required ? invalid('empty') : VALID;
    }

    return this.doValidate(value);
  }

  /**
   * @param {any} value
   * @return {ValidValidation}
   */
  doValidate (value) {
    return VALID;
  }
}

/**
 * @type {ValidValidation}
 */
const VALID = { valid: true };

/**
 * @param {ValidationErrorCode} code
 * @return {InvalidValidation}
 */
const invalid = (code) => {
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
  return false;
};

export class NumberValidator extends Validator {
  /**
   * @param {boolean} required
   * @param {number} [min]
   * @param {number} [max]
   */
  constructor ({ required, min, max }) {
    super(required);
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

  doValidate (value) {
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

export class EmailValidator extends Validator {

  /**
   * @param {boolean} required
   */
  constructor ({ required }) {
    super(required);
  }

  doValidate (value) {
    if (!value.match(/^\S+@\S+\.\S+$/gm)) {
      return invalid('badEmail');
    }
  }
}
