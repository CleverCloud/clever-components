import { css, html, LitElement } from 'lit';
import { ccLink } from '../../templates/cc-link/cc-link.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-notice/cc-notice.js';

const SKELETON_OAUTH_CONSUMER_INFO = {
  name: '??????????????????????????',
  homePageUrl: '??????????????????????????',
  appBaseUrl: '??????????????????????????',
  description: '??????????????????????????',
  image: '??????????????????????????',
  options: [],
  key: '??????????????????????????',
  secret: '??????????????????????????',
};
/**
 * @typedef {import('./cc-oauth-consumer.types.js').OauthConsumerState} OauthConsumerState
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
            ${this._renderOptions}
          </cc-block-section>
        </cc-block>
      </div>
    `;
  }

  _renderOptions() {
    const checkboxes = this.state.type === 'loaded' ? this.state.options : '';
    checkboxes.forEach((checkbox) => {
      this.state.type === 'loaded'
        ? html` <input type="checkbox" id="${this.state.options.values}" name="${this.state.options.values}" /> `
        : '';
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
