import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { instanceDetails, tileStyles } from '../styles/info-tiles.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * A "tile" component to display the current config of scalability for a given app.
 *
 * ## Details

 * When `scalability` is null, a skeleton screen UI pattern is displayed (loading hint)
 *
 * ## Properties
 *
 * | Property      | Attribute      | Type             | Description
 * | --------      | ---------      | ----             | -----------
 * | `scalability` |                | `Scalability`    | describe the current scalability settings
 * | `error`       | `error`        | `boolean`        | display an error message
 *
 * ### `Scalability`
 *
 * ```
 * {
 *   minFlavor: Flavor,
 *   maxFlavor: Flavor,
 *   minInstances: Number,
 *   maxInstances: Number,
 * }
 * ```
 *
 * ### `Flavor`
 *
 * ```
 * {
 *   name: String,
 *   cpus: Number,
 *   gpus: Number,
 *   mem: Number,
 *   microservice: Boolean,
 * }
 * ```
 *
 * *WARNING*: The "Properties" table below is broken
 *
 * @prop {Object} scalability - BROKEN
 * @attr {Boolean} error - display an error message
 */
export class CcInfoScalability extends LitElement {

  static get properties () {
    return {
      scalability: { type: Object, attribute: false },
      error: { type: Boolean, reflect: true },
    };
  }

  static get _skeletonScalability () {
    return {
      minFlavor: { name: '??' },
      maxFlavor: { name: '?' },
      minInstances: 0,
      maxInstances: 0,
    };
  }

  _getFlavorDetails (flavor) {
    if (flavor.cpus == null) {
      return;
    }
    return i18n('cc-info-scalability.flavor-info', { ...flavor });
  }

  // For now, we strip the ML_ prefix from ML VMs, this may change in the future
  _formatFlavorName (name) {
    return name.replace(/^ML_/, '');
  }

  render () {

    const skeleton = (this.scalability == null);
    const { minFlavor, maxFlavor, minInstances, maxInstances } = skeleton ? CcInfoScalability._skeletonScalability : this.scalability;

    return html`
      <div class="tile_title">${i18n('cc-info-scalability.title')}</div>
      <div class="tile_body">
        ${!this.error ? html`
          <div class="line">
            <div class="label">${i18n('cc-info-scalability.size')}</div>
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(minFlavor))}
            >${this._formatFlavorName(minFlavor.name)}</div>
            <div class="separator"></div>
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(maxFlavor))}
            >${this._formatFlavorName(maxFlavor.name)}</div>
          </div>
          <div class="line">
            <div class="label">${i18n('cc-info-scalability.number')}</div>
            <div class="count-bubble ${classMap({ skeleton })}">${minInstances}</div>
            <div class="separator"></div>
            <div class="count-bubble ${classMap({ skeleton })}">${maxInstances}</div>
          </div>
        ` : ''}
        ${this.error ? html`
          <div class="tile_message">${i18n('cc-info-scalability.error')}</div>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      tileStyles,
      instanceDetails,
      skeleton,
      // language=CSS
      css`
        .line {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .line:last-child {
          margin-top: 1rem;
        }

        .label {
          margin-right: 0.5rem;
          width: 6rem;
        }

        .separator {
          border-top: 1px dashed #8C8C8C;
          flex: 1 1 0;
          width: 1.5rem;
        }

        [title] {
          cursor: help;
        }
      `,
    ];
  }
}

window.customElements.define('cc-info-scalability', CcInfoScalability);
