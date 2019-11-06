import '../atoms/cc-img.js';
import badgeSvg from './badge-white.svg';
import phoneSvg from './phone.svg';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { skeleton } from '../styles/skeleton.js';
import { ifDefined } from 'lit-html/directives/if-defined';

/**
 * A component to display various info about an orga (name and enterprise status).
 *
 * ## Details

 * * When `orga` is null, a skeleton screen UI pattern is displayed (loading hint)
 *
 * ## Properties
 *
 * | Property         | Attribute         | Type             | Description
 * | --------         | ---------         | ----             | -----------
 * | `orga`           |                   | `Orga`           | Organization details and config
 * | `error`          | `error`           | `boolean`        | display an error message
 *
 * ### `App`
 *
 * ```
 * {
 *   name: string,
 *   avatar: string,
 *   cleverEnterprise: boolean,
 *   emergencyNumber: string,
 * }
 * ```
 *
 * *WARNING*: The "Properties" table below is broken
 */
export class CcInfoOrga extends LitElement {

  static get properties () {
    return {
      orga: { type: Object, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  static get skeletonOrga () {
    return {
      name: '??????????????????????????',
    };
  }

  render () {

    const skeleton = (this.orga == null);
    const orga = skeleton ? CcInfoOrga.skeletonOrga : this.orga;
    const initials = skeleton ? '' : this.orga.name
      .split(' ')
      .slice(0, 2)
      .map((a) => a[0].toUpperCase())
      .join('');

    return html`
      <div class="wrapper ${classMap({ enterprise: orga.cleverEnterprise })}">
      
        ${this.error ? html`
          <div class="error">${i18n('cc-info-orga.error')}</div>
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
              <div class="hotline_label">${i18n('cc-info-orga.hotline')}</div>
              <a class="hotline_number" href="tel:${orga.emergencyNumber}">
                <img class="hotline_number_img" src=${phoneSvg} alt=""> ${orga.emergencyNumber}
              </a>
            </div>
          ` : ''}
        </div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          align-items: stretch;
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          display: flex;
          flex-wrap: wrap;
          padding: 0 1rem 1rem 1rem;
          overflow: hidden;
        }

        .wrapper.enterprise {
          border-color: #1ea2f1;
          border-width: 2px;
        }

        .error {
          margin-top: 1rem;
        }

        .logo {
          border-radius: 0.25rem;
          height: 3.25rem;
          margin-right: 1rem;
          margin-top: 1rem;
          width: 3.25rem;
        }

        .details,
        .hotline {
          align-items: flex-start;
          display: flex;
          margin-top: 1rem;
          flex-direction: column;
        }

        .details {
          justify-content: center;
          margin-right: 1rem;
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

window.customElements.define('cc-info-orga', CcInfoOrga);
