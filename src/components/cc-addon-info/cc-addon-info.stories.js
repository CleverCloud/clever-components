import { getDocUrl } from '../../lib/dev-hub-url.js';
import {
  azimuttInfo,
  elasticInfo,
  jenkinsInfo,
  keycloakInfo,
  kubernetesInfo,
  mailpaceInfo,
  materiaInfo,
  matomoInfo,
  metabaseInfo,
  mongodbInfo,
  mysqlInfo,
  networkGroupInfo,
  otoroshiInfo,
  postgresqlInfo,
  pulsarInfo,
  redisInfo,
} from '../../stories/fixtures/addon-info.js';
import { makeStory } from '../../stories/lib/make-story.js';
import { i18n } from '../../translations/translation.js';
import './cc-addon-info.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-info>',
  component: 'cc-addon-info',
};

/**
 * @import { CcAddonInfo } from './cc-addon-info.js'
 * @import { AddonInfoStateLoaded, AddonInfoStateLoading, AddonInfoStateError } from './cc-addon-info.types.js'
 * @import { CcButton } from '../cc-button/cc-button.js'
 */

const conf = {
  component: 'cc-addon-info',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...matomoInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const dataLoadedWithNoDocLink = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...matomoInfo,
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {AddonInfoStateError} */
      state: { type: 'error' },
    },
  ],
});

export const waitingWithRequestingUpdate = makeStory(conf, {
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        version: {
          latest: '1.3.0',
          installed: '1.2.3',
          stateType: 'requesting-update',
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
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>`,
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
    },
  ],
  /** @param {CcAddonInfo} component */
  onUpdateComplete(component) {
    /** @type {CcButton} */
    const openerCcButton = component.shadowRoot.querySelector('cc-button[primary][outlined]');
    openerCcButton.waiting = false;
    openerCcButton.shadowRoot.querySelector('button').click();
  },
});

export const matomo = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...matomoInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
       `,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...matomoInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const metabase = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...metabaseInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.metabase'),
        href: getDocUrl('/addons/metabase'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...metabaseInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.metabase'),
        href: getDocUrl('/addons/metabase'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const keycloak = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...keycloakInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.keycloak'),
        href: getDocUrl('/addons/keycloak'),
      },
      innerHTML: `
        <p slot="billing">Keycloak, built with <cc-link href="https://please-open.it/">Please Open It</cc-link> and hosted on our services, is now generally available.<br>Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...keycloakInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.keycloak'),
        href: getDocUrl('/addons/keycloak'),
      },
      innerHTML: `
         <p slot="billing">Keycloak, built with <cc-link href="https://please-open.it/">Please Open It</cc-link> and hosted on our services, is now generally available.<br>Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const otoroshi = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...otoroshiInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.otoroshi'),
        href: getDocUrl('/addons/otoroshi'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...otoroshiInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.otoroshi'),
        href: getDocUrl('/addons/otoroshi'),
      },
      innerHTML: `
        <p slot="billing">Operator services and management fees are added to the price of these resources.<br><strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
`,
    },
  ],
});

export const materia = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...materiaInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.materia-kv'),
        href: getDocUrl('/addons/materia-kv'),
      },
      innerHTML: `
        <p slot="billing">Materia KV uses our next generation of serverless distributed database, synchronously-replicated. Free of charge during testing phases, it will be available on a pay-as-you-go flexible pricing. Develop with ease, it's compatible with third-party protocols, such as Redis: <a href="${getDocUrl('/addons/materia-kv')}">learn more.</a></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...materiaInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.materia-kv'),
        href: getDocUrl('/addons/materia-kv'),
      },
      innerHTML: `
        <p slot="billing">Materia KV uses our next generation of serverless distributed database, synchronously-replicated. Free of charge during testing phases, it will be available on a pay-as-you-go flexible pricing. Develop with ease, it's compatible with third-party protocols, such as Redis: <a href="${getDocUrl('/addons/materia-kv')}">learn more.</a></p>
`,
    },
  ],
});

export const jenkins = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...jenkinsInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.jenkins'),
        href: getDocUrl('/addons/jenkins'),
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...jenkinsInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.jenkins'),
        href: getDocUrl('/addons/jenkins'),
      },
    },
  ],
});

export const elastic = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...elasticInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.elastic'),
        href: getDocUrl('/addons/elastic'),
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...elasticInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.elastic'),
        href: getDocUrl('/addons/elastic'),
      },
    },
  ],
});

export const pulsar = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...pulsarInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.pulsar'),
        href: getDocUrl('/addons/pulsar'),
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...pulsarInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.pulsar'),
        href: getDocUrl('/addons/pulsar'),
      },
    },
  ],
});

export const mailpace = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...mailpaceInfo,
      },
      innerHTML: `
        <p slot="billing">This add-on is a partner product. Its invoicing is therefore entirely independent and managed by the partner. If you have any questions about this subject, please contact him.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...mailpaceInfo,
      },
      innerHTML: `
        <p slot="billing">This add-on is a partner product. Its invoicing is therefore entirely independent and managed by the partner. If you have any questions about this subject, please contact him.</p>
`,
    },
  ],
});

export const mysql = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...mysqlInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...mysqlInfo,
      },
    },
  ],
});

export const postgresql = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...postgresqlInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...postgresqlInfo,
      },
    },
  ],
});

export const redis = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...redisInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...redisInfo,
      },
    },
  ],
});

export const mongodb = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...mongodbInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...mongodbInfo,
      },
    },
  ],
});

export const azimutt = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...azimuttInfo,
      },
      innerHTML: `
        <p slot="billing">This add-on is a partner product. Its invoicing is therefore entirely independent and managed by the partner. If you have any questions about this subject, please contact him.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...azimuttInfo,
      },
      innerHTML: `
        <p slot="billing">This add-on is a partner product. Its invoicing is therefore entirely independent and managed by the partner. If you have any questions about this subject, please contact him.</p>
`,
    },
  ],
});

export const kubernetes = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...kubernetesInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.kubernetes'),
        href: getDocUrl('/kubernetes'),
      },
      innerHTML: `
        <p slot="billing">Kubernetes is in Alpha phase and is therefore free during these test phases. Billing will evolve in line with the functionalities made available.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...kubernetesInfo,
      },
      docLink: {
        text: i18n('cc-addon-info.doc-link.kubernetes'),
        href: getDocUrl('/kubernetes'),
      },
      innerHTML: `
        <p slot="billing">Kubernetes is in Alpha phase and is therefore free during these test phases. Billing will evolve in line with the functionalities made available.</p>
`,
    },
  ],
});

export const networkGroup = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...networkGroupInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...networkGroupInfo,
      },
    },
  ],
});

export const updateAvailable = makeStory(conf, {
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        version: {
          latest: '1.3.0',
          installed: '1.2.3',
          stateType: 'update-available',
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
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>`,
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
    },
  ],
  /** @param {CcAddonInfo} component */
  onUpdateComplete(component) {
    const openerCcButton = component.shadowRoot.querySelector('cc-button[primary][outlined]');
    openerCcButton.shadowRoot.querySelector('button').click();
  },
});

export const updateAvailableWithOpenVersionDialog = makeStory(conf, {
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        version: {
          latest: '1.3.0',
          installed: '1.2.3',
          stateType: 'update-available',
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
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>`,
      docLink: {
        text: i18n('cc-addon-info.doc-link.matomo'),
        href: getDocUrl('/addons/matomo'),
      },
    },
  ],
  /** @param {CcAddonInfo} component */
  onUpdateComplete(component) {
    const openerCcButton = component.shadowRoot.querySelector('cc-button[primary][outlined]');
    openerCcButton.shadowRoot.querySelector('button').click();
  },
});
