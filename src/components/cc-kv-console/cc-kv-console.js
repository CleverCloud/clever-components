import '@lit-labs/virtualizer';
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
 * @typedef {import('./cc-kv-console.types.js').CcKvConsoleState} CcKvConsoleState
 * @typedef {import('./cc-kv-console.types.js').CcKvCommandContentItem} CcKvCommandContentItem
 * @typedef {import('../../lib/events.types.js').GenericEventWithTarget<KeyboardEvent,HTMLInputElement>} HTMLInputKeyboardEvent
 * @typedef {import('lit').PropertyValues<CcKvConsole>} CcKvConsolePropertyValues
 * @typedef {import('lit/directives/ref.js').Ref<HTMLInputElement>} HTMLInputElementRef
 * @typedef {import('lit/directives/ref.js').Ref<Virtualizer>} VirtualizerRef
 * @typedef {import('@lit-labs/virtualizer/LitVirtualizer.js').LitVirtualizer} Virtualizer
 */

/**
 * A component displaying a console to interact with kv database.
 *
 * The history of commands is kept in memory and users can navigate through history using arrow keys.
 *
 * The `clear` command will clear the console (but not the history of commands).
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<CcKvConsoleState>} cc-kv-console:state-change - Fires whenever the state change internally
 * @fires {CustomEvent<string>} cc-kv-console:send-command - Fires whenever a command is validated
 *
 * @cssprop {Color} --cc-kv-console-color-background - The background color
 * @cssprop {Color} --cc-kv-console-color-foreground - The foreground color
 * @cssprop {Color} --cc-kv-console-color-foreground-success - The foreground color of the result when command succeeded
 * @cssprop {Color} --cc-kv-console-color-foreground-error - The foreground color of the result when command failed
 */
export class CcKvConsole extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();
    /** @type {CcKvConsoleState} - The state of the component */
    this.state = { type: 'idle', history: [] };

    /** @type {Array<string>} */
    this._cmdHistory = [];

    /** @type {number|null} */
    this._cmdHistoryIndex = null;

    /** @type {HTMLInputElementRef} */
    this._promptRef = createRef();

    /** @type {VirtualizerRef} */
    this._contentRef = createRef();

    /** @type {boolean} */
    this._shouldRestoreFocusToPrompt = false;

    // this is for lit-virtualizer
    this._elementRender = {
      /** @param {CcKvCommandContentItem} e */
      key: (e) => e.id,
      item: this._renderItem.bind(this),
    };
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
   * @returns {Array<CcKvCommandContentItem>}
   */
  _getItems() {
    /** @type {Array<CcKvCommandContentItem>} */
    const items = [];

    this.state.history.forEach((historyEntry, cmdIndex) => {
      const cmdId = `cmd/${cmdIndex}`;

      items.push({
        id: cmdId,
        type: 'commandLine',
        line: historyEntry.commandLine,
      });

      const resultLength = historyEntry.result.length;

      historyEntry.result.forEach((lineOfResult, resultIndex) => {
        items.push({
          id: `${cmdId}/result/${resultIndex}`,
          type: 'resultLine',
          line: lineOfResult,
          success: historyEntry.success,
          last: resultIndex === resultLength - 1,
        });
      });
    });

    const isCommandRunning = this.state.type === 'running';
    const currentCommandLine = this.state.type === 'running' ? this.state.commandLine : '';

    items.push({
      id: 'prompt',
      type: 'prompt',
      command: currentCommandLine,
      running: isCommandRunning,
    });
    if (isCommandRunning) {
      items.push({
        id: 'caret',
        type: 'caret',
      });
    }

    return items;
  }

  /**
   * @param {HTMLInputKeyboardEvent} e
   */
  _onShellPromptKeyDown(e) {
    e.stopPropagation();

    if (e.key === 'Enter') {
      // ask for restoring focus on the next update.
      this._shouldRestoreFocusToPrompt = true;

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
   * @param {CcKvConsolePropertyValues} changedProperties
   */
  async updated(changedProperties) {
    // restores focus only if necessary
    if (changedProperties.has('state')) {
      await this._contentRef.value?.layoutComplete;

      this.shadowRoot.querySelector('.scroller').scrollTo(0, this.shadowRoot.querySelector('.scroller').scrollHeight);

      await this._contentRef.value?.layoutComplete;
      if (this._shouldRestoreFocusToPrompt) {
        this._promptRef.value?.focus();
        // this._shouldRestoreFocusToPrompt = false;
      }
    }
  }

  render() {
    const items = this._getItems();
    return html`
      <div class="wrapper" @mouseup=${this._onContentMouseUp} @keydown=${this._onShellPromptKeyDown}>
        <div class="header">
          <div>${i18n('cc-kv-console.header')}</div>
          <div class="header-warning">
            <cc-icon .icon=${iconWarning} a11y-name="${i18n('cc-notice.icon-alt.warning')}"></cc-icon>
            ${i18n('cc-kv-console.warning')}
          </div>
        </div>
        <div class="scroller">
          <lit-virtualizer
            class="content"
            aria-live="polite"
            aria-atomic="true"
            ${ref(this._contentRef)}
            .items=${items}
            .keyFunction=${this._elementRender.key}
            .renderItem=${this._elementRender.item}
          ></lit-virtualizer>
        </div>
      </div>
    `;
  }

  /**
   * @param {CcKvCommandContentItem} item
   */
  _renderItem(item) {
    switch (item.type) {
      case 'caret':
        return html`<div><span class="caret-blink">&nbsp;</span></div>`;
      case 'commandLine':
        return html`<div class="command"><cc-icon .icon=${iconShellPrompt}></cc-icon>${item.line}</div>`;
      case 'resultLine': {
        const clazz = { result: true, error: !item.success, last: item.last };
        return html`<div class=${classMap(clazz)}>${item.line}</div>`;
      }
      case 'prompt':
        return html`<div class="prompt">
          <cc-icon .icon=${iconShellPrompt}></cc-icon>
          <label class="visually-hidden" for="prompt">${i18n('cc-kv-console.shell.prompt')}</label>
          <input
            ${ref(this._promptRef)}
            id="prompt"
            type="text"
            autocomplete="false"
            spellcheck="false"
            .value=${item.command}
            ?readonly=${item.running}
          />
        </div>`;
    }
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          --cc-kv-console-color-background: #011627;
          --cc-kv-console-color-foreground: #d6deeb;
          --cc-kv-console-color-foreground-success: #82aaff;
          --cc-kv-console-color-foreground-error: #ef5350;

          display: block;
        }

        .wrapper {
          --shell-inner-gap: 0.2em; /* gap between command line and first result line */
          --shell-gap: 0.5em; /* gap between result and next command */

          background-color: var(--cc-kv-console-color-background);
          color: var(--cc-kv-console-color-foreground);
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
          margin: 0.5em;
        }

        .content.overflow {
          overflow: auto;
        }

        .command {
          align-items: center;
          display: flex;
          font-weight: bold;
          gap: 0.2em;
          padding-bottom: var(--shell-inner-gap);
        }

        cc-icon {
          min-height: 1.2em;
          min-width: 1.2em;
        }

        .result {
          color: var(--cc-kv-console-color-foreground-success);
          white-space: pre-wrap;
        }

        .result.error {
          color: var(--cc-kv-console-color-foreground-error);
        }

        .result.last {
          padding-bottom: var(--shell-gap);
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
            background-color: var(--cc-kv-console-color-foreground);
          }
        }

        .scroller {
          /* max-height: 25em; */
          overflow-x: hidden;
          overflow-y: auto;
        }
      `,
    ];
  }
}

window.customElements.define('cc-kv-console-beta', CcKvConsole);
