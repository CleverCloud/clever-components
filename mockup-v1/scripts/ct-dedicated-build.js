import { LitElement, html, css } from 'lit';
import { iconRemixToolsFill as labelIcon } from '../../src/assets/cc-remix.icons.js';
import { API_APPS_RAW } from '../api/apps.js';

const WORDING = {
  LABEL: 'Build configuration',
  HINT: 'Your application will build on a dedicated machine allowing you to use a small scaler to run your application. But, using this option will make your deployment slower (by ~10 seconds).',
};

export class CtDedicatedBuild extends LitElement {
  static get properties () {
    return {
      product: { type: Object },
      currentFlavor: { type: Object },
      _sortedFlavors: { type: Array, state: true },
    };
  };

  constructor () {
    super();

    this.product = null;
    this.currentFlavor = null;

    this._onDedicatedBuildChange({ detail: this.currentFlavor });
  }

  willUpdate (_changedProperties) {
    if (_changedProperties.has('product')) {
      const [type, slug] = this.product.id.split('::');
      this._rawApplication = API_APPS_RAW.find((app) => app.type === type && (slug == null || app.variant.slug === slug));

      const flavors = [...this._rawApplication.flavors];
      flavors.sort((a, b) => (a.cpu * a.mem) - (b.cpu * b.mem));

      this._sortedFlavors = [
        { label: 'Deactivated', value: null },
        ...flavors.map(fl => ({ label: fl.name, value: fl.name })),
      ];
    }
  }

  _onDedicatedBuildChange({ detail }) {
    this.dispatchEvent(new CustomEvent('ct-dedicated-build:value-updated', {
      detail,
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
        <div class="subtitle">${WORDING.HINT}</div>
        <cc-select value="${this.currentFlavor}" .options='${this._sortedFlavors}' @cc-select:input=${this._onDedicatedBuildChange}></cc-select>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: contents;
        }

        cc-select {
          max-width: 16em;
        }
      `,
    ];
  }
}

customElements.define('ct-dedicated-build', CtDedicatedBuild);
