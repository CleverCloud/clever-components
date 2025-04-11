import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-form.js';

export default {
  tags: ['autodocs'],
  title: '🛠 oAuth Consumer/<cc-oauth-consumer-form>',
  component: 'cc-oauth-consumer-form',
};

const conf = {
  component: 'cc-oauth-consumer-form',
};

/**
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleCreate} OauthConsumerFormStateIdleCreate
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumer} OauthConsumer
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateUpdating} OauthConsumerFormStateUpdating
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateCreating} OauthConsumerFormStateCreating
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateIdleUpdate} OauthConsumerFormStateIdleUpdate
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateLoading} OauthConsumerFormStateLoading
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateError} OauthConsumerFormStateError
 * @typedef {import('./cc-oauth-consumer-form.types.js').OauthConsumerFormStateDeleting} OauthConsumerFormStateDeleting
 */

/** @type {OauthConsumer} */
const oAuthConsumerData = {
  name: 'My OAuth Consumer',
  url: 'https://www.example.com/home',
  baseUrl: 'https://www.example.com',
  description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
  picture: 'https://assets.clever-cloud.com/infra/clever-cloud-square.svg',
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
  items: [
    {
      /** @type {OauthConsumerFormStateIdleCreate} */
      state: {
        type: 'idle-create',
      },
    },
  ],
});

export const create = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateIdleCreate} */
      state: {
        type: 'idle-create',
      },
    },
  ],
});

export const update = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateIdleUpdate} */
      state: {
        type: 'idle-update',
        ...oAuthConsumerData,
      },
    },
  ],
});

export const creating = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateCreating} */
      state: {
        type: 'creating',
        ...oAuthConsumerData,
      },
    },
  ],
});

export const updating = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateUpdating} */
      state: {
        type: 'updating',
        ...oAuthConsumerData,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateLoading} */
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});

export const deleting = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerFormStateDeleting} */
      state: {
        type: 'deleting',
        ...oAuthConsumerData,
      },
    },
  ],
});
