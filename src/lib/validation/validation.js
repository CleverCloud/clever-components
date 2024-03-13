/**
 * @typedef {import('./validation.types.js').ValidValidation} ValidValidation
 * @typedef {import('./validation.types.js').InvalidValidation} InvalidValidation
 * @typedef {import('./validation.types.js').Validator} Validator
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

/**
 * @implements Validator
 */
export class RequiredValidator {
  validate (value) {
    return isEmpty(value) ? invalid('empty') : VALID;
  }
}

/**
 * @implements Validator
 */
export class CompositeValidator {
  constructor (validators) {
    this._validators = validators;
  }

  getErrorMessage (code) {
    for (const validator of this._validators) {
      try {
        return validator.getErrorMessage(code);
      }
      catch (e) {
      }
    }
    throw new Error(`Unsupported error code ${code}`);
  }

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
 * @implements Validator
 */
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

  validate (value, formData) {
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

/**
 * @implements Validator
 */
export class EmailValidator {
  validate (value) {
    if (!value.match(/^\S+@\S+\.\S+$/gm)) {
      return invalid('badEmail');
    }

    return VALID;
  }
}

export class ValidValidator {
  getErrorMessage (code) {
    throw new Error('Unsupported error code');
  }

  validate (value) {
    return VALID;
  }
}

/**
 * @implements Validator
 */
export class FunctionValidator {

  constructor (validationFunction) {
    this._validationFunction = validationFunction;
  }

  validate (value, formData) {
    const result = this._validationFunction(value, formData);
    return result == null ? VALID : invalid(result);
  }
}

export function validatorsBuilder () {
  const validators = [];
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

function combineValidators (validators) {
  if (validators.length === 0) {
    return new ValidValidator();
  }

  if (validators.length === 1) {
    return validators[0];
  }

  return new CompositeValidator(validators);
}
