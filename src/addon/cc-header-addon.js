import '../atoms/cc-img.js';
import '../atoms/cc-input-text.js';
import '../atoms/cc-flex-gap.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

const SKELETON_ADDON = {
  name: '??????????????????????????',
  provider: {},
  plan: {
    name: '?????????',
  },
  creationDate: 0,
};

const SKELETON_VERSION = '????????';

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-header-addon.js)
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
 * @cssdisplay block
 *
 * @prop {Addon} addon - Sets add-on details and config.
 * @prop {Boolean} error - Displays an error message.
 * @prop {String} version - Sets version of add-on.
 */

export class CcHeaderAddon extends LitElement {

  static get properties () {
    return {
      addon: { type: Object },
      error: { type: Boolean },
      version: { type: String },
    };
  };

  constructor () {
    super();
    this.error = false;
  }

  render () {

    const skeleton = (this.addon == null);
    const addon = skeleton ? SKELETON_ADDON : this.addon;

    const skeletonVersion = (this.version == null);
    const version = skeletonVersion ? SKELETON_VERSION : this.version;

    const creationDateShort = i18n('cc-header-addon.creation-date.short', { date: addon.creationDate });
    const creationDateFull = skeleton ? undefined : i18n('cc-header-addon.creation-date.full', { date: addon.creationDate });

    return html`
      ${!this.error ? html`
        <cc-flex-gap class="main">
        
          <cc-img class="logo" src="${ifDefined(addon.provider.logoUrl)}"
            ?skeleton=${skeleton} text="${addon.provider.name}" title="${ifDefined(addon.provider.name)}"></cc-img>
        
          <div class="details">
            <div class="name"><span class="${classMap({ skeleton })}">${addon.name}</span></div>
            <cc-input-text readonly clipboard value="${ifDefined(addon.id)}" ?skeleton=${skeleton}></cc-input-text>
          </div>

          <cc-flex-gap class="description">
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
          </cc-flex-gap>
        </cc-flex-gap>
      ` : ''}

      ${this.error ? html`
        <cc-error></img>${i18n('cc-header-addon.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          --cc-gap: 1rem;
          background-color: #fff;
          border: 1px solid #bcc2d1;
          border-radius: 0.25rem;
          display: block;
        }

        .main {
          padding: var(--cc-gap);
        }

        .logo {
          border-radius: 0.25rem;
          height: 3.25rem;
          width: 3.25rem;
        }

        .details {
          flex: 1 1 0;
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

        .description {
          align-self: center;
        }

        .description-item {
          flex: 1 1 auto;
        }

        .description-label {
          font-weight: bold;
        }

        cc-error {
          padding: var(--cc-gap);
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
