import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArchiveLine as iconBucket,
  iconRemixDeleteBin_6Line as iconDelete,
  iconRemixFolder_4Line as iconDirectory,
  iconRemixDownloadLine as iconDownload,
  iconRemixFile_2Line as iconFile,
  iconRemixFileZipLine as iconFileArchive,
  iconRemixFileMusicLine as iconFileAudio,
  iconRemixFileImageLine as iconFileImage,
  iconRemixFilePdfLine as iconFilePdf,
  iconRemixFileTextLine as iconFileText,
  iconRemixFileVideoLine as iconFileVideo,
  iconRemixSearchLine as iconFilter,
  iconRemixHome_3Line as iconHouse,
  iconRemixMoreFill as iconMore,
  iconRemixArrowRightSFill as iconNext,
  iconRemixArrowLeftSFill as iconPrevious,
} from '../../assets/cc-remix.icons.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { random, randomString } from '../../lib/utils.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { i18n } from '../../translations/translation.js';
import '../cc-breadcrumbs/cc-breadcrumbs.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-drawer/cc-drawer.js';
import '../cc-grid/cc-grid.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';
import {
  CcCellarNavigateToBucketEvent,
  CcCellarNavigateToHomeEvent,
  CcCellarNavigateToNextPageEvent,
  CcCellarNavigateToPathEvent,
  CcCellarNavigateToPreviousPageEvent,
  CcCellarObjectDeleteEvent,
  CcCellarObjectFilterEvent,
  CcCellarObjectHideEvent,
  CcCellarObjectShowEvent,
} from './cc-cellar-object-list.events.js';

/**
 * @import { CellarObjectListState, CellarObjectListStateLoading, CellarObjectListStateLoaded, CellarObjectListStateFiltering, CellarObjectState, CellarFileDetailsState } from './cc-cellar-object-list.types.js'
 * @import { CcBreadcrumbClickEvent } from '../cc-breadcrumbs/cc-breadcrumbs.events.js'
 * @import { CcGrid } from '../cc-grid/cc-grid.js'
 * @import { CcGridColumnDefinition } from '../cc-grid/cc-grid.types.js'
 * @import { TemplateResult } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/** @type {Array<Omit<CellarObjectState, 'key'>>} */
const SKELETON_OBJECTS = [...Array(5)].map(() => ({
  type: 'file',
  state: 'idle',
  name: randomString(random(10, 15)),
  updatedAt: new Date().toISOString(),
  contentLength: random(150_000, 2_000_000),
}));

const ARCHIVE_CONTENT_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/x-tar',
  'application/gzip',
  'application/x-gzip',
  'application/x-freearc',
  'application/x-bzip',
  'application/x-bzip2',
  'application/x-rar-compressed',
  'application/vnd.rar',
  'application/x-7z-compressed',
  'application/java-archive',
  'application/vnd.ms-cab-compressed',
  'application/x-xz',
  'application/x-lzma',
  'application/zstd',
  'application/x-cpio',
  'application/x-compress',
  'application/x-lz4',
  'application/x-lzip',
  'application/x-arj',
  'application/x-lzh-compressed',
  'application/x-ace-compressed',
  'application/x-stuffit',
];

/**
 * A component that allows to navigate through a Cellar addon's bucket.
 *
 * @cssdisplay block
 */
export class CcCellarObjectList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CellarObjectListState} Sets state. */
    this.state = { type: 'loading', bucketName: '', path: [] };

    /** @type {Ref<HTMLDivElement>} */
    this._noResultMessageRef = createRef();

    /** @type {Ref<CcGrid>} */
    this._gridRef = createRef();
  }

  focusFirstCell() {
    this.updateComplete.then(() => {
      this._gridRef.value?.focusFirstCell();
    });
  }

  /**
   * @param {string} contentType
   */
  _getFileIcon(contentType) {
    if (contentType === 'text/plain') {
      return { icon: iconFileText, a11yName: i18n('cc-cellar-object-list.icon.icon-file-text') };
    }
    if (contentType === 'application/pdf') {
      return { icon: iconFilePdf, a11yName: i18n('cc-cellar-object-list.icon.icon-file-pdf') };
    }
    if (contentType.startsWith('image/')) {
      return { icon: iconFileImage, a11yName: i18n('cc-cellar-object-list.icon.icon-file-image') };
    }
    if (contentType.startsWith('audio/')) {
      return { icon: iconFileAudio, a11yName: i18n('cc-cellar-object-list.icon.icon-file-audio') };
    }
    if (contentType.startsWith('video/')) {
      return { icon: iconFileVideo, a11yName: i18n('cc-cellar-object-list.icon.icon-file-video') };
    }
    if (ARCHIVE_CONTENT_TYPES.includes(contentType)) {
      return { icon: iconFileArchive, a11yName: i18n('cc-cellar-object-list.icon.icon-file-archive') };
    }
    return { icon: iconFile, a11yName: i18n('cc-cellar-object-list.icon.icon-file') };
  }

  /**
   * @param {{filter: string}} formData
   */
  _onFilterFormSubmit({ filter }) {
    this.dispatchEvent(new CcCellarObjectFilterEvent(filter));
  }

  /**
   * @param {CcBreadcrumbClickEvent} event
   */
  _onPathItemClick(event) {
    const path = event.detail.path;
    if (path.length === 1) {
      this.dispatchEvent(new CcCellarNavigateToHomeEvent());
      return;
    }
    if (path.length === 2) {
      this.dispatchEvent(new CcCellarNavigateToBucketEvent(this.state.bucketName));
      return;
    }
    this.dispatchEvent(new CcCellarNavigateToPathEvent(path.slice(2)));
  }

  /**
   * @param {string} objectName
   */
  _onDisplayObjectDetailsRequested(objectName) {
    this.dispatchEvent(new CcCellarObjectShowEvent(objectName));
  }

  _onCloseObjectDetails() {
    this.dispatchEvent(new CcCellarObjectHideEvent());
  }

  _onDrawerFocusLost() {
    if (this.state.type === 'loaded') {
      if (this.state.objects.length > 0) {
        this._gridRef.value?.focus();
      } else {
        this._noResultMessageRef.value?.focus();
      }
    }
  }

  /**
   * @param {string} objectKey
   */
  _onDeleteObject(objectKey) {
    this.dispatchEvent(new CcCellarObjectDeleteEvent(objectKey));
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-object-list.error')}></cc-notice>`;
    }

    return html`<div class="wrapper">
      ${this._renderHeading(this.state)} ${this._renderPath(this.state)} ${this._renderList(this.state)}
      ${this._renderPagination(this.state)} ${this.state.type === 'loaded' ? this._renderFileDetails(this.state) : ''}
    </div>`;
  }

  /**
   * @param {CellarObjectListStateLoading|CellarObjectListStateLoaded|CellarObjectListStateFiltering} state
   * @returns {TemplateResult}
   */
  _renderHeading(state) {
    const filter = state.type === 'loaded' || state.type === 'filtering' ? state.filter : '';

    return html`
      <div class="list-heading">
        <div class="list-heading--left">
          <span class="list-heading--title">${i18n('cc-cellar-object-list.heading.title')}</span>
        </div>
        <div class="list-heading--center">
          <form ${formSubmit(this._onFilterFormSubmit.bind(this))}>
            <cc-input-text
              name="filter"
              inline
              label=${i18n('cc-cellar-object-list.heading.filter.label')}
              ?readonly=${state.type === 'filtering'}
              ?disabled=${state.type !== 'loaded' && state.type !== 'filtering'}
              .value=${filter}
            ></cc-input-text>
            <cc-button
              type="submit"
              .icon=${iconFilter}
              hide-text
              outlined
              ?waiting=${state.type === 'filtering'}
              ?disabled=${state.type !== 'loaded' && state.type !== 'filtering'}
            >
              ${i18n('cc-cellar-object-list.heading.filter.button')}
            </cc-button>
          </form>
        </div>
      </div>
    `;
  }

  /**
   * @param {CellarObjectListStateLoading|CellarObjectListStateLoaded|CellarObjectListStateFiltering} state
   * @returns {TemplateResult}
   */
  _renderPath(state) {
    const items = [
      { value: '/home/', label: '', icon: iconHouse, iconA11yName: i18n('cc-cellar-object-list.back-to-bucket-list') },
      { value: '/bucket/', label: state.bucketName, icon: iconBucket },
      ...state.path.map((path) => ({
        value: path,
        icon: iconDirectory,
      })),
    ];

    const copyValue = state.path.length > 0 ? state.path.join('/') : state.bucketName;

    return html`
      <div class="path-wrapper">
        <cc-breadcrumbs
          label=${i18n('cc-cellar-object-list.nav-label')}
          .items=${items}
          @cc-breadcrumb-click=${this._onPathItemClick}
        ></cc-breadcrumbs>
        <cc-clipboard value=${copyValue}></cc-clipboard>
      </div>
    `;
  }

  /**
   * @param {CellarObjectListStateLoading|CellarObjectListStateLoaded|CellarObjectListStateFiltering} state
   * @returns {TemplateResult}
   */
  _renderList(state) {
    /** @type {Array<CcGridColumnDefinition<CellarObjectState>>} */
    const columns = [
      {
        header: i18n('cc-cellar-object-list.grid.column.name'),
        cellAt: (object) => {
          if (object.type === 'directory') {
            return {
              type: 'link',
              value: object.name,
              icon: iconDirectory,
              enableCopyToClipboard: true,
              onClick: () => {
                this.dispatchEvent(new CcCellarNavigateToPathEvent([...state.path, object.name]));
              },
            };
          }
          return {
            type: 'text',
            value: object.name,
            icon: iconFile,
            enableCopyToClipboard: true,
          };
        },
        width: 'minmax(max-content, 1fr)',
      },
      {
        header: i18n('cc-cellar-object-list.grid.column.last-update'),
        cellAt: (object) => {
          if (object.type === 'directory') {
            return null;
          }
          return {
            type: 'text',
            value: i18n('cc-cellar-object-list.date', { date: object.updatedAt }),
          };
        },
        width: 'max-content',
        volatile: true,
      },
      {
        header: i18n('cc-cellar-object-list.grid.column.size'),
        cellAt: (object) => {
          if (object.type === 'directory') {
            return null;
          }
          return {
            type: 'text',
            value: i18n('cc-cellar-object-list.size', { size: object.contentLength }),
          };
        },
        width: 'max-content',
        align: 'end',
        volatile: true,
      },
      {
        header: '',
        cellAt: (object) => {
          if (object.type === 'directory') {
            return null;
          }
          return {
            type: 'button',
            value: i18n('cc-cellar-object-list.grid.show-details.a11y-name', { objectName: object.key }),
            icon: iconMore,
            waiting: object.state === 'fetching',
            onClick: () => this._onDisplayObjectDetailsRequested(object.key),
          };
        },
        width: 'max-content',
      },
    ];

    const items = state.type === 'loading' || state.type === 'filtering' ? SKELETON_OBJECTS : state.objects;
    const isFiltered = state.type === 'loaded' ? state.filter : '';

    if (items.length === 0) {
      return html`<div class="list empty-list">
        <p class="empty-message" ${ref(this._noResultMessageRef)} tabindex="-1">
          ${isFiltered
            ? i18n('cc-cellar-object-list.empty.no-filtered-items')
            : i18n('cc-cellar-object-list.empty.no-items')}
        </p>
      </div>`;
    }

    const busy = state.type === 'loading' || state.type === 'filtering';
    return html`
      <cc-grid
        ${ref(this._gridRef)}
        class="list"
        a11y-name=${i18n('cc-cellar-object-list.grid.a11y-name')}
        .columns=${columns}
        .items=${items}
        .skeleton=${busy}
        .disabled=${busy}
      ></cc-grid>
    `;
  }

  /**
   * @param {CellarObjectListStateLoading|CellarObjectListStateLoaded|CellarObjectListStateFiltering} state
   * @returns {TemplateResult}
   */
  _renderPagination(state) {
    const hasPrevious = state.type === 'loaded' && state.hasPrevious;
    const hasNext = state.type === 'loaded' && state.hasNext;

    return html`<div class="pagination">
      <cc-button
        hide-text
        .icon=${iconPrevious}
        .disabled=${!hasPrevious}
        @cc-click=${() => this.dispatchEvent(new CcCellarNavigateToPreviousPageEvent())}
        >${i18n('cc-cellar-object-list.page.previous')}</cc-button
      >
      <cc-button
        hide-text
        .icon=${iconNext}
        .disabled=${!hasNext}
        @cc-click=${() => this.dispatchEvent(new CcCellarNavigateToNextPageEvent())}
        >${i18n('cc-cellar-object-list.page.next')}</cc-button
      >
    </div>`;
  }

  /**
   * @param {CellarObjectListStateLoaded} state
   * @returns {TemplateResult}
   */
  _renderFileDetails(state) {
    const object = state.details;

    return html`<cc-drawer
      heading=${i18n('cc-cellar-object-list.details.heading')}
      ?open=${object != null}
      @cc-close=${this._onCloseObjectDetails}
      @cc-focus-restoration-fail=${this._onDrawerFocusLost}
    >
      ${object != null
        ? html`<div class="details-wrapper">
            <div class="details-icon-wrapper">
              ${this._renderIconDetails(object)}
              <div class="details-name">${object.name}</div>
            </div>

            <div class="details-sub-title">${i18n('cc-cellar-object-list.details.actions.title')}</div>
            <div class="details-actions">
              <cc-link .href=${object.state !== 'idle' ? null : object.signedUrl} mode="button" .icon=${iconDownload}>
                ${i18n('cc-cellar-object-list.details.actions.download.button')}
              </cc-link>

              <cc-button
                danger
                outlined
                .icon=${iconDelete}
                @cc-click=${() => this._onDeleteObject(object.key)}
                .waiting=${object.state === 'deleting'}
                .disabled=${object.state !== 'idle' && object.state !== 'deleting'}
                >${i18n('cc-cellar-object-list.details.actions.delete.button')}</cc-button
              >
            </div>

            <div class="details-sub-title">${i18n('cc-cellar-object-list.details.overview.title')}</div>

            <dl class="details-overview-list">
              <dt>${i18n('cc-cellar-object-list.details.overview.location')}</dt>
              <dd>${object.key}<cc-clipboard value=${object.key}></cc-clipboard></dd>

              <dt>${i18n('cc-cellar-object-list.details.overview.content-type')}</dt>
              <dd>${object.contentType}</dd>

              <dt>${i18n('cc-cellar-object-list.details.overview.size')}</dt>
              <dd>${i18n('cc-cellar-object-list.details.overview.size-in-bytes', { size: object.contentLength })}</dd>

              <dt>${i18n('cc-cellar-object-list.details.overview.updated-at')}</dt>
              <dd>${i18n('cc-cellar-object-list.details.overview.date', { date: object.updatedAt })}</dd>
            </dl>
          </div>`
        : ''}
    </cc-drawer>`;
  }

  /**
   *
   * @param {CellarFileDetailsState} object
   * @returns {TemplateResult}
   * @private
   */
  _renderIconDetails(object) {
    const fileIcon = this._getFileIcon(object.contentType);
    return html`<cc-icon .icon=${fileIcon.icon} .a11yName=${fileIcon.a11yName}></cc-icon>`;
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

        .path-wrapper {
          align-items: center;
          display: flex;
          gap: 1em;
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

        .pagination {
          align-items: center;
          gap: 1em;
        }

        .details-wrapper {
          display: flex;
          flex-direction: column;
          max-width: 25em;
        }

        .button-link {
          display: contents;
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
          white-space: wrap;
          word-wrap: anywhere;
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
          align-items: center;
          display: flex;
          font-size: 0.94em;
          gap: 0.5em;
          margin: 0 0 1em;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-object-list-beta', CcCellarObjectList);
