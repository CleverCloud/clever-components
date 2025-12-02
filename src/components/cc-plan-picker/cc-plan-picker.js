import { css, html } from 'lit';
import { iconRemixServerLine as labelIcon } from '../../assets/cc-remix.icons.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { i18n } from '../../lib/i18n/i18n.js';
import '../cc-badge/cc-badge.js';
import '../cc-picker/cc-picker.js';
import { CcSelectEvent } from '../common.events.js';

/**
 * @import { Translated } from '../../lib/i18n/i18n.types.js'
 * @import { PlanItem, PlanBadge, PlanDetails } from './cc-plan-picker.types.js'
 * @import { TemplateResult, PropertyValues } from 'lit'
 * @import { GenericEventWithTarget } from '../../lib/events.types.js'
 */

/**
 * A form control element component that allows you to select a plan from a list of plans and refine your choice in a sub picker if needed
 *
 * @cssdisplay block
 *
 * @cssprop {Size} --cc-form-controls-gap - The vertical space between different form controls (defaults: `2em`).
 * @cssprop {Size} --cc-form-controls-indent - The horizontal space between the start of the line and the form control without the label (defaults: `34px`).
 * @cssprop {Size} --cc-form-label-gap - The space between the label and the control (defaults: `0.35em`).
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
   * @param {GenericEventWithTarget<InputEvent, HTMLInputElement>} e
   * @private
   */
  _onChangePlan(e) {
    if (this.readonly) {
      return;
    }

    const currentPlan = this._findPlan(this.plans, e.target.value);
    this._currentPlanId = e.target.value;
    if (currentPlan.relatedPlans != null && currentPlan.relatedPlans.length > 0) {
      this.value = currentPlan.relatedPlans[0].id;
      this._currentRelatedPlans = currentPlan.relatedPlans;
    } else {
      this.value = this._currentPlanId;
      this._currentRelatedPlans = [];
    }

    this.dispatchEvent(new CcSelectEvent(this.value));
  }

  /**
   * @param {GenericEventWithTarget<InputEvent, HTMLInputElement>} e
   * @private
   */
  _onChangeRelatedPlan(e) {
    if (this.readonly) {
      return;
    }

    this.value = e.target.value;
    this.dispatchEvent(new CcSelectEvent(this.value));
  }

  /**
   * @param {PropertyValues<CcPlanPicker>} changedProperties
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
    return html`
      <div class="picker-wrapper">
        <cc-icon .icon="${labelIcon}" size="lg"></cc-icon>
        ${this._renderPlans({
          plans: this.plans,
          name: this.name,
          value: this._currentPlanId,
          legend: this.legend ?? i18n('cc-plan-picker.legend'),
          inputFn: this._onChangePlan,
        })}
      </div>
      ${this._currentRelatedPlans != null && this._currentRelatedPlans.length > 0
        ? html`<div class="picker-wrapper">
            <cc-icon .icon="${labelIcon}" size="lg"></cc-icon>
            ${this._renderPlans({
              plans: this._currentRelatedPlans,
              name: 'related-plan',
              value: this.value,
              legend: i18n('cc-plan-picker.legend.customize'),
              inputFn: this._onChangeRelatedPlan,
            })}
          </div>`
        : ''}
    `;
  }

  /**
   * @param {Object} _
   * @param {function} _.inputFn
   * @param {string|Translated} _.legend
   * @param {string} _.name
   * @param {PlanItem[]} _.plans
   * @param {string} _.value
   * @returns {TemplateResult}
   * @private
   */
  _renderPlans({ inputFn, legend, name, plans, value }) {
    const options = plans.map((plan) => {
      return {
        body: this._renderOptionBody(plan.name, plan.badge),
        disabled: plan.disabled,
        footer: this._renderOptionFooter(plan.details),
        value: plan.id,
      };
    });
    return html`<cc-picker
      @input="${inputFn}"
      label="${legend}"
      name=${name}
      .options=${options}
      ?readonly=${this.readonly}
      value=${value}
    ></cc-picker>`;
  }

  /**
   * @param {string} name
   * @param {PlanBadge} badge
   * @returns {TemplateResult}
   * @private
   */
  _renderOptionBody(name, badge) {
    return html`
      <div part="option-body">
        <span part="option-body--name">${name}</span>
        ${badge != null
          ? html` <cc-badge .intent="${badge.intent}" part="option-body--badge">${badge.content}</cc-badge> `
          : ''}
      </div>
    `;
  }

  /**
   * @param {Array<PlanDetails>} details
   * @returns {TemplateResult}
   * @private
   */
  _renderOptionFooter(details) {
    if (details?.length === 0) {
      return null;
    }

    return html`
      <ul part="option-footer">
        ${details.map((detail) => {
          return html`<li part="option-footer--detail">
            <cc-icon .icon="${detail.icon}" size="md"></cc-icon>
            <span>${detail.value}</span>
          </li>`;
        })}
      </ul>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* region global */
        :host {
          display: block;
        }
        /* endregion */

        /* region cc-picker global layout & style */
        .picker-wrapper {
          column-gap: 0.25em;
          display: flex;
        }

        .picker-wrapper cc-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          flex: 0 0 auto;
          padding-block: 0.25em;
        }

        .picker-wrapper cc-picker {
          flex: 1 1 auto;
        }

        .picker-wrapper + .picker-wrapper {
          margin-block-start: var(--cc-form-controls-gap, 2em);
        }

        cc-picker {
          --cc-input-label-color: var(--cc-color-text-primary-strongest, #012a51);
          --cc-input-label-font-size: 1.625em;
          --cc-input-label-font-weight: 500;
          --cc-picker-tiles-width: 100%;

          display: block;
          font-family: var(--cc-ff-form-legend), inherit;
        }

        cc-picker::part(tiles) {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(13em, 1fr));
        }
        /* endregion */

        /* region cc-picker-option slotted content */
        ::part(option-body) {
          align-items: center;
          column-gap: 0.375em;
          display: inline-flex;
          flex-wrap: wrap;
        }

        ::part(option-body--name) {
          font-size: 1.25em;
        }

        ::part(option-body--badge) {
          line-height: normal;
        }

        ::part(option-footer) {
          display: flex;
          flex-direction: column;
          list-style-type: none;
          margin: 0;
          padding: 0;
          row-gap: 0.25em;
        }

        ::part(option-footer--detail) {
          align-items: center;
          column-gap: 0.5em;
          display: inline-flex;
        }
        /* endregion */
      `,
    ];
  }
}

window.customElements.define('cc-plan-picker', CcPlanPicker);
