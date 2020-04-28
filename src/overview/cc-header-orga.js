import '../atoms/cc-img.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { assetUrl } from '../lib/asset-url.js';
import { i18n } from '../lib/i18n.js';
import { skeleton } from '../styles/skeleton.js';

const badgeSvg = assetUrl(import.meta, '../assets/badge-white.svg');
const phoneSvg = assetUrl(import.meta, '../assets/phone.svg');

const SKELETON_ORGA = {
  name: '??????????????????????????',
};

/**
 * A component to display various info about an orga (name and enterprise status).
 *
 * ## Details

 * * When `orga` is nullish, a skeleton screen UI pattern is displayed (loading hint)
 *
 * ## Type definitions
 *
 * ```js
 * interface Orga {
 *   name: string,
 *   avatar: string,
 *   cleverEnterprise: boolean,
 *   emergencyNumber: string,
 * }
 * ```
 *
 * @prop {Boolean} error - Displays an error message.
 * @prop {Orga} orga - Sets organization details and config.
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
    this.error = false;
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
              <div class="badge">
                <img class="badge_img" src=${badgeSvg} alt=""> Clever Cloud Enterprise
              </div>
            ` : ''}
          </div>
          <div class="spacer"></div>
          ${(orga.emergencyNumber != null) ? html`
            <div class="hotline">
              <div class="hotline_label">${i18n('cc-header-orga.hotline')}</div>
              <a class="hotline_number" href="tel:${orga.emergencyNumber}">
                <img class="hotline_number_img" src=${phoneSvg} alt=""> ${orga.emergencyNumber}
              </a>
            </div>
          ` : ''}
        ` : ''}
      </cc-flex-gap>
    `;
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          display: block;
        }

        .wrapper {
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          display: block;
          padding: var(--cc-gap);
          overflow: hidden;
        }

        .wrapper.enterprise {
          border-color: #1ea2f1;
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

        .badge,
        .hotline_number {
          align-items: center;
          border-radius: 0.15rem;
          display: flex;
          font-size: 0.8rem;
          font-weight: bold;
          padding: 0.2rem 0.4rem;
        }

        .badge {
          background: #1ea2f1;
          color: #fff;
        }

        .hotline_number {
          cursor: pointer;
          border: 1px solid #1ea2f1;
          color: #1ea2f1;
        }

        .badge_img,
        .hotline_number_img {
          height: 0.9rem;
          margin-right: 0.4rem;
          overflow: hidden;
          width: 0.9rem;
        }

        .hotline_number:focus {
          box-shadow: 0 0 0 .2em rgba(50, 115, 220, .25);
          outline: 0;
        }

        .hotline_number:hover {
          box-shadow: 0 1px 3px #888;
        }

        .hotline_number:active {
          box-shadow: none;
          outline: 0;
        }

        /* We can do this because we set a visible focus state */
        .hotline_number::-moz-focus-inner {
          border: 0;
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
