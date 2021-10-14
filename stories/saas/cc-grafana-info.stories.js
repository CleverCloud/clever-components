import '../../src/saas/cc-grafana-info.js';
import { makeStory, storyWait } from '../lib/make-story.js';
import { enhanceStoriesNames } from '../lib/story-names.js';

export default {
  title: '🛠 SaaS/<cc-grafana-info>',
  component: 'cc-grafana-info',
};

const conf = {
  component: 'cc-grafana-info',
  css: `
    cc-grafana-info {
      margin-bottom: 1rem;
    }
  `,
};

const grafanaLink = 'https://my-grafana.com';

export const defaultStory = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'disabled',
  }],
});

export const skeleton = makeStory(conf, {
  items: [{
    link: grafanaLink,
  }],
});

export const errorWithLinkDoc = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      error: 'link-doc',
    },
  ],
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      error: 'loading',
    },
  ],
});

export const dataLoadedWithDisabled = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'disabled',
  }],
});

export const dataLoadedWithEnabled = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'enabled',
  }],
});

export const skeletonWithWaitingEnabled = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'enabled',
    waiting: 'disabling',
  }],
});

export const skeletonWithWaitingDisabled = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'disabled',
    waiting: 'enabling',
  }],
});

export const skeletonWithWaitingReset = makeStory(conf, {
  items: [{
    link: grafanaLink,
    status: 'enabled',
    waiting: 'resetting',
  }],
});

export const errorWithEnabling = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'disabled',
      error: 'enabling',
    },
  ],
});

export const errorWithDisabling = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
      error: 'disabling',
    },
  ],
});

export const errorWithResetting = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
      error: 'resetting',
    },
  ],
});

export const errorWithLinkGrafanaEnabled = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
      error: 'link-grafana',
    },
  ],
});

export const simulationsWithLoadingEnable = makeStory(conf, {
  items: [
    {
      link: null,
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.link = grafanaLink;
      component.status = 'enabled';
    }),
  ],
});

export const simulationsWithLoadingDisable = makeStory(conf, {
  items: [
    {
      link: null,
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.status = 'disabled';
    }),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  items: [
    {
      link: null,
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.error = 'loading';
    }),
  ],
});

export const simulationsWithWaitingToEnable = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'disabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'enabling';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.status = 'enabled';
    }),
  ],
});

export const simulationsWithWaitingToDisable = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'disabling';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.status = 'disabled';
    }),
  ],
});

export const simulationsWithWaitingToReset = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'resetting';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.status = 'enabled';
    }),
  ],
});

export const simulationsWithErrorToEnable = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'disabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'enabling';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.error = 'enabling';
    }),
  ],
});

export const simulationsWithErrorEnablingLink = makeStory(conf, {
  items: [
    {
      link: null,
      status: 'enabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.link = grafanaLink;
      component.error = 'link-grafana';
      component.status = 'enabled';
    }),
  ],
});

export const simulationsWithErrorToDisable = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'disabling';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.error = 'disabling';
    }),
  ],
});

export const simulationsWithErrorToReset = makeStory(conf, {
  items: [
    {
      link: grafanaLink,
      status: 'enabled',
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.waiting = 'resetting';
    }),
    storyWait(2000, ([component]) => {
      component.waiting = false;
      component.error = 'resetting';
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorWithLinkDoc,
  errorWithLoading,
  dataLoadedWithDisabled,
  dataLoadedWithEnabled,
  skeletonWithWaitingEnabled,
  skeletonWithWaitingDisabled,
  skeletonWithWaitingReset,
  errorWithEnabling,
  errorWithDisabling,
  errorWithResetting,
  errorWithLinkGrafanaEnabled,
  simulationsWithLoadingEnable,
  simulationsWithLoadingDisable,
  simulationsWithLoadingError,
  simulationsWithWaitingToEnable,
  simulationsWithWaitingToDisable,
  simulationsWithWaitingToReset,
  simulationsWithErrorToEnable,
  simulationsWithErrorEnablingLink,
  simulationsWithErrorToDisable,
  simulationsWithErrorToReset,
});
