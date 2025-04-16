import { webFeatures } from '../../stories/fixtures/web-features.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-web-features-tracker.js';

export default {
  tags: ['autodocs'],
  title: '🕸️ Web Features/<cc-web-features-tracker>',
  component: 'cc-web-features-tracker',
};

/**
 * @typedef {import('./cc-web-features-tracker.types.js').WebFeaturesTrackerState} WebFeaturesTrackerState
 * @typedef {import('./cc-web-features-tracker.types.js').WebFeaturesTrackerStateLoaded} WebFeaturesTrackerStateLoaded
 * @typedef {import('./cc-web-features-tracker.types.js').WebFeaturesTrackerStateLoading} WebFeaturesTrackerStateLoading
 * @typedef {import('./cc-web-features-tracker.types.js').WebFeaturesTrackerStateError} WebFeaturesTrackerStateError
 * @typedef {import('./cc-web-features-tracker.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('./cc-web-features-tracker.js').CcWebFeaturesTracker} CcWebFeaturesTracker
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
        webFeatures,
      },
    },
  ],
});

export const loading = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: { type: 'loading' },
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
        webFeatures,
      },
      tableFeatureFilter: { displayControl: true, value: 'can-be-used' },
    },
  ],
});

export const dataLoadedWithDetailedDisplayMode = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures,
      },
      tableDisplayMode: { displayControl: true, value: 'detailed' },
    },
  ],
});

export const dataLoadedWithDetailedDisplayModeAndCanBeUsedFilter = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures,
      },
      tableFeatureFilter: { displayControl: true, value: 'can-be-used' },
      tableDisplayMode: { displayControl: true, value: 'detailed' },
    },
  ],
});

export const dataLoadedWithoutFeatureFilterControl = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures,
      },
      tableFeatureFilter: { displayControl: false, value: 'all' },
      tableDisplayMode: { displayControl: true, value: 'compact' },
    },
  ],
});

export const dataLoadedWithoutDisplayModeControl = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures,
      },
      tableFeatureFilter: { displayControl: true, value: 'all' },
      tableDisplayMode: { displayControl: false, value: 'compact' },
    },
  ],
});

export const dataLoadedWithoutDisplayControls = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures,
      },
      tableFeatureFilter: { displayControl: false, value: 'all' },
      tableDisplayMode: { displayControl: false, value: 'compact' },
    },
  ],
});

export const dataLoadedWithNoProgressiveWarning = makeStory(conf, {
  /** @type {Partial<CcWebFeaturesTracker>[]} */
  items: [
    {
      state: {
        type: 'loaded',
        webFeatures: webFeatures.map((feature) => ({
          ...feature,
          isProgressiveEnhancement: false,
        })),
      },
    },
  ],
});

export const simulationLoadingSuccess = makeStory(conf, {
  items: [{}],
  simulations: [
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.state = {
          type: 'loaded',
          webFeatures,
        };
      },
    ),
  ],
});

export const simulationLoadingError = makeStory(conf, {
  items: [{}],
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
        webFeatures,
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
        component.tableDisplayMode = { displayControl: true, value: 'detailed' };
      },
    ),
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.tableFeatureFilter = { displayControl: true, value: 'all' };
      },
    ),
    storyWait(
      2000,
      /** @param {CcWebFeaturesTracker[]} components */
      ([component]) => {
        component.tableDisplayMode = { displayControl: true, value: 'compact' };
      },
    ),
  ],
});
