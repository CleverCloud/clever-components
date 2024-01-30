import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { html as staticHtml, unsafeStatic } from 'lit/static-html.js';
import '../../cc-smart-container/cc-smart-container.js';
import { dispatchCustomEvent } from '../../../lib/events.js';

const DEMOS = {
  'with-cc-components': 'With clever components',
  'with-native-inputs': 'With native inputs',
  'with-array-type': 'With array type',
  'with-custom-error-message': 'With custom error message',
  'with-custom-validation': 'With custom validation',
  'focus-order': 'Focus in DOM order',
  'dynamic-form': 'Dynamic form',
  'multiple-forms': 'Multiple forms',
  'with-smart-component': 'With smart component',
  reset: 'Reset',
  'not-in-form': 'Bad pattern: not in <form>',
  'not-in-same-form': 'Bad pattern: not in same <form>',
};

export class CcFtDemo extends LitElement {
  static get properties () {
    return {
      _demo: {
        type: String,
        state: true,
      },
      _event: {
        type: Object,
        state: true,
      },
    };
  }

  constructor () {
    super();

    /** @type {null|string} */
    this._demo = null;
    /** @type {null|Object} */
    this._event = null;
  }

  _getDemoFilePath (demo) {
    return `./cc-ft-demo-${demo}.js`;
  }

  _onDemoClick (e) {
    this._loadDemo(e.target.dataset.demo);
  }

  _onFormSubmit (e) {
    this._event = {
      type: `🎉 ${e.type}`,
      detail: e.detail,
      json: JSON.stringify(e.detail, null, 2),
    };
    console.log(`${this._event.type}: ${this._event.json}`);
  }

  _onFormInvalid (e) {
    this._event = {
      type: `⚠️ ${e.type}`,
      detail: e.detail,
      json: JSON.stringify(e.detail, null, 2),
    };
    console.log(`${this._event.type}: ${this._event.json}`);
  }

  _loadDemo (demo) {
    import((this._getDemoFilePath(demo))).then(() => {
      this._demo = demo;
      this._event = null;
      dispatchCustomEvent(this, 'demoChange', {
        demo: this._demo,
        src: this._getDemoFilePath(this._demo),
      });
    });
  }

  firstUpdated (changedProperties) {
    this._loadDemo(Object.keys(DEMOS)[0]);
  }

  render () {
    return html`
      <div class="left">
        ${
          Object.entries(DEMOS).map(([name, label]) => html`
            <button data-demo=${name}
                    @click=${this._onDemoClick}
                    class=${classMap({ selected: this._demo === name })}>
              ${label}
            </button>
          `)
        }
      </div>
      <div class="right">
        <div class="demo">
          ${this._renderDemo()}
        </div>
        ${this._event != null ? html`
          <div class="event">
            <div class="event-title">${this._event.type}</div>
            <pre>${this._event.json}</pre>
          </div>
        ` : ''}
        
      </div>
    `;
  }

  _renderDemo () {
    if (this._demo == null) {
      return null;
    }
    const tagName = `cc-ft-demo-${this._demo}`;
    const submitEventName = `@${tagName}:formSubmit`;

    return html`
      <cc-smart-container context='{ "fake": "fake" }'>
        ${staticHtml`<${unsafeStatic(tagName)} ${unsafeStatic(submitEventName)}=${this._onFormSubmit} @form:invalid=${this._onFormInvalid}></${unsafeStatic(tagName)}>`}
      </cc-smart-container>`;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        /* stylelint-disable no-duplicate-selectors */

        :host {
          display: flex;
          gap: 1em;
        }

        .left {
          display: flex;
          min-width: 150px;
          flex-direction: column;
          padding: 0.5em;
          border: 1px solid #ddd;
          border-radius: 0.3em;
          gap: 0.5em;
        }

        .right {
          min-width: 300px;
          padding: 0.5em;
          border: 1px solid #ddd;
          border-radius: 0.3em;
          display: flex;
          flex-direction: column;
          gap: 2em;
        }
        
        .demo {
          flex: 1;
        }

        .event {
          border: 1px solid #ddd;
        }
        
        .event-title {
          padding: 0.5em;
          font-family: monospace;
          font-weight: bold;
        } 
        
        pre {
          background-color: #efefef;
          padding: 0.5em;
          margin: 0;
          overflow: auto;
          max-height: 500px;
        }

        button {
          display: block;
          padding: 0;
          border: none;
          margin: 0;
          background: unset;
          font-family: inherit;
          font-size: unset;
        }

        button {
          padding: 0.2em;
          background-color: #eee;
          cursor: pointer;
        }

        button.selected {
          background-color: #ccc;
        }
      `,
    ];
  }
}

window.customElements.define('cc-ft-demo', CcFtDemo);
