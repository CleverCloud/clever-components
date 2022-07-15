import '../../src/env-var/cc-env-var-linked-services.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

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
      services: [
        { name: 'My Awesome PG database', variables: VARIABLES_FULL },
        { name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
      ],
    },
    {
      type: 'app',
      appName: 'Foobar backend python',
      services: [
        { name: 'The mighty maven Java app', variables: VARIABLES_FULL },
        { name: 'Node.js frontend preprod', variables: VARIABLES_FULL },
        { name: 'Auth gateway for backend', variables: VARIABLES_FULL },
      ],
    },
  ],
});

export const loadingWithAddons = makeStory(conf, {
  items: [{ type: 'addon', appName: 'Foobar backend python' }],
});

export const loadingWithLinkedApps = makeStory(conf, {
  items: [{ type: 'app', appName: 'Foobar backend python' }],
});

export const skeletonWithAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    services: [
      { name: 'My Awesome PG database' },
      { name: 'Redis cache (PROD)' },
    ],
  }],
});

export const skeletonWithLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    services: [
      { name: 'The mighty maven Java app' },
      { name: 'Node.js frontend preprod' },
      { name: 'Auth gateway for backend' },
    ],
  }],
});

export const emptyWithAddons = makeStory(conf, {
  items: [{ type: 'addon', appName: 'Foobar backend python', services: [] }],
});

export const emptyWithLinkedApps = makeStory(conf, {
  items: [{ type: 'app', appName: 'Foobar backend python', services: [] }],
});

export const dataLoadedWithAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    services: [
      { name: 'My Awesome PG database', variables: VARIABLES_FULL },
      { name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
    ],
  }],
});

export const dataLoadedWithLinkedApps = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    services: [
      { name: 'The mighty maven Java app', variables: VARIABLES_FULL },
      { name: 'Node.js frontend preprod', variables: VARIABLES_FULL },
      { name: 'Auth gateway for backend', variables: VARIABLES_FULL },
    ],
  }],
});

export const errorWithAddonsList = makeStory(conf, {
  items: [{ type: 'addon', appName: 'Foobar backend python', error: true }],
});

export const errorWithAddon = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
    services: [
      { name: 'My Awesome PG database', error: 'loading' },
      { name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
    ],
  }],
});

export const errorWithLinkedAppsList = makeStory(conf, {
  items: [{ type: 'app', appName: 'Foobar backend python', error: true }],
});

export const errorWithLinkedApp = makeStory(conf, {
  items: [{
    type: 'app',
    appName: 'Foobar backend python',
    services: [
      { name: 'The mighty maven Java app', variables: VARIABLES_FULL },
      { name: 'Node.js frontend preprod', error: 'loading' },
      { name: 'Auth gateway for backend', variables: VARIABLES_FULL },
    ],
  }],
});

export const simulationsWithAddons = makeStory(conf, {
  items: [{
    type: 'addon',
    appName: 'Foobar backend python',
  }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.services = [
        { name: 'My Awesome PG database' },
        { name: 'Redis cache (PROD)' },
      ];
    }),
    storyWait(2000, ([component]) => {
      component.services = [
        { name: 'My Awesome PG database', variables: VARIABLES_FULL },
        { name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
      ];
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
      component.services = [
        { name: 'The mighty maven Java app' },
        { name: 'Node.js frontend preprod' },
        { name: 'Auth gateway for backend' },
      ];
    }),
    storyWait(2000, ([component]) => {
      component.services = [
        { name: 'The mighty maven Java app', variables: VARIABLES_FULL },
        { name: 'Node.js frontend preprod', variables: VARIABLES_FULL },
        { name: 'Auth gateway for backend', variables: VARIABLES_FULL },
      ];
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loadingWithAddons,
  loadingWithLinkedApps,
  emptyWithAddons,
  emptyWithLinkedApps,
  skeletonWithAddons,
  skeletonWithLinkedApps,
  dataLoadedWithAddons,
  dataLoadedWithLinkedApps,
  errorWithAddonsList,
  errorWithAddon,
  errorWithLinkedAppsList,
  errorWithLinkedApp,
  simulationsWithAddons,
  simulationsWithLinkedApps,
});
