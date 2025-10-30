import { css, html, LitElement } from 'lit';
import {
  iconRemixInformationFill as iconInfo,
  iconRemixMessageLine as iconMessage,
} from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block/cc-block.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';
import { CcFeatureSettingChangeEvent } from './cc-feature-list.events.js';

/**
 * @typedef {import('./cc-feature-list.types.d.ts').Feature} Feature
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListState} FeatureListState
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListStateLoading} FeatureListStateLoading
 * @typedef {import('./cc-feature-list.types.d.ts').FeatureListStateLoaded} FeatureListStateLoaded
 */

/**
 * A component to display a list of feature flags and to manage their activation.
 *
 * @cssdisplay block
 */
export class CcFeatureList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {FeatureListState} Set the state of the component */
    this.state = { type: 'loading' };
  }

  /**
   * @param {Feature} feature
   * @param {String} newValue
   */
  _onToggleChange(feature, newValue) {
    if (this.state.type === 'loading') {
      return;
    }

    this.dispatchEvent(new CcFeatureSettingChangeEvent({ featureId: feature.id, newValue }));
  }

  /**
   * @param {Feature} feature
   */
  renderFeature(feature) {
    let featureStatus;
    switch (feature.status) {
      case 'alpha':
        featureStatus = 'warning';
        break;
      case 'beta':
        featureStatus = 'info';
        break;
      default:
        featureStatus = '';
        break;
    }
    return html`
      <cc-block class="feature">
        <div slot="header-title">
          ${feature.name}
          ${feature.status ? html` <cc-badge intent="${featureStatus}"> ${feature.status} </cc-badge> ` : ''}
        </div>
        <div slot="content">${feature.description}</div>
        ${feature.documentationLink || feature.feedbackLink
          ? html`
              <div slot="footer">
                ${feature.documentationLink
                  ? html`
                      <cc-link
                        .href=${feature.documentationLink}
                        a11y-desc="Go to documentation page"
                        .icon=${iconInfo}
                      >
                        ${i18n('cc-feature-list.documentation-link')}
                      </cc-link>
                    `
                  : ''}
                ${feature.feedbackLink
                  ? html`
                      <cc-link .href=${feature.feedbackLink} a11y-desc="Go to feedback page" .icon=${iconMessage}>
                        ${i18n('cc-feature-list.feedback-link')}
                      </cc-link>
                    `
                  : ''}
              </div>
            `
          : ''}
        <div slot="header-right">
          <cc-toggle
            .choices="${feature.options}"
            value="${feature.value}"
            @cc-select=${(/** @type {CcSelectEvent} */ event) => this._onToggleChange(feature, event.detail)}
          ></cc-toggle>
        </div>
      </cc-block>
    `;
  }

  render() {
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-feature-list.title')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-feature-list.intro')}</p>
          <div class="feature-list">
            ${this.state.type === 'loading' ? html` <cc-loader></cc-loader>` : ''}
            ${this.state.type === 'error'
              ? html` <cc-notice intent="warning" message=${i18n('cc-feature-list.error')}></cc-notice> `
              : ''}
            ${this.state.type === 'loaded'
              ? this.state.features.length > 0
                ? this.state.features.map((feature) => this.renderFeature(feature))
                : html` <cc-notice intent="info" message=${i18n('cc-feature-list.no-data')}></cc-notice> `
              : ''}
          </div>
        </div>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        .intro {
          margin: 0;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          margin-top: 1em;
        }

        .feature [slot='footer'],
        .feature [slot='header-title'] {
          display: flex;
          flex-direction: row;
          gap: 1em;
        }

        .feature [slot='header-right'] {
          align-items: center;
          display: flex;
        }
      `,
    ];
  }
}

window.customElements.define('cc-feature-list', CcFeatureList);
