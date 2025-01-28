import { css, html } from 'lit';
import { iconRemixServerLine as labelIcon } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-plan-item/cc-plan-item.js';

/**
 * @typedef {import('lit').PropertyValues<CcPlanPicker>} CcPlanPickerPropertyValues
 * @typedef {import('../../lib/events.types.js').EventWithTarget} EventWithTarget
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<InputEvent, HTMLInputElement>} HTMLInputElementEvent
 * @typedef {import('./cc-plan-picker.types.js').PlanItem} PlanItem
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A form control element component that allows you to select a plan from a list of plans and refine your choice in a sub picker if needed
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<string>} cc-plan-picker:input - Fires the id of the selected plan
 */
export class CcPlanPicker extends CcFormControlElement {
  static get properties() {
    return {
      ...super.properties,
      legend: { type: String },
      plans: { type: Array },
      readonly: { type: Boolean },
      value: { type: String },
    };
  }

  constructor() {
    super();

    /** @type {string} The legend of the form control */
    this.legend = null;

    /** @type {PlanItem[]} List of plans */
    this.plans = [];

    /** @type {boolean} Whether all the form controls should be readonly */
    this.readonly = false;

    /** @type {string} current selected plan id */
    this.value = null;

    /** @type {string} */
    this._currentPlanId = null;

    /** @type {PlanItem[]} */
    this._currentRelatedPlans = [];
  }

  // @ts-expect-error: We override this setter as the component doesn't handle error for now.
  set errorMessage(_) {}

  /**
   * Find a plan by its ID in a list of plans.
   *
   * @param {PlanItem[]} plans - List of plans to search through
   * @param {string} planId - ID of the plan to find
   * @returns {PlanItem} The found plan or the first plan in the list if not found
   * @private
   */
  _findPlan(plans, planId) {
    // We're trying to find if the plan is a related plan or if the plan is a plan with no related plans
    const exactPlan = plans.find((plan) => {
      if (plan.relatedPlans == null || plan.relatedPlans.length === 0) {
        return plan.id === planId;
      }
      return plan.relatedPlans.find((relatedPlan) => relatedPlan.id === planId);
    });

    // If it was the case we return the plan
    if (exactPlan != null) {
      return exactPlan;
    }

    // If it's not one of the case above we try to find the "parent" plan
    const parentPlan = this.plans.find((plan) => {
      return plan.id === planId;
    });

    if (parentPlan != null) {
      return parentPlan;
    }

    // If we don't find anything, the id provided wasn't correct so we default to the first plan of the list
    return plans[0];
  }

  /**
   * @param {HTMLInputElementEvent} e
   * @private
   */
  _onChangePlan(e) {
    const currentPlan = this._findPlan(this.plans, e.target.value);
    this._currentPlanId = e.target.value;
    if (currentPlan.relatedPlans != null && currentPlan.relatedPlans.length > 0) {
      this.value = currentPlan.relatedPlans[0].id;
      this._currentRelatedPlans = currentPlan.relatedPlans;
    } else {
      this.value = this._currentPlanId;
      this._currentRelatedPlans = [];
    }

    dispatchCustomEvent(this, 'input', this.value);
  }

  /**
   * @param {HTMLInputElementEvent} e
   * @private
   */
  _onChangeRelatedPlan(e) {
    this.value = e.target.value;
    dispatchCustomEvent(this, 'input', this.value);
  }

  /**
   * @param {CcPlanPickerPropertyValues} changedProperties
   */
  willUpdate(changedProperties) {
    if (changedProperties.has('plans') && changedProperties.has('value')) {
      const currentPlan = this._findPlan(this.plans, this.value);
      if (currentPlan.relatedPlans != null && currentPlan.relatedPlans.length > 0) {
        const valueExistsInRelated = currentPlan.relatedPlans.some((plan) => plan.id === this.value);
        this.value = valueExistsInRelated ? this.value : currentPlan.relatedPlans[0].id;
      } else {
        this.value = currentPlan.id;
      }
      this._currentPlanId = currentPlan.id;
      this._currentRelatedPlans = currentPlan.relatedPlans;
    }
  }

  render() {
    const legendName = this.legend ?? i18n('cc-plan-picker.legend');

    return html`
      <fieldset @input="${this._onChangePlan}">
        <legend>
          <cc-icon class="plan-legend-icon" .icon="${labelIcon}" size="lg"></cc-icon>
          <span class="plan-legend-text">${legendName}</span>
        </legend>
        <div class="form-controls">
          ${this.plans.map((plan) => this._renderPlan(plan, this.name, this._currentPlanId))}
        </div>
      </fieldset>
      ${this._currentRelatedPlans != null && this._currentRelatedPlans.length > 0
        ? html`
            <fieldset @input="${this._onChangeRelatedPlan}">
              <legend>
                <cc-icon class="plan-legend-icon" .icon="${labelIcon}" size="lg"></cc-icon>
                <span class="plan-legend-text">${i18n('cc-plan-picker.legend.customize')}</span>
              </legend>
              <div class="form-controls">
                ${this._currentRelatedPlans.map((plan) => this._renderPlan(plan, 'related-plan', this.value))}
              </div>
            </fieldset>
          `
        : ''}
    `;
  }

  /**
   * @param {PlanItem} plan - A plan item
   * @param {string} name - Form control name
   * @param {string} currentPlanId - Currently selected plan ID
   * @returns {TemplateResult} The rendered plan radio input and label
   * @private
   */
  _renderPlan(plan, name, currentPlanId) {
    const isSelected = currentPlanId === plan.id;
    const isDisabled = plan.disabled || (this.readonly && !isSelected);

    return html`
      <div>
        <input
          class="visually-hidden"
          type="radio"
          name="${name}"
          .value="${plan.id}"
          .disabled=${isDisabled}
          .checked="${isSelected}"
          id="${plan.id}"
        />
        <label for="${plan.id}">
          <cc-plan-item
            name="${plan.name}"
            ?disabled=${isDisabled}
            .details="${plan.details}"
            .selected=${isSelected}
            .badge="${plan.badge}"
          >
          </cc-plan-item>
        </label>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        legend {
          display: flex;
          gap: 0.25em;
        }

        fieldset {
          border: none;
          margin: 0;
          padding: 0;
        }

        input[type='radio']:focus-visible + label cc-plan-item {
          border-radius: var(--cc-border-radius-default, 0.25em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .plan-legend-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          align-self: center;
        }

        .plan-legend-text {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--cc-ff-form-legend), inherit;
          font-size: 1.625em;
          font-weight: 500;
        }

        .form-controls {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(13em, 1fr));
          margin-block-start: 0.5em;
          margin-inline-start: 34px;
        }
      `,
    ];
  }
}

window.customElements.define('cc-plan-picker', CcPlanPicker);
