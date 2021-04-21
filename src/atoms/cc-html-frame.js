import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * A low level component that takes some HMTL and puts it in an iframe.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-html-frame.js)
 *
 * ## Details
 *
 * * By default, the inner `<iframe>` is borderless and has a transparent background.
 *
 * ## Technical details
 *
 * * The HTML contents needs to be wrapped in a `<template>` tag.
 * * By default, the origin of the inner `<iframe>` is the same as the parent window. This means the iframe can access the same local storage and other origin bound APIs.
 * * If you want to limit this access and increase the isolation, you can add the `sandbox` attribute, see [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) for more details.
 * * This implemententation does not create an OOP (out of process) iframe.
 *
 * @prop {String} sandbox - Sets `sandbox` attribute on inner native `<iframe>` element.
 * @prop {String} title - Sets `title` attribute on the inner `<iframe>` element.
 *
 * @slot - The HTML contents (wrapped in a `<template>`).
 */
export class CcHtmlFrame extends LitElement {

  static get properties () {
    return {
      sandbox: { type: String },
      title: { type: String },
    };
  }

  constructor (props) {
    super(props);
    this.title = '';
  }

  render () {
    return html`
      <iframe title=${this.title} src="about:blank" sandbox=${ifDefined(this.sandbox)}></iframe>
    `;
  }

  // As explained in the docs, this implemententation does not trigger an OOP iframe
  // It could help preventing the iframe from impacting the perf of the main page.
  // There is a technique to do this with a blob URL and opaque origin but to this date, it only works in Chrome (see links).
  // https://shhnjk.blogspot.com/2021/03/a-hack-to-render-untrusted-content-in.html
  // https://shhnjk.github.io/PoCs/process_isolated_content.html
  _updateHtmlSource () {
    if (this.children.length === 1 && this.children[0].tagName === 'TEMPLATE') {
      const template = this.children[0];
      const blob = new Blob([template.innerHTML], { type: 'text/html' });
      if (this._blobUrl) {
        window.URL.revokeObjectURL(this._blobUrl);
      }
      this._blobUrl = window.URL.createObjectURL(blob);
      this.shadowRoot.querySelector('iframe').src = this._blobUrl;
    }
  }

  connectedCallback () {
    super.connectedCallback();
    this._mo = new MutationObserver(() => this._updateHtmlSource());
    this._mo.observe(this, { childList: true });
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    this._mo.disconnect();
  }

  firstUpdated () {
    this._updateHtmlSource();
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        iframe {
          border: none;
          height: 100%;
          width: 100%;
        }
      `,
    ];
  }
}

window.customElements.define('cc-html-frame', CcHtmlFrame);
