import { getAssetUrl } from '../../lib/assets-url.js';
import { getDevHubUrl, getDocUrl } from '../../lib/dev-hub-url.js';

/**
 * @import { AddonInfoStateBaseProperties } from '../../components/cc-addon-info/cc-addon-info.types.js'
 */

/** @type {AddonInfoStateBaseProperties} */
export const matomoInfo = {
  version: {
    installed: '5.3.0',
    stateType: 'up-to-date',
    latest: '5.3.0',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'PHP',
      logoUrl: getAssetUrl('/logos/php.svg'),
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'MySQL add-on',
      logoUrl: getAssetUrl('/logos/mysql.svg'),
      link: 'https://example.com/addon',
    },
    {
      type: 'addon',
      name: 'Redis add-on',
      logoUrl: getAssetUrl('/logos/redis.svg'),
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: getDocUrl('addons/matomo'),
}

/** @type {AddonInfoStateBaseProperties} */
export const metabaseInfo = {
  version: {
    installed: '55',
    stateType: 'up-to-date',
    latest: '55',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: getAssetUrl('/logos/java-jar.svg'),
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'PostgreSQL add-on',
      logoUrl: getAssetUrl('/logos/pgsql.svg'),
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: getDocUrl('addons/metabase'),
}

/** @type {AddonInfoStateBaseProperties} */
export const keycloakInfo = {
  version: {
    installed: '26.3.0',
    stateType: 'up-to-date',
    latest: '26.3.0',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: getAssetUrl('/logos/java-jar.svg'),
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'PostgreSQL add-on',
      logoUrl: getAssetUrl('/logos/pgsql.svg'),
      link: 'https://example.com/addon',
    },
    {
      type: 'addon',
      name: 'FS Bucket add-on',
      logoUrl: getAssetUrl('/logos/fsbucket.svg'),
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: getDocUrl('addons/keycloak'),
}

/** @type {AddonInfoStateBaseProperties} */
export const otoroshiInfo = {
  version: {
    installed: '17.4.0',
    stateType: 'up-to-date',
    latest: '17.4.0',
  },
  creationDate: '2025-06-15T10:30:00Z',
  openGrafanaLink: 'https://grafana.example.com',
  openScalabilityLink: 'https://scalability.example.com',
  linkedServices: [
    {
      type: 'app',
      name: 'Java',
      logoUrl: getAssetUrl('/logos/java-jar.svg'),
      link: 'https://example.com/app',
    },
    {
      type: 'addon',
      name: 'Redis add-on',
      logoUrl: getAssetUrl('/logos/redis.svg'),
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: getDocUrl('addons/otoroshi'),
}

/** @type {AddonInfoStateBaseProperties} */
export const materiaInfo = {
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: getDocUrl('addons/materia-kv'),
}

/** @type {AddonInfoStateBaseProperties} */
export const jenkinsInfo = {
  version: {
    installed: '2.516.2',
    stateType: 'up-to-date',
    latest: '2.516.2',
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
  docUrlLink: getDocUrl('addons/jenkins'),
}

/** @type {AddonInfoStateBaseProperties} */
export const elasticInfo = {
  version: {
    installed: '9.1.2',
    stateType: 'up-to-date',
    latest: '9.1.2',
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
      logoUrl: getAssetUrl('/logos/elasticsearch-kibana.svg'),
      link: 'https://example.com/app',
    },
    {
      type: 'app',
      name: 'APM',
      logoUrl: getAssetUrl('/logos/elasticsearch-apm.svg'),
      link: 'https://example.com/addon',
    },
  ],
  docUrlLink: getDocUrl('addons/elastic'),
}

/** @type {AddonInfoStateBaseProperties} */
export const pulsarInfo = {
  version: {
    installed: '4.0.6',
    stateType: 'up-to-date',
    latest: '4.0.6',
  },
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: getDocUrl('addons/pulsar'),
}

/** @type {AddonInfoStateBaseProperties} */
export const mailpaceInfo = {
  plan: 'XS',
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: getDocUrl('addons/mailpace'),
}

/** @type {AddonInfoStateBaseProperties} */
export const mysqlInfo = {
  version: {
    installed: '8.0.44',
    stateType: 'up-to-date',
    latest: '8.0.44',
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
  docUrlLink: getDocUrl('addons/mysql'),
}

/** @type {AddonInfoStateBaseProperties} */
export const postgresqlInfo = {
  version: {
    installed: '17.6',
    stateType: 'up-to-date',
    latest: '17.6',
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
  docUrlLink: getDocUrl('addons/postgresql'),
}

/** @type {AddonInfoStateBaseProperties} */
export const redisInfo = {
  version: {
    installed: '8.2.1',
    stateType: 'up-to-date',
    latest: '8.2.1',
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
  docUrlLink: getDocUrl('addons/redis'),
}

/** @type {AddonInfoStateBaseProperties} */
export const mongodbInfo = {
  version: {
    installed: '8.0',
    stateType: 'up-to-date',
    latest: '8.0',
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
  docUrlLink: getDocUrl('addons/mongodb'),
}

/** @type {AddonInfoStateBaseProperties} */
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

/** @type {AddonInfoStateBaseProperties} */
export const kubernetesInfo = {
  version: {
    installed: '1.33',
    stateType: 'up-to-date',
    latest: '1.33',
  },
  creationDate: '2025-06-15T10:30:00Z',
  docUrlLink: getDevHubUrl('guides/kubernetes-operator'),
}
