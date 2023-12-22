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
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'disabled',
        },
      },
    },
  ],
});

export const loading = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loading',
      },
    },
  ],
});

export const errorWithLoading = makeStory(conf, {
  items: [
    {
      state: {
        type: 'error',
      },
    },
  ],
});

export const errorWithEnabledAndNoGrafanaLink = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
        },
      },
    },
  ],
});

export const dataLoadedWithDisabled = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'disabled',
        },
      },
    },
  ],
});

export const dataLoadedWithEnabled = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      },
    },
  ],
});

export const waitingWithEnabledAndDisabling = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
          action: 'disabling',
        },
      },
    },
  ],
});

export const waitingWithDisabledAndEnabling = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'disabled',
          action: 'enabling',
        },
      },
    },
  ],
});

export const waitingWithEnabledAndResetting = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
          action: 'resetting',
        },
      },
    },
  ],
});

export const simulationsWithLoadingEnable = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      };
    }),
  ],
});

export const simulationsWithLoadingDisable = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'disabled',
        },
      };
    }),
  ],
});

export const simulationsWithLoadingError = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'error',
      };
    }),
  ],
});

export const simulationsWithWaitingToEnable = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'disabled',
        },
      },
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'disabled',
          action: 'enabling',
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      };
    }),
  ],
});

export const simulationsWithWaitingToDisable = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      },
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
          action: 'disabling',
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'disabled',
        },
      };
    }),
  ],
});

export const simulationsWithWaitingToReset = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      },
    },
  ],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
          action: 'resetting',
        },
      };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
          link: grafanaLink,
        },
      };
    }),
  ],
});

export const simulationsWithErrorEnablingLink = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
  simulations: [
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        info: {
          status: 'enabled',
        },
      };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  errorWithLoading,
  errorWithEnabledAndNoGrafanaLink,
  dataLoadedWithDisabled,
  dataLoadedWithEnabled,
  waitingWithEnabledAndDisabling,
  waitingWithDisabledAndEnabling,
  waitingWithEnabledAndResetting,
  simulationsWithLoadingEnable,
  simulationsWithLoadingDisable,
  simulationsWithLoadingError,
  simulationsWithWaitingToEnable,
  simulationsWithWaitingToDisable,
  simulationsWithWaitingToReset,
  simulationsWithErrorEnablingLink,
});
