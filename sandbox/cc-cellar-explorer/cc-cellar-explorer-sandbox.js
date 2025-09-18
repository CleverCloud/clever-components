import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixSearchEyeLine as iconExplore } from '../../src/assets/cc-remix.icons.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-cellar-explorer/cc-cellar-explorer.js';
import '../../src/components/cc-cellar-explorer/cc-cellar-explorer.smart.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import { sandboxStyles } from '../sandbox-styles.js';

/**
 * @typedef {import('../../src/components/cc-input-text/cc-input-text.js').CcInputText} CcInputText
 * @typedef {import('lit/directives/ref.js').Ref<CcInputText>} CcInputTextRef
 */

/**
 *
 */
class CcCellarExplorerSandbox extends LitElement {
  static get properties() {
    return {
      _kvUrl: { type: String, state: true },
    };
  }

  constructor() {
    super();

    this._kvUrl = 'redis://localhost:6379';

    /** @type {CcInputTextRef} */
    this._kvUrlInputRef = createRef();
  }

  _onRedisUrlChange() {
    this._kvUrl = this._kvUrlInputRef.value.value;
  }

  render() {
    const context = {
      kvApiConfig: {
        url: 'http://localhost:8081',
        backendUrl: this._kvUrl,
      },
    };

    return html`
      <div class="ctrl-top">
        <cc-input-text ${ref(this._kvUrlInputRef)} inline label="KV URL" value=${this._kvUrl}></cc-input-text>
        <cc-button .icon=${iconExplore} @cc-click=${this._onRedisUrlChange}>Explore</cc-button>
      </div>

      <cc-smart-container .context=${context}>
        <cc-cellar-explorer-beta class="main cc-cellar-explorer"></cc-cellar-explorer-beta>
      </cc-smart-container>
    `;
  }

  static get styles() {
    return [
      sandboxStyles,
      css`
        :host {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }

        .cc-cellar-explorer {
          display: flex;
          flex: 1;
          flex-direction: column;
          min-height: 0;
        }

        cc-input-text {
          flex: 1;
        }
      `,
    ];
  }
}

window.customElements.define('cc-cellar-explorer-sandbox', CcCellarExplorerSandbox);
