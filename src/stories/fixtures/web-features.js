/** @type {import('../../components/cc-web-features-tracker/cc-web-features-tracker.types.js').FormattedFeature[]}*/
export const WEB_FEATURES = [
  {
    featureId: 'css-grid-layout',
    featureName: 'CSS Grid Layout',
    category: 'CSS',
    currentStatus: 'widely',
    isProgressiveEnhancement: false,
    canBeUsedWithPolyfill: false,
    canBeUsed: true,
    comment: 'Two-dimensional layout system for the web, allowing for precise control of rows and columns.',
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
    featureId: 'decorators',
    featureName: 'Decorators',
    category: 'JS',
    currentStatus: 'newly',
    isProgressiveEnhancement: false,
    canBeUsedWithPolyfill: true,
    canBeUsed: true,
    comment: 'JavaScript syntax for modifying classes and class elements at definition time.',
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
    featureId: 'css-subgrid',
    featureName: 'CSS Subgrid',
    category: 'CSS',
    currentStatus: 'newly',
    isProgressiveEnhancement: false,
    canBeUsedWithPolyfill: false,
    canBeUsed: false,
    comment: 'For aligning nested grid items with the parent grid.',
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
    featureId: 'container-queries',
    featureName: 'Container Queries',
    category: 'CSS',
    currentStatus: 'newly',
    isProgressiveEnhancement: true,
    canBeUsedWithPolyfill: false,
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

/** @type {import('../../components/cc-web-features-tracker/cc-web-features-tracker.types.js').SkeletonWebFeature[]} */
export const SKELETON_WEB_FEATURES = WEB_FEATURES.map((webFeature) => ({
  featureId: webFeature.featureId,
  featureName: webFeature.featureName,
  comment: webFeature.comment,
  category: webFeature.category,
  canBeUsedWithPolyfill: webFeature.canBeUsedWithPolyfill,
  isProgressiveEnhancement: webFeature.isProgressiveEnhancement,
}));
