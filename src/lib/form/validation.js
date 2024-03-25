/**
 * @typedef {import('./validation.types.js').ValidValidation} ValidValidation
 * @typedef {import('./validation.types.js').InvalidValidation} InvalidValidation
 * @typedef {import('./validation.types.js').Validator} Validator
 * @typedef {import('./validation.types.js').ValidatorsCombiner} ValidatorsCombiner
 * @typedef {import('./validation.types.js').Validation} Validation
 * @typedef {import('./validation.types.js').ErrorMessage} ErrorMessage
 */

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

/**
 * A validator that checks whether a value is empty or not.
 *
 * It considers an empty value as invalid with `empty` error code.
 *
 * It supports emptiness for string, number and array data types.
 *
 * Returns
 *
 * @implements {Validator}
 */
export class RequiredValidator {
  /**
   * @param {any} value
   * @param {Object} _formData
   * @return {Validation}
   */
  validate (value, _formData) {
    return this._isEmpty(value) ? invalid('empty') : VALID;
  }

  /**
   * @param {any} value
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
   * @return {Validation}
   */
  validate (value, _formData) {
    // check is number
    const num = this._parse(value);
    if (num == null || isNaN(num)) {
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
   * @return {Validation}
   */
  validate (value, _formData) {
    if (!value.match(/^\S+@\S+\.\S+$/gm)) {
      return invalid('badEmail');
    }

    return VALID;
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
   * @return {ValidValidation}
   */
  validate (_value, _formData) {
    return VALID;
  }
}

/**
 * This validator is a composition of multiple validators.
 *
 * All inner validators must be valid to make this validator valid.
 *
 * @implements {Validator}
 */
export class CompositeValidator {
  /**
   * @param {Array<Validator>} validators
   */
  constructor (validators) {
    this._validators = validators;
  }

  /**
   * @param {string} code
   * @return {ErrorMessage}
   */
  getErrorMessage (code) {
    for (const validator of this._validators) {
      try {
        const message = validator.getErrorMessage(code);
        if (message != null) {
          return message;
        }
      }
      catch (e) {
      }
    }
    return code;
  }

  /**
   * @param {any} value
   * @param {Object} formData
   * @return {Validation}
   */
  validate (value, formData) {
    for (const validator of this._validators) {
      const v = validator.validate(value, formData);
      if (v.valid === false) {
        return v;
      }
    }
    return VALID;
  }
}

/**
 * @type {Validator} A validator that always return VALID.
 */
const ALWAYS_VALID_VALIDATOR = new ValidValidator();

/**
 * Helps you to combine multiple validators in a CompositeValidator.
 *
 * @return {ValidatorsCombiner}
 */
export function validatorsBuilder () {
  /** @type {Array<Validator>} */
  const validators = [];
  /** @type {ValidatorsCombiner} */
  const combiner = {
    add (validator) {
      if (validator != null) {
        validators.push(validator);
      }
      return combiner;
    },
    combine () {
      return combineValidators(validators);
    },
  };
  return combiner;
}

/**
 * @param {Array<Validator>} validators
 * @return {Validator}
 */
function combineValidators (validators) {
  if (validators.length === 0) {
    return ALWAYS_VALID_VALIDATOR;
  }

  if (validators.length === 1) {
    return validators[0];
  }

  return new CompositeValidator(validators);
}
