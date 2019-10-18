import { css, html, LitElement } from 'lit-element';

/**
 * A display only component (just HTML+CSS) to layout:
 *
 * * A header component/zone
 * * Some tiles in one row (or many, if not wide enough, it wraps)
 * * A main component/zone
 *
 * @slot head - Put your header component here (ex: `<cc-info-app>`)
 * @slot tiles - Put your tiles here (ex: `<cc-info-instances>` or `<cc-info-scalability>`)
 * @slot main - Put your main component here (ex: `<cc-logsmap>`)
 */
export class CcOverview extends LitElement {

  render () {
    return html`
      <slot class="head" name="head"></slot>
      <slot class="tiles" name="tiles"></slot>
      <slot class="main" name="main"></slot>
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: flex;
        flex-direction: column;
      }

      .head::slotted(*) {
        margin-bottom: 1rem;
      }

      .tiles {
        display: flex;
        flex-wrap: wrap;
        margin-right: -1rem;
      }

      .tiles::slotted(*) {
        flex: 1 1 17rem;
        margin-bottom: 1rem;
        margin-right: 1rem;
      }

      .main::slotted(*) {
        flex: 1 1 0;
        min-height: 20rem;
      }
    `;
  }
}

window.customElements.define('cc-overview', CcOverview);
