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
          { name: 'access_organisations', isEnabled: true, section: 'access' },
          { name: 'access_organisations_bills', isEnabled: false, section: 'access' },
          { name: 'access_organisations_consumption_statistics', isEnabled: true, section: 'access' },
          { name: 'access_organisations_credit_count', isEnabled: true, section: 'access' },
          { name: 'access_personal_information', isEnabled: false, section: 'access' },
          { name: 'change_password', isEnabled: true, section: 'manage' },
          { name: 'manage_organisations', isEnabled: true, section: 'manage' },
          { name: 'manage_organisations_applications', isEnabled: false, section: 'manage' },
          { name: 'manage_organisations_members', isEnabled: false, section: 'manage' },
          { name: 'manage_organisations_services', isEnabled: false, section: 'manage' },
          { name: 'manage_personal_information', isEnabled: true, section: 'manage' },
          { name: 'manage_ssh_keys', isEnabled: true, section: 'manage' },
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
          { name: 'access_organisations', isEnabled: true, section: 'access' },
          { name: 'access_organisations_bills', isEnabled: false, section: 'access' },
          { name: 'access_organisations_consumption_statistics', isEnabled: true, section: 'access' },
          { name: 'access_organisations_credit_count', isEnabled: true, section: 'access' },
          { name: 'access_personal_information', isEnabled: false, section: 'access' },
          { name: 'change_password', isEnabled: true, section: 'manage' },
          { name: 'manage_organisations', isEnabled: true, section: 'manage' },
          { name: 'manage_organisations_applications', isEnabled: false, section: 'manage' },
          { name: 'manage_organisations_members', isEnabled: false, section: 'manage' },
          { name: 'manage_organisations_services', isEnabled: false, section: 'manage' },
          { name: 'manage_personal_information', isEnabled: true, section: 'manage' },
          { name: 'manage_ssh_keys', isEnabled: true, section: 'manage' },
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
