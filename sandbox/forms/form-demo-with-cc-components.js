import { css, html, LitElement } from 'lit';
import '../../src/components/cc-button/cc-button.js';
import '../../src/components/cc-input-date/cc-input-date.js';
import '../../src/components/cc-input-number/cc-input-number.js';
import '../../src/components/cc-input-text/cc-input-text.js';
import '../../src/components/cc-picker/cc-picker.js';
import '../../src/components/cc-range-selector/cc-range-selector.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-toggle/cc-toggle.js';
import { formSubmit } from '../../src/lib/form/form-submit-directive.js';

const COLOR_OPTIONS = [
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

const PICKER_OPTIONS = [
  { body: 'Lady Gaga', value: 'GAGA' },
  { body: 'John Lennon', value: 'LENNON' },
  { body: 'Paul McCartney', value: 'MCCARTNEY' },
  { body: 'George Harrison', value: 'HARRISON' },
];

const RANGE_SELECTOR_OPTIONS = [
  { body: `L`, value: 'lun' },
  { body: `M`, value: 'mar' },
  { body: `M`, value: 'mer' },
  { body: `J`, value: 'jeu' },
  { body: `V`, value: 'ven' },
  { body: `S`, value: 'sam' },
  { body: `D`, value: 'dim' },
];

export class FormDemoWithCcComponents extends LitElement {
  render() {
    return html`
      <form ${formSubmit()}>
        <cc-input-text label="Name" name="name" required></cc-input-text>
        <cc-input-text label="Surname" name="surname" required></cc-input-text>
        <cc-input-date label="Birthdate" name="birthdate"></cc-input-date>
        <cc-input-number label="Size" name="size" required min="10" max="250">
          <p slot="help">Your size in centimeter<br />min: 10, max: 250</p>
        </cc-input-number>
        <cc-input-text label="Email address" name="email" type="email" required></cc-input-text>
        <cc-select label="Favorite color" name="color" .options=${COLOR_OPTIONS} required></cc-select>
        <cc-picker label="Find the intruder" name="star" .options=${PICKER_OPTIONS} required></cc-picker>
        <cc-range-selector
          label="Select a range"
          name="planning"
          .options=${RANGE_SELECTOR_OPTIONS}
          required
        ></cc-range-selector>

        <cc-button primary type="submit">Submit</cc-button>
      </form>
    `;
  }

  static get styles() {
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

window.customElements.define('form-demo-with-cc-components', FormDemoWithCcComponents);
