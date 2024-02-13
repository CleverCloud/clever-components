import './cc-logs-instances.js';
import { randomString } from '../../lib/utils.js';
import { makeStory, storyWait } from '../../stories/lib/make-story.js';
import { enhanceStoriesNames } from '../../stories/lib/story-names.js';

/**
 * @typedef {import('./cc-logs-instances.types.js').Instance} Instance
 * @typedef {import('./cc-logs-instances.types.js').Deployment} Deployment
 */

function randomCommit () {
  return randomString(40, 'abcdef0123456789');
}

function randomUUID () {
  const alphabet = '0123456789abcdef';
  return `${randomString(8, alphabet)}-${randomString(4, alphabet)}-4${randomString(3, alphabet)}-${randomString(4, alphabet)}-${randomString(12, alphabet)}`;
}

function getDeploymentDate (sinceDay) {
  return new Date(new Date().getTime() - sinceDay * 24 * 60 * 60 * 1000);
}

export default {
  title: '🚧 Beta/🛠 Logs/<cc-logs-instances-beta>',
  component: 'cc-logs-instances-beta',
};

const conf = {
  component: 'cc-logs-instances-beta',
  beta: true,
  css: `
    cc-logs-instances-beta {
      width: max-content;
      border: 1px solid #aaa;
      max-width: 20em;
      min-width: 15em;
      min-height: 30em;
      max-height: 500px;
    }
  `,
};

/**
 * @type {Instance}
 */
function createInstance (deployment, index, kind, state, name) {
  return {
    id: randomUUID(),
    deployment,
    creationDate: new Date(),
    index,
    kind,
    state,
    name,
  };
}

/**
 * @type {Deployment}
 */
function createDeployment (state, sinceDay) {
  return {
    id: `deployment_${randomUUID()}`,
    state,
    creationDate: getDeploymentDate(sinceDay),
    commitId: randomCommit(),
  };
}

/**
 *
 * @type {{[key: string]: Deployment}}
 */
const DEPLOYMENTS = {
  wip: createDeployment('WORK_IN_PROGRESS', 0),
  ok2: createDeployment('SUCCEEDED', 2),
  ok1: createDeployment('SUCCEEDED', 3),
  cancelled: createDeployment('CANCELLED', 4),
  failed: createDeployment('FAILED', 5),
};

const DEPLOYING = [
  createInstance(DEPLOYMENTS.wip, 0, 'BUILD', 'STOPPING', 'Rich medicham'),
  createInstance(DEPLOYMENTS.wip, 0, 'RUN', 'UP', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.wip, 1, 'RUN', 'READY', 'Long delphox'),
  createInstance(DEPLOYMENTS.wip, 2, 'RUN', 'DEPLOYING', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.wip, 3, 'RUN', 'DELETED', 'Rapid combee'),
];

const RUNNING = [
  createInstance(DEPLOYMENTS.ok1, 0, 'RUN', 'UP', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.ok1, 1, 'RUN', 'UP', 'Long delphox'),
  createInstance(DEPLOYMENTS.ok1, 2, 'RUN', 'UP', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.ok1, 0, 'BUILD', 'DELETED', 'Rich medicham'),
];

const SCALE_DOWN = [
  createInstance(DEPLOYMENTS.ok1, 0, 'RUN', 'UP', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.ok1, 1, 'RUN', 'UP', 'Long delphox'),
  createInstance(DEPLOYMENTS.ok1, 2, 'RUN', 'STOPPING', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.ok1, 0, 'BUILD', 'DELETED', 'Rich medicham'),
];

const SCALE_UP = [
  createInstance(DEPLOYMENTS.wip, 2, 'RUN', 'DEPLOYING', 'Rapid combee'),
  createInstance(DEPLOYMENTS.ok1, 0, 'RUN', 'UP', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.ok1, 1, 'RUN', 'UP', 'Long delphox'),
  createInstance(DEPLOYMENTS.ok1, 2, 'RUN', 'DELETED', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.ok1, 0, 'BUILD', 'DELETED', 'Rich medicham'),
];

const APPLICATION_STOPPED = [
  createInstance(DEPLOYMENTS.ok1, 0, 'RUN', 'DELETED', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.ok1, 1, 'RUN', 'DELETED', 'Long delphox'),
  createInstance(DEPLOYMENTS.ok1, 2, 'RUN', 'DELETED', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.ok2, 2, 'RUN', 'DELETED', 'Rapid combee'),
  createInstance(DEPLOYMENTS.ok1, 0, 'BUILD', 'DELETED', 'Rich medicham'),
];

const FAILED_DEPLOYMENT = [
  createInstance(DEPLOYMENTS.failed, 0, 'RUN', 'DELETED', 'Petite misdreavus'),
  createInstance(DEPLOYMENTS.failed, 1, 'RUN', 'DELETED', 'Happy meowstic-female'),
  createInstance(DEPLOYMENTS.failed, 2, 'RUN', 'DELETED', 'Rapid combee'),
];

const CANCELLED_DEPLOYMENT = [
  createInstance(DEPLOYMENTS.cancelled, 0, 'RUN', 'DELETED', 'Crispy slowking'),
  createInstance(DEPLOYMENTS.cancelled, 1, 'RUN', 'DELETED', 'Glassy delcatty'),
  createInstance(DEPLOYMENTS.cancelled, 2, 'RUN', 'DELETED', 'Excited oshawott'),
];

const ALL_INSTANCES = [
  createInstance(DEPLOYMENTS.wip, 0, 'BUILD', 'STOPPING', 'Proud electrode'),
  createInstance(DEPLOYMENTS.wip, 0, 'RUN', 'UP', 'Difficult claydol'),
  createInstance(DEPLOYMENTS.wip, 1, 'RUN', 'READY', 'Rich medicham'),
  createInstance(DEPLOYMENTS.wip, 2, 'RUN', 'DELETED', 'Rapid combee'),
  createInstance(DEPLOYMENTS.wip, 3, 'RUN', 'BOOTING', 'Excited oshawott'),
  createInstance(DEPLOYMENTS.ok1, 0, 'RUN', 'UP', 'Easy hydreigon'),
  createInstance(DEPLOYMENTS.ok1, 1, 'RUN', 'UP', 'Long delphox'),
  createInstance(DEPLOYMENTS.ok1, 2, 'RUN', 'STOPPING', 'Curly honchkrow'),
  createInstance(DEPLOYMENTS.ok1, 0, 'BUILD', 'DELETED', 'Rich medicham'),
  ...FAILED_DEPLOYMENT,
  ...CANCELLED_DEPLOYMENT,
];

const ALL_INSTANCES_WITH_GHOSTS = [
  ...ALL_INSTANCES,
  { id: randomUUID(), ghost: true },
  { id: randomUUID(), ghost: true },
];

export const defaultStory = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: ALL_INSTANCES } },
  ],
});

export const loading = makeStory(conf, {
  items: [{ state: { state: 'loading' } }],
});

export const error = makeStory(conf, {
  items: [{ state: { state: 'error' } }],
});

export const noInstances = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: [] } },
  ],
});

export const firstDeployment = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: DEPLOYING } },
  ],
});

export const runningInstances = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: RUNNING } },
  ],
});

export const scalingDown = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: SCALE_DOWN } },
  ],
});

export const scalingUp = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: SCALE_UP } },
  ],
});

export const applicationStopped = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: APPLICATION_STOPPED } },
  ],
});

export const failedDeployment = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: FAILED_DEPLOYMENT } },
  ],
});

export const cancelledDeployment = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: CANCELLED_DEPLOYMENT } },
  ],
});

export const withGhostInstances = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: ALL_INSTANCES_WITH_GHOSTS } },
  ],
});

export const coldMode = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: ALL_INSTANCES, mode: 'cold' } },
  ],
});

export const coldModeWithGhostInstances = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: ALL_INSTANCES_WITH_GHOSTS, mode: 'cold' } },
  ],
});

export const coldModeWithoutInstance = makeStory(conf, {
  items: [
    { state: { state: 'loaded', instances: [], mode: 'cold' } },
  ],
});

const SIMULATION_DEPLOYMENT_WIP = createDeployment('WORK_IN_PROGRESS', 0);
const SIMULATION_DEPLOYMENT_OK = { ...SIMULATION_DEPLOYMENT_WIP, state: 'SUCCEEDED' };
const SIMULATION_DEPLOYMENT_WIP_SCALE_UP = createDeployment('WORK_IN_PROGRESS', 0);
const SIMULATION_DEPLOYMENT_OK_SCALE_UP = { ...SIMULATION_DEPLOYMENT_WIP_SCALE_UP, state: 'SUCCEEDED' };

export const simulations = makeStory(conf, {
  items: [{ state: { state: 'loading' } }],
  simulations: [
    storyWait(2000, ([component]) => {

      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'BOOTING', 'Gentle totodile'),
      ];

      component.state = { state: 'loaded', instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'UP', 'Gentle totodile'),
      ];

      component.state = { state: 'loaded', instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'UP', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'RUN', 'DEPLOYING', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 1, 'RUN', 'DEPLOYING', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'STOPPING', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'RUN', 'DEPLOYING', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 1, 'RUN', 'DEPLOYING', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'RUN', 'READY', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 1, 'RUN', 'DEPLOYING', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'RUN', 'READY', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 1, 'RUN', 'READY', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 0, 'RUN', 'UP', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_WIP, 1, 'RUN', 'READY', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'RUN', 'UP', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 1, 'RUN', 'UP', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP_SCALE_UP, 2, 'RUN', 'DEPLOYING', 'Rapid combee'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'RUN', 'UP', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 1, 'RUN', 'UP', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_WIP_SCALE_UP, 2, 'RUN', 'READY', 'Rapid combee'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'RUN', 'UP', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 1, 'RUN', 'UP', 'Crispy slowking'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
    storyWait(2000, ([component]) => {
      const instances = [
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'BUILD', 'DELETED', 'Gentle totodile'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 0, 'RUN', 'UP', 'Clumsy klink'),
        createInstance(SIMULATION_DEPLOYMENT_OK, 1, 'RUN', 'UP', 'Crispy slowking'),
        createInstance(SIMULATION_DEPLOYMENT_OK_SCALE_UP, 2, 'RUN', 'UP', 'Rapid combee'),
      ];
      component.state = { state: 'loaded', instances: instances };
    }),
  ],
});

enhanceStoriesNames({
  defaultStory,
  loading,
  error,
  noInstances,
  firstDeployment,
  runningInstances,
  scalingUp,
  scalingDown,
  applicationStopped,
  failedDeployment,
  cancelledDeployment,
  withGhostInstances,
  coldMode,
  coldModeWithGhostInstances,
  coldModeWithoutInstance,
  simulations,
});
