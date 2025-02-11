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
        image: 'https://assets.clever-cloud.com/logos/nodejs.svg',
        rights: [
          { accessOrganisations: true },
          { accessOrganisationsBills: true },
          { accessOrganisationsConsumptionStatistics: true },
          { accessOrganisationsCreditCount: true },
          { accessPersonalInformation: true },
          { changePassword: true },
          { manageOrganisations: true },
          { manageOrganisationsApplications: true },
          { manageOrganisationsMembers: true },
          { manageOrganisationsServices: true },
          { managePersonalInformation: true },
          { manageSshKeys: true },
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
