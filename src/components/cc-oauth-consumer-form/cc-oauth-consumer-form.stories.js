import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-form.js';

export default {
  tags: ['autodocs'],
  title: '🛠 oAuth Consumer/<cc-oauth-consumer-form>',
  component: 'cc-oauth-consumer-form',
};

const conf = {
  component: 'cc-oauth-consumer-form',
};

/** @type {OauthConsumerWithoutKeyAndSecret} */
const NEW_OAUTH_CONSUMER = {
  name: 'My New OAuth Consumer',
  url: 'https://www.example.com/home',
  baseUrl: 'https://www.example.com',
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
  picture: getAssetUrl('/infra/clever-cloud-square.svg'),
  rights: {
    almighty: false,
    accessOrganisations: true,
    accessOrganisationsBills: false,
    accessOrganisationsConsumptionStatistics: true,
    accessOrganisationsCreditCount: true,
    accessPersonalInformation: false,
    manageOrganisations: true,
    manageOrganisationsApplications: true,
    manageOrganisationsMembers: false,
    manageOrganisationsServices: false,
    managePersonalInformation: true,
    manageSshKeys: true,
  },
};

/**
 * @typedef {import('./cc-oauth-consumer-form.js').CcOauthConsumerForm} CcOauthConsumerForm
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleCreate} OauthConsumerFormStateIdleCreate
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateUpdating} OauthConsumerFormStateUpdating
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateCreating} OauthConsumerFormStateCreating
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleUpdate} OauthConsumerFormStateIdleUpdate
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateLoading} OauthConsumerFormStateLoading
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateError} OauthConsumerFormStateError
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateDeleting} OauthConsumerFormStateDeleting
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerWithoutKeyAndSecret} OauthConsumerWithoutKeyAndSecret
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('../cc-oauth-consumer-info/cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 * @typedef {import('../cc-input-text/cc-input-text.js').CcInputText} CcInputText
 */

/** @type {OauthConsumer} */
const oAuthConsumerData = {
  name: 'My OAuth Consumer',
  url: 'https://www.example.com/home',
  baseUrl: 'https://www.example.com',
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
  picture: getAssetUrl('/infra/clever-cloud-square.svg'),
  rights: {
    almighty: false,
    accessOrganisations: true,
    accessOrganisationsBills: false,
    accessOrganisationsConsumptionStatistics: true,
    accessOrganisationsCreditCount: true,
    accessPersonalInformation: false,
    manageOrganisations: true,
    manageOrganisationsApplications: true,
    manageOrganisationsMembers: false,
    manageOrganisationsServices: false,
    managePersonalInformation: true,
    manageSshKeys: true,
  },
  key: 'hF6N73B2b6Tvp1rDxp',
  secret: 'zKod6jV82SCKdG1gfY',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-create',
      },
    },
  ],
});

export const dataLoadedWithCreate = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-create',
      },
    },
  ],
});

export const dataLoadedWithUpdate = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-update',
        values: oAuthConsumerData,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const waitingWithCreating = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'creating',
      },
    },
  ],
  /** @type {(component: CcOauthConsumerForm) => void} */
  onUpdateComplete: (component) => {
    const form = component.shadowRoot.querySelector('form');
    getFormInputElement(form, 'name').value = oAuthConsumerData.name;
    getFormInputElement(form, 'url').value = oAuthConsumerData.url;
    getFormInputElement(form, 'baseUrl').value = oAuthConsumerData.baseUrl;
    getFormInputElement(form, 'description').value = oAuthConsumerData.description;
    getFormInputElement(form, 'picture').value = oAuthConsumerData.picture;

    const rightsToEnable = Object.entries(oAuthConsumerData.rights)
      .filter(([_, isEnabled]) => isEnabled)
      .map(([rightName]) => rightName);
    rightsToEnable.forEach((rightName) => {
      /** @type {HTMLInputElement} */
      const checkbox = component.shadowRoot.querySelector(`form #checkbox-right-${rightName}`);
      checkbox.checked = true;
    });
  },
});

export const waitingWithUpdating = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'updating',
        values: oAuthConsumerData,
      },
    },
  ],
});

export const waitingWithDeleting = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'deleting',
        values: oAuthConsumerData,
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const errorWithEmptyInputs = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-update',
        values: {
          ...oAuthConsumerData,
          name: '',
          url: '',
          baseUrl: '',
          description: '',
          picture: '',
        },
      },
    },
  ],
  /** @param {CcOauthConsumerForm} component */
  onUpdateComplete: (component) => {
    component.shadowRoot.querySelector(`form`).requestSubmit();
  },
});

export const errorWithInvalidInputs = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-update',
        values: oAuthConsumerData,
      },
    },
  ],
  /** @param {CcOauthConsumerForm} component */
  onUpdateComplete: (component) => {
    component._formRef.value.url.value = 'Invalid url';
    component._formRef.value.baseUrl.value = 'Invalid base url';
    component._formRef.value.picture.value = 'Invalid picture url';
    component._formRef.value.requestSubmit();
  },
});

export const errorWithEmptyCheckboxes = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-update',
        values: {
          ...oAuthConsumerData,
          rights: {
            almighty: false,
            accessOrganisations: false,
            accessOrganisationsBills: false,
            accessOrganisationsConsumptionStatistics: false,
            accessOrganisationsCreditCount: false,
            accessPersonalInformation: false,
            manageOrganisations: false,
            manageOrganisationsApplications: false,
            manageOrganisationsMembers: false,
            manageOrganisationsServices: false,
            managePersonalInformation: false,
            manageSshKeys: false,
          },
        },
      },
    },
  ],
  /** @param {CcOauthConsumerForm} component */
  onUpdateComplete: (component) => {
    component.shadowRoot.querySelector('form').requestSubmit();
  },
});

export const simulationWithLoadingSuccess = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        component.state = {
          type: 'idle-update',
          values: oAuthConsumerData,
        };
      },
    ),
  ],
});

export const simulationWithLoadingError = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(
      2000,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationWithCreatingAnOauthConsumer = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-create',
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const nameInputElement = component._formRef.value.querySelector('[name="name"]');
        nameInputElement.value = NEW_OAUTH_CONSUMER.name;
      },
    ),
    storyWait(
      500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const descriptionInputElement = component._formRef.value.querySelector('[name="description"]');
        descriptionInputElement.value = NEW_OAUTH_CONSUMER.description;
      },
    ),
    storyWait(
      500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const urlInputElement = component._formRef.value.querySelector('[name="url"]');
        urlInputElement.value = NEW_OAUTH_CONSUMER.url;
      },
    ),
    storyWait(
      500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const baseUrlInputElement = component._formRef.value.querySelector('[name="baseUrl"]');
        baseUrlInputElement.value = NEW_OAUTH_CONSUMER.baseUrl;
      },
    ),
    storyWait(
      500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const pictureInputElement = component._formRef.value.querySelector('[name="picture"]');
        pictureInputElement.value = NEW_OAUTH_CONSUMER.picture;
      },
    ),
    storyWait(
      500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        const rightsToEnable = Object.entries(oAuthConsumerData.rights)
          .filter(([_, isEnabled]) => isEnabled)
          .map(([rightName]) => rightName);
        rightsToEnable.forEach((rightName) => {
          /** @type {HTMLInputElement} */
          const checkbox = component.shadowRoot.querySelector(`form #checkbox-right-${rightName}`);
          checkbox.checked = true;
        });
      },
    ),
    storyWait(
      1500,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        component.state = { type: 'creating' };
      },
    ),
    storyWait(
      2000,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        component.resetOauthConsumerForm();
        component.state = { type: 'idle-create' };
      },
    ),
  ],
});

export const simulationWithUpdatingAnOauthConsumer = makeStory(conf, {
  /** @type {Partial<CcOauthConsumerForm>[]} */
  items: [
    {
      state: {
        type: 'idle-update',
        values: oAuthConsumerData,
      },
    },
  ],
  simulations: [
    storyWait(
      1000,
      /** @param {CcOauthConsumerForm[]} components */
      ([component]) => {
        /** @type {CcInputText} */
        const nameInputElement = component._formRef.value.querySelector('[name="name"]');
        nameInputElement.value = 'My updated OAuth Consumer';
      },
    ),
    storyWait(
      1500,
      /** @param {Array<CcOauthConsumerForm & {state: OauthConsumerFormStateIdleUpdate|OauthConsumerFormStateUpdating}>} components */
      ([component]) => {
        component.state = { type: 'updating', values: component.state.values };
      },
    ),
    storyWait(
      2000,
      /** @param {Array<CcOauthConsumerForm & {state: OauthConsumerFormStateIdleUpdate|OauthConsumerFormStateUpdating}>} components */
      ([component]) => {
        component.state = { type: 'idle-update', values: component.state.values };
      },
    ),
  ],
});

/**
 * @param {HTMLFormElement} form
 * @param {string} formControlName
 * @return {CcInputText | HTMLInputElement}
 */
function getFormInputElement(form, formControlName) {
  return form.querySelector(`[name=${formControlName}]`);
}
