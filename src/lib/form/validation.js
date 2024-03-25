/**
 * @typedef {import('./validation.types.js').ValidValidity} ValidValidity
 * @typedef {import('./validation.types.js').InvalidValidity} InvalidValidity
 * @typedef {import('./validation.types.js').Validator} Validator
 * @typedef {import('./validation.types.js').Validity} Validity
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 */

export class Validation {
  /** @type {ValidValidity} */
  static VALID = { valid: true };

  /**
   * @param {string} code
   * @return {InvalidValidity}
   */
  static invalid (code) {
    return {
      valid: false,
      code,
    };
  }
}

/**
 * A validator that checks whether a value is empty or not.
 *
 * It considers an empty value as invalid with `empty` error code.
 *
 * It supports emptiness for string, number and array data types.
 *
 * @implements {Validator}
 */
export class RequiredValidator {
  /**
   * @param {any} value
   * @param {Object} _formData
   * @return {Validity}
   */
  validate (value, _formData) {
    return this._isEmpty(value) ? Validation.invalid('empty') : Validation.VALID;
  }

  /**
   * @param {undefined|null|string|Array<any>|number} value
   * @return {boolean}
   */
  _isEmpty (value) {
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
  }
}

/**
 * A validator that checks whether a value is a valid number and optionally if it is inside some given bounds.
 *
 * It considers an invalid number as invalid with `badFormat` error code.
 * It considers a number lower than the lower bound as invalid with `rangeUnderflow` error code.
 * It considers a number higher than the upper bound as invalid with `rangeOverflow` error code.
 *
 * It supports number and string data form.
 *
 * @implements {Validator}
 */
export class NumberValidator {
  /**
   * @param {Object} [options]
   * @param {number} [options.min]
   * @param {number} [options.max]
   */
  constructor ({ min, max } = {}) {
    this._min = min;
    this._max = max;
  }

  /**
   *
   * @param {any} value
   * @param {Object} _formData
   * @return {Validity}
   */
  validate (value, _formData) {
    // check is number
    const num = this._parse(value);
    if (num == null || isNaN(num)) {
      return Validation.invalid('badType');
    }

    // check range
    const range = this._getRange();
    if (range == null) {
      return Validation.VALID;
    }

    if (num < range.min) {
      return Validation.invalid('rangeUnderflow');
    }
    if (num > range.max) {
      return Validation.invalid('rangeOverflow');
    }

    return Validation.VALID;
  }

  /**
   * @param {any} value
   * @return {number|null}
   */
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
}

/**
 * A validator that checks whether a value is a valid email address.
 *
 * It considers an invalid email as invalid with `badEmail` error code.
 *
 * @implements {Validator}
 */
export class EmailValidator {
  /**
   * @param {any} value
   * @param {Object} _formData
   * @return {Validity}
   */
  validate (value, _formData) {
    if (!value.match(/^\S+@\S+\.\S+$/gm)) {
      return Validation.invalid('badEmail');
    }

    return Validation.VALID;
  }
}

/**
 * An always valid validator that always return valid regardless of the given value.
 *
 * @implements {Validator}
 */
export class ValidValidator {
  /**
   * @param {any} _value
   * @param {Object} _formData
   * @return {ValidValidity}
   */
  validate (_value, _formData) {
    return Validation.VALID;
  }
}

/**
 * @type {Validator} A validator that always return VALID.
 */
const ALWAYS_VALID_VALIDATOR = new ValidValidator();

/**
 * @param {Array<Validator>} validators
 * @return {Validator}
 */
export function combineValidators (validators) {
  const nonNullValidators = validators.filter((v) => v != null);
  if (nonNullValidators.length === 0) {
    return ALWAYS_VALID_VALIDATOR;
  }

  if (nonNullValidators.length === 1) {
    return nonNullValidators[0];
  }

  return createValidator((value, formData) => {
    for (const validator of nonNullValidators) {
      const v = validator.validate(value, formData);
      if (v.valid === false) {
        return v;
      }
    }
    return Validation.VALID;
  });
}

/**
 * @param {(value: any, formData?: Object) => Validity} validate
 * @return {Validator}
 */
export function createValidator (validate) {
  return { validate };
}
