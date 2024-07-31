const { format } = require('prettier');

const code = `
class MyComponent extends LitElement { 
  constructor() {
    super();

    /** @type {string} */
    this.code = null;

    /** @type {string} */
    this.name = null;

    /** @type {string} */
    this.infra = null;

    /** @type {string} */
    this.flagUrl = null;

    /** @type {string} */
    this.country = null;

    /** @type {string} */
    this.countryCode = null;

    /** @type {ZoneImage[]} */
    this.images = [];

    /** @type {string[]} */
    this.tags = [];

    /** @type {boolean} */
    this.disabled = false;

    /** @type {boolean} */
    this.selected = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._onClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('click', this._onClick);
  }

  _onClick() {
    if (!this.disabled && this.selected) {
      dispatchCustomEvent(this, 'zone-selected', this.code);
    }
  }
}
`;

format(code, {
  parser: 'babel',
  plugins: ['./prettier-rules/sort-constructor.cjs'],
}).then((code) => console.log(code));
