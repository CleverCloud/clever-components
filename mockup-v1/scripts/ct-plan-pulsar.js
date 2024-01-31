import { LitElement, html, css } from 'lit';
import { iconRemixStickyNoteLine as labelIcon } from '../../src/assets/cc-remix.icons.js';

const WORDING = {
  VERSION_LABEL: 'More informations',
};

export class CtPlanPulsar extends LitElement {
  static get properties () {
    return {
      version: { type: String },
    };
  };

  firstUpdated (_changedProperties) {
    if (this.version == null || this.version === '') {
      return;
    }

    this.dispatchEvent(new CustomEvent('ct-addon-options:option-updated', {
      detail: {
        option: 'version',
        value: this.version,
      },
      bubbles: true,
      composed: true,
    }));
  }

  render () {
    return html`
      <ct-label-with-icon .icon="${labelIcon}" .label="${WORDING.VERSION_LABEL}">
        <p>
          <cc-notice intent="warning" message="Pulsar add-on is still in beta."></cc-notice>
        </p>
        
        <p>Pulsar add-on pricing is based on storage, inbound traffic and outbound traffic. Check our simulator on our
          <a href="https://www.clever-cloud.com/pricing/" target="_blank">pricing page</a>.</p>

        <p>Learn more about Pulsar on our <a href="https://developers.clever-cloud.com/doc/addons/pulsar/" target="_blank">documentation page</a>.</p>
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

customElements.define('ct-plan-pulsar', CtPlanPulsar);
