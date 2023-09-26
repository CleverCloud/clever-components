import '@shoelace-style/shoelace/dist/components/option/option.js';
import '@shoelace-style/shoelace/dist/components/select/select.js';
import { css, html, LitElement } from 'lit';
import { iconRemixArrowDownSLine as iconArrowDown } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import '../cc-button/cc-button.js';
import '../cc-input-number/cc-input-number.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-select/cc-select.js';
import '../cc-toggle/cc-toggle.js';
import { formError } from './directives/form-error-directive.js';
import { formInput } from './directives/form-input-directive.js';
import { formSubmit } from './directives/form-submit-directive.js';
import { FormController } from './form-controller.js';

/**
 * @typedef {import('./cc-ft.types.js').FtFormState} FtFormState
 */

export class CcFtUncontrolled extends LitElement {
  static get properties () {
    return {
      myProp: {
        type: String,
        attribute: 'my-prop',
      },
      formState: {
        type: Object,
        attribute: 'form-state',
      },
    };
  }

  constructor () {
    super();
    this.myProp = 'hello';

    const form = {
      name: 'my-form',
      property: 'formState',
      fields: [
        {
          name: 'name',
          type: 'string',
          required: true,
          reset: '',
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          reset: '',
        },
        {
          name: 'tags',
          type: 'array',
          required: false,
          reset: [],
        },
        {
          name: 'hero',
          type: 'boolean',
          required: false,
          reset: false,
        },
        {
          name: 'description',
          type: 'string',
          required: true,
          reset: '',
        },
        {
          name: 'age',
          type: 'number',
          required: true,
          reset: NaN,
        },
        {
          name: 'color',
          type: 'string',
          required: true,
          reset: null,
        },
        {
          name: 'gender',
          type: 'string',
          required: true,
          reset: null,
        },
        {
          name: 'food',
          type: 'string',
          required: false,
          reset: [],
        },
        {
          name: 'manual',
          type: 'string',
          required: true,
          reset: null,
          validate: (value) => {
            return value.toUpperCase() !== value ? 'not-maj' : null;
          },
        },
        {
          name: 'custom',
          type: 'string',
          required: true,
          reset: null,
        },
        {
          name: 'shoelace',
          type: 'string',
          required: false,
          reset: null,
        },
      ],
    };
    this._formController = new FormController(this, form);
  }

  get formController () {
    return this._formController;
  }

  render () {
    const nameErrors = {
      empty: () => 'Veuillez saisir un nom',
    };
    const emailErrors = {
      empty: () => i18n('cc-email-list.secondary.address-input.error.empty'),
      invalid: () => i18n('cc-email-list.secondary.address-input.error.invalid'),
      used: () => i18n('cc-email-list.secondary.address-input.error.used'),
    };
    const ageErrors = {
      empty: () => 'Veuillez saisir un age',
    };
    const colorErrors = {
      empty: () => 'Veuillez saisir une couleur',
    };
    const manualErrors = {
      empty: () => 'Veuillez saisir quelque chose !',
      'not-maj': () => 'Custom validation: La valeur doit être en majuscule',
    };

    const colorsSelectOptions = [
      {
        label: 'red',
        value: 'red',
      },
      {
        label: 'yellow',
        value: 'yellow',
      },
      {
        label: 'green',
        value: 'green',
      },
    ];

    const genderToggleOptions = [
      {
        label: 'male',
        value: 'm',
      },
      {
        label: 'female',
        value: 'f',
      },
      {
        label: 'other',
        value: 'o',
      },
    ];

    const foodToggleOptions = [
      {
        label: 'chicken',
        value: 'chicken',
      },
      {
        label: 'beef',
        value: 'beef',
      },
      {
        label: 'corn',
        value: 'corn',
      },
      {
        label: 'beans',
        value: 'beans',
      },
    ];

    return html`
      <form>
        <cc-input-text label="Name" ${formInput(this._formController, 'name')}>
          ${formError(this._formController, 'name', nameErrors)}
        </cc-input-text>

        <cc-input-text label="Email" type="email" ${formInput(this._formController, 'email')}>
          ${formError(this._formController, 'email', emailErrors)}
        </cc-input-text>

        <cc-input-text label="Tags" ${formInput(this._formController, 'tags', 'tags')}>
        </cc-input-text>

        <div>
          <input type="checkbox" id="hero" ${formInput(this._formController, 'hero')}>
          <label for="hero">Hero</label>
        </div>

        <span>Description</span>
        <input type="text" ${formInput(this._formController, 'description')}>
        ${this._formController.isFieldInvalid('description')
          ? html`<span style="color: red">${formError(this._formController, 'description')}</span>`
          : ''}

        <cc-input-number label="Age" ${formInput(this._formController, 'age')} min="0" max="150">
          ${formError(this._formController, 'age', ageErrors)}
        </cc-input-number>

        <cc-select label="Color" .options=${colorsSelectOptions} value="" ${formInput(this._formController, 'color')}>
          ${formError(this._formController, 'color', colorErrors)}
        </cc-select>

        <cc-toggle label="Gender" .choices=${genderToggleOptions} ${formInput(this._formController, 'gender')}>
          ${formError(this._formController, 'gender', colorErrors)}
        </cc-toggle>

        <cc-toggle label="Favorite food" .choices=${foodToggleOptions}
                   ${formInput(this._formController, 'food', 'multipleValues')}>
        </cc-toggle>

        <cc-input-text
          name="manual"
          label="Manual"
          ?disabled=${this._formController.formState?.state === 'submitting'}
          required
          .value=${this._formController.getFieldValue('manual')}
          @cc-input-text:input=${(e) => this._formController.setFieldValue('manual', e.target.value)}
          @cc-input-text:requestimplicitsubmit=${() => this._formController.submit()}
        >
          ${this._formController.isFieldInvalid('manual')
            ? html`<p slot="error">${manualErrors[this._formController.getFieldError('manual')]()}</p>`
            : ''}
        </cc-input-text>

        <div>Custom</div>
        <div
          style="display: grid; grid-template-columns: 1fr max-content; padding: 0.3em; ${this._formController.isFieldInvalid('custom') ? 'border: 1px solid red' : ''}">
          <div
            style="background-color: ${this._formController.getFieldValue('custom') === 'first' ? '#ccc' : 'transparent'}">
            first
          </div>
          <button type="button" @click=${() => this._formController.setFieldValue('custom', 'first')}>Select</button>

          <div
            style="background-color: ${this._formController.getFieldValue('custom') === 'second' ? '#ccc' : 'transparent'}">
            second
          </div>
          <button type="button" @click=${() => this._formController.setFieldValue('custom', 'second')}>Select</button>

          <div
            style="background-color: ${this._formController.getFieldValue('custom') === 'third' ? '#ccc' : 'transparent'}">
            third
          </div>
          <button type="button" @click=${() => this._formController.setFieldValue('custom', 'third')}>Select</button>
        </div>
        
        
        <sl-select label="Shoelace"
                   ${formInput(this._formController, 'shoelace', 'value', 'sl-change')}
        >
          <sl-option value="shoelace1">shoelace1</sl-option>
          <sl-option value="shoelace2">shoelace2</sl-option>
          <sl-option value="shoelace3">shoelace3</sl-option>
          <cc-icon slot="expand-icon" .icon=${iconArrowDown}></cc-icon>
        </sl-select>

        <cc-button primary ${formSubmit(this._formController)}>Submit</cc-button>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          width: 10em;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-uncontrolled', CcFtUncontrolled);
