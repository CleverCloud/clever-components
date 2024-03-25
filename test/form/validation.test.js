import { expect } from '@bundled-es-modules/chai';
import * as handbi from 'hanbi';
import {
  CompositeValidator,
  EmailValidator,
  invalid,
  NumberValidator,
  RequiredValidator,
  VALID,
  ValidValidator,
} from '../../src/lib/form/validation.js';

/**
 * @typedef {import('../../src/lib/form/validation.types.js').Validator} Validator
 * @typedef {import('../../src/lib/form/validation.types.js').Validation} Validation
 * @typedef {import('../../src/lib/form/validation.types.js').ErrorMessage} ErrorMessage
 */

describe('validation', () => {
  it('VALID should be valid', () => {
    expect(VALID.valid).to.eql(true);
  });

  it('invalid should be invalid', () => {
    expect(invalid('').valid).to.eql(false);
  });

  it('invalid should have the given code invalid', () => {
    expect(invalid('given code').code).to.eql('given code');
  });

  describe('RequiredValidator', () => {
    it('should return valid when value is not empty string', () => {
      const validation = new RequiredValidator().validate('not empty', {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when value is not empty number', () => {
      const validation = new RequiredValidator().validate(42, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when value is not empty array', () => {
      const validation = new RequiredValidator().validate(['a'], {});

      expect(validation.valid).to.eql(true);
    });

    it('should return invalid when value is null', () => {
      const validation = new RequiredValidator().validate(null, {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('empty');
    });

    it('should return invalid when value is undefined', () => {
      const validation = new RequiredValidator().validate(undefined, {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('empty');
    });

    it('should return invalid when value is empty string', () => {
      const validation = new RequiredValidator().validate('', {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('empty');
    });

    it('should return valid when value is NaN', () => {
      const validation = new RequiredValidator().validate(NaN, {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('empty');
    });

    it('should return valid when value is empty array', () => {
      const validation = new RequiredValidator().validate([], {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('empty');
    });
  });

  describe('NumberValidator', () => {
    it('should return valid when number is set without any bounds', () => {
      const validation = new NumberValidator().validate(10, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is set with lower bound', () => {
      const validation = new NumberValidator({ min: 5 }).validate(10, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is set with upper bound', () => {
      const validation = new NumberValidator({ max: 15 }).validate(10, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is set with lower and upper bounds', () => {
      const validation = new NumberValidator({ min: 5, max: 15 }).validate(10, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is equal to lower bound', () => {
      const validation = new NumberValidator({ min: 5, max: 15 }).validate(5, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is equal to upper bound', () => {
      const validation = new NumberValidator({ min: 5, max: 15 }).validate(15, {});

      expect(validation.valid).to.eql(true);
    });

    it('should return valid when number is a string representation of a number', () => {
      const validation = new NumberValidator().validate('10', {});

      expect(validation.valid).to.eql(true);
    });

    it('should return invalid badType when number is not a number', () => {
      const validation = new NumberValidator().validate('not a number!!', {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('badType');
    });

    it('should return invalid rangeUnderflow when number is lower than the lower bound', () => {
      const validation = new NumberValidator({ min: 5 }).validate(4, {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('rangeUnderflow');
    });

    it('should return invalid rangeOverflow when number is greater than the upper bound', () => {
      const validation = new NumberValidator({ max: 15 }).validate(16, {});

      expect(validation.valid).to.eql(false);
      expect(validation.code).to.eql('rangeOverflow');
    });
  });

  describe('EmailValidator', () => {
    it('should return valid when value is a valid email address', () => {
      const validation = new EmailValidator().validate('valid-email.address@example.com', {});

      expect(validation.valid).to.eql(true);
    });

    describe('should return invalid when value is an invalid email address', () => {
      [
        'invalid address',
        '@address.com',
        'address.com',
        'invalid@address',
        'invalid@address.',
        '  @   .   ',
      ].map((address) =>
        it(`with "${address}"`, () => {
          const validation = new EmailValidator().validate(address, {});

          expect(validation.valid).to.eql(false);
          expect(validation.code).to.eql('badEmail');
        }));
    });
  });

  describe('CompositeValidator', () => {
    /**
     * @implements {Validator}
     */
    class SpiedValidator {
      /**
       * @param {boolean} valid
       * @param {string} [code]
       */
      constructor (valid, code) {
        this._valid = valid;
        this._code = code;
        this.spies = {
          validate: handbi.spy(),
          getErrorMessage: handbi.spy(),
        };
      }

      /**
       * @param {any} value
       * @param {Object} _formData
       * @return {Validation}
       */
      validate (value, _formData) {
        this.spies.validate.handler(value, _formData);
        return this._valid ? VALID : invalid(this._code);
      }
    }

    describe('validate method', () => {
      it('should call all validators until valid (first)', () => {
        const v1 = new SpiedValidator(false);
        const v2 = new SpiedValidator(true);
        const v3 = new SpiedValidator(true);
        const validator = new CompositeValidator([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spies.validate.callCount).to.eql(1);
        expect(v2.spies.validate.callCount).to.eql(0);
        expect(v3.spies.validate.callCount).to.eql(0);
      });

      it('should call all validators until valid (second)', () => {
        const v1 = new SpiedValidator(true);
        const v2 = new SpiedValidator(false);
        const v3 = new SpiedValidator(true);
        const validator = new CompositeValidator([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spies.validate.callCount).to.eql(1);
        expect(v2.spies.validate.callCount).to.eql(1);
        expect(v3.spies.validate.callCount).to.eql(0);
      });

      it('should call all validators until valid (third)', () => {
        const v1 = new SpiedValidator(true);
        const v2 = new SpiedValidator(true);
        const v3 = new SpiedValidator(false);
        const validator = new CompositeValidator([v1, v2, v3]);

        validator.validate('value', {});

        expect(v1.spies.validate.callCount).to.eql(1);
        expect(v2.spies.validate.callCount).to.eql(1);
        expect(v3.spies.validate.callCount).to.eql(1);
      });

      it('should return first validator result', () => {
        const v1 = new SpiedValidator(false, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(true, 'v3');
        const validator = new CompositeValidator([v1, v2, v3]);

        const validation = validator.validate('value', {});

        expect(validation).to.eql(invalid('v1'));
      });

      it('should return second validator result', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(false, 'v2');
        const v3 = new SpiedValidator(true, 'v3');
        const validator = new CompositeValidator([v1, v2, v3]);

        const validation = validator.validate('value', {});

        expect(validation).to.eql(invalid('v2'));
      });

      it('should return third validator result', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(false, 'v3');
        const validator = new CompositeValidator([v1, v2, v3]);

        const validation = validator.validate('value', {});

        expect(validation).to.eql(invalid('v3'));
      });

      it('should call validators with right arguments', () => {
        const v1 = new SpiedValidator(true, 'v1');
        const v2 = new SpiedValidator(true, 'v2');
        const v3 = new SpiedValidator(false, 'v3');
        const validator = new CompositeValidator([v1, v2, v3]);

        const value = 'value';
        const formData = {};

        validator.validate(value, formData);

        expect(v1.spies.validate.calledWith(value, formData)).to.eql(true);
        expect(v2.spies.validate.calledWith(value, formData)).to.eql(true);
        expect(v3.spies.validate.calledWith(value, formData)).to.eql(true);
      });
    });

    describe('builder', () => {
      it('should return the given validator when providing only one not null validator', () => {
        const requiredValidator = new RequiredValidator();
        const validatorBuilder = CompositeValidator.builder()
          .add(requiredValidator);

        const validator = validatorBuilder.build();

        expect(validator).to.equal(requiredValidator);
      });

      it('should return an always valid validator when providing only null validators', () => {
        const validatorBuilder = CompositeValidator.builder()
          .add(null)
          .add(null)
          .add(null)
        ;

        const validator = validatorBuilder.build();

        expect(validator).to.be.instanceOf(ValidValidator);
      });

      it('should return an always valid validator when providing no validators', () => {
        const validatorBuilder = CompositeValidator.builder();

        const validator = validatorBuilder.build();

        expect(validator).to.be.instanceOf(ValidValidator);
      });

      it('should create a CompositeValidator instance when providing at least two not null validators', () => {
        const validatorBuilder = CompositeValidator.builder()
          .add(new RequiredValidator())
          .add(new NumberValidator());

        const validator = validatorBuilder.build();

        expect(validator).to.be.instanceOf(CompositeValidator);
      });

      it('should create a CompositeValidator with the right validators', () => {
        const v1 = new RequiredValidator();
        const v2 = new NumberValidator();
        const v3 = new EmailValidator();
        const validatorBuilder = CompositeValidator.builder()
          .add(v1)
          .add(v2)
          .add(v3)
        ;

        const validator = validatorBuilder.build();

        expect(validator._validators).to.eql([v1, v2, v3]);
      });
    });
  });
});
