import '../../src/tcp-redirections/cc-tcp-redirection-form.js';
import '../../src/tcp-redirections/cc-tcp-redirection-form.smart.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 TCP Redirections/<cc-tcp-redirection-form>',
  component: 'cc-tcp-redirection-form',
};

const conf = {
  component: 'cc-tcp-redirection-form',
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

export const dataLoadedWithContextAdmin = makeStory(conf, {
  docs: 'When `context="admin"` is used, the component description is hidden, the block is collapsed and a redirection counter bubble is be displayed.',
  items: [
    {
      redirections: [
        { namespace: 'default', sourcePort: 5220 },
        { namespace: 'cleverapps' },
        { namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
      context: 'admin',
    },
  ],
});

export const dataLoadedWithContextAdminAndNoRedirections = makeStory(conf, {
  docs: 'When `context="admin"` is used, the counter bubble is not displayed if there is no redirection.',
  items: [
    {
      redirections: [
        { namespace: 'default' },
        { namespace: 'cleverapps' },
        { namespace: 'customer-name', private: true },
      ],
      context: 'admin',
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
    storyWait(1500, ([component, componentError]) => {
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
  dataLoadedWithContextAdmin,
  dataLoadedWithContextAdminAndNoRedirections,
  dataLoadedWithCreatingRedirection,
  dataLoadedWithDeletingRedirection,
  dataLoadedWithManyNamespaces,
  simulation,
});
