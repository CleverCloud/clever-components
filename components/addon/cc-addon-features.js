import '../../components/molecules/cc-block.js';
import cpuSvg from './cpu.svg';
import diskSvg from './disk.svg';
import ramSvg from './ram.svg';
import warningSvg from 'twemoji/2/svg/26a0.svg';
import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { i18n } from '../lib/i18n.js';
import { iconStyles } from '../styles/icon.js';
import { skeleton } from '../styles/skeleton.js';

const featureIcons = {
  cpus: cpuSvg,
  vcpus: cpuSvg,
  disk: diskSvg,
  memory: ramSvg,
  ram: ramSvg,
};

const SORT_FEATURES = ['cpus', 'vcpus', 'memory', 'disk'];

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
      features: { type: Array, attribute: false },
    };
  }

  constructor () {
    super();
    this.error = false;
  }

  static get skeletonFeatures () {
    return [
      { name: '??????', value: '????????' },
      { name: '????', value: '??' },
      { name: '?????', value: '????' },
      { name: '???????', value: '????????' },
    ];
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
    if (code === 'yes') {
      return i18n('cc-addon-features.feature-value.yes');
    }
    if (code === 'no') {
      return i18n('cc-addon-features.feature-value.no');
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
    const rawFeatures = skeleton ? CcAddonFeatures.skeletonFeatures : this.features;
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
        
        <div slot="main">
          ${!this.error ? html`
            <div>${i18n('cc-addon-features.details')}</div>
            <div class="feature-list">
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
            </div>
          ` : ''}
    
          ${this.error ? html`
            <div><img class="icon-img" src=${warningSvg} alt=""></img>${i18n('cc-addon-features.loading-error')}</div>
          ` : ''}
        </div>
      </cc-block>
    `;
  }

  static get styles () {
    return [
      skeleton,
      iconStyles,
      // language=CSS
      css`
        .feature-list {
          --color: #496D93;
          --gap: 1rem;
          --bdw: 2px;
          --padding: 0.6rem;
          display: flex;
          flex-wrap: wrap;
          margin: calc(var(--gap) / -2);
        }

        .feature {
          background-color: var(--color);
          border-radius: calc(2 * var(--bdw));
          border: var(--bdw) solid var(--color);
          display: flex;
          flex-wrap: wrap;
          margin: calc(var(--gap) / 2);
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
          color: var(--color);
          border-radius: var(--bdw);
        }

        .skeleton .feature-value {
          color: #fff;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-features', CcAddonFeatures);
