import { css, html, LitElement } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';

/**
 * A low level component that takes some HMTL and puts it in an iframe.
 *
 * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/atoms/cc-html-frame.js)
 *
 * ## Technical details
 *
 * * The HTML contents needs to be wrapped in a `<template>` tag.
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

  // TODO: We need to improve this:
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