import { css, html } from 'lit';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-ct-plan-picker/cc-ct-plan-picker.js';
/**
 * A component doing X and Y (one liner description of your component).
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * @cssdisplay block
 *
 *
 * @fires {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class CcCtPlanConfigurator extends CcFormControlElement {
  // DOCS: 1. LitElement's properties descriptor

  static get properties() {
    return {
      ...super.properties,
      value: { type: String },
      plans: { type: Array },
      _currentPlanId: { type: String },
      relatedPlans: { type: Array },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    this.name = 'plan';

    this.plans = [];

    this._currentPlanId = null;

    this._currentRelatedPlans = [];

    this.value = null;
  }

  _onChangePlan(e) {
    this._currentPlanId = e.target.value;
    const relatedPlans = this.plans.find((plan) => plan.id === this._currentPlanId)?.relatedPlans;
    console.log(this._currentPlanId, relatedPlans);
    this._currentRelatedPlans = relatedPlans;
    this.value = this._currentRelatedPlans[0].id;
  }

  _onChangeRelatedPlan(e) {
    console.log(e.target.value);
  }

  willUpdate(_changedProperties) {
    if (_changedProperties.has('plans')) {
      const firstNotDevPlan = this.plans.filter((plan) => plan.id !== 'dev')[0];
      console.log(firstNotDevPlan);
      this._currentPlanId = firstNotDevPlan.id;
      this.value = firstNotDevPlan.relatedPlans?.[0].id;
      this._currentRelatedPlans = firstNotDevPlan?.relatedPlans;
    }
  }

  render() {
    return html`
      <form>
        <cc-ct-plan-picker
          @input="${this._onChangePlan}"
          input-name="plan"
          .plans=${this.plans}
          value="${this._currentPlanId}"
          legend-name="Choose your plan"
        ></cc-ct-plan-picker>
        ${this._currentRelatedPlans != null
          ? html`
              <cc-ct-plan-picker
                @change="${this._onChangeRelatedPlan}"
                input-name="customize-plans"
                .plans="${this._currentRelatedPlans}"
                value="${this.value}"
                legend-name="Customize your plan"
              ></cc-ct-plan-picker>
            `
          : ''}
      </form>
    `;
  }

  _renderPlan(plan, inputName, currentPlanId) {
    const isSelected = currentPlanId === plan.id;
    return html`
      <div>
        <input
          class="visually-hidden"
          type="radio"
          name="${inputName}"
          .value="${plan.id}"
          ?disabled=${plan.disabled}
          ?checked="${isSelected}"
          id="${plan.id}"
        />
        <label for="${plan.id}">
          <cc-ct-plan-item
            id="${plan.id}"
            name="${plan.name}"
            .details="${plan.details}"
            ?selected=${isSelected}
          ></cc-ct-plan-item>
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
          /* You may use another display type but you need to define one. */
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

        .plan-legend-icon {
          --cc-icon-color: var(--cc-color-text-primary);

          align-self: center;
        }

        .plan-legend-text {
          --ct-form-label-font-family: 'Source Sans 3';
          --ct-form-label-font-size: 1.625em;
          --ct-form-label-font-weight: 500;
          --ct-form-input-font-size: 1.25em;

          color: var(--cc-color-text-primary-strongest);
          font-family: var(--ct-form-label-font-family), sans-serif;
          font-size: var(--ct-form-label-font-size);
          font-weight: var(--ct-form-label-font-weight);
        }

        .form-controls {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fill, minmax(12.5em, 1fr));
          margin: 1em 2em;
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-ct-plan-configurator', CcCtPlanConfigurator);
