import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../cc-input-text/cc-input-text.js';

/**
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueString} CcRedisKeyValueString
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueHash} CcRedisKeyValueHash
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueList} CcRedisKeyValueList
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 *
 */

export class KeyValueEditorString {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'string';
  }

  /**
   * @param {CcRedisKeyValueString} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`<cc-input-text
      name="value"
      multi
      required
      reset-value=${ifDefined(keyValue?.value ?? undefined)}
      value=${ifDefined(keyValue?.value ?? undefined)}
    ></cc-input-text>`;
  }

  /**
   * @param {FormDataMap} formData
   */
  decodeFormData(formData) {
    return {
      value: formData.value,
    };
  }
}

export class KeyValueEditorList {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'list';
  }

  /**
   * @param {CcRedisKeyValueList} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`list editor`;
  }

  /**
   * @param {FormDataMap} formData
   */
  decodeFormData(formData) {
    return {};
  }
}

export class KeyValueEditorHash {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'hash';
  }

  /**
   * @param {CcRedisKeyValueHash} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`hash editor`;
  }

  /**
   * @param {FormDataMap} formData
   */
  decodeFormData(formData) {
    return {};
  }
}
