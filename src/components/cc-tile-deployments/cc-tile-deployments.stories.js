import './cc-tile-deployments.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';

import { createDateAgo } from '../cc-datetime-relative/cc-datetime-relative.stories.js';

function deploymentInfo (state, action, dateAgoParams, uuid) {
  return {
    state,
    action,
    date: createDateAgo(dateAgoParams),
    logsUrl: `/url/to/logs?id=${uuid}`,
  };
}

export default {
  tags: ['autodocs'],
  title: '🛠 Overview/<cc-tile-deployments>',
  component: 'cc-tile-deployments',
};

const conf = {
  component: 'cc-tile-deployments',
  displayMode: 'flex-wrap',
  // language=CSS
  css: `
    cc-tile-deployments {
      width: 275px;
    }
  `,
};

export const defaultStory = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { minutes: 2 }, '7dba2548-8c9e-4219-ba0a-b386839cb34b'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { minutes: 2 }, '7dba2548-8c9e-4219-ba0a-b386839cb34b'),
          deploymentInfo('OK', 'UNDEPLOY', { hours: 3 }, 'bba01a2c-cb96-48d2-b23d-24a8fd6ce868'),
        ],
      },
    },
  ],
});

export const skeleton = makeStory(conf, {
  items: [{ state: { type: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { type: 'error' } }],
});

export const empty = makeStory(conf, {
  items: [{ state: { type: 'loaded', deploymentsInfo: [] } }],
});

export const dataLoadedWithStarted = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { seconds: 2 }, 'bf697ecf-c6a1-4ff6-9bd8-b296b27a4bb1'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { minutes: 2 }, '7dba2548-8c9e-4219-ba0a-b386839cb34b'),
          deploymentInfo('OK', 'DEPLOY', { hours: 2 }, 'fe726a13-345b-46d1-9101-f4f232479122'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { days: 2 }, '7dba2548-8c9e-4219-ba0a-b386839cb34b'),
          deploymentInfo('OK', 'DEPLOY', { days: 22 }, 'fe726a13-345b-46d1-9101-f4f232479122'),
        ],
      },
    },
  ],
});

export const dataLoadedWithStopped = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'UNDEPLOY', { seconds: 3 }, 'dcbae659-89af-4bad-b494-c92ba940b284'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'UNDEPLOY', { minutes: 3 }, 'd86c59eb-74a7-4687-8fdd-993a1612ff55'),
          deploymentInfo('OK', 'UNDEPLOY', { hours: 3 }, 'bba01a2c-cb96-48d2-b23d-24a8fd6ce868'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'UNDEPLOY', { days: 3 }, 'd86c59eb-74a7-4687-8fdd-993a1612ff55'),
          deploymentInfo('OK', 'UNDEPLOY', { days: 33 }, 'bba01a2c-cb96-48d2-b23d-24a8fd6ce868'),
        ],
      },
    },
  ],
});

export const dataLoadedWithFailed = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('FAIL', 'DEPLOY', { seconds: 4 }, '5b0afb71-ffc2-4bde-82a4-e8851eeffb53'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('FAIL', 'DEPLOY', { minutes: 4 }, '1f424e9a-0595-4e56-8eda-716159096e4e'),
          deploymentInfo('FAIL', 'DEPLOY', { hours: 4 }, 'a51c343d-140c-4991-aa8b-eead0035be7e'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('FAIL', 'DEPLOY', { days: 4 }, '1f424e9a-0595-4e56-8eda-716159096e4e'),
          deploymentInfo('FAIL', 'DEPLOY', { days: 44 }, 'a51c343d-140c-4991-aa8b-eead0035be7e'),
        ],
      },
    },
  ],
});

export const dataLoadedWithCancelled = makeStory(conf, {
  items: [
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('CANCELLED', 'DEPLOY', { seconds: 5 }, 'b0f319bf-6ee2-4f03-b327-0af6fef9e603'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('CANCELLED', 'DEPLOY', { minutes: 5 }, '0da20587-bb5c-4605-9558-055ae92b940b'),
          deploymentInfo('CANCELLED', 'DEPLOY', { hours: 5 }, 'bec6db51-b52f-4fe9-a426-8ddad8ac5801'),
        ],
      },
    },
    {
      state: {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('CANCELLED', 'DEPLOY', { days: 5 }, '0da20587-bb5c-4605-9558-055ae92b940b'),
          deploymentInfo('CANCELLED', 'DEPLOY', { days: 55 }, 'bec6db51-b52f-4fe9-a426-8ddad8ac5801'),
        ],
      },
    },
  ],
});

export const simulations = makeStory(conf, {
  items: [{}, {}],
  simulations: [
    storyWait(2000, ([component, componentError]) => {
      component.state = {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { hours: 2 }, '83ad61b7-d1b3-4632-aab9-9997e02d118d'),
          deploymentInfo('OK', 'DEPLOY', { days: 2 }, 'cfb6679b-0a5b-47c0-8bb2-27fda21a54be'),
        ],
      };
      componentError.state = { type: 'error' };
    }),
    storyWait(2000, ([component]) => {
      component.state = {
        type: 'loaded',
        deploymentsInfo: [
          deploymentInfo('OK', 'DEPLOY', { seconds: 2 }, '53f4076d-709c-402c-a901-5337e660ef4e'),
          deploymentInfo('OK', 'DEPLOY', { hours: 2 }, '83ad61b7-d1b3-4632-aab9-9997e02d118d'),
        ],
      };
    }),
  ],
});
