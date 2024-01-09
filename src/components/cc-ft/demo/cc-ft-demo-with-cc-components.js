import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-select/cc-select.js';
import '../../cc-toggle/cc-toggle.js';
import { formSubmitHandler } from '../form/form.js';

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

const petToggleOptions = [
  {
    label: '🐶',
    value: '🐶',
  },
  {
    label: '🐱',
    value: '🐱',
  },
  {
    label: '🐸',
    value: '🐸',
  },
];

export class CcFtDemoWithCcComponents extends LitElement {
  static get properties () {
    return {
    };
  }

  render () {
    return html`
      <form name="my-form" novalidate @submit=${formSubmitHandler(this)}>
        <cc-input-text label="Name" name="name" required></cc-input-text>
        <cc-input-text label="Surname" name="surname" required></cc-input-text>
        <cc-input-text label="Country" name="country" required></cc-input-text>
        <cc-select label="Favorite color" .options=${colorsSelectOptions} name="color" required></cc-select>
        <cc-toggle legend="Pet" .choices=${petToggleOptions} name="pet" required></cc-toggle>

        <cc-button primary type="submit">Submit</cc-button>
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
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo-with-cc-components', CcFtDemoWithCcComponents);
