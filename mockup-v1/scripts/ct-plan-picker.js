import { LitElement, html, css } from 'lit';
import {
  iconRemixCpuLine as iconCpu,
  iconRemixDatabase_2Fill as iconDatabase,
  iconRemixHardDrive_2Fill as iconDisk,
  iconRemixRam_2Fill as iconRam,
  iconRemixUserForbidFill as iconConnectionLimit,
} from '../../src/assets/cc-remix.icons.js';
import './ct-plan-item.js';

const WORDING = {
  BADGE: 'dev',
};

const FEATURE_CODE_ICON = {
  'connection-limit': iconConnectionLimit,
  cpu: iconCpu,
  databases: iconDatabase,
  'disk-size': iconDisk,
  'max-db-size': iconDisk,
  memory: iconRam,
};

export class CtPlanPicker extends LitElement {
  static get properties () {
    return {
      currentPlan: { type: String, attribute: 'current-plan' },
      isCategory: { type: Boolean, attribute: 'is-category' },
      isCustomization: { type: Boolean, attribute: 'is-customization' },
      plans: { type: Array },
      _displayedFeatures: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.currentPlan = null;
    this.isCategory = false;
    this.isCustomization = false;
  }

  _onPlanItemClick (plan) {
    this.dispatchEvent(new CustomEvent('ct-plan-item:selected', {
      detail: {
        id: plan.id,
        isCategory: this.isCategory,
      },
      bubbles: true,
      composed: true,
    }));
  }

  _getFullDisplayedFeatures (planWrapper) {
    const displayedFeatures = planWrapper.details.displayedFeatures;
    const plan = planWrapper.details.rawPlan ?? planWrapper.details.plans[0];
    const features = plan.features;

    return displayedFeatures.map((featCode) => {
      return {
        code: featCode,
        icon: FEATURE_CODE_ICON[featCode],
        data: features.find((feat) => feat.name_code === featCode),
      };
    });
  }

  render () {
    if (this.plans == null) {
      return ``;
    }

    return html`${
      this.plans.map((plan) => {
        return html`
          <ct-plan-item
            role="button"
            tabindex="0"
            id="${plan.id}"
            name="${plan.name}"
            .details="${this._getFullDisplayedFeatures(plan)}"
            ?selected=${this.currentPlan === plan.id}
            @click="${() => this._onPlanItemClick(plan)}"
          >
          ${
            this.isCategory && plan.prefix === 'dev'
            // TODO test 'dev' label & icon instead of notice
            ? html`<cc-badge slot="decorator" intent="warning" weight="dimmed">${WORDING.BADGE}</cc-badge>`
            : ``
          }
          </ct-plan-item>
        `;
      })
    }`;
  }

  static get styles () {
    return [
      css`
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          gap: 1em;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-picker', CtPlanPicker);
