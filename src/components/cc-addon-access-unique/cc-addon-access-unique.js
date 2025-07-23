import { LitElement, html } from 'lit';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-addon-access-unique.types.js').CcAddonAccessUniqueState} CcAddonAccessUniqueState
 * @typedef {import('./cc-addon-access-unique.types.js').Content} Content
 * @typedef {import('./cc-addon-access-unique.types.js').TabContent} TabContent
 * @typedef {import('./cc-addon-access-unique.types.js').TabName} TabName
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 * @typedef {import('lit').PropertyValues<CcAddonAccessUnique>} CcAddonAccessUniquePropertyValues
 */

export class CcAddonAccessUnique extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _selectedTab: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {CcAddonAccessUniqueState} */
    this.state = { type: 'loading' };

    /** @type {TabName} */
    this._selectedTab = null;
  }

  /**
   * @param {TabName} toggleChoiceValue
   */
  _getToggleChoiceLabel(toggleChoiceValue) {
    switch (toggleChoiceValue) {
      case 'api':
        return i18n('cc-addon-access-unique.choice.api');
      case 'apm':
        return i18n('cc-addon-access-unique.choice.apm');
      case 'default':
        return i18n('cc-addon-access-unique.choice.default');
      case 'direct':
        return i18n('cc-addon-access-unique.choice.direct');
      case 'elastic':
        return i18n('cc-addon-access-unique.choice.elastic');
      case 'kibana':
        return i18n('cc-addon-access-unique.choice.kibana');
      default:
        return '';
    }
  }

  /**
   *
   * @param {Array<TabContent>|Content} content
   * @returns {Array<Choice>|null}
   */
  _getToggleChoices(content) {
    if (!Array.isArray(content) || content.length === 0) {
      return null;
    }

    return content.map(({ tabName }) => ({
      label: this._getToggleChoiceLabel(tabName),
      value: tabName,
    }));
  }

  /** @param {CcSelectEvent<TabName>} _ */
  _onTabSelect({ detail: tabName }) {
    this._selectedTab = tabName;
  }

  /** @param {CcAddonAccessUniquePropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state') && this.state.type === 'loaded-with-tabs') {
      this._selectedTab = this.state.tabs[0].tabName;
    }
  }

  render() {
    if (this.state.type === 'loading-with-tabs' || this.state.type === 'loading-without-tabs') {
      return html`<cc-loader></cc-loader>`;
    }

    if (this.state.type === 'error') {
      return html`<cc-notice message="error"></cc-notice>`;
    }

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-access-unique.heading')}</div>
        <div slot="content">${this.state.type === 'loaded-with-tabs' ? this._renderTabs(this.state.tabs) : ''}</div>
      </cc-block>
    `;
  }

  /** @param {TabContent[]} tabs */
  _renderTabs(tabs) {
    const toggleChoices = this._getToggleChoices(tabs);
    const selectedTabContent = tabs.find(({ tabName }) => tabName === this._selectedTab);

    return html`
      <cc-toggle
        .choices="${toggleChoices}"
        .value="${this._selectedTab}"
        @cc-select="${this._onTabSelect}"
      ></cc-toggle>
      <dl>
        ${selectedTabContent.host != null
          ? html`
              <dt>Host</dt>
              <dd>${selectedTabContent.host}</dd>
            `
          : ''}
        ${selectedTabContent.password != null
          ? html`
              <dt>Host</dt>
              <dd>
                <cc-input-text secret clipboard value="${selectedTabContent.password}"></cc-input-text>
              </dd>
            `
          : ''}
      </dl>
    `;
  }
}

// eslint-disable-next-line wc/tag-name-matches-class
customElements.define('cc-addon-access-unique-beta', CcAddonAccessUnique);
