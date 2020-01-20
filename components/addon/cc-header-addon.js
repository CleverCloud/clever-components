import '../atoms/cc-img.js';
import '../atoms/cc-input-text.js';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * ## Details
 *
 * * When `addon` or `version` are null, a skeleton screen UI pattern is displayed (loading hint) on the corresponding zone.
 *
 * ## Type definitions
 *
 * ```js
 * interface Provider {
 *   name: string,
 *   logoUrl: string,
 * }
 * ```
 *
 * ```js
 * interface Plan {
 *   name: string,
 * }
 * ```
 *
 * ```js
 * interface Addon {
 *   id: string,
 *   name: string,
 *   provider: Provider,
 *   plan: Plan,
 *   creationDate: Date|number|string,
 * }
 * ```
 *
 * @prop {Addon} addon - Sets add-on details and config.
 * @prop {Boolean} error - Displays an error message.
 * @prop {String} version - Sets version of add-on.
 */

export class CcHeaderAddon extends LitElement {

  static get properties () {
    return {
      addon: { type: Object, attribute: false },
      error: { type: Boolean },
      version: { type: String },
    };
  };

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonAddon () {
    return {
      name: '??????????????????????????',
      provider: {},
      plan: {
        name: '?????????',
      },
      creationDate: 0,
    };
  }

  static get skeletonVersion () {
    return '????????';
  }

  render () {

    const skeleton = (this.addon == null);
    const addon = skeleton ? CcHeaderAddon.skeletonAddon : this.addon;

    const skeletonVersion = (this.version == null);
    const version = skeletonVersion ? CcHeaderAddon.skeletonVersion : this.version;

    const creationDateShort = i18n('cc-header-addon.creation-date.short', { date: addon.creationDate });
    const creationDateFull = skeleton ? undefined : i18n('cc-header-addon.creation-date.full', { date: addon.creationDate });

    return html`
      ${!this.error ? html`
        <div class="main">
        
          <cc-img class="logo" src="${ifDefined(addon.provider.logoUrl)}"
            ?skeleton=${skeleton} text="${addon.provider.name}" title="${ifDefined(addon.provider.name)}"></cc-img>
        
          <div class="details">
            <div class="name"><span class="${classMap({ skeleton })}">${addon.name}</span></div>
            <cc-input-text class="id" readonly clipboard value="${ifDefined(addon.id)}" ?skeleton=${skeleton}></cc-input-text>
          </div>

          <div class="description">
            <div class="description-item">
              <div class="description-label">${i18n('cc-header-addon.plan')}</div>
              <div class="${classMap({ skeleton })}">${addon.plan.name}</div>
            </div>
            <div class="description-item">
              <div class="description-label">${i18n('cc-header-addon.version')}</div>
              <div class="${classMap({ skeleton: skeletonVersion })}">${version}</div>
            </div>
            <div class="description-item">
              <div class="description-label">${i18n('cc-header-addon.creation-date')}</div>
              <div class="${classMap({ skeleton })}" title="${ifDefined(creationDateFull)}">${creationDateShort}</div>
            </div>
          </div>
        </div>
      ` : ''}

      ${this.error ? html`
        <div class="error"><img class="icon-img" src=${warningSvg} alt=""></img>${i18n('cc-header-addon.error')}</div>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeleton,
      iconStyles,
      // language=CSS
      css`
        :host {
          background-color: #fff;
          border-radius: 0.25rem;
          border: 1px solid #bcc2d1;
          display: block;
        }

        .main {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
        }

        .logo {
          align-self: flex-start;
          border-radius: 0.25rem;
          height: 3.25rem;
          margin: 1rem;
          width: 3.25rem;
        }

        .details {
          flex: 1 1 0;
          margin: 1rem 1rem 1rem 0;
        }
        
        .name,
        .description-label {
          margin-bottom: 0.35rem;
        }

        .name {
          font-size: 1.1rem;
          font-weight: bold;
          min-width: 12rem;
        }

        .id {
          margin: 0;
        }

        .description {
          display: flex;
          padding: 0.5rem 1rem 0.5rem 0;
        }

        .description-item {
          flex: 1 1 auto;
          margin: 0.5rem 0 0.5rem 1rem;
        }

        .description-label {
          font-weight: bold;
        }

        .error {
          padding: 1rem;
          text-align: center;
        }

        [title] {
          cursor: help;
        }

        /* SKELETON */
        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-header-addon', CcHeaderAddon);
