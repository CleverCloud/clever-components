import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer-info.js';

/**
 * @typedef {import('./cc-oauth-consumer-info.js').CcOauthConsumerInfo} CcOauthConsumerInfo
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoStateLoading} OAuthConsumerInfoStateLoading
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoStateWaiting} OAuthConsumerInfoStateWaiting
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoStateError} OAuthConsumerInfoStateError
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoStateLoaded} OAuthConsumerInfoStateLoaded
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerRights} OauthConsumerRights
 */

/** @type {{state: {type: string, name: string, url: string, baseUrl: string, description: string, picture: string, rights: {accessOrganisations: boolean, accessOrganisationsBills: boolean, accessOrganisationsConsumptionStatistics: boolean, accessOrganisationsCreditCount: boolean, accessPersonalInformation: boolean, almighty: boolean, manageOrganisations: boolean, manageOrganisationsApplications: boolean, manageOrganisationsMembers: boolean, manageOrganisationsServices: boolean, managePersonalInformation: boolean, manageSshKeys: boolean}, key: string, secret: string}}} */
const oAuthConsumerData = {
  state: {
    type: 'loaded',
    name: 'My OAuth Consumer',
    url: 'https://localhost:8080/',
    baseUrl: 'https://localhost:8080/',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus? Commodi eaque, vitae?',
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
      /** @type {OAuthConsumerInfoStateLoading} */
      state: {
        type: 'loading',
      },
    },
  ],
});

export const WaitingStory = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerInfoStateWaiting} */
      state: {
        type: 'waiting',
        name: 'My OAuth Consumer',
        url: 'https://localhost:8080/',
        baseUrl: 'https://localhost:8080/',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus? Commodi eaque, vitae?',
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
      /** @type {OAuthConsumerInfoStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});

export const dataLoadedStory = makeStory(conf, {
  items: [oAuthConsumerData],
});

export const dataLoadedWithAlmightyStory = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerInfoStateLoaded} */
      state: {
        type: 'loaded',
        name: 'My OAuth Consumer',
        url: 'https://localhost:8080/',
        baseUrl: 'https://localhost:8080/',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus? Commodi eaque, vitae?',
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
