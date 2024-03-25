import { css, html, LitElement } from 'lit';
import '../../cc-button/cc-button.js';
import '../../cc-input-text/cc-input-text.js';
import '../../cc-select/cc-select.js';
import '../../cc-toggle/cc-toggle.js';
import { formSubmit } from '../../../lib/form/form-submit-directive.js';

export class CcFtDemoDynamicForm extends LitElement {
  static get properties () {
    return {
      _proMode: { type: Boolean, state: true },
    };
  }

  constructor () {
    super();

    this._proMode = false;
  }

  _onProModeChange (e) {
    this._proMode = e.target.checked;
  }

  render () {
    return html`
      <form name="my-form" ${formSubmit(this)}>
        <cc-input-text label="Name" required name="name"></cc-input-text>

        <label for="pro-mode">
          <input 
                id="pro-mode"
                type="checkbox"
                .checked=${this._proMode}
                @change=${this._onProModeChange}
          /> Pro mode
        </label>
        

        ${this._proMode ? html`
          <cc-input-text label="Company" required name="compagny"></cc-input-text>
        ` : ''}

        <cc-button type="submit" primary>Submit</cc-button>
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

window.customElements.define('cc-ft-demo-dynamic-form', CcFtDemoDynamicForm);
