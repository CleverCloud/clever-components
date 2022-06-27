import { css, html, LitElement } from 'lit-element';
import { defaultThemeStyles } from '../styles/default-theme.js';

/**
 * @typedef {import('./types.js').BadgeIntent} BadgeIntent
 * @typedef {import('./types.js').BadgeWeight} BadgeWeight
 */

/**
 * A component to highlight a small chunk of text.
 *
 * @cssdisplay inline-flex
 */
export class CcBadge extends LitElement {
  static get properties () {
    return {
      circle: { type: Boolean, reflect: true },
      iconAlt: { type: String, attribute: 'icon-alt' },
      iconSrc: { type: String, attribute: 'icon-src' },
      intent: { type: String, reflect: true },
      weight: { type: String, reflect: true },
    };
  }

  constructor () {
    super();

    /** @type {Boolean} Sets the badge to a bubble style. Should only be used to display 1 or 2 digits figures. */
    this.circle = false;

    /** @type {String|null} Sets the `alt` attribute value on the `<img>` tag. Only use if the image conveys additional info compared to surrounding text. */
    this.iconAlt = null;

    /** @type {String|null} Sets the icon displayed on the left of the text inside the badge. */
    this.iconSrc = null;

    /** @type {BadgeIntent} Sets the accent color used for the badge. */
    this.intent = 'neutral';

    /** @type {BadgeWeight} Sets the style of the badge depending on how much one wants it to stand out. */
    this.weight = 'dimmed';
  }

  render () {
    return html`
      ${this.iconSrc != null ? html`
        <img src=${this.iconSrc} alt=${this.iconAlt ?? ''}>
      ` : ''}
      <span>
        <slot></slot>
      </span>
    `;
  }

  static get styles () {
    return [
      defaultThemeStyles,
      // language=CSS
      css`
        :host {
          align-items: center;
          border-radius: 1em;
          display: inline-flex;
          font-size: 0.8em;
          gap: 0.3em;
          padding: 0.2em 0.8em;
        }

        :host([circle]) {
          border-radius: 50%;
          font-size: 1em;
          height: 1.5em;
          justify-content: center;
          min-height: unset;
          padding: 0;
          width: 1.5em;
        }

        :host([weight="dimmed"]) {
          background-color: var(--accent-color, #ccc);
          color: var(--color-text-default);
        }

        :host([weight="strong"]) {
          background-color: var(--accent-color, #777);
          color: var(--color-text-inverted, #fff);
        }

        :host([weight="outlined"]) {
          background-color: var(--color-bg-default, #fff);
          /* roughly 1px. We want the border to scale with the font size so that outlined
          badges still stand out as they should when font-size is increased. */
          box-shadow: inset 0 0 0 0.06em var(--accent-color, #777);
          color: var(--accent-color, #777);
        }

        :host([intent="info"]) {
          --accent-color: var(--color-bg-primary);
        }

        :host([intent="info"][weight="dimmed"]) {
          --accent-color: var(--color-bg-primary-light);
        }

        :host([intent="success"]) {
          --accent-color: var(--color-bg-success);
        }

        :host([intent="success"][weight="dimmed"]) {
          --accent-color: var(--color-bg-success-light);
        }

        :host([intent="danger"]) {
          --accent-color: var(--color-bg-danger);
        }

        :host([intent="danger"][weight="dimmed"]) {
          --accent-color: var(--color-bg-danger-light);
        }

        :host([intent="warning"]) {
          --accent-color: var(--color-bg-warning);
        }

        :host([intent="warning"][weight="dimmed"]) {
          --accent-color: var(--color-bg-warning-light);
        }

        :host([intent="neutral"]) {
          --accent-color: var(--color-bg-strong);
        }

        :host([intent="neutral"][weight="dimmed"]) {
          --accent-color: var(--color-bg-neutral-alt);
        }

        img {
          height: 1em;
        }
      `,
    ];
  }
}

window.customElements.define('cc-badge', CcBadge);
