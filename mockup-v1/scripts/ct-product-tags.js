import { LitElement, html, css } from 'lit';
import { iconRemixHashtag as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  LABEL: 'Tags',
};

export class CtProductTags extends LitElement {
  static get properties () {
    return {
      tags: { type: Array },
    };
  };

  constructor () {
    super();

    this.tags = [];
  }

  _onInputUpdated (e) {
    this.tags = e.detail;
    this.dispatchEvent(new CustomEvent('ct-product-tags:tags-updated', {
      detail: this.tags,
      bubbles: true,
      composed: true,
    }));
  }

  render () {
    return html`
      <ct-label-with-icon
        .icon="${labelIcon}"
        .label="${WORDING.LABEL}"
      >
        <cc-input-text
          required
          @cc-input-text:tags=${this._onInputUpdated}
          .tags="${this.tags}"
        ></cc-input-text>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        cc-input-text {
          --cc-color-bg-soft: var(--cc-color-bg-primary-weak);

          color: var(--cc-color-text-primary-strongest);
          font-size: var(--ct-form-input--font-size);
        }
      `,
    ];
  }
}

customElements.define('ct-product-tags', CtProductTags);
