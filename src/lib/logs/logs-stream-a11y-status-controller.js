import { i18n } from '../../translations/translation.js';

/**
 * @import { ReactiveController, ReactiveControllerHost } from 'lit'
 * @import { LogsStreamState } from './logs-stream.types.js'
 */

/** The stream states that can follow a successful reconnection (see `LogsStream`) */
const RECONNECTED_STATE_TYPES = ['connecting', 'waitingForFirstLog', 'running'];

/** How long a status stays in the live region, so that it can't be read later out of context */
const CLEAR_DELAY = 10_000;

/**
 * This reactive controller computes the status to announce to assistive technologies when the logs stream state changes.
 *
 * Some statuses are about a transition rather than a state (e.g. reconnected after retrying), so the previous state
 * has to be remembered from one update to the next.
 *
 * The host is responsible for rendering `status` inside an element with `aria-live="polite"`.
 * This element must always be rendered, so that screen readers notice its content changes.
 *
 * @implements {ReactiveController}
 */
export class LogsStreamA11yStatusController {
  /**
   * @param {ReactiveControllerHost} host the custom element
   * @param {() => LogsStreamState|null} getStreamState returns the current stream state of the host
   */
  constructor(host, getStreamState) {
    host.addController(this);
    this.host = host;
    this.getStreamState = getStreamState;
    /** @type {string} the status to render in the live region */
    this.status = '';
    /** @type {LogsStreamState|null} */
    this._previousStreamState = null;
    /** @type {ReturnType<typeof setTimeout>|null} */
    this._clearTimeoutId = null;
  }

  hostDisconnected() {
    clearTimeout(this._clearTimeoutId);
    this._previousStreamState = null;
    this.status = '';
  }

  // runs before each render, so setting `status` here does not trigger another update
  hostUpdate() {
    const streamState = this.getStreamState();
    const previousStreamState = this._previousStreamState;
    this._previousStreamState = streamState;

    // the stream state object changes on every progress update: only an actual transition gives a new status
    const newStatus = this._getNewStatus(previousStreamState, streamState);
    if (newStatus != null) {
      this._setStatus(newStatus);
    }
  }

  /**
   * @param {LogsStreamState|null} previousStreamState
   * @param {LogsStreamState|null} streamState
   * @return {string|null} the new status, or `null` if there is nothing new to announce
   */
  _getNewStatus(previousStreamState, streamState) {
    if (streamState?.type === 'retrying') {
      const isNewRetry =
        previousStreamState?.type !== 'retrying' || previousStreamState.retryCount !== streamState.retryCount;
      return isNewRetry
        ? i18n('cc-logs.stream.retrying', {
            retryCount: streamState.retryCount,
            maxRetryCount: streamState.maxRetryCount,
          })
        : null;
    }
    if (previousStreamState?.type === 'retrying' && RECONNECTED_STATE_TYPES.includes(streamState?.type)) {
      return i18n('cc-logs.stream.reconnected');
    }
    return null;
  }

  /**
   * @param {string} status
   */
  _setStatus(status) {
    this.status = status;
    clearTimeout(this._clearTimeoutId);
    this._clearTimeoutId = setTimeout(() => {
      this.status = '';
      this.host.requestUpdate();
    }, CLEAR_DELAY);
  }
}
