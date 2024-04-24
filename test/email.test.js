import { expect } from '@bundled-es-modules/chai';
import { validateEmailAddress } from '../src/lib/email.js';

describe('validateEmailAddress', () => {
  it('returns null when address is valid', () => {
    expect(validateEmailAddress('valid-email.address@clever-cloud.com')).to.equal(null);
  });

  describe(`returns 'empty'`, () => {
    it('when address is null', () => {
      expect(validateEmailAddress(null)).to.equal('empty');
    });

    it('when address is undefined', () => {
      expect(validateEmailAddress(undefined)).to.equal('empty');
    });

    it('when address is an empty string', () => {
      expect(validateEmailAddress('')).to.equal('empty');
    });
  });

  describe(`returns 'invalid'`, () => {
    it('when address is not valid', () => {
      expect(validateEmailAddress('invalid address')).to.equal('invalid');
      expect(validateEmailAddress('@address.com')).to.equal('invalid');
      expect(validateEmailAddress('address.com')).to.equal('invalid');
      expect(validateEmailAddress('invalid@address')).to.equal('invalid');
      expect(validateEmailAddress('invalid@address.')).to.equal('invalid');
      expect(validateEmailAddress('  @   .   ')).to.equal('invalid');
    });
  });
});
