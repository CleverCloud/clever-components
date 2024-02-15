import './cc-env-var-linked-services.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  title: '🛠 Environment variables/<cc-env-var-linked-services>',
  component: 'cc-env-var-linked-services',
};

const conf = {
  component: 'cc-env-var-linked-services',
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        servicesStates: [
          { name: 'My Awesome PG database', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Redis cache (PROD)', type: 'loaded', variables: VARIABLES_FULL },
        ],
      },
    },
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        servicesStates: [
          { name: 'The mighty maven Java app', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Node.js frontend preprod', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Auth gateway for backend', type: 'loaded', variables: VARIABLES_FULL },
        ],
      },
    },
  ],
});

export const loadingWithLinkedAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    state: { type: 'loading' },
  }],
});

export const loadingWithLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    state: { type: 'loading' },
  }],
});

export const loadedWithSomeLoadingLinkedAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'My Awesome PG database', type: 'loading' },
        { name: 'Redis cache (PROD)', type: 'loaded', variables: VARIABLES_FULL },
      ],
    },
  }],
});

export const loadedWithSomeLoadingLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'The mighty maven Java app', type: 'loading' },
        { name: 'Node.js frontend preprod', type: 'loaded', variables: VARIABLES_FULL },
        { name: 'Auth gateway for backend', type: 'loading' },
      ],
    },
  }],
});

export const loadedWithEmptyLinkedAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    state: { type: 'loaded', servicesStates: [] },
  }],
});

export const loadedWithEmptyLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    state: { type: 'loaded', servicesStates: [] },
  }],
});

export const loadedWithLinkedAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'My Awesome PG database', variables: VARIABLES_FULL },
        { name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
      ],
    },
  }],
});

export const loadedWithLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'The mighty maven Java app', variables: VARIABLES_FULL },
        { name: 'Node.js frontend preprod', variables: VARIABLES_FULL },
        { name: 'Auth gateway for backend', variables: VARIABLES_FULL },
      ],
    },
  }],
});

export const errorWithLinkedAddons = makeStory(conf, {
  items: [{ type: 'addon', appName: 'Foobar backend python', state: { type: 'error' } }],
});

export const errorWithOneLinkedAddon = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'My Awesome PG database', type: 'error' },
        { name: 'Redis cache (PROD)', type: 'loaded', variables: VARIABLES_FULL },
      ],
    },
  }],
});

export const errorWithLinkedApps = makeStory(conf, {
  items: [{ type: 'app', appName: 'Foobar backend python', state: { type: 'error' } }],
});

export const errorWithOneLinkedApp = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    state: {
      type: 'loaded',
      servicesStates: [
        { name: 'The mighty maven Java app', type: 'loaded', variables: VARIABLES_FULL },
        { name: 'Node.js frontend preprod', type: 'error' },
        { name: 'Auth gateway for backend', type: 'loaded', variables: VARIABLES_FULL },
      ],
    },
  }],
});

export const simulationsWithAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        servicesStates: [
          { name: 'My Awesome PG database', type: 'loading' },
          { name: 'Redis cache (PROD)', type: 'loading' },
        ],
      };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        servicesStates: [
          { name: 'My Awesome PG database', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Redis cache (PROD)', type: 'error' },
        ],
      };
    }),
  ],
});

export const simulationsWithLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        servicesStates: [
          { name: 'The mighty maven Java app', type: 'loading' },
          { name: 'Node.js frontend preprod', type: 'loading' },
          { name: 'Auth gateway for backend', type: 'loading' },
        ],
      };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        servicesStates: [
          { name: 'The mighty maven Java app', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Node.js frontend preprod', type: 'loaded', variables: VARIABLES_FULL },
          { name: 'Auth gateway for backend', type: 'error' },
        ],
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loadingWithLinkedAddons,
  loadingWithLinkedApps,
  loadedWithSomeLoadingLinkedAddons,
  loadedWithSomeLoadingLinkedApps,
  loadedWithEmptyLinkedAddons,
  loadedWithEmptyLinkedApps,
  loadedWithLinkedAddons,
  loadedWithLinkedApps,
  errorWithLinkedAddons,
  errorWithOneLinkedAddon,
  errorWithLinkedApps,
  errorWithOneLinkedApp,
  simulationsWithAddons,
  simulationsWithLinkedApps,
});
