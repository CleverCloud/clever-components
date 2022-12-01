import '../cc-badge/cc-badge.js';
import '../cc-img/cc-img.js';
import '../cc-flex-gap/cc-flex-gap.js';
import '../cc-error/cc-error.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const badgeSvg = new URL('../../assets/badge-white.svg', import.meta.url).href;
const phoneSvg = new URL('../../assets/phone.svg', import.meta.url).href;

const SKELETON_ORGA = {
  name: '??????????????????????????',
};

/**
 * @typedef {import('../common.types.js').Organisation} Organisation
 */

/**
 * A component to display various info about an orga (name and enterprise status).
 *
 * ## Details
 *
 * * When `orga` is nullish, a skeleton screen UI pattern is displayed (loading hint)
 *
 * @cssdisplay block
 */
export class CcHeaderOrga extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      orga: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {Organisation|null} Sets organisation details and config. */
    this.orga = null;
  }

  render () {

    const skeleton = (this.orga == null);
    const orga = skeleton ? SKELETON_ORGA : this.orga;
    const initials = skeleton ? '' : this.orga.name
      .split(' ')
      .slice(0, 2)
      .map((a) => a[0].toUpperCase())
      .join('');

    return html`
      <cc-flex-gap class="wrapper ${classMap({ enterprise: orga.cleverEnterprise })}">

        ${this.error ? html`
          <cc-error>${i18n('cc-header-orga.error')}</cc-error>
        ` : ''}

        ${!this.error ? html`
          <cc-img class="logo" ?skeleton=${skeleton} src=${ifDefined(orga.avatar)} text=${initials}></cc-img>
          <div class="details">
            <div class="name ${classMap({ skeleton })}">${orga.name}</div>
            ${orga.cleverEnterprise ? html`
              <div class="spacer"></div>
              <cc-badge weight="strong" intent="info" icon-src=${badgeSvg}>Clever Cloud Enterprise</cc-badge>
            ` : ''}
          </div>
          <div class="spacer"></div>
          ${(orga.emergencyNumber != null) ? html`
            <div class="hotline">
              <div class="hotline_label">${i18n('cc-header-orga.hotline')}</div>
              <a class="hotline_number" href="tel:${orga.emergencyNumber}">
                <cc-badge weight="outlined" intent="info" icon-src=${phoneSvg}>${orga.emergencyNumber}</cc-badge>
              </a>
            </div>
          ` : ''}
        ` : ''}
      </cc-flex-gap>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1em;

          display: block;
        }

        .wrapper {
          display: block;
          overflow: hidden;
          padding: var(--cc-gap);
          border: 1px solid #bcc2d1;
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: 0.25em;
        }

        .wrapper.enterprise {
          border-width: 2px;
          border-color: var(--cc-color-bg-primary);
        }

        .logo {
          width: 3.25em;
          height: 3.25em;
          border-radius: 0.25em;
        }

        .details,
        .hotline {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .details {
          justify-content: center;
        }

        .hotline {
          justify-content: space-between;
        }

        .name {
          min-width: 11em;
          font-size: 1.1em;
          font-weight: bold;
        }

        .hotline_number {
          border-radius: 1em;
        }

        .hotline_number:focus,
        .hotline_number:active {
          outline: 0;
        }

        /* We can do this because we set a visible focus state */

        .hotline_number::-moz-focus-inner {
          border: 0;
        }

        .hotline_number:focus {
          box-shadow: 0 0 0 0.2em rgb(50 115 220 / 25%);
        }

        .hotline_number:hover {
          box-shadow: 0 1px 3px rgb(0 0 0 / 40%);
        }

        .hotline_number:active {
          box-shadow: none;
        }

        .hotline_number cc-badge {
          /* Prevent space below badge because of text lines */
          display: flex;
          text-decoration: underline;
        }

        .spacer {
          flex: 1 1 0;
        }

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-header-orga', CcHeaderOrga);
