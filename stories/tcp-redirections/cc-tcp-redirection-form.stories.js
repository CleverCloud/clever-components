import '../../src/tcp-redirections/cc-tcp-redirection-form.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 TCP Redirections|<cc-tcp-redirection-form>',
  component: 'cc-tcp-redirection-form',
};

const conf = {
  component: 'cc-tcp-redirection-form',
  css: `cc-tcp-redirection-form { margin-bottom: 1rem; }`,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps' },
      ],
    },
  ],
});

export const empty = makeStory(conf, {
  items: [{ redirections: [] }],
});

export const loading = makeStory(conf, {
  items: [{}],
});

export const loadingError = makeStory(conf, {
  items: [{ error: true }],
});

export const dataLoaded = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps' },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  ],
});

export const dataLoadedWithCreatingRedirection = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', waiting: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  ],
});

export const dataLoadedWithDeletingRedirection = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', sourcePort: 3821 },
        { namespace: 'customer-name', sourcePort: 6440, waiting: true, private: true },
      ],
    },
  ],
});

export const dataLoadedWithErrorCreatingRedirection = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  ],
});

export const dataLoadedWithErrorDeletingRedirection = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', sourcePort: 3821 },
        { namespace: 'customer-name', sourcePort: 6440, error: true, private: true },
      ],
    },
  ],
});

export const dataLoadedWithManyNamespaces = makeStory(conf, {
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 874 },
        { namespace: 'cleverapps', sourcePort: 12345 },
        { namespace: 'secondary', sourcePort: 99 },
        { namespace: 'customer-name-one', sourcePort: 1234 },
        { namespace: 'customer-name-two', sourcePort: 4321 },
        { namespace: 'customer-name-three' },
        { namespace: 'customer-name-four', sourcePort: 7531 },
        { namespace: 'customer-name-five' },
        { namespace: 'customer-name-six' },
        { namespace: 'customer-name-seven', sourcePort: 3456 },
      ],
    },
  ],
});

export const simulation = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps' },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ];
      componentError.error = true;
    }),
    storyWait(1000, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', waiting: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ];
    }),
    storyWait(1500, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', waiting: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true, waiting: true },
      ];
    }),
    storyWait(1000, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true, waiting: true },
      ];
    }),
    storyWait(500, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true, error: true },
      ];
    }),
    storyWait(3000, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true, waiting: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true, error: true },
      ];
    }),
    storyWait(200, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true, waiting: true },
        { namespace: 'customer-name', sourcePort: 6440, private: true, error: true, waiting: true },
      ];
    }),
    storyWait(2000, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', error: true, waiting: true },
        { namespace: 'customer-name', private: true },
      ];
    }),
    storyWait(500, ([component, componentError]) => {
      component.redirections = [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps', sourcePort: 4242 },
        { namespace: 'customer-name', private: true },
      ];
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  empty,
  loading,
  loadingError,
  dataLoaded,
  dataLoadedWithCreatingRedirection,
  dataLoadedWithDeletingRedirection,
  dataLoadedWithErrorCreatingRedirection,
  dataLoadedWithErrorDeletingRedirection,
  dataLoadedWithManyNamespaces,
  simulation,
});
