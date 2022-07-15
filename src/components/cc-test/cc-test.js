import { css, html, LitElement } from 'lit-element';

/**
 * TODO DOCS
 */
export class CcTest extends LitElement {

  static get properties () {
    return {
      name: { type: String },
      red: { type: Boolean, reflect: true },
      long: { type: Boolean },
    };
  }

  constructor () {
    super();
    this.name = 'unknown person';
    this.red = false;
    this.long = false;
  }

  render () {
    return html`
      <div>
        Hello <strong>${this.name}</strong>
        ${this.long ? html`
          <br>
          I really like having you in my team!!
        ` : ''}
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
        
        strong {
          color: blue;
        }
        
        :host([red]) strong {
          color: red;
        }
      `,
    ];
  }
}

window.customElements.define('cc-test', CcTest);
