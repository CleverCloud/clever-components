import { last, random, sleep, treeFind } from '../utils/utils.js';
import '../../src/components/cc-logs-deployment/cc-logs-deployment-event-based.js';
import '../../src/components/cc-button/cc-button.js';
/**
 * @type {Array<ScenarioEntry>}
 */
const scenario = [
  {
    step: 'prepare',
    phase: 'start',
  },
  {
    step: 'prepare/startInstance',
    phase: 'start',
  },
  {
    step: 'prepare/startInstance',
    phase: 'end',
    code: 'SUCCESS',
  },
  {
    step: 'prepare/injectEnvVar',
    phase: 'start',
  },
  {
    step: 'prepare/injectEnvVar',
    phase: 'end',
    code: 'SUCCESS',
  },
  {
    step: 'prepare/retrieveBuildArchive',
    phase: 'start',
  },
  {
    step: 'prepare/retrieveBuildArchive',
    phase: 'info',
    code: 'BUILD_ARCHIVE_FOUND',
    args: {
      commit: 'e5d6d52',
    },
  },
  {
    step: 'prepare/retrieveBuildArchive/downloadBuildArchive',
    phase: 'start',
  },
  {
    step: 'prepare/retrieveBuildArchive/downloadBuildArchive',
    phase: 'end',
    code: 'ERROR',
  },
  {
    step: 'prepare/retrieveBuildArchive',
    phase: 'end',
    code: 'ERROR',
  },
  {
    step: 'prepare',
    phase: 'end',
    code: 'ERROR',
  },
];

/**
 *
 * @param {Array<ScenarioEntry>} scenario
 * @param {(DeploymentEvent) => void} onEvent
 * @return {Promise<void>}
 */
async function playScenario (scenario, onEvent) {
  for (const e of scenario) {
    /** @type {DeploymentEvent} */
    const event = {
      applicationId: 'applicationId',
      deploymentId: 'deploymentId',
      instanceId: 'instanceId',
      instanceType: 'run',
      timestamp: new Date().getTime(),
      ...e,
    };
    onEvent(event);
    if (e.phase === 'start' || e.phase === 'info') {
      await sleep(random(1500, 5000));
    }
  }
}

class Manager {
  constructor (component) {
    /**
     * @type {Array<DeploymentEvent>}
     */
    this.events = [];
    /**
     * @type {CcLogsDeploymentEventBased}
     */
    this.component = component;
  }

  /**
   * @param {DeploymentEvent} event
   */
  addEvent (event) {
    this.events.push(event);

    this.component.nodes = this.toComponentModel();
  }

  /**
   * @return {Array<LogEventNode>}
   */
  toComponentModel () {
    /**
     * @type {Array<LogEventNode>}
     */
    const nodes = [];

    for (const event of this.events) {
      const eventPath = this._parsePath(event.step);

      if (event.phase === 'info') {
        const step = treeFind(nodes, (e) => {
          return e.type === 'step' && e.path === eventPath.path;
        });
        if (step == null) {
          throw new Error(`No step ${eventPath.path} found for adding info.`);
        }
        else {
          if (step.endEvent != null) {
            console.warn('Adding info to an already ended step');
          }

          step.children.push({
            name: eventPath.last,
            path: eventPath.path,
            level: eventPath.level + 1,
            type: 'info',
            event: event,
          });
        }
      }
      else if (event.phase === 'end') {
        const step = treeFind(nodes, (e) => {
          return e.type === 'step' && e.path === eventPath.path;
        });
        if (step == null) {
          throw new Error(`No step ${eventPath.path} found for ending it.`);
        }
        else {
          step.endEvent = event;
        }
      }
      else if (event.phase === 'start') {
        const step = treeFind(nodes, (e) => {
          return e.type === 'step' && e.path === eventPath.path;
        });
        if (step != null) {
          throw new Error(`Step ${eventPath.path} already started.`);
        }
        else {
          /**
           * @type {StepNode}
           */
          const step = {
            name: eventPath.last,
            path: eventPath.path,
            level: eventPath.level,
            type: 'step',
            startEvent: event,
            children: [],
          };

          if (eventPath.level === 0) {
            nodes.push(step);
          }
          else {
            /**
             * @type {StepNode|null}
             */
            const parentStep = treeFind(nodes, (e) => {
              return e.type === 'step' && e.path === eventPath.parent;
            });
            if (parentStep == null) {
              throw new Error(`No step ${eventPath.parent} found for adding inner step.`);
            }
            if (parentStep.endEvent != null) {
              console.warn('Adding inner step to an already ended step');
            }
            parentStep.children.push(step);
          }
        }
      }
    }

    return nodes;
  }

  _parsePath (fullPath) {
    const split = fullPath.split('/');
    const level = split.length - 1;
    return {
      last: last(split),
      path: fullPath,
      level: level,
      parent: level === 0 ? null : split.slice(0, -1).join('/'),
    };
  }
}

const manager = new Manager(document.querySelector('cc-logs-deployment-event-based'));

// -- ctrl ------
const ctrl = document.querySelector('.ctrl');
const select = document.querySelector('cc-select');

ctrl.addEventListener('cc-button:click', (e) => {
  const button = e.target;
  if (!button.matches('cc-button')) {
    return;
  }

  if (button.dataset.action === 'start') {
    playScenario(scenario, (e) => {
      manager.addEvent(e);
    }).then();
  }
});
