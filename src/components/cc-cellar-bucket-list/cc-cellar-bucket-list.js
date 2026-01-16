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
import { CcCellarNavigateToBucketEvent } from '../cc-cellar-object-list/cc-cellar-object-list.events.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-drawer/cc-drawer.js';
import '../cc-grid/cc-grid.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import {
  CcCellarBucketCreateEvent,
  CcCellarBucketDeleteEvent,
  CcCellarBucketFilterEvent,
  CcCellarBucketHideEvent,
  CcCellarBucketShowEvent,
  CcCellarBucketSortEvent,
} from './cc-cellar-bucket-list.events.js';

/**
 * @import { CellarBucketListState, CellarBucketListStateLoading, CellarBucketListStateLoaded, CellarBucketState, CellarBucketCreateFormState, CellarBucketSortColumn } from './cc-cellar-bucket-list.types.js'
 * @import { CellarBucketVersioning } from '../cc-cellar-explorer/cc-cellar-explorer.client.types.js'
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
export class CcCellarBucketList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CellarBucketListState} Sets state. */
    this.state = { type: 'loading' };

    /** @type {Ref<HTMLFormElement>} */
    this._createBucketFormRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._createBucketButtonRef = createRef();

    /** @type {Ref<CcGrid>} */
    this._gridRef = createRef();

    new FormErrorFocusController(this, this._createBucketFormRef, () => {
      if (this.state.type === 'loaded') {
        return this.state.createForm?.error;
      }
      return null;
    });
  }

  //#region Public methods

  /**
   * @param {string} bucketName
   */
  scrollToBucket(bucketName) {
    this.updateComplete.then(() => {
      if (this.state.type === 'loaded') {
        const index = this.state.buckets.findIndex((b) => b.name === bucketName);
        this._gridRef.value?.scrollToIndex(index);
      }
    });
  }

  focusFirstCell() {
    this.updateComplete.then(() => {
      this._gridRef.value?.focusFirstCell();
    });
  }

  //#endregion

  //#region Private methods

  /**
   * @param {CellarBucketCreateFormState} state
   */
  _getBucketCreationErrorMessage(state) {
    if (state?.error == null) {
      return null;
    }
    switch (state.error) {
      case 'bucket-already-exists':
        return i18n('cc-cellar-bucket-list.create.error.bucket-already-exists');
      case 'bucket-name-invalid':
        return i18n('cc-cellar-bucket-list.create.error.bucket-name-invalid');
      case 'too-many-buckets':
        return i18n('cc-cellar-bucket-list.create.error.too-many-buckets');
    }
  }

  /**
   * @param {CellarBucketVersioning} versioning
   */
  _getVersioningLabel(versioning) {
    switch (versioning) {
      case 'disabled':
        return i18n('cc-cellar-bucket-list.details.overview.versioning.disabled');
      case 'enabled':
        return i18n('cc-cellar-bucket-list.details.overview.versioning.enabled');
      case 'suspended':
        return i18n('cc-cellar-bucket-list.details.overview.versioning.suspended');
    }
  }

  /**
   * @returns {{total: number|null, filtered: number|null}}
   */
  _getCountingState() {
    const totalCount = this.state.type === 'loaded' ? this.state.total : null;
    const filteredItemsCount =
      this.state.type === 'loaded' && !isStringEmpty(this.state.filter) ? this.state.buckets.length : null;
    return {
      total: totalCount,
      filtered: filteredItemsCount,
    };
  }

  //#endregion

  //#region Event handlers

  /**
   * @param {string} bucketName
   */
  _onBucketClick(bucketName) {
    this.dispatchEvent(new CcCellarNavigateToBucketEvent(bucketName));
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
  _onDeleteBucket(bucketName) {
    this.dispatchEvent(new CcCellarBucketDeleteEvent(bucketName));
  }

  _onDrawerFocusLost() {
    if (this.state.type === 'loaded') {
      if (this.state.buckets.length > 0) {
        this._gridRef.value.focus();
      } else {
        this._createBucketButtonRef.value.focus();
      }
    }
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

  _onCreateBucketButtonClick() {
    if (this.state.type === 'loaded') {
      this.state = {
        ...this.state,
        createForm: {
          type: 'idle',
          bucketName: '',
          error: null,
        },
      };
    }
  }

  _onConfirmBucketCreation() {
    this._createBucketFormRef.value.requestSubmit();
  }

  _onCancelBucketCreation() {
    if (this.state.type === 'loaded') {
      this.state = {
        ...this.state,
        createForm: null,
      };
      this._createBucketFormRef.value.reset();
    }
  }

  /**
   * @param {{bucketName: string}} formData
   */
  _onCreateBucketFormSubmit({ bucketName }) {
    this.dispatchEvent(new CcCellarBucketCreateEvent(bucketName));
  }

  /**
   * @param {{filter: string}} formData
   */
  _onFilterFormSubmit({ filter }) {
    this.dispatchEvent(new CcCellarBucketFilterEvent(filter));
  }

  //#endregion

  //#region Rendering methods

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-bucket-list.error')}></cc-notice>`;
    }

    return html`<div class="wrapper">
      ${this._renderHeading(this.state)} ${this._renderGrid(this.state)}
      ${this.state.type === 'loaded' ? this._renderBucketDetail(this.state) : ''}
    </div>`;
  }

  /**
   * @param {CellarBucketListStateLoading|CellarBucketListStateLoaded} state
   * @returns {TemplateResult}
   */
  _renderHeading(state) {
    const counts = this._getCountingState();
    const enabledFiltering = counts.total != null && counts.total >= NUMBER_OF_BUCKETS_ENABLING_FILTERING;
    const filter = state.type === 'loaded' ? state.filter : '';

    return html`
      <div class="list-heading">
        <div class="list-heading--left">
          <span class="list-heading--title">${i18n('cc-cellar-bucket-list.heading.title')}</span>
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
                  label=${i18n('cc-cellar-bucket-list.heading.filter.label')}
                  ?disabled=${state.type !== 'loaded'}
                  .value=${filter}
                ></cc-input-text>
                <cc-button type="submit" .icon=${iconFilter} hide-text outlined ?disabled=${state.type !== 'loaded'}>
                  ${i18n('cc-cellar-bucket-list.heading.filter.button')}
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
          @cc-click=${this._onCreateBucketButtonClick}
          >${i18n('cc-cellar-bucket-list.heading.create.button')}</cc-button
        >
        ${state.type === 'loaded' ? this._renderBucketCreationForm(state.createForm) : ''}
      </div>
    `;
  }

  /**
   * @param {CellarBucketListStateLoading|CellarBucketListStateLoaded} state
   * @returns {TemplateResult}
   */
  _renderGrid(state) {
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
        header: i18n('cc-cellar-bucket-list.grid.column.name'),
        cellAt: (bucketState) => ({
          type: 'link',
          value: bucketState.name,
          icon: iconBucket,
          enableCopyToClipboard: true,
          onClick: () => this._onBucketClick(bucketState.name),
        }),
        width: 'minmax(max-content, 1fr)',
        sort: getSort('name'),
      },
      {
        header: i18n('cc-cellar-bucket-list.grid.column.last-update'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-bucket-list.date', { date: bucketState.updatedAt }),
        }),
        width: 'max-content',
        volatile: true,
        sort: getSort('updatedAt'),
      },
      {
        header: i18n('cc-cellar-bucket-list.grid.column.size'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-bucket-list.size', { size: bucketState.sizeInBytes }),
        }),
        width: 'max-content',
        align: 'end',
        volatile: true,
        sort: getSort('sizeInBytes'),
      },
      {
        header: i18n('cc-cellar-bucket-list.grid.column.objects'),
        cellAt: (bucketState) => ({
          type: 'text',
          value: i18n('cc-cellar-bucket-list.count', { count: bucketState.objectsCount }),
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
          value: i18n('cc-cellar-bucket-list.grid.show-details.a11y-name', { bucketName: bucketState.name }),
          icon: iconMore,
          waiting: bucketState.state === 'fetching',
          onClick: () => this._onDisplayBucketDetailRequested(bucketState.name),
        }),
        width: 'max-content',
      },
    ];

    const counts = this._getCountingState();
    if (counts.total === 0) {
      return html`<div class="list empty-list">${i18n('cc-cellar-bucket-list.empty.no-items')}</div>`;
    }
    if (counts.filtered === 0) {
      return html`<div class="list empty-list">${i18n('cc-cellar-bucket-list.empty.no-filtered-items')}</div>`;
    }
    const buckets = state.type === 'loading' ? SKELETON_BUCKETS : state.buckets;
    return html`
      <cc-grid
        ${ref(this._gridRef)}
        class="list"
        a11y-name=${i18n('cc-cellar-bucket-list.grid.a11y-name')}
        .columns=${bucketColumns}
        .items=${buckets}
        .skeleton=${state.type === 'loading'}
        .disabled=${state.type === 'loading'}
        @cc-grid-sort=${this._onGridSort}
      ></cc-grid>
    `;
  }

  /**
   * @param {CellarBucketListStateLoaded} state
   * @returns {TemplateResult}
   */
  _renderBucketDetail(state) {
    const bucket = state.details;

    return html`<cc-drawer
      heading=${i18n('cc-cellar-bucket-list.details.heading')}
      ?open=${bucket != null}
      @cc-close=${this._onCloseBucketDetails}
      @cc-focus-restoration-fail=${this._onDrawerFocusLost}
    >
      ${bucket != null
        ? html`<div class="details-wrapper">
            <div class="details-icon-wrapper">
              <cc-icon .icon=${iconBucket}></cc-icon>
              <div class="details-name">${bucket.name}</div>
            </div>

            <div class="details-sub-title">${i18n('cc-cellar-bucket-list.details.actions.title')}</div>
            <div class="details-actions">
              <cc-button
                danger
                outlined
                .icon=${iconDelete}
                @cc-click=${() => this._onDeleteBucket(bucket.name)}
                .waiting=${bucket.state === 'deleting'}
                .disabled=${bucket.objectsCount > 0 && bucket.state !== 'deleting'}
                >${i18n('cc-cellar-bucket-list.details.actions.delete.button')}</cc-button
              >
              ${bucket.objectsCount > 0
                ? html`<cc-notice
                    message=${i18n('cc-cellar-bucket-list.details.actions.delete.must-be-empty')}
                    intent="info"
                  ></cc-notice>`
                : ''}
            </div>

            <div class="details-sub-title">${i18n('cc-cellar-bucket-list.details.overview.title')}</div>

            <dl class="details-overview-list">
              <dt>${i18n('cc-cellar-bucket-list.details.overview.objects-count')}</dt>
              <dd>${i18n('cc-cellar-bucket-list.count', { count: bucket.objectsCount })}</dd>

              <dt>${i18n('cc-cellar-bucket-list.details.overview.size')}</dt>
              <dd>${i18n('cc-cellar-bucket-list.details.overview.size-in-bytes', { size: bucket.sizeInBytes })}</dd>

              <dt>${i18n('cc-cellar-bucket-list.details.overview.created-at')}</dt>
              <dd>${i18n('cc-cellar-bucket-list.details.overview.date', { date: bucket.createdAt })}</dd>

              <dt>${i18n('cc-cellar-bucket-list.details.overview.updated-at')}</dt>
              <dd>${i18n('cc-cellar-bucket-list.details.overview.date', { date: bucket.updatedAt })}</dd>

              <dt>${i18n('cc-cellar-bucket-list.details.overview.versioning')}</dt>
              <dd>${this._getVersioningLabel(bucket.versioning)}</dd>
            </dl>
          </div>`
        : ''}
    </cc-drawer>`;
  }

  /**
   * @param {CellarBucketCreateFormState} state
   * @returns {TemplateResult}
   */
  _renderBucketCreationForm(state) {
    return html`<cc-dialog
      class="create-bucket-dialog"
      heading=${i18n('cc-cellar-bucket-list.create.title')}
      ?open=${state != null}
      @cc-close=${this._onCancelBucketCreation}
    >
      <form ${formSubmit(this._onCreateBucketFormSubmit.bind(this))} ${ref(this._createBucketFormRef)}>
        <cc-input-text
          ?autofocus=${true}
          label=${i18n('cc-cellar-bucket-list.create.bucket-name.label')}
          name="bucketName"
          required
          ?readonly=${state?.type === 'creating'}
          .value=${state?.bucketName ?? ''}
          .errorMessage=${this._getBucketCreationErrorMessage(state)}
        >
          <ul slot="help" class="bucket-name-help">
            <li>${i18n('cc-cellar-bucket-list.create.bucket-name.help.size')}</li>
            <li>${i18n('cc-cellar-bucket-list.create.bucket-name.help.case')}</li>
            <li>${i18n('cc-cellar-bucket-list.create.bucket-name.help.start')}</li>
            <li>${i18n('cc-cellar-bucket-list.create.bucket-name.help.ip')}</li>
            <li>${i18n('cc-cellar-bucket-list.create.bucket-name.help.labels')}</li>
          </ul>
        </cc-input-text>
        <cc-dialog-confirm-actions
          submit-label=${i18n('cc-cellar-bucket-list.create.submit')}
          ?waiting=${state?.type === 'creating'}
          @cc-confirm=${this._onConfirmBucketCreation}
        ></cc-dialog-confirm-actions>
      </form>
    </cc-dialog>`;
  }

  //#endregion

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
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1em;
          height: 100%;
          padding: 1em;
        }

        .list-heading {
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
          margin-bottom: 1em;
        }

        .list-heading--left {
          align-items: center;
          display: flex;
          gap: 0.2em;
        }

        .list-heading--title {
          color: var(--cc-color-text-primary-strongest, #000);
          font-size: 1.2em;
          font-weight: bold;
        }

        .list-heading--count {
          font-family: monospace;
        }

        .list-heading--center {
          align-items: center;
          display: flex;
          flex: 1 1 auto;
          gap: 0.5em;
          justify-content: end;
        }

        .list-heading--center form {
          align-items: center;
          display: inline-flex;
          flex: 1;
          gap: 0.5em;
          max-width: 28em;
        }

        .list-heading--center cc-input-text {
          flex: 1;
        }

        .empty-list {
          align-items: center;
          display: flex;
          justify-content: center;
          padding: 1em;
        }

        .list {
          border: 1px solid var(--cc-color-border-neutral-weak, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          flex: 1;
          min-height: 0;
        }

        .details-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 25em;
        }

        .details-wrapper .details-icon-wrapper {
          align-content: center;
          align-items: center;
          border: 1px solid var(--cc-color-border-neutral, #aaa);
          border-radius: var(--cc-border-radius-default, 0.25em);
          color: var(--cc-color-text-primary-strongest, #000);
          display: flex;
          flex-direction: column;
          gap: 1em;
          padding: 1em;
        }

        .details-wrapper .details-icon-wrapper cc-icon {
          height: 5em;
          width: 5em;
        }

        .details-wrapper .details-icon-wrapper .details-name {
          font-weight: bold;
          overflow-wrap: anywhere;
          white-space: wrap;
        }

        .details-wrapper .details-sub-title {
          align-items: center;
          border-bottom: 1px solid var(--cc-color-border-primary-weak, #aaa);
          display: flex;
          font-weight: bold;
          margin-bottom: 1em;
          margin-top: 2em;
          padding-bottom: 0.5em;
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
          margin: 0 0 1em;
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
window.customElements.define('cc-cellar-bucket-list-beta', CcCellarBucketList);
