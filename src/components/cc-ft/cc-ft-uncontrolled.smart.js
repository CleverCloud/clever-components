import { defineSmartComponent } from '../../lib/define-smart-component.js';
import '../cc-smart-container/cc-smart-container.js';
import './cc-ft-uncontrolled.js';

defineSmartComponent({
  selector: 'cc-ft-uncontrolled',
  params: {
    fake: { type: String },
  },
  onContextUpdate ({ component, context, onEvent, updateComponent, signal }) {
    const api = getApi();

    onEvent('cc-ft-uncontrolled:submit', (detail) => {
      updateComponent('formState', (formState) => {
        formState.state = 'submitting';
      });

      api.submitForm(detail)
        .then(() => {
          component.resetFormState();
        })
        .catch((error) => {
          if (error.message === 'email-used') {
            updateComponent('formState', (formState) => {
              formState.state = 'idle';
              formState.email.error = 'already-used';
            });
            component.focusFormItem('email');
          }
        });
    });
  },
});

// -- API calls
function getApi () {
  return {
    submitForm ({ name, email }) {
      if (email.startsWith('used')) {
        return fail(500);
      }
      return wait(500);
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
