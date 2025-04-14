import { dispatchCustomEvent } from '../../lib/events.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-api-creation-form.js';

/**
 * @param {CcTokenApiCreationForm} component
 * @param {'duration'|'date'|'name'|'password'|'mfa'} formControlName
 */
function getFormControl(component, formControlName) {
  switch (formControlName) {
    case 'duration':
      return /** @type {CcSelect} */ (component.shadowRoot.querySelector('[name="expiration-duration"]'));
    case 'date':
      return /** @type {CcInputDate} */ (component.shadowRoot.querySelector('[name="expiration-date"]'));
    case 'name':
      return /** @type {CcInputText} */ (component.shadowRoot.querySelector('[name="name"]'));
    case 'password':
      return /** @type {CcInputText} */ (component.shadowRoot.querySelector('[name="password"]'));
    case 'mfa':
      return /** @type {CcInputText} */ (component.shadowRoot.querySelector('[name="mfa-code"]'));
  }
}

/**
 * @param {CcTokenApiCreationForm} component
 * @param {'config'|'validation'} formName
 */
function getForm(component, formName) {
  switch (formName) {
    case 'config':
      return /** @type {HTMLFormElement} */ (component.shadowRoot.querySelector('form[name="config-form"]'));
    case 'validation':
      return /** @type {HTMLFormElement} */ (component.shadowRoot.querySelector('form[name="validation-form"]'));
  }
}

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-token-api-creation-form>',
  component: 'cc-token-api-creation-form',
};

/**
 * @typedef {import('./cc-token-api-creation-form.js').CcTokenApiCreationForm} CcTokenApiCreationForm
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('../cc-input-date/cc-input-date.js').CcInputDate} CcInputDate
 * @typedef {import('../cc-select/cc-select.js').CcSelect} CcSelect
 */

const conf = {
  component: 'cc-token-api-creation-form',
};

// TODO: form errors (config step)
export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const dataLoadedWithValidationStep = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
  },
});

export const dataLoadedWithApiTokenCreated = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'created',
        token: 'this-is-my-super-secret-token-that-should-be-copied',
      },
    },
  ],
});

export const waitingWithCreatingToken = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'creating',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
    getFormControl(component, 'password').value = 'my-fake-secret-password';
    getFormControl(component, 'mfa').value = '294386';
  },
});

export const errorWithLoading = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const errorWithConfigStepEmptyFormControls = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: (component) => {
    const expirationDurationElement = getFormControl(component, 'duration');
    expirationDurationElement.value = 'custom';
    dispatchCustomEvent(expirationDurationElement, 'input', 'custom');
    expirationDurationElement.updateComplete.then(() => {
      getFormControl(component, 'date').value = '';
      getForm(component, 'config').requestSubmit();
    });
  },
});

export const errorWithConfigStepInvalidDateFormat = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: async (component) => {
    const expirationDurationElement = getFormControl(component, 'duration');
    const expirationDateElement = getFormControl(component, 'date');
    expirationDurationElement.value = 'custom';
    dispatchCustomEvent(expirationDurationElement, 'input', expirationDurationElement.value);
    await expirationDurationElement.updateComplete;
    expirationDateElement.value = 'toto';
    await expirationDateElement.updateComplete;
    getForm(component, 'config').requestSubmit();
  },
});

export const errorWithConfigStepDateMin = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: async (component) => {
    getFormControl(component, 'name').value = 'My token name';
    const expirationDurationElement = getFormControl(component, 'duration');
    const expirationDateElement = getFormControl(component, 'date');
    expirationDurationElement.value = 'custom';
    dispatchCustomEvent(expirationDurationElement, 'input', expirationDurationElement.value);
    await expirationDurationElement.updateComplete;
    expirationDateElement.value = '2023-12-01 14:02:03';
    await expirationDateElement.updateComplete;
    getForm(component, 'config').requestSubmit();
  },
});

export const errorWithValidationStepEmptyFormControls = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
    getForm(component, 'validation').requestSubmit();
  },
});

export const errorWithValidationStepEmptyFormControlsAndMfaDisabled = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: false,
        hasCredentialsError: false,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
    getForm(component, 'validation').requestSubmit();
  },
});

export const errorWithValidationStepInvalidCredentials = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: true,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
  },
});

// TODO: proper error message specific to this story
export const errorWithValidationStepInvalidCredentialsAndMfaDisabled = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: false,
        hasCredentialsError: true,
      },
    },
  ],
  onUpdateComplete: (component) => {
    getFormControl(component, 'name').value = 'My token Name';
    getForm(component, 'config').requestSubmit();
  },
});

export const simulationLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      1500,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'idle',
          isMfaEnabled: true,
          hasCredentialsError: false,
        };
      },
    ),
  ],
});

export const simulationLoadingError = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      1500,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationsCreatingWithSuccess = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'name').value = 'My API Token';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'duration').value = 'thirty-days';
        dispatchCustomEvent(getFormControl(component, 'duration'), 'input', 'thirty-days');
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'config').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'password').value = 'my-secret-password';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'mfa').value = '123456';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'creating',
          isMfaEnabled: true,
          hasCredentialsError: false,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'created',
          token: 'simulated-secret-token-mfa-enabled-12345',
        };
      },
    ),
  ],
});

export const simulationWithAllPossibleFormErrors = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'idle',
        isMfaEnabled: true,
        hasCredentialsError: false,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        const expirationDurationElement = getFormControl(component, 'duration');
        expirationDurationElement.value = 'custom';
        dispatchCustomEvent(expirationDurationElement, 'input', expirationDurationElement.value);
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'date').value = '';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'config').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'name').value = 'My Corrected Token';
        getFormControl(component, 'date').value = 'invalid format';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'config').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'date').value = '2023-12-20 14:00:00';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'config').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        const expirationDurationElement = getFormControl(component, 'duration');
        expirationDurationElement.value = 'one-year';
        dispatchCustomEvent(expirationDurationElement, 'input', expirationDurationElement.value);
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'config').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'validation').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getFormControl(component, 'password').value = 'my-fake-secret-password';
        getFormControl(component, 'mfa').value = 'AAAAAAA';
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'creating',
          isMfaEnabled: true,
          hasCredentialsError: false,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'idle',
          isMfaEnabled: true,
          hasCredentialsError: true,
        };
      },
    ),
  ],
});
