import '../atoms/cc-expand.js';
import '../atoms/cc-img.js';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { blockStyles } from '../molecules/cc-block.js';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A component to display applications linked to an add-on.
 *
 * ## Details
 *
 * * When applications is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * When applications is an empty array, a message is displayed instead of a the list.
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
      applications: { type: Array, attribute: false },
      error: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonApplications () {
    return [
      { name: '??????????????????', instance: { variant: {} }, zone: '???' },
      { name: '???????????????????????', instance: { variant: {} }, zone: '?????' },
      { name: '????????????????????', instance: { variant: {} }, zone: '???' },
    ];
  }

  render () {

    const skeleton = (this.applications == null);
    const applications = skeleton ? CcAddonLinkedApps.skeletonApplications : this.applications;
    const hasData = (!this.error && (applications.length > 0));
    const emptyData = (!this.error && (applications.length === 0));

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-linked-apps.title')}</div>
        
        <div slot="main">
          ${hasData ? html`
            <div>${i18n('cc-addon-linked-apps.details')}</div>
            
            <cc-expand>
              <div class="application-list">
                ${applications.map((application) => html`
                  <div class="application">
                    <cc-img class="logo"
                      ?skeleton=${skeleton}
                      src=${ifDefined(application.instance.variant.logo)}
                      title="${ifDefined(application.instance.variant.name)}"
                    ></cc-img>
                    <div class="name ${classMap({ skeleton })}">${application.name}</div>
                    <div class="zone ${classMap({ skeleton })}">${i18n('cc-addon-linked-apps.zone')}${application.zone}</div>
                  </div>
                `)}
              </div>
            </cc-expand>
          ` : ''}
    
          ${emptyData ? html`
            <div class="cc-block_empty-msg">${i18n('cc-addon-linked-apps.no-linked-applications')}</div>
          ` : ''}
    
          ${this.error ? html`
            <div><img class="icon-img" src=${warningSvg} alt=""></img>${i18n('cc-addon-linked-apps.loading-error')}</div>
          ` : ''}
        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeleton,
      iconStyles,
      blockStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .application-list {
          display: grid;
          grid-gap: 1rem;
        }

        .application {
          align-items: flex-start;
          display: flex;
          line-height: 1.6rem;
        }

        .logo {
          flex: 0 0 auto;
          border-radius: 0.25rem;
          height: 1.6rem;
          width: 1.6rem;
        }

        .name {
          margin-left: 0.5rem;
          margin-right: 0.5rem;
        }

        .zone {
          background-color: #eee;
          background-color: #496D93;
          border-radius: 0.25rem;
          box-sizing: border-box;
          font-size: 0.9rem;
          font-weight: bold;
          padding: 0 0.3rem;
        }

        .zone:not(.skeleton) {
          color: #222;
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
