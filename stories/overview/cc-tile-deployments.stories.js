import '../../components/overview/cc-tile-deployments.js';
import notes from '../../.components-docs/cc-tile-deployments.md';
import { createContainer } from '../lib/dom.js';
import { createDateAgo } from '../atoms/cc-datetime-relative.stories.js';
import { sequence } from '../lib/sequence.js';

function createComponent (deployments) {
  const component = document.createElement('cc-tile-deployments');
  component.style.width = '275px';
  component.style.display = 'inline-grid';
  component.style.marginBottom = '1rem';
  component.style.marginRight = '1rem';
  component.deployments = deployments;
  return component;
}

export default {
  title: '2. Overview|<cc-tile-deployments>',
  parameters: { notes },
};

export const skeleton = () => {
  return createComponent();
};

export const error = () => {
  const component = createComponent();
  component.error = true;
  return component;
};

export const dataLoaded = () => {
  return createContainer([
    'No deployments yet',
    createComponent([]),
    'Started',
    createComponent([
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ seconds: 2 }),
        logsUrl: '/url/to/logs?id=bf697ecf-c6a1-4ff6-9bd8-b296b27a4bb1',
      },
    ]),
    createComponent([
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ minutes: 2 }),
        logsUrl: '/url/to/logs?id=7dba2548-8c9e-4219-ba0a-b386839cb34b',
      },
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ hours: 2 }),
        logsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
      },
    ]),
    createComponent([
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ days: 2 }),
        logsUrl: '/url/to/logs?id=7dba2548-8c9e-4219-ba0a-b386839cb34b',
      },
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ days: 22 }),
        logsUrl: '/url/to/logs?id=fe726a13-345b-46d1-9101-f4f232479122',
      },
    ]),
    'Stopped',
    createComponent([
      {
        state: 'OK',
        action: 'UNDEPLOY',
        date: createDateAgo({ seconds: 3 }),
        logsUrl: '/url/to/logs?id=dcbae659-89af-4bad-b494-c92ba940b284',
      },
    ]),
    createComponent([
      {
        state: 'OK',
        action: 'UNDEPLOY',
        date: createDateAgo({ minutes: 3 }),
        logsUrl: '/url/to/logs?id=d86c59eb-74a7-4687-8fdd-993a1612ff55',
      },
      {
        state: 'OK',
        action: 'UNDEPLOY',
        date: createDateAgo({ hours: 3 }),
        logsUrl: '/url/to/logs?id=bba01a2c-cb96-48d2-b23d-24a8fd6ce868',
      },
    ]),
    createComponent([
      {
        state: 'OK',
        action: 'UNDEPLOY',
        date: createDateAgo({ days: 3 }),
        logsUrl: '/url/to/logs?id=d86c59eb-74a7-4687-8fdd-993a1612ff55',
      },
      {
        state: 'OK',
        action: 'UNDEPLOY',
        date: createDateAgo({ days: 33 }),
        logsUrl: '/url/to/logs?id=bba01a2c-cb96-48d2-b23d-24a8fd6ce868',
      },
    ]),
    'Failed',
    createComponent([
      {
        state: 'FAIL',
        action: 'DEPLOY',
        date: createDateAgo({ seconds: 4 }),
        logsUrl: '/url/to/logs?id=5b0afb71-ffc2-4bde-82a4-e8851eeffb53',
      },
    ]),
    createComponent([
      {
        state: 'FAIL',
        action: 'DEPLOY',
        date: createDateAgo({ minutes: 4 }),
        logsUrl: '/url/to/logs?id=1f424e9a-0595-4e56-8eda-716159096e4e',
      },
      {
        state: 'FAIL',
        action: 'DEPLOY',
        date: createDateAgo({ hours: 4 }),
        logsUrl: '/url/to/logs?id=a51c343d-140c-4991-aa8b-eead0035be7e',
      },
    ]),
    createComponent([
      {
        state: 'FAIL',
        action: 'DEPLOY',
        date: createDateAgo({ days: 4 }),
        logsUrl: '/url/to/logs?id=1f424e9a-0595-4e56-8eda-716159096e4e',
      },
      {
        state: 'FAIL',
        action: 'DEPLOY',
        date: createDateAgo({ days: 44 }),
        logsUrl: '/url/to/logs?id=a51c343d-140c-4991-aa8b-eead0035be7e',
      },
    ]),
    'Cancelled',
    createComponent([
      {
        state: 'CANCELLED',
        action: 'DEPLOY',
        date: createDateAgo({ seconds: 5 }),
        logsUrl: '/url/to/logs?id=b0f319bf-6ee2-4f03-b327-0af6fef9e603',
      },
    ]),
    createComponent([
      {
        state: 'CANCELLED',
        action: 'DEPLOY',
        date: createDateAgo({ minutes: 5 }),
        logsUrl: '/url/to/logs?id=0da20587-bb5c-4605-9558-055ae92b940b',
      },
      {
        state: 'CANCELLED',
        action: 'DEPLOY',
        date: createDateAgo({ hours: 5 }),
        logsUrl: '/url/to/logs?id=bec6db51-b52f-4fe9-a426-8ddad8ac5801',
      },
    ]),
    createComponent([
      {
        state: 'CANCELLED',
        action: 'DEPLOY',
        date: createDateAgo({ days: 5 }),
        logsUrl: '/url/to/logs?id=0da20587-bb5c-4605-9558-055ae92b940b',
      },
      {
        state: 'CANCELLED',
        action: 'DEPLOY',
        date: createDateAgo({ days: 55 }),
        logsUrl: '/url/to/logs?id=bec6db51-b52f-4fe9-a426-8ddad8ac5801',
      },
    ]),
  ]);
};

export const simulations = () => {
  const errorComponent = createComponent();
  const component = createComponent();

  sequence(async wait => {
    await wait(2000);
    errorComponent.error = true;
    component.deployments = [
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ hours: 2 }),
        logsUrl: '/url/to/logs?id=83ad61b7-d1b3-4632-aab9-9997e02d118d',
      },
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ days: 2 }),
        logsUrl: '/url/to/logs?id=cfb6679b-0a5b-47c0-8bb2-27fda21a54be',
      },
    ];
    await wait(2000);
    component.deployments = [
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ seconds: 2 }),
        logsUrl: '/url/to/logs?id=53f4076d-709c-402c-a901-5337e660ef4e',
      },
      {
        state: 'OK',
        action: 'DEPLOY',
        date: createDateAgo({ hours: 2 }),
        logsUrl: '/url/to/logs?id=83ad61b7-d1b3-4632-aab9-9997e02d118d',
      },
    ];
  });

  return createContainer([
    'Loading, then error',
    errorComponent,
    'Loading, then some data',
    component,
  ]);
};

