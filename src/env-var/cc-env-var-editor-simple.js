import './cc-env-var-create.js';
import './cc-env-var-input.js';
import { css, html, LitElement } from 'lit-element';
import { repeat } from 'lit-html/directives/repeat.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

const SKELETON_VARIABLES = [
  { name: 'VARIABLE_ONE', value: '' },
  { name: 'VARIABLE_FOOBAR', value: '' },
  { name: 'VARIABLE_PORT', value: '' },
];

/**
 * A high level environment variable editor to create/edit/delete variables one at a time (with validation and error messages).
 *
 * ## Type definitions
 *
 * ```js
 * interface Variable {
 *   name: string,
 *   value: string,
 *   isDeleted: boolean,
 * }
 * ```
 *
 * @cssdisplay grid / none (with `[hidden]`)
 *
 * @prop {Boolean} readonly - Sets `readonly` attribute on inputs and hides buttons.
 * @prop {Boolean} disabled - Sets `disabled` attribute on inputs and buttons.
 * @prop {Variable[]} variables - Sets the list of variables.
 *
 * @event {CustomEvent<Variable[]>} cc-env-var-editor-simple:change - Fires the new list of variables whenever something changes in the list.
 */
export class CcEnvVarEditorSimple extends LitElement {

  static get properties () {
    return {
      disabled: { type: Boolean },
      readonly: { type: Boolean },
      variables: { type: Array },
    };
  }

  constructor () {
    super();
    // this.variables is let to undefined by default (this triggers skeleton screen)
    this.disabled = false;
    this.readonly = false;
  }

  _onCreate ({ detail: newVar }) {
    this.variables = [...this.variables, newVar];
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _onInput ({ detail: editedVar }) {
    this.variables = this.variables.map((v) => {
      return (v.name === editedVar.name)
        ? { ...v, value: editedVar.value }
        : v;
    });
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _onDelete ({ detail: deletedVar }) {
    this.variables = this.variables
      .filter((v) => {
        return (v.name === deletedVar.name)
          ? (!v.isNew)
          : true;
      })
      .map((v) => {
        return (v.name === deletedVar.name)
          ? { ...v, isDeleted: true }
          : v;
      });
    dispatchCustomEvent(this, 'change', this.variables);
  }

  _onKeep ({ detail: keptVar }) {
    this.variables = this.variables.map((v) => {
      return (v.name === keptVar.name)
        ? { ...v, isDeleted: false }
        : v;
    });
    dispatchCustomEvent(this, 'change', this.variables);
  }

  render () {

    const skeleton = (this.variables == null);
    const variables = skeleton ? SKELETON_VARIABLES : this.variables;
    const variablesNames = variables.map(({ name }) => name);

    return html`
      
      ${!this.readonly ? html`
        <cc-env-var-create
          ?disabled=${skeleton || this.disabled}
          .variablesNames=${variablesNames}
          @cc-env-var-create:create=${this._onCreate}
        ></cc-env-var-create>
      ` : ''}
      
      <div class="message" ?hidden=${variables != null && variables.length !== 0}>
        ${i18n('cc-env-var-editor-simple.empty-data')}
      </div>
      
      ${repeat(variables, ({ name }) => name, ({ name, value, isNew, isEdited, isDeleted }) => html`
        <cc-env-var-input
          name=${name}
          value=${value}
          ?new=${isNew}
          ?edited=${isEdited}
          ?deleted=${isDeleted}
          ?skeleton=${skeleton}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @cc-env-var-input:input=${this._onInput}
          @cc-env-var-input:delete=${this._onDelete}
          @cc-env-var-input:keep=${this._onKeep}
        ></cc-env-var-input>
      `)}
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: grid;
        grid-gap: 0.5rem;
      }

      :host([hidden]) {
        display: none;
      }

      cc-env-var-create {
        margin-bottom: 1rem;
      }

      .message {
        color: #555;
        font-style: italic;
        margin: 0.2rem;
      }
    `;
  }
}

window.customElements.define('cc-env-var-editor-simple', CcEnvVarEditorSimple);
