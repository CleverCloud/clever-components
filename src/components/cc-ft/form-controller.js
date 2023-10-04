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
    this._assertField(field);

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
    this._assertField(field);

    return this.formState[field].value;
  }

  getFieldError (field) {
    this._assertField(field);

    return this.formState[field].error;
  }

  validate () {
    const validation = this._getFieldsDefinition().map((fieldSpec) => {
      const field = fieldSpec.name;
      const element = this._getFieldElement(field);
      console.log(field, element);
      const validation = this._validateField(fieldSpec, element);
      return {
        field,
        element,
        ...validation,
      };
    });

    return {
      valid: validation.every((e) => e.error == null),
      details: validation,
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

    // todo: maybe we don't need to track the error into the state.
    this.formState = {
      ...this.formState,
      ...Object.fromEntries(validation.details.map((v) => [v.field, {
        value: v.value,
        error: v.error,
      }])),
    };
    console.log(JSON.stringify(this.formState, null, 2));

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
      validation.details.find((v) => !v.valid).element.focus();
    }
  }

  error (field, error) {
    this._assertField(field);

    this.formState = {
      ...this.formState,
      [field]: {
        ...this.formState[field],
        error,
      },
    };
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
    this.host.updateComplete.then(() => this._getFieldElement(field)?.focus());
  }

  getFieldDefinition (field) {
    return this._fieldsIndex[field];
  }

  _getFieldElement (field) {
    return this.host.shadowRoot.querySelector(`[name=${field}]`);
  }

  _assertField (field) {
    if (!this._fieldExists(field)) {
      throw new Error(`field "${field}" doesn't exist`);
    }
  }

  _fieldExists (field) {
    return this.getFieldDefinition(field) != null;
  }

  _getFieldsDefinition () {
    return this.definition.fields;
  }

  _validateField (fieldSpec, element) {
    if (element != null && element.validate != null) {
      return element.validate(true);
    }

    const value = this.getFieldValue(fieldSpec.name);

    return new RequiredValidator(fieldSpec.required, fieldSpec.validator).validate(value);
  }
}
