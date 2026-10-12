import { elementUpdated, expect, fixture } from '@open-wc/testing';
import { html } from 'lit';
import { createEventSpy } from '../../../test/helpers/event-helper.js';
import { CcLogsLoadingPauseEvent, CcLogsLoadingResumeEvent } from './cc-logs-loading-progress.events.js';
import './cc-logs-loading-progress.js';

/**
 * @import { LogsLoadingProgressState } from './cc-logs-loading-progress.types.js'
 */

/**
 * @param {LogsLoadingProgressState} state
 */
async function render(state) {
  return fixture(html`<cc-logs-loading-progress-beta .state=${state} limit="1000"></cc-logs-loading-progress-beta>`);
}

/**
 * @param {HTMLElement} element
 */
function getPlayPauseButton(element) {
  return element.shadowRoot.querySelector('cc-button[hide-text]');
}

/**
 * @param {HTMLElement} element
 */
async function clickPlayPauseButton(element) {
  const button = getPlayPauseButton(element);
  await elementUpdated(button);
  // `cc-button` dispatches `cc-click` from its inner native button only
  button.shadowRoot.querySelector('button').click();
}

describe('cc-logs-loading-progress', () => {
  describe('play/pause button', () => {
    /** @type {Array<LogsLoadingProgressState>} */
    const PAUSABLE_STATES = [
      { type: 'running', value: 1, overflowing: false },
      { type: 'retrying', retryCount: 1, maxRetryCount: 10, value: 1, overflowing: false },
    ];

    PAUSABLE_STATES.forEach((state) => {
      it(`should request a pause when ${state.type}`, async () => {
        const element = await render(state);
        const pauseSpy = createEventSpy(element, CcLogsLoadingPauseEvent.TYPE);
        const resumeSpy = createEventSpy(element, CcLogsLoadingResumeEvent.TYPE);

        await clickPlayPauseButton(element);

        expect(getPlayPauseButton(element).a11yName).to.eql('Pause');
        expect(pauseSpy.callCount).to.eql(1);
        expect(resumeSpy.callCount).to.eql(0);
      });
    });

    it('should request a resume when paused', async () => {
      const element = await render({ type: 'paused', value: 1, overflowing: false });
      const pauseSpy = createEventSpy(element, CcLogsLoadingPauseEvent.TYPE);
      const resumeSpy = createEventSpy(element, CcLogsLoadingResumeEvent.TYPE);

      await clickPlayPauseButton(element);

      expect(getPlayPauseButton(element).a11yName).to.eql('Resume');
      expect(resumeSpy.callCount).to.eql(1);
      expect(pauseSpy.callCount).to.eql(0);
    });

    /** @type {Array<LogsLoadingProgressState>} */
    const OTHER_STATES = [
      { type: 'overflowLimitReached', value: 1000 },
      { type: 'completed', value: 1, overflowing: false },
    ];

    OTHER_STATES.forEach((state) => {
      it(`should not be displayed when ${state.type}`, async () => {
        const element = await render(state);

        expect(getPlayPauseButton(element)).to.eql(null);
      });
    });
  });
});
