/**
 * @typedef {import("./clever-config.types.js").Validator} Validator
 */

/** @type {Validator} */
export const stringNonEmpty = {
  documentation: 'toto',
  validate(value) {
    const isValid = typeof value === 'string' && value.length > 0;

    if (isValid) {
      return { type: 'success', value };
    } else {
      return { type: 'error', message: 'provide a string!!!' };
    }
  },
};
