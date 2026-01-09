import { LitElement, css, html } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { isStringEmpty } from '../../lib/utils.js';
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
 * @import { AddonCredentialsBetaState, TabName } from './cc-addon-credentials-beta.types.js'
 * @import { Choice } from '../cc-toggle/cc-toggle.types.js'
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
      state: { type: Object },
      _selectedTabName: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {AddonCredentialsBetaState} */
    this.state = {
      type: 'loading',
      tabs: {
        default: {
          content: [],
          docLink: { text: fakeString(10), href: null },
        },
      },
    };

    /** @type {TabName} */
    this._selectedTabName = 'default';
  }

  /**
   * @param {TabName} toggleChoiceValue
   */
  _getToggleChoiceLabel(toggleChoiceValue) {
    switch (toggleChoiceValue) {
      case 'admin':
        return i18n('cc-addon-credentials-beta.choice.admin');
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

  willUpdate() {
    if (this.state.type === 'loading') {
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
    const activeTab = this.state.tabs[this._selectedTabName] ?? Object.values(this.state.tabs)[0];

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
                ?disabled="${skeleton}"
              ></cc-toggle>
            `
          : ''}
        ${this.state.type === 'loaded' || this.state.type === 'loading'
          ? html`
              <cc-addon-credentials-content
                .credentials="${activeTab.content}"
                .skeleton="${skeleton}"
                slot="content"
              ></cc-addon-credentials-content>
            `
          : ''}
        ${!isStringEmpty(activeTab.docLink?.href)
          ? html` <div slot="footer-right">
              <cc-link .href="${activeTab.docLink.href}" .icon="${iconInfo}">${activeTab.docLink.text}</cc-link>
            </div>`
          : ''}
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
