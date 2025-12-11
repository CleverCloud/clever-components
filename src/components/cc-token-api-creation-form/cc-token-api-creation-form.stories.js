import { DateFormatter } from '../../lib/date/date-formatter.js';
import { shiftDateField } from '../../lib/date/date-utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { CcTokenApiCreationForm } from './cc-token-api-creation-form.js';

const DATE_FORMATTER_ISO = new DateFormatter('datetime-iso', 'local');

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
 * @import { TokenApiCreationFormStateLoaded, TokenApiCreationFormStateCreating } from './cc-token-api-creation-form.types.js'
 */

const conf = {
  component: 'cc-token-api-creation-form',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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

export const dataLoadedWithConfigurationStep = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        isMfaEnabled: true,
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        activeStep: 'copy',
        token: 'this-is-my-super-secret-token-that-should-be-copied',
        isMfaEnabled: true,
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        activeStep: 'validation',
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          password: 'my-fake-secret-password',
          mfaCode: '293381',
        },
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
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          expiration: {
            type: 'custom',
            date: null,
          },
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

export const errorWithConfigStepInvalidDateFormat = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          name: 'My API token name',
          expiration: {
            type: 'custom',
            date: 'invalid format',
          },
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

export const errorWithConfigStepDateMin = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'configuration',
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          name: 'My API token name',
          expiration: {
            type: 'custom',
            date: DATE_FORMATTER_ISO.format(shiftDateField(new Date(), 'Y', -1)),
          },
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
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          name: 'My API token name',
          expiration: {
            type: 'custom',
            date: DATE_FORMATTER_ISO.format(shiftDateField(new Date(), 'Y', 2)),
          },
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
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          password: 'my-fake-secret-password',
          mfaCode: 'AAAAAA',
        },
        credentialsError: 'password',
      },
    },
  ],
});

export const errorWithValidationStepInvalid2faCode = makeStory(conf, {
  /** @type {Partial<CcTokenApiCreationForm>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        activeStep: 'validation',
        isMfaEnabled: true,
        values: {
          ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
          password: 'my-fake-secret-password',
          mfaCode: 'AAAAAA',
        },
        credentialsError: 'mfaCode',
      },
    },
  ],
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
          values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
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
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
      },
    },
  ],
  simulations: [
    // Fill token name
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            ...component.state.values,
            name: 'My Token',
          },
        };
      },
    ),
    // Fill token description
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            ...component.state.values,
            description: 'My Token Description',
          },
        };
      },
    ),
    // Select expiration duration
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          isMfaEnabled: true,
          values: {
            ...component.state.values,
            expiration: {
              type: 'preset',
              preset: 'seven-days',
            },
          },
        };
      },
    ),
    // Move to validation step
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: component.state.values,
        };
      },
    ),
    // Fill password
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: {
            ...component.state.values,
            password: 'my-secret-password',
          },
        };
      },
    ),
    // Fill MFA code
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          isMfaEnabled: true,
          values: {
            ...component.state.values,
            mfaCode: '259384',
          },
        };
      },
    ),
    // Submit validation form and transition to creating state
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        getForm(component, 'validation-form').requestSubmit();
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: component.state.values,
          isMfaEnabled: true,
        };
      },
    ),
    // Transition to created state with token
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'copy',
          isMfaEnabled: true,
          token: 'my-fake-secret-token',
          values: component.state.values,
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
        values: CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
      },
    },
  ],
  simulations: [
    // Select custom expiration
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        const currentExpirationPreset =
          component.state.values.expiration.type === 'preset' ? component.state.values.expiration.preset : null;
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...component.state.values,
            expiration: {
              type: 'custom',
              date: CcTokenApiCreationForm.computeExpirationDate(currentExpirationPreset),
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Erase the expiration date value so that it's empty
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...component.state.values,
            expiration: {
              type: 'custom',
              date: null,
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit configuration form (expect empty name and empty date errors)
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    // Set invalid expiration date format
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...CcTokenApiCreationForm.DEFAULT_FORM_VALUES,
            name: 'My API token name',
            expiration: {
              type: 'custom',
              date: 'invalid format',
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit configuration form (expect date format error)
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    // Set past expiration date
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...component.state.values,
            name: 'My API token name',
            expiration: {
              type: 'custom',
              date: DATE_FORMATTER_ISO.format(shiftDateField(new Date(), 'Y', -1)),
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit configuration form (expect date min error)
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    // Set future expiration date (too far)
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...component.state.values,
            name: 'My API token name',
            expiration: {
              type: 'custom',
              date: DATE_FORMATTER_ISO.format(shiftDateField(new Date(), 'Y', 2)),
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit configuration form (expect date max error)
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
      },
    ),
    // Set valid expiration duration (one year)
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'configuration',
          values: {
            ...component.state.values,
            name: 'My API token name',
            expiration: {
              type: 'preset',
              preset: 'one-year',
            },
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit configuration form and move to validation step
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        getForm(component, 'configuration-form').requestSubmit();
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: component.state.values,
          isMfaEnabled: true,
        };
      },
    ),
    // Submit validation form with empty password & 2FA code
    storyWait(
      2000,
      /** @param {CcTokenApiCreationForm[]} components */
      ([component]) => {
        getForm(component, 'validation-form').requestSubmit();
      },
    ),
    // Fill invalid password and MFA code
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            ...component.state.values,
            password: 'my-fake-secret-password',
            mfaCode: 'AAAAAAA',
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Submit validation form, transition to creating (simulating API call)
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        getForm(component, 'validation-form').requestSubmit();
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: component.state.values,
          isMfaEnabled: true,
        };
      },
    ),
    // Transition back to loaded state with password error
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: component.state.values,
          credentialsError: 'password',
          isMfaEnabled: true,
        };
      },
    ),
    // Correct password, submit again (expect MFA code error), transition to creating
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        // clears the invalid format error message
        getForm(component, 'validation-form').requestSubmit();
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            ...component.state.values,
            password: 'my-fake-secret-password-corrected',
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Transition back to loaded state with MFA code error
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: component.state.values,
          isMfaEnabled: true,
          credentialsError: 'mfaCode',
        };
      },
    ),
    // Correct MFA code (still show error state briefly before submitting)
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'validation',
          values: {
            ...component.state.values,
            mfaCode: '293832',
          },
          isMfaEnabled: true,
          credentialsError: 'mfaCode',
        };
      },
    ),
    // Submit validation form with correct credentials, transition to creating
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        // clears the invalid format error message
        getForm(component, 'validation-form').requestSubmit();
        component.state = {
          type: 'creating',
          activeStep: 'validation',
          values: {
            ...component.state.values,
            mfaCode: '293832',
          },
          isMfaEnabled: true,
        };
      },
    ),
    // Transition to created state with token
    storyWait(
      2000,
      /** @param {(CcTokenApiCreationForm & { state: TokenApiCreationFormStateLoaded | TokenApiCreationFormStateCreating })[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          activeStep: 'copy',
          isMfaEnabled: true,
          token: 'my-fake-secret-token',
          values: component.state.values,
        };
      },
    ),
  ],
});
