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
          { name: 'accessOrganisations', isEnabled: true },
          { name: 'accessOrganisationsBills', isEnabled: true },
          { name: 'accessOrganisationsConsumptionStatistics', isEnabled: true },
          { name: 'accessOrganisationsCreditCount', isEnabled: true },
          { name: 'accessPersonalInformation', isEnabled: true },
          { name: 'changePassword', isEnabled: true },
          { name: 'manageOrganisations', isEnabled: true },
          { name: 'manageOrganisationsApplications', isEnabled: true },
          { name: 'manageOrganisationsMembers', isEnabled: true },
          { name: 'manageOrganisationsServices', isEnabled: true },
          { name: 'managePersonalInformation', isEnabled: true },
          { name: 'manageSshKeys', isEnabled: true },
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
