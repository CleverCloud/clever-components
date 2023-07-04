import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-ft-controlled.js';
import { validateEmailAddress } from '../../lib/email.js';

defineSmartComponent({
  selector: 'cc-ft-controlled',
  params: {
    fake: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {
    const api = getApi();

    const INITIAL_VALUES = {
      name: {
        value: '',
      },
      email: {
        value: '',
      },
    };

    const model = {
      myProp: 'coucou',
      formState: {
        state: 'idle',
        ...INITIAL_VALUES,
      },
    };

    const validators = {
      name (value) {
        if (value == null || value.length === 0) {
          return 'empty';
        }
        return null;
      },
      email (value) {
        return validateEmailAddress(value);
      },
    };

    updateComponent('myProp', model.myProp);
    updateComponent('formState', model.formState);

    const onFormItemChanged = (prop, value) => {
      model.formState = {
        ...model.formState,
        [prop]: {
          ...model.formState[prop],
          value: value,
        },
      };

      updateComponent('formState', model.formState);
    };

    onEvent('cc-ft-controlled:nameChanged', (value) => {
      onFormItemChanged('name', value);
    });

    onEvent('cc-ft-controlled:emailChanged', (value) => {
      onFormItemChanged('email', value);
    });

    onEvent('cc-ft-controlled:submit', () => {
      const nameValidation = validators.name(model.formState.name.value);
      const emailValidation = validators.email(model.formState.email.value);

      const isValid = nameValidation == null && emailValidation == null;

      if (isValid) {
        model.formState = {
          ...model.formState,
          state: 'submitting',
          name: {
            value: model.formState.name.value,
          },
          email: {
            value: model.formState.email.value,
          },
        };
        updateComponent('formState', model.formState);

        api.submitForm()
          .then(() => {
            model.formState = {
              state: 'idle',
              ...INITIAL_VALUES,
            };
            updateComponent('formState', model.formState);
          })
          .catch((error) => {
            // todo: error
            if (error.message === 'email-used') {
              model.formState = {
                ...model.formState,
                state: 'idle',
                email: {
                  ...model.formState.email,
                  error: 'already-used',
                },
              };
              updateComponent('formState', model.formState);
              component.focusFormItem('email');
            }
          });
      }
      else {
        model.formState = {
          ...model.formState,
          name: {
            ...model.formState.name,
            error: nameValidation,
          },
          email: {
            ...model.formState.email,
            error: emailValidation,
          },
        };
        updateComponent('formState', model.formState);

        if (nameValidation != null) {
          component.focusFormItem('name');
        }
        else if (emailValidation != null) {
          component.focusFormItem('email');
        }
      }
    });
  },
});

// -- API calls
function getApi () {
  return {
    submitForm () {
      // return wait(500);
      return fail(500);
    },
  };
}

function wait (ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function fail (ms) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('email-used'));
    }, ms);
  });
}
