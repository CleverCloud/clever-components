import { expect } from '@open-wc/testing';
import { fixture } from '@open-wc/testing-helpers';
import { html } from 'lit';
import { createDeployment, createInstance } from '../../stories/fixtures/logs-instance.js';
import './cc-logs-app-runtime.js';

/**
 * @import { LogsStreamState } from '../../lib/logs/logs-stream.types.js'
 */

const DEPLOYMENT = createDeployment('SUCCEEDED', 2);
const INSTANCES = [
  createInstance(DEPLOYMENT, 0, 'RUN', 'UP', 'Curly honchkrow'),
  createInstance(DEPLOYMENT, 1, 'RUN', 'UP', 'Rapid combee'),
];

/**
 * @param {LogsStreamState} streamState
 */
async function renderWithOneInstanceSelected(streamState) {
  return fixture(html`
    <cc-logs-app-runtime-beta
      .state=${{ type: 'loaded', streamState, instances: INSTANCES, selection: [INSTANCES[0].id] }}
    ></cc-logs-app-runtime-beta>
  `);
}

/**
 * @param {HTMLElement} element
 */
function getMetadataFilter(element) {
  return element.shadowRoot.querySelector('cc-logs-control-beta').metadataFilter;
}

describe('cc-logs-app-runtime', () => {
  describe('instance selection', () => {
    /** @type {Array<LogsStreamState>} */
    const STREAM_STATES = [
      { type: 'running', progress: { value: 1 }, overflowing: false },
      { type: 'retrying', retryCount: 1, maxRetryCount: 10, progress: { value: 1 }, overflowing: false },
      { type: 'paused', reason: 'user', progress: { value: 1 }, overflowing: false },
    ];

    STREAM_STATES.forEach((streamState) => {
      it(`should filter the logs on the selected instance when ${streamState.type}`, async () => {
        const element = await renderWithOneInstanceSelected(streamState);

        expect(getMetadataFilter(element)).to.eql([{ metadata: 'instanceId', value: INSTANCES[0].id }]);
      });
    });
  });
});
