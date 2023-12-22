import { LitElement, html, css } from 'lit';

export class CtLabelWithIcon extends LitElement {
  static get properties () {
    return {
      label: { type: String },
      icon: { type: Object },
    };
  };

  render () {
    return html`
      <div class="label">
        ${
          this.icon
          ? html`<cc-icon class="icon" .icon='${this.icon}' size="lg"></cc-icon>`
          : ``
        }
        <span class="text">${this.label}</span>
      </div>
      <slot></slot>
    `;
  }

  static get styles () {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          row-gap: 0.5em;
        }
        
        slot::slotted(*) {
          margin-inline-start: 2em;
        }

        .label {
          display: inline-flex;
          align-items: center;
          column-gap: 0.5em;
        }
        
        .icon {
          --cc-icon-color: var(--cc-color-text-primary);
        }

        .text {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--ct-form-label--font-family), sans-serif;
          font-size: var(--ct-form-label--font-size);
          font-weight: var(--ct-form-label--font-weight);
        }
      `,
    ];
  }
}

customElements.define('ct-label-with-icon', CtLabelWithIcon);
