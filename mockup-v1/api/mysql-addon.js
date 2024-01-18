/* eslint-disable camelcase */
export const MYSQL_ADDON_RAW = {
  providerId: 'mysql-addon',
  clusters: [
    {
      id: 'cluster_19e2b20b-cb41-4d4e-8f48-10c43d1f1682',
      label: 'mysql-intuiti',
      zone: 'intuiti',
      version: '5.6.16-64.2-log Exherbo',
      features: [],
    },
    {
      id: 'cluster_72b2298b-3be7-49bc-af49-7aa4f3a4b6ab',
      label: 'mysql-c5',
      zone: 'mtl',
      version: '8.0',
      features: [],
    },
    {
      id: 'cluster_d788d751-3518-4214-8164-9846cb93548f',
      label: 'mysql-maj-digital',
      zone: 'maj-digital',
      version: '8.0',
      features: [],
    },
    {
      id: 'cluster_93e9e465-e111-4607-8451-e96ad35ada65',
      label: 'par-mysql-c6',
      zone: 'par',
      version: '8.0',
      features: [],
    },
  ],
  dedicated: {
    5.7: {
      features: [
        {
          name: 'encryption',
          enabled: false,
        },
        {
          name: 'direct-host-only',
          enabled: false,
        },
      ],
    },
    '8.0': {
      features: [
        {
          name: 'encryption',
          enabled: false,
        },
        {
          name: 'direct-host-only',
          enabled: false,
        },
      ],
    },
  },
  defaultDedicatedVersion: '8.0',
};
/* eslint-enable camelcase */
