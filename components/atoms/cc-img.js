import { classMap } from 'lit-html/directives/class-map.js';
import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { skeleton } from '../styles/skeleton.js';

/**
 * Wrapper around <img> to add loader indicator, remove ugly border and display proper placeholder text when there's an error
 */
export class CcImg extends LitElement {

  static get properties () {
    return {
      src: { type: String },
      text: { type: String },
      skeleton: { type: Boolean, reflect: true },
      _loaded: { type: Boolean, attribute: false },
      _error: { type: Boolean, attribute: false },
    };
  }

  constructor () {
    super();
    this._loaded = false;
    this._error = false;
  }

  set src (newVal) {
    const oldVal = this._src;
    this._src = newVal;
    this.requestUpdate('src', oldVal);
    this._loaded = false;
    this._error = false;
  }

  get src () {
    return this._src;
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

  render () {
    const isLoading = (this.src != null && !this._loaded && !this._error);
    const isSkeleton = (this.skeleton || isLoading);
    return html`
      <div class="wrapper ${classMap({ skeleton: isSkeleton, loaded: this._loaded })}">
        <img src=${ifDefined(this.src)} @load=${this._onLoad} @error=${this._onError}>
        <div class="error-msg">${this.text}</div>
      </div>
    `;
  }

  static get styles () {
    return [
      skeleton,
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
          background-color: #eee;
          display: flex;
          justify-content: center;
          position: relative;
        }

        .wrapper.skeleton {
          background-color: #bbb;
        }

        img {
          display: block;
          object-fit: cover;
          object-position: center center;
          opacity: 0;
          position: absolute;
          top: 0;
          transition: opacity 150ms ease-in-out;
          left: 0;
        }

        .wrapper.loaded img {
          opacity: 1;
        }

        .error-msg {
          font-size: 0.9rem;
          overflow: hidden;
          padding: 0.25rem;
          text-align: center;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .wrapper.skeleton .error-msg,
        .wrapper.loaded .error-msg {
          display: none;
        }
      `,
    ];
  }
}

window.customElements.define('cc-img', CcImg);
