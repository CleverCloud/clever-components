import { LitElement, html, css } from 'lit';

export class CtPlanPulsar extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      ct-plan-pulsar
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

customElements.define('ct-plan-pulsar', CtPlanPulsar);
