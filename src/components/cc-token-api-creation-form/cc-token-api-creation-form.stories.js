import { DateFormatter } from '../../lib/date/date-formatter.js';
import { shiftDateField } from '../../lib/date/date-utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-token-api-creation-form.js';

const dateFormatter = new DateFormatter('datetime-iso', 'local');
const TODAY = new Date(Date.now());

/**
 * @param {CcTokenApiCreationForm} component
 * @param {'configuration-form'|'validation-form'} formName
 * @returns {HTMLFormElement}
 */
const getForm = function (component, formName) {
  return component.shadowRoot.querySelector(`form[name=${formName}]`);
};

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
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
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
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: true,
      },
    },
  ],
});

export const dataLoadedWithApiTokenCreated = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'created',
        token: 'this-is-my-super-secret-token-that-should-be-copied',
        isMfaEnabled: true,
      },
    },
  ],
});

export const waitingWithCreatingToken = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isWaiting: true,
        isMfaEnabled: true,
      },
    },
  ],
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
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'configuration-form').requestSubmit();
  },
});

export const errorWithConfigStepInvalidDateFormat = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        values: {
          name: 'My API token name',
          expirationDuration: 'custom',
          expirationDate: 'toto',
        },
        activeStep: 'configuration',
        isMfaEnabled: true,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'configuration-form').requestSubmit();
  },
});

export const errorWithConfigStepDateMin = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        values: {
          name: 'My API token name',
          expirationDuration: 'custom',
          expirationDate: '2023-12-01 14:02:03',
        },
        isMfaEnabled: true,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'configuration-form').requestSubmit();
  },
});

export const errorWithConfigStepDateMax = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        values: {
          name: 'My API token name',
          expirationDuration: 'custom',
          expirationDate: dateFormatter.format(shiftDateField(TODAY, 'Y', 2)),
        },
        isMfaEnabled: true,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'configuration-form').requestSubmit();
  },
});

export const errorWithValidationStepEmptyFormControls = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: true,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'validation-form').requestSubmit();
  },
});

export const errorWithValidationStepEmptyFormControlsAndMfaDisabled = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: false,
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'validation-form').requestSubmit();
  },
});

export const errorWithValidationStepInvalidPassword = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: true,
        credentialsError: 'password',
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'validation-form').requestSubmit();
  },
});

export const errorWithValidationStepInvalid2faCode = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: true,
        credentialsError: 'mfaCode',
      },
    },
  ],
  /** @param {CcTokenApiCreationForm} component */
  onUpdateComplete: (component) => {
    getForm(component, 'validation-form').requestSubmit();
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
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
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
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
            description: 'My Token Description',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
            description: 'My Token Description',
            expirationDuration: 'seven-days',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
            description: 'My Token Description',
            expirationDuration: 'seven-days',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
            description: 'My Token Description',
            expirationDuration: 'seven-days',
            password: 'my-secret-password',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: {
            name: 'My Token',
            description: 'My Token Description',
            expirationDuration: 'seven-days',
            password: 'my-secret-password',
            mfaCode: '259384',
          },
        };
      },
    ),
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { type: 'loaded', activeStep: 'validation' })[]} components */
      ([component]) => {
        getForm(component, 'validation-form').requestSubmit();
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            name: 'My Token',
            description: 'My Token Description',
            expirationDuration: 'seven-days',
            password: 'my-secret-password',
            mfaCode: '259384',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'created',
          isMfaEnabled: true,
          token: 'my-fake-secret-token',
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
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            expirationDuration: 'custom',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            expirationDuration: 'custom',
            expirationDate: '',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            name: 'My API token name',
            expirationDuration: 'custom',
            expirationDate: 'invalid format',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            name: 'My API token name',
            expirationDuration: 'custom',
            expirationDate: '2023-12-20 14:00:00',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            name: 'My API token name',
            expirationDuration: 'custom',
            expirationDate: dateFormatter.format(shiftDateField(TODAY, 'Y', 2)),
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password',
            mfaCode: 'AAAAAAA',
          },
          credentialsError: 'password',
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password-corrected',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password-corrected',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
          credentialsError: 'mfaCode',
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password-corrected',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            name: 'My API token name',
            expirationDuration: 'one-year',
            password: 'my-fake-secret-password-corrected',
            mfaCode: '293832',
          },
          isMfaEnabled: true,
        };
      },
    ),
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'created',
          isMfaEnabled: true,
          token: 'my-fake-secret-token',
        };
      },
    ),
  ],
});
