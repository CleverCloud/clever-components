import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-access-info.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-access-info>',
  component: 'cc-addon-access-info',
};

const conf = {
  component: 'cc-addon-access-info',
};

/**
 * @typedef {import('./cc-addon-access-info.js').CcAddonAccessInfo} CcAddonAccessInfo
 */

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonAccessInfo>[]} */
  items: [
    {
      info: [
        {
          code: 'host',
          value: 'example.com',
        },
        {
          code: 'user',
          value: 'toto',
        },
        {
          code: 'password',
          value: 'my-secret-password',
        },
        {
          code: 'ng',
          value: {
            isEnabled: false,
          },
        },
        {
          code: 'ng',
          value: {
            id: 'ng-id-0329',
            isEnabled: true,
          },
        },
      ],
    },
  ],
});

export const skeleton = makeStory(conf, {
  /** @type {Partial<CcAddonAccessInfo>[]} */
  items: [
    {
      info: [
        {
          code: 'host',
          value: 'example.com',
        },
        {
          code: 'user',
          value: 'toto',
        },
        {
          code: 'password',
          value: 'my-secret-password',
        },
        {
          code: 'ng',
          value: {
            isEnabled: false,
          },
        },
        {
          code: 'ng',
          value: {
            id: 'ng-id-0329',
            isEnabled: true,
          },
        },
      ],
      skeleton: true,
    },
  ],
});
