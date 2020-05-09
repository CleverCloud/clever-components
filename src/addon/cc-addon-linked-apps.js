import '../atoms/cc-img.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';
import { ccLink, linkStyles } from '../templates/cc-link.js';

const SKELETON_APPLICATIONS = [
  { name: '??????????????????', link: '', instance: { variant: {} }, zone: '???' },
  { name: '???????????????????????', link: '', instance: { variant: {} }, zone: '?????' },
  { name: '????????????????????', link: '', instance: { variant: {} }, zone: '???' },
];

/**
 * A component to display applications linked to an add-on.
 *
 * 🎨 default CSS display: `block`
 *
 * ## Details
 *
 * * When applications is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface InstanceVariant {
 *   name: string,
 *   logo: string,
 * }
 * ```
 *
 * ```js
 * interface Instance {
 *   variant: InstanceVariant,
 * }
 * ```
 *
 * ```js
 * interface Application {
 *   name: string,
 *   link: string,
 *   instance: Instance,
 *   zone: string,
 * }
 * ```
 *
 * @prop {Application[]} applications - Sets the linked applications.
 * @prop {Boolean} error - Displays an error message.
 */

export class CcAddonLinkedApps extends LitElement {

  static get properties () {
    return {
      applications: { type: Array },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  render () {

    const skeleton = (this.applications == null);
    const applications = skeleton ? SKELETON_APPLICATIONS : this.applications;
    const hasData = (!this.error && (applications.length > 0));
    const emptyData = (!this.error && (applications.length === 0));

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-linked-apps.title')}</div>
        
        ${hasData ? html`
          <div>${i18n('cc-addon-linked-apps.details')}</div>
          
          ${applications.map((application) => html`
            <div class="application">
              <cc-img class="logo"
                ?skeleton=${skeleton}
                src=${ifDefined(application.instance.variant.logo)}
                title="${ifDefined(application.instance.variant.name)}"
              ></cc-img>
              <div class="name">${ccLink(application.link, application.name, skeleton)}</div>
              <div class="zone ${classMap({ skeleton })}">${i18n('cc-addon-linked-apps.zone')}${application.zone}</div>
            </div>
          `)}
        ` : ''}
  
        ${emptyData ? html`
          <div class="cc-block_empty-msg">${i18n('cc-addon-linked-apps.no-linked-applications')}</div>
        ` : ''}
  
        ${this.error ? html`
          <cc-error>${i18n('cc-addon-linked-apps.loading-error')}</cc-error>
        ` : ''}
      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .application {
          align-items: flex-start;
          display: flex;
          line-height: 1.6rem;
        }

        .logo {
          border-radius: 0.25rem;
          flex: 0 0 auto;
          height: 1.6rem;
          width: 1.6rem;
        }

        .name {
          margin-left: 0.5rem;
          margin-right: 0.5rem;
        }

        .zone {
          background-color: #496D93;
          border-radius: 0.25rem;
          box-sizing: border-box;
          font-size: 0.9rem;
          font-weight: bold;
          padding: 0 0.3rem;
        }

        .zone:not(.skeleton) {
          color: #fff;
        }

        /* SKELETON */
        .name.skeleton {
          background-color: #bbb;
        }

        [title] {
          cursor: help;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-linked-apps', CcAddonLinkedApps);
