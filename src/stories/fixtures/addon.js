import { ZONE } from "./zones.js";

/**
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').CcAddonHeaderStateLoaded} CcAddonHeaderStateLoaded
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').CcAddonHeaderStateError} CcAddonHeaderStateError
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').CcAddonHeaderStateLoading} CcAddonHeaderStateLoading
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').CcAddonHeaderStateRestarting} CcAddonHeaderStateRestarting
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.types.js').CcAddonHeaderStateRebuilding} CcAddonHeaderStateRebuilding
 * @typedef {import('../../components/cc-addon-header/cc-addon-header.js').CcAddonHeader} CcAddonHeader
 * @typedef {import('../../components/cc-zone/cc-zone.types.js').ZoneStateLoaded} ZoneStateLoaded
 */

/** @type {CcAddonHeaderStateLoaded} */
export const configProviderData = {
  type: 'loaded',
  providerName: 'Configuration provider',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/configprovider.svg',
  name: 'my-config',
  id: 'config_59xml9zd-f1rg-2jj2-z733-p564812374122',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
};

/** @type {CcAddonHeaderStateLoaded} */
export const materiaData = {
  type: 'loaded',
  providerName: 'Materia KV',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/materia-db-kv.png',
  name: 'my-materia',
  id: 'kv_56ME45ETZMPOF7HR6DCVBN80Q',
  zone: {
    type: 'loaded',
    ...ZONE,
  },
  logsUrl: 'https://example.com/logs',
};

/** @type {CcAddonHeaderStateLoaded} */
export const jenkinsData = {
  type: 'loaded',
  providerName: 'Jenkins',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/jenkins.svg',
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
      name: `Jenkins`,
    },
  ],
};

/** @type {CcAddonHeaderStateLoaded} */
export const elasticData = {
  type: 'loaded',
  providerName: 'Elastic Stack',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/elastic.svg',
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
      name: `APM`,
    },
    {
      url: 'https://example.com/logs',
      name: `Kibana`,
    },
  ],
};

/** @type {CcAddonHeaderStateLoaded} */
export const matomoData = {
  type: 'loaded',
  providerName: 'Matomo Analytics',
  providerLogoUrl: 'https://assets.clever-cloud.com/logos/matomo.svg',
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
      name: `Matomo Analytics`,
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
};

/** @type {CcAddonHeaderStateLoaded} */
export const keycloakData = {
  type: 'loaded',
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
      name: `Keycloak`,
    },
  ],
  actions: {
    restart: true,
    rebuildAndRestart: true,
  },
  productStatus: 'Beta',
};
