import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { iconRemixSearchEyeLine as iconExplore } from '../../src/assets/cc-remix.icons.js';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-cellar-explorer/cc-cellar-explorer.smart.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';
import { sandboxStyles } from '../sandbox-styles.js';

/**
 * @import { CcInputText } from '../../src/components/cc-input-text/cc-input-text.js'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 *
 */
class CcCellarExplorerSandbox extends LitElement {
  static get properties() {
    return {
      _addonId: { type: String, state: true },
    };
  }

  constructor() {
    super();

    this._addonId = 'addon_ad9e692d-3d28-47b9-82db-76840db955a7';

    /** @type {Ref<CcInputText>} */
    this._addonIdInputRef = createRef();
  }

  _onAddonChange() {
    this._addonId = this._addonIdInputRef.value.value;
  }

  render() {
    const context = {
      cellarProxyUrl: 'http://localhost:8082',
      ownerId: 'orga_540caeb6-521c-4a19-a955-efe6da35d142',
      addonId: this._addonId,
    };

    return html`
      <div class="ctrl-top">
        <cc-input-text ${ref(this._addonIdInputRef)} inline label="Addon ID" value=${this._addonId}></cc-input-text>
        <cc-button .icon=${iconExplore} @cc-click=${this._onAddonChange}>Explore</cc-button>
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
          padding: 2em;
        }

        cc-input-text {
          flex: 1;
        }
      `,
    ];
  }
}

window.customElements.define('cc-cellar-explorer-sandbox', CcCellarExplorerSandbox);
