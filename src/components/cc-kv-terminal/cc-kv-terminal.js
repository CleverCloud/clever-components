import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixHashtag as iconShellPrompt, iconRemixAlertFill as iconWarning } from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { isStringBlank, isStringEmpty } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-icon/cc-icon.js';

/**
 * @typedef {import('./cc-kv-terminal.types.d.ts').CcKvTerminalState} CcKvTerminalState
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<KeyboardEvent,HTMLInputElement>} HTMLInputKeyboardEvent
 * @typedef {import('lit').PropertyValues<CcKvTerminal>} CcKvTerminalPropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLInputElement>} HTMLInputElementRef
 */

/**
 * A component displaying a terminal to interact with KV database.
 *
 * The history of commands is kept in memory and users can navigate through history using arrow keys.
 *
 * The `clear` command will clear the terminal (but not the history of commands).
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<CcKvTerminalState>} cc-kv-terminal:state-change - Fires whenever the state change internally
 * @fires {CustomEvent<string>} cc-kv-terminal:send-command - Fires whenever a command is validated
 *
 * @cssprop {Color} --cc-kv-terminal-color-background - The background color
 * @cssprop {Color} --cc-kv-terminal-color-foreground - The foreground color
 * @cssprop {Color} --cc-kv-terminal-color-foreground-success - The foreground color of the result when command succeeded
 * @cssprop {Color} --cc-kv-terminal-color-foreground-error - The foreground color of the result when command failed
 */
export class CcKvTerminal extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();
    /** @type {CcKvTerminalState} - The state of the component */
    this.state = { type: 'idle', history: [] };

    /** @type {Array<string>} */
    this._cmdHistory = [];

    /** @type {number|null} */
    this._cmdHistoryIndex = null;

    /** @type {HTMLInputElementRef} */
    this._promptRef = createRef();
  }

  /**
   * @param {string} command
   */
  _pushCommandToHistory(command) {
    if (this._cmdHistory.length === 0 || this._cmdHistory[this._cmdHistory.length - 1] !== command) {
      this._cmdHistory.push(command);
    }
  }

  /**
   * @param {HTMLInputKeyboardEvent} e
   */
  _onShellPromptKeyDown(e) {
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      this._cmdHistoryIndex = null;
      const commandLine = e.target.value.trim();

      if (isStringBlank(commandLine)) {
        this.state = {
          ...this.state,
          history: [...this.state.history, { commandLine, result: [], success: true }],
        };
        dispatchCustomEvent(this, 'state-change', this.state);
        e.target.value = '';
      } else if (commandLine.toLowerCase() === 'clear') {
        this._pushCommandToHistory('clear');
        this.state = {
          ...this.state,
          history: [],
        };
        dispatchCustomEvent(this, 'state-change', this.state);
        e.target.value = '';
      } else {
        this._pushCommandToHistory(commandLine);
        dispatchCustomEvent(this, 'send-command', commandLine);
        e.target.value = '';
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (this._cmdHistory.length === 0) {
        return;
      }

      if (this._cmdHistoryIndex == null) {
        this._cmdHistoryIndex = this._cmdHistory.length - 1;
      } else {
        this._cmdHistoryIndex = Math.max(this._cmdHistoryIndex - 1, 0);
      }

      if (this._cmdHistoryIndex >= 0) {
        this._promptRef.value.value = this._cmdHistory[this._cmdHistoryIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (this._cmdHistoryIndex != null) {
        this._cmdHistoryIndex++;

        if (this._cmdHistoryIndex < this._cmdHistory.length) {
          this._promptRef.value.value = this._cmdHistory[this._cmdHistoryIndex];
        } else {
          this._cmdHistoryIndex = null;
          this._promptRef.value.value = '';
        }
      }
    }
  }

  /**
   * We want to focus the prompt input when user clicks on the history panel.
   * But, in the meantime, we want to prevent the prompt from taking focus when the user only selects some text inside the history.
   * That's why we bind the logic on a `mouseup` event and check for selection before trying to focus the prompt input.
   *
   * Note that the `document.getSelection()` is empty during the `mouseup` event.
   * That's why we need to postpone the logic inside a `setTimeout`.
   *
   * @param {MouseEvent} e
   */
  _onContentMouseUp(e) {
    if (e.target !== this._promptRef.value) {
      setTimeout(() => {
        if (isStringEmpty(document.getSelection()?.toString())) {
          this._promptRef.value?.focus({ preventScroll: true });
        }
      }, 0);
    }
  }

  /**
   * @param {CcKvTerminalPropertyValues} changedProperties
   */
  updated(changedProperties) {
    if (changedProperties.has('state')) {
      this._promptRef.value?.scrollIntoView();
    }
  }

  render() {
    const isCommandRunning = this.state.type === 'running';
    const currentCommandLine = this.state.type === 'running' ? this.state.commandLine : '';

    return html`
      <div class="wrapper" @mouseup=${this._onContentMouseUp} @keydown=${this._onShellPromptKeyDown}>
        <div class="header">
          <div>${i18n('cc-kv-terminal.header')}</div>
          <div class="header-warning">
            <cc-icon .icon=${iconWarning} a11y-name="${i18n('cc-notice.icon-alt.warning')}"></cc-icon>
            ${i18n('cc-kv-terminal.warning')}
          </div>
        </div>
        <div class="content">
          ${this.state.history.length > 0
            ? html`
                <div aria-live="polite" aria-atomic="true">
                  ${this.state.history.map(({ commandLine, result, success }) => {
                    return html`
                      <div class="history-entry">
                        <div class="history-entry-command">
                          <cc-icon .icon=${iconShellPrompt}></cc-icon>${commandLine}
                        </div>
                        ${result.map((l) => html`<div class=${classMap({ result: true, error: !success })}>${l}</div>`)}
                      </div>
                    `;
                  })}
                </div>
              `
            : ''}
          <div class="prompt">
            <cc-icon .icon=${iconShellPrompt}></cc-icon>
            <label class="visually-hidden" for="prompt">${i18n('cc-kv-terminal.shell.prompt')}</label>
            <input
              ${ref(this._promptRef)}
              id="prompt"
              type="text"
              autocomplete="false"
              spellcheck="false"
              .value=${currentCommandLine}
              ?readonly=${isCommandRunning}
            />
          </div>
          ${isCommandRunning ? html`<div><span class="caret-blink">&nbsp;</span></div>` : ''}
        </div>
      </div>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          --cc-kv-terminal-color-background: #011627;
          --cc-kv-terminal-color-foreground: #d6deeb;
          --cc-kv-terminal-color-foreground-success: #82aaff;
          --cc-kv-terminal-color-foreground-error: #ef5350;

          display: block;
        }

        .wrapper {
          --shell-gap: 0.5em;

          background-color: var(--cc-kv-terminal-color-background);
          color: var(--cc-kv-terminal-color-foreground);
          display: grid;
          font-family: var(--cc-ff-monospace, monospace);
          font-size: 0.75em;
          grid-template-rows: auto 1fr;
          height: 100%;
        }

        .wrapper:focus-within {
          border-radius: var(--cc-border-radius-small, 0.15em);
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .header {
          align-items: center;
          border-bottom: 1px solid var(--cc-color-border-neutral-strong);
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: space-between;
          padding: 1em;
        }

        .header-warning {
          --cc-icon-color: var(--cc-color-text-warning);

          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .content {
          overflow: auto;
          padding: 0.5em;
        }

        .history-entry {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
          padding-bottom: var(--shell-gap);
        }

        .history-entry-command {
          align-items: center;
          display: flex;
          font-weight: bold;
          gap: 0.2em;
        }

        cc-icon {
          min-height: 1.2em;
          min-width: 1.2em;
        }

        .result {
          color: var(--cc-kv-terminal-color-foreground-success);
          white-space: pre-wrap;
        }

        .result.error {
          color: var(--cc-kv-terminal-color-foreground-error);
        }

        .prompt {
          align-items: center;
          display: flex;
          gap: 0.2em;
        }

        .prompt input {
          -webkit-appearance: none;
          background: none;
          border: none;
          box-sizing: border-box;
          color: inherit;
          display: block;
          flex: 1;
          font-family: inherit;
          font-size: unset;
          margin: 0;
          padding: 0;
        }

        .prompt input:focus,
        .prompt input:active {
          outline: 0;
        }

        .caret-blink {
          animation: blink 0.75s step-end infinite;
        }

        @keyframes blink {
          0%,
          100% {
            background-color: transparent;
          }

          50% {
            background-color: var(--cc-kv-terminal-color-foreground);
          }
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-kv-terminal-beta', CcKvTerminal);
