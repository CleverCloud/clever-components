import { css, html, LitElement } from 'lit';
import { formSubmit } from '../../src/lib/form/form-submit-directive.js';

/**
 * @typedef {import('../../src/lib/events.types.js').EventWithTarget<HTMLFormElement>} HTMLFormElementEvent
 */

export class FormDemoWithNativeInputs extends LitElement {
  /**
   * @param {HTMLFormElementEvent} e
   */
  _onInvalid (e) {
    e.target.reportValidity();
  }

  render () {
    return html`
      <form ${formSubmit()} @form:invalid=${this._onInvalid}>
        <label for="name">Name <i>(Required)</i>:</label>
        <input type="text" name="name" id="name" required/>
        
        <label for="surname">Surname:</label>
        <input type="text" name="surname" id="surname" />
        
        <label for="size">Size <i>(Required)</i>:</label>
        <input type="number" name="size" id="size" required/>
        
        <label for="color">Favorite Color <i>(Required)</i>:</label>
        <select name="color" id="color" required>
          <option value="">--Please choose an option--</option>
          <option value="red">Red</option>
          <option value="blue">Blue</option>
          <option value="Yellow">Yellow</option>
        </select>

        <fieldset>
          <legend>Favorite Food <i>(Required)</i></legend>
          <div>
            <input type="radio" name="favorite-food" value="vegetable" id="radio-vegetable" required />
            <label for="radio-vegetable">Vegetable</label>
          </div>
          <div>
            <input type="radio" name="favorite-food" value="fish" id="radio-fish" required />
            <label for="radio-fish">Fish</label>
          </div>
          <div>
            <input type="radio" name="favorite-food" value="meat" id="radio-meat" required />
            <label for="radio-meat">Meat</label>
          </div>
        </fieldset>
        
        <div>
          <input type="checkbox" id="super-hero" name="super-hero" required />
          <label for="super-hero">Are you a super-hero?</label>
        </div>

        <button type="submit">Submit</button>
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

        *:focus {
          outline: solid 2px black;
        }
      `,
    ];
  }
}

window.customElements.define('form-demo-with-native-inputs', FormDemoWithNativeInputs);
