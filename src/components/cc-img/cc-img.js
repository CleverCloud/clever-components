import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { skeletonStyles } from '../../styles/skeleton.js';

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

  static get properties () {
    return {
      accessibleName: { type: String, attribute: 'accessible-name' },
      a11yName: { type: String, attribute: 'a11y-name' },
      skeleton: { type: Boolean, reflect: true },
      src: { type: String },
      _error: { type: Boolean, state: true },
      _loaded: { type: Boolean, state: true },
    };
  }

  constructor () {
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

  get accessibleName () {
    return this.a11yName;
  }

  /**
   * Deprecated property. Use `a11yName` property or `a11y-name` attribute instead.
   * @deprecated
   */
  set accessibleName (value) {
    this.a11yName = value;
  }

  _onLoad (e) {
    this._loaded = true;
    // WARNING: we modify the exposed property "skeleton" from the inside
    this.skeleton = false;
  }

  _onError (e) {
    this._error = true;
    // WARNING: we modify the exposed property "skeleton" from the inside
    this.skeleton = false;
  }

  willUpdate (changedProperties) {
    if (changedProperties.has('src')) {
      this._error = false;
      this._loaded = false;
    }
  }

  render () {
    const altValue = this.a11yName ?? '';
    const isLoading = (this.src != null && !this._loaded && !this._error);
    const isSkeleton = (this.skeleton || isLoading);
    const displayAccessibleName = (this.src == null || this._error);
    return html`
      <div class="wrapper ${classMap({ skeleton: isSkeleton, loaded: this._loaded })}">
        <img src=${ifDefined(this.src ?? undefined)} @load=${this._onLoad} @error=${this._onError} alt=${altValue}>
        ${displayAccessibleName ? html`
            <!-- We use aria-hidden because we already have an alt value. -->
          <div class="error-msg" aria-hidden="true">${altValue}</div>
        ` : ''}
      </div>
    `;
  }

  static get styles () {
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
          width: 100%;
          height: 100%;
        }

        .wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wrapper.skeleton {
          background-color: #bbb;
        }

        .wrapper.text {
          background-color: var(--cc-color-bg-neutral, #eee);
        }

        img {
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          object-fit: var(--cc-img-fit, cover);
          object-position: center center;
          opacity: 0;
          transition: opacity 150ms ease-in-out;
        }

        .wrapper.loaded img {
          opacity: 1;
        }

        .error-msg {
          overflow: hidden;
          padding: 0.3em;
          font-size: 0.85em;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `,
    ];
  }
}

window.customElements.define('cc-img', CcImg);
