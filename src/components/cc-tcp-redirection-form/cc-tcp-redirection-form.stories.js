import './cc-tcp-redirection-form.js';
import './cc-tcp-redirection-form.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 TCP Redirections/<cc-tcp-redirection-form>',
  component: 'cc-tcp-redirection-form',
};

const conf = {
  component: 'cc-tcp-redirection-form',
};

export const defaultStory = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 5220 },
        { state: 'loaded', namespace: 'cleverapps' },
      ],
    },
  }],
});

export const empty = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [],
    },
  }],
});

export const loading = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loading',
    },
  }],
});

export const loadingError = makeStory(conf, {
  items: [{
    redirections: {
      state: 'error-loading',
    },
  }],
});

export const dataLoaded = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 5220 },
        { state: 'loaded', namespace: 'cleverapps' },
        { state: 'loaded', namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  }],
});

export const dataLoadedWithContextAdmin = makeStory(conf, {
  docs: 'When `context="admin"` is used, the component description is hidden, the block is collapsed and a redirection counter bubble is be displayed.',
  items: [{
    context: 'admin',
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 5220 },
        { state: 'loaded', namespace: 'cleverapps' },
        { state: 'loaded', namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  }],
});

export const dataLoadedWithContextAdminAndNoRedirections = makeStory(conf, {
  docs: 'When `context="admin"` is used, the counter bubble is not displayed if there is no redirection.',
  items: [{
    context: 'admin',
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default' },
        { state: 'loaded', namespace: 'cleverapps' },
        { state: 'loaded', namespace: 'customer-name', private: true },
      ],
    },
  }],
});

export const dataLoadedWithCreatingRedirection = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 5220 },
        { state: 'waiting', namespace: 'cleverapps' },
        { state: 'loaded', namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  }],
});

export const dataLoadedWithDeletingRedirection = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 5220 },
        { state: 'loaded', namespace: 'cleverapps' },
        { state: 'waiting', namespace: 'customer-name', sourcePort: 6440, private: true },
      ],
    },
  }],
});

export const dataLoadedWithManyNamespaces = makeStory(conf, {
  items: [{
    redirections: {
      state: 'loaded',
      value: [
        { state: 'loaded', namespace: 'default', sourcePort: 874 },
        { state: 'loaded', namespace: 'cleverapps', sourcePort: 12345 },
        { state: 'loaded', namespace: 'secondary', sourcePort: 99 },
        { state: 'loaded', namespace: 'customer-name-one', sourcePort: 1234 },
        { state: 'loaded', namespace: 'customer-name-two', sourcePort: 4321 },
        { state: 'loaded', namespace: 'customer-name-three' },
        { state: 'loaded', namespace: 'customer-name-four', sourcePort: 7531 },
        { state: 'loaded', namespace: 'customer-name-five' },
        { state: 'loaded', namespace: 'customer-name-six' },
        { state: 'loaded', namespace: 'customer-name-seven', sourcePort: 3456 },
      ],
    },
  }],
});

export const simulation = makeStory(conf, {
  items: [
    { state: 'loading' },
    { state: 'loading' },
  ],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.redirections = {
        state: 'loaded',
        value: [
          { state: 'loaded', namespace: 'default', sourcePort: 5220 },
          { state: 'loaded', namespace: 'cleverapps' },
          { state: 'loaded', namespace: 'customer-name', sourcePort: 6440, private: true },
        ],
      };
      componentError.error = true;
    }),
    storyWait(1000, ([component, componentError]) => {
      component.redirections = {
        state: 'loaded',
        value: [
          { state: 'loaded', namespace: 'default', sourcePort: 5220 },
          { state: 'waiting', namespace: 'cleverapps' },
          { state: 'loaded', namespace: 'customer-name', sourcePort: 6440, private: true },
        ],
      };
    }),
    storyWait(1500, ([component, componentError]) => {
      component.redirections = {
        state: 'loaded',
        value: [
          { state: 'loaded', namespace: 'default', sourcePort: 5220 },
          { state: 'waiting', namespace: 'cleverapps' },
          { state: 'waiting', namespace: 'customer-name', sourcePort: 6440, private: true },
        ],
      };
    }),
    storyWait(1500, ([component, componentError]) => {
      component.redirections = {
        state: 'loaded',
        value: [
          { state: 'loaded', namespace: 'default', sourcePort: 5220 },
          { state: 'loaded', namespace: 'cleverapps', sourcePort: 4242 },
          { state: 'loaded', namespace: 'customer-name', private: true },
        ],
      };
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
