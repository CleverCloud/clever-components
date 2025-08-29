/**
 * @typedef {import('../../components/cc-addon-info/cc-addon-info.types.js').BaseProperties} BaseProperties
 */

import { generateDevHubHref, generateDocsHref } from '../../lib/utils.js';

/** @type {BaseProperties} */
export const matomoInfo = {
  version: {
    installed: '5.3.0',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'PHP',
      logoUrl: 'https://assets.clever-cloud.com/logos/php.svg',
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'MySQL add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/mysql.svg',
      link: 'https://example.com/addon',
    },
    {
      type: 'addon',
      name: 'Redis add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/redis.svg',
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: generateDocsHref('addons/matomo'),
}

/** @type {BaseProperties} */
export const metabaseInfo = {
  version: {
    installed: '55',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'PostgreSQL add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/mysql.svg',
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: generateDocsHref('addons/metabase'),
}

/** @type {BaseProperties} */
export const keycloakInfo = {
  version: {
    installed: '26.3.0',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'PostgreSQL add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/mysql.svg',
      link: 'https://example.com/addon',
    },
    {
      type: 'addon',
      name: 'FS Bucket add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/fsbucket.svg',
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: generateDocsHref('addons/keycloak'),
}

/** @type {BaseProperties} */
export const otoroshiInfo = {
  version: {
    installed: '17.4.0',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: 'https://assets.clever-cloud.com/logos/java-jar.svg',
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'Redis add-on',
      logoUrl: 'https://assets.clever-cloud.com/logos/redis.svg',
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: generateDocsHref('addons/otoroshi'),
}

/** @type {BaseProperties} */
export const materiaInfo = {
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/materia-kv'),
}

/** @type {BaseProperties} */
export const jenkinsInfo = {
  version: {
    installed: '2.516.2',
    stateType: 'up-to-date',
  },
  plan: 'XXS',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '2',
    },
    {
      code: 'memory',
      type: 'bytes',
      value: '4294967296',
    },
    {
      code: 'disk-size',
      type: 'bytes',
      value: '42949672960',
    },
    {
      code: 'encryption-at-rest',
      type: 'boolean',
      value: 'true',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/jenkins'),
}

/** @type {BaseProperties} */
export const elasticInfo = {
  version: {
    installed: '9.1.2',
    stateType: 'up-to-date',
  },
  plan: 'M',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '2',
    },
    {
      code: 'memory',
      type: 'bytes',
      value: '4294967296',
    },
    {
      code: 'disk-size',
      type: 'bytes',
      value: '128849018880',
    },
    {
      code: 'encryption-at-rest',
      type: 'boolean',
      value: 'true',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Kibana',
      logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-kibana.svg',
      link: 'https://example.com/app',
    },
    {
      type: 'app',
      name: 'APM',
      logoUrl: 'https://assets.clever-cloud.com/logos/elasticsearch-apm.svg',
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: generateDocsHref('addons/elastic'),
}

/** @type {BaseProperties} */
export const pulsarInfo = {
  version: {
    installed: '4.0.6',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/pulsar'),
}

/** @type {BaseProperties} */
export const configInfo = {
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/config-provider'),
}

/** @type {BaseProperties} */
export const mailpaceInfo = {
  plan: 'XS',
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/mailpace'),
}

/** @type {BaseProperties} */
export const mysqlInfo = {
  version: {
    installed: '8.0.44',
    stateType: 'up-to-date',
  },
  plan: 'XXS_SML',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '1',
    },
    {
      code: 'memory',
      type: 'bytes',
      value: '536870912',
    },
    {
      code: 'connection-limit',
      type: 'number',
      value: '15',
    },
    {
      code: 'max-db-size',
      type: 'bytes',
      value: '536870912',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/mysql'),
}

/** @type {BaseProperties} */
export const postgresqlInfo = {
  version: {
    installed: '17.6',
    stateType: 'up-to-date',
  },
  plan: 'XXS_SML',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '1',
    },
    {
      code: 'memory',
      type: 'bytes',
      value: '536870912',
    },
    {
      code: 'connection-limit',
      type: 'number',
      value: '45',
    },
    {
      code: 'max-db-size',
      type: 'bytes',
      value: '1073741824',
    },
    {
      code: 'encryption-at-rest',
      type: 'boolean',
      value: 'true',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  role: 'Primary',
  docUrlLink: generateDocsHref('addons/postgresql'),
}

/** @type {BaseProperties} */
export const redisInfo = {
  version: {
    installed: '8.2.1',
    stateType: 'up-to-date',
  },
  plan: 'S',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '1',
    },
    {
      code: 'disk-size',
      type: 'bytes',
      value: '134217728',
    },
    {
      code: 'connection-limit',
      type: 'number',
      value: '100',
    },
    {
      code: 'databases',
      type: 'number',
      value: '1',
    },
    {
      code: 'encryption-at-rest',
      type: 'boolean',
      value: 'true',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/redis'),
}

/** @type {BaseProperties} */
export const mongodbInfo = {
  version: {
    installed: '8.0',
    stateType: 'up-to-date',
  },
  plan: 'S',
  features: [
    {
      code: 'cpu',
      type: 'number',
      value: '2',
    },
    {
      code: 'memory',
      type: 'bytes',
      value: '2147483648',
    },
    {
      code: 'max-db-size',
      type: 'bytes',
      value: '16106127360',
    },
    {
      code: 'encryption-at-rest',
      type: 'boolean',
      value: 'true',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDocsHref('addons/mongodb'),
}

/** @type {BaseProperties} */
export const azimuttInfo = {
  plan: 'BASIC',
  features: [
    {
      code: 'users',
      type: 'number',
      value: '1',
    },
    {
      code: 'data-exploration',
      type: 'boolean',
      value: 'true',
    },
    {
      code: 'db-analysis',
      type: 'string',
      value: 'PREVIEW',
    },
  ],
  creationDate: '2025-06-15T10:30:00Z',
}

/** @type {BaseProperties} */
export const kubernetesInfo = {
  version: {
    installed: '1.33',
    stateType: 'up-to-date',
  },
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: generateDevHubHref('guides/kubernetes-operator/'),
}
