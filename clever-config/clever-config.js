/**
 * @typedef {import('./clever-config.types.js').OptionSchema} OptionSchema
 * @typedef {import('./clever-config.types.js').Validator} Validator
 * @typedef {import('./clever-config.types.js').RawValue} RawValue
 */

/**
 * @param {object} _
 * @param {Record<string, OptionSchema>} _.schema
 * @param {Record<string, Validator>} _.validators
 * @throws {InvalidSchemaOrValidatorsError}
 * @returns {CleverConfigSchema}
 */
export function init({ schema, validators }) {
  // validation du schema et des validateur
  // throw InvalidSchemaOrValidatorsError

  return new CleverConfigSchema(schema, validators);
}

class CleverConfigSchema {
  /**
   * @param {Record<string, OptionSchema>} schema
   * @param {Record<string, Validator>} validators
   */
  constructor(schema, validators) {
    this._schema = schema;
    this._validators = validators;

    /** @type {Record<string, Record<string, RawValue>>} */
    this._sources = {};
  }

  /**
   * @returns {string}
   */
  generateDocs() {}

  /**
   * @param {string} sourceName
   * @param {Record<string, RawValue>} source
   * @returns {this}
   */
  addSource(sourceName, source) {
    this._sources[sourceName] = source;
    return this;
  }

  /**
   * @returns {CleverConfig}
   * @throws {InvalidValuesError}
   */
  generateConfig() {
    /** @type {Record<string, any>} */
    const mergedConfig = {};

    Object.entries(this._sources).forEach(([sourceName, source]) => {
      Object.entries(source).forEach(([optionName, optionValue]) => {
        // TODO: use validators
        mergedConfig[optionName] = optionValue;
      });
    });

    return new CleverConfig(mergedConfig);
  }
}

class CleverConfig {
  /**
   * @param {string} name
   * @returns {any}
   */
  getValue(name) {}

  /**
   * @param {Array<string>} [tags]
   * @returns {Record<string, any>}
   */
  getAll(tags) {}

  // le truc au démarrage de la console côté serveur avec les secrets en ***
  debugValues() {}
}

class InvalidSchemaOrValidatorsError extends Error {}
