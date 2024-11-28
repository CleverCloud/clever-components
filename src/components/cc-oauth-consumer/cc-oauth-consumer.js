import { css, html, LitElement } from 'lit';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
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
          <div slot="header-title">oAuth Consumer</div>
          <div slot="content">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium architecto consectetur eius eum nulla
            obcaecati praesentium qui, voluptatum. Atque delectus enim illo, iusto modi pariatur qui repellendus?
            Commodi eaque, vitae?
          </div>
        </cc-block>

        <cc-block>
          <cc-block-section slot="content-body">
            <div slot="title">Access</div>
            <div class="access-url">
              <div>App base</div>
              <div>url ${oauthConsumerInfo.appBaseUrl}</div>
              <div>Home page url</div>
              <div>${oauthConsumerInfo.homePageUrl}</div>
            </div>
            <div class="oauth-credits">
              <div>Key</div>
              <div>${oauthConsumerInfo.key}</div>
              <div>Secret</div>
              <div>${oauthConsumerInfo.secret}</div>
            </div>
          </cc-block-section>
          <cc-block-section slot="content-body">
            <div slot="title">Authorizations</div>
          </cc-block-section>
        </cc-block>
      </div>
    `;
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
      `,
    ];
  }
}

// DOCS: 11. Define the custom element

window.customElements.define('cc-oauth-consumer', CcOauthConsumer);
