import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconCleverBaselineLimited as iconBaselineLimited,
  iconCleverBaselineNewly as iconBaselineNewly,
  iconCleverBaselineWidely as iconBaselineWidely,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixCalendarLine as iconDate,
  iconRemixArrowDownSLine as iconDown,
  iconRemixCheckFill as iconSupported,
  iconRemixToolsFill as iconTools,
  iconRemixCloseFill as iconUnsupported,
  iconRemixHashtag as iconVersion,
  iconRemixAlertFill as iconWarning,
} from '../../assets/cc-remix.icons.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

const TODAY = new Date();

/**
 * @import { WebFeaturesTrackerState, FeatureStatus, FormattedFeature, BrowserSupported, BrowserUnsupported } from './cc-web-features-tracker.types.js'
 * @import { PropertyValues } from 'lit'
 */

/**
 * Component to display web tracked features.
 *
 * This component presents a table of web features with their support status across
 * different browsers (Chrome, Firefox, Safari). It shows whether features:
 * - Can be used in production,
 * - May be used even if only newly available (as progressive enhancement),
 * - Requires polyfills,
 * - Have different baseline support status (widely available, newly available, or limited availability).
 *
 * Features can be filtered to show only those that can be used, and each feature
 * row can be expanded to show more detailed information including version numbers
 * and release dates.
 *
 * **Attribution**: Baseline icons are trademarks owned by Google, licensed under Creative Commons Attribution No Derivatives 4.0 License.
 *
 * @cssdisplay block
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      tableFeatureFilter: { type: Object, state: true },
      _webFeatures: { type: Array, state: true },
    };
  }

  constructor() {
    super();

    /** @type {WebFeaturesTrackerState} */
    this.state = { type: 'loading', webFeatures: [] };

    /** @type {{ displayControl: boolean, value: 'all' | 'can-be-used' }} */
    this.tableFeatureFilter = { displayControl: true, value: 'all' };

    /** @type {Array<FormattedFeature & { displayMode: 'compact' | 'detailed' }>} */
    this._webFeatures = [];
  }

  /**
   * @param {FeatureStatus} status
   */
  _getBaselineIcon(status) {
    switch (status) {
      case 'widely':
        return { icon: iconBaselineWidely, a11yName: 'Widely supported' };
      case 'newly':
        return { icon: iconBaselineNewly, a11yName: 'Newly supported' };
      case 'limited':
        return { icon: iconBaselineLimited, a11yName: 'Limited availability' };
    }
  }

  /** @param {CcSelectEvent<'all' | 'can-be-used'>} event */
  _onFeatureFilterChange({ detail: value }) {
    this.tableFeatureFilter = { ...this.tableFeatureFilter, value };
  }

  /** @param {string} featureId */
  _onDisplayModeChange(featureId) {
    this._webFeatures = this._webFeatures.map((webFeature) => {
      if (webFeature.featureId === featureId) {
        return {
          ...webFeature,
          displayMode: webFeature.displayMode === 'compact' ? 'detailed' : 'compact',
        };
      }
      return webFeature;
    });
  }

  /** @param {PropertyValues<CcWebFeaturesTracker>} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded') {
      this._webFeatures = this.state.webFeatures.map((webFeature) => ({
        ...webFeature,
        displayMode: 'compact',
      }));
    }
    if (changedProperties.has('state') && this.state.type === 'loading') {
      this._webFeatures = this.state.webFeatures.map((webFeature) => ({
        ...webFeature,
        currentStatus: 'widely',
        canBeUsed: true,
        chromeSupport: { isSupported: true, releaseDate: TODAY, version: '100' },
        firefoxSupport: { isSupported: true, releaseDate: TODAY, version: '100' },
        safariSupport: { isSupported: true, releaseDate: TODAY, version: '10' },
        displayMode: 'compact',
      }));
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="Something went wrong while retrieving data"></cc-notice>`;
    }

    if (this.state.type === 'loaded' && this.state.webFeatures.length === 0) {
      return html`<div class="empty"><p>No Web Features to track</p></div>`;
    }

    const skeleton = this.state.type === 'loading';

    return this._renderFeaturesTable(this._webFeatures, skeleton);
  }

  /**
   * @param {Array<FormattedFeature & { displayMode: 'detailed' | 'compact' }>} formattedFeatures
   * @param {boolean} skeleton
   */
  _renderFeaturesTable(formattedFeatures, skeleton) {
    const filterFeatureChoices = [
      { label: 'All features', value: 'all' },
      { label: 'Can be used', value: 'can-be-used' },
    ];
    const filteredFeatures =
      this.tableFeatureFilter.value === 'all'
        ? formattedFeatures
        : formattedFeatures.filter((formattedFeature) => formattedFeature.canBeUsed);

    const hasCanBeUsedAsProgressive = formattedFeatures.some(
      (feature) => feature.isProgressiveEnhancement && feature.canBeUsed,
    );

    const hasCanBeUsedAsPolyfill = formattedFeatures.some((feature) => feature.canBeUsedWithPolyfill);

    return html`
      ${hasCanBeUsedAsProgressive
        ? html`<cc-notice intent="warning">
            <div slot="message">Features with the warning icons should be used for progressive enhancement only</div>
          </cc-notice>`
        : ''}
      ${hasCanBeUsedAsPolyfill
        ? html`<cc-notice intent="warning">
            <cc-icon slot="icon" class="notice-icon" .icon=${iconTools} size="lg"></cc-icon>
            <div slot="message">Features with the tools icons can be used but requires a polyfill</div>
          </cc-notice>`
        : ''}
      ${this.tableFeatureFilter.displayControl
        ? html`
            <div class="table-controls">
              <cc-toggle
                .choices=${filterFeatureChoices}
                .value="${this.tableFeatureFilter.value}"
                @cc-select=${this._onFeatureFilterChange}
              ></cc-toggle>
            </div>
          `
        : ''}
      <table tabindex="0">
        <thead>
          <tr>
            <th>Feature</th>
            <th>Category</th>
            <th>Can be used</th>
            <th>Baseline</th>
            <th>Chrome</th>
            <th>Firefox</th>
            <th>Safari</th>
          </tr>
        </thead>
        <tbody>
          ${filteredFeatures.map((feature) => this._renderFeatureRow(feature, skeleton))}
        </tbody>
      </table>
    `;
  }

  /**
   * @param {FormattedFeature & { displayMode: 'compact' | 'detailed'}} _
   * @param {boolean} skeleton
   */
  _renderFeatureRow(
    {
      featureId,
      isProgressiveEnhancement,
      canBeUsedWithPolyfill,
      comment,
      category,
      canBeUsed,
      chromeSupport,
      currentStatus,
      featureName,
      firefoxSupport,
      safariSupport,
      displayMode,
    },
    skeleton,
  ) {
    const { a11yName, icon: baselineIcon } = this._getBaselineIcon(currentStatus);
    const isDisplayModeDetailed = displayMode === 'detailed';
    const featureInfoToggleText = !isDisplayModeDetailed ? 'Display detailed info' : 'Hide detailed info';
    return html`
      <tr class="${classMap({ 'row--detailed': isDisplayModeDetailed })}">
        <th>
          <div class="feature-name-th">
            <div class="feature-name-th__btn-and-name">
              <button
                class="feature-name-th__btn-and-name__btn"
                @click="${() => this._onDisplayModeChange(featureId)}"
                title="${featureInfoToggleText}"
                ?disabled="${skeleton}"
              >
                <cc-icon .icon=${iconDown}></cc-icon>
                <span class="visually-hidden">${featureInfoToggleText}</span>
              </button>
              <strong class="${classMap({ skeleton })}">${featureName}</strong>
            </div>
            <span class="comment ${classMap({ hidden: !isDisplayModeDetailed })}">${comment}</span>
          </div>
        </th>
        <td><span class="${classMap({ skeleton })}">${category}</span></td>
        <td>
          <div class="can-be-used ${classMap({ skeleton })}">
            ${canBeUsed ? 'Yes' : 'No'}
            ${canBeUsedWithPolyfill
              ? html`
                  <cc-icon
                    .icon=${iconTools}
                    a11y-name="With polyfill only"
                    title="With polyfill only"
                    ?skeleton="${skeleton}"
                  ></cc-icon>
                `
              : ''}
            ${isProgressiveEnhancement && currentStatus === 'newly'
              ? html`
                  <cc-icon
                    .icon=${iconWarning}
                    a11y-name="Progressive enhancement only"
                    title="Progressive enhancement only"
                    ?skeleton="${skeleton}"
                  ></cc-icon>
                `
              : ''}
          </div>
        </td>
        <td>
          <div class="current-status ${classMap({ skeleton })}">
            <cc-icon
              class="current-status__icon"
              .icon="${baselineIcon}"
              a11y-name="${!isDisplayModeDetailed ? a11yName : ''}"
              title="${!isDisplayModeDetailed ? a11yName : ''}"
            ></cc-icon>
            <span class="${classMap({ hidden: !isDisplayModeDetailed })}"> ${a11yName} </span>
          </div>
        </td>
        <td>${this._renderBrowserSupport(chromeSupport, skeleton, isDisplayModeDetailed)}</td>
        <td>${this._renderBrowserSupport(firefoxSupport, skeleton, isDisplayModeDetailed)}</td>
        <td>${this._renderBrowserSupport(safariSupport, skeleton, isDisplayModeDetailed)}</td>
      </tr>
    `;
  }

  /**
   * @param {BrowserSupported|BrowserUnsupported} browserSupport
   * @param {boolean} skeleton
   * @param {boolean} isDisplayModeDetailed
   */
  _renderBrowserSupport(browserSupport, skeleton, isDisplayModeDetailed) {
    const className = browserSupport.isSupported ? 'supported' : 'unsupported';
    return html`
      <div class="browser-support">
        <cc-icon
          .icon=${browserSupport.isSupported ? iconSupported : iconUnsupported}
          class=${className}
          size="lg"
          ?skeleton="${skeleton}"
        ></cc-icon>
        ${browserSupport.isSupported
          ? html`
              <p class="${classMap({ hidden: !isDisplayModeDetailed })}">
                <cc-icon .icon=${iconVersion} size="md"></cc-icon>
                <span>${browserSupport.version}</span>
              </p>
              <p class="${classMap({ hidden: !isDisplayModeDetailed })}">
                <cc-icon .icon=${iconDate} size="md"></cc-icon>
                <span>
                  ${browserSupport.releaseDate.toLocaleDateString('en-US', {
                    month: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </p>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      accessibilityStyles,
      css`
        :host {
          display: grid;
          gap: 1em;
        }

        * {
          box-sizing: border-box;
        }

        .skeleton {
          background-color: #bbb;
        }

        .hidden {
          height: 0;
          visibility: hidden;
        }

        p {
          margin: 0;
        }

        .empty {
          border: solid 1px var(--cc-color-border-neutral-weak, #eee);
          padding: 2em;
          text-align: center;
        }

        .table-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        table {
          align-content: center;
          display: grid;
          grid-template-columns: 1fr min-content min-content min-content min-content min-content min-content;
          overflow-x: auto;
          overflow-y: hidden;
        }

        thead,
        tbody,
        tr {
          display: contents;
        }

        th,
        td {
          align-items: center;
          display: grid;
          padding: 0.5em 1em;
          text-align: left;
        }

        thead th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
          min-width: max-content;
          padding: 1em;
        }

        tbody th,
        tbody td {
          background-color: var(--cc-color-bg-neutral, #ddd);
          color: var(--cc-color-text-default, #000);
        }

        tr:not(:last-child) td,
        tbody tr:not(:last-child) th {
          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #eee);
        }

        .feature-name-th {
          display: grid;
          gap: 0.5em;
        }

        .feature-name-th__btn-and-name {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .feature-name-th__btn-and-name__btn {
          background: none;
          background-color: var(--cc-color-bg-default, #fff);
          border: solid 1px var(--cc-color-border-neutral);
          border-radius: var(--cc-border-radius-small, 0.15em);
          box-shadow: 0 0 0 0 rgb(255 255 255 / 0%);
          cursor: pointer;
          display: flex;
          padding: 0.3em;
          transition: box-shadow 75ms ease-in-out;
        }

        .feature-name-th__btn-and-name__btn cc-icon {
          transition: transform 0.3s ease-in-out;
        }

        .feature-name-th__btn-and-name__btn:hover {
          box-shadow: 0 1px 2px rgb(0 0 0 / 40%);
        }

        .feature-name-th__btn-and-name__btn:focus-visible {
          outline: var(--cc-focus-outline);
          outline-offset: var(--cc-focus-outline-offset);
        }

        .row--detailed .feature-name-th__btn-and-name__btn cc-icon {
          transform: rotate(180deg);
          transition: transform 0.3s ease-in-out;
        }

        .comment {
          font-style: italic;
          font-weight: normal;
        }

        .current-status {
          align-items: center;
          display: grid;
          gap: 0.5em;
          text-align: center;
        }

        .current-status__icon {
          flex: 0 0 auto;
          height: 1.5em;
          width: auto;
        }

        .skeleton .current-status__icon {
          /* FIXME: temporary workaround because the skeleton mode of the cc-icon doesn't support non square icons so we change the parent container to skeleton and hide the svg with opacity */
          opacity: 0;
        }

        .supported {
          --cc-icon-color: var(--cc-color-text-success);
        }

        .unsupported {
          --cc-icon-color: var(--cc-color-text-danger);
        }

        .can-be-used {
          --cc-icon-color: var(--cc-color-text-warning);

          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .notice-icon {
          --cc-icon-color: var(--cc-color-text-warning);
        }

        .browser-support {
          display: grid;
        }

        .row--detailed .browser-support {
          gap: 0.5em;
        }

        .browser-support p {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .browser-support cc-icon {
          justify-self: center;
        }
      `,
    ];
  }
}

window.customElements.define('cc-web-features-tracker', CcWebFeaturesTracker);
