import { getAssetUrl } from '../../lib/assets-url.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-info.js';

/**
 * @import { OauthConsumerInfoStateLoading, OauthConsumerInfoStateError, OauthConsumerInfoStateLoaded } from './cc-oauth-consumer-info.types.js'
 */

/** @type {OauthConsumerInfoStateLoaded} */
const oAuthConsumerData = {
  type: 'loaded',
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

export default {
  tags: ['autodocs'],
  title: '🛠 OAuth Consumer/<cc-oauth-consumer-info>',
  component: 'cc-oauth-consumer-info',
};

const conf = {
  component: 'cc-oauth-consumer-info',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        ...oAuthConsumerData,
      },
    },
  ],
});

export const loadingStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoading} */
      state: {
        type: 'loading',
      },
    },
  ],
});

export const errorStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        ...oAuthConsumerData,
      },
    },
  ],
});

export const dataLoadedStoryWithLongDescription = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        ...oAuthConsumerData,
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      },
    },
  ],
});

export const dataLoadedStoryWithLongUrls = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        ...oAuthConsumerData,
        url: 'https://veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylongurl.com',
        baseUrl: 'https://veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylongurl.com',
      },
    },
  ],
});

export const dataLoadedWithAlmightyStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        ...oAuthConsumerData,
        rights: {
          ...oAuthConsumerData.rights,
          almighty: true,
        },
      },
    },
  ],
});
