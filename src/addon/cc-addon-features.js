import '../atoms/cc-flex-gap.js';
import '../molecules/cc-block.js';
import '../molecules/cc-error.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { assetUrl } from '../lib/asset-url.js';
import { i18n } from '../lib/i18n.js';
import { skeletonStyles } from '../styles/skeleton.js';

const cpuSvg = assetUrl(import.meta, '../assets/cpu.svg');
const diskSvg = assetUrl(import.meta, '../assets/disk.svg');
const ramSvg = assetUrl(import.meta, '../assets/ram.svg');

const featureIcons = {
  cpus: cpuSvg,
  vcpus: cpuSvg,
  disk: diskSvg,
  memory: ramSvg,
  ram: ramSvg,
};

const SORT_FEATURES = ['cpus', 'vcpus', 'memory', 'disk'];

const SKELETON_FEATURES = [
  { name: '??????', value: '????????' },
  { name: '????', value: '??' },
  { name: '?????', value: '????' },
  { name: '???????', value: '????????' },
];

/**
 * A component to display an add-on set of features.
 *
 * ## Details
 *
 * * When `features` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * We don't have a proper i18n and icon system for feature names. For the time being, the (lower cased) name is used as some kind of code to match an icon and maybe translate the name of the feature.
 * * We don't have a proper i18n system for feature values. For the time being, the (lower cased) value is used as some kind of code to maybe translate the value of the feature.
 *
 *
 * ## Type definitions
 *
 * ```js
 * interface Feature {
 *   name: String,
 *   value: String,
 * }
 * ```
 *
 * @prop {Boolean} error - Displays an error message.
 * @prop {Feature[]} features - Sets the list features.
 */

export class CcAddonFeatures extends LitElement {

  static get properties () {
    return {
      error: { type: Boolean },
      features: { type: Array },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  _getFeatureName (code, rawName) {
    if (code === 'disk') {
      return i18n('cc-addon-features.feature-name.disk');
    }
    if (code === 'nodes') {
      return i18n('cc-addon-features.feature-name.nodes');
    }
    if (code === 'memory') {
      return i18n('cc-addon-features.feature-name.memory');
    }
    return rawName;
  };

  _getFeatureValue (code, rawValue) {
    if (code === 'dedicated') {
      return i18n('cc-addon-features.feature-value.dedicated');
    }
    if (code === 'no') {
      return i18n('cc-addon-features.feature-value.no');
    }
    if (code === 'yes') {
      return i18n('cc-addon-features.feature-value.yes');
    }
    return rawValue;
  };

  // Here we sort feature by name (lower case) but first we force a specific order with SORT_FEATURES
  _sortFeatures (features) {
    const sortedArray = features.slice(0);
    sortedArray.sort((a, b) => {
      const aIndex = (SORT_FEATURES.indexOf(a.name.toLowerCase()) + 1) || SORT_FEATURES.length + 1;
      const bIndex = (SORT_FEATURES.indexOf(b.name.toLowerCase()) + 1) || SORT_FEATURES.length + 1;
      return String(aIndex).localeCompare(String(bIndex), undefined, { numeric: true });
    });
    return sortedArray;
  }

  render () {

    const skeleton = (this.features == null);
    const rawFeatures = skeleton ? SKELETON_FEATURES : this.features;
    const unsortedFeatures = rawFeatures.map((feature) => {
      const nameCode = feature.name.toLowerCase();
      const valueCode = feature.value.toLowerCase();
      return {
        ...feature,
        icon: featureIcons[nameCode],
        name: this._getFeatureName(nameCode, feature.name),
        value: this._getFeatureValue(valueCode, feature.value),
      };
    });
    const features = this._sortFeatures(unsortedFeatures);

    return html`
      <cc-block>
        <div slot="title">${i18n('cc-addon-features.title')}</div>
        
        ${!this.error ? html`
          <div>${i18n('cc-addon-features.details')}</div>
          <cc-flex-gap class="feature-list">
            ${features.map((feature) => html`
              <div class="feature ${classMap({ skeleton })}">
                ${feature.icon != null ? html`
                  <div class="feature-icon">
                    <img class="feature-icon_img" src="${feature.icon}" alt="">
                  </div>
                ` : ''}
                <div class="feature-name">${feature.name}</div>
                <div class="feature-value">${feature.value}</div>
              </div>
            `)}
          </cc-flex-gap>
        ` : ''}
  
        ${this.error ? html`
          <cc-error>${i18n('cc-addon-features.loading-error')}</cc-error>
        ` : ''}
      </cc-block>
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

        .feature-list {
          --bdw: 2px;
          --cc-gap: 1rem;
          --color: #496D93;
          --padding: 0.6rem;
        }

        .feature {
          background-color: var(--color);
          border: var(--bdw) solid var(--color);
          border-radius: calc(2 * var(--bdw));
          display: flex;
          flex-wrap: wrap;
        }

        .feature-icon {
          margin: calc(var(--padding) / 2) 0 calc(var(--padding) / 2) var(--padding);
          position: relative;
          width: 1.3rem;
        }

        .feature-icon_img {
          display: block;
          height: 100%;
          left: 0;
          object-fit: contain;
          object-position: center center;
          position: absolute;
          top: 0;
          width: 100%;
        }

        .feature-name,
        .feature-value {
          box-sizing: border-box;
          flex: 1 1 auto;
          font-weight: bold;
          padding: calc(var(--padding) / 2) var(--padding);
          text-align: center;
        }

        .feature-name {
          color: #fff;
        }

        .skeleton .feature-name {
          color: var(--color);
        }

        .feature-value {
          background-color: #fff;
          border-radius: var(--bdw);
          color: var(--color);
        }

        .skeleton .feature-value {
          color: #fff;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-features', CcAddonFeatures);
