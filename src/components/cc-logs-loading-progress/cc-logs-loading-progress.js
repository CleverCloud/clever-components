import { css, html, LitElement } from 'lit';
import { iconRemixPauseLine, iconRemixPlayLine } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('./cc-logs-loading-progress.types.js').LogsLoadingProgressState} LogsLoadingProgressState
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component that displays the logs loading progress.
 *
 * @fires {CustomEvent<void>} cc-logs-loading-progress:pause - Fires when the pause button is clicked.
 * @fires {CustomEvent<void>} cc-logs-loading-progress:resume - Fires when the resume button is clicked.
 * @fires {CustomEvent<void>} cc-logs-loading-progress:accept-overflow - Fires when the accept overflow button is clicked.
 * @fires {CustomEvent<void>} cc-logs-loading-progress:discard-overflow - Fires when the discard overflow button is clicked.
 *
 * @beta
 */
export class CcLogsLoadingProgress extends LitElement {
  static get properties() {
    return {
      limit: { type: Number },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {LogsLoadingProgressState} The state of the component */
    this.state = {
      type: 'idle',
    };

    /** @type {number|null} The overflow limit. `null` for no limit. */
    this.limit = 1000;
  }

  /* region Private methods */

  _getLoadingProgressTitle() {
    if (this.state.type === 'idle') {
      return null;
    }

    if (this.state.type === 'completed') {
      return i18n('cc-logs-loading-progress.progress.loaded');
    }

    if (this.state.percent == null) {
      return i18n('cc-logs-loading-progress.progress.loading.live');
    }

    return i18n('cc-logs-loading-progress.progress.loading', { percent: this.state.percent / 100 });
  }

  /* endregion */

  /* region Event handlers */

  _onPause() {
    dispatchCustomEvent(this, 'pause');
  }

  _onResume() {
    dispatchCustomEvent(this, 'resume');
  }

  _onAcceptOverflow() {
    dispatchCustomEvent(this, 'accept-overflow');
  }

  _onDiscardOverflow() {
    dispatchCustomEvent(this, 'discard-overflow');
  }

  /* endregion */

  render() {
    if (this.state.type === 'idle') {
      return null;
    }

    const percent = this.state.type === 'completed' ? 100 : this.state.percent;

    const shouldAskForOverflowDecision = this.state.type === 'overflowLimitReached';
    const shouldDisplayPauseResumeControls =
      !shouldAskForOverflowDecision && (this.state.type === 'running' || this.state.type === 'paused');
    const shouldDisplayOverflowWarning =
      !shouldAskForOverflowDecision &&
      (this.state.type === 'running' || this.state.type === 'paused' || this.state.type === 'completed') &&
      this.state.overflowing;

    const getPlayPauseButton = () => {
      if (!shouldDisplayPauseResumeControls) {
        return null;
      }
      if (this.state.type === 'running') {
        return {
          icon: iconRemixPauseLine,
          a11yName: i18n('cc-logs-loading-progress.progress.pause'),
          onclick: this._onPause,
        };
      }
      if (this.state.type === 'paused') {
        return {
          icon: iconRemixPlayLine,
          a11yName: i18n('cc-logs-loading-progress.progress.resume'),
          onclick: this._onResume,
        };
      }
      return null;
    };

    const playPauseButton = getPlayPauseButton();

    return html`
      <div class="wrapper">
        <div class="heading">
          <div class="title">${this._getLoadingProgressTitle()}</div>

          ${playPauseButton != null
            ? html`
                <cc-button
                  .icon=${playPauseButton.icon}
                  hide-text
                  a11y-name=${playPauseButton.a11yName}
                  @cc-button:click=${playPauseButton.onclick}
                ></cc-button>
              `
            : ''}
        </div>
        ${percent != null
          ? html`
              <div class="progress-bar">
                <div class="progress-bar-track" style="width: ${percent}%;"></div>
              </div>
            `
          : ''}
        <div class="content">
          <div>${i18n('cc-logs-loading-progress.progress.message', { count: this.state.value })}</div>

          ${shouldAskForOverflowDecision
            ? html`
                <cc-notice intent="info" heading="${i18n('cc-logs-loading-progress.progress.overflow.title')}">
                  <div slot="message">
                    ${i18n('cc-logs-loading-progress.progress.overflow.message.almost', { limit: this.limit })}
                    <div class="overflow-control">
                      <cc-button link @cc-button:click=${this._onAcceptOverflow}>
                        ${i18n('cc-logs-loading-progress.progress.overflow.continue')}
                      </cc-button>
                      <cc-button link @cc-button:click=${this._onDiscardOverflow}>
                        ${i18n('cc-logs-loading-progress.progress.overflow.stop')}
                      </cc-button>
                    </div>
                  </div>
                </cc-notice>
              `
            : ''}
          ${shouldDisplayOverflowWarning
            ? html`
                <cc-notice intent="info" no-icon>
                  <div slot="message">
                    ${i18n('cc-logs-loading-progress.progress.overflow.message', { limit: this.limit })}
                  </div>
                </cc-notice>
              `
            : ''}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */
        :host {
          display: block;
        }

        .wrapper {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .heading {
          align-items: center;
          background-color: var(--cc-color-bg-neutral, #eee);
          border-top-left-radius: var(--cc-border-radius-default, 0.25em);
          border-top-right-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          gap: 0.3em;
          max-height: 2em;
          padding: 0.5em;
        }

        .title {
          color: var(--cc-color-text-default, #000);
          flex: 1;
          font-weight: bold;
        }

        .content {
          color: var(--cc-color-text-weak);
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 1em;
        }

        .progress-bar {
          background-color: var(--cc-color-bg-primary-weak);
          height: 0.2em;
          overflow: hidden;
          width: 100%;
        }

        .progress-bar-track {
          background-color: var(--cc-color-bg-primary);
          height: 100%;
        }

        .overflow-control {
          display: flex;
          gap: 1.5em;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-loading-progress-beta', CcLogsLoadingProgress);
