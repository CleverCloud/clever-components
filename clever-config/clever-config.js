/**
 * @typedef {import('./clever-config.types.js').OptionSchema} OptionSchema
 * @typedef {import('./clever-config.types.js').Validator} Validator
 * @typedef {import('./clever-config.types.js').RawValue} RawValue
 * @typedef {import('./clever-config.types.js').ValueSource} ValueSource
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

    const validationErrors = [];

    Object.entries(this._sources).forEach(([sourceName, source]) => {
      Object.entries(source).forEach(([optionName, optionValue]) => {
        // TODO: use validators

        const validation = this._validators[this._schema[optionName].format].validate(optionValue);

        if (validation.type === 'error') {
          validationErrors.push({ source, optionName, value: optionValue, validation });
        } else {
          mergedConfig[optionName] = { source: sourceName, schema: this._schema[optionName], value: validation.value };
        }
      });
    });

    if (validationErrors.length > 0) {
      throw new InvalidValuesError();
    }

    return new CleverConfig(mergedConfig);
  }
}

class CleverConfig {
  /**
   *
   * @param {Record<string, ValueSource>} values
   */
  constructor(values) {
    /** @type {Record<string, any>} values */
    this._values = values;
  }

  /**
   * @param {string} name
   * @returns {any}
   */
  getValue(name) {
    return this._values[name]?.value;
  }

  /**
   * @param {string} [tag]
   * @returns {Record<string, any>}
   */
  getAll(tag) {
    return Object.fromEntries(
      Object.entries(this._values)
        .filter(([_, valueSource]) => {
          return tag == null || (valueSource.schema.tags?.includes(tag) ?? false);
        })
        .map(([optionName, valueSource]) => {
          return [optionName, valueSource.value];
        }),
    );
  }

  // le truc au démarrage de la console côté serveur avec les secrets en ***
  debugValues() {}
}

export class InvalidSchemaOrValidatorsError extends Error {}

export class InvalidValuesError extends Error {}
