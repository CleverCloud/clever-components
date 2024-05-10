import { css, html, LitElement } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import { AsyncDirective, directive as asyncDirective } from 'lit/async-directive.js';
import { cache } from 'lit/directives/cache.js';

class MyDirective extends Directive {

  constructor (partInfo) {
    super(partInfo);
    // console.log('partInfo', partInfo);
  }

  update (part) {
    // console.log('update', part);
    part.element.dataset.foo = Math.random().toString(36).slice(2);
  }

  // render (...args) {
  //   console.log('render', args);
  // }

}

class MyAsyncDirective extends AsyncDirective {

  constructor (partInfo) {
    super(partInfo);
    console.log('constructor', partInfo);
  }

  disconnected () {
    console.log('disconnected');
  }

  reconnected () {
    console.log('reconnected');
  }

  update (part, params) {
    console.log('update');
    return this.render(params);
  }

  render (params) {
    console.log('render', params);
  }

}

// Create the directive function

const myDirective = directive(MyDirective);
const myAsyncDirective = asyncDirective(MyAsyncDirective);

/**
 * TODO DOCS
 */
export class MyComponent extends LitElement {

  static get properties () {
    return {
      _enabled: { type: Boolean },
    };
  }

  constructor () {
    super();
    this._enabled = true;
  }

  connectedCallback () {
    super.connectedCallback();
    // setInterval(() => {
    //   this._enabled = !this._enabled;
    // }, 3000);
  }

  render () {
    return html`
      This is <code ${myDirective('hey', 'foo')}>MyComponent</code> component!
      ${cache(this._enabled ? html`
        <strong ${myAsyncDirective('YES')}>YEAH cached!!</strong>
      ` : '')}
      ${!this._enabled ? html`
        <strong ${myAsyncDirective('NO')}>YEAH not cached!!</strong>
      ` : ''}
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

window.customElements.define('my-component', MyComponent);
