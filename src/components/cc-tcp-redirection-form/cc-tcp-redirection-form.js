import { css, html, LitElement } from 'lit';
import { iconRemixInformationFill as iconInfo } from '../../assets/cc-remix.icons.js';
import { generateDocsHref } from '../../lib/utils.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-link/cc-link.js';
import '../cc-notice/cc-notice.js';
import '../cc-tcp-redirection/cc-tcp-redirection.js';

const TCP_REDIRECTION_DOCUMENTATION = generateDocsHref('/administrate/tcp-redirections/');

/** @type {TcpRedirectionStateLoading[]} */
const SKELETON_REDIRECTIONS = [{ type: 'loading' }, { type: 'loading' }];

/**
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormContextType} TcpRedirectionFormContextType
 * @typedef {import('./cc-tcp-redirection-form.types.js').TcpRedirectionFormState} TcpRedirectionFormState
 * @typedef {import('../cc-tcp-redirection/cc-tcp-redirection.types.js').TcpRedirectionStateLoading} TcpRedirectionStateLoading
 * @typedef {import('../cc-tcp-redirection/cc-tcp-redirection.types.js').CreateTcpRedirection} CreateTcpRedirection
 * @typedef {import('../cc-tcp-redirection/cc-tcp-redirection.types.js').DeleteTcpRedirection} DeleteTcpRedirection
 * @typedef {import('../cc-block/cc-block.types.js').BlockToggleState} BlockToggleState
 */

/**
 * An interface to create / delete TCP redirections in the context of an application.
 *
 * @cssdisplay block
 */
export class CcTcpRedirectionForm extends LitElement {
  static get properties() {
    return {
      context: { type: String },
      resourceId: { type: String, attribute: 'resource-id' },
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {string} Sets the resource id for documentation */
    this.resourceId = 'xxx_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

    /** @type {TcpRedirectionFormContextType} Defines in which context the form is used so it can show the appropriate description or lack thereof (defaults to user). */
    this.context = 'user';

    /** @type {TcpRedirectionFormState} Sets the state of the component. */
    this.state = { type: 'loading' };
  }

  render() {
    /** @type {BlockToggleState} blockState */
    const blockState = this.context === 'admin' ? 'close' : 'off';

    return html`
      <cc-block toggle="${blockState}">
        <div slot="header-title">${i18n('cc-tcp-redirection-form.title')} ${this._renderRedirectionCountBadge()}</div>
        <div slot="content" class="content">
          ${this.context === 'user'
            ? html` <div class="description">${i18n('cc-tcp-redirection-form.description')}</div> `
            : ''}
          ${this.state.type === 'error'
            ? html` <cc-notice intent="warning" message="${i18n('cc-tcp-redirection-form.error')}"></cc-notice> `
            : ''}
          ${this.state.type === 'loading'
            ? html`
                ${SKELETON_REDIRECTIONS.map(
                  (skeletonRedirectionState) => html`
                    <cc-tcp-redirection .state=${skeletonRedirectionState}></cc-tcp-redirection>
                  `,
                )}
              `
            : ''}
          ${this.state.type === 'loaded'
            ? html`
                ${this.state.redirections.map(
                  (redirectionState) => html` <cc-tcp-redirection .state=${redirectionState}></cc-tcp-redirection> `,
                )}
                ${this.state.redirections.length === 0
                  ? html` <div class="empty-msg">${i18n('cc-tcp-redirection-form.empty')}</div> `
                  : ''}
              `
            : ''}
        </div>

        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <div slot="link">
            <cc-link href="${TCP_REDIRECTION_DOCUMENTATION}" .icon="${iconInfo}">
              ${i18n('cc-tcp-redirection-form.documentation.text')}
            </cc-link>
          </div>
          <div slot="content">${i18n('cc-tcp-redirection-form.cli.content', { resourceId: this.resourceId })}</div>
        </cc-block-details>
      </cc-block>
    `;
  }

  /** @private */
  _renderRedirectionCountBadge() {
    if (this.context === 'admin' && this.state.type === 'loaded') {
      const redirectionCount = this.state.redirections.filter(({ sourcePort }) => sourcePort != null).length;
      if (redirectionCount >= 1) {
        return html` <cc-badge circle weight="strong">${redirectionCount}</cc-badge> `;
      }
    }
    return '';
  }

  static get styles() {
    return [
      cliCommandsStyles,
      // language=CSS
      css`
        :host {
          display: block;
        }

        cc-badge {
          /* cc-block title changes the font-size to 1.2em, which makes our badge way too big */
          font-size: 0.8em;
          margin-left: 0.5em;
          vertical-align: middle;
        }

        .content {
          display: grid;
          gap: 1em;
        }

        .description {
          line-height: 1.6;
        }

        .description p {
          margin: 0;
          margin-bottom: 1em;
        }

        .description code {
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          padding: 0.15em 0.3em;
        }

        .empty-msg {
          color: var(--cc-color-text-weak);
          font-style: italic;
        }
      `,
    ];
  }
}

window.customElements.define('cc-tcp-redirection-form', CcTcpRedirectionForm);
