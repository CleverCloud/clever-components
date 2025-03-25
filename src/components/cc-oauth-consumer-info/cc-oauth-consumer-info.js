import { css, html, LitElement } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { iconRemixCheckLine, iconRemixCloseLine, iconRemixInformationFill } from '../../assets/cc-remix.icons.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { skeletonStyles } from '../../styles/skeleton.js';
import { ccLink, linkStyles } from '../../templates/cc-link/cc-link.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/** @type {Partial<OauthConsumerInfoStateLoaded>} */
const SKELETON_OAUTH_CONSUMER_INFO = {
  name: fakeString(15),
  url: fakeString(20),
  baseUrl: fakeString(20),
  description: fakeString(45),
  picture: null,
  rights: null,
  key: fakeString(20),
  secret: fakeString(20),
};

/**
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoState} OauthConsumerInfoState
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerInfoStateLoaded} OauthConsumerInfoStateLoaded
 * @typedef {import('./cc-oauth-consumer-info.types.js').OauthConsumerRights} OauthConsumerRights
 */

/**
 * A component displaying access details and authorizations of an OAuth Consumer.
 *
 * @cssdisplay block
 */
export class CcOauthConsumerInfo extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {OauthConsumerInfoState} Sets the state of the component. */
    this.state = { type: 'loading' };
  }

  /**
   * @param {string|null} name
   * @returns {string|Node}
   */
  _getName(name) {
    switch (name) {
      case 'accessOrganisations':
        return i18n('cc-oauth-consumer-info.rights.access-organisations');
      case 'accessOrganisationsBills':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-bills');
      case 'accessOrganisationsConsumptionStatistics':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-consumption-statistics');
      case 'accessOrganisationsCreditCount':
        return i18n('cc-oauth-consumer-info.rights.access-organisations-credit-count');
      case 'accessPersonalInformation':
        return i18n('cc-oauth-consumer-info.rights.access-personal-information');
      case 'manageOrganisations':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations');
      case 'manageOrganisationsApplications':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-applications');
      case 'manageOrganisationsMembers':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-members');
      case 'manageOrganisationsServices':
        return i18n('cc-oauth-consumer-info.rights.manage-organisations-services');
      case 'managePersonalInformation':
        return i18n('cc-oauth-consumer-info.rights.manage-personal-information');
      case 'manageSshKeys':
        return i18n('cc-oauth-consumer-info.rights.manage-ssh-keys');
      default:
        return fakeString(70);
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice
        slot="content"
        intent="warning"
        message="${i18n('cc-oauth-consumer-info.error')}"
      ></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const oauthConsumerInfo =
      this.state.type === 'loaded' || this.state.type === 'waiting' ? this.state : SKELETON_OAUTH_CONSUMER_INFO;
    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="content" class="header-wrapper">
            <cc-img
              class="header-logo"
              a11y-name=${ifDefined(oauthConsumerInfo.name)}
              ?skeleton=${skeleton}
              src=${ifDefined(oauthConsumerInfo.picture)}
            ></cc-img>
            <div class="header-name">
              <span class="${classMap({ skeleton })}">${oauthConsumerInfo.name}</span>
            </div>
            <div class="header-description">
              <span class="${classMap({ skeleton })}">${oauthConsumerInfo.description}</span>
            </div>
            <div class="modify-button">
              <cc-button primary type="submit" ?skeleton="${skeleton}" ?waiting=${this.state.type === 'waiting'}
                >${i18n('cc-oauth-consumer-info.rights.edit')}</cc-button
              >
            </div>
          </div>
        </cc-block>

        <cc-block>
          <div slot="header-title">${i18n('cc-oauth-consumer-info.info.title')}</div>
          <cc-block-section slot="content-body">
            <div slot="title">${i18n('cc-oauth-consumer-info.access.title')}</div>
            <p class="description">${i18n('cc-oauth-consumer-info.info.description')}</p>
            <dl class="access-grid">
              <div>
                <dt>${i18n('cc-oauth-consumer-info.info.homepage-url')}</dt>
                <dd>${ccLink(oauthConsumerInfo.url, oauthConsumerInfo.url, skeleton)}</dd>
              </div>
              <div>
                <dt>${i18n('cc-oauth-consumer-info.info.base-url')}</dt>
                <dd>${ccLink(oauthConsumerInfo.baseUrl, oauthConsumerInfo.baseUrl, skeleton)}</dd>
              </div>
            </dl>
            <div class="access-grid">
              <cc-input-text
                label="${i18n('cc-oauth-consumer-info.info.key')}"
                readonly
                clipboard
                value=${oauthConsumerInfo.key}
                ?skeleton=${skeleton}
              ></cc-input-text>
              <cc-input-text
                label="${i18n('cc-oauth-consumer-info.info.secret')}"
                readonly
                secret
                clipboard
                value=${oauthConsumerInfo.secret}
                ?skeleton=${skeleton}
              ></cc-input-text>
            </div>
          </cc-block-section>
          <cc-block-section slot="content-body">
            <div class="header-rights">
              <div class="auth-title">${i18n('cc-oauth-consumer-info.rights.title')}</div>
              ${oauthConsumerInfo.rights?.almighty
                ? html`
                    <cc-badge id="badge-almighty" intent="info" weight="dimmed" .icon=${iconRemixInformationFill}
                      >${i18n('cc-oauth-consumer-info.rights.almighty')}</cc-badge
                    >
                  `
                : ''}
            </div>
            <p class="description">${i18n('cc-oauth-consumer-info.rights.description')}</p>
            <div class="rights-container">
              <div class="access-rights">
                <div class="rights-title">${i18n('cc-oauth-consumer-info.rights-title.access')}</div>
                <div class="rights-section">
                  ${this._renderRight('accessOrganisations')} ${this._renderRight('accessOrganisationsBills')}
                  ${this._renderRight('accessOrganisationsConsumptionStatistics')}
                  ${this._renderRight('accessOrganisationsCreditCount')}
                  ${this._renderRight('accessPersonalInformation')}
                </div>
              </div>
              <div class="manage-rights">
                <div class="rights-title">${i18n('cc-oauth-consumer-info.rights-title.manage')}</div>
                <div class="rights-section">
                  ${this._renderRight('manageOrganisations')} ${this._renderRight('manageOrganisationsApplications')}
                  ${this._renderRight('manageOrganisationsMembers')} ${this._renderRight('manageOrganisationsServices')}
                  ${this._renderRight('managePersonalInformation')} ${this._renderRight('manageSshKeys')}
                </div>
              </div>
            </div>
          </cc-block-section>
        </cc-block>
      </div>
    `;
  }

  /**
   * @param {keyof OauthConsumerRights} rightName
   */
  _renderRight(rightName) {
    const icon =
      this.state.type === 'loaded' || this.state.type === 'waiting'
        ? this.state.rights[rightName]
          ? iconRemixCheckLine
          : iconRemixCloseLine
        : iconRemixCloseLine;
    return html`
      <div class="right">
        <cc-icon .icon="${icon}" ?skeleton="${this.state.type === 'loading'}"></cc-icon>
        <div>${this._getName(rightName)}</div>
      </div>
    `;
  }

  static get styles() {
    return [
      skeletonStyles,
      linkStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        .wrapper {
          container-type: inline-size;
          display: grid;
          gap: 1.5em;
        }

        /* region Header */

        .header-wrapper {
          display: grid;
          gap: 0.5em;
          grid-template-areas:
            'logo name button'
            'logo description button';
          grid-template-columns: auto 1fr auto;
        }

        .header-logo {
          grid-area: logo;
          height: 3.25em;
          width: 3.25em;
        }

        .header-name {
          color: var(--cc-color-text-primary-strongest);
          font-size: 1.2em;
          font-weight: bold;
          grid-area: name;
        }

        .header-description {
          grid-area: description;
        }

        .modify-button {
          align-self: center;
          grid-area: button;
        }

        /* end region */

        /* region Access */

        .description {
          margin-top: 0;
        }

        .access-grid,
        .rights-container {
          display: grid;
          gap: 3em;
          grid-template-columns: 1fr 1fr;
        }

        .access-grid:first-of-type {
          margin-bottom: 1em;
        }

        .access-grid dd {
          word-break: break-word;
        }

        dl,
        dt,
        dd {
          margin: 0;
        }

        dt {
          margin-bottom: 0.35em;
        }

        /* end region */

        /* region Rights */

        .header-rights {
          display: flex;
        }

        .auth-title {
          flex: 1 1 0;
          font-weight: bold;
        }

        .access-rights,
        .manage-rights {
          display: grid;
          gap: 1em;
          grid-auto-rows: min-content;
        }

        .rights-title {
          font-weight: bold;
        }

        .rights-section {
          display: grid;
          gap: 0.5em;
        }

        .right {
          display: flex;
          gap: 0.5em;
        }

        /* end region */

        /* region Responsive */

        @container (max-width: 34.38em) {
          .header-wrapper {
            grid-template-areas:
              'logo name'
              'logo description'
              'button button';
            grid-template-columns: auto 1fr;
          }

          .access-grid {
            gap: 1em;
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 28.75em) {
          .header-wrapper {
            grid-template-areas:
              'logo'
              'name'
              'description'
              'button';
            grid-template-columns: 1fr;
          }

          cc-button {
            width: 100%;
          }
        }

        @container (max-width: 34.38em) {
          .access-grid,
          .rights-container {
            gap: 1em;
            grid-template-columns: 1fr;
          }
        }

        @container (max-width: 28.75em) {
          .header-rights {
            flex-direction: column;
          }

          #badge-almighty {
            margin-top: 1em;
            width: fit-content;
          }
        }

        /* end region */

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-oauth-consumer-info', CcOauthConsumerInfo);
