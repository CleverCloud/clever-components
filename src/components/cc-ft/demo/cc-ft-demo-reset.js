import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';

const colorsSelectOptions = [
  {
    label: 'red',
    value: 'red',
  },
  {
    label: 'yellow',
    value: 'yellow',
  },
  {
    label: 'green',
    value: 'green',
  },
];

export class CcFtDemoReset extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <form name="my-form" ${formSubmit(this)}>
        <cc-input-text label="Name" required name="name" value="prepopulated name" reset-value="prepopulated name"></cc-input-text>
        <cc-input-text label="Surname" required name="surname"></cc-input-text>
        <cc-input-text label="Country" required name="country"></cc-input-text>
        <cc-select label="Color" required name="color" .options=${colorsSelectOptions}></cc-select>
        
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
