/* eslint-disable camelcase */
export const MONGODB_ADDON_RAW = {
  providerId: 'mongodb-addon',
  clusters: [
    {
      id: 'cluster_1b7208ad-1234-4954-ac30-6fe8d0c0240b',
      label: 'undefined',
      zone: 'captaindash',
      version: 'undefined',
      features: [],
    },
    {
      id: 'cluster_671bb60f-a69f-47da-bfeb-afd38a23c3f4',
      label: 'yaakadev-mongodb-c2',
      zone: 'yaakadev',
      version: '4.0.3',
      features: [],
    },
    {
      id: 'cluster_3ea76604-fc6b-44c2-b105-c472ab19978f',
      label: 'par-mongodb-c2',
      zone: 'par',
      version: '4.0.3',
      features: [],
    },
  ],
  dedicated: {
    '4.0.3': {
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
  defaultDedicatedVersion: '4.0.3',
};
/* eslint-enable camelcase */
