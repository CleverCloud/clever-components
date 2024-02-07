export class CcSimpleInputTextBuiltin extends HTMLInputElement {
  connectedCallback () {
    console.log('Hello from builtin component');
    this.addEventListener('input', this._onInput);
  }

  _onInput (e) {
    this.value = this.value.toUpperCase();
  }
}

window.customElements.define('cc-simple-input-text-builtin', CcSimpleInputTextBuiltin, { extends: 'input' });
