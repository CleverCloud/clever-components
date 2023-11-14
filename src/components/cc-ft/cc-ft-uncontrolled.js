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
import { invalid, VALID } from './validation/validation.js';

/**
 * @typedef {import('./cc-ft.types.js').FtFormState} FtFormState
 */

class CustomValidator {
  getErrorMessage (code) {
    return code;
  }

  validate (value) {
    return value.toUpperCase() !== value ? invalid('not-maj') : VALID;
  }
}

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
      _expertMode: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();
    this.myProp = 'hello';

    const form = {
      name: 'my-form',
      property: 'formState',
      fields: [
        // {
        //   name: 'phoneNumber',
        //   type: 'string',
        //   required: false,
        //   reset: '',
        //   // validator: new (class A {
        //   //   getErrorMessage (code) {
        //   //     if (code === 'notAPhoneNumber') {
        //   //       return 'oulala!';
        //   //     }
        //   //   }
        //   //
        //   //   validate (value) {
        //   //     if (!value.startsWith('06.')) {
        //   //       return invalid('notAPhoneNumber');
        //   //     }
        //   //     return VALID;
        //   //   }
        //   // })(),
        // },
        {
          name: 'email',
          type: 'email',
          required: true,
          reset: '',
          customErrorMessages (code) {
            if (code === 'empty') {
              return 'Entre un email !';
            }
            if (code === 'badEmail') {
              return 'Entre un email valide !';
            }
            if (code === 'used') {
              return 'Already used';
            }
          },
        },
        // customErrorMessages: {
        //   empty: 'Entre un email !',
        //   badEmail: 'Entre un email valide !',
        // },
        // },
        // {
        //   name: 'custom',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
        // {
        //   name: 'checkbox',
        //   type: 'array',
        //   required: false,
        //   reset: [],
        // },
        {
          name: 'name',
          type: 'string',
          required: true,
          reset: '',
        },
        // {
        //   name: 'phoneNumber',
        //   type: 'string',
        //   required: false,
        //   reset: '',
        //   // validator: new (class A {
        //   //   getErrorMessage (code) {
        //   //     if (code === 'notAPhoneNumber') {
        //   //       return 'oulala!';
        //   //     }
        //   //   }
        //   //
        //   //   validate (value) {
        //   //     if (!value.startsWith('06.')) {
        //   //       return invalid('notAPhoneNumber');
        //   //     }
        //   //     return VALID;
        //   //   }
        //   // })(),
        // },
        // {
        //   name: 'email',
        //   type: 'email',
        //   required: true,
        //   reset: '',
        //   customErrorMessages (code) {
        //     if (code === 'empty') {
        //       return 'Entre un email !';
        //     }
        //     if (code === 'badEmail') {
        //       return 'Entre un email valide !';
        //     }
        //     if (code === 'used') {
        //       return 'Already used';
        //     }
        //   },
        //   // customErrorMessages: {
        //   //   empty: 'Entre un email !',
        //   //   badEmail: 'Entre un email valide !',
        //   // },
        // },
        // {
        //   name: 'custom',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
        // {
        //   name: 'checkbox',
        //   type: 'array',
        //   required: false,
        //   reset: [],
        // }, {
        //   name: 'name',
        //   type: 'string',
        //   required: false,
        //   reset: '',
        // },
        //
        // {
        //   name: 'tags',
        //   type: 'array',
        //   required: false,
        //   reset: [],
        // },
        // {
        //   name: 'hero',
        //   type: 'boolean',
        //   required: false,
        //   reset: false,
        // },
        // {
        //   name: 'description',
        //   type: 'string',
        //   required: false,
        //   reset: '',
        // },
        // {
        //   name: 'age',
        //   type: 'number',
        //   required: false,
        //   reset: NaN,
        // },
        // {
        //   name: 'color',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
        // {
        //   name: 'gender',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
        // {
        //   name: 'food',
        //   type: 'array',
        //   required: false,
        //   reset: [],
        // },
        // {
        //   name: 'radio',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
        //
        // {
        //   name: 'shoelace',
        //   type: 'string',
        //   required: false,
        //   reset: null,
        // },
      ],
    };
    this._formController = new FormController(this, form);

    this._expertMode = false;
  }

  get formController () {
    return this._formController;
  }

  _onFormExpertChange (e) {
    this._expertMode = e.target.checked;

    if (e.target.checked) {
      // update form definition
      this._formController.addFieldDefinition({
        name: 'company',
        type: 'string',
        required: true,
        reset: 'coucou',
      });
    }
    else {
      this._formController.removeFieldDefinition('company');
    }

  }

  onCheckboxChange (e) {
    if (e.target.checked) {
      this._formController.setFieldValue('checkbox', [
        ...this._formController.getFieldValue('checkbox'),
        e.target.value,
      ]);
    }
    else {
      this._formController.setFieldValue('checkbox', this._formController.getFieldValue('checkbox').filter((v) => v !== e.target.value));
    }
  }

  render () {
    console.log('rendering', this.formState);
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
        </cc-input-text>

        <cc-input-text label="Email" type="email" ${formInput(this._formController, 'email')}>
        </cc-input-text>

        <input type="checkbox" @change=${this._onFormExpertChange} .checked=${this._expertMode} />
        
        ${this._expertMode ? html`
          <cc-input-text label="Company" ${formInput(this._formController, 'company')}></cc-input-text>
        ` : ''}
        
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
        
        button:focus, input[type='checkbox']:focus,input[type='radio']:focus {
          outline: 2px dashed red;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-uncontrolled', CcFtUncontrolled);
