import { LitElement, html, css } from 'lit';

export class CtPlanFsBucket extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      ct-plan-fs-bucket
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

customElements.define('ct-plan-fs-bucket', CtPlanFsBucket);
