import { css, html, LitElement } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import '../../components/cc-button/cc-button.js';
import '../../components/cc-dialog/cc-dialog.js';

/**
 * A fake Lit component to demonstrate the three dialog control patterns.
 * This is used in the cc-dialog stories to showcase real-world usage patterns.
 */
export class MyDialogParentComponent extends LitElement {
  static get properties() {
    return {
      declarativeDialogOpen: { type: Boolean, state: true },
      showConditionalDialog: { type: Boolean, state: true },
    };
  }

  static get styles() {
    return css`
      .pattern-section {
        border: 1px solid var(--cc-color-border-neutral, #ccc);
        border-radius: 0.25em;
        margin-bottom: 1.5em;
        padding: 1em;
      }

      .pattern-section h3 {
        margin-top: 0;
      }

      .pattern-section p {
        margin: 0.5em 0;
      }
    `;
  }

  constructor() {
    super();
    this.declarativeDialogOpen = false;
    this.showConditionalDialog = false;
    this.imperativeDialogRef = createRef();
  }

  render() {
    return html`
      <!-- Pattern 1: Declarative (controlled via open attribute) -->
      <div class="pattern-section">
        <h3>Pattern 1: Declarative (Controlled)</h3>
        <p>The <code>open</code> attribute is bound to component state. Listen to <code>cc-dialog-close</code> to sync state.</p>
        <cc-button @cc-click="${this._openDeclarativeDialog}" primary>
          Open Declarative Dialog
        </cc-button>
        <cc-dialog
          ?open="${this.declarativeDialogOpen}"
          heading="Declarative Dialog"
          @cc-dialog-close="${this._closeDeclarativeDialog}"
        >
          <p>This dialog's <code>open</code> attribute is controlled by parent component state.</p>
          <p>When closed (via Escape, backdrop click, or close button), the <code>cc-dialog-close</code> event updates the state.</p>
        </cc-dialog>
      </div>

      <!-- Pattern 2: Imperative (using show() and hide() methods) -->
      <div class="pattern-section">
        <h3>Pattern 2: Imperative (Methods)</h3>
        <p>Use <code>show()</code> and <code>hide()</code> methods directly on the dialog element.</p>
        <cc-button @cc-click="${this._openImperativeDialog}" primary>
          Open Imperative Dialog
        </cc-button>
        <cc-dialog ${ref(this.imperativeDialogRef)} heading="Imperative Dialog">
          <p>This dialog is controlled imperatively using the <code>show()</code> and <code>hide()</code> methods.</p>
          <p>No need to listen to events or manage state - the dialog handles its own open/closed state.</p>
          <cc-button @cc-click="${this._closeImperativeDialog}">
            Close Programmatically
          </cc-button>
        </cc-dialog>
      </div>

      <!-- Pattern 3: Conditional Rendering -->
      <div class="pattern-section">
        <h3>Pattern 3: Conditional Rendering</h3>
        <p>Render/remove the dialog from the DOM based on state. Always use <code>open</code> when rendering.</p>
        <cc-button @cc-click="${this._openConditionalDialog}" primary>
          Open Conditional Dialog
        </cc-button>
        ${this.showConditionalDialog
          ? html`
              <cc-dialog
                open
                heading="Conditional Dialog"
                @cc-dialog-close="${this._closeConditionalDialog}"
              >
                <p>This dialog is conditionally rendered in the template.</p>
                <p>When closed, it's completely removed from the DOM.</p>
                <p>Always set <code>open</code> when conditionally rendering to ensure it displays immediately.</p>
              </cc-dialog>
            `
          : ''}
      </div>
    `;
  }

  _openDeclarativeDialog() {
    this.declarativeDialogOpen = true;
  }

  _closeDeclarativeDialog() {
    this.declarativeDialogOpen = false;
  }

  _openImperativeDialog() {
    this.imperativeDialogRef.value?.show();
  }

  _closeImperativeDialog() {
    this.imperativeDialogRef.value?.hide();
  }

  _openConditionalDialog() {
    this.showConditionalDialog = true;
  }

  _closeConditionalDialog() {
    this.showConditionalDialog = false;
  }
}

customElements.define('my-dialog-parent-component', MyDialogParentComponent);
