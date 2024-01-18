import { LitElement, html, css } from 'lit';

export class CtPlanMatomo extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      ct-plan-matomo
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

customElements.define('ct-plan-matomo', CtPlanMatomo);
