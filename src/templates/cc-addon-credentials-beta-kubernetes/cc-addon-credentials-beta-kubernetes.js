import { html } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import '../../components/cc-block-details/cc-block-details.js';
import '../../components/cc-code/cc-code.js';
import '../../components/cc-icon/cc-icon.js';
import '../../components/cc-link/cc-link.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';

/* eslint-disable lit/prefer-static-styles */
export const ccAddonCredentialsBetaKubernetes = () => html`
  <style>
    ${cliCommandsStyles}
  </style>
  <cc-block-details slot="footer-credentials">
    <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
    <div slot="link">
      <cc-link href="TODO" .icon="${iconInfo}"> ${i18n('cc-domain-management.names.documentation.text')} </cc-link>
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
`;
