/* eslint-disable camelcase */
export const POSTGRESQL_ADDON_RAW = {
  providerId: 'postgresql-addon',
  clusters: [
    {
      id: 'cluster_ba9e6819-5f8c-4d4e-9c10-f34f79eb7887',
      label: 'clevercloud-postgresql-internal',
      zone: 'clevercloud-postgresql-internal',
      version: '15',
      features: [],
    },
    {
      id: 'cluster_a74f71da-718d-11ee-bdc9-b025aa4ed39c',
      label: 'par-postgresql-c6',
      zone: 'par',
      version: '15',
      features: [],
    },
    {
      id: 'cluster_e9665150-69cb-45ce-8fed-ff7c8ee72a3b',
      label: 'graviteesource-postgresql-c1',
      zone: 'graviteesource',
      version: '12',
      features: [],
    },
    {
      id: 'cluster_ad15f395-69ea-4c2e-aa4e-cbd4d9abd377',
      label: 'boxraiser-postgresql-c1',
      zone: 'boxraiser',
      version: '12',
      features: [],
    },
  ],
  dedicated: {
    11: {
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
    12: {
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
    13: {
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
    14: {
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
    15: {
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
  defaultDedicatedVersion: '15',
};
/* eslint-enable camelcase */
