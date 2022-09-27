import { css, html, LitElement } from 'lit';

/**
 * @typedef {import('./cc-example-component.types.js').PersonState} PersonState
 */

export class CcExampleComponent extends LitElement {

  static get properties () {
    return {
      person: { type: Object },
    };
  }

  constructor () {
    super();

    /** @type {PersonState} */
    this.person = { state: 'loading' };
  }

  render () {

    const state = this.person.state;

    return html`

      ${state === 'loading' ? html`
        <div>loading message</div>
      ` : ''}

      ${state === 'loaded' ? html`
        <div>Hello ${this.person.name.toUpperCase()}</div>
        <div>Hello ${Math.ceil(this.person.age)}</div>
        <div>Hello ${this.person.funny === true ? 'yes' : 'no'}</div>
      ` : ''}

      ${state === 'error' ? html`
        <div>error message</div>
      ` : ''}

    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('cc-example-component', CcExampleComponent);
