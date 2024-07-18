import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
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
  VERSION_LABEL: 'Run configuration',
  AUTO_SCALABILITY: 'Dynamic load balancing',
  AUTO_SCALABILITY_DESC: 'Enable dynamic load balancing. You define a range of min and max values for scaler size and amount, and the system choose the best configuration according to your app\'s load.',
  VERTICAL_SCALING_OFF: 'Instance size',
  VERTICAL_SCALING_ON: 'Vertical scaling',
  HORIZONTAL_SCALING_OFF: 'Instance count',
  HORIZONTAL_SCALING_ON: 'Horizontal scaling',
  HORIZONTAL_SCALING_ON_SELECT_MIN: 'Select the first bound...',
  HORIZONTAL_SCALING_ON_SELECT_MAX: '...and select the other bound.',
  HORIZONTAL_SCALING_ON_DESC_1: 'Minimum instances count',
  HORIZONTAL_SCALING_ON_DESC_2: 'Maximum instances count',
};

const TOGGLE_STRUCT = {
  default: 'false',
  options: [{ label: 'On', value: 'true' }, { label: 'Off', value: 'false' }],
};

const HUMAN_TSHIRT = {
  XS: 'extra-small',
  S: 'small',
  M: 'medium',
  L: 'large',
  XL: 'extra-large',
};

const INSTANCES_ENUM = [
  { name: "1", value: 1, index: 0 },
  { name: "2", value: 2, index: 1 },
  { name: "3", value: 3, index: 2 },
  { name: "4", value: 4, index: 3 },
  { name: "5", value: 5, index: 4 },
  { name: "6", value: 6, index: 5 },
  { name: "7", value: 7, index: 6 },
  { name: "8", value: 8, index: 7 },
  { name: "9", value: 9, index: 8 },
  { name: "custom", isCustom: true },
];

const formatBytes = prepareNumberBytesFormatter('en', 'B', ' ');

export class CtScalability extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
      currentFlavor: { type: Object },
      currentInstance: { type: Object },
      currentInstanceMax: { type: Object },
      customInstance: { type: Number },
      customInstanceMax: { type: Number },
      enabled: { type: Boolean },
      isDraggingInstance: { type: Boolean },
      isDraggingFlavor: { type: Boolean },
      _rawApplication: { type: Object, state: true },
      _sortedFlavors: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.enabled = TOGGLE_STRUCT.default;

    this.currentInstance = INSTANCES_ENUM[0];
    this.currentInstanceMax = null;
    this.isDraggingInstance = false;
    this._dragStartInstance = null;
    this._dragStartInstance = null;

    this.currentFlavor = null;
    this.currentFlavorMax = null;
    this.isDraggingFlavor = false;
    this._dragEndFlavor = null;
    this._dragEndFlavor = null;

    this.customInstance = INSTANCES_ENUM[INSTANCES_ENUM.length - 2].value + 1;
    this.customInstanceMax = INSTANCES_ENUM[INSTANCES_ENUM.length - 2].value + 6;
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

      this._sanitizeInstances();
      this._sanitizeFlavors();
      this.dispatchConfig();
    }
  }

  dispatchConfig () {
    const minInstance = this.currentInstance;
    if (this.currentInstance.isCustom) {
      minInstance.value = this.customInstance;
    }

    const maxInstance = this.currentInstanceMax;
    if (this.currentInstanceMax.isCustom) {
      maxInstance.value = this.isEnabled ? this.customInstanceMax : this.customInstance;
    }

    this.dispatchEvent(new CustomEvent('ct-scalability:config-updated', {
      detail: {
        isEnabled: this.isEnabled,
        instances: {
          min: minInstance,
          max: maxInstance,
        },
        flavors: {
          min: this.currentFlavor,
          max: this.currentFlavorMax,
        },
      },
      bubbles: true,
      composed: true,
    }));
  }

  _sanitizeInstances () {
    if (!this.isEnabled || this.currentInstance.isCustom) {
      this.currentInstanceMax = this.currentInstance;
    }
    else {
      this.currentInstanceMax = this._getClosestValidInstance(this.currentInstance);
      if (this.currentInstance.index > this.currentInstanceMax.index) {
        const swapInstance = this.currentInstance;
        this.currentInstance = this.currentInstanceMax;
        this.currentInstanceMax = swapInstance;
      }
    }
  }

  _sanitizeFlavors() {
    if (!this.isEnabled ) {
      this.currentFlavorMax = this.currentFlavor;
    }
    else {
      this.currentFlavorMax = this._getClosestValidFlavor(this.currentFlavor);
      if (this._sortedFlavors.indexOf(this.currentFlavor) > this._sortedFlavors.indexOf(this.currentFlavorMax)) {
        const swapInstance = this.currentFlavor;
        this.currentFlavor = this.currentFlavorMax;
        this.currentFlavorMax = swapInstance;
      }
    }
  }

  _getClosestValidInstance (instance) {
    const maxValidIndex = INSTANCES_ENUM.length - 2;
    if (instance.index >= maxValidIndex) {
      return INSTANCES_ENUM[instance.index - 1];
    }

    return INSTANCES_ENUM[instance.index + 1];
  }

  _getClosestValidFlavor (flavor) {
    const maxValidIndex = this._sortedFlavors.length - 1;
    const flavorIndex = this._sortedFlavors.indexOf(flavor);
    if (flavorIndex >= maxValidIndex) {
      return this._sortedFlavors[flavorIndex - 1];
    }

    return this._sortedFlavors[flavorIndex + 1];
  }

  _onAutoScalabilityUpdate (e) {
    this.enabled = e.detail;
    this.isDraggingInstance = false;
    this.isDraggingFlavor = false;
    this._sanitizeInstances();
    this._sanitizeFlavors();
    this.dispatchConfig();
  }

  _onClickInstance (e, instance) {
    if (e.button !== 0) {
      // not the main button pressed
      return;
    }

    if (!this.isEnabled || instance.isCustom) {
      this.currentInstance = instance;
      this.isDraggingInstance = false;
      this._sanitizeInstances();
      this.dispatchConfig();
    }
    else if (this.isDraggingInstance) {
      this._dragEndInstance = instance;

      this.isDraggingInstance = false;
      this._whileDraggingInstance();
      this.dispatchConfig();
    } else {
      this._dragStartInstance = instance;
      this._dragEndInstance = instance;

      this.isDraggingInstance = true;
      this._whileDraggingInstance();
    }
  }

  _onMouseMoveInstance (instance) {
    if (!this.isDraggingInstance) {
      return;
    }
    this._dragEndInstance = instance;
    this._whileDraggingInstance();
    this.requestUpdate();
  }

  _whileDraggingInstance () {
    if (!this.isDraggingInstance) {
      return;
    }

    const shouldSwap = this._dragStartInstance.index > this._dragEndInstance.index;
    this.currentInstance = !shouldSwap ? this._dragStartInstance : this._dragEndInstance;
    this.currentInstanceMax = !shouldSwap ? this._dragEndInstance : this._dragStartInstance;
  }

  _onClickFlavor (e, flavor) {
    if (e.button !== 0) {
      // not the main button pressed
      return;
    }

    if (!this.isEnabled ) {
      this.currentFlavor = flavor;
      this.isDraggingFlavor = false;
      this._sanitizeFlavors();
      this.dispatchConfig();
    }
    else if (this.isDraggingFlavor) {
      this._dragEndFlavor = flavor;

      this.isDraggingFlavor = false;
      this._whileDraggingFlavor();
      this.dispatchConfig();
    } else {
      this._dragStartFlavor = flavor;
      this._dragEndFlavor = flavor;

      this.isDraggingFlavor = true;
      this._whileDraggingFlavor();
    }
  }

  _onMouseMoveFlavor (flavor) {
    if (!this.isDraggingFlavor) {
      return;
    }
    this._dragEndFlavor = flavor;
    this._whileDraggingFlavor();
    this.requestUpdate();
  }

  _whileDraggingFlavor () {
    if (!this.isDraggingFlavor) {
      return;
    }

    const shouldSwap = this._sortedFlavors.indexOf(this._dragStartFlavor) > this._sortedFlavors.indexOf(this._dragEndFlavor);
    this.currentFlavor = !shouldSwap ? this._dragStartFlavor : this._dragEndFlavor;
    this.currentFlavorMax = !shouldSwap ? this._dragEndFlavor : this._dragStartFlavor;
  }

  _onCustomCurrentInstanceUpdate ({ detail }) {
    this.customInstance = detail;
    this.dispatchConfig();
  }

  _onCustomCurrentInstanceMaxUpdate ({ detail }) {
    this.customInstanceMax = detail;
    this.dispatchConfig();
  }

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <div class="options">
          <div class="option option--toggle">
            <div class="option--label">
              <div class="option--value">${WORDING.AUTO_SCALABILITY}</div>
            </div>
            <div class="option--input" style="display: inline-flex">
              <cc-toggle
                value="${this.enabled}"
                .choices="${TOGGLE_STRUCT.options}"
                @cc-toggle:input="${this._onAutoScalabilityUpdate}"
              ></cc-toggle>
            </div>
          </div>
          <div class="option option--toggle">
            <div class="option--label">
              <div class="option--value">
                ${this.isEnabled ? WORDING.HORIZONTAL_SCALING_ON : WORDING.HORIZONTAL_SCALING_OFF}
              </div>
            </div>
            <div class="option--input list-picker ${classMap({ 'list-picker--single': !this.isEnabled, 'list-picker--multiple': this.isEnabled, 'list-picker--is-dragging': this.isEnabled && this.isDraggingInstance })}">
            ${
              INSTANCES_ENUM.map((instance, index) => {
                const minIndex = this.currentInstance?.index;
                const maxIndex = this.currentInstanceMax?.index;
                const selected = (!this.isEnabled || instance.isCustom) ? (instance === this.currentInstance) : (index >= minIndex && index <= maxIndex);
                return html`
                  <div class="list-item list-item--square ${classMap({'list-item--first-selected': index === minIndex, 'list-item--last-selected': index === maxIndex, 'list-item--custom': instance.isCustom })}"
                       role="button"
                       tabindex="0"
                       ?selected="${selected}"
                  >
                    <div class="list-item--wrapper ${classMap({ clickable: (this.isEnabled || !selected) })}"
                         @mousemove="${() => this._onMouseMoveInstance(instance)}"
                         @click="${(e) => this._onClickInstance(e, instance)}"
                    >
                      <div class="list-item--name">
                        ${instance.name}
                      </div>
                    </div>
                    ${
                      index < INSTANCES_ENUM.length - 1
                      ? html`
                        <div class="list-item--gap">
                          ${ selected && index < maxIndex ? html`&#10148;` : '' }
                        </div>
                      `
                      : ''
                    }
                  </div>`;
              })
            }
            </div>
            ${
              this.currentInstance.isCustom && !this.isEnabled
              ? html`
                <div class="custom-container">
                  <cc-input-number
                    @cc-input-number:input=${this._onCustomCurrentInstanceUpdate}
                    value="${this.customInstance}"
                    min="1"
                    max="${this._rawApplication.maxInstances}"
                    controls
                    inline
                    label="Custom instance number"
                  ></cc-input-number>
                </div>`
              : ''
            }
            ${
              this.currentInstance.isCustom && this.isEnabled
                ? html`
                <div class="custom-container">
                  <cc-input-number
                    @cc-input-number:input=${this._onCustomCurrentInstanceUpdate}
                    value="${this.customInstance}"
                    min="1"
                    max="${this._rawApplication.maxInstances}"
                    controls
                    inline
                    label="${WORDING.HORIZONTAL_SCALING_ON_DESC_1}"
                  ></cc-input-number>
                  <cc-input-number
                    @cc-input-number:input=${this._onCustomCurrentInstanceMaxUpdate}
                    value="${this.customInstanceMax}"
                    min="1"
                    max="${this._rawApplication.maxInstances}"
                    controls
                    inline
                    label="${WORDING.HORIZONTAL_SCALING_ON_DESC_2}"
                  ></cc-input-number>
                </div>`
                : ''
            }
            ${
              this.isEnabled && !this.currentInstance.isCustom && this.isDraggingInstance
              ? html`<div class="text-helper">${WORDING.HORIZONTAL_SCALING_ON_SELECT_MAX}</div>`
              : ''
            }
          </div>
          <div class="option">
            <div class="option--label">
              <div class="option--value">
                ${this.isEnabled ? WORDING.VERTICAL_SCALING_ON : WORDING.VERTICAL_SCALING_OFF}
              </div>
            </div>
            <div class="option--input list-picker list-picker--flavor ${classMap({ 'list-picker--single': !this.isEnabled, 'list-picker--multiple': this.isEnabled, 'list-picker--is-dragging': this.isEnabled && this.isDraggingFlavor })}">
              ${
                this._sortedFlavors.map((flavor, index) => {
                  const minIndex = this._sortedFlavors.indexOf(this.currentFlavor);
                  const maxIndex = this._sortedFlavors.indexOf(this.currentFlavorMax);
                  const selected = !this.isEnabled ? (flavor === this.currentFlavor) : (index >= minIndex && index <= maxIndex);
                  return html`
                    <div class="list-item ${classMap({'list-item--first-selected': index === minIndex, 'list-item--last-selected': index === maxIndex })}"
                         role="button"
                         tabindex="0"
                         ?selected="${selected}"
                    >
                      <div class="list-item--wrapper list-item--with-infos ${classMap({ clickable: (this.isEnabled || !selected) })}"
                           @mousemove="${() => this._onMouseMoveFlavor(flavor)}"
                           @click="${(e) => this._onClickFlavor(e, flavor)}"
                      >
                        <div class="flavor-name">
                          ${HUMAN_TSHIRT[flavor.name.toUpperCase()] ?? flavor.name}
                        </div>
                        <div class="flavor-infos">
                          <div class="flavor-info info--cpu">
                            <cc-icon .icon="${iconCpu}"></cc-icon>
                            <span class="">${flavor.cpus} vCPUs</span>
                          </div>
                          <div class="flavor-info info--ram">
                            <cc-icon .icon="${iconRam}"></cc-icon>
                            <span class="">${formatBytes(flavor.memory.value)}</span>
                          </div>
                        </div>
                      </div>
                      ${
                        index < this._sortedFlavors.length - 1
                          ? html`
                            <div class="list-item--gap">
                              ${ selected && index < maxIndex ? html`&#10148;` : '' }
                            </div>
                          `
                          : ''
                      }
                    </div>`;
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
          --cc-scalability-gap: 0.125em;
          display: block;
        }
        
        * {
          box-sizing: border-box;
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

        .list-picker {
          --size: 3em;
          --gap: 0.5em;
          --border-w: 2px;

          display: flex;
          flex-wrap: wrap;
          row-gap: var(--gap);
        }

        .list-item {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          outline: none;
        }
        
        .list-picker--flavor {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(9em, 1fr) 0.5em);
        }
        .list-picker--flavor .list-item {
          display: contents;
        }

        .list-item--wrapper {
          display: flex;
          flex: 0 0 auto;
          min-width: var(--size);
          min-height: var(--size);
          padding: 0.75em 1em;
          border: var(--border-w) solid var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-default);
          outline-offset: 2px;
          user-select: none;
        }

        .list-item--wrapper:hover:not([disabled]):not([selected]) {
          border-color: var(--cc-color-border-neutral-hovered);
        }
        .list-item--wrapper.clickable {
          cursor: pointer;
        }

        .list-item--square .list-item--wrapper {
          align-items: center;
          justify-content: center;
          padding: 0;
          height: var(--size);
          width: var(--size);
        }
        
        .list-item--gap {
          align-self: stretch;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: var(--gap);
          color: var(--cc-color-text-weak);
          user-select: none;
        }

        .list-item--custom .list-item--wrapper {
          width: auto;
        }
        .list-item--custom .list-item--name {
          padding-inline: 1em;
        }

        .list-item[selected] .list-item--wrapper,
        .list-picker--multiple .list-item[selected]:not(.list-item--last-selected) .list-item--gap {
          background-color: var(--cc-color-bg-primary-weak);
        }
        .list-item[selected] .list-item--wrapper {
          border-color: var(--cc-color-bg-primary);
        }
        .list-picker--multiple .list-item[selected]:not(.list-item--last-selected) .list-item--gap {
          border-block: var(--border-w) solid var(--cc-color-bg-primary);
        }

        .list-picker--multiple .list-item[selected]:not(.list-item--custom):not(.list-item--first-selected):not(.list-item--last-selected) .list-item--wrapper {
          border-inline-width: 0;
          border-end-start-radius: 0;
          border-end-end-radius: 0;
          border-start-start-radius: 0;
          border-start-end-radius: 0;
        }
        .list-picker--multiple .list-item[selected]:not(.list-item--custom).list-item--first-selected:not(.list-item--last-selected) .list-item--wrapper {
          border-inline-end-width: 0;
          border-start-end-radius: 0;
          border-end-end-radius: 0;
        }
        .list-picker--multiple .list-item[selected]:not(.list-item--square):not(.list-item--last-selected) .list-item--gap {
          //width: calc(var(--gap) + var(--border-w) + var(--border-w));
        }
        .list-picker--multiple .list-item[selected]:not(.list-item--custom).list-item--last-selected:not(.list-item--first-selected) .list-item--wrapper {
          border-inline-start-width: 0;
          border-end-start-radius: 0;
          border-start-start-radius: 0;
        }

        .list-picker--multiple.list-picker--is-dragging .list-item[selected]:not(.list-item--last-selected) .list-item--gap,
        .list-picker--multiple.list-picker--is-dragging .list-item[selected] .list-item--wrapper {
          border-color: transparent;
        }

        .list-item:focus-visible:not([disabled]) .list-item--wrapper {
          position: relative;
          outline: var(--cc-focus-outline);
        }

        .list-item--with-infos {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
        .flavor-name {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .flavor-infos {
          display: flex;
          flex-direction: column;
          gap: 0.375em;
          color: var(--cc-color-text-weak);
        }
        .flavor-info {
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          line-height: 1;
          font-size: 0.75em;
        }
        .flavor-info cc-icon {
          color: var(--color-grey-50);
        }

        .text-helper {
          font-size: 0.825em;
          color: var(--cc-color-text-weak);
        }

        .custom-container {
          padding: 1em;
          margin-block-start: 0.5em;
          align-self: flex-start;
          display: inline-flex;
          flex-direction: column;
          align-items: start;
          gap: 1em;
          border: 2px solid var(--cc-color-bg-primary);
          background-color: var(--cc-color-bg-primary-weak);
          border-radius: var(--cc-border-radius-default);
        }
      `,
    ];
  }
}

customElements.define('ct-scalability', CtScalability);
