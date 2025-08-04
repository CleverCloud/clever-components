import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-info.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-info>',
  component: 'cc-addon-info',
};

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 */

const conf = {
  component: 'cc-addon-info',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        version: {
          installed: '1.2.3',
          available: ['1.2.4', '1.3.0'],
        },
        plan: 'DEV',
        features: [
          {
            code: 'cpu',
            type: 'number',
            value: '1',
          },
          {
            code: 'memory',
            type: 'bytes',
            value: '17179869184',
          },
          {
            code: 'disk-size',
            type: 'bytes',
            value: '483183820800',
          },
          {
            code: 'connection-limit',
            type: 'number',
            value: '15',
          },
        ],
        creationDate: '2023-01-15T10:30:00Z',
        openGrafanaLink: 'https://grafana.example.com',
        openScalabilityLink: 'https://scalability.example.com',
        linkedServices: [
          {
            type: 'app',
            name: 'My App',
            logoUrl: 'https://example.com/logo.png',
            link: 'https://example.com/app',
          },
        ],
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      state: {
        type: 'loading',
        version: {
          installed: '1.2.3',
          available: ['1.2.4', '1.3.0'],
        },
        plan: 'DEV',
        features: [
          {
            code: 'cpu',
            type: 'number',
            value: '1',
          },
          {
            code: 'memory',
            type: 'bytes',
            value: '17179869184',
          },
          {
            code: 'disk-size',
            type: 'bytes',
            value: '483183820800',
          },
          {
            code: 'connection-limit',
            type: 'number',
            value: '15',
          },
        ],
        creationDate: '2023-01-15T10:30:00Z',
        openGrafanaLink: 'https://grafana.example.com',
        openScalabilityLink: 'https://scalability.example.com',
        linkedServices: [
          {
            type: 'app',
            name: 'My App',
            logoUrl: 'https://example.com/logo.png',
            link: 'https://example.com/app',
          },
        ],
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});
