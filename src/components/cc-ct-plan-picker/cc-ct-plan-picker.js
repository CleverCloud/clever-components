import { css, html } from 'lit';
import { iconRemixServerLine as labelIcon } from '../../assets/cc-remix.icons.js';
import { CcFormControlElement } from '../../lib/form/cc-form-control-element.abstract.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import '../cc-ct-plan-item/cc-ct-plan-item.js';

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
export class CcCtPlanPicker extends CcFormControlElement {
  // DOCS: 1. LitElement's properties descriptor

  static get properties() {
    return {
      ...super.properties,
      legendName: { type: String, attribute: 'legend-name' },
      inputName: { type: String, attribute: 'input-name' },
      value: { type: String },
      plans: { type: Array },
      relatedPlans: { type: Array },
    };
  }

  // DOCS: 2. Constructor

  constructor() {
    super();

    this.plans = [];

    this.relatedPlans = [];

    this._currentPlan = null;

    this.legendName = null;

    this.inputName = null;

    this.value = 'xs_tny';
  }

  _onChangePlan(e) {
    this.value = e.target.value;
  }

  _onChangeRelatedPlan(e) {
    console.log(e.target.value);
    this.value = e.target.value;
  }

  render() {
    return html`
      <fieldset @change="${this._onChangePlan}">
        <legend>
          <cc-icon class="plan-legend-icon" .icon="${labelIcon}" size="lg"></cc-icon>
          <span class="plan-legend-text">${this.legendName}</span>
        </legend>
        <div class="form-controls">${this.plans.map((plan) => this._renderPlan(plan, this.inputName, this.value))}</div>
      </fieldset>
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

window.customElements.define('cc-ct-plan-picker', CcCtPlanPicker);
