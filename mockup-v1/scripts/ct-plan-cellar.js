import { LitElement, html, css } from 'lit';
import { iconRemixStickyNoteLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'More informations',
};

export class CtPlanCellar extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <p>Cellar add-on pricing is based on storage and outbound traffic. Check our simulator on our
          <a href="https://www.clever-cloud.com/pricing/" target="_blank">pricing page</a>.</p>

        <p>Learn more about Cellar on our <a href="https://developers.clever-cloud.com/doc/addons/cellar/" target="_blank">documentation page</a>.</p>
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

customElements.define('ct-plan-cellar', CtPlanCellar);
