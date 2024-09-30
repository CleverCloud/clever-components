import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { skeletonStyles } from '../../styles/skeleton.js';

/**
 * @typedef {import('lit').PropertyValues<CcImg>} CcImgPropertyValues
 */

/**
 * A wrapper around `<img>` to add loader indicator, remove ugly borders and display proper placeholder text when there's an error.
 *
 * ## Details
 *
 * * If you set `skeleton=true` and `src="https://..."`, `skeleton` will be set back to `false` by the component once the inner native `<img>` is loaded (success or error).
 *
 * @cssdisplay inline-block
 *
 * @cssprop {"cover"|"contain"} --cc-img-fit - Sets the `object-fit` of the inner `<img>` element (defaults to "cover").
 */
export class CcImg extends LitElement {
  static get properties() {
    return {
      a11yName: { type: String, attribute: 'a11y-name' },
      skeleton: { type: Boolean, reflect: true },
      src: { type: String },
      _error: { type: Boolean, state: true },
      _loaded: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {string|null} Sets short fallback text to display when the image cannot be loaded or if `src` is not defined and `skeleton` is `false`. */
    this.a11yName = null;

    /** @type {boolean} Enables skeleton screen UI pattern (loading hint). */
    this.skeleton = false;

    /** @type {string|null} Sets `src` attribute on inner native `<img>` element. */
    this.src = null;

    /** @type {boolean} */
    this._error = false;

    /** @type {boolean} */
    this._loaded = false;
  }

  _onLoad() {
    this._loaded = true;
    // WARNING: we modify the exposed property "skeleton" from the inside
    this.skeleton = false;
  }

  _onError() {
    this._error = true;
    // WARNING: we modify the exposed property "skeleton" from the inside
    this.skeleton = false;
  }

  /** @param {CcImgPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('src')) {
      this._error = false;
      this._loaded = false;
    }
  }

  render() {
    const altValue = this.a11yName ?? '';
    const isLoading = this.src != null && !this._loaded && !this._error;
    const isSkeleton = this.skeleton || isLoading;
    const displayAccessibleName = this.src == null || this._error;
    return html`
      <div class="wrapper ${classMap({ skeleton: isSkeleton, loaded: this._loaded })}">
        <img src=${ifDefined(this.src ?? undefined)} @load=${this._onLoad} @error=${this._onError} alt=${altValue} />
        ${displayAccessibleName
          ? html`
              <!-- We use aria-hidden because we already have an alt value. -->
              <div class="error-msg" aria-hidden="true">${altValue}</div>
            `
          : ''}
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      // language=CSS
      css`
        :host {
          display: inline-block;
          overflow: hidden;
        }

        .wrapper,
        img {
          height: 100%;
          width: 100%;
        }

        .wrapper {
          align-items: center;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .wrapper.skeleton {
          background-color: #bbb;
        }

        .wrapper.text {
          background-color: var(--cc-color-bg-neutral, #eee);
        }

        img {
          display: block;
          left: 0;
          object-fit: var(--cc-img-fit, cover);
          object-position: center center;
          opacity: 0;
          position: absolute;
          top: 0;
          transition: opacity 150ms ease-in-out;
        }

        .wrapper.loaded img {
          opacity: 1;
        }

        .error-msg {
          font-size: 0.85em;
          overflow: hidden;
          padding: 0.3em;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
    ];
  }
}

window.customElements.define('cc-img', CcImg);
