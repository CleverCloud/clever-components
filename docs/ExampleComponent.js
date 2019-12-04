// DOCS: Don't add a 'use strict', no need for them in modules.
// DOCS: Put all imports here.
// DOCS: Always keep the ".js" at the end when you reference a file directly.
// DOCS: Try to sort them (tends to simplify merges).
import { css, html, LitElement } from 'lit-element';

// DOCS: You may setup/init some stuffs here but this should be rare and most of the setup should happen in the component.

/**
 * A component doing X and Y (one liner description of your component).
 *
 * ## Details
 *
 * * Details about bla.
 * * Details about bla bla.
 * * Details about bla bla bla.
 *
 * ## Technical details
 *
 * * Technical details about foo.
 * * Technical details about bar.
 * * Technical details about baz.
 *
 * ## Type definitions
 *
 * ```js
 * interface ExampleInterface {
 *   one: string,
 *   two: number,
 *   three: boolean,
 * }
 * ```
 *
 * @prop {String} one - Description for one.
 * @prop {Boolean} two - Description for two.
 * @prop {ExampleInterface[]} three - Description for three.
 *
 * @event {CustomEvent<ExampleInterface>} example-component:event-name - Fires XXX whenever YYY.
 *
 * @slot - The content of the button (text or HTML). If you want an image, please look at the `image` attribute.
 *
 * @cssprop {Color} --cc-loader-color - The color of the animated circle (defaults: `#2653af`).
 */
export class ExampleComponent extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      one: { type: String },
      two: { type: Boolean },
      three: { type: Array, attribute: false },
      // Private var described here will trigger render when updated
      _privateOne: { type: Boolean, attribute: false },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    this.one = '';
    // TODO default values
  }

  // DOCS: 3. Property getters

  get one () {
    return this._one;
  }

  // DOCS: 4. Property setters

  // defining a setter this way allows to keep the lit's "prop changes => render" and hook into the update mechanism
  set one (newVal) {
    const oldVal = this._one;
    this._one = newVal;
    this.requestUpdate('one', oldVal);
    // Do something
  }

  // DOCS: 5. Public methods

  /** Docs for publicMethod(). */
  publicMethod () {
    // Do something
  }

  // DOCS: 6. Private methods

  _privateMethod () {
    // Do something
  }

  // DOCS: 7. Event handlers

  _onSomething () {
    // Do something
  }

  // DOCS: 8. Custom element lifecycle callbacks

  connectedCallback () {
    super.connectedCallback();
    // Do something
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    // Do something
  }

  // DOCS: 9. LitElement lifecycle callbacks

  firstUpdated () {

  }

  // DOCS: 10. LitElement's render method

  render () {

    // Prepare booleans and format stuffs here

    return html`
    `;
  }

  // DOCS: 11. LitElement's styles descriptor

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
        }
      `,
    ];
  }
}

// DOCS: Define the custom element

window.customElements.define('example-component', ExampleComponent);
