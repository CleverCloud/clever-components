import { expect } from '@open-wc/testing';
import { LogsStreamA11yStatusController } from '../../src/lib/logs/logs-stream-a11y-status-controller.js';

/**
 * @import { LogsStreamState } from '../../src/lib/logs/logs-stream.types.js'
 */

const PROGRESS = { value: 1 };

/**
 * @param {number} retryCount
 * @return {LogsStreamState}
 */
function retrying(retryCount) {
  return { type: 'retrying', retryCount, maxRetryCount: 10, progress: PROGRESS, overflowing: false };
}

/** @type {LogsStreamState} */
const RUNNING = { type: 'running', progress: PROGRESS, overflowing: false };

/**
 * Collects every status the controller sets, in order.
 *
 * @param {Array<LogsStreamState>} streamStates
 * @return {Array<string>}
 */
function getStatuses(streamStates) {
  /** @type {LogsStreamState} */
  let streamState = null;
  const host = { addController() {}, requestUpdate() {} };
  // @ts-expect-error the fake host only implements what the controller uses
  const controller = new LogsStreamA11yStatusController(host, () => streamState);
  const statuses = [];
  let previousStatus = controller.status;
  streamStates.forEach((state) => {
    streamState = state;
    controller.hostUpdate();
    if (controller.status !== previousStatus) {
      statuses.push(controller.status);
      previousStatus = controller.status;
    }
  });
  // cancels the pending clear
  controller.hostDisconnected();
  return statuses;
}

describe('LogsStreamA11yStatusController', () => {
  it('should not announce anything without retry', () => {
    const statuses = getStatuses([{ type: 'idle' }, { type: 'connecting' }, RUNNING, { ...RUNNING }]);

    expect(statuses).to.eql([]);
  });

  it('should announce each retry once', () => {
    const statuses = getStatuses([RUNNING, retrying(1), retrying(1), retrying(2)]);

    expect(statuses).to.eql([
      'Connection to the logs stream lost, reconnecting (attempt 1 of 10)',
      'Connection to the logs stream lost, reconnecting (attempt 2 of 10)',
    ]);
  });

  [{ type: 'connecting' }, { type: 'waitingForFirstLog' }, RUNNING].forEach(
    (/** @type {LogsStreamState} */ reconnectedState) => {
      it(`should announce the reconnection when going from retrying to ${reconnectedState.type}`, () => {
        const statuses = getStatuses([RUNNING, retrying(1), reconnectedState, { ...reconnectedState }]);

        expect(statuses).to.eql([
          'Connection to the logs stream lost, reconnecting (attempt 1 of 10)',
          'Reconnected to the logs stream',
        ]);
      });
    },
  );

  [
    { type: 'paused', reason: 'user', progress: PROGRESS, overflowing: false },
    { type: 'error' },
    { type: 'idle' },
  ].forEach((/** @type {LogsStreamState} */ otherState) => {
    it(`should not announce a reconnection when going from retrying to ${otherState.type}`, () => {
      const statuses = getStatuses([RUNNING, retrying(1), otherState]);

      expect(statuses).to.eql(['Connection to the logs stream lost, reconnecting (attempt 1 of 10)']);
    });
  });

  it('should announce a new retry after a reconnection', () => {
    const statuses = getStatuses([RUNNING, retrying(1), RUNNING, retrying(1)]);

    expect(statuses).to.eql([
      'Connection to the logs stream lost, reconnecting (attempt 1 of 10)',
      'Reconnected to the logs stream',
      'Connection to the logs stream lost, reconnecting (attempt 1 of 10)',
    ]);
  });
});
