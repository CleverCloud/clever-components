import { getAssetUrl } from '../../lib/assets-url.js';
import { ZONE } from "./zones.js";

/**
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').Addon} Addon
 */

/** @type {Addon} */
export const configProviderData = {
  providerName: 'Configuration provider',
  providerLogoUrl: getAssetUrl('/logos/configprovider.svg'),
  name: 'my-config',
  id: 'config_59xml9zd-f1rg-2jj2-z733-p564812374122',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
};

/** @type {Addon} */
export const pulsarData = {
  providerName: 'Pulsar',
  providerLogoUrl: getAssetUrl('/logos/pulsar.svg'),
  name: 'my-pulsar',
  id: 'pulsar_695g1427-sn3t-0200-36mw-h56983vb3653',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
};

/** @type {Addon} */
export const jenkinsData = {
  providerName: 'Jenkins',
  providerLogoUrl: getAssetUrl('/logos/jenkins.svg'),
  name: 'my-jenkins',
  id: 'jenkins_fgh7evv9-q21m-9129-mm3b-04f77lo56w36',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'Jenkins',
    },
  ],
};

/** @type {Addon} */
export const elasticData = {
  providerName: 'Elastic Stack',
  providerLogoUrl: getAssetUrl('/logos/elastic.svg'),
  name: 'my-elastic',
  id: 'elasticsearch_23694507-44yt-023u-ib5o-6vc7d0mp99a2',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'APM',
    },
    {
      url: 'https://example.com/logs',
      name: 'Kibana',
    },
  ],
};

/** @type {Addon} */
export const matomoData = {
  providerName: 'Matomo Analytics',
  providerLogoUrl: getAssetUrl('/logos/matomo.svg'),
  name: 'my-matomo',
  id: 'matomo_0985go7t-2kda-6dv2-x978-h63r45o11q6p',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'Matomo',
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
};

/** @type {Addon} */
export const keycloakData = {
  providerName: 'Keycloak',
  providerLogoUrl: 'https://cc-keycloak.cellar-c2.services.clever-cloud.com/keycloak_logo.svg',
  name: 'my-keycloak',
  id: 'keycloak_511f6k82-9r44-6w90-86s3-az6m5kvyy478',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'Keycloak',
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
  productStatus: 'Tech Preview',
};

/** @type {Addon} */
export const materiaData = {
  providerName: 'Materia',
  providerLogoUrl: getAssetUrl('/logos/materia-db-kv.png'),
  name: 'my-materia',
  id: 'kv_54PE021ROIUTYZ8GH4DFGMB33Z',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'KV Explorer',
    },
  ],
  actions: {
    restart: false,
    rebuildAndRestart: false,
  },
  productStatus: 'Alpha',
};

/** @type {Addon} */
export const redisData = {
  providerName: 'Redis',
  providerLogoUrl: getAssetUrl('/logos/redis.svg'),
  name: 'my-redis',
  id: 'redis_236590c14-5119-4aca-9888-3b16523486b',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
  openLinks: [
    {
      url: 'https://example.com/logs',
      name: 'KV Explorer',
    },
  ],
  actions: {
    restart: false,
    rebuildAndRestart: false,
  },
  deploymentStatus: 'active'
};
