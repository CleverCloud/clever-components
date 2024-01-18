import { LitElement, html, css } from 'lit';

export class CtPlanConfigProvider extends LitElement {
  static get properties () {
    return {
    };
  };

  render () {
    return html`
      ct-plan-config-provider
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

customElements.define('ct-plan-config-provider', CtPlanConfigProvider);
