import { css, html, LitElement } from 'lit';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import '../../src/components/cc-select/cc-select.js';
import '../../src/components/cc-smart-container/cc-smart-container.js';

const DEMOS = {
  'with-cc-components': 'With clever components',
  'with-native-inputs': 'With native inputs',
  reset: 'With reset values',
  'with-array-type': 'With array types',
  'with-custom-error-message': 'With custom error messages',
  'with-custom-validation': 'With custom validations',
  'with-coupled-inputs': 'With coupled inputs',
  'with-fieldset': 'With fieldset',
  'dynamic-form': 'With dynamic form',
  'with-smart-component': 'With smart component',
};

const DEMO_CHOICES = Object.entries(DEMOS).map(([value, label]) => ({ value, label }));

/**
 * @typedef {import('../../src/lib/form/form.events.js').CcFormValidEvent} CcFormValidEvent
 * @typedef {import('../../src/lib/form/form.events.js').CcFormInvalidEvent} CcFormInvalidEvent
 * @typedef {import('lit').PropertyValues<FormsSandbox>} FormsSandboxPropertyValues
 */

export class FormsSandbox extends LitElement {
  static get properties() {
    return {
      _demo: { type: String, state: true },
      _event: { type: Object, state: true },
    };
  }

  constructor() {
    super();

    this._demo = null;
    this._event = null;
  }

  /**
   * @param {CcSelectEvent} e
   */
  _onDemoChange({ detail }) {
    this._loadDemo(detail);
  }

  /**
   * @param {CcFormValidEvent} e
   */
  _onFormValid(e) {
    this._event = {
      type: `🎉 ${e.type}`,
      detail: e.detail,
      json: JSON.stringify(e.detail, null, 2),
    };
    console.log(`${this._event.type}: ${this._event.json}`);
  }

  /**
   * @param {CcFormInvalidEvent} e
   */
  _onFormInvalid(e) {
    this._event = {
      type: `⚠️ ${e.type}`,
      detail: e.detail,
      json: JSON.stringify(e.detail, null, 2),
    };
    console.log(`${this._event.type}: ${this._event.json}`);
  }

  /**
   * @param {string} demo
   */
  _loadDemo(demo) {
    import(`./form-demo-${demo}.js`).then(() => {
      this._demo = demo;
      localStorage.setItem('cc-sandbox-form-demo', demo);
      this._event = null;
    });
  }

  /**
   * @param {FormsSandboxPropertyValues} _changedProperties
   */
  firstUpdated(_changedProperties) {
    this._loadDemo(localStorage.getItem('cc-sandbox-form-demo') || Object.keys(DEMOS)[0]);
  }

  render() {
    return html`
      <div class="ctrl">
        <cc-select
          label="Demo"
          inline
          .options=${DEMO_CHOICES}
          .value=${this._demo}
          @cc-select=${this._onDemoChange}
        ></cc-select>
      </div>
      <div class="main">
        <div class="demo">
          <cc-smart-container context='{ "fake": "fake" }'> ${this._renderDemo()} </cc-smart-container>
        </div>
        ${this._event != null
          ? html`
              <div class="spacer"></div>
              <div class="event">
                <div class="event-title">${this._event.type}</div>
                <pre>${this._event.json}</pre>
              </div>
            `
          : ''}
      </div>
    `;
  }

  _renderDemo() {
    if (this._demo == null) {
      return null;
    }
    const tagName = `form-demo-${this._demo}`;

    return staticHtml`<${unsafeStatic(tagName)} @cc-form-valid=${this._onFormValid} @cc-form-invalid=${this._onFormInvalid}></${unsafeStatic(tagName)}>`;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        .ctrl {
          align-items: center;
          border-bottom: 1px solid #ddd;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          margin-bottom: 1em;
          padding-bottom: 1em;
        }

        .main {
          display: flex;
          gap: 1em;
          padding: 1em;
        }

        .spacer {
          flex: 1;
        }

        .event {
          align-self: center;
          border: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          max-height: 30em;
          width: 25em;
        }

        .event-title {
          font-family: monospace;
          font-weight: bold;
          padding: 1em;
        }

        pre {
          background-color: #efefef;
          margin: 0;
          overflow: auto;
          padding: 1em;
          white-space: pre-wrap;
        }
      `,
    ];
  }
}

window.customElements.define('forms-sandbox', FormsSandbox);
