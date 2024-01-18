import { LitElement, html, css } from 'lit';

export class CtPlanCellar extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      ct-plan-cellar
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

customElements.define('ct-plan-cellar', CtPlanCellar);
