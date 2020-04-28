// DOCS: Don't add a 'use strict', no need for them in modern JS modules.
// DOCS: Put all imports here.
// DOCS: Always keep the ".js" at the end when you reference a file directly [error in ESLint].
// DOCS: We enforce import order [fixed by ESLint].
import { css, html, LitElement } from 'lit-element';
import { assetUrl } from '../src/lib/asset-url.js';

// DOCS: You may prepare URLs for assets like SVG files here:
const warningSvg = assetUrl(import.meta, '../assets/warning.svg');
const noRedirectionSvg = assetUrl(import.meta, '../assets/redirection-off.svg');

// DOCS: You may setup/init some stuffs here but this should be rare and most of the setup should happen in the component.
const MY_AWESOME_CONST = 'foobar';

// DOCS: You may setup/init constant data used when component is in skeleton state.
const SKELETON_FOOBAR = [
  { foo: '???????' },
  { foo: '????' },
  { foo: '???????' },
];

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
export class CcExampleComponent extends LitElement {

  // DOCS: 1. LitElement's properties descriptor

  static get properties () {
    return {
      // Simple public properties/attributes
      one: { type: String },
      two: { type: Boolean },
      three: { type: Array },
      // Private properties are prefixed with `_`
      // If it's described here, a change will trigger render().
      // Disable attribute for private properties.
      _privateFoobar: { type: Boolean, attribute: false },
    };
  }

  // DOCS: 2. Constructor

  constructor () {
    super();
    // Init default values for a clean component and for auto generated documentation.
    this.one = '';
    this.two = false;
    // You don't need to init everything, there are lots of valid use of default nullish properties.
  }

  // DOCS: 3. Property getters

  // Use the underscore prefix convention to store the value in the getter/setter.
  // You probably don't need this if you didn't add a setter.
  get one () {
    return this._one;
  }

  // DOCS: 4. Property setters

  // LitElement automatically creates getters/setters for your properties described in `static get properties ()`.
  // If you need a setter to hook into a property,
  // you will need to call LitElement's `this.requestUpdate('propName', oldVal)` to maintain the auto render mechanism.
  // Use the underscore prefix convention to store the value in the getter/setter.
  set one (newVal) {
    const oldVal = this._one;
    this._one = newVal;
    this.requestUpdate('one', oldVal);
    // Do something
  }

  // DOCS: 5. Public methods

  // It's rare, but your component may need to expose methods.
  // Native DOM elements have methods to focus, submit form...
  // Use JSDoc to document your method.
  /**
   * Documentation of this awesome method.
   * @param {String} foo - Docs for foo.
   * @param {Boolean} bar - Docs for bar.
   */
  publicMethod (foo, bar) {
    // Do something
  }

  // DOCS: 6. Private methods

  // It's common to use private methods not to have too much code in `render()`.
  // We often use this for i18n multiple cases.
  _privateMethod () {
    // Do something
  }

  // DOCS: 7. Event handlers

  // If you listen to an event in your `render()` function,
  // use a private method to handle the event and prefix it with `_on`.
  _onSomething () {
    // Do something
  }

  // DOCS: 8. Custom element lifecycle callbacks

  // It's rare, but you may need to directly into the custom element lifecycle callbacks.
  // This is useful if you set intervals or listeners.
  connectedCallback () {
    super.connectedCallback();
    // Do something
  }

  disconnectedCallback () {
    super.disconnectedCallback();
    // Do something
  }

  // DOCS: 9. LitElement lifecycle callbacks

  // If you need to setup some code before the first render, use this.
  // It's often needed if you component contains DOM managed by a 3rd party (chart, map...).
  firstUpdated () {

  }

  // DOCS: 10. LitElement's render method

  // All UI components will need this function to describe the "HTML template".
  render () {

    // Prepare booleans and format stuffs here

    return html`
      <div>This is <code>cc-example-component</code></div>
    `;
  }

  // DOCS: 11. LitElement's styles descriptor

  static get styles () {
    // This array may contain style imports from shared files.
    // Then you can defined your own component's styles.
    return [
      // language=CSS
      css`
        :host {
          /* You may use another display type but you need to define one. */
          display: block;
        }
      `,
    ];
  }
}

// DOCS: 12. Define the custom element

window.customElements.define('cc-example-component', CcExampleComponent);
