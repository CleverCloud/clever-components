import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { i18n } from '../lib/i18n.js';
import { instanceDetailsStyles, tileStyles } from '../styles/info-tiles.js';
import { skeletonStyles } from '../styles/skeleton.js';

const SKELETON_SCALABILITY = {
  minFlavor: { name: '??' },
  maxFlavor: { name: '?' },
  minInstances: 0,
  maxInstances: 0,
};

/**
 * A "tile" component to display the current config of scalability for a given app.
 *
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/overview/cc-tile-scalability.js)
 *
 * ## Details

 * * When `scalability` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 *
 * ## Type definitions
 *
 * ```js
 * interface Flavor {
 *   name: string,
 *   cpus: number,
 *   gpus: number,
 *   mem: number,
 *   microservice: boolean,
 * }
 * ```
 *
 * ```js
 * interface Scalability {
 *   minFlavor: Flavor,
 *   maxFlavor: Flavor,
 *   minInstances: number,
 *   maxInstances: number,
 * }
 * ```
 *
 * @cssdisplay grid
 *
 * @prop {Boolean} error - Displays an error message.
 * @prop {Scalability} scalability - Sets the scalability config of an app with details about flavors and number of instances.
 */
export class CcTileScalability extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean, reflect: true },
      scalability: { type: Object },
    };
  }

  _getFlavorDetails (flavor) {
    if (flavor.cpus == null) {
      return;
    }
    return i18n('cc-tile-scalability.flavor-info', { ...flavor });
  }

  // For now, we strip the ML_ prefix from ML VMs, this may change in the future
  _formatFlavorName (name) {
    return name.replace(/^ML_/, '');
  }

  render () {

    const skeleton = (this.scalability == null);
    const { minFlavor, maxFlavor, minInstances, maxInstances } = skeleton ? SKELETON_SCALABILITY : this.scalability;

    return html`
      <div class="tile_title">${i18n('cc-tile-scalability.title')}</div>
      
      ${!this.error ? html`
        <div class="tile_body">
          <div class="label">${i18n('cc-tile-scalability.size')}</div>
          <div class="info">
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(minFlavor))}
            >${this._formatFlavorName(minFlavor.name)}</div>
            <div class="separator"></div>
            <div class="size-label ${classMap({ skeleton })}"
              title=${ifDefined(this._getFlavorDetails(maxFlavor))}
            >${this._formatFlavorName(maxFlavor.name)}</div>
          </div>
          <div class="label">${i18n('cc-tile-scalability.number')}</div>
          <div class="info">
            <div class="count-bubble ${classMap({ skeleton })}">${minInstances}</div>
            <div class="separator"></div>
            <div class="count-bubble ${classMap({ skeleton })}">${maxInstances}</div>
          </div>
        </div>
      ` : ''}

      ${this.error ? html`
        <cc-error class="tile_message">${i18n('cc-tile-scalability.error')}</cc-error>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      tileStyles,
      instanceDetailsStyles,
      skeletonStyles,
      // language=CSS
      css`
        .tile_body {
          align-items: center;
          grid-column-gap: 2rem;
          grid-row-gap: 1rem;
          grid-template-columns: auto 1fr;
        }

        .info {
          align-items: center;
          display: flex;
          justify-content: center;
          width: 100%;
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

window.customElements.define('cc-tile-scalability', CcTileScalability);
