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
 * @typedef {import('./cc-oauth-consumer-form.types.js').OAuthConsumerFormContextType} OAuthConsumerFormContextType
 */

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerFormContextType} */
      context: 'create',
      oauthConsumerFormState: {
        type: 'idle-create',
      },
    },
  ],
});

export const create = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerFormContextType} */
      context: 'create',
      oauthConsumerFormState: {
        type: 'idle-create',
      },
    },
  ],
});

export const update = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerFormContextType} */
      context: 'update',
      oauthConsumerFormState: {
        type: 'idle-update',
        name: 'my-oauth-consumer',
        homePageUrl: 'http://example.com',
        appBaseUrl: 'http://example.com/oauth',
        description:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab accusantium, assumenda beatae cumque eaque eos error eveniet id illum iure laboriosam maxime natus nisi obcaecati pariatur possimus reprehenderit sint tempora.',
        image: 'http://example.com/logo.jpg',
        rights: [
          { name: 'access_organisations', isEnabled: true },
          { name: 'access_organisations_bills', isEnabled: false },
          { name: 'access_organisations_consumption_statistics', isEnabled: true },
          { name: 'access_organisations_credit_count', isEnabled: true },
          { name: 'access_personal_information', isEnabled: true },
          { name: 'manage_organisations', isEnabled: true },
          { name: 'manage_organisations_applications', isEnabled: true },
          { name: 'manage_organisations_members', isEnabled: false },
          { name: 'manage_organisations_services', isEnabled: true },
          { name: 'manage_personal_information', isEnabled: true },
          { name: 'manage_ssh_keys', isEnabled: true },
        ],
      },
    },
  ],
});

export const creating = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerFormContextType} */
      context: 'create',
      oauthConsumerFormState: {
        type: 'creating',
      },
    },
  ],
});

export const updating = makeStory(conf, {
  items: [
    {
      /** @type {OAuthConsumerFormContextType} */
      context: 'update',
      oauthConsumerFormState: {
        type: 'updating',
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'error',
      },
    },
  ],
});

export const deleting = makeStory(conf, {
  items: [
    {
      oauthConsumerFormState: {
        type: 'deleting',
      },
    },
  ],
});
