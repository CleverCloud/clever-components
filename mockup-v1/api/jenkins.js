/* eslint-disable camelcase */
export const JENKINS_ADDON_RAW = {
  providerId: 'jenkins',
  clusters: [],
  dedicated: {
    LTS: {
      features: [
        {
          name: 'encryption',
          enabled: false,
        },
      ],
    },
  },
  defaultDedicatedVersion: 'LTS',
};
/* eslint-enable camelcase */
