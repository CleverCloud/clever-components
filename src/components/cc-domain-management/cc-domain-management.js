import { css, html, LitElement } from 'lit';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-button/cc-button.js';

const MATCH = /\../;
/**
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('./cc-domain-management.types.js').DataListOption} DataListOption
 * @typedef {import('lit').PropertyValues<CcDomainManagement>} CcDomainManagementPropertyValues
 */

/**
 * A component to highlight a small chunk of text.
 *
 * @cssdisplay inline-block
 */
export class CcDomainManagement extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();

  }

  /**
   * @param {CustomEvent & { detail: string }} event
   */
  _onDomainInput ({ detail: value }) {
    value.toto = 'toto';
  }

  render () {
    return html`
      <cc-block>
        <div slot="title">Add a domain</div>
        <cc-input-text id="toto" label="Domain name" @cc-input-text:input=${this._onDomainInput}></cc-input-text>
        <cc-button>Add domain</cc-button>
        <div class="live-preview">

        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      css`

      `,
    ];
  }
}

window.customElements.define('cc-domain-management', CcDomainManagement);
