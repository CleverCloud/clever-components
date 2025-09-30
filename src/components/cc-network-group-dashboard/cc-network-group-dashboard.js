import { css, html, LitElement } from 'lit';
import { getAssetUrl } from '../../lib/assets-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../lib/i18n/i18n.js';
import '../cc-addon-header/cc-addon-header.js';
import '../cc-addon-info/cc-addon-info.js';
import '../cc-button/cc-button.js';
import '../cc-dialog-confirm-form/cc-dialog-confirm-form.js';
import '../cc-dialog/cc-dialog.js';
import { CcNetworkGroupDeleteEvent } from './cc-network-group-dashboard.events.js';

/**
 * @import { NetworkGroupDashboardState } from './cc-network-group-dashboard.types.js'
 * @import { PropertyValues } from 'lit'
 */

const SKELETON_HEADER_STATE = {
  type: 'loading',
  name: fakeString(10),
  id: fakeString(10),
  providerId: 'network-group',
  // FIXME: upload NG logo and use real logo URL
  providerLogoUrl: getAssetUrl('logos/clever-cloud.svg'),
};

const SKELETON_INFO_STATE = {
  type: 'loading',
  creationDate: '2025-08-06 15:03:00',
  description: fakeString(40),
  subnet: fakeString(6),
  lastIp: fakeString(6),
  numberOfMembers: 0,
  numberOfPeers: 0,
};

/**
 * A component to display various info about an add-on (name, plan, version...).
 *
 * @cssdisplay block
 */
export class CcNetworkGroupDashboard extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
      _isDeleteConfirmPending: { type: Boolean, state: true },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupDashboardState} Sets the danger zone state */
    this.state = { type: 'loading' };

    /** @type {boolean} Whether the delete confirmation dialog is open */
    this._isDeleteConfirmPending = false;
  }

  _onDeleteRequest() {
    this._isDeleteConfirmPending = true;
  }

  _onDeleteConfirmClose() {
    this._isDeleteConfirmPending = false;
  }

  _onDeleteConfirm() {
    if (this.state.type !== 'loaded') {
      return;
    }
    this.dispatchEvent(new CcNetworkGroupDeleteEvent(this.state.id));
  }

  /** @param {PropertyValues<CcNetworkGroupDashboard>} changedProperties */
  willUpdate(changedProperties) {
    const wasDeleting = changedProperties.get('state')?.type === 'deleting';
    const isNotDeleting = this.state.type !== 'deleting';
    if (wasDeleting && isNotDeleting) {
      // Reset the delete confirmation form when closing the dialog
      this._isDeleteConfirmPending = false;
    }
  }

  render() {
    if (this.state.type === 'error') {
      return html`
        <cc-notice intent="warning" message="${i18n('cc-network-group-dashboard.danger-zone.error')}"></cc-notice>
      `;
    }

    const headerState =
      this.state.type === 'loaded' || this.state.type === 'deleting'
        ? {
            type: this.state.type,
            name: this.state.name,
            id: this.state.id,
            providerId: 'network-group',
            providerLogoUrl: getAssetUrl('logos/node.svg'),
          }
        : SKELETON_HEADER_STATE;

    const infoState =
      this.state.type === 'loaded' || this.state.type === 'deleting'
        ? {
            type: this.state.type,
            creationDate: this.state.creationDate,
            description: this.state.description,
            subnet: this.state.subnet,
            lastIp: this.state.lastIp,
            numberOfMembers: this.state.numberOfMembers,
            numberOfPeers: this.state.numberOfPeers,
            tags: this.state.tags,
          }
        : SKELETON_INFO_STATE;

    return html`
      <cc-addon-header .state="${headerState}"></cc-addon-header>
      <cc-addon-info .state="${infoState}"></cc-addon-info>
      <cc-block>
        <div class="danger-zone__heading" slot="header-title">
          ${i18n('cc-network-group-dashboard.danger-zone.heading')}
        </div>
        <div class="danger-zone__content" slot="content">
          <p class="danger-zone__content__desc">${i18n('cc-network-group-dashboard.danger-zone.desc')}</p>
          <cc-button
            class="danger-zone__content__btn"
            danger
            @cc-click="${this._onDeleteRequest}"
            ?skeleton="${this.state.type === 'loading'}"
          >
            ${i18n('cc-network-group-dashboard.danger-zone.btn')}
          </cc-button>
        </div>
      </cc-block>
      <cc-dialog
        ?open="${this._isDeleteConfirmPending}"
        heading="${i18n('cc-network-group-dashboard.danger-zone.dialog.heading')}"
        @cc-close="${this._onDeleteConfirmClose}"
      >
        <p>${i18n('cc-network-group-dashboard.danger-zone.dialog.desc')}</p>
        <cc-dialog-confirm-form
          confirm-text-to-input="${this.state.type === 'loaded' ? this.state.name : ''}"
          confirm-input-label="${i18n('cc-network-group-dashboard.danger-zone.dialog.confirm-input-label')}"
          submit-intent="danger"
          submit-label="${i18n('cc-network-group-dashboard.danger-zone.btn')}"
          ?waiting="${this.state.type === 'deleting'}"
          @cc-confirm="${this._onDeleteConfirm}"
        ></cc-dialog-confirm-form>
      </cc-dialog>
    `;
  }

  static get styles() {
    return [
      css`
        :host {
          container-type: inline-size;
          display: grid;
          gap: 1.5em;
        }

        .danger-zone__heading {
          color: var(--cc-color-text-danger);
        }

        .danger-zone__content {
          align-items: baseline;
          column-gap: 4em;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .danger-zone__content__desc {
          flex: 1 1 33em;
        }

        .danger-zone__content__btn {
          flex: 0 1 fit-content;
        }

        /* TODO: exact break point */
        @container (max-width: 26em) {
          .danger-zone__content__btn {
            flex-basis: 100%;
          }
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-dashboard', CcNetworkGroupDashboard);
