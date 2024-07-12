import { css, html, LitElement } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../cc-loader/cc-loader.js';

/**
 * @typedef {import('./cc-html-frame.types.js').IframeSandbox} IframeSandbox
 */

/**
 * A low level component that takes some HMTL and puts it in an iframe.
 *
 * ## Details
 *
 * * By default, the inner `<iframe>` is borderless and has a transparent background.
 * * If you set `loading=true` and a `<template>` inside the main slot, `loading` will be set back to `false` by the component once the inner native `<iframe>` is loaded.
 *
 * ## Technical details
 *
 * * The HTML contents needs to be wrapped in a `<template>` tag.
 * * By default, the origin of the inner `<iframe>` is the same as the parent window. This means the iframe can access the same local storage and other origin bound APIs.
 * * If you want to limit this access and increase the isolation, you can add the `sandbox` attribute, see [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) for more details.
 * * This implemententation does not create an OOP (out of process) iframe.
 *
 * @cssdisplay block
 *
 * @slot - The HTML contents (wrapped in a `<template>`).
 */
export class CcHtmlFrame extends LitElement {
  static get properties() {
    return {
      loading: { type: Boolean, reflect: true },
      sandbox: { type: String },
      iframeTitle: { type: String, attribute: 'iframe-title' },
    };
  }

  constructor(props) {
    super(props);

    /** @type {boolean} Enables the loader indicator. */
    this.loading = false;

    /** @type {IframeSandbox|null} Sets `sandbox` attribute on inner native `<iframe>` element. */
    this.sandbox = null;

    /** @type {string} Sets `title` attribute on the inner `<iframe>` element. */
    this.iframeTitle = '';
  }

  // As explained in the docs, this implemententation does not trigger an OOP iframe
  // It could help preventing the iframe from impacting the perf of the main page.
  // There is a technique to do this with a blob URL and opaque origin but to this date, it only works in Chrome (see links).
  // https://shhnjk.blogspot.com/2021/03/a-hack-to-render-untrusted-content-in.html
  // https://shhnjk.github.io/PoCs/process_isolated_content.html
  _updateHtmlSource() {
    if (this.children.length === 1 && this.children[0].tagName === 'TEMPLATE') {
      const template = this.children[0];
      const blob = new Blob([template.innerHTML], { type: 'text/html' });
      if (this._blobUrl) {
        window.URL.revokeObjectURL(this._blobUrl);
      }
      this._blobUrl = window.URL.createObjectURL(blob);
      const $iframe = this.shadowRoot.querySelector('iframe');
      this.loading = true;
      $iframe.addEventListener('load', () => (this.loading = false), { once: true });
      $iframe.src = this._blobUrl;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._mo = new MutationObserver(() => this._updateHtmlSource());
    this._mo.observe(this, { childList: true });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._mo.disconnect();
    if (this._blobUrl) {
      window.URL.revokeObjectURL(this._blobUrl);
    }
  }

  firstUpdated() {
    this._updateHtmlSource();
  }

  render() {
    return html`
      <iframe title=${this.iframeTitle} src="about:blank" sandbox=${ifDefined(this.sandbox ?? undefined)}></iframe>
      ${this.loading ? html` <cc-loader></cc-loader> ` : ''}
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: block;
          position: relative;
        }

        iframe {
          border: none;
          height: 100%;
          width: 100%;
        }

        :host([loading]) iframe {
          opacity: 0.25;
        }

        cc-loader {
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-html-frame', CcHtmlFrame);
