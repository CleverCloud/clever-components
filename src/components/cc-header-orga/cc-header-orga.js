import '../cc-badge/cc-badge.js';
import '../cc-img/cc-img.js';
import '../cc-notice/cc-notice.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import {
  iconRemixCheckboxCircleFill as iconBadge,
  iconRemixPhoneFill as iconPhone,
} from '../../assets/cc-remix.icons.js';

import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/**
 * @typedef {import('./cc-header-orga.types.js').HeaderOrgaState} HeaderOrgaState
 */

/**
 * A component to display various info about an orga (name and enterprise status).
 *
 * @cssdisplay block
 */
export class CcHeaderOrga extends LitElement {

  static get properties () {
    return {
      orga: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {HeaderOrgaState} Sets the component state. */
    this.orga = {
      state: 'loading',
    };
  }

  render () {

    if (this.orga.state === 'error') {
      return html`
        <cc-notice intent="warning" message="${i18n('cc-header-orga.error')}"></cc-notice>
      `;
    }

    if (this.orga.state === 'loading') {
      return this._renderHeader({
        skeleton: true,
        name: '??????????????????????????',
      });
    }

    if (this.orga.state === 'loaded') {
      return this._renderHeader({
        skeleton: false,
        name: this.orga.name,
        avatar: this.orga.avatar,
        cleverEnterprise: this.orga.cleverEnterprise,
        emergencyNumber: this.orga.emergencyNumber,
      });
    }
  }

  _renderHeader ({ skeleton, name, avatar = null, cleverEnterprise = false, emergencyNumber = null }) {

    const initials = skeleton ? '' : name
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((a) => a[0].toUpperCase())
      .join('');

    return html`
      <div class="wrapper ${classMap({ enterprise: cleverEnterprise })}">
      
      <cc-img class="logo" ?skeleton=${skeleton} src=${ifDefined(avatar)} accessible-name=${initials}></cc-img>
      <div class="details">
        <div class="name ${classMap({ skeleton })}">${name}</div>
        ${cleverEnterprise ? html`
          <div class="spacer"></div>
          <cc-badge weight="strong" intent="info" .icon=${iconBadge}>Clever Cloud Enterprise</cc-badge>
        ` : ''}
      </div>
      ${(emergencyNumber != null) ? html`
        <div class="hotline">
          <div class="hotline_label">${i18n('cc-header-orga.hotline')}</div>
          <a class="hotline_number" href="tel:${emergencyNumber}">
            <cc-badge weight="outlined" intent="info" .icon=${iconPhone}>${emergencyNumber}</cc-badge>
          </a>
        </div>
      ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }
        
        cc-notice {
          width: 100%;
        }

        .wrapper {
          display: flex;
          overflow: hidden;
          flex-wrap: wrap;
          padding: 1em;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          background-color: var(--cc-color-bg-default, #fff);
          border-radius: var(--cc-border-radius-default, 0.25em);
          gap: 1em;
        }
      
        .wrapper.enterprise {
          border-width: 2px;
          border-color: var(--cc-color-bg-primary);
        }

        .logo {
          width: 3.25em;
          height: 3.25em;
          border-radius: var(--cc-border-radius-default, 0.25em);
        }

        .details,
        .hotline {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .details {
          flex: 100 1 max-content;
          justify-content: center;
          row-gap: 0.2em;
        }

        .hotline {
          flex: 1 1 auto;
          justify-content: space-between;
        }

        .name {
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
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
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

        /* SKELETON */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-header-orga', CcHeaderOrga);
