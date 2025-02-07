import { css, html, LitElement } from 'lit';
import { iconRemixCheckLine } from '../../assets/cc-remix.icons.js';
import { i18n } from '../../lib/i18n/i18n.js';
import { ccLink } from '../../templates/cc-link/cc-link.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

/**
 * @type {OauthConsumerRight}
 */
const SKELETON_RIGHT = {
  name: '??????',
  isEnabled: false,
};

const SKELETON_OAUTH_CONSUMER_INFO = {
  name: '??????????????????????????',
  homePageUrl: '??????????????????????????',
  appBaseUrl: '??????????????????????????',
  description: '??????????????????????????',
  image: '??????????????????????????',
  rights: [
    SKELETON_RIGHT,
    SKELETON_RIGHT,
    SKELETON_RIGHT,
    SKELETON_RIGHT,
    SKELETON_RIGHT,
    SKELETON_RIGHT,
    SKELETON_RIGHT,
  ],
  key: '??????????????????????????',
  secret: '??????????????????????????',
};

const OAUTH_CONSUMER_RIGHTS = [
  { name: 'access_organisations', label: 'access_organisations', section: 'access' },
  { name: 'access_organisations_bills', label: 'access_organisations_bills', section: 'access' },
  {
    name: 'access_organisations_consumption_statistics',
    label: 'access_organisations_consumption_statistics',
    section: 'access',
  },
  {
    name: 'access_organisations_credit_count',
    label: 'access_organisations_credit_count',
    section: 'access',
  },
  { name: 'access_personal_information', label: 'access_personal_information', section: 'access' },
  { name: 'manage_organisations', label: 'manage_organisations', section: 'manage' },
  {
    name: 'manage_organisations_applications',
    label: 'manage_organisations_applications',
    section: 'manage',
  },
  { name: 'manage_organisations_members', label: 'manage_organisations_members', section: 'manage' },
  { name: 'manage_organisations_services', label: 'manage_organisations_services', section: 'manage' },
  { name: 'manage_personal_information', label: 'manage_personal_information', section: 'manage' },
  { name: 'manage_ssh_keys', label: 'manage_ssh_keys', section: 'manage' },
];

/**
 * @typedef {import('./cc-oauth-consumer.types.js').OauthConsumerState} OauthConsumerState
 * @typedef {import('./cc-oauth-consumer.types.js').OauthConsumerRight} OauthConsumerRight
 *
 */

/**
 * A component doing X and Y (one liner description of your component).
 */
export class CcOauthConsumer extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {OauthConsumerState} Sets the state of the component. */
    this.state = { type: 'loading' };
  }

  /**
   * @param {string|null} label
   * @returns {string|Node}
   */
  _getLabel(label) {
    switch (label) {
      case 'access_organisations':
        return i18n('cc-oauth-consumer-form.auth.access.option.access-organisations');
      case 'access_organisations_bills':
        return i18n('cc-oauth-consumer-form.auth.access.option.access-organisations-bills');
      case 'access_organisations_consumption_statistics':
        return i18n('cc-oauth-consumer-form.auth.access.option.access-organisations-consumption-statistics');
      case 'access_organisations_credit_count':
        return i18n('cc-oauth-consumer-form.auth.access.option.access-organisations-credit-count');
      case 'access_personal_information':
        return i18n('cc-oauth-consumer-form.auth.access.option.access-personal-information');
      case 'manage_organisations':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-organisations');
      case 'manage_organisations_applications':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-organisations-applications');
      case 'manage_organisations_members':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-organisations-members');
      case 'manage_organisations_services':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-organisations-services');
      case 'manage_personal_information':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-personal-information');
      case 'manage_ssh_keys':
        return i18n('cc-oauth-consumer-form.auth.manage.option.manage-ssh-keys');
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice slot="content" intent="warning" message="error"></cc-notice>`;
    }

    const skeleton = this.state.type === 'loading';
    const oauthConsumerInfo = this.state.type === 'loaded' ? this.state : SKELETON_OAUTH_CONSUMER_INFO;
    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="header-icon"></div>
          <div slot="header-title">oAuth Consumer</div>
          <div slot="content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla
            obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus?
            Commodi eaque, vitae?
          </div>
        </cc-block>

        <cc-block>
          <cc-block-section slot="content-body" class="access-block">
            <div slot="title">Access</div>
            <div class="access-url">
              <div class="base-url">
                <p>App base</p>
                <div>${ccLink(oauthConsumerInfo.appBaseUrl, oauthConsumerInfo.appBaseUrl)}</div>
              </div>
              <div class="home-url">
                <p>Home page url</p>
                <div>${ccLink(oauthConsumerInfo.homePageUrl, oauthConsumerInfo.homePageUrl)}</div>
              </div>
            </div>
            <div class="oauth-credits">
              <div class="key">
                <cc-input-text label="Key" readonly clipboard value=${oauthConsumerInfo.key}></cc-input-text>
              </div>
              <div class="secret">
                <cc-input-text
                  label="Secret"
                  readonly
                  secret
                  clipboard
                  value=${oauthConsumerInfo.secret}
                ></cc-input-text>
              </div>
            </div>
          </cc-block-section>
          <cc-block-section slot="content-body" class="auth-block">
            <div slot="title">Authorizations</div>
            <!--<cc-badge intent="info" weight="dimmed">Almighty</cc-badge>-->
            <div class="rights-container">
              <div class="access-rights">
                <div>Access</div>
                <div class="rights-section">${this._renderRightsSection('access')}</div>
              </div>
              <div class="manage-rights">
                <div>Manage</div>
                <div class="rights-section">${this._renderRightsSection('manage')}</div>
              </div>
            </div>
          </cc-block-section>
        </cc-block>
      </div>
    `;
  }

  /**
   * @param {'access' | 'manage'} section
   */
  _renderRightsSection(section) {
    return OAUTH_CONSUMER_RIGHTS.filter((right) => {
      return right.section === section;
    }).map((right) => {
      return html`
        <div class="right">
          <cc-icon .icon="${iconRemixCheckLine}"></cc-icon>
          <div>${this._getLabel(right.label)}</div>
        </div>
      `;
    });
  }

  static get styles() {
    return [
      // language=CSS
      css`
        :host {
          /* You may use another display type but you need to define one. */
          display: block;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        .rights-container {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          /* justify-content: space-between; */
          gap: 2em;
        }

        .access-rights,
        .manage-rights {
          display: flex;
          flex-direction: column;
          gap: 1em;
        }

        .rights-section {
          display: flex;
          flex-direction: column;
          gap: 0.2em;
        }

        .right {
          display: flex;
          flex-direction: row;
        }

        /* region Access */
        .access-block {
          margin-inline: 2em;
        }

        .access-url {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1em;
          justify-content: start;
        }

        .access-url > div {
          display: grid;
        }

        /* .base-url {
          display: grid;
          gap: 0.5em;
        }

        .home-url {
          display: grid;
          gap: 0.5em;
        } */

        .oauth-credits {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 2em;
          justify-content: start;
        }

        .oauth-credits > div {
          display: grid;
          gap: 0.5em;
        }

        /* region Authorizations */
        .auth-block {
          margin-inline: 2em;
        }
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-oauth-consumer', CcOauthConsumer);
