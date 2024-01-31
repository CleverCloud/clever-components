import { LitElement, html, css } from 'lit';
import {
  iconRemixListSettingsLine as optionsLabelIcon,
  iconRemixShieldKeyholeLine as encryptionLabelIcon,
  iconRemixStackLine as versionLabelIcon,
} from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'Version',
  VERSION_DESC: '',
  ENCRYPTION_LABEL: 'Encryption at rest',
  ENCRYPTION_DESC: 'Encryption at rest encrypts the entire data disk of your add-on. It prevents reading the stored data in case of a physical access to the hard drive.',
  OPTIONS_LABEL: 'Options',
  KIBANA_VALUE: 'Kibana',
  KIBANA_DESC: 'Kibana is the admin UI for the Elastic Stack. It lets you visualize your Elasticsearch data and navigate the stack so you can do anything from tracking query load to understanding the way requests flow through your apps.',
  APM_VALUE: 'APM',
  APM_DESC: 'Elastic APM server is an application performance monitoring system built on the Elastic Stack. Deploying this will allow you to automatically send APM metrics from any applications linked to the Elasticsearch add-on instance, providing you add the Elastic APM agent to the application code.',
};

const TOGGLE_STRUCT = {
  default: 'true',
  options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }],
};

export class CtAddonOptions extends LitElement {
  static get properties () {
    return {
      options: { type: Array },
      versions: { type: Object },
    };
  };

  willUpdate (_changedProperties) {
    this.options.forEach((option) => {
      this._onOptionUpdate(option, (option === 'version' ? this.versions : TOGGLE_STRUCT).default);
    });
  }

  _renderOptionToggle (label, desc, options, value, option) {
    return html`
      <div class="option option--toggle">
        <div class="option--label">
          <div class="option--value">${label}</div>
          ${
            desc
              ? html`<div class="option--desc">${desc}</div>`
              : ''
          }
        </div>
        <div class="option--input">
          <cc-toggle value="${value}" .choices="${options}" @cc-toggle:input="${(e) => this._onOptionUpdate(option, e.detail)}"></cc-toggle>
        </div>
      </div>
    `;
  }

  _onOptionUpdate (option, val) {
    const value = (val === 'true' || val === 'false') ? val === 'true' : val;
    this.dispatchEvent(new CustomEvent('ct-addon-options:option-updated', {
      detail: { option, value },
      bubbles: true,
      composed: true,
    }));
  }

  render () {
    const hasVersion = this.options?.includes('version');
    const hasEncryption = this.options?.includes('encryption');
    const hasKibana = this.options?.includes('kibana');
    const hasApm = this.options?.includes('apm');
    const hasOptions = hasKibana || hasApm;
    // <cc-select value="${this.versions.default}" .options = '${this.versions.versions}'> < /cc-select>

    return html`
      ${
        hasVersion
          ? html`
            <ct-label-with-icon .icon="${versionLabelIcon}" .label="${WORDING.VERSION_LABEL}">
              <cc-toggle value="${this.versions.default}" .choices="${this.versions.versions}" @cc-toggle:input="${(e) => this._onOptionUpdate('version', e.detail)}"></cc-toggle>
            </ct-label-with-icon>
          `
          : ``
      }
      ${
        hasEncryption
          ? html`
            <ct-label-with-icon .icon="${encryptionLabelIcon}" .label="${WORDING.ENCRYPTION_LABEL}">
              <div class="subtitle">${WORDING.ENCRYPTION_DESC}</div>
              <cc-toggle value="${TOGGLE_STRUCT.default}" .choices="${TOGGLE_STRUCT.options}" @cc-toggle:input="${(e) => this._onOptionUpdate('encryption', e.detail)}"></cc-toggle>
            </ct-label-with-icon>
          `
          : ``
      }
      ${
        hasOptions
          ? html`
            <ct-label-with-icon .icon="${optionsLabelIcon}" .label="${WORDING.OPTIONS_LABEL}">
              <div class="options">
              ${
                hasKibana
                  ? this._renderOptionToggle(WORDING.KIBANA_VALUE, WORDING.KIBANA_DESC, TOGGLE_STRUCT.options, TOGGLE_STRUCT.default, 'kibana')
                  : ``
              }
              ${
                hasApm
                  ? this._renderOptionToggle(WORDING.APM_VALUE, WORDING.APM_DESC, TOGGLE_STRUCT.options, TOGGLE_STRUCT.default, 'apm')
                  : ``
              }
              </div>
            </ct-label-with-icon>
          `
          : ``
      }
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: contents;
        }
        
        .subtitle {
          position: relative;
          top: -0.5em;
        }

        .options {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .option {
          flex: 0 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
        .option--label,
        .option--input {
          flex: 0 0 auto;
        }
        
        .option--toggle .option--input {
          display: inline-flex;
        }
        
        .option--value {
          font-size: 1.25em;
          font-weight: 500;
        }
        .option--desc {
          color: var(--cc-color-text-weak);
        }
        
        cc-select {
          position: relative;
          top: -0.35em;
          width: 16em;
        }
        cc-toggle {
          font-size: 1.125em;
        }
      `,
    ];
  }
}

customElements.define('ct-addon-options', CtAddonOptions);
