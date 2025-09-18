import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import './cc-env-var-linked-services.js';

const VARIABLES_FULL = [
  { name: 'EMPTY', value: '' },
  { name: 'ONE', value: 'value ONE' },
  { name: 'MULTI', value: 'line one\nline two\nline three' },
  { name: 'TWO', value: 'value TWO' },
];

export default {
  tags: ['autodocs'],
  title: '🛠 Environment variables/<cc-env-var-linked-services>',
  component: 'cc-env-var-linked-services',
};

/**
 * @typedef {import('./cc-env-var-linked-services.js').CcEnvVarLinkedServices} CcEnvVarLinkedServices
 */

const conf = {
  component: 'cc-env-var-linked-services',
};

export const defaultStory = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        services: [
          {
            id: 'addon_01234567-89ab-cdef-0123-456789abcde0',
            name: 'My Awesome PG database',
            variables: VARIABLES_FULL,
          },
          { id: 'addon_01234567-89ab-cdef-0123-456789abcde1', name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
        ],
      },
    },
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        services: [
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde0',
            name: 'The mighty maven Java app',
            variables: VARIABLES_FULL,
          },
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde1',
            name: 'Node.js frontend preprod',
            variables: VARIABLES_FULL,
          },
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde2',
            name: 'Auth gateway for backend',
            variables: VARIABLES_FULL,
          },
        ],
      },
    },
  ],
});

export const loadingWithLinkedAddons = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: { type: 'loading' },
    },
  ],
});

export const loadingWithLinkedApps = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: { type: 'loading' },
    },
  ],
});

export const loadedWithEmptyLinkedAddons = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: { type: 'loaded', services: [] },
    },
  ],
});

export const loadedWithEmptyLinkedApps = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: { type: 'loaded', services: [] },
    },
  ],
});

export const loadedWithLinkedAddons = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        services: [
          {
            id: 'addon_01234567-89ab-cdef-0123-456789abcde0',
            name: 'My Awesome PG database',
            variables: VARIABLES_FULL,
          },
          { id: 'addon_01234567-89ab-cdef-0123-456789abcde1', name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
        ],
      },
    },
  ],
});

export const loadedWithLinkedApps = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: {
        type: 'loaded',
        services: [
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde0',
            name: 'The mighty maven Java app',
            variables: VARIABLES_FULL,
          },
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde1',
            name: 'Node.js frontend preprod',
            variables: VARIABLES_FULL,
          },
          {
            id: 'app_01234567-89ab-cdef-0123-456789abcde2',
            name: 'Auth gateway for backend',
            variables: VARIABLES_FULL,
          },
        ],
      },
    },
  ],
});

export const errorWithLinkedAddons = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [{ type: 'addon', appName: 'Foobar backend python', state: { type: 'error' } }],
});

export const errorWithLinkedApps = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [{ type: 'app', appName: 'Foobar backend python', state: { type: 'error' } }],
});

export const simulationsWithAddons = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'addon',
      appName: 'Foobar backend python',
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcEnvVarLinkedServices[]} components */ ([component]) => {
        component.state = {
          type: 'loaded',
          services: [
            {
              id: 'addon_01234567-89ab-cdef-0123-456789abcde0',
              name: 'My Awesome PG database',
              variables: VARIABLES_FULL,
            },
            { id: 'addon_01234567-89ab-cdef-0123-456789abcde1', name: 'Redis cache (PROD)', variables: VARIABLES_FULL },
          ],
        };
      },
    ),
  ],
});

export const simulationsWithLinkedApps = makeStory(conf, {
  /** @type {Partial<CcEnvVarLinkedServices>[]} */
  items: [
    {
      type: 'app',
      appName: 'Foobar backend python',
      state: { type: 'loading' },
    },
  ],
  simulations: [
    storyWait(
      2000,
      /** @param {CcEnvVarLinkedServices[]} components */ ([component]) => {
        component.state = {
          type: 'loaded',
          services: [
            {
              id: 'app_01234567-89ab-cdef-0123-456789abcde0',
              name: 'The mighty maven Java app',
              variables: VARIABLES_FULL,
            },
            {
              id: 'app_01234567-89ab-cdef-0123-456789abcde1',
              name: 'Node.js frontend preprod',
              variables: VARIABLES_FULL,
            },
            {
              id: 'app_01234567-89ab-cdef-0123-456789abcde2',
              name: 'Auth gateway for backend',
              variables: VARIABLES_FULL,
            },
          ],
        };
      },
    ),
  ],
});
