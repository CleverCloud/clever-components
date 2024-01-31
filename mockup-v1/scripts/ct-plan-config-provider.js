import { LitElement, html, css } from 'lit';
import { iconRemixStickyNoteLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'More informations',
};

export class CtPlanConfigProvider extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <p>This add-on is completely free.</p>

        <p>Learn more about Configuration Provider on our <a href="https://developers.clever-cloud.com/doc/addons/config-provider/" target="_blank">documentation page</a>.</p>
      </ct-label-with-icon>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }

        p {
          margin-block: 0.5em;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-config-provider', CtPlanConfigProvider);
