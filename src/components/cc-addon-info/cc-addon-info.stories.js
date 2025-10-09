import { generateDocsHref } from '../../lib/utils.js';
import {
  azimuttInfo,
  configInfo,
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
  otoroshiInfo,
  postgresqlInfo,
  pulsarInfo,
  redisInfo,
} from '../../stories/fixtures/addon-info.js';
import { makeStory } from '../../stories/lib/make-story.js';
import './cc-addon-info.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Addon/<cc-addon-info>',
  component: 'cc-addon-info',
};

/**
 * @typedef {import('./cc-addon-info.js').CcAddonInfo} CcAddonInfo
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoaded} AddonInfoStateLoaded
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateLoading} AddonInfoStateLoading
 * @typedef {import('./cc-addon-info.types.js').AddonInfoStateError} AddonInfoStateError
 */

const conf = {
  component: 'cc-addon-info',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */ /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...matomoInfo,
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>
        <p slot="linked-services"><em>The Matomo add-on is a meta add-on. It provides you with a PHP application, a MySQL add-on and a Redis add-on. They appear in your organisation just like your other applications and add-ons. You can still configure them as you like. For example, you may want to change the PHP application's domain or migrate the MySQL add-on to a bigger plan.</em></p>
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
    },
  ],
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
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>
        <p slot="linked-services"><em>The Matomo add-on is a meta add-on. It provides you with a PHP application, a MySQL add-on and a Redis add-on. They appear in your organisation just like your other applications and add-ons. You can still configure them as you like. For example, you may want to change the PHP application's domain or migrate the MySQL add-on to a bigger plan.</em></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...matomoInfo,
      },
      innerHTML: `
        <p slot="billing"><strong>This add-on is free but its dependencies, mentioned above, are billed based on their consumptions,</strong> just like other applications and add-ons.</p>
        <p slot="linked-services"><em>The Matomo add-on is a meta add-on. It provides you with a PHP application, a MySQL add-on and a Redis add-on. They appear in your organisation just like your other applications and add-ons. You can still configure them as you like. For example, you may want to change the PHP application's domain or migrate the MySQL add-on to a bigger plan.</em></p>
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
      innerHTML: `
        <p slot="billing">Discover Metabase at no extra cost. Services and management fees are added to the price of these resources. <strong>During the discovery phase, these fees are offered free of charge.</strong></p>
        <p slot="linked-services"><em>Metabase, easy to configure and hosted on our services, is now generally available. It deploys a Java application and a PostgreSQL add-on. You can scale them as you grow.</em></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...metabaseInfo,
      },
      innerHTML: `
        <p slot="billing">Discover Metabase at no extra cost. Services and management fees are added to the price of these resources. <strong>During the discovery phase, these fees are offered free of charge.</strong></p>
        <p slot="linked-services"><em>Metabase, easy to configure and hosted on our services, is now generally available. It deploys a Java application and a PostgreSQL add-on. You can scale them as you grow.</em></p>
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
      innerHTML: `
        <p slot="billing">Services and management fees are added to the price of these resources. <strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
        <p slot="linked-services"><em>Otoroshi, easy to configure and hosted on our services, is now generally available. It deploys a Java application and a Redis add-on. You can scale them as you grow.</em></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...otoroshiInfo,
      },
      innerHTML: `
        <p slot="billing">Services and management fees are added to the price of these resources. <strong>During the discovery phase, these fees are offered free of charge</strong>.</p>
        <p slot="linked-services"><em>Otoroshi, easy to configure and hosted on our services, is now generally available. It deploys a Java application and a Redis add-on. You can scale them as you grow.</em></p>
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
      innerHTML: `
        <p slot="billing">Materia KV uses our next generation of serverless distributed database, synchronously-replicated. Free of charge during testing phases, it will be available on a pay-as-you-go flexible pricing. Develop with ease, it's compatible with third-party protocols, such as Redis: <a href="${generateDocsHref('/doc/addons/materia-kv/')}">learn more.</a></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...materiaInfo,
      },
      innerHTML: `
        <p slot="billing">Materia KV uses our next generation of serverless distributed database, synchronously-replicated. Free of charge during testing phases, it will be available on a pay-as-you-go flexible pricing. Develop with ease, it's compatible with third-party protocols, such as Redis: <a href="${generateDocsHref('/doc/addons/materia-kv/')}">learn more.</a></p>
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
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...jenkinsInfo,
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
      innerHTML: `
        <p slot="linked-services"><em>This add-on is part of the Elastic Stack offering. You can find and access related services above.</em></p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...elasticInfo,
      },
      innerHTML: `
        <p slot="linked-services"><em>This add-on is part of the Elastic Stack offering. You can find and access related services above.</em></p>
`,
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
      innerHTML: `
        <p slot="billing">The beta status means that the service is still being improved, but it is fully integrated into our billing system.</p>
`,
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...pulsarInfo,
      },
      innerHTML: `
        <p slot="billing">The beta status means that the service is still being improved, but it is fully integrated into our billing system.</p>
`,
    },
  ],
});

export const config = makeStory(conf, {
  /** @type {Partial<CcAddonInfo>[]} */
  items: [
    {
      /** @type {AddonInfoStateLoaded} */
      state: {
        type: 'loaded',
        ...configInfo,
      },
    },
    {
      /** @type {AddonInfoStateLoading} */
      state: {
        type: 'loading',
        ...configInfo,
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
      innerHTML: `
        <p slot="billing">Kubernetes is in Alpha phase and is therefore free during these test phases. Billing will evolve in line with the functionalities made available.</p>
`,
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
    },
  ],
});
