import { describe, it, expect, vi } from 'vitest';
import {
  combineValidators,
  createValidator,
  EmailValidator,
  NumberValidator,
  RequiredValidator,
  Validation,
  ValidValidator,
} from '../../src/lib/form/validation.js';

/**
 * @typedef {import('../../src/lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../src/lib/form/validation.types.js').Validity} Validity
 * @typedef {import('../../src/lib/form/validation.types.js').ErrorMessage} ErrorMessage
 */

describe('validation', () => {
  it('VALID should be valid', () => {
    expect(Validation.VALID.valid).toEqual(true);
  });

  it('invalid should be invalid', () => {
    expect(Validation.invalid('').valid).toEqual(false);
  });

  it('invalid should have the given code invalid', () => {
    expect(Validation.invalid('given code').code).toEqual('given code');
  });

  describe('RequiredValidator', () => {
    it('should return valid when value is not empty string', () => {
      const validity = new RequiredValidator().validate('not empty', {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when value is not empty number', () => {
      const validity = new RequiredValidator().validate(42, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when value is not empty array', () => {
      const validity = new RequiredValidator().validate(['a'], {});

      expect(validity.valid).toEqual(true);
    });

    it('should return invalid when value is null', () => {
      const validity = new RequiredValidator().validate(null, {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('empty');
    });

    it('should return invalid when value is undefined', () => {
      const validity = new RequiredValidator().validate(undefined, {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('empty');
    });

    it('should return invalid when value is empty string', () => {
      const validity = new RequiredValidator().validate('', {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('empty');
    });

    it('should return invalid when value is NaN', () => {
      const validity = new RequiredValidator().validate(NaN, {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('empty');
    });

    it('should return invalid when value is empty array', () => {
      const validity = new RequiredValidator().validate([], {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('empty');
    });
  });

  describe('NumberValidator', () => {
    it('should return valid when number is set without any bounds', () => {
      const validity = new NumberValidator().validate(10, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is set with lower bound', () => {
      const validity = new NumberValidator({ min: 5 }).validate(10, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is set with upper bound', () => {
      const validity = new NumberValidator({ max: 15 }).validate(10, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is set with lower and upper bounds', () => {
      const validity = new NumberValidator({ min: 5, max: 15 }).validate(10, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is equal to lower bound', () => {
      const validity = new NumberValidator({ min: 5, max: 15 }).validate(5, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is equal to upper bound', () => {
      const validity = new NumberValidator({ min: 5, max: 15 }).validate(15, {});

      expect(validity.valid).toEqual(true);
    });

    it('should return valid when number is a string representation of a number', () => {
      const validity = new NumberValidator().validate('10', {});

      expect(validity.valid).toEqual(true);
    });

    it('should return invalid badType when number is not a number', () => {
      const validity = new NumberValidator().validate('not a number!!', {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('badType');
    });

    it('should return invalid rangeUnderflow when number is lower than the lower bound', () => {
      const validity = new NumberValidator({ min: 5 }).validate(4, {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('rangeUnderflow');
    });

    it('should return invalid rangeOverflow when number is greater than the upper bound', () => {
      const validity = new NumberValidator({ max: 15 }).validate(16, {});

      expect(validity.valid).toEqual(false);
      expect(validity.code).toEqual('rangeOverflow');
    });
  });

  describe('EmailValidator', () => {
    it('should return valid when value is a valid email address', () => {
      const validity = new EmailValidator().validate('valid-email.address@example.com', {});

      expect(validity.valid).toEqual(true);
    });

    describe('should return invalid when value is an invalid email address', () => {
      ['invalid address', '@address.com', 'address.com', 'invalid@address', 'invalid@address.', '  @   .   '].map(
        (address) =>
          it(`with "${address}"`, () => {
            const validity = new EmailValidator().validate(address, {});

            expect(validity.valid).toEqual(false);
            expect(validity.code).toEqual('badEmail');
          }),
      );
    });
  });

  describe('combineValidators', () => {
    /**
     * @implements {Validator}
     */
    class SpiedValidator {
      /**
       * @param {boolean} valid
       * @param {string} [code]
       */
      constructor(valid, code) {
        this._valid = valid;
        this._code = code;
        this.spy = vi.fn();
      }

      /**
       * @param {any} value
       * @param {Object} _formData
       * @return {Validity}
       */
      validate(value, _formData) {
        this.spy(value, _formData);
        return this._valid ? Validation.VALID : Validation.invalid(this._code);
      }
    }

    describe('validate method', () => {
      it('should call all validators until valid (first)', () => {
        const v1 = new SpiedValidator(false);
        const v2 = new SpiedValidator(true);
        const v3 = new SpiedValidator(true);
        const validator = combineValidators([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spy.mock.calls.length).toEqual(1);
        expect(v2.spy.mock.calls.length).toEqual(0);
        expect(v3.spy.mock.calls.length).toEqual(0);
      });

      it('should call all validators until valid (second)', () => {
        const v1 = new SpiedValidator(true);
        const v2 = new SpiedValidator(false);
        const v3 = new SpiedValidator(true);
        const validator = combineValidators([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spy.mock.calls.length).toEqual(1);
        expect(v2.spy.mock.calls.length).toEqual(1);
        expect(v3.spy.mock.calls.length).toEqual(0);
      });

      it('should call all validators until valid (third)', () => {
        const v1 = new SpiedValidator(true);
        const v2 = new SpiedValidator(true);
        const v3 = new SpiedValidator(false);
        const validator = combineValidators([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spy.mock.calls.length).toEqual(1);
        expect(v2.spy.mock.calls.length).toEqual(1);
        expect(v3.spy.mock.calls.length).toEqual(1);
      });

      it('should return first validator result', () => {
        const v1 = new SpiedValidator(false, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(true, 'v3');
        const validator = combineValidators([v1, v2, v3]);

        const validity = validator.validate('value', {});

        expect(validity).toEqual(Validation.invalid('v1'));
      });

      it('should return second validator result', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(false, 'v2');
        const v3 = new SpiedValidator(true, 'v3');
        const validator = combineValidators([v1, v2, v3]);

        const validity = validator.validate('value', {});

        expect(validity).toEqual(Validation.invalid('v2'));
      });

      it('should return third validator result', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(false, 'v3');
        const validator = combineValidators([v1, v2, v3]);

        const validity = validator.validate('value', {});

        expect(validity).toEqual(Validation.invalid('v3'));
      });

      it('should call validators with right arguments', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(false, 'v3');
        const validator = combineValidators([v1, v2, v3]);

        const value = 'value';
        const formData = {};

        validator.validate(value, formData);

        expect(v1.spy).toHaveBeenCalledWith(value, formData);
        expect(v2.spy).toHaveBeenCalledWith(value, formData);
        expect(v3.spy).toHaveBeenCalledWith(value, formData);
      });
    });

    it('should return the given validator when providing only one not null validator', () => {
      const requiredValidator = new RequiredValidator();

      const validator = combineValidators([requiredValidator]);

      expect(validator).toBe(requiredValidator);
    });

    it('should return an always valid validator when providing only null validators', () => {
      const validator = combineValidators([null, null, null]);

      expect(validator).toBeInstanceOf(ValidValidator);
    });

    it('should return an always valid validator when providing no validators', () => {
      const validator = combineValidators([]);

      expect(validator).toBeInstanceOf(ValidValidator);
    });
  });

  describe('createValidator', () => {
    it('should create validator with the given function', () => {
      const validateFunction = () => {};
      const validator = createValidator(validateFunction);

      expect(validator.validate).toEqual(validateFunction);
    });
  });
});
