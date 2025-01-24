import { css, html, LitElement } from 'lit';
import { defineSmartComponentCore, observeContainer, updateContext } from '../../lib/smart-manager.js';

/**
 * @typedef {import('../../lib/smart-component.types.js').SmartContainer} SmartContainer
 * @typedef {import('../../lib/smart-component.types.js').SmartContext} SmartContext
 * @typedef {import('../../lib/smart-component.types.js').SmartComponent} SmartComponent
 * @typedef {import('lit').PropertyValues<CcSmartContainer>} CcSmartContainerPropertyValues
 */

// Special case to propagate/merge contexts trough containers
defineSmartComponentCore({
  selector: 'cc-smart-container',
  /**
   * @param {SmartContainer} _
   * @param {CcSmartContainer} component
   * @param {SmartContext} context
   */
  onContextUpdate(_, component, context) {
    if (component instanceof CcSmartContainer) {
      component.parentContext = context;
    }
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

  /**
   * @param {CcSmartContainerPropertyValues} _changedProperties
   */
  willUpdate(_changedProperties) {
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
