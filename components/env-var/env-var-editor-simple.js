import './env-var-create.js';
import './env-var-input.js';
import { css, html, LitElement } from 'lit-element';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '@i18n';
import { repeat } from 'lit-html/directives/repeat.js';

/**
 * A high level env var editor, edit variables one at a time + a create form
 *
 * @event env-var-editor-simple:change - when any of the values changes with an array of `{ name: 'the name', value: 'the value', isDeleted: true/false }` as `detail`
 *
 * @attr {Array} variables - the array of variables
 * @attr {Boolean} disabled - set disabled attribute on inputs and button
 * @attr {Boolean} readonly - if we want to only display variables (the button is hidden)
 *
 * `{ name: 'the name', value: 'the value', isDeleted: true|false }`
 */
export class EnvVarEditorSimple extends LitElement {

  static get properties () {
    return {
      variables: { type: Array, attribute: false },
      disabled: { type: Boolean },
      readonly: { type: Boolean },
    };
  }

  constructor () {
    super();
    // this.variables is let to undefined by default (this triggers skeleton screen)
    this.disabled = false;
    this.readonly = false;
  }

  static get skeletonVariables () {
    return [
      { name: 'VARIABLE_ONE', value: '' },
      { name: 'VARIABLE_FOOBAR', value: '' },
      { name: 'VARIABLE_PORT', value: '' },
    ];
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

    const variables = (this.variables == null)
      ? EnvVarEditorSimple.skeletonVariables
      : this.variables;

    const variablesNames = (this.variables == null)
      ? []
      : this.variables.map(({ name }) => name);

    const $createForm = !this.readonly
      ? html`<env-var-create
        ?disabled=${this.variables == null || this.disabled}
        .variablesNames=${variablesNames}
        @env-var-create:create=${this._onCreate}
      ></env-var-create>`
      : '';

    const $envVarInputs = repeat(
      variables,
      ({ name }) => name,
      ({ name, value, isNew, isEdited, isDeleted }) => {
        return html`<env-var-input
          name=${name}
          value=${value}
          ?new=${isNew}
          ?edited=${isEdited}
          ?deleted=${isDeleted}
          ?skeleton=${this.variables == null}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          @env-var-input:input=${this._onInput}
          @env-var-input:delete=${this._onDelete}
          @env-var-input:keep=${this._onKeep}
        ></env-var-input>`;
      },
    );

    return html`
      ${$createForm}
      <div class="message" ?hidden=${variables != null && variables.length !== 0}>
        ${i18n(`env-var-editor-simple.empty-data`)}
      </div>
      ${$envVarInputs}
    `;
  }

  static get styles () {
    // language=CSS
    return css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      env-var-create {
        margin-bottom: 1rem;
      }

      .message {
        color: #555;
        margin: 0.2rem;
        font-style: italic;
      }

      env-var-input {
        margin-bottom: 0.25rem;
      }
    `;
  }
}

window.customElements.define('env-var-editor-simple', EnvVarEditorSimple);
