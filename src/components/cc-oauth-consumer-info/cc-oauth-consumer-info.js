import { css, html, LitElement } from 'lit';
import { iconRemixCheckLine, iconRemixCloseLine, iconRemixInformationFill } from '../../assets/cc-remix.icons.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
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

/** @type {Partial<OAuthConsumerInfoStateLoaded>} */
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
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoState} OAuthConsumerInfoState
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerInfoStateLoaded} OAuthConsumerInfoStateLoaded
 * @typedef {import('./cc-oauth-consumer-info.types.js').OAuthConsumerRights} OAuthConsumerRights
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

    /** @type {OAuthConsumerInfoState} Sets the state of the component. */
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
          <div slot="content" class="main">
            <div class="oauth-logo ${classMap({ skeleton })}" title=${ifDefined(oauthConsumerInfo.name)}>
              <img class="oauth-logo_img" src=${ifDefined(oauthConsumerInfo.picture)} alt="" />
            </div>
            <div class="name"><span class="${classMap({ skeleton })}">${oauthConsumerInfo.name}</span></div>
          </div>
          <div slot="content" class="description">
            <span class="${classMap({ skeleton })}">${oauthConsumerInfo.description}</span>
          </div>
        </cc-block>

        <cc-block>
          <cc-block-section slot="content-body" class="grid-container">
            <div slot="title">${i18n('cc-oauth-consumer-info.info.title')}</div>
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
                class="input-credits"
                label="${i18n('cc-oauth-consumer-info.info.key')}"
                readonly
                clipboard
                value=${oauthConsumerInfo.key}
                ?skeleton=${skeleton}
              ></cc-input-text>
              <cc-input-text
                class="input-credits"
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
            <div slot="title">${i18n('cc-oauth-consumer-info.rights.title')}</div>
            ${oauthConsumerInfo.rights?.almighty
              ? html`
                  <cc-badge id="badge-almighty" intent="info" weight="dimmed" .icon=${iconRemixInformationFill}
                    >${i18n('cc-oauth-consumer-info.rights.almighty')}</cc-badge
                  >
                `
              : ''}

            <div class="rights-container">
              <div class="access-rights">
                <div>${i18n('cc-oauth-consumer-info.rights-title.access')}</div>
                <div class="rights-section">
                  ${this._renderRight('accessOrganisations')} ${this._renderRight('accessOrganisationsBills')}
                  ${this._renderRight('accessOrganisationsConsumptionStatistics')}
                  ${this._renderRight('accessOrganisationsCreditCount')}
                  ${this._renderRight('accessPersonalInformation')}
                </div>
              </div>
              <div class="manage-rights">
                <div>${i18n('cc-oauth-consumer-info.rights-title.manage')}</div>
                <div class="rights-section">
                  ${this._renderRight('manageOrganisations')} ${this._renderRight('manageOrganisationsApplications')}
                  ${this._renderRight('manageOrganisationsMembers')} ${this._renderRight('manageOrganisationsServices')}
                  ${this._renderRight('managePersonalInformation')} ${this._renderRight('manageSshKeys')}
                </div>
              </div>
            </div>
          </cc-block-section>
          <div slot="content-footer" class="modify-button">
            <cc-button primary type="submit" ?skeleton="${skeleton}" ?waiting=${this.state.type === 'waiting'}
              >${i18n('cc-oauth-consumer-info.rights.edit')}</cc-button
            >
          </div>
        </cc-block>
      </div>
    `;
  }

  /**
   * @param {keyof OAuthConsumerRights} rightName
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
          display: grid;
          gap: 1.5em;
        }

        /* region Header */

        .main {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .oauth-logo {
          align-self: flex-start;
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 3.25em;
          overflow: hidden;
          width: 3.25em;
        }

        .oauth-logo_img {
          display: block;
          height: 100%;
          width: 100%;
        }

        .name {
          align-content: center;
          font-size: 1.1em;
          font-weight: bold;
        }

        /* end region */

        /* region Access */

        .grid-container {
          container-type: inline-size;
        }

        .access-grid {
          display: grid;
          gap: 2em;
          grid-template-columns: repeat(2, 1fr);
        }

        .access-grid dd {
          word-break: break-word;
        }

        @container (max-width: 34.38rem) {
          .access-grid {
            gap: 1em;
            grid-template-columns: 1fr;
          }
        }

        dl,
        dt,
        dd {
          margin: 0;
        }

        dt {
          margin-bottom: 0.35em;
        }

        .input-credits {
          width: fit-content;
        }

        /* end region */

        /* region Rights */

        #badge-almighty {
          width: fit-content;
        }

        .rights-container {
          display: flex;
          flex-wrap: wrap;
          gap: 2em;
        }

        .access-rights,
        .manage-rights {
          display: grid;
          gap: 1em;
          grid-auto-rows: min-content;
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

        .modify-button {
          display: flex;
          flex-direction: row;
          gap: 0.5em;
          justify-content: end;
          margin-top: 1em;
        }

        .skeleton {
          background-color: #bbb;
        }
      `,
    ];
  }
}

window.customElements.define('cc-oauth-consumer-info', CcOauthConsumerInfo);
