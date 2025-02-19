import { makeStory } from '../../stories/lib/make-story.js';
import './cc-oauth-consumer.js';

export default {
  tags: ['autodocs'],
  title: '🛠 oAuth Consumer/<cc-oauth-consumer>',
  component: 'cc-oauth-consumer',
};

const conf = {
  component: 'cc-oauth-consumer',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        name: 'My oAuth Consumer',
        homePageUrl: 'https://localhost:8080/',
        appBaseUrl: 'https://localhost:8080/',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus? Commodi eaque, vitae?',
        image: '',
        rights: [
          { name: 'accessOrganisations', isEnabled: true, section: 'access' },
          { name: 'accessOrganisationsBills', isEnabled: false, section: 'access' },
          { name: 'accessOrganisationsConsumptionStatistics', isEnabled: true, section: 'access' },
          { name: 'accessOrganisationsCreditCount', isEnabled: true, section: 'access' },
          { name: 'accessPersonalInformation', isEnabled: false, section: 'access' },
          { name: 'changePassword', isEnabled: true, section: 'manage' },
          { name: 'manageOrganisations', isEnabled: false, section: 'manage' },
          { name: 'manageOrganisationsApplications', isEnabled: false, section: 'manage' },
          { name: 'manageOrganisationsMembers', isEnabled: true, section: 'manage' },
          { name: 'manageOrganisationsServices', isEnabled: true, section: 'manage' },
          { name: 'managePersonalInformation', isEnabled: false, section: 'manage' },
          { name: 'manageSshKeys', isEnabled: true, section: 'manage' },
        ],
        key: 'hF6N73B2b6Tvp1rDxp',
        secret: 'zKod6jV82SCKdG1gfY',
      },
    },
  ],
});

export const loadedStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        name: 'My oAuth Consumer',
        homePageUrl: 'https://localhost:8080/',
        appBaseUrl: 'https://localhost:8080/',
        description:
          ' Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus? Commodi eaque, vitae?',
        image: '',
        rights: [
          { name: 'accessOrganisations', isEnabled: true, section: 'access' },
          { name: 'accessOrganisationsBills', isEnabled: false, section: 'access' },
          { name: 'accessOrganisationsConsumptionStatistics', isEnabled: true, section: 'access' },
          { name: 'accessOrganisationsCreditCount', isEnabled: true, section: 'access' },
          { name: 'accessPersonalInformation', isEnabled: false, section: 'access' },
          { name: 'changePassword', isEnabled: true, section: 'manage' },
          { name: 'manageOrganisations', isEnabled: false, section: 'manage' },
          { name: 'manageOrganisationsApplications', isEnabled: false, section: 'manage' },
          { name: 'manageOrganisationsMembers', isEnabled: true, section: 'manage' },
          { name: 'manageOrganisationsServices', isEnabled: true, section: 'manage' },
          { name: 'managePersonalInformation', isEnabled: false, section: 'manage' },
          { name: 'manageSshKeys', isEnabled: true, section: 'manage' },
        ],
        key: 'hF6N73B2b6Tvp1rDxp',
        secret: 'zKod6jV82SCKdG1gfY',
      },
    },
  ],
});

export const loadingStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const errorStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});
