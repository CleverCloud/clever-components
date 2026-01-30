import { css, html, LitElement, nothing } from 'lit';
import { iconRemixArrowRightLine as iconLink } from '../../assets/cc-remix.icons.js';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-clipboard/cc-clipboard.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-network-group-peer-card/cc-network-group-peer-card.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';
import { CcNetworkGroupLinkEvent } from './cc-network-group-list.events.js';

/**
 * @import { NetworkGroupListState, NetworkGroupLinkFormState, NetworkGroup } from './cc-network-group-list.types.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
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
      linkFormState: { type: Object, attribute: 'link-form-state' },
      listState: { type: Object, attribute: 'list-state' },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupLinkFormState} Sets the state of the form */
    this.linkFormState = { type: 'loading' };

    /** @type {NetworkGroupListState} Sets the state of the list */
    this.listState = { type: 'loading' };
  }

  /** @param {{ 'network-group': string }} formData */
  _onLink(formData) {
    this.dispatchEvent(new CcNetworkGroupLinkEvent(formData['network-group']));
  }

  render() {
    const selectOptions =
      this.linkFormState.type === 'idle' || this.linkFormState.type === 'linking'
        ? this.linkFormState.selectOptions
        : [];

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.form.heading')}</div>
        <div slot="content">
          <p class="intro">${i18n('cc-network-group-list.form.description')}</p>
          ${this.linkFormState.type === 'error'
            ? html`<cc-notice intent="warning" message="${i18n('cc-network-group-list.form.error')}"></cc-notice>`
            : ''}
          ${this.linkFormState.type !== 'error'
            ? this._renderNetworkGroupLinkForm({
                selectOptions,
                isLoading: this.linkFormState.type === 'loading',
                isLinking: this.linkFormState.type === 'linking',
              })
            : ''}
        </div>
        <div slot="footer-right">
          <cc-link href="${getDocUrl('/develop/network-groups')}">
            ${i18n('cc-network-group-list.form.documentation')}
          </cc-link>
        </div>
      </cc-block>

      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.list.heading')}</div>
        <div slot="content">
          ${this.listState.type === 'error'
            ? html`<cc-notice intent="warning" message="${i18n('cc-network-group-list.list.error')}"></cc-notice>`
            : ''}
          ${this.listState.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
          ${this.listState.type === 'loaded' ? this._renderNetworkGroupList(this.listState.linkedNetworkGroupList) : ''}
        </div>
        <div slot="footer-right">
          <cc-link href="${getDocUrl('/develop/network-groups')}">
            ${i18n('cc-network-group-list.form.documentation')}
          </cc-link>
        </div>
      </cc-block>
    `;
  }

  /**
   * @param {object} _
   * @param {Array<Option>} _.selectOptions
   * @param {boolean} _.isLoading
   * @param {boolean} _.isLinking
   */
  _renderNetworkGroupLinkForm({ selectOptions, isLoading, isLinking }) {
    const sortedSelectOptions = selectOptions.sort((optionA, optionB) => optionA.label.localeCompare(optionB.label));
    const defaultValue = selectOptions[0]?.value ?? nothing;

    if (!isLoading && !isLinking && selectOptions.length === 0) {
      return html`<cc-link mode="button">${i18n('cc-network-group-list.create')}</cc-link>`;
    }

    return html`
      <form class="link-form" ${formSubmit(this._onLink.bind(this))}>
        <cc-select
          label="${i18n('cc-network-group-list.form.select-label')}"
          class="link-form__select"
          ?disabled="${isLoading || isLinking}"
          .options="${sortedSelectOptions}"
          name="network-group"
          .value="${defaultValue}"
        ></cc-select>
        <cc-button
          class="link-form__submit"
          outlined
          primary
          type="submit"
          ?skeleton="${isLoading}"
          ?waiting="${isLinking}"
        >
          ${i18n('cc-network-group-list.form.button')}
        </cc-button>
      </form>
    `;
  }

  /** @param {Array<NetworkGroup>} networkGroupList */
  _renderNetworkGroupList(networkGroupList) {
    if (networkGroupList.length === 0) {
      return html`
        <div class="empty">
          <p>${i18n('cc-network-group-list.list.empty')}</p>
        </div>
      `;
    }

    return html`
      <div class="network-group-list">
        ${networkGroupList.map((networkGroup) => this._renderNetworkGroupCard(networkGroup))}
      </div>
    `;
  }

  /** @param {NetworkGroup} networkGroup */
  _renderNetworkGroupCard(networkGroup) {
    return html`
      <div class="network-group-card">
        <div class="network-group-card__header">
          <div class="network-group-card__header__heading">
            <cc-img class="network-group-card__header_heading__img" src="${getAssetUrl('/logos/nodejs.svg')}"></cc-img>
            <span>${networkGroup.name}</span>
          </div>
          <div class="network-group-card__header__link">
            <cc-link href="${networkGroup.dashboardUrl}">
              <span>${i18n('cc-network-group-list.list.dashboard-link')}</span>
            </cc-link>
            <cc-icon .icon="${iconLink}"></cc-icon>
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
      </div>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          display: grid;
          gap: 1em;
        }

        cc-loader {
          margin-top: 2em;
        }

        .intro {
          margin-top: 0;
        }

        .empty {
          border: 1px solid var(--cc-color-border-neutral-weak);
          display: grid;
          font-weight: bold;
          gap: 1.5em;
          justify-items: center;
          padding: 1em;
        }

        .link-form {
          align-items: end;
          display: flex;
          flex-wrap: wrap;
          gap: 1em;
        }

        .link-form__select {
          flex: 100 1 20em;
        }

        .link-form__submit {
          flex: 1 1 auto;
        }

        .network-group-list {
          display: grid;
          gap: 1em;
        }

        .network-group-card {
          border: solid 1px var(--cc-color-border-neutral-weak, #ccc);
          border-radius: var(--cc-border-radius-default, 0.25em);
          padding: 1em;
        }

        .network-group-card__header {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5em;
          justify-content: space-between;
          margin-bottom: 1em;
        }

        .network-group-card__header__heading {
          align-items: center;
          display: flex;
          font-weight: bold;
          gap: 0.5em;
        }

        .network-group-card__header_heading__img {
          border-radius: var(--cc-border-radius-default, 0.25em);
          height: 1.375em;
          width: 1.375em;
        }

        .network-group-card__header__link {
          align-items: center;
          color: var(--cc-color-text-primary-highlight);
          display: flex;
          gap: 0.25em;
        }

        .network-group-card__id {
          color: var(--cc-color-text-weak);
          font-style: italic;
          margin-bottom: 1em;
        }

        .network-group-card__id cc-clipboard {
          display: inline-block;
          vertical-align: middle;
        }

        .peer-list {
          display: grid;
          gap: 0.5em;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-list', CcNetworkGroupList);
