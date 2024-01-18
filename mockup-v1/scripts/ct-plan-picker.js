import { LitElement, html, css } from 'lit';
import {
  iconRemixCpuLine as iconCpu,
  iconRemixDatabase_2Fill as iconDatabase,
  iconRemixHardDrive_2Fill as iconDisk,
  iconRemixUserForbidFill as iconConnectionLimit,
} from '../../src/assets/cc-remix.icons.js';
import '../../src/components/cc-badge/cc-badge.js';
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
  memory: { content: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M2 5H22C22.5523 5 23 5.44772 23 6V15C23 15.5523 22.5523 16 22 16V18C22 18.5523 21.5523 19 21 19H13.5858L12.5858 18H11.4142L10.4142 19H3C2.44772 19 2 18.5523 2 18L2 16C1.44772 16 1 15.5523 1 15V6C1 5.44771 1.44772 5 2 5ZM4 16V17H9.58579L10.5858 16H4ZM13.4142 16L14.4142 17H20V16H13.4142ZM7 9H5V12H7V9ZM9 9V12H11V9H9ZM15 9H13V12H15V9ZM17 9V12H19V9H17Z"></path></svg>' },
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
