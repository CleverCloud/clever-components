import './cc-grafana-info.js';
import './cc-grafana-info.smart.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

export default {
  title: '🛠 SaaS/<cc-grafana-info>',
  component: 'cc-grafana-info',
};

const conf = {
  component: 'cc-grafana-info',
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

enhanceStoriesNames({
  defaultStory,
  skeleton,
  errorWithLoading,
  dataLoadedWithDisabled,
  dataLoadedWithEnabled,
  skeletonWithWaitingEnabled,
  skeletonWithWaitingDisabled,
  skeletonWithWaitingReset,
  errorWithLinkGrafanaEnabled,
  simulationsWithLoadingEnable,
  simulationsWithLoadingDisable,
  simulationsWithLoadingError,
  simulationsWithWaitingToEnable,
  simulationsWithWaitingToDisable,
  simulationsWithWaitingToReset,
  simulationsWithErrorEnablingLink,
});
