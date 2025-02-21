/**
 * @param {object} _
 * @param {object} _.schema
 * @param {object} _.validators
 * @throws {InvalidSchemaOrValidatorsError}
 * @returns {CleverConfigSchema}
 */
export function init({ schema, validators }) {};

class CleverConfigSchema {

  /**
   * @returns {string}
   */
  generateDocs() {};

  /**
   * @param {string} sourceName
   * @param {Record<string, [string, boolean, number, null]>} values
   * @returns {this}
   */
  addSource(sourceName, values) {};

  /**
   * @returns {CleverConfig}
   * @throws {InvalidValuesError}
   */
  generateConfig() {};
}

class CleverConfig {
  /**
   * @param {string} name
   * @returns {any}
   */
  getValue (name) {};

  /**
   * @param {Array<string>} [tags]
   * @returns {Record<string, any>}
   */
  getAll (tags) {};

  // le truc au démarrage de la console côté serveur avec les secrets en ***
  debugValues() {};
}
