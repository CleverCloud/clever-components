/** @type {import('../../components/cc-web-features-tracker/cc-web-features-tracker.types.js').FormattedFeature[]}*/
export const webFeatures = [
  {
    featureName: 'CSS Grid Layout',
    currentStatus: 'widely',
    isProgressiveEnhancement: false,
    canBeUsed: true,
    chromeSupport: {
      isSupported: true,
      version: '57',
      releaseDate: new Date('2017-03-09'),
    },
    firefoxSupport: {
      isSupported: true,
      version: '52',
      releaseDate: new Date('2017-03-07'),
    },
    safariSupport: {
      isSupported: true,
      version: '10.1',
      releaseDate: new Date('2017-03-27'),
    },
  },
  {
    featureName: 'Decorators',
    currentStatus: 'newly',
    isProgressiveEnhancement: true,
    canBeUsed: true,
    chromeSupport: {
      isSupported: true,
      version: '91',
      releaseDate: new Date('2021-05-25'),
    },
    firefoxSupport: {
      isSupported: false,
    },
    safariSupport: {
      isSupported: false,
    },
  },
  {
    featureName: 'WebGPU',
    currentStatus: 'limited',
    isProgressiveEnhancement: false,
    canBeUsed: false,
    chromeSupport: {
      isSupported: true,
      version: '113',
      releaseDate: new Date('2023-05-02'),
    },
    firefoxSupport: {
      isSupported: false,
    },
    safariSupport: {
      isSupported: false,
    },
  },
  {
    featureName: 'CSS Subgrid',
    currentStatus: 'newly',
    isProgressiveEnhancement: false,
    canBeUsed: false,
    chromeSupport: {
      isSupported: true,
      version: '117',
      releaseDate: new Date('2023-09-26'),
    },
    firefoxSupport: {
      isSupported: true,
      version: '71',
      releaseDate: new Date('2019-12-03'),
    },
    safariSupport: {
      isSupported: true,
      version: '16',
      releaseDate: new Date('2022-09-12'),
    },
  },
  {
    featureName: 'Container Queries',
    currentStatus: 'newly',
    isProgressiveEnhancement: true,
    canBeUsed: true,
    chromeSupport: {
      isSupported: true,
      version: '105',
      releaseDate: new Date('2022-08-30'),
    },
    firefoxSupport: {
      isSupported: true,
      version: '110',
      releaseDate: new Date('2023-02-14'),
    },
    safariSupport: {
      isSupported: true,
      version: '16',
      releaseDate: new Date('2022-09-12'),
    },
  },
];
