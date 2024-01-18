import { LitElement, html, css } from 'lit';
import {
  iconRemixSettingsLine as subLabelIcon,
  iconRemixServerLine as labelIcon,
} from '../../src/assets/cc-remix.icons.js';
import { PREFERRED_PLAN_SLUG } from './preferred-items.js';
import './ct-plan-picker.js';

const WORDING = {
  LABEL: 'Choose your plan',
  SUB_LABEL: 'Customize your plan',
  DEV_NOTICE_TITLE: 'About Free Databases',
  DEV_NOTICE_MSG: 'Plan customization is not available in development plan: free plans are recommended for test and development usage only.',
};

export class CtPlanConfigurator extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
      plans: { type: Array },
      currentPlanSlug: { type: String, attribute: 'current-plan-slug' },
      _hasCategories: { type: Boolean, state: true },
      _filteredPlans: { type: Array, state: true },
      _topPlans: { type: Array, state: true },
      _subPlans: { type: Array, state: true },
    };
  };

  willUpdate (_changedProperties) {
    if (_changedProperties.has('product')) {
      this._hasCategories = !!this.product.details.categories?.length;
    }
    if (_changedProperties.has('plans')) {
      this._updateInternalPlans();
    }
    if (_changedProperties.has('currentPlanSlug')) {
      this.dispatchEvent(new CustomEvent('ct-plan-configurator:selected', {
        detail: this._filteredPlans.find((plan) => plan.slug === this.currentPlanSlug),
        bubbles: true,
        composed: true,
      }));
    }
  }

  _updateInternalPlans () {
    // excluding plans without zones
    this._filteredPlans = this.plans.filter((plan) => plan.zones?.length > 0);

    this._fixCurrentPlan();

    if (this._hasCategories) {
      const categories = this.product.details.categories;
      this._topPlans = categories.map((category) => {
        return {
          id: category.prefix,
          prefix: category.prefix,
          name: category.name,
          details: {
            plans: this._filteredPlans.filter((plan) => plan.slug.startsWith(category.prefix + '_') || plan.slug === category.prefix),
            displayedFeatures: this.product.details.displayedFeatures.category,
          },
        };
      });
      // TODO disable instead of hiding categories without plans?
      this._topPlans = this._topPlans.filter((topPlan) => topPlan.details.plans.length > 0);

      this._subPlans = this._topPlans
        .find((topPlan) => this.currentPlanSlug.startsWith(topPlan.prefix))
        .details
        .plans
        .map((plan) => {
          const splitName = plan.name.split(' ');
          if (splitName.length > 1) {
            splitName.shift();
          }
          return {
            id: plan.slug,
            name: splitName.join(' '),
            details: {
              rawPlan: plan,
              displayedFeatures: this.product.details.displayedFeatures.customization,
            },
          };
        })
      ;
      this._subPlans.sort((a, b) => a.details.rawPlan.price - b.details.rawPlan.price);
    }
    else {
      this._topPlans = this._filteredPlans.map((plan) => {
        return {
          id: plan.slug,
          name: plan.name,
          details: {
            rawPlan: plan,
            displayedFeatures: this.product.details.displayedFeatures,
          },
        };
      });
      this._topPlans.sort((a, b) => a.details.rawPlan.price - b.details.rawPlan.price);

      this._subPlans = [];
    }
  }

  _fixCurrentPlan () {
    function isPlanSlugAvailable (slug, plans) {
      return plans.find((plan) => plan.slug === slug) != null;
    }

    const isCurrentPlanAvailable = isPlanSlugAvailable(this.currentPlanSlug, this._filteredPlans);
    if (isCurrentPlanAvailable) {
      return;
    }

    // TODO closest plan instead? based on category?
    const isPreferredPlanAvailable = isPlanSlugAvailable(PREFERRED_PLAN_SLUG, this._filteredPlans);
    if (isPreferredPlanAvailable) {
      this.currentPlanSlug = PREFERRED_PLAN_SLUG;
      return;
    }

    // TODO closest plan
    this.currentPlanSlug = this._filteredPlans[0].slug;
  }

  connectedCallback () {
    super.connectedCallback();
    this.addEventListener('ct-plan-item:selected', this._onPlanSelected);
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this.removeEventListener('ct-plan-item:selected', this._onPlanSelected);
  }

  _onPlanSelected (e) {
    const { id, isCategory } = e.detail;
    if (id === this.currentPlanSlug || id === this.currentPlanSlug.split('_')[0]) {
      return;
    }

    if (isCategory) {
      const filteredPlans = this._filteredPlans.filter((plan) => plan.slug.startsWith(id));
      filteredPlans.sort((a, b) => a.price - b.price);
      this.currentPlanSlug = filteredPlans[0].slug;
    }
    else {
      this.currentPlanSlug = id;
    }

    this._updateInternalPlans();
  }

  render () {
    const currentPlanSlugArray = this.currentPlanSlug.split('_');
    const currentTopSlug = this._hasCategories ? currentPlanSlugArray[0] : this.currentPlanSlug;
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.LABEL}">
        <ct-plan-picker
          current-plan="${currentTopSlug}"
          ?is-category="${this._hasCategories}"
          .plans="${this._topPlans}"
        ></ct-plan-picker>
      </ct-label-with-icon>
      ${
        this._hasCategories && this._subPlans?.length > 0
        ? html`
          <ct-label-with-icon .icon="${subLabelIcon}" .label="${WORDING.SUB_LABEL}">
          ${
            this.currentPlanSlug.toLowerCase() === 'dev'
            ? html`<cc-notice intent="warning" heading="${WORDING.DEV_NOTICE_TITLE}" message="${WORDING.DEV_NOTICE_MSG}"></cc-notice>`
            : html`<ct-plan-picker
                current-plan="${this.currentPlanSlug}"
                ?is-customization="${true}"
                .plans="${this._subPlans}"
              ></ct-plan-picker>`
          }
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
      `,
    ];
  }
}

customElements.define('ct-plan-configurator', CtPlanConfigurator);
