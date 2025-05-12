import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import {
  iconCleverBaselineLimited as iconBaselineLimited,
  iconCleverBaselineNewly as iconBaselineNewly,
  iconCleverBaselineWidely as iconBaselineWidely,
} from '../../assets/cc-clever.icons.js';
import {
  iconRemixCalendarLine as iconDate,
  iconRemixCheckFill as iconSupported,
  iconRemixToolsFill as iconTools,
  iconRemixCloseFill as iconUnsupported,
  iconRemixHashtag as iconVersion,
  iconRemixAlertFill as iconWarning,
} from '../../assets/cc-remix.icons.js';
import { dispatchCustomEvent } from '../../lib/events.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import '../cc-icon/cc-icon.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

const TODAY = new Date();

/**
 * @typedef {import('./cc-web-features-tracker.types.js').WebFeaturesTrackerState} WebFeaturesTrackerState
 * @typedef {import('./cc-web-features-tracker.types.js').FeatureStatus} FeatureStatus
 * @typedef {import('./cc-web-features-tracker.types.js').FormattedFeature} FormattedFeature
 * @typedef {import('./cc-web-features-tracker.types.js').BrowserSupported} BrowserSupported
 * @typedef {import('./cc-web-features-tracker.types.js').BrowserUnsupported} BrowserUnsupported
 * @typedef {import('./cc-web-features-tracker.types.js').SkeletonWebFeature} SkeletonWebFeature
 * @typedef {import('../cc-toggle/cc-toggle.js').CcToggle} CcToggle
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcToggle & { value: 'all' | 'can-be-used' }>} EventWithTargetCcToggleFeatureFilter
 * @typedef {import('../../lib/events.types.js').EventWithTarget<CcToggle & { value: 'compact' | 'detailed' }>} EventWithTargetCcToggleDisplayMode
 */

/**
 * Component to display web tracked features.
 *
 * @cssdisplay block
 *
 * @fires {CustomEvent<{ displayControl: boolean, value: 'all' | 'can-be-used' }>} table-feature-filter-change
 * @fires {CustomEvent<{ displayControl: boolean, value: 'compact' | 'detailed' }>} table-display-mode-change
 */
export class CcWebFeaturesTracker extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      tableDisplayMode: { type: Object, state: true },
      tableFeatureFilter: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    /** @type {WebFeaturesTrackerState} */
    this.state = { type: 'loading', webFeatures: [] };

    /** @type {{ displayControl: boolean, value: 'all' | 'can-be-used' }} */
    this.tableFeatureFilter = { displayControl: true, value: 'all' };

    /** @type {{ displayControl: boolean, value: 'compact' | 'detailed' }} */
    this.tableDisplayMode = { displayControl: true, value: 'compact' };
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

  /** @param {EventWithTargetCcToggleFeatureFilter} event */
  _onFeatureFilterChange(event) {
    this.tableFeatureFilter = { ...this.tableFeatureFilter, value: event.target.value };
    dispatchCustomEvent(this, 'table-feature-filter-change', this.tableFeatureFilter);
  }

  /** @param {EventWithTargetCcToggleDisplayMode} event */
  _onDisplayModeChange(event) {
    this.tableDisplayMode = { ...this.tableDisplayMode, value: event.target.value };
    dispatchCustomEvent(this, 'table-display-mode-change', this.tableDisplayMode);
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="Something went wrong while retrieving data"></cc-notice>`;
    }

    if (this.state.webFeatures.length === 0) {
      return html`<div class="empty"><p>No Web Features to track</p></div>`;
    }

    const webFeatures =
      this.state.type === 'loaded'
        ? this.state.webFeatures
        : this.state.webFeatures.map(
            /**
             * @param {SkeletonWebFeature} skeletonWebFeature
             * @returns {FormattedFeature}
             */
            (skeletonWebFeature) => ({
              ...skeletonWebFeature,
              currentStatus: 'widely',
              canBeUsed: true,
              chromeSupport: { isSupported: true, releaseDate: TODAY, version: '100' },
              firefoxSupport: { isSupported: true, releaseDate: TODAY, version: '100' },
              safariSupport: { isSupported: true, releaseDate: TODAY, version: '10' },
            }),
          );
    const skeleton = this.state.type === 'loading';

    return this._renderFeaturesTable(webFeatures, skeleton);
  }

  /**
   * @param {FormattedFeature[]} formattedFeatures
   * @param {boolean} skeleton
   */
  _renderFeaturesTable(formattedFeatures, skeleton) {
    const filterFeatureChoices = [
      { label: 'All features', value: 'all' },
      { label: 'Can be used', value: 'can-be-used' },
    ];
    const displayModeChoices = [
      { label: 'Compact', value: 'compact' },
      { label: 'Detailed', value: 'detailed' },
    ];

    const filteredFeatures =
      this.tableFeatureFilter.value === 'all'
        ? formattedFeatures
        : formattedFeatures.filter((formattedFeature) => formattedFeature.canBeUsed);

    const hasCanBeUsedAsProgressive = formattedFeatures.some(
      (feature) => feature.isProgressiveEnhancement && feature.canBeUsed,
    );

    const hasCanBeUsedAsPolyfill = formattedFeatures.some((feature) => feature.canBeUsedWithPolyfill);

    const hasTableControls = this.tableFeatureFilter.displayControl || this.tableDisplayMode.displayControl;

    return html`
      ${hasCanBeUsedAsProgressive
        ? html`<cc-notice intent="warning">
            <div slot="message">Features with the warning icons should be used for progressive enhancement only</div>
          </cc-notice>`
        : ''}
      ${hasCanBeUsedAsPolyfill
        ? html`<cc-notice intent="warning">
            <cc-icon slot="icon" .icon=${iconTools} size="lg"></cc-icon>
            <div slot="message">Features with the tools icons can be used but requires a polyfill</div>
          </cc-notice>`
        : ''}
      ${hasTableControls
        ? html`
            <div class="table-controls">
              ${this.tableFeatureFilter.displayControl
                ? html`
                    <cc-toggle
                      .choices=${filterFeatureChoices}
                      .value="${this.tableFeatureFilter.value}"
                      @cc-toggle:input=${this._onFeatureFilterChange}
                    ></cc-toggle>
                  `
                : ''}
              ${this.tableDisplayMode.displayControl
                ? html`
                    <cc-toggle
                      .choices=${displayModeChoices}
                      .value="${this.tableDisplayMode.value}"
                      @cc-toggle:input=${this._onDisplayModeChange}
                    ></cc-toggle>
                  `
                : ''}
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

  /** @param {FormattedFeature} _ */
  _renderFeatureRow(
    {
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
    },
    skeleton,
  ) {
    const { a11yName, icon: baselineIcon } = this._getBaselineIcon(currentStatus);
    return html`
      <tr>
        <th>
          <div class="feature-name-th"><strong>${featureName}</strong><span class="comment">${comment}</span></div>
        </th>
        <td><span class="skeleton">${category}</span></td>
        <td>
          <div class="can-be-used">
            ${canBeUsed ? 'Yes' : 'No'}
            ${canBeUsedWithPolyfill
              ? html` <cc-icon .icon=${iconTools} a11y-name="With polyfill only" title="With polyfill only"></cc-icon> `
              : ''}
            ${isProgressiveEnhancement && currentStatus === 'newly'
              ? html`
                  <cc-icon
                    .icon=${iconWarning}
                    a11y-name="Progressive enhancement only"
                    title="Progressive enhancement only"
                  ></cc-icon>
                `
              : ''}
          </div>
        </td>
        <td>
          <div
            class="current-status ${classMap({
              'current-status--detailed': this.tableDisplayMode.value === 'detailed',
            })}"
          >
            <cc-icon
              class="current-status__icon"
              .icon="${baselineIcon}"
              a11y-name=${this.tableDisplayMode.value === 'compact' ? a11yName : ''}
              title=${this.tableDisplayMode.value === 'compact' ? a11yName : ''}
            ></cc-icon>
            <span>${this.tableDisplayMode.value === 'detailed' ? a11yName : ''}</span>
          </div>
        </td>
        <td>${this._renderBrowserSupport(chromeSupport)}</td>
        <td>${this._renderBrowserSupport(firefoxSupport)}</td>
        <td>${this._renderBrowserSupport(safariSupport)}</td>
      </tr>
    `;
  }

  /** @param {BrowserSupported|BrowserUnsupported} browserSupport */
  _renderBrowserSupport(browserSupport) {
    const className = browserSupport.isSupported ? 'supported' : 'unsupported';
    return html`
      <div class="browser-support">
        <cc-icon
          .icon=${browserSupport.isSupported ? iconSupported : iconUnsupported}
          class=${className}
          size="lg"
        ></cc-icon>
        ${browserSupport.isSupported && this.tableDisplayMode.value === 'detailed'
          ? html`
              <p><cc-icon .icon=${iconVersion} size="md"></cc-icon> <span>${browserSupport.version}</span></p>
              <p>
                <cc-icon .icon=${iconDate} size="md"></cc-icon>
                <span
                  >${browserSupport.releaseDate.toLocaleDateString('en-US', {
                    month: 'numeric',
                    year: 'numeric',
                  })}</span
                >
              </p>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      css`
        :host {
          display: grid;
          gap: 1em;
        }

        .skeleton {
          background-color: #bbb;
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
          border-collapse: collapse;
          border-radius: var(--cc-border-radius-small, 0.15em);
          display: block;
          overflow-x: auto;
          table-layout: fixed;
        }

        th,
        td {
          padding: 0.5em 1em;
          text-align: left;
        }

        thead th {
          background-color: var(--cc-color-bg-neutral-alt, #eee);
          color: var(--cc-color-text-strongest);
          min-width: max-content;
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
        }

        .comment {
          font-style: italic;
          font-weight: normal;
        }

        .current-status {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .current-status--detailed {
          flex-direction: column;
          text-align: center;
        }

        .current-status__icon {
          flex: 0 0 auto;
          height: 1.5em;
          width: auto;
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

        .browser-support {
          display: grid;
          gap: 0.5em;
        }

        .browser-support p {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-web-features-tracker', CcWebFeaturesTracker);
