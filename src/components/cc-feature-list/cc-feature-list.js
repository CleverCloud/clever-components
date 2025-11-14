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
 * @import { Feature, FeatureListState, FeatureStatus } from './cc-feature-list.types.d.ts'
 * @import { TemplateResult } from 'lit'
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
   * @param {string} newValue
   */
  _onToggleChange(feature, newValue) {
    if (this.state.type === 'loading') {
      return;
    }

    this.dispatchEvent(new CcFeatureSettingChangeEvent({ featureId: feature.id, newValue }));
  }

  /**
   * @param {FeatureStatus} status
   * @return {{text: string, intent: string}}
   * @private
   */
  _getFeatureStatus(status) {
    switch (status) {
      case 'alpha':
        return { text: i18n('cc-feature-list.status.alpha'), intent: 'warning' };
      case 'beta':
        return { text: i18n('cc-feature-list.status.beta'), intent: 'info' };
      case 'preview':
        return { text: i18n('cc-feature-list.status.preview'), intent: '' };
      default:
        return null;
    }
  }

  /**
   * @param {Feature} feature
   * @return {TemplateResult<1>}
   * @private
   */
  _renderFeature(feature) {
    const featureStatus = this._getFeatureStatus(feature.status);
    return html`
      <div class="feature">
        <div class="header">
          <div class="header-title">
            <div class="title">${feature.name}</div>
            <div class="status">
              ${feature.status
                ? html` <cc-badge intent="${featureStatus.intent}"> ${featureStatus.text} </cc-badge> `
                : ''}
            </div>
          </div>
          <cc-toggle
            .choices="${feature.options}"
            value="${feature.value}"
            @cc-select=${(/** @type {CcSelectEvent} */ event) => this._onToggleChange(feature, event.detail)}
          ></cc-toggle>
        </div>
        <div>${feature.description}</div>
        ${feature.documentationLink != null || feature.feedbackLink != null
          ? html`
              <div class="footer">
                ${feature.documentationLink != null
                  ? html`
                      <cc-link
                        .href=${feature.documentationLink}
                        a11y-desc="${i18n('cc-feature-list.documentation-link')} - ${feature.name}"
                        .icon=${iconInfo}
                      >
                        ${i18n('cc-feature-list.documentation-link')}
                      </cc-link>
                    `
                  : ''}
                ${feature.feedbackLink != null
                  ? html`
                      <cc-link
                        .href=${feature.feedbackLink}
                        a11y-desc="${i18n('cc-feature-list.feedback-link')} - ${feature.name}"
                        .icon=${iconMessage}
                      >
                        ${i18n('cc-feature-list.feedback-link')}
                      </cc-link>
                    `
                  : ''}
              </div>
            `
          : ''}
      </div>
    `;
  }

  render() {
    const isFeatureListEmpty = this.state.type === 'loaded' && this.state.featureList.length === 0;
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-feature-list.title')}</div>
        <div slot="content">
          ${this.state.type === 'loaded' && !isFeatureListEmpty
            ? html`<cc-notice message=${i18n('cc-feature-list.notice')}></cc-notice>`
            : ''}
          <div class="feature-list">
            ${this.state.type === 'loading' ? html` <cc-loader></cc-loader>` : ''}
            ${this.state.type === 'error'
              ? html` <cc-notice intent="warning" message=${i18n('cc-feature-list.error')}></cc-notice> `
              : ''}
            ${this.state.type === 'loaded' && isFeatureListEmpty
              ? html` <cc-notice intent="info" message=${i18n('cc-feature-list.no-data')}></cc-notice> `
              : ''}
            ${this.state.type === 'loaded' && !isFeatureListEmpty
              ? this.state.featureList.map((feature) => this._renderFeature(feature))
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
        :host {
          display: block;
        }

        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
          margin-top: 1em;
        }

        .feature {
          border: solid 1px var(--cc-color-border-neutral-weak, #e7e7e7);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-direction: column;
          gap: 0.6em;
          padding: 1em;
        }

        .feature .header {
          align-items: center;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.5em;
          justify-content: space-between;
        }

        .feature .header-title {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.75em;
        }

        .feature .title {
          font-weight: bold;
        }

        .feature .footer {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 0.75em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-feature-list', CcFeatureList);
