import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixAddFill as iconAdd,
  iconRemixArchiveLine as iconBucket,
  iconRemixDeleteBin_6Line as iconDelete,
  iconRemixSearchLine as iconFilter,
  iconRemixMoreFill as iconMore,
} from '../../assets/cc-remix.icons.js';
import { FormErrorFocusController } from '../../lib/form/form-error-focus-controller.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { isStringEmpty, random, randomString } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-drawer/cc-drawer.js';
import '../cc-grid/cc-grid.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import {
  CcCellarBucketCreateEvent,
  CcCellarBucketDeleteEvent,
  CcCellarBucketFilterEvent,
  CcCellarBucketHideEvent,
  CcCellarBucketShowEvent,
  CcCellarBucketSortEvent,
} from './cc-cellar-explorer.events.js';

/**
 * @import { CellarExplorerState, CellarExplorerItemsListState, CellarBucketState, CellarBucketDetailsState, CellarBucketCreateFormState, CellarBucketSortColumn, CellarBucketVersioning } from './cc-cellar-explorer.types.js'
 * @import { CcGrid } from '../cc-grid/cc-grid.js'
 * @import { CcGridColumnDefinition } from '../cc-grid/cc-grid.types.js'
 * @import { CcGridSortEvent } from '../cc-grid/cc-grid.events.js'
 * @import { TemplateResult } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/** @type {Array<CellarBucketState>} */
const SKELETON_BUCKETS = [...Array(5)].map(() => ({
  type: 'bucket',
  state: 'idle',
  name: randomString(random(10, 15)),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  sizeInBytes: random(150_000, 2_000_000),
  objectsCount: random(1_000, 1_000_000),
}));

const NUMBER_OF_BUCKETS_ENABLING_FILTERING = 5;

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

    /** @type {Ref<HTMLFormElement>} */
    this._createBucketFormRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._createBucketButtonRef = createRef();

    /** @type {Ref<CcGrid>} */
    this._bucketGridRef = createRef();

    new FormErrorFocusController(this, this._createBucketFormRef, () => {
      if (this.state.type === 'loaded' && this.state.list.type === 'loaded') {
        return this.state.list.createForm?.error;
      }
      return null;
    });
  }

  /**
   * @param {CellarBucketState} bucket
   */
  scrollToBucket(bucket) {
    if (this.state.type === 'loaded' && this.state.list.type === 'loaded') {
      this.updateComplete.then(() => {
        this._bucketGridRef.value.scrollToItem(bucket);
      });
    }
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

  _onCloseBucketDetails() {
    this.dispatchEvent(new CcCellarBucketHideEvent());
  }

  /**
   * @param {string} bucketName
   */
  _onDeleteBucketRequested(bucketName) {
    // todo: add confirmation modal (use cc-dialog)
    this.dispatchEvent(new CcCellarBucketDeleteEvent(bucketName));
  }

  _onGridFocusLost() {
    this._createBucketButtonRef.value.focus();
  }

  /**
   * @param {CcGridSortEvent} event
   */
  _onGridSort(event) {
    const { columnIndex, direction } = event.detail;

    /** @type {CellarBucketSortColumn} */
    let column = 'name';
    if (columnIndex === 1) {
      column = 'updatedAt';
    } else if (columnIndex === 2) {
      column = 'sizeInBytes';
    } else if (columnIndex === 3) {
      column = 'objectsCount';
    }

    this.dispatchEvent(
      new CcCellarBucketSortEvent({
        column,
        direction,
      }),
    );
  }

  _onCreateButtonClick() {
    if (this.state.type === 'loaded' && this.state.list.type === 'loaded') {
      this.state = {
        ...this.state,
        list: {
          ...this.state.list,
          createForm: {
            type: 'idle',
            bucketName: '',
            error: null,
          },
        },
      };
    }
  }

  _onCancelBucketCreation() {
    if (this.state.type === 'loaded' && this.state.list.type === 'loaded') {
      this.state = {
        ...this.state,
        list: {
          ...this.state.list,
          createForm: null,
        },
      };
      this._createBucketFormRef.value.reset();
    }
  }

  /**
   * @param {{filter: string}} formData
   */
  _onFilterFormSubmit({ filter }) {
    this.dispatchEvent(new CcCellarBucketFilterEvent(filter));
  }

  render() {
    if (this.state.type === 'loading') {
      return html`<cc-loader></cc-loader>`;
    }
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-explorer.error')}></cc-notice>`;
    }

    return html`<div class="wrapper">
      ${this._renderHeading(this.state.list)} ${this._renderList(this.state.list)}
      ${this._renderDetail(this.state.list)}
    </div>`;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderHeading(state) {
    if (state.level === 'buckets') {
      return this._renderHeadingForBuckets(state);
    }

    return html``;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderHeadingForBuckets(state) {
    if (state.level === 'buckets') {
      const counts = this._getCountingState(state);
      const enabledFiltering = counts.total != null && counts.total >= NUMBER_OF_BUCKETS_ENABLING_FILTERING;
      const filter = state.type === 'loaded' ? state.filter : '';

      return html`
        <div class="list-heading">
          <div class="list-heading--left">
            <span class="list-heading--title">${i18n('cc-cellar-explorer.bucket.heading.title')}</span>
            ${enabledFiltering
              ? html`<cc-badge class="list-heading--count" weight="dimmed" intent="neutral">
                  ${counts.filtered != null ? `${counts.filtered}/` : ''}${counts.total}
                </cc-badge>`
              : ''}
          </div>
          <div class="list-heading--center">
            ${enabledFiltering
              ? html`<form ${formSubmit(this._onFilterFormSubmit.bind(this))}>
                  <cc-input-text
                    name="filter"
                    inline
                    label=${i18n('cc-cellar-explorer.bucket.heading.filter.label')}
                    ?disabled=${state.type !== 'loaded'}
                    .value=${filter}
                  ></cc-input-text>
                  <cc-button type="submit" .icon=${iconFilter} hide-text outlined ?disabled=${state.type !== 'loaded'}>
                    ${i18n('cc-cellar-explorer.bucket.heading.filter.button')}
                  </cc-button>
                </form>`
              : ''}
          </div>
          <cc-button
            ${ref(this._createBucketButtonRef)}
            class="create-bucket-button"
            primary
            type="submit"
            .icon=${iconAdd}
            ?disabled=${state.type !== 'loaded'}
            @cc-click=${this._onCreateButtonClick}
            >${i18n('cc-cellar-explorer.bucket.heading.create.button')}</cc-button
          >
          ${state.type === 'loaded' ? this._renderBucketCreateForm(state.createForm) : ''}
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
    if (state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-explorer.bucket.error')}></cc-notice>`;
    }

    /**
     * @param {CellarBucketSortColumn} column
     * @returns {'asc'|'desc'|'none'}
     */
    const getSort = (column) => {
      if (state.type === 'loading') {
        return 'none';
      }

      const isSortedByCol = state.sort.column === column;
      if (!isSortedByCol) {
        return 'none';
      }
      return state.sort.direction;
    };

    /** @type {Array<CcGridColumnDefinition<CellarBucketState>>} */
    const bucketColumns = [
      {
        header: i18n('cc-cellar-explorer.bucket.list.column.name'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: bucketState.name,
          icon: iconBucket,
          enableCopyToClipboard: true,
        }),
        width: 'minmax(max-content, 1fr)',
        sort: getSort('name'),
      },
      {
        header: i18n('cc-cellar-explorer.bucket.list.column.last-update'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-explorer.date', { date: bucketState.updatedAt }),
        }),
        width: 'max-content',
        volatile: true,
        sort: getSort('updatedAt'),
      },
      {
        header: i18n('cc-cellar-explorer.bucket.list.column.size'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-explorer.size', { size: bucketState.sizeInBytes }),
        }),
        width: 'max-content',
        align: 'end',
        volatile: true,
        sort: getSort('sizeInBytes'),
      },
      {
        header: i18n('cc-cellar-explorer.bucket.list.column.objects'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-explorer.count', { count: bucketState.objectsCount }),
        }),
        width: 'max-content',
        align: 'end',
        volatile: true,
        sort: getSort('objectsCount'),
      },
      {
        header: '',
        cellAt: (bucketState) => ({
          type: 'button',
          value: i18n('cc-cellar-explorer.bucket.list.show-details.a11y-name', { bucketName: bucketState.name }),
          icon: iconMore,
          waiting: bucketState.state === 'fetching',
          onClick: () => this._onDisplayBucketDetailRequested(bucketState.name),
        }),
        width: 'max-content',
      },
    ];

    const counts = this._getCountingState(state);
    if (counts.total === 0) {
      return html`<div class="list empty-list">${i18n('cc-cellar-explorer.bucket.empty.no-items')}</div>`;
    }
    if (counts.filtered === 0) {
      return html`<div class="list empty-list">${i18n('cc-cellar-explorer.bucket.empty.no-filtered-items')}</div>`;
    }

    const items = state.type === 'loading' ? SKELETON_BUCKETS : state.items;
    return html`
      <cc-grid
        ${ref(this._bucketGridRef)}
        class="list"
        a11y-name=${i18n('cc-cellar-explorer.bucket.list.a11y-name')}
        .columns=${bucketColumns}
        .items=${items}
        .skeleton=${state.type === 'loading'}
        .disabled=${state.type === 'loading'}
        @cc-focus-lost=${this._onGridFocusLost}
        @cc-grid-sort=${this._onGridSort}
      ></cc-grid>
    `;
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {TemplateResult}
   */
  _renderDetail(state) {
    if (state.type === 'loaded' && state.level === 'buckets') {
      return html`<cc-drawer
        heading=${i18n('cc-cellar-explorer.bucket.details.heading')}
        ?open=${state.details != null}
        @cc-close=${this._onCloseBucketDetails}
      >
        ${this._renderDetailForBucket(state.details)}
      </cc-drawer>`;
    }
    return html``;
  }

  /**
   * @param {CellarBucketDetailsState} bucket
   * @returns {TemplateResult}
   */
  _renderDetailForBucket(bucket) {
    if (bucket == null) {
      return html``;
    }

    return html`<div class="details-wrapper">
      <div class="details-icon-wrapper">
        <cc-icon .icon=${iconBucket}></cc-icon>
        <div class="details-name">${bucket.name}</div>
      </div>

      <div class="details-sub-title">${i18n('cc-cellar-explorer.bucket.details.actions.title')}</div>
      <div class="details-actions">
        <!-- todo add a confirmation modal -->
        <cc-button
          danger
          .icon=${iconDelete}
          @cc-click=${() => this._onDeleteBucketRequested(bucket.name)}
          .waiting=${bucket.state === 'deleting'}
          .disabled=${bucket.objectsCount > 0 && bucket.state !== 'deleting'}
          >${i18n('cc-cellar-explorer.bucket.details.actions.delete.button')}</cc-button
        >
        <br />
        ${bucket.objectsCount > 0
          ? html`<cc-notice
              message=${i18n('cc-cellar-explorer.bucket.details.actions.delete.must-be-empty')}
              intent="info"
            ></cc-notice>`
          : ''}
      </div>

      <div class="details-sub-title">${i18n('cc-cellar-explorer.bucket.details.overview.title')}</div>

      <dl class="details-overview-list">
        <dt><span>${i18n('cc-cellar-explorer.bucket.details.overview.objects-count')}</span></dt>
        <dd>${i18n('cc-cellar-explorer.count', { count: bucket.objectsCount })}</dd>

        <dt><span>${i18n('cc-cellar-explorer.bucket.details.overview.size')}</span></dt>
        <dd>${i18n('cc-cellar-explorer.bucket.details.overview.size-in-bytes', { size: bucket.sizeInBytes })}</dd>

        <dt><span>${i18n('cc-cellar-explorer.bucket.details.overview.created-at')}</span></dt>
        <dd>${i18n('cc-cellar-explorer.bucket.details.overview.date', { date: bucket.createdAt })}</dd>

        <dt><span>${i18n('cc-cellar-explorer.bucket.details.overview.updated-at')}</span></dt>
        <dd>${i18n('cc-cellar-explorer.bucket.details.overview.date', { date: bucket.updatedAt })}</dd>

        <dt><span>${i18n('cc-cellar-explorer.bucket.details.overview.versioning')}</span></dt>
        <dd>${this._getVersioningLabel(bucket.versioning)}</dd>
      </dl>
    </div>`;
  }

  /**
   * @param {CellarBucketCreateFormState} state
   * @returns {TemplateResult}
   */
  _renderBucketCreateForm(state) {
    return html`<cc-dialog
      class="create-bucket-dialog"
      heading=${i18n('cc-cellar-explorer.bucket.create.title')}
      ?open=${state != null}
      @cc-dialog-close=${this._onCancelBucketCreation}
    >
      <form ${formSubmit(this._onCreateBucketRequested.bind(this))} ${ref(this._createBucketFormRef)}>
        <cc-input-text
          autofocus
          label=${i18n('cc-cellar-explorer.bucket.create.bucket-name.label')}
          name="bucketName"
          required
          .value=${state?.bucketName ?? ''}
          .errorMessage=${this._getBucketCreationErrorMessage(state)}
        >
          <ul slot="help" class="bucket-name-help">
            <li>${i18n('cc-cellar-explorer.bucket.create.bucket-name.help.size')}</li>
            <li>${i18n('cc-cellar-explorer.bucket.create.bucket-name.help.case')}</li>
            <li>${i18n('cc-cellar-explorer.bucket.create.bucket-name.help.start')}</li>
            <li>${i18n('cc-cellar-explorer.bucket.create.bucket-name.help.ip')}</li>
            <li>${i18n('cc-cellar-explorer.bucket.create.bucket-name.help.labels')}</li>
          </ul>
        </cc-input-text>
        <div class="dialog-actions">
          <cc-button
            outlined
            @cc-click="${this._onCancelBucketCreation}"
            type="reset"
            ?disabled=${state?.type === 'creating'}
          >
            ${i18n('cc-cellar-explorer.bucket.create.cancel')}
          </cc-button>
          <cc-button type="submit" primary ?waiting=${state?.type === 'creating'}>
            ${i18n('cc-cellar-explorer.bucket.create.submit')}
          </cc-button>
        </div>
      </form>
    </cc-dialog>`;
  }

  /**
   * @param {CellarBucketCreateFormState} state
   */
  _getBucketCreationErrorMessage(state) {
    if (state?.error == null) {
      return null;
    }
    switch (state.error) {
      case 'bucket-already-exists':
        return i18n('cc-cellar-explorer.bucket.create.error.bucket-already-exists');
      case 'bucket-name-invalid':
        return i18n('cc-cellar-explorer.bucket.create.error.bucket-name-invalid');
      case 'too-many-buckets':
        return i18n('cc-cellar-explorer.bucket.create.error.too-many-buckets');
    }
  }

  /**
   * @param {CellarBucketVersioning} versioning
   */
  _getVersioningLabel(versioning) {
    switch (versioning) {
      case 'disabled':
        return i18n('cc-cellar-explorer.bucket.details.overview.versioning.disabled');
      case 'enabled':
        return i18n('cc-cellar-explorer.bucket.details.overview.versioning.enabled');
      case 'suspended':
        return i18n('cc-cellar-explorer.bucket.details.overview.versioning.suspended');
    }
  }

  /**
   * @param {CellarExplorerItemsListState} state
   * @returns {{total: number|null, filtered: number|null}}
   */
  _getCountingState(state) {
    const totalCount = state.type === 'loaded' ? state.total : null;
    const filteredItemsCount = state.type === 'loaded' && !isStringEmpty(state.filter) ? state.items.length : null;
    return {
      total: totalCount,
      filtered: filteredItemsCount,
    };
  }

  static get styles() {
    return [
      accessibilityStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          background-color: var(--cc-color-bg-default, #fff);
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: calc(100% - 2em);
          display: flex;
          flex-direction: column;
          padding: 1em;
          gap: 1em;
        }

        .list-heading {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
          gap: 1em;
          flex-wrap: wrap;
        }

        .list-heading--left {
          display: flex;
          align-items: center;
          gap: 0.2em;
        }

        .list-heading--title {
          font-weight: 700;
          font-size: 1.2em;
          color: var(--cc-color-text-primary-strongest, #000);
        }

        .list-heading--count {
          font-family: monospace;
        }

        .list-heading--center {
          flex: 1 1 auto;
          display: flex;
          align-items: center;
          gap: 0.5em;
          justify-content: end;
        }

        .list-heading--center form {
          flex: 1;
          display: inline-flex;
          align-items: center;
          gap: 0.5em;
          max-width: 28em;
        }

        .list-heading--center cc-input-text {
          flex: 1;
        }

        .empty-list {
          padding: 1em;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .list {
          flex: 1;
          border: 1px solid var(--cc-color-border-neutral-weak, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          min-height: 0;
        }

        .details-wrapper {
          display: flex;
          flex-direction: column;
          width: 25em;
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
        }

        .details-wrapper .details-icon-wrapper cc-icon {
          width: 5em;
          height: 5em;
        }

        .details-wrapper .details-icon-wrapper .details-name {
          font-weight: bold;
          white-space: wrap;
          word-wrap: anywhere;
        }

        .details-wrapper .details-sub-title {
          display: flex;
          align-items: center;
          margin-bottom: 1em;
          margin-top: 2em;
          padding-bottom: 0.5em;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
          font-weight: bold;
        }

        .details-wrapper .details-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }

        .details-wrapper .details-overview-list {
          display: flex;
          flex-direction: column;
          margin: 0;
        }

        .details-wrapper .details-overview-list dt {
          font-size: 0.94em;
          font-weight: bold;
          margin-bottom: 0.25em;
        }

        .details-wrapper .details-overview-list dd {
          font-size: 0.94em;
          margin: 0 0 1em 0;
        }

        .dialog-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: end;
          margin-top: 2.75em;
        }

        .bucket-name-help {
          font-size: 1em;
          padding-left: 1em;
        }

        .bucket-name-help li {
          margin: 0;
          padding: 0.3em;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-explorer-beta', CcCellarExplorer);
