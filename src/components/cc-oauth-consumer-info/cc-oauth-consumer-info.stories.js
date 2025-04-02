import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-info.js';

/**
 * @typedef {import('./cc-oauth-consumer-info.js').CcOauthConsumerInfo} CcOauthConsumerInfo
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateLoading} OauthConsumerInfoStateLoading
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateWaiting} OauthConsumerInfoStateWaiting
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateError} OauthConsumerInfoStateError
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateLoaded} OauthConsumerInfoStateLoaded
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 */

/** @type {{state: {type: string, name: string, url: string, baseUrl: string, description: string, picture: string, rights: {accessOrganisations: boolean, accessOrganisationsBills: boolean, accessOrganisationsConsumptionStatistics: boolean, accessOrganisationsCreditCount: boolean, accessPersonalInformation: boolean, almighty: boolean, manageOrganisations: boolean, manageOrganisationsApplications: boolean, manageOrganisationsMembers: boolean, manageOrganisationsServices: boolean, managePersonalInformation: boolean, manageSshKeys: boolean}, key: string, secret: string}}} */
const oAuthConsumerData = {
  state: {
    type: 'loaded',
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
  },
};

export default {
  tags: ['autodocs'],
  title: '🛠 OAuth Consumer Info/<cc-oauth-consumer-info>',
  component: 'cc-oauth-consumer-info',
};

const conf = {
  component: 'cc-oauth-consumer-info',
};

export const defaultStory = makeStory(conf, {
  items: [oAuthConsumerData],
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

export const WaitingStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateWaiting} */
      state: {
        type: 'waiting',
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
  items: [oAuthConsumerData],
});

export const dataLoadedStoryWithLongDescription = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        type: 'loaded',
        name: 'My OAuth Consumer',
        url: 'https://www.example.com/home',
        baseUrl: 'https://www.example.com',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
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
      },
    },
  ],
});

export const dataLoadedStoryWithLongUrls = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        type: 'loaded',
        name: 'My OAuth Consumer',
        url: 'https://veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylongurl.com',
        baseUrl: 'https://veryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryveryverylongurl.com',
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
      },
    },
  ],
});

export const dataLoadedWithAlmightyStory = makeStory(conf, {
  items: [
    {
      /** @type {OauthConsumerInfoStateLoaded} */
      state: {
        type: 'loaded',
        name: 'My OAuth Consumer',
        url: 'https://www.example.com/home',
        baseUrl: 'https://www.example.com',
        description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
        picture: 'https://assets.clever-cloud.com/infra/clever-cloud-square.svg',
        rights: {
          almighty: true,
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
      },
    },
  ],
});
