import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../../src/components/cc-logs-application-view/cc-logs-application-view.smart.js';
import '../../src/components/cc-logs-application-view/cc-logs-application-view.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import { sandboxStyles } from '../sandbox-styles.js';

class CcLogsSandbox extends LitElement {
  static get properties () {
    return {
      _ownerId: { type: String, state: true },
      _applicationId: { type: String, state: true },
    };
  }

  constructor () {
    super();
    this._ownerId = 'orga_540caeb6-521c-4a19-a955-efe6da35d142';
    this._applicationId = 'app_d0969d3a-5317-4e62-91e3-7adfe66acfa4';
    // this._deploymentId = 'deployment_1c195ebf-c48f-464d-b182-ba79e0187bce';

    /** @type {Ref<CcLogsApplicationView>} A reference to cc-logs-application-view component. */
    this._logsRef = createRef();
  }

  _onOwnerIdChange ({ detail }) {
    this._ownerId = detail;
  }

  _onApplicationIdChange ({ detail }) {
    this._applicationId = detail;
  }

  _onDeploymentIdChange ({ detail }) {
    this._deploymentId = detail;
  }

  _onApply () {
    this.shadowRoot.querySelector('cc-smart-container').context = {
      ownerId: this._ownerId,
      appId: this._applicationId,
      deploymentId: this._deploymentId == null || this._deploymentId.length === 0 ? null : this._deploymentId,
    };
  }

  render () {
    return html`
      <div class="ctrl-top">
        <cc-input-text .value=${this._ownerId} label="ownerId" @cc-input-text:input=${this._onOwnerIdChange} required></cc-input-text>
        <cc-input-text .value=${this._applicationId} label="applicationId" @cc-input-text:input=${this._onApplicationIdChange} required></cc-input-text>
        <cc-input-text .value=${this._deploymentId} label="deploymentId" @cc-input-text:input=${this._onDeploymentIdChange}></cc-input-text>
        <cc-button @cc-button:click=${this._onApply}>Apply</cc-button>
      </div>
      
      <cc-smart-container>
        <cc-logs-application-view-beta ${ref(this._logsRef)} class="main"></cc-logs-application-view-beta>
      </cc-smart-container>
    `;
  }

  firstUpdated (changedProperties) {
    this._onApply();
  }

  static get styles () {
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

        cc-logs-application-view-beta {
          min-height: 0;
          flex: 1;
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

window.customElements.define('cc-logs-application-view-sandbox', CcLogsSandbox);
