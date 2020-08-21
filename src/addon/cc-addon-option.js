import '../atoms/cc-img.js';
import '../atoms/cc-toggle.js';
import { css, html, LitElement } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map.js';
import { dispatchCustomEvent } from '../lib/events.js';
import { i18n } from '../lib/i18n.js';

/**
 * A component that allows to enable or disable an add-on option.
 *
 * * 🎨 default CSS display: `block`
 * <br>
 * 🧐 [component's source code on GitHub](https://github.com/CleverCloud/clever-components/blob/master/src/addon/cc-addon-option.js)
 *
 * ## Technical details
 *
 * * If you want to display a warning in the option, add the `option-warning` class to an HTML element. It will be displayed
 * with a custom color and in italic.
 *
 * @prop {String} logo - The logo URL of the option.
 * @prop {String} title - Title of the option.
 * @prop {Boolean} enabled - Enable the option by default.
 *
 * @event {CustomEvent<Boolean>} cc-addon-option:input - Fires when the option is enabled or disabled.
 *
 * @slot - The content of the option's description (text or HTML).
 */
export class CcAddonOption extends LitElement {

  static get properties () {
    return {
      title: { type: String },
      logo: { type: String },
      enabled: { type: Boolean, reflect: true },
    };
  }

  constructor () {
    super();
    this.title = null;
    this.logo = null;
    this.enabled = false;
  }

  _onToggleOption () {
    this.enabled = !this.enabled;
    dispatchCustomEvent(this, 'input', this.enabled);
  }

  render () {
    const choices = [
      { label: i18n('cc-addon-option.disabled'), value: false },
      { label: i18n('cc-addon-option.enabled'), value: true },
    ];

    return html`
      <div class="option">
        <cc-img class="logo" src=${this.logo}></cc-img>
        <div class="option-main">
          <div class="option-name">${this.title}</div>
          <slot class="option-details"></slot>
          <cc-toggle .choices=${choices} .value=${this.enabled} @cc-toggle:input=${this._onToggleOption}></cc-toggle>
        </div>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: block;
        }

        ::slotted(.option-warning) {
          color: #555;
          font-style: italic;
        }

        .option-main {
          display: grid;
          grid-gap: 0.5rem;
        }

        .option-name {
          font-weight: bold;
          line-height: 1.6;
          min-height: 1.6rem;
        }

        .option {
          border-radius: 0.25rem;
          display: grid;
          grid-gap: 1rem;
          grid-template-columns: min-content 1fr;
          padding: 1rem;
        }

        :host(:not([enabled])) {
          background-color: #f8f8f8;
          border: 2px solid #f8f8f8;
        }

        :host([enabled]) {
          border: 2px solid hsl(144, 56%, 43%);
        }

        .logo {
          border-radius: 0.25rem;
          height: 1.6rem;
          width: 1.6rem;
        }

        cc-toggle {
          justify-self: end;
          margin-top: 0.5rem;
        }

        .option--enabled cc-toggle {
          --cc-toggle-color: hsl(144, 56%, 43%);
        }

        .option-details {
          line-height: 1.5;
        }
      `,
    ];
  }
}

window.customElements.define('cc-addon-option', CcAddonOption);
