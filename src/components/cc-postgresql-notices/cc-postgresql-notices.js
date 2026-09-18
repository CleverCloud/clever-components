import { css, html, LitElement } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-notice/cc-notice.js';

/**
 * @import { PostgresqlNoticesState } from './cc-postgresql-notices.types.js'
 * @import { TemplateResult } from 'lit'
 */

/**
 * A component displaying the conditions requiring the attention of the owner of a PostgreSQL add-on.
 *
 * ## Details
 *
 * * Nothing is rendered while loading, when loading fails, or when the add-on is in a healthy state.
 * * The host box is removed from the layout (`display: contents`) so that each notice is laid out
 *   by the page itself, and so that nothing takes space when there is no notice to display.
 *
 * @cssdisplay contents
 */
export class CcPostgresqlNotices extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {PostgresqlNoticesState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  render() {
    if (this.state.type !== 'loaded') {
      return '';
    }

    const { quotaExceeded, missingCredentials, endOfLife } = this.state.notices;

    return html`
      ${quotaExceeded
        ? html`
            <cc-notice
              intent="danger"
              heading="${i18n('cc-postgresql-notices.quota-exceeded.heading')}"
              message="${i18n('cc-postgresql-notices.quota-exceeded.desc')}"
            ></cc-notice>
          `
        : ''}
      ${endOfLife != null ? this._renderEndOfLife(endOfLife.version, endOfLife.eolDate) : ''}
      ${missingCredentials
        ? html`
            <cc-notice
              intent="info"
              heading="${i18n('cc-postgresql-notices.missing-credentials.heading')}"
              message="${i18n('cc-postgresql-notices.missing-credentials.desc')}"
            ></cc-notice>
          `
        : ''}
    `;
  }

  /**
   * @param {string} version
   * @param {string} eolDate
   * @returns {TemplateResult}
   * @private
   */
  _renderEndOfLife(version, eolDate) {
    return html`
      <cc-notice intent="warning" heading="${i18n('cc-postgresql-notices.end-of-life.heading')}">
        <div slot="message">${i18n('cc-postgresql-notices.end-of-life.desc', { version, eolDate })}</div>
      </cc-notice>
    `;
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          display: contents;
        }
      `,
    ];
  }
}

window.customElements.define('cc-postgresql-notices', CcPostgresqlNotices);
