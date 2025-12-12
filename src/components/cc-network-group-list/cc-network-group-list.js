import { css, html, LitElement } from 'lit';
import { getDevHubUrl } from '../../lib/dev-hub-url.js';
import { formSubmit } from '../../lib/form/form-submit-directive.js';
import { i18n } from '../../translations/translation.js';
import '../cc-block/cc-block.js';
import '../cc-button/cc-button.js';
import '../cc-link/cc-link.js';
import '../cc-loader/cc-loader.js';
import '../cc-notice/cc-notice.js';
import '../cc-select/cc-select.js';

/**
 * @import { NetworkGroupListState, NetworkGroup } from './cc-network-group-list.types.js'
 * @import { Option } from '../cc-select/cc-select.types.js'
 * @import { FormDataMap } from '../../lib/form/form.types.js'
 */

export class CcNetworkGroupList extends LitElement {
  static get properties() {
    return {
      state: { type: Object },
    };
  }

  constructor() {
    super();

    /** @type {NetworkGroupListState} Sets the state of the component */
    this.state = { type: 'loading' };
  }

  /** @param {FormDataMap} formData */
  _onLink(formData) {
    // TODO dispatch
  }

  render() {
    if (this.state.type === 'error') {
      return html`<cc-notice intent="warning" message="${i18n('cc-network-group-list.error')}"></cc-notice>`;
    }

    /** @type {Array<Option>} */
    const selectOptions =
      this.state.type === 'loaded' && this.state.networkGroupList.length > 0
        ? this.state.networkGroupList.map((ng) => ({ label: ng.name, value: ng.id }))
        : [];
    const isLoading = this.state.type === 'loading';

    return html`
      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.link.heading')}</div>
        <div slot="content">
          <p>${i18n('cc-network-group-list.link.description')}</p>
          <form class="link-form" ${formSubmit(this._onLink.bind(this))}>
            <cc-select ?disabled="${isLoading}" .options="${selectOptions}" name="network-group"></cc-select>
            <cc-button outlined primary type="submit" ?skeleton=${isLoading}>
              ${i18n('cc-network-group-list.link.button')}
            </cc-button>
          </form>
        </div>
        <div slot="footer-right">
          <cc-link href="${getDevHubUrl('/cli/network-groups')}">
            ${i18n('cc-network-group-list.link.documentation')}
          </cc-link>
        </div>
      </cc-block>

      <cc-block>
        <div slot="header-title">${i18n('cc-network-group-list.list.heading')}</div>
        <div slot="content">
          ${this.state.type === 'loading' ? html`<cc-loader></cc-loader>` : ''}
          ${this.state.type === 'loaded' && this.state.networkGroupList.length === 0 ? html`` : ''}
          ${this.state.type === 'loaded' && this.state.networkGroupList.length > 0 ? this.state.networkGroupList.map((networkGroup) => this._renderNetworkGroupCard(networkGroup))}
        </div>
      </cc-block>
    `;
  }

  /** @param {NetworkGroup} networkGroup */
  _renderNetworkGroupCard(networkGroup) {
    return html``;
  }

  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
}

customElements.define('cc-network-group-list', CcNetworkGroupList);
