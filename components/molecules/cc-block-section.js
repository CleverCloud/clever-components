import { css, html, LitElement } from 'lit-element';

/**
 * A display component with mostly HTML+CSS to separate a `<cc-block>` into different sections.
 *
 * ## Details
 *
 * * This component is designed to only be use as a direct child of `<cc-block>`.
 *
 * @slot The main content (right part) of the section. If info is not defined, this will take all the width.
 * @slot info - The info (left part) of the section.
 * @slot title - The title of the section. You can use a `.danger` CSS class on your `<div slot="title">` if it's a danger zone.
 */
export class CcBlockSection extends LitElement {

  render () {
    return html`
      <slot name="title"></slot>
      <div class="section">
        <slot name="info"></slot>
        <slot class="main"></slot>
      </div>
    `;
  }

  static get styles () {
    return [
      // language=CSS
      css`
        :host {
          display: grid;
          grid-gap: 1rem;
        }

        /*
        REQUIREMENT #1: We want to style <cc-block-section> elements but only when they are used inside the default slot of a <cc-block>.
        => This can be done from the <cc-block> with CSS only ::slotted(cc-block-section).
        REQUIREMENT #2: As the point is to add separation lines/borders, we don't want to style the first one.
        => This cannot be done with ::slotted(cc-block-section:first-of-type).
        SOLUTION: Add the margin directly in <cc-block-section> with :host(:not(:first-of-type))
        WARNINGS #1: This breaks the "don't add margin on the :host, do it on the parent" but we exlained why we cannot do it.
        WARNINGS 21: This code will work even if the parent is not a <cc-block>. We could do something to prevent this pb with connectedCallback and a class or an attribute but it's a bit much just for this.
         */
        :host(:not(:first-of-type)) {
          border-top: 1px solid #bcc2d1;
          margin-top: 1rem;
          padding-top: 2rem;
        }

        ::slotted([slot="title"]) {
          font-weight: bold;
        }

        ::slotted([slot="title"].danger) {
          color: hsl(351, 70%, 47%);
        }

        .section {
          display: flex;
          flex-wrap: wrap;
          margin: -0.5rem -1.5rem;
        }

        ::slotted([slot="info"]),
        .main {
          margin: 0.5rem 1.5rem;
        }

        ::slotted([slot="info"]) {
          color: #333;
          flex: 1 1 15rem;
          line-height: 1.5;
        }

        .main {
          display: grid;
          flex: 2 2 30rem;
          grid-gap: 1rem;
        }
      `,
    ];
  }
}

window.customElements.define('cc-block-section', CcBlockSection);
