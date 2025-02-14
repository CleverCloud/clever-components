---
kind: '👋 Contributing'
title: 'Forms guidelines'
---
---
kind: '👋 Contributing'
title: 'Forms guidelines'
---
In this guide, we will detail how you should handle forms and validation in Clever Components.

All Clever Components form controls (`cc-*` components) extend the `CcFormControlElement` class which provides two key methods:

- `validate()`: Returns the validity state of the form control after validating its current value
- `reportInlineValidity()`: Displays or hides validation error messages inline below the form control depending on validity

The `formSubmit` directive relies on these methods to perform form validation and error reporting during form submission.
It automatically adds the `novalidate` attribute to the form to prevent native browser validation tooltips which have poor UX.

## Quick start

```js
import { formSubmit } from '@clevercloud/components/lib/form/form-submit-directive.js';

class MyForm extends LitElement {
  _onValid(formData) {
    // Dispatch form data to smart component
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <!-- The name attribute is required and will be the key in the formData object -->
        <cc-input-text name="email" required></cc-input-text>
        <!-- The type="submit" attribute is required to trigger form submission -->
        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
```

## Form handling

Forms in Clever Components use the `formSubmit` directive, which:

* Handles form submission
* Calls `validate()` on each form control to check validity
* Calls `reportInlineValidity()` to display any errors
* Manages focus on invalid fields
* Calls appropriate callbacks

The directive takes 2 optional callbacks:

* `onValid(formData, formElement)`: Called when all fields are valid.
The formData object contains all form values with the form control's name attribute as key.
Typically used to dispatch data to smart components.

* `onInvalid(formValidity, formElement)`: Only needed when using native form controls that require custom inline error messages.
Called when some fields are invalid.

## Form controls

### Available controls

We provide several form control components:

* `<cc-input-text>`: For text input (with support for email/password/etc.)
* `<cc-input-number>`: For numeric input with min/max constraints
* `<cc-input-date>`: For date selection
* `<cc-select>`: For option selection
* `<cc-toggle>`: For boolean selection

Each control requires a `name` attribute to identify its value in the form submission data.

The submit button must use `<cc-button type="submit">` to properly trigger form submission.

### Native form controls

You can also use native form controls.
They will be validated but won't show inline errors (as native error reporting has poor UX).
Like custom controls, they must have a `name` attribute.
If you need to display custom inline error messages for native controls, use the `onInvalid` callback.

## Validation

### Built-in validation

Form controls have built-in validation:

* Required fields (`required` attribute)
* Email format (`type="email"`)
* Min/max for numbers
* Date format

```js
class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <!-- Values will be accessible as formData.email and formData.age -->
        <cc-input-text name="email" type="email" required></cc-input-text>
        <cc-input-number name="age" min="0" max="120"></cc-input-number>
      </form>
    `;
  }
}
```

### Custom validation

You can add custom validation with the `customValidator` property:

```js
import { Validation } from '@clevercloud/components/lib/form/validation.js';

const LOWERCASE_VALIDATOR = {
  validate: (value) => {
    return value.toLowerCase() !== value
      ? Validation.invalid('notLowerCase')
      : Validation.VALID;
  },
};

class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <cc-input-text
          name="username"
          .customValidator=${LOWERCASE_VALIDATOR}
          .customErrorMessages=${{
            notLowerCase: 'Username must be lowercase'
          }}
        ></cc-input-text>
      </form>
    `;
  }
}
```

### Custom error messages

You can customize error messages with `customErrorMessages`.
The keys in this object must match the error codes that could be returned by validators:

- Built-in validators use codes like `empty`, `badEmail`, `rangeUnderflow`, etc.
- Custom validators use the codes you define in `Validation.invalid(code)` (imported from `@clevercloud/components/lib/form/validation.js`)

```js
const ERROR_MESSAGES = {
  // Match built-in validator codes
  empty: 'This field is required!',
  badEmail: 'Please enter a valid email',
  // Match custom validator code 'notLowerCase'
  notLowerCase: () => sanitize`Must be <strong>lowercase</strong>`
};

class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <cc-input-text
          name="field"
          .customErrorMessages=${ERROR_MESSAGES}
        ></cc-input-text>
      </form>
    `;
  }
}
```

## Examples

### Simple form

```js
class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <cc-input-text name="name" required></cc-input-text>
        <cc-input-text name="email" type="email" required></cc-input-text>
        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
```

### Dynamic form

```js
class DynamicForm extends LitElement {
  static properties = {
    _proMode: { type: Boolean, state: true }
  };

  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <cc-input-text name="name" required></cc-input-text>

        <label>
          <input
            type="checkbox"
            name="proMode"
            .checked=${this._proMode}
            @change=${(e) => this._proMode = e.target.checked}
          />
          Pro mode
        </label>

        ${this._proMode ? html`
          <cc-input-text name="company" required></cc-input-text>
        ` : ''}

        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
```

### Form with array values

There are two ways to handle array values in forms:

1. Using multiple form controls with the same name:

```js
class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <fieldset>
          <legend>Names</legend>
          <!-- Multiple fields with same name will create an array in formData.names -->
          <cc-input-text name="names" inline></cc-input-text>
          <cc-input-text name="names" inline></cc-input-text>
        </fieldset>
        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
// On submit, formData.names will be an array: ['value1', 'value2']
```

2. Using a form control that internally manages an array value:

```js
class MyForm extends LitElement {
  _onValid(formData) {
    dispatchCustomEvent(this, 'change', formData);
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this))}>
        <!-- Component that manages tags as an array internally -->
        <cc-input-text name="tags" .tags=${[]}></cc-input-text>

        <!-- Component managing TCP redirections as an array -->
        <cc-tcp-redirection-form name="redirections"></cc-tcp-redirection-form>

        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
// On submit, formData.tags will be the array managed by the component
// formData.redirections will contain the array of TCP redirections
```

In both cases, the form data will contain an array when you handle the submission.
The difference is whether the array is created by grouping multiple form controls or managed internally by a single form control component.

### Smart component interactions

Please refer to the [smart component documentation](../principles/smart-components.md) for details about state management with smart components.

Here is an example of a form component working with its smart parent:

```js
// Form component
class FormComponent extends LitElement {
  static get properties() {
    return {
      formState: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this._formRef = createRef();
    // The FormErrorFocusController automatically handles focusing the first invalid field
    // when form errors occur. It takes the component instance, form reference, and a
    // function that returns the current form errors.
    new FormErrorFocusController(this, this._formRef, () => this.formState.errors);
    this.formState = { type: 'idle' };
  }

  // resetForm() clears all form fields back to their default state
  // This is used after successful submission to start fresh
  resetForm() {
    this._formRef.value.reset();
  }

  // Helper to map error codes to user-friendly messages
  _getErrorMessage(code) {
    if (code === 'email-used') {
      return 'This email is already taken';
    }
    return null;
  }

  // _onValidSubmit is called when the form passes validation
  // We reset the formState with new values to trigger a re-render
  // while maintaining the 'idle' state since submission handling
  // is delegated to the smart component
  _onValidSubmit(formData) {
    this.formState = {
      type: 'idle',
      values: {
        name: formData.name,
        email: formData.email,
      },
    };
    dispatchCustomEvent(this, 'submit-form', formData);
  }

  render() {
    const isFormSubmitting = this.formState.type === 'submitting';

    return html`
      <form ${ref(this._formRef)} ${formSubmit(this._onValidSubmit.bind(this))}>
        <cc-input-text
          label="Name"
          name="name"
          required
          ?readonly=${isFormSubmitting}
          value="${this.formState.values?.name}"
        ></cc-input-text>
        <cc-input-text
          label="Email"
          name="email"
          type="email"
          required
          ?readonly=${isFormSubmitting}
          value="${this.formState.values?.email}"
          .errorMessage=${this._getErrorMessage(this.formState.errors?.email)}
        ></cc-input-text>
        <cc-button primary type="submit" ?waiting=${isFormSubmitting}>Submit</cc-button>
      </form>
    `;
  }
}

// Smart component configuration
defineSmartComponent({
  selector: 'form-component',
  params: {},
  async onContextUpdate({ component, updateComponent, onEvent }) {
    // Set initial form values
    component.formState = {
      type: 'idle',
      values: {
        name: 'initial name',
        email: 'initial-email@example.com',
      },
    };

    // Handle form submission
    onEvent('form-component:submit-form', (data) => {
      // Set submitting state
      updateComponent('formState', (formState) => {
        formState.type = 'submitting';
      });

      submitForm(data)
        .then(() => {
          // Reset form on success
          updateComponent('formState', (formState) => {
            formState.type = 'idle';
            // Clear any previous errors
            formState.errors = null;
          });
          // Call resetForm() to clear form fields
          component.resetForm();
          notifySuccess('Done successfully 🎉');
        })
        .catch((error) => {
          // Handle validation errors
          updateComponent('formState', (formState) => {
            formState.type = 'idle';
            // Set error code that will be mapped to message by _getErrorMessage()
            if (error.message === 'email-used') {
              formState.errors = { email: 'email-used' };
            }
          });
        });
    });
  },
});
```

The form component manages its state through the `formState` property which tracks submission status, form values and validation errors. The smart component configuration handles initializing the form with default values and processes form submissions with proper error handling and success notifications. This creates a clean separation between form UI logic and data/state management.

To reset the form after successful submission:
1. Call `component.resetForm()` to clear form fields
2. Update `formState` to clear any errors with `formState.errors = null`
3. Set `formState.type = 'idle'` to reset submission state

To display error messages:
1. Define error codes in the smart component's error handling (`formState.errors = { email: 'email-used' }`)
2. Map error codes to messages in the form component's `_getErrorMessage()` method
3. Pass the mapped message to form controls via the `errorMessage` property
