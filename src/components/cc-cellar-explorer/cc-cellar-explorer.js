import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { i18n } from '../../translations/translation.js';
import '../cc-cellar-bucket-list/cc-cellar-bucket-list.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';

/**
 * @import { CellarExplorerState } from './cc-cellar-explorer.types.js'
 * @import { CcCellarBucketList } from '../cc-cellar-bucket-list/cc-cellar-bucket-list.js'
 * @import { Ref } from 'lit/directives/ref.js'
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

    /** @type {Ref<CcCellarBucketList>} */
    this._bucketListRef = createRef();
  }

  /**
   * @param {string} bucketName
   */
  scrollToBucket(bucketName) {
    this.updateComplete.then(() => {
      this._bucketListRef.value?.scrollToBucket(bucketName);
    });
  }

  render() {
    if (this.state.type === 'loading') {
      return html`<cc-loader></cc-loader>`;
    }
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message=${i18n('cc-cellar-explorer.error')}></cc-notice>`;
    }

    if (this.state.level.type === 'buckets') {
      return html`<cc-cellar-bucket-list-beta
        ${ref(this._bucketListRef)}
        class="main"
        .state=${this.state.level.state}
      ></cc-cellar-bucket-list-beta>`;
    }

    return html``;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        .main {
          height: 100%;
        }
      `,
    ];
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
window.customElements.define('cc-cellar-explorer-beta', CcCellarExplorer);
