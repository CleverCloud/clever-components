import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconRemixInformationFill as iconInfo,
  iconRemixPauseLine,
  iconRemixPlayLine,
  iconRemixAlertFill as iconWarning,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import {
  CcLogsLoadingOverflowAcceptEvent,
  CcLogsLoadingOverflowDiscardEvent,
  CcLogsLoadingPauseEvent,
  CcLogsLoadingResumeEvent,
} from './cc-logs-loading-progress.events.js';

/**
 * @typedef {import('./cc-logs-loading-progress.types.js').LogsLoadingProgressState} LogsLoadingProgressState
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component that displays the logs loading progress.
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

  /**
   * @param {number} value
   * @param {number|null} percent
   */
  _getLoadingProgressMessage(value, percent) {
    if (value === 0) {
      return i18n('cc-logs-loading-progress.progress.none');
    }

    if (percent == null) {
      return i18n('cc-logs-loading-progress.progress.indeterminate', { count: value });
    }

    return i18n('cc-logs-loading-progress.progress.percentage', { count: value, percent: percent / 100 });
  }

  /* endregion */

  /* region Event handlers */

  _onPause() {
    this.dispatchEvent(new CcLogsLoadingPauseEvent());
  }

  _onResume() {
    this.dispatchEvent(new CcLogsLoadingResumeEvent());
  }

  _onAcceptOverflow() {
    this.dispatchEvent(new CcLogsLoadingOverflowAcceptEvent());
  }

  _onDiscardOverflow() {
    this.dispatchEvent(new CcLogsLoadingOverflowDiscardEvent());
  }

  /* endregion */

  render() {
    if (this.state.type === 'idle') {
      return null;
    }

    const percent = this.state.type === 'completed' ? 100 : this.state.percent;

    const shouldAskForOverflowDecision = this.state.type === 'overflowLimitReached';
    const shouldDisplayOverflowWarning =
      (this.state.type === 'running' || this.state.type === 'paused' || this.state.type === 'completed') &&
      this.state.overflowing;

    return html`
      <div class="wrapper ${classMap({ warning: shouldAskForOverflowDecision })}">
        <div class="content inline">
          ${this._renderPlayPauseButton()}
          ${
            shouldAskForOverflowDecision
              ? html`
                  <div class="notice warning">
                    <cc-icon .icon="${iconWarning}" a11y-name="${i18n('cc-notice.icon-alt.warning')}"></cc-icon>
                    <div class="notice-message">
                      <div>${i18n('cc-logs-loading-progress.overflow.warning', { limit: this.limit })}</div>
                      <div class="overflow-buttons">
                        <cc-button link @cc-click=${this._onAcceptOverflow}>
                          ${i18n('cc-logs-loading-progress.overflow.accept')}
                        </cc-button>
                        <cc-button link @cc-click=${this._onDiscardOverflow}>
                          ${i18n('cc-logs-loading-progress.overflow.discard')}
                        </cc-button>
                      </div>
                    </div>
                  </div>
                `
              : ''
          }
          ${
            !shouldAskForOverflowDecision
              ? html`<div class="loading-progress-message">
                  ${this._getLoadingProgressMessage(this.state.value, percent)}
                </div>`
              : ''
          }
          ${
            shouldDisplayOverflowWarning
              ? html`
                  <div class="notice info">
                    <cc-icon .icon="${iconInfo}" a11y-name="${i18n('cc-notice.icon-alt.info')}"></cc-icon>
                    <div class="notice-message">
                      ${i18n('cc-logs-loading-progress.overflow.info', { limit: this.limit })}
                    </div>
                  </div>
                `
              : ''
          }
        </div>
        ${
          percent != null
            ? html`
                <div class="progress-bar">
                  <div class="progress-bar-track" style="width: ${percent}%;"></div>
                </div>
              `
            : ''
        }
      </div>
    </div>`;
  }

  _renderPlayPauseButton() {
    const running = this.state.type === 'running';
    const paused = this.state.type === 'paused';

    if (!running && !paused) {
      return null;
    }

    return html`
      <cc-button
        .icon=${running ? iconRemixPauseLine : iconRemixPlayLine}
        hide-text
        a11y-name=${running
          ? i18n('cc-logs-loading-progress.control.pause')
          : i18n('cc-logs-loading-progress.control.resume')}
        @cc-click=${running ? this._onPause : this._onResume}
      ></cc-button>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .wrapper.warning {
          background-color: var(--cc-color-bg-warning-weaker);
          border: 1px solid var(--cc-color-border-warning-weak);
        }

        .content {
          align-items: center;
          color: var(--cc-color-text-weak);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          height: 1.75em;
          padding: 0.5em;
        }

        .overflow-buttons {
          display: flex;
          gap: 0.5em;
        }

        .loading-progress-message {
          flex: 1;
        }

        .notice {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .notice-message {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .notice cc-icon {
          min-height: 1.5em;
          min-width: 1.5em;
        }

        .notice.info cc-icon {
          --cc-icon-color: var(--cc-color-text-primary);
        }

        .notice.warning cc-icon {
          --cc-icon-color: var(--cc-color-text-warning);
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
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-logs-loading-progress-beta', CcLogsLoadingProgress);
