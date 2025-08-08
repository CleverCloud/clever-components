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
          changelogLink: 'https://example.com/changelog',
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

export const slot = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        version: {
          installed: '1.2.3',
          available: ['1.2.4', '1.3.0'],
          changelogLink: 'https://example.com/changelog',
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
            logoUrl: 'https://assets.clever-cloud.com/logos/nodejs.svg',
            link: 'https://example.com/app',
          },
          {
            type: 'add-on',
            name: 'My Add-on',
            logoUrl: 'https://assets.clever-cloud.com/logos/pgsql.svg',
            link: 'https://example.com/addon',
          },
        ],
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>
        <p slot="linked-services"><em>The Matomo add-on is a meta add-on. It provides you with a PHP application, a MySQL add-on and a Redis add-on. They appear in your organisation just like your other applications and add-ons. You can still configure them as you like. For example, you may want to change the PHP application's domain or migrate the MySQL add-on to a bigger plan.</em></p>
`,
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
          changelogLink: 'https://example.com/changelog',
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
      innerHTML: `
        <p slot="billing">TEXTE BILLING : Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, atque dolorum exercitationem iste placeat provident quas quo quod suscipit. Consequatur facilis labore laboriosam libero pariatur quaerat, quasi rem sit ullam.</p>
        <p slot="linked-services">TEXTE LINKED SERVICES : Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab, atque dolorum exercitationem iste placeat provident quas quo quod suscipit. Consequatur facilis labore laboriosam libero pariatur quaerat, quasi rem sit ullam.</p>
`,
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
