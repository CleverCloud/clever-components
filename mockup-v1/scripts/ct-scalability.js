import { LitElement, html, css } from 'lit';
// TODO scale not chosen because of load balancer theme
// TODO test with iconRemixDashboard_3Line
import {
  iconRemixSwapLine as labelIcon,
  iconRemixCpuLine as iconCpu,
  iconRemixRam_2Fill as iconRam,
} from '../../src/assets/cc-remix.icons.js';
import { prepareNumberBytesFormatter } from '../../src/lib/i18n-number.js';
import { API_APPS_RAW } from '../api/apps.js';

const WORDING = {
  VERSION_LABEL: 'Scalability',
  AUTO_SCALABILITY: 'Auto-scalability',
  AUTO_SCALABILITY_DESC: 'Enable dynamic load balancing. You define a range of min and max values for scaler size and amount, and the system choose the best configuration according to your app\'s load.',
  VERTICAL_SCALING_OFF: 'Instance size',
  VERTICAL_SCALING_ON: 'Vertical scaling',
  HORIZONTAL_SCALING_OFF: 'Instance count',
  HORIZONTAL_SCALING_ON: 'Horizontal scaling',
  HORIZONTAL_SCALING_ON_DESC_1: 'Minimum instances count',
  HORIZONTAL_SCALING_ON_DESC_2: 'Maximum instances count',
};

const TOGGLE_STRUCT = {
  default: 'false',
  options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }],
};

const formatBytes = prepareNumberBytesFormatter('en', 'B', ' ');

export class CtScalability extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
      currentFlavor: { type: Object },
      enabled: { type: Boolean },
      _rawApplication: { type: Object, state: true },
      _sortedFlavors: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.enabled = TOGGLE_STRUCT.default;
  }

  get isEnabled () {
    return this.enabled === 'true';
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('product')) {
      const [type, slug] = this.product.id.split('::');
      this._rawApplication = API_APPS_RAW.find((app) => app.type === type && (slug == null || app.variant.slug === slug));

      this._sortedFlavors = [...this._rawApplication.flavors];
      this._sortedFlavors.sort((a, b) => (a.cpu * a.mem) - (b.cpu * b.mem));

      this.currentFlavor = this._sortedFlavors.find((flavor) => flavor.name === this._rawApplication.defaultFlavor.name) ?? this._sortedFlavors[0];
    }
  }

  _onAutoScalabilityUpdate (e) {
    this.enabled = e.detail;
  }

  _onFlavorClick (flavor) {
    this.currentFlavor = flavor;
  }

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <div class="options">
          <div class="option option--toggle">
            <div class="option--label">
              <div class="option--value">${WORDING.AUTO_SCALABILITY}</div>
              <div class="option--desc">${WORDING.AUTO_SCALABILITY_DESC}</div>
            </div>
            <div class="option--input">
              <cc-toggle
                value="${this.enabled}"
                .choices="${TOGGLE_STRUCT.options}"
                @cc-toggle:input="${this._onAutoScalabilityUpdate}"
              ></cc-toggle>
            </div>
          </div>
          ${
            !this.isEnabled
            ? html`
              <div class="option option--toggle">
                <div class="option--label">
                  <div class="option--value">${WORDING.HORIZONTAL_SCALING_OFF}</div>
                </div>
                <div class="option--input">
                  <cc-input-number value="1" min="1" max="${this._rawApplication.maxInstances}" controls></cc-input-number>
                </div>
              </div>
            `
            : html`
              <div class="option option--toggle">
                <div class="option--label">
                  <div class="option--value">${WORDING.HORIZONTAL_SCALING_ON}</div>
                  <div class="option--desc">${WORDING.HORIZONTAL_SCALING_ON_DESC_1}</div>
                </div>
                <div class="option--input">
                  <cc-input-number value="1" min="1" max="${this._rawApplication.maxInstances}" controls></cc-input-number>
                </div>
              </div>
              <div class="option option--toggle">
                <div class="option--label">
                  <div class="option--desc">${WORDING.HORIZONTAL_SCALING_ON_DESC_2}</div>
                </div>
                <div class="option--input">
                  <cc-input-number value="40" min="1" max="${this._rawApplication.maxInstances}" controls></cc-input-number>
                </div>
              </div>
            `
          }
          <div class="option">
            <div class="option--label">
              <div class="option--value">
                ${this.isEnabled ? WORDING.VERTICAL_SCALING_ON : WORDING.VERTICAL_SCALING_OFF}
              </div>
            </div>
            <div class="option--input flavor-picker">
              ${
                this._sortedFlavors.map((flavor) => {
                  const selected = flavor === this.currentFlavor;
                  return html`
                    <div class="flavor-item"
                       role="button"
                       tabindex="0"
                       ?selected="${selected}"
                       @click="${() => this._onFlavorClick(flavor)}">
                      <div class="flavor-item--name">${flavor.name}</div>
                      <div class="flavor-item--infos">
                        <div class="info info--cpu">
                          <cc-icon .icon="${iconCpu}"></cc-icon>
                          <span>${flavor.cpus}</span>
                        </div>
                        <div class="info info--ram">
                          <cc-icon .icon="${iconRam}"></cc-icon>
                          <span>${formatBytes(flavor.memory.value)}</span>
                        </div>
                      </div>
                    </div>
                  `;
                })
              }
            </div>
          </div>
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
        cc-toggle {
          font-size: 1.125em;
        }

        .flavor-picker {
          display: inline-flex;
          align-items: stretch;
          justify-content: space-evenly;
          column-gap: 2px;
        }

        .flavor-item {
          flex: 1 1 0;
          padding: 0.5em 0.75em;
          background-color: var(--cc-color-bg-neutral);
        }
        .flavor-item:first-child {
          border-start-start-radius: 0.5em;
          border-end-start-radius: 0.5em;
        }
        .flavor-item:last-child {
          border-start-end-radius: 0.5em;
          border-end-end-radius: 0.5em;
        }

        .flavor-item:hover:not([disabled]) {
          border-color: var(--cc-color-border-neutral-hovered);
        }
        .flavor-item:not([selected]):not([disabled]) {
          cursor: pointer;
        }

        .flavor-item[selected] {
          background-color: var(--cc-color-bg-primary-weak);
        }

        .flavor-item:focus-visible {
          position: relative;
          outline: var(--cc-focus-outline);
          outline-offset: 2px;
        }
          
        .flavor-item--name {
          font-size: 1.25em;
          margin-block-end: 0.25em;
        }
        .flavor-item--infos {
          display: flex;
          flex-direction: column;
          gap: 0.25em;
          color: var(--cc-color-text-weak);
        }

        .flavor-item--infos span {
          font-size: 0.75em;
        }
        
        .info {
          display: inline-flex;
          align-items: center;
          gap: 0.25em;
          line-height: 1;
        }
      `,
    ];
  }
}

customElements.define('ct-scalability', CtScalability);
