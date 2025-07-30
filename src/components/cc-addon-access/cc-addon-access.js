import { LitElement, html } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-access-content/cc-addon-access-content.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-code/cc-code.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-addon-access.types.js').CcAddonAccessState} CcAddonAccessState
 * @typedef {import('./cc-addon-access.types.js').Tabs} Tabs
 * @typedef {import('./cc-addon-access.types.js').TabName} TabName
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 * @typedef {import('lit').PropertyValues<CcAddonAccess>} CcAddonAccessPropertyValues
 */

/**
 * A component to display access information for an add-on.
 *
 * ## Details
 *
 * This component displays various access details for an add-on, such as API credentials, direct access information, or other relevant connection details.
 * It supports different views through tabs, allowing users to switch between various access methods or categories.
 *
 * The content displayed within each tab is managed by the `cc-addon-access-content` component. It also provides a link to the official documentation for more information.
 *
 * @cssdisplay block
 */

export class CcAddonAccess extends LitElement {
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

    /** @type {CcAddonAccessState} */
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
        return i18n('cc-addon-access.choice.api');
      case 'apm':
        return i18n('cc-addon-access.choice.apm');
      case 'default':
        return i18n('cc-addon-access.choice.default');
      case 'direct':
        return i18n('cc-addon-access.choice.direct');
      case 'elastic':
        return i18n('cc-addon-access.choice.elastic');
      case 'kibana':
        return i18n('cc-addon-access.choice.kibana');
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

  /** @param {CcAddonAccessPropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type !== 'error' && this._selectedTabName == null) {
      this._selectedTabName = /** @type {TabName} */ (Object.keys(this.state.tabs)[0]);
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice message="${i18n('cc-addon-access.error')}" intent="warning"></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const tabNames = /** @type {TabName[]} */ (Object.keys(this.state.tabs));
    const toggleChoices = this._getToggleChoices(tabNames);
    const activeTabContent = this.state.tabs[this._selectedTabName] ?? Object.values(this.state.tabs)[0];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-access.heading')}</div>
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
              <cc-addon-access-content
                .contentItems="${activeTabContent}"
                .skeleton="${skeleton}"
                slot="content"
              ></cc-addon-access-content>
            `
          : ''}
        ${this.docLink != null
          ? html`
              <div slot="footer-right">
                <cc-link .href="${this.docLink?.href}" .icon="${iconInfo}"> ${this.docLink.text} </cc-link>
              </div>
            `
          : ''}
      </cc-block>
    `;
  }
}

customElements.define('cc-addon-access', CcAddonAccess);
