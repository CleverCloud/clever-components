import '../cc-block/cc-block.js';
import '../cc-notice/cc-notice.js';
import '../cc-icon/cc-icon.js';
import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconCleverRam as iconRam,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixCpuLine as iconCpu,
  iconRemixDatabase_2Fill as iconDisk,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';

const featureIcons = {
  cpus: iconCpu,
  vcpus: iconCpu,
  disk: iconDisk,
  memory: iconRam,
  ram: iconRam,
};

const SORT_FEATURES = ['cpus', 'vcpus', 'memory', 'disk'];

/** @type {AddonFeature[]} */
const SKELETON_FEATURES = [
  { name: '??????', value: '????????' },
  { name: '????', value: '??' },
  { name: '?????', value: '????' },
  { name: '???????', value: '????????' },
];

/**
 * @typedef {import('./cc-addon-features.types.js').AddonFeature} AddonFeature
 */

/**
 * A component to display an add-on set of features.
 *
 * ## Details
 *
 * * When `features` is nullish, a skeleton screen UI pattern is displayed (loading hint).
 * * We don't have a proper i18n and icon system for feature names. For the time being, the (lower cased) name is used as some kind of code to match an icon and maybe translate the name of the feature.
 * * We don't have a proper i18n system for feature values. For the time being, the (lower cased) value is used as some kind of code to maybe translate the value of the feature.
 *
 * @cssdisplay block
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

    /** @type {boolean} Displays an error message. */
    this.error = false;

    /** @type {AddonFeature[]} Sets the list features. */
    this.features = [];
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

        <div>${i18n('cc-addon-features.details')}</div>
        
        ${!this.error ? html`
          <div class="feature-list">
            ${features.map((feature) => html`
              <div class="feature ${classMap({ skeleton })}">
                ${feature.icon != null ? html`
                  <div class="feature-icon">
                    <cc-icon size="lg" class="feature-icon_img" .icon="${feature.icon}"></cc-icon>
                  </div>
                ` : ''}
                <div class="feature-name">${feature.name}</div>
                <div class="feature-value">${feature.value}</div>
              </div>
            `)}
          </div>
        ` : ''}

        ${this.error ? html`
          <cc-notice intent="warning" message="${i18n('cc-addon-features.loading-error')}"></cc-notice>
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
          --color: var(--cc-color-bg-primary);
          --padding: 0.6em;

          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .feature {
          display: flex;
          flex-wrap: wrap;
          border: var(--bdw) solid var(--color);
          background-color: var(--color);
          border-radius: calc(2 * var(--bdw));
        }

        .feature-icon {
          display: inline-flex;
          width: 1.3em;
          align-items: center;
          margin-inline-start: var(--padding);
        }

        .feature-icon_img {
          --cc-icon-color: var(--cc-color-text-inverted);
        }

        .feature-name,
        .feature-value {
          box-sizing: border-box;
          flex: 1 1 auto;
          padding: calc(var(--padding) / 2) var(--padding);
          font-weight: bold;
          text-align: center;
        }

        .feature-name {
          color: var(--cc-color-text-inverted, #fff);
        }

        .skeleton .feature-name {
          color: var(--color);
        }

        .feature-value {
          background-color: var(--cc-color-bg-default, #fff);
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
