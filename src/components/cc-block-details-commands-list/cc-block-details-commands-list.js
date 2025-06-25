import { css, html, LitElement } from 'lit';
import '../cc-icon/cc-icon.js';

/**
 * A display component with mostly HTML+CSS and an open/close toggle feature organized with slots to display information such as CLI commands.
 * The main purpose is to be used with a cc-block.
 *
 * @cssdisplay block
 */

export class CcBlockDetailsCommandsList extends LitElement {
  static get properties() {
    return {};
  }

  render() {
    return html`
      <dl class="wrapper">
        <slot></slot>
      </dl>
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
          display: flex;
          flex-direction: column;
          margin: 0;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block-details-commands-list', CcBlockDetailsCommandsList);
