import { SKELETON_WEB_FEATURES, WEB_FEATURES } from '../../stories/fixtures/web-features.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-web-features-tracker.js';

export default {
  tags: ['autodocs'],
  title: '🕸️ Web Features/<cc-web-features-tracker>',
  component: 'cc-web-features-tracker',
};

/**
 * @import { WebFeaturesTrackerState, WebFeaturesTrackerStateLoaded, WebFeaturesTrackerStateLoading, WebFeaturesTrackerStateError, FormattedFeature } from './cc-web-features-tracker.types.js'
 * @import { CcWebFeaturesTracker } from './cc-web-features-tracker.js'
 */

const conf = {
  component: 'cc-web-features-tracker',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loading',
        webFeatures: SKELETON_WEB_FEATURES,
      },
    },
  ],
});

export const error = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: { type: 'error' },
    },
  ],
});

export const empty = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: [],
      },
    },
  ],
});

export const dataLoadedWithCanBeUsedOnly = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES,
      },
      tableFeatureFilter: { displayControl: true, value: 'can-be-used' },
    },
  ],
});

export const dataLoadedWithoutProgressiveEnhancement = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES.filter((feature) => !feature.isProgressiveEnhancement),
      },
    },
  ],
});

export const dataLoadedWithoutPolyfill = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES.filter((feature) => !feature.canBeUsedWithPolyfill),
      },
    },
  ],
});

export const dataLoadedWithoutProgressiveEnhancementAndPolyfill = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES.filter(
          (feature) => !feature.isProgressiveEnhancement && !feature.canBeUsedWithPolyfill,
        ),
      },
    },
  ],
});

export const dataLoadedWithoutFeatureFilterControl = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES,
      },
      tableFeatureFilter: { displayControl: false, value: 'all' },
    },
  ],
});

export const simulationLoadingSuccess = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
        webFeatures: SKELETON_WEB_FEATURES,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          webFeatures: WEB_FEATURES,
        };
      },
    ),
  ],
});

export const simulationLoadingError = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
        webFeatures: SKELETON_WEB_FEATURES,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.state = {
          type: 'error',
        };
      },
    ),
  ],
});

export const simulationChangingFilters = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: WEB_FEATURES,
      },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.tableFeatureFilter = { displayControl: true, value: 'can-be-used' };
      },
    ),
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.tableFeatureFilter = { displayControl: true, value: 'all' };
      },
    ),
  ],
});
