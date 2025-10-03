import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddFill as iconAdd,
  iconRemixArchiveLine as iconBucket,
  iconRemixCloseLine as iconClose,
  iconRemixDeleteBin_6Line as iconDelete,
  iconRemixMoreFill as iconMore,
} from '../../assets/cc-remix.icons.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { formatBytesSize } from '../../lib/utils.js';
import { i18n } from '../../translations/translation.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import {
  CcCellarBucketCreateEvent,
  CcCellarBucketDeleteEvent,
  CcCellarBucketHideEvent,
  CcCellarBucketShowEvent,
} from './cc-cellar-explorer.events.js';

/**
 * @typedef {import('./cc-cellar-explorer.types.js').CellarExplorerState} CellarExplorerState
 * @typedef {import('./cc-cellar-explorer.types.js').CellarExplorerItemsListState} CellarExplorerItemsListState
 * @typedef {import('./cc-cellar-explorer.types.js').CellarExplorerItemsListStateBucketsLoaded} CellarExplorerItemsListStateBucketsLoaded
 * @typedef {import('./cc-cellar-explorer.types.js').CellarItemStateBucket} CellarItemStateBucket
 * @typedef {import('lit').TemplateResult<1>} TemplateResult
 */

/**
 * A component that allows to navigate through a Cellar addon.
 *
 * @cssdisplay block
 */
export class CcCellarExplorer extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CellarExplorerState} Sets state. */
    this.state = { type: 'loading' };

    this._createBucketFormRef = createRef();
  }

  /**
   * @param {{bucketName: string}} formData
   */
  _onCreateBucketRequested({ bucketName }) {
    this.dispatchEvent(new CcCellarBucketCreateEvent({ bucketName }));
  }

  /**
   * @param {string} bucketName
   */
  _onDisplayBucketDetailRequested(bucketName) {
    this.dispatchEvent(new CcCellarBucketShowEvent(bucketName));
  }

  /**
   * @param {string} bucketName
   */
  _onHideBucketDetailRequested(bucketName) {
    this.dispatchEvent(new CcCellarBucketHideEvent(bucketName));
  }

  /**
   * @param {string} bucketName
   */
  _onDeleteBucketRequested(bucketName) {
    this.dispatchEvent(new CcCellarBucketDeleteEvent(bucketName));
  }

  render() {
    if (this.state.type === 'loading') {
      // todo i18n + spinner
      return html` Loading... `;
    }
    if (this.state.type === 'error') {
      // todo i18n
      return html`<cc-notice intent="warning" message=" Error while loading component"></cc-notice>`;
    }

    return html`<div class="wrapper">
      ${this._renderListTop(this.state.list)} ${this._renderList(this.state.list)}
      ${this._renderDetail(this.state.list)}
    </div>`;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderListTop(state) {
    if (state.level === 'buckets') {
      return this._renderListTopForBuckets(state);
    }

    return html``;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderListTopForBuckets(state) {
    // todo: do we need to display the buckets count ?
    if (state.level === 'buckets') {
      return html`
        <div class="list-top">
          <div class="list-title">List of buckets<!-- todo i18n --></div>
          <div>
            <!-- todo put this into a modal (keep only the button to open the modal) -->
            <!-- todo make the bucketName required -->
            <!-- todo handle error messages coming from the server -->
            <form ${formSubmit(this._onCreateBucketRequested.bind(this))} ${ref(this._createBucketFormRef)}>
              <cc-input-text inline label="Bucket Name" name="bucketName"></cc-input-text>
              <cc-button primary type="submit" .icon=${iconAdd}>Create Bucket<!-- todo i18n --></cc-button>
            </form>
          </div>
        </div>
      `;
    }

    return html``;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderList(state) {
    if (state.level === 'buckets') {
      return this._renderListOfBuckets(state);
    }

    return html``;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderListOfBuckets(state) {
    if (state.type === 'loading') {
      // todo i18n
      return html` Loading list of buckets... `;
    }
    if (state.type === 'error') {
      // todo i18n
      return html`<cc-notice intent="warning" message="Error while loading the list of buckets"></cc-notice>`;
    }

    if (state.items.length === 0) {
      // todo special display when no buckets
    }

    return html`<div class="list-wrapper">
      <div class="list-row list-head">
        <div class="list-cell list-main-cell">Bucket name<!-- todo i18n --></div>
        <div class="list-cell list-secondary-cell">Last update<!-- todo i18n --></div>
        <div class="list-cell list-secondary-cell">Size<!-- todo i18n --></div>
        <div class="list-cell list-secondary-cell">Number of objects<!-- todo i18n --></div>
        <div class="list-cell list-icon-cell"></div>
      </div>
      <div class="list-body">${state.items.map((bucket) => this._renderBucketRow(bucket))}</div>
    </div>`;
  }

  /**
   *
   * @param {CellarItemStateBucket} bucketState
   * @returns {TemplateResult}
   */
  _renderBucketRow(bucketState) {
    return html`
      <div class="list-row">
        <div class="list-cell list-main-cell">
          <!-- todo add some space before the clipboard -->
          <cc-icon .icon=${iconBucket}></cc-icon>${bucketState.name}<cc-clipboard
            value="${bucketState.name}"
          ></cc-clipboard>
        </div>
        <div class="list-cell list-secondary-cell">${this._renderDate(bucketState.lastUpdatedDate)}</div>
        <div class="list-cell list-secondary-cell">${formatBytesSize(bucketState.sizeInBytes)}</div>
        <!-- todo align right !! -->
        <div class="list-cell list-secondary-cell list-cell-align-right">${bucketState.objectsCount}</div>
        <div class="list-cell list-icon-cell">
          <cc-button
            .icon=${iconMore}
            hide-text
            .waiting="${bucketState.state === 'showing'}"
            @cc-click=${() => this._onDisplayBucketDetailRequested(bucketState.name)}
          ></cc-button>
        </div>
      </div>
    `;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderDetail(state) {
    if (state.type === 'loading' || state.type === 'error') {
      return html``;
    }
    if (state.level === 'buckets') {
      return this._renderDetailForBucket(state);
    }
    return html``;
  }

  /**
   * @param {CellarExplorerItemsListStateBucketsLoaded} state
   * @returns {TemplateResult}
   */
  _renderDetailForBucket(state) {
    const bucketState = state.items.find(
      (bucketState) => bucketState.state === 'shown' || bucketState.state === 'deleting',
    );
    if (bucketState == null) {
      return html``;
    }

    return html`<div class="details-wrapper">
      <div class="details-top">
        <div class="details-title">Bucket details<!-- todo i18n --></div>
        <!-- todo remove the button border => should it be a cc-button facility? -->
        <cc-button
          .icon=${iconClose}
          hide-text
          @cc-click=${() => this._onHideBucketDetailRequested(bucketState.name)}
        ></cc-button>
      </div>

      <div class="details-icon-wrapper">
        <cc-icon .icon=${iconBucket}></cc-icon>
        <div>${bucketState.name}</div>
      </div>

      ${bucketState.objectsCount === 0
        ? html`
            <div class="details-sub-title">Actions<!-- todo i18n --></div>
            <div>
              <!-- todo stretch the button -->
              <!-- todo add a confirmation modal -->
              <cc-button
                danger
                .icon=${iconDelete}
                @cc-click=${() => this._onDeleteBucketRequested(bucketState.name)}
                .waiting=${bucketState.state === 'deleting'}
                >Delete bucket<!-- todo i18n --></cc-button
              >
            </div>
          `
        : ''}

      <div class="details-sub-title">Bucket overview</div>

      <dl class="details-overview-list">
        <div>
          <!-- todo i18n -->
          <dt><span>Domain</span></dt>
          <!-- todo make the server handler this -->
          <dd>todo.example.com</dd>
        </div>
        <div>
          <!-- todo i18n -->
          <dt><span>Number of objects</span></dt>
          <!-- todo render formatted number with Intl -->
          <dd>${bucketState.objectsCount}</dd>
        </div>
        <div>
          <!-- todo i18n -->
          <dt><span>Size</span></dt>
          <dd>${formatBytesSize(bucketState.sizeInBytes)}</dd>
        </div>
        <div>
          <!-- todo i18n -->
          <dt><span>Creation date</span></dt>
          <!-- todo render full date with time -->
          <dd>${this._renderDate(bucketState.creationDate)}</dd>
        </div>
        <div>
          <!-- todo i18n -->
          <dt><span>Last modify</span></dt>
          <!-- todo render full date with time -->
          <dd>${this._renderDate(bucketState.lastUpdatedDate)}</dd>
        </div>
        <div>
          <!-- todo i18n -->
          <dt><span>Versioning</span></dt>
          <!-- todo i18n (3 possible values: disabled, enabled, suspended) -->
          <dd>${bucketState.versioning}</dd>
        </div>
      </dl>
    </div>`;
  }

  /**
   * @param {string} date
   */
  _renderDate(date) {
    return i18n('cc-cellar-explorer.date', { date });
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          position: relative;
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: calc(100% - 2em);
          display: flex;
          flex-direction: column;
          padding: 1em;
          gap: 1em;
        }

        .list-top {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
        }

        .list-title {
          font-weight: 700;
          font-size: 1.2em;
          flex: 1;
          color: var(--cc-color-text-primary-strongest, #000);
        }

        .list-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: auto;
          border: 1px solid var(--cc-color-border-neutral-weak, #aaa);
          border-radius: var(--cc-border-radius-small, 0.15em);
        }

        .list-wrapper .list-head {
          background-color: var(--cc-color-bg-neutral);

          border-bottom: 1px solid var(--cc-color-border-neutral-weak, #aaa);
          display: flex;
        }

        .list-wrapper .list-body {
          flex: 1;
          overflow: auto;
        }

        .list-wrapper .list-cell {
          display: flex;
          align-items: center;
          padding: 0.75em 1.5em;
        }

        .list-wrapper .list-cell cc-icon {
          margin-right: 1em;
        }

        .list-wrapper .list-row {
          display: flex;
        }

        .list-wrapper .list-main-cell {
          flex: 1;
        }

        .list-wrapper .list-secondary-cell {
          width: 10em;
        }

        .list-wrapper .list-icon-cell {
          width: 2em;
        }

        .list-wrapper .list-cell-align-right {
          text-align: right;
        }

        .list-wrapper div {
          padding: 0.25em;
        }

        .details-wrapper {
          --padding: 2em;
          --margin: 0.5em;

          background-color: var(--cc-color-bg-default, #fff);
          position: absolute;
          z-index: 10;
          top: var(--margin);
          right: var(--margin);
          display: flex;
          flex-direction: column;
          height: calc(100% - 2 * (var(--padding) + var(--margin)));
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          padding: var(--padding);
        }

        .details-wrapper .details-top {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
          padding-bottom: 0.5em;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
        }

        .details-wrapper .details-title {
          font-weight: 700;
          font-size: 1.2em;
          flex: 1;
          color: var(--cc-color-text-primary-strongest, #000);
        }

        .details-wrapper .details-icon-wrapper {
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          display: flex;
          flex-direction: column;
          align-content: center;
          align-items: center;
          color: var(--cc-color-text-primary-strongest, #000);
          padding: 1em;
          gap: 1em;
          font-weight: 700;
        }

        .details-wrapper .details-icon-wrapper cc-icon {
          width: 5em;
          height: 5em;
        }

        .details-wrapper .details-sub-title {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
          margin-top: 2em;
          padding-bottom: 0.5em;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
          font-weight: 700;
        }

        .details-wrapper .details-overview-list {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .details-wrapper .details-overview-list dt {
          font-weight: 700;
        }

        .details-wrapper .details-overview-list div {
          display: flex;
          flex-direction: column;
          gap: 0.25em;
        }

        .details-wrapper .details-overview-list dd {
          padding: 0;
          margin: 0;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-explorer-beta', CcCellarExplorer);
