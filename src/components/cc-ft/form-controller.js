import { dispatchCustomEvent } from '../../lib/events.js';
import { RequiredValidator } from './validation/validation.js';

export class FormController {
  constructor (host, definition, formState = undefined) {
    this.host = host;
    host.addController(this);
    this.definition = definition;
    this._fieldsIndex = Object.fromEntries(this.definition.fields.map((fieldDefinition) => [fieldDefinition.name, fieldDefinition]));
    if (formState == null) {
      this.reset();
    }
    else {
      this.formState = formState;
    }
  }

  get formState () {
    return this.host[this.definition.property];
  }

  set formState (formState) {
    this.host[this.definition.property] = formState;
  }

  // todo: add a parameter that controls if we want to use the reset value or an empty one.
  addFieldDefinition (fieldDefinition) {
    this.definition.fields.push(fieldDefinition);
    this._fieldsIndex[fieldDefinition.name] = fieldDefinition;

    if (this.formState[fieldDefinition.name] == null) {
      this.formState = {
        ...this.formState,
        [fieldDefinition.name]: {
          value: fieldDefinition.reset,
        },
      };
    }
  }

  // todo: add a parameter that controls whether the value should be dropped from the state or not
  removeFieldDefinition (name) {
    const index = this.definition.fields.findIndex((e) => e.name === name);
    if (index !== -1) {
      delete this.definition.fields[index];
      this.definition.fields.length -= 1;
      delete this._fieldsIndex[name];

      // this.formState = {
      //   ...Object.fromEntries(Object.entries(this.formState).filter(([k, _]) => k !== name)),
      // };
    }
  }

  state (state) {
    this.formState = {
      ...this.formState,
      state,
    };
  }

  idle () {
    this.state('idle');
  }

  submitting () {
    this.state('submitting');
  }

  reset () {
    this.formState = {
      state: 'idle',
      ...Object.fromEntries(this._getFieldsDefinition().map((e) => [e.name, {
        value: e.reset,
      }])),
    };
  }

  setFieldValue (field, value) {
    this._assertFieldDefined(field);

    const currentValue = this.getFieldValue(field);

    if (currentValue !== value) {
      this.formState = {
        ...this.formState,
        [field]: {
          ...this.formState[field],
          value,
        },
      };

      dispatchCustomEvent(this.host, 'change',
        {
          form: this.definition.name,
          field,
          value,
        },
      );
    }
  }

  getFieldValue (field) {
    this._assertFieldDefined(field);

    return this.formState[field].value;
  }

  getFieldError (field) {
    this._assertFieldDefined(field);

    return this.formState[field].error;
  }

  validate () {
    const validation = this._getFieldsDefinition().map((fieldSpec) => {
      const field = fieldSpec.name;
      const element = this._getFieldElement(field);
      const value = this.getFieldValue(fieldSpec.name);
      const validation = this._validateField(value, fieldSpec, element);
      return {
        field,
        element,
        value,
        ...validation,
      };
    });

    return {
      valid: validation.every((e) => e.valid),
      fields: validation,
    };
  }

  isFieldValid (field) {
    return this.getFieldError(field) == null;
  }

  isFieldInvalid (field) {
    return !this.isFieldValid(field);
  }

  isValid () {
    return this._getFieldsDefinition()
      .every((fieldSpec) => this.isFieldValid(fieldSpec.name));
  }

  submit () {
    const validation = this.validate();
    console.log(validation.fields);

    this.formState = {
      ...this.formState,
      ...Object.fromEntries(validation.fields.map((v) => [v.field, {
        value: v.value,
        error: v.code,
      }])),
    };
    // console.log(JSON.stringify(this.formState, null, 2));

    if (validation.valid) {
      const data = Object.fromEntries(this._getFieldsDefinition().map((formSpec) => [
        formSpec.name,
        this.getFieldValue(formSpec.name),
      ]));

      dispatchCustomEvent(this.host, 'submit', {
        form: this.definition.name,
        data: data,
      });
    }
    else {
      this.host.updateComplete.then(() => {
        const firstInvalidElement = this.host.shadowRoot.querySelector('[data-cc-error]');
        firstInvalidElement.focus();
      });

    }
  }

  error (field, error) {
    this._assertFieldDefined(field);

    this.formState = {
      ...this.formState,
      [field]: {
        ...this.formState[field],
        error,
      },
    };
    const element = this._getFieldElement(field);
    if (element != null) {
      element.errorMessage = this.getFieldDefinition(field).customErrorMessages?.(error) ?? error;
    }
    this.focus(field);
  }

  errors (errors) {
    const err = Object.fromEntries(errors)
      .map(([field, error]) => ({
        field,
        error,
      }))
      .filter((e) => e.error != null);

    if (err.length === 0) {
      return;
    }

    this.formState = {
      ...this.formState,
      ...Object.fromEntries(err.map((e) => [e.field, {
        value: this.getFieldValue(e.field),
        error: e.error,
      }])),
    };
    this.focus(err[0].field);
  }

  focus (field) {
    // we need to wait the render to occur so that the element is not disabled anymore.
    this.host.updateComplete.then(() => {
      this._getFieldElement(field)?.focus();
    });
  }

  getFieldDefinition (field) {
    return this._fieldsIndex[field];
  }

  hostUpdated () {
    const fieldsWithoutElement = this.definition.fields.filter((f) => this._getFieldElement(f.name) == null).map((f) => f.name);
    if (fieldsWithoutElement.length > 0) {
      console.warn(`For the following fields, we could not find elements with the name attribute specified in definition [${fieldsWithoutElement.join(', ')}].`);
    }
  }

  _getFieldElement (field) {
    return this.host.shadowRoot.querySelector(`[name=${field}]`);
  }

  _assertFieldDefined (field) {
    if (!this._isFieldDefined(field)) {
      throw new Error(`field "${field}" doesn't exist`);
    }
  }

  _isFieldDefined (field) {
    return this.getFieldDefinition(field) != null;
  }

  _getFieldsDefinition () {
    return this.definition.fields;
  }

  _validateField (value, fieldSpec, element) {
    if (element != null && element.validate != null) {
      return element.validate(true);
    }

    return new RequiredValidator(fieldSpec.required, fieldSpec.validator).validate(value);
  }
}
