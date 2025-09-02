import { LitElement, css, html } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-credentials-content/cc-addon-credentials-content.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-code/cc-code.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-addon-credentials-beta.types.js').AddonCredentialsBetaState} AddonCredentialsBetaState
 * @typedef {import('./cc-addon-credentials-beta.types.js').TabName} TabName
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 * @typedef {import('lit').PropertyValues<CcAddonCredentialsBeta>} CcAddonCredentialsBetaPropertyValues
 */

/**
 * A component to display credentials for an add-on.
 *
 * ## Details
 *
 * This component displays various credentials for an add-on, such as username, password, direct access information, or other relevant connection details.
 * It supports different views through tabs, allowing users to switch between various access methods or categories.
 *
 * The content displayed within each tab is managed by the `cc-addon-credentials-content` component. It also provides a link to the official documentation for more information.
 *
 * @cssdisplay block
 */

export class CcAddonCredentialsBeta extends LitElement {
  static get properties() {
    return {
      docLink: { type: Object, attribute: 'doc-link' },
      state: { type: Object },
      _selectedTabName: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {{ text: string; href: string; }} */
    this.docLink = null;

    /** @type {AddonCredentialsBetaState} */
    this.state = { type: 'loading', tabs: { default: [] } };

    /** @type {TabName} */
    this._selectedTabName = null;
  }

  /**
   * @param {TabName} toggleChoiceValue
   */
  _getToggleChoiceLabel(toggleChoiceValue) {
    switch (toggleChoiceValue) {
      case 'api':
        return i18n('cc-addon-credentials-beta.choice.api');
      case 'apm':
        return i18n('cc-addon-credentials-beta.choice.apm');
      case 'default':
        return i18n('cc-addon-credentials-beta.choice.default');
      case 'direct':
        return i18n('cc-addon-credentials-beta.choice.direct');
      case 'elastic':
        return i18n('cc-addon-credentials-beta.choice.elastic');
      case 'kibana':
        return i18n('cc-addon-credentials-beta.choice.kibana');
      default:
        return '';
    }
  }

  /**
   *
   * @param {Array<TabName>} tabNames
   * @returns {Array<Choice>|null}
   */
  _getToggleChoices(tabNames) {
    return tabNames.map((tabName) => ({
      label: this._getToggleChoiceLabel(tabName),
      value: tabName,
    }));
  }

  /** @param {CcSelectEvent<TabName>} _ */
  _onTabSelect({ detail: tabName }) {
    this._selectedTabName = tabName;
  }

  /** @param {CcAddonCredentialsBetaPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type !== 'error' && this._selectedTabName == null) {
      this._selectedTabName = /** @type {TabName} */ (Object.keys(this.state.tabs)[0]);
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice message="${i18n('cc-addon-credentials-beta.error')}" intent="warning"></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const tabNames = /** @type {TabName[]} */ (Object.keys(this.state.tabs));
    const toggleChoices = this._getToggleChoices(tabNames);
    const activeTabContent = this.state.tabs[this._selectedTabName] ?? Object.values(this.state.tabs)[0];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-credentials-beta.heading')}</div>
        ${tabNames.length > 1
          ? html`
              <cc-toggle
                .choices="${toggleChoices}"
                .value="${this._selectedTabName}"
                @cc-select="${this._onTabSelect}"
                slot="header-right"
              ></cc-toggle>
            `
          : ''}
        ${this.state.type === 'loaded' || this.state.type === 'loading'
          ? html`
              <cc-addon-credentials-content
                .credentials="${activeTabContent}"
                .skeleton="${skeleton}"
                slot="content"
              ></cc-addon-credentials-content>
            `
          : ''}
        <slot name="footer-credentials" slot="footer-left">
          ${this.docLink != null
            ? html`
                <div slot="footer-right">
                  <cc-link .href="${this.docLink?.href}" .icon="${iconInfo}"> ${this.docLink.text} </cc-link>
                </div>
              `
            : ''}
        </slot>
      </cc-block>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        cc-toggle {
          display: flex;
          flex-wrap: wrap;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-credentials-beta', CcAddonCredentialsBeta);
