import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-credentials-beta/cc-addon-credentials-beta.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-code/cc-code.js';

/**
 * @typedef {import('../cc-addon-credentials-beta/cc-addon-credentials-beta.types.js').CcAddonCredentialsBetaState} CcAddonCredentialsBetaState
 */

export class CcAddonCredentialsKubernetes extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {CcAddonCredentialsBetaState} Sets the state of the component */
    this.state = { type: 'loading', tabs: { default: [] } };
  }

  render() {
    return html`
      <cc-addon-credentials-beta .state="${this.state}">
        <cc-block-details slot="footer-credentials">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <div slot="link">
            <cc-link href="TODO" .icon="${iconInfo}">
              ${i18n('cc-domain-management.names.documentation.text')}
            </cc-link>
          </div>
          <div slot="content">
            <p>
              ${i18n('cc-domain-management.names.cli.content.intro')}
              ${i18n('cc-domain-management.names.cli.content.instruction')}
            </p>
            <dl>
              <dt>${i18n('cc-domain-management.names.cli.content.list-command')}</dt>
              <dd>
                <cc-code>clever domain --app toto</cc-code>
              </dd>
              <dt>${i18n('cc-domain-management.names.cli.content.diag-dns-records-command')}</dt>
              <dd>
                <cc-code>clever domain diag --app toto</cc-code>
              </dd>
              <dt>${i18n('cc-domain-management.names.cli.content.add-domain-command')}</dt>
              <dd>
                <cc-code>clever domain add &lt;DOMAIN&gt; --app toto </cc-code>
              </dd>
            </dl>
          </div>
        </cc-block-details>
      </cc-addon-credentials-beta>
    `;
  }

  static get styles() {
    return [
      cliCommandsStyles,
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

customElements.define('cc-addon-credentials-kubernetes', CcAddonCredentialsKubernetes);
