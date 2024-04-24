import { css, html, LitElement } from 'lit';
import { defineSmartComponentCore, observeContainer, updateContext } from '../../lib/smart-manager.js';

// Special case to propagate/merge contexts trough containers
defineSmartComponentCore({
  selector: 'cc-smart-container',
  onContextUpdate(container, component, context) {
    component.parentContext = context;
  },
});

export class CcSmartContainer extends LitElement {
  static get properties() {
    return {
      context: { type: Object, reflect: true },
      parentContext: { type: Object, attribute: false },
    };
  }

  constructor() {
    super();
    this.context = {};
    this.parentContext = {};
  }

  connectedCallback() {
    super.connectedCallback();
    this._abortController = new AbortController();
    observeContainer(this, this._abortController.signal);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._abortController.abort();
    delete this._abortController;
  }

  willUpdate(changedProperties) {
    updateContext(this, { ...this.parentContext, ...this.context });
  }

  render() {
    return html` <slot></slot> `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: contents;
        }
      `,
    ];
  }
}

customElements.define('cc-smart-container', CcSmartContainer);
