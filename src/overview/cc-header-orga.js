import '../atoms/cc-badge.js';
import '../atoms/cc-img.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { defaultThemeStyles } from '../styles/default-theme.js';
import { skeletonStyles } from '../styles/skeleton.js';

const badgeSvg = new URL('../assets/badge-white.svg', import.meta.url).href;
const phoneSvg = new URL('../assets/phone.svg', import.meta.url).href;

const SKELETON_ORGA = {
  name: '??????????????????????????',
};

/**
 * @typedef {import('../types.js').Organisation} Organisation
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
      defaultThemeStyles,
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          display: block;
        }

        .wrapper {
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: block;
          overflow: hidden;
          padding: var(--cc-gap);
        }

        .wrapper.enterprise {
          border-color: var(--color-bg-primary);
          border-width: 2px;
        }

        .logo {
          border-radius: 0.25rem;
          height: 3.25rem;
          width: 3.25rem;
        }

        .details,
        .hotline {
          align-items: flex-start;
          display: flex;
          flex-direction: column;
        }

        .details {
          justify-content: center;
        }

        .hotline {
          justify-content: space-between;
        }

        .name {
          font-size: 1.1rem;
          font-weight: bold;
          min-width: 12rem;
        }

        .hotline_number cc-badge {
          text-decoration: underline;
        }

        .hotline_number:focus,
        .hotline_number:active {
          outline: 0;
        }

        /* We can do this because we set a visible focus state */
        .hotline_number::-moz-focus-inner {
          border: 0;
        }

        .hotline_number:focus cc-badge {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
        }

        .hotline_number:hover cc-badge {
          box-shadow: 0 1px 3px #888;
        }

        .hotline_number:active cc-badge {
          box-shadow: none;
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
