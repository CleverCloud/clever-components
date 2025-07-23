import { LitElement, html } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-access-info/cc-addon-access-info.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-code/cc-code.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-toggle/cc-toggle.js';

/**
 * @typedef {import('./cc-addon-access-unique.types.js').CcAddonAccessUniqueState} CcAddonAccessUniqueState
 * @typedef {import('./cc-addon-access-unique.types.js').TabbedContent} TabbedContent
 * @typedef {import('./cc-addon-access-unique.types.js').TabName} TabName
 * @typedef {import('../cc-toggle/cc-toggle.types.js').Choice} Choice
 * @typedef {import('lit').PropertyValues<CcAddonAccessUnique>} CcAddonAccessUniquePropertyValues
 */

export class CcAddonAccessUnique extends LitElement {
  static get properties() {
    return {
      docLink: { type: Object, attribute: 'doc-link' },
      state: { type: Object },
      _selectedTab: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {{ text: string; href: string; }} */
    this.docLink = null;

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
    this._selectedTab = tabName;
  }

  /** @param {CcAddonAccessUniquePropertyValues} changedProperties */
  willUpdate(changedProperties) {
    if (
      changedProperties.has('state') &&
      (changedProperties.get('state')?.type !== 'loaded-with-tabs' ||
        changedProperties.get('state')?.type !== 'loading-with-tabs') &&
      (this.state.type === 'loaded-with-tabs' || this.state.type === 'loading-with-tabs')
    ) {
      this._selectedTab = /** @type {TabName} */ (Object.keys(this.state.tabs)[0]);
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice message="error" intent="warning"></cc-notice>`;
    }
    const skeleton = this.state.type === 'loading' || this.state.type === 'loading-with-tabs';

    console.log(this.state);
    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-addon-access-unique.heading')}</div>
        ${this.state.type === 'loaded' || this.state.type === 'loading'
          ? html`
              <cc-addon-access-info
                .info="${this.state.content}"
                .skeleton="${skeleton}"
                slot="content"
              ></cc-addon-access-info>
            `
          : ''}
        ${this.state.type === 'loaded-with-tabs' || this.state.type === 'loading-with-tabs'
          ? this._renderTabs(this.state.tabs, skeleton)
          : ''}
        ${this.state.cliCommand != null ? this._renderCliCommand(this.state.cliCommand) : ''}
      </cc-block>
    `;
  }

  /**
   * @param {TabbedContent} tabs
   * @param {boolean} skeleton
   **/
  _renderTabs(tabs, skeleton) {
    const tabNames = /** @type {TabName[]} */ (Object.keys(tabs));
    const toggleChoices = this._getToggleChoices(tabNames);
    const selectedTabContent = tabs[this._selectedTab] ?? Object.values(tabs)[0];

    return html`
      <cc-toggle
        .choices="${toggleChoices}"
        .value="${this._selectedTab}"
        @cc-select="${this._onTabSelect}"
        slot="header-right"
      ></cc-toggle>
      <cc-addon-access-info .info="${selectedTabContent}" .skeleton="${skeleton}" slot="content"></cc-addon-access-info>
    `;
  }

  /** @param {string} cliCommand */
  _renderCliCommand(cliCommand) {
    return html`
      <cc-block-details slot="footer-left">
        <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
        <div slot="link">
          <cc-link href="${this.docLink.href}" .icon="${iconInfo}">${this.docLink.text}</cc-link>
        </div>
        <div slot="content">
          <div class="cli-heading">${i18n('cc-addon-access-unique.cli.heading')}</div>
          <p>${i18n('cc-addon-access-unique.cli.text')}</p>
          <p>${i18n('cc-addon-access-unique.cli.command')}</p>
          <cc-code>${cliCommand}</cc-code>
        </div>
      </cc-block-details>
    `;
  }
}

customElements.define('cc-addon-access-unique', CcAddonAccessUnique);
