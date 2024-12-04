import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../../src/components/cc-access-logs/cc-access-logs.js';
import '../../src/components/cc-access-logs/cc-access-logs.smart.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-select/cc-select.js';
import { formSubmit } from '../../src/lib/form/form-submit-directive.js';
import { sandboxStyles } from '../sandbox-styles.js';

// console prod
// const INITIAL_OWNER = 'orga_858600a8-74f4-4d75-a8a3-f5b868be093c';
// const INITIAL_APP = 'app_1246f211-d4a7-4787-ba62-56c163a8b4ef';

// test app
const INITIAL_OWNER = 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
const INITIAL_APP = 'app_46ec6a5c-1512-401f-ad40-1864ad5050f0';

/**
 * @typedef {import('../../src/components/cc-smart-container/cc-smart-container.js').CcSmartContainer} CcSmartContainer
 * @typedef {import('../../src/lib/form/form.types.js').FormDataMap} FormDataMap
 * @typedef {import('lit').PropertyValues<CcAccessLogsSandbox>} PropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLFormElement>} HTMLFormElementRef
 * @typedef {import('lit/directives/ref.js').Ref<CcSmartContainer>} CcSmartContainerRef
 */

class CcAccessLogsSandbox extends LitElement {
  constructor() {
    super();

    /** @type {HTMLFormElementRef} */
    this._formRef = createRef();

    /** @type {CcSmartContainerRef} */
    this._smartContainerRef = createRef();

    this._onFormSubmit = this._onFormSubmit.bind(this);
  }

  /**
   * @param {FormDataMap} formData
   */
  _onFormSubmit(formData) {
    this._smartContainerRef.value.context = {
      ownerId: formData.ownerId,
      appId: formData.applicationId,
    };
  }

  render() {
    return html`
      <form class="ctrl-top" style="align-items: normal" ${ref(this._formRef)} ${formSubmit(this._onFormSubmit)}>
        <cc-input-text label="ownerId" name="ownerId" value=${INITIAL_OWNER} required></cc-input-text>
        <cc-input-text label="applicationId" name="applicationId" value=${INITIAL_APP} required></cc-input-text>
        <cc-button type="submit">Apply</cc-button>
      </form>

      <cc-smart-container ${ref(this._smartContainerRef)}>
        <cc-access-logs-beta class="cc-access-logs main"></cc-access-logs-beta>
      </cc-smart-container>
    `;
  }

  /**
   * @param {PropertyValues} _changedProperties
   */
  firstUpdated(_changedProperties) {
    this.updateComplete.then(() => {
      this._formRef.value.requestSubmit();
    });
  }

  static get styles() {
    return [
      sandboxStyles,
      css`
        :host {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }

        cc-smart-container {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }

        .cc-access-logs {
          flex: 1;
          min-height: 0;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace);

          width: 22em;
        }

        cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }
      `,
    ];
  }
}

window.customElements.define('cc-access-logs-sandbox', CcAccessLogsSandbox);
