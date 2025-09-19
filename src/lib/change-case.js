// any whitespace character, underscore, dot and dash
const WORD_SPLITTERS = /[\s_.-]+/;

const DIGIT_SEPARATOR = '_';

/**
 * pascalCase('string'); //=> 'String'
 * pascalCase('dot.case'); //=> 'DotCase'
 * pascalCase('PascalCase'); //=> 'PascalCase'
 * pascalCase('version 1.2.10'); //=> 'Version_1_2_1_0'
 * @param {String} input
 * @returns {String}
 */
export function pascalCase(input) {
  return stringToWordArray(input)
    .map((s, index) => pascalCaseTransform(s, index > 0))
    .join('');
}

/**
 * stringToWordArray('string'); //=> ['string']
 * stringToWordArray('dot.case'); //=> ['dot', 'case']
 * stringToWordArray('PascalCase'); //=> ['Pascal', 'Case']
 * stringToWordArray('version 1.2.10'); //=> ['version', '1', '2', '10']
 * @param {String} input
 * @returns {string[]}
 */
function stringToWordArray(input) {
  const processedInput = [input.charAt(0)];
  for (let i = 1; i < input.length; i++) {
    const isPreviousCharLowercase = input.charAt(i - 1).match(/[a-z]/g)?.length > 0;
    const isCurrentCharUppercase = input.charAt(i).match(/[A-Z]/g)?.length > 0;
    if (isPreviousCharLowercase && isCurrentCharUppercase) {
      // we consider that an uppercase letter following a lowercase letter is the beginning of a new word
      // (to handle the `stringToWordArray('PascalCase'); //=> ['Pascal', 'Case']` conversion
      processedInput.push(' ');
    }

    processedInput.push(input.charAt(i));
  }

  return processedInput.join('').split(WORD_SPLITTERS);
}

/**
 * pascalCaseTransform('string'); //=> 'String'
 * pascalCaseTransform('STRING'); //=> 'String'
 * pascalCaseTransform('0string'); //=> '0string'
 * pascalCaseTransform('0string', true); //=> '_0string'
 * @param {String} input
 * @param {Boolean} enableDigitPrefix
 * @returns {string}
 */
function pascalCaseTransform(input, enableDigitPrefix = true) {
  if (input == null || input === '') {
    return '';
  }

  const firstChar = input.charAt(0);
  const lowerChars = input.slice(1).toLowerCase();

  // if the first character is a digit, prefix it with `DIGIT_SEPARATOR`
  if (enableDigitPrefix && firstChar >= '0' && firstChar <= '9') {
    return `${DIGIT_SEPARATOR}${firstChar}${lowerChars}`;
  }

  return `${firstChar.toUpperCase()}${lowerChars}`;
}

/**
 * camelCase('string'); //=> 'string'
 * camelCase('dot.case'); //=> 'dotCase'
 * camelCase('PascalCase'); //=> 'pascalCase'
 * camelCase('snake_case'); //=> 'snakeCase'
 * camelCase('version 1.2.10'); //=> 'version_1_2_10'
 * @param {string} input
 * @returns {string}
 */
export function camelCase(input) {
  return stringToWordArray(input)
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      const firstChar = word.charAt(0).toUpperCase();
      const restChars = word.slice(1).toLowerCase();

      if (/^\d/.test(firstChar)) {
        return `_${firstChar}${restChars}`;
      }

      return `${firstChar}${restChars}`;
    })
    .join('');
}

/**
 * snakeCase('string'); //=> 'string'
 * snakeCase('dot.case'); //=> 'dot_case'
 * snakeCase('PascalCase'); //=> 'pascal_case'
 * snakeCase('camelCase'); //=> 'camel_case'
 * snakeCase('version 1.2.10'); //=> 'version_1_2_10'
 * @param {string} input
 * @returns {string}
 */
export function snakeCase(input) {
  return stringToWordArray(input)
    .map((word) => word.toLowerCase())
    .join('_');
}

/**
 * kebabCase('string'); //=> 'string'
 * kebabCase('dot.case'); //=> 'dot-case'
 * kebabCase('PascalCase'); //=> 'pascal-case'
 * kebabCase('camelCase'); //=> 'camel-case'
 * kebabCase('version 1.2.10'); //=> 'version-1-2-10'
 * @param {string} input
 * @returns {string}
 */
export function kebabCase(input) {
  return stringToWordArray(input)
    .map((word) => word.toLowerCase())
    .join('-');
}

/**
 * Inserts spaces between words in camelCase or PascalCase strings, making them more human-readable,
 * and capitalizes the first letter of each word.
 * Does not modify strings with underscores or numbers adjacent to underscores.
 *
 * camelCaseToSpacedCapitalized('string'); //=> 'String'
 * camelCaseToSpacedCapitalized('dotCase'); //=> 'Dot Case'
 * camelCaseToSpacedCapitalized('PascalCase'); //=> 'Pascal Case'
 * camelCaseToSpacedCapitalized('snakeCase'); //=> 'Snake Case'
 * camelCaseToSpacedCapitalized('version_1_2_10'); //=> 'Version_1_2_10'
 * camelCaseToSpacedCapitalized('version1_2_10'); //=> 'Version1_2_10'
 * @param {string} input
 * @returns {string}
 */
export function camelCaseToSpacedCapitalized(input) {
  // Insert a space before each uppercase letter (except the first char)
  const spaced = input.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
  // Capitalize the first letter of each word
  return spaced.replace(/\b\w/g, (c) => c.toUpperCase());
}
