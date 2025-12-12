import { css, LitElement } from 'lit';

export class CcNetworkGroupList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {object} */
    this.state = {};
  }

  render() {
    return;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-list', CcNetworkGroupList);
