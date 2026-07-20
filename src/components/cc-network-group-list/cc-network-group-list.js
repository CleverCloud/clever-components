import { css, html, LitElement, nothing } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import { repeat } from 'lit/directives/repeat.js';
import { iconRemixArrowRightLine as iconLink } from '../../assets/cc-remix.icons.js';
import { LostFocusController } from '../../controllers/lost-focus-controller.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { cliCommandsStyles } from '../../styles/cli-commands.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-actions/cc-dialog-confirm-actions.js';
import '../cc-dialog/cc-dialog.js';
import '../cc-icon/cc-icon.js';
import '../cc-img/cc-img.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-network-group-peer-card/cc-network-group-peer-card.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcNetworkGroupLinkEvent, CcNetworkGroupUnlinkEvent } from './cc-network-group-list.events.js';

/**
 * @import { NetworkGroupListState, NetworkGroup } from './cc-network-group-list.types.js'
 * @import { Ref } from 'lit/directives/ref.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 * @import { CcLink } from '../cc-link/cc-link.js'
 * @import { PropertyValues } from 'lit'
 */

/**
 * A component to display and manage network groups linked to a resource.
 *
 * ## Details
 *
 * * This component displays two blocks:
 *   * A form to link a new network group to the current resource.
 *   * A list of already linked network groups with their peers.
 * * Each network group card shows the group name, ID, a link to the dashboard, and a list of peers.
 *
 * @cssdisplay grid
 */
export class CcNetworkGroupList extends LitElement {
  static get properties() {
    return {
      ownerId: { type: String, attribute: 'owner-id' },
      resourceId: { type: String, attribute: 'resource-id' },
      state: { type: Object },
      _isUnlinkDialogOpen: { type: Boolean, state: true },
      _networkGroupIdToUnlink: { type: String, state: true },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupListState} Sets the state of the component */
    this.state = { type: 'loading' };

    /** @type {string} Sets the owner ID for CLI command documentation */
    this.ownerId = '<OWNER_ID>';

    /** @type {string} Sets the resource ID for CLI command documentation */
    this.resourceId = '<RESOURCE_ID>';

    /** @type {string|null} */
    this._networkGroupIdToUnlink = null;

    /** @type {Ref<CcLink>} */
    this._createNetworkGroupLinkRef = createRef();

    /** @type {Ref<HTMLElement>} */
    this._emptyListRef = createRef();

    /** @type {boolean} */
    this._isUnlinkDialogOpen = false;

    new LostFocusController(this, '.unlink-btn', ({ suggestedElement }) => {
      if (suggestedElement == null) {
        this._emptyListRef.value?.focus();
        return;
      }

      if (suggestedElement instanceof HTMLElement) {
        suggestedElement.focus();
      }
    });

    // When last Network Group available to link is linked, the form is replaced by a link to create a new Network Group. This controller allows to focus this link when it appears
    new LostFocusController(this, '.link-form__submit', () => {
      this._createNetworkGroupLinkRef.value?.focus();
    });
  }

  /**
   * @param {NetworkGroupListState} state
   * @returns {Option[]}
   **/
  _getSelectOptions(state) {
    if (state.type !== 'loaded' || state.linkFormState.type === 'empty') {
      return [];
    }

    return state.linkFormState.selectOptions;
  }

  /** @param {{ 'network-group': string }} formData */
  _onLink(formData) {
    this.dispatchEvent(new CcNetworkGroupLinkEvent(formData['network-group']));
  }

  /** @param {string} networkGroupId */
  _onUnlinkRequest(networkGroupId) {
    this._isUnlinkDialogOpen = true;
    this._networkGroupIdToUnlink = networkGroupId;
  }

  _onDialogClose() {
    this._isUnlinkDialogOpen = false;
  }

  _onDialogConfirm() {
    if (this._networkGroupIdToUnlink != null) {
      this.dispatchEvent(new CcNetworkGroupUnlinkEvent(this._networkGroupIdToUnlink));
    }
  }

  /** @param {PropertyValues<CcNetworkGroupList>} changedProperties */
  willUpdate(changedProperties) {
    if (changedProperties.has('state')) {
      const previousState = changedProperties.get('state');
      const wasUnlinking = previousState?.type === 'loaded' && previousState?.listState?.type === 'unlinking';
      const isNotUnlinking = this.state.type !== 'loaded' || this.state.listState.type !== 'unlinking';
      if (wasUnlinking && isNotUnlinking) {
        this._isUnlinkDialogOpen = false;
        this._networkGroupIdToUnlink = null;
      }
    }
  }

  render() {
    if (this.state.type === 'unsupported') {
      return html`
        <cc-notice intent="info" heading="${i18n('cc-network-group-list.unsupported-notice.heading')}">
          <div slot="message">
            ${i18n('cc-network-group-list.unsupported-notice.message', {
              addonMigrationScreenUrl: this.state.addonMigrationScreenUrl,
            })}
          </div>
        </cc-notice>
      `;
    }

    const isLoading = this.state.type === 'loading';
    const isError = this.state.type === 'error';
    const isLoaded = this.state.type === 'loaded';
    const linkFormState = this.state.type === 'loaded' ? this.state.linkFormState : null;
    const listState = this.state.type === 'loaded' ? this.state.listState : null;
    const isUnlinking = isLoaded && listState.type === 'unlinking';
    const selectOptions = this._getSelectOptions(this.state);

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.form.heading')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-network-group-list.form.description')}</p>
          ${isError
            ? html`<cc-notice intent="warning" message="${i18n('cc-network-group-list.form.error')}"></cc-notice>`
            : ''}
          ${isLoaded && linkFormState.type === 'empty'
            ? html`<cc-link
                class="link-create-network-group"
                mode="button"
                href="${linkFormState.networkGroupDashboardUrl}"
                ${ref(this._createNetworkGroupLinkRef)}
              >
                ${i18n('cc-network-group-list.create')}
              </cc-link>`
            : ''}
          ${isLoading || (isLoaded && (linkFormState.type === 'idle' || linkFormState.type === 'linking'))
            ? this._renderNetworkGroupLinkForm({
                selectOptions,
                isLoading,
                isLinking: isLoaded && linkFormState.type === 'linking',
                isDisabled: isLoaded && listState.type === 'unlinking',
              })
            : ''}
        </div>
        <cc-block-details slot="footer-left">
          <div slot="button-text">${i18n('cc-block-details.cli.text')}</div>
          <div slot="link">
            <cc-link href="${getDocUrl('/develop/network-groups')}">
              ${i18n('cc-network-group-list.form.documentation')}
            </cc-link>
          </div>
          <div slot="content">
            <p>
              ${i18n('cc-network-group-list.cli.content.intro')}
              ${i18n('cc-network-group-list.cli.content.instruction')}
            </p>
            <dl>
              <dt>${i18n('cc-network-group-list.cli.content.list-command')}</dt>
              <dd>
                <cc-code>clever ng --org ${this.ownerId}</cc-code>
              </dd>
              <dt>${i18n('cc-network-group-list.cli.content.create-command')}</dt>
              <dd>
                <cc-code>clever ng create --org ${this.ownerId} &lt;NG_LABEL&gt;</cc-code>
              </dd>
              <dt>${i18n('cc-network-group-list.cli.content.delete-command')}</dt>
              <dd>
                <cc-code>clever ng delete --org ${this.ownerId} &lt;NG_ID&gt;</cc-code>
              </dd>
              <dt>${i18n('cc-network-group-list.cli.content.link-command')}</dt>
              <dd>
                <cc-code>clever ng link --org ${this.ownerId} ${this.resourceId} &lt;NG_ID&gt;</cc-code>
              </dd>
              <dt>${i18n('cc-network-group-list.cli.content.unlink-command')}</dt>
              <dd>
                <cc-code>clever ng unlink --org ${this.ownerId} ${this.resourceId} &lt;NG_ID&gt;</cc-code>
              </dd>
            </dl>
          </div>
        </cc-block-details>
      </cc-block>

      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.list.heading')}</div>
        <div slot="content">
          ${isError
            ? html`<cc-notice intent="warning" message="${i18n('cc-network-group-list.list.error')}"></cc-notice>`
            : ''}
          ${isLoading ? html`<cc-loader></cc-loader>` : ''}
          ${isLoaded && (listState.type === 'loaded' || listState.type === 'unlinking')
            ? this._renderNetworkGroupList(listState.linkedNetworkGroupList, isUnlinking)
            : ''}
        </div>
        <div slot="footer-right">
          <cc-link href="${getDocUrl('/develop/network-groups')}">
            ${i18n('cc-network-group-list.form.documentation')}
          </cc-link>
        </div>
      </cc-block>

      ${this._renderUnlinkDialog(this._isUnlinkDialogOpen, isUnlinking)}
    `;
  }

  /**
   * @param {object} _
   * @param {Array<Option>} _.selectOptions
   * @param {boolean} _.isLoading
   * @param {boolean} _.isLinking
   * @param {boolean} _.isDisabled
   */
  _renderNetworkGroupLinkForm({ selectOptions, isLoading, isLinking, isDisabled }) {
    const sortedSelectOptions = selectOptions.toSorted((optionA, optionB) =>
      optionA.label.localeCompare(optionB.label),
    );
    const defaultValue = sortedSelectOptions.length > 0 ? sortedSelectOptions[0].value : nothing;

    return html`
      <form class="link-form" ${formSubmit(this._onLink.bind(this))}>
        <cc-select
          label="${i18n('cc-network-group-list.form.select-label')}"
          class="link-form__select"
          ?disabled="${isLoading || isLinking || isDisabled}"
          .options="${sortedSelectOptions}"
          name="network-group"
          .value="${defaultValue}"
        ></cc-select>
        <!-- Be careful, the button class is used by the LostFocusController to manage focus when the form disapears after linking the last network group available -->
        <cc-button
          class="link-form__submit"
          outlined
          primary
          type="submit"
          ?skeleton="${isLoading}"
          ?waiting="${isLinking}"
          ?disabled="${isDisabled}"
        >
          ${i18n('cc-network-group-list.form.button')}
        </cc-button>
      </form>
    `;
  }

  /**
   * @param {Array<NetworkGroup>} networkGroupList
   * @param {boolean} isUnlinking
   */
  _renderNetworkGroupList(networkGroupList, isUnlinking) {
    if (networkGroupList.length === 0) {
      return html`
        <div class="empty" tabindex="-1" ${ref(this._emptyListRef)}>
          <p>${i18n('cc-network-group-list.list.empty')}</p>
        </div>
      `;
    }

    const sortedNetworkGroupList = networkGroupList.toSorted((a, b) => a.name.localeCompare(b.name));

    return html`
      <div class="network-group-list">
        ${repeat(
          sortedNetworkGroupList,
          (networkGroup) => networkGroup.id,
          (networkGroup) => html`
            <div class="network-group-card">
              <div class="network-group-card__header">
                <div class="network-group-card__header__heading">
                  <cc-img
                    class="network-group-card__header__heading__img"
                    src="${getAssetUrl('/logos/network-group.svg')}"
                  ></cc-img>
                  <span>${networkGroup.name}</span>
                </div>
              </div>
              <div class="network-group-card__id">
                <span>${networkGroup.id}</span>
                <cc-clipboard value="${networkGroup.id}"></cc-clipboard>
              </div>
              <div class="peer-list">
                ${networkGroup.peerList.map(
                  (peer) => html`<cc-network-group-peer-card .peer="${peer}"></cc-network-group-peer-card>`,
                )}
              </div>
              <div class="network-group-card__footer">
                <div class="network-group-card__footer__link">
                  <cc-link href="${networkGroup.dashboardUrl}">
                    <span>${i18n('cc-network-group-list.list.dashboard-link')}</span>
                  </cc-link>
                  <cc-icon .icon="${iconLink}"></cc-icon>
                </div>
                <!-- Be careful, the button class is used by the LostFocusController to manage focus when the form disapears after linking the last network group available -->
                <cc-button
                  class="unlink-btn"
                  danger
                  outlined
                  ?disabled="${isUnlinking && this._networkGroupIdToUnlink !== networkGroup.id}"
                  ?waiting="${isUnlinking && this._networkGroupIdToUnlink === networkGroup.id}"
                  a11y-name="${i18n('cc-network-group-list.list.unlink.a11y-name', { name: networkGroup.name })}"
                  @cc-click="${() => this._onUnlinkRequest(networkGroup.id)}"
                >
                  ${i18n('cc-network-group-list.list.unlink')}
                </cc-button>
              </div>
            </div>
          `,
        )}
      </div>
    `;
  }

  /**
   * @param {boolean} isOpen
   * @param {boolean} isUnlinking
   */
  _renderUnlinkDialog(isOpen, isUnlinking) {
    return html`
      <cc-dialog
        ?open="${isOpen}"
        heading="${i18n('cc-network-group-list.unlink.dialog.heading')}"
        @cc-close="${this._onDialogClose}"
      >
        <p>${i18n('cc-network-group-list.unlink.dialog.desc')}</p>
        <cc-dialog-confirm-actions
          submit-intent="danger"
          submit-label="${i18n('cc-network-group-list.unlink.dialog.unlink-btn')}"
          ?waiting="${isUnlinking}"
          @cc-confirm="${this._onDialogConfirm}"
        ></cc-dialog-confirm-actions>
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      cliCommandsStyles,
      css`
        :host {
          container: host / inline-size;
          display: grid;
          gap: var(--cc-spacing-5, 1em);
        }

        cc-loader {
          margin-top: var(--cc-spacing-8, 2em);
        }

        .intro {
          margin-top: 0;
        }

        .empty {
          border: 1px solid var(--cc-color-border-neutral-weak);
          display: grid;
          font-weight: bold;
          gap: var(--cc-spacing-7, 1.5em);
          justify-items: center;
          padding: var(--cc-spacing-5, 1em);
        }

        @container host (max-width: 34.375em) {
          .link-create-network-group {
            width: 100%;
          }
        }

        .link-form {
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-5, 1em);
        }

        .link-form__select {
          flex: 100 1 20em;
        }

        .link-form__submit {
          flex: 1 1 auto;
        }

        .network-group-list {
          display: grid;
          gap: var(--cc-spacing-5, 1em);
        }

        .network-group-card {
          border: solid 1px var(--cc-color-border-neutral-weak, #ccc);
          border-radius: var(--cc-border-radius-medium, 0.375em);
          padding: var(--cc-spacing-5, 1em);
        }

        .network-group-card__header {
          display: flex;
          flex-wrap: wrap;
          gap: var(--cc-spacing-3, 0.5em);
          justify-content: space-between;
          margin-bottom: var(--cc-spacing-5, 1em);
        }

        .network-group-card__header__heading {
          align-items: center;
          display: flex;
          font-weight: bold;
          gap: var(--cc-spacing-3, 0.5em);
        }

        .network-group-card__header__heading__img {
          background-color: var(--cc-color-bg-neutral-alt);
          border-radius: var(--cc-border-radius-small, 0.25em);
          height: 1.375em;
          width: 1.375em;
        }

        .network-group-card__id {
          color: var(--cc-color-text-weak);
          font-style: italic;
          margin-bottom: var(--cc-spacing-5, 1em);
        }

        .network-group-card__id cc-clipboard {
          display: inline-block;
          vertical-align: middle;
        }

        .peer-list {
          display: grid;
          gap: var(--cc-spacing-3, 0.5em);
        }

        .network-group-card__footer {
          align-items: center;
          display: flex;
          justify-content: space-between;
          margin-top: var(--cc-spacing-5, 1em);
        }

        .network-group-card__footer__link {
          align-items: center;
          color: var(--cc-color-text-primary-highlight);
          display: flex;
          gap: var(--cc-spacing-1, 0.25em);
        }

        cc-dialog p {
          margin: 0;
        }

        @container host (max-width: 35em) {
          .network-group-card__footer {
            align-items: flex-start;
            flex-direction: column;
            gap: var(--cc-spacing-5, 1em);
          }

          .unlink-btn {
            width: 100%;
          }
        }
      `,
    ];
  }
}

window.customElements.define('cc-network-group-list', CcNetworkGroupList);
