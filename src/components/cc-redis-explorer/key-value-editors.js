import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../cc-input-text/cc-input-text.js';
import './cc-redis-key-hash-editor.js';
import './cc-redis-key-list-editor.js';

/**
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValue} CcRedisKeyValue
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueString} CcRedisKeyValueString
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueHash} CcRedisKeyValueHash
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyValueList} CcRedisKeyValueList
 * @typedef {import('./cc-redis-explorer.types.js').CcRedisKeyType} CcRedisKeyType
 * @typedef {import('../../lib/form/form.types.js').FormDataMap} FormDataMap
 *
 */

/**
 * @template {CcRedisKeyValue} T
 * @abstract
 */
export class KeyValueEditor {
  /**
   *
   * @param {T|null} _keyValue
   * @return {TemplateResult}
   */
  render(_keyValue) {
    throw new Error('Not implemented');
  }

  /**
   * @param {string} _key
   * @param {FormDataMap} _formData
   * @return {T}
   */
  decodeFormData(_key, _formData) {
    throw new Error('Not implemented');
  }
}

/**
 * @extends {KeyValueEditor<CcRedisKeyValueString>}
 */
export class KeyValueEditorString extends KeyValueEditor {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'string';
  }

  /**
   * @param {CcRedisKeyValueString|null} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`<cc-input-text
      name="value"
      label="Value"
      multi
      reset-value=${ifDefined(keyValue?.value ?? undefined)}
      value=${ifDefined(keyValue?.value ?? undefined)}
    ></cc-input-text>`;
  }

  /**
   * @param {string} key
   * @param {FormDataMap} formData
   * @return {CcRedisKeyValueString}
   */
  decodeFormData(key, formData) {
    return {
      key,
      type: 'string',
      // @ts-ignore: we know this is a string coming from <cc-input-text>
      value: formData.value,
    };
  }
}

/**
 * @extends {KeyValueEditor<CcRedisKeyValueHash>}
 */
export class KeyValueEditorHash extends KeyValueEditor {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'hash';
  }

  /**
   * @param {CcRedisKeyValueHash|null} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`<cc-redis-key-hash-editor
      name="values"
      required
      .resetValue=${ifDefined(keyValue?.values ?? undefined)}
      .value=${ifDefined(keyValue?.values ?? undefined)}
    ></cc-redis-key-hash-editor>`;
  }

  /**
   * @param {string} key
   * @param {FormDataMap} formData
   * @return {CcRedisKeyValueHash}
   */
  decodeFormData(key, formData) {
    return {
      key,
      type: 'hash',
      // @ts-ignore: we know this is an Array<entry json object> coming from <cc-redis-key-hash-editor>
      values: (Array.isArray(formData.values) ? formData.values : [formData.values]).map((entry) => JSON.parse(entry)),
    };
  }
}

/**
 * @extends {KeyValueEditor<CcRedisKeyValueList>}
 */
export class KeyValueEditorList extends KeyValueEditor {
  /**
   * @return {CcRedisKeyType}
   */
  get type() {
    return 'list';
  }

  /**
   * @param {CcRedisKeyValueList|null} keyValue
   * @return {TemplateResult}
   */
  render(keyValue) {
    return html`<cc-redis-key-list-editor
      name="values"
      required
      .resetValue=${ifDefined(keyValue?.values ?? undefined)}
      .value=${ifDefined(keyValue?.values ?? undefined)}
    ></cc-redis-key-list-editor>`;
  }

  /**
   * @param {string} key
   * @param {FormDataMap} formData
   * @return {CcRedisKeyValueList}
   */
  decodeFormData(key, formData) {
    return {
      key,
      type: 'list',
      // @ts-ignore: we know this is an Array<string> coming from cc-redis-key-list-editor
      // todo: we can have a string if there is only one item in the form :(
      values: Array.isArray(formData.values) ? formData.values : [formData.values],
    };
  }
}

const KEY_EDITORS = {
  string: new KeyValueEditorString(),
  hash: new KeyValueEditorHash(),
  list: new KeyValueEditorList(),
};

/**
 * @param {CcRedisKeyType} type
 * @return {KeyValueEditor<T>|null}
 * @template {CcRedisKeyValue} T
 */
export function getKeyEditor(type) {
  // @ts-ignore
  return KEY_EDITORS[type];
}
