import { LitElement, css, html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  iconRemixDeleteBinLine as iconDelete,
  iconRemixLockUnlockFill as iconHttpOnly,
  iconRemixInformationFill as iconInfo,
  iconRemixExternalLinkLine as iconLink,
  iconRemixStarLine as iconPrimary,
  iconRemixFlaskLine as iconTest,
} from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import {
  DomainParseError,
  getDomainUrl,
  getHostWithWildcard,
  isTestDomain,
  isTestDomainWithSubdomain,
  parseDomain,
  sortDomains,
} from '../../lib/domain.js';
import { focusBySelector } from '../../lib/focus-helper.js';
import { accessibilityStyles } from '../../styles/accessibility.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-badge/cc-badge.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block-section/cc-block-section.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-form/cc-dialog-confirm-form.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-icon/cc-icon.js';
import '../cc-input-text/cc-input-text.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import { CcDomainAddEvent, CcDomainDeleteEvent, CcDomainMarkAsPrimaryEvent } from './cc-domain-management.events.js';

const DOMAIN_NAMES_DOCUMENTATION = getDocUrl(
  '/administrate/domain-names/#using-a-cleverappsio-free-domain-with-built-in-ssl',
);
const TLS_CERTIFICATES_DOCUMENTATION = getDocUrl('/administrate/ssl');
const DNS_DOCUMENTATION = getDocUrl('/administrate/domain-names');

/**
 * @import { DomainManagementDnsInfoState, DomainManagementListState, DomainManagementFormState, DomainManagementFormStateIdle, FormattedDomainInfo, DomainInfo, FormError, DomainState } from './cc-domain-management.types.js'
 * @import { CcInputText } from '../cc-input-text/cc-input-text.js'
 * @import { TemplateResult, PropertyValues } from 'lit'
 * @import { Ref } from 'lit/directives/ref.js'
 */

/**
 * A component to manage domains associated to an application.
 *
 * @cssdisplay block
 */
export class CcDomainManagement extends LitElement {
  static get properties() {
    return {
      applicationId: { type: String, attribute: 'application-id' },
      dnsInfoState: { type: Object, attribute: 'dns-info-state' },
      domainFormState: { type: Object, attribute: 'domain-form-state' },
      domainListState: { type: Object, attribute: 'domain-list-state' },
      _idOfDomainToDelete: { type: String, state: true },
      _sortedDomains: { type: Array, state: true },
    };
  }

  /**
   * @returns {DomainManagementFormStateIdle}
   */
  static get INIT_DOMAIN_FORM_STATE() {
    return {
      type: 'idle',
      hostname: {
        value: '',
      },
      pathPrefix: {
        value: '',
      },
    };
  }

  constructor() {
    super();

    /** @type {string} Sets the application id for documentation */
    this.applicationId = '<APPLICATION_ID>';

    /** @type {DomainManagementDnsInfoState} Sets the state of the DNS info section */
    this.dnsInfoState = { type: 'loading' };

    /** @type {DomainManagementFormState} Sets the state of the form section */
    this.domainFormState = CcDomainManagement.INIT_DOMAIN_FORM_STATE;

    /** @type {DomainManagementListState} Sets the state of the domain list section. */
    this.domainListState = { type: 'loading' };

    /** @type {Ref<CcInputText>} */
    this._domainInputRef = createRef();

    /** @type {string|null} Used to display the deletion dialog when set with a value other than null. */
    this._idOfDomainToDelete = null;

    /** @type {Ref<HTMLParagraphElement>} */
    this._emptyMessageRef = createRef();

    /** @type {FormattedDomainInfo[]|null} */
    this._sortedDomains = null;

    new LostFocusController(this, '.delete-domain', ({ suggestedElement }) => {
      if (suggestedElement != null && suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      } else {
        this._emptyMessageRef.value?.focus();
      }
    });

    new LostFocusController(this, '.mark-primary', () => {
      focusBySelector(this.shadowRoot, '.primary');
    });
  }

  /**
   * @param {string} hostnameValue
   * @returns {FormError|null} The error code or `null` if no error
   */
  _getFormError(hostnameValue) {
    try {
      const { pathname } = parseDomain(hostnameValue?.trim());

      if (!hostnameValue.match(/.+\..+/)) {
        return { code: 'invalid-format' };
      }
      if (pathname !== '/') {
        /** We store the path so we can tell users to move this part to the "Path" input field instead. */
        return { code: 'hostname-contains-path', pathWithinHostname: pathname };
      }

      return null;
    } catch (error) {
      if (error instanceof DomainParseError) {
        return { code: error.code };
      }

      return { code: 'invalid-format' };
    }
  }

  /**
   * @param {FormError|null} error
   * @returns {string|Node}
   */
  _getErrorMessage(error) {
    switch (error?.code) {
      case 'empty':
        return i18n('cc-domain-management.form.domain.error.empty');
      case 'invalid-format':
        return i18n('cc-domain-management.form.domain.error.format');
      case 'invalid-wildcard':
        return i18n('cc-domain-management.form.domain.error.wildcard');
      case 'hostname-contains-path':
        return i18n('cc-domain-management.form.domain.error.contains-path', { path: error.pathWithinHostname });
    }
  }

  /** @param {ClipboardEvent} event */
  _onDomainPaste(event) {
    if (this.domainFormState.type !== 'idle' || this.domainFormState.hostname.value.trim() !== '') {
      return;
    }

    event.preventDefault();

    const clipboardValue = event.clipboardData.getData('text');

    try {
      const { hostname, pathname, isWildcard } = parseDomain(clipboardValue);

      this.domainFormState = {
        ...this.domainFormState,
        hostname: {
          ...this.domainFormState.hostname,
          value: getHostWithWildcard(hostname, isWildcard),
        },
        pathPrefix: {
          ...this.domainFormState.pathPrefix,
          value: pathname.replace(/\/$/, ''),
        },
      };
    } catch {
      this.domainFormState = {
        ...this.domainFormState,
        hostname: {
          ...this.domainFormState.hostname,
          value: clipboardValue,
        },
      };
    }
  }

  /** @param {SubmitEvent} e */
  _onDomainSubmit(e) {
    e.preventDefault();

    if (this.domainFormState.type !== 'idle') {
      return;
    }

    // we trim and we'll send this value to the API but we don't change what is displayed within the input
    const hostnameValue = this.domainFormState.hostname.value.trim();
    const pathPrefixValue = this.domainFormState.pathPrefix.value.trim();
    const error = this._getFormError(hostnameValue);

    if (error != null) {
      this.domainFormState = {
        ...this.domainFormState,
        hostname: {
          ...this.domainFormState.hostname,
          error,
        },
      };

      this._domainInputRef.value.focus();
      return;
    }

    this.domainFormState = {
      ...this.domainFormState,
      hostname: {
        value: this.domainFormState.hostname.value,
      },
    };

    // we do this to strip off unwanted parts like query parameters for instance
    const { hostname, pathname, isWildcard } = parseDomain(hostnameValue + pathPrefixValue);

    this.dispatchEvent(new CcDomainAddEvent({ hostname, pathPrefix: pathname, isWildcard }));
  }

  /** @param {FormattedDomainInfo} formattedDomainInfo */
  _onMarkPrimary(formattedDomainInfo) {
    /** @type {DomainInfo} */
    const domainInfo = {
      id: formattedDomainInfo.id,
      hostname: formattedDomainInfo.hostname,
      pathPrefix: formattedDomainInfo.pathPrefix,
      isWildcard: formattedDomainInfo.isWildcard,
      isPrimary: formattedDomainInfo.isPrimary,
    };
    return () => this.dispatchEvent(new CcDomainMarkAsPrimaryEvent(domainInfo));
  }

  /** @param {string} domainId */
  _onDeleteRequest(domainId) {
    return () => (this._idOfDomainToDelete = domainId);
  }

  /** @param {CcInputEvent} event */
  _onDomainInput({ detail: value }) {
    if (this.domainFormState.type !== 'idle') {
      return;
    }

    this.domainFormState = {
      ...this.domainFormState,
      hostname: {
        ...this.domainFormState.hostname,
        value,
      },
    };
  }

  /** @param {CcInputEvent} event */
  _onPathPrefixInput({ detail: value }) {
    // add "/" at the beginning in case the user forgot to type it
    if (value.length > 0 && !value.startsWith('/')) {
      value = '/' + value;
    }
    this.domainFormState = {
      ...this.domainFormState,
      pathPrefix: {
        ...this.domainFormState.pathPrefix,
        value,
      },
    };
  }

  /** @param {PropertyValues<CcDomainManagement>} changedProperties */
  willUpdate(changedProperties) {
    if (
      changedProperties.has('domainFormState') &&
      changedProperties.get('domainFormState')?.hostname.error == null &&
      this.domainFormState.hostname.error != null
    ) {
      this.updateComplete.then(() => this._domainInputRef.value?.focus());
    }

    if (changedProperties.has('domainListState') && this.domainListState.type === 'loaded') {
      // Make sure we use a copy before using .sort() which modifies the array in place
      this._sortedDomains = [...this.domainListState.domains].sort(sortDomains).map((domainState) => {
        const { hostname } = domainState;

        /** @type {FormattedDomainInfo} */
        const formattedDomain = {
          ...domainState,
          isHttpOnly: isTestDomainWithSubdomain(hostname),
          isTestingOnly: isTestDomain(hostname),
        };

        return formattedDomain;
      });
    }
  }

  render() {
    const domainToDelete =
      this.domainListState.type === 'loaded' && this._idOfDomainToDelete != null
        ? this.domainListState.domains.find((domain) => domain.id === this._idOfDomainToDelete)
        : null;

    return html`
      <div class="wrapper">
        <cc-block>
          <div slot="header-title">${i18n('cc-domain-management.main-heading')}</div>

          <cc-block-section slot="content-body">
            <div class="form-info">
              <p>${i18n('cc-domain-management.form.info.docs')}</p>
              <p>${i18n('cc-domain-management.form.info.cleverapps')}</p>
            </div>
            <div>${this._renderForm(this.domainFormState)}</div>
          </cc-block-section>

          <cc-block-section slot="content-body">
            <div slot="title">
              ${i18n('cc-domain-management.list.heading')}
              ${this.domainListState.type === 'loaded'
                ? html` <cc-badge class="domain-count" circle>${this._sortedDomains.length}</cc-badge> `
                : ''}
            </div>

            ${this.domainListState.type === 'error'
              ? html`
                  <cc-notice intent="warning" message="${i18n('cc-domain-management.list.loading-error')}"></cc-notice>
                `
              : ''}
            ${this.domainListState.type === 'loading' ? html` <cc-loader></cc-loader> ` : ''}
            ${this.domainListState.type === 'loaded' ? this._renderDomains(this._sortedDomains) : ''}
          </cc-block-section>

          <cc-block-details slot="footer-left">
            <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
            <div slot="link">
              <cc-link href="${DOMAIN_NAMES_DOCUMENTATION}" .icon="${iconInfo}">
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
                  <cc-code>clever domain --app ${this.applicationId}</cc-code>
                </dd>
                <dt>${i18n('cc-domain-management.names.cli.content.diag-dns-records-command')}</dt>
                <dd>
                  <cc-code>clever domain diag --app ${this.applicationId}</cc-code>
                </dd>
                <dt>${i18n('cc-domain-management.names.cli.content.add-domain-command')}</dt>
                <dd>
                  <cc-code>clever domain add &lt;DOMAIN&gt; --app ${this.applicationId} </cc-code>
                </dd>
              </dl>
            </div>
          </cc-block-details>
        </cc-block>

        ${this._renderDeleteDomainDialog(domainToDelete)}

        <cc-block>
          <div slot="header-title">${i18n('cc-domain-management.certif.heading')}</div>
          <div slot="content" class="certif-info">
            <p>${i18n('cc-domain-management.certif.automated')}</p>
            <p>${i18n('cc-domain-management.certif.custom')}</p>
          </div>
          <div slot="footer-right">
            <cc-link href="${TLS_CERTIFICATES_DOCUMENTATION}" .icon="${iconInfo}">
              ${i18n('cc-domain-management.tls.certificates.documentation.text')}
            </cc-link>
          </div>
        </cc-block>

        <cc-block class="dns-info">
          <div slot="header-title">${i18n('cc-domain-management.dns.heading')}</div>
          <div slot="content-body">
            <div class="dns-info__desc">${i18n('cc-domain-management.dns.desc')}</div>
            <cc-notice intent="info" heading="${i18n('cc-domain-management.dns.info.heading')}">
              <div slot="message">
                <p>${i18n('cc-domain-management.dns.info.desc')}</p>
              </div>
            </cc-notice>
          </div>

          ${this.dnsInfoState.type === 'loading' ? html` <cc-loader slot="content-body"></cc-loader> ` : ''}
          ${this.dnsInfoState.type === 'error'
            ? html`
                <cc-notice
                  intent="warning"
                  message="${i18n('cc-domain-management.dns.loading-error')}"
                  slot="content-body"
                ></cc-notice>
              `
            : ''}
          ${this.dnsInfoState.type === 'loaded'
            ? this._renderDnsInfo(this.dnsInfoState.cnameRecord, this.dnsInfoState.aRecords)
            : ''}
          <cc-block-details slot="footer-left">
            <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
            <div slot="link">
              <cc-link href="${DNS_DOCUMENTATION}" .icon="${iconInfo}">
                ${i18n('cc-domain-management.dns.documentation.text')}
              </cc-link>
            </div>
            <div slot="content">
              <p>${i18n('cc-domain-management.dns.cli.content.instruction')}</p>
              <dl>
                <dt>${i18n('cc-domain-management.dns.cli.content.diag-conf-command')}</dt>
                <dd>
                  <cc-code>clever diag --app ${this.applicationId}</cc-code>
                </dd>
              </dl>
            </div>
          </cc-block-details>
        </cc-block>
      </div>
    `;
  }

  /**
   * @param {DomainManagementFormState} formState
   * @returns {TemplateResult}
   */
  _renderForm({ type, hostname: domain, pathPrefix }) {
    const isAdding = type === 'adding';

    return html`
      <form novalidate @submit=${this._onDomainSubmit}>
        <div class="fieldgroup">
          <cc-input-text
            class="fieldgroup__domain"
            label="${i18n('cc-domain-management.form.domain.label')}"
            required
            .value="${domain.value}"
            ?readonly="${isAdding}"
            .errorMessage=${this._getErrorMessage(domain.error)}
            ${ref(this._domainInputRef)}
            @cc-input=${this._onDomainInput}
            @paste=${this._onDomainPaste}
          >
            <p slot="help">${i18n('cc-domain-management.form.domain.help')}</p>
          </cc-input-text>
          <cc-input-text
            class="fieldgroup__path"
            label="${i18n('cc-domain-management.form.path.label')}"
            .value="${pathPrefix.value}"
            ?readonly="${isAdding}"
            @cc-input=${this._onPathPrefixInput}
          >
            <p slot="help">${i18n('cc-domain-management.form.path.help')}</p>
          </cc-input-text>
        </div>
        <cc-button primary ?waiting="${isAdding}" type="submit">${i18n('cc-domain-management.form.submit')}</cc-button>
      </form>
    `;
  }

  /**
   * @param {FormattedDomainInfo[]} domains
   * @returns {TemplateResult}
   */
  _renderDomains(domains) {
    const hasDomains = domains.length > 0;
    const isOneRowMarkingPrimary = domains.filter((domain) => domain.type === 'marking-primary').length > 0;
    const hasHttpOnlyDomains = domains.filter((domain) => domain.isHttpOnly).length > 0;

    if (!hasDomains) {
      return html`
        <p class="empty" tabindex="-1" ${ref(this._emptyMessageRef)}>${i18n('cc-domain-management.list.empty')}</p>
      `;
    }

    return html`
      ${hasHttpOnlyDomains
        ? html`
            <cc-notice no-icon intent="warning">
              <div slot="message" class="http-only-info">
                <cc-badge intent="warning" weight="outlined">
                  <div class="badge-content">
                    <cc-icon
                      .icon=${iconHttpOnly}
                      a11y-name=${i18n('cc-domain-management.list.badge.http-only.alt')}
                    ></cc-icon>
                    ${i18n('cc-domain-management.list.badge.http-only.text')}
                  </div>
                </cc-badge>
                ${i18n('cc-domain-management.list.http-only.notice')}
              </div>
            </cc-notice>
          `
        : ''}

      <div class="domains">
        ${repeat(
          domains,
          ({ id }) => id,
          (domain) => this._renderDomain(domain, isOneRowMarkingPrimary),
        )}
      </div>
    `;
  }

  /**
   * @param {FormattedDomainInfo} domainInfo
   * @param {boolean} isOneRowMarkingPrimary
   * @returns {TemplateResult}
   **/
  _renderDomain(domainInfo, isOneRowMarkingPrimary) {
    const {
      type: domainItemStateType,
      id,
      hostname,
      pathPrefix,
      isWildcard,
      isPrimary,
      isHttpOnly,
      isTestingOnly,
    } = domainInfo;
    const waiting = domainItemStateType === 'deleting' || domainItemStateType === 'marking-primary';
    const isMarkingPrimaryDisabled = isOneRowMarkingPrimary || domainItemStateType === 'deleting';
    const hostWithWildcard = getHostWithWildcard(hostname, isWildcard);
    const domainUrl = getDomainUrl(hostname, pathPrefix, isWildcard, isHttpOnly);

    return html`
      <!--
        Caution: the primary class is used to focus the primary domain when it changes, do not remove or change this class
        (see LostFocusController within the constructor for more info)
      -->
      <div class="domain ${classMap({ primary: isPrimary, waiting })}" tabindex="-1">
        <span class="domain-name-with-path">
          <!-- These tags need to remain on the same line so there is no white-space when pasting domain+path -->
          <span>${hostWithWildcard}</span><span class="path-prefix">${pathPrefix}</span>
          <a
            class="domain-link"
            href="${domainUrl}"
            target="_blank"
            title="${i18n('cc-domain-management.list.link.title', { domainUrl })}"
          >
            <span class="visually-hidden">${domainUrl}</span>
            <cc-icon .icon=${iconLink} a11y-name="${i18n('cc-domain-management.new-window')}"></cc-icon>
          </a>
        </span>

        <div class="badges">
          ${isPrimary
            ? html`
                <cc-badge>
                  <div class="badge-content">
                    <cc-icon .icon=${iconPrimary}></cc-icon>
                    ${i18n('cc-domain-management.list.badge.primary')}
                  </div>
                </cc-badge>
              `
            : ''}
          ${isTestingOnly
            ? html`
                <cc-badge intent="info" weight="outlined">
                  <div class="badge-content">
                    <cc-icon .icon=${iconTest}></cc-icon>
                    ${i18n('cc-domain-management.list.badge.testing-only')}
                  </div>
                </cc-badge>
              `
            : ''}
          ${isHttpOnly
            ? html`
                <cc-badge intent="warning" weight="outlined">
                  <div class="badge-content">
                    <cc-icon
                      .icon=${iconHttpOnly}
                      a11y-name=${i18n('cc-domain-management.list.badge.http-only.alt')}
                    ></cc-icon>
                    ${i18n('cc-domain-management.list.badge.http-only.text')}
                  </div>
                </cc-badge>
              `
            : ''}
        </div>

        <div class="actions">
          ${!isPrimary
            ? html`
                <cc-button
                  class="mark-primary"
                  primary
                  outlined
                  ?disabled=${isMarkingPrimaryDisabled && domainItemStateType !== 'marking-primary'}
                  ?waiting="${domainItemStateType === 'marking-primary'}"
                  a11y-name="${i18n('cc-domain-management.list.btn.primary.a11y-name', { domain: hostWithWildcard })}"
                  .icon=${iconPrimary}
                  hide-text
                  circle
                  @cc-click=${this._onMarkPrimary(domainInfo)}
                >
                  ${i18n('cc-domain-management.list.btn.primary.text')}
                </cc-button>
              `
            : ''}
          <cc-button
            class="delete-domain"
            danger
            outlined
            ?disabled="${domainItemStateType === 'marking-primary'}"
            ?waiting="${domainItemStateType === 'deleting'}"
            a11y-name="${i18n('cc-domain-management.list.btn.delete.a11y-name', { domain: hostWithWildcard })}"
            .icon=${iconDelete}
            hide-text
            circle
            @cc-click=${this._onDeleteRequest(id)}
          >
            ${i18n('cc-domain-management.list.btn.delete.text')}
          </cc-button>
        </div>
      </div>
    `;
  }

  /**
   * @param {string} cnameRecord
   * @param {string[]} aRecords
   * @returns {TemplateResult}
   */
  _renderDnsInfo(cnameRecord, aRecords) {
    return html`
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-domain-management.dns.cname.heading')}</div>
        <div slot="info">${i18n('cc-domain-management.dns.cname.desc')}</div>
        <cc-input-text
          hidden-label
          label="${i18n('cc-domain-management.dns.cname.label')}"
          readonly
          clipboard
          value=${cnameRecord}
        ></cc-input-text>
      </cc-block-section>
      <cc-block-section slot="content-body">
        <div slot="title">${i18n('cc-domain-management.dns.a.heading')}</div>
        <div slot="info">${i18n('cc-domain-management.dns.a.desc')}</div>
        <div class="a-records">
          <cc-input-text
            hidden-label
            label="${i18n('cc-domain-management.dns.a.label')}"
            clipboard
            readonly
            multi
            .value=${aRecords.join('\n')}
          ></cc-input-text>
        </div>
      </cc-block-section>
    `;
  }

  _onDeleteDialogClose() {
    this._idOfDomainToDelete = null;
  }

  /** @param {DomainState} domainToDelete */
  _onDeleteConfirm(domainToDelete) {
    if (this.domainListState.type !== 'loaded' || domainToDelete == null) {
      return;
    }

    const domainInfo = {
      id: domainToDelete.id,
      hostname: domainToDelete.hostname,
      pathPrefix: domainToDelete.pathPrefix,
      isWildcard: domainToDelete.isWildcard,
      isPrimary: domainToDelete.isPrimary,
    };

    this.dispatchEvent(new CcDomainDeleteEvent(domainInfo));
  }

  /** @param {DomainState|null} domainToDelete */
  _renderDeleteDomainDialog(domainToDelete) {
    return html`
      <cc-dialog
        ?open="${domainToDelete != null}"
        heading="${i18n('cc-domain-management.delete-dialog.heading')}"
        @cc-dialog-close="${this._onDeleteDialogClose}"
      >
        ${domainToDelete != null
          ? html`
              <p>${i18n('cc-domain-management.delete-dialog.desc')}</p>
              <cc-dialog-confirm-form
                submit-label="${i18n('cc-domain-management.delete-dialog.confirm-button')}"
                submit-intent="danger"
                confirm-text-to-input="${getHostWithWildcard(
                  domainToDelete.hostname + domainToDelete.pathPrefix,
                  domainToDelete.isWildcard,
                )}"
                confirm-input-label="${i18n('cc-domain-management.delete-dialog.input-label')}"
                ?waiting="${domainToDelete.type === 'deleting'}"
                @cc-dialog-confirm="${() => this._onDeleteConfirm(domainToDelete)}"
              >
              </cc-dialog-confirm-form>
            `
          : ''}
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      accessibilityStyles,
      cliCommandsStyles,
      css`
        :host {
          display: block;
        }

        .wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
        }

        code {
          background-color: var(--cc-color-bg-neutral);
          border-radius: var(--cc-border-radius-default, 0.25em);
          font-family: var(--cc-ff-monospace);
          padding: 0.15em 0.3em;
          word-break: break-all;
        }

        /** #region form */

        .fieldgroup {
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .fieldgroup__domain {
          flex-grow: 5;
        }

        .fieldgroup__path {
          flex-basis: 16em;
          flex-grow: 2;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 1.5em;
          justify-content: flex-end;
        }

        form cc-button {
          margin-left: auto;
        }

        .form-info {
          color: var(--cc-color-text-weak);
          line-height: 1.5;
          margin-bottom: 1em;
        }

        .form-info p {
          margin: 0;
        }

        .form-info__cleverapps {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .form-info cc-icon {
          color: var(--cc-color-text-primary);
        }

        /** we need this because the help message contains a <code> tag that has some extra padding */

        [slot='help'] {
          padding-top: 0.3em;
        }

        /** #endregion */

        /** #region domain-list */

        .domain-count {
          font-size: 0.9em;
          margin-left: 0.2em;
        }

        .domains {
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fit, minmax(min(25em, 100%), 1fr));
        }

        .domain {
          align-items: center;
          border: solid 1px var(--cc-color-border-neutral-weak);
          border-radius: var(--cc-border-radius-default);
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em 1em;
          padding: 1em;
        }

        .domain:hover {
          background-color: var(--cc-color-bg-neutral);
        }

        .domain:focus-visible {
          outline: var(--cc-focus-outline, #000 solid 2px);
          outline-offset: var(--cc-focus-outline-offset, 2px);
        }

        .domain-name-with-path {
          flex: 1 0 100%;
          word-break: break-all;
        }

        .path-prefix {
          color: var(--cc-color-text-primary-strongest);
          font-family: var(--cc-ff-monospace);
          font-weight: bold;
        }

        .domain-link {
          color: var(--cc-color-text-primary-highlight, blue);
          /** fixes icon alignment that differs depending on the font-family */

          font-family: var(--cc-ff-monospace, monospace);
          padding: 0.3em;
          vertical-align: middle;
        }

        .domain-link cc-icon {
          vertical-align: baseline;
        }

        .waiting .domain-name-with-path {
          opacity: var(--cc-opacity-when-disabled, 0.5);
        }

        .badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
        }

        .badge-content {
          align-items: center;
          display: flex;
          gap: 0.5em;
        }

        .badge-content cc-icon {
          flex: 0 0 auto;
        }

        .actions {
          align-items: center;
          display: flex;
          gap: 0.5em;
          margin-inline-start: auto;
        }

        .empty {
          font-style: italic;
        }

        .empty:focus {
          outline: none;
        }

        .http-only-info cc-badge {
          line-height: normal;
          margin-right: 0.5em;
        }

        .http-only-info {
          line-height: 1.5;
        }

        /** #endregion */

        /** #region certifAndDNS */

        .certif-info {
          display: grid;
          gap: 0.5em;
          line-height: 1.5;
        }

        .certif-info p,
        .dns-info p {
          margin: 0;
        }

        .dns-info__desc {
          display: grid;
          gap: 0.5em;
          margin-bottom: 1em;
        }

        .dns-info div[slot='info'] {
          align-content: flex-start;
          display: grid;
          gap: 0;
        }

        .a-records {
          align-content: baseline;
          display: grid;
          gap: 1em;
          grid-template-columns: repeat(auto-fit, minmax(8em, 1fr));
        }

        .dns-info cc-notice[intent='info'] {
          margin-bottom: 1em;
          margin-top: 1.5em;
        }

        /** #endregion */
      `,
    ];
  }
}

window.customElements.define('cc-domain-management', CcDomainManagement);
