import { css, html, LitElement } from 'lit';

/**
 * A component that allows to navigate through a Cellar addon.
 *
 * @cssdisplay block
 */
export class CcCellarExplorer extends LitElement {
  static get properties() {
    return {};
  }

  constructor() {
    super();
  }

  render() {
    return html` Hello Cc Cellar Explorer ! `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-explorer-beta', CcCellarExplorer);
