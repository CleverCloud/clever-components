/* eslint-disable camelcase */
export const REDIS_ADDON_RAW = {
  providerId: 'redis-addon',
  clusters: [
    {
      id: 'cluster_2838f115-d3eb-493e-beab-5d33c0d77cf7',
      label: 'redismanager-c1',
      zone: 'clever.redis1.actions',
      version: '-1',
      features: [],
    },
    {
      id: 'cluster_9a046acb-c720-4e87-936c-5c34aa4903d3',
      label: 'redismanager',
      zone: 'clever.redis.actions',
      version: '-1',
      features: [],
    },
    {
      id: 'cluster_5382c278-9ed7-4cf8-8f32-cb649ee6fb56',
      label: 'redismanager-c2',
      zone: 'clever.redis2.actions',
      version: '-1',
      features: [],
    },
    {
      id: 'cluster_a4785002-fba1-4f1e-8c8f-7455e0e3f8e7',
      label: 'iadvize-redismanager-c0-n1',
      zone: 'clever.redis-iadvize-c0-n1.actions',
      version: '-1',
      features: [],
    },
    {
      id: 'cluster_3a78ddd6-2bb3-4b37-a99f-f8e3b2944738',
      label: 'iadvize-redismanager-c0-n2',
      zone: 'clever.redis-iadvize-c0-n2.actions',
      version: '-1',
      features: [],
    },
    {
      id: 'cluster_6c1df994-a092-4df6-824c-4a102e3fb1fa',
      label: 'iadvize-redismanager-c0-n3',
      zone: 'clever.redis-iadvize-c0-n3.actions',
      version: '-1',
      features: [],
    },
  ],
  dedicated: {
    '7.2.4': {
      features: [
        {
          name: 'encryption',
          enabled: false,
        },
      ],
    },
  },
  defaultDedicatedVersion: '7.2.4',
};
/* eslint-enable camelcase */
