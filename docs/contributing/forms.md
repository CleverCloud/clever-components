---
kind: '👋 Contributing'
title: 'Forms guidelines'
---
# Forms guidelines

In this guide, we detail how to handle forms and validation with Clever Components.

## Form Handling and Data

Forms in Clever Components rely on the `formSubmit` directive, which:

* Handles form submission,
* Calls `validate()` or `checkValidity()` on each form control to retrieve the latest validity status,
* Calls `reportInlineValidity()` to display or hide errors,
* Sets focus on the first invalid field,
* Calls appropriate callbacks once validation is done.

The directive takes 2 optional callbacks:

* `onValid(formData, formElement)`: Called when all fields are valid.
The formData object contains all form values with the form control's name attribute as key.

* `onInvalid(formValidity, formElement)`: Only needed when using native form controls that require custom inline error messages.
Called when some fields are invalid.

Example usage:

```js
class MyForm extends LitElement {
  _onValid(formData) {
    // formData = {
    //   email: 'user@example.com',
    //   age: '25'
    // }
     this.dispatchEvent(new MyFormSubmitEvent(formData));
  }

  render() {
    return html`
      <!-- bind 'this' so it refers to the component instance in the callback instead of the form submit inner code -->
      <form ${formSubmit(this._onValid.bind(this))}>
        <cc-input-text name="email" required></cc-input-text>
        <cc-input-number name="age"></cc-input-number>
        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
```

### Handling Multiple Values

There are two ways to handle multiple values in forms:

#### Grouping form controls with identical names

Multiple form controls with the same name have their values automatically aggregated into an array:

```js
<form ${formSubmit(this._onValid.bind(this))}>
  <cc-input-text name="tags" value="tag1"></cc-input-text>
  <cc-input-text name="tags" value="tag2"></cc-input-text>
</form>
// formData.tags = ['tag1', 'tag2']
```

#### Components with internal array handling

Form controls can manage array values internally.
The array values are processed correctly by the `formSubmit` directive:

```js
<form ${formSubmit(this._onValid.bind(this))}>
  <cc-input-text name="tags" .tags=${[]}></cc-input-text>
  <cc-tcp-redirection-form name="redirections"></cc-tcp-redirection-form>
</form>
// formData.tags and formData.redirections will be arrays
```

## Form Controls and Validation

### Available Controls

We provide several form control components:

* `<cc-input-text>`: For text input (with support for email/password/etc.),
* `<cc-input-number>`: For numeric input with min/max constraints,
* `<cc-input-date>`: For date selection,
* `<cc-select>`: For option selection.

Each control requires a `name` attribute.

For form submission, you can either use:

- a `<cc-button>` element with an explicitly `type="submit"` attribute,
- or if you don't need the `cc-button` styles or behavior, a native `<button>` element, which gets a `type="submit"` by default when placed within a `form` element.

All Clever Components form controls extend `CcFormControlElement` which provides built-in validation:

* Required fields with `required` attribute,
* Email format with `type="email"`,
* Number ranges with `min`/`max`,
* Date formats for date inputs.

Validation is a two step process:

1. Values are validated against built-in and custom validators on input,
2. Error messages are displayed on form submission or by calling `reportInlineValidity()` on a form control that implements `CcFormControlElement`.

Example with built-in validation:

```js
<form ${formSubmit(this._onValid.bind(this))}>
  <cc-input-text name="email" type="email" required></cc-input-text>
  <cc-input-number name="age" min="0" max="120"></cc-input-number>
  <cc-input-date name="startDate" required></cc-input-date>
</form>
```

### Custom Validation

Add custom validation with the `customValidator` property.
A custom validator is an object with a `validate` method that returns a `Validation` object.

```js
// this path assumes you are importing it a from a component file in `src/components/cc-component-name/cc-component-name.js`
import { Validation } from '../../lib/form/validation.js';

const LOWERCASE_VALIDATOR = {
  validate: (value) => {
    return value.toLowerCase() !== value
      ? Validation.invalid('notLowerCase')
      : Validation.VALID;
  },
};

render () {
  return html`
    <cc-input-text
      name="username"
      .customValidator=${LOWERCASE_VALIDATOR}
      .customErrorMessages=${{
        notLowerCase: 'Username must be lowercase'
      }}
    ></cc-input-text>
  `;
}
```

### Custom Error Messages

Override default messages or provide messages for custom validators by providing a `customErrorMessages` object.
This object uses validation error codes as keys (like `empty`, `badEmail`) and maps them to error message strings or functions that return messages.

```js
const ERROR_MESSAGES = {
  empty: 'This field is required!',
  badEmail: 'Please enter a valid email',
  notLowerCase: () => sanitize`Must be <strong>lowercase</strong>`
};

render() {
  return html`
    <cc-input-text
      name="field"
      .customErrorMessages=${ERROR_MESSAGES}
    ></cc-input-text>
  `;
}
```

### Native Form Controls

Native form controls are validated by the browser's built-in validation logic.
The `formSubmit` directive runs `checkValidity()` on the form elements to retrieve the validity state of each element.

You may want to enhance the native form controls with custom validation logic and inline error messages.
To do so:
1. Set up input handlers that update the control's validity using `setCustomValidity()`,
2. Use `formSubmit`'s `onValid` and `onInvalid` callbacks to toggle the corresponding error messages:

```js
class MyForm extends LitElement {
  _onNameInput(e) {
    const input = e.target;
    // Custom validation logic
    if (input.value.toLowerCase() !== input.value) {
      input.setCustomValidity('Value must be lowercase');
    }
    else {
      input.setCustomValidity(''); // Clear error
    }
  }

  _onFirstnameInput(e) {
    const input = e.target;
    // Custom validation logic
    if (input.value.toUpperCase() !== input.value) {
      input.setCustomValidity('Value must be uppercase');
    }
    else {
      input.setCustomValidity(''); // Clear error
    }
  }

  _onValid(formData) {
    // Clear error message when form is valid
    this._nameErrorMessage = null;
    this._firstnameErrorMessage = null;
    // Dispatch data for smart component
     this.dispatchEvent(new MyFormSubmitEvent(formData));
  }

  _onInvalid(formValidity) {
    const nameError = formValidity.find(v => v.name === 'name');
    const firstnameError = formValidity.find(v => v.name === 'firstname');

    if (nameError?.validity.valid === false) {
      this._nameErrorMessage = nameError.validity.code;
    } else {
      this._nameErrorMessage = null;
    }

    if (firstnameError?.validity.valid === false) {
      this._firstnameErrorMessage = firstnameError.validity.code;
    } else {
      this._firstnameErrorMessage = null;
    }
  }

  render() {
    return html`
      <form ${formSubmit(this._onValid.bind(this), this._onInvalid.bind(this))}>
        <input
          name="name"
          required
          @input=${this._onNameInput}
        >
        ${this._nameErrorMessage
          ? html`<div class="error">${this._nameErrorMessage}</div>`
          : ''
        }
        <input
          name="firstname"
          required
          @input=${this._onFirstnameInput}
        >
        ${this._firstnameErrorMessage
          ? html`<div class="error">${this._firstnameErrorMessage}</div>`
          : ''
        }
        <cc-button type="submit">Submit</cc-button>
      </form>
    `;
  }
}
```

Note: For native validation constraints (like `required` or `type="email"`), you don't need the `onInput` handler - the browser's built-in validation already handles those cases.

## Smart Component Interactions

Please refer to the [smart component documentation](https://www.clever-cloud.com/developers/doc/clever-components/?path=/docs/%F0%9F%91%8B-contributing-smart-component-guidelines--docs) for details about state management with smart components.

## Form and Smart Component Separation

When building forms that interact with data and APIs, we recommend separating concerns between a UI component that handles form display and validation, and a smart component that manages data fetching and state. Here's how to structure this:

### UI Form Component

The form component should focus on:
- Rendering form controls
- Handling validation
- Managing form state
- Dispatching events when valid
- Exposing a `resetForm` method
- Managing focus on invalid fields

```js
class FormComponent extends LitElement {
  static get properties() {
    return {
      formState: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.formState = { type: 'idle' };
    this._formRef = createRef();

    // Auto-focus first invalid field
    new FormErrorFocusController(this, this._formRef, () => this.formState.errors);
  }

  // Used by smart component to reset form values after successful data update
  resetForm() {
    this._formRef.value.reset();
  }

  // Maps API error codes to translated error messages
  _getErrorMessage(code) {
    if (code === 'email-used') {
      return 'This email is already taken';
    }
    return null;
  }

  // Called when form is valid. Updates component state to match form data
  // and dispatches event to smart component with form values
  _onValidSubmit(formData) {
    this.formState = {
      type: 'idle',
      values: {
        name: formData.name,
        email: formData.email,
      },
    };
     this.dispatchEvent(new MyFormSubmitEvent(formData));
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
```

### Smart Component

The smart component should handle:
- Loading initial data
- Processing form submissions
- Resetting the form after successful submission
- Error handling
- State updates
- Success notifications

```js
defineSmartComponent({
  selector: 'form-component',
  params: {},
  async onContextUpdate({ component, updateComponent, onEvent }) {
    // Reset form and load initial data
    component.resetForm();
    updateComponent('formState', { type: 'loading' });

    getFormData({ apiConfig, signal })
      .then((formData) => {
        updateComponent('formState', {
          type: 'idle',
          values: formData
        });
      })
      .catch((error) => {
        console.error(error);
        updateComponent('formState', { type: 'error' });
      });

    // Handle submission
    onEvent('my-form-submit', (data) => {
      updateComponent('formState', (formState) => {
        formState.type = 'submitting';
      });

      updateDataThroughAPI(data)
        .then(() => {
          updateComponent('formState', (formState) => {
            formState.type = 'idle';
          });
          component.resetForm();
          notifySuccess('Done successfully 🎉');
        })
        .catch((error) => {
          updateComponent('formState', (formState) => {
            formState.type = 'idle';
            if (error.message === 'email-used') {
              formState.errors = {
                email: 'email-used',
              };
            }
          });
        });
    });
  },
});
```

### Key Patterns

When implementing this separation:

1. The UI component should:
   - Accept a `formState` property to display current state
   - Dispatch events for form submission
   - Handle field-level validation
   - Map error codes to messages
   - Expose a way to reset form fields when needed

2. The smart component should:
   - Load initial data
   - Listen for the event dispatched when the form passes validation
   - Make API calls
   - Update the form state
   - Handle success/error flows
   - Trigger notifications

To reset the form after successful submission:
1. Call `component.resetForm()` to clear form fields
2. Reset form state to `idle` using `updateComponent()`
3. The new state will trigger a rerender with cleared fields and errors

To display error messages coming from the API:
1. Define error codes in the smart component's error handling using `updateComponent` to trigger a new render (`formState.errors = { email: 'email-used' }`)
2. Map error codes to messages in the form component's `_getErrorMessage()` method
3. Pass the mapped message to form controls via the `errorMessage` property
