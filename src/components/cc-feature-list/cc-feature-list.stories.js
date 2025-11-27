import { makeStory } from '../../stories/lib/make-story.js';
import '../cc-badge/cc-badge.js';
import './cc-feature-list.js';

export default {
  tags: ['autodocs'],
  title: '🛠 Profile/<cc-feature-list>',
  component: 'cc-feature-list',
};

const conf = {
  component: 'cc-feature-list',
};

/**
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListStateLoaded} FeatureListStateLoaded
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListStateLoading} FeatureListStateLoading
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListStateError} FeatureListStateError
 */

export const defaultStory = makeStory(conf, {
  items: [
    {
      /** @type {FeatureListStateLoaded} */
      state: {
        type: 'loaded',
        featureList: [
          {
            id: 'access-log',
            name: 'Access log',
            description:
              'This feature flag enables the new Access Logs view, allowing users to explore detailed connection and activity records for their resources.  It provides improved filtering, search capabilities, and clearer data visualization.  Activating this flag will replace the legacy logs interface with the new version currently in final version.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Version A', value: 'versionA' },
              { label: 'Version B', value: 'versionB' },
            ],
            value: 'versionA',
            status: 'alpha',
            documentationLink: 'https://example.com/doc',
            feedbackLink: 'https://example.com/feedback',
          },
          {
            id: 'new-creation-tunnel',
            name: 'New creation tunnel',
            description:
              'This feature flag enables the new creation flow currently in testing.  It introduces an improved step-by-step experience designed to simplify setup and enhance clarity throughout the process.  Activating this flag will replace the current creation tunnel with the experimental version.  Please note that this feature is still in beta and may undergo changes before its official release.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Enable', value: 'enable' },
            ],
            value: 'enable',
            status: 'beta',
            documentationLink: 'https://example.com/doc',
            feedbackLink: 'https://example.com/feedback',
          },
          {
            id: 'new-creation-tunnel-2',
            name: 'New creation tunnel',
            description:
              'Discover the new process for creating and adding a new resource. Please note that this feature is experimental and may still evolve before its public release.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Enable', value: 'enable' },
            ],
            value: 'enable',
            status: 'preview',
            documentationLink: 'https://example.com/doc',
            feedbackLink: 'https://example.com/feedback',
          },
        ],
      },
    },
  ],
});

export const withoutLink = makeStory(conf, {
  items: [
    {
      /** @type {FeatureListStateLoaded} */
      state: {
        type: 'loaded',
        featureList: [
          {
            id: 'access-log',
            name: 'Access log',
            description:
              'This feature flag enables the new Access Logs view, allowing users to explore detailed connection and activity records for their resources.  It provides improved filtering, search capabilities, and clearer data visualization.  Activating this flag will replace the legacy logs interface with the new version currently in final version.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Version A', value: 'versionA' },
              { label: 'Version B', value: 'versionB' },
            ],
            value: 'versionA',
            status: 'alpha',
            documentationLink: 'https://example.com/doc',
          },
          {
            id: 'new-creation-tunnel',
            name: 'New creation tunnel',
            description:
              'This feature flag enables the new creation flow currently in testing.  It introduces an improved step-by-step experience designed to simplify setup and enhance clarity throughout the process.  Activating this flag will replace the current creation tunnel with the experimental version.  Please note that this feature is still in beta and may undergo changes before its official release.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Enable', value: 'enable' },
            ],
            value: 'enable',
            status: 'beta',
            feedbackLink: 'https://example.com/feedback',
          },
          {
            id: 'new-creation-tunnel-2',
            name: 'New creation tunnel',
            description:
              'Discover the new process for creating and adding a new resource. Please note that this feature is experimental and may still evolve before its public release.',
            options: [
              { label: 'Disable', value: 'disable' },
              { label: 'Enable', value: 'enable' },
            ],
            value: 'enable',
          },
        ],
      },
    },
  ],
});

export const dataLoadedWithNoFeature = makeStory(conf, {
  items: [
    {
      /** @type {FeatureListStateLoaded} */
      state: {
        type: 'loaded',
        featureList: [],
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      /** @type {FeatureListStateLoading} */
      state: {
        type: 'loading',
      },
    },
  ],
});

export const error = makeStory(conf, {
  items: [
    {
      /** @type {FeatureListStateError} */
      state: {
        type: 'error',
      },
    },
  ],
});
