import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

class CcTestKvSandbox extends LitElement {
  static get properties() {
    return {
      _keys: { type: Array, state: true },
      _selectedKeyIndex: { type: String, state: true },
      _preSelectedKeyIndex: { type: String, state: true },
    };
  }

  constructor() {
    super();

    this._keys = new Array(30).fill('toto');

    this._selectedKeyIndex = null;

    this._preSelectedKeyIndex = null;
  }

  /** @param {KeyboardEvent} e */
  _onKeydown(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === 'Space') {
      e.preventDefault();
    }

    if (e.key === 'ArrowDown') {
      this._preSelectedKeyIndex = ((this._preSelectedKeyIndex ?? -1) + 1) % this._keys.length;
    }

    if (e.key === 'ArrowUp') {
      this._preSelectedKeyIndex = ((this._preSelectedKeyIndex ?? -1) + (this._keys.length - 1)) % this._keys.length;
    }

    this.updateComplete.then(() =>
      this.shadowRoot.getElementById(`selection-key-${this._preSelectedKeyIndex}`).focus(),
    );

    if (e.key === 'Space' || e.key === 'Enter') {
      this._selectedKeyIndex = this._preSelectedKeyIndex;
    }
  }

  _onClick(e) {
    const selectedTab = e.composedPath().find((element) => element.role === 'tab');
    this._selectedKeyIndex = Number(selectedTab.dataset.index);
  }

  render() {
    return html`
      <div class="wrapper">
        <div
          class="key-selection"
          role="tablist"
          tabindex="${this._selectedKeyIndex == null ? '0' : '-1'}"
          @keydown=${this._onKeydown}
          @click=${this._onClick}
        >
          ${this._keys.map((name, index) => this._renderKey(name, index))}
        </div>
        <div class="key-details" role="tabpanel">${this._renderKeyDetails()}</div>
      </div>
    `;
  }

  _renderKey(name, index) {
    const isPreSelected = index === this._preSelectedKeyIndex;
    const isSelected = index === this._selectedKeyIndex;
    return html`
      <div
        role="tab"
        class="key-item ${classMap({ hovered: isPreSelected && !isSelected })}"
        tabindex=${isSelected ? '0' : '-1'}
        data-index=${index}
        id="selection-key-${index}"
        aria-selected=${isSelected ? 'true' : 'false'}
      >
        <span class="key-name">${name} ${index}</span>
      </div>
    `;
  }

  _renderKeyDetails() {
    if (this._selectedKeyIndex == null) {
      return html`<p>Select a key to view details about it</p>`;
    }

    return html`
      <button>Focus meeee</button>
      <p>Content: toto</p>
      <p>index: ${this._selectedKeyIndex}</p>
    `;
  }

  static get styles() {
    return [
      css`
        .wrapper {
          display: flex;
          min-height: 0;
          height: 10rem;
          gap: 0.5em;
          padding: 2rem;
        }

        .key-selection {
          border: solid 1px grey;
          width: 10em;
          padding: 1rem;
          overflow-y: auto;
        }

        .key-details {
          border: solid 1px grey;
          flex: 1 1 100%;
          padding: 1rem;
          overflow-y: auto;
        }

        [aria-selected='true'] {
          color: white;
          background-color: grey;
        }

        .hovered {
          color: blue;
        }

        .hovered::after {
          content: ' >';
        }
      `,
    ];
  }
}

window.customElements.define('cc-test-kv-sandbox', CcTestKvSandbox);
