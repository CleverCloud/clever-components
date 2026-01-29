import { css, html, LitElement } from 'lit';
import { getAssetUrl } from '../../lib/assets-url.js';
import { getDocUrl } from '../../lib/dev-hub-url.js';
import { fakeString } from '../../lib/fake-strings.js';
import { i18n } from '../../translations/translation.js';
import '../cc-addon-header/cc-addon-header.js';
import '../cc-addon-info/cc-addon-info.js';
import '../cc-block-details/cc-block-details.js';
import '../cc-button/cc-button.js';
import '../cc-code/cc-code.js';
import '../cc-dialog-confirm-form/cc-dialog-confirm-form.js';
import '../cc-dialog/cc-dialog.js';
import { CcNetworkGroupDeleteEvent } from './cc-network-group-dashboard.events.js';

/**
 * @import { NetworkGroupDashboardState } from './cc-network-group-dashboard.types.js'
 * @import { PropertyValues } from 'lit'
 */

const SKELETON_HEADER_STATE = {
  type: /** @type {const} */ ('loading'),
  name: fakeString(10),
  id: fakeString(10),
  providerId: 'network-group',
  providerLogoUrl: getAssetUrl('logos/network-group.svg'),
};

const SKELETON_INFO_STATE = {
  type: /** @type {const} */ ('loading'),
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

  /**
   * Returns the header state object for <cc-addon-header>.
   * @param {NetworkGroupDashboardState} state
   * @private
   */
  _getHeaderState(state) {
    if (state.type === 'loaded' || state.type === 'deleting') {
      return {
        type: state.type,
        name: state.name,
        id: state.id,
        providerId: 'network-group',
        providerLogoUrl: getAssetUrl('logos/network-group.svg'),
      };
    }
    return SKELETON_HEADER_STATE;
  }

  /**
   * Returns the info state object for <cc-addon-info>.
   * @param {NetworkGroupDashboardState} state
   * @private
   */
  _getInfoState(state) {
    if (state.type === 'loaded' || state.type === 'deleting') {
      return {
        type: state.type,
        subnet: state.subnet,
        lastIp: state.lastIp,
        numberOfMembers: state.numberOfMembers,
        numberOfPeers: state.numberOfPeers,
      };
    }
    return SKELETON_INFO_STATE;
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

    const headerState = this._getHeaderState(this.state);
    const infoState = this._getInfoState(this.state);
    const docLink = {
      href: getDocUrl('/administrate/network-groups'),
      text: i18n('cc-network-group-dashboard.doc-link.text'),
    };

    return html`
      <cc-addon-header .state="${headerState}"></cc-addon-header>
      <cc-addon-info .state="${infoState}" .docLink="${docLink}"></cc-addon-info>
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
