import { css, html, LitElement } from 'lit';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import '../../src/components/cc-tile-instances/cc-tile-instances.smart.js';
import { sandboxStyles } from '../sandbox-styles.js';

class CcTileInstancesSandbox extends LitElement {
  static get properties() {
    return {
      _ownerId: { type: String, state: true },
      _applicationId: { type: String, state: true },
    };
  }

  constructor() {
    super();
    this._ownerId = 'orga_3547a882-d464-4c34-8168-add4b3e0c135';
    this._applicationId = 'app_7c6f466c-3314-4753-9e06-f87912f6b856';
  }

  _onOwnerIdChange({ detail }) {
    this._ownerId = detail;
  }

  _onApplicationIdChange({ detail }) {
    this._applicationId = detail;
  }

  _onApply() {
    this.shadowRoot.querySelector('cc-smart-container').context = {
      ownerId: this._ownerId,
      appId: this._applicationId,
    };
  }

  render() {
    return html`
      <div class="ctrl-top" style="align-items: normal">
        <cc-input-text
          .value="${this._ownerId}"
          label="ownerId"
          @cc-input-text:input="${this._onOwnerIdChange}"
          required
        ></cc-input-text>
        <cc-input-text
          .value="${this._applicationId}"
          label="applicationId"
          @cc-input-text:input="${this._onApplicationIdChange}"
          required
        ></cc-input-text>
        <cc-button @cc-button:click="${this._onApply}">Apply</cc-button>
      </div>

      <cc-smart-container>
        <cc-tile-instances class="main"></cc-tile-instances>
      </cc-smart-container>
    `;
  }

  firstUpdated() {
    this._onApply();
  }

  static get styles() {
    return [
      sandboxStyles,
      css`
        :host {
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
        }

        cc-smart-container {
          display: flex;
          min-height: 0;
          flex: 1;
          flex-direction: column;
        }

        cc-tile-instances {
          background: #fff !important;
          width: 18em;
        }

        cc-input-text {
          --cc-input-font-family: var(--cc-ff-monospace);

          width: 22.5em;
        }

        cc-button {
          margin-top: var(--cc-margin-top-btn-horizontal-form);
        }
      `,
    ];
  }
}

window.customElements.define('cc-tile-instances-sandbox', CcTileInstancesSandbox);
