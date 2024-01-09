import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmitHandler } from '../form/form.js';

export class CcFtDemoReset extends LitElement {
  static get properties () {
    return {
    };
  }

  constructor () {
    super();
  }

  render () {
    return html`
      <form name="my-form" novalidate @submit=${formSubmitHandler}>
        <cc-input-text label="Name" required name="name"></cc-input-text>
        <cc-input-text label="Surname" required name="surname"></cc-input-text>
        <cc-input-text label="Country" required name="country"></cc-input-text>
        
        <div class="buttons-bar">
          <cc-button type="reset">Reset</cc-button>
          <cc-button primary type="submit">Submit</cc-button>
        </div>
      </form>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 0.5em;
        }
        
        .buttons-bar {
          display: flex;
          align-items: end;
          gap: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-reset', CcFtDemoReset);
