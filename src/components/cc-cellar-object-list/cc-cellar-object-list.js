import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  iconRemixArchiveLine as iconBucket,
  iconRemixFolder_4Line as iconDirectory,
  iconRemixFile_2Line as iconFile,
  iconRemixSearchLine as iconFilter,
  iconRemixHome_3Line as iconHouse,
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
  CcCellarObjectFilterEvent,
} from './cc-cellar-object-list.events.js';

/**
 * @import { CellarObjectListState, CellarObjectListStateLoading, CellarObjectListStateLoaded, CellarObjectListStateFiltering, CellarObjectState } from './cc-cellar-object-list.types.js'
 * @import { CcBreadcrumbClickEvent } from '../cc-breadcrumbs/cc-breadcrumbs.events.js'
 * @import { CcGrid } from '../cc-grid/cc-grid.js'
 * @import { CcGridColumnDefinition } from '../cc-grid/cc-grid.types.js'
 * @import { TemplateResult } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/** @type {Array<Omit<CellarObjectState, 'fullName'>>} */
const SKELETON_OBJECTS = [...Array(5)].map(() => ({
  type: 'file',
  state: 'idle',
  name: randomString(random(10, 15)),
  updatedAt: new Date().toISOString(),
  contentLength: random(150_000, 2_000_000),
}));

/**
 * A component that allows to navigate through a Cellar addon.
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

    /** @type {Ref<HTMLFormElement>} */
    this._createBucketFormRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._createBucketButtonRef = createRef();

    /** @type {Ref<CcGrid>} */
    this._gridRef = createRef();
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
    }
    if (path.length === 2) {
      this.dispatchEvent(new CcCellarNavigateToBucketEvent(this.state.bucketName));
    }
    this.dispatchEvent(new CcCellarNavigateToPathEvent(path.slice(2)));
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-object-list.error')}></cc-notice>`;
    }

    return html`<div class="wrapper">
      ${this._renderHeading(this.state)} ${this._renderPath(this.state)} ${this._renderList(this.state)}
      ${this._renderPagination(this.state)}
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
      { value: '/home/', label: '', icon: iconHouse },
      { value: '/bucket/', label: state.bucketName, icon: iconBucket },
      ...state.path.map((path) => ({
        value: path,
        icon: iconDirectory,
      })),
    ];

    return html`<cc-breadcrumbs .items=${items} @cc-breadcrumb-click=${this._onPathItemClick}></cc-breadcrumbs>`;
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
    ];

    const items = state.type === 'loading' || state.type === 'filtering' ? SKELETON_OBJECTS : state.objects;

    if (items.length === 0) {
      return html`<div class="list empty-list">${i18n('cc-cellar-object-list.empty.no-items')}</div>`;
      // todo: different message when filter
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
        >Previous</cc-button
      >
      <cc-button
        hide-text
        .icon=${iconNext}
        .disabled=${!hasNext}
        @cc-click=${() => this.dispatchEvent(new CcCellarNavigateToNextPageEvent())}
        >Next</cc-button
      >
    </div>`;
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
          display: flex;
          flex-direction: column;
          gap: 1em;
          height: calc(100% - 2em);
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
          display: flex;
          gap: 1em;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-object-list-beta', CcCellarObjectList);
