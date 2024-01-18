import { LitElement, html, css } from 'lit';
import { iconRemixListSettingsLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  LABEL: 'Options',
  VERSION_VALUE: 'Version',
  VERSION_DESC: '',
  ENCRYPTION_VALUE: 'Encryption at rest',
  ENCRYPTION_DESC: 'Encryption at rest encrypts the entire data disk of your add-on. It prevents reading the stored data in case of a physical access to the hard drive.',
  KIBANA_VALUE: 'Kibana',
  KIBANA_DESC: 'Kibana is the admin UI for the Elastic Stack. It lets you visualize your Elasticsearch data and navigate the stack so you can do anything from tracking query load to understanding the way requests flow through your apps.',
  APM_VALUE: 'APM',
  APM_DESC: 'Elastic APM server is an application performance monitoring system built on the Elastic Stack. Deploying this will allow you to automatically send APM metrics from any applications linked to the Elasticsearch add-on instance, providing you add the Elastic APM agent to the application code.',
};

const TOGGLE_STRUCT = {
  default: 'true',
  options: [{ label: 'ON', value: 'true' }, { label: 'OFF', value: 'false' }],
};

export class CtAddonOptions extends LitElement {
  static get properties () {
    return {
      options: { type: Array },
      versions: { type: Object },
    };
  };

  _renderOptionSelect (label, desc, options, value) {
    return html`
      <div class="option option--select">
        <div class="option--label">
          <div class="option--value">${label}</div>
          ${
            desc
            ? html`<div class="option--desc">${desc}</div>`
            : ''
          }
        </div>
        <div class="option--input">
          <cc-select
            value="${value}"
            .options="${options}"
          ></cc-select>
        </div>
      </div>
    `;
  }

  _renderOptionToggle (label, desc, options, value) {
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
          <cc-toggle
            value="${value}"
            .choices="${options}"
          ></cc-toggle>
        </div>
      </div>
    `;
  }

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.LABEL}">
        <div class="options">
        ${
          this.options?.map((option) => {
            if (option === 'version') {
              return this._renderOptionSelect(WORDING.VERSION_VALUE, WORDING.VERSION_DESC, this.versions.versions, this.versions.default);
            }
            else if (option === 'encryption') {
              return this._renderOptionToggle(WORDING.ENCRYPTION_VALUE, WORDING.ENCRYPTION_DESC, TOGGLE_STRUCT.options, TOGGLE_STRUCT.default);
            }
            else if (option === 'kibana') {
              return this._renderOptionToggle(WORDING.KIBANA_VALUE, WORDING.KIBANA_DESC, TOGGLE_STRUCT.options, TOGGLE_STRUCT.default);
            }
            else if (option === 'apm') {
              return this._renderOptionToggle(WORDING.APM_VALUE, WORDING.APM_DESC, TOGGLE_STRUCT.options, TOGGLE_STRUCT.default);
            }
            return ``;
          })
        }
        </div>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
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
      `,
    ];
  }
}

customElements.define('ct-addon-options', CtAddonOptions);
